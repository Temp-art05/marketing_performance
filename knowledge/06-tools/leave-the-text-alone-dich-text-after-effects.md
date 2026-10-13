---
title: Leave The Text Alone — dịch toàn bộ text layer After Effects để localize video ads
type: reference
topic: 06-tools
tags: [after-effects, localization, video, creative, translate, tool-noi-bo]
app: general
status: verified
confidence: high
sources:
  - AI Knownledge/APR-170 - Leave The Text Alone/Leave the text alone.md (đọc 2026-10-14)
  - AI Knownledge/APR-170 - Leave The Text Alone/_info.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related: [06-tools/render-pro-after-effects-render-hang-loat.md, playbooks/san-xuat-creative-hang-loat-bang-ai.md]
summary: CEP panel AE — quét đệ quy mọi text layer (cả sub-comp), soát/sửa/xoá, dịch sang ngôn ngữ của ~190 nước bằng Claude Code (Haiku) hoặc Google, ghi ngược giữ nguyên font/size/màu; có History khôi phục.
---

# Leave The Text Alone

## Bối cảnh
- Vị trí: `AI Knownledge/APR-170 - Leave The Text Alone` (source extension, `CAI DAT.bat`, `Video Demo.mp4`, hướng dẫn `Leave the text alone.md`).
- Owner: Hoàng Trần (Video Editor).
- Bước roadmap: **giai đoạn 1 — creative**, khi mở GEO mới cần video ads đúng ngôn ngữ (asset ngôn ngữ phải khớp ngôn ngữ targeting — xem [GEO và ngôn ngữ targeting](../02-ua-channels/google-ads/geo-va-ngon-ngu-targeting.md)).

## Làm gì
- Tab **Change text**: chọn comp → **CHECK** quét đệ quy comp + mọi sub-comp, liệt kê text layer để soát/sửa/xoá → chọn **Country + Language** (nước đa ngôn ngữ như India có Hindi, Bengali, Tamil…) → **TRANSLATE** ghi ngược đúng layer, áp lại style gốc (font, cỡ, màu, stroke, canh lề).
- Gợi ý font cho hệ chữ không-Latin (Ả Rập, Devanagari, Thái, CJK, Hebrew) + nhắc RTL.
- Tab **History**: before → after từng dòng, bấm để khôi phục; vẫn Ctrl+Z được.
- 2 engine: **Claude (máy này)** — gọi `claude -p` headless bằng tài khoản Claude Code của chính người dùng, model Haiku, gửi theo lô 40 dòng, dịch subtitle tự nhiên hơn; **Google Translate** — dự phòng, không cần key.

## Cách chạy
1. Chạy `CAI DAT.bat` (Windows) để cài extension; AE 2017+ (CSXS 6.0).
2. Muốn dùng engine Claude: máy phải cài và đăng nhập Claude Code (không cần API key riêng). Chưa có thì panel tự chuyển sang Google.
3. AE → Window → Extensions → "Leave the text alone".

## Giới hạn / rủi ro
- Chỉ đổi text layer — text nằm trong footage/ảnh không dịch được.
- Câu dịch dài hơn có thể tràn khung: phải xem lại từng comp trước khi render.
- Máy dịch không thay được người bản ngữ cho hook/CTA; nên nhờ người bản ngữ duyệt bản cho GEO chi tiêu lớn.

## Media
[▶ Demo CHECK → TRANSLATE text layer trong After Effects (9 MB)](../../media/2026-10/2026-10-14-leave-the-text-alone-demo-1.mp4)
