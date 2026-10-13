---
title: Home Morph — chiến lược GEO cho UA khi app ads-only (09/2026)
type: decision
topic: decisions
tags: [home-morph, geo, tier, ads-only, d0-roas, google-ads, unit-economics]
app: home-morph
geo: [ID, PH, VN, US, EU]
status: verified
confidence: low
sources:
  - "session 2026-09-17→18 (als001 def570ce): thảo luận tier/GEO, unit economics ads-only, chốt campaign đầu"
  - "RevenueLab — AdMob eCPM Benchmarks 2026 (https://www.revenuelab.fyi/blog/admob-ecpm-benchmarks-2026), trích qua WebFetch trong session 2026-09-17, không kiểm lại"
created: 2026-10-14
updated: 2026-10-14
related:
  - apps/home-morph/campaigns.md
  - apps/home-morph/profile.md
  - 05-optimization/unit-economics-ads-only-theo-tier.md
  - 02-ua-channels/google-ads/geo-va-ngon-ngu-targeting.md
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
summary: Quyết định 18/09/2026 cho Home Morph — giữ ads-only, paid UA chỉ ở Tier 2/3 (bắt đầu ID+PH+VN, ₫200k/ngày), Tier 1 US/EU lấy bằng organic; ngưỡng scale D0 ROAS ≥ 25%. Dựa trên benchmark, chưa có số thật.
---

# Home Morph — chiến lược GEO cho UA khi app ads-only

## Bối cảnh

- Ngày: 2026-09-17 tối → 2026-09-18 (giờ VN). App Home Morph, Android, ads-only.
- Điểm xuất phát: user muốn chạy Google App campaign nhắm **EU + US**.
- Cơ sở lập luận: hoàn toàn là **benchmark ngành và ước lượng của Claude** (chưa có ARPDAU, retention, imps/user thật của app). Trong session Claude đã tự sửa số 3 lần (lẫn D7 với lifetime ROAS; dùng CPI Tier 3 cao gấp 2–4 lần) → các con số chỉ mang tính minh hoạ, **không dùng làm benchmark**.

## Quyết định

1. **Giữ mô hình ads-only**, chưa làm subscription. Sub để dành khi muốn mở paid UA ở Tier 1.
2. **Paid UA chỉ ở Tier 2/3.** Tier 1 (US, CA, UK, AU, NZ, IE, DE, AT, CH, FR, BE, NL, ES, PT, IT, Nordics) **không chạy paid**, lấy bằng ASO + viral share.
3. Campaign đầu: **1 campaign** Indonesia + Philippines + Vietnam, ₫200.000/ngày, tCPI ₫2.125, tối ưu Firebase first_open. Chi tiết: [campaigns](../apps/home-morph/campaigns.md).
4. **Chỉ số ra quyết định: D0 ROAS theo country, ngưỡng scale ≥ 25%** (ngưỡng do user đưa ra từ kinh nghiệm thị trường).
5. Song song: tăng ad density ở session đầu (rewarded cho HD download / generate variant…) và retention — đòn bẩy không tốn tiền UA.

## Lý do (theo lập luận trong session)

- Công thức: số impression cần ở D0 để đạt D0 ROAS mục tiêu = `CPI × D0_ROAS_target / (blended eCPM / 1000)`. Với giả định Claude dùng (T1: CPI ~$1,5, blended eCPM ~$8 → ~47 imps ở D0; T2/T3: ~9–10 imps) thì Tier 1 không thể đạt trong 1 session mà không phá UX. Xem [unit economics](../05-optimization/unit-economics-ads-only-theo-tier.md).
- Ngân sách ~$7,6/ngày không đủ chia nhiều campaign: mỗi campaign sẽ quá ít conversion để thoát learning.
- Gom 3 nước CPI xấp xỉ nhau để Google không dồn hết budget vào 1 nước rẻ nhất (lập luận, chưa kiểm chứng bằng tài liệu Google).

## Phương án đã loại

- **EU + US ngay từ đầu** (yêu cầu ban đầu): loại vì CPI Tier 1 quá cao so với doanh thu ads ước tính.
- **6 campaign theo cụm (Asia T3, MENA, Africa, LATAM, Turkey+Central Asia, Gulf), tổng ~$71/ngày**: loại vì vượt ngân sách thật. Giữ làm lộ trình khi budget lên ~$30/ngày+ (cụm tiếp theo gợi ý: MENA — Egypt/Morocco, dùng `ar` + `fr`).
- **Làm app khác / chuyển sang subscription ngay**: loại; vấn đề là mô hình monetization, không phải app.

## Điều kiện xem lại

- Sau 7 ngày chạy: nếu cả 3 nước D0 ROAS < 15% → tắt, sửa app trước. Nếu có số thật (ARPDAU, D1/D7, imps/user) → tính lại toàn bộ và cập nhật quyết định này.
- Khi có IAP/sub → xem lại Tier 1.

## Ghi chú: có hai bảng tier khác nhau (bổ sung 2026-10-14 từ AI Knownledge, chưa duyệt)

Quyết định ở trên **không đổi**. Ghi chú để tránh nhầm khi bàn GEO:
- Bảng tier của quyết định này (Tier 1 = US, CA, UK, AU, NZ, IE, DE, AT, CH, FR, BE, NL, ES, **PT**, IT, Nordics; ID+PH+VN gọi chung "Tier 2/3") là bảng **định giá GEO cho UA**, dựa trên benchmark eCPM/CPI.
- Bảng tier nội bộ Apero trong tool stum-weekly-report (APR-099, `src/tiers.js`) dùng cho **ngưỡng "đủ số" khi so version** (Tier 1/2/3 ↔ 100/300/1000 new user/ngày): Tier 1 có 19 nước (thêm LU; **không có PT**), **Portugal, Indonesia, Philippines ở Tier 2**, **Vietnam, India ở Tier 3**. Chi tiết: [hậu kiểm version app](../05-optimization/hau-kiem-version-app-nguong-verdict.md).
- Hai bảng khác mục đích nên không bên nào sai. Khi so số của Home Morph với báo cáo nội bộ Apero, nói rõ đang dùng bảng nào.
