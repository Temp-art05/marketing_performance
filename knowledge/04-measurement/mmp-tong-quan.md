---
title: MMP tổng quan — AppsFlyer, Adjust, SAN/SRN, khi nào cần, so với Firebase-only
type: concept
topic: 04-measurement
tags: [mmp, appsflyer, adjust, attribution, san, srn, firebase]
app: general
status: verified
confidence: medium
sources:
  - "AppsFlyer Help — Types of media sources: https://support.appsflyer.com/hc/en-us/articles/212188826 (truy cập 2026-10-14)"
  - "AppsFlyer blog — Explaining attribution from self-reporting networks: https://www.appsflyer.com/blog/explaining-attribution-self-reporting-networks/ (truy cập 2026-10-14)"
  - "Adjust glossary — Self-attributing network (SAN): https://www.adjust.com/glossary/self-attributing-network/ (truy cập 2026-10-14)"
  - "Google Ads Help — Best practices guide: Setting up your App campaigns: https://support.google.com/google-ads/answer/6167162 (truy cập 2026-10-14)"
  - "Google Ads Help — Set a recommended initial Target ROAS for your App campaigns: https://support.google.com/google-ads/answer/15995101 (truy cập 2026-10-14)"
  - "Google Ads Help — Acquire high-value app users at scale with Target ROAS bidding: https://support.google.com/google-ads/answer/10617884 (truy cập 2026-10-14)"
  - "AppLovin — Impression-level user revenue API for MMPs: https://developers.applovin.com/en/max/android/overview/impression-level-user-revenue-api-for-mmps (truy cập 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 04-measurement/firebase-setup-link-google-ads-admob.md
  - 04-measurement/firebase-events-cho-ua.md
  - 03-monetization/mediation-admob-vs-applovin-max.md
  - 00-overview/roadmap.md
summary: MMP là gì (attribution trung lập, dedup giữa các network, postback, ad revenue/ILRD, chống fraud), SAN/SRN hoạt động thế nào, khi nào cần MMP thay vì chỉ Firebase, và lưu ý khi dùng song song cho Google tROAS.
---

# MMP tổng quan

## Bối cảnh

Roadmap hiện chỉ dùng **Firebase + Google Ads**. Tài liệu này để quyết định **khi nào** cần thêm MMP (Mobile Measurement Partner) như AppsFlyer, Adjust, Singular, Tenjin..., nhất là khi mở thêm kênh Meta, TikTok, AppLovin.

## 1. MMP làm gì

- **Attribution trung lập**: xác định install/event đến từ network nào, theo luật thống nhất cho mọi kênh (thường là last-touch, click ưu tiên hơn view, trong lookback window cấu hình được). Lookback mặc định khác nhau theo MMP và theo network. *Xem docs của MMP cụ thể, chưa tổng hợp ở đây.*
- **Dedup**: nhiều network cùng "nhận" một install thì MMP chỉ ghi công cho một (ví dụ AppsFlyer ghi công network cuối, các network trước được tính "assisted").
- **Postback**: gửi install/event/doanh thu ngược lại cho từng network để thuật toán của họ tối ưu (tCPA/tROAS trên Meta, TikTok, AppLovin...).
- **Ad revenue theo user**: nhận ILRD từ mediation (MAX có cơ chế broadcast riêng cho MMP; AdMob forward qua paid event) để tính **ROAS/LTV cohort theo campaign, theo mọi kênh trong một dashboard**.
- **Chống fraud** (gói thêm), **deep link**, **cost aggregation** (kéo chi phí từ các network).

## 2. SAN / SRN

- **SAN** (Self-Attributing Network, thuật ngữ Adjust) = **SRN** (Self-Reporting Network, thuật ngữ AppsFlyer): network vừa là publisher vừa là ad network, **tự đo conversion** trong hệ của mình.
- Cơ chế (Adjust): SAN **không chủ động gửi** click/impression cho MMP. MMP gửi advertising ID của install lên, SAN đối chiếu dữ liệu riêng và **xác nhận qua API** nếu user từng tương tác ad.
- AppsFlyer liệt kê ví dụ SRN: **Meta, Google, Apple Search Ads**. Non-SRN (attribution qua click URL) ví dụ: **Unity Ads, Tapjoy, AppLovin**.
- Hệ quả:
  - Nhiều SAN có thể cùng claim một install. MMP phải dedup, nên **số install trong dashboard network > số trong MMP** là bình thường.
  - Window/luật của SAN (vd Google Ads conversion window) có thể khác MMP. Google khuyên **cấu hình conversion window trên Google Ads khớp với hệ bên thứ 3** (thường mặc định 30 ngày) (6167162).

## 3. Firebase-only vs Firebase + MMP

| Tiêu chí | Firebase/GA4 only | Thêm MMP |
|---|---|---|
| Chi phí | Miễn phí | Tính phí (theo conversion/gói). Giá phải hỏi vendor. |
| Google App campaigns | **Native**. tROAS yêu cầu Firebase SDK (10617884). 15995101 ghi conversion source phải là Firebase hoặc Google Play codeless, và **third-party tools may have limitations** cho tROAS. | Google chấp nhận "Firebase hoặc approved attribution partner" (6167162). Riêng tROAS thì nên giữ Firebase làm nguồn conversion. |
| Meta / TikTok / AppLovin / Mintegral | Không có cơ chế attribution + postback chuẩn như MMP. *(Nhận định chung, chưa đối chiếu docs từng network.)* | Postback chuẩn, network tối ưu được theo event/value. |
| So sánh kênh trên cùng luật attribution | Không (GA4 thiên về Google) | Có |
| Ad revenue cohort theo campaign | Có cho traffic Google (qua `ad_impression`) | Có cho mọi kênh (ILRD) |
| Công tích hợp | Thấp | Thêm SDK, cấu hình từng partner, forward ILRD |

### Khi nào cần MMP (khung quyết định)

- **Chưa cần**: chỉ chạy Google App campaigns, ngân sách nhỏ, đang ở giai đoạn 1 và 2 của roadmap.
- **Cần**: bắt đầu chạy **≥ 1 kênh ngoài Google** có ngân sách đáng kể (Meta, TikTok, AppLovin, Mintegral, Unity), hoặc muốn ROAS cohort của mọi kênh trên một luật chung, hoặc network yêu cầu MMP để chạy tối ưu theo event/ROAS. *(Một số network non-SAN như AppLovin chủ yếu dựa vào MMP. Cần xác minh trên docs từng network trước khi launch.)*

## 4. Lưu ý khi chạy song song Firebase + MMP

- Giữ **Firebase** làm nguồn conversion cho Google Ads (nhất là tROAS `ad_impression`). Không import trùng cùng một event từ cả Firebase lẫn MMP vào Google Ads.
- Số install/ROAS giữa Google Ads, Firebase, MMP **sẽ lệch** do khác window, khác luật, khác múi giờ, khác cách dedup. Chọn một **nguồn sự thật** cho từng câu hỏi (vd MMP cho so sánh kênh, Google Ads cho tối ưu nội bộ Google) và ghi vào `decisions/`.
- Ad revenue: forward ILRD sang MMP một lần duy nhất. Nếu dùng MAX broadcast cho MMP thì không forward thêm thủ công.

## Chưa xác minh được

- Lookback window mặc định và giá của từng MMP: chưa tra.
- Yêu cầu cụ thể của Meta/TikTok/AppLovin về việc bắt buộc MMP cho app Android: chưa tra docs từng network.
