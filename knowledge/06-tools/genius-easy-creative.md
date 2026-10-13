---
title: Genius Easy Creative — batch render video ads dọc 9:16 từ ảnh AI (app AI photo/video)
type: reference
topic: 06-tools
tags: [tool, creative, video-ads, batch, tiktok, reels, ai-photo, puppeteer, ffmpeg]
app: general
status: draft
confidence: high
sources:
  - "AI Knownledge/APR-075 - Genius Easy Creative/3 - skill.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-075 - Genius Easy Creative/4 - PRD.pdf (đọc 2026-10-14)"
  - "AI Knownledge/APR-075 - Genius Easy Creative/(PHẢI ĐỌC) HƯỚNG DẪN CÀI ĐẶT.pdf (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/creative-assets-google-app-campaigns.md
  - 01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md
  - 06-tools/cat-outro-watermark-video-hang-loat.md
  - 06-tools/social-tracker-tiktok.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
  - 06-tools/urender-ghep-video-ugc.md
  - 06-tools/xprompt.md
summary: "Tool của team UA (AnhLD1) ghép bộ ảnh AI thành hàng loạt video ads 1080×1920 30fps (hook → fake app UI → kết quả → nhạc → overlay → outro); 7 template, mặc định 25 video/persona, chạy local Mac/Win."
---

# Genius Easy Creative

## Làm gì
Lắp ráp tự động **video quảng cáo dọc 9:16** cho app AI photo/video. Từ một bộ ảnh nguồn (do AI tạo) tool sinh ra hàng loạt video gồm: animation hook → giao diện app giả lập (fake UI, chọn ảnh) → ảnh kết quả → nhạc → Social Frame overlay → outro. Mục đích là test A/B nhiều biến thể trên TikTok/Reels/Facebook.

- **Dùng ở bước:** Pre-Marketing (creative) và vòng tối ưu creative khi đang chạy campaign. Phù hợp nhất với **app AI Photo/Video**.
- **Bối cảnh:** PRD ghi team UA cần 20–50 biến thể/tuần, làm tay chỉ được vài video/ngày.
- **Owner:** Anh Lê Đức (AnhLD1), team UA. v1.0, 07/2026.
- **Vị trí:** `AI Knownledge/APR-075 - Genius Easy Creative` (`GeniuS-Studio-macOS.zip`, `GeniuS-Studio-Windows.zip`, video HDSD ~244MB, output mẫu trong `Demo Ouput/`).

Video output mẫu (concept couple):
[▶ Video output mẫu của Genius Easy Creative — concept "Couple Rain Love", 9:16 (14 MB)](../../media/2026-10/2026-10-14-genius-easy-creative-output-couple-1.mp4)

## Input → Output
- **Input (theo persona):** `personas/{id}/hook/` (≥ 4 ảnh hook), `music/`, `demos/{d}/` (input1–2 = ảnh "trước", out1–8 = ảnh "sau"). Chọn template, nền, overlay, outro, số lượng, hook text.
- **Asset dùng chung, kéo-thả không cần code:** `backgrounds/` (MP4 nền), `overlays/` (PNG Social Frame), `outro/` (MP4 outro), khai thêm trong `meta.json`. `config.json` chọn persona nào bật, số lượng, fps, template mặc định.
- **Template (7):** classic (lock screen), clean, pet, lock1, lock2, single-r (Remotion), video (hook video).
- **Output:** `output/{persona}/{demo}/*.mp4`, chuẩn 1080×1920, CFR 30fps, yuv420p, AAC. Mặc định 25 video/persona. Tool tự shuffle ảnh hook, random style và hook text cho mỗi video.

## Cách chạy
- Tải bản app theo hệ điều hành, giải nén, đọc `Huong dan su dung.pdf` bên trong, xem video demo.
- Từ source: `npm start` → `http://localhost:3334`. Cần **Node.js + Google Chrome** (FFmpeg đã bundle qua `ffmpeg-static`). Không cần API key; khâu tạo ảnh AI làm riêng bên ngoài (Flow / Nanobanana / Gemini).

## Giới hạn / rủi ro
- Tool chỉ **lắp ráp**. Chất lượng phụ thuộc ảnh AI đầu vào, nên phải duyệt ảnh trước khi đưa vào persona (méo mặt, thừa chi, sai concept). Dùng preview trong app trước khi render cả batch.
- Nền động mới áp cho template classic.
- Video có "fake UI" phải giống UI thật của app. UI hoặc tính năng không có trong app dễ bị đánh Misleading/Deceptive, xem [policy](../01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md).
- Thiếu input ở một demo thì tool bỏ qua demo đó và log `⚠️ Skipping ...`, không làm hỏng cả batch.
