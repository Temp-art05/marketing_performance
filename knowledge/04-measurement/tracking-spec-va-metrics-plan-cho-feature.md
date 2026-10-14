---
title: Tracking spec & metrics plan cho feature mới — đặt tên event Firebase chuẩn công ty, param, quyết định Scale/Iterate/Kill
type: reference
topic: 04-measurement
tags: [firebase, ga4, tracking-spec, event-naming, metrics-plan, product-owner, counter-metric]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-102 - PRD → Visual (Claude-powered)/prd-to-visual-tool-full.zip → prd-visual-suite/skills/po-metrics-analysis/{SKILL.md, firebase-analytics-guide.md, tracking-spec-template.md, metrics-plan-template.md, quality-checklist.md} (đọc 2026-10-14) — quy ước nội bộ, skill v1.3 (06/2026)
  - "Firebase Help — Automatically collected events: https://support.google.com/firebase/answer/9234069 (đối chiếu qua 04-measurement/firebase-events-cho-ua.md)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 04-measurement/firebase-events-cho-ua.md
  - 04-measurement/ga4-bigquery-chi-so-suc-khoe-san-pham.md
  - 05-optimization/khung-phan-tich-metrics-aarrr-cohort-funnel.md
  - 06-tools/prd-to-visual-wireframe-so-do.md
  - 03-monetization/remote-config-ads-theo-phase-build-normal-2floor.md
summary: Quy ước tên event Firebase nội bộ ([screen]_[element]_[action], 7 loại), catalog param, giới hạn, khung Metrics Plan (primary/secondary/counter, ngưỡng Scale/Iterate/Kill chốt trước launch) và checklist validate.
---

# Tracking spec & metrics plan cho feature mới

## Bối cảnh
Rút từ skill `po-metrics-analysis` (bộ PRD → Visual, APR-102). Skill ghi đây là **quy ước đặt tên event company-wide** (cập nhật v1.1, 28/05/2026). Viết cho app farming có IAP, nhưng phần naming + quy trình dùng được cho mọi app Firebase, kể cả app ads-only như Home Morph.

Vì sao UA cần quan tâm: event custom được đặt tên/định nghĩa sạch từ bản build đầu thì mới (1) chọn được event tCPA chất lượng hơn `first_open`, (2) đọc funnel/retention theo cohort, (3) không phải đổi tên event giữa chừng — đổi event tối ưu khi campaign đang học sẽ **reset learning** ([firebase-events-cho-ua](firebase-events-cho-ua.md)).

## 1. Quy ước tên event (nội bộ)
Pattern: `[screen]_[element]_[action]` hoặc `[screen]_[action]`. **Mọi event có tiền tố tên màn.**

| Loại | Format | Ví dụ |
|---|---|---|
| Xem màn | `[screen]_scr` | `video_generation_scr` |
| Phần tử hiện ra | `[screen]_[element]_display` | `video_generation_result_display` |
| Bấm nút thật | `[screen]_[element]_btn_click` | `video_generation_close_btn_click` |
| Bấm thứ không phải nút (link, card, icon, ảnh, dòng list) | `[screen]_[element]_click` | `video_generation_play_click` |
| Hành động không phải click | `[screen]_[action]` | `video_generation_swipe` |
| Thành công | `[screen]_[action]_success` | `video_generation_save_success` |
| Thất bại | `[screen]_[action]_fail` | `video_generation_save_fail` |

Quy tắc cứng:
- snake_case, ≤ 40 ký tự, không bắt đầu bằng số, screen name không là số (`screen1` ❌).
- Screen name thống nhất toàn project (luôn `video_generation`, không lẫn `video_gen`).
- **Success/fail là 2 event riêng**, không dùng 1 event + param `status`. Lý do: dễ tính tỉ lệ trong Firebase Console, dễ cảnh báo khi fail rate tăng.
- Động từ dạng gốc: `click` (không `clicked`/`tap`), `display` (không `shown`), `_success`/`_fail`.
- Phân vân `btn_click` hay `click` → dùng `click`.
- Không dùng tiền tố dành riêng `firebase_`, `google_`, `ga_`; không đặt trùng tên event tự động (`first_open`, `ad_impression`, `screen_view`, `session_start`, `user_engagement`, `app_remove`…).

## 2. Quy ước param (nội bộ)
- snake_case, tên ≤ 40 ký tự, giá trị string ≤ 100 ký tự, ≤ 25 param/event. Số gửi kiểu int/double, không gửi string số. Không gửi `null` → bỏ param hoặc dùng `unknown`.
- ID luôn có tiền tố thực thể: `video_id`, `item_id` — không dùng `id` trơn (đụng nhau khi join).
- Thời gian luôn có đơn vị: `duration_ms`, `time_to_action_ms`, `elapsed_seconds` — không dùng `duration`, `time`.
- Boolean có tiền tố `is_` / `has_` / `was_` / `should_`.
- Event `_fail` **bắt buộc** có `failure_reason` (enum: `network_error`, `validation_error`, `insufficient_resources`, `timeout`, `server_error`, `user_cancelled`, `other`) + `error_code`.
- Enum: liệt kê đủ giá trị trong spec, có giá trị dự phòng `other`/`unknown`; dev không tự thêm giá trị ngoài spec.
- Không đưa vào param những gì Firebase đã tự gửi (`app_version`, `os_version`, `device_model`, `country`, `language`, `platform`).
- **Không bao giờ** track PII: email, SĐT, tên, địa chỉ, ID giấy tờ, thẻ thanh toán, text tự nhập của user, vị trí chính xác khi chưa có consent.
- Tên cấm: `data`, `info`, `details`, `temp`, `test`, `debug`, `param1`, `x`, `flag`, `success` (bool), `status: success|fail`.

User property vs event param: user property cho thuộc tính **ít đổi, dùng để chia audience** (tier, level, ngày cài); param cho chi tiết **từng hành động**.

## 3. Giới hạn Firebase/GA4 mà skill liệt kê
Theo `firebase-analytics-guide.md` (nội bộ, chưa đối chiếu từng dòng với tài liệu Google trong session này):

| Giới hạn | Giá trị |
|---|---|
| Độ dài tên event / tên param | 40 ký tự |
| Độ dài giá trị param (string) | 100 ký tự |
| Param mỗi event | 25 |
| Số tên event khác nhau mỗi app | 500 |
| User property mỗi project | 25 |
| Độ dài giá trị user property | 36 ký tự |
| Conversion (key) event | 30 |
| Audience | 100 |
| Data retention | 2 hoặc 14 tháng |

⚠️ Skill không nhắc giới hạn **custom dimension** của GA4: param muốn xem trong báo cáo GA4 (ngoài BigQuery) phải đăng ký custom dimension, và số lượng có hạn. *Theo hiểu biết của người viết, chưa kiểm chứng trong session này.*

## 4. Metrics Plan (viết song song PRD, trước khi build)
1. **Hypothesis**: "Nếu [làm X] thì [metric] sẽ [tăng/giảm] [bao nhiêu], vì [lý do hành vi]".
2. **Đúng 1 primary metric**, mỗi metric định nghĩa đủ 5 trường: tên · công thức chính xác · cohort/filter (ai ở tử số, mẫu số) · cửa sổ thời gian · edge case (loại tài khoản test, session < 1s…).
3. **Baseline bắt buộc**. Chưa có thì ghi "Baseline TBD — đo N ngày trước khi đặt target". Không đặt target khi chưa biết hiện tại ở đâu.
4. **Secondary metrics** = chỉ số không được tụt (crash-free, D1, session length, app size…), mỗi cái có "acceptable range".
5. **Counter-metric** cho mỗi primary — thứ theo dõi nhưng **không tối ưu** (vd tối ưu DAU thì đừng để crash rate tăng; tối ưu số lần mở app dễ dẫn tới push spam).
6. **Decision criteria đặt trước launch** (tránh dời cột gôn):
   - 🟢 **Scale**: primary đạt target **và** không secondary nào vượt ngưỡng **và** không bug nghiêm trọng.
   - 🟡 **Iterate**: primary đúng hướng nhưng chưa tới target, hoặc 1 secondary vào vùng cảnh báo, hoặc 1 segment kém.
   - 🔴 **Kill**: primary không nhúc nhích/đi ngược sau cửa sổ đo, hoặc secondary hỏng nặng, hoặc phản hồi user xấu rõ rệt.
   - Các con số mẫu trong template (vd "secondary tụt > 10% → Kill", "rating giảm ≥ 0,3") là **ví dụ điền sẵn**, không phải chuẩn.
7. **Lịch đọc số sau launch** (template): D1 kiểm tra event có chạy · D3 xem có hỏng nặng · D7 có D1 retention của cohort đầu · D14 có D7 retention · D28 ra quyết định.
8. Rủi ro hay gặp: mẫu quá nhỏ để có ý nghĩa thống kê, sự kiện gây nhiễu (lễ, campaign), bug tracking, selection bias (chỉ user tích cực mới thấy feature → so theo **ngày cài**, không theo ngày tiếp xúc feature).

Liên hệ app ads-only: trong repo này primary/secondary thường là ARPDAU, imps/DAU, D1/D7 retention, show rate; counter-metric điển hình khi tăng ad load là retention và `app_remove` (xem [glossary](../00-overview/glossary-chi-so.md)).

## 5. Checklist validate trước release (PO sở hữu)
- Event + param đúng tên (phân biệt hoa thường), đủ param, user property set đúng.
- Bắn được trên debug build (máy ảo + máy thật), thấy trong **DebugView**.
- BigQuery export đã bật và có data.
- Giá trị param khớp enum, không `null`/`undefined`/sai chính tả; funnel đúng thứ tự bước.
- Không PII; có consent cho vùng GDPR; user tắt analytics thì event dừng (kiểm bằng DebugView).
- Tách project Firebase dev/staging để data test không lẫn production.

## 6. Bẫy (từ guide của skill)
- Bắn `screen_view`/`_scr` mỗi lần re-render → thổi phồng số. Chỉ bắn 1 lần mỗi lần vào màn.
- Code thấy bắn nhưng Console không nhận → sai key param/kiểu dữ liệu. Luôn kiểm DebugView.
- Bắn quá nhiều event mỗi session dễ bị throttle → gộp ở client trước khi gửi.
- Tạo user property thử nghiệm rồi đụng trần 25 → audit định kỳ.

## Mâu thuẫn / chỗ cần lưu ý khi đối chiếu
- Template funnel trong `tracking-spec-template.md` dùng ví dụ `app_open`, `[feature]_opened` — **trái** chính quy ước `_scr` của skill và `app_open` không phải event tự động của Firebase. Khi dùng template, thay bằng `first_open`/`session_start` và `[screen]_scr`.
- Param mẫu `link_url`, `link_text` dễ vượt 100 ký tự / chứa text tự do → cân nhắc bỏ.
