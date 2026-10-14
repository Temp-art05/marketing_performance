# Hi-fi Fidelity Rules

Skill này xuất **hi-fidelity** (gần bản final). File này định nghĩa "hi-fi" nghĩa là
gì, ranh giới với low/mid, và spec banner bắt buộc.

---

## 1. Ba mức fidelity — skill này là "Cao"

| Mức | Đặc điểm | Skill xuất? |
|---|---|---|
| **Thô (low-fi)** | Hộp xám, không màu, chữ placeholder | ❌ |
| **Vừa (mid-fi)** | Đúng bố cục + màu/font DS, nhưng phẳng, chưa chi tiết | ❌ |
| **Cao (hi-fi)** | Đúng DS + chiều sâu thị giác: icon, illustration, state visual, chi tiết chrome | ✅ **đây** |

## 2. "Hi-fi" gồm những gì (checklist khi render)

Mỗi màn phải đạt:

- [ ] **Đúng design system**: màu, font, radius, spacing lấy từ DS file — không lệch.
- [ ] **Đủ chrome mobile**: status bar / safe area / nav bar (dùng screen-template).
- [ ] **Element đầy đủ** theo AC: đừng bỏ sót label, message, button, icon nào FR nhắc.
- [ ] **State visual thật**:
  - loading → spinner / skeleton
  - error → error illustration/icon + message + CTA retry
  - empty → empty-state illustration + hướng dẫn
- [ ] **Chiều sâu**: avatar/illustration hint, icon có nghĩa (không chỉ ô vuông), progress/streak/waveform nếu hợp ngữ cảnh.
- [ ] **Copy real**: hiển thị đúng text trong AC (message, CTA). Chỉ lorem khi SRS không cấp chữ.
- [ ] **Micro-detail tĩnh**: divider, badge, selected state, disabled state khi AC nhắc.

## 3. Ranh giới — hi-fi KHÔNG có nghĩa là "làm thay UI/UX"

Hi-fi là **khung đúng + đủ chi tiết để dev dựng**, KHÔNG phải bản thiết kế cuối:

- ❌ Không tự sáng tác brand illustration cầu kỳ, ảnh chụp thật, motion phức tạp.
- ❌ Không thêm màn/tính năng ngoài SRS.
- ✅ Dùng illustration/icon placeholder ở mức gợi ý — UI/UX sẽ thay bằng asset thật.

Mục tiêu: UI/UX import vào Figma và **nâng cấp** (asset thật, motion, polish), không
phải dựng lại. Dev thì đủ rõ để code ngay.

---

## 4. Banner "not final design" — BẮT BUỘC

Vì hi-fi dễ bị tưởng "đã xong", mọi prototype phải gắn banner rõ ràng ở đầu stage.

```html
<div class="proto-banner" role="note" style="
  font-family: system-ui, sans-serif;
  font-size: 13px; font-weight: 500;
  color: #7A4B00; background: #FDF0DE;
  border: 1px solid #F0C878; border-radius: 8px;
  padding: 8px 14px; margin: 0 0 16px; text-align: center;">
  ⚠ Prototype — structural hi-fi, <b>not final visual design</b>.
  Dành cho Dev dựng &amp; UI/UX import Figma hoàn thiện.
</div>
```

- Đặt **1 banner** ở đầu `.proto-stage` (không cần lặp trên từng màn).
- Không được xóa/ẩn banner. Đây là rule chống hiểu lầm với stakeholder.
- Màu banner cố định (vàng cảnh báo), độc lập với DS của dự án, để luôn nổi bật.

---

## 5. Ví dụ đối chiếu

Xem `assets/example-hifi-screen.html` để thấy 1 màn đạt chuẩn hi-fi: đúng token, đủ
element, có state visual, có chiều sâu — nhưng vẫn là scaffold để UI/UX nâng lên.
