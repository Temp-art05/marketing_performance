---
title: Hạnh Creative (Google Flow) — gen hàng loạt ảnh/video giữ nhân vật nhất quán
type: reference
topic: 06-tools
tags: [creative, google-flow, nano-banana, veo, ai-image, ai-video, localization, tool-noi-bo]
app: general
status: draft
confidence: medium
sources: ["AI Knownledge/APR-247 - Tool Gen Ảnh Video Hàng Loạt/hanh-creative-image-video.md (đọc 2026-10-14)", "AI Knownledge/APR-247 - Tool Gen Ảnh Video Hàng Loạt/PRD_HanhPT_Creative_Image_Video.md.docx (đọc 2026-10-14)", "https://support.google.com/googleone/answer/16287445 (tra 2026-10-14)"]
created: 2026-10-14
updated: 2026-10-14
related: [06-tools/ka-tool-bulk-google-flow.md, playbooks/san-xuat-creative-hang-loat-bang-ai.md, 01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md]
summary: Shared tool trên Google Flow — 1 ảnh tham khảo + prompt → batch ảnh (Nano Banana Pro) hoặc video có âm thanh (Veo 3.1) giữ nguyên nhân vật; dùng tạo biến thể cùng concept, localize theo quốc gia/độ tuổi.
---

# Hạnh Creative — Image & Video (Google Flow)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-247 - Tool Gen Ảnh Video Hàng Loạt` (mô tả .md, PRD .docx, video tutorial .mov). Tool: https://labs.google/fx/tools/flow/shared/tool/d1db3a58-65d6-4b67-bd97-d94a4e2b85cd
- Owner: Hanh Pham (HanhPT).
- Bước roadmap: **giai đoạn 1 — creative** và **scale creative thắng**: khi 1 concept có ROAS tốt, sinh nhiều biến thể cùng concept, chỉ đổi ngoại hình nhân vật theo quốc gia/độ tuổi.

## Làm gì
- Input: ảnh tham khảo nhân vật (PNG/JPG/WebP) + prompt mô tả cảnh/phong cách/hành động/góc + chọn output ảnh hoặc video (số lượng, tỉ lệ, thời lượng).
- Model: **Nano Banana Pro** (ảnh, giữ nhân vật), **Veo 3.1** (video có âm thanh native), Gemini (chỉnh sửa bằng ngôn ngữ tự nhiên). Dùng tính năng Characters/"ingredients" của Flow để giữ đặc điểm nhân vật.
- Output: batch ảnh (tới 4K với gói cao), video 1080p (Plus) / 4K (Ultra).

## Cách chạy
Đăng nhập Google → mở link tool → upload ảnh → nhập prompt → chọn ảnh/video → sinh → tinh chỉnh → download. Không cần API key; tiêu thụ **credit Google Flow** theo gói Google AI.

## Chi phí (cần xác minh)
PRD (07/2026) ghi: Free 50 credit/ngày; AI Plus $4.99/tháng 200 credit; AI Pro $19.99/tháng 1.000 credit; AI Ultra $99.99–$199.99/tháng 10.000–25.000 credit. Tra web 2026-10-14: số credit Pro/Ultra khớp trang Google One, giá Plus có nguồn ghi $7.99, giá thay đổi theo quốc gia → kiểm tra trang Google One trước khi mua.

## Giới hạn / rủi ro
- Nhân vật vẫn có thể lệch giữa các lần sinh → dùng nhiều ảnh tham khảo, prompt cụ thể.
- Ảnh người thật làm tham khảo: cần quyền sử dụng hình ảnh; nội dung AI dùng cho ads phải tuân theo policy kênh (Google/Meta/TikTok yêu cầu nhãn hoặc cấm một số dạng nội dung tổng hợp — kiểm tra trước khi chạy).
- Phụ thuộc Google Labs, không có API ngoài Flow.

## Media
[▶ Tutorial dùng Hạnh Creative trên Google Flow (19 MB)](../../media/2026-10/2026-10-14-hanh-creative-tutorial-1.mov)
