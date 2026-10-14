# Design System Input Spec

Skill `srs-to-prototype` **project-agnostic** — nó không biết trước màu/font/component
của dự án bạn. Bạn phải cung cấp **1 file design system** để skill render đúng.

File này mô tả: (1) member cần chuẩn bị file DS gồm gì, (2) skill đọc token thế nào.

---

## 1. File DS cần gồm gì

Chấp nhận 1 trong các định dạng: `.md`, `.json`, hoặc CSS variables. Miễn là có đủ
các nhóm token dưới đây. Thiếu nhóm nào, skill sẽ hỏi hoặc dùng giá trị an toàn tối
thiểu (và cảnh báo).

### Bắt buộc

| Nhóm | Token cần có | Ví dụ |
|---|---|---|
| **Color — brand** | primary (+ hover/pressed nếu có) | `primary: #0060CF` |
| **Color — surface** | background, surface/card | `background: #F8FAFE`, `surface: #FFFFFF` |
| **Color — text** | text primary, text secondary | `text: #0F1B2D`, `textSecondary: #5A6B82` |
| **Color — semantic** | success, error, warning | `error: #E24B4A` |
| **Typography** | font heading, font body | `Space Grotesk`, `Figtree` |
| **Shape** | border-radius | `radius: 10px` |

### Nên có

| Nhóm | Token | Ví dụ |
|---|---|---|
| **Type scale** | size các cấp (h1/h2/body/caption) | `h1: 24px, body: 15px` |
| **Spacing scale** | thang cách đều | `4, 8, 12, 16, 24` |
| **Component styles** | button, input, card, chip... | style cụ thể để tái dùng |
| **Icon set** | bộ icon dùng | Tabler / SF Symbols / custom |

---

## 2. Mẫu file DS (Markdown) — copy điền vào

```markdown
# Design System — {{tên dự án}}

## Colors
- primary: #0060CF
- primary-hover: #004FA8
- background: #F8FAFE
- surface: #FFFFFF
- border: #E1E8F5
- text: #0F1B2D
- text-secondary: #5A6B82
- success: #2FBF71
- error: #E24B4A
- warning: #C97A0C

## Typography
- font-heading: "Space Grotesk"
- font-body: "Figtree"
- h1: 24px / 600
- h2: 18px / 600
- body: 15px / 400
- caption: 12px / 400

## Shape
- radius: 10px
- radius-card: 12px

## Spacing
- scale: 4, 8, 12, 16, 24, 32

## Components (optional — nếu có sẵn spec)
- button-primary: bg primary, text #fff, radius 10, padding 12x16, weight 500
- input: bg surface, border 1px border, radius 10, height 44
- card: bg surface, border 1px border, radius 12, padding 16
```

---

## 3. Skill đọc token thế nào

1. Đọc file DS → parse thành bảng token nội bộ.
2. Với `.json` / CSS vars: map key tương ứng (`--color-primary`, `colors.primary`...).
3. Mọi giá trị màu/font/radius/spacing khi render **phải** lấy từ bảng token này.
4. Nếu token bắt buộc bị thiếu → hỏi member bổ sung, KHÔNG tự chọn màu thay thế.

> Quy tắc vàng: prototype trông "đúng dự án" hay không phụ thuộc 100% vào file DS này.
> File DS càng đầy đủ, prototype càng sát design thật.
