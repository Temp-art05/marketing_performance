---
name: po-doc-pipeline
description: |
  Orchestrator điều phối cả bộ PO Document Skill Set: chạy tuần tự nhiều skill từ ý tưởng thô
  đến bộ tài liệu + prototype hoàn chỉnh, output bước trước làm input bước sau, có checkpoint
  duyệt ở mỗi chặng. KHÔNG tự viết tài liệu — nó điều khiển các skill con theo đúng thứ tự và
  giữ state giữa các chặng.

  Chuỗi: ask-why-ba (discovery) → prd-writer (PRD) → use-case-writer (UC) → user-story-ac-writer
  (US+AC) → srs-writer (SRS) → srs-to-prototype (prototype hi-fi).

  Dùng khi user nói: "chạy full pipeline", "từ idea ra SRS/prototype", "điều phối cả bộ tài liệu",
  "discovery to prototype", "chạy cả chuỗi PO document", "orchestrate the doc pipeline", "biến ý
  tưởng này thành bộ tài liệu đầy đủ cho dev", kể cả khi user đưa 1 feature idea thô và muốn ra
  bộ tài liệu bàn giao.

  KHÔNG dùng khi user chỉ cần 1 tài liệu đơn lẻ — khi đó gọi thẳng skill tương ứng.
license: MIT
version: 1.0.0
---

<!-- Nguồn: AI Knownledge APR-229 PO Copilot, owner Công Hồ Thành (CongHT), nhập 2026-10-14. Output tài liệu → exports/po/<app>/ -->

# PO Document Pipeline — Orchestrator

> Điều phối bộ **PO Document Skill Set**. Bản chất: skill "điều phối" (agent-like), giữ state,
> checkpoint từng chặng — KHÔNG tự sáng tác nội dung, mà chạy skill con theo thứ tự.

## Chuỗi & contract handoff

```
[Ý tưởng / feature request thô]
  → ask-why-ba          → Discovery brief (problem, goal, persona, FR list, risks, assumptions)   [CP1]
  → prd-writer          → PRD (overview + feature list + detail)                                    [CP2]
  → use-case-writer     → Use Case(s) (normal/alt/exception courses)                                [CP3]
  → user-story-ac-writer→ User Story + AC (Given/When/Then)                                          [CP4]
  → srs-writer          → SRS (BR/FR/NFR + AC, table-heavy)                                          [CP5]
  → srs-to-prototype    → prototype.html (hi-fi, per DS, Figma-import ready)                         [CP6]
[Bàn giao: brief + PRD + UC + US/AC + SRS + prototype]
```

**CP = Checkpoint:** sau mỗi chặng, DỪNG, cho user review output, chỉnh nếu cần, rồi mới sang
chặng kế. Đây là điểm mấu chốt: garbage in → garbage out, phải chốt từng tầng.

## Bước 0 — Xác định entry point & stage selection

Không phải lúc nào cũng chạy đủ 6 chặng. Trước khi bắt đầu, hỏi 2 điều:

1. **User đang có gì rồi?** → chọn entry point:
   | User có sẵn | Bắt đầu từ |
   |---|---|
   | Chỉ ý tưởng thô | ask-why-ba (CP1) |
   | Discovery brief | prd-writer (CP2) |
   | PRD | use-case-writer (CP3) |
   | SRS | srs-to-prototype (CP6) |

2. **Chạy tới đâu & bỏ chặng nào?** Ví dụ tension UC vs US/AC:
   - Full: chạy cả UC + US/AC (giàu nhất, dài nhất).
   - Gọn: discovery → PRD → UC → **chỉ lấy AC** → SRS → prototype (bỏ lớp US wrapper).
   Hỏi user chọn, ghi lại "run plan" trước khi chạy.

Xác nhận run plan (entry + các chặng) với user, rồi mới chạy.

## Bước 1 — Chạy tuần tự với state handoff

Với mỗi chặng trong run plan:

1. **Load skill con** — đọc SKILL.md của skill chặng đó, tuân theo nó.
2. **Feed input** — đưa output của chặng trước làm input (dạng file/artifact). Chặng đầu dùng
   input gốc của user.
3. **Chạy chặng** — để skill con sinh output theo đúng format của nó.
4. **CHECKPOINT** — trình output cho user:
   > "Chặng [X] xong: [tóm tắt output]. Review giúp bạn — OK để sang [chặng kế], hay cần chỉnh?"
   Chỉnh xong mới đi tiếp. **Không bao giờ chạy 2 chặng liền không dừng.**
5. **Lưu output** — ghi ra `output/<feature>/NN-<stage>.md` (đánh số theo thứ tự chặng) để làm
   input chặng sau và để đóng gói cuối.

### Quản lý state
- Mỗi chặng = 1 file trong `output/<feature>/`. File là "state" truyền giữa các chặng.
- Đặt tên: `01-discovery-brief.md`, `02-prd.md`, `03-usecases.md`, `04-user-stories.md`,
  `05-srs.md`, `06-prototype.html`.
- Nếu user chỉnh output 1 chặng, cập nhật file đó trước khi feed xuống dưới.

## Bước 2 — Parse gate giữa các chặng

Mỗi skill con có gate riêng — TÔN TRỌNG nó, đừng ép qua:
- prd-writer: brief mơ hồ → đẩy về ask-why-ba.
- srs-to-prototype: SRS thiếu FR/AC → đẩy về srs-writer.

Khi gate của chặng dưới fail, quay lại chặng trên để vá, không tự bịa cho qua.

## Bước 3 — Bàn giao (packaging)

Khi hết run plan, gom `output/<feature>/` thành bộ bàn giao và tóm tắt:

| File | Cho ai |
|---|---|
| 01-discovery-brief.md | PO / stakeholder |
| 02-prd.md | Cross-functional |
| 03-usecases.md | Dev / QA (flow) |
| 04-user-stories.md | Dev estimate / QA test case |
| 05-srs.md | Dev / QA (spec) |
| 06-prototype.html | Dev build + UI/UX (import Figma qua Anima) |

Nhắc bước sau pipeline: forward SRS + prototype cho Dev; forward prototype cho UI/UX import Anima.

## Anti-patterns
1. ❌ Chạy hết 6 chặng không dừng checkpoint → mất kiểm soát chất lượng.
2. ❌ Ép qua gate của skill con khi input chưa đạt.
3. ❌ Tự viết nội dung thay vì gọi skill con (orchestrator chỉ điều phối).
4. ❌ Không hỏi entry point → chạy lại chặng user đã có.
5. ❌ Không lưu output từng chặng → mất state, không đóng gói được.
6. ❌ Bỏ qua tension UC vs US/AC → tạo tài liệu trùng lặp thừa.

## Skill con phụ thuộc (phải cài đủ trong cùng môi trường)
`ask-why-ba` · `prd-writer` · `use-case-writer` · `user-story-ac-writer` · `srs-writer` ·
`srs-to-prototype`. Thiếu skill nào → báo user cài trước khi chạy chặng đó.

---
*PO Document Skill Set · orchestrator · dùng chung nội bộ.*
