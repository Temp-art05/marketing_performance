---
name: srs-to-prototype
description: |
  Biến tài liệu SRS/PRD (Markdown, .docx, .pdf) thành prototype hi-fidelity dạng
  HTML mobile — mỗi màn hình + state được render theo ĐÚNG design system của dự án
  (do người dùng cung cấp file DS), sẵn sàng để Dev dựng và để UI/UX import vào Figma
  qua Anima hoàn thiện full design.

  Skill này project-agnostic: KHÔNG hardcode màu/font của bất kỳ app nào — luôn đọc
  token từ file design system người dùng đưa vào. Output là hi-fi (gần bản final) nhưng
  luôn gắn banner "Prototype — not final design" để không đóng khung UI/UX.

  Dùng skill này khi user nói: "SRS ra prototype", "prototype từ SRS", "dựng prototype
  cho tài liệu này", "SRS to prototype", "hi-fi prototype", "prototype mobile từ spec",
  "vẽ giao diện từ SRS", "prototype cho dev", "make a prototype from this SRS/PRD",
  "build hi-fi mockup from spec", "turn this SRS into screens", kể cả khi user chỉ đưa
  file SRS/PRD + design system và nói "dựng giao diện đi". LUÔN chạy parse gate kiểm SRS
  đủ cấu trúc (FR-XX + AC) TRƯỚC khi vẽ; nếu SRS lộn xộn thì DỪNG và mời user chạy
  srs-writer regen.

  KHÔNG dùng để: viết SRS/PRD (dùng srs-writer), vẽ wireframe low-fi thuần, viết code
  production React Native, hay tự đẩy trực tiếp vào Figma (skill chỉ dừng ở HTML để
  import qua Anima).
author: Apero PO Document Skill Set
license: MIT
version: 1.0.0
---

<!-- Nguồn: AI Knownledge APR-229 PO Copilot, owner Công Hồ Thành (CongHT), nhập 2026-10-14. Output tài liệu → exports/po/<app>/ -->

# SRS → Prototype (hi-fi)

> Skill trong bộ **PO Document Skill Set**.
> Vị trí trong pipeline: `ask-why-ba → use-case-writer → user-story-ac-writer → srs-writer → **srs-to-prototype**`

## Bản chất

Đây là bước **construct**, không phải sáng tạo yêu cầu. Skill đọc SRS đã có → dựng
prototype hi-fi để hai khán giả dùng song song:

- **Dev**: nhìn là dựng được, ít phải hỏi lại → giảm mơ hồ khi code.
- **UI/UX**: nhận đúng khung + design system → import Figma (Anima) rồi nâng lên full
  design, không phải dựng lại từ 0.

Vì output là hi-fi (dễ bị tưởng "đã xong"), skill **bắt buộc** gắn banner
"Prototype — not final design" (xem §5).

---

## Thứ tự chạy

```
0. INPUTS       → thu 3 thứ: SRS doc + design system file + (optional) screen list
1. PARSE GATE   → SRS đủ FR-XX + AC? Lộn xộn → DỪNG, mời chạy srs-writer          ← cổng vào
2. SCREEN MAP   → trích screen + state + element + navigation từ FR/AC
3. LOAD DS      → đọc token từ design system file (màu/font/radius/spacing/component)
4. RENDER       → dựng từng màn hi-fi theo DS + fidelity rules + banner
5. IMPORT SPEC  → HTML đúng contract để Anima import Figma sạch
6. COVERAGE     → mọi màn/FR/state có mặt? checklist pass?                        ← cổng ra
7. OUTPUT       → đóng gói prototype.html vào output/<feature>/
```

---

## Bước 0 — Inputs

Cần đủ 3 thứ. Thiếu thì **hỏi, không bịa**:

| Input | Bắt buộc | Ghi chú |
|---|---|---|
| **SRS/PRD doc** | ✅ | `.md` đọc thẳng; `.docx` gọi skill **docx**; `.pdf` gọi skill **pdf/pdf-reading** → lấy text |
| **Design system file** | ✅ | File token của dự án. Nếu thiếu → yêu cầu user cung cấp, chỉ họ tới `references/design-system-input-spec.md` để biết cần gì |
| **Screen list + states** | 🟡 | Nếu không có, tự trích từ FR/AC ở Bước 2 rồi xác nhận lại với user |
| **Platform** | 🟡 | Mặc định mobile (dọc 9:16). Đổi nếu user yêu cầu |

Nếu **thiếu design system file**, nói rõ:
> "Skill cần file design system của dự án để render đúng màu/font/component. Bạn cung cấp file DS giúp mình (xem `references/design-system-input-spec.md` để biết file cần gồm gì). Không có DS, mình chỉ dựng được low-fi xám — không đúng mục tiêu hi-fi."

---

## Bước 1 — PARSE GATE (cổng vào)

Kiểm SRS có đủ cấu trúc để dựng chính xác. **FAIL nếu:**

- (a) Không tìm thấy heading `FR-XX` nào, HOẶC
- (b) > 30% FR không có Acceptance Criteria parse được (Given/When/Then hoặc bảng điều kiện)

- **PASS** → sang Bước 2.
- **FAIL** → **DỪNG, không vẽ.** Liệt kê FR thiếu AC và mời:
  > "SRS chưa đủ cấu trúc để dựng prototype chính xác. Nên chạy **srs-writer** regen tài liệu cho chuẩn (BR/FR/NFR + Given/When/Then) rồi quay lại skill này."

Đây vừa là kiểm chất lượng, vừa là cách xử lý input rác: skill không đoán bừa — nó
chặn và đẩy về nguồn chuẩn. Ghép đôi: `srs-writer` sinh SRS → `srs-to-prototype` biến
SRS thành prototype.

---

## Bước 2 — SCREEN MAP

Trích **screen inventory** từ SRS. Nguồn dữ liệu, theo thứ tự ưu tiên:

1. Section **"Screen Elements"** / **"UI Design"** nếu SRS có (dùng trực tiếp).
2. Nếu không có, trích từ **FR + Acceptance Criteria**: mệnh đề `Then` thường mô tả
   màn + element (vd *"system hiển thị No Internet screen với: icon, message, button
   'Thử lại'"* → 1 màn, 3 element).
3. Section **Flow / Routing** → suy ra **navigation** giữa các màn.

Lập bảng screen inventory và **xác nhận với user trước khi render**:

| Screen | FR nguồn | States cần render | Elements chính | Điều hướng tới |
|---|---|---|---|---|
| [Tên màn] | FR-01 | default / loading / error / empty | [list element] | [màn kế] |

Rule states: mỗi màn tối thiểu render **default**; thêm **loading / error / empty**
nếu AC có nhắc (error state, timeout, "chưa có data"...). Mỗi state = 1 frame riêng.

---

## Bước 3 — LOAD DESIGN SYSTEM

Đọc token từ design system file người dùng cung cấp. Map vào biến để dùng ở Bước 4:

- **Colors**: primary, background, surface, text (primary/secondary), semantic (success/error/warning)
- **Typography**: font family (heading + body), scale (size các cấp)
- **Shape**: border-radius, spacing scale
- **Components**: nếu DS file liệt kê component (button, input, card...), tái sử dụng đúng style đó

Chi tiết định dạng DS file: `references/design-system-input-spec.md`.
**Tuyệt đối không** thay token của dự án bằng màu/font mặc định của skill.

---

## Bước 4 — RENDER (hi-fi)

Dựng từng màn × từng state thành HTML hi-fi. Đọc `references/hifi-fidelity-rules.md`
để biết chuẩn "hi-fi" và ranh giới với low-fi/mid-fi.

Nguyên tắc cốt lõi khi render:
- Áp **đúng** design system đã load (Bước 3) — màu, font, radius, spacing.
- **Đầy đủ element** theo AC (đừng bỏ sót element nào FR có nhắc).
- Hi-fi = có chiều sâu thị giác: icon, avatar/illustration hint, state visual (loading
  spinner, error illustration, empty state), waveform/progress nếu hợp ngữ cảnh.
- Mỗi màn dùng khung mobile (status bar, safe area) — mẫu ở `assets/screen-template.html`.
- Xem 1 màn hi-fi hoàn chỉnh làm chuẩn: `assets/example-hifi-screen.html`.
- **Copy real** trong AC → hiển thị đúng (message, label, CTA). Không lorem nếu SRS đã có chữ.

---

## Bước 5 — FIGMA IMPORT CONTRACT (bắt buộc)

Prototype phải import vào Figma qua **Anima/plugin** sạch. Đọc đầy đủ:
`references/figma-import-contract.md`. Tóm tắt rule cứng:

| Rule | Lý do |
|---|---|
| Layout bằng flexbox/grid, **KHÔNG absolute position** | Anima map thành auto-layout Figma |
| Mỗi màn/state = 1 container top-level, đặt tên rõ (`screen-login--default`) | Ra từng frame Figma có tên đúng |
| Semantic HTML + class đặt tên theo component | Layer Figma dễ đọc cho UI/UX |
| Gắn `data-fr="FR-XX"` trên block gốc mỗi màn | Trace ngược SRS + kiểm coverage |
| Không JS phức tạp, không ảnh nền nặng inline | Import ổn định |

Skill **dừng ở HTML**. KHÔNG tự gọi Figma API đặt tọa độ (hay lỗi lệch). UI/UX chủ
động import qua Anima.

---

## Bước 6 — COVERAGE (cổng ra)

Chạy checklist `checklists/quality-checklist.md`. FAIL bất kỳ mục nào → sửa hoặc flag
cho user. Kiểm tối thiểu:

- [ ] Mọi màn trong screen inventory (Bước 2) đều có mặt.
- [ ] Mọi state được yêu cầu (default + error/loading/empty theo AC) đều render.
- [ ] Mọi element mà AC nhắc đều xuất hiện trên màn tương ứng.
- [ ] Mọi block gốc có `data-fr`; không FR nào bị bỏ.
- [ ] Đúng design system (không dùng màu/font ngoài DS file).
- [ ] Banner "Prototype — not final design" hiển thị.
- [ ] Không dùng absolute position (contract Figma).

---

## Bước 7 — OUTPUT

- Ghi ra `output/<feature-kebab>/prototype.html` (1 file chứa tất cả màn + state,
  điều hướng bấm được giữa các màn nếu Flow có).
- Đặt tên file theo feature: vd `output/login-auth/prototype.html`.
- Báo user: số màn × số state đã dựng, và nhắc bước tiếp: forward cho UI/UX import Anima.

---

## Anti-patterns (tuyệt đối tránh)

1. ❌ Render khi SRS chưa qua parse gate → prototype đoán bừa từ input rác.
2. ❌ Dùng màu/font mặc định thay vì design system của dự án.
3. ❌ Dùng absolute position → hỏng import Figma.
4. ❌ Bỏ sót state error/loading/empty mà AC đã nhắc.
5. ❌ Quên banner "not final design" → stakeholder tưởng đã chốt, UI/UX bị đóng khung.
6. ❌ Tự đẩy vào Figma bằng tọa độ tuyệt đối thay vì để Anima import.
7. ❌ Tự bịa element/copy khi SRS/AC đã ghi rõ.

---

## Reference files

| File | Đọc khi |
|---|---|
| `references/design-system-input-spec.md` | Bước 0/3 — hướng dẫn member chuẩn bị file DS, và cách đọc token |
| `references/figma-import-contract.md` | Bước 5 — convention HTML để Anima import sạch |
| `references/hifi-fidelity-rules.md` | Bước 4 — chuẩn hi-fi, ranh giới low/mid/hi, spec banner |
| `assets/screen-template.html` | Bước 4 — khung mobile trống để nhân bản |
| `assets/example-hifi-screen.html` | Bước 4 — 1 màn hi-fi hoàn chỉnh làm gold reference |
| `checklists/quality-checklist.md` | Bước 6 — checklist trước khi bàn giao |

---
*Bộ PO Document Skill Set · Apero · dùng chung nội bộ.*
