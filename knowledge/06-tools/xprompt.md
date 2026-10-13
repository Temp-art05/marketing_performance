---
title: XPrompt — app desktop tự tối ưu prompt identity-transfer (ảnh ref concept + ảnh nhân vật → Qwen)
type: reference
topic: 06-tools
tags: [tool, creative, ai-image, prompt, qwen, gemini, claude, identity-transfer, ai-photo]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-114 - XPrompt/Docs/huong-dan-su-dung.md (đọc 2026-10-14)
  - AI Knownledge/APR-114 - XPrompt/_info.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related: [01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md, 06-tools/genius-easy-creative.md, playbooks/san-xuat-creative-hang-loat-bang-ai.md]
summary: App macOS/Windows (Lâm Hoàng Văn) chạy vòng phân tích ảnh ref → viết prompt → Qwen sinh ảnh với ảnh nhân vật → Claude chấm 4 tiêu chí → sửa prompt, dừng khi điểm ≥ ngưỡng; hợp làm ảnh concept cho creative app AI photo.
---

# XPrompt

## Làm gì
Đưa vào **1 ảnh reference** (concept: bố cục, tư thế, ánh sáng, phong cách) và **ảnh nhân vật** (danh tính cần giữ). XPrompt chạy vòng lặp: Analyze (Gemini hoặc Claude vision) → Compose prompt → Generate (Qwen, ảnh reference **không** gửi cho Qwen) → Critique (Claude chấm 4 tiêu chí: bám concept, giữ danh tính, không lẫn mặt reference, độ trung thực chất liệu) → Refine. Dừng khi điểm ≥ ngưỡng (thang 0–10, khoảng 8 là tốt) hoặc hết số vòng.

- Mode: **IMAGE_EDITING** (1 nhân vật) và **COMBINE_IMAGES** (2 đối tượng, vd người + thú cưng).
- **Dùng ở bước:** làm ảnh concept/template cho creative ads, screenshot store, hoặc thử concept template mới cho app AI photo trước khi làm video (ví dụ đưa vào [Genius Easy Creative](genius-easy-creative.md)). Target gốc là Android dev, PO, UI/UX designer.
- **Owner:** Lâm Hoàng Văn. v0.1.0.
- **Vị trí:** `AI Knownledge/APR-114 - XPrompt` (`MacOS/*.dmg` cho Intel và arm64, `Win/XPrompt-0.1.0-setup.exe`, `Docs/huong-dan-su-dung.md`, `Docs/Demo.mov` ~135MB).

## Cách chạy
- macOS: kéo vào Applications. Bản build chưa ký nên lần đầu phải chuột phải → Open, hoặc chạy `xattr -dr com.apple.quarantine "/Applications/XPrompt.app"`.
- Windows x64: chạy installer, SmartScreen → More info → Run anyway.
- Settings (bắt buộc): **Qwen** (sinh ảnh) <cần API key, public key PEM và bundle ID của service Qwen nội bộ Apero, lấy từ Apero Firebase Remote Config> + ít nhất 1 trong 2: **Gemini** <cần Gemini API key, khuyến nghị model 2.5 Flash> hoặc **Claude** <cần Anthropic API key, hoặc token gói Claude, hoặc Claude Code CLI đã đăng nhập>. Khoá được lưu qua OS Keychain.
- Khuyến nghị maxIter 3–5.

## Giới hạn / rủi ro
- Bản 0.1.0 chưa ký số, chưa có bản Windows ARM.
- Sinh ảnh tốn chi phí API mỗi vòng.
- Ảnh concept lấy từ đối thủ hay style có bản quyền: chỉ dùng làm cảm hứng, xem lưu ý trong [khung prompt](../01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md).
