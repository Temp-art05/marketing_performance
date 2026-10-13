---
title: Social Tracker — quét TikTok tìm video organic viral (AI photo/video) làm ý tưởng creative
type: reference
topic: 06-tools
tags: [tool, creative-research, tiktok, trend, organic, spy, yt-dlp, playwright]
app: general
status: verified
confidence: high
sources:
  - AI Knownledge/APR-067 - Social Tracker/social-tracker-prd.md (đọc 2026-10-14)
  - AI Knownledge/APR-067 - Social Tracker/_info.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 06-tools/genius-easy-creative.md
  - 06-tools/cat-outro-watermark-video-hang-loat.md
  - 05-optimization/danh-gia-hieu-qua-social-organic.md
  - 01-pre-marketing/nghien-cuu-trend-cho-creative.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
summary: Tool local (Flask + yt-dlp + Playwright) của UA Apero quét danh sách account TikTok chuyên content AI photo/video, lọc video mới theo view/ngôn ngữ, tự mở rộng account qua gợi ý TikTok, export Google Sheets/Excel.
---

# Social Tracker (TikTok)

## Làm gì
Thay việc lướt TikTok tay để tìm creative. Tool quét các account đang theo dõi, lấy video trong **5/10/15/30 ngày** gần nhất, lọc theo **view tối thiểu** và ngôn ngữ, tô màu cột view theo ngưỡng (cam/đỏ), preview thumbnail/video ngay trong tool. Tool tự **mở rộng danh sách account** bằng account TikTok gợi ý (phase 2: theo hashtag) và tự loại account không đăng gì trong 30 ngày.

- **Dùng ở bước:** research creative / market trend trước khi làm creative, hằng tuần trong lúc chạy campaign. Nhắm tới **organic content** vì nó phản ánh trend tốt hơn ads.
- **Người dùng:** UA Manager, Video Editor.
- **Owner:** Long Trần (UA team). v1.0, 06/2026.
- **Vị trí:** `AI Knownledge/APR-067 - Social Tracker` (`social-tracker-release.rar`, PRD, video demo `Social Tracker.mp4` ~1.1MB).

[▶ Video demo: quét account, lọc theo view/ngày, bảng kết quả (1,1 MB)](../../media/2026-10/2026-10-14-social-tracker-demo-1.mp4)

## Input → Output
- Input: danh sách account TikTok (`accounts.json`), blacklist, ngưỡng view, số ngày, ngôn ngữ target.
- Output: bảng video (link, views, likes, ngôn ngữ, ngày). Push sang Google Sheets (mỗi lần push 1 tab mới theo ngày giờ) hoặc tải `.xlsx`.

## Cách chạy
1. Python 3.10+, `pip install -r requirements.txt`, `playwright install chromium`.
2. `python app.py` → `http://localhost:5050`.
3. Đăng nhập TikTok: dán **session cookie** (F12 → Application → Cookies → tiktok.com) vào popup. Cookie là thông tin đăng nhập, không chia sẻ.
4. (Tuỳ chọn) Export Sheets: deploy Apps Script Web App với quyền "Anyone" và dán URL vào ô 📊. Nếu để "Anyone with Google account" sẽ bị lỗi 401.

## Giới hạn / rủi ro
- **Bot detection TikTok**: phần discover dùng Playwright, có delay ngẫu nhiên 2–8 giây và giới hạn 300 profile/ngày. Bị chặn thì nghỉ 24–48h và refresh cookie. Nên dùng tài khoản TikTok phụ.
- Chỉ chạy local, chưa có Docker/cloud.
- Scraping có thể trái điều khoản TikTok. Dùng để research nội bộ, không phát tán lại nội dung của người khác.
- Roadmap: auto-scan theo lịch, tag hook type/format, theo dõi view tăng theo thời gian, dùng LLM phân loại hook.
