---
title: Firebase — tích hợp SDK, link Google Ads, link AdMob, import first_open
type: playbook
topic: 04-measurement
tags: [firebase, ga4, google-ads, admob, first-open, setup]
app: general
status: draft
confidence: medium
sources:
  - "Firebase docs — Add Firebase to your Android project: https://firebase.google.com/docs/android/setup (truy cập 2026-10-14)"
  - "Firebase Help — Link Google Ads to Firebase: https://support.google.com/firebase/answer/6383833 (truy cập 2026-10-14)"
  - "Analytics Help — Link Google Ads and Google Analytics: https://support.google.com/analytics/answer/9379420 (truy cập 2026-10-14)"
  - "AdMob Help — Link AdMob apps to Firebase: https://support.google.com/admob/answer/6383165 (truy cập 2026-10-14)"
  - "AdMob Help — Use impression-level ad revenue: https://support.google.com/admob/answer/11322405 (truy cập 2026-10-14)"
  - "Google Tag Platform — Measure app key events / import vào Google Ads: https://developers.google.com/tag-platform/devguides/app-conversions (truy cập 2026-10-14)"
  - "Firebase Help — Automatically collected events: https://support.google.com/firebase/answer/9234069 (truy cập 2026-10-14)"
  - "Google Ads Help — Best practices for App campaigns: https://support.google.com/google-ads/answer/14104492 (truy cập 2026-10-14)"
  - "Google Ads Help — Set up an App campaign for installs: https://support.google.com/google-ads/answer/12575501 (truy cập 2026-10-14)"
  - "Google Ads Help — Set a recommended initial Target ROAS for your App campaigns: https://support.google.com/google-ads/answer/15995101 (truy cập 2026-10-14)"
  - "session 2026-09-17 (als001 e3e3ea4c): link AdMob ↔ Google Ads của Home Morph khi 2 bên khác tài khoản Google"
created: 2026-10-14
updated: 2026-10-14
related:
  - 00-overview/roadmap.md
  - 04-measurement/firebase-events-cho-ua.md
  - 02-ua-channels/google-ads/app-campaigns-tong-quan.md
  - playbooks/launch-google-app-campaign-tcpa-den-roas.md
  - 03-monetization/admob-co-ban.md
  - lessons/2026-09-link-admob-google-ads-khac-tai-khoan.md
summary: Các bước tích hợp Firebase SDK Android, link Firebase/GA4 với Google Ads và AdMob (quyền cần có, cả khi khác tài khoản Google), bật impression-level ad revenue, import first_open làm conversion và các lỗi hay gặp.
---

# Firebase: tích hợp SDK, link Google Ads, link AdMob, import first_open

## Bối cảnh

Đây là bước "Firebase" trong Pre-Marketing của [roadmap](../00-overview/roadmap.md). Mục tiêu: Google Ads nhận được `first_open` (để chạy tCPA) và sau đó là `ad_impression` có value (để chạy tROAS). Chuỗi dữ liệu đi như sau:

```
App (Firebase SDK + Google Mobile Ads SDK)
   → Firebase project ⇄ GA4 property ──link──> Google Ads (import conversion)
                          ▲
                 AdMob app ──link──┘ (ad revenue → GA4/Firebase)
```

Google Analytics for Firebase hiện là **GA4 property** gắn với Firebase project. Việc link Google Ads được **quản lý trong GA4** (Firebase Help 6383833).

## Bước 1: Tích hợp Firebase SDK (Android)

Theo firebase.google.com/docs/android/setup:

1. Tạo Firebase project trên Firebase console. Khi tạo, **bật Google Analytics** và chọn/tạo GA4 property.
2. **Register app** bằng **package name** (phân biệt hoa/thường, **không đổi được** sau khi đăng ký).
3. Tải `google-services.json`, đặt vào **thư mục gốc module app**. Không để tên file bị thêm hậu tố kiểu `google-services (2).json`.
4. Thêm Google services Gradle plugin (`com.google.gms.google-services`) ở cả file Gradle gốc (`apply false`) và file module.
5. Thêm **Firebase BoM** và `com.google.firebase:firebase-analytics` (không ghi version cho từng thư viện khi đã dùng BoM). Lấy version BoM mới nhất trên trang docs.
6. Yêu cầu tối thiểu theo docs (2026-10): target API 24+ / Android 7.0+, AndroidX, Gradle plugin ≥ 7.3.0, compileSdk ≥ 28.

Kiểm tra: bật DebugView (`adb shell setprop debug.firebase.analytics.app <package>`), mở app, thấy `first_open` / `session_start` / `screen_view`.

Nên thêm **Crashlytics** ngay từ đầu, vì roadmap cần theo dõi crash ở mốc đo lường.

## Bước 2: Link Firebase (GA4) ↔ Google Ads

Đường đi: Firebase console → Project settings → **Integrations** → thẻ Google Analytics → *View link* → vào GA4 property → **Admin → Product links → Google Ads links → Link**.

- **Quyền**: Editor hoặc Administrator trên GA4 property, **Admin** trên tài khoản Google Ads. Không đủ quyền thì gửi request cho admin Google Ads.
- **Enable Personalized Advertising**: mặc định bật. Giữ bật để dùng audience cho remarketing/ACe.
- **Auto-tagging**: bật (Google Ads best practices 14104492 cũng yêu cầu bật).
- Sau khi link, dữ liệu Google Ads xuất hiện trong GA4 trong vòng **48 giờ**. Key events và audience của GA4 được chia sẻ sang Google Ads.

## Bước 3: Link AdMob ↔ Firebase

AdMob → **Settings → Linked services** → mở dòng app → bật toggle Firebase linking → *Link app* (chọn Firebase app đã có) hoặc *Go to Firebase* (tạo mới).

- **Quyền cần đủ cả 3**:
  - AdMob: **Administrator**.
  - Firebase: IAM `firebase.links.create` (có trong role Owner / Firebase Admin).
  - GA4: **Administrator hoặc Editor** trên property/account. Viewer, Analyst, Marketer *không đủ*. Thiếu quyền GA thì Firebase app có sẵn **không hiện ra** trong popup link.
- Lợi ích: dữ liệu Analytics dùng được trong AdMob (user metrics, cohort). **Doanh thu AdMob chảy vào Analytics**, nên `ad_impression` có value để Google Ads tối ưu tROAS.
- ⚠️ **Bắt buộc bật Impression-level ad revenue** trước khi đẩy ad revenue sang Firebase/Google Ads: AdMob → Settings → Account → *Account controls* → **Impression-level ad revenue** → bật → Save. Nếu không bật, Google cảnh báo dữ liệu ad revenue trong Firebase A/B test, **Google Ads tROAS** và báo cáo GA có thể bị gián đoạn (answer/6383165, 11322405). SDK tối thiểu: Google Mobile Ads Android 21.1.0. Firebase docs ghi Firebase Android SDK v17.6.0+ cho tự động đo ad revenue.
- Nếu monetization qua **AppLovin MAX** thay vì AdMob thì phải log `ad_impression` thủ công, xem [firebase-events-cho-ua](firebase-events-cho-ua.md).

## Khi AdMob/Firebase và Google Ads ở hai tài khoản Google khác nhau

(Bổ sung 2026-10-14 từ việc thật ngày 17/09/2026, chưa duyệt. Diễn biến: [lesson](../lessons/2026-09-link-admob-google-ads-khac-tai-khoan.md).)

- Không cần gộp tài khoản. Mỗi mắt xích chỉ cần **một** tài khoản có đủ quyền ở cả hai đầu lúc bấm link:
  - AdMob ↔ Firebase: AdMob Administrator + quyền tạo link Firebase + GA4 Editor/Administrator (xem Bước 3). Theo session, mắt xích này **không có luồng gửi request/duyệt** nên bắt buộc 1 tài khoản đủ cả ba quyền (🧪 nhận định từ session, khớp với yêu cầu quyền ở 6383165).
  - GA4 ↔ Google Ads: GA4 Editor/Administrator + Google Ads Admin; thiếu quyền Ads thì có thể gửi request cho admin Google Ads (9379420).
- **Firebase Owner không tự có quyền trên GA4 property.** Kiểm tra ở GA4 → Admin → Property access management.
- Lấy đúng Property ID từ Firebase → Project settings → **Integrations → Google Analytics** (tài khoản kia có thể có property rỗng khác mặc định hiện ra).
- Hướng mời gọn nhất: mời tài khoản đang giữ AdMob/Firebase/GA4 làm **Admin** Google Ads (Admin → Access and security → Users → +). Google Ads có thể bắt xác nhận danh tính (2FA) trước khi gửi lời mời.
- Mục **Google Ads** trong AdMob → Settings → Linked services là để chạy *house ads / direct sold*, **không** phải đường đi ad revenue cho tROAS.
- Nếu trang Google Ads/AdMob hiện trắng hoặc thiếu nút: tắt ad blocker cho domain đó ([lesson AdBlock](../lessons/2026-09-google-ads-ad-group-trong-do-adblock.md)).

## Bước 4: Import `first_open` vào Google Ads làm conversion

1. Trong GA4: đảm bảo `first_open` là **key event** (GA4 thường đã đánh dấu sẵn với app stream. Nếu chưa: *Admin → Events → Mark as key event*).
2. Trong Google Ads: **Tools → Measurement → Conversions → + New conversion action → App → Google Analytics 4 properties (Firebase)** → tick `first_open` (Android) → Import.
3. Đặt conversion action làm **Primary** để dùng cho bidding (Google Ads 15995101 yêu cầu action dùng để tối ưu phải là Primary).
4. Kiểm tra trạng thái conversion chuyển sang "Recording conversions" sau khi có install thật.

### Lưu ý / bẫy

- **Trùng install conversion**: Google Ads có thể tự tạo conversion "Android installs (Google Play)" (answer/12575501 ghi "Android download conversion actions may be created and tracked automatically through Google Play"). Nếu cả hai đều Primary thì có nguy cơ đếm đôi hoặc tối ưu lẫn lộn. *Khuyến nghị (kinh nghiệm, chưa kiểm chứng bằng tài liệu)*: chọn **một** event install làm Primary cho campaign (roadmap chọn Firebase `first_open`), event còn lại để Secondary.
- `first_open` = lần **mở app đầu tiên** sau cài/cài lại, không phải lượt tải. User tải mà không mở thì không được tính.
- **Conversion window** đặt một lần rồi không đổi trong lúc campaign đang học (14104492).
- Trong GA4 có độ trễ xử lý. Event mới có thể mất tới ~24h mới hiện trong danh sách để import (*kinh nghiệm cộng đồng, chưa có số chính thức*).
- Không log thủ công các event mà Firebase đã tự thu (`first_open`, `in_app_purchase`, `ad_impression` của AdMob) vì sẽ bị trùng.

## Checklist

- [ ] Firebase project + GA4 property, app Android đăng ký đúng package.
- [ ] `google-services.json`, plugin, BoM, firebase-analytics (+ Crashlytics).
- [ ] DebugView thấy `first_open`.
- [ ] GA4 ↔ Google Ads linked (personalized ads ON, auto-tagging ON).
- [ ] AdMob ↔ Firebase linked, **Impression-level ad revenue ON**.
- [ ] `first_open` imported vào Google Ads, Primary, đang Recording.
- [ ] Chỉ 1 install conversion Primary.
