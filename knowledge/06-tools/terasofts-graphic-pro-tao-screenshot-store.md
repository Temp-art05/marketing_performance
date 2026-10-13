---
title: Terasofts Graphic Pro — tạo nhanh bộ screenshot store bằng AI (Gemini + Flux)
type: reference
topic: 06-tools
tags: [aso, screenshot, store-listing, gemini, ai-image, tool-noi-bo]
app: general
status: draft
confidence: high
sources: ["AI Knownledge/APR-225 - Tool Web tạo bộ ảnh Screenshot đơn giản giành cho những app mới cần nhanh. chỉ đ/PRD.md (đọc 2026-10-14)", "AI Knownledge/APR-225 - Tool Web tạo bộ ảnh Screenshot đơn giản giành cho những app mới cần nhanh. chỉ đ/HUONG_DAN_SU_DUNG.md (đọc 2026-10-14)"]
created: 2026-10-14
updated: 2026-10-14
related: [01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md, 06-tools/aso-screenshot-google-flow.md, 06-tools/app-store-screenshot-studio.md, 06-tools/cpp-generator-screenshot-tool.md]
summary: Web Next.js chạy local — upload ≤10 ảnh UI + file mô tả .docx/.txt → Gemini 2.5 Flash viết headline/subtext theo mạch Hook→Solution→Features→Social Proof→CTA, Flux tạo nền, ghép mockup, xuất ZIP 1080×1920.
---

# Terasofts Graphic Pro

## Bối cảnh
- Vị trí: `AI Knownledge/APR-225 - Tool Web tạo bộ ảnh Screenshot…` (`terasofts-graphic-pro-source.zip`, PRD, hướng dẫn, video demo, ảnh chụp kết quả).
- Owner: Hiệp Nguyễn Mạnh (ASO). Dùng khi designer quá tải, app mới cần **bộ screenshot nhanh, đơn giản**.
- Bước roadmap: **giai đoạn 1 — ASO** (screenshot store listing), cũng dùng làm biến thể cho A/B test store listing.

## Làm gì
1. **Upload**: tối đa 10 ảnh UI thật (PNG/JPG, khuyến nghị dọc 9:19) + file mô tả app `.docx/.txt` (bắt buộc cả hai) + ảnh brief tuỳ chọn.
2. **Configure**: số slide 1–7, platform Android/iOS, style Vibrant/Dark/Bold/Minimal, tone Professional/Playful/Inspiring, brand color hex, design brief tự do (ưu tiên cao nhất).
3. **Generate**: Gemini 2.5 Flash đọc file mô tả → tên app, tính năng, USP, ngành → viết headline (≤ 6 từ) + subtext (≤ 12 từ) theo ngôn ngữ của file, theo mạch **Hook → Solution → Features ×3 → Social Proof → CTA**; tạo prompt nền với **1 master palette** cho cả bộ. Nền 1080×1920 do Pollinations (Flux) sinh, fallback Magnific AI. Ghép vào mockup Samsung S25 Ultra + overlay chữ.
4. **Export**: ZIP các PNG 1080×1920. Có thư viện Reference — ném ảnh mẫu đẹp để Gemini học màu, bố cục, mood.

Kiểm tra trước khi upload lên Play: xem [checklist screenshot làm bằng AI](../01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md).

## Cách chạy
Giải nén source → `npm install` → `npm run dev` → localhost:3000/create. Biến môi trường: **<cần GEMINI_API_KEY (Google AI Studio)>**, tuỳ chọn **<MAGNIFIC_API_KEY>** (có credit). Pollinations miễn phí, không cần key.

## Giới hạn / rủi ro
- Chưa deploy, chạy localhost; không đọc PDF; font hệ thống cố định.
- Pollinations giới hạn ~1 request/5 s (tool tự chờ); Gemini free ~500 request/ngày (theo PRD).
- Slide **"Social Proof"** dễ sinh câu kiểu "#1", "Best app", "Editor's choice", "1M+ users" → **vi phạm Metadata policy của Google Play** (cấm claim xếp hạng/thành tích, giá/khuyến mãi, chương trình Google Play). Phải soát thủ công.
- Mockup thiết bị cố định Samsung S25 Ultra.
