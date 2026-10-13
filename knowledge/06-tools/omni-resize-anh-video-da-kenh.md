---
title: OmniResize — resize hàng loạt ảnh/video sang 1:1, 9:16, 16:9 (Google Colab)
type: reference
topic: 06-tools
tags: [creative, resize, aspect-ratio, video, image, tool-noi-bo]
app: general
status: draft
confidence: high
sources: ["AI Knownledge/APR-246 - Omni  Resize Image & Video/OMNI_ Resize Image & Video.docx (đọc 2026-10-14)", "AI Knownledge/APR-246 - Omni  Resize Image & Video/_info.md (đọc 2026-10-14)"]
created: 2026-10-14
updated: 2026-10-14
related: [01-pre-marketing/creative-assets-google-app-campaigns.md, playbooks/san-xuat-creative-hang-loat-bang-ai.md, 06-tools/cat-outro-watermark-video-hang-loat.md]
summary: Notebook Colab nhận nhiều ảnh/video, xuất đồng thời 3 tỉ lệ 1:1, 9:16, 16:9 bằng fit & pad (thu nhỏ + đệm nền trắng/đen, không crop), đặt hậu tố _1-1/_9-16/_16-9, gói 1 file ZIP.
---

# OmniResize (Omni: Resize Image & Video)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-246 - Omni  Resize Image & Video` (PRD .docx, 2 video hướng dẫn: ảnh ~50 MB, video ~350 MB). Link Colab nằm trong docx dạng hyperlink "Omni: Resize Image & Video" — hỏi owner nếu không mở được.
- Owner: Uyên Nguyễn Hồng Phương (Marketing Performance / Video Editor).
- Bước roadmap: **giai đoạn 1 — creative**, chuẩn bị bộ asset đa kênh (Google, Facebook, TikTok) từ 1 file gốc.

## Làm gì
| Input | Output |
|---|---|
| Nhiều file cùng lúc: ảnh `.jpg/.jpeg/.png/.webp`, video `.mp4/.mov/.avi` | Mỗi file → 3 bản: **1:1** (ảnh 1200×1200, video 1080×1080), **9:16** (1080×1920), **16:9** (1920×1080); tên có hậu tố `_1-1`, `_9-16`, `_16-9`; tất cả trong `media_da_resize.zip`, tự tải về |

Nguyên lý **Fit & Pad**: không crop — thu nhỏ toàn bộ nội dung cho vừa khung, phần trống đệm nền **trắng (ảnh) / đen (video)** → không mất chữ, logo, chủ thể.

## Cách chạy
Mở link Google Colab → chạy cell → upload file → chờ ZIP tự tải. Cần tài khoản Google, không cần API key.

## Giới hạn / lưu ý cho UA
- **Thiếu tỉ lệ Google App campaigns cần**: ảnh **1.91:1 (1200×628)** và **4:5 (1200×1500)** không có; 16:9 không thay được 1.91:1. Xem [spec asset App campaigns](../01-pre-marketing/creative-assets-google-app-campaigns.md).
- Fit & Pad tạo **viền đen/trắng (letterbox)** — giữ nội dung nhưng phí diện tích hiển thị; với video chính nên dựng lại bản dọc/vuông thật thay vì đệm (nhận định, chưa có số đo).
- Màu nền cố định (roadmap: chọn màu theo brand, chèn logo/watermark).

## Media
[▶ Hướng dẫn resize ảnh trên Colab (50 MB)](../../media/2026-10/2026-10-14-omniresize-tutorial-anh-1.mp4). Video hướng dẫn resize video (~350 MB) không đưa vào KB vì vượt giới hạn dung lượng.
