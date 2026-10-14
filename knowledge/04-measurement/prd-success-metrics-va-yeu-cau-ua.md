---
title: PRD và product metrics — Success Metrics, Metrics Plan, Tracking Spec và những gì UA cần chốt trước khi build feature
type: concept
topic: 04-measurement
tags: [prd, product-metrics, metrics-plan, tracking-spec, event-naming, firebase, counter-metric, decision-criteria, north-star]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-026 - Viết Product Requirements Document/po-agent-bundle.md — po-prd-writer §1.5/§11 patterns, po-metrics-analysis SKILL.md + metrics-plan/tracking-spec template + firebase-analytics-guide + farming-app-metrics (đọc 2026-10-14)
  - AI Knownledge/APR-229 - PO Copilot/CongHT - PO Skill Set.zip → prd-writer/assets/prd-template.md, ask-why-ba/references/requirement-layers.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 04-measurement/tracking-spec-va-metrics-plan-cho-feature.md
  - 04-measurement/firebase-events-cho-ua.md
  - 04-measurement/ga4-bigquery-chi-so-suc-khoe-san-pham.md
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
  - 00-overview/glossary-chi-so.md
  - 06-tools/viet-prd-agent-apero.md
  - 06-tools/po-copilot-pipeline-tai-lieu-san-pham.md
summary: Cách PRD nội bộ định nghĩa success metric (SMART, baseline, counter-metric, ngưỡng Scale/Iterate/Kill chốt trước launch), và checklist những gì UA cần chen vào PRD trước khi build.
---

# PRD và product metrics

Tổng hợp từ 2 bộ skill PO nội bộ ([APR-026](../06-tools/viet-prd-agent-apero.md), [APR-229](../06-tools/po-copilot-pipeline-tai-lieu-san-pham.md)). Đây là **quy ước nội bộ**, không phải benchmark. Các con số trong template gốc (D7 25% → 32%, crash-free 99.7%…) chỉ là placeholder minh hoạ.

## 1. Success metric trong PRD
- Mọi goal phải **đo được**, không dùng chữ mơ hồ ("tốt hơn", "engagement", "user-friendly"). Theo APR-229, request thiếu KPI/mục tiêu đo được là requirement chưa hoàn chỉnh ở tầng Business Requirement (BABOK).
- Mỗi KPI có đủ **baseline + target + deadline** (APR-229 `prd-template.md` §1.3). PRD 17 section của APR-026 cần 4–6 metric ở §1.5, mỗi metric có tên cụ thể, ngưỡng (≥/≤), cohort nếu cần. Phải có ít nhất 1 metric cho mỗi nhóm: Adoption/Retention, Engagement/Usage, Performance/Speed, Quality/Error, sức khoẻ riêng của feature.
- Chưa có baseline thì ghi "Baseline TBD — measure for [N] days before setting target", không đặt target tuỳ ý.

## 2. Metrics Plan (APR-026 `po-metrics-analysis`)
| Phần | Quy tắc |
|---|---|
| Hypothesis | "If we [change], then [metric] will [move] by [magnitude], because [reasoning]" |
| Primary metric | **Chỉ 1.** Có công thức, cohort filter, baseline và nguồn baseline, target và lý do, measurement window, ngưỡng significance |
| Secondary metrics | Chỉ số **không được tụt** (crash-free, D1 retention, session length, app size…), mỗi cái có khoảng chấp nhận |
| Counter-metrics | Theo dõi nhưng **không tối ưu** (vd session count/user dễ bị chẻ nhỏ session, "bad for ad inventory"; app opens/ngày dễ dẫn tới push dark pattern) |
| Segments | New vs returning, free vs paying, iOS vs Android, top country, mức tiến độ |
| Decision criteria | **Chốt trước launch**: SCALE (tất cả điều kiện đạt), ITERATE (bất kỳ điều kiện nào ở vùng cảnh báo), KILL (primary không nhúc nhích, secondary tụt mạnh, bug nghiêm trọng, rating tụt). Mục đích: tránh dời cột gôn sau khi thấy data |

Cặp counter-metric gợi ý trong bản gốc: DAU ↔ crash-free; D7 retention ↔ D1 retention và rating; push CTR ↔ opt-out và churn; IAP rate ↔ retention của user free.

Vanity metric không dùng làm primary: tổng download, tổng user đăng ký, tổng session, tổng screen view, thời gian trong app, số feature đã build.

North Star: skill coi NSM cấp company là **ngoài scope**. Catalog chỉ gợi ý cho game farming (Weekly Active Days per User). Chưa có khuyến nghị NSM cho app ads-only.

## 3. Quy ước tên event Firebase
Chi tiết (7 loại event, catalog param, giới hạn Firebase, checklist validate) ở [Tracking spec & metrics plan cho feature mới](tracking-spec-va-metrics-plan-cho-feature.md). Tóm tắt: `[screen]_[element]_[action]` hoặc `[screen]_[action]`, snake_case, ≤40 ký tự, `_success`/`_fail` là 2 event riêng, không PII, không override event tự thu thập.

⚠️ Lệch nội bộ: §11 trong template PRD 17 section (APR-026) lại dùng `<feature>_<action>` (vd `bs_saved`). Khi viết PRD mới nên theo quy ước `[screen]_…`.

## 4. UA/Marketing cần gì từ PRD
*Phần này là nhận định của người viết, rút từ các tài liệu đo lường đã có trong repo. Chưa phải quy trình đã thống nhất với team Product.*

Bộ skill PO được viết cho product team (game farming, app subscription), **không có** mục nào cho UA hay ads monetization. Với app ads-only chạy Google App campaigns, khi review PRD một feature mới nên đòi thêm:

1. **Event conversion cho bidding**: event "user nhận được giá trị" (vd tạo xong ảnh) có tên cố định, bắn 1 lần đúng lúc, đủ volume để import làm conversion tCPA. Xem [Firebase events cho UA](firebase-events-cho-ua.md) và [playbook tCPA → ROAS](../playbooks/launch-google-app-campaign-tcpa-den-roas.md).
2. **Không đụng event bidding đang chạy**: đổi tên hoặc logic `first_open`, `ad_impression`, event tCPA hiện tại sẽ làm campaign học lại. PRD nên ghi rõ ở Non-goals hoặc Risks.
3. **Ad revenue**: feature thêm/bớt chỗ đặt ad phải nêu ảnh hưởng tới imps/DAU và giữ `ad_impression` có value (ILRD) cho tROAS. Xem [quy tắc đặt ad](../03-monetization/quy-tac-dat-quang-cao-in-app-apero.md).
4. **Counter-metric phía UA**: retention D1/D7 theo cohort `first_open` và ROAS D0/D7 theo country không được tụt. Đưa vào Secondary metrics.
5. **Rollout & đo**: §16 Rollout Plan nên khớp lịch đọc số của UA (mốc 7 ngày, 1 tháng). Version mới vẫn so bằng [hậu kiểm version app](../05-optimization/hau-kiem-version-app-nguong-verdict.md).

Áp vào Home Morph: event đang chờ kiểm tra là `generation_completed` và `rewarded_ad_completed` ([current-state](../00-overview/current-state.md)). Hai tên này **không theo** quy ước `[screen]_[action]_success`. Nếu đang làm event conversion cho Google Ads thì nên giữ nguyên tên, chỉ áp quy ước cho event mới. Cần user chốt.
