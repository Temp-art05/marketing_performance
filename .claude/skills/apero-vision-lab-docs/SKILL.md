---
name: apero-vision-lab-docs
description: Write Confluence documentation in the Apero Vision Lab (space VL) style.
  Use when the user asks to create/draft a Product Overview, PRD, SRD, API Contract,
  feature spec, or release page for any IIP### project (including IIP032 Artimind,
  IIP068+, IIP073), or when writing/updating any doc under the Vision Lab space. Enforces
  the standard 4-page project layout for new projects, the release-cadence pattern
  for IIP032 Artimind, Given-When-Then scenario format, 3-digit screen numbering,
  and Vietnamese-primary tone with English technical terms.
sot_id: TBD
app: TBD
po: TBD
aarrr_stage: TBD
features_touched: TBD
---

<!-- Nguồn: AI Knownledge APR-046 Product, owner Thịnh Đào Đức, nhập 2026-10-14 -->
# Apero Vision Lab — Documentation Skill

Bộ rules & templates để viết tài liệu đúng chuẩn space **VL** (Apero Vision Lab) trên Confluence (`https://confluence.apero.vn/display/VL`).

## ⚠️ Đọc trước khi viết

Vision Lab có **2 pattern khác nhau** cho 2 nhóm project:

| Pattern | Áp dụng cho | Cấu trúc |
| --- | --- | --- |
| **New project (IIP068+)** | Project mới (IIP068, IIP069, ..., IIP073, ...) | 4-page chuẩn: Overview / PRD / SRD / Meeting Note. Mỗi feature có spec page riêng với Given/When/Then. Skill này (mục 1–9) áp dụng. |
| **Release-cadence** | **IIP032 Artimind** (flagship long-running) | 1 page/release version. Inline Given/When/Then trong table cell. **Đọc `iip032-artimind.md`** trong cùng folder skill này. |

**Khi user nhắc tới Artimind hoặc IIP032 → BẮT BUỘC đọc `iip032-artimind.md` trước khi viết.** Pattern khác hẳn, áp dụng nhầm sẽ sai format.

## 0. Nguyên tắc chung

- **Ngôn ngữ**: Tiếng Việt là chính. Giữ nguyên tiếng Anh cho thuật ngữ kỹ thuật: `User flow`, `Screen flow`, `Acceptance Criteria`, `Scenario`, `Given/When/Then`, `Monetization`, `Stakeholder`, `PIC`, `Remote Config`, `Paywall`, `IAP`, `Subscription`.
- **Cấu trúc bảng**: Dùng table cho hầu hết dữ liệu có lặp (goals, hypotheses, màn hình, API, pricing, scenarios metadata).
- **Placeholder**: Dùng *italic* để đánh dấu nội dung chờ bổ sung, ví dụ: *"Chờ link draw.io — sẽ bổ sung sau khi hoàn thành Figma design"*.
- **Không dùng emoji** trong document chính thức.

## 1. Cấu trúc 1 project IIP###

Mỗi project mới có **1 parent page + 4 child pages chuẩn**:

```
IIP### - [Product Name]                        (parent, landing)
├── IIP###.1 Product Overview
├── IIP###.2 Product Requirement Document (PRD)
├── IIP###.3 System Requirement Document (SRD)
│   ├── IIP###-API-001 [API Name]              (1 child page/API)
│   ├── IIP###-API-002 ...
│   └── IIP###.2.X.Y [Screen/Feature Spec]     (1 child page/màn hoặc feature)
└── IIP###.4 Meeting Note
```

**Quy tắc naming**:
- Parent: `IIP### - Product Name` (vd `IIP073 - AI Palm`)
- Numeric prefix `.1 / .2 / .3 / .4` cho 4 tài liệu chính
- API: `IIP###-API-###` (có dấu gạch, không dấu chấm)
- Feature spec dưới SRD: `IIP###.2.X.Y [Tên màn]` (ví dụ `IIP068.2.5.1 Image to Image (Template only)`)

## 2. Template: `IIP###.1 Product Overview`

```markdown
## Product Mission
[1 đoạn mô tả sứ mệnh sản phẩm — user problem, giải pháp, giá trị cốt lõi]

## Product Goal
| # | Goal | Metric |
| --- | --- | --- |
| 1 | [Business/product goal] | [Số đo cụ thể, vd Retention D7 > 20%] |

## Key Hypothesis
| # | Hypothesis | Validation |
| --- | --- | --- |
| 1 | [Giả thuyết về user/market] | [Metric để validate, vd Payrate, LTV] |

## Market Research
| Metric | Value |
| --- | --- |
| Thị trường [ngành] ([năm]) | ~$X tỷ USD |
| [Số liệu liên quan] | [Giá trị] |

## Competitive Analysis
| App | Users/Installs | Pricing | Key Features |
| --- | --- | --- | --- |
| **[Competitor]** | [Số liệu] | [Gói giá] | [Tính năng chính] |
```

Tone: factual, data-driven. Luôn kèm số liệu (metric, market size, pricing) — không chỉ mô tả định tính.

## 3. Template: `IIP###.2 Product Requirement Document (PRD)`

```markdown
## User flow
[Link draw.io] https://app.diagrams.net/#...
[Ảnh export của flow, hoặc placeholder italic nếu chưa có]

**Luồng chính dự kiến:**
1. Splash → Onboarding
2. Onboarding → Paywall → Home
3. ...

## Screen flow
[Link Figma]
| STT | Màn hình | Mô tả |
| --- | --- | --- |
| 1 | 101 - Splash | Logo, loading remote config |
| 2 | 201 - Onboarding Paywall | Paywall sau onboarding |
| 3 | 301 - Home | Màn chính |
| 4 | 401 - [Feature screen] | [Mô tả ngắn] |
...

## Monetization
### Subscription Plans
| Gói | Giá | Chu kỳ | Tính năng |
| --- | --- | --- | --- |
| Free | $0 | — | [giới hạn + ads] |
| Weekly | $4.99~$7.99 | Tuần | Unlimited + no ads |
| Monthly | $9.99~$14.99 | Tháng | ... |
| Yearly | $29.99~$49.99 | Năm | ... |

### IAP (In-App Purchase)
| Item | Giá | Mô tả |
| --- | --- | --- |

### Ads Placement
| Loại | Vị trí | Tần suất |
| --- | --- | --- |
| Interstitial | [screen] | [rule] |
| Rewarded Video | [screen] | [rule] |
| Native Ad | [screen] | [rule] |

---

| Stakeholder | PIC | Status | Related Document |
| --- | --- | --- | --- |
| BA |  |  | Link Event tracking |
| PO |  |  | Link Figma |
| MO |  |  | Link remote config |
| Dev |  |  |  |
| Test |  |  |  |
```

**Quy tắc đánh số màn hình (bắt buộc)** — dùng mã 3 chữ số:
- `1xx` — Splash / Onboarding (101 Splash, 110–160 Onboarding steps)
- `2xx` — Paywall (201 Onboarding Paywall, 202 Last Chance, 203 Feature Paywall)
- `3xx` — Home / Explore / Pack / Navigation (301 Home, 302 Pack)
- `4xx` — Core feature flow: capture/upload → processing → result (401 Scan, 402 Processing, 410 Preview, 420 Select Photo, 421 Photo Preview, 430 Analyzing, 440 Result Loading, 450 Result, 480 Error Popup)
- `5xx` — Secondary feature
- `6xx` — Daily/Recurring content (601 Daily Reading)
- `7xx` — History
- `8xx` — Profile / Settings

Tên màn luôn viết dạng `### - Screen Name`, ví dụ `410 - Template preview`, không viết `Template preview (410)`.

## 4. Template: `IIP###.3 System Requirement Document (SRD)`

```markdown
*Tạo API Contract cho từng API bằng cách tạo child page theo template bên dưới.*

## Danh sách API dự kiến
| # | API Code | API Name | Mô tả |
| --- | --- | --- | --- |
| 1 | IIP###-API-001 | [Tên API] | [Mô tả request/response 1 dòng] |
| 2 | IIP###-API-002 | ... | ... |

## API Contract Template
```markdown
# [API Code] - [API Name]
## 1. Overview
- Mô tả chức năng API
- Service owner
- Base URL
## 2. Authentication
- Bearer token / API key
## 3. Endpoints
### [METHOD] /api/v1/endpoint-path
- Description:
- Request Headers:
- Request Body:
- Response (Success):
- Response (Error):
- Rate Limit:
## 4. Error Codes
| Code | Message | Description |
|------|---------|-------------|
## 5. Notes
```
```

## 5. Template: Feature/Screen Spec (child của SRD)

Đây là page mô tả chi tiết 1 flow/màn hình, dùng **BDD Given/When/Then**. Tên page thường dạng `IIP###.2.X.Y [Tên màn/feature]`.

```markdown
## Scope
[1-2 câu: user làm gì với tính năng này]

## Flow
[Diagram/ảnh flow nếu có]

## Function Requirements

### Acceptance Criteria 1: [Tên AC — thường là "Hiển thị màn X" hoặc "Điều hướng Y"]
![screenshot.png](attachment-url)

#### Scenario 1: [Tên scenario cụ thể]
**Given**
User [điều kiện ban đầu]
**and** [điều kiện phụ]

**When**
User [hành động]

**Then**
- [Kết quả 1]
- [Kết quả 2]

#### Scenario 2: ...

### Acceptance Criteria 2: ...

## Non Function Requirements
[Performance, security, accessibility...]

## Appendix
### Key Remote
[Danh sách remote config key liên quan]

---

| Stakeholder | PIC | Status | Related Document |
| --- | --- | --- | --- |
| PO | @user | [Jira ticket] | [Link] |
| MO |  |  |  |
| PD |  |  |  |
| Dev |  |  |  |
| Test |  |  |  |
```

### Rules cho Scenario (quan trọng nhất)

1. **Luôn dùng Given / When / Then** — in đậm 3 keyword.
2. **Given** mô tả điều kiện ban đầu + state. Nhiều điều kiện nối bằng **`and`** (cũng in đậm hoặc ít nhất là bold), thụt lề hoặc xuống dòng.
3. **When** là 1 user action duy nhất (hoặc 1 system event). Không gộp nhiều hành động.
4. **Then** liệt kê kết quả quan sát được, bullet list nếu nhiều. Mô tả chính xác UI element nào hiển thị, disable, navigate tới đâu.
5. **Cover đủ các nhánh**:
   - Happy path
   - Permission states (`not_determined`, `denied`, `authorized`) — đặc biệt cho tính năng dùng camera/photo/location
   - Error: mất mạng, NSFW, quá kích thước, server error
   - Navigation: back, cancel, submit
   - Toast: success / failed cho mỗi action I/O (download, share, upload)
   - Loading states + disable interaction trong khi process
6. **Tên scenario mô tả trạng thái/kết quả**, không mô tả bước, ví dụ tốt: `Scenario 3 - Permission đã được cấp (authorized)`.
7. Dùng `~~strikethrough~~` cho scenarios đã bị bỏ — **không xoá**, giữ lịch sử để người đọc biết đã từng cân nhắc.

### AC thường xuyên xuất hiện (checklist khi viết feature mới)
- `Acceptance Criteria N: Hiển thị màn [tên]`
- `Acceptance Criteria N: Hiển thị màn permission`
- `Acceptance Criteria N: Hiển thị toast` (download/share success/failed)
- `Acceptance Criteria N: Điều hướng` (gom toàn bộ navigation rules cuối)
- `Acceptance Criteria N: Hiển thị Error Popup` (NSFW / size / server error)

## 6. Template: `IIP###.4 Meeting Note`

Thường là list các child page theo ngày: `Recap DD/MM/YYYY`.

Mỗi recap:
```markdown
Thời gian: HH:mm - HH:mm
Thành phần tham gia:
- BA: [tên]
- UX UI Designer: [tên]
- Android Dev: [tên], [tên]
- iOS Dev: [tên], [tên]

## Nội dung buổi họp
1. Presentation: ...
2. Chốt phương án: ...

## Action items
- [ ] [owner] — [task] — [deadline]
```

## 7. Stakeholder footer (mọi spec page)

Mọi PRD/SRD/feature spec đều kết thúc bằng bảng này. Không bỏ qua khi tạo mới — để trống chờ tag người:

| Stakeholder | PIC | Status | Related Document |
| --- | --- | --- | --- |
| BA | Click @ to tag users here | Jira Ticket | Link document |
| PO |  |  |  |
| MO |  |  |  |
| PD |  |  |  |
| Dev |  |  |  |
| Test |  |  |  |

Roles viết tắt:
- **BA** = Business Analyst
- **PO** = Product Owner
- **MO** = Monetization Owner
- **PD** = Product Designer
- **Dev** = Development (thường chia iOS/Android/Backend khi cần)
- **Test** = QC/QA

## 8. Workflow khi user yêu cầu viết tài liệu mới

1. **Hỏi thiếu thông tin**: mã project (`IIP###`), tên product, link Figma, link draw.io nếu có.
2. **Tra page hiện có**: dùng `confluence_search` với `space = VL AND title ~ "IIP###"` để kiểm tra đã tồn tại chưa, tránh trùng.
3. **Tạo theo đúng thứ tự 4 tài liệu**: Overview → PRD → SRD → Meeting Note. Không nhảy cóc sang feature spec trước khi có PRD.
4. **Khi viết feature spec**: luôn bắt đầu từ screen numbering trong PRD. Nếu PRD chưa define màn số nào, hỏi lại trước khi tự đặt.
5. **Sau khi tạo**: nhắc user điền Stakeholder (PIC), link Jira, link Figma/remote config.

## 9. Reference projects để copy style

Project mới nhất (2026) — dùng làm ground truth khi không chắc format:
- **IIP073 - AI Palm** (pageId `292849360`) — có cả 4 trang chuẩn
- **IIP068.2.5.1 Image to Image** (pageId `291275587`) — feature spec đầy đủ scenarios (permission, analyzing, result, error, toast, navigation)
- **IIP069 / IIP070 / IIP071 / IIP072** — variants của cùng pattern

Khi không chắc convention nào đó đúng hay không, `confluence_get_page` một trong các page trên để đối chiếu.

## 10. Sub-references

- **`iip032-artimind.md`** (cùng folder) — Pattern release-cadence cho Artimind. Đọc khi user nhắc IIP032/Artimind/Ver X.Y.Z.
