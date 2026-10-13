---
title: Playbook — launch Google App campaign từ tCPA first_open đến tROAS
type: playbook
topic: playbooks
tags: [google-ads, app-campaigns, launch, tcpa, tcpi, troas, ad-impression, checklist]
app: general
status: verified
confidence: medium
sources:
  - "Roadmap của user: knowledge/00-overview/roadmap.md (ROADMAP UA MARKETING.xlsx, đọc 2026-10-14)"
  - "Google Ads Help — Set up an App campaign for installs: https://support.google.com/google-ads/answer/12575501 (truy cập 2026-10-14)"
  - "Google Ads Help — Best practices for App campaigns: https://support.google.com/google-ads/answer/14104492 (truy cập 2026-10-14)"
  - "Google Ads Help — Tips for maximizing your App campaign: https://support.google.com/google-ads/answer/9176652 (truy cập 2026-10-14)"
  - "Google Ads Help — Set a recommended initial Target ROAS for your App campaigns: https://support.google.com/google-ads/answer/15995101 (truy cập 2026-10-14)"
  - "Google Ads Help — About tROAS for ad revenue (ARO): https://support.google.com/google-ads/answer/13799577 (truy cập 2026-10-14)"
  - "Google Ads Help — Choose a bid strategy for your App campaign: https://support.google.com/google-ads/answer/12073727 (truy cập 2026-10-14)"
  - "AdMob Help — Use impression-level ad revenue: https://support.google.com/admob/answer/11322405 (truy cập 2026-10-14)"
  - "Google Ads Help — About bidding in App campaigns: https://support.google.com/google-ads/answer/7100895 (truy cập 2026-10-14)"
  - "Google Ads Help — Acquire high-value app users at scale with Target ROAS bidding: https://support.google.com/google-ads/answer/10617884 (truy cập 2026-10-14)"
  - "Google Ads Help — Duration of the learning period: https://support.google.com/google-ads/answer/13020501 (truy cập 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 00-overview/roadmap.md
  - 02-ua-channels/google-ads/app-campaigns-tong-quan.md
  - 04-measurement/firebase-setup-link-google-ads-admob.md
  - 04-measurement/firebase-events-cho-ua.md
  - 01-pre-marketing/creative-assets-google-app-campaigns.md
  - 05-optimization/doc-chi-so-theo-moc-thoi-gian.md
summary: Checklist theo roadmap — campaign install tối ưu first_open → import ad_impression (~ngày 3) → campaign tROAS → thêm ad group, kèm điều kiện chuyển bước chính thức của Google và chỗ nào là kinh nghiệm chưa kiểm chứng.
---

# Playbook: launch Google App campaign (first_open → tROAS)

## Bối cảnh

Triển khai giai đoạn 2 của [roadmap](../00-overview/roadmap.md) cho app Android kiếm tiền bằng ads. Ký hiệu:
- ✅ **[Chính thức]**: có trong Google Ads/AdMob Help (số answer kèm theo).
- 🧪 **[Kinh nghiệm, chưa kiểm chứng]**: thực hành phổ biến hoặc theo roadmap, Google không xác nhận. Khi có data thật thì cập nhật bằng `lessons/`.

## Bước 0: Điều kiện tiên quyết

- [ ] Firebase SDK + GA4, link Google Ads, link AdMob: [firebase-setup-link-google-ads-admob](../04-measurement/firebase-setup-link-google-ads-admob.md).
- [ ] `first_open` đã import vào Google Ads, **Primary**, đang Recording. Chỉ 1 install conversion là Primary.
- [ ] **AdMob: bật Impression-level ad revenue ngay từ bây giờ** ✅ (11322405, 6383165). Nếu dùng MAX thì code log `ad_impression` có value/currency đã lên production ([firebase-events-cho-ua](../04-measurement/firebase-events-cho-ua.md)). Lý do: tROAS sau này cần lịch sử conversion value, nên phải bắt đầu tích luỹ từ ngày đầu.
- [ ] Bộ creative đủ: 5 headline, 5 description, ≥ 15 ảnh 3 tỉ lệ, ≥ 15 video 3 hướng ([creative-assets](../01-pre-marketing/creative-assets-google-app-campaigns.md)).
- [ ] Store listing đã làm xong ASO.

## Bước 1: Campaign install tối ưu `first_open`

Roadmap gọi là "tCPA tối ưu first_open". Về kỹ thuật, `first_open` là **install conversion**, nên trong Google Ads đây là focus **Installs** với bid **Target CPI** (tCPI là biến thể của Target CPA ✅ 12073727). Cần ghi lại trên UI thực tế màn hình hiện gì.

Setup (12575501):
- [ ] Goal **App promotion** → subtype **App installs** → Android → chọn app. Đặt tên có OS (vd `ACi_Android_US_tCPI_firstopen_2026-10`).
- [ ] GEO + ngôn ngữ. ✅ Không để 2 App campaign của cùng app **trùng GEO** (9176652).
- [ ] Bidding: focus Installs, conversion event = `first_open` (Firebase), đặt **target CPI**.
  - 🧪 Target CPI khởi điểm: Google có *bid guidance* cho ACi tCPI "All users" ✅ (12073727), nên tham khảo. Nếu không có thì lấy CPI kỳ vọng từ kế hoạch tài chính (ROAS mục tiêu × LTV dự kiến). Không có benchmark chung.
- [ ] **Budget ngày ≥ 50 × tCPI** ✅ (14104492, 9176652). Nếu thực sự chọn focus In-app actions với tCPA thì ≥ 10 × tCPA ✅.
- [ ] Asset: điền đủ slot, Ad Strength ≥ Good ✅.
- [ ] Bật auto-tagging ✅.

Sau khi launch:
- ✅ Campaign cần "a few days" để gom dữ liệu. CPI những ngày đầu có thể cao vì conversion về trễ (9176652).
- ✅ Không đổi budget/CPI > 20% một lần. Không đổi event, conversion window, GEO lớn, asset tốt trước **100 conversion đầu** (14104492). Không cycle bid lên xuống.

## Bước 2: Sau ~3 ngày, import `ad_impression` vào Google Ads

- 🧪 Mốc "~3 ngày" là của roadmap, **không phải yêu cầu của Google**. Không có trở ngại kỹ thuật nào ngăn import sớm hơn: chỉ cần `ad_impression` đã xuất hiện trong GA4 (event mới có thể mất tới ~1 ngày mới hiện để import, theo kinh nghiệm cộng đồng).
- [ ] GA4: đánh dấu `ad_impression` là **key event / conversion** ✅ (13799577).
- [ ] Google Ads: Conversions → + → App → Google Analytics 4 (Firebase) → chọn `ad_impression` → Import. Value lấy từ event ✅.
- [ ] Đặt `ad_impression` là **Secondary** trong lúc campaign install còn chạy, để không làm đổi mục tiêu tối ưu. 🧪 (suy luận: ✅ `ad_impression` chỉ dùng được cho tROAS, nên không gắn vào campaign tCPI).
- [ ] Kiểm tra: segment theo conversion action + cột *Conversion value* phải thấy value > 0. ✅ Cột Conversions của `ad_impression` mặc định hiện 0 (13799577), không phải lỗi.

## Bước 3: Launch campaign tROAS

### Điều kiện chuyển bước (chính thức)
| Điều kiện | Nguồn |
|---|---|
| Đã import `ad_impression` từ GA4, app bidding trên GA events, doanh thu app chủ yếu từ ads | ✅ 13799577 |
| Volume ổn định, **"typically 30+ conversions in 30 days"** | ✅ 15995101 |
| Chuyển từ tCPA cần **3 đến 4 tuần dữ liệu conversion value** | ✅ 15995101 |
| Conversion source = Firebase (hoặc Google Play codeless) | ✅ 15995101 |
| Event tối ưu là Primary, có dynamic value | ✅ 15995101, 7100895 |

> ⚠️ **Mâu thuẫn với roadmap**: roadmap ngầm hiểu launch tROAS sớm (ngay sau khi import `ad_impression`), còn Google khuyên **có 3 đến 4 tuần dữ liệu value**. Tạm thời làm theo Google: dùng 3 đến 4 tuần đó để chạy bước 1 và tích luỹ value. Nếu launch sớm hơn thì ghi rõ là thử nghiệm và lưu kết quả vào `lessons/`.

### Setup
- [ ] Campaign **mới**, App installs → focus **In-app action value** → event `ad_impression` (thêm event IAP nếu hybrid) → nhập **target ROAS %** ✅ (10617884, 13799577). Google khuyên tạo campaign mới thay vì đổi loại campaign cũ ✅ (9176652: tránh đổi campaign type sau launch).
- [ ] **Target ROAS khởi điểm** = *Conv. value/cost* mà campaign bước 1 đạt được (cùng app, event, GEO, ngôn ngữ), đo trên khoảng bằng conversion window ✅ (15995101, 13799577). Nếu tCPI/tCPA đặt cao hơn hẳn chi phí thực thì nhân modifier tương ứng ✅. Có thể xem *Bid guidance*.
- [ ] Conversion window `ad_impression`: **7 đến 30 ngày** ✅ (13799577). Chọn mức bắt được ~90% conversion ✅ (14104492).
- [ ] Budget: Google **không công bố** hệ số cho tROAS. 🧪 Thường để ≥ budget campaign bước 1 để model có đủ dữ liệu.
- [ ] **GEO "global"** (roadmap): ⚠️ nếu campaign bước 1 vẫn chạy cùng GEO thì vi phạm khuyến nghị "không trùng GEO" ✅ (9176652). Phương án: tách GEO, hoặc giảm/dừng campaign bước 1 ở GEO trùng khi tROAS đã ổn. Quyết định cụ thể ghi vào `decisions/`.

### Vận hành tROAS (15995101)
- ✅ Thay đổi lớn kích hoạt learning **7 đến 14 ngày**. Không đổi budget/target lớn quá 1 lần mỗi **1 đến 2 tuần**. Mỗi lần chỉnh target trong khoảng **±15 đến 20%**.
- ✅ Đánh giá trên cửa sổ **14 đến 30 ngày**, bỏ những ngày gần nhất (conversion trễ).
- ✅ Không đạt volume: hạ target ROAS. Bị "Limited by budget": tăng budget (14104492).

## Bước 4: Thêm ad group cho campaign tROAS

- 🧪 Chỉ thêm khi ad group đầu đã ổn (qua learning, có asset Best/Good), vì thêm ad group là "composition change" có thể kích hoạt learning lại ✅ (13020501).
- [ ] Mỗi ad group mới = **1 chủ đề/thông điệp** khác (tính năng khác, đối tượng khác), với bộ asset riêng (5+5 text, ảnh 3 tỉ lệ, video 3 hướng), deep link phù hợp chủ đề ✅ (14104492).
- [ ] Ad Strength ≥ Good cho mỗi ad group ✅.
- [ ] Ghi tên ad group + chủ đề + ngày tạo vào `apps/<app>/campaigns.md`.

## Sau launch

Đọc chỉ số theo mốc 7 ngày / 1 tháng / 4 tháng / 6 tháng: [doc-chi-so-theo-moc-thoi-gian](../05-optimization/doc-chi-so-theo-moc-thoi-gian.md). Tổng quan bidding/budget: [app-campaigns-tong-quan](../02-ua-channels/google-ads/app-campaigns-tong-quan.md).
