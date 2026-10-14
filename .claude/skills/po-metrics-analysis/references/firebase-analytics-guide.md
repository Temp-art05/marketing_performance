<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- C5 — tách từ po-agent-bundle.md (skill po-metrics-analysis v1.3) -->

# Firebase Analytics Guide

Đọc file này khi cần check Firebase Analytics constraints, schema, hoặc viết BigQuery SQL.

---

## 1. Hard Limits (Firebase Analytics)

| **Limit** | **Value** | **Lưu ý** |
| --- | --- | --- |
| Event name length | 40 chars | snake_case, không bắt đầu bằng số |
| Parameter name length | 40 chars | Cùng rule với event name |
| Parameter value length | 100 chars (string) | Cắt nếu dài hơn |
| Parameters per event | 25 | Đếm cả default params auto thêm |
| Unique event names per app | 500 | Audit định kỳ |
| Unique parameter names per event | 25 | |
| User properties per project | 25 | Sau khi tạo, không xóa được dễ |
| User property value length | 36 chars | Ngắn hơn event params |
| Conversion events (mark as conversion) | 30 | Free tier |
| Audiences | 100 | |
| Daily event volume (free) | Unlimited | Nhưng có throttling per user |

**Reserved prefixes (KHÔNG dùng):**
- `firebase_`
- `google_`
- `ga_`

**Reserved event names (KHÔNG override):**
- `ad_activeview`, `ad_click`, `ad_exposure`, `ad_impression`, `ad_query`, `ad_reward`
- `app_clear_data`, `app_exception`, `app_remove`, `app_update`
- `error`, `first_open`, `first_visit`, `in_app_purchase`, `notification_*`
- `os_update`, `screen_view`, `session_start`, `user_engagement`

---

## 2. Default Events (Auto-Collected)

Firebase tự động collect các event này. KHÔNG cần implement, KHÔNG nên override.

| **Event** | **When** | **Useful for** |
| --- | --- | --- |
| `first_open` | App opened lần đầu sau install | Install cohort tracking |
| `session_start` | New session starts (after 30+ min inactive) | Session count |
| `user_engagement` | User active on foreground >1s | Engagement time |
| `screen_view` | New screen displayed | Funnel, screen flow |
| `app_update` | App updated to new version | Version cohort |
| `os_update` | OS updated | Device cohort |
| `in_app_purchase` | IAP completed (iOS) | Revenue (Android dùng `purchase`) |
| `notification_open` | User taps notification | Notification effectiveness |
| `notification_dismiss` | User dismisses notification | |
| `notification_receive` | Notification received | Reach |
| `app_clear_data` | User clears app data | Churn signal |
| `app_remove` | User uninstalls (Android only) | Churn signal |
| `dynamic_link_app_open` | Opened via dynamic link | Acquisition source |
| `ad_impression` | (Auto if AdMob integrated) | Ad inventory |
| `ad_click` | (Auto if AdMob integrated) | Ad engagement |

---

## 3. Custom Event Naming Convention (Company-Wide)

### Pattern bắt buộc

`[screen]_[element]_[action]` hoặc `[screen]_[action]`

**Mọi event PHẢI có screen name làm prefix.**

### 7 loại event và format

| **Loại** | **Format** | **Ví dụ** |
| --- | --- | --- |
| Screen view | `[screen]_scr` | `video_generation_scr` |
| Element display | `[screen]_[element]_display` | `video_generation_result_display` |
| Button click | `[screen]_[element]_btn_click` | `video_generation_close_btn_click` |
| Non-button click | `[screen]_[element]_click` | `video_generation_play_click` |
| Non-click action | `[screen]_[action]` | `video_generation_swipe` |
| Success result | `[screen]_[action]_success` | `video_generation_save_success` |
| Fail result | `[screen]_[action]_fail` | `video_generation_save_fail` |

### Ví dụ event set hoàn chỉnh cho 1 screen

Cho screen "Video Generation":
```
video_generation_scr                    # User vào screen
video_generation_result_display         # Result panel xuất hiện
video_generation_loading_display        # Loading state
video_generation_error_display          # Error state
video_generation_play_click             # Tap play (non-button)
video_generation_try_again_click        # Tap try again link
video_generation_report_click           # Tap report link
video_generation_close_btn_click        # Tap X button
video_generation_home_btn_click         # Tap home button
video_generation_save_btn_click         # Tap save button (CTA)
video_generation_save_success           # Save thành công
video_generation_save_fail              # Save fail
video_generation_share_btn_click        # Tap share
video_generation_swipe                  # User swipe gallery
```

### Quy tắc đặt screen name

Screen name là phần quan trọng nhất — phải consistent across project:

- snake_case, ngắn nhưng đủ nghĩa
- 1-3 từ: `home`, `farm_main`, `video_generation`, `inventory`, `shop`, `quest_list`
- Không viết tắt random — agree trên 1 naming chuẩn rồi giữ vững (vd: luôn `video_generation` chứ không lẫn `video_gen`, `vid_gen`)
- KHÔNG dùng số: `screen1`, `screen2` ❌

### Quy tắc btn_click vs click

| **Dùng `_btn_click`** | **Dùng `_click`** |
| --- | --- |
| Button có button styling (background, border, primary CTA) | Link text |
| Floating Action Button (FAB) | Card |
| Toolbar button (close X, back, home) | Icon (không phải button) |
| Bottom sheet CTA | Image |
|  | List row |
|  | Avatar |

Khi không chắc → dùng `_click` (default cho tap actions).

### Quy tắc success / fail

**LUÔN dùng 2 event riêng**, KHÔNG dùng 1 event với param `status`:

✅ Đúng:
```
video_generation_save_success
video_generation_save_fail
```

❌ Sai:
```
video_generation_save  with param status=success|fail
```

Lý do: 2 event riêng dễ query, dễ tính conversion rate trong Firebase Console, dễ alert khi fail rate spike.

### Verb form

- **Non-click actions**: dùng dạng base (verb gốc): `swipe`, `scroll`, `drag` (KHÔNG `swiped`, `scrolling`)
- **Click**: luôn `click` (KHÔNG `clicked`, `tap`)
- **Display**: luôn `display` (KHÔNG `displayed`, `shown`, `show`)
- **Success/Fail**: luôn `_success` và `_fail` (KHÔNG `_succeeded`, `_failed`)

### ❌ Anti-patterns

| **Sai** | **Lý do** | **Đúng** |
| --- | --- | --- |
| `clickPlayButton` | camelCase | `video_generation_play_click` |
| `PLAY_VIDEO` | uppercase | `video_generation_play_click` |
| `video-play-click` | kebab-case | `video_generation_play_click` |
| `play_click` | thiếu screen prefix | `video_generation_play_click` |
| `video_generation_play_button_click` | dùng full `button` thay vì `btn` | `video_generation_play_btn_click` |
| `event_video_play` | redundant `event_` prefix | `video_generation_play_click` |
| `video_generation_screen_view` | dùng `_screen_view` thay `_scr` | `video_generation_scr` |
| `video_generation_clicked` | past tense | `video_generation_click` |
| `video_generation_save` với param status | success/fail nên là 2 event riêng | `video_generation_save_success` + `video_generation_save_fail` |
| `screen1_btn_click` | screen name là số | `home_btn_click` |

---

## 4. Parameter Naming Convention (Company-Wide Standard)

Quy ước param naming bắt buộc. Mọi event trong project tuân thủ.

### 4.1 General Rules

- **snake_case** cho tất cả param names (đồng bộ với event names)
- Tên ngắn gọn 1-3 từ, rõ nghĩa
- Max 40 chars (Firebase hard limit)
- Max 100 chars cho string values
- Max 25 params/event (Firebase hard limit)
- KHÔNG dùng `null` → bỏ param hoặc dùng default value
- Numbers: dùng `int`/`double`, KHÔNG dùng string số

### 4.2 Standard Parameter Catalog

#### A. Context / Entry source

| **Param** | **Type** | **Mô tả** | **Example values** |
| --- | --- | --- | --- |
| `source` | string | Nơi user đến từ | `home`, `notification`, `deeplink`, `tutorial`, `search`, `fab` |
| `referrer_screen` | string | Screen trước đó | `home_scr`, `inventory_scr`, `farm_main_scr` |
| `entry_method` | string | Cách trigger action | `tap`, `swipe`, `auto`, `deeplink`, `notification` |

#### B. Entity Identification

**Quy tắc**: luôn có **entity prefix** trong tên param (vd `crop_id`, KHÔNG dùng `id` chung chung). Lý do: khi join nhiều event trong query/funnel, sẽ không bị conflict.

| **Param** | **Type** | **Mô tả** | **Example** |
| --- | --- | --- | --- |
| `<entity>_id` | string | ID cụ thể của entity | `crop_id`, `plot_id`, `quest_id`, `item_id`, `video_id` |
| `<entity>_type` | string | Loại entity | `crop_type`, `quest_type`, `item_type` |
| `<entity>_name` | string | Display name | `crop_name`, `item_name` |
| `<entity>_category` | string | Phân loại | `item_category`, `crop_category` |

#### C. Time / Duration

**Quy tắc**: LUÔN có suffix unit (`_ms` hoặc `_seconds`). KHÔNG dùng `duration` mà không có unit.

| **Param** | **Type** | **Mô tả** | **Example** |
| --- | --- | --- | --- |
| `duration_ms` | int | Thời gian thực hiện action (millisecond) | 1500 |
| `time_to_action_ms` | int | Từ screen open đến action | 3200 |
| `time_on_screen_ms` | int | Thời gian user ở trên screen | 45000 |
| `elapsed_seconds` | int | Thời gian dài (>1 phút) đo bằng giây | 180 |
| `timestamp_ms` | int | Unix timestamp millisecond | 1748345678901 |

#### D. Count / Quantity / Position

| **Param** | **Type** | **Mô tả** | **Example** |
| --- | --- | --- | --- |
| `<thing>_count` | int | Số lượng | `result_count`, `attempt_count`, `tag_count`, `step_count` |
| `position` | int | Vị trí trong list (0-indexed) | 0, 1, 2 |
| `index` | int | Index (0-indexed) | 0, 1, 2 |
| `total_<thing>` | int | Tổng (đi cùng position) | `total_results`, `total_pages`, `total_steps` |
| `value` | int/double | Giá trị numeric chung | 100, 99.5 |
| `step_number` | int | Step number trong funnel/tutorial | 1, 2, 3 |

#### E. Status / Outcome (chỉ cho `_fail` events)

| **Param** | **Type** | **Mô tả** | **Example values (enum)** |
| --- | --- | --- | --- |
| `failure_reason` | string (enum) | Lý do fail (BẮT BUỘC trong `_fail` events) | `network_error`, `validation_error`, `insufficient_resources`, `timeout`, `server_error`, `user_cancelled`, `other` |
| `error_code` | string | Error code chi tiết | `E_NETWORK_001`, `400`, `500` |
| `error_message` | string | Sanitized error message (KHÔNG raw user input) | `network_timeout`, `invalid_input` |
| `state` | string | UI state | `loading`, `ready`, `error`, `empty` |

> **Quan trọng**: KHÔNG dùng param `status: success|fail` để gộp success và fail vào 1 event. Đã có 2 event riêng `_success` và `_fail` (xem §3 Naming Convention).

#### F. Boolean Flags

**Quy tắc**: boolean luôn có prefix rõ ràng. KHÔNG dùng `<x>_flag`, `<x>_bool`, `<x>_yn`.

| **Prefix** | **Mô tả** | **Example** |
| --- | --- | --- |
| `is_<x>` | Trạng thái hiện tại | `is_first_time`, `is_premium`, `is_logged_in`, `is_offline` |
| `has_<x>` | Sở hữu / tồn tại | `has_subscription`, `has_completed_tutorial`, `has_unread` |
| `was_<x>` | Lịch sử action | `was_cached`, `was_backdated`, `was_default_overridden`, `was_first_time` |
| `should_<x>` | Conditional | `should_skip_intro`, `should_show_tutorial` |

#### G. User Context (auto-include when relevant)

Firebase đã tự gửi `app_version`, `os_version`, `device_model`, `country`, `language`, `platform` — KHÔNG cần đưa vào params.

Param dưới đây PO thêm vào event khi context relevant:

| **Param** | **Type** | **Mô tả** | **Khi nào include** |
| --- | --- | --- | --- |
| `user_level` | int | Game level | Cho game progression context |
| `user_tier` | string | Membership tier | `free`, `premium`, `vip` — khi feature có tier behavior khác |
| `session_id` | string | ID session hiện tại | UUID — khi cần track within-session |
| `session_number` | int | Số thứ tự session từ install | 1, 2, 3 — cho cohort analysis |

### 4.3 Forbidden Parameters

#### Privacy violations — KHÔNG BAO GIỜ track

- Email, phone number, full name, physical address
- Government IDs, payment card info
- Free-text user input (có thể chứa PII)
- Precise location (lat/long) without explicit consent
- IP address as param (Firebase tự handle)

#### Anti-pattern names — TUYỆT ĐỐI tránh

| **Tên ❌** | **Lý do** | **Thay bằng** |
| --- | --- | --- |
| `data` | Quá mơ hồ | Tên cụ thể (vd `result_data` → tách thành multiple params) |
| `info` | Quá mơ hồ | Tên cụ thể |
| `details` | Quá mơ hồ | Tên cụ thể |
| `temp`, `test`, `debug` | Dấu hiệu code chưa clean | Xóa hoặc đặt tên đúng |
| `param1`, `value1`, `field1` | Không có nghĩa | Tên mô tả |
| `x`, `y`, `z` | Single letter | Tên đầy đủ |
| `id` | Chung chung, conflict khi join | `<entity>_id` (vd `crop_id`) |
| `duration` | Thiếu unit | `duration_ms` hoặc `duration_seconds` |
| `time` | Mơ hồ | `time_to_action_ms`, `timestamp_ms` |
| `success` (bool) | Đã có 2 event _success/_fail riêng | Xóa, dùng event name |
| `status: success\|fail` | Vi phạm rule 2 event riêng | Tách thành `_success` và `_fail` events |
| `flag` | Không rõ nghĩa | `is_<x>`, `has_<x>`, `was_<x>` |

### 4.4 Enum Values Rules

Param dạng enum (controlled vocabulary):

- snake_case cho values (`network_error`, KHÔNG `NetworkError` hay `network-error`)
- Liệt kê **tất cả possible values** trong Tracking Spec
- Phải có fallback value: `other` hoặc `unknown`
- KHÔNG cho phép `null` / empty string → dùng `unknown`
- Dev KHÔNG được tự thêm value mới mà không update spec

### 4.5 Example: Full param set cho 1 event

**Event**: `video_generation_save_fail`
```yaml
parameters:
  failure_reason: string (enum: network_error|server_error|timeout|validation_error|other)
  error_code: string             # "E_NETWORK_001"
  attempt_count: int             # 2
  duration_ms: int               # 8500 (time spent before fail)
  video_id: string               # entity being saved
  is_first_time: bool            # was this user's first save attempt?
  source: string                 # where save was initiated
```

**Event**: `video_generation_play_click`
```yaml
parameters:
  video_id: string
  video_type: string
  position: int                  # position in playlist (0-indexed)
  total_videos: int              # context for position
  time_to_action_ms: int         # from screen open
  is_first_time: bool
```

**Event**: `video_generation_scr`
```yaml
parameters:
  source: string                 # home | notification | deeplink
  referrer_screen: string        # home_scr | inventory_scr
  is_first_time: bool            # first time on this screen
  session_number: int            # cho cohort analysis
```

---

## 5. User Properties

User properties = thuộc tính sticky của user, dùng để segment trong Firebase Console.

### Khi nào dùng User Property vs Event Param

| **Dùng User Property khi** | **Dùng Event Param khi** |
| --- | --- |
| Cần segment audience | Cần phân tích từng action |
| Giá trị thay đổi chậm (vd: tier, level) | Giá trị thay đổi mỗi event |
| Cần dùng để define audience | Chỉ cần để query/funnel |
| Persistent across sessions | Chỉ cần cho event đó |

### Examples for farming app

| **User Property** | **Type** | **Update khi** |
| --- | --- | --- |
| `player_level` | int | Mỗi khi level up |
| `total_coins` | int | Update daily (snapshot) |
| `signup_method` | string | One-time at install (email/facebook/guest) |
| `is_paying_user` | bool | After first purchase |
| `lifetime_revenue_usd` | double | After each purchase |
| `last_active_date` | string (ISO date) | Daily |
| `cohort_install_week` | string | One-time at install (YYYY-WW) |
| `preferred_language` | string | When user changes language |
| `country` | string | Auto via geo, but can override |

---

## 6. Privacy & Compliance

### KHÔNG bao giờ track
- Email (`user@example.com`)
- Phone number
- Full name
- Physical address
- Government IDs
- Payment card info
- Free-text user input (could contain PII)
- Precise location (lat/long) without explicit consent
- IP address as param (Firebase tự handle)

### Dùng thay thế
- `user_pseudo_id` (Firebase tự generate, không phải email)
- Aggregates: country (không phải city), age range (không phải DOB)
- Hashed IDs nếu cần link với backend (SHA256)

### Compliance checklist
- [ ] Consent banner cho GDPR regions (EU, UK)
- [ ] Opt-out mechanism trong Settings
- [ ] When opted out, events stop firing (validate trong DebugView)
- [ ] Data retention policy configured (default 2 months, max 14 months trong Firebase free tier)
- [ ] BigQuery export tuân thủ retention policy
- [ ] Vietnam Decree 13/2023/ND-CP compliance
- [ ] CCPA opt-out cho California users
- [ ] COPPA: nếu app target trẻ em <13, không track personal data

---

## 7. BigQuery Export

### Khi nào cần BigQuery
Firebase Console đủ cho:
- Realtime DAU/MAU
- Standard funnels (built-in)
- Standard retention (60 days)
- Audience segmentation

BigQuery cần khi:
- Custom funnel logic phức tạp
- Retention >60 days
- Cohort analysis chi tiết
- Cross-join với data khác (CRM, ad spend)
- Custom dashboards (Looker Studio, Tableau)
- ML/predictive modeling

### Setup
1. Firebase Console → Project Settings → Integrations → BigQuery
2. Enable streaming export (free trong 1 dataset/project)
3. Data xuất hiện trong dataset `analytics_<property_id>` table `events_YYYYMMDD`

### Schema cốt lõi
```
events_YYYYMMDD
├── event_date (string YYYYMMDD)
├── event_timestamp (int microseconds)
├── event_name (string)
├── event_params (ARRAY of struct)
│   ├── key (string)
│   └── value (struct)
│       ├── string_value
│       ├── int_value
│       ├── float_value
│       └── double_value
├── user_pseudo_id (string)
├── user_id (string, nullable)
├── user_properties (ARRAY of struct, same shape as event_params)
├── device (struct: category, mobile_brand_name, os, os_version, ...)
├── geo (struct: country, region, city)
├── app_info (struct: id, version, install_source)
└── traffic_source (struct: medium, name, source)
```

### Common SQL patterns

#### Pattern 1: Count events
```sql
SELECT
  event_date,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_pseudo_id) as unique_users
FROM `[project].analytics_[id].events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260501' AND '20260531'
GROUP BY event_date, event_name
ORDER BY event_date DESC, event_count DESC;
```

#### Pattern 2: Extract param value
```sql
SELECT
  event_date,
  user_pseudo_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'source') AS source,
  (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'user_level') AS user_level
FROM `[project].analytics_[id].events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260501' AND '20260531'
  AND event_name = 'farm_plot_planted';
```

#### Pattern 3: D7 Retention by install cohort
```sql
WITH installs AS (
  SELECT
    user_pseudo_id,
    PARSE_DATE('%Y%m%d', event_date) AS install_date
  FROM `[project].analytics_[id].events_*`
  WHERE event_name = 'first_open'
    AND _TABLE_SUFFIX BETWEEN '20260501' AND '20260507'
),
day_7_returns AS (
  SELECT DISTINCT
    i.user_pseudo_id,
    i.install_date
  FROM installs i
  JOIN `[project].analytics_[id].events_*` e
    ON i.user_pseudo_id = e.user_pseudo_id
  WHERE PARSE_DATE('%Y%m%d', e.event_date) = DATE_ADD(i.install_date, INTERVAL 7 DAY)
)
SELECT
  install_date,
  COUNT(DISTINCT i.user_pseudo_id) AS install_count,
  COUNT(DISTINCT r.user_pseudo_id) AS d7_return_count,
  SAFE_DIVIDE(COUNT(DISTINCT r.user_pseudo_id), COUNT(DISTINCT i.user_pseudo_id)) AS d7_retention_rate
FROM installs i
LEFT JOIN day_7_returns r USING (user_pseudo_id, install_date)
GROUP BY install_date
ORDER BY install_date;
```

#### Pattern 4: Funnel conversion
```sql
WITH user_events AS (
  SELECT
    user_pseudo_id,
    MIN(IF(event_name = 'app_open', event_timestamp, NULL)) AS t1_app_open,
    MIN(IF(event_name = 'farm_screen_opened', event_timestamp, NULL)) AS t2_farm_open,
    MIN(IF(event_name = 'farm_plot_planted', event_timestamp, NULL)) AS t3_planted,
    MIN(IF(event_name = 'crop_harvested', event_timestamp, NULL)) AS t4_harvested
  FROM `[project].analytics_[id].events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20260501' AND '20260507'
  GROUP BY user_pseudo_id
)
SELECT
  COUNT(t1_app_open) AS step1_users,
  COUNT(t2_farm_open) AS step2_users,
  COUNT(t3_planted) AS step3_users,
  COUNT(t4_harvested) AS step4_users,
  SAFE_DIVIDE(COUNT(t2_farm_open), COUNT(t1_app_open)) AS step1_to_2,
  SAFE_DIVIDE(COUNT(t3_planted), COUNT(t2_farm_open)) AS step2_to_3,
  SAFE_DIVIDE(COUNT(t4_harvested), COUNT(t3_planted)) AS step3_to_4,
  SAFE_DIVIDE(COUNT(t4_harvested), COUNT(t1_app_open)) AS overall_conversion
FROM user_events;
```

#### Pattern 5: User segment by property
```sql
SELECT
  (SELECT value.int_value FROM UNNEST(user_properties) WHERE key = 'player_level') AS level_bucket,
  COUNT(DISTINCT user_pseudo_id) AS users,
  COUNT(*) AS events
FROM `[project].analytics_[id].events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260501' AND '20260507'
  AND event_name = 'session_start'
GROUP BY level_bucket
ORDER BY level_bucket;
```

---

## 8. Common Pitfalls

### Pitfall 1: Event firing on every render
Tracking `screen_view` on every component re-render → DATA INFLATION. Fire once per screen entry.

### Pitfall 2: Forgetting to validate in DebugView
Code thấy event firing, nhưng Firebase Console không nhận → typo param key, wrong type. Always validate DebugView first.

### Pitfall 3: Mixing test data với production
DebugView events có thể vào production analytics nếu không tách environment. Setup separate Firebase project cho dev/staging.

### Pitfall 4: BigQuery export delay
Events stream to BigQuery với delay 1-2 phút, daily table mất 24h để complete. Đừng query `events_TODAY` cho phân tích real-time.

### Pitfall 5: Sampling
Firebase Console sampling apply trên large datasets (>10M events). Nếu thấy số lẻ, có thể là sample. BigQuery không sample → dùng BigQuery cho precision.

### Pitfall 6: Event spam
Firing 100+ events / user / session → bị throttle. Aggregate ở client side trước khi gửi.

### Pitfall 7: User property limit
Tạo nhiều user properties test → đụng limit 25. Audit thường xuyên, delete unused.

### Pitfall 8: Reserved event names
Define event `screen_view` custom → override default, mất built-in screen tracking. Always check reserved list.
