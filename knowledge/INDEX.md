# Knowledge Index

> AUTO-GENERATED bởi `npm run kb:index` — không sửa tay. 13 tài liệu (13 draft), cập nhật gần nhất 2026-10-14.
> Mỗi dòng: `đường dẫn trong knowledge/` — tóm tắt `[type · status · updated · app]`. Mở file khi cần chi tiết.

## 00-overview — Tổng quan: roadmap, glossary chỉ số, trạng thái hiện tại

- `00-overview/current-state.md` — Ảnh chụp nhanh "đang ở đâu" — app nào đang chạy, campaign nào, vấn đề đang mở. Cập nhật mỗi khi có thay đổi lớn. `[overview · draft · 2026-10-14]`
- `00-overview/glossary-chi-so.md` — Định nghĩa + công thức + cách đọc + bẫy của các chỉ số UA (CPI, CPA, CTR, CVR, IPM, ROAS, payback) và monetization (LTV, ARPU, ARPDAU, eCPM, match/show rate, imps/DAU, retention). `[reference · draft · 2026-10-14]`
- `00-overview/roadmap.md` — Lộ trình 3 giai đoạn — Pre-Marketing (ASO, creative, Firebase) → Launch campaign (tCPA First_Open → ROAS) → Đo lường & tối ưu (Ads, AdMob, Firebase). `[overview · draft · 2026-10-14]`

## 01-pre-marketing — Chuẩn bị trước khi chạy: ASO, store listing, creative, Firebase/SDK

- `01-pre-marketing/aso-google-play-store-listing.md` — Giới hạn ký tự title/short/full description, spec icon, feature graphic, screenshot, preview video và quy tắc keyword/metadata của Google Play, kèm checklist ASO theo roadmap. `[reference · draft · 2026-10-14]`
- `01-pre-marketing/creative-assets-google-app-campaigns.md` — Spec asset cho Google App campaigns (headline 30/description 90 ký tự, ảnh 1:1·1.91:1·4:5, video YouTube 3 hướng, HTML5 zip ≤5MB), số lượng tối đa mỗi ad group và đối chiếu với yêu cầu creative trong roadmap. `[reference · draft · 2026-10-14]`

## 02-ua-channels — Kênh UA: Google Ads, Meta, TikTok, AppLovin, Mintegral...

- `02-ua-channels/google-ads/app-campaigns-tong-quan.md` — Tổng quan App campaigns (ACi/ACe/ACpre), các bid strategy tCPI/tCPA/tROAS, tỉ lệ budget/bid chính thức (50×/10×/15×), learning period, quy tắc đổi bid/budget, cấu trúc ad group. `[concept · draft · 2026-10-14]`

## 03-monetization — Monetization: AdMob, MAX, mediation, ad format/placement, eCPM

- `03-monetization/admob-co-ban.md` — 6 ad format của AdMob và khi nào dùng, định nghĩa chính thức requests/match rate/show rate/impressions/eCPM/ARPU/imps per user, cách đọc phễu, và các policy dễ bị phạt (invalid traffic, interstitial, rewarded). `[reference · draft · 2026-10-14]`
- `03-monetization/mediation-admob-vs-applovin-max.md` — Mediation là gì, waterfall vs bidding (unified auction), so sánh AdMob mediation với AppLovin MAX ở góc độ UA/đo lường, và impression-level revenue (ILRD) của từng bên để đẩy về Firebase/MMP. `[concept · draft · 2026-10-14]`

## 04-measurement — Đo lường: Firebase events, MMP, attribution

- `04-measurement/firebase-events-cho-ua.md` — Ý nghĩa và điều kiện của first_open, ad_impression (AdMob tự log / MAX log thủ công qua ILRD), app_remove, user_engagement, in_app_purchase và event nào dùng cho tCPI/tCPA/tROAS. `[reference · draft · 2026-10-14]`
- `04-measurement/firebase-setup-link-google-ads-admob.md` — Các bước tích hợp Firebase SDK Android, link Firebase/GA4 với Google Ads và AdMob (quyền cần có), bật impression-level ad revenue, import first_open làm conversion và các lỗi hay gặp. `[playbook · draft · 2026-10-14]`
- `04-measurement/mmp-tong-quan.md` — MMP là gì (attribution trung lập, dedup giữa các network, postback, ad revenue/ILRD, chống fraud), SAN/SRN hoạt động thế nào, khi nào cần MMP thay vì chỉ Firebase, và lưu ý khi dùng song song cho Google tROAS. `[concept · draft · 2026-10-14]`

## 05-optimization — Đọc chỉ số và tối ưu: ROAS/CPI/retention theo mốc, quy tắc scale/cut

- `05-optimization/doc-chi-so-theo-moc-thoi-gian.md` — Khung đọc Google Ads, AdMob, Firebase ở các mốc 7 ngày, 1, 4, 6 tháng — xem gì, hỏi gì, làm gì; ngưỡng để trống chờ số liệu thực tế của app. `[playbook · draft · 2026-10-14]`

## playbooks — Checklist từng bước cho các việc lặp lại

- `playbooks/launch-google-app-campaign-tcpa-den-roas.md` — Checklist theo roadmap — campaign install tối ưu first_open → import ad_impression (~ngày 3) → campaign tROAS → thêm ad group, kèm điều kiện chuyển bước chính thức của Google và chỗ nào là kinh nghiệm chưa kiểm chứng. `[playbook · draft · 2026-10-14]`
