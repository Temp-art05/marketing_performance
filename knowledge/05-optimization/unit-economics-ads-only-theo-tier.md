---
title: Unit economics cho app ads-only theo tier GEO (công thức hoà vốn D0)
type: concept
topic: 05-optimization
tags: [unit-economics, ads-only, tier, d0-roas, ecpm, cpi, ltv, geo]
app: general
status: verified
confidence: low
sources:
  - "session 2026-09-17→18 (als001 def570ce): Claude dựng công thức + bảng ước lượng cho Home Morph"
  - "RevenueLab — AdMob eCPM Benchmarks 2026: Rewarded, Interstitial, Banner (https://www.revenuelab.fyi/blog/admob-ecpm-benchmarks-2026), trích qua WebFetch trong session 2026-09-17, chưa kiểm lại"
  - "Mapendo — 2025 Cost per Install by Country (https://mapendo.co/blog/cost-per-install-by-country-2025), trích trong session 2026-09-17"
  - "Khoá UA Marketing Mobile App 2026 (Quocmedia, Quốc Anh), bài 4.6 — video quay ~13/12/2024 (màn hình Google Ads tới 13/12/2024, Firebase tới 10–11/12/2024), transcribe 2026-10-15"
created: 2026-10-14
updated: 2026-10-20
related:
  - 00-overview/glossary-chi-so.md
  - decisions/2026-09-home-morph-geo-ua-ads-only.md
  - 02-ua-channels/google-ads/geo-va-ngon-ngu-targeting.md
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
  - 01-pre-marketing/market-research-tam-sam-som-go-no-go.md
  - playbooks/van-hanh-va-scale-troas-google-app-campaign.md
  - lessons/2024-12-quocmedia-demo-troas-60-ket-qua-ad-group-geo.md
summary: Công thức quyết định GEO cho app thuần ads (imps cần ở D0 = CPI × D0 ROAS target / eCPM×1000), các bẫy khi so ROAS D0/D7 với lifetime, và benchmark eCPM theo tier của bên thứ ba (độ tin thấp).
---

# Unit economics cho app ads-only theo tier GEO

## Bối cảnh

Rút từ session lên chiến lược GEO cho Home Morph (09/2026). **Công thức là toán học, dùng được chung. Mọi con số là benchmark bên thứ ba hoặc ước lượng của Claude trong session — không phải data thật**, và Claude đã tự sửa số nhiều lần trong session. Có số thật của app thì thay vào.

## Công thức

```
LTV_Dn  = Σ_format (impressions_format đến ngày n × eCPM_format / 1000)
ROAS_Dn = LTV_Dn / CPI

Imps/user cần để hoà vốn (lifetime)  = CPI / (blended eCPM / 1000)
Imps cần ở D0 để đạt D0 ROAS target  = CPI × D0_ROAS_target / (blended eCPM / 1000)
```

"Blended eCPM" = trung bình có trọng số của mọi format (rewarded, inter, app-open, native, banner) theo tỉ lệ impression thật, không phải eCPM rewarded.

Ý chính: **CPI đắt ở đâu thì eCPM cũng cao ở đó**, nên câu hỏi không phải "tier nào lời" mà là "app nhồi được bao nhiêu impression/user (đặc biệt ở D0) mà không phá UX". Tier 1 đòi số impression ở D0 cao gấp nhiều lần T2/T3.

Ví dụ minh hoạ (giả định của session, không phải số đo): T1 CPI $1,5, blended eCPM $8, D0 target 25% → 1,5 × 0,25 / 0,008 ≈ **47 imps ở D0**; T3 CPI $0,05, eCPM $1,2 → ≈ **10 imps**.

## Bẫy khi đọc ROAS

- "ROAS 25%" trong UA mobile thường là **ROAS sớm (D0 hoặc D7)**, không phải lifetime. Đừng so ROAS D0/D7 với ngưỡng 100%.
- Hệ số nhân D0 → D180 phụ thuộc retention của từng app. Session đưa ra đường cong "điển hình" cho app ads (D0 ≈ 15–25% của LTV D180) nhưng **không có nguồn** — phải đo bằng cohort thật. Xem [glossary](../00-overview/glossary-chi-so.md) mục ROAS.
- (bổ sung 2026-10-15 từ khoá Quocmedia bài 4.6) ⚠️ Khoá Quocmedia coi *All conv. value / cost* của Google Ads **≥ 1,0 (hoặc 0,9) là hoà vốn**. Value đó là doanh thu `ad_impression` trong conversion window khoá đặt **7 ngày** → là ROAS ~D7 attributed, không phải lifetime. Dùng 1,0 làm ranh giới lãi/lỗ là quá khắt khe nếu retention tốt, và vô nghĩa nếu app bị gỡ nhanh (case demo ~93% user gỡ). Hoà vốn thật = LTV cohort / CPI ([lesson](../lessons/2024-12-quocmedia-demo-troas-60-ket-qua-ad-group-geo.md)).
- CPI trung bình toàn cầu trong các bài blog ($2,5–4) bị kéo bởi game và Tier 1 → không dùng để tính Tier 3.
- Organic uplift (paid kéo thêm organic) làm CPI hiệu dụng thấp hơn CPI báo cáo — session ước organic/paid 0,8–1,5× cho app utility, **không có nguồn**.

## Benchmark eCPM AdMob theo tier (bên thứ ba, độ tin thấp)

RevenueLab "AdMob eCPM Benchmarks 2026", trích trong session 2026-09-17 (không kiểm lại, không rõ phương pháp):

| Format | T1 (US, CA, UK, AU, DE, JP) | T2 (FR, IT, ES, KR, PL, SA, AE) | T3 (IN, ID, BR, PH, NG, PK, VN) |
|---|---|---|---|
| Rewarded | $14–22 | $8–10 | $2–3 |
| Interstitial | $9–14 | $5–7 | $1–2 |
| App-open | $4–8 | $2,5–4 | $0,6–1,2 |
| Native | $3–5 | $1,5–2,5 | $0,4–0,8 |
| Adaptive banner | $0,4–0,8 | $0,22–0,35 | $0,08–0,14 |

CPI theo vùng (Mapendo 2025, không tách Android/iOS theo nước): North America $2,5–5; EMEA $2–4; APAC $1,5–3; LATAM $0,5–2.

Số CPI theo từng nước Tier 3 mà Claude đưa ra trong session (vd India $0,03–0,08) **không có nguồn** — bỏ qua cho tới khi có data thật. Số thật đầu tiên có: Google gợi ý CPI điển hình **₫2.125 (~$0,08)** cho bộ Indonesia + Philippines + Vietnam, ngày 18/09/2026 ([campaigns Home Morph](../apps/home-morph/campaigns.md)).

## Đòn bẩy (nhận định, chưa kiểm chứng)

- Tăng ad density ở session đầu (rewarded cho download HD / bỏ watermark / tạo biến thể, app-open khi resume, native trong grid) — tăng LTV mà không tốn tiền UA. Phải tuân policy ad placement (xem [admob-co-ban](../03-monetization/admob-co-ban.md)).
- Retention: app tần suất thấp cần lý do quay lại (nhiều phòng, credit hằng ngày, style mới).
- IAP/subscription là thứ mở khoá paid UA ở Tier 1.

## App có chi phí AI theo lượt dùng (bổ sung 2026-10-20, case Remoria)

Với app chat AI / gen ảnh, mỗi lượt dùng tốn tiền API, nên retention cao **không tự động** thành lãi khi kiếm tiền bằng ads:

```
Lãi gộp / tin nhắn = (imps / tin nhắn × eCPM / 1000) − chi phí LLM / tin nhắn
LTV ròng = Σ tin nhắn × lãi gộp / tin nhắn  (+ rewarded/gen ảnh tính riêng)
```

Ước lượng của Claude 2026-10-20 (không phải số đo; giá OpenAI theo hiểu biết của Claude, cần kiểm lại; giả định ~3.000 token input gồm persona + lịch sử, ~150 token output):
- gpt-4o-mini ($0,15/$0,60 per 1M token) ≈ **$0,0005/tin**; gpt-4.1-mini ($0,40/$1,60) ≈ **$0,0014/tin**.
- 1 interstitial Tier 3 (eCPM $1–2 theo bảng trên) ≈ $0,0015 → chỉ đủ bù ~3 tin gpt-4o-mini. Inter mỗi 8 tin ở Tier 3 thì **lỗ trên mỗi tin**; ở Tier 1 (eCPM $9–14) thì có lãi.
- Hệ quả: app ads-mainly có LLM phải (1) dùng model rẻ + rút gọn context, (2) giới hạn tin free/ngày và cho rewarded để mở thêm, (3) chọn GEO theo eCPM chứ không chỉ theo CPI. Xem [Remoria](../apps/remoria/profile.md).

## Việc tiếp theo

- Thay bảng benchmark bằng eCPM theo country/format từ AdMob và D0/D7 ROAS thật khi Home Morph có ≥ 7 ngày data.

## Ghi chú về bảng tier (bổ sung 2026-10-14 từ AI Knownledge)

"Tier" trong bài này là cách chia theo eCPM/CPI để quyết định GEO. Báo cáo nội bộ Apero dùng một bảng tier khác (cho ngưỡng "đủ số" khi so version; ID/PH/PT ở Tier 2, VN/IN ở Tier 3) — xem [hậu kiểm version app](hau-kiem-version-app-nguong-verdict.md). Không trộn hai bảng.
