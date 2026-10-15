---
title: Khung đọc chỉ số theo mốc 7 ngày / 1 tháng / 4 tháng / 6 tháng
type: playbook
topic: 05-optimization
tags: [optimization, kpi, roas, cpi, ecpm, retention, review-cadence]
app: general
status: verified
confidence: medium
sources:
  - "Roadmap của user: knowledge/00-overview/roadmap.md (ROADMAP UA MARKETING.xlsx, đọc 2026-10-14)"
  - "Google Ads Help — Set a recommended initial Target ROAS for your App campaigns: https://support.google.com/google-ads/answer/15995101 (truy cập 2026-10-14)"
  - "Google Ads Help — Best practices for App campaigns: https://support.google.com/google-ads/answer/14104492 (truy cập 2026-10-14)"
  - "Google Ads Help — Tips for maximizing your App campaign: https://support.google.com/google-ads/answer/9176652 (truy cập 2026-10-14)"
  - "Google Ads Help — About bidding in App campaigns: https://support.google.com/google-ads/answer/7100895 (truy cập 2026-10-14)"
  - "Google Ads Help — About tROAS for ad revenue (ARO): https://support.google.com/google-ads/answer/13799577 (truy cập 2026-10-14)"
  - "AdMob Help — Reports glossary: https://support.google.com/admob/table/9462111 (truy cập 2026-10-14)"
  - "Firebase Help — Automatically collected events: https://support.google.com/firebase/answer/9234069 (truy cập 2026-10-14)"
  - "Khoá UA Marketing Mobile App 2026 (Quocmedia, Quốc Anh), bài 1.2 và 4.4 — video ~11–12/2024, transcribe 2026-10-15"
created: 2026-10-14
updated: 2026-10-15
related:
  - 00-overview/roadmap.md
  - 00-overview/glossary-chi-so.md
  - playbooks/launch-google-app-campaign-tcpa-den-roas.md
  - 02-ua-channels/google-ads/app-campaigns-tong-quan.md
  - 03-monetization/admob-co-ban.md
  - 04-measurement/firebase-events-cho-ua.md
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
  - 03-monetization/remote-config-ads-theo-phase-build-normal-2floor.md
  - 06-tools/tong-quan-cong-cu-ai-marketing.md
  - 06-tools/agent-qc-data-pipeline.md
  - lessons/2024-12-quocmedia-demo-tcpi-thap-va-troas-cao-khong-spend.md
  - 00-overview/khoa-hoc-quocmedia-ua-marketing-2026.md
summary: Khung đọc Google Ads, AdMob, Firebase ở các mốc 7 ngày, 1, 4, 6 tháng — xem gì, hỏi gì, làm gì; ngưỡng để trống chờ số liệu thực tế của app.
---

# Khung đọc chỉ số theo mốc thời gian

## Bối cảnh

Giai đoạn 3 của [roadmap](../00-overview/roadmap.md): theo dõi campaign ROAS ở các mốc **7 ngày · 1 tháng · 4 tháng · 6 tháng**, trên 3 nguồn Google Ads, AdMob, Firebase. Định nghĩa chỉ số xem [glossary](../00-overview/glossary-chi-so.md).

> **Nguyên tắc về ngưỡng**: file này **không đưa benchmark**. Mọi ô "ngưỡng" đều là *cần số liệu thực tế của app*. Ngưỡng hợp lý được suy ra từ (a) kế hoạch tài chính: CPI tối đa = LTV dự kiến ÷ ROAS mục tiêu, và (b) lịch sử của chính app/GEO. Khi có số thật thì ghi vào `apps/<app>/` và `lessons/`, rồi link về đây.

## Nguyên tắc đọc chung

1. **Đọc theo cohort**, không theo ngày lịch (xem bẫy ROAS ở glossary).
2. **Bỏ những ngày gần nhất** vì conversion và doanh thu về trễ. Google khuyên đánh giá xu hướng trên cửa sổ **14 đến 30 ngày** và loại khoảng gần nhất (15995101).
3. **Không phản ứng theo ngày**. Google: kết quả dao động quanh target theo ngày là bình thường (7100895). Ngày cao điểm có thể chi tới 2× budget (15995101).
4. **Mỗi lần chỉ đổi một thứ** và ghi lại ngày đổi. Thay đổi lớn ở tROAS kích hoạt learning 7 đến 14 ngày. Không đổi lớn quá 1 lần mỗi 1 đến 2 tuần. Target chỉnh trong khoảng ±15 đến 20% (15995101). Budget/CPI không đổi > 20% một lần (9176652).
5. **Tách theo GEO**: CPI, eCPM, retention khác nhau rất nhiều giữa các quốc gia, nên số "global" dễ gây hiểu nhầm.
6. Ba nguồn **không khớp nhau 100%** (window, múi giờ, dedup). So xu hướng trong cùng nguồn, đừng trừ chéo giữa các nguồn.

## Mốc 7 ngày: "Có chạy đúng không?"

Mục tiêu: phát hiện lỗi setup/tracking và tín hiệu sớm. **Chưa** kết luận ROAS.

| Nguồn | Xem gì | Câu hỏi | Ngưỡng |
|---|---|---|---|
| Google Ads | Cost, installs (`first_open`), CPI, CTR, CR, trạng thái learning, "Limited by budget", Ad Strength, asset rating | Chi có đều không? CPI có quanh target không (nhớ conversion trễ)? Asset nào bị Low? | cần số liệu thực tế của app |
| Google Ads | `ad_impression` conversion value (segment theo conversion action) | Value đã về chưa, có > 0 không? (Cột Conversions = 0 là bình thường, 13799577) | n/a (kiểm tra kỹ thuật) |
| AdMob | Requests, match rate, show rate, impressions, eCPM theo **ad unit** và **format** | Có ad unit nào show rate bất thường (lỗi code)? Match rate thấp ở GEO đang chạy UA? | cần số liệu thực tế của app |
| Firebase | `first_open` so với installs trên Google Ads/Play Console; **D1 retention** cohort UA; `app_remove`; **crash-free users** (Crashlytics) | Số `first_open` có khớp tương đối không? D1 có sụt so với organic không? Crash có tăng theo version không? | cần số liệu thực tế của app |
| Chéo | ROAS D0, D3 sơ bộ | Chỉ để so giữa các campaign/GEO với nhau, **không** để kết luận lãi/lỗ | cần số liệu thực tế của app |

Hành động điển hình: sửa tracking, thêm asset thay asset Low, xử lý crash, sửa placement có show rate thấp. **Không** đổi bid/target lớn nếu chưa đủ ~100 conversion (14104492).

**Bổ sung cho mốc 7 ngày (bổ sung 2026-10-15 từ khoá Quocmedia bài 4.4, chưa duyệt)**
- Bộ cột Google Ads cho campaign CPI theo khoá: **Impr., Clicks, Installs, Cost/Install, CTR, Cost, Conv. rate**; tắt các cột trùng (Conversions trùng Installs, Cost/conv. trùng Cost/Install) và Optimization score, View-through conv. Đọc phễu: impression → click (CTR) → install (conv. rate) → CPI.
  - ⚠️ *Conv. rate* của Google = conversions / **interactions**, không phải installs/clicks (case khoá: 5,21% vs 157/1.970 = 7,97%). Muốn CR click→install thì tự chia.
- 🧪 Ngưỡng AdMob của khoá (không phải Google): **Impressions/Requests ≥ 50%**, **match rate ≥ 80%** (≥ 90% tốt); dưới ngưỡng thì kiểm SDK/code với dev trước khi lên tROAS. Chi tiết và chỗ lệch với thang nội bộ Apero: [AdMob cơ bản](../03-monetization/admob-co-ban.md). Có thể dùng tạm cho ô "Ngưỡng" hàng AdMob ở trên cho tới khi có số thật của app.
- Campaign gần như không spend sau 3–7 ngày → xem mục "Campaign không tiêu tiền" trong [playbook](../playbooks/launch-google-app-campaign-tcpa-den-roas.md).
- Khoá giữ cùng ma trận mốc 7 ngày/1/4/6 tháng của roadmap và nhịp đọc chỉ số **hằng ngày hoặc hằng tuần** (bài 1.2); các bài 4.1–4.5 không nói gì thêm về mốc.

## Mốc 1 tháng: "Unit economics có triển vọng không?"

Mục tiêu: có ROAS D7 trọn vẹn cho các cohort tuần 1 và 2, D30 cho cohort đầu tiên. Đây cũng là lúc xét chuyển sang tROAS (≥ 30 conversion/30 ngày, có 3 đến 4 tuần dữ liệu value, 15995101).

| Nguồn | Xem gì | Câu hỏi |
|---|---|---|
| Google Ads | CPI, CR, cost theo tuần và theo GEO; ROAS (conv. value/cost) theo campaign; so ROAS đạt được với target | Campaign bị bid-constrained hay budget-constrained (14104492)? GEO nào CPI hợp lý so với eCPM của GEO đó? |
| AdMob | eCPM theo **top GEO** và format; imps/AU (ad load); ARPDAU; doanh thu theo ad unit | GEO mua user có eCPM đủ bù CPI không? Ad unit nào đóng góp chính? |
| Firebase | Retention D1/D7 theo **nguồn traffic** (Google Ads vs organic); `app_remove` theo tuần; engagement time | User UA có retention kém hẳn organic không? Uninstall có tăng sau khi đổi ad load? |
| Chéo | **ROAS D7 cohort**, LTV D7, ước tính payback | ROAS D7 hiện tại so với mức cần để hoàn vốn ở D30/D90/D180 (đường cong của app) |

Hành động điển hình: chuyển/khởi tạo tROAS, cắt GEO lỗ rõ, chỉnh ad load/placement, làm creative mới theo asset Best.

## Mốc 4 tháng: "Đường cong LTV và scale"

Mục tiêu: có ROAS D30/D60/D90 thật cho nhiều cohort, nên dựng được **đường cong LTV** của app theo GEO.

| Nguồn | Xem gì | Câu hỏi |
|---|---|---|
| Google Ads | ROAS theo cohort tháng, chi phí biên khi tăng budget (CPI tăng bao nhiêu khi scale), hiệu quả từng ad group | Scale budget có giữ được ROAS không? Ad group nào nên nhân bản chủ đề? |
| AdMob | Xu hướng eCPM theo tháng/mùa vụ, mix format, hiệu quả mediation (nếu dùng) | eCPM giảm do mùa vụ hay do mix GEO? |
| Firebase | Retention D30, D60; cohort theo app version | Version mới cải thiện hay làm xấu retention/crash? |
| Chéo | ROAS D90 thực tế so với dự báo ở mốc 1 tháng | Hệ số D7 → D90 của app là bao nhiêu? (đây là con số **riêng của app**, dùng cho các quyết định sau) |

Hành động điển hình: chốt target ROAS theo hệ số D7→D90 của app, mở GEO mới, thêm ad group, cân nhắc MMP nếu mở kênh khác ([mmp-tong-quan](../04-measurement/mmp-tong-quan.md)).

## Mốc 6 tháng: "Payback và quyết định chiến lược"

| Nguồn | Xem gì | Câu hỏi |
|---|---|---|
| Google Ads | Tổng chi, ROAS cộng dồn theo cohort tháng, payback thực tế | Cohort nào đã hoàn vốn, mất bao nhiêu ngày? |
| AdMob | Doanh thu thật (đã đối soát) so với estimated; xu hướng ARPDAU | Doanh thu ước tính có lệch so với thực nhận không? |
| Firebase | Retention D90+, DAU từ UA so với organic, crash/ANR dài hạn | App có giữ được user lâu dài không? |
| Chéo | **LTV D180 so với CPI** theo GEO; ROAS D180 | Có tiếp tục/scale/dừng app này không? Phân bổ ngân sách giữa các GEO/app? |

Hành động: ghi quyết định vào `decisions/`, cập nhật `apps/<app>/profile.md` với LTV curve và target đã chốt.

## Mẫu ghi nhận mỗi mốc (copy vào `lessons/YYYY-MM-<app>-<moc>.md`)

```
App / GEO / campaign / ad group:
Khoảng ngày cohort:            Ngày đọc:
Google Ads: cost, installs, CPI, CR, ROAS (conv. value/cost):
AdMob: requests, match rate, show rate, impressions, eCPM, imps/AU, top GEO, ad unit chính:
Firebase: first_open, D1/D7/D30 retention, app_remove, crash-free %:
ROAS cohort D0/D7/D30:
Thay đổi đã làm trong kỳ (ngày, nội dung):
Kết luận + việc tiếp theo:
```

## Bổ sung (bổ sung 2026-10-14 từ AI Knownledge, chưa duyệt)

- Ngoài đọc theo mốc thời gian campaign, khi app ra **version mới** hãy so 2 version theo ngưỡng nội bộ Apero (P0/P1: R1 −5pp, churn D0 +10pp, LTV D7 −20%, match rate < 50%…) trước khi tăng rollout: [hậu kiểm version app](hau-kiem-version-app-nguong-verdict.md). Các ngưỡng này là quy ước nội bộ, có thể dùng làm điểm khởi đầu cho các ô ngưỡng đang để trống ở trên.
- Ghi lại **phase Remote Config** đang chạy (build/normal/2-floor) và ngày đổi phase — đổi phase làm đổi eCPM/ARPDAU, nếu không ghi sẽ đọc sai trước/sau ([Remote Config theo phase](../03-monetization/remote-config-ads-theo-phase-build-normal-2floor.md)).
