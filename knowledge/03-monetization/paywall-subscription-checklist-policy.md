---
title: Checklist paywall / subscription / IAP đúng policy (Google Play + App Store)
type: reference
topic: 03-monetization
tags: [subscription, iap, paywall, free-trial, policy, google-play, app-store, hybrid-monetization]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-108 - Tester Workflow Toolkit/Skill Q&A review/File skill-qa-reviewer/references/sub-iap-policy.md (đọc 2026-10-14)
  - AI Knownledge/APR-107 - Policy Killer Tool-Tra & Fix lỗi Policy trên Google Play Console & Apple App Sto/Policy-Helper-San-Pham.zip → index.html (lỗi Subscriptions, 3.1.2, 2.1, Code of Conduct) (đọc 2026-10-14)
  - AI Knownledge/APR-092 - Skill gen Q&A và Testcase từ tài liệu đặc tả/Skill gen testcase/vanptu-skill-gen-testcase.md (§ SUB CHECKLIST) (đọc 2026-10-14)
  - https://support.google.com/googleplay/android-developer/answer/9900533
  - AI Knownledge/APR-268 - IOS Apply RevenueCat SDK/README.md, references/revenuecat-api-cheatsheet.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md
  - 03-monetization/quy-tac-dat-quang-cao-in-app-apero.md
  - 06-tools/ios-revenuecat-paywall-skill.md
  - 06-tools/meta-ads-dashboard.md
  - 03-monetization/remote-config-ads-theo-phase-build-normal-2floor.md
  - 03-monetization/admob-co-ban.md
summary: 10 quy tắc paywall nội bộ Apero (4 thông tin bắt buộc, cách trình bày free trial, sale, cancel anytime, PP/ToS, nút Cancel sub Android, Restore iOS) kèm lỗi policy thật đã gặp và rule mặc định "mua Sub → tắt mọi ads".
---

# Checklist paywall / subscription đúng policy

## Bối cảnh

App ads-only vẫn hay thêm gói Sub "Remove ads/Premium" (hybrid). Bài này gom checklist nội bộ của QA Apero (APR-108) và các lỗi Subscriptions mà team ASO đã thực sự gặp (APR-107). Đây là chuẩn nội bộ, khi có tranh chấp thì đối chiếu [Google Play Subscriptions policy](https://support.google.com/googleplay/android-developer/answer/9900533) và Apple Guideline 3.1.

## Checklist (APR-108)

| # | Áp dụng | Quy tắc |
|---|---|---|
| 1 | Mọi gói | Hiển thị đủ **4 thông tin**: giá, quyền lợi, thời hạn gói, số ngày dùng thử (nếu có trial) |
| 2 | Free trial | Text dạng *"start with X days trial then [giá]"*, nói rõ sau trial sẽ trả bao nhiêu |
| 3 | Free trial | "Free trial" **không được là button riêng**. Phải nằm trong button có giá + thời hạn |
| 4 | Free trial | Trong button, chữ "free trial" **nhỏ hơn** giá và thời hạn |
| 5 | Free trial | Popup thanh toán của store phải hiện ngày bắt đầu trial và ngày bắt đầu tính tiền. **Tên gói trên store không chứa chữ "trial"**. Lỗi điển hình: ngày tính tiền lại là hôm nay do setup trial sai |
| 6 | Sale | Hiện cả giá gốc (gạch ngang) và giá sau sale |
| 7 | Sub | Có câu *"Cancel anytime"* hoặc tương đương |
| 8 | Sub | Có link **Privacy** và **Terms of Service** trên màn sub |
| 9 | Android | Sau khi mua phải có mục **"Cancel sub"** trong app (Settings/Profile), dẫn thẳng tới mục Subscriptions của Play Store |
| 10 | iOS | Bắt buộc có nút **Restore** (Apple 3.1.1) |

Red flag: spec nhắc "upgrade/premium/unlock" nhưng không có section paywall thì coi là thiếu P0.

## Lỗi thật đã gặp (APR-107)

- **Google Play — Subscriptions** (🔴): paywall không rõ điều khoản, hoặc **giá hiển thị lệch giá thật**. Cách fix: hiện rõ giá kỳ đầu, thời hạn, giá sau trial, cách huỷ; chữ giá dễ đọc; **nút đóng thấy rõ**; sửa logic lấy giá theo product id + **offer id** để khớp paywall.
- **iOS 3.1.2**: thiếu PP/ToS; **so sánh giá gói** (vd weekly vs monthly) gây hiểu nhầm, phải bỏ.
- **iOS 2.1**: loading vô hạn ở màn mua sub, cần thêm time-out; gói IAP phải submit **cùng build đầu**; gửi reviewer video cách mua.
- **iOS Code of Conduct**: hiện paywall/promote liên tiếp ngay sau khi user vừa từ chối, phải tắt.
- **Play Console Requirements**: reviewer không vào được tính năng sau paywall. Cần cấp demo account full premium và khai App Access, có thể dùng remote config tắt paywall lúc in review.

## Liên quan tới ads

- Rule mặc định trong spec Apero (APR-092): **mua Sub thành công → mọi ad ẩn, không request, không show**, và dấu hiệu "xem ads" ở nút reward cũng ẩn. Spec có rule riêng (chỉ ẩn một số ad) thì làm theo spec.
- Nghĩa với đo lường: user Sub không còn sinh ad revenue. Khi tính LTV hybrid phải cộng doanh thu Sub (sau phí store) với ad revenue của user free. Ví dụ dashboard [Meta Ads](../06-tools/meta-ads-dashboard.md) nhân ROAS với 0.7. **Giả thuyết (chưa xác nhận)**: quy về doanh thu net sau phí store 30% — nguồn không giải thích; lưu ý phí store thực tế có thể khác 30% tuỳ chương trình/gói (đã đặt mốc hỏi owner).

## Paywall theo placement + remote flag (từ skill RevenueCat iOS, APR-268)

> Bổ sung 2026-10-14 từ tài liệu ứng viên về [skill ios-integrate-revcat](../06-tools/ios-revenuecat-paywall-skill.md). Skill là iOS, nhưng nguyên tắc dùng được cho app hybrid nói chung.

- Mỗi **điểm mở paywall** (onboarding, home, tính năng…) gắn một `placement` riêng. RevenueCat chọn offering theo thứ tự: Targeting Rule khớp placement → Targeting Rule không placement → offering mặc định → `nil` — nên A/B test giá/paywall theo placement **không cần release app** (theo cheatsheet SDK 5.15.x trong skill; chưa đối chiếu docs RevenueCat).
- Mỗi điểm mở paywall nên có **1 remote flag** (vd `show_onboarding_paywall`) để tắt nhanh khi paywall làm tụt retention hoặc ad revenue — cùng tư duy với RC bật/tắt ads ([Remote Config theo phase](remote-config-ads-theo-phase-build-normal-2floor.md)). Đây cũng là cách tắt paywall khi app đang review (lỗi Play Console Requirements ở trên).
- Có **paywall mặc định viết bằng code** khi offline/không có offering, tránh màn trắng/loading vô hạn (lỗi iOS 2.1 ở trên).

## Bài học

- Lỗi paywall hay nằm ở **setup trên store** (tên gói, trial period, offer id), không chỉ ở UI. Khi review cần mở cả Play Console/App Store Connect ra xem.
