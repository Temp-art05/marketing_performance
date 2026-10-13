---
title: Firebase events dùng cho UA (first_open, ad_impression, app_remove...)
type: reference
topic: 04-measurement
tags: [firebase, ga4, events, ad-impression, first-open, troas, tcpa, applovin-max]
app: general
status: verified
confidence: medium
sources:
  - "Firebase Help — Automatically collected events: https://support.google.com/firebase/answer/9234069 (truy cập 2026-10-14)"
  - "Firebase docs — Measure ad revenue: https://firebase.google.com/docs/analytics/measure-ad-revenue (truy cập 2026-10-14)"
  - "Google Ads Help — About tROAS for ad revenue (ARO): https://support.google.com/google-ads/answer/13799577 (truy cập 2026-10-14)"
  - "Google Ads Help — About bidding in App campaigns: https://support.google.com/google-ads/answer/7100895 (truy cập 2026-10-14)"
  - "AdMob Help — Use impression-level ad revenue: https://support.google.com/admob/answer/11322405 (truy cập 2026-10-14)"
  - "AppLovin MAX — Android advanced settings (Impression-Level User Revenue API): https://support.applovin.com/en/max/android/overview/advanced-settings (truy cập 2026-10-14)"
  - "Google Ads Help — Best practices for App campaigns: https://support.google.com/google-ads/answer/14104492 (truy cập 2026-10-14)"
  - "Google Ads Help — Choose a bid strategy for your App campaign: https://support.google.com/google-ads/answer/12073727 (truy cập 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 04-measurement/firebase-setup-link-google-ads-admob.md
  - 02-ua-channels/google-ads/app-campaigns-tong-quan.md
  - playbooks/launch-google-app-campaign-tcpa-den-roas.md
  - 03-monetization/mediation-admob-vs-applovin-max.md
  - 00-overview/glossary-chi-so.md
  - 04-measurement/mmp-tong-quan.md
  - 05-optimization/doc-chi-so-theo-moc-thoi-gian.md
summary: Ý nghĩa và điều kiện của first_open, ad_impression (AdMob tự log / MAX log thủ công qua ILRD), app_remove, user_engagement, in_app_purchase và event nào dùng cho tCPI/tCPA/tROAS.
---

# Firebase events dùng cho UA

## Bối cảnh

Google App campaigns tối ưu dựa trên **conversion import từ GA4/Firebase**. Với app thuần ads, chuỗi event chính là `first_open` (dùng cho tCPA giai đoạn đầu) rồi `ad_impression` có value (dùng cho tROAS ad revenue). Setup link xem [firebase-setup-link-google-ads-admob](firebase-setup-link-google-ads-admob.md).

## 1. Event tự động thu (theo Firebase Help 9234069)

| Event | Khi nào bắn | Ghi chú cho UA |
|---|---|---|
| `first_open` | Lần đầu user mở app sau khi cài hoặc **cài lại** | Event "install" cho Google Ads. Không đếm lượt tải chưa mở. |
| `session_start` | User bắt đầu tương tác với app | Mỗi session có session ID và session number. |
| `user_engagement` | App ở foreground ≥ 1 giây (param `engagement_time_msec`) | Dùng để tính engagement time và active user. Bị chặn sớm (crash, thoát ngay) thì không có. |
| `app_remove` | Package bị gỡ khỏi máy **Android** (chỉ Android) | Đếm mọi lượt gỡ, **bất kể nguồn cài**. Dùng để theo dõi tỉ lệ uninstall, ví dụ sau khi tăng ad load. Không gắn với ngày cài, nên muốn đọc theo cohort phải tự join. |
| `in_app_purchase` | User hoàn tất IAP (kể cả subscription lần đầu) | Chỉ với app version có Firebase SDK. Bỏ qua giao dịch test/sandbox/invalid. Gia hạn là event khác (`app_store_subscription_renew`). Log tay thêm sẽ bị **trùng**. |
| `ad_impression` | User thấy một ad impression. Publisher event từ AdMob qua Google Mobile Ads SDK (hoặc Ad Manager) | Param `ad_event_id`, `value`. **Không export sang BigQuery**. Firebase Help ghi: "No ad_impression value or currency is passed with the default integration". Value đến từ AdMob khi **link AdMob↔Firebase + bật impression-level ad revenue**. |
| `ad_reward` | Rewarded ad trao thưởng | Param `reward_type`, `reward_value`. |
| `app_update`, `os_update` | Lần mở đầu sau khi cập nhật app / OS | Dùng khi soi crash theo version. |

## 2. `ad_impression`: nguồn value

### a) Monetize bằng AdMob (kể cả AdMob mediation)
- Firebase **tự log** `ad_impression` khi AdMob app đã link Firebase/GA4 (Firebase Android SDK ≥ 17.6.0).
- Muốn có **value** phục vụ tROAS: bật **Impression-level ad revenue** trong AdMob (Settings → Account → Account controls). Google Mobile Ads SDK Android ≥ 21.1.0.
- **Không** log `ad_impression` thủ công từ `OnPaidEventListener` (AdMob paid event) khi đã link, vì sẽ đếm đôi doanh thu. Paid event dùng để gửi doanh thu sang **MMP/hệ thống riêng**. *(Suy ra từ cơ chế auto-log + cảnh báo trùng của Firebase. Nên xác nhận trên DebugView khi tích hợp.)*
- Độ chính xác value theo AdMob: *Precise* (AdMob Network, bidding), *Estimated*, *Publisher provided* (CPM thủ công của waterfall), *Unknown* = $0 (vd AdMob campaigns, house ads). Impression qua Partner Bidding không còn được gửi qua AdMob (answer/11322405).

### b) Monetize bằng AppLovin MAX (hoặc mediation khác)
Firebase **không tự có** dữ liệu, phải log `ad_impression` thủ công trong callback ILRD của MAX (`MaxAdRevenueListener.onAdRevenuePaid`):

```kotlin
override fun onAdRevenuePaid(ad: MaxAd) {
    val params = Bundle().apply {
        putString(FirebaseAnalytics.Param.AD_PLATFORM, "appLovin")
        putString(FirebaseAnalytics.Param.AD_UNIT_NAME, ad.adUnitId)
        putString(FirebaseAnalytics.Param.AD_FORMAT, ad.format.label)
        putString(FirebaseAnalytics.Param.AD_SOURCE, ad.networkName)
        putDouble(FirebaseAnalytics.Param.VALUE, ad.revenue)   // MAX trả USD
        putString(FirebaseAnalytics.Param.CURRENCY, "USD")
    }
    firebaseAnalytics.logEvent(FirebaseAnalytics.Event.AD_IMPRESSION, params)
}
```

Quy tắc (Firebase docs):
- Bắt buộc có **`value` và `currency`** thì Google Ads mới xử lý được. Currency theo **ISO 4217** (vd "USD"). Value là số dùng dấu chấm thập phân.
- MAX: revenue có thể là **-1** khi lỗi, và **rỗng ở test mode**. Phải lọc trước khi log (đừng gửi -1 hay 0).
- `revenuePrecision` của MAX: `exact` (auction realtime), `estimated`, `publisher_defined`, `undefined`.
- Validate: DebugView khi dev, Realtime sau khi release. Có BigQuery export thì soi các event value = 0/null.
- Nếu app dùng **cả** AdMob trực tiếp lẫn MAX thì cẩn thận đếm đôi (AdMob tự log + MAX log). Chọn một đường duy nhất cho mỗi impression. *(Cần kiểm tra cụ thể khi AdMob chạy như một network trong MAX.)*

## 3. Event nào để tối ưu bid strategy nào

| Bid strategy (App campaign for installs) | Event tối ưu | Điều kiện |
|---|---|---|
| **tCPI** (focus Installs) | install (`first_open` hoặc Google Play install) | Budget ≥ 50× tCPI (14104492). |
| **tCPA** (focus In-app actions) | 1 in-app event sau cài (vd `level_complete`) | Budget ≥ 10× tCPA. Chỉ chọn 1 action, trừ khi các action có giá trị ngang nhau. |

> **Lưu ý thuật ngữ:** roadmap gọi bước đầu là "tCPA tối ưu `first_open`". Trong Google Ads, `first_open` là **install conversion**, nên tối ưu `first_open` thực chất là bid **target CPI** (Google xếp tCPI là một biến thể của Target CPA, answer/12073727). Budget theo quy tắc **50× tCPI**, không phải 10× tCPA. Cần đối chiếu trên UI thực tế: chọn focus nào và bid hiện tên gì thì ghi lại vào `lessons/`. Xem [playbook](../playbooks/launch-google-app-campaign-tcpa-den-roas.md).
| **tROAS** (focus In-app action value) | Event có **dynamic value**: `ad_impression` (ad revenue), `in_app_purchase` (IAP), hoặc cả hai (Hybrid) | Cần Firebase SDK (7100895). Event phải có value, không để "Don't use a value". |

Ràng buộc chính thức riêng cho **`ad_impression` / tROAS for ad revenue (ARO)** (answer/13799577):
- App phải bidding trên GA events, đã **import `ad_impression`** từ GA4 vào Google Ads, và đã đánh dấu là conversion/key event trong GA4.
- App phải có "significant majority or entirety" doanh thu đến từ ads. Nếu không thì dùng Hybrid (thêm `ad_impression` + event IAP).
- `ad_impression` **chỉ dùng được với tROAS**, không dùng cho tCPI/tCPA. Google ghi event này được "reserved for exclusive use in tROAS for ad revenue (ARO) campaigns".
- Chỉ hỗ trợ attribution qua Google Analytics. **Không** hỗ trợ log server-to-server (Measurement Protocol).
- Conversion window khuyến nghị **7 đến 30 ngày**.
- Cột Conversions của `ad_impression` mặc định hiển thị **0**. Xem bằng segment theo conversion action + cột "Conversion value".

## 4. Event tuỳ chỉnh nên có (gợi ý, chưa kiểm chứng hiệu quả)

- Event đánh dấu "user đã trải nghiệm core feature" (vd `feature_used`, `level_complete`). Có thể dùng làm tCPA event chất lượng hơn `first_open` khi volume đủ. Google khuyên tCPA ACe đủ cao để "drive more than 100 conversions".
- Event về ad placement (vd `ad_show_failed`) để soi show rate theo màn hình.

## Bẫy hay gặp

- Gửi value bằng micros (AdMob paid event trả `valueMicros`) mà không chia 1.000.000 nên ROAS bị phóng đại 10^6. *(Chỉ gặp khi tự log.)*
- Gửi currency sai hoặc thiếu, Google Ads bỏ qua event.
- Đổi tên event tối ưu hoặc đổi conversion window khi campaign đang học thì reset learning (14104492).
