# IIP032 — Artimind: AI Art Generator (flagship product reference)

**Đọc file này khi**: user yêu cầu viết doc cho Artimind, IIP032, hoặc bất kỳ release Ver `X.Y.Z` nào của Artimind. Pattern của IIP032 **khác** với cấu trúc 4-page Overview/PRD/SRD/Meeting Note của project IIP### mới — dùng release-cadence pattern.

## Bối cảnh

- **Product**: Artimind — AI Art Generator (iOS, Android, Web), brand color `#810913`
- **Tình trạng**: Long-running flagship, đã tới Ver 5.4.0+ (tính tới 2026)
- **Aliases lịch sử**: `AIP131 Artimind`, `IIPXXX - AIPXXX Artimind` — tránh dùng, luôn ưu tiên prefix `IIP032`
- **Parent landing**: `IIP032. Artimind: AI Art Generator` (pageId `186877887`)
- **Spec gốc** (read-only reference): `IIP032.3 SRD - Services Requirement Document` (pageId `275480691`)

## 1. Pattern: Release-page-per-version

Khác với IIP073-style (4 page chuẩn), Artimind tổ chức theo **release**: mỗi version/feature batch là 1 page độc lập.

**Quy tắc đặt tên**: `IIP032 - Ver X.Y.Z - [Mô tả ngắn lý do release]`

Ví dụ thực tế:
- `IIP032 - Ver 5.4.0 - Remote Config tắt bật 4 màn chính`
- `IIP032 - Ver 5.3.3 - Restore Feature & Enhance IAP performance by Apple suggested`
- `IIP032 - Ver 5.0.0 - AI Companion`
- `IIP032 - Ver 4.6.1 - Improve Branding`
- `IIP032 - Ver 4.4.3 - Hot fix - Stability and Quality Improvement`

Tone của tiêu đề: ngắn gọn, neo vào **mục tiêu kinh doanh** (Optimize Fee, Improve Branding, Reduce Cancel Rate, Hot fix...) — không phải tên feature kỹ thuật.

## 2. Template: Release page

```markdown
|  |  |
| --- | --- |
| Target release |  |
| Release Version | V[X.Y.Z] |

| Problem | Solution | Target Metrics |
| --- | --- | --- |
| [Pain point hiện tại, có số liệu] | [Hướng giải] | [Metric mục tiêu sau release, vd "% cancellation = 20-30%"] |
| [Problem 2] | [Solution 2] | [Metric 2] |

## Requirements

| Screen | AC (Feature) | Case | Document | AT | Note |
| --- | --- | --- | --- | --- | --- |
| [Screen number + tên, vd "401 Home"] | [Tên AC ngắn] | [Edge case] | [Inline Given/When/Then HOẶC link sang feature spec] | [Jira ticket id + status] | [Ghi chú] |

## Questions
| Date | Question | PIC | Outcome |
| --- | --- | --- | --- |
| [DD/M] | [Câu hỏi nảy sinh trong sprint] | @user | [Quyết định cuối] |

## Pre-Rollout
To-do list has been created and monitored during sprint by developer team & product team

| Type | Attribute | Value | Condition | PIC | Status |
| --- | --- | --- | --- | --- | --- |
| Remote Config | [key_name] | [value] | [Boolean/String/...] | BA |  |

---

| Stakeholder | PIC | Status | Related Document |
| --- | --- | --- | --- |
| BA |  |  | Link remote config summary / Link CMS / Link Event tracking |
| PO |  |  | Link Figma design |
| PD |  |  |  |
| Dev |  |  |  |
| Test |  |  |  |
```

### Biến thể của bảng Requirements

Tuỳ độ mới của release, bảng Requirements có 2 layout:

**Layout A — Release nhỏ / hot fix** (cột compact):
`Screen | AC (Feature) | Case | Document | AT | Note`

**Layout B — Release lớn link sang feature spec page** (cột full):
`User Personal | User Story | Ticket | Document | Demo 1 | AT | Note`
- `User Personal` = link đến feature spec page (vd `IIP032.2.3.5.5.1A Onboarding`) + 1 dòng mô tả persona
- `User Story` = link tới Acceptance Criteria cụ thể trong page đó
- `Ticket` = link tới Scenario cụ thể (anchor)
- Mỗi row trong bảng chính là 1 scenario hoặc 1 AC

**Khi nào dùng layout nào**: nếu release giới thiệu 1 feature lớn (vd AI Companion), feature có spec page riêng → dùng Layout B. Nếu release chỉ thay đổi UI/config nhỏ, viết inline → dùng Layout A.

## 3. Cell `Document` — viết Given/When/Then inline

Khác với IIP073 (Scenario có heading riêng), Artimind release pages thường nhét cả Given/When/Then **trong 1 cell** của bảng Requirements. Format chuẩn:

```
Remote config key: `key_name`
- Type: Boolean
- Default: `true`

Given user mở app hoặc chuyển tab
When `key_name` = `true`
Then Hiển thị màn X bình thường, bao gồm:
  - [element 1]
  - [element 2]

Given user mở app hoặc chuyển tab
When `key_name` = `false`
Then Ẩn tab X khỏi Tab Bar. Điều hướng user sang tab hiển thị đầu tiên còn bật
```

**Quy tắc**:
- Liệt kê **remote config key** ở đầu cell nếu có (Type, Default)
- Mỗi nhánh logic 1 block Given/When/Then liên tiếp
- Element list dưới Then dạng bullet
- Không bold Given/When/Then trong cell (vì đã chật) — chỉ inline

## 4. Cell `AT` — tracking Jira ticket + trạng thái

Format: `[Jira ID] [status] [QA result]`

Ví dụ thực tế:
- `1795 complete Pass AT`
- `1567 incomplete Pass AT`
- `1832 complete Pass AT  Hiện đã có đồng bộ kịch bản chat`
- `Bỏ` (scenario đã bỏ)
- `BackLog 5.1.0` (đẩy sang version sau)

**Status values**: `complete`, `incomplete`
**QA values**: `Pass AT`, để trống nếu chưa test

## 5. Screen numbering của Artimind (v5+)

Khác với mã 3 số chuẩn của IIP073-style, Artimind có map cố định riêng:

| Range | Mô tả | Ví dụ |
| --- | --- | --- |
| `1xx` | Splash, Onboarding | 101 Splash |
| `2xx` | Paywall | 202 Last Chance, 203 Generate Paywall, 214/215/216/217 Companion paywalls |
| `4xx` | **Tab Bar screens** | **401 Home, 402 Moments, 403 Loved Ones, 410 Profile, 420 Profile (legacy)** |
| `4Xx` (chữ) | Sub-modal/popup | 4C Comunicate setting, 4C1 Edit name, 4C2 Edit relationship |
| `6xx` | AI Video / Result flow | 650 Result, 651 Analyze Status, 670 Result viewer, 675 Full screen |

**Chú ý đặc biệt**:
- `420 Profile` là tên cũ, từ Ver 5.x đã đổi sang `410 Profile` — luôn check Figma version trước khi viết
- Tab Bar có 5 tab tối đa: Home → Moments → Loved Ones → Restore → Profile

## 6. Remote config naming convention (IIP032)

| Pattern | Mục đích | Ví dụ |
| --- | --- | --- |
| `show_NNN_<screen>` | Bật/tắt 1 màn theo số | `show_401_home`, `show_410_profile` |
| `show_NNN_<feature>_paywall` | Bật/tắt paywall | `show_203_aivideo_generate_paywall` |
| `enable_<feature>_feature` | Bật/tắt feature lớn | `enable_cpn_feature` |
| `cpn_*` | AI Companion config | `cpn_first_use_config_scenario_1` |
| `showcase_flow1_scenario_*` | Onboarding showcase variants | `showcase_flow1_scenario_3` |
| `roll_back_version` | Force tắt flow theo version | (thường dùng cho hot fix) |

**Default policy**: feature mới luôn ship với remote config = `false` cho dev/staging, BA bật trong Pre-Rollout checklist trước khi go live.

## 7. Stakeholder footer Artimind

Roles cho IIP032 (khác với IIP073-style — KHÔNG có MO/BD trong release nhỏ):

| Role | Viết tắt | Ai |
| --- | --- | --- |
| Business Analyst | BA | Sở hữu remote config + CMS + event tracking |
| Product Owner | PO | Sở hữu Figma design |
| Product Designer | PD | UI/UX |
| Development | Dev | iOS/Android (không tách trừ khi cần) |
| Test | Test | QC team |

Related Document chuẩn cho BA cell:
- Link remote config summary (Google Sheets)
- Link CMS (Google Sheets)
- Link Event tracking (Google Sheets)

Related Document chuẩn cho PO cell:
- Link Figma design

## 8. Feature spec pages dưới IIP032

Khi 1 feature lớn cần spec riêng (vd AI Companion), tạo child page với mã dài:

`IIP032.2.<X>.<Y>.<Z>.<W> [Tên màn/feature]`

Ví dụ:
- `IIP032.2.3.5.5.1A Onboarding`
- `IIP032.2.3.5.5.1B Popup companion ready`
- `IIP032.2.3.5.5.1C Choose Companion`
- `IIP032.2.3.5.5.2 Upload Photo`
- `IIP032.2.3.5.5.3 Comunicate`
- `IIP032.2.3.4.3 - 420 - Profile` (kèm screen number)

Mỗi feature spec page **dùng đầy đủ Given/When/Then format chuẩn** giống IIP073-style (có heading Acceptance Criteria N + Scenario N rõ ràng), không nén vào table cell. Release page chỉ link tới chứ không copy nội dung.

### Naming scenarios (Artimind convention)

- `Scenario 1`, `Scenario 2`... — main path
- `Scenario 1A`, `Scenario 1B`, `Scenario 1B1`, `Scenario 1B2` — variants/sub-flows. Chữ cái = nhánh, số = sub-step.
- `Scenario NA`, `NB`, `NC` cho các trạng thái error/edge (`9A` internet error, `9B` generate error, `9C` NSFW)
- Strikethrough scenario đã bỏ — không xoá

## 9. Single-page (landing/web) docs

Cho landing page Artimind (web2app, ads creatives), pattern khác hẳn — đơn giản hơn:

Page name: `IIP032.2.9.X - Single page - Artimind (phase X)`

Sections:
- **Scope**: bảng `Problems | Solution | Phase`
- **Flow**: ảnh/null
- **Function Requirement**: bảng `Acceptance Criteria | Landing page | UI`
  - Cột `Landing page` chứa Given/When/Then inline
  - Cột `UI` là sub-table nested với element + description + link Figma
- **Non Function Requirement**
- **Appendix → Key Remote**: bảng GA4 events `Event Name | Triggered | Event Param | Description | Example Value`

Ví dụ event chuẩn cho landing page: `landingpage_click_cta`.

## 10. History references (đọc khi cần đối chiếu)

Các release tiêu biểu để copy style:

| Page | pageId | Use case |
| --- | --- | --- |
| Ver 5.4.0 - Remote Config 4 màn | `294683819` | Layout A compact, inline GWT, Tab Bar UI States |
| Ver 5.0.0 - AI Companion | `266109729` | Layout B link feature spec, 100+ scenarios, Questions log dài |
| Ver 4.6.1 - Improve Branding | `249528660` | Rebranding doc, dùng red/white color coding cho changed/original |
| Ver 4.9.1 - Reduce cancel rate | `279314477` | Có cột Prioritize, Scenario user story format |
| IIP032.2.9.1 Single page Artimind phase 1 | `192545043` | Landing page template |
| Artimind Rollout History | `172949563` | Bảng version + link build + release note (account tải file: kho nội bộ `media/secrets/apr-046-artimind-rollout-history-login.md`, không ghi ở đây) |

## 11. Workflow khi user yêu cầu viết release mới

1. **Hỏi thông tin bắt buộc**:
   - Version number (vd `5.5.0`)
   - 1-2 câu mô tả mục đích release (để đặt title)
   - Có feature lớn cần spec riêng không? (chọn Layout A hay B)
2. **Search trùng**: `confluence_search` với `space = VL AND title ~ "IIP032 - Ver X.Y.Z"` để tránh duplicate.
3. **Tạo theo template release** (mục 2 ở trên), điền:
   - Problem/Solution/Target Metrics — cố gắng đưa số liệu cụ thể
   - Requirements table — chọn Layout A hoặc B
   - Pre-Rollout — list các remote config key liên quan
4. **Nếu cần feature spec mới**: tạo child page riêng theo format `IIP032.2.<path>` với Given/When/Then đầy đủ (theo format chuẩn của SKILL.md mục 5).
5. **Sau khi tạo**: nhắc user điền PIC, link Figma, tag @ stakeholders, cập nhật Jira tickets vào cột AT.

## 12. Anti-patterns (đừng làm)

- ❌ Dùng cấu trúc 4-page Overview/PRD/SRD/Meeting Note cho IIP032 — nó là release-cadence, không phải project mới
- ❌ Tách Scenario thành heading riêng trong release page — dùng inline trong table cell
- ❌ Bỏ qua Questions table — luôn để sẵn (kể cả empty) vì sẽ điền trong sprint
- ❌ Bỏ qua Pre-Rollout — luôn list remote config keys để BA biết cần bật cái gì
- ❌ Đặt title release theo tên feature kỹ thuật — neo vào business goal (Reduce cancel rate, Optimize fee, Improve branding...)
- ❌ Xoá scenario cũ — strikethrough để giữ lịch sử
- ❌ Dùng alias `AIP131` hoặc `IIPXXX` — luôn `IIP032`
