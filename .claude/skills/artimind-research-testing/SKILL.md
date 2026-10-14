---
name: artimind-research-testing
description: "Write Acceptance Criteria, test scenarios, pre-rollout checklists, and\
  \ validation plans for Artimind features. Use when the user asks to \"write AT\"\
  , \"vi\u1EBFt AC\", \"Given/When/Then\", make a test plan, validate a feature pre-launch,\
  \ set up A/B with remote config, or critique whether a feature is testable. Encodes\
  \ the Given/When/Then scenario format, the IIP032 pre-rollout checklist (remote\
  \ config / mediation / CMS / RevCat / stakeholder), validation states for AI generation\
  \ features, and how to wire metrics for A/B and retention monitoring."
sot_id: TBD
app: TBD
po: TBD
aarrr_stage: TBD
features_touched: TBD
---

<!-- Nguồn: AI Knownledge APR-046 Product, owner Thịnh Đào Đức, nhập 2026-10-14 -->
# Artimind — Research & Testing

Skill này lo phần **validation**: viết AC chuẩn, cover error path, lập pre-rollout checklist, đo lường sau ship. Một feature không testable = không ship được.

## 0. Quy ước viết AC trong IIP032

Mỗi page version IIP032 có bảng **Requirements** với cột AC + Case + Scenario. Pattern:

```
| Screen | AC (Feature) | Case | Scenario | Design | AT | Note |
| --- | --- | --- | --- | --- | --- | --- |
| Theme Picker | Chọn theme cho album | Chọn theme cho album | **[GIVEN]** Người dùng vừa mở AI Album  **[WHEN]** Người dùng đang ở màn theme picker  **[THEN]** Hiển thị các themes. Mỗi theme có preview video sample + tên | (link Figma) | (link AT) | (note dev) |
```

**Rules:**
- Mỗi row = 1 user-observable scenario
- **GIVEN / WHEN / THEN** in hoa, in đậm, đặt cứng đầu mỗi đoạn
- GIVEN có thể nhiều condition nối bằng `and` (xuống dòng)
- WHEN là 1 action duy nhất
- THEN list kết quả — bullet point nếu nhiều, mô tả chính xác UI/navigation
- Cột "Design" link tới Figma frame, "AT" link tới test report sau khi run

## 1. AC checklist mỗi feature (phải cover đủ)

Trước khi viết, em check feature có cover đủ các nhánh sau không. Mỗi nhánh thiếu là 1 hole sẽ phát hiện sau khi ship.

### Entry & Navigation
- [ ] Entry từ tab/card chính → mở màn đầu flow
- [ ] Back button hành xử đúng (back từng bước, không skip)
- [ ] Cancel/Close mid-flow → quay về đâu, giữ state nào
- [ ] Free user vs Pro user khác nhau ở đâu (gate điểm nào)

### Input states
- [ ] Empty (chưa input) — CTA disabled, helper text
- [ ] Partial — count progress (e.g., "2/6 added")
- [ ] Filled — CTA enabled, validation pass badge
- [ ] Replace — tap field/slot có thể đổi input

### Validation (cho input)
- [ ] **Ảnh**: 0 face / 1 face / >1 face — error inline
- [ ] **Audio**: format invalid (không WAV/MP3) / file không có audio track
- [ ] **Text**: empty / quá dài / chứa ký tự cấm
- [ ] **Format file**: size > limit / corrupted
- [ ] Loading state khi validate (nếu validate chậm)

### Paywall
- [ ] Free user tap Generate → hiện paywall
- [ ] Pro user tap Generate → vào thẳng Generate
- [ ] Purchase success → continue flow, giữ state
- [ ] Cancel paywall → back to Upload, giữ state
- [ ] Restore purchase từ paywall

### Processing
- [ ] Hiển thị progress + ETA
- [ ] User leave app → job vẫn chạy (Live Activity continue)
- [ ] User quay lại app → reopen ở Processing hoặc Result tuỳ state
- [ ] Cancel mid-process → confirm dialog, refund credit nếu có
- [ ] Auto retry các step có thể retry (silent to user)

### Failure recovery
- [ ] API error → modal "Tạo video thất bại" + nút "Về trang chủ"
- [ ] Network mất → retry / pause job
- [ ] Threshold (cho multi-scene): < threshold = fail toàn bộ + Retry CTA
- [ ] Content filter trả NSFW → error message thân thiện, không tiết lộ rule

### Result
- [ ] Auto-play video, có thể pause/play
- [ ] Save → permission lần đầu, lưu thành công có toast
- [ ] Share → mở native share sheet, list app đầy đủ
- [ ] Recreate → quay về theme/template picker, giữ ảnh upload
- [ ] Back → quay về tag/section gốc, giữ context (KHÔNG về Home default)

### Permissions
- [ ] Photo library — denied / not_determined / authorized
- [ ] Camera — denied / not_determined / authorized
- [ ] Notification — denied → vẫn ship được nhưng giảm experience của Live Activity
- [ ] Music/Files — cho Upload Audio

### Toast / Empty / Loading
- [ ] Toast success / failed cho mỗi I/O (Save, Share, Upload)
- [ ] Empty state khi list trống (CMS chưa có template)
- [ ] Skeleton/spinner khi load template list / preview video

## 2. Scenario format chuẩn (copy từ IIP032)

```markdown
#### Scenario N: [Tên trạng thái/kết quả ngắn gọn]

**Given**
User [điều kiện ban đầu]
**and** [điều kiện phụ nếu có]

**When**
User [hành động cụ thể]

**Then**
- [Kết quả observable 1]
- [Kết quả observable 2]
- [Navigation tới đâu / state nào thay đổi]
```

**Tên scenario** mô tả **trạng thái/kết quả**, không mô tả bước:
- Tốt: `Scenario 3 - Permission đã được cấp (authorized)`
- Tệ: `Scenario 3 - User tap nút allow`

## 3. AC bắt buộc trong mọi feature

Mỗi feature spec phải có tối thiểu các AC sau (đặt theo thứ tự):

1. `Acceptance Criteria 1: Hiển thị màn [tên màn chính]` — happy path
2. `Acceptance Criteria 2: Hiển thị màn permission` — nếu có request permission
3. `Acceptance Criteria N: Hiển thị Error Popup` — NSFW / size / server error
4. `Acceptance Criteria N: Hiển thị toast` — download / share / save success/failed
5. `Acceptance Criteria N: Điều hướng` — gom navigation rules cuối page

## 4. Pre-rollout checklist (mỗi version IIP032)

Bảng này **bắt buộc có** trong mọi page IIP032 version, copy y nguyên format từ v5.7.0 / v5.8.0. Mỗi row tag PIC + status `incomplete Pass AT`:

```
| Type | Attribute | Value | Condition | PIC | Status |
| --- | --- | --- | --- | --- | --- |

| Remote config | content_benefit_subscription | { "title": "...", "footnote": "...", "CTA": "..." } | First version or change | @user | 1668 incomplete Pass AT |
| Remote config | enable_{feature}_screen | true / false | First version or change | @user | 1640 incomplete Pass AT |
| Remote config | show_{feature}_paywall | true / false | Có paywall | @user | 1670 incomplete Pass AT |
| Mediations | enable_cpn_feature | false | Default | @user | 1669 incomplete Pass AT |
| Store Descriptions | content_card_list_{section} | { "title": "Life Moments", "cards": [...] } | Card mới | @user | 1671 incomplete Pass AT |
| Store Descriptions | showcase_flow1_creative_map | { "default_showcase": "...", "intro": [...] } | First version | @user | — |
| CMS | Template list update | Tắt style cũ / thêm style mới | Template-based feature | @user | 1715 incomplete Pass AT |
| RevCat | Setup Paywall default | — | Có paywall | @user | 1716 incomplete Pass AT |
| Checklist | Product's task | [link checklist] | Always | @user | 1717 incomplete Pass AT |
| Checklist | BD's task | [link] | Always | @user | 1718 incomplete Pass AT |
| Checklist | ASO's task | [link] | Always | @user | 1719 incomplete Pass AT |
| Checklist | Partner's task | [link] | Always | @user | 1720 incomplete Pass AT |
| Checklist | Dev's task | [link] | Always | @user | 1721 incomplete Pass AT |
| Checklist | Test's task | [link] | Always | @user | 1722 incomplete Pass AT |
```

**Status format**: `[number] incomplete Pass AT` → khi pass thay `incomplete` bằng `complete`. Number là internal ticket Id.

## 5. Stakeholder footer (bắt buộc cuối page)

```
| Stakeholder | PIC | Status | Related Document |
| --- | --- | --- | --- |
| BA |  | Click Ctrl + Shift + J to link Jira Ticket | 1642 incomplete Pass AT |
| PO |  | Click Ctrl + Shift + J | 1643 incomplete Pass AT |
| PD |  | Click Ctrl + Shift + J | 1723 incomplete Pass AT |
| Dev |  | Click Ctrl + Shift + J | 1724 incomplete Pass AT |
| Test |  | Click Ctrl + Shift + J | 1725 incomplete Pass AT |
```

Roles:
- **BA** Business Analyst — viết PRD/feature spec
- **PO** Product Owner — duyệt scope
- **PD** Product Designer — design Figma
- **Dev** — implement (chia iOS/Android nếu cross-platform)
- **Test** — QC, run AT, report bug

## 6. A/B với remote config (template)

Pattern Artimind: feature mới mặc định **off** cho 100% user → bật dần qua remote config + monitor metric.

```yaml
# Stage 1: Dark launch (off cho 100%)
enable_{feature}_screen: false   # tất cả user

# Stage 2: Internal test (5%)
enable_{feature}_screen:
  default: false
  override:
    - segment: internal_users
      value: true

# Stage 3: Soft launch (20%)
enable_{feature}_screen:
  default: false
  experiments:
    - id: exp_{feature}_v1
      variant_a: false       # 80% — control
      variant_b: true        # 20% — treatment

# Stage 4: Full rollout
enable_{feature}_screen: true
```

**Metrics phải monitor** ở mỗi stage:
- `funnel_{feature}_entry → upload → generate → result` — drop-off mỗi step
- `payrate_after_{feature}_paywall` — % free user mua sub khi thấy paywall
- `share_rate_{feature}` — % user share output
- `crash_rate` không tăng vs baseline
- `D1 / D7 retention` của user thử feature vs control

Nếu metric tệ ở stage 3 → rollback về false, không escalate.

## 7. AT (Acceptance Testing) workflow

Khi Dev báo "feature ready for AT":

1. **Test team check pre-conditions**: remote config đã setup đúng, CMS có data, paywall đã enable trong RevCat sandbox
2. **Run scenarios theo thứ tự AC trong page IIP032**, mỗi scenario:
   - Setup state per **Given**
   - Execute **When** action
   - Verify **Then** results
   - Record kết quả (Pass / Fail / Blocked) + screenshot/video nếu fail
3. **Update status** trong page: thay `incomplete Pass AT` → `complete Pass AT` cho row passed
4. **Tag Dev nếu fail** + link Jira bug ticket
5. **Sign-off** khi 100% AC pass: PIC Test ký vào Stakeholder footer

## 8. Validation cho AI generation features (đặc biệt Artimind)

Vì output là AI-generated, không deterministic, có thêm AC validation:

| Check | Tool | Threshold |
| --- | --- | --- |
| Output có người trong ảnh không | Face detection trên output | ≥1 face detected |
| Output có watermark không (cho Pro user) | Visual diff vs template | Pixel similarity in watermark region < 5% |
| Output đúng aspect ratio | Metadata check | Đúng 1:1 / 9:16 / 16:9 tuỳ feature |
| Output đúng duration | Metadata check | ±2s của expected |
| Output không corrupted | mp4 metadata + first-frame decode | First frame decode OK |
| Lip-sync hợp lý (cho feature có audio) | Manual review 5-10 sample | ≥ 70% sample chấp nhận được |

Không pass = block ship — không thoả hiệp.

## 9. Bug template (khi Test report fail)

```markdown
**Title**: [IIP032 v5.X.0] [Feature] - [Short failure description]

**Severity**: Critical / Major / Minor

**Reproduction**:
1. Step 1
2. Step 2

**Expected** (per Scenario N):
- [Expected behavior]

**Actual**:
- [What happened]

**Evidence**:
- Screenshot/video: [link]
- Log: [link]
- Remote config snapshot: [link]
- Device: iPhone 14 Pro, iOS 18.2

**Related AC**: [link to scenario in IIP032 page]
```

## 10. Khi nào challenge user

Feature không testable / thiếu thông tin → hỏi lại trước khi viết:

1. *"Anh muốn validate metric gì sau ship? Em viết AC cho cover metric đó."*
2. *"Free vs Pro khác nhau cụ thể ở step nào? Nếu không khác thì paywall đặt ở đâu?"*
3. *"Error case của API là gì? Timeout? NSFW? Server error? Content filter?"* — cần list để cover error AC
4. *"Có CMS không? Ai update template?"* — ảnh hưởng pre-rollout checklist
5. *"Output share đi đâu? Anh có data của format social media cần không?"*

## 11. Output expected khi user hỏi anh

| User hỏi | Em deliver |
| --- | --- |
| "Viết AC cho [feature]" | Bảng Requirements đúng format IIP032 + cover đủ checklist section 1 |
| "Cover edge case" | List error/empty/permission/toast/loading states + scenario cho mỗi state |
| "Pre-rollout checklist" | Bảng section 4 với key remote config + checklist + stakeholder cụ thể của feature |
| "Đo lường sau ship" | Section 6: funnel + payrate + share rate + retention + crash rate |
| "Feature này có testable không?" | Check qua 5 câu hỏi section 10 |
