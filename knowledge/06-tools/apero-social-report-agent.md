---
title: Apero Social Report Agent ("Đăng") — agent Claude Code tổng hợp và chấm hiệu quả social đa kênh
type: reference
topic: 06-tools
tags: [tool, agent, claude-code, social, facebook, linkedin, tiktok, reporting, graph-api, employer-branding]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-076 - Report Social Media/PRD.md (đọc 2026-10-14)
  - AI Knownledge/APR-076 - Report Social Media/README.md (đọc 2026-10-14)
  - AI Knownledge/APR-076 - Report Social Media/apero-social-report-agent.zip → .claude/skills/*, memory/memory.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related: [05-optimization/danh-gia-hieu-qua-social-organic.md]
summary: 'Agent Claude Code của team Branding (Thu Hiền): thả file export Meta Business Suite và nhắn "làm báo cáo tuần" → script Python tính ER, sub-agent kiểm số, skill chấm so trung vị 3 tháng → Excel nhiều sheet + đề xuất.'
---

# Apero Social Report Agent

## Làm gì
Tự động hoá báo cáo hiệu quả truyền thông tuần/tháng cho Website, LinkedIn, 2 Fanpage, TikTok. PRD ghi thời gian làm báo cáo giảm từ khoảng 2–3h xuống khoảng 10 phút. Đã chạy thật cho báo cáo tháng 4–6/2026.

Kiến trúc là mẫu tốt để làm agent báo cáo kênh UA:
- `CLAUDE.md` làm "hiến pháp": vai trò, kênh, phân mức rủi ro công cụ (🟢 đọc tự do · 🟡 ghi phải xin phép và chỉ ghi tab mới · 🔴 gửi mail/xoá/đăng phải được đồng ý), nguyên tắc **không bịa số, không bỏ sót bài**.
- `scripts/` Python làm mọi phép tính (`bao_cao.py tuan|thang`): gọi Graph API hoặc đọc export Business Suite, tính Δ%, **tự kiểm số** (cảnh báo tương tác > lượt xem, view = 0, bài chưa gắn tuyến…).
- Sub-agent **kiểm soát viên** (chỉ có Read + WebFetch) xác nhận số bài lấy được bằng số bài thực có và mọi số đều có nguồn, chạy trước khi viết nhận xét.
- 3 skill: chấm chất lượng bài trước khi đăng; đánh giá sau khi đăng (so trung vị 3 tháng); benchmark đối thủ. Phương pháp đo đã chép vào [Đánh giá social organic](../05-optimization/danh-gia-hieu-qua-social-organic.md).
- `memory/memory.md` ghi các lỗi số đã sửa; launchd nhắc làm báo cáo 8h sáng; web app Vercel "phân tích 1 bài".

- **Dùng ở bước:** đo lường kênh social organic (fanpage, TikTok). Bối cảnh gốc là Employer Branding, không phải UA.
- **Owner:** Hiền Nguyễn Thu (Branding).
- **Vị trí:** `AI Knownledge/APR-076 - Report Social Media` (`apero-social-report-agent.zip` đã che token, `Demo_HienNT2.mp4` ~20MB, `HUONG-DAN-TRUY-CAP.md`).

## Cách chạy
- Mở thư mục agent bằng Claude Code, thả file export Meta Business Suite, nhắn "làm báo cáo tuần".
- Cần: Python 3 (openpyxl, requests); <cần Facebook Page token long-lived / System User token> đặt trong `config/ket-noi.md` (local) hoặc env Vercel; quyền `pages_read_user_content`. LinkedIn/TikTok/GA4 tại thời điểm viết chưa có token API nên dùng file export.

## Giới hạn / rủi ro
- Các rule nội dung (HESSBIC, TABOO, pillar Product/Human/Culture/News 40/30/20/10) là riêng cho Apero branding, không dùng nguyên cho fanpage app.
- Graph API không trả reach cấp Trang, phải dùng file export.

## Media
[▶ Demo agent tạo báo cáo social tuần từ file export (20 MB)](../../media/2026-10/2026-10-14-social-report-agent-demo-1.mp4)
