---
title: Global Holiday Map — lịch ngày lễ theo quốc gia để lên kế hoạch mùa vụ UA/creative
type: reference
topic: 06-tools
tags: [seasonality, holiday, geo, content-planning, google-sheets, tool-noi-bo]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-284 - GLOBAL HOLIDAY MAP/_info.md (đọc 2026-10-14)
  - "AI Knownledge/APR-284 - GLOBAL HOLIDAY MAP/Tool.zip: README.md, docs/data-strategy.md, docs/product-requirements.md (đọc 2026-10-14)"
  - https://date.nager.at
  - https://www.npmjs.com/package/date-holidays
created: 2026-10-14
updated: 2026-10-14
related: [01-pre-marketing/nghien-cuu-trend-cho-creative.md, 02-ua-channels/google-ads/geo-va-ngon-ngu-targeting.md]
summary: Web app bản đồ 3D chọn nhiều nước → ngày lễ 2025–2030 tách 3 lớp (nghỉ chính thức / văn hoá-tôn giáo / observance), có nguồn + trạng thái xác minh, xuất .ics/.csv và Google Sheets theo tháng.
---

# Global Holiday Map

## Bối cảnh
- Vị trí: `AI Knownledge/APR-284 - GLOBAL HOLIDAY MAP` (`Tool.zip` ~1 GB gồm source + Docker image, video `hướng dẫn.mp4` ~190 MB).
- Owner: Hạnh Thân Thị Hồng (hanhtth@apero.vn).
- Bước roadmap: **lập kế hoạch theo mùa** cho cả 3 giai đoạn — chuẩn bị creative/ASO theo dịp lễ ở từng GEO (vd Ramadan, Diwali, Lunar New Year), dự trù biến động CPI/eCPM quanh lễ lớn.

## Làm gì
- Chọn châu lục/quốc gia trên globe 3D (MapLibre), năm 2025–2030 (mặc định 2026), xem List/Calendar/Timeline, lọc, favorite, **Content Planner**, xuất `.ics` / `.csv`, đồng bộ **Google Sheets theo từng tháng** sau khi người dùng kiểm tra và xác nhận sự kiện.
- **3 lớp dữ liệu** — không đánh đồng ngày kỷ niệm với ngày nghỉ: `OFFICIAL_HOLIDAY` (nghỉ chính thức, ngân hàng, trường học), `CULTURAL_RELIGIOUS` (lễ văn hoá, tôn giáo), `OBSERVANCE` (ngày quốc tế, ngày nghề nghiệp, không nghỉ).
- Mức quan trọng `MAJOR / MEDIUM / MINOR`; trạng thái xác minh `OFFICIAL / VERIFIED / AGGREGATED / UNVERIFIED / CONFLICTED / ESTIMATED`.

### Chiến lược dữ liệu (đáng học khi tự làm lịch mùa vụ)
1. Tầng 1 — ngày nghỉ chính thức: **Nager.Date** (miễn phí, không key, ~100+ nước).
2. Tầng 2 — văn hoá/tôn giáo/vùng: thư viện npm **date-holidays** (MIT), chạy phía server.
3. Tầng 3 — override nội bộ theo năm (ưu tiên cao nhất).
- Chống trùng bằng fingerprint `country + subdivision + date + normalizedName + layer + type`; lễ theo âm lịch/tôn giáo nếu là dự kiến thì gắn `ESTIMATED` và cảnh báo.
- Đồng bộ: official hằng tuần, cultural/observance hằng tháng.

## Cách chạy
Next.js + Prisma/PostgreSQL (Docker) + Auth.js Google OAuth. `npm install`, `cp .env.example .env`, `docker compose up -d`, `npm run db:migrate && npm run db:seed`, `npm run holidays:sync -- --year=2026`, `npm run dev`. Cần: **<AUTH_SECRET>, <AUTH_GOOGLE_ID/SECRET (OAuth client)>, <DATABASE_URL>, <HOLIDAY_SYNC_SECRET>, <CRON_SECRET>**, và cho Google Sheets: **<service account email + private key>**, spreadsheet ID. Không có bản deploy công khai được ghi trong tài liệu — hỏi owner.

## Giới hạn / rủi ro
- Độ phủ observance/văn hoá không đều giữa các nước; ngày âm lịch có thể là ước tính → kiểm tra nguồn chính thức cho quyết định quan trọng.
- Tool cho biết **ngày**, không cho biết **tác động** lên CPI/eCPM/retention — phải đối chiếu số thật của app.
- ⚠️ `Tool.zip` trong archive có kèm file `.env` thật — không phân phối lại file zip; đã ghi cảnh báo ở [trạng thái hiện tại](../00-overview/current-state.md).

## Credential (kho nội bộ)

[🔑 file `.env` đầy đủ của Tool (DB, auth, API key)](../../media/secrets/apr-284-global-holiday-map-env.md) — lưu trong `media/secrets/` trên máy (không lên git; chuyển máy bằng `kb media export/import`). Xem trên web hoặc `cat media/secrets/apr-284-global-holiday-map-env.md`.
