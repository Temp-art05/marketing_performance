---
title: Policy store cho app AI chỉnh ảnh (ảnh mặt, ad SDK, nội dung AI) và rủi ro đặt tên app
type: reference
topic: 01-pre-marketing
tags: [policy, google-play, app-store, data-safety, ai-generated-content, trademark, app-name]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-037 - Skill research quy định của pháp luật, policy nền tảng/Demo output.xlsx (Legal Apero, cập nhật 07/2026; đọc 2026-10-14)
  - AI Knownledge/APR-037 - Skill research quy định của pháp luật, policy nền tảng/legal-and-platform-policy-research.md (đọc 2026-10-14)
  - AI Knownledge/APR-055 - Super Legal/1-ASSET-super-legal.md.docx (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/aso-google-play-store-listing.md
  - 06-tools/legal-platform-policy-research-skill.md
  - 06-tools/super-legal-check-trademark-ten-app.md
  - 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md
  - 03-monetization/quy-tac-dat-quang-cao-in-app-apero.md
  - 06-tools/policy-helper-tra-cuu-loi-policy.md
summary: Checklist policy Apple/Google cho app AI chỉnh ảnh chân dung gửi data sang ad SDK (consent, Data safety, report nội dung AI, photo picker, license ảnh stock, trẻ em) và rule rủi ro trademark khi đặt tên app.
---

# Policy store cho app AI chỉnh ảnh và rủi ro đặt tên app

> Phạm vi: **phòng ngừa trước khi build/launch** (checklist theo tính năng + đặt tên app). Khi app **đã bị** Google/Apple báo lỗi, xem [lỗi policy thường gặp và cách fix](policy-loi-thuong-gap-va-cach-fix.md) (kho 45 lỗi thật của team ASO).

## Bối cảnh

Legal team Apero đã chạy skill research policy (APR-037) cho một ca mẫu: **app chỉnh ảnh chân dung, user upload ảnh mặt, AI ghép nền mới (nguồn stock + AI tạo sinh), lưu ảnh 30 ngày, gửi dữ liệu sang SDK quảng cáo, thị trường Mỹ + EU**. Đây đúng là mô hình nhiều app ads-only của Apero. Kết quả tham khảo cập nhật 07/2026, căn cứ Apple App Store Review Guidelines (bản 13/11/2025 và 2/2026) và Google Play Developer Program Policy. Nguồn ghi rõ đây **không phải tư vấn pháp lý cuối cùng**. Phần này chỉ là policy nền tảng; luật (GDPR, CCPA, BIPA, AI Act, COPPA) cần Legal rà riêng.

Policy nền tảng ≠ luật. Phải tuân thủ cả hai, chỗ nào chặt hơn thì theo chỗ đó.

## 1. Checklist policy (Google Play là chính, Apple để đối chiếu)

| # | Vấn đề | Google Play | Apple | Hậu quả nếu sai |
|---|---|---|---|---|
| 1 | **Gửi dữ liệu/định danh sang ad SDK** (rủi ro cao nhất) | Developer chịu trách nhiệm hành vi của SDK bên thứ ba; khai báo đúng ở **Data safety**; có consent khi cần | 5.1.2(i) (bản 11/2025): công khai nơi chia sẻ dữ liệu, **kể cả third-party AI**, và xin phép rõ ràng **ngay trong app**; tracking phải qua ATT | Gỡ app / loại khỏi Developer Program |
| 2 | Thu thập và lưu ảnh mặt | User Data policy: minh bạch, có privacy policy, chỉ thu cái cần | 5.1.1: privacy policy trong app và trên App Store Connect, consent, tối thiểu hoá dữ liệu | Reject / gỡ |
| 3 | **Nội dung do AI tạo** | AI-Generated Content policy: không tạo nội dung bị cấm; **bắt buộc có nút report/flag trong app** và dùng report đó để kiểm duyệt | Review kỹ hơn; cần cơ chế report, có quyền với dữ liệu, minh bạch là nội dung AI | Reject nếu thiếu cơ chế report/kiểm duyệt |
| 4 | Ảnh stock, bản quyền, nhãn hiệu | IP policy: cấm vi phạm bản quyền/nhãn hiệu; **giữ bằng chứng license** | 5.2 Intellectual Property | Gỡ app + khiếu nại DMCA |
| 5 | Lưu ảnh 30 ngày | Data safety: khai thời gian lưu và cơ chế **yêu cầu xoá** | 5.1.1: nêu chính sách lưu/xoá; có tài khoản thì phải cho xoá tài khoản trong app | Reject / gỡ |
| 6 | Quyền truy cập ảnh | Photo and Video Permissions: dùng một lần thì dùng **Android Photo Picker**, không xin quyền rộng | 5.1.1(iii): dùng picker ngoài tiến trình | Reject |
| 7 | Ghép mặt, nguy cơ deepfake/mạo danh | Deceptive Behavior / Misrepresentation | 1.2 (UGC) và chính sách nội dung | Gỡ app |
| 8 | Có chia sẻ/cộng đồng (UGC) | UGC policy: kiểm duyệt, report, xoá nội dung/chặn user | 1.2: lọc, report, chặn, công bố liên hệ | Reject / gỡ |
| 9 | Trẻ em và độ tuổi | Families policy có quy định riêng về ads/SDK; đặt content rating và target audience đúng để **không vô tình rơi vào diện trẻ em** | 1.3 / 5.1.4: app cho trẻ em không dùng third-party ads/analytics | Cao nếu vô tình nhắm trẻ em (xung đột với ad SDK) |
| 10 | Nhãn privacy phải khớp hành vi thật (kể cả SDK) | Data safety khai sai là vi phạm | App Privacy details | Gỡ / phạt |

**Việc nên làm để qua review** (đề xuất của Legal trong ca mẫu): màn hình consent trước khi gửi dữ liệu sang ad SDK; nút Report trong app cho phần AI; dùng Photo Picker; công bố thời hạn lưu và có nút xoá dữ liệu; điền Data safety/App Privacy khớp app + SDK; lưu hồ sơ license ảnh stock; gắn nhãn "AI-generated"; đặt content rating và target audience đúng.

**Liên quan UA**: khai Data safety sai hoặc vi phạm policy ads thì app có thể bị gỡ hoặc **ngừng phân phát quảng cáo**. Rà checklist này **trước khi** đổ budget UA, nằm trong bước Pre-Marketing của roadmap.

## 2. Đặt tên app: rủi ro trademark

Bộ rule do Legal Apero kiểm soát (trong tool Super Legal, APR-055, 07/2026):
- Tra tên app ở **USPTO (Mỹ), WIPO Global Brand DB, Cục SHTT Việt Nam, App Store/Google Play**.
- **Rủi ro cao**: tên trùng + nhãn đang Live/đã đăng ký + thuộc **nhóm Nice 9** (phần mềm) **hoặc 42** (dịch vụ phần mềm/SaaS).
- **Look-alike**: tên lệch 1–2 ký tự so với nhãn đã đăng ký (typosquat, ví dụ "Slotify" ≈ "Spotify") cũng là rủi ro.
- Tên chứa **brand/nhân vật nổi tiếng** là rủi ro cao. Tên mô tả/chung chung chỉ là cảnh báo yếu (guideline đặt tên nội bộ A847).
- "AI tự tin" ≠ "được phép dùng". Ca rủi ro do Legal quyết.
- Liên hệ với ASO: [metadata policy của Google](aso-google-play-store-listing.md) cũng cấm nhắc tên app/thương hiệu khác trong title/description để câu traffic.

## 3. Cách tự research policy cho tính năng mới (phương pháp Legal Apero)

1. Chốt **mục tiêu** (ví dụ "launch tính năng X ở US+EU mà không bị reject/gỡ") và thị trường.
2. Hỏi: tính năng dùng **dữ liệu/nội dung gì, của ai, ở đâu** (có ảnh mặt? trẻ em? gửi cho SDK/API bên thứ ba?).
3. Đối chiếu **cả** Apple Review Guidelines và Google Play Policy, luôn lấy **bản mới nhất** và ghi ngày bản đang trích.
4. Nhóm hay vướng: bản quyền/trademark bên thứ ba; dùng Google Search/API và ToS nguồn nội dung; Data safety/App Privacy; lọc nội dung; monetization/quảng cáo; trẻ em; AI tạo sinh.
5. Luật Mỹ mặc định (COPPA, CCPA/CPRA, FTC Act, 17 U.S.C.). Chỉ thêm EU (GDPR, DSA, AI Act) khi có dữ liệu cá nhân.
6. Phân biệt: "hiển thị kết quả tìm kiếm" ≠ "được cấp phép dùng ảnh" (lấy ảnh từ Google Images không cho app quyền dùng).
