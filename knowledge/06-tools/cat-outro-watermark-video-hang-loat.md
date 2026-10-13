---
title: Hậu kỳ video ads hàng loạt — ghép/cắt outro, gắn logo/watermark, resize (Creative Editor, Video Studio, Outro Tool)
type: reference
topic: 06-tools
tags: [tool, creative, video-ads, outro, watermark, resize, ffmpeg, opencv, batch]
app: general
status: draft
confidence: high
sources:
  - "AI Knownledge/APR-127 - Tool cắt ghép outro hàng loạt siêu nhanh gọn/HUONG_DAN_SU_DUNG.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-111 - Video Studio/prd-video-studio.md, video-studio-skill.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-030 - Tool ghép outro hàng loạt/README.md, server.js, _info.md (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related: [06-tools/genius-easy-creative.md, 06-tools/social-tracker-tiktok.md, 06-tools/urender-ghep-video-ugc.md, 06-tools/omni-resize-anh-video-da-kenh.md, 01-pre-marketing/creative-assets-google-app-campaigns.md, 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md, playbooks/san-xuat-creative-hang-loat-bang-ai.md, 06-tools/youtube-auto-uploader.md]
summary: Ba tool nội bộ cùng làm hậu kỳ video ads hàng loạt — Creative Editor (Windows, cắt outro đối thủ + chèn outro mình + watermark), Video Studio (web local, detect outro), Outro Tool (ghép outro + resize 4 tỉ lệ).
---

# Hậu kỳ video ads hàng loạt: outro, watermark, resize

Ba project cùng một việc nên gộp vào một bài để so sánh: biến một lô video (video tự làm, hoặc video "spy" tham khảo trên thị trường) thành bản có **outro/logo của app mình** và **đủ tỉ lệ** cho từng kênh.

> Gộp 2026-10-14 từ 2 tài liệu ứng viên (Creative Editor + Video Studio; Outro Tool). Mỗi tool vẫn có vị trí nguồn riêng ở bảng dưới.

## So sánh nhanh

| | **Creative Editor v1.2** (APR-127) | **Video Studio** (APR-111) | **Outro Tool** (APR-030) |
|---|---|---|---|
| Owner | Đức Nguyễn Huy Anh ("Apero Creative Team") | Nguyễn Thị Thanh | Trần Nguyễn Minh Tú |
| Dạng | App Windows 10/11 standalone (`CreativeEditor.exe`, bundle ffmpeg) | Web local Flask `python3 app.py` → `localhost:5001`, cần FFmpeg/FFprobe + `opencv-python`, Pillow | Web local Node ≥16 + FFmpeg trong PATH (`npm start` → `localhost:3000`) |
| Cắt outro có sẵn | Tự động (hard-cut + frame tĩnh), theo **logo đối thủ** (template matching), hoặc X giây cuối | Tự động 3 tín hiệu: scene cut, static hold, **bright static** (màn store nền trắng), detect icon đối thủ | Không |
| Chèn outro của mình | Có (tự scale/pad khớp resolution, FPS) | Không thấy trong doc | **Có** — việc chính (1 outro/lượt, upload mới thay outro cũ) |
| Logo/watermark | Logo hoặc text bay: Bounce/Sine/Drift; gợi ý scale 10–20%, opacity 20–40%, speed 40–80 px/s | "Bay Icon": ellipse, figure-8, float, diagonal; opacity, spin, preview | Không |
| Resize | Crop 9:16 / 16:9 / 1:1 căn giữa | Resize 9:16 (tuỳ chọn) | 9:16, 16:9, 1:1, **4:5** (1080×1350) hoặc giữ nguyên — scale rồi **pad viền đen**, ép 30 fps; 1080p/720p/480p |
| Batch | Kéo thả thư mục, 2 luồng song song | Queue tuần tự, có progress | Nhiều video/lượt |
| Output | `.mp4` H.264 CRF 18 | `.mp4` libx264 CRF 18, AAC 192k, faststart | MP4/MOV/AVI/MKV/WebM, tên `DD-MM-YYYY_NNN` |
| Tốc độ (theo doc) | Video 30s 1080p: chỉ cắt < 1s; cắt + watermark ~8–15s; + outro ~12–20s | Không ghi | Không ghi |
| API key | Không | Không | Không |

**Chọn tool nào:**
- Chỉ cần gắn outro + đổi tỉ lệ cho video **tự sản xuất** → **Outro Tool** (đơn giản nhất, có 4:5 cho Meta feed).
- Cần cắt end-card có sẵn, gắn logo/watermark, chạy trên máy Windows không cài gì → **Creative Editor**.
- Cần detect outro kỹ (màn store trắng, icon đối thủ) và chạy được trên Mac → **Video Studio**.

- **Dùng ở bước:** Pre-Marketing → creative, và vòng làm biến thể khi đang chạy campaign. Video App campaign cần đủ 3 hướng ngang/dọc/vuông (xem [spec](../01-pre-marketing/creative-assets-google-app-campaigns.md)); sau đó upload YouTube bằng [YouTube Auto Uploader](youtube-auto-uploader.md).
- **Vị trí:** `AI Knownledge/APR-127 - Tool cắt ghép outro hàng loạt siêu nhanh gọn` (`CreativeEditor-v1.2.zip`, `video demo.mp4`), `AI Knownledge/APR-111 - Video Studio` (doc + source dạng markdown, link GitHub trong `Link Github - Video Studio Tool.xlsx`, 2 video demo ~0,7–0,8 GB không đưa vào KB), `AI Knownledge/APR-030 - Tool ghép outro hàng loạt` (thư mục `UI/` chỉ là mockup Stitch).

[▶ Video demo Creative Editor: kéo thả thư mục, cắt outro, gắn logo bay (20 MB)](../../media/2026-10/2026-10-14-creative-editor-cat-outro-demo-1.mp4)

[▶ Video output mẫu của Outro Tool sau khi ghép outro (6,7 MB)](../../media/2026-10/2026-10-14-outro-tool-output-mau-1.mp4)

## Tham số detect outro mặc định (Video Studio)
scan_window 10s cuối (PRD ghi 30s, skill ghi 10s; lấy theo skill là bản kỹ thuật) · scene_threshold 8 · static_threshold 3 · static_hold_min 1.5s · buffer lùi 1.0s · bright_threshold 155 · điểm cắt giới hạn trong [duration − 9s, duration − 0.2s]. Nhiều ứng viên thì lấy điểm **muộn nhất** để không cắt vào giữa video.

## Giới hạn / rủi ro
- ⚠️ **Bản quyền và policy.** Owner của cả APR-030 và APR-127 mô tả use case là video "spy" của creator/đối thủ. Cắt outro của họ rồi gắn outro/logo của mình để chạy ads là **vi phạm bản quyền** và có thể vi phạm policy IP của Google/Meta/TikTok, trừ khi đã mua license hoặc creator đồng ý. Video không phản ánh đúng app còn có thể dính **Deceptive Behavior / App Promotion / Misleading Claims** (xem [policy](../01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md)). Chỉ dùng tool với video **tự sản xuất hoặc có quyền**; video spy chỉ để tham khảo ý tưởng/storyboard. Quy định nội bộ của Apero về việc này chưa có trong nguồn — cần hỏi.
- Letterbox/pad viền đen (Outro Tool) phí diện tích hiển thị. Video gốc 16:9 mà cần bản 9:16 thì nên dựng lại bố cục (nhận định, chưa có số đo).
- Detect tự động có thể sai với outro mờ dần/không tĩnh. Xem lại vài file trước khi xuất cả batch; Creative Editor có fallback "X giây".
- Creative Editor ghi đè file trùng tên trong thư mục output; text watermark dùng font hệ thống (cần font tiếng Việt); chưa ký số nên Windows Defender hỏi lần đầu.
- Video thiếu audio: Outro Tool có 3 chiến lược fallback (giữ audio gốc + chèn im lặng…).
