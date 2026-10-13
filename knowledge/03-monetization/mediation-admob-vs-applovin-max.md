---
title: Mediation — waterfall vs bidding, AdMob mediation vs AppLovin MAX, ILRD
type: concept
topic: 03-monetization
tags: [mediation, admob, applovin-max, bidding, waterfall, ilrd, ad-revenue]
app: general
status: draft
confidence: medium
sources:
  - "AdMob Help — Guide to AdMob Mediation (bidding & waterfall): https://support.google.com/admob/answer/13420272 (truy cập 2026-10-14)"
  - "AdMob Help — Use impression-level ad revenue: https://support.google.com/admob/answer/11322405 (truy cập 2026-10-14)"
  - "AppLovin MAX — Auction dynamics: https://support.applovin.com/en/max/demand-partners/auction-dynamics (truy cập 2026-10-14)"
  - "AppLovin MAX — Android advanced settings (Impression-Level User Revenue API): https://support.applovin.com/en/max/android/overview/advanced-settings (truy cập 2026-10-14)"
  - "AppLovin — User-Level Ad Revenue API: https://developers.applovin.com/en/reporting-apis/user-level-ad-revenue-api (truy cập 2026-10-14)"
  - "AppLovin — Impression-level user revenue API for MMPs: https://developers.applovin.com/en/max/android/overview/impression-level-user-revenue-api-for-mmps (truy cập 2026-10-14)"
  - "Google Ads Help — About tROAS for ad revenue (ARO): https://support.google.com/google-ads/answer/13799577 (truy cập 2026-10-14)"
  - "Firebase docs — Measure ad revenue: https://firebase.google.com/docs/analytics/measure-ad-revenue (truy cập 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 03-monetization/admob-co-ban.md
  - 04-measurement/firebase-events-cho-ua.md
  - 04-measurement/mmp-tong-quan.md
  - 00-overview/glossary-chi-so.md
summary: Mediation là gì, waterfall vs bidding (unified auction), so sánh AdMob mediation với AppLovin MAX ở góc độ UA/đo lường, và impression-level revenue (ILRD) của từng bên để đẩy về Firebase/MMP.
---

# Mediation: AdMob vs AppLovin MAX, ILRD

## Bối cảnh

App thuần ads cần nhiều nguồn demand (AdMob, AppLovin, Meta Audience Network, Unity, Mintegral, ironSource, Pangle...) để tăng match rate và eCPM. **Mediation** là lớp đứng giữa, quyết định nguồn nào được show cho mỗi ad request. Lựa chọn mediation ảnh hưởng trực tiếp đến **cách doanh thu chảy về Firebase/Google Ads (tROAS)** và MMP.

## 1. Waterfall vs bidding

| | Waterfall | Bidding (in-app bidding / unified auction) |
|---|---|---|
| Cơ chế | Gọi lần lượt từng ad source theo thứ tự eCPM **do publisher đặt** (hoặc ước tính), source đầu tiên có ad sẽ thắng | Các source **đặt giá realtime** trong một phiên đấu giá cho mỗi request. Giá cao nhất thắng. |
| Ưu | Kiểm soát thủ công, network nào cũng tham gia được | Ít công vận hành, giá phản ánh đúng giá trị impression, giảm latency so với waterfall dài |
| Nhược | Tốn công tối ưu, eCPM đặt sai thì mất doanh thu, latency cao | Phụ thuộc network có hỗ trợ bidding |
| Hybrid | Cả AdMob và MAX đều cho chạy bidding + waterfall chung một mediation group/ad unit | |

- **AdMob** (13420272): bidding là "ad sources compete in a real-time auction". Waterfall gọi từng source theo average eCPM đã đặt. Mediation group chia traffic theo format, platform, app, ad unit, country. Cần group cho mỗi format × platform. Quy trình: tạo ad unit → set up ad source → map ad unit → tạo mediation group → cài SDK + adapter.
- **MAX** (auction dynamics): "unified first-price auction in which the highest bidder wins". SDK bidders + DSP (qua AppLovin Exchange, OpenRTB 2.5) trả giá trong `tmax`, rồi được **trộn với các nguồn non-bidding trong waterfall** của publisher. Auction chọn **CPM cao nhất**. Bid dưới floor hoặc bằng 0 bị loại.

## 2. AdMob mediation vs AppLovin MAX: so sánh theo góc UA

| Tiêu chí | AdMob mediation | AppLovin MAX |
|---|---|---|
| Ad revenue vào Firebase | **Tự động** (`ad_impression`) khi link AdMob↔Firebase + bật impression-level ad revenue | **Phải tự log** `ad_impression` từ `onAdRevenuePaid` (Firebase docs có code mẫu) |
| Dùng cho Google Ads tROAS (ARO) | Được. Google định nghĩa "AdMob as mediation platform" là monetize qua AdMob **không** đi qua giải pháp trung gian (13799577). | Được. ARO "enables revenue import from any monetization platform" qua GA4 (13799577), với điều kiện log `ad_impression` đúng value + currency. |
| ILRD | Paid event (`OnPaidEventListener`), cần bật *Impression-level ad revenue* trong account. SDK Android ≥ 21.1.0. Chỉ USD. | `MaxAdRevenueListener.onAdRevenuePaid`, revenue tính bằng USD. Có thêm User-Level Ad Revenue API phía server. |
| Độ chính xác doanh thu | Precise (AdMob Network, bidding) / Estimated / Publisher provided (CPM waterfall thủ công) / Unknown = $0 | `exact` (auction realtime) / `estimated` (Auto-CPM, FB bidding) / `publisher_defined` / `undefined`. Revenue = -1 khi lỗi, rỗng ở test mode. |
| Gửi doanh thu cho MMP | Tự forward paid event sang SDK MMP | MAX broadcast ad revenue event, MMP subscribe trực tiếp ("ILRD API for MMPs") |
| Lưu ý | Impression qua *Partner Bidding* không còn gửi qua AdMob ILRD (11322405) | AdMob có thể là một network bên trong MAX. Cẩn thận đếm đôi `ad_impression` nếu vẫn link AdMob↔Firebase. *(chưa kiểm chứng hành vi cụ thể)* |

**Chọn bên nào?** Tài liệu chính thức không đưa ra kết luận "bên nào eCPM cao hơn". Mọi khẳng định kiểu đó phải test A/B trên chính app (cùng GEO, cùng thời gian). Gợi ý quyết định:
- Ưu tiên **đơn giản đo lường cho Google Ads tROAS** (giai đoạn đầu roadmap) thì AdMob mediation, vì `ad_impression` tự động, ít rủi ro sai value.
- Muốn **nhiều demand bidding**, đặc biệt khi chạy UA trên AppLovin/các network khác và dùng MMP, thì MAX đáng cân nhắc. Đổi lại phải tự log Firebase.
- Ghi quyết định cuối cùng vào `decisions/` kèm data A/B.

## 3. ILRD: tại sao quan trọng cho UA

ILRD (Impression-Level Revenue Data) = doanh thu **từng impression** gắn với **từng user/device**. Nhờ đó:
- Tính **LTV/ROAS theo cohort, theo campaign** (khi kết hợp attribution của MMP hoặc Firebase).
- Google Ads tROAS (ad revenue) học được user nào sinh nhiều doanh thu ads.
- Tối ưu tROAS trên các network khác (AppLovin, Mintegral...) qua MMP postback có value.

Bẫy chung:
- Doanh thu ILRD là **ước tính** (đặc biệt với waterfall/estimated), sẽ lệch so với doanh thu đối soát cuối tháng.
- Currency: AdMob và MAX đều trả **USD**. Khi log sang Firebase bắt buộc gửi `currency` ISO 4217.
- Lọc giá trị lỗi (-1, rỗng) trước khi log.

## Chưa xác minh được

- Số lượng network bidding của MAX: trang sản phẩm AppLovin có nêu con số nhưng thay đổi theo thời điểm, nên không ghi ở đây.
- So sánh eCPM giữa AdMob mediation và MAX: không có nguồn chính thức trung lập.
