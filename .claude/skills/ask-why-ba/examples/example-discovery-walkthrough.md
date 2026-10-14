# Example — Discovery walkthrough (Interact.ai)

Kịch bản mẫu minh họa workflow discovery. Cho thấy cách xử lý Solution Bias và đào tới root cause.

---

**Input (thô):** *"Mình cần thêm AI memory cho app học tiếng Anh — competitor có rồi."*

### Lượt 1 — Intent + Solution Bias
Intent: **Solution Bias** (nêu thẳng "AI memory" làm requirement).
Không nhận ngay. Hiện layer status (Business ⛔, Stakeholder 🟡, Functional 🟡).

3 câu hỏi:
1. Phần nào của trải nghiệm hiện tại đang hỏng khiến bạn nghĩ tới AI memory?
2. KPI nào bạn kỳ vọng cải thiện — retention, trial-to-paid, hay engagement?
3. User phàn nàn cụ thể điều gì giữa các buổi học?

### Lượt 2 — Paraphrase + đào root cause
User trả lời: *"User Newbie quay lại buổi 2 thì AI hỏi lại từ đầu, họ thấy như bắt đầu lại,
nhiều người bỏ. D1 retention thấp."*

Paraphrase + phân loại:
> "Vậy pain là: user quay lại buổi 2 thấy AI 'quên' mình → cảm giác reset → drop. Đây là
> **root cause về cảm nhận cá nhân hóa**, không hẳn là 'thiếu tính năng AI memory' về mặt kỹ
> thuật. 'AI memory' là một solution khả dĩ; problem thật là *trải nghiệm giữa các buổi bị đứt gãy*."

### Lượt 3 — Edge case scan
Hỏi thêm: nếu user nghỉ 3 ngày rồi quay lại thì sao? Nếu học 2 thiết bị? Nếu AI nhớ sai
thông tin thì user sửa kiểu gì?

### Structured summary (rút gọn)
- **business_problem:** Trải nghiệm học giữa các buổi bị đứt gãy — user Newbie quay lại thấy như bắt đầu lại.
- **business_goal:** Tăng D1 retention của segment Newbie (baseline → target cần đo).
- **root_causes:** AI không giữ ngữ cảnh buổi trước → mất cảm giác tiến bộ & cá nhân hóa.
- **assumptions:** "AI memory" sẽ giải quyết được (chưa validate — có thể vấn đề là cách *thể hiện* sự ghi nhớ ra UI).
- **open_questions:** Đo D1 hiện tại của Newbie là bao nhiêu? Memory cần nhớ những gì (level, lỗi hay gặp, mục tiêu)?

> Bài học: nếu nhận nguyên "làm AI memory", có thể build đúng tính năng nhưng vẫn không kéo
> được retention nếu UI không *cho user thấy* app nhớ mình.

---
*PO Document Skill Set · nội bộ.*
