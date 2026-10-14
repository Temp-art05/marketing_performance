<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- C2 — tách từ po-agent-bundle.md (skill po-metrics-analysis v1.3) -->

# Tracking Spec — [Feature Name]

| **Document Version** | v1.0 |
| --- | --- |
| **Status** | Draft / Ready for Implementation / Implemented / Validated |
| **Owner (PO)** | [Your name] |
| **Last Updated** | [YYYY-MM-DD] |
| **Related PRD** | [Link to PRD] |
| **Related Metrics Plan** | [Link to Metrics_Plan doc] |
| **Analytics Platform** | Firebase Analytics + BigQuery export |
| **Target Release** | [vX.Y / Sprint N] |

---

## 1. Overview

This document specifies all analytics events to be implemented for [Feature Name]. It is the single source of truth for engineers implementing tracking and QA validating data flow.

**Conventions:**
- All event names use `snake_case`, max 40 characters
- All parameter names use `snake_case`, max 40 characters, max 100 char values
- Max 25 parameters per event (Firebase limit)
- Max 25 user properties per project (Firebase limit)
- Reserved prefixes (`firebase_`, `google_`, `ga_`) MUST NOT be used
- All events must be validated in Firebase DebugView before release

---

## 2. Event Naming Convention

**Company-wide convention**: Every event MUST be prefixed with the screen name, followed by element + action suffix. Format: `[screen]_[element]_[action]` or `[screen]_[action]`.

### 2.1 Event types and patterns

| **Event type** | **Format** | **Example** |
| --- | --- | --- |
| **Screen view** (user lands on screen) | `[screen]_scr` | `video_generation_scr` |
| **Element display** (UI element appears) | `[screen]_[element]_display` | `video_generation_result_display` |
| **Button click** (tap on button with clear boundary) | `[screen]_[element]_btn_click` | `video_generation_close_btn_click`, `video_generation_home_btn_click` |
| **Non-button click** (tap on link/card/icon/image) | `[screen]_[element]_click` | `video_generation_play_click`, `video_generation_try_again_click`, `video_generation_report_click` |
| **Non-click action** (swipe, scroll, long-press, drag) | `[screen]_[action]` | `video_generation_swipe`, `video_generation_scroll` |
| **Success result** (action completed successfully) | `[screen]_[action]_success` | `video_generation_save_success` |
| **Fail result** (action failed) | `[screen]_[action]_fail` | `video_generation_save_fail` |

### 2.2 Naming rules

1. **Screen prefix is mandatory** — every event starts with screen name in snake_case (e.g., `video_generation`, `home`, `farm_main`, `inventory`)
2. **Use `_scr` for screen views** (NOT `_opened`, NOT `_view`, NOT `_screen_view`)
3. **Use `_display` for UI elements appearing** (modal opens, banner shows, result renders)
4. **Distinguish btn_click vs click**:
   - `_btn_click`: actual button component (has button styling, clear CTA)
   - `_click`: tap target that isn't styled as a button (link text, card, icon, image, list row)
5. **Non-click actions** use the verb directly: `swipe`, `scroll`, `long_press`, `drag`, `pinch`, `pull_to_refresh`
6. **Success/fail are separate events** (NOT a status param):
   - `video_generation_save_success` ✅
   - `video_generation_save_fail` ✅
   - `video_generation_save` with `status=success|fail` param ❌ (don't use this pattern)
7. **All snake_case**, no camelCase, no kebab-case, no UPPERCASE
8. **Max 40 chars** (Firebase limit) — if screen name is long, abbreviate consistently project-wide

### 2.3 Element naming sub-rules

When using `[screen]_[element]_[action]`, element name should be:
- **Specific enough** to identify which element (`close_btn` not `btn`, `play` not `action1`)
- **Consistent across screens** (always `close_btn` for X icon, always `home_btn` for home navigation)
- **Concise** (1-3 words max): `close_btn`, `try_again`, `report`, `play`, `result`

### 2.4 Examples — full event set for one screen

For a "Video Generation" screen, the typical event set:

```
video_generation_scr                        # Screen viewed
video_generation_result_display             # Generation result appears
video_generation_loading_display            # Loading state shown
video_generation_error_display              # Error state shown
video_generation_play_click                 # User taps play (on video preview)
video_generation_pause_click                # User taps pause
video_generation_try_again_click            # User taps "Try Again" link
video_generation_report_click               # User taps "Report" link
video_generation_close_btn_click            # User taps X button
video_generation_home_btn_click             # User taps home button
video_generation_save_btn_click             # User taps save button
video_generation_save_success               # Save completed successfully
video_generation_save_fail                  # Save failed
video_generation_share_btn_click            # User taps share
video_generation_swipe                      # User swipes (on carousel/gallery)
```

### 2.5 What NOT to do

❌ **Wrong patterns:**
- `clickPlayButton` (camelCase)
- `VIDEO_GEN_PLAY` (uppercase)
- `play_click` (missing screen prefix)
- `video_generation_play_button_click` (inconsistent — use `btn` abbreviation)
- `video_gen_play` (inconsistent abbreviation of screen name)
- `event_video_play` (redundant `event_` prefix)
- `video_generation_screen_view` (should be `video_generation_scr`)
- `video_generation_play_clicked` (past tense — use `click`, not `clicked`)
- `video_generation_save` with `status=success|fail` param (use 2 events instead)

---

## 3. Events to Implement

> Replace `[screen]` with the actual screen name (e.g., `video_generation`, `home`, `farm_main`). Replace `[element]` with the actual element name.

### 3.1 Screen View Events

| **Event Name** | **Trigger** | **Parameters** | **User Properties Updated** |
| --- | --- | --- | --- |
| `[screen]_scr` | User lands on the screen (first time in session) | `source: string` (home \| fab \| deeplink \| notification \| tutorial), `is_first_time: bool`, `user_level: int` | `last_[screen]_view_date` |

### 3.2 Element Display Events

UI elements appearing on screen (modal, banner, result panel, loading state, error state, empty state).

| **Event Name** | **Trigger** | **Parameters** |
| --- | --- | --- |
| `[screen]_[element]_display` | UI element renders/becomes visible | `display_reason: string` (initial_load \| user_action \| auto_trigger), `element_state: string` (loading \| ready \| error \| empty) |
| `[screen]_result_display` | Result/output appears (e.g., generation result, search result) | `result_count: int`, `time_to_display_ms: int`, `was_cached: bool` |
| `[screen]_error_display` | Error state shown to user | `error_type: string`, `error_code: string` |
| `[screen]_loading_display` | Loading state shown | `expected_duration_ms: int` |
| `[screen]_empty_display` | Empty state shown | `empty_reason: string` (no_data \| no_results \| filter_no_match) |

### 3.3 Button Click Events

Click on actual button components (clear button styling, primary CTA).

| **Event Name** | **Trigger** | **Parameters** |
| --- | --- | --- |
| `[screen]_close_btn_click` | User taps close (X) button | `time_on_screen_ms: int` |
| `[screen]_home_btn_click` | User taps home navigation button | `time_on_screen_ms: int` |
| `[screen]_back_btn_click` | User taps back button | `time_on_screen_ms: int` |
| `[screen]_[primary_action]_btn_click` | User taps primary CTA (save, submit, confirm, generate) | `time_to_action_ms: int`, `[action_specific_params]` |
| `[screen]_cancel_btn_click` | User taps cancel | `time_on_screen_ms: int` |

### 3.4 Non-Button Click Events

Click/tap on elements that aren't buttons (links, cards, icons, images, list rows).

| **Event Name** | **Trigger** | **Parameters** |
| --- | --- | --- |
| `[screen]_play_click` | User taps play icon (video, audio) | `media_id: string`, `media_type: string` |
| `[screen]_try_again_click` | User taps "Try Again" link | `previous_failure_reason: string` |
| `[screen]_report_click` | User taps "Report" link | `report_target_id: string` |
| `[screen]_[card]_click` | User taps a card | `card_id: string`, `card_position: int`, `card_type: string` |
| `[screen]_link_click` | User taps a hyperlink | `link_url: string`, `link_text: string` |

### 3.5 Non-Click Action Events

Actions that aren't clicks: swipe, scroll, long-press, drag, pinch.

| **Event Name** | **Trigger** | **Parameters** |
| --- | --- | --- |
| `[screen]_swipe` | User swipes (carousel, gallery, pagination) | `direction: string` (left \| right \| up \| down), `from_index: int`, `to_index: int` |
| `[screen]_scroll` | User scrolls (track deep scroll) | `scroll_depth_percent: int` |
| `[screen]_long_press` | User long-presses an element | `element_id: string`, `element_type: string` |
| `[screen]_drag` | User drags an element | `from_position: string`, `to_position: string` |
| `[screen]_pull_to_refresh` | User pulls to refresh | none |

### 3.6 Action Result Events (Success / Fail Pairs)

For actions with success/fail outcomes, use TWO separate events (NOT a status param).

| **Event Name** | **Trigger** | **Parameters** |
| --- | --- | --- |
| `[screen]_[action]_success` | Action completed successfully | `duration_ms: int`, `[action_specific_params]` |
| `[screen]_[action]_fail` | Action failed | `failure_reason: string` (network_error \| validation_error \| insufficient_resources \| timeout \| server_error \| other), `error_code: string`, `attempt_count: int` |

**Examples:**
- `video_generation_save_success` / `video_generation_save_fail`
- `farm_plot_plant_success` / `farm_plot_plant_fail`
- `shop_purchase_success` / `shop_purchase_fail`
- `login_submit_success` / `login_submit_fail`

### 3.7 Decision / Choice Events

When user makes a meaningful selection (NOT a button click).

| **Event Name** | **Trigger** | **Parameters** |
| --- | --- | --- |
| `[screen]_[choice]_select` | User selects an option | `choice_type: string`, `choice_value: string`, `available_options: int`, `time_to_decide_ms: int` |
| `[screen]_setting_change` | User changes a setting | `setting_name: string`, `from_value: string`, `to_value: string` |
| `[screen]_filter_apply` | User applies a filter | `filter_type: string`, `filter_value: string` |

### 3.8 Engagement / Session Events

Engagement quality and session-level events on this screen.

| **Event Name** | **Trigger** | **Parameters** |
| --- | --- | --- |
| `[screen]_session_end` | User leaves the screen | `duration_seconds: int`, `actions_performed: int`, `exit_method: string` (back \| home \| close \| timeout) |
| `[screen]_dismiss` | User closes screen without core action | `time_on_screen_ms: int`, `last_interaction: string` |

---

## 4. User Properties

Set these on the user profile for segmentation in Firebase Analytics.

| **Property Name** | **Type** | **Updated When** | **Possible Values** |
| --- | --- | --- | --- |
| `feature_first_used_date` | string (ISO date) | First time user opens feature | YYYY-MM-DD |
| `feature_usage_tier` | string | Daily recompute | none \| occasional \| regular \| power |
| `last_[feature]_action_date` | string (ISO date) | Each core action | YYYY-MM-DD |
| `total_[feature]_actions` | int | Each core action | 0 - unlimited |

**Note**: Firebase has a max of 25 user properties per project. Audit current usage before adding new ones.

---

## 5. Parameter Definitions (Standard Catalog)

All parameters MUST follow the company-wide naming convention. Refer to the Firebase Analytics Guide for full rules. Below is the standard catalog applied across all events.

### 5.1 General Rules

- All names: **snake_case**, max 40 chars
- All string values: max 100 chars
- Max 25 params per event
- Numbers as `int`/`double`, NOT string-encoded numbers
- `null` NOT allowed → use default value or omit the param

### 5.2 Context / Source Parameters

| **Parameter** | **Type** | **Description** | **Example values (enum)** |
| --- | --- | --- | --- |
| `source` | string | Where user came from | `home`, `notification`, `deeplink`, `tutorial`, `search`, `fab` |
| `referrer_screen` | string | Previous screen ID | `home_scr`, `inventory_scr` |
| `entry_method` | string | How action was triggered | `tap`, `swipe`, `auto`, `deeplink`, `notification` |

### 5.3 Entity Identification

> **Rule**: Always use `<entity>_id` (entity-prefixed), NOT generic `id`.

| **Parameter** | **Type** | **Description** | **Example** |
| --- | --- | --- | --- |
| `<entity>_id` | string | Specific entity ID | `video_id`, `crop_id`, `plot_id`, `quest_id`, `item_id` |
| `<entity>_type` | string | Entity category | `video_type`, `crop_type`, `quest_type` |
| `<entity>_name` | string | Display name | `video_name`, `item_name` |
| `<entity>_category` | string | Sub-classification | `item_category`, `crop_category` |

### 5.4 Time / Duration

> **Rule**: Always include unit suffix (`_ms` or `_seconds`).

| **Parameter** | **Type** | **Description** | **Example** |
| --- | --- | --- | --- |
| `duration_ms` | int | Action duration in milliseconds | 1500 |
| `time_to_action_ms` | int | From screen open to action | 3200 |
| `time_on_screen_ms` | int | Time user spent on screen | 45000 |
| `elapsed_seconds` | int | Long durations (>1 min) in seconds | 180 |
| `timestamp_ms` | int | Unix timestamp in ms | 1748345678901 |

### 5.5 Count / Quantity / Position

| **Parameter** | **Type** | **Description** | **Example** |
| --- | --- | --- | --- |
| `<thing>_count` | int | Count of something | `result_count`, `attempt_count`, `tag_count` |
| `position` | int | Position in list (0-indexed) | 0, 1, 2 |
| `index` | int | Index (0-indexed) | 0, 1, 2 |
| `total_<thing>` | int | Total (paired with position) | `total_results`, `total_pages` |
| `value` | int/double | Generic numeric value | 100, 99.5 |
| `step_number` | int | Step in funnel/tutorial | 1, 2, 3 |

### 5.6 Status / Outcome (for `_fail` events only)

| **Parameter** | **Type** | **Description** | **Example values (enum)** |
| --- | --- | --- | --- |
| `failure_reason` | string (enum) | Why action failed — **REQUIRED in all `_fail` events** | `network_error`, `validation_error`, `insufficient_resources`, `timeout`, `server_error`, `user_cancelled`, `other` |
| `error_code` | string | Detailed error code | `E_NETWORK_001`, `400`, `500` |
| `error_message` | string | Sanitized error message (NO raw user input) | `network_timeout`, `invalid_input` |
| `state` | string | UI state | `loading`, `ready`, `error`, `empty` |

> **Note**: Do NOT use `success: bool` or `status: success|fail` parameters. Success and fail are TWO separate events (`<screen>_<action>_success` and `<screen>_<action>_fail`).

### 5.7 Boolean Flags

> **Rule**: Boolean MUST use `is_`, `has_`, `was_`, or `should_` prefix. No `_flag`, `_bool`, `_yn` suffixes.

| **Prefix** | **Use case** | **Example** |
| --- | --- | --- |
| `is_<x>` | Current state | `is_first_time`, `is_premium`, `is_logged_in`, `is_offline` |
| `has_<x>` | Ownership/existence | `has_subscription`, `has_completed_tutorial`, `has_unread` |
| `was_<x>` | Historical state | `was_cached`, `was_backdated`, `was_default_overridden` |
| `should_<x>` | Conditional | `should_skip_intro`, `should_show_tutorial` |

### 5.8 User Context (auto-include when relevant)

Firebase auto-sends: `app_version`, `os_version`, `device_model`, `country`, `language`, `platform`. **Do NOT duplicate in event params.**

Add these to events when relevant:

| **Parameter** | **Type** | **When to include** |
| --- | --- | --- |
| `user_level` | int | When game progression matters for the event |
| `user_tier` | string (`free` \| `premium` \| `vip`) | When user tier affects behavior |
| `session_id` | string (UUID) | When within-session tracking needed |
| `session_number` | int | For cohort analysis (1, 2, 3...) |

### 5.9 Forbidden Parameters

#### Privacy / PII (NEVER include)
- Email, phone number, full name, physical address
- Government IDs, payment card info
- Free-text user input (may contain PII)
- Precise location (lat/long) without explicit consent
- IP address as param (Firebase handles separately)

#### Anti-pattern names (NEVER use)
| ❌ Bad | Why | ✅ Use instead |
| --- | --- | --- |
| `data`, `info`, `details` | Too vague | Specific name (e.g., `video_data` → split into multiple params) |
| `temp`, `test`, `debug` | Signals unclean code | Remove or rename properly |
| `param1`, `value1`, `field1` | Meaningless | Descriptive name |
| `x`, `y`, `z` | Single letter | Full descriptive name |
| `id` | Generic, conflicts in joins | `<entity>_id` (e.g., `video_id`) |
| `duration` | Missing unit | `duration_ms` or `duration_seconds` |
| `time` | Ambiguous | `time_to_action_ms`, `timestamp_ms` |
| `success: bool` | Use separate `_success`/`_fail` events | Remove, use event name |
| `status: success\|fail` | Violates 2-event rule | Split into `_success` and `_fail` events |
| `flag`, `<x>_flag` | Unclear meaning | `is_<x>`, `has_<x>`, `was_<x>` |

#### Use instead
- `user_pseudo_id` (Firebase auto-generated) — NOT email
- Aggregates: `country` (not city), `age_range` (not DOB)
- Hashed IDs (SHA256) — when linking with backend

---

## 6. Funnels to Build in Firebase Console

After events are firing, build these funnels for analysis.

### Funnel 1: [Feature Activation Funnel]
1. `app_open` → 2. `[feature]_opened` → 3. `[entity]_[verb]` → 4. `[feature]_goal_reached`

**Expected conversion (baseline target)**: [X]% from step 1 to step 4 in D7.

### Funnel 2: [Feature Retention Funnel]
1. `[feature]_opened` on Day 0 → 2. `[feature]_opened` on Day 1 → 3. `[feature]_opened` on Day 7

**Expected conversion**: [Y]% return on D1, [Z]% on D7.

### Funnel 3: [Core Loop Funnel]
[Define per feature — what's the core loop user must complete?]

---

## 7. Dashboards to Set Up

| **Dashboard** | **Purpose** | **Tool** | **Key widgets** |
| --- | --- | --- | --- |
| [Feature] Overview | Daily health check | Firebase Console (Custom Dashboard) | DAU using feature, primary metric chart, top events |
| [Feature] Cohorts | Retention by install cohort | BigQuery + Looker Studio | D1/D7/D30 retention by week |
| [Feature] Funnel Health | Conversion at each step | Firebase Funnels | Funnel 1, 2, 3 from §6 |
| [Feature] Errors | Track error rates | Firebase Crashlytics + Custom | error events by type, by version, by OS |

---

## 8. Validation Checklist (Pre-Release)

Before declaring tracking implemented, verify ALL of these. PO owns this checklist.

### 8.1 Implementation validation (Dev → PO)
- [ ] All events from §3 are implemented in code
- [ ] Event names match exactly (case-sensitive, snake_case)
- [ ] All parameters from §5 are sent with each event
- [ ] User properties from §4 are set correctly
- [ ] No PII in any event payload (§5 forbidden list)
- [ ] Events fire on debug build (test on emulator + real device)
- [ ] Firebase DebugView shows events in real time
- [ ] BigQuery export configured and receiving data

### 8.2 Data quality validation (PO)
- [ ] Sample size on staging matches expected volume
- [ ] Parameter values match enum/spec (no `null`, no `undefined`, no typos)
- [ ] Funnels in Firebase show correct step ordering
- [ ] User properties propagate to user_engagement aggregations
- [ ] Cohort segmentation works (e.g., new vs returning splits as expected)

### 8.3 Privacy & Compliance (PO + Legal)
- [ ] No PII in event payloads
- [ ] Consent banner in place for GDPR regions
- [ ] User can opt out (Settings → Analytics off)
- [ ] When user opts out, events stop firing (validate with DebugView)
- [ ] Data retention policy configured in Firebase (default 2 months or 14 months)

---

## 9. BigQuery Export Notes

Once events flow to BigQuery, useful queries:

```sql
-- Count events per day for a feature
SELECT
  event_date,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_pseudo_id) as unique_users
FROM `[project].analytics_[id].events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
  AND event_name LIKE '[feature]_%'
GROUP BY event_date, event_name
ORDER BY event_date DESC, event_count DESC;
```

```sql
-- Extract a specific parameter value
SELECT
  event_date,
  user_pseudo_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'source') as source,
  (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'user_level') as user_level
FROM `[project].analytics_[id].events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
  AND event_name = '[feature]_opened';
```

```sql
-- D7 retention for cohort
WITH cohort AS (
  SELECT user_pseudo_id, MIN(event_date) as install_date
  FROM `[project].analytics_[id].events_*`
  WHERE event_name = 'first_open'
    AND _TABLE_SUFFIX BETWEEN '20260101' AND '20260107'
  GROUP BY user_pseudo_id
),
returned_d7 AS (
  SELECT DISTINCT c.user_pseudo_id
  FROM cohort c
  JOIN `[project].analytics_[id].events_*` e
    ON c.user_pseudo_id = e.user_pseudo_id
  WHERE PARSE_DATE('%Y%m%d', e.event_date) = DATE_ADD(PARSE_DATE('%Y%m%d', c.install_date), INTERVAL 7 DAY)
)
SELECT
  (SELECT COUNT(*) FROM returned_d7) / (SELECT COUNT(*) FROM cohort) as d7_retention;
```

More SQL templates in `references/firebase-analytics-guide.md`.

---

## 10. Implementation Sign-off

| **Role** | **Name** | **Implemented & Validated** | **Date** |
| --- | --- | --- | --- |
| Engineering Lead | | ☐ | |
| QA Lead | | ☐ | |
| Product Owner | | ☐ | |
| Data Analyst | | ☐ | |
