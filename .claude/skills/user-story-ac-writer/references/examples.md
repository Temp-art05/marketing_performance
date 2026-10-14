# User Story + AC — Examples (Interact.ai)

Ví dụ mẫu cho các flow thật của app học nói tiếng Anh với AI tutor Skye.

---

## Ví dụ 1 — Bắt đầu free trial

**US-TRIAL-01**: Start free trial from paywall

**As a** Newbie learner đang cân nhắc sau khi xem demo hội thoại với Skye
**I want to** bắt đầu dùng thử miễn phí trong 1 chạm
**So that** trải nghiệm đầy đủ trước khi quyết định trả tiền

**INVEST self-check:**

| Tiêu chí | ✅/⚠️ | Ghi chú |
|---|---|---|
| Independent | ✅ | |
| Negotiable | ✅ | |
| Valuable | ✅ | Giảm rào cản trước paywall |
| Estimable | ✅ | |
| Small | ✅ | |
| Testable | ✅ | |

**AC1: Happy path**
- **Given** learner đang ở paywall sau demo, chưa có subscription
- **When** learner tap "Start free trial"
- **Then** system tạo trial entitlement, mở khóa nội dung PRO, và điều hướng vào Home
- **And** hiển thị ngày kết thúc trial rõ ràng

**AC2: Edge — đã từng dùng trial**
- **Given** learner từng dùng trial trước đó (đã hết hạn)
- **When** learner tap "Start free trial"
- **Then** system không cấp trial mới, hiển thị các gói trả phí thay thế

**AC3: Negative — tạo trial thất bại**
- **Given** learner tap "Start free trial"
- **When** backend trả lỗi khi tạo entitlement
- **Then** system giữ nguyên paywall và hiển thị "Couldn't start your trial. Try again."

---

## Ví dụ 2 — Nhận phản hồi phát âm trong buổi học

**US-LESSON-02**: Get pronunciation feedback per spoken turn

**As a** Newbie learner luyện nói với Skye
**I want to** thấy điểm phát âm ngay sau mỗi câu tôi nói
**So that** biết mình sai ở đâu và cải thiện ngay trong buổi

**AC1: Happy path**
- **Given** learner đang trong buổi học và đã cấp quyền mic
- **When** learner nói xong một câu
- **Then** system hiển thị điểm phát âm cho câu đó trong ≤ 800ms và Skye đưa prompt tiếp theo

**AC2: Edge — không nghe rõ**
- **Given** learner nói nhưng âm thanh không rõ / quá ngắn
- **When** hệ thống không chấm được
- **Then** system hiển thị "Couldn't hear you — tap to try again", không tính điểm, giữ buổi học tiếp diễn

**AC3: Negative — mic bị từ chối**
- **Given** learner chưa cấp quyền mic
- **When** learner tap nút nói
- **Then** system hiển thị hướng dẫn bật quyền mic trong Settings, không crash buổi học

---

## Ví dụ 3 — Hủy đăng ký (chống dark pattern)

**US-BILLING-03**: Cancel subscription without friction

**As a** learner đang có subscription
**I want to** hủy đăng ký dễ dàng ngay trong app
**So that** tôi tin tưởng ứng dụng và không sợ bị "bẫy" phí

**AC1: Happy path**
- **Given** learner có subscription active
- **When** learner vào Settings → Manage subscription → Cancel và xác nhận
- **Then** system hướng dẫn đúng nơi hủy (iOS Settings với Apple sub) hoặc hủy trực tiếp (web/Stripe)
- **And** hiển thị rõ ngày entitlement kết thúc

**AC2: Edge — hủy trong trial**
- **Given** learner đang trong trial
- **When** learner hủy trước ngày hết trial
- **Then** system xác nhận sẽ không bị tính phí, entitlement giữ tới hết trial

**AC3: Negative — thao tác hủy lỗi**
- **Given** learner xác nhận hủy
- **When** thao tác thất bại (mạng/backend)
- **Then** system hiển thị lỗi + cách thử lại, KHÔNG để trạng thái mập mờ khiến user tưởng đã hủy

---
*PO Document Skill Set · nội bộ.*
