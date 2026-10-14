<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- Phần 3: ID System — tách từ po-agent-bundle.md (skill gốc po-prd-writer) -->

# PHẦN 3: ID System & Cross-Reference

> **Khi nào dùng**: Đọc phần này khi cần đánh ID cho requirements (FR, BR, TC, AC), khi update version PRD và cần renumber, hoặc khi validate cross-reference.

---

# ID System & Cross-Reference Patterns

Đọc file này khi cần hiểu chi tiết hệ thống ID và cách cross-reference trong PRD.

## Tại sao cần ID hệ thống

PRD này hand-off cho Eng, Design, QA. Mỗi requirement phải có ID để:

1. **QA test theo FR-ID**: "Test FR-S2-07 — smart default rule"
2. **Design fix theo §15 note**: "Per §15.4, delete Method radio group"
3. **Bug report tham chiếu rõ**: "Bug: FR-S3-04 says Method row must be removed but still appears"
4. **Change log truy vết được**: "v4.0 removed FR-S2-04 (random measurement_type)"
5. **AC test theo TC**: "AC-S2-04 verifies TC-09 → TC-10 transition"

Không có ID → discussion rất khó scope, "phần này", "section kia" mơ hồ.

---

## Danh sách ID prefixes

### FR — Functional Requirements
Format: `FR-S<screen>-<NN>` (NN là 2 chữ số, zero-padded)

Ví dụ:
- `FR-S1-01` — Requirement đầu tiên cho Screen 1 (Home Dashboard)
- `FR-S2-15` — Requirement thứ 15 cho Screen 2 (Add)
- `FR-S6-08` — Requirement thứ 8 cho Screen 6 (Detail)

**Quy tắc đánh số:**
- Bắt đầu từ 01 mỗi screen mới
- Đánh liên tục, không skip số khi delete (sẽ gây confusion với version cũ)
- Khi remove FR ở version mới → ghi rõ trong change log "Removed FR-S2-04" nhưng KHÔNG tái sử dụng số đó cho FR khác
- Sub-requirements (nếu FR phức tạp) có thể dùng `FR-S2-01a`, `FR-S2-01b`

### BR — Business Rules
Format có 2 loại:
- `BR-<NN>` cho general rules: `BR-01`, `BR-02`
- `BR-<X><NN>` cho category-specific rules:
  - `BR-V01...BR-Vnn` — Validation rules
  - `BR-U01...BR-Unn` — Unit/locale rules
  - `BR-D01...BR-Dnn` — Data/Delete rules
  - `BR-L01...BR-Lnn` — Legal/disclaimer rules

**Khác biệt FR vs BR:**
- FR = behavior cụ thể trên 1 screen → "FR-S2-12: If glucose ≤ 50, Save MUST trigger modal"
- BR = rule cross-screen, cross-feature → "BR-V04: Glucose ≤ 50 triggers crisis confirm" (áp dụng ở cả S2 và S4)

Khi BR và FR overlap → BR là "rule of thumb" tổng quát, FR là implementation cụ thể trên 1 screen. FR có thể reference BR.

### TC — Test Cases
Format: `TC-<NN>` (numeric, continuous across all test case categories)

Ví dụ:
- `TC-01...TC-16` — Boundary cases
- `TC-17...TC-21` — Unit conversion cases
- `TC-22...TC-27` — HbA1c cases
- `TC-28...TC-31` — Crisis threshold cases
- `TC-32...TC-38` — Smart default cases

**Quy tắc:**
- Đánh liên tục từ TC-01 → TC-N (không reset mỗi category)
- Mỗi TC là 1 row trong test table, có expected output cụ thể
- Khi AC reference TC: "Verify with TC-06" hoặc "test TC-09 → TC-10 transition"

### AC — Acceptance Criteria
Format: `AC-S<screen>-<NN>` (giống FR nhưng prefix AC)

Hoặc cho AC cross-screen: `AC-<Category>-<NN>` (vd `AC-OFF-01` cho Offline)

**Quy tắc:**
- AC mô tả HOW VERIFY (cách test), FR mô tả WHAT (behavior)
- AC nên reference FR hoặc TC: "AC-S2-04: ... verify TC-09 → TC-10 transition"
- 1 FR có thể có 1-3 AC tương ứng

### S — Screen IDs
Format: `S<N>` (single digit thường đủ, nếu >9 screens thì S10, S11...)

Ví dụ: `S1` Home Dashboard, `S2` Add Blood Sugar, ..., `S6` Detail

Screen IDs xuất hiện ở:
- §3 Screen Inventory (định nghĩa)
- §6 User Flows (mô tả navigation S1→S2→S3)
- §7 Functional Requirements (FR-S<n>-<nn>)
- §14 Acceptance Criteria (AC-S<n>-<nn>)
- §15 Notes for Design Review (chỉ rõ screen nào cần update)

---

## Cross-reference patterns

### Section references
Dùng `§` (U+00A7) trước số section:
- `§5.2` — Section 5.2
- `§5.6 + §10.1` — Kết hợp 2 references
- `§7.3 (S3 specs)` — Có thể annotate trong ngoặc

### FR/BR/TC/AC references
Inline trong text:
- "per FR-S2-07"
- "see §8.4 pseudocode"
- "verify TC-09 → TC-10 transition" (mũi tên cho transition)
- "test TC-32 and TC-33" (and cho multiple)
- "per §10.5 (Pill Label)" (annotate trong ngoặc)

### Trong tables
- Cột "Source" của Recommendations Copy: ref §X.Y
- Cột "Notes" của TC: ref related TC ("same value as TC-10/11 below, DIFFERENT zone")
- Cột "Threshold table" của Dispatch Summary: ref §5.2, §5.3...

### Trong italic commentary
> *Why this matters: a reading of 130 mg/dL is Normal after a meal but indicates Pre-diabetes when fasting (§5.2 vs §5.4).*

---

## Anti-patterns trong cross-reference

❌ **Vague reference**: "as mentioned above", "see earlier section" → luôn nói số cụ thể
❌ **Stale reference sau renumber**: ref §5.6 nhưng section đã chuyển thành §5.7 → phải update toàn doc
❌ **Reference không tồn tại**: "per FR-S2-99" trong khi chỉ có đến FR-S2-15 → check trước khi save
❌ **Reference cùng chính nó**: §7.2 nói "per §7.2" → tautology
❌ **Reference quá xa**: §1.5 nói "per §13.5" trong khi reader chưa biết §13 → nếu quan trọng thì restate inline

---

## Cách Claude validate cross-reference

Trước khi finalize PRD, scan các pattern sau và kiểm tra:

1. `§\d+(\.\d+)?` — section ref, check section đó có tồn tại
2. `FR-S\d+-\d+` — FR ID, check section §7 có FR đó
3. `BR-[A-Z]?\d+` — BR ID, check section §9 có BR đó
4. `TC-\d+` — TC ID, check section §13 có TC đó
5. `AC-(S\d+|[A-Z]+)-\d+` — AC ID, check section §14 có AC đó
6. `S\d+` — Screen ID, check section §3 có screen đó

Nếu detect ref đến ID không tồn tại → flag lỗi với user.

---

## Khi update version (v3.0 → v4.0)

Khi user yêu cầu update PRD:

1. **Đừng xóa FR ID** nếu requirement bị remove → ghi vào change log "REMOVED FR-S2-04 (random measurement_type)"
2. **Đừng tái sử dụng FR ID** đã removed
3. **Renumber section** chỉ khi cấu trúc thay đổi lớn (vd thêm/xóa section level 1) → khi đó phải update TOÀN BỘ cross-reference
4. **Trong change log §17.3**, dùng markers rõ: `REMOVED`, `ADDED`, `REPLACED`, `RENAMED`
5. **Update Document Metadata** ở đầu: bump version, update Last Updated, thêm "Major change in vX.Y"

Ví dụ change log entry tốt:
> v4.0 | May 18, 2026 | Product Team | Product simplification: (1) REMOVED measured_at_location field. (2) REMOVED random measurement_type. (3) REPLACED Fasting-always default with time-window smart default (§4.4). Renumbered §5.6 → §5.7 → §5.6. Reduced WHEN MEASURED to 4 chips. Added TC-32..TC-38 for smart-default.

---
