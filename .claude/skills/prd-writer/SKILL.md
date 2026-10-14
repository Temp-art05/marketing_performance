---
name: prd-writer
description: |
  Sinh Product Requirements Document (PRD) cho mobile app feature — từ discovery brief đã chốt
  (output của ask-why-ba) hoặc từ feature request. Output gồm 2 phần: PRD Overview (problem,
  goals, KPIs, personas, scope, success metrics) và PRD Detail per feature (mô tả, user flow
  mức product, high-level requirements, priority, dependencies, open questions).

  PRD ở tầng PRODUCT ("cái gì & tại sao" cho cross-functional), là cầu nối giữa discovery và
  spec chi tiết: discovery brief → PRD → (use case / user story) → SRS.

  Dùng khi user nói: "viết PRD", "tạo PRD", "dựng PRD", "product requirements", "PRD cho feature",
  "biến discovery brief thành PRD", "PRD overview", "write a PRD", "turn this brief into a PRD",
  kể cả khi user đưa discovery findings và bảo "dựng tài liệu product".

  KHÔNG dùng để: elicit/discovery (dùng ask-why-ba), viết SRS spec chi tiết BR/FR/NFR + AC
  (dùng srs-writer), viết use case/user story formal (dùng use-case-writer / user-story-ac-writer).
license: MIT
version: 1.0.0
---

<!-- Nguồn: AI Knownledge APR-229 PO Copilot, owner Công Hồ Thành (CongHT), nhập 2026-10-14. Output tài liệu → exports/po/<app>/ -->

# PRD Writer

> Skill trong **PO Document Skill Set**. Pipeline:
> ask-why-ba → **prd-writer** → use-case-writer → user-story-ac-writer → srs-writer → srs-to-prototype

## Ranh giới PRD ↔ SRS (đọc trước)

Để không chồng lấn với `srs-writer`:

| | **PRD** (skill này) | **SRS** (srs-writer) |
|---|---|---|
| Tầng | Product — "cái gì & tại sao" | Spec — "chính xác thế nào" |
| Khán giả | PO, design, eng lead, stakeholder | Dev, QA |
| Nội dung | Problem, goal, KPI, persona, feature list + priority, high-level req, success metric, scope | BR/FR/NFR có ID, Given/When/Then AC, per-screen |
| Độ chi tiết | Vừa đủ để align & ưu tiên | Đủ để code & test |

PRD **không** viết FR-XX/AC chi tiết — đó là việc của SRS. PRD chốt WHAT & WHY + priority;
SRS mới HOW.

## Bước 0 — Inputs

| Input | Bắt buộc | Ghi chú |
|---|---|---|
| Discovery brief | 🟡 | Output ask-why-ba (business_problem, goal, personas, FR list, risks, assumptions, open_questions). Có thì dùng thẳng. |
| Feature request | 🟡 | Nếu không có brief, nhận feature request — nhưng nếu quá mơ hồ, **đề nghị chạy ask-why-ba trước** |
| Product context | 🟡 | Tên sản phẩm, platform, business model, segment |

Nếu **cả brief lẫn request đều mơ hồ** (thiếu problem/goal/persona), DỪNG và mời:
> "Chưa đủ để viết PRD chắc. Nên chạy **ask-why-ba** để chốt problem/goal/persona trước rồi
> quay lại."

## Bước 1 — PRD Overview

Sinh phần Overview theo `assets/prd-template.md`. Bắt buộc gồm:
- **Problem statement** — vấn đề business (không phải solution)
- **Goals & Non-goals** — mục tiêu đo được + rõ cái KHÔNG làm
- **Success metrics / KPIs** — metric + baseline + target + deadline
- **Target users / Personas** — ai, pain chính, WTP nếu có
- **Scope & Out of scope** — explicit
- **Assumptions & Open questions** — kế thừa từ discovery brief

Rule: mọi goal phải đo được; không dùng vague ("tốt hơn", "user-friendly").

## Bước 2 — Feature List + Priority

Liệt kê feature ở mức product, gắn priority. Bảng:

| Feature ID | Tên | Mô tả 1 dòng | Priority (MoSCoW) | Liên quan goal | Ghi chú |
|---|---|---|---|---|---|
| F-01 | ... | ... | Must / Should / Could / Won't | Goal-1 | ... |

Xác nhận feature list + priority với user **trước khi** viết chi tiết từng feature.

## Bước 3 — PRD Detail per feature

Với mỗi feature (ưu tiên Must trước), sinh block chi tiết theo template:
- **Mô tả & rationale** — làm gì, giải quyết pain nào
- **User flow (mức product)** — các bước chính, không phải spec màn hình
- **High-level requirements** — điều product cần, dạng bullet (KHÔNG phải FR-XX chi tiết)
- **Priority · Dependencies · Risks**
- **Open questions** — cần ai trả lời

**Sinh từng feature một, dừng hỏi confirm** trước khi sang feature kế (giống UC sequential).

## Bước 4 — Handoff

Cuối PRD, thêm mục "Next steps" chỉ rõ feature nào đi tiếp xuống spec:
> "Feature F-01, F-02 (Must) sẵn sàng chuyển **use-case-writer** (dựng flow) và/hoặc
> **srs-writer** (spec BR/FR/NFR + AC). Chuyển cái nào trước?"

## Output format
- Markdown, table-heavy, versioned (có Revision History).
- Feature ID immutable (append, không renumber).
- Lưu `.md` nếu user muốn file.

## Anti-patterns
1. ❌ Viết FR-XX + Given/When/Then chi tiết → đó là SRS, không phải PRD.
2. ❌ Goal mơ hồ không đo được.
3. ❌ Bỏ Non-goals / Out of scope → scope creep.
4. ❌ Nhận feature request mơ hồ mà không đề nghị discovery trước.
5. ❌ Dump cả PRD detail 1 lần thay vì sinh từng feature + confirm.
6. ❌ Bỏ Assumptions / Open questions kế thừa từ discovery.

## Reference / assets
| File | Đọc khi |
|---|---|
| `assets/prd-template.md` | Format PRD Overview + Detail |

---
*PO Document Skill Set · dùng chung nội bộ.*
