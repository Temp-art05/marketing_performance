<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- Phần 4: Section Patterns — tách từ po-agent-bundle.md (skill gốc po-prd-writer) -->

# PHẦN 4: Section Patterns (Cách viết từng section khó)

> **Khi nào dùng**: Đọc phần này trước khi viết các section quan trọng. Mỗi section có pattern riêng - không phải tất cả viết như nhau.

---

# How to Write Each PRD Section

Đọc file này khi viết những section khó hoặc dễ viết sai trong PRD. Mỗi section có pattern riêng.

---

## §1.1 Purpose — Viết NGẮN, KHÔNG sa vào background

Pattern chuẩn (1 đoạn, 2-3 câu):
> "This document defines the product requirements, technical specifications, and user flows for the [Feature] within the [Product] mobile application. The [Feature] enables users to [primary capability], with [differentiator]."

❌ Đừng viết: "Diabetes is a chronic disease..." (đó là background)
✅ Viết: "This doc defines requirements for X. X enables users to Y."

---

## §1.2 Background — Có 2 đoạn rõ ràng

**Đoạn 1**: Context kinh doanh/user. Có data nếu có. 3-5 câu.

**Đoạn 2**: Why this version. Nếu là v2, v3, v4 → giải thích thay đổi lớn vs version trước.

Ví dụ tốt:
> "Diabetes and pre-diabetes affect a growing portion of the population. Regular self-monitoring of blood glucose (SMBG) is essential...
>
> This version (v2.0) replaces the previous clinical-style Method selector (OGTT/FPG/HbA1c) with a user-friendly measurement_type because research showed non-clinician users did not understand OGTT terminology."

---

## §1.3 Goals and Non-Goals — Cấu trúc list rõ ràng

**Goals** (4-6 items, không quá 7):
- Mỗi goal bắt đầu bằng động từ user-centric: "Let users...", "Classify...", "Provide...", "Surface...", "Support..."
- KHÔNG bắt đầu bằng "Build", "Implement" (tech-centric)
- Mỗi goal mô tả 1 capability, không gộp 2-3 thứ

**Non-Goals** (3-5 items):
- Mỗi non-goal có rationale ngắn HOẶC ref đến version sau
- Ví dụ: "Continuous glucose monitor (CGM) Bluetooth integration (planned for v3)"
- Đừng list những thứ hiển nhiên không làm — chỉ list những thứ user/team có thể nhầm là trong scope

---

## §1.4 Target Users — Bảng persona

Tối thiểu 2 persona, tối đa 5. Mỗi persona có 3 cột:

| **Persona** | **Profile** | **Primary Need** |

- **Persona**: tên ngắn gọn (vd "Diagnosed Diabetic", "Pre-diabetic / At-Risk")
- **Profile**: 1 câu mô tả ai họ là (age range, condition, context)
- **Primary Need**: cái họ cần TỪ feature này (không phải life goal chung)

Anti-pattern: gộp "Power user" và "New user" → không actionable. Phải chia theo use case thực sự khác nhau.

---

## §1.5 Success Metrics — BẮT BUỘC đo lường được

Mỗi metric phải có:
1. Tên metric cụ thể (không "engagement")
2. Số target (≥, ≤, hoặc ≥X%)
3. Optional: cohort (vd "users who log ≥1 entry")

Pattern:
- `D7 retention of [cohort]: ≥40%`
- `Median entries per active user per week: ≥3`
- `Time-to-X: ≤25 seconds (p50)`
- `Non-default selection rate: ≥70% (critical — confirms [why this matters])`
- `Error rate: <1% of total entries`

Có ít nhất 1 metric về:
- Adoption/Retention
- Engagement/Usage
- Performance/Speed
- Quality/Error
- Specific feature health (vd "non-default selection rate")

---

## §3 Screen Inventory — Cốt lõi của hand-off doc

Bảng 3 cột: # / Screen / Purpose

Mỗi screen Purpose cần trả lời:
- Đây là entry point hay screen sâu hơn trong flow?
- User làm gì ở đây? (verb: log / view / edit / explore)
- Show data gì?

Pattern hay: "Entry point. Shows X with latest reading, status badge, mini trend chart, and quick Add."

Đừng viết purpose dài 3 câu — tối đa 1 câu/screen.

---

## §4-5 Domain Logic — Khi nào có, khi nào không

**CÓ §4-5 khi**: feature có business logic phức tạp về classification, calculation, type dispatch, threshold mapping. Ví dụ: blood sugar classification, BMI ranges, tier qualification.

**KHÔNG có §4-5 khi**: feature thuần UI/UX flow, không có dispatch logic. Ví dụ: settings screen, profile edit, simple list.

Khi có §4-5, structure:
- §4: định nghĩa domain concept và types (4.1 list types, 4.2 why we chose this design, 4.3 defaults)
- §5: reference data (5.1 names, 5.2-5.n threshold tables, 5.6 dispatch summary)

§4-5 là phần dễ làm sai nhất → dành thời gian.

---

## §6 User Flows — 3 levels Primary/Secondary/Tertiary

**Primary Flow** (most frequent, optimize for speed):
- 6-10 bullet points
- Mỗi bullet là 1 user action hoặc system response
- Reference fields, screens, rules: "[+ Add]", "S2", "per §4.4"
- Có decision branches (if X, then Y)

**Secondary Flow** (less frequent but important):
- Vd: Edit existing entry
- 4-6 bullets

**Tertiary Flow** (occasional):
- Vd: Review trends, search history
- 4-6 bullets

Đừng viết 1 monolithic flow — chia 3 cấp giúp Eng implement đúng priority.

---

## §7 Functional Requirements — RFC 2119 strict

**Format mỗi row**:
| FR-S2-01 | [Subject] MUST/MUST NOT [verb] [object/condition]. [Additional constraint or reference]. |

**Quy tắc**:
- Subject: noun cụ thể (Glucose input, Save button, Status pill, App)
- Verb: chính xác (display, render, navigate, persist, validate)
- Constraint cụ thể (within 500ms, max 5 tags, ≥44px)
- Reference §X.Y khi cần chi tiết visual hoặc rule

**Pitfall**: lẫn lộn §7 (behavior) và §10 (visual)
- §7: "MUST display the zone Display Name from §5.1" (ref đến content)
- §10: "Pill uses zone.normal color (#10B981) on a 12px radius surface" (visual treatment)

**Order trong §7**: theo screen (§7.1=S1, §7.2=S2...), không theo time hoặc importance.

---

## §7.5 Recommendations Copy Table — Pattern đặc biệt

Nếu feature có copy/messages dispatched theo key (vd zone × measurement_type):

1. Define common rules trước table
2. Bảng 3 cột: Key1 / Key2 / Message
3. Message phải có:
   - Tone phù hợp với severity
   - Clear next action nếu severity warrants
   - Không tự xưng "we"/"our app"
4. Note: "All copy MUST be reviewed by [Medical Advisor / Legal] before launch. Translation requires separate localization pass."

---

## §8.1 Data Model — Field-by-field

Bảng 4 cột: Field / Type / Required / Notes

**Required fields cho mọi entity**:
- `id` (UUID, server-generated)
- `user_id` (UUID, FK)
- `created_at` (datetime, server)
- `updated_at` (datetime, refreshed on edit)
- `deleted_at` (datetime, nullable, for soft delete)

**Domain-specific fields**: từng field cần ghi rõ
- Type chính xác (UUID, decimal(5,1), enum, array<string>...)
- Required hay không
- Notes: validation, default, server vs client, FK, soft delete behavior

**Anti-pattern**: dùng "string" mơ hồ → phải ghi rõ max length, allowed chars.

---

## §8.4 Pseudocode — Algorithm rõ ràng

Mục đích: Eng đọc xong viết code chạy đúng, kể cả edge case.

**Cấu trúc**:
```
function functionName(inputs):
  // Step 1: [what this step does]
  if [condition]:
    return [special case]
  
  // Step 2: [normalize/transform]
  ...
  
  // Step 3: [main dispatch]
  switch [key]:
    case "type_1":  // §X.Y — source citation
      if [threshold]: return { ... }
```

**Quy tắc**:
- Mỗi step có comment giải thích
- Comment có ref đến §X.Y nguồn (source of truth)
- Edge case xử lý trước main logic (hypoglycemia, crisis, null check)
- Return value structure rõ ràng (zone, banner, etc.)

---

## §9 Business Rules Summary — Tổng hợp tracking

Khác với §7 (theo screen), §9 gom rule cross-cutting để dễ check:

Bảng 3 cột: ID / Topic / Rule

- BR-01...BR-NN: general logic rules
- BR-V01...BR-Vnn: validation rules (overlap with §8.6 but at higher level)
- BR-U01...: unit/locale rules
- BR-D01...: data/delete rules
- BR-L01...: legal/disclaimer rules

**Tip**: viết §9 SAU §7 và §8, gom common rules ra. Đừng cố viết §9 trước → sẽ thiếu.

---

## §10 UI/Design Spec — Tách rõ visual khỏi behavior

**§10 chứa gì**:
- Design tokens (color, typography)
- Component patterns (chip group, color bar, pill)
- Layout specs (3-row card, header/value/status)
- Chart treatment (gradient, axes, tooltip)
- Empty/loading/error states
- Accessibility

**§10 KHÔNG chứa**:
- Business logic (đó là §7-9)
- Threshold values (đó là §5)
- API contract (đó là §8.3)

**Pattern**: §10.1 tokens → §10.2-N components → §10.X states → §10.Y accessibility

---

## §11 Analytics Events — Bảng event + properties

Mỗi event 3 cột: Event Name / Trigger / Properties

**Naming convention**: `<feature>_<action>` (snake_case)
- `bs_add_opened`, `bs_saved`, `bs_deleted`
- `bs_measurement_type_changed`, `bs_unit_switched`

**Properties** liệt kê trong cell, comma-separated:
- `source: home_card │ fab │ detail` (enum với options)
- `value_canonical, unit_entered, measurement_type, zone, tags[], is_backdated`
- Boolean: `caused_zone_change (bool)`

**Coverage**: tối thiểu phải có events cho:
- Open/view screen
- Field changes (mỗi field quan trọng)
- Save success
- Crisis warnings shown
- Edit, Delete
- Tap article/link

---

## §12 Edge Cases & Open Questions — 3 sub-sections

### §12.1 Edge Cases
List bullet, mỗi bullet 1 scenario + expected behavior:
- "Switching X after entering Y: value preserved but reclassified. Show toast '...'"
- "Network unavailable on Save: queue locally, toast '...'"

Coverage tối thiểu:
- Switching context after value entered
- Unit switching
- Timezone change
- Backdating boundary
- Network failure
- Concurrent edits

### §12.2 Risks
Bảng 3 cột: Risk / Impact / Mitigation
- Risk: scenario có thể gây hại
- Impact: hậu quả (misclassification, regulatory, data loss)
- Mitigation: cách giảm thiểu

### §12.3 Open Questions
List bullet, mỗi bullet 1 question + tentative decision + who decides
- "Does X risk being misread as Y? Decision: keep X for now, but flag for Medical Advisor review."
- "Should Z learn from user behavior? Deferred to v2 — too easy to introduce subtle bugs."

---

## §13 Test Cases — Boundary + Conversion + Crisis + Default

Chia thành 5 categories tiêu chuẩn:
1. **13.1 Boundary cases**: ngay tại threshold, ngay dưới, ngay trên
2. **13.2 Unit conversion cases**: cùng value nhưng unit khác
3. **13.3 Type-specific cases**: cho từng dispatch type
4. **13.4 Crisis/Special threshold cases**: extreme values triggering modal
5. **13.5 Smart default cases**: cho mỗi time/condition window

**Bảng 5 cột**: # / Value / Unit / Dispatch_key / Expected

**Quy tắc đánh số**: TC-01 → TC-NN liên tục qua các category, KHÔNG reset.

**Naming row note**: "boundary — fasting threshold" giúp QA hiểu why test này tồn tại.

---

## §14 Acceptance Criteria — Mapping FR → How verify

Mỗi screen có sub-section §14.X chứa AC list.

**Pattern mỗi AC**:
- AC-S2-01: [Specific verifiable statement]. [Reference FR-XX hoặc TC-XX để link với spec/test]

Ví dụ:
- "AC-S2-04: Color bar dot moves in real time as value changes. Switching measurement_type while value is set re-runs classification — verify TC-09 → TC-10 transition (130 mg/dL fasting=diabetes; switch to before_meal → reclassifies to normal, toast appears)."

**Quy tắc**:
- AC khác FR ở chỗ: FR mô tả behavior, AC mô tả cách verify (observable + reproducible)
- 1 FR có thể có 1-3 AC
- AC nên ref cụ thể TC để QA có data sẵn

---

## §15 Notes for Design Review — Communication channel

Mục đích: PO ↔ Designer collaboration trong văn bản.

Mỗi §15.X có 4 phần:
1. **Title**: tên screen + issue (vd "Add Screen (S2) — Field Order")
2. **Current state**: design hiện tại
3. **Desired state**: design sau refactor + rationale
4. **Action for designer**: concrete action (Delete X, Add Y, Rebuild Z frame)

**Quy tắc**:
- Mỗi note có **Action for designer** rõ ràng
- Nếu chỉ flag concern không cần action: ghi "No change needed — flagging for awareness"
- Đừng làm dài hơn 5-6 câu mỗi note → designer skim được

---

## §16 Rollout Plan — Bảng phase

Tối thiểu 4 phase: Alpha / Beta / GA / Next version

Mỗi phase 3 cột: Phase / Audience / Scope

- Alpha: Internal team, mock data
- Beta: 5-10% production, full analytics, monitoring
- GA: 100% rollout
- vNext (planned): future capabilities

---

## §17 Appendix

### §17.1 Glossary
- Mọi acronym lần đầu xuất hiện trong PRD: SMBG, OGTT, FPG, ADA, WHO/IDF
- Domain terms: Fasting, Pre-prandial, Post-prandial
- Units: mg/dL, mmol/L

### §17.2 References
- Authoritative sources (WHO, ADA, internal compliance docs)
- Related internal specs với version number
- External standards

### §17.3 Document Change Log
Bảng 4 cột: Version / Date / Author / Changes

- Mỗi version 1 row
- Changes column dùng markers: REMOVED, ADDED, REPLACED, RENAMED, RESTRUCTURED
- Ref section number khi change ảnh hưởng section cụ thể

---
