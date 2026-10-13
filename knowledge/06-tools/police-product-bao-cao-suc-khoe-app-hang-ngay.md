---
title: Police-product — báo cáo sức khoẻ app hằng ngày từ GA4 BigQuery về Discord
type: reference
topic: 06-tools
tags: [ga4, bigquery, retention, dau, discord, agent, tool-noi-bo]
app: general
status: draft
confidence: high
sources: ["AI Knownledge/APR-211 - Police-product/PRD.md (đọc 2026-10-14)", "AI Knownledge/APR-211 - Police-product/report/report.py (đọc 2026-10-14)", "AI Knownledge/APR-211 - Police-product/.claude/agents/police-product.md (đọc 2026-10-14)"]
created: 2026-10-14
updated: 2026-10-14
related: [04-measurement/ga4-bigquery-chi-so-suc-khoe-san-pham.md]
summary: Template agent đọc GA4 export → BigQuery, tính DAU/new users/engagement/retention D1-D7/DAU-MAU/key events, so hôm qua·TB7·~2 tuần, gắn cờ và đẩy Discord 09:00; agent Claude trả lời "vì sao DAU tụt".
---

# Police-product (ISI125 Daily Metrics Agent)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-211 - Police-product` (PRD.md, CLAUDE.md, `report/report.py`, skill `product-health`, agent `police-product`).
- Owner: Oai Nguyễn Văn. Bản gốc theo dõi app **ISI125 (iOS)**, nhưng là template: đổi project/dataset GA4 là dùng cho app khác (kể cả Android).
- Bước roadmap: **giai đoạn 3 — Đo lường**, phần Firebase/GA4 — nắm DAU, new users, retention mỗi sáng mà không phải mở BigQuery.

## Làm gì
1. `report/report.py` (không LLM, tính số deterministic) query bảng `events_*` của GA4 export → tính chỉ số → gắn cờ 🟢/🔴/⚪ → đăng embed Discord lúc 09:00 (launchd macOS).
2. Skill `product-health` trả JSON (`report.py --json`) gồm `metrics` (dod / wow / d14) và `daily_series`.
3. Agent `police-product` (Claude) đọc JSON, **xem xu hướng ~2 tuần trước**, cắt theo traffic source / campaign / country / device khi cần, trả verdict + điểm cần chú ý + 1–3 khuyến nghị.

Định nghĩa chỉ số, SQL và quy tắc cờ: xem [Chỉ số sức khoẻ sản phẩm từ GA4 BigQuery](../04-measurement/ga4-bigquery-chi-so-suc-khoe-san-pham.md).

## Cách chạy
- Điều kiện: GA4 property đã bật **BigQuery Links** (có dataset `analytics_XXXXXXXXX`).
- **<cần service account JSON>** có role **BigQuery Data Viewer** + **BigQuery Job User** (Job User phải ở mức project); **<cần Discord webhook URL>**. Không commit `.env`, `credential/`.
- `.env`: `GOOGLE_APPLICATION_CREDENTIALS`, `DISCORD_WEBHOOK_URL`, `GA4_PROJECT`, `GA4_DATASET`, `APP_NAME`, tuỳ chọn `FLAT_THRESHOLD_PCT` (mặc định 3.0) / `FLAT_THRESHOLD_PP` (1.0).
- Lệnh: `python3 report/report.py --dry-run` (xem trước) · `--json` · `--date 20260704` · không cờ = đăng Discord. Bật hằng ngày: copy `report/com.police-product.daily.plist` vào `~/Library/LaunchAgents/` rồi `launchctl load`.
- Hỏi trong Claude Code: "App hôm nay thế nào?", "Vì sao DAU tuần này tụt?".

## Giới hạn / rủi ro
- 1 app, iOS; GA4 export mới ~24 ngày nên trend > 2 tuần còn hạn chế.
- Phụ thuộc máy bật lúc 09:00 (launchd); hướng phát triển là chuyển sang cloud scheduler.
- Chi phí BigQuery nhỏ (mỗi lần quét vài chục MB, theo PRD).
- Lỗi `403/permission denied` = thiếu role; `invalid_grant` = key đã bị revoke.
- Không có doanh thu ads (ad_impression value) trong bộ chỉ số — với app ads-only nên thêm ARPDAU từ `ad_impression` nếu dùng lại.
