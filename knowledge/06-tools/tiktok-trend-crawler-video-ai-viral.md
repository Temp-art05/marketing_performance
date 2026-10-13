---
title: TikTok Trend Tool — crawl video AI viral theo hashtag (EN/ES/PT)
type: reference
topic: 06-tools
tags: [tiktok, trend, creative, research, photo-video-app, tool-noi-bo]
app: general
geo: [US, LATAM, BR, ES]
status: verified
confidence: high
sources:
  - AI Knownledge/APR-196 - Tiktok Crawl Trend/PRD_TikTok_Trend.md (đọc 2026-10-14)
  - "AI Knownledge/APR-196 - Tiktok Crawl Trend/TikTok_Trend_Tool.zip: README_CHAY_TOOL.md, hashtags.json, backend/crawl_today.py (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related: [01-pre-marketing/nghien-cuu-trend-cho-creative.md, 06-tools/trendgrab-kham-pha-trend-tai-video.md]
summary: Tool Python chạy local crawl video AI viral trên TikTok theo ~40 hashtag/ngôn ngữ (EN/ES/PT), giữ video 48h, xếp theo view, dashboard xem inline + Favorite. Cần ms_token cookie TikTok.
---

# TikTok Trend Tool (Tiktok Crawl Trend)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-196 - Tiktok Crawl Trend` (PRD, `TikTok_Trend_Tool.zip`, video ghi màn hình dashboard).
- Owner trên hub: Hằng Lưu Minh (Marketing Performance); PRD ghi người thực hiện huynq1@apero.vn.
- Bước roadmap: **giai đoạn 1 — Pre-Marketing, creative**: tìm idea/format đang viral để làm creative, đặc biệt cho dòng app **Photo/Video AI** (hub nhắc mùa World Cup cần update trend liên tục).

## Làm gì
- Đọc `hashtags.json` (3 nhóm `en` / `es` / `pt`, mỗi hashtag lấy tối đa `_fetch_per_tag` = 100 video), gọi TikTok qua thư viện `TikTokApi` + Playwright.
- Lọc video đăng trong **48 giờ** (`FILTER_HOURS = 48`), lọc ngôn ngữ caption bằng `langdetect`, tải thumbnail về máy (link ảnh TikTok hết hạn nhanh), **sắp xếp theo views giảm dần**.
- Dashboard tĩnh `index.html` (localhost:3000): tab **48 hours** (theo EN/PT/ES) và tab **7 days** (video đã ★ Fav, lưu localStorage); card có view/like/comment/share, tác giả, mô tả; phát video inline; search theo `@tác_giả`, `#hashtag`, từ khoá.
- Chỉ lưu metadata JSON, **không tải file video**.

Bộ hashtag mẫu và cách dùng nó trong nghiên cứu creative: xem [Nghiên cứu trend cho creative](../01-pre-marketing/nghien-cuu-trend-cho-creative.md).

## Cách chạy (Windows, có .bat)
1. Cài Python 3.12 (tick "Add Python to PATH"). Chạy `CAI_DAT.bat` một lần.
2. **<cần ms_token>**: đăng nhập tiktok.com → F12 → Application → Cookies → `msToken` → dán vào `config.json` (copy từ `config.example.json`). Đây là cookie phiên cá nhân — không chia sẻ, không commit.
3. `CRAWL_MOI.bat` để crawl, `CHAY_SERVER.bat` để xem (giữ cửa sổ server mở).
- Lệnh tay: `python backend\crawl_today.py en --max-minutes 5` rồi `python serve_local.py`.
- Tool có sẵn ~15 video mẫu để xem dashboard khi chưa có token.

## Giới hạn / rủi ro
- `ms_token` hết hạn → crawl rỗng; lấy token mới.
- Chỉ 1 vùng (vùng của token/IP) — bản cũ crawl US/BR/MX qua VPN đã bị bỏ.
- `langdetect` sai với caption ngắn.
- Dùng API không chính thức của TikTok: có thể gãy bất kỳ lúc nào; chỉ dùng để tham khảo idea, không dùng lại nội dung của người khác làm asset quảng cáo.
