---
title: Artimind (IIP032) — ghi chú sản phẩm từ skill của PO (định vị, feature, paywall, remote config, rollout)
type: app-profile
topic: apps/artimind
tags: [artimind, app-profile, ai-photo, ai-video, subscription, paywall, remote-config, rollout]
app: artimind
status: verified
confidence: low
sources:
  - AI Knownledge/APR-046 - Product/skills/artimind-product-thinking/SKILL.md (đọc 2026-10-14)
  - AI Knownledge/APR-046 - Product/skills/artimind-research-testing/SKILL.md (đọc 2026-10-14)
  - AI Knownledge/APR-046 - Product/skills/artimind-ux-design/SKILL.md, artimind-ui-design/SKILL.md (đọc 2026-10-14)
  - AI Knownledge/APR-046 - Product/skills/apero-vision-lab-docs/SKILL.md, iip032-artimind.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 06-tools/product-skills-artimind-vision-lab.md
  - 03-monetization/paywall-subscription-checklist-policy.md
  - 01-pre-marketing/nghien-cuu-trend-cho-creative.md
summary: Artimind — app AI photo→video của Apero (Vision Lab, IIP032), subscription; định vị "Life Moments" (kỷ niệm, người thân đã mất), engine Seedance qua fal.ai, paywall sau khi user bấm Generate, rollout qua remote config.
---

# Artimind (IIP032) — ghi chú sản phẩm

> App **không** do repo này quản lý UA. Ghi lại vì là app AI ảnh/video flagship cùng công ty: tham chiếu khi làm creative/paywall/rollout cho app AI tương tự. Mọi thông tin lấy từ skill viết khoảng 06/2026, chưa đối chiếu với store hay dashboard.

## Tổng quan
| Mục | Giá trị | Nguồn / độ chắc |
|---|---|---|
| Mã dự án | IIP032 (alias cũ AIP131 — không dùng) | iip032-artimind.md |
| Loại | AI Art Generator → AI photo & video studio | iip032-artimind.md; product-thinking §0 |
| Nền tảng | iip032-artimind.md ghi **iOS, Android, Web**; product-thinking ghi "cho iOS"; UI skill chỉ có token iOS (SwiftUI, iOS 26 Liquid Glass) | Mâu thuẫn — có thể bản v5 mới tập trung iOS. Chưa xác nhận. |
| Monetization | Subscription (RevenueCat), có cấu hình mediation ads (`enable_cpn_feature`) | product-thinking §3, §5 |
| Version | ≥ 5.4.0 (iip032-artimind.md); skill nhắc tới v5.7.0 AI Album, v5.8.0 Wedding Tribute | |
| Brand color | `#810913` (đỏ, chỉ dùng ở 3 bề mặt; tab chọn dùng xanh iOS) | iip032-artimind.md; ui-design |
| AI engine | Seedance 1.5 / 2.0 (ByteDance, gọi qua fal.ai); voice clone + lip-sync bằng Seedance 2.0 | product-thinking §0 |
| Đo lường | Có nhắc Mixpanel ("chờ data từ Mixpanel sau 2 tuần soft-launch") và GA4 cho landing page | product-thinking §1; iip032-artimind.md §9 |

## Định vị và feature
- Tagline "**Bring memories alive**", khu trung tâm là tab Home "**Life Moments**". Tiêu chí: feature phải trả lời "giúp user kể khoảnh khắc cảm xúc nào?" — không trả lời được thì đẩy sang app khác.
- User chính: phổ thông, cảm xúc cao (đám cưới, người thân đã mất, gia đình, kỷ niệm), không phải creator.
- Feature đang có: **AI Loved Ones** (làm sống lại người thân đã mất, voice clone + lip-sync), **AI Album** (video 6 cảnh từ 2 ảnh theo theme Romance/Family/Friendship/Adventure/Memory/Dream), **AI Photo Restore** (Free To Try, tô màu ảnh đen trắng, xoá vết xước), **Wedding Tribute Video** (v5.8.0, người thân đã mất "phát biểu" ở đám cưới), AI Companion (v5.0.0).
- Pattern chung: input là **ảnh người thân** + (audio | theme | text) → output **video ngắn 5–15s** có cảm xúc, để share. Output > 30s bị coi là anti-pattern (khó share, Seedance chậm và tốn).
- Chỉ hỗ trợ script **tiếng Anh** cho voice clone (trộn ngôn ngữ thì fail).
- Tab bar tối đa 5: Home / Moments / Loved Ones / Restore / Profile.

Gợi ý cho UA/creative (nhận định người viết, chưa kiểm chứng): các theme trên là angle creative sẵn có cho app AI ảnh/video — kỷ niệm người thân, đám cưới, phục chế ảnh cũ. Cần soát policy với nội dung "người đã mất" và deepfake giọng nói ([policy app AI ảnh](../../01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md)).

## Quy tắc paywall / gating (convention của team)
- Free user **luôn vào được entry**; gate ở bước **Generate** (sau khi chọn theme + upload đủ ảnh). Gate sớm bị coi là giảm reach và payrate.
- Mặc định **mid-flow paywall** cho mọi feature tốn chi phí AI; soft paywall cho feature phụ; **last-chance paywall** (ưu đãi 1 lần) khi user huỷ paywall lần đầu.
- Mua sub xong → tự tiếp tục Generate, **giữ nguyên state** (theme, ảnh, script).
- Pro user không bao giờ có watermark.
- Đây là quy ước sản phẩm, skill **không kèm số liệu** chứng minh payrate tốt hơn.

## Remote config & rollout
- Tên key: `show_NNN_<screen>` (bật/tắt màn theo số), `show_NNN_<feature>_paywall`, `enable_<feature>_feature`/`enable_{feature}_screen`, `content_benefit_subscription` (JSON nội dung paywall), `content_card_list_*` (card trên Home), `roll_back_version` (hot fix).
- Feature mới ship với config = `false`; BA bật trong checklist **Pre-Rollout** trước go-live.
- Rollout 4 stage: dark launch (off 100%) → internal (segment nội bộ) → soft launch A/B 80/20 → full. Theo dõi mỗi stage: funnel entry → upload → generate → result, payrate sau paywall, share rate, crash rate, D1/D7 của nhóm thử so control. Metric xấu ở stage 3 → rollback về `false`.
- Pre-Rollout checklist mỗi version: remote config, mediation, store descriptions (JSON card), CMS template, RevenueCat paywall default, checklist task Product/BD/ASO/Partner/Dev/Test.

## Kiểm output AI trước khi ship (ngưỡng nội bộ)
Có face trên output (≥ 1), không watermark cho Pro, đúng tỉ lệ khung, đúng độ dài (±2s), frame đầu decode được, lip-sync chấp nhận được ở ≥ 70% mẫu (review tay 5–10 mẫu). Đây là ngưỡng do team đặt, không phải chuẩn ngành.

## Chưa có
Số liệu thật (installs, CPI, payrate, retention, doanh thu), package name/bundle ID, store link. Confluence page ID có trong skill nhưng không chép (tài liệu nội bộ, cần quyền Confluence).
