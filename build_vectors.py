# build_vectors.py
import json, sys, numpy as np
from sentence_transformers import SentenceTransformer

MODEL = "sentence-transformers/all-MiniLM-L6-v2"  # 384-dim, nhẹ, nhanh
kb = json.load(open("data/kb_advanced.json", encoding="utf-8"))

m = SentenceTransformer(MODEL)
texts = [f"{d.get('title','')} | {d.get('text','')}" for d in kb]
vecs = m.encode(texts, normalize_embeddings=True)  # shape: (N, 384)

out = [{"id": d["id"], "vec": v.tolist()} for d, v in zip(kb, vecs)]
sys.stdout.flush()
json.dump(out, open("data/kb_vectors.json","w",encoding="utf-8"), ensure_ascii=False)
print("OK:", len(out), "vectors")
