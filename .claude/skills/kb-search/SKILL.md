---
name: kb-search
description: Tra cứu knowledge base UA marketing của repo (knowledge/). Dùng khi cần biết đã có kiến thức, bài học, playbook, số liệu, quyết định hay hồ sơ app nào về một chủ đề — trước khi trả lời câu hỏi chuyên môn, trước khi setup campaign, đọc data, hoặc trước khi nạp knowledge mới.
---

# kb-search — tra knowledge

1. `knowledge/INDEX.md` đã được nạp vào context qua CLAUDE.md: mỗi dòng là 1 tài liệu + tóm tắt. Xem nó trước.
2. Tìm full-text (có/không dấu đều được): `node scripts/kb/cli.mjs search "<từ khoá>" --limit 10`.
3. Mở các file liên quan bằng Read (đường dẫn trong `knowledge/`). Đi theo field `related` để đọc bài liên quan.
4. Khi trả lời user, dựa trên knowledge và **trích file nguồn** (`knowledge/...`). Ưu tiên bài `verified`; nói rõ nếu chỉ có `draft` hoặc `confidence: low`; bỏ qua bài `outdated` trừ khi để so sánh.
5. Không có trong knowledge → nói rõ là kiến thức chung/ngoài knowledge. Nếu tìm được điều mới đáng giữ → dùng skill kb-capture.
