import json
from underthesea import word_tokenize

IN  = "data/kb_advanced.json"
OUT = "data/kb_advanced_tok.json"

with open(IN, "r", encoding="utf-8") as f:
    kb = json.load(f)

for d in kb:
    text = (d.get("title","") + " " + d.get("text","")).strip()
    # tách từ + giữ dấu, nối bằng dấu gạch dưới để BM25 coi như 1 token
    toks = word_tokenize(text, format="text").replace(" ", "_").split("_")
    # Lưu token đã tách vào field mới
    d["tokens_vi"] = [t.lower() for t in toks if len(t) > 1]

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(kb, f, ensure_ascii=False)
print("Done:", OUT)
