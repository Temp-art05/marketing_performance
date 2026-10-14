# Intent Detection Logic

Cách nhận diện loại request và nước đi đầu tiên cho từng loại. Mục tiêu: đọc đúng "user
thực sự đang nói loại vấn đề gì" để hỏi đúng hướng, không lạc.

## Bảng intent + signal + first move

| Intent | Signal phrase điển hình | First move (nước đi đầu) |
|---|---|---|
| **Feature Request** | "thêm nút X", "cần build màn Y", "add a screen" | Hỏi problem đằng sau feature: nó phục vụ mục tiêu/pain nào? |
| **Complaint** | "X bị lỗi", "user phàn nàn", "chậm quá" | Hỏi tần suất + tác động: xảy ra bao nhiêu, ảnh hưởng ai, mất gì? |
| **Operational Pain** | "team làm tay hàng giờ", "copy-paste thủ công" | Hỏi as-is flow: mô tả quy trình hiện tại từng bước |
| **Workaround** | "hiện đang export Excel", "dùng nhóm Zalo để..." | Đào lý do tồn tại workaround: hệ thống thiếu gì? |
| **KPI Goal** | "giảm churn X%", "tăng conversion từ A→B" | Hỏi baseline + driver: con số hiện tại, giả thuyết vì sao |
| **Solution Bias** ⚠️ | user nêu thẳng tool/tech làm requirement ("cần AI", "làm recommendation") | Coi solution là giả thuyết → hỏi vấn đề nó định giải |
| **Business Objective** | "OKR quý này", "leadership muốn" | Ánh xạ objective → user problem cụ thể đo được |
| **Process Issue** | "duyệt lâu", "handoff giữa team không rõ" | Vẽ swimlane: ai làm gì, chỗ nào tắc |
| **Reporting Need** | "cần report hiện X", "export data" | Hỏi decision: ai đọc, ra quyết định gì từ số liệu |
| **Compliance** | "quy định yêu cầu", "auditor flag", "PII/PDPA" | Hỏi rule cụ thể + hậu quả nếu vi phạm |

## Solution Bias — vì sao nguy hiểm nhất

Đây là bẫy phổ biến nhất. Khi PO/stakeholder nói "cần feature AI" hay "làm hệ thống loyalty",
họ đã nhảy tới solution mà chưa chốt problem. Nếu nhận nguyên → dễ xây đúng thứ cho sai vấn đề.

**Cách xử lý:** treat solution như 1 hypothesis. Batch câu hỏi đầu nhắm vào vấn đề đằng sau.

> Ví dụ (Interact.ai): user nói *"cần thêm AI memory cho app học tiếng Anh"*.
> Đừng nhận ngay. Hỏi: phần nào của trải nghiệm đang hỏng? Retention D1 thấp vì user quay
> lại thấy AI "quên" mình? Hay vấn đề thật là onboarding chưa cho thấy value? "AI memory" là
> giải pháp — problem có thể là *"user không cảm nhận được sự cá nhân hóa giữa các buổi học"*.

## Khi intent mơ hồ / trộn nhiều loại

- Nếu 1 câu chứa nhiều intent (vd complaint + feature request), tách và xử lý cái gốc trước
  (thường là pain/problem, không phải feature).
- Nếu không phân loại được sau 1 lượt, hỏi trực tiếp: *"Bạn đang mô tả một vấn đề đang gặp,
  hay đã có hướng giải pháp trong đầu rồi?"* — câu này tách nhanh problem vs solution.
