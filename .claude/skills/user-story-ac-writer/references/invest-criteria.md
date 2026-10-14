# INVEST Criteria

6 tiêu chí đánh giá một User Story tốt. Dùng khi self-check trước khi xuất.

| Tiêu chí | Nghĩa | Câu hỏi kiểm | Nếu fail |
|---|---|---|---|
| **I — Independent** | Story tự đứng được, ít phụ thuộc | Có buộc phải làm story khác trước không? | Tách dependency, hoặc gộp/đổi thứ tự |
| **N — Negotiable** | Còn chỗ thảo luận, không đóng cứng chi tiết impl | Story có ép sẵn cách làm kỹ thuật không? | Bỏ chi tiết implementation, để lại "cái gì" |
| **V — Valuable** | Mang giá trị rõ cho user/business | "So that" có nêu value thật không? | Viết lại "So that" cho ra giá trị |
| **E — Estimable** | Dev ước lượng được effort | Đủ context để estimate chưa? | Thêm context/constraint/AC |
| **S — Small** | Vừa 1 sprint | Có quá to (nhiều persona/CRUD)? | Split |
| **T — Testable** | QA viết được test case | Có tiêu chí nghiệm thu rõ chưa? | Bổ sung AC đo được |

## Ghi chú áp dụng

- **Independent vs Small** hay xung đột: story nhỏ quá đôi khi phụ thuộc nhau. Ưu tiên
  Testable + Valuable trước; Independent là "nên có", không tuyệt đối.
- **Negotiable**: story mô tả *cái gì user cần*, không phải *dev code thế nào*. Nếu thấy
  "call API", "dùng Redis" trong story → vi phạm Negotiable, chuyển xuống ghi chú kỹ thuật.
- **Testable** là tiêu chí không khoan nhượng: story không có AC đo được thì QA không nghiệm
  thu được → luôn kèm tối thiểu 3 AC.

## Ví dụ nhanh (Interact.ai)
- ❌ V yếu: "So that I can use the app." → ✅ "So that I see my pronunciation improve each day."
- ❌ S fail: "As a learner I want to manage my whole profile" → split: đổi email / đổi mục tiêu học / đổi nhắc giờ học.
