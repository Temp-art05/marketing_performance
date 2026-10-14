# Use Case Field Guide

Hướng dẫn điền từng field của template 13-field. Ví dụ dùng ngữ cảnh Interact.ai (app học nói
tiếng Anh với AI tutor Skye).

## Use Case ID
Format `UC-<module>-<seq>`, vd `UC-LESSON-01`, `UC-PAY-03`. Dùng phân cấp X.Y nếu có nhóm UC.

## Use Case Name — **Verb + Object**, active voice
- ✅ "Complete a speaking lesson", "Start free trial", "Retry pronunciation attempt"
- ❌ "Lesson" (thiếu verb) · "User completes lesson" (kèm actor) · "Manage lessons" (verb mơ hồ)

## Actor
- **Primary:** người khởi tạo UC và hưởng kết quả — cụ thể (Learner, không "User").
- **Secondary:** hệ thống/dịch vụ hỗ trợ (Speech-to-Text service, Payment gateway, Push service).

## Description
2–3 câu: *why* (lý do) + *what* (hành động) + *outcome* (kết quả).
> vd: "When a learner opens their daily lesson, they complete a spoken conversation with Skye
> and receive pronunciation feedback. The UC ends when the lesson is marked complete and the
> learner's streak is updated."

## Preconditions — phải đúng TRƯỚC khi UC bắt đầu, verifiable
- ✅ "Learner is signed in and has an active PRO or trial entitlement."
- ❌ "Learner is motivated" (không verify được — đó không phải precondition).

## Postconditions — trạng thái sau khi thành công, verifiable
- ✅ "Lesson record saved with status='Completed'; streak incremented by 1; pronunciation
  scores persisted to learner history."
- ❌ "Learner feels confident" (không verify được).

## Priority / Frequency
- Priority: High/Medium/Low, kèm 1 câu lý do (vd "High — core daily loop, ảnh hưởng D1 retention").
- Frequency: định lượng ("~1–3 lessons/learner/day"), không "sometimes".

## Normal Course of Events (quan trọng nhất)
- Đánh số, 1 action/step, xen kẽ Actor / System với chủ ngữ rõ.
- **KHÔNG nhúng if/else/loop/exception** — đẩy sang Alternative/Exception.
- vd:
  1. Learner taps "Start daily lesson".
  2. System loads today's conversation topic and displays Skye's opening prompt.
  3. Learner taps the mic and speaks a response.
  4. System sends audio to the STT service and returns a pronunciation score.
  5. System displays the score and Skye's follow-up prompt.
  6. Steps 3–5 repeat until the topic is finished. (lặp có kiểm soát — mô tả bằng lời, không code)
  7. System marks the lesson complete, updates streak, and shows the summary.

## Alternative Courses — đường khác vẫn THÀNH CÔNG
Format `UC-XX.AC.N` + "At step N, if [condition], ...".
> vd AC.1: "At step 3, if the learner types instead of speaking, the system accepts text input
> and skips pronunciation scoring for that turn."

## Exceptions — trường hợp goal THẤT BẠI
Format `UC-XX.EX.N`. Mỗi cái: trigger + system response + final state.
> vd EX.1: "Trigger: STT service times out (>5s). Response: system shows 'Couldn't hear you —
> tap to try again'. Final state: turn not scored; lesson remains in progress."

## Includes / Special Requirements / Assumptions / Notes
- **Includes:** sub-UC dùng chung (vd UC "Complete lesson" includes UC "Update streak").
- **Special Requirements:** NFR riêng của UC (vd "STT round-trip ≤ 800ms P95 on mid-range device").
- **Assumptions:** điều giả định chưa verify (khác precondition — precondition là bắt buộc cứng).
- **Notes and Issues:** `[TBD-N] | Owner | Due | Resolution`.
