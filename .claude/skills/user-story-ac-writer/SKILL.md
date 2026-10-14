---
name: user-story-ac-writer
description: |
  Sinh User Story + Acceptance Criteria chuẩn INVEST + Given-When-Then cho PO/BA mobile app.
  Enforce 6 tiêu chí INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable)
  và format AC theo Gherkin. Hỗ trợ 3 mode: viết mới từ feature description, refine US có sẵn,
  bổ sung AC cho US đã viết.

  Dùng khi user nói: "viết user story", "viết US", "tạo user story", "viết AC", "viết acceptance
  criteria", "AC theo Given-When-Then", "AC Gherkin", "refine user story", "review US này",
  "US này chuẩn chưa", "bổ sung AC", "viết tiêu chí nghiệm thu", "story cho feature này",
  "split user story", kể cả khi paste feature description + "viết story đi" hoặc upload PRD/SRS
  + "tạo US list".

  KHÔNG dùng để: viết PRD/SRS toàn bộ (dùng prd-writer / srs-writer), viết test case kỹ thuật
  (AC ≠ test case), viết Use Case formal (dùng use-case-writer).
license: MIT
version: 1.0.0
---

<!-- Nguồn: AI Knownledge APR-229 PO Copilot, owner Công Hồ Thành (CongHT), nhập 2026-10-14. Output tài liệu → exports/po/<app>/ -->

# User Story & Acceptance Criteria Writer

> Skill trong **PO Document Skill Set**. Pipeline:
> ask-why-ba → prd-writer → use-case-writer → **user-story-ac-writer** → srs-writer → srs-to-prototype

## Mục đích

Giúp PO/BA viết User Story + Acceptance Criteria chất lượng cao, sẵn cho dev estimate và QA
viết test case. Đặc biệt cung cấp AC dạng Given/When/Then để feed thẳng vào section AC của SRS.

## Workflow

### Bước 1 — Xác định mode
- **Mode A — Viết mới:** user cấp feature description → sinh US + AC từ đầu.
- **Mode B — Refine:** user có US/AC sẵn → review và đề xuất sửa.
- **Mode C — Bổ sung AC:** user có US → thêm AC chi tiết.

Nếu user paste content rõ ràng, tự suy mode và xác nhận lại 1 lần.

### Bước 2 — Thu input bắt buộc (hỏi nếu thiếu, KHÔNG bịa)
1. **Persona/User type** — ai dùng? (không generic "user")
2. **Goal** — user muốn làm gì?
3. **Business value** — tại sao cần?
4. **Context/Scope** — thuộc feature/module nào?

### Bước 3 — Sinh User Story
```
**US-[ID]**: [Tiêu đề ngắn]
**As a** [persona cụ thể]
**I want to** [hành động cụ thể, đo được]
**So that** [business value rõ, không lặp lại I want]
```

### Bước 4 — INVEST self-check
Trước khi xuất, tự kiểm 6 tiêu chí; fail thì xử lý:

| Tiêu chí | Kiểm | Nếu fail |
|---|---|---|
| **I**ndependent | Phụ thuộc story khác? | Tách dependency / gộp |
| **N**egotiable | Còn chỗ thảo luận? | Bỏ chi tiết kỹ thuật cứng |
| **V**aluable | Giá trị gì? | Viết lại "So that" |
| **E**stimable | Dev ước lượng được? | Thêm context/constraint |
| **S**mall | Xong trong 1 sprint? | Split |
| **T**estable | QA viết test được? | Thêm AC cụ thể |

Chi tiết: `references/invest-criteria.md`.

### Bước 5 — Sinh Acceptance Criteria (Gherkin)
Mỗi US tối thiểu **3 AC**: happy path + edge/validation + negative/error.
```
**AC1: [scenario - happy path]**
- **Given** [tiền điều kiện]  **When** [hành động]  **Then** [kết quả đo được]  **And** [phụ]
```
Quy tắc: bao đủ 3 loại; mỗi điều kiện đo được; tránh từ mơ hồ ("nhanh", "hợp lý"); không
viết logic implementation; 1 AC = 1 scenario.

### Bước 6 — Output
1. User Story · 2. INVEST self-check (bảng ✅/⚠️) · 3. Acceptance Criteria (AC1, AC2, AC3...)
· 4. Notes (dependency/assumption/câu hỏi cho PO) · 5. Hỏi user xem lại + xác nhận format
trước khi xuất file.

## Anti-patterns
❌ Persona generic ("As a user") → cụ thể hóa.
❌ Goal vague ("manage profile") → hành động cụ thể.
❌ Value lặp goal → giá trị thật.
❌ AC mô tả UI ("button turns blue") → mô tả kết quả hệ thống.
❌ AC chứa logic kỹ thuật ("call API /v1/...") → mô tả trạng thái data.
❌ Chỉ 1 happy path → tối thiểu 3 AC.
❌ Story quá lớn (cả CRUD) → split.

## Khi nào split
Dấu hiệu: tiêu đề có "AND"; nhiều persona trong 1 story; cover nhiều CRUD; AC > 7-8 scenario;
dev ước lượng > 5 ngày. Pattern split: theo CRUD / persona / business rule / data type.

## Reference files
| File | Đọc khi |
|---|---|
| `references/invest-criteria.md` | Giải thích sâu INVEST |
| `references/examples.md` | Ví dụ US + AC mẫu |
| `templates/user-story-template.md` | Template US trống |
| `templates/ac-template.md` | Template AC Gherkin |
| `checklists/quality-checklist.md` | Self-review trước xuất |

---
*PO Document Skill Set · nội bộ.*
