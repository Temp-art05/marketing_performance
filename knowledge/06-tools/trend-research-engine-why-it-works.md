---
title: Trend Research Engine — nghiên cứu app/trend theo ngành kèm khung "Why It Works"
type: reference
topic: 06-tools
tags: [research, trend, competitor, creative-brief, app-store, tool-noi-bo]
app: general
status: draft
confidence: medium
sources: ["AI Knownledge/APR-231 - reseach sản phẩm/tai-lieu-san-pham/README.md (đọc 2026-10-14)", "AI Knownledge/APR-231 - reseach sản phẩm/tai-lieu-san-pham/PRD.md (đọc 2026-10-14)", "AI Knownledge/APR-231 - reseach sản phẩm/tai-lieu-san-pham/TECHNICAL.md (đọc 2026-10-14)"]
created: 2026-10-14
updated: 2026-10-14
related: [01-pre-marketing/nghien-cuu-trend-cho-creative.md]
summary: Dashboard Next.js (MVP) — nhập ngành/từ khoá (VN/EN) → app trending từ App Store thật + 5 điểm số công thức minh bạch, ý tưởng nội dung, video/ảnh/social; khung 13 thẻ Why-It-Works và Creative Brief (còn mock).
---

# Trend Research Engine (APR-231 "reseach sản phẩm")

## Bối cảnh
- Vị trí: `AI Knownledge/APR-231 - reseach sản phẩm/tai-lieu-san-pham/` (README, PRD, USER_GUIDE, TECHNICAL) + video demo. Không có mã nguồn trong folder.
- Owner trên hub: Tùng Trịnh Lê Huy (Graphic Designer); tài liệu do huynq1@apero.vn biên soạn (06/07/2026).
- Bước roadmap: **trước giai đoạn 1** (chọn ngách, đánh giá đối thủ) và **giai đoạn 1 — creative** (góc tiếp cận, hook, creative brief).

## Làm gì
- **Trend/Product Research (dữ liệu thật, keyless):** nhập từ khoá + thị trường → app từ **Apple iTunes Search API** (rating, số rating, ngày update, screenshot, review, đối thủ), ý tưởng nội dung từ Google/YouTube autocomplete, video YouTube, ảnh Openverse/Wikimedia, bài Hacker News/Lemmy. Từ khoá tiếng Việt tự dịch sang tiếng Anh.
- **5 điểm số 0–100** tính từ metric App Store bằng công thức công khai (trend, opportunity, why-it-works, content, monetization) — xem [Nghiên cứu trend cho creative](../01-pre-marketing/nghien-cuu-trend-cho-creative.md).
- **Why It Works** (13 thẻ: pain point, desire, viral mechanism, emotional trigger, visual hook, transformation, speed to value, monetization logic, platform fit, competitive advantage, content repeatability, shareability, weakness) — **hiện là mock**, cần nối Claude API.
- **Creative Market Research Engine** (Format DNA, Resource Board, Creative Report → Creative Brief) — **mock-first**, chưa có backend.
- Lưu trend, tạo report, xuất PDF.

## Cách chạy
`npm install` → `npm run dev` → http://localhost:3000 (cần internet; Node 18.18+/20+). Phần AI cần **<cần ANTHROPIC_API_KEY trong .env.local>** — chưa tích hợp.

## Giới hạn / rủi ro
- **Chỉ có App Store (iOS)** — không có Google Play; với app Android phải coi là tín hiệu gián tiếp.
- Không có time-series → "trend" thực chất là rating + độ phổ biến (log số rating) + độ mới, **không đo tăng trưởng**.
- Không có metric thật từ TikTok/Meta/Pinterest (chỉ deep-link).
- Nguyên tắc tốt nên giữ: không bịa số, gắn nhãn "ước tính", phân loại quyền sử dụng tài nguyên ("công khai không có nghĩa là được dùng miễn phí").

## Media
[▶ Demo dashboard Trend Research Engine (15 MB)](../../media/2026-10/2026-10-14-trend-research-engine-demo-1.mp4)
