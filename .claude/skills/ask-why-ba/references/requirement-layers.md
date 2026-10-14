# Requirement Layers (BABOK)

Mọi request nên được đặt đúng tầng requirement. Bỏ tầng = requirement thiếu, dễ rework đắt.
Dùng bảng này để phân loại và phát hiện tầng còn trống.

## 5 tầng

| Tầng | Trả lời | Ví dụ (Interact.ai) | Signal thiếu |
|---|---|---|---|
| **Business Requirement** | *Tại sao* làm? | "Tăng trial-to-paid từ 3% → 6% trong Q3" | Không ai nói được KPI/mục tiêu đo được |
| **Stakeholder Requirement** | *Ai* cần gì? | "User Newbie cần thấy tiến bộ phát âm trong buổi đầu" | Không rõ persona nào hưởng lợi |
| **Functional Requirement** | Hệ thống *phải làm gì*? | "App hiển thị điểm phát âm sau mỗi câu nói" | Nhảy thẳng vào đây, thiếu Business ở trên |
| **Non-functional Requirement** | *Tốt đến mức nào*? | "Chấm điểm phát âm trả về ≤ 800ms" | Chỉ có chức năng, không có metric chất lượng |
| **Transition Requirement** | Đi từ hiện trạng → tương lai *thế nào*? | "Migrate user cũ sang model chấm điểm mới không mất lịch sử" | Không ai nghĩ tới việc chuyển đổi/rollout |

## Quy tắc

1. **Không bỏ tầng.** Request nhảy thẳng Functional ("thêm nút chấm điểm") mà không có Business
   ("để làm gì, KPI nào") là chưa hoàn chỉnh và nguy hiểm.
2. **Truy ngược lên.** Gặp 1 Functional Requirement, hỏi ngược: nó phục vụ Stakeholder nào,
   Business goal nào? Nếu không trả lời được → tầng trên đang trống.
3. **Transition thường bị quên nhất.** Với sản phẩm đã có user, luôn hỏi: đổi cái này thì user
   hiện tại / data cũ / team vận hành chuyển đổi ra sao?

## Cách hiển thị mỗi lượt

Hiện bảng status ngắn để user thấy bức tranh:

```
| Layer                 | Status |
| Business Requirement  | ✅ (KPI rõ) |
| Stakeholder           | 🟡 (biết persona, chưa rõ nhu cầu) |
| Functional            | ⛔ (chưa xác định) |
| Non-functional        | ⛔ |
| Transition            | ⛔ |
```

Ưu tiên đào tầng ⛔ cao nhất (thường là Business/Stakeholder) trước khi xuống Functional.
