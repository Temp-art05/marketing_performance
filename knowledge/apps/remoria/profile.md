---
title: Remoria (IIP707) — hồ sơ app
type: app-profile
topic: apps/remoria
tags: [remoria, iip707, ai-companion, character-chat, subscription, coin, hybrid-monetization, android-port]
app: remoria
status: verified
confidence: medium
sources:
  - "repo iOS /Users/temp/DATA/ARCHIVE/IOS/IIP707-Remoria (CLAUDE.md, docs/V1_0_1_MASTER_SPEC.md, docs/features/Ads.md, docs/features/FeatureSubscription.md, Configurations/RemoriaTestStore.storekit) — đọc 2026-10-20, commit cuối 2026-06-26"
  - "repo Android /Users/temp/DATA/ARCHIVE/Android/Remoria-Android — chỉ là base template (commit 'Android base project' 2026-09-21)"
  - "Appfigures qua TechCrunch 12/08/2025: https://techcrunch.com/2025/08/12/ai-companion-apps-on-track-to-pull-in-120m-in-2025"
  - "Google Android Developers Blog 25/08/2026: https://android-developers.googleblog.com/2026/08/ensuring-safety-genai-preventing-non-consensual-intimate-content.html"
created: 2026-10-20
updated: 2026-10-20
related:
  - apps/home-morph/profile.md
  - 01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md
  - 01-pre-marketing/market-research-tam-sam-som-go-no-go.md
  - 03-monetization/paywall-subscription-checklist-policy.md
summary: Remoria (IIP707) — app AI chat nhân vật kiểu PolyBuzz; iOS đã build (sub 3 tier RevenueCat + coin + AdMob từ v1.1.1), BE NestJS dùng lại được; Android mới là base trống, chưa có số thật.
---

# Remoria (IIP707) — hồ sơ app

## Tổng quan

| Mục | Giá trị | Nguồn |
|---|---|---|
| Sản phẩm | AI chat với nhân vật hư cấu (kiểu PolyBuzz): khám phá nhân vật, chat streaming, tạo nhân vật (UGC), gen avatar/ảnh trong chat, relationship milestone | iOS `CLAUDE.md`, master spec v1.0.1 |
| iOS | iOS 17+, SwiftUI, bundle `remoria.ai.chat.characters`, commit cuối 26/06/2026 | repo iOS |
| Backend | `BE-AI-Chatbot-IIP707` (NestJS + Prisma), commit cuối 24/07/2026 — **Android dùng lại được** | repo BE |
| Web | `ISI001-RemoriaWeb` (thiết kế Remoria 2.0, có "Waifu Dating", "Image Lab", "Comic Studio"), commit cuối 05/08/2026 | repo web |
| Android | `Remoria-Android` = **base template trống** (Compose + MVI, applicationId còn `com.base.app`) — chưa port tính năng nào | README/TODO repo Android, 21/09/2026 |
| Trạng thái phát hành iOS | ❓ Chưa xác minh đã lên store chưa, chưa có số retention/revenue | — |

## Monetization (iOS, theo StoreKit test config + spec)

- **Subscription 3 tier** qua RevenueCat (Basic/Extra/Premium), giá test: Basic $8,99/tuần · $99,99/năm; Extra $14,99/tuần · $199,99/năm; Premium $29,99/tháng · $299,99/năm. Guest phải login (Apple/Google) trước khi mua.
- **Coin**: 4 gói $1,99 (1k) / $4,99 (3k) / $14,99 (10k) / $24,99 (20k). Tiêu coin: gen ảnh 100, Heart Whisper 50, gen avatar 150. Sub **không** tặng coin.
- **Ads**: v1.0.1 ghi "ads bị loại vĩnh viễn" (V32, 17/06/2026), nhưng spec v1.1.1 (F24) **thêm lại AdMob** — interstitial khi `chat_enter` + rewarded để kiếm coin, 6 adapter mediation (AppLovin, Meta, Pangle, Unity, InMobi, Mintegral), revenue log Firebase `ad_impression`. ⚠️ Hai tài liệu mâu thuẫn — hỏi PO bản đang chạy là bản nào.

## Thị trường (bên thứ ba, độ tin trung bình)

- Appfigures (TechCrunch 08/2025): 337 app companion có doanh thu; 220 triệu download luỹ kế (App Store + Play) tới 07/2025; H1/2025 download +88% YoY (60 triệu); chi tiêu luỹ kế $221 triệu, dự kiến > $120 triệu cả năm 2025; **top 10% app lấy 89% doanh thu** → thị trường tập trung, app mới khó chen.
- Không có nguồn tách doanh thu Android vs iOS cho thể loại này.

## Rủi ro policy Google Play

- Google (25/08/2026) nhắc lại yêu cầu tăng cường cho app GenAI theo Sexual Content Policy và AI-Generated Content Policy; yêu cầu cho reviewer truy cập đủ tính năng AI kể cả phần sau paywall. Định vị "dating/waifu" của bản web là vùng rủi ro cao khi lên Play. Checklist chung: [policy app AI](../../01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md).

## Việc tiếp theo

- Lấy số thật của bản iOS (nếu đã phát hành): D1/D7 retention, trial→paid, ARPPU, % user mua coin, số tin nhắn/user/ngày, chi phí LLM/user.
- Chốt có ads hay không trước khi port Android.
