# Use Case Quality Checklist (20 points)

Chạy trước khi bàn giao. Output bảng `Item | Status | Note` (✅ ❌ ⚠️). Fail → sửa hoặc flag.

## Scope & Identification (C1–C5)
- **C1** — UC Name theo "verb + object", active voice.
- **C2** — UC ở user-goal level (qua coffee-break test: xong actor nghỉ được, không thấy dở dang).
- **C3** — UC ID unique, đúng convention `UC-<module>-<seq>`.
- **C4** — Đúng 1 primary actor + 1 business goal.
- **C5** — System boundary rõ (không trộn nhiều hệ thống như một).

## Actor & Context (C6–C8)
- **C6** — Actor là role cụ thể, không "User".
- **C7** — Description trả lời WHY + WHAT + OUTCOME.
- **C8** — Frequency of Use định lượng (không "sometimes").

## Pre / Post conditions (C9–C11)
- **C9** — Preconditions verifiable (không phải business rule trá hình).
- **C10** — Postconditions phủ trạng thái thành công + mọi thay đổi hệ thống.
- **C11** — Không lẫn Preconditions với Assumptions (precondition = bắt buộc cứng).

## Normal Course (C12–C15)
- **C12** — Đánh số, 1 action/step.
- **C13** — Xen kẽ Actor/System, chủ ngữ rõ.
- **C14** — KHÔNG if/else/loop/exception nhúng trong Normal Course.
- **C15** — Chạy từ trigger tới postcondition, không step lơ lửng.

## Alternative & Exception (C16–C18)
- **C16** — Mỗi AC ghi "at step N" + điều kiện.
- **C17** — Mỗi Exception có trigger + system response + final state.
- **C18** — Phủ failure mode phổ biến: timeout, invalid input, network, permission denied, concurrency.

## Completeness (C19–C20)
- **C19** — Includes (nếu có) trỏ tới UC tồn tại.
- **C20** — Special Requirements không trùng lặp functional requirement (đó là NFR).

---
Ví dụ pass/fail nhanh:
- C1 ❌ "Lesson management" → ✅ "Complete a speaking lesson"
- C9 ❌ "Learner wants to practice" → ✅ "Learner is signed in with active entitlement"
- C14 ❌ "3. If offline, show error; else continue" → tách xuống Exception
