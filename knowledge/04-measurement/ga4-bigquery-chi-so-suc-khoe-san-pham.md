---
title: Chỉ số sức khoẻ sản phẩm từ GA4 BigQuery — định nghĩa, SQL và quy tắc đọc
type: reference
topic: 04-measurement
tags: [ga4, bigquery, retention, dau, engagement, stickiness, firebase]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-211 - Police-product/report/report.py (đọc 2026-10-14) — SQL và luật nhận xét
  - AI Knownledge/APR-211 - Police-product/PRD.md (đọc 2026-10-14)
  - AI Knownledge/APR-211 - Police-product/.claude/agents/police-product.md (đọc 2026-10-14)
  - "AI Knownledge/APR-102 - PRD → Visual (Claude-powered)/prd-to-visual-tool-full.zip → po-metrics-analysis/{firebase-analytics-guide.md, analysis-frameworks.md, farming-app-metrics.md} (đọc 2026-10-14; nội bộ — mâu thuẫn với Firebase Help thì theo Firebase Help)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 00-overview/glossary-chi-so.md
  - 04-measurement/firebase-events-cho-ua.md
  - 06-tools/police-product-bao-cao-suc-khoe-app-hang-ngay.md
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
  - 04-measurement/tracking-spec-va-metrics-plan-cho-feature.md
  - 05-optimization/khung-phan-tich-metrics-aarrr-cohort-funnel.md
summary: Cách tính DAU, new users, sessions, engagement rate, retention D1/D7 (cohort first_open), DAU/MAU từ bảng GA4 export events_*; quy tắc count→%, rate→pp; so d/7d/~2 tuần; ngưỡng cờ nội bộ.
---

# Chỉ số sức khoẻ sản phẩm từ GA4 BigQuery

## Bối cảnh
Lấy từ engine `report.py` của tool nội bộ Police-product (APR-211, 07/2026, app ISI125 iOS). Dùng được cho mọi app Firebase/GA4 đã bật **BigQuery export** (bảng `events_YYYYMMDD`). Định nghĩa retention khớp [glossary](../00-overview/glossary-chi-so.md) (classic Dn).

## Định nghĩa (theo SQL trong report.py)
| Chỉ số | Cách tính trên `events_*` |
|---|---|
| DAU | `COUNT(DISTINCT user_pseudo_id)` theo `event_date` |
| New users | `COUNT(DISTINCT user_pseudo_id)` có `event_name = 'first_open'` |
| Sessions | số cặp distinct `user_pseudo_id + ga_session_id` (param `ga_session_id`) |
| Engaged sessions | session có param `session_engaged = 1` (có thể là string hoặc int — phải `COALESCE(int, SAFE_CAST(string))`) |
| Engagement rate | engaged sessions ÷ sessions |
| Avg engagement time/user | `SUM(engagement_time_msec)/1000` ÷ DAU (phút) |
| Retention Dn | cohort = user có `first_open` ngày X (lấy `MIN(event_date)`); retained = user có bất kỳ event nào đúng ngày X+n; D1, D7 |
| Stickiness | DAU ÷ MAU (MAU = distinct user trong cửa sổ ~30 ngày) |
| Key events | đếm theo ngày các event phễu (vd `first_open`, `ob_view`, `iap_view`, `in_app_purchase`) |

Lưu ý:
- Ngày báo cáo = bảng **hoàn chỉnh** gần nhất — bỏ `events_intraday_*`.
- Retention Dn của "hôm nay" là của cohort ngày (hôm nay − n) → trend so với cohort hôm trước và TB 7 cohort trước.
- Với app ads-only nên thêm ARPDAU (Police-product chưa có). Lưu ý `ad_impression` do AdMob tự log **không có trong BigQuery export** (Firebase Help 9234069) — chỉ tính được từ `events_*` khi event được log tay (vd ILRD từ MAX); còn lại lấy doanh thu AdMob report ÷ DAU.
- "Retained" có nhiều cách định nghĩa: bất kỳ event (report.py), chỉ `session_start` (skill po-metrics-analysis), hoặc `user_engagement`. Event nền (`app_remove`, `os_update`, notification receive) có thể làm "active" giả. Ghi rõ đang dùng loại nào khi so số giữa 2 tool.
- Cohort `first_open` phải lấy `MIN(event_date)` theo user — `first_open` bắn lại khi cài lại app, không gom thì một user rơi vào nhiều cohort.
- Luôn giới hạn `_TABLE_SUFFIX` ở **mọi** lần đọc `events_*`, kể cả trong JOIN (SQL D7 mẫu trong tracking-spec-template của skill PO quên lọc → quét toàn dataset, tốn phí).
- Bảng ngày cần ~24h mới đủ; báo cáo GA4/Console có thể bị sampling, BigQuery là dữ liệu thô. Console đủ cho DAU/funnel/retention chuẩn; cần BigQuery khi funnel tuỳ biến, cohort chi tiết, join chi phí UA/AdMob.

## Quy tắc đọc
- **count → %**, **rate → điểm phần trăm (pp)**. Retention 8% → 6,4% là **−1,6 pp**, không phải −20%.
- So 3 mốc: hôm qua (dod), TB 7 ngày (wow), ~2 tuần trước (d14) + quỹ đạo từng ngày. **Xem xu hướng 2 tuần trước** khi kết luận để phân biệt dip 1 ngày với downtrend.
- Cờ "đi ngang" mặc định: |Δ| < 3% (count) hoặc < 1 pp (rate).
- Khi acquisition tụt: cắt theo `traffic_source` / campaign / country / device để kiểm chứng trước khi đổ lỗi cho UA.

## Ngưỡng cờ trong tool (heuristic nội bộ, chưa kiểm chứng)
Các ngưỡng dưới đây do tác giả tool đặt, **không phải benchmark ngành**; dùng làm điểm bắt đầu, chỉnh theo số thật của app:
- DAU d14 ≤ −25% hoặc new users d14 ≤ −30% → "giảm kéo dài, rà lại UA/campaign". DAU d14 ≥ +25% → "tăng trưởng bền".
- Retention D7 < 2% → điểm nghẽn lớn nhất.
- DAU/MAU < 10% → rất thấp; < 20% → thấp.
- `iap_view` giảm > 15% so hôm qua → tín hiệu doanh thu; event phễu khác giảm > 25% → phễu yếu.
