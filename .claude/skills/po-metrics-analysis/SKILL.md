---
name: po-metrics-analysis
description: Định nghĩa, setup, phân tích và báo cáo product metrics cho app mobile dùng Firebase Analytics + BigQuery (APR-026) — Metrics Plan (primary/secondary/counter metric, baseline, decision criteria Scale/Iterate/Kill), Tracking Spec (event naming [screen]_[element]_[action]), Analysis Report post-release, Product Health Report weekly/monthly; output tiếng Anh. Dùng khi user nói "metrics plan", "tracking spec", "định nghĩa event", "setup tracking", "phân tích số sau release", "retention/funnel/cohort", "weekly/monthly report". Không dùng cho số UA/campaign (CPI, ROAS) — dùng knowledge 04-measurement/05-optimization.
---
<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- Ghi chú nhập (không thuộc bản gốc): tách từ po-agent-bundle.md; C0 SKILL.md; C1–C8 tách thành assets/ và references/ đúng đường dẫn mà SKILL.md đã trỏ; đổi tham chiếu `po-prd-writer` → `po-prd-writer`. Output gốc lưu vào `/mnt/user-data/outputs/` (sandbox claude.ai) — trong repo này hỏi user nơi lưu (đề xuất `exports/po/<app>/`, đã gitignore). -->

# Product Metrics Analysis

Skill này giúp Product Owner làm việc với metrics ở cả 3 giai đoạn: pre-release (define + setup), post-release (analyze), và ongoing (report). Tích hợp với Firebase Analytics + BigQuery. Instruction tiếng Việt, output document luôn tiếng Anh.

## Cấu trúc skill (đọc file nào khi nào)

`SKILL.md` này là entry point — chứa mindset, 3 use case, và quy tắc bắt buộc. Khi thực thi, đọc thêm các file dưới đây **chỉ khi cần** (progressive disclosure):

**`assets/` — templates để fill (output document):**
- `assets/metrics-plan-template.md` — Pre-release: định nghĩa primary/secondary/counter metrics, baseline, target, decision criteria
- `assets/tracking-spec-template.md` — Pre-release: spec Firebase events cho dev implement
- `assets/analysis-report-template.md` — Post-release: phân tích kết quả, ra decision Scale/Iterate/Kill
- `assets/stakeholder-report-template.md` — Ongoing: báo cáo weekly/monthly cho team/leadership

**`references/` — tài liệu tra cứu (load khi cần, KHÔNG copy vào output):**
- `references/firebase-analytics-guide.md` — Hard limits, default events, naming convention, parameter catalog, BigQuery schema + SQL templates, common pitfalls
- `references/farming-app-metrics.md` — Catalog metrics đặc thù farming game, tổ chức theo AARRR + farming-specific
- `references/analysis-frameworks.md` — AARRR/RARRA, retention curves, cohort, funnel, segmentation, anomaly detection, decision tree chọn framework
- `references/quality-checklist.md` — Checklist self-review cho cả 4 loại document + cross-document consistency

## Triết lý cốt lõi

**"Without data, you're just another person with an opinion."** Nhưng có data chưa đủ — phải có **đúng metric**, **đo đúng cách**, **interpret đúng**, và **action đúng**.

PO không phải Data Analyst. Vai trò PO với metrics:
1. **Define WHAT to measure**: chọn metric đúng, không vanity metric
2. **Define HOW to measure**: tracking spec rõ, event không thiếu/dư
3. **Interpret WHY**: hiểu data nói gì về user behavior
4. **Decide WHAT NEXT**: scale/iterate/kill dựa trên data

Skill này KHÔNG dạy SQL deep, không dạy ML/statistics nâng cao. Skill dạy **framework + template + checklist** để PO làm metrics work hiệu quả.

## 3 use case và workflow tương ứng

### Use case 1: Define metrics + setup tracking (PRE-RELEASE)

**Khi nào dùng**: trước khi build feature, song song với viết PRD.

**Output**: 2 documents
- **Metrics Plan**: primary/secondary/counter metrics, baseline, target, decision criteria
- **Tracking Spec**: event list, properties, dashboards cần setup

**Workflow:**
1. Hỏi user về feature: tên, mục tiêu, hypothesis (nếu chưa có PRD)
2. Đọc `references/farming-app-metrics.md` để chọn metrics phù hợp
3. Đọc `references/firebase-analytics-guide.md` để check tracking constraints (event name 40 char, max 25 params, naming convention)
4. Fill `assets/metrics-plan-template.md`
5. Fill `assets/tracking-spec-template.md`
6. Output kèm gợi ý: "Đưa Tracking Spec này cho dev. Đưa Metrics Plan vào §1.5 và §3.4 của PRD."

**Lưu ý quan trọng**: nếu feature đã có PRD (qua skill `po-prd-writer`), phải nhất quán giữa Metrics Plan và §1.5 Success Metrics + §3.4 Decision Criteria + §11 Analytics Events trong PRD. KHÔNG được mâu thuẫn.

### Use case 2: Analyze data POST-RELEASE

**Khi nào dùng**: 1-4 tuần sau khi release feature.

**Output**: Analysis Report với decision Scale/Iterate/Kill.

**Workflow:**
1. Hỏi user: feature nào, ngày release, primary metric & target từ PRD/Plan, data hiện tại
2. Đọc `references/analysis-frameworks.md` để chọn framework (AARRR / Retention curve / Funnel / Cohort)
3. Nếu user có raw data (Firebase Console screenshot, BigQuery export, CSV) → phân tích cụ thể. Nếu chỉ có headline number → hỏi thêm context.
4. Fill `assets/analysis-report-template.md`
5. Đưa ra recommendation rõ ràng: Scale / Iterate / Kill với justification dựa trên data + decision criteria từ Plan

**Đặc biệt với Firebase Analytics:**
- Firebase Console funnel/retention bị giới hạn (60 ngày retention, custom funnel khó query) → nếu cần deep analysis, recommend export BigQuery
- Default events (first_open, session_start, in_app_purchase) có sẵn → tận dụng
- Cohort analysis trong Firebase Console hạn chế → BigQuery SQL có template trong `references/firebase-analytics-guide.md`

### Use case 3: Stakeholder reports (ONGOING)

**Khi nào dùng**: weekly review với team, monthly report cho CEO/investor.

**Output**: Product Health Report theo format TL;DR-first.

**Workflow:**
1. Hỏi user: audience (team / CEO / board / investor), period (weekly / monthly / quarterly), key context
2. Đọc `references/farming-app-metrics.md` để chọn headline metrics phù hợp audience
3. Fill `assets/stakeholder-report-template.md`
4. Lưu ý format:
   - **TL;DR ở đầu** (3-5 bullets, đọc 30s hiểu hết)
   - **Headline metrics** với week-over-week, month-over-month delta
   - **Deep dives** chỉ cho metric có biến động lớn
   - **Risks & Asks** ở cuối (cái PO cần stakeholder help)

## Quy tắc viết bắt buộc

### 1. Metric definition phải SMART
Mỗi metric phải có:
- **S**pecific: tên cụ thể, không "engagement"
- **M**easurable: định nghĩa toán học rõ ràng
- **A**ttainable: target dựa trên baseline + benchmark
- **R**elevant: liên quan business outcome, không vanity
- **T**ime-bound: measurement window cụ thể

### 2. Mỗi metric phải có baseline
KHÔNG đặt target mà không biết hiện tại đang ở đâu. Nếu chưa có baseline → ghi rõ "Baseline TBD - measure for [N] days before setting target."

### 3. Counter-metric bắt buộc
Mỗi primary metric phải có ít nhất 1 counter-metric để đảm bảo không gây hại unintended. Ví dụ: tối ưu DAU đừng làm crash rate tăng.

### 4. Decision criteria TRƯỚC launch
Define Scale/Iterate/Kill threshold **trước** khi launch. Tránh moving goalposts sau khi thấy data.

### 5. Firebase Analytics naming convention (Company-Wide)

**Mọi event PHẢI tuân thủ pattern**: `[screen]_[element]_[action]` hoặc `[screen]_[action]`

**7 loại event format:**
- Screen view: `[screen]_scr` (vd `video_generation_scr`)
- Element display: `[screen]_[element]_display` (vd `video_generation_result_display`)
- Button click: `[screen]_[element]_btn_click` (vd `video_generation_close_btn_click`)
- Non-button click: `[screen]_[element]_click` (vd `video_generation_play_click`)
- Non-click action: `[screen]_[action]` (vd `video_generation_swipe`)
- Success: `[screen]_[action]_success` (vd `video_generation_save_success`)
- Fail: `[screen]_[action]_fail` (vd `video_generation_save_fail`)

**Quy tắc cứng:**
- snake_case only, max 40 chars
- Screen prefix BẮT BUỘC trên mọi event
- Success/fail là 2 event riêng (KHÔNG dùng param `status`)
- btn_click cho button thật, click cho link/card/icon
- Tránh reserved prefixes: `firebase_`, `google_`, `ga_`
- Params: max 25 params/event, max 25 user properties

Tham khảo `references/firebase-analytics-guide.md` §3 cho quy tắc đầy đủ và `assets/tracking-spec-template.md` cho event catalog.

### 6. Data privacy
- KHÔNG track PII (email, phone, full name, address) trong event params
- Sử dụng user_id pseudonym thay vì email
- Tuân thủ GDPR/Vietnam Decree 13/2023/ND-CP

## Anti-patterns TUYỆT ĐỐI tránh

- ❌ Vanity metrics: "total clicks", "page views" không nói gì về value
- ❌ Metric mơ hồ: "engagement", "user satisfaction" không đo được
- ❌ Đặt target không có baseline → arbitrary
- ❌ Quên counter-metric → tối ưu 1 chiều có thể gây hại khác
- ❌ Báo cáo data dump: liệt kê 50 metric không insight → stakeholder không đọc nổi
- ❌ Cherry-pick data: chỉ show metric tăng, giấu metric giảm
- ❌ Confuse correlation với causation: "DAU tăng sau feature X" không có nghĩa X gây ra
- ❌ Chỉ nhìn average: median + p95 + distribution mới nói thật
- ❌ Bỏ qua sample size: 5/10 users không phải 50%, không significant
- ❌ Event tracking sai naming convention → khó query sau này
- ❌ Track PII vi phạm privacy

## Khi user đưa data có sẵn để phân tích

1. **Hiểu context trước**: feature gì, release khi nào, target metric & threshold, segment user
2. **Validate data quality**: sample size đủ chưa, time window phù hợp chưa, có bias không
3. **Đối chiếu với decision criteria**: data có vượt/dưới ngưỡng kill/iterate/scale?
4. **Tìm explanation cho biến động**: tại sao metric tăng/giảm? confounders nào?
5. **Recommend action**: cụ thể, có rationale, có next step

## Khi nào KHÔNG dùng skill này

- User hỏi "DAU là gì" → trả lời ngắn, không cần skill
- User cần code SQL phức tạp → BigQuery SQL templates có trong `references/firebase-analytics-guide.md` nhưng custom logic nên để dev/DA viết
- User cần A/B testing setup → dùng skill `po-ab-testing` (sắp build)
- User cần định nghĩa OKR/North Star Metric cấp company → đây là strategic work, không phải skill này
- User cần ML model, prediction, anomaly detection → ngoài scope skill

## Định dạng output

- Document: **Markdown, tiếng Anh**
- Lưu vào `exports/po/<app>/` với tên:
  - `Metrics_Plan_<FeatureName>_<YYYYMMDD>.md`
  - `Tracking_Spec_<FeatureName>_<YYYYMMDD>.md`
  - `Analysis_Report_<FeatureName>_<YYYYMMDD>.md`
  - `Product_Health_Report_<Period>_<YYYYMMDD>.md`
- Trong document: dùng bảng Markdown nhiều, ít prose dài

## Self-review trước khi giao

Sau khi fill xong template, ĐỌC `references/quality-checklist.md` và chạy đúng checklist cho loại document đó:
- Metrics Plan → Checklist A
- Tracking Spec → Checklist B
- Analysis Report → Checklist C
- Stakeholder Report → Checklist D
- Dùng nhiều skill cùng lúc (po-prd-writer + po-metrics-analysis) → Checklist E (cross-document consistency)

Critical fails phải SỬA trước khi giao user. Important fails ưu tiên sửa hoặc nói rõ với user. Anti-patterns phát hiện được → flag và đề xuất fix.

## Version & Changelog

- **v1.0** (May 28, 2026): Initial version. Built for farming app B2C using Firebase Analytics + BigQuery.
- **v1.1** (May 28, 2026): UPDATED event naming convention to company-wide standard (7 event types).
- **v1.2** (May 28, 2026): ADDED comprehensive parameter naming convention (8 groups).
- **v1.3** (Jun 2, 2026): RESTRUCTURED từ single-file monolith thành multi-file skill folder (SKILL.md + assets/ + references/) theo progressive disclosure. Nội dung body không đổi; cross-references cập nhật sang đường dẫn file thực.
