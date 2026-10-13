---
title: CPP generator (Screenshot AI Tool) — bộ 5 screenshot theo use case/TA từ template
type: reference
topic: 06-tools
tags: [tool, aso, screenshot, custom-product-page, custom-store-listing, ai-image]
app: general
status: draft
confidence: high
sources:
  - "AI Knownledge/APR-065 - CPP generator - Screenshot tool/_info.md, Screenshot Tool byngoclm.zip → PRD.md, SPEC.md (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md
  - 06-tools/app-store-screenshot-studio.md
  - 06-tools/terasofts-graphic-pro-tao-screenshot-store.md
  - 06-tools/aso-screenshot-google-flow.md
summary: Tool UA/ASO của NgocLM — chọn 1 trong 8 template, upload ảnh UI, nhập brief TA; Claude viết copy theo arc hero→closer, Gemini phân tích style, fal.ai dựng 5 screenshot iOS 1242×2688 trong khoảng 1–2 phút.
---

# CPP generator — Screenshot AI Tool

## Làm gì
Khi một app được chạy UA theo **nhiều use case/đối tượng (TA)**, mỗi use case cần bộ screenshot riêng (Custom Product Page trên iOS) khớp creative để tăng CVR. Tool rút thời gian làm 1 bộ từ 1–3 ngày designer xuống khoảng 5 phút.
- Wizard 5 bước: chọn template (8 mẫu: tilted phone pastel, phone in hand photo, split bold text, minimal + social proof, AI app light purple...) → upload ≤5 ảnh UI → nhập brief TA, Claude sinh copy (headline, từ nhấn, subtext, CTA, proof, loại slide), **sửa copy trước khi gen** → gen 5 slide (stream từng ảnh) → feedback để **gen lại riêng 1 slide**, export ZIP.
- Pipeline: Claude Sonnet (copy) → Gemini Flash (rút style guide 14 trường từ ảnh template) → fal.ai `gemini-3-pro-image-preview/edit`, fallback `gpt-image-2/edit`.
- Quality bar nhúng vào prompt (phone 68–82% canvas, contrast 4.5:1, thumbnail 220 px...). Xem [thiết kế screenshot store](../01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md).
- **Bước roadmap**: Pre-Marketing/ASO và trong lúc chạy campaign (mỗi ad group theo use case có landing listing riêng).
- **Owner**: Lê Minh Ngọc (NgocLM). Vị trí: `AI Knownledge/APR-065 - CPP generator - Screenshot tool`.

## Cách chạy
Backend `cd server && node index.js` (cổng 3001) + frontend `cd client && npm run dev` (5173). `server/.env`: <cần FAL_KEY>, <khuyến nghị GOOGLE_API_KEY cho Gemini>, <tuỳ chọn ANTHROPIC_API_KEY; nếu không có, dùng OAuth Claude Code trên máy>. Deploy được frontend lên Vercel, backend lên Railway.

## Giới hạn quan trọng với app Android
- **Chỉ hỗ trợ format App Store** (1242×2688, ghi nhầm là 6.9" trong PRD, thực tế là 6.5"). Tỷ lệ > 2:1 nên **không hợp lệ cho Google Play**. Android 1080×1920 nằm trong roadmap V2.0.
- Trên Google Play, tính năng tương đương CPP là **Custom store listings** (≤50 listing; target theo country, Google Ads campaign, URL, search keyword, user không hoạt động).
- Resize bằng `sharp` dạng fill (kéo giãn) có thể làm méo. Gen 5 ảnh tuần tự (~30–60 giây).
- Các ảnh "Beautiful App Store Screenshots for Design Inspiration" trong zip là ảnh cộng đồng/của app khác, chỉ dùng làm cảm hứng, **không** dùng lại trực tiếp.
- Video demo (259 MB) **không đưa vào KB** (quá nặng so với giá trị, tool chỉ xuất kích thước iOS). Xem tại nguồn: `AI Knownledge/APR-065 - CPP generator - Screenshot tool/SPM_Ngoclm_Screenshot tool.mp4`.
