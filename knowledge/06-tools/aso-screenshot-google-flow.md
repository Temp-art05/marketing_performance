---
title: ASO_Screenshot (Google Flow) — tạo bộ screenshot store đa kích thước, đa ngôn ngữ
type: reference
topic: 06-tools
tags: [aso, screenshot, store-listing, localization, google-flow, nano-banana, tool-noi-bo]
app: general
status: draft
confidence: medium
sources: ["AI Knownledge/APR-257 - AI Tool  ASO Phone Screenshots/Tamvm-ASO-Phone-Screenshots-Tool.md (đọc 2026-10-14)", "AI Knownledge/APR-257 - AI Tool  ASO Phone Screenshots/_info.md (đọc 2026-10-14)"]
created: 2026-10-14
updated: 2026-10-14
related: [01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md, 06-tools/terasofts-graphic-pro-tao-screenshot-store.md, 06-tools/app-store-screenshot-studio.md, 06-tools/cpp-generator-screenshot-tool.md]
summary: Shared tool Google Flow (Nano Banana Pro) — raw screenshot + caption → bộ 5–10 screenshot có khung thiết bị, headline, đúng kích thước App Store/Play, localize nhiều ngôn ngữ.
---

# ASO_Screenshot (AI Tool: ASO Phone Screenshots)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-257 - AI Tool  ASO Phone Screenshots` (PRD .md, video tutorial ~15 MB). Tool: https://labs.google/fx/tools/flow/shared/tool/be9a52da-3e4e-42c0-8c33-6723ede24492
- Owner: Tâm Võ Mạnh (Tamvm).
- Bước roadmap: **giai đoạn 1 — ASO**, cập nhật screenshot, **localize theo GEO**, tạo biến thể cho A/B test (Store listing experiments).

## Làm gì
- Upload raw screenshot (PNG/JPG) + mô tả ngắn từng tính năng cần nhấn (vd "Theo dõi chi tiêu tự động") + chọn nền tảng/kích thước/số ảnh/brand style.
- Nano Banana Pro dựng khung thiết bị, nền, bố cục, viết headline/sub-text (xử lý chữ trên ảnh tốt), giữ nhất quán màu/font cả bộ.
- Kích thước: iPhone 6.7"/6.5"/5.5", iPad 12.9", Android phone & tablet. Localize caption theo ngôn ngữ/khu vực (Hindi, Arabic, Spanish…).
- Chỉnh từng ảnh bằng ngôn ngữ tự nhiên; share link cho đồng đội.

Checklist trước khi upload Play: xem [screenshot làm bằng AI](../01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md).

## Cách chạy
Đăng nhập Google → mở link tool → upload → chọn kích thước → nhập caption → sinh → chỉnh → download. Không cần API key; tốn **credit Google Flow** (chi phí xem [Hạnh Creative](hanh-creative-google-flow-nhan-vat-nhat-quan.md)).

## Giới hạn / rủi ro
- Các "success metrics" trong PRD (< 90 giây/bộ, retention ≥ 60%…) là mục tiêu, không phải số đo.
- Ngôn ngữ RTL (Arabic) và chữ Devanagari cần người đọc được duyệt lại — model có thể sai chữ.
- Screenshot phải phản ánh trải nghiệm thật của app (Play Metadata policy) — AI có thể "vẽ thêm" UI không có trong app.

## Media
[▶ Video tutorial ASO_Screenshot trên Google Flow (15 MB)](../../media/2026-10/2026-10-14-aso-screenshot-flow-tutorial-1.mp4)
