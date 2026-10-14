# Use Case Writing Style

Quy ước viết để UC nhất quán, dễ đọc cho dev/QA.

## Ngôn ngữ & giọng văn
- UC artifact luôn **English** (chat với user theo ngôn ngữ user).
- **Active voice, subject rõ.** Mỗi step Normal Course bắt đầu bằng chủ ngữ (Learner / System)
  + động từ chủ động. Tránh passive ("is displayed by the system" → "System displays").
- Present tense, câu ngắn, 1 ý/step.

## Numbering
- Normal Course: 1, 2, 3... liên tục.
- Alternative: `UC-XX.AC.1`, `.AC.2`. Exception: `UC-XX.EX.1`, `.EX.2`.
- Mỗi AC/EX neo vào step cụ thể: "At step N of Normal Course...".

## Mức chi tiết đúng
- Mô tả **tương tác** actor↔system, KHÔNG mô tả nội bộ hệ thống (thuật toán, query, API path).
  - ✅ "System returns a pronunciation score."
  - ❌ "System calls POST /score with base64 audio and parses JSON." (đó là design/impl)
- Mỗi step phải là: actor làm gì với system (input) HOẶC system phản hồi actor (output). Step
  không có actor lẫn UI phản hồi → là chi tiết thiết kế, bỏ ra khỏi UC.

## Từ ngữ tránh
| Tránh | Vì | Thay bằng |
|---|---|---|
| "user-friendly", "fast", "appropriate" | không đo được | metric cụ thể ở Special Requirements |
| "Manage", "Handle", "Process" (trong Name) | verb mơ hồ | verb cụ thể (Enroll, Retry, Cancel) |
| "System is ready" (precondition) | không verify | điều kiện verify được |
| "etc.", "and so on" trong course | mơ hồ scope | liệt kê rõ hoặc tách UC |

## Nhất quán thuật ngữ
- Đặt tên actor/entity một kiểu xuyên suốt (Learner, không lúc "user" lúc "learner").
- Tên màn/nút viết hoa nhất quán và trùng với UI thật khi đã biết (**Start daily lesson**).
