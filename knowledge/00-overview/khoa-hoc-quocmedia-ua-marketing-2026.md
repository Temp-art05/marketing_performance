---
title: Khoá học UA Marketing Mobile App 2026 (Quocmedia) — bản đồ nội dung và chỗ lệch với Google
type: reference
topic: 00-overview
tags: [khoa-hoc, quocmedia, google-ads, aso, creative, roadmap, troas, tcpi]
app: general
status: draft
confidence: medium
sources:
  - "Khoá UA Marketing Mobile App 2026 Phát Triển Ứng Dụng — Quocmedia, giảng viên Quốc Anh, learn.quocmedia.com/learn/ua-marketing (38 bài, video quay ~11–12/2024)"
  - "Session 2026-10-15: tải 20 bài đã mở, transcribe Whisper large-v3-turbo + đọc khung hình; ghi chú chi tiết ở raw/quocmedia-ua/notes/ (ngoài git)"
created: 2026-10-15
updated: 2026-10-15
related:
  - 00-overview/roadmap.md
  - playbooks/launch-google-app-campaign-tcpa-den-roas.md
  - 02-ua-channels/google-ads/app-campaigns-tong-quan.md
  - lessons/2024-12-quocmedia-demo-tcpi-thap-va-troas-cao-khong-spend.md
  - 01-pre-marketing/research-doi-thu-va-keyword-cho-app.md
  - 01-pre-marketing/style-video-creative-ads-va-cong-thuc-hook.md
  - 01-pre-marketing/aso-google-play-store-listing.md
  - 01-pre-marketing/creative-assets-google-app-campaigns.md
summary: Khoá UA của Quocmedia (nguồn gốc roadmap của user) — 38 bài, đã nạp 20 bài (chương 1–3, 4.1–4.5); tóm từng chương, nơi nội dung đã nạp, và bảng chỗ khoá dạy khác tài liệu chính thức Google.
---

# Khoá học UA Marketing Mobile App 2026 (Quocmedia)

## Bối cảnh

- Khoá online của Quocmedia (giảng viên Quốc Anh), user đang học (tiến độ 19/38 bài ở 2026-10-15). Bài mở tuần tự: bài sau chỉ mở khi đánh dấu xong bài trước.
- **Roadmap trong knowledge ([roadmap.md](roadmap.md), file `ROADMAP UA MARKETING.xlsx` của user) chính là checklist của khoá này** (bài 1.2 và 4.1) — khi thấy roadmap lệch Google, gốc là ở đây.
- Demo của khoá: app Android "Max Volume Booster" (ads-only, AdMob), tài khoản Google Ads VND, quay khoảng 11–12/2024. Số trên màn hình đã ghi thành lesson: [tCPI thấp và tROAS cao không spend](../lessons/2024-12-quocmedia-demo-tcpi-thap-va-troas-cao-khong-spend.md).
- Cách nạp: video là YouTube nhúng → `scripts/course/video-to-notes.sh raw/quocmedia-ua` (tải, Whisper, cắt khung hình), Claude đọc transcript + khung hình rồi đối chiếu knowledge. Khi mở khoá thêm bài: cập nhật `raw/quocmedia-ua/lessons.tsv` rồi chạy lại.

## Nội dung theo chương

| Chương | Bài | Trạng thái | Nạp vào |
|---|---|---|---|
| 1. Tư duy nền tảng & roadmap | 1.1 Giới thiệu · 1.2 Roadmap · 1.3 Insight & thị trường (Keyword Planner) · 1.4 Spy ads đối thủ | ✅ đã nạp | [roadmap](roadmap.md), [research đối thủ & keyword](../01-pre-marketing/research-doi-thu-va-keyword-cho-app.md) |
| 2. ASO | 2.1 Tổng quan ASO · 2.2 Các bước tối ưu · 2.3 AI viết full description · 2.4 Screenshot · 2.5 Video app promotion | ✅ đã nạp | [ASO store listing](../01-pre-marketing/aso-google-play-store-listing.md), [screenshot](../01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md) |
| 3. Creative ads bằng AI | 3.1 AI viết headline/description · 3.2 Mindset creative · 3.3 Style video · 3.4 Nhiều video từ link app (Creatify) · 3.5 Ảnh ads · 3.6 Video ads | ✅ đã nạp | [creative assets](../01-pre-marketing/creative-assets-google-app-campaigns.md), [style video & hook](../01-pre-marketing/style-video-creative-ads-va-cong-thuc-hook.md), [Creatify](../06-tools/creatify-ai-video-ads-tu-link-app.md) |
| 4. Google Ads | 4.1 Checklist pre-marketing · 4.2 Link Firebase↔Ads↔AdMob · 4.3 Setup CPI toàn cầu · 4.4 Chỉ số & lỗi thường gặp khi chạy CPI · 4.5 Setup ROAS | ✅ đã nạp | [playbook launch](../playbooks/launch-google-app-campaign-tcpa-den-roas.md), [App campaigns](../02-ua-channels/google-ads/app-campaigns-tong-quan.md), [Firebase setup](../04-measurement/firebase-setup-link-google-ads-admob.md) |
| 4. (tiếp) | 4.6 Phân tích chỉ số ROAS · 4.7 Thuật ngữ · 4.8 Firebase đọc chỉ số sản phẩm · 4.9 Scale ROAS · 4.10 Yếu tố thành công · 4.11 Chỉ số ASO trên Play | 🔒 chưa mở | — |
| 5. Apple Ads | 5 bài (giới thiệu, cấu trúc, thuật ngữ, setup, tối ưu) | 🔒 chưa mở | — |
| 6. Plan marketing | Plan cho app · Plan cho game | 🔒 chưa mở | — |
| 7. Social free traffic | YouTube (3 bài), Instagram (2 bài) | 🔒 chưa mở | — |

### Ý chính đáng nhớ

- **Trình tự launch của khoá:** campaign CPI tối ưu `first_open` (All countries + English, ₫200k/ngày) chạy 2–3 ngày, khoảng 30–300 install, để có `ad_impression` trong Firebase và kiểm SDK AdMob. Sau đó import `ad_impression` (conversion window 1 tuần) và **đổi tại chỗ** campaign đó sang In-app action value với **target ROAS 50–60%**. Khoảng 1 tháng sau nâng lên 90–100%.
- **Kiểm AdMob trước khi sang ROAS** (🧪 rule-of-thumb của giảng viên): impression/request ≥ 50%, match rate ≥ 80%. Thấp hơn thì kiểm SDK với dev.
- **Khi campaign CPI không tiêu tiền sau 3–7 ngày:** nâng tCPI, hoặc thay creative không khớp app. Sau khi chỉnh, đợi 1–2 ngày.
- **Creative:**
  - 3 ad group × (5 headline + 5 description, ảnh 3 tỉ lệ, video 3 hướng). Mỗi ad group là 1 bộ content khác nhau.
  - Video theo cấu trúc hook 3s → content → CTA.
  - 6 style video: fake choice, POV, meme, UGC, before/after, shock.
- **ASO:**
  - Đọc conversion rate của store listing trong Play Console (theo search term, nguồn, nước).
  - Ngưỡng của giảng viên: ≥ 25–30% (🧪, độ tin thấp).

## ⚠️ Chỗ khoá dạy khác tài liệu chính thức

Không bỏ nội dung khoá, nhưng khi làm thật ưu tiên Google Help. Mỗi dòng đều có chi tiết trong file đích.

| Khoá dạy | Google / knowledge | File chi tiết |
|---|---|---|
| Chuyển CPI → tROAS sau 2–3 ngày, 30–300 install | Volume ổn định, ~30+ conversion/30 ngày; 3–4 tuần dữ liệu value (15995101) | [playbook](../playbooks/launch-google-app-campaign-tcpa-den-roas.md) |
| Target ROAS khởi điểm cố định 50–60% | Target = Conv. value/cost thực của campaign tương đương (15995101). Trong demo, campaign "ROAS 80" gần như không spend | [playbook](../playbooks/launch-google-app-campaign-tcpa-den-roas.md), [lesson](../lessons/2024-12-quocmedia-demo-tcpi-thap-va-troas-cao-khong-spend.md) |
| Sau ~1 tháng nhảy 60% → 90–100% | Mỗi lần ±15–20%, cách nhau 1–2 tuần (15995101) | [App campaigns](../02-ua-channels/google-ads/app-campaigns-tong-quan.md) |
| Đổi luôn campaign CPI đang chạy sang tROAS | Tạo campaign mới, tránh đổi loại campaign sau launch (9176652) | [playbook](../playbooks/launch-google-app-campaign-tcpa-den-roas.md) |
| tCPI lấy từ "Top of page bid" trong Keyword Planner (₫800) | Đó là CPC của Search, không phải CPI. Nên tham khảo bid guidance; màn hình demo gợi ý ₫8.993, và ₫800 không spend được | [lesson](../lessons/2024-12-quocmedia-demo-tcpi-thap-va-troas-cao-khong-spend.md) |
| Không nhắc bật Impression-level ad revenue | Bắt buộc để value `ad_impression` đi sang tROAS (AdMob 11322405) | [Firebase setup](../04-measurement/firebase-setup-link-google-ads-admob.md) |
| Đẩy 3–5 review 4–5 sao mỗi 1.000 download | Vi phạm policy Ratings, Reviews & Installs của Google Play | [ASO](../01-pre-marketing/aso-google-play-store-listing.md) |
| Description ads ≤ 80 ký tự, có emoji; feature graphic 1920×1080 | Spec: description 90 ký tự; feature graphic 1024×500 | [creative assets](../01-pre-marketing/creative-assets-google-app-campaigns.md), [ASO](../01-pre-marketing/aso-google-play-store-listing.md) |
| Quay màn hình bản preview free của tool AI để dùng | Vi phạm điều khoản/license, **không làm** | [Creatify](../06-tools/creatify-ai-video-ads-tu-link-app.md) |

Những claim không có nguồn đã cố ý **không** nạp thành sự thật, ví dụ "tối ưu chi phí hơn 70%" hay "video ảnh hưởng 24% / screenshot 13%".

## Việc tiếp theo

- Khi user mở khoá các bài 4.6–4.11, nạp tiếp, ưu tiên 4.6 (phân tích ROAS) và 4.9 (scale ROAS) vì đang thiếu quy tắc nâng target. Sau đó đến chương 6 (plan marketing).
