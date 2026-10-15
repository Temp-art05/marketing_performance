---
title: Lỗi policy thường gặp trên Google Play / App Store / Facebook và cách team Apero đã fix
type: reference
topic: 01-pre-marketing
tags: [policy, google-play, app-store, aso, store-listing, ads-policy, subscription, appeal]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-107 - Policy Killer Tool-Tra & Fix lỗi Policy trên Google Play Console & Apple App Sto/PRD.md (đọc 2026-10-14)
  - AI Knownledge/APR-107 - Policy Killer Tool-Tra & Fix lỗi Policy trên Google Play Console & Apple App Sto/Policy-Helper-San-Pham.zip → index.html, mảng KB 45 lỗi + DOCS link gốc (đọc 2026-10-14)
  - https://support.google.com/googleplay/android-developer/topic/9858052
  - https://developer.apple.com/app-store/review/guidelines/
  - "Play Console Help — Ratings, Reviews & Installs: https://support.google.com/googleplay/android-developer/answer/9898684 (WebFetch 2026-10-15)"
  - "Khoá UA Marketing Mobile App 2026 (Quocmedia, Quốc Anh), bài 2.1 — video ~11–12/2024, transcribe 2026-10-15"
created: 2026-10-14
updated: 2026-10-15
related:
  - 00-overview/khoa-hoc-quocmedia-ua-marketing-2026.md
  - 01-pre-marketing/aso-google-play-store-listing.md
  - 03-monetization/admob-co-ban.md
  - 03-monetization/quy-tac-dat-quang-cao-in-app-apero.md
  - 03-monetization/paywall-subscription-checklist-policy.md
  - 06-tools/policy-helper-tra-cuu-loi-policy.md
  - 01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md
  - 01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md
  - 01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md
  - 01-pre-marketing/tra-loi-review-google-play.md
  - 06-tools/cat-outro-watermark-video-hang-loat.md
  - 06-tools/tong-quan-cong-cu-ai-marketing.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
summary: "Kho 45 loại lỗi policy (Android, iOS, Facebook) team ASO Apero đã gặp — mô tả, cách fix đã dùng, link policy gốc; nhóm lỗi đụng trực tiếp UA/ASO: Deceptive Ads, Metadata, Impersonation, App Promotion."
---

# Lỗi policy thường gặp và cách team Apero đã fix

> Phạm vi: **xử lý khi đã bị báo lỗi** (case thật). Checklist phòng ngừa cho app AI ảnh + rủi ro trademark tên app: [policy app AI ảnh và đặt tên app](policy-app-ai-anh-va-dat-ten-app.md). Rà screenshot theo Metadata policy: [thiết kế screenshot store](thiet-ke-screenshot-store-quality-bar.md).

## Bối cảnh

- Nguồn: kho lỗi trong tool **Policy Helper** (APR-107, owner Thư Tạ Minh, team ASO Apero). Theo PRD, kho được tổng hợp từ **lịch sử xử lý policy thật** của team (sheet tracking Android + iOS + Facebook), đã bỏ tên người, mã app và link nội bộ. Cập nhật khoảng 07/2026.
- Đây là **kinh nghiệm nội bộ**, không phải văn bản chính thức. Khi xử lý case thật, luôn đọc lại policy gốc (link ở cuối bài) và hỏi Team ASO nếu case phức tạp.
- Mức độ: 🔴 nặng (dễ bị gỡ app/suspend), 🟡 cảnh báo, ℹ️ thông tin. Mức này do tool gán, không phải phân loại của Google/Apple.

## Mẫu fix chung cho Google Play

Hầu hết cách fix Android đều đi theo cùng một chuỗi:
1. Sửa nguyên nhân (code, SDK, store listing, khai báo Console).
2. Build version mới, **roll 100% ở mọi môi trường/track đang bị báo** để bản mới đè bản dính lỗi.
3. Nếu cần kháng (appeal): gửi kèm bằng chứng (ảnh/video đã gỡ SDK/logic, video hướng dẫn dùng quyền).

## 1. Nhóm đụng trực tiếp UA / ASO / Ads (Android)

| Lỗi | Mức | Dấu hiệu | Cách đã fix |
|---|---|---|---|
| **Deceptive Ads** | 🔴 | Ads lừa đảo/gây rối, hoặc ads in-app không gắn nhãn rõ khiến user tưởng là tính năng/cảnh báo rồi bị đẩy ra store | Gắn nhãn "Ad/Sponsored" rõ, không mờ/ẩn; gỡ ads gây nhầm lẫn; build mới roll 100% |
| **Disruptive Ads** | 🟡 | Ads không có nút đóng/khó tắt; ads không bỏ qua được (non-skippable) dài quá 15 giây | Thêm nút X rõ ràng; bỏ ads non-skippable > 15s; ads không che nút/thanh hệ thống, chỉ hiện khi đang trong app |
| **Device and Network Abuse** (tải ngoài Play) | 🔴 | App hoặc **SDK bên thứ 3** cho phép tải app/file ngoài Google Play. Theo kho: Google siết rất căng, có thể suspend cả bản cũ | Rà toàn bộ version code bị báo, gỡ logic/SDK cho tải ngoài; **UA gỡ các nguồn ads liên quan** (kho ghi ví dụ Pangle, Liftoff, Mintegral, AppLovin); build mới roll 100%; quay video bằng chứng gửi kèm appeal |
| **App Promotion** | 🟡 | Creative quảng bá app chứa hình nhạy cảm/không phù hợp | UA rà và xoá **toàn bộ content ads** chứa hình nhạy cảm; creative phải tuân thủ chính sách nội dung Play |
| **Deceptive Behavior** | 🔴 | Ảnh/mô tả/store listing không khớp app thật; clone app khác mà không đổi source/listing | Gỡ hình sai UI/tính năng khỏi listing; rà icon/screenshot/feature graphic khớp app thật; **xoá các campaign quảng cáo vi phạm** nếu có |
| **Metadata Policy** | 🟡 | Icon/metadata có yếu tố xếp hạng, khuyến mãi (#1, top 1, best, dấu tích…) | Bỏ các element/từ xếp hạng khỏi icon và metadata; không nhồi keyword |
| **Misleading Claims** | 🟡 | Description nhắc tính năng app không có (vd text-to-image), hoặc claim cần chứng nhận (sức khoẻ) | Xoá dòng mô tả tính năng không có; app sức khoẻ: có certificate hoặc bỏ text; rà metadata + screenshot |
| **Impersonation** | 🔴 | Icon/metadata có từ ngữ/hình có bản quyền, icon giống app lớn | Làm mới icon, bộ screenshot, feature graphic (check legal); thay từ dính trademark; nếu description nhắc tên bên thứ 3 (vd ChatGPT) thì **thêm disclaimer** |
| **Dating & Companionship Ads** | 🟡 | Không set được campaign cho app dating | Phải **xin chứng nhận (certification) quảng cáo Dating & Companionship** của Google Ads trước, có chứng nhận mới tạo được campaign |

> Bài học cho UA: 3 lỗi Device & Network Abuse, App Promotion, Deceptive Behavior có bước xử lý nằm ở **phía UA** (gỡ ad network, xoá creative, xoá campaign). Khi app bị báo, PO/ASO cần báo ngay cho người chạy UA.

## 2. Nhóm Store / khai báo Console (Android)

| Lỗi | Mức | Dấu hiệu | Cách đã fix |
|---|---|---|---|
| Target API Level | 🟡 | Target SDK cũ hơn mức Google yêu cầu, bị hạn chế update | Nâng target API, roll 100% ở mọi môi trường bị báo |
| Foreground Service | 🟡 | Khai FGS (Data Sync/Media Playback…) nhưng reviewer không thấy tính năng chạy nền | Không dùng → xoá quyền khỏi code và Console, build mới; có dùng → quay video + mô tả cách dùng rồi appeal |
| Data Safety | 🟡 | Form Data Safety thiếu/sai; khai "mã hoá" nhưng còn traffic http | Khai lại đủ (kể cả khi không thu thập gì); mọi call API/bên thứ 3 dùng https |
| Subscriptions | 🔴 | Paywall không rõ giá, chu kỳ, trial, gia hạn, cách huỷ; giá hiển thị lệch giá thật | Hiện rõ giá kỳ đầu, thời hạn, giá sau trial, cách huỷ; sửa logic lấy giá (product id + offer id) — xem [paywall checklist](../03-monetization/paywall-subscription-checklist-policy.md) |
| AI-Generated Content | 🔴 | App gen nội dung nhưng thiếu nút report/gắn cờ | Thêm nút report + gắn cờ ở **tất cả** điểm chạm có kết quả gen; kiểm tra lại khi thêm template mới |
| Sexual Content & Profanity | 🔴 | App gen được nội dung phản cảm, không hợp Age Rating đã khai | Filter content ở service/AI/backend; nâng Age Rating; chỉnh metadata khớp rating |
| Child Safety | 🔴 | Thiếu khai báo tiêu chuẩn CSAE/CSAM, thiếu chặn user nhỏ tuổi | Nút báo cáo vi phạm; link tiêu chuẩn CSAE + contact; chặn user < 15 tương tác (vd chat với bot); làm với Legal |
| Content Ratings | 🟡 | Rating khai thấp (vd 3+) trong khi nội dung/screenshot gây hiểu lầm | Nâng rating đúng mức, đổi category nếu cần; bỏ screenshot gây hiểu lầm |
| Malware | 🔴 | Code có/bị nghi hành vi ẩn (điều khiển từ xa, tính phí lén…) | Rà code + quyền; gỡ code/SDK có hành vi ẩn; publish bản mới |
| Behavior Transparency | 🔴 | Tính năng ẩn/không khai, kỹ thuật né review | Gỡ mọi tính năng ẩn; không né review |
| SMS/Call Log, Accessibility API | 🟡 | Dùng quyền nhạy cảm chưa khai | Khai trên Console + video quyền; Accessibility phải mô tả trong **Long Description** của mọi ngôn ngữ (submit lại, không cần build mới) |
| Play Console Requirements (paywall/login) | 🟡 | Reviewer không test được vì tính năng sau paywall hoặc thiếu tài khoản | Demo account có full quyền premium; khai **App Access** (tài khoản demo + video) — phải set **đồng thời** cả 2; có thể dùng remote config tắt paywall khi app đang review |
| Broken Functionality | 🟡 | Crash, không mở được | Fix crash, test nhiều máy/Android version, roll bản fix |
| Health Content and Services | 🔴 | Nội dung/tính năng sức khoẻ cần điều kiện/chứng nhận | Rà theo policy Health; bỏ claim không được phép |
| Regional Block (Rule 9(1)) | ℹ️ | Gỡ khỏi 1 thị trường (vd India) theo yêu cầu chính phủ | Thường **không appeal được**; gửi mail tới cơ quan sở tại theo mẫu |
| Account/Store Terminated | 🔴 | Hành vi rủi ro cao (vd đối tác đổi tên store ngay sau khi live) | Mức nặng nhất, rất khó khôi phục; tránh hành vi rủi ro ngay sau live; liên hệ ASO/Legal |

⚠️ Trong tool gốc, mục "Broken Functionality" và "Dating and Companionship Ads" nằm dưới comment `iOS` nhưng gán `platform: Android` — ở đây giữ theo trường `platform` (Android).

## 3. iOS (App Store Review Guidelines)

| Guideline | Vấn đề | Cách đã fix |
|---|---|---|
| 3.1.2 Subscriptions | Paywall thiếu link PP/ToS; mập mờ trial/giá sale/gia hạn; so sánh giá gói gây hiểu nhầm | Thêm PP + ToS; ghi giá kỳ đầu + thời hạn + giá sau trial + cách huỷ; bỏ so sánh weekly vs monthly gây nhầm |
| 2.1 App Completeness | Loading vô hạn ở splash/màn mua sub, force update; IAP chưa submit | Time-out màn mua sub; bỏ bắt buộc force update; submit gói sub cùng build đầu; video hướng dẫn mua cho reviewer |
| 2.3 Accurate Metadata | Metadata nhắc tính năng không có; app preview có device frame/animation; subtitle chứa "Free" | Bỏ mô tả không có (kể cả release note); preview chỉ dùng footage in-app; bỏ từ giá khỏi subtitle; đánh dấu nội dung trả phí |
| 1.1 Objectionable Content | Template/style tạo nội dung nhạy cảm; claim "free memory/optimize storage" | Gỡ template nhạy cảm; bỏ claim dọn RAM/dung lượng trong metadata và screenshot |
| 4.1 Copycats | Tên/metadata dính trademark; style bảo hộ (Ghibli, WWE, Star Wars, Minecraft…) | Gỡ style/tên dính bản quyền; nếu là thương hiệu của mình thì kháng kèm giấy đăng ký |
| 4.3 Spam | Binary/metadata/concept giống app khác | Chứng minh iOS + Android cùng pháp nhân; hoặc rebrand icon, metadata, UX/UI |
| ATT | Thiếu/sai popup ATT (đặc biệt trên iPad) | Hiện ATT ngay khi mở app, **trước** các quyền khác; không dùng thì bỏ khai; appeal kèm video đúng thiết bị |
| 5.1.1 Purpose strings | Mô tả quyền chung chung; face data | Ghi rõ mục đích + ví dụ; face data thêm điều khoản vào Privacy Policy; có nút "Don't Allow", không ép vào Settings |
| 1.4.1 Medical | Thông tin y tế không trích dẫn | Thêm nguồn |
| 2.3.6 Age Rating / Gambling | Rating sai; ad network phân phối quảng cáo cờ bạc | Khai lại rating; **tắt ad network nghi phân phối ads cờ bạc** rồi gửi review lại |
| 5.2.3 Audio/Video downloading | Tải nội dung dễ vi phạm bản quyền | Chỉ cho tải nội dung user tạo; disclaimer + tick đồng ý; cơ chế DMCA |
| 4.0 Design — Forced Ads | **Bắt user xem quảng cáo trước khi dùng app** | Dùng build không có ad chặn ở đầu (tối ưu nhất) hoặc thêm nút close |
| 4.0 Design — UI | Chữ khó đọc, UI kém | Sửa UI các màn bị báo |
| 2.5.14 | Marketing app ghi âm kiểu "secret/stealth/spy" | Bỏ các từ đó khỏi app và metadata |
| App Store Reviews | Chỉ điều hướng user định rate 4–5 sao lên store | Bỏ lọc rate; kịch bản rate không phân biệt điểm |
| Code of Conduct — paywall nag | Hiện paywall liên tiếp ngay sau khi user từ chối | Tắt paywall hiện lại ngay sau khi từ chối |
| 5.0 / 5.1.2 | Link bị cấm; tracking không xin ATT | Gỡ link; xin ATT trước khi tracking |
| 2.5.4 Background audio | Khai audio nền nhưng không có tính năng | Có thì giải trình; không thì bỏ khai |

## 4. Facebook

- **Facebook Developer Policy — Restricted**: một số app từng bị đánh Restricted. Kho **chưa ghi** chi tiết vi phạm và cách xử lý → đọc mail từ Facebook Developer, đối chiếu Platform Terms & Developer Policies, hỏi Team ASO.

## 5. Link policy gốc (Google Play)

Trang tổng: [Developer Program Policy Center](https://support.google.com/googleplay/android-developer/topic/9858052). Các trang hay dùng:
- Kiếm tiền & quảng cáo: [Ads](https://support.google.com/googleplay/android-developer/answer/9857753) · [Subscriptions](https://support.google.com/googleplay/android-developer/answer/9900533) · [Payments](https://support.google.com/googleplay/android-developer/answer/9858738)
- Store listing & quảng bá: [App Promotion](https://support.google.com/googleplay/android-developer/answer/9899004) · [Metadata](https://support.google.com/googleplay/android-developer/answer/9898842) · [Ratings, Reviews & Installs](https://support.google.com/googleplay/android-developer/answer/9898684) · [Content Ratings](https://support.google.com/googleplay/android-developer/answer/9898843)
- Lừa dối & thiết bị: [Device and Network Abuse](https://support.google.com/googleplay/android-developer/answer/16559646) · [Deceptive Behavior](https://support.google.com/googleplay/android-developer/answer/16680223) · [Misrepresentation](https://support.google.com/googleplay/android-developer/answer/9888689) · [Impersonation](https://support.google.com/googleplay/android-developer/answer/9888374)
- Nội dung: [AI-Generated Content](https://support.google.com/googleplay/android-developer/answer/13985936) · [Child Endangerment](https://support.google.com/googleplay/android-developer/answer/9878809)
- Malware/fraud: [Ad Fraud](https://support.google.com/googleplay/android-developer/answer/9969955) · [SDK Requirements](https://support.google.com/googleplay/android-developer/answer/13323374)
- Thực thi: [Enforcement Process](https://support.google.com/googleplay/android-developer/answer/9899234) · [Managing Violations & Appeals](https://support.google.com/googleplay/android-developer/answer/9899142) · [Policy Deadlines](https://support.google.com/googleplay/android-developer/table/12921780)
- Apple: [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

## 6. Cảnh báo phòng ngừa: "đẩy" review và install theo chủ đích (bổ sung 2026-10-15 từ khoá Quocmedia)

- **Khoá/ngành hay dạy**: khoá Quocmedia bài 2.1 mô tả chủ động tăng lượt cài qua keyword search và tăng **review 4–5 sao** theo chủ đích (tỉ lệ giảng viên đưa: ~3–5 review/1.000 download ads/ngày), chỉ dặn "đừng làm quá tay kẻo bị đánh dấu spam".
- **Policy Google Play** (Ratings, Reviews & Installs, [9898684](https://support.google.com/googleplay/android-developer/answer/9898684), WebFetch 2026-10-15): *"We prohibit any manipulation of ratings, reviews, or install counts."* Cấm *"inflating product ratings, reviews, or install counts by illegitimate means, such as fraudulent or incentivized reviews and ratings"*; ví dụ vi phạm gồm hỏi rating kèm phần thưởng và *"Repeatedly submitting ratings posing as users"*; *"Don't offer rewards or incentives for ratings or reviews"*, *"Don't use automated services to inflate installs or ratings"*.
- **Kết luận**: không làm, kể cả "ít thôi" — đây là thao túng, rủi ro gỡ app/suspend tài khoản (🔴 theo thang của bài này). Cách hợp lệ: **Play In-App Review API** hỏi user thật sau một lần dùng thành công, không lọc trước người sẽ cho 5 sao, không thưởng. Trả lời review đúng quy trình: [trả lời review Google Play](tra-loi-review-google-play.md).

## Bài học / Kết luận

- Trước khi launch campaign, rà listing theo nhóm 1 ở trên. Lỗi metadata/impersonation/deceptive behavior thường do **creative/screenshot/icon**, không phải code.
- Khi thêm ad network mới, hỏi nhà cung cấp SDK về hành vi tải app ngoài Play/redirect. Kho ghi nhận có case phải gỡ nguồn ads để fix Device & Network Abuse.
- Muốn tra nhanh theo mô tả lỗi hoặc ảnh chụp thông báo: dùng [Policy Helper](../06-tools/policy-helper-tra-cuu-loi-policy.md).
