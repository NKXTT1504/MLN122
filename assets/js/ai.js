class ChatAI {
  constructor() {
    this.kb = [];
    this.vectors = new Map(); 
    this.weights = { bm25: 0.7, sem: 0.3 };
    this._qCache = new Map();
  }

  async load() {
    // 1) tri thức
    this.kb = await (await fetch("data/kb_advanced_tok.json")).json();

    this.index = [];
    for (const d of this.kb) {
      const toks = Array.isArray(d.tokens_vi) && d.tokens_vi.length
        ? d.tokens_vi
        : this.tokenize((d.title || "") + " " + (d.text || ""));
      this.index.push(toks);
    }
    this.buildBM25(this.index);
    console.log("Knowledge base loaded (" + this.kb.length + " mục)");

    // 2) vectors
    const vecJson = await fetch('data/kb_vectors.json').then(r=>r.json());
    for (const {id, vec} of vecJson) this.vectors.set(id, new Float32Array(vec));
    console.log("KB:", this.kb.length, " | Vecs:", this.vectors.size);  
  }

  async embedQuery(q) {
    if (this._qCache.has(q)) return this._qCache.get(q);
    try {
      const res = await fetch(
        'https://nodejs-serverless-function-express-five-xi-43.vercel.app/api/embed', 
        {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ text: q })
      });
      if (!res.ok) throw new Error(`Embed HTTP ${res.status}`);
      const { embedding } = await res.json();
      if (!embedding || !embedding.length) throw new Error("Empty embedding");

      const vec = new Float32Array(embedding);
      // normalize L2
      let norm = 0; for (let x of vec) norm += x*x; norm = Math.sqrt(norm)||1;
      for (let i=0;i<vec.length;i++) vec[i] /= norm;

      this._qCache.set(q, vec);
      return vec;
    } catch (e) {
      console.warn("Embed failed → fallback BM25-only:", e.message || e);
      return null; 
    }
  }


  cosine(a, b) { // a,b: Float32Array normalized
    let s=0; for (let i=0;i<a.length;i++) s += a[i]*b[i]; return s;
  }

  buildBM25() {
    if (!this.kb || this.kb.length === 0) return console.warn("Không có tri thức nào để lập chỉ mục.");
    const docs = this.kb.map(d => (d.title + ' ' + d.text + ' ' + (d.tags || []).join(' ')));
    const tokens = docs.map(t => this.tokenize(t));
    const N = tokens.length;
    const df = new Map(), lens = [];

    tokens.forEach(ts => {
      lens.push(ts.length);
      const seen = new Set();
      ts.forEach(t => {
        if (!seen.has(t)) df.set(t, (df.get(t) || 0) + 1);
        seen.add(t);
      });
    });

    this.index = { tokens, df, N, avgdl: lens.reduce((a,b)=>a+b,0)/N };
    console.log(`BM25 index built: ${N} documents, avgdl=${this.index.avgdl.toFixed(2)}`);
  }

  tokenize(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(/\s+/).filter(w => w.length>2);
  }

  bm25Score(qTokens, i) {
    const { tokens, df, N, avgdl } = this.index;
    const dl = tokens[i].length, freq = new Map();
    tokens[i].forEach(t => freq.set(t, (freq.get(t) || 0)+1));
    const k1=1.2, b=0.75;
    let score=0;
    qTokens.forEach(q=>{
      const f=freq.get(q)||0, n_q=df.get(q)||0;
      if(n_q===0)return;
      const idf=Math.log((N-n_q+0.5)/(n_q+0.5)+1);
      score+=idf*((f*(k1+1))/(f+k1*(1-b+b*(dl/avgdl))));
    });
    return score;
  }

  mmrSelect(candidates, k=3, lambda=0.7) {
    const selected = [];
    const remain = candidates.slice();
    while (selected.length < k && remain.length) {
      let best = null, bestScore = -Infinity;
      for (const c of remain) {
        const penalty = selected.length
          ? Math.max(...selected.map(s => this.cosine(c.vec, s.vec)))
          : 0;
        const mmr = lambda * c.score - (1 - lambda) * penalty;
        if (mmr > bestScore) { bestScore = mmr; best = c; }
      }
      selected.push(best);
      const idx = remain.indexOf(best);
      if (idx >= 0) remain.splice(idx,1);
    }
    return selected;
  }

  retrieve(q, topK=3) {
    const qTokens=this.tokenize(q);
    const scored=this.kb.map((d,i)=>({d,s:this.bm25Score(qTokens,i)}));
    scored.sort((a,b)=>b.s-a.s);
    return scored.slice(0,topK);
  }

  // --- Hybrid retrieve ---
  async retrieveHybrid(q, topK = 2, tag = null) {
    const qTokens = this.tokenize(q);
    const semVec = this.vectors.size ? await this.embedQuery(q) : null;
    let pool = this.kb;
    if (tag) pool = pool.filter(d => (d.tags || []).includes(tag));

    // --- BM25 ---
    const bm = pool.map((d, i) => ({
      i,
      id: d.id,
      bm: this.bm25Score(qTokens, i),
      d
    }));

    // --- Semantic cosine ---
    const scored = [];
    for (const r of bm) {
      const v = this.vectors.get(r.id);
      const sem = (semVec && v) ? this.cosine(semVec, v) : 0;
      scored.push({ ...r, sem });
    }

    // --- RRF (Reciprocal Rank Fusion) ---
    const bmSorted = [...bm].sort((a, b) => b.bm - a.bm);
    const rankBM = new Map();
    bmSorted.forEach((r, idx) => rankBM.set(r.id, idx + 1));

    const semSorted = [...scored].sort((a, b) => b.sem - a.sem);
    const rankSem = new Map();
    semSorted.forEach((r, idx) => rankSem.set(r.id, idx + 1));

    const K = 60;
    const fuseMap = new Map();
    for (const r of bm) {
      const rb = rankBM.get(r.id) ?? 1e6;
      const rs = rankSem.get(r.id) ?? 1e6;
      const score = 1 / (K + rb) + 1 / (K + rs);
      fuseMap.set(r.id, { id: r.id, d: r.d, score, vec: this.vectors.get(r.id) });
    }

    let fused = Array.from(fuseMap.values()).sort((a, b) => b.score - a.score);

    // --- MMR ---
    const withVec = fused.filter(x => x.vec);
    const useMMR = topK >= 3;
    const picked = useMMR
      ? this.mmrSelect(withVec, topK, 0.7)
      : withVec.slice(0, topK);

    return picked.map(x => x.d);
  }


  summarize(hits) {
    return hits.map(h => {
      const id = h.id || h.title || 'kb_item';
      const t  = h.text.replace(/\s+/g,' ').trim();
      return `[${id}] ${t}`;
    }).join('\n\n');
  }  
}

window.ChatAI = ChatAI;
