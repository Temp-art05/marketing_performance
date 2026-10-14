---
name: po-prd-writer
description: Viết, review hoặc update PRD hand-off 17 section cho feature app mobile (format nội bộ Apero, APR-026) — FR/BR/TC/AC có ID, MUST/MUST NOT (RFC 2119), Screen Inventory, Technical Spec, §11 Analytics Events, Rollout Plan; output PRD tiếng Anh. Dùng khi user nói "viết PRD 17 section", "PRD hand-off cho dev/design/QA", "spec đầy đủ cho feature", "review PRD theo checklist 17 section", "update PRD lên vX.Y". Không dùng cho PRD mức product ngắn (dùng prd-writer) hay metrics plan/tracking spec (dùng po-metrics-analysis).
---
<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- Ghi chú nhập (không thuộc bản gốc): tách từ po-agent-bundle.md; tên gốc `po-prd-writer` (giữ nguyên; trùng nội dung với bản APR-102 nên chỉ cài bản này vì đủ assets/references); Phần 2–5 tách thành file riêng. Output gốc lưu vào `/mnt/user-data/outputs/` (sandbox claude.ai) — trong repo này hỏi user nơi lưu (đề xuất `exports/po/<app>/`, đã gitignore). -->

# Product Requirements Document Writer — Skill File

> **File structure note**: Khi Claude trigger skill này, đọc theo thứ tự: Phần 1 (file này, instructions) → Phần 2 `assets/prd-template.md` khi viết → Phần 3 `references/id-system.md` / Phần 4 `references/section-patterns.md` khi cần chi tiết về ID/section patterns → Phần 5 `references/quality-checklist.md` khi self-review.

## 📑 Mục lục tổng

- **[PHẦN 1: Skill Instructions](#part-1)** — Hướng dẫn chính cho Claude (mindset, workflow, anti-patterns)
- **[PHẦN 2: PRD Template (17 sections)](assets/prd-template.md)** — Template đầy đủ để Claude copy-fill
- **[PHẦN 3: ID System & Cross-Reference](references/id-system.md)** — Hệ thống FR/BR/TC/AC IDs
- **[PHẦN 4: Section Patterns](references/section-patterns.md)** — Hướng dẫn viết từng section khó
- **[PHẦN 5: Quality Checklist](references/quality-checklist.md)** — 20 Critical + 18 Important checks

---

<a id="part-1"></a>

# PHẦN 1: Skill Instructions

# Product Requirements Document Writer

Skill này giúp Claude viết PRD chất lượng hand-off cho Product Owner, theo đúng format chuẩn của công ty (17 sections, traceable IDs, MUST/MUST NOT language). Instruction tiếng Việt, output PRD luôn tiếng Anh.

## Triết lý PRD của công ty này

PRD này là tài liệu **hand-off ready** - tức là sau khi viết xong, Engineering biết build gì, Design biết vẽ gì, QA biết test gì, mà không cần PO giải thích thêm. Khác với startup PRD ngắn gọn, PRD ở đây có structure đầy đủ vì:

- Có Designer riêng → cần section UI/Design Spec với design tokens
- Có QA riêng → cần Test Cases và Acceptance Criteria có thể trace
- Có Engineer riêng → cần Technical Spec với data model, API, pseudocode
- Có versioning rõ ràng → mỗi iteration phải log lại major changes
- Có mobile screens → cần Screen Inventory + User Flows

## Quy tắc viết bắt buộc

### 1. Ngôn ngữ và phong cách
- **Tiếng Anh** cho toàn bộ PRD output
- Dùng **MUST / MUST NOT / SHOULD / MAY** theo RFC 2119 style trong Functional Requirements và Business Rules
- Dùng *italic block* (in nghiêng) cho commentary giải thích "why this matters" hoặc context
- Không dùng "we will", "we should" — dùng định decisive: "The system MUST...", "User can..."

### 2. ID hệ thống bắt buộc (TRACEABLE)
Mỗi requirement, rule, test, AC phải có ID để cross-reference:

| Prefix | Dùng cho | Format ví dụ |
|---|---|---|
| `FR-S<n>-<nn>` | Functional Requirements per screen | FR-S2-01, FR-S2-15 |
| `BR-<XX>` | Business Rules (general) | BR-01, BR-02 |
| `BR-V<NN>` | Business Rules - Validation | BR-V01, BR-V02 |
| `BR-U<NN>` | Business Rules - Unit/Locale | BR-U01 |
| `BR-D<NN>` | Business Rules - Data/Delete | BR-D01 |
| `BR-L<NN>` | Business Rules - Legal | BR-L01 |
| `TC-<nn>` | Test Cases (numeric, continuous) | TC-01...TC-38 |
| `AC-S<n>-<nn>` | Acceptance Criteria per screen | AC-S2-01 |
| `S<n>` | Screen IDs in inventory | S1, S2...S6 |

### 3. Cross-reference khắp document
Khi nhắc đến rule/section khác, phải ref rõ:
- "per §5.2", "see §10.5", "per FR-S2-07", "test with TC-09"
- "§5.6 + §10.1" (kết hợp nhiều ref)
- Không nói "as mentioned above" — luôn ref section number

### 4. Italic commentary cho "why"
Khi có decision quan trọng, thêm 1 đoạn italic giải thích lý do:
> *Why this matters: a reading of 130 mg/dL is Normal after a meal but indicates Pre-diabetes when fasting. The measurement_type is what makes a glucose number meaningful.*

### 5. Tránh implementation details
PRD nói WHAT và WHY, không nói HOW (trừ Pseudocode trong §8.4 và API contract trong §8.3).

## Workflow viết PRD mới

### Bước 1: Thu thập context (BẮT BUỘC, không bỏ qua)

Trước khi viết, kiểm tra user đã cung cấp đủ thông tin sau chưa. Nếu thiếu phần nào → gom thành 1 lần hỏi (tối đa 6-8 câu hỏi), KHÔNG hỏi rải rác.

**Checklist context bắt buộc:**

- [ ] **Feature name** và 1 câu mô tả
- [ ] **Background/problem**: vấn đề đang giải quyết, có data nếu có
- [ ] **Goals**: 3-5 goals cụ thể
- [ ] **Non-Goals**: 3-5 thứ KHÔNG làm trong scope này
- [ ] **Target users / personas**: ít nhất 2-4 persona
- [ ] **Success metrics**: 4-6 metric đo lường được
- [ ] **Screens involved**: số lượng screen, tên screen, vai trò mỗi screen
- [ ] **Core business logic** (nếu có): classification, calculation, dispatch rules
- [ ] **Data model**: các field chính cần lưu
- [ ] **Major decisions/changes** so với version trước (nếu là iteration)

**Nếu user đưa context rời rạc** (vd: "viết PRD cho daily login reward"), DỪNG LẠI và hỏi đầy đủ. Đừng tự bịa Background, Metrics, Non-Goals.

### Bước 2: Đọc references phù hợp

> **Lưu ý**: các reference dưới đây nằm trong thư mục skill — đọc file tương ứng:
- **Phần 2** (`assets/prd-template.md`) - Template đầy đủ 17 sections để copy-fill
- **Phần 4** (`references/section-patterns.md`) - Section Patterns: chi tiết cách viết từng section khó
- **Phần 3** (`references/id-system.md`) - ID System & Cross-Reference: hệ thống FR/BR/TC/AC ID

### Bước 3: Viết theo thứ tự ưu tiên

Thứ tự đề xuất (không phải thứ tự xuất hiện trong doc):

1. **§1 Overview** (Purpose, Background, Goals/Non-Goals, Target Users, Success Metrics) — định khung
2. **§2 Scope** (In/Out of Scope) — chốt boundary
3. **§3 Screen Inventory** — list S1...Sn
4. **§4-5 Domain Logic** (nếu feature có business rules đặc thù) — classification, calculation, dispatch
5. **§6 User Flows** — Primary, Secondary, Tertiary
6. **§7 Functional Requirements** — per screen, dùng FR-IDs
7. **§8 Technical Specification** — Data Model, API, Pseudocode, Validation, Caching, Privacy
8. **§9 Business Rules Summary** — gom BR-IDs lại
9. **§10 UI/Design Spec** — tokens, layout, chart, accessibility
10. **§11 Analytics Events** — bảng event
11. **§12 Edge Cases & Open Questions**
12. **§13 Test Cases** — TC-IDs
13. **§14 Acceptance Criteria** — AC-IDs, ref FR và TC
14. **§15 Notes for Design Review** — nếu có thay đổi design vs version trước
15. **§16 Rollout Plan** — Alpha → Beta → GA
16. **§17 Appendix** — Glossary, References, Change Log
17. Document Metadata table + TOC ở đầu (viết SAU CÙNG khi biết hết content)

### Bước 4: Self-review

Đối chiếu **Phần 5** (`references/quality-checklist.md`). PRD phải pass:
- Tất cả Critical checks
- Tối thiểu 80% Important checks
- Cross-reference đúng (mọi §X.Y, FR-XX, TC-XX, AC-XX có thật)

### Bước 5: Xuất file và đề xuất next step

- Lưu file `.md` vào `exports/po/<app>/` với tên `PRD_<FeatureName>_v<X.Y>_<YYYYMMDD>.md`
- Đề xuất:
  - Convert sang `.docx` để share team (gợi ý dùng docx skill)
  - Break thành user story cho Jira (gợi ý `po-user-story` skill - sắp build)
  - Setup analytics tracking (gợi ý `po-metrics-analysis` skill)

## Khi user đưa PRD có sẵn để review/update

### Update existing PRD (version bump)
Khi user nói "update PRD này lên v4.1" hoặc "thêm feature X vào PRD":

1. Đọc PRD hiện tại
2. Identify các section bị ảnh hưởng
3. Update section đó + cập nhật:
   - **Document Metadata**: bump version, update "Last Updated", thêm dòng "Major change in vX.Y"
   - **§17.3 Change Log**: thêm row mới ghi rõ changes
   - **Cross-references**: nếu thêm/xóa section, renumber và update mọi §X.Y reference
   - **§15 Notes for Design Review**: nếu thay đổi design, ghi rõ action cho designer
4. Tracked changes mindset: ghi rõ REMOVED / ADDED / REPLACED, không lặng lẽ thay đổi

### Review PRD chất lượng
1. Đọc PRD
2. Đối chiếu **Phần 5** (`references/quality-checklist.md`)
3. Phân loại issue: Critical / Important / Nice-to-have
4. Đưa concrete suggestion với ref section cụ thể, không nói "section X cần improve"

## Anti-patterns TUYỆT ĐỐI tránh

- ❌ Viết PRD mà thiếu Document Metadata, TOC, hoặc Change Log
- ❌ Không dùng MUST/MUST NOT, dùng "should" mơ hồ
- ❌ Functional Requirements không có ID (FR-S2-01...)
- ❌ Test Cases và Acceptance Criteria không cross-reference được
- ❌ Trộn lẫn UI spec vào Functional Requirements (tách §7 behavior, §10 visual)
- ❌ Business Rules viết rải rác trong §7 thay vì gom vào §9
- ❌ Edge Cases chỉ có happy path
- ❌ Quên Open Questions — feature nào cũng có decision pending
- ❌ Không có Notes for Design Review khi đang iterate design
- ❌ Quên §16 Rollout Plan
- ❌ Hardcode reference cũ khi update version (vd nhắc tới §5.6 sau khi đã renumber)

## Khi nào KHÔNG dùng skill này

- User chỉ hỏi "PRD là gì" → trả lời ngắn, không cần skill
- User cần user story Jira chi tiết với Gherkin AC → dùng `po-user-story` (sắp build)
- User cần roadmap cấp product → dùng `po-roadmap-planning` (sắp build)
- User cần pitch deck cho stakeholder → đây không phải PRD, là pitch
- User cần feature 1-pager ngắn (1 trang brief) → đây là Lean Canvas/RFC, không phải full PRD này

---

---

# 📌 Footer — Hướng dẫn cuối

## Tóm tắt workflow khi Claude trigger skill này

1. **Đọc Phần 1** (Instructions — file này) - hiểu mindset và rules
2. **Thu thập context** từ user (theo checklist trong Phần 1)
3. **Copy template từ Phần 2** (`assets/prd-template.md`) và fill từng section
4. **Tham khảo Phần 3 (ID System)** (`references/id-system.md`) khi đánh FR/BR/TC/AC IDs
5. **Tham khảo Phần 4 (Section Patterns)** (`references/section-patterns.md`) khi viết section khó
6. **Self-review bằng Phần 5 (Checklist)** (`references/quality-checklist.md`) trước khi giao user
7. **Lưu file** vào `exports/po/<app>/PRD_<FeatureName>_v<X.Y>_<YYYYMMDD>.md`

## Version & Changelog

- **v1.0** (May 28, 2026): Initial combined version with examples
- **v1.1** (May 28, 2026): Removed examples section to keep skill focused on instructions only
