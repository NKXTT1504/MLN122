# Phụ lục AI Usage – Fischer, Hornkohl & Imgarten (2025), European Papers

**Nguồn chính thống:** Eva Fischer, Lena Hornkohl, Nils Imgarten (2025), *European Papers – A Journal on Law and Integration*, Vol.10(1), tr. 25–44 –
“Discriminatory Leveraging Plus: The Standard for Independent Self-Preferencing Abuses after Google Shopping (C-48/22 P)”.

**Công cụ sử dụng:**
- ChatGPT: trích văn bản từ PDF do bạn cung cấp, chuẩn hoá thành tập dữ liệu RAG tiếng Việt (JSON).
- Không dùng web search; dựa 100% vào nội dung trong file PDF.
- Không gọi API embedding ở bước biên soạn.

**Mục đích:** Tạo **một file KB riêng** cho bài nghiên cứu, phục vụ RAG Hybrid (BM25 + semantic) và minh bạch hoá việc sử dụng AI theo yêu cầu môn học.

**Prompt chính (rút gọn):** “Đọc bài European Papers (2025) về self-preferencing sau Google Shopping; tách 10–14 mục KB tiếng Việt (id/title/tags/text/answer/source), nêu rõ: Bronner không áp dụng, tiêu chuẩn ‘discriminatory leveraging plus’, effects & circumstances, burden/counterfactual, AEC, liên hệ DMA, kết luận.”

**Kết quả sinh:** `kb_research_fischer_hornkohl_imgarten_2025.json` gồm 13 mục.

**Phần sinh viên cần kiểm chứng/chỉnh sửa:**
- Đối chiếu câu chữ và trích dẫn án lệ (C-48/22 P; T‑612/17; TeliaSonera; Slovak Telekom; Bronner; Intel Renvoi) trong bài gốc.
- Nếu trích điều khoản: **Điều 102 TFEU**, **DMA art.6(5)**, giải thích đúng bối cảnh “gatekeeper”.
- Bổ sung liên hệ **Giáo trình LLCT – Ch.4**: độc quyền, tư bản tài chính, phân chia thị trường; và các chỉ số (HHI/CR4) khi minh hoạ.

**Cam kết liêm chính:** Tệp này chỉ chuẩn hoá nội dung từ bài nghiên cứu; không thay thế phân tích của sinh viên. Nhóm chịu trách nhiệm cuối cùng và đối chiếu nguồn chính thống.
