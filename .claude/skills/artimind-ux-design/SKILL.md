---
name: artimind-ux-design
description: "Design user flows for Artimind features. Use when the user asks to design\
  \ a flow, wizard, multi-step form, validation flow, paywall integration, processing\
  \ screen, or result/share flow for Artimind (IIP032). Encodes the wizard step-indicator\
  \ pattern, face/audio/format validation states, mid-flow paywall gating, 4-step\
  \ processing timeline, result-share-recreate triad, error\u2192home recovery, and\
  \ Live Activity continuation pattern."
sot_id: TBD
app: TBD
po: TBD
aarrr_stage: TBD
features_touched: TBD
---

<!-- Nguồn: AI Knownledge APR-046 Product, owner Thịnh Đào Đức, nhập 2026-10-14 -->
# Artimind — UX Design

Skill này gói lại cách thiết kế **user flow** cho Artimind. UX = thứ tự bước + state machine + recovery, không phải pixel-perfect (xem `artimind-ui-design` cho visual).

## 0. Mental model

Mọi feature generate trong Artimind đều fit vào pattern này:

```
Entry  →  Picker/Tag  →  Input wizard (1-3 step)  →  [Paywall gate]  →  Validate  →  Process (timeline)  →  Result
                                                                                   ↑                       ↓
                                                                                   └─── Error → Home ──────┘
                                                                                                            ↓
                                                                                                    Save / Share / Recreate
```

Khi đặt task mới, em map vào pattern này trước, rồi mới quyết định step nào skip/merge.

## 1. Wizard step indicator (bắt buộc cho flow ≥3 input step)

Mọi flow có ≥3 input step (Photos / Audio / Script / Generate...) phải có step indicator ở **đầu Body** của mỗi screen. Dùng pattern:

```
●─── Photos    ───  Audio   ───  Script   ───  Generate
✓ done         ● active        ○ pending      ○ pending
```

**Rules:**
- Done = filled circle 12px màu green (`r:0.20, g:0.70, b:0.35`) + ✓ glyph
- Active = filled circle 8px màu red (`r:0.95, g:0.20, b:0.25`) + label white
- Pending = filled circle 8px màu gray (`r:0.30`) + label gray
- Line connector giữa các step: 14px wide, 1px height, gray opacity 0.32
- Label dùng DM Sans Medium 11pt
- Đặt **trước** title của screen (Section heading), không sau

## 2. Validation states (3 nhánh bắt buộc khi có upload)

Mọi screen upload ảnh phải cover đủ 3 nhánh face detection:

| State | Trigger | UI |
| --- | --- | --- |
| **PASS** (1 face) | Detect đúng 1 khuôn mặt | Slot gradient + silhouette + "Face detected" badge + X delete |
| **FAIL — 0 face** | Detect 0 khuôn mặt | Slot border đỏ + ⚠ icon + "Không phát hiện khuôn mặt. Vui lòng tải ảnh rõ mặt." + reset |
| **FAIL — >1 face** | Detect nhiều khuôn mặt | Slot border đỏ + ⚠ + "Phát hiện nhiều khuôn mặt. Vui lòng tải ảnh chỉ có 1 người." + reset |

Mọi screen upload audio cover thêm:
| State | Trigger | UI |
| --- | --- | --- |
| **PASS** (format valid) | WAV/MP3 ≤ time limit | Audio player card: waveform + Play + 00:00/00:00 + Replace |
| **FAIL — format** | File không phải WAV/MP3 | "Định dạng không được hỗ trợ. Vui lòng tải WAV hoặc MP3." |
| **FAIL — no audio track** | Extract từ video không có track | "Không tìm thấy audio trong video. Vui lòng tải file khác." |

Nguyên tắc copy: **error ngay tại field** (inline), không show modal/toast — modal/toast chỉ dùng cho server-side errors.

## 3. Paywall placement (mid-flow rule)

Paywall **luôn đặt giữa step "Upload xong" và step "Generate"**. Không bao giờ ở entry.

```
Upload (filled)  →  [tap Generate]  →  Has active sub?  →  Yes → Validate → Generate
                                                          → No  → Paywall
                                                                    ├── Purchase OK → continue (giữ state)
                                                                    └── Cancel     → back to Upload (giữ state)
```

**State preservation contract**:
- Mua sub xong → tiếp tục flow Generate, theme + ảnh + audio + script giữ nguyên (không reset)
- Cancel paywall → quay về màn Upload, state giữ nguyên
- Reload app trong lúc paywall mở → state giữ qua AsyncStorage/UserDefaults

Nếu user paywall xong mới phát hiện ảnh fail validation → reject sau khi mua sub là **trải nghiệm tệ**. Validate phải chạy TRƯỚC paywall (validation client-side) HOẶC giải thích trước khi user tap Generate.

## 4. Processing timeline (≥3 step backend)

Khi backend chạy ≥3 step có thể tracked (analyze / clone voice / generate / combine), em phải show timeline thay vì progress bar trơn:

```
Processing Your Video
50% Complete · Est ~2 min
[████████░░░░░░░░░] (red→orange gradient)

  ✓  Analyzing photos
     3 portraits checked — Sarah's father, mother, bride

  ✓  Analyzing audio
     00:18 voice sample loaded, no clipping detected

  ●  Cloning voice                       ← spinner đang quay
     Building voice model with Seedance 2.0

  ○  Generating tribute                  ← pending
     Lip-sync render — Standard quality 1080p
```

**Rules:**
- Header có "X% Complete" + "Est ~Y min" (ETA dựa trên avg backend time)
- Progress bar dùng red→orange gradient (giống AI Video pattern)
- Mỗi step có numbered indicator: ✓ done (green) / ● working (red, spinner arc) / ○ pending (gray, just number)
- Mỗi step có **title + 1 dòng sub mô tả** kết quả/đang làm gì
- Tag privacy line phía dưới: *"Your data stays private. We never use your inputs to train AI."*
- Note background: 🔔 "Leave the app — we'll notify you when ready."
- Cancel link ở đáy body (text, không phải button)

## 5. Live Activity continuation (job runs background)

Khi backend chạy >30s, user có thể leave app. Bắt buộc thiết kế:

| Surface | Khi |
| --- | --- |
| **In-app banner** trên Home tab | User back về Home trong khi job đang chạy. Banner pinned trên đầu Body, gradient hồng, có progress + ETA + tap để return |
| **Dynamic Island compact** | Pill standard iOS, thumb + progress ring + % |
| **Dynamic Island expanded** | Long-press: thumb + title + scene X/Y + progress bar + ETA |
| **Lock Screen banner** | Frosted glass, app icon, "Creating your AI Album · 70% · ~90s left" + progress bar |
| **Push notification** | Khi xong: "Your AI Album is ready!" → tap mở Result |

**State changes Dynamic Island**:
- Generating → ✓ Album ready! → tap dismiss
- Hoặc ⚠ Retry needed (Auto retry chạy ngầm trước khi show)
- Hoặc ✕ Cancelled (nếu user cancel)

Pattern lấy từ Live Activity widget design v5.7.0 trong file Figma `Artimind - Impeccable Craft`.

## 6. Auto-retry + threshold (cho generation đa scene)

Khi feature generate ≥2 scene song song (AI Album = 6 scene), bắt buộc có:

1. **Auto retry per scene** — fail thì retry, không show error
2. **Threshold quyết định combine vs fail toàn bộ**:
   - Fail < 2 (≥ 5/6 success) → combine, ra video
   - Fail ≥ 2 (≤ 4/6 success) → reject toàn bộ, error screen + Retry CTA
3. **Skip slot trong combine** — giữ thứ tự scene_arc, bỏ qua slot fail

Đừng show từng scene's retry progress lên UI. User chỉ thấy "đang loading" → kết quả final.

## 7. Result screen — pattern "Show, Save, Share, Recreate"

Pattern này lấy từ Loved Ones Result + AI Video Result, áp dụng cho mọi feature generate:

```
┌────────────────────────┐
│ ← Result        􀈎     │  ← Top nav: back + title + save icon
├────────────────────────┤
│                        │
│   [Full-bleed media]   │  ← Video player auto-loop, hoặc Image
│        ● play          │
│                        │
│   "Forever" (title)    │  ← Cormorant Garamond 26pt overlay đáy
│   00:00 / 00:10 · 1080p│
│                        │
├────────────────────────┤
│ [Save]  [SHARE]  [↻]   │  ← Action row
└────────────────────────┘
```

- **Save** — secondary pill (dark bg) với 􀈎 icon, lưu xuống Photos library
- **Share** — primary pill (white bg, đen text) với 􀈂 icon, mở native share sheet
- **Recreate** (↻) — circle button bên phải, đổi theme/template để generate lại

Nếu feature có concept "another theme" → có thêm **Try another theme** ghost button ở dưới action row.

## 8. Error → Home recovery

Khi backend fail (timeout / API error / content filter), pattern recovery:

```
[Modal popup trên màn Processing]
Title: "Tạo video thất bại"
Body: "Đã xảy ra lỗi khi tạo video của bạn. Vui lòng thử lại."
CTA: "Về trang chủ" (red, full-width)
```

**Rule**: tap "Về trang chủ" quay về **tag/section gốc** (Moments + Wedding tag), KHÔNG quay về Home tab default. State của user đã đầu tư time/upload — phải giữ context.

## 9. Tab placement decisions

Nav bar Artimind đã full (Home / Moments / Loved Ones / Restore / Profile). Khi thêm feature mới:

| Option | Khi dùng |
| --- | --- |
| **Card trong Life Moments section (Home)** | Default cho v5.X.0 — minh hoạ tốt, không phá nav |
| **Tag mới trong Moments tab** | Template-based, có ≥3 template |
| **Floating "+" creation menu** | Last resort — feature cross-cutting |
| **Replace tab** | Phải có A/B data trước, không quyết một mình |

## 10. Copy tone

- **VN-first**, dùng tiếng Anh cho thuật ngữ kỹ thuật: `Theme picker`, `Paywall`, `Generate`, `Retry`, `Live Activity`.
- Title màn dùng **DM Sans SemiBold 24-26pt** — concise, action-oriented: "Add 2 photos" thay vì "Hãy thêm 2 ảnh của bạn"
- Sub-title dùng **DM Sans Regular 12-13pt** màu gray — giải thích/hint, không quá 1 câu
- Status text dùng **DM Sans Medium 14pt** — "Just a sec… the magic is happening ✨" — friendly, không quá đùa cợt
- Hero title (Theme picker, Paywall hero) dùng **Cormorant Garamond SemiBold 28-32pt** — premium, emotional: "Pick a vibe, let AI compose."
- Error text dùng **DM Sans Medium 12pt** + màu đỏ subtle (`r:0.95, g:0.55, b:0.55`)

## 11. Common pitfalls

| Pitfall | Đúng hơn |
| --- | --- |
| Gate paywall ở entry/tab | Gate ở step Generate (sau Upload) |
| Reset state khi cancel paywall | Giữ state — user không phải làm lại |
| Show progress bar trơn 0-100% | Timeline có numbered step + sub mô tả |
| Modal/toast cho validation field | Inline error tại field |
| Quay về Home default khi error | Quay về context gốc (tag/section) |
| Không có Live Activity cho job >30s | Bắt buộc design Dynamic Island + Lock Screen |
| Loại bỏ "Recreate" trên Result | Recreate là driver retention #1 — luôn có |

## 12. Output expected khi user hỏi anh

| User hỏi | Em deliver |
| --- | --- |
| "Design luồng X" | FigJam flowchart đầy đủ branching (validate, retry, paywall) + UI screens list |
| "Cover error states cho upload" | 3 states ảnh (PASS / 0 face / >1 face) hoặc 3 states audio (PASS / format / no track) |
| "Đặt paywall ở đâu?" | Mid-flow (sau Upload, trước Generate) + state preservation rules |
| "Loading screen như thế nào?" | 4-step timeline với done/working/pending + progress bar red→orange + ETA + privacy + notify |
| "Job chạy nền" | Live Activity (Dynamic Island compact + expanded + Lock Screen) + push noti + in-app banner |
