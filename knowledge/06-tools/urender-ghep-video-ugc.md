---
title: URender — ghép video UGC 2 người (AI tutor + learner), tự đồng bộ thoại và burn phụ đề 2 màu
type: reference
topic: 06-tools
tags: [tool, creative, ugc, video-ads, subtitle, ffmpeg, language-learning]
app: general
status: draft
confidence: medium
sources:
  - "AI Knownledge/APR-094 - URender/TOOL_OVERVIEW.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-094 - URender/_info.md (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 06-tools/cat-outro-watermark-video-hang-loat.md
  - 06-tools/genius-easy-creative.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
summary: "App desktop ghép video AI tutor + learner thành MP4 1080×1920: chỉ co giãn khoảng lặng để khớp thoại, 5 layout, phụ đề 2 màu (cả Indic/CJK); cho video UGC app học ngôn ngữ."
---

# URender

## Làm gì
Ghép 2 video riêng (AI tutor nói, learner phản hồi) thành **1 video dọc 1080×1920** có thoại khớp và phụ đề 2 màu. Thay cho khoảng 20–30 lệnh ffmpeg thủ công mỗi video.
- **Đồng bộ thoại:** dùng `silencedetect` tìm khoảng lặng > 1.1s ở video AI (lúc chờ learner). **Không đổi tốc độ thoại**, chỉ co/giãn phần im lặng (`atempo` xâu chuỗi, 0.125×–8×).
- **5 layout:** Script Stacked, Split Screen, Portrait PiP, Stacked Equal, Landscape 4:3.
- **Phụ đề:** renderer PIL cho Latin/Việt/Ả Rập; tự chuyển sang ASS/libass + HarfBuzz cho Hindi, Tamil, Bengali, Nhật, Hàn, Trung. Font tự tải từ Google Fonts.

- **Dùng ở bước:** sản xuất creative dạng **UGC hội thoại** cho app học ngôn ngữ/AI tutor (ads TikTok/Reels). Format này đặc thù, các thể loại app khác ít dùng.
- **Owner:** Thư Vũ Thị Minh (Video Editor).
- **Vị trí:** `AI Knownledge/APR-094 - URender` (`installer/URenderSetup-v1.0.exe`, `source/app.py`, `SETUP.md`, `TROUBLESHOOTING.md`, `HANDOFF.md`).

## Cách chạy
- Windows: cài `URenderSetup-v1.0.exe`. Hoặc chạy từ source: Flask `localhost:7861` (xem `SETUP.md`). Không cần API key.

## Giới hạn
- Chỉ làm khâu ghép/render. Video tutor và learner phải có sẵn.
