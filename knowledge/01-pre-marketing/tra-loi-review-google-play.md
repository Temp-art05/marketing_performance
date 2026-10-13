---
title: Trả lời review Google Play — phân loại ưu tiên, review rủi ro tài khoản, mẫu reply
type: playbook
topic: 01-pre-marketing
tags: [aso, review, rating, google-play, policy, android-vitals]
app: general
status: draft
confidence: medium
sources:
  - "AI Knownledge/APR-013 - ASO Agent - Auto Reply/ASO-Agent-L2-package.zip → PRD-ASO-Agent.md, ASO-Agent-source-v2.11.1.zip → llm.js, autoreply.js (đọc 2026-10-14)"
  - "https://developers.google.com/android-publisher/reply-to-reviews (truy cập 2026-10-14)"
  - "https://developer.android.com/topic/performance/vitals (truy cập 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/aso-google-play-store-listing.md
  - 06-tools/aso-agent-review-listing-vitals.md
  - 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md
summary: Quy tắc reply review Play — routing P1–P4 theo sao + nội dung, 5 nhóm review rủi ro tài khoản (refund/scam/privacy/ad/false-ad), cấu trúc reply 4 bước, điều cấm, giới hạn API và ngưỡng Vitals.
---

# Trả lời review Google Play

## Bối cảnh

Rating và review ảnh hưởng tới CVR của store listing, tức hiệu quả mọi đồng UA đổ vào. Quy tắc dưới đây lấy từ **ASO Agent** (công cụ nội bộ Apero/Terasofts, owner LinhNXG, v2.11.1, 07/2026; theo mô tả đã gửi khoảng 3.000 reply/7 ngày trên khoảng 60 app). Giới hạn API và ngưỡng Vitals đã đối chiếu với tài liệu Google ngày 2026-10-14.

## 1. Phân loại ưu tiên (quyết định bằng rule, không để LLM tự chọn)

| Ưu tiên | Điều kiện | Tình huống |
|---|---|---|
| **P1** | Review ≤3★ chạm **rủi ro tài khoản** (xem mục 2), hoặc ≤3★ có từ khoá lỗi (crash, freeze, black screen, not working, stuck…) | risk / bug |
| **P2** | ≤2★, mới (≤30 ngày) | negative |
| **P3** | 3–4★ | near-satisfied: hỏi điều gì còn thiếu |
| **P4** | 5★ | praise: cảm ơn ngắn |

Tinh chỉnh tình huống: có từ khoá giá/billing (price, refund, subscription, charged…) thì chuyển sang mẫu "giá". Không có lỗi mà hỏi cách dùng (how to, can't find, where is…) thì chuyển sang mẫu "hiểu nhầm tính năng".

Tier xử lý: **A** (khen, an toàn, cho phép auto) · **B** (cần người duyệt: ads, bug, thanh toán, góp ý, 3★) · **C** (nhạy cảm như scam/bảo mật, **bắt buộc** người duyệt).

## 2. Review "account-safety": 5 nhóm có thể kéo down-rank hoặc gây suspend

Chỉ xét review ≤3★, để tránh false-positive ở review khen. Thứ tự ưu tiên khi trùng nhiều nhóm:

1. **refund**: hoàn tiền, bị trừ tiền, không huỷ được gói. Cách reply: đồng cảm, **không nhận lỗi, không hứa hoàn tiền công khai**, nhắc huỷ gói trong cài đặt subscription của store, mời liên hệ support trong app.
2. **content (false advertising)**: "misleading", "not as advertised", "fake app", "quảng cáo sai". Cách reply: ghi nhận, **không thừa nhận lỗi pháp lý**, giải thích ngắn ý định, mời support. Nhóm này liên quan trực tiếp tới creative UA: ad hứa tính năng app không có sẽ sinh loại review này.
3. **scam**: "scam", "fraud", "lừa đảo". Cách reply: bình tĩnh, không cãi, xin lỗi về trải nghiệm, khẳng định app hợp lệ, mời support.
4. **privacy**: "steal data", "spyware", "virus", "privacy". Cách reply: nghiêm túc, nói rõ dữ liệu xử lý theo privacy policy và chỉ xin quyền cần thiết, mời support.
5. **adpolicy**: "adult ads", "gambling ads", "inappropriate ads", "porn". Cách reply: ghi nhận rằng ad không phù hợp không nên xuất hiện, đang cải thiện chất lượng ad, nhờ user báo ad cụ thể qua support. Với app thuần ads, nên chuyển review loại này cho team monetization để chặn category/advertiser trong AdMob/MAX.

## 3. Cấu trúc reply 4 bước và điều cấm

1. Cảm ơn và **nêu đúng vấn đề cụ thể** (chứng minh đã đọc, không viết chung chung).
2. Đồng cảm ngắn, không phòng thủ.
3. Hành động cụ thể. Chỉ hứa mốc thời gian khi chắc chắn.
4. Mời quay lại nhẹ nhàng. **Không bao giờ xin sao.**

Cấm: xin/đòi 5★; dùng một template cứng cho mọi review (giống bot); cãi, đổ lỗi, mỉa mai; nhắc lại thông tin cá nhân của user; hứa ngày fix khi chưa chắc; xử lý vấn đề nhạy cảm công khai (chuyển sang support). Reply viết **cùng ngôn ngữ với review**, ngắn (tool đặt ≤320 ký tự; giới hạn API là 350).

**Reply lần 2 sau khi fix lỗi** (mẫu T2) là hành động có đòn bẩy cao nhất để kéo rating lên: báo lỗi X đã sửa ở bản Y, mời cập nhật và thử lại, không đòi sao.

Mẫu cấu trúc (tiếng Việt, khi dùng phải dịch theo ngôn ngữ review):
- T1 bug: "Cảm ơn bạn đã báo lỗi {lỗi} trên {thiết bị/phiên bản}. Rất tiếc vì sự bất tiện. Đội ngũ đang kiểm tra và sẽ xử lý trong bản cập nhật tới…"
- T3 hiểu nhầm tính năng: "Tính năng {X} dùng bằng cách {hướng dẫn ngắn}. Nếu vẫn vướng, nhắn bộ phận hỗ trợ trong app…"
- T5 3–4★: "Bọn mình muốn làm tốt hơn. Bạn cho biết điều gì khiến trải nghiệm chưa trọn vẹn nhé?"

## 4. Auto-reply an toàn

Chỉ auto-reply review **4–5★, không có dấu hỏi, không chứa từ khoá phàn nàn** (ad/ads, crash, bug, refund, scam, subscription, too many, gambling…). Dùng template cố định theo ngôn ngữ, **không dùng LLM khi không có người duyệt**. Giãn nhịp gửi (mặc định ≤5 reply/app/lượt, cách nhau khoảng 12 giây). Mọi reply khác phải qua người duyệt.

## 5. Giới hạn của Google Play cần biết (chính thức)

- Reply to Reviews API chỉ lấy được review **tạo hoặc sửa trong 7 ngày gần nhất**, chỉ review **có nội dung**, chỉ của bản production. Review cũ hơn thì tải CSV trong Play Console.
- Reply tối đa **350 ký tự**. Quota mỗi app: 200 GET/giờ, 2.000 POST (reply)/ngày.
- API không trả quốc gia của review, nên chỉ đoán được ngôn ngữ qua chữ viết.
- **Android Vitals, ngưỡng bad behavior**: user-perceived crash rate **1,09%**, ANR rate **0,47%** (trung bình mọi thiết bị); theo từng model máy là **8%**. Vượt ngưỡng thì app bị giảm hiển thị trên Play. Version mới tệ hơn version trước (hồi quy) thì xử lý trước khi scale UA.

## Bài học / Kết luận

- Theo dõi rating trước/sau reply để đo hiệu quả. Ưu tiên P1 (bug + rủi ro), rồi tới follow-up sau khi fix.
- Review nhóm "content/false advertising" và "adpolicy" là tín hiệu ngược cho UA creative và monetization, không chỉ là việc của ASO.
