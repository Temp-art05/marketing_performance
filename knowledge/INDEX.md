# Knowledge Index

> AUTO-GENERATED bởi `npm run kb:index` — không sửa tay. 21 tài liệu (0 draft), cập nhật gần nhất 2026-10-14.
> Mỗi dòng: `đường dẫn trong knowledge/` — tóm tắt `[type · status · updated · app]`. Mở file khi cần chi tiết.

## 00-overview — Tổng quan: roadmap, glossary chỉ số, trạng thái hiện tại

- `00-overview/current-state.md` — Ảnh chụp nhanh "đang ở đâu" — app nào đang chạy, campaign nào, vấn đề đang mở. Cập nhật mỗi khi có thay đổi lớn. `[overview · verified · 2026-10-14]`
- `00-overview/glossary-chi-so.md` — Định nghĩa + công thức + cách đọc + bẫy của các chỉ số UA (CPI, CPA, CTR, CVR, IPM, ROAS, payback) và monetization (LTV, ARPU, ARPDAU, eCPM, match/show rate, imps/DAU, retention). `[reference · verified · 2026-10-14]`
- `00-overview/roadmap.md` — Lộ trình 3 giai đoạn — Pre-Marketing (ASO, creative, Firebase) → Launch campaign (tCPA First_Open → ROAS) → Đo lường & tối ưu (Ads, AdMob, Firebase). `[overview · verified · 2026-10-14]`
- `00-overview/watchlist.md` — Danh sách mốc cần xem lại (ROAS D7, 1 tháng, 4 tháng…) theo app — Claude nhắc khi đến hạn. `[overview · verified · 2026-10-14]`

## 01-pre-marketing — Chuẩn bị trước khi chạy: ASO, store listing, creative, Firebase/SDK

- `01-pre-marketing/aso-google-play-store-listing.md` — Giới hạn ký tự title/short/full description, spec icon, feature graphic, screenshot, preview video và quy tắc keyword/metadata của Google Play, kèm checklist ASO theo roadmap. `[reference · verified · 2026-10-14]`
- `01-pre-marketing/creative-assets-google-app-campaigns.md` — Spec asset cho Google App campaigns (headline 30/description 90 ký tự, ảnh 1:1·1.91:1·4:5, video YouTube 3 hướng, HTML5 zip ≤5MB), số lượng tối đa mỗi ad group và đối chiếu với yêu cầu creative trong roadmap. `[reference · verified · 2026-10-14]`

## 02-ua-channels — Kênh UA: Google Ads, Meta, TikTok, AppLovin, Mintegral...

- `02-ua-channels/google-ads/app-campaigns-tong-quan.md` — Tổng quan App campaigns (ACi/ACe/ACpre), các bid strategy tCPI/tCPA/tROAS, tỉ lệ budget/bid chính thức (50×/10×/15×), learning period, quy tắc đổi bid/budget, cấu trúc ad group. `[concept · verified · 2026-10-14]` 🖼1
- `02-ua-channels/google-ads/geo-va-ngon-ngu-targeting.md` — Cách nhập danh sách nước hàng loạt, EU-27 vs "Europe", gom nước theo CPI vào campaign, Location options (Presence), chọn ngôn ngữ khớp asset và ad group theo ngôn ngữ cho App campaigns. `[playbook · verified · 2026-10-14]` 🖼1

## 03-monetization — Monetization: AdMob, MAX, mediation, ad format/placement, eCPM

- `03-monetization/admob-co-ban.md` — 6 ad format của AdMob và khi nào dùng, định nghĩa chính thức requests/match rate/show rate/impressions/eCPM/ARPU/imps per user, cách đọc phễu, và các policy dễ bị phạt (invalid traffic, interstitial, rewarded). `[reference · verified · 2026-10-14]`
- `03-monetization/mediation-admob-vs-applovin-max.md` — Mediation là gì, waterfall vs bidding (unified auction), so sánh AdMob mediation với AppLovin MAX ở góc độ UA/đo lường, và impression-level revenue (ILRD) của từng bên để đẩy về Firebase/MMP. `[concept · verified · 2026-10-14]`

## 04-measurement — Đo lường: Firebase events, MMP, attribution

- `04-measurement/firebase-events-cho-ua.md` — Ý nghĩa và điều kiện của first_open, ad_impression (AdMob tự log / MAX log thủ công qua ILRD), app_remove, user_engagement, in_app_purchase và event nào dùng cho tCPI/tCPA/tROAS. `[reference · verified · 2026-10-14]`
- `04-measurement/firebase-setup-link-google-ads-admob.md` — Các bước tích hợp Firebase SDK Android, link Firebase/GA4 với Google Ads và AdMob (quyền cần có, cả khi khác tài khoản Google), bật impression-level ad revenue, import first_open làm conversion và các lỗi hay gặp. `[playbook · verified · 2026-10-14]`
- `04-measurement/mmp-tong-quan.md` — MMP là gì (attribution trung lập, dedup giữa các network, postback, ad revenue/ILRD, chống fraud), SAN/SRN hoạt động thế nào, khi nào cần MMP thay vì chỉ Firebase, và lưu ý khi dùng song song cho Google tROAS. `[concept · verified · 2026-10-14]`

## 05-optimization — Đọc chỉ số và tối ưu: ROAS/CPI/retention theo mốc, quy tắc scale/cut

- `05-optimization/doc-chi-so-theo-moc-thoi-gian.md` — Khung đọc Google Ads, AdMob, Firebase ở các mốc 7 ngày, 1, 4, 6 tháng — xem gì, hỏi gì, làm gì; ngưỡng để trống chờ số liệu thực tế của app. `[playbook · verified · 2026-10-14]`
- `05-optimization/unit-economics-ads-only-theo-tier.md` — Công thức quyết định GEO cho app thuần ads (imps cần ở D0 = CPI × D0 ROAS target / eCPM×1000), các bẫy khi so ROAS D0/D7 với lifetime, và benchmark eCPM theo tier của bên thứ ba (độ tin thấp). `[concept · verified · 2026-10-14]`

## playbooks — Checklist từng bước cho các việc lặp lại

- `playbooks/launch-google-app-campaign-tcpa-den-roas.md` — Checklist theo roadmap — campaign install tối ưu first_open → import ad_impression (~ngày 3) → campaign tROAS → thêm ad group, kèm điều kiện chuyển bước chính thức của Google và chỗ nào là kinh nghiệm chưa kiểm chứng. `[playbook · verified · 2026-10-14]`

## lessons — Bài học rút ra từ data/việc thật (có ngày, bối cảnh)

- `lessons/2026-09-google-ads-ad-group-trong-do-adblock.md` — 18/09/2026 khi tạo App campaign, bước Ad group hiện trang trắng (URL kẹt ở ProductGroupsComponent); nguyên nhân là extension AdBlock — tắt cho ads.google.com và reload là hết. `[lesson · verified · 2026-10-14 · home-morph]` 🖼1
- `lessons/2026-09-link-admob-google-ads-khac-tai-khoan.md` — 17/09/2026 link AdMob và Google Ads của Home Morph nằm ở 2 tài khoản Google — không có link trực tiếp cho tROAS; phải đi AdMob→Firebase/GA4→Google Ads, và "Firebase Owner" không có nghĩa là có quyền GA4. `[lesson · verified · 2026-10-14 · home-morph]` 🖼1

## decisions — Quyết định đã chốt và lý do

- `decisions/2026-09-home-morph-geo-ua-ads-only.md` — Quyết định 18/09/2026 cho Home Morph — giữ ads-only, paid UA chỉ ở Tier 2/3 (bắt đầu ID+PH+VN, ₫200k/ngày), Tier 1 US/EU lấy bằng organic; ngưỡng scale D0 ROAS ≥ 25%. Dựa trên benchmark, chưa có số thật. `[decision · verified · 2026-10-14 · home-morph]`

## apps — Hồ sơ từng app: thông số, lịch sử campaign, kết quả

- `apps/home-morph/campaigns.md` — Nhật ký campaign Google Ads của Home Morph — campaign đầu "Home Morph 1" (ACi, ID+PH+VN, first_open, tCPI ₫2.125, ₫200k/ngày) dựng 17–18/09/2026; chưa có kết quả. `[app-profile · verified · 2026-10-14 · home-morph]` 🖼3
- `apps/home-morph/profile.md` — Hồ sơ Home Morph (com.homemorph.app) — app AI thiết kế nội thất Android, ads-only; ID Firebase/GA4/AdMob/Google Ads, tài khoản nào giữ quyền gì, ngôn ngữ app hỗ trợ. `[app-profile · verified · 2026-10-14 · home-morph]`
