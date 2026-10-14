---
title: Khung phân tích metrics sản phẩm — AARRR/RARRA, retention curve, cohort, funnel, segmentation, anomaly
type: concept
topic: 05-optimization
tags: [analysis, retention, cohort, funnel, aarrr, ab-test, segmentation, anomaly]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-102 - PRD → Visual (Claude-powered)/prd-to-visual-tool-full.zip → prd-visual-suite/skills/po-metrics-analysis/{analysis-frameworks.md, farming-app-metrics.md, analysis-report-template.md, stakeholder-report-template.md} (đọc 2026-10-14) — tài liệu nội bộ, không trích nguồn ngành
created: 2026-10-14
updated: 2026-10-14
related:
  - 00-overview/glossary-chi-so.md
  - 04-measurement/ga4-bigquery-chi-so-suc-khoe-san-pham.md
  - 04-measurement/tracking-spec-va-metrics-plan-cho-feature.md
  - 05-optimization/doc-chi-so-theo-moc-thoi-gian.md
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
summary: Chọn framework theo câu hỏi (AARRR, retention curve + cohort, funnel, A/B hoặc trước/sau), cách đọc từng loại, bẫy thống kê và checklist điều tra khi chỉ số biến động.
---

# Khung phân tích metrics sản phẩm

## Bối cảnh
Rút từ `analysis-frameworks.md` của skill `po-metrics-analysis` (APR-102). Đây là phương pháp chung, không có số liệu thật. Các con số "healthy" trong nguồn **không có trích dẫn** nên chỉ giữ ở dạng "ví dụ minh hoạ", không dùng làm benchmark.

## 1. Chọn framework theo câu hỏi

| Câu hỏi | Framework |
|---|---|
| Sản phẩm khoẻ không? | AARRR hoặc RARRA |
| User có quay lại không? | Retention curve + cohort |
| User rơi ở bước nào? | Funnel |
| Feature X có hiệu quả không? | A/B test (nếu test được), không thì so cohort trước/sau release |
| Số tổng nhìn lạ? | Segmentation |
| Số đột ngột thay đổi? | Anomaly checklist |

- **AARRR** (Acquisition → Activation → Retention → Referral → Revenue): health check tổng, tìm chỗ rò lớn nhất. Không hợp phân tích từng feature.
- **RARRA**: đảo thứ tự, ưu tiên Retention → Activation → Referral → Revenue → Acquisition. Dùng khi CPI cao mà retention thấp — "đừng đổ nước vào xô thủng". Lập luận hợp với app ads-only: LTV ≈ Σ ARPDAU × retention, nên retention thấp thì scale UA chỉ đốt tiền ([glossary §4](../00-overview/glossary-chi-so.md)).

## 2. Retention curve — 4 dạng
- **Khoẻ**: rơi mạnh tuần đầu rồi **đi ngang (plateau)**. Mức và thời điểm plateau mới là thứ cần đọc.
- **Smiling (cười)**: rơi rồi tăng lại — hiếm, thường do feature lớn, viral, mùa lễ.
- **Death curve**: rơi liên tục, không plateau → core loop hỏng.
- **Cliff (vách)**: rơi bình thường rồi tụt đột ngột ở một mốc (vd D5) → có chốt chặn ở mốc đó (hết content, hết lý do quay lại). Đi soi event của cohort quanh mốc đó.

Chỉ số phụ: tỉ lệ **D7/D1** (bao nhiêu % user còn ở D1 trụ tới D7) — nguồn gợi ý ≥ 0,6 là khoẻ cho game farming, *không có nguồn*.

## 3. Cohort table
- Đọc **theo hàng**: một cohort diễn biến theo thời gian.
- Đọc **theo cột**: cùng Dn, các cohort khác nhau → có cải thiện không.
- Dimension hay dùng: tuần/tháng cài, **nguồn acquisition** (organic / paid theo kênh), platform, country, feature dùng đầu tiên, device tier.
- Dùng cho: so trước/sau release, so chất lượng traffic theo kênh/GEO, phát hiện mùa vụ, kiểm A/B.

## 4. Funnel
- Tập trung bước rơi lớn nhất; đọc cả conversion cộng dồn lẫn từng bước, và **thời gian giữa các bước**.
- Giả thuyết cho bước rơi: ma sát (UI/hiệu năng/yêu cầu), sai kỳ vọng, chờ tự nhiên, bug, thiếu động lực.
- Không dùng funnel khi hành vi không tuyến tính hoặc có nhiều đường hợp lệ.

## 5. A/B test — bẫy
Cần định trước: 1 metric thành công, cỡ mẫu, chia ngẫu nhiên, thời lượng (≥ 1 tuần, đủ cửa sổ retention), ngưỡng quyết định.
- **Peeking**: nhìn kết quả trước khi đủ N → dương tính giả.
- **Nhiều metric**: test 10 metric thì 1 cái "có ý nghĩa" do may rủi.
- **Time confounder**: A chạy tuần này, B tuần sau → không so được.
- **Sample ratio mismatch**: chia 50/50 mà thực tế 55/45 → có lỗi phân bổ.
- p > 0,05 **không** có nghĩa là "không khác biệt" — có thể test thiếu power. p rất nhỏ với 1M user mà lift 0,1% → có ý nghĩa thống kê nhưng vô nghĩa thực tế. Luôn nêu **effect size**.

## 6. Segmentation
Luôn cắt theo: platform, OS version, country (top 5), nguồn acquisition, device tier, user mới/cũ/quay lại, mức engagement.
- **Simpson's paradox**: tổng tốt mà từng segment xấu (hoặc ngược lại) — xảy ra khi tỉ trọng segment thay đổi, vd mix GEO của UA đổi.
- Segment nhỏ (N ≈ 50) không đủ để kết luận.
- Segment chồng nhau (vd paid_facebook gần như toàn US) → không tách được tác động.

## 7. Checklist điều tra biến động
| Tín hiệu | Nguyên nhân thường gặp |
|---|---|
| DAU tụt đột ngột | Store chặn, tracking hỏng, server sập |
| Tăng vọt | Viral, bot, tracking bắn đôi |
| Đi ngang khi đáng lẽ tăng | Bão hoà, gặp chốt chặn |
| Dịch chuyển country đột ngột | Được store feature, sự cố khu vực |
| Crash tăng | OS mới, bug version mới |
| Một bước funnel tụt | Code mới làm hỏng luồng |

Thứ tự điều tra: (1) kiểm chất lượng data → (2) đối chiếu thời điểm release/deploy → (3) cắt segment (platform/country/version) → (4) so cùng ngày tuần trước → (5) kiểm tín hiệu ở nhiều metric liên quan. Với app chạy UA, thêm bước cắt theo campaign/nguồn trước khi đổ lỗi cho sản phẩm (khớp quy tắc ở [ga4-bigquery](../04-measurement/ga4-bigquery-chi-so-suc-khoe-san-pham.md)).

## 8. Nguyên tắc diễn giải
- Luôn hỏi "**so với cái gì?**" — baseline, target, kỳ trước, control.
- Nhìn **phân phối**, không chỉ trung bình: ARPDAU trung bình như nhau có thể là đều nhau hoặc 1% user gánh toàn bộ → chiến lược khác hẳn. Xem median, p95, p99.
- Tương quan ≠ nhân quả; chỉ thí nghiệm mới chứng minh được nhân quả.
- **Survivorship bias**: chỉ phân tích user còn active sẽ bỏ sót user đã rời — mẫu số phải gồm cả user **không** làm X.

## 9. Báo cáo cho stakeholder (template của skill)
- **Analysis report sau release**: Recommendation đặt **đầu** → nhắc lại hypothesis → kết quả primary → health check secondary → segment → deep dive → funnel → retention → tín hiệu định tính (review store, ticket) → làm đúng/sai gì → quyết định Scale/Iterate/Kill + lý do → việc tiếp.
- **Báo cáo tuần/tháng**: TL;DR 3–5 gạch đầu dòng (đọc 30 giây) → headline metric kèm delta WoW/MoM → cái đang tốt / chưa tốt → đã ship / đang làm → thí nghiệm → **Risks & Asks** cuối.
- Không cherry-pick (chỉ khoe metric tăng), không dump 50 metric.

## Không đưa vào knowledge
`farming-app-metrics.md` có bảng "industry benchmark" retention D1–D90, CPI theo VN/US, stickiness, session length, crash-free… cho game farming/casual — **không ghi nguồn, không ngày, không GEO/kênh cụ thể**. Theo quy tắc repo (không bịa benchmark) nên không chép số. Nếu cần benchmark, dùng nguồn có trích dẫn hoặc số thật của app.
