---
title: Bộ skill Product của Artimind / Vision Lab — viết doc Confluence VL, product thinking, AC & pre-rollout, UX/UI
type: reference
topic: 06-tools
tags: [tool, skill, product-owner, artimind, confluence, acceptance-criteria, remote-config, paywall, ux, ui]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-046 - Product/_info.md, README.md, _metadata.json (đọc 2026-10-14)
  - AI Knownledge/APR-046 - Product/skills/{apero-vision-lab-docs (SKILL.md, iip032-artimind.md), artimind-product-thinking, artimind-research-testing, artimind-ux-design, artimind-ui-design}/SKILL.md + should-do/shouldnt-do/assumptions/permissions.yaml/CHANGELOG (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 06-tools/prd-to-visual-wireframe-so-do.md
  - 03-monetization/paywall-subscription-checklist-policy.md
  - 03-monetization/remote-config-ads-theo-phase-build-normal-2floor.md
  - 06-tools/ios-revenuecat-paywall-skill.md
  - apps/artimind/profile.md
summary: Skill Claude của PO Thịnh Đào Đức cho Apero Vision Lab — viết doc Confluence space VL (IIP###, release-page Artimind), frame feature, viết AC Given/When/Then + pre-rollout, UX flow của Artimind.
---

# Bộ skill Product — Artimind / Vision Lab

## Làm gì
5 skill phương pháp làm product của team Vision Lab, viết quanh app **Artimind (IIP032)**:

| Skill | Làm gì |
|---|---|
| `apero-vision-lab-docs` | Viết doc Confluence space **VL** đúng chuẩn: project mới (IIP068+) theo 4 trang Overview / PRD / SRD / Meeting Note; Artimind theo kiểu **1 page mỗi release** (`IIP032 - Ver X.Y.Z - <mục tiêu kinh doanh>`). Đánh số màn 3 chữ số (1xx splash/onboarding, 2xx paywall, 3xx home, 4xx core flow…), scenario Given/When/Then, bảng Stakeholder (BA/PO/MO/PD/Dev/Test). File phụ `iip032-artimind.md` cho pattern release của Artimind. |
| `artimind-product-thinking` | Frame feature mới: bảng Problem / Solution / Target Metrics (persona cụ thể, engine AI, ≥1 chỉ số chuyển đổi + ≥1 chỉ số chất lượng), chọn entry point (tab / card Life Moments / tag / menu "+"), chỗ đặt paywall, remote config cần có, anti-pattern để phản biện. |
| `artimind-research-testing` | Viết AC và test scenario, checklist phủ nhánh (entry, input, validation, paywall, processing, lỗi, result, permission, toast), bảng **Pre-Rollout** (remote config / mediation / CMS / RevenueCat / checklist từng team), rollout theo remote config 4 stage, AT workflow, mẫu bug report. |
| `artimind-ux-design` | Khung flow chung cho feature generate AI: Entry → Picker → Input wizard → Paywall → Validate → Process (timeline) → Result (Save/Share/Recreate), lỗi → về Home, Live Activity cho job chạy nền. |
| `artimind-ui-design` *(không cài — dành cho designer)* | Token UI production của Artimind iOS (`ArtimindDS`: màu, typography, spacing, radius), Liquid Glass iOS 26, SF Symbols, hierarchy nút, pattern card. |

Mỗi skill có kèm `should-do.md`, `shouldnt-do.md`, `assumptions.md`, `permissions.yaml`, `CHANGELOG.md` — **toàn bộ là scaffold rỗng** tự sinh bởi "skill-audit" ngày 2026-06-15 (owner TBD). Bản cài vào repo đã bỏ các file này.

## Dùng ở bước nào
- Chủ yếu cho **PO/BA/Designer**, không phải UA. Với repo này, giá trị nằm ở:
  - **Viết spec feature/release** cho app mình theo chuẩn công ty (đặc biệt bảng Pre-Rollout liệt kê remote config + mediation + checklist ASO/BD). Khớp với [Remote Config ads theo phase](../03-monetization/remote-config-ads-theo-phase-build-normal-2floor.md).
  - **Rollout feature qua remote config** (off 100% → internal → 20% A/B → 100%) và các metric phải theo dõi ở mỗi stage.
  - **Insight sản phẩm Artimind** (định vị "Life Moments", paywall sau khi user đã thể hiện ý định) — xem [ghi chú Artimind](../apps/artimind/profile.md).
- `artimind-ui-design` / `artimind-ux-design` gắn chặt iOS/SwiftUI của Artimind — gần như không áp dụng cho app Android ads-only như Home Morph.

## Cách gọi trong repo này
Skill cài tại `.claude/skills/<tên>/`: `apero-vision-lab-docs`, `artimind-product-thinking`, `artimind-research-testing`, `artimind-ux-design` (bỏ `artimind-ui-design` — Figma/token UI, việc của designer).
- "Viết spec/PRD theo chuẩn Vision Lab cho feature X" → `apero-vision-lab-docs`.
- "Feature X có nên làm không / đặt ở đâu / cần remote config gì" → `artimind-product-thinking`.
- "Viết AC / Given-When-Then / pre-rollout checklist" → `artimind-research-testing`.
- `apero-vision-lab-docs` gọi tool `confluence_search` / `confluence_get_page` để tra trùng và đối chiếu page mẫu — cần MCP Confluence nội bộ (`confluence.apero.vn`, <cần tài khoản Confluence Apero>). Không có MCP thì skill vẫn dựng được khung, chỉ bỏ bước tra trùng.

## Giới hạn
- Các skill đều gắn với **Artimind / iOS / subscription**; số màn, key remote config (`show_NNN_<screen>`, `enable_<feature>_feature`, `cpn_*`) là convention riêng của IIP032, không phải chuẩn chung.
- Frontmatter có các trường `sot_id`, `app`, `po`, `aarrr_stage`, `features_touched` = `TBD` (không ảnh hưởng chạy).
- ⚠️ `apero-vision-lab-docs/iip032-artimind.md` dòng 226 chứa **tài khoản đăng nhập dạng plaintext** (để tải file trên trang "Artimind Rollout History"). Bản cài vào repo đã xoá giá trị; credential lưu ở kho nội bộ [🔑 credential](../../media/secrets/apr-046-artimind-rollout-history-login.md) (ngoài git). Nên báo owner đổi mật khẩu.

## Nguồn / owner
- Owner: **Thịnh Đào Đức** (ThinhDD, PO). APR-046, hub #56, verified 2026-07-01. Import từ nhánh `claude/import-local-skills-2026-06-03`.
- README ghi đây là "promote-to-shared candidates" — tác giả 1 PO nhưng phương pháp dùng chung cho team.
- Vị trí: `AI Knownledge/APR-046 - Product/skills/`. Kèm 2 ảnh output (`image output.png`, `image output 2.png`) chưa xem.
