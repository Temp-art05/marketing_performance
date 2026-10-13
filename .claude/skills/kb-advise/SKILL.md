---
name: kb-advise
description: Rà knowledge base để đưa ra gợi ý hành động cho UA marketing — việc nên làm tiếp, mốc đến hạn, rủi ro, bài học áp dụng được, chỗ knowledge còn yếu. Dùng khi user hỏi "nên làm gì tiếp", "review app X / campaign Y", "có gì cần chú ý", "tuần này làm gì", "đánh giá tình hình", hoặc khi bắt đầu một việc lớn (launch, scale, đổi chiến lược) cho một app.
---

# kb-advise — gợi ý từ knowledge

1. **Thu thập**
   - `node scripts/kb/cli.mjs doctor` — mốc đến hạn/sắp tới, draft chờ duyệt, mâu thuẫn, chỗ độ tin cậy thấp.
   - `node scripts/kb/cli.mjs followup list`
   - Nếu có app cụ thể: đọc `knowledge/apps/<app>/profile.md`, `campaigns.md`, và lessons/decisions có `app: <app>` (xem INDEX).
   - Đọc roadmap (`00-overview/roadmap.md`) để biết app đang ở giai đoạn nào, bước nào chưa làm.
   - `node scripts/kb/cli.mjs recall "<chủ đề>"` cho các bài liên quan.
2. **Phân tích** — đối chiếu: trạng thái hiện tại vs roadmap vs bài học cũ vs khuyến nghị chính thức (playbook, app-campaigns-tong-quan...).
3. **Trả lời** theo khung, ngắn gọn, mỗi ý dẫn file nguồn:
   - **Đến hạn / cần làm ngay** (mốc quá hạn, rủi ro đang mở)
   - **Bước tiếp theo theo roadmap** (1–3 việc, kèm điều kiện chuyển bước)
   - **Bài học áp dụng được** (từ lessons/decisions — nêu số liệu cũ và bối cảnh)
   - **Rủi ro / mâu thuẫn** cần user quyết
   - **Knowledge còn thiếu** (số liệu cần thu thập để quyết định tốt hơn — vd: chưa có ROAS D7 thật, chưa có retention)
4. Không bịa số. Phần là suy luận/đề xuất của Claude thì nói rõ là đề xuất, không phải fact.
5. User chốt quyết định → nạp vào `decisions/` (skill kb-capture) và thêm mốc theo dõi nếu cần.
