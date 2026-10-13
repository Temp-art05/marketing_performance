---
title: Render Pro — extension After Effects render hàng loạt biến thể video ads
type: reference
topic: 06-tools
tags: [after-effects, video, creative, batch-render, tool-noi-bo]
app: general
status: verified
confidence: high
sources:
  - AI Knownledge/APR-160 - After Effect Render Pro/RENDER_PRO_PRD.md (đọc 2026-10-14)
  - AI Knownledge/APR-160 - After Effect Render Pro/_info.md (đọc 2026-10-14)
  - AI Knownledge/APR-171 - One And Only/_info.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related: [06-tools/leave-the-text-alone-dich-text-after-effects.md, playbooks/san-xuat-creative-hang-loat-bang-ai.md]
summary: CEP extension AE — cấu hình Main Comp + Source Comps 1 lần, tự đổi layer head/body/tail theo Sequential/Mix để sinh 30–100 tổ hợp video và đẩy vào Media Encoder; tiết kiệm ~98% thao tác.
---

# Render Pro (After Effects)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-160 - After Effect Render Pro` (`RenderPro_v1.0.zip`, PRD, `tutorial.mp4` ~120 MB).
- Owner: Nguyễn Phan Đăng Dương (Video Editor).
- Bước roadmap: **giai đoạn 1 — creative** và giai đoạn tối ưu khi cần **nhiều biến thể video** (đa dạng asset là đòn bẩy chính của App campaign, xem [creative assets Google App campaigns](../01-pre-marketing/creative-assets-google-app-campaigns.md)).

## Làm gì
Một template AE thường phải xuất 30–100 output khác nhau ở footage đầu/thân/đuôi; làm tay 2–5 phút/output. Render Pro:
- Chọn **Main Comp** (vd `AIV080`) và **Source Comps** (vd `SC_Head`, `SC_Tail`, mỗi comp chứa nhiều layer footage A1, A2…); `Scan Main` tự tìm nested comp (tối đa 6 tầng).
- Sinh tổ hợp: **Sequential** (`(startIndex + k) % total`) hoặc **Mix** (random không trùng trong 1 vòng, các source cùng **Conflict Group** không chọn cùng slot trong 1 output). Bật/tắt audio theo source.
- 2 chế độ render: **AME Queue** (mỗi output 1 file .aep tạm — dễ debug) hoặc **Multi-Comp** (duplicate N comp, queue AME 1 lần — không race condition).
- Tự dọn file tạm, khôi phục project gốc; lưu 10 cấu hình gần nhất.

## Cách chạy
1. Cài extension từ zip (CEP). Mở AE → `Window → Extensions → Render Pro`.
2. Save project (Ctrl+S), **mở sẵn Adobe Media Encoder**.
3. Chọn Main Comp, thêm Source Comps, đặt start index / Mix / Aud cho từng source, điền prefix tên file + số output, chọn render mode → `▶▶ Queue to AME` → sang AME bấm Start Queue.

## Công cụ AE liên quan (cùng nhóm creative)
- **One And Only** (`AI Knownledge/APR-171 - One And Only`, owner Hoàng Trần): "bóc" một comp template ra khỏi bin `.aep` đã import, chỉ giữ sub-comp + footage thực sự dùng, gom vào 1 folder, xoá bin thừa (Link-only hoặc Copy). Dùng để giữ project host nhẹ trước khi render hàng loạt.
- **Leave The Text Alone**: dịch toàn bộ text layer để localize template — xem [doc riêng](leave-the-text-alone-dich-text-after-effects.md).

## Giới hạn
- Chỉ chạy trong AE (CEP, Chromium 109), cần AME mở sẵn.
- Mỗi Source Comp cần nhiều layer thì Sequential/Mix mới có nghĩa.
- Số "tiết kiệm 98% thời gian" là ước tính của chủ tool, chưa có số đo độc lập.
