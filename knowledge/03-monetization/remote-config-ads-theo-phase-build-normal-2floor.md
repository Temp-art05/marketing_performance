---
title: Remote Config bật/tắt ads theo phase — build, normal, 2-floor (template nội bộ Apero)
type: reference
topic: 03-monetization
tags: [remote-config, firebase, high-floor, 2-floor, ad-placement, splash, onboarding, lfo]
app: general
status: draft
confidence: medium
sources:
  - "AI Knownledge/APR-007 - Update remote config hàng loạt cho ver 1.0.0 sử dụng mcp firebase/Trận AI firebase.zip → Auto test Ads - Template - Remote Config.csv (đọc 2026-10-14)"
  - "AI Knownledge/APR-007 - Update remote config hàng loạt cho ver 1.0.0 sử dụng mcp firebase/Trận AI firebase.zip → GUIDELINE.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-092 - Skill gen Q&A và Testcase từ tài liệu đặc tả/Skill gen testcase/vanptu-skill-gen-testcase.md — § ADS CHECKLIST (mô hình primary/2ID) (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 03-monetization/admob-co-ban.md
  - 03-monetization/mediation-admob-vs-applovin-max.md
  - 06-tools/firebase-remote-config-mcp-rc-apply.md
  - 03-monetization/quy-tac-dat-quang-cao-in-app-apero.md
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
  - 03-monetization/paywall-subscription-checklist-policy.md
  - 04-measurement/firebase-events-cho-ua.md
  - 05-optimization/doc-chi-so-theo-moc-thoi-gian.md
summary: Bộ ~50 key Remote Config chuẩn của Apero điều khiển ad ở Splash, Language (LFO), Onboarding, Resume, Home theo 3 phase — build (tắt ads), normal (ads thường), 2-floor (thêm high-floor, phase chạy UA).
---

# Remote Config bật/tắt ads theo phase — build / normal / 2-floor

## Bối cảnh

Tài liệu nội bộ của PO Lê Trọng Đạt (asset APR-007, Apero Knowledge Hub, 07/2026) dùng một file CSV chung cho nhiều app có **cùng kịch bản LFO** (Language → Onboarding flow) để đổi hàng loạt Remote Config khi nhiều sản phẩm release cùng lúc. Ví dụ dự án áp dụng: `aap869-ai-photo-video`, `aap866-paint-by-number`, `insta-clone-4da1b`.

Đây là **template của một team**, không phải chuẩn Google. Tên key cụ thể phụ thuộc thư viện ads nội bộ của app. App mới phải đối chiếu với key thật trong Firebase của nó. Key app không có thì công cụ bỏ qua.

## 3 phase

| Phase | Cột trong CSV | Ý nghĩa | Khi nào dùng |
|---|---|---|---|
| `build` | Value mặc định (Build app) | Tắt gần như mọi ad (chỉ giữ cờ bật flow LFO/onboarding/resume) | Lúc build, review store, test |
| `normal` | Value bật ads thường, tắt ads 2 floor | Bật ad thường ở mọi vị trí, **tắt** các ad unit high-floor | Giai đoạn chưa chạy UA mạnh, hoặc khi high-floor làm giảm fill |
| `twofloor` | Value bật ads 2 floor | Bật cả ad thường lẫn ad **high-floor (hf / 2ID)** | "Phase chạy UA": tối đa doanh thu/impression |

> **`2ID`** — đã có mô tả trong spec QA Apero (APR-092, xem [quy tắc đặt quảng cáo — mô hình primary/2ID](quy-tac-dat-quang-cao-in-app-apero.md)): mỗi placement có ad unit `primary` và ad unit thứ hai `2ID` (high floor); bật cả hai thì **load 2ID trước, fail thì fallback về primary**; tắt primary thì không load gì. *Vẫn là suy luận*: tiền tố `fo_` = first open; `hf` = high floor (cụm key `fo_hf_*` có vẻ là cách đặt tên khác của cùng ý tưởng 2ID cho luồng first open). Cần dev xác nhận logic trong SDK nội bộ (đã đặt mốc theo dõi).

## Danh sách key theo vị trí (rút gọn từ CSV)

| Cụm | Key chính | build → normal → 2-floor |
|---|---|---|
| **Splash** | `fo_banner_splash`, `fo_inter_splash` | false → true → true |
| | `fo_hf_banner_splash`, `fo_hf_inter_splash` | false → false → true |
| | `fo_logic_ad_launcher` (`only_in` / `in_then_na` / `na_then_in` / `only_na`) | only_in → only_in → **in_then_na** |
| | `fo_logic_inter_splash_inc_impression`, `logic_na_fu_alt` | false → false → true |
| | `fo_timeout_ad_splash_normal`, `fo_timeout_ad_splash_2id` | 60 (cả 3 phase) |
| | `fo_countdown_na_launcher` / `_alt` | 10 / 5 |
| **Language (LFO)** | `fo_native_language_1`, `fo_native_language_2` | false → true → true |
| | `fo_hf_native_language_1/2` | false → false → true |
| | `fo_enable_lfo` | true (luôn bật flow) |
| | `fo_na_fu_af_02` (native full-screen sau màn chọn ngôn ngữ) / `_2ID` | false → true → true / chỉ 2-floor |
| **Onboarding** | `fo_native_onboarding1/3`, `fo_native_full_scr1/2` | false → true → true |
| | `fo_hf_native_onboarding1/3`, `fo_hf_native_full_scr1/2` | false → false → true |
| | `fo_ui_native_full_ob1/2` (`na_inter_3` / `na_inter_2` / `na_inter`) | na_inter_3 → na_inter_2 → na_inter_2 |
| | `native_full_obd1_coundown` / `obd2` | 30 |
| | `fo_native_onboarding2` + hf | false ở mọi phase (màn 2 không đặt ad) |
| | `fo_na_fu_af_033` / `_2ID` (sau onboarding) | false → true → true / chỉ 2-floor |
| | `*_resist_meta` (`full_layout_admob` / `full_layout_meta` / `meta_only`) | full_layout_admob |
| **Resume (mở lại app)** | `enable_resume` | true |
| | `resume_type` (`resume` / `na_fu`) | resume → resume → **na_fu** |
| | `resume_2ID` | false → false → true |
| **Home** | `banner_all` | false → true → true |
| | `banner_all_2ID` | false → false → true |

Viết tắt trong key (suy luận theo ngữ cảnh): `na` = native ad, `in`/`inter` = interstitial, `fu`/`full_scr` = native full-screen, `af` = after, `ob`/`obd` = onboarding.

## Điều rút ra cho UA / monetization

- Cùng một app có thể có **ARPDAU/eCPM rất khác nhau** tùy phase Remote Config đang bật. Khi đọc ROAS/ARPDAU (xem [đọc chỉ số theo mốc](../05-optimization/doc-chi-so-theo-moc-thoi-gian.md)), ghi lại **phase nào đang chạy** và **ngày đổi phase**. Nếu không, so sánh trước/sau sẽ sai.
- Phase 2-floor dồn nhiều ad vào **first-open flow** (splash → language → onboarding). Flow này tác động trực tiếp tới retention D0/D1 và trải nghiệm review store. Theo dõi retention và review 1–2★ nhắc "too many ads" sau khi bật (xem [trả lời review Google Play](../01-pre-marketing/tra-loi-review-google-play.md)).
- ⚠️ **`fo_inter_splash` (interstitial ở splash) xung đột với AdMob policy 6201362**: *"Do not place interstitial ads on app load"* — Google khuyên dùng App open ad khi mở app (xem [AdMob cơ bản](admob-co-ban.md) và mục ⚠️ trong [quy tắc đặt quảng cáo](quy-tac-dat-quang-cao-in-app-apero.md)). Template bật key này ở cả phase normal và 2-floor; chưa rõ Apero có xác nhận riêng với Google hay chấp nhận rủi ro. Countdown/timeout trong bảng là tham số UX, không phải ngưỡng policy.
- Đổi phase = đổi doanh thu. Nên coi mỗi lần đổi như một thay đổi campaign: ghi vào `apps/<app>/campaigns.md` và đặt mốc theo dõi 7 ngày.

## Việc tiếp theo

- Xin dev xác nhận ý nghĩa `hf`/`2ID` và thứ tự gọi ad unit (high-floor → thường).
- Khi có app chạy thật: ghi eCPM/ARPDAU trước/sau khi chuyển `normal → twofloor` vào `lessons/`.
