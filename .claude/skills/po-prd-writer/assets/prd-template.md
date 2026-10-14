<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- Phần 2: PRD Template — tách từ po-agent-bundle.md (skill gốc po-prd-writer) -->

# PHẦN 2: PRD Template (17 sections)

> **Khi nào dùng**: Khi user yêu cầu viết PRD mới, Claude copy template này và fill từng section dựa theo context user cung cấp. Tham khảo Phần 4 (Section Patterns) cho hướng dẫn chi tiết từng section.

> **Lưu ý quan trọng**: Output PRD luôn bằng **tiếng Anh**. Placeholder trong template dạng `[Bracket Text]` cần được thay bằng nội dung thực.

---

# [Feature Name] — PRD v[X.Y]

**PRODUCT REQUIREMENTS DOCUMENT**

**[Feature Name]**

[Product Name] Mobile Application

*PRD · Technical Spec · User Flow*

| **Document Version** | v[X.Y] |
| --- | --- |
| **Status** | Draft / In Review / Ready for Hand-off (Design + Engineering) / Shipped |
| **Last Updated** | [Month Day, Year] |
| **Owner** | Product Team |
| **Audience** | Designers (Section 15), Engineers (Sections 7–9, 13), QA (Sections 13, 14) |
| **Major change in v2.0** | [Brief description of major shift, e.g., "Replaced clinical Method with user-friendly measurement_type."] |
| **Major change in vX.Y** | [Brief description of latest major change] |

# Table of Contents

[Generated automatically or listed manually after content is final]

---

# 1. Overview

## 1.1 Purpose

This document defines the product requirements, technical specifications, and user flows for the [Feature Name] within the [Product Name] mobile application. The feature enables users to [primary capability], with [contextual differentiator].

## 1.2 Background

[3-5 sentences on the market/user context. Why this feature exists. Include relevant data, prior versions, or research that motivated this work.]

This version (vX.Y) [describes the specific change from previous version, with concrete reasoning — e.g., "replaces the previous X with Y because user research showed Z"].

## 1.3 Goals and Non-Goals

### Goals

- [Goal 1 — specific, observable]
- [Goal 2 — what user can do or experience]
- [Goal 3 — what data we capture]
- [Goal 4 — visualization/feedback we provide]
- [Goal 5 — edit/management capability]

### Non-Goals

- [Explicit out-of-scope item — feature planned for later version]
- [Out-of-scope — capability we deliberately do NOT offer]
- [Out-of-scope — adjacent feature handled elsewhere]
- [Out-of-scope — integration not yet supported]

## 1.4 Target Users

| **Persona** | **Profile** | **Primary Need** |
| --- | --- | --- |
| [Persona 1 name] | [Brief profile] | [What they need from this feature] |
| [Persona 2 name] | [Brief profile] | [What they need from this feature] |
| [Persona 3 name] | [Brief profile] | [What they need from this feature] |
| [Persona 4 name] | [Brief profile] | [What they need from this feature] |

## 1.5 Success Metrics

- [Primary metric, with target — e.g., "D7 retention of users who [use feature]: ≥40%"]
- [Engagement metric — e.g., "Median entries per active user per week: ≥3"]
- [Performance metric — e.g., "Time-to-complete primary flow: ≤25 seconds (p50)"]
- [Critical quality metric — e.g., "Non-default selection rate: ≥70% (confirms users engage actively, not just accept defaults)"]
- [Error rate — e.g., "Edit/delete error rate: <1% of total entries"]
- [Secondary outcome — e.g., "Article click-through from Result screen: ≥15%"]

---

# 2. Scope

## 2.1 In Scope

- [Screen/capability 1 — e.g., "Home dashboard card with latest reading, status, and mini chart"]
- [Screen/capability 2]
- [Screen/capability 3]
- [Screen/capability 4]
- [Screen/capability 5]
- [Cross-cutting capability — e.g., "Activity feed showing recent entries alongside other features"]

## 2.2 Out of Scope

- [Explicitly excluded — with rationale or future version note]
- [Excluded integration]
- [Excluded capability]
- [Excluded export/sharing]
- [Excluded notification, "tracked separately under X feature"]

---

# 3. Screen Inventory

The [Feature Name] feature spans [N] primary screens. Each is detailed in the User Flow and Functional Requirements sections.

| **#** | **Screen** | **Purpose** |
| --- | --- | --- |
| S1 | [Screen 1 name] | [Entry point. What it shows and primary action.] |
| S2 | [Screen 2 name] | [What user does here, what data is captured.] |
| S3 | [Screen 3 name] | [Confirmation/result. What it displays.] |
| S4 | [Screen 4 name] | [Modification capability.] |
| S5 | [Screen 5 name] | [Chronological/aggregate view.] |
| S6 | [Screen 6 name] | [Deep view: trend, analysis, history.] |

---

# 4. [Domain Concept] — [Subtitle if needed]

> Use this section if the feature has domain-specific business logic (e.g., classification rules, calculation logic, type/state dispatch). Otherwise, remove this section and renumber.

[Explain the core domain concept that drives the feature's behavior. 2-3 sentences plus an italic "why this matters" callout.]

*Why this matters: [concrete example showing why this concept is the key to feature correctness].*

## 4.1 The [N] [Concept] Types

| **Code** | **Display Name** | **Condition** | **[Unit/Property]** |
| --- | --- | --- | --- |
| [type_1] | [Display 1] | [When this applies] | [Unit or property] |
| [type_2] | [Display 2] | [When this applies] | [Unit or property] |
| [type_n] | [Display n] | [When this applies] | [Unit or property] |

## 4.2 Why We [Made This Design Choice]

[Prior design choice]:

- [User research finding 1 motivating change]
- [User research finding 2]
- [Logic/correctness issue with prior approach]

The new approach replaces [old] with [new]. [Brief rationale.]

## 4.3 Smart Default — [Selection Rule]

[Describe the default behavior, with rationale.]

| **[Condition window]** | **Default [field]** | **Rationale** |
| --- | --- | --- |
| [Range 1] | [default_value] | [Why this is safe/correct] |
| [Range 2] | [default_value] | [Why this is safe/correct] |

Implementation notes:

- [Note about timing/refresh behavior]
- [Note about timezone or locale]
- [Exclusion rule — what is NEVER auto-selected and why]
- [Memory/persistence behavior]

*Open question: [related question deferred to next version, with reasoning].*

---

# 5. [Reference Ranges / Calculation Rules]

> Use this section for tables, thresholds, formulas, or reference data the feature depends on. Remove and renumber if not applicable.

Classification (or [other rule]) depends on [domain concept §4]. [Brief explanation of how the reference data is used.]

## 5.1 [Category Names / Zone Names]

[N] [categories] are used across all [domain] types. Names are consistent so users learn one mental model.

| **ID** | **Display Name** | **Meaning** |
| --- | --- | --- |
| [id_1] | [Display 1] | [What this category means to user, with brief example if helpful] |
| [id_2] | [Display 2] | [Meaning] |
| [id_3] | [Display 3] | [Meaning] |

*Display Name vs Pill Label distinction (if applicable): [explain when long-form name vs short label is used].*

## 5.2 [Type 1] — [Reference Table]

Source: [Authoritative source for the thresholds — WHO, ADA, internal data]

| **Category** | **Range (unit A)** | **Range (unit B)** | **Equivalent** |
| --- | --- | --- | --- |
| [Cat 1] | [< X] | [< Y] | [Clinical/business equivalent] |
| [Cat 2] | [X – Y] | [...] | [...] |
| [Cat 3] | [...] | [...] | [...] |

## 5.3 [Type 2] — [Reference Table]

[Repeat structure per type. Each table cites its source.]

## 5.6 Dispatch Summary

The [classification/calculation] engine maps [domain key] to exactly one threshold table — single key, no compound conditions, no nested conditionals, no nullable returns.

| **[domain key]** | **Threshold table** | **Source** |
| --- | --- | --- |
| [type_1] | §5.2 | [Source] |
| [type_2] | §5.3 | [Source] |
| [type_n] | §5.n | [Source] |

[Optional: critical/edge thresholds independent of category dispatch.]

*Final thresholds must be validated against [authoritative sources] before release.*

---

# 6. User Flows

## 6.1 Primary Flow: [Most Frequent Action]

This is the most frequent flow and must be optimized for speed and clarity.

- User opens the app and lands on [S1].
- User taps [+ Add] on the [feature] card, OR [alternative entry point].
- App navigates to [S2]. [Field 1] defaults to [value]. [Field 2] defaults per [rule §X.Y].
- User taps the [field] to open [input mechanism] and enters the [value]. The [feedback indicator] updates in real time.
- User reviews or changes [secondary field]. Changing this re-runs [computation] immediately.
- User optionally adds [optional fields].
- User taps Save.
- If [critical condition], a confirmation modal appears before save.
- On save success, app navigates to [S3] showing the saved [entity], [feedback elements].
- From S3, user can tap [action 1] (→ Sn), [action 2] (→ Sn), or [secondary action].

## 6.2 Secondary Flow: [Modify/Review Existing]

- From [S5] or [S6], user taps an entry.
- App navigates to [S3] for that entry.
- User taps Edit. App navigates to [S4] with all fields pre-populated.
- User modifies any field. [Delete/Cancel action] enables [destructive op] with confirmation.
- User taps Save. Changes persist and user returns to [S3] with updated values, OR confirms deletion → [soft-delete behavior].

## 6.3 Tertiary Flow: [Review Trends / History]

- From [S1], user taps the [feature] card body.
- App navigates to [S6].
- User toggles between [range options].
- User reads [headline values]; explores [primary visualization].
- User reviews [secondary visualization] and scrolls [list].
- User taps See All on [list] → [S5] prefiltered.

---

# 7. Functional Requirements

> This section specifies behavior. Visual treatment (colors, chart styling, badge appearance) is in §10.

## 7.1 [S1 Name] (S1)

| **ID** | **Requirement** |
| --- | --- |
| FR-S1-01 | [Screen] MUST display [data] with [unit/format]. [Constraint or precision note.] |
| FR-S1-02 | [Screen] MUST display [secondary element] per §5.1 (e.g., 'Pre-diabetes'). |
| FR-S1-03 | [Screen] MUST render a [chart/visualization] visualizing [data]. Treatment: [reference to §10.X]. |
| FR-S1-04 | If user has no [data], [screen] MUST show an empty state with a primary [action] and no [other element]. |
| FR-S1-05 | Tapping [+ Add] MUST navigate to [S2]. |
| FR-S1-06 | Tapping the card body (outside Add button) MUST navigate to [S6]. |

## 7.2 [S2 Name] (S2)

Behavior requirements. Visual layout is in §10.X.

| **ID** | **Requirement** |
| --- | --- |
| FR-S2-01 | [Input field] MUST be [interaction pattern]. Tapping [element] MUST open [input mechanism]. Direct entry MUST validate against bounds in §8.6 — out-of-range entries display an inline error. |
| FR-S2-02 | [Dropdown/selector] MUST offer the [options] allowed for the active [context]: [option set A] for [context X]; [option set B] for [context Y]. Selecting a different option converts the displayed value using §8.5 formulas. |
| FR-S2-03 | Changing [field A] from [state 1] to [state 2] MUST automatically [side effect]. The value persists if within new bounds (§8.6); otherwise it is cleared. |
| FR-S2-04 | [Visual feedback] MUST update in real time as [trigger]. |
| FR-S2-05 | [Status pill / badge] MUST display the label from §10.X. Auto-updates from [inputs]. |
| FR-S2-06 | [Select group] MUST be a single-select chip group with [N] options: [list]. See §10.X for chip styling. Always required. |
| FR-S2-07 | On [S2] mount, [field] MUST be pre-selected by [rule §4.X]. [Exception condition] is NEVER auto-selected. The default does NOT auto-update if user lingers across the [boundary]. |
| FR-S2-08 | Changing [field] MUST re-run [computation] in real time. If the new [result] differs from the previous, show a non-blocking toast '[message template]' for 3 seconds. |
| FR-S2-09 | [Datetime field] MUST default to current device time. Tap opens native picker. Back-dating allowed up to [N] days. Future timestamps blocked (allow [tolerance] for clock drift). |
| FR-S2-10 | [Tags/multi-select] MUST be a multi-select chip group. Default = empty. Max [N] selections. '+ Add' opens a custom-input dialog ([validation rules]). |
| FR-S2-11 | Save button MUST be enabled only when [field 1] is set AND within bounds AND [field 2] is set. |
| FR-S2-12 | If [critical condition], Save MUST trigger a confirmation modal before persisting: '[message]' [Cancel │ Save anyway]. |
| FR-S2-13 | If [soft warning condition], Save MUST trigger a soft confirmation: '[message]' [Edit │ Save anyway]. |
| FR-S2-14 | On Save success, app MUST navigate to [S3] for the newly created entry, replacing [S2] on the navigation stack. |
| FR-S2-15 | Back navigation MUST prompt 'Discard changes?' [Keep editing │ Discard] if any field has been modified from its default. |

## 7.3 [S3 Name] (S3)

Behavior requirements. ⚠ NOTE: [any design deviation that needs §15 flagging].

| **ID** | **Requirement** |
| --- | --- |
| FR-S3-01 | [Main display] MUST display [stored value] converted to [display unit]. Unit MUST appear as plain text — [S3] is read-only. To change, user opens Edit (§7.6). |
| FR-S3-02 | [Metadata row] MUST show [data] as: [format spec]. Row is read-only. |
| FR-S3-03 | Status section MUST display [pill, icon, indicator] per §10.X. Section title is '[Title]'. |
| FR-S3-04 | Details section MUST list [N] rows: (a) [row 1]; (b) [row 2]. Previous [legacy element] MUST be removed (see §15). |
| FR-S3-05 | Recommendations section MUST display copy from §7.X table, keyed by [dispatch key]. Section header MUST include a 'Disclaimer' link. Copy MUST truncate at ~3 lines with 'More' affordance. |
| FR-S3-06 | Severity banners MUST appear at top when [conditions]. Critical banners fire independent of [dispatch], on absolute thresholds. |
| FR-S3-07 | Articles section MUST display up to [N] related cards filtered by [context], with 'See All' link. Each card MUST carry a '[disclaimer badge]' badge. |
| FR-S3-08 | Footer CTAs MUST be: [secondary CTA] (→ S4) and [primary CTA] (→ S1). |
| FR-S3-09 | [Design deviation note if any]. Out of scope for vX.Y — current design does not include [element]. |

## 7.4 [Display Format Tables]

> Use sub-sections like this for display strings, format conventions, or copy tables specific to functional behavior.

| **[Key]** | **Display** |
| --- | --- |
| [key_1] | [Display string with icon] |
| [key_2] | [Display string] |

## 7.5 [Copy Table — Recommendations / Messages]

Copy displayed in the [section] on [screen]. The (key 1 × key 2) tuple selects the message. All copy MUST be reviewed by [appropriate reviewer] before launch. Translation requires a separate localization pass.

Common rules:
- [Edge case in copy structure]
- [Tone/CTA rule for each message]

| **Key 1** | **Key 2** | **Message** |
| --- | --- | --- |
| [k1_a] | [k2_a] | [Concrete message text] |
| [k1_a] | [k2_b] | [Concrete message text] |
| ... | ... | ... |

## 7.6 [S4 Name] (S4)

| **ID** | **Requirement** |
| --- | --- |
| FR-S4-01 | All fields MUST pre-populate from the entry, including [snapshot fields] (not user's current default). |
| FR-S4-02 | Field validation, conversion, classification behavior identical to [S2]. |
| FR-S4-03 | [Delete affordance] MUST → confirmation modal. Confirm → soft-deleted (deleted_at set), user popped to previous screen, [N]-sec Undo toast appears. |
| FR-S4-04 | Save with no changes (clean state) → no API write, updated_at unchanged. |
| FR-S4-05 | Save with changes (dirty state) → API PATCH, updated_at refreshed. |
| FR-S4-06 | Recommendations and Articles sections do NOT appear on [S4]. |

## 7.7 [S5 Name] (S5)

[Continue FR-S5-XX pattern]

## 7.8 [S6 Name] (S6)

[Continue FR-S6-XX pattern]

---

# 8. Technical Specification

## 8.1 Data Model — [EntityName]

| **Field** | **Type** | **Required** | **Notes** |
| --- | --- | --- | --- |
| id | UUID | Yes | Server-generated. Primary key. |
| user_id | UUID | Yes | FK to user table. |
| [field] | [type] | Yes/No | [Notes on validation, source, defaults] |
| [enum_field] | enum | Yes | [option_1] │ [option_2] │ ... |
| [derived_field] | enum | Yes (derived) | Computed server-side from [inputs]. |
| created_at | datetime | Yes | Server timestamp. |
| updated_at | datetime | Yes | Server timestamp, refreshed on edit. |
| deleted_at | datetime | No | Soft delete. Null for active entries. [N]-day retention. |

## 8.2 User Preferences ([Feature]-related)

| **Field** | **Type** | **Notes** |
| --- | --- | --- |
| [pref_field] | enum | [options]. Default = [value]. User can override in Settings. |

## 8.3 API Endpoints

| **Method** | **Path** | **Description** |
| --- | --- | --- |
| POST | /api/v1/[resource] | Create. Server computes [derived fields]. |
| GET | /api/v1/[resource]/:id | Fetch single. |
| GET | /api/v1/[resource]?[filters] | List with cursor pagination. |
| PATCH | /api/v1/[resource]/:id | Update. Recomputes [derived] if [trigger fields] change. |
| DELETE | /api/v1/[resource]/:id | Soft delete ([N]-day retention). |
| GET | /api/v1/[resource]/summary?range=... | Aggregated stats for [S6]. |
| GET | /api/v1/[resource]/latest | Most recent for [S1]. |

## 8.4 [Algorithm Name] (Pseudocode)

```
function [algorithmName]([inputs]):
  // Step 1: [pre-processing]
  if [condition]:
    [return special case]

  // Step 2: [normalization]
  [normalized] = [transformation of inputs]

  // Step 3: [side effect / banner check]
  banner = null
  if [trigger]: banner = "[banner_id]"

  // Step 4: [edge case]
  if [edge condition]: return { [result]: "[value]", banner: banner }

  // Step 5: [Main dispatch]
  switch [dispatch_key]:
    case "[type_1]":      // §X.Y — [source]
      if [threshold check]: return { [result]: "[value]", banner: banner }
      ...
    case "[type_2]":
      ...
```

## 8.5 [Unit Conversion / Formulas]

Canonical storage: [unit] for [contexts]; [other unit] for [other context]. Always store value_canonical AND the original (value_entered, unit_entered) to preserve precision.

### [Applicability Table]

| **[dispatch_key]** | **Allowed Units** | **Canonical Storage** |
| --- | --- | --- |
| [type_1] | [unit A], [unit B] | [unit A] |
| [type_n] | [unit X], [unit Y] | [unit X] |

### Conversion Formulas

- **[Context 1]:** [unit A] = [unit B] × [factor]    |    [unit B] = [unit A] ÷ [factor]
- **[Context 2]:** [formula 2]

Display rounding: [unit A] → [decimals]; [unit B] → [decimals]. Storage MUST retain full precision; rounding applies only at display time.

## 8.6 Validation Rules

| **Field** | **Rule** |
| --- | --- |
| [field] ([unit]) | [min] ≤ value ≤ [max]. Out of bounds blocked at input. |
| [field] ([other unit]) | [min] ≤ value ≤ [max]. |
| [crisis field] | [trigger condition] → mandatory confirmation modal before save. |
| [field] | Required. Default per [rule §X.Y]. Save disabled if unset. |
| recorded_at | Not in future (allow [tolerance] for clock drift). Back-date allowed up to [N] days. |
| tags | Max [N] tags. Each tag [min]–[max] chars, [allowed chars]. |

## 8.7 Caching and Offline Behavior

- [Cache rule for primary screen — instant render]
- New entries created offline MUST be queued and synced on next connectivity. Show 'Pending sync' indicator on the entry.
- Edit and delete of unsynced entries MUST be applied locally and reconciled on sync.
- Conflict resolution: [strategy — e.g., server timestamp wins]. Surface a non-blocking toast.

## 8.8 Privacy and Security

- All [feature] data MUST be encrypted at rest (AES-256) and in transit (TLS 1.2+).
- [Sensitive data] MUST NOT be logged in plain text in analytics or crash reports.
- Data export and deletion requests MUST comply with applicable regulations (GDPR, [region-specific regulations]).
- '[Disclaimer]' badge MUST appear on all [content type] content.

---

# 9. Business Rules Summary

| **ID** | **Topic** | **Rule** |
| --- | --- | --- |
| BR-01 | [Classification] | Determined by tuple ([inputs]). [Key] selects the threshold table per §X.Y. See §8.4 pseudocode. |
| BR-02 | [Required field] | User must select [field] before save. Default is set by [rule §X.Y]. [Exception]. |
| BR-V01 | [Validation - required] | Save disabled if [field] unset. |
| BR-V02 | [Validation - bounds] | Per §8.6. Out-of-range rejected at input. |
| BR-V03 | [Validation - sanity check] | Values [out of normal range] trigger soft confirmation before save. |
| BR-V04 | [Validation - crisis] | [Critical condition] triggers crisis confirmation before save. |
| BR-V05 | [Validation - date] | Back-date ≤ [N] days. Future blocked. |
| BR-U01 | [Unit/locale - default] | [Default unit] for [context]. Fixed defaults, not auto-detected. User can override in Settings. |
| BR-U02 | [Unit/locale - toggle] | [Toggle behavior]. Does NOT change user's default preference. |
| BR-U03 | [Storage] | Store canonical value AND original. Convert on display. |
| BR-D01 | [Soft delete] | [N]-day trash retention. |
| BR-D02 | [Undo] | [N]-second Undo toast after delete. |
| BR-L01 | [Legal disclaimer] | '[Disclaimer text]' badge wherever [content] appears. |

---

# 10. UI / Design Specification

## 10.1 Design Tokens — [Category]

| **Token** | **Hex** | **Usage** |
| --- | --- | --- |
| [namespace].[name] | #XXXXXX | [Where used] |
| brand.primary | #XXXXXX | Header background, primary CTA, FAB. |
| surface.card | #FFFFFF | All card surfaces with 12px corner radius and subtle shadow. |
| text.primary | #XXXXXX | Primary text and headings. |
| text.secondary | #XXXXXX | Labels and helper text. |

## 10.2 [Component Pattern — e.g., Chip Group]

Single-select horizontal chip group on the [S2] and [S4] screens. [Visual treatment description.]

| **Chip** | **Icon** | **Label** |
| --- | --- | --- |
| [chip_1] | [emoji or icon] | [Label] |
| [chip_n] | [icon] | [Label] |

## 10.3 [Field Layout]

[Component description with 3 rows or sections]:
- Header row: [contents]
- Value row: [contents]
- Status row below: [contents]

On [Add] and [Edit], the status row updates live as the user types.

## 10.4 [Color Bar / Visual Indicator]

Used on [S2], [S4], [S3], and [S6]. [Description of visual element.]

- [Behavior 1]
- [Behavior 2]
- [Tap target] opens [overlay] explaining the [reference data] for the current [context].

## 10.5 [Pill Copy / Label Mapping]

Short label shown next to the [icon] on [screens]. Copy is intentionally brief — the [color/visual] carries the context.

| **ID** | **Pill Label** | **Notes** |
| --- | --- | --- |
| [id_1] | [Label 1] | Paired with [color token] on pill background. |

## 10.6 Typography

| **Role** | **Size / Weight** | **Example** |
| --- | --- | --- |
| Display value | 48 / Bold | [Where] |
| Card value | 24 / SemiBold | [Where] |
| Section title | 16 / SemiBold | 'Status', 'Details', 'Recommendations' |
| Body | 14 / Regular | [Where] |
| Caption | 12 / Regular | Timestamps, helper text |

## 10.7 [Chart Treatment]

Visual treatment for the [chart type] used on [screens].

### [Chart context 1]
- [Treatment 1]
- [Treatment 2]

### [Chart context 2]
- [Treatment 1]
- [Treatment 2]

## 10.8 Empty, Loading, and Error States

| **Screen** | **State** | **Treatment** |
| --- | --- | --- |
| [S1] | Empty | Icon + '[Empty message]' + [+ Add] |
| [S1] | Loading | Skeleton bars matching card layout |
| [S6] | Empty | Friendly illustration + CTA to [primary action] |
| [S6] | Empty range | Inline message '[Empty range message]' on both [visualizations] |
| [S6] | Error | Inline retry banner; chart shows last cached data with stale indicator |
| [S5] | Empty (filter) | '[Filter empty message]' + clear-filter action |
| [Add/Edit] | Network error | Toast: '[Offline message]' Entry persists in offline queue. |

## 10.9 Accessibility

- All [color-coded categories] MUST be paired with text labels or shape cues. Never rely on color alone.
- [Visual indicator] MUST be screen-reader announced as '[announcement template]'.
- [Input field] MUST be screen-reader announced as '[announcement template]' after each save-able change.
- Tap targets MUST be ≥ 44 × 44 px.
- Form fields MUST support OS-level dynamic type scaling up to 200%.
- Charts MUST provide a 'Show as table' alternative for screen-reader users.

---

# 11. Analytics Events

| **Event Name** | **Trigger** | **Properties** |
| --- | --- | --- |
| [feature]_add_opened | User opens [S2] | source: [enum of entry points] |
| [feature]_[field]_changed | User changes [field] on [S2]/[S4] | from_value, to_value, [side effect bool] |
| [feature]_saved | Successful save on [S2] | [list of properties capturing entry state] |
| [feature]_crisis_warning_shown | Critical-range warning displayed | [properties] |
| [feature]_result_viewed | [S3] rendered | record_id, [classification properties] |
| [feature]_edit_opened | User opens [S4] | entry_id |
| [feature]_edit_saved | Successful edit | record_id, fields_changed[] |
| [feature]_deleted | Successful delete | record_id, age_of_record_days |
| [feature]_detail_viewed | [S6] opened | range_default |
| [feature]_range_toggled | Range changed on [S6] | from_range, to_range |
| [feature]_article_clicked | Article tap on [S3] | article_id, [context] |

---

# 12. Edge Cases and Open Questions

## 12.1 Edge Cases

- [Edge case 1: switching context after entering value — what happens to value?]
- [Edge case 2: switching unit on Add/Edit — display vs canonical behavior]
- [Edge case 3: multiple entries within same minute — ordering rule]
- [Edge case 4: device timezone change after logging]
- [Edge case 5: backdating boundary]
- [Edge case 6: crisis value with non-default context — banner behavior]
- [Edge case 7: network unavailable on Save — queue behavior]

## 12.2 Risks

| **Risk** | **Impact** | **Mitigation** |
| --- | --- | --- |
| [Risk 1: users accept default for wrong context] | [Misclassification → wrong result] | [Analytics flag, onboarding tip, default selection rate target] |
| [Risk 2: smart default mis-applies in edge time window] | [Specific misclassification scenario] | [Conservative default rule, analytics tracks 'was_default_overridden'] |
| [Risk 3: users interpret content as medical/legal advice] | [Regulatory and trust risk] | [Persistent disclaimer badge + onboarding + legal review] |
| [Risk 4: offline data loss on uninstall before sync] | [User loses entries] | [Daily local backup; warn on uninstall flow where supported] |

## 12.3 Open Questions

- [Open question 1 about copy interpretation. Decision: [current decision], but flag for review by [stakeholder].]
- [Open question 2 about smart default learning behavior. Deferred to v2.]
- [Open question 3 about additional display formats or derived values.]
- [Open question 4 about quick-input shortcuts.]
- [Open question 5 about anti-pattern warnings.]
- [Open question 6 about localization differences per region.]

---

# 13. Test Cases — [Engine Name]

QA MUST verify every row passes. Cases cover boundary conditions, [other case types], [dispatch], [crisis thresholds], and [smart-default behavior]. [N] test cases total.

## 13.1 [Category 1] — Boundary Cases

| **#** | **Value** | **Unit** | **[dispatch_key]** | **Expected [result]** |
| --- | --- | --- | --- | --- |
| TC-01 | [value] | [unit] | [type] | [result] |
| TC-02 | [value] | [unit] | [type] | [result] (lower boundary) |
| TC-03 | ... | ... | ... | ... |

## 13.2 [Category 2 — Unit Conversion Cases]

| **#** | **Value** | **Unit** | **[dispatch_key]** | **Expected [result]** |
| --- | --- | --- | --- | --- |
| TC-17 | [value] | [other unit] | [type] | [result] (boundary in [unit]) |

## 13.3 [Category 3 — Edge Type Cases]

[More TC tables for specific dispatch types]

## 13.4 [Category 4 — Crisis/Special Thresholds]

| **#** | **Value** | **Unit** | **[dispatch]** | **Expected outcome** |
| --- | --- | --- | --- | --- |
| TC-28 | [value] | [unit] | [type] | [result]; [special UI behavior] MUST appear before save |

## 13.5 [Category 5 — Smart Default Cases]

| **#** | **[Condition]** | **Expected default** | **Notes** |
| --- | --- | --- | --- |
| TC-32 | [time/condition] | [expected] | [Why this case matters — boundary, edge, conservative fallback] |

---

# 14. Acceptance Criteria

Each screen below has explicit AC that QA validates against. FR IDs in §7 describe WHAT; AC IDs below describe HOW to verify. An AC passes when its statement is observable and reproducible.

## 14.1 [S1 Name] (S1)

- AC-S1-01: With ≥1 saved entries, [screen] displays [data]. Verify with TC-XX sample.
- AC-S1-02: [Element] shows correct [property] per §X.Y + §X.Y.
- AC-S1-03: [Chart/visualization] renders [behavior] and applies treatment from §X.Y.
- AC-S1-04: Empty state (zero entries ever) shows [empty UI] + [+ Add], and [chart] is NOT rendered.
- AC-S1-05: Tap [+ Add] → [S2] opens. Tap card body → [S6] opens.

## 14.2 [S2 Name] (S2)

- AC-S2-01: On fresh open, [field 1] = [default] (±5s), [field 2] = result of smart-default rule (§4.X) — [scenario]. [Field 3] = user's default per §8.X. [Field 4] empty.
- AC-S2-02: Tap on [field] opens [input]. Entering out-of-bounds shows inline error and disables Done.
- AC-S2-03: Tap unit dropdown shows allowed units for active [context]. Selecting a different unit converts displayed value using §8.5 (test with [example]).
- AC-S2-04: [Visual indicator] moves in real time as [trigger]. Switching [context] re-runs classification — verify TC-XX → TC-XX transition.
- AC-S2-05: Selecting [special context] changes [related field] and resets per FR-S2-XX.
- AC-S2-06: Smart-default verification — open [S2] at [time A] local → [chip A] selected; open at [time B] local → [chip B] selected (test TC-XX and TC-XX).
- AC-S2-07: Save with [crisis value] → crisis modal appears. Tap Save anyway → entry persisted. Tap Cancel → return to form with value preserved.
- AC-S2-08: Save with [soft warning value] → soft confirmation appears.
- AC-S2-09: Save success → [S3] opens with the new entry. Back from [S3] lands on [S1], not [S2].
- AC-S2-10: Back with modified form → 'Discard changes?' prompt. Discard exits without save.

## 14.3-14.6 [Continue per screen]

[Repeat AC structure for S3, S4, S5, S6 - each AC references FR or TC where applicable]

## 14.7 Offline & Sync

- AC-OFF-01: Save with no network → entry queued locally, toast 'Saved offline. Will sync when online.', entry appears in lists with 'Pending sync' indicator.
- AC-OFF-02: When network restored, queued entries sync automatically. Indicator disappears on success.
- AC-OFF-03: Edit of unsynced entry applies locally; reconciled on sync.

---

# 15. Notes for Design Review

> This section flags every place where the current design needs updating to match this PRD. Each note has an Action for designer.

## 15.1 [Screen / Component] — [Issue Title]

Current design shows: [description of current state].

After [vX.Y] refactor: [description of new state].

Rationale: [why the change is needed].

**Action for designer**: [Concrete action — rebuild frame, delete element, update component, etc.]

## 15.2 [S2] — Field Order

Current design order is: [current order]. After the vX.Y refactor, the recommended order is:
- [Field 1]
- [Field 2]
- ...

Rationale: [reasoning, e.g., "primary input first; classification context follows; defaults demote less-touched fields"].

**Action for designer**: [Specific frames to rebuild, fields to delete, elements to add.]

## 15.3 [Continue per design change]

[Repeat structure for each design adjustment needed]

## 15.N Toast & Modal Patterns

Spec calls for several toasts and modals not currently in the design system:
- [Crisis confirmation modal (§FR-S2-12)]: [purpose]
- [Soft confirmation modal (§FR-S2-13)]: [purpose]
- [Reclassified toast (§FR-S2-08)]: [duration and content]
- [Saved offline toast (§AC-OFF-01)]
- [Deleted — Undo toast (§FR-S4-03)]: [duration and behavior]

**Action for designer**: design these as a reusable toast/modal kit. Coordinate with engineering on accessibility and motion specs.

---

# 16. Rollout Plan

| **Phase** | **Audience** | **Scope** |
| --- | --- | --- |
| Alpha | Internal team | All [N] screens, mock data, no analytics |
| Beta | 5% production users | Real data, full analytics, ads disabled |
| GA — vX.Y | 100% users | Full feature set as specified in this document |
| vX.Y+1 (planned) | 100% users | [Future capabilities planned for next version] |

---

# 17. Appendix

## 17.1 Glossary

- **[Term 1]:** [Definition]
- **[Term 2]:** [Definition]
- **[Acronym]:** [Expansion]. [What it means in context.]

## 17.2 References

- [Authoritative source 1 — standards body, paper, internal doc]
- [Authoritative source 2]
- [Internal spec source — e.g., parent feature spec with version]

## 17.3 Document Change Log

| **Version** | **Date** | **Author** | **Changes** |
| --- | --- | --- | --- |
| v1.0 | [Date] | Product Team | Initial PRD + Spec + Flow based on [source]. |
| v2.0 | [Date] | Product Team | [Major change description] |
| v2.1 | [Date] | Product Team | [Minor change description] |
| v3.0 | [Date] | Product Team | Hand-off ready. [Restructured/added sections]. |
| vX.Y | [Date] | Product Team | [Latest changes with REMOVED / ADDED / REPLACED markers] |

---
