# Figma Import Contract (Anima)

Prototype HTML phải import vào Figma qua **Anima/plugin** sạch, để UI/UX làm việc được
trên layer đúng tên, đúng auto-layout. Đây là bài học từ thực tế: đặt tọa độ tuyệt đối
(absolute) hay đẩy qua Figma API gây lệch hệ thống; **HTML flexbox → Anima** ổn hơn nhiều.

Tuân thủ đủ các rule dưới.

---

## 1. Layout — flexbox/grid, KHÔNG absolute

- Toàn bộ bố cục dùng `display:flex` / `display:grid` + gap.
- **Cấm** `position:absolute` / `position:fixed` cho layout (Anima không map ra
  auto-layout, ra frame lệch). Ngoại lệ hiếm: badge nhỏ chồng góc (vd chấm online
  trên avatar) — chấp nhận absolute cục bộ trong 1 element nhỏ, không cho layout chính.
- Spacing bằng `gap` / `margin` theo spacing scale của DS, không hardcode lung tung.

## 2. Naming — mỗi màn/state = 1 frame có tên

- Mỗi màn × state = **1 container top-level** duy nhất.
- Đặt `id` và `class` theo convention `screen-<tên>--<state>`:
  ```html
  <section class="screen" id="screen-login--default" data-fr="FR-02"> ... </section>
  <section class="screen" id="screen-login--error"   data-fr="FR-02"> ... </section>
  ```
- Anima lấy tên này làm tên frame trong Figma → UI/UX nhìn là hiểu ngay.

## 3. Semantic + class theo component

- Dùng thẻ semantic: `<header> <main> <button> <nav> <ul>` thay vì `<div>` chung chung.
- Đặt class theo tên component của DS: `class="btn-primary"`, `class="input-field"`,
  `class="card"`, `class="chat-bubble"`. → layer Figma đọc được như component.

## 4. Traceability — data-fr

- Mỗi container màn gốc gắn `data-fr="FR-XX"` (FR nguồn từ SRS).
- Nếu 1 màn phục vụ nhiều FR: `data-fr="FR-02 FR-05"`.
- Dùng để kiểm coverage (mọi FR có màn) và để trace ngược về SRS.

## 5. Tài nguyên nhẹ — import ổn định

- Không nhúng ảnh base64 nặng. Dùng placeholder khối màu / icon webfont / SVG inline nhẹ.
- Không JS phức tạp. Điều hướng giữa màn: dùng anchor `<a href="#screen-...">` hoặc
  JS tối giản toggle `.active` — đủ để bấm thử, không phá import.
- Không CSS animation nặng. Micro-interaction để UI/UX làm trong Figma.

## 6. Cấu trúc file tổng

```html
<!-- 1 file prototype.html chứa tất cả màn -->
<style> /* design tokens + component styles từ DS file */ </style>

<!-- banner bắt buộc, xem hifi-fidelity-rules.md -->
<div class="proto-banner"> Prototype — not final design </div>

<div class="proto-stage">
  <section class="screen" id="screen-a--default" data-fr="FR-01"> ... </section>
  <section class="screen" id="screen-a--error"   data-fr="FR-01"> ... </section>
  <section class="screen" id="screen-b--default" data-fr="FR-02"> ... </section>
</div>
```

---

## Checklist import (tự soát nhanh)

- [ ] Không có `position:absolute` trong layout chính.
- [ ] Mỗi màn/state có `id`/`class` đặt tên rõ.
- [ ] Có `data-fr` trên mọi container màn.
- [ ] Semantic tags + class theo component.
- [ ] Không ảnh nặng inline, JS tối giản.
