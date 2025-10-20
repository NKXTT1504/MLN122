# Phụ lục AI Usage – Case Shopee Việt Nam (2019–2021)

**Nguồn tài liệu:** Bài tập lớn môn Kinh tế Chính trị Mác–Lênin (NEU), đề tài về quy luật cạnh tranh và Shopee Việt Nam 2019–2021 (PDF bạn cung cấp).

**Công cụ trợ giúp:**
- ChatGPT: trích văn bản từ PDF, chuẩn hoá thành mục tri thức (id/title/tags/text/answer/source) bằng tiếng Việt.
- Không dùng trình duyệt/web search; chỉ sử dụng nội dung trong file PDF.
- Không dùng API embedding trong bước biên soạn.

**Mục đích:** Tạo tập dữ liệu RAG phục vụ truy xuất về case Shopee, phù hợp tiêu chí minh bạch – có trách nhiệm – sáng tạo – liêm chính học thuật.

**Prompt chính (rút gọn):** “Đọc PDF case Shopee VN 2019–2021 và chuyển thành nhiều mục KB tiếng Việt: mỗi mục có id/title/tags/text/answer/source, không bịa, bám nội dung gốc; gắn tag theo chủ đề (market_share, pricing, mobile_first, logistics, payment, marketing, competitor…).”

**Kết quả sinh:** `kb_case_shopee_vn_2019_2021.json` gồm 35 mục.

**Phần cần sinh viên tự chỉnh sửa/đối chiếu:**
- Kiểm tra số liệu (GMV, lượt truy cập, thứ hạng iPrice/App Annie) với nguồn gốc được tác giả trích (nếu có).
- Bổ sung liên hệ lý thuyết (Hiệu ứng mạng, lock-in, chỉ số HHI/CR4) và đối chiếu với giáo trình LLCT/Ch.4.
- Ghi rõ các trích dẫn thứ cấp mà bài viết tham khảo (Tạp chí Cộng sản, iPrice, Sách trắng TMĐT…).

**Cam kết liêm chính:** File chỉ chuẩn hoá nội dung từ tài liệu học thuật/sinh viên; không thay thế phân tích độc lập. Trách nhiệm nội dung cuối cùng thuộc nhóm.
