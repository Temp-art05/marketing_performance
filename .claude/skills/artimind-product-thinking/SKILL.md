---
name: artimind-product-thinking
description: "Frame and pitch new features for Artimind (IIP032). Use when the user\
  \ asks to brainstorm a feature, write the Problem/Solution/Target Metrics row, decide\
  \ free-vs-pro gating, pick an entry point (tab vs card), or critique a feature proposal.\
  \ Covers the AI-first photo\u2192video product strategy, Life Moments positioning,\
  \ and how monetization, retention, and remote-config gating interact."
sot_id: TBD
app: TBD
po: TBD
aarrr_stage: TBD
features_touched: TBD
---

<!-- Nguồn: AI Knownledge APR-046 Product, owner Thịnh Đào Đức, nhập 2026-10-14 -->
# Artimind — Product Thinking

Skill này gói lại cách nghĩ về sản phẩm khi build/iterate Artimind: làm sao chọn feature đáng làm, định vị nó trong app, viết Problem/Solution/Metrics cho doc IIP032, và quyết định gating/paywall.

## 0. Bối cảnh sản phẩm (đọc trước)

- **App**: Artimind — AI photo & video studio cho iOS, dark theme, premium positioning.
- **Doc model**: 1 page/release version trên Confluence VL (`IIP032 - Ver X.Y.Z - [Feature Name]`). Mỗi version = 1 feature lớn hoặc 1 cụm feature đi cùng nhau.
- **Home tab "Life Moments"** là khu trung tâm. Mọi feature mới mặc định land vào đây dưới dạng card, chỉ replace tab khi có lý do giữ chân (tabs hiện đã full: Home / Moments / Loved Ones / Restore / Profile).
- **Stack AI**: Seedance 1.5 / 2.0 (ByteDance qua fal.ai) là engine sinh video chính. Voice clone + lip-sync làm bằng Seedance 2.0.
- **Người dùng chính**: Phổ thông, cảm xúc cao (đám cưới, người thân đã mất, gia đình, kỷ niệm). Không phải creator chuyên nghiệp.

## 1. Khung viết Problem/Solution/Target Metrics

Mọi page IIP032 version đều mở đầu bằng bảng này. Viết đúng = cả team đọc xong là hiểu vì sao build:

```
| Problem | Solution | Target Metrics |
| --- | --- | --- |
| [Insight cụ thể về 1 group user — kèm trigger cảm xúc / sự kiện thật] | [Tính năng + AI engine + flow tóm tắt] | [Số đo: payrate, retention, completion rate, share rate] |
```

**Rules:**
- **Problem** phải đặt được tên cho 1 user persona thật. Ví dụ tốt: *"Người dùng có người thân đã mất muốn tạo video tribute cho ngày cưới."* Ví dụ tệ: *"Người dùng muốn tạo video AI."* (quá rộng).
- **Solution** nêu rõ engine (Seedance 1.5/2.0), số scene, có lip-sync hay không, flow điểm đầu → cuối (5-7 bước).
- **Target Metrics** ít nhất 1 chỉ số chuyển đổi (payrate / sub conversion) + 1 chỉ số chất lượng (completion rate / retention D7 / share rate). Không để trống ở giai đoạn pitch.
- Nếu chưa có số → ghi *italic placeholder*: *"Chờ data từ Mixpanel sau 2 tuần soft-launch."*

## 2. Cách quyết định entry point

Sau khi có Problem/Solution, câu hỏi luôn tiếp theo là *"đặt feature ở đâu?"*. 4 placement options theo độ ưu tiên:

| Placement | Khi nào dùng | Trade-off |
| --- | --- | --- |
| **Tab mới** | Feature là pillar dài hạn, retention driver, có >3 sub-screens | Tốn slot tab (nav full); cần replace tab cũ hoặc redesign nav |
| **Card trong Life Moments section** (Home) | Feature là 1 flow độc lập, có entry rõ ràng, thumbnail/preview hấp dẫn | Mặc định cho feature v5.X.0; ít rủi ro |
| **Tag mới trong Moments tab** | Feature là template-based (Wedding, Birthday…), share UI với template hiện có | Phải có ≥3 template để tag không loãng |
| **Floating "+" creation menu** | Feature là creation primitive cross-cutting, không thuộc 1 cụm nào | Hạn chế dùng — gây nhiễu chính card-based |

**Hard rule**: Free user phải vào được entry, gate ở generate step (không gate ở entry). Đây là pattern Artimind, đừng phá vỡ — gate sớm = giảm reach + giảm hiểu sản phẩm.

## 3. Monetization / Paywall placement

Artimind paywall **luôn đặt sau khi user đã "show intent"**: chọn xong theme + upload đủ ảnh + tap Generate. Không gate trước.

| Pattern | Khi nào |
| --- | --- |
| **Mid-flow paywall** (sau Upload, trước Generate) | Mọi feature generate có cost AI — đây là default |
| **Soft paywall** (banner, dismissible) | Feature secondary, không cần block hard |
| **Last-chance paywall** | Khi user cancel paywall lần 1 → hiện offer ưu đãi 1 lần |

**Sau khi mua sub thành công**: tự động tiếp tục flow Generate, giữ nguyên state (theme + ảnh + script đã chọn). Đây là contract bất di bất dịch — user không phải làm lại.

**Remote config cho paywall**:
- `show_{feature}_paywall: bool` — bật/tắt paywall feature (cho phép A/B free unlimited vs gated)
- `content_benefit_subscription: JSON` — title/footnote/CTA của paywall
- `enable_home_screen: bool` — gate cả tab nếu cần

Khi propose feature mới, **luôn kèm danh sách remote config** anh dự kiến để Mediation/Monetization team setup trước.

## 4. Định vị "Life Moments" — strategic anchor

Life Moments là tagline của Artimind: *"Bring memories alive."* Mọi feature phải answer được câu hỏi:

> *"Cái này giúp user kể 1 khoảnh khắc cảm xúc gì?"*

Không answer được → feature không thuộc Artimind, đẩy sang spin-off.

**Themes / Templates đang có** (làm tham chiếu khi propose feature mới):
- AI Loved Ones — bring deceased family alive (voice clone + lip-sync)
- AI Album — 6-scene video từ 2 ảnh + theme arc (Romance / Family / Friendship / Adventure / Memory / Dream)
- AI Photo Restore — Free To Try, colorize B&W, fix scratches
- Wedding Tribute Video (v5.8.0) — Seedance 2.0, audio reference, lip-sync, cho người thân đã mất phát biểu ở đám cưới

**Pattern chung**: input là **ảnh người thân** + (audio | theme | text), output là **short video có cảm xúc** (5-15s), share-able.

## 5. Pre-rollout checklist (mỗi feature)

Trước khi merge feature, page IIP032 phải có bảng Pre-Rollout đủ rows sau (mỗi row tag PIC + status):

| Type | Attribute | Bắt buộc khi |
| --- | --- | --- |
| Remote config | `enable_{feature}_screen` | Luôn |
| Remote config | `content_benefit_subscription` | Có paywall |
| Remote config | `show_{feature}_paywall` | Có paywall |
| Mediations | `enable_cpn_feature` | Có ads |
| Store Descriptions | `content_card_list_*` JSON | Card mới trên Home |
| CMS | Template list / disabled styles | Template-based feature |
| RevCat | Setup Paywall default | Mọi version có paywall |
| Checklist | Product / BD / ASO / Partner / Dev / Test task | Luôn |

Pattern này lấy từ IIP032 v5.7.0 — copy y nguyên, chỉ đổi tên feature.

## 6. Anti-patterns (refuse hoặc challenge user)

| Anti-pattern | Lý do refuse |
| --- | --- |
| "Tự generate không cần input của user" | Phá vỡ trust + cảm xúc; user phải feel ownership |
| Gate entry tab cho free user | Giảm reach + payrate; gate phải ở generate step |
| Theme/template không có scene_arc rõ ràng | AI sẽ random, output không kể được story → low share rate |
| Output > 30s | Quá dài để share, Seedance chậm + tốn $$$ |
| Replace tab cũ mà không có data | Tab existing có sticky user — phải có A/B trước khi thay |
| Mixed language script (VN + EN trong 1 video) | Voice clone fail; Artimind chỉ support English-only output |
| Output bị watermark cho Pro user | Pro = no watermark, no exception |

## 7. Khi nào challenge user

Khi user pitch feature mới mà thiếu 1 trong các thông tin sau, **hỏi lại trước khi viết PRD**:

1. *"Persona là ai? Cho em 1 user cụ thể."* (không chấp nhận "general user")
2. *"Engine AI dùng cái nào? Seedance 1.5 / 2.0 / khác?"* (cost + quality khác nhau rất xa)
3. *"Free user dùng được tới đâu? Gate ở step nào?"*
4. *"Output share đi đâu? TikTok / IG / Messenger?"* (ảnh hưởng aspect ratio, length, watermark)
5. *"Có tag/category sẵn không? Hay tạo mới?"* (placement decision)

## 8. Reference docs

- `IIP032 - Ver 5.7.0 - AI Album` (pageId `302546971`) — full template Problem/Solution + 6-scene generate flow + threshold logic
- `IIP032 - Ver 5.8.0 - Video template with Audio reference` (pageId `302547223`) — template + CMS-driven config + 4-step processing
- File Figma `Artimind - Impeccable Craft` (key `bru0TURyagozgfAOd5B6Gb`) — full UI page `26397:60871` để xem flow đã ship

## 9. Output expected khi user hỏi anh

| User hỏi | Em deliver |
| --- | --- |
| "Em nghĩ feature X có nên làm không?" | 1 đoạn pro/con + map vào Life Moments + suggest placement + 2 metric đo thành công |
| "Viết Problem/Solution/Metrics cho [feature]" | Đúng format bảng IIP032 + 1 persona cụ thể + engine AI + 3 metric |
| "Đặt feature này ở đâu?" | Bảng 4 placement options với recommendation + lý do |
| "Cần remote config gì?" | List keys theo template ở section 5 |
| "Feature này có ổn không?" | Check qua 8 anti-patterns + 5 challenge questions |
