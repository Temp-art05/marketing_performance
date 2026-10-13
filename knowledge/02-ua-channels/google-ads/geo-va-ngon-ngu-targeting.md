---
title: Google App campaigns — chọn GEO, nhóm nước và ngôn ngữ
type: playbook
topic: 02-ua-channels/google-ads
tags: [google-ads, app-campaigns, geo, tier, language, location-options, localization]
app: general
geo: [EU, US]
status: verified
confidence: medium
sources:
  - "Google Ads Help — Set up an App campaign for installs: https://support.google.com/google-ads/answer/12575501 (truy cập 2026-10-14)"
  - "Google Ads Help — About advanced location options: https://support.google.com/google-ads/answer/1722038 (truy cập 2026-10-14)"
  - "Google Ads Help — Tips for maximizing your App campaign: https://support.google.com/google-ads/answer/9176652 (truy cập 2026-10-14)"
  - "session 2026-09-17→18 (als001 def570ce): setup GEO EU/US rồi chuyển sang ID+PH+VN cho Home Morph"
created: 2026-10-14
updated: 2026-10-14
images:
  - assets/screenshots/2026-09/2026-09-17-google-ads-app-locations-europe-vs-eu-1.png
related:
  - 02-ua-channels/google-ads/app-campaigns-tong-quan.md
  - 05-optimization/unit-economics-ads-only-theo-tier.md
  - decisions/2026-09-home-morph-geo-ua-ads-only.md
  - apps/home-morph/campaigns.md
  - 06-tools/global-holiday-map-lich-ngay-le.md
summary: Cách nhập danh sách nước hàng loạt, EU-27 vs "Europe", gom nước theo CPI vào campaign, Location options (Presence), chọn ngôn ngữ khớp asset và ad group theo ngôn ngữ cho App campaigns.
---

# Google App campaigns — chọn GEO, nhóm nước và ngôn ngữ

## Bối cảnh

Rút từ việc setup campaign đầu của Home Morph (17–18/09/2026). Đánh dấu: ✅ = có trong Google Ads Help; 🧪 = lời khuyên của Claude trong session hoặc kinh nghiệm, chưa kiểm chứng.

## 1. Nhập danh sách nước

Campaign settings → **Locations** → *Enter another location* → popup Location/Radius. Tick **Add locations in bulk**, dán mỗi nước một dòng → Search → Add all → Save.

![Popup Locations của App campaign: ô tìm "Europe", tick Add locations in bulk, đang có sẵn Canada + United States](../../../assets/screenshots/2026-09/2026-09-17-google-ads-app-locations-europe-vs-eu-1.png)

Ảnh trên (17/09/2026): popup chọn location trong App campaign. Lúc này user đang gõ "Europe" và list đã có Canada + United States từ trước — dễ sót nước không mong muốn, phải soát cột "Locations (n)" trước khi Save. Menu trái cho thấy các mục của Campaign settings: Locations, Languages, View-through conversion optimization, EU political ads.

🧪 **"Europe" ≠ EU.** Theo session, target "Europe" (nếu có) là cấp châu lục, gồm cả UK, Norway, Switzerland, Ukraine, Turkey… Muốn đúng EU thì dán đủ 27 nước:

```
Austria, Belgium, Bulgaria, Croatia, Cyprus, Czechia, Denmark, Estonia, Finland,
France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg,
Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden
```

(Nếu "Czechia" không ra thì thử "Czech Republic".) Tier-1 châu Âu thường thêm UK, Switzerland, Norway (ngoài EU).

## 2. Gom nước vào campaign

- ✅ Không chạy 2 App campaign của cùng app **trùng GEO** (9176652).
- 🧪 Không gom các nước có CPI chênh nhau nhiều vào 1 campaign: Google tối ưu số conversion nên sẽ dồn budget vào nước rẻ nhất, nước đắt gần như không có install → mất data. Gom khi CPI **xấp xỉ** nhau (vd ID + PH + VN), tách riêng nước rẻ hơn hẳn (vd India) hoặc đắt hơn hẳn (vd Gulf).
- 🧪 Budget nhỏ (vd ~$7–8/ngày) → chỉ chạy **1 campaign**; chia nhiều campaign thì không cái nào đủ conversion để thoát learning.
- 🧪 Đọc kết quả ở **cấp country** (report tách theo location), không chỉ cấp campaign; ~100 install/nước trở lên mới đủ để quyết định cắt/scale.
- 🧪 Target xuống cấp thành phố (vd Jakarta, Surabaya) có thể dùng ở vòng tối ưu sau; không nên làm khi budget nhỏ vì thu hẹp volume.

## 3. Location options

- ✅ App campaign có mục **Location options** để chỉ định cách target/loại trừ (12575501).
- ✅ Với các loại campaign được mô tả trong 1722038 (Search, Display, PMax…), mặc định là **"Presence or interest"**; "Presence" chỉ nhắm người đang ở/thường ở vùng target. Bài 1722038 **không nhắc App campaign**.
- 🧪 Session khuyên chọn **Presence** ("People in your targeted locations") để tránh traffic từ nước khác chỉ vì "quan tâm" vùng target. Chưa kiểm chứng trên UI App campaign hiện có đúng 2 lựa chọn này không — khi setup lần sau, chụp màn hình lại.

## 4. Ngôn ngữ

- ✅ Google Ads **không dịch** ad → chỉ target ngôn ngữ khớp với asset (12575501).
- Chọn ngôn ngữ theo **ngôn ngữ app đã localize + ngôn ngữ thiết bị phổ biến** ở GEO. Ví dụ đã dùng: ID + PH + VN → English, Indonesian, Vietnamese.
- 🧪 Giữ **English** cho hầu hết GEO: phủ nước nói tiếng Anh (Philippines) và cả user để máy tiếng Anh ở nước khác. Location đã khoá nên English không "rò" sang nước ngoài danh sách.
- 🧪 Nhắm EU mà chỉ để English sẽ bóp reach; thêm French, German, Spanish, Portuguese, Italian, Dutch, Polish… **nếu** app và asset có các tiếng đó.
- 🧪 Ưu tiên GEO mà app đã có bản dịch (vd app có `tr`, `uz`, `ar` → Turkey/Uzbekistan/MENA là lợi thế). RTL (Arabic) phải test layout trước khi chạy.

## 5. Ad group theo ngôn ngữ

- 🧪 Mỗi ngôn ngữ một ad group với bộ text/ảnh/video riêng (vd `ID - Indonesian`, `EN - English`, `VI - Vietnamese`) thay vì trộn 3 thứ tiếng trong 1 ad group. Giới hạn ký tự headline 30 / description 90: xem [creative-assets](../../01-pre-marketing/creative-assets-google-app-campaigns.md).
- Lưu ý: thêm ad group là "composition change" có thể kích hoạt learning ✅ (13020501, xem [app-campaigns-tong-quan](app-campaigns-tong-quan.md)) → nên tạo đủ ad group trước khi publish.
