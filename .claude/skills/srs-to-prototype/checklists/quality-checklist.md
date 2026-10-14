# Quality Checklist — trước khi bàn giao prototype

Chạy toàn bộ trước khi output. FAIL bất kỳ mục nào → sửa hoặc flag rõ cho user.
Output kết quả dạng bảng `Mục | Status | Note` với ✅ / ⚠️ / ❌.

## A. Coverage (đủ, không thiếu)
- [ ] **A1** — Mọi màn trong screen inventory (SKILL Bước 2) đều được render.
- [ ] **A2** — Mọi state được yêu cầu render đủ (default; + loading/error/empty nếu AC nhắc).
- [ ] **A3** — Mọi element mà AC nhắc đều xuất hiện đúng màn (label, message, CTA, icon).
- [ ] **A4** — Mọi màn có `data-fr`; không FR nào có màn bị bỏ sót.
- [ ] **A5** — Copy hiển thị đúng text trong AC (không lorem khi SRS đã cấp chữ).

## B. Design system (đúng dự án)
- [ ] **B1** — Màu lấy từ DS file (primary/bg/surface/text/semantic) — không màu lạ.
- [ ] **B2** — Font heading + body đúng DS.
- [ ] **B3** — Radius + spacing theo DS scale.
- [ ] **B4** — Component (button/input/card...) đúng style DS nếu DS có định nghĩa.

## C. Hi-fi (đủ chiều sâu)
- [ ] **C1** — Có chrome mobile (status bar / safe area / nav bar).
- [ ] **C2** — State visual thật: loading = spinner/skeleton; error = illustration + msg + retry; empty = illustration + hướng dẫn.
- [ ] **C3** — Icon có nghĩa (không phải ô vuông trơn); có illustration/avatar hint hợp ngữ cảnh.
- [ ] **C4** — Không vượt ranh giới: không tự thêm màn/tính năng ngoài SRS.

## D. Figma import contract
- [ ] **D1** — Không `position:absolute`/`fixed` cho layout chính.
- [ ] **D2** — Mỗi màn/state = 1 container, id/class đặt tên `screen-<tên>--<state>`.
- [ ] **D3** — Semantic tags + class theo component.
- [ ] **D4** — Không ảnh nặng inline; JS tối giản.

## E. Chống hiểu lầm
- [ ] **E1** — Banner "Prototype — not final design" hiển thị ở đầu stage.
- [ ] **E2** — Banner không bị xóa/ẩn.

## F. Output
- [ ] **F1** — Ghi ra `output/<feature-kebab>/prototype.html`.
- [ ] **F2** — Báo user: số màn × số state; nhắc bước forward UI/UX import Anima.
