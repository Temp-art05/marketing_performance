---
title: Video Download — tải hàng loạt MP4 từ TikTok sound/hashtag, Facebook Ads Library, Drive
type: reference
topic: 06-tools
tags: [creative, research, tiktok, meta-ads, ad-library, competitor, tool-noi-bo]
app: general
status: draft
confidence: high
sources: ["AI Knownledge/APR-258 - Video Download/repo/README.md (đọc 2026-10-14)", "AI Knownledge/APR-258 - Video Download/repo/plans/260914-1412-tool-len-mini-va-domain/plan.md (đọc 2026-10-14)", "https://github.com/namhd-SG/video-download"]
created: 2026-10-14
updated: 2026-10-14
related: [06-tools/trendgrab-kham-pha-trend-tai-video.md, 01-pre-marketing/nghien-cuu-trend-cho-creative.md]
summary: App desktop Python (Win/macOS) tải hàng loạt MP4 không watermark từ TikTok music/hashtag/search, Facebook Ads Library, thư mục Google Drive; resume, chống block; tuỳ chọn gắn watermark chữ động.
---

# Video Download (APR-258)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-258 - Video Download/repo` (git repo, README, kế hoạch đưa lên server). Repo: https://github.com/namhd-SG/video-download
- Owner: Nam Hoàng Đức (Marketing Performance).
- Bước roadmap: **giai đoạn 1 — creative research**: gom video đối thủ từ **Facebook Ads Library**, gom video dùng cùng 1 sound/hashtag trending trên TikTok để phân tích hook/format; gom video từ Drive của team.

## Nguồn hỗ trợ
| Nguồn | URL | Ghi chú |
|---|---|---|
| TikTok music | `tiktok.com/music/...-<id>` | mọi video dùng sound đó |
| TikTok hashtag | `tiktok.com/tag/<hashtag>` | danh sách lấy qua index bên thứ ba `tikwm.com` vì feed hashtag của TikTok trả body rỗng (đo 08–09/09/2026) |
| TikTok search | `tiktok.com/search?q=` | cần cookies; hiện vẫn trả rỗng |
| Facebook Ads Library | `facebook.com/ads/library/?...` | tải MP4 từng ad, không cần cookie |
| Google Drive | link thư mục share | tải mọi MP4 |

## Cách chạy
1. Python 3.10+ (bản python.org có Tk), Git LFS (`git lfs install`), `git clone` repo (Download ZIP không kèm ffmpeg LFS).
2. Double-click `run-mac.command` / `run-windows.bat` → dán URL, chọn thư mục, START. Lần đầu tải Chromium ~150 MB.
3. CLI: `tiktok-music-dl "<url>" --output ./downloads --max 200 --delay 2.0` (có `--proxy`, `--cookies`, `--headful`…).
- Cookies TikTok (tuỳ chọn, cho search và > ~28 video): export JSON bằng extension Cookie-Editor khi đã đăng nhập — **cookie là credential cá nhân, không chia sẻ/commit**.

## Giới hạn / rủi ro
- Lần chạy đầu thường fail vài video (TikTok cold-start) → bấm START lại, tool bỏ qua file đã có.
- Chống block: delay ngẫu nhiên ×0.75–2.0, xoay UA, stealth, backoff 30 s→300 s, nghỉ 60 s mỗi 50 video. Vẫn có thể bị chặn.
- `tikwm.com` không chính thức, có thể ngừng.
- Pháp lý (README): chỉ tải nội dung mình sở hữu hoặc được phép; video đối thủ chỉ để nghiên cứu, không dùng lại làm asset.
- Đang có kế hoạch (09/2026) đưa lên Mac mini công ty thành web và nối vào **meta-auto** (link trong nav) — chưa hoàn tất tại thời điểm đọc.
