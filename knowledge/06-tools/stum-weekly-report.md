---
title: Stum Weekly Report — tự lấy số mktpro và điền báo cáo tuần theo mẫu stum vào Google Sheet
type: reference
topic: 06-tools
tags: [tool, reporting, mktpro, ltv, retention, version-compare, google-sheets, playwright]
app: general
status: draft
confidence: high
sources:
  - "AI Knownledge/APR-099 - stum-weekly-report/MO-TA-SAN-PHAM.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-099 - stum-weekly-report/Stum-Tool.zip → README.md, HUONG-DAN.md, src/config.js, src/tiers.js, src/format.js (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
  - 06-tools/apero-app-performance-checker.md
summary: "Tool Node.js + Playwright (My Nguyễn Thảo) chạy Chủ Nhật 15:00, lấy LTV D0, R1, churn D0, session, time, crash từ mktpro cho top 3 country theo revenue, lọc ngày \"đủ số\" theo tier, so 2 version rồi ghi vào Google Sheet."
---

# Stum Weekly Report

## Làm gì
Tự động hoá báo cáo tuần hiệu quả app theo **mẫu stum**. Trước đây làm tay bằng cách vào mktpro xem từng app, từng thị trường rồi gõ vào Sheet.
- Lấy số qua API của **mktpro.aperogroup.ai**, dùng lại phiên đăng nhập của người dùng.
- Phạm vi Thứ 2 → Thứ 7. Chỉ tính **ngày đủ số** theo tier country (Tier 1/2/3 ↔ 100/300/1000 new user/ngày). Mỗi app lấy **top 3 country** theo revenue.
- Tự nhận 1 hay 2 version: 2 version (version thứ 2 ≥ 300 new user/tuần) → so % với version cũ; 1 version → giá trị trung bình.
- Ghi vào Google Sheet: cột = tuần (ngày Chủ Nhật), dòng = mã app; tự tạo cột/dòng mới. Có thể gửi thêm qua Discord webhook.

Quy tắc chi tiết (bảng tier, ngưỡng) xem [Hậu kiểm version app](../05-optimization/hau-kiem-version-app-nguong-verdict.md).

- **Dùng ở bước:** đo lường & tối ưu, báo cáo hằng tuần cho PO/Marketing.
- **Owner:** My Nguyễn Thảo (Product Owner). Repo private: `github.com/mynt-prog/stum-weekly-report`.
- **Vị trí:** `AI Knownledge/APR-099 - stum-weekly-report` (`Stum-Tool.zip`, video demo ~60MB, thư mục `Forks/` có video output của người dùng khác).

## Ví dụ output (1 ô)
```
Ver 1.2.2
Ver 1.3.1
US: đủ số 5 ngày 23/06–27/06
- LTV D0:
23/06: giảm ~18.6%
24/06: tăng ~9.1%
- R1: tăng ~2%
- Churn D0: tăng ~2.3% 3x%
- Session/User: đi ngang
- Time/User: đi ngang
- Crash: >99
```

## Cách chạy (Windows)
1. Node.js. Cài dependencies; `npm run login` một lần để lưu phiên mktpro vào profile Chrome riêng (`.chrome-profile`).
2. Copy `settings.example.js` → `settings.js`, khai danh sách app (`code` vd APL134, `productId` uuid trên mktpro, `defaultTier`, `countryTiers`, `versionNotes`), `spreadsheetId`, `webAppUrl` của Apps Script, <cần token tự đặt cho Apps Script Web App>, Discord webhook (tuỳ chọn).
3. Deploy `apps-script/Code.gs` thành Web App để ghi Sheet (không cần Google Cloud Console).
4. `npm run capture` → `npm run report`. Lịch tự động: `register-schedule.ps1` tạo Task Scheduler chạy `run-weekly.cmd` Chủ Nhật 15:00.

## Giới hạn / rủi ro
- Phụ thuộc API nội bộ mktpro; mktpro đổi giao diện/API là tool có thể gãy. Mỗi người chỉ thấy app mình có quyền.
- Cần máy Windows bật lúc chạy lịch.
- ⚠️ `src/config.js` có giá trị mặc định cho token Web App nằm thẳng trong code. Khi dùng phải tự đặt token riêng trong `settings.js`.

## Media
[▶ Demo chạy tool và kết quả điền vào Google Sheet (60 MB)](../../media/2026-10/2026-10-14-stum-weekly-report-demo-1.mp4)
