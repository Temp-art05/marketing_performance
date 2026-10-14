---
name: use-case-writer
description: |
  Sinh Use Case specification theo template IT BA chuẩn 13-field (Karl Wiegers / IIBA), best
  practice Cockburn (coffee-break test, goal levels). Output English Markdown, 2-column table,
  chạy 20-point quality checklist.

  Dùng khi user cần: "viết use case", "viết UC", "đặc tả use case", "draft UC", "use case
  specification", "phân tích UC scope", "split feature thành use case", "review UC", "viết
  normal course / alternative course / exceptions", "define actors", "write a use case",
  "turn this feature/PRD into UCs". Cũng trigger khi user paste feature/BRD/PRD và bảo tách UC.

  KHÔNG dùng cho: User Story Agile (dùng user-story-ac-writer), PRD/SRS (dùng prd-writer /
  srs-writer), hay UML diagram.
license: MIT
version: 1.0.0
---

<!-- Nguồn: AI Knownledge APR-229 PO Copilot, owner Công Hồ Thành (CongHT), nhập 2026-10-14. Output tài liệu → exports/po/<app>/ -->

# Use Case Writer

> Skill trong **PO Document Skill Set**. Pipeline:
> ask-why-ba → prd-writer → **use-case-writer** → user-story-ac-writer → srs-writer → srs-to-prototype

Giúp IT BA **scope, phân tích, đặc tả Use Case** bằng English Markdown theo template 13-field
(Wiegers/IIBA), kết hợp Cockburn "Writing Effective Use Cases" và IIBA BABOK. Normal/Alternative/
Exception courses của UC feed thẳng vào section **Flow** của SRS.

## Output rules (không thương lượng)
1. **Ngôn ngữ:** UC luôn viết bằng **English** (dù user chat tiếng Việt). Chat với user thì
   theo ngôn ngữ user.
2. **Format:** Markdown, 2-column table.
3. **Mode:** Sequential — sinh từng section, **dừng chờ user confirm** trước khi đi tiếp. Không
   dump cả UC 1 lần trừ khi user yêu cầu "cho hết luôn".

## Workflow 4 bước
```
1 CLASSIFY  → xác định mode
2 SCOPE     → 4 scoping rule + coffee-break test
3 WRITE     → điền 13 field, TỪNG SECTION MỘT
4 VALIDATE  → chạy 20-point checklist trước bàn giao
```

## Bước 1 — Classify & chọn mode
| Mode | Signal | Action |
|---|---|---|
| A: Viết mới từ feature | paste feature/BRD/PRD, "viết UC cho X" | Scope → Write sequential |
| B: Split feature thành UC list | "tách UC list", "cần bao nhiêu UC", upload PRD lớn | Scope kỹ → xuất **UC List trước**, hỏi viết UC nào chi tiết |
| C: Refine/review UC có sẵn | paste UC + "review", "đủ chưa" | Bỏ qua Scope → Validate |
| D: Viết 1 section cụ thể | "viết Normal Course cho UC này" | Đọc context → nhảy đúng phần Write |

**Golden rule:** input mơ hồ (1 dòng) → **HỎI trước, không bịa.** Tối đa 3 câu: primary actor
ai? goal cụ thể? thuộc system/module nào?

## Bước 2 — Scope (dễ sai nhất)
**Rule 1 — Coffee-break test:** xong UC, actor nghỉ được mà không thấy dở dang? Không → quá
thấp (sub-function), gộp lại.
**Rule 2 — Goal level:** Summary (cloud, nhiều session) = quá cao ⛔ · **User-goal (sea level)
✅** = 1 actor, 1 session, 1 business goal · Sub-function (fish) = bước nhỏ trong UC khác → Includes.
**Rule 3 — One Actor, One Goal, One Session.** 2 goal → tách 2 UC.
**Rule 4 — System Boundary:** UC mô tả tương tác actor↔system, KHÔNG mô tả nội bộ hệ thống.

Mode B — 3 kỹ thuật tìm UC: Goal-driven (top-down) · Event-driven (external+internal trigger)
· CRUD-driven (mỗi entity: Create/Read/Update/Delete). Xuất **UC List table** rồi hỏi viết UC nào.

## Bước 3 — Write, từng section
**CRITICAL:** sinh 1 nhóm section rồi **STOP hỏi confirm**. 5 nhóm theo thứ tự:
1. Identification + Actor + Description
2. Pre/Postconditions + Priority + Frequency
3. Normal Course of Events
4. Alternative Courses + Exceptions
5. Includes + Special Req + Assumptions + Notes/Issues

Template + hướng dẫn điền: `references/template-guide.md`, `references/writing-style.md`,
`assets/uc-template.md`.

Field rules chính: UC ID `UC-<module>-<seq>`; UC Name = **Verb + Object** (active); Actor cụ
thể (không "User"); Precondition verifiable; Postcondition = trạng thái sau khi thành công;
Normal Course = numbered, 1 action/step, **KHÔNG if/else/loop nhúng** (đưa sang Alt/Exception).

## Bước 4 — Validate 20-point
**LUÔN chạy** trước bàn giao. Nhóm: Scope & Identification (5) · Actor & Context (3) · Pre/Post
(3) · Normal Course (4) · Alternative & Exception (3) · Completeness (2). Chi tiết + ví dụ
pass/fail: `references/quality-checklist.md`. Output: bảng `Item | Status | Note` (✅❌⚠️).

## Output format
English Markdown, 2-column table; lưu `.md` nếu user muốn file; naming
`<UC-ID>_<UC-Name-kebab>.md`.

## Anti-patterns
1. UC = UI flow (mọi click/popup) → đó là wireframe.
2. UC = User Story (one-liner).
3. UC = Business Process (nhiều người/hệ thống).
4. Verb mơ hồ trong UC Name ("Manage", "Handle").
5. Nhồi enrollment+payment+notification vào 1 UC → split bằng Includes.
6. Chỉ happy path, thiếu exception.
7. Precondition mơ hồ ("System is ready").

## Reference files
| File | Đọc khi |
|---|---|
| `references/template-guide.md` | Hướng dẫn từng field |
| `references/writing-style.md` | Convention viết (active voice, numbering) |
| `references/quality-checklist.md` | 20-point checklist |
| `references/examples-worked.md` | 2 UC mẫu hoàn chỉnh (worked example) |
| `assets/uc-template.md` | Template copy-ready |

---
*PO Document Skill Set · nội bộ.*
