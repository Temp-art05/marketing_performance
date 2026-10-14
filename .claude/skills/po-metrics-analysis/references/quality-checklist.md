<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- C8 — tách từ po-agent-bundle.md (skill po-metrics-analysis v1.3) -->

# Quality Checklist — Metrics Documents

Đọc file này khi finalize Metrics Plan, Tracking Spec, Analysis Report, hoặc Stakeholder Report. Mỗi loại document có checklist riêng.

---

## A. Metrics Plan Checklist

### Critical (BẮT BUỘC pass)

- [ ] **C1**: Có **hypothesis** rõ ràng format "If we X, then Y will change by Z, because W"
- [ ] **C2**: Primary metric chỉ có **MỘT**, không phải nhiều
- [ ] **C3**: Primary metric có **math definition** chính xác (không mơ hồ)
- [ ] **C4**: Có **baseline** từ data, không phải "TBD" hay arbitrary
- [ ] **C5**: Có **target** với rationale (benchmark, internal model, competitor data)
- [ ] **C6**: Có **measurement window** cụ thể (≥4 tuần thường)
- [ ] **C7**: Có ≥3 **secondary metrics** không được regress
- [ ] **C8**: Có ≥1 **counter-metric** không được optimize
- [ ] **C9**: Có **decision criteria** Scale/Iterate/Kill TRƯỚC launch
- [ ] **C10**: Có ≥3 **segments** để analyze (platform, geo, cohort, tier)
- [ ] **C11**: Có **analysis cadence** với owner (Day 1, 7, 14, 28)
- [ ] **C12**: Liệt kê **risks & mitigations** ≥3 items

### Important

- [ ] **I1**: Hypothesis có **evidence supporting** (data, research, competitor)
- [ ] **I2**: Target có **range** (min acceptable vs aspirational) chứ không chỉ 1 số
- [ ] **I3**: Có **statistical significance threshold** (p<0.05, sample N tối thiểu)
- [ ] **I4**: Secondary metric có **acceptable range** rõ ràng (vd "no >5% regression")
- [ ] **I5**: Có **dependencies list** với owner và status

### Anti-patterns

- ❌ "Engagement" làm primary metric (mơ hồ)
- ❌ Target = "tăng nhiều" hoặc không có số
- ❌ Không có baseline
- ❌ Decision criteria define sau launch
- ❌ Quên counter-metric
- ❌ Quên segment analysis plan

---

## B. Tracking Spec Checklist

### Critical — Event Naming

- [ ] **C1**: Mọi event tuân thủ **naming convention** snake_case, max 40 chars
- [ ] **C2**: **Mọi event có screen prefix** (`[screen]_...`) — KHÔNG có event nào thiếu prefix
- [ ] **C3**: Screen view events dùng suffix `_scr` (không phải `_screen_view` hay `_opened`)
- [ ] **C4**: Element display events dùng suffix `_display`
- [ ] **C5**: Button click dùng `_btn_click`, non-button click dùng `_click`
- [ ] **C6**: Success/fail là **2 event riêng** (`_success` / `_fail`), KHÔNG dùng param `status`
- [ ] **C7**: Non-click actions (swipe, scroll, drag) dùng verb gốc, không `_clicked`
- [ ] **C8**: Không dùng **reserved prefixes** (firebase_, google_, ga_)

### Critical — Parameter Naming

- [ ] **C9**: Mọi param name dùng **snake_case**, max 40 chars
- [ ] **C10**: Entity ID dùng **`<entity>_id`** (vd `video_id`, `crop_id`), KHÔNG dùng generic `id`
- [ ] **C11**: Param thời gian có **unit suffix** (`_ms` hoặc `_seconds`), KHÔNG dùng `duration` trần
- [ ] **C12**: Boolean params có prefix **`is_`/`has_`/`was_`/`should_`** (không `_flag`, `_bool`, `_yn`)
- [ ] **C13**: KHÔNG có param `success: bool` hay `status: success|fail` (đã có _success/_fail events)
- [ ] **C14**: `_fail` events BẮT BUỘC có param **`failure_reason`** (enum) và `error_code`
- [ ] **C15**: Enum params có **controlled vocabulary** liệt kê đủ values + có value `other`/`unknown`
- [ ] **C16**: KHÔNG dùng anti-pattern names (`data`, `info`, `details`, `temp`, `param1`, `x`)
- [ ] **C17**: KHÔNG có PII trong bất kỳ event nào (email, phone, name, address, free-text input)
- [ ] **C18**: KHÔNG duplicate Firebase auto-sent params (`app_version`, `os_version`, `platform`, `country`)

### Critical — Spec Completeness

- [ ] **C19**: Mỗi event có **trigger** rõ ràng (khi nào fire)
- [ ] **C20**: Mỗi event có **params list** đầy đủ (max 25)
- [ ] **C21**: Mọi param có **type** (string/int/bool/double) và **example values**
- [ ] **C22**: Có **user properties list** với update trigger
- [ ] **C23**: Có **validation checklist** cho dev và PO (DebugView, sample size, parameter values)
- [ ] **C24**: Có **funnel definitions** để build trong Firebase Console
- [ ] **C25**: Có **privacy & compliance checklist** (GDPR, opt-out, data retention)
- [ ] **C26**: Có **dashboard list** với tool và key widgets

### Important

- [ ] **I1**: Events cover đủ 7 loại pattern (scr, display, btn_click, click, action, success, fail) áp dụng được cho screen
- [ ] **I2**: Screen names consistent across project (không lẫn `video_gen` và `video_generation`)
- [ ] **I3**: Entity prefix consistent (vd luôn dùng `video_id`, không lẫn `vid_id`)
- [ ] **I4**: Có **failure events** với enum failure_reason đầy đủ values
- [ ] **I5**: Có **BigQuery SQL templates** cho deep analysis
- [ ] **I6**: User properties trong limit 25 (audit current usage)
- [ ] **I7**: Có **sign-off table** cho Eng/QA/PO/Data
- [ ] **I8**: Standard params (`source`, `time_to_action_ms`, `is_first_time`) dùng đúng tên chuẩn

### Anti-patterns

#### Event naming
- ❌ Event thiếu screen prefix (`play_click` thay vì `video_generation_play_click`)
- ❌ Dùng `_screen_view` thay `_scr`
- ❌ Mix `_btn_click` và `_click` không nhất quán
- ❌ Success/fail dùng 1 event với param `status`
- ❌ Past tense verb (`_clicked`, `_displayed`, `_succeeded`)
- ❌ camelCase (`clickButton`), UPPERCASE (`PLAY_VIDEO`), kebab-case (`video-play`)
- ❌ Reserved event names (`screen_view` custom)
- ❌ Inconsistent screen abbreviation (`video_gen` vs `video_generation`)

#### Param naming
- ❌ Generic `id` thay vì `<entity>_id`
- ❌ `duration` trần (thiếu `_ms`/`_seconds` suffix)
- ❌ `success: bool` hoặc `status: success|fail`
- ❌ Boolean không có prefix (`first_time` thay vì `is_first_time`)
- ❌ Anti-pattern names: `data`, `info`, `details`, `temp`, `param1`, `x`
- ❌ Duplicate Firebase auto-sent params
- ❌ Track PII trong params
- ❌ Free-text param values không enum
- ❌ Param `null` hoặc `undefined` allowed
- ❌ `_fail` event thiếu `failure_reason`

#### Process
- ❌ Quên validation step
- ❌ Quên opt-out mechanism
- ❌ Dev tự thêm enum value mới không update spec

---

## C. Analysis Report Checklist

### Critical

- [ ] **C1**: Có **TL;DR recommendation** ở đầu (Scale/Iterate/Kill)
- [ ] **C2**: Có **confidence level** với reasoning
- [ ] **C3**: Có **next steps** concrete với owner
- [ ] **C4**: Recap **hypothesis** và compare predicted vs actual
- [ ] **C5**: Primary metric có **baseline, target, observed, delta**
- [ ] **C6**: Có **statistical significance** statement (p-value hoặc "directional only")
- [ ] **C7**: Có **sample size** cho cohort
- [ ] **C8**: Có **context & caveats** (confounders, holidays, parallel releases)
- [ ] **C9**: Secondary metrics đầy đủ với status (OK/Warning/Bad)
- [ ] **C10**: Có **segment analysis** (≥3 segments: platform, geo, cohort)
- [ ] **C11**: Decision **justify với data**, ref decision criteria từ Plan
- [ ] **C12**: Có **what we got wrong** section (honest, không hide)

### Important

- [ ] **I1**: Có **funnel analysis** với drop-off insights
- [ ] **I2**: Có **retention curve** so sánh baseline vs post-launch
- [ ] **I3**: Có **qualitative signals** (reviews, support tickets, social)
- [ ] **I4**: Có **deep dives** cho warnings/anomalies
- [ ] **I5**: Có **open questions** cho next iteration

### Anti-patterns

- ❌ Recommendation nhưng không justify với data
- ❌ Chỉ show metric tăng, giấu metric giảm (cherry-pick)
- ❌ Không nhắc confounders
- ❌ Không nhắc sample size hoặc significance
- ❌ Generic recommendations không actionable
- ❌ Không có segment analysis
- ❌ Hide "what we got wrong"

---

## D. Stakeholder Report Checklist

### Critical

- [ ] **C1**: Có **TL;DR đầu** 3-5 bullets, đọc 30s hiểu
- [ ] **C2**: Có **headline metrics table** với WoW, MoM, YoY delta
- [ ] **C3**: Có **What's Working** ≥2 items với specific numbers
- [ ] **C4**: Có **What's NOT Working** ≥1 item (honest, không hide)
- [ ] **C5**: Issues có **hypothesis + action + owner + deadline**
- [ ] **C6**: Có **shipped this period** table
- [ ] **C7**: Có **in flight** table cho next period
- [ ] **C8**: Có **risks & asks** section (cụ thể cái cần help)
- [ ] **C9**: **Audience-appropriate** language (CEO không cần technical detail, team không cần basic glossary)
- [ ] **C10**: Có **data sources** để stakeholder verify

### Important

- [ ] **I1**: Có **experiment status** table (A/B tests đang chạy)
- [ ] **I2**: Có **deep dive** 1 topic của period (rotate mỗi report)
- [ ] **I3**: Visualize bằng table thay vì paragraph dài
- [ ] **I4**: Comparison vs same period last year (nếu có)
- [ ] **I5**: Glossary cho leadership audience

### Anti-patterns

- ❌ Data dump 50 metrics không insight
- ❌ Hide bad news
- ❌ Vague asks ("need more resources" → cụ thể bao nhiêu, để làm gì)
- ❌ Không nhắc tiến độ vs OKR/target
- ❌ Same template every report (deep dive không rotate)
- ❌ Technical jargon cho non-technical audience

---

## E. Cross-Document Consistency

Nếu user dùng nhiều skill (po-prd-writer + po-metrics-analysis), check consistency:

- [ ] **Metrics Plan §2 primary metric** = PRD §1.5 first metric
- [ ] **Metrics Plan §6 decision criteria** = PRD §3.4 decision criteria
- [ ] **Tracking Spec §3 events** = PRD §11 Analytics Events table
- [ ] **Analysis Report §2 metric** ref đúng Metrics Plan
- [ ] **Stakeholder Report headline metrics** consistent với Metrics Plan primary/secondary

Nếu phát hiện mismatch → flag với user và đề xuất sync.

---

## Cách dùng checklist khi self-review

1. Sau khi viết xong document, scroll qua checklist của loại document đó
2. Đánh dấu pass/fail từng item
3. Critical fails → SỬA trước khi giao user
4. Important fails → ưu tiên sửa, ít nhất nói rõ với user
5. Anti-patterns detected → flag và đề xuất fix

## Cách dùng checklist khi review document của user

1. Đọc document user gửi
2. Đối chiếu checklist
3. Trả về dạng:
   ```
   ## Critical Issues (must fix)
   - C2 fail: Có 3 primary metrics — phải chọn 1
   - C9 fail: Decision criteria thiếu Kill threshold
   
   ## Important Issues (should fix)
   - I3 fail: Không nói statistical significance
   - I5 fail: Thiếu dependencies list
   
   ## Anti-patterns
   - Primary metric "engagement" mơ hồ
   - Target không có rationale
   
   ## Recommendations
   [Concrete suggestions with examples]
   ```

---
