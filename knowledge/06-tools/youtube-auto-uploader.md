---
title: YouTube Auto Uploader — upload video hàng loạt lấy link cho Google App campaign
type: reference
topic: 06-tools
tags: [tool, youtube, video, google-ads, creative]
app: general
status: draft
confidence: medium
sources:
  - "AI Knownledge/APR-006 - Auto upload video Youtube/_info.md, Link & HDSD.docx (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/creative-assets-google-app-campaigns.md
  - 01-pre-marketing/aso-google-play-store-listing.md
  - 06-tools/cat-outro-watermark-video-hang-loat.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
summary: Web tool nội bộ (yt-uploader-beta.vercel.app) đăng nhập Google, chọn thư mục video trên máy và upload hàng loạt lên kênh YouTube, trả link để gắn vào Google App campaign.
---

# YouTube Auto Uploader

## Làm gì
Google App campaigns chỉ nhận video qua **link YouTube**. Tool này thay việc upload thủ công từng video trong YouTube Studio: chọn thư mục, bấm upload tất cả, rồi copy link từng video.

- **Bước roadmap**: Pre-Marketing → chuẩn bị creative (video cho App campaign, xem [creative assets](../01-pre-marketing/creative-assets-google-app-campaigns.md)); cũng dùng được cho promo video của store listing.
- **Input**: thư mục video trên máy, tài khoản Google gắn kênh YouTube. **Output**: danh sách link YouTube.
- **Owner**: Trịnh Thu Thủy (Marketing Performance). Vị trí: `AI Knownledge/APR-006 - Auto upload video Youtube`.

## Cách dùng
1. Mở https://yt-uploader-beta.vercel.app
2. "Đăng nhập với Google" → chọn tài khoản gắn kênh → cấp quyền YouTube.
3. "Chọn thư mục" (chỉ làm 1 lần) → chọn thư mục chứa video.
4. Bấm "Upload" từng video hoặc "⬆ Upload tất cả".
5. Bấm "Copy" lấy link → dán vào asset video của campaign.

Không cần API key riêng (dùng OAuth Google của người dùng).

## Giới hạn / rủi ro
- Tài liệu **không nói** video được đặt chế độ Public/Unlisted/Private. Google Ads và preview video của Play **không nhận video Private** (Play yêu cầu Public/Unlisted, tắt monetization, cho embed). Kiểm tra trạng thái sau lần upload đầu tiên.
- Tool host trên Vercel (bản "beta"), cấp quyền YouTube cho app bên thứ ba. Nên dùng kênh YouTube dành riêng cho ads, không dùng kênh cá nhân quan trọng.
- Quota YouTube Data API có giới hạn số lượt upload/ngày. Batch rất lớn có thể bị chặn giữa chừng (chưa kiểm chứng).

## Media
[▶ Video demo: đăng nhập, chọn thư mục, upload hàng loạt, copy link (79 MB)](../../media/2026-10/2026-10-14-youtube-auto-uploader-demo-1.mp4)
