---
title: Policy Helper (Policy Killer) — tra cứu lỗi policy Google Play / App Store / Facebook
type: reference
topic: 06-tools
tags: [tool, policy, aso, google-play, app-store, apps-script, gemini, ocr]
app: general
status: draft
confidence: high
sources:
  - "AI Knownledge/APR-107 - Policy Killer Tool-Tra & Fix lỗi Policy trên Google Play Console & Apple App Sto/PRD.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-107 - Policy Killer Tool-Tra & Fix lỗi Policy trên Google Play Console & Apple App Sto/Policy-Helper-San-Pham.zip → index.html, apps-script/HUONG-DAN-DEPLOY.txt (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md
  - 01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md
summary: "Tool chat của team ASO Apero: gõ mô tả lỗi, mã guideline hoặc dán ảnh thông báo policy → trả loại lỗi, cách team đã fix, link policy gốc. Bản local 1 file HTML (OCR offline) và bản Apps Script + Gemini."
---

# Policy Helper — tra cứu lỗi policy

## Làm gì
Chat hỏi–đáp tra **45 loại lỗi policy** (Android, iOS, Facebook) dựa trên lịch sử xử lý thật của team ASO Apero. Kết quả gồm loại lỗi, cách xử lý team đã dùng, nền tảng, gợi ý lỗi liên quan. Có thêm khu link tài liệu gốc Google Play Policy Center và Apple Review Guidelines. Nội dung kho đã được chép thành bài [Lỗi policy thường gặp và cách fix](../01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md).

- **Dùng ở bước:** Pre-Marketing (rà store listing, creative trước khi launch) và bất cứ lúc nào app bị Google/Apple gửi thông báo policy.
- **Người dùng:** PO, UA, Dev, nhân sự ASO mới.
- **Owner:** Thư Tạ Minh (team ASO).
- **Vị trí:** `AI Knownledge/APR-107 - Policy Killer Tool-Tra & Fix lỗi Policy trên Google Play Console & Apple App Sto` (file `Policy-Helper-San-Pham.zip`, video demo `Policy-Helper-Video-Demo.mp4` ~136MB).

## Input → Output
- Input: mô tả lỗi tiếng Việt/Anh (gõ không dấu vẫn tìm được), mã guideline (vd `3.1.2`, `target api`), hoặc **ảnh chụp thông báo policy** (dán Ctrl+V).
- Output: thẻ lỗi (loại, mô tả, các bước fix, nền tảng) + link tài liệu gốc.

## Cách chạy
| Bản | Cách chạy | Đọc ảnh | Cần gì |
|---|---|---|---|
| Local (đang dùng) | Giải nén zip, mở `index.html` bằng trình duyệt | OCR Tesseract **trên máy**, ảnh không gửi đi | Không cần gì |
| Apps Script (nâng cấp, theo PRD **chưa deploy**) | Tạo project Apps Script mới, dán `Code.gs` + `Index.html`, deploy Web App với quyền "Anyone within Apero" | Gemini đọc và hiểu ảnh | <cần API key Gemini> lưu ở Script Properties `GEMINI_API_KEY`, không dán vào code |

## Giới hạn / rủi ro
- OCR bản local chỉ tốt với ảnh nét, chữ tiếng Anh. Ảnh mờ thì gõ tay tên lỗi.
- Kho là kinh nghiệm nội bộ (cập nhật ~07/2026), có thể cũ so với policy mới. Case phức tạp phải hỏi Team ASO.
- Mục Facebook Developer Policy chưa có quy trình xử lý.
- Bản Apps Script chỉ được gửi **ảnh policy** lên Gemini, không gửi ảnh có doanh thu/hợp đồng.
- Roadmap: cho team tự thêm lỗi qua Google Sheet.

## Media
[▶ Demo tra lỗi policy bằng mô tả và bằng ảnh chụp thông báo (136 MB)](../../media/2026-10/2026-10-14-policy-helper-demo-1.mp4)
