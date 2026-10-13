---
title: Home Morph — hồ sơ app
type: app-profile
topic: apps/home-morph
tags: [home-morph, app-profile, firebase, admob, google-ads, ga4]
app: home-morph
status: verified
confidence: medium
sources:
  - "session 2026-09-17 (als001 e3e3ea4c): link AdMob ↔ Google Ads khác tài khoản — đọc google-services.json, AdMob Linked services, Firebase Integrations"
  - "session 2026-09-17→18 (als001 def570ce): setup campaign Google Ads đầu tiên, bàn GEO/tier/unit economics"
created: 2026-10-14
updated: 2026-10-14
related:
  - apps/home-morph/campaigns.md
  - decisions/2026-09-home-morph-geo-ua-ads-only.md
  - lessons/2026-09-link-admob-google-ads-khac-tai-khoan.md
summary: Hồ sơ Home Morph (com.homemorph.app) — app AI thiết kế nội thất Android, ads-only; ID Firebase/GA4/AdMob/Google Ads, tài khoản nào giữ quyền gì, ngôn ngữ app hỗ trợ.
---

# Home Morph — hồ sơ app

## Tổng quan

| Mục | Giá trị | Nguồn / độ chắc |
|---|---|---|
| Tên app | Home Morph (AdMob ghi "Home Morph — Free, Android") | AdMob Linked services, session e3e3ea4c |
| Package | `com.homemorph.app` | `google-services.json` trong repo app |
| Nền tảng | Android | |
| Thể loại | AI interior design: user chụp/tải ảnh phòng, AI thiết kế lại theo preset/style (before/after) | Mô tả trong session def570ce |
| Project code | als001 (repo `als001_home_morph/Source_Code/HomeMorph`, kiến trúc MVI) | đường dẫn session |
| Monetization | **Ads-only** (AdMob), chưa có IAP/subscription tại 2026-09-18 | Session def570ce: Claude nêu "app ads-only (hiện tại)", user không phản bác và bàn tiếp theo hướng ads-only |
| Ad format đang dùng | ⚠️ Chưa xác minh. Session chỉ *giả định* có rewarded gate khi generate, interstitial, app-open, banner | Giả định của Claude, cần đối chiếu code |

## Ngôn ngữ app hỗ trợ

Theo session def570ce (Claude đọc repo, chưa kiểm lại trong knowledge này): app hỗ trợ **11 ngôn ngữ**. Các mã được nhắc trong session: `en`, `ar`, `de`, `es`, `fr`, `hi`, `id`, `pt`, `tr`, `uz`, `vi`. Chưa có: `ru`, `it`, `pl`, `ja`, `ko` (chặn mở rộng sang các GEO dùng các tiếng này). `confidence` cho danh sách này: medium.

## Tài khoản & ID (không chứa credential)

| Hệ thống | ID / tên | Ghi chú |
|---|---|---|
| Firebase project | `als001-home-morph`, project number `190081872361` | Android app id `1:190081872361:android:873a76ac925aa04d049b78` |
| GA4 property (của Firebase) | `als001-home-morph`, **Property ID 554526948**, account "Default Account for Firebase" | Stream "Home Morph" `15785967968`. Có thêm 1 stream Android tên "ngu" `15785949909` (rác/test?) |
| AdMob | Admin: `chi2911bs@gmail.com` | App Home Morph đã **Linked** với Firebase (thấy ở 2026-09-17). App "Demo" chưa link |
| Google Ads | **252-691-1237 "Lurdsoft"**, chủ: `dinhngocthe.start@gmail.com` | Trả trước, nạp tay bằng VND (lần nạp gần nhất 9/8/2026, 160.000 ₫ qua MoMo — theo ảnh billing 17/09) |
| GA4 property "Lurdsoft" | ID 554593861 | Property rỗng (không có data stream) của `dinhngocthe.start` — **không phải** property của Home Morph, đừng link nhầm |

Quyền (2026-09-17): `chi2911bs` là AdMob Administrator + Firebase Owner + có quyền GA4 554526948; `dinhngocthe.start` là Firebase Owner nhưng **không có quyền gì trên GA4 554526948**. Hướng xử lý đã chọn: mời `chi2911bs` làm Admin Google Ads 252-691-1237. Đến tối 17/09 ảnh chụp cho thấy `chi2911bs` đã vào được Google Ads 252-691-1237 và dropdown conversion đã có "als001-home-morph - com.homemorph.app (Android) First open" (Firebase), tức lời mời đã được chấp nhận và first_open đã dùng được. Chi tiết: [lesson link khác tài khoản](../../lessons/2026-09-link-admob-google-ads-khac-tai-khoan.md).

## Đặc điểm sản phẩm ảnh hưởng tới UA (nhận định trong session, chưa có data)

- Sửa nhà là use case **tần suất thấp** → retention là rủi ro chính với mô hình ads (nhận định của Claude, chưa đo).
- Vertical có commercial intent cao, output before/after hợp Pinterest/Reels/TikTok (nhận định).
- Đối thủ cùng chủ đề (Remodel AI, Interior AI…) bán subscription (theo kết quả search trong session, giá không kiểm lại).

## Việc tiếp theo

- Xác nhận ad format/placement thật trong code và các event Firebase `generation_completed`, `rewarded_ad_completed` đã được log chưa (session để "❓ cần kiểm tra").
- Kiểm tra AdMob đã bật Impression-level ad revenue và GA4 ↔ Google Ads đã link (cần cho tROAS sau này).
