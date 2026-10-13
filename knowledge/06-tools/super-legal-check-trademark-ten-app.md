---
title: Super Legal — kiểm tra trùng nhãn hiệu (trademark) cho tên app trước khi phát hành
type: reference
topic: 06-tools
tags: [tool, legal, trademark, app-name, aso]
app: general
status: verified
confidence: high
sources:
  - AI Knownledge/APR-055 - Super Legal/_info.md, 1-ASSET-super-legal.md.docx (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md
  - 01-pre-marketing/aso-google-play-store-listing.md
  - 06-tools/legal-platform-policy-research-skill.md
summary: Web tool nội bộ của Legal Apero — nhập tên app, tự tra USPTO/WIPO/Cục SHTT VN/App Store/Google Play, chấm rủi ro theo nhóm Nice 9 & 42 và look-alike, Legal duyệt rồi trả kết quả PDF có bằng chứng.
---

# Super Legal — check trademark tên app

## Làm gì
AI legal copilot nội bộ để PO/ASO/Dev tự sàng lọc rủi ro **trùng nhãn hiệu cho tên app** thay vì gửi Legal chờ xử lý tay (nhu cầu khoảng 80 yêu cầu/tháng).
- Tra **USPTO** (số đơn, số đăng ký, ngày, chủ, nhóm Nice), **WIPO Global Brand DB**, **Cục SHTT VN**, **App Store / Google Play**.
- Rule rủi ro do Legal kiểm soát: trùng tên + nhãn Live + **nhóm Nice 9/42** là Cao; look-alike lệch 1–2 ký tự; tên chứa brand/nhân vật nổi tiếng là Cao; tên mô tả là cảnh báo yếu. Chi tiết trong [policy app AI ảnh và đặt tên app](../01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md).
- Xếp hạng nhiều tên ứng viên theo rủi ro. Ca an toàn tự trả kết quả; ca rủi ro chờ Legal duyệt (Cho phép / Không / Chuyển Executive) rồi gửi PDF + Discord + email.
- **Bước roadmap**: Pre-Marketing, khi đặt tên app/title store (trước ASO), tránh bị reject, phải rebrand hoặc bị kiện.
- **Owner**: Trang Cao Thị Huyền (Legal). Vị trí: `AI Knownledge/APR-055 - Super Legal`.

## Cách dùng
Đăng nhập https://web-two-blue-44.vercel.app/login (Google SSO @apero.vn / @talent.apero.vn) → nhập tên app → xem kết quả.

## Giới hạn
- Chỉ check theo **tên**. Check copyright/icon (ảnh), policy, privacy policy/ToS đang "sắp ra mắt" (07/2026).
- Mức "Độ tin cậy AI" chỉ để tham khảo. Kết luận pháp lý là của Legal.
- [▶ Video demo luồng nhập tên app → kết quả rủi ro trademark (WebM, 3,9 MB)](../../media/2026-10/2026-10-14-super-legal-demo-1.webm)
