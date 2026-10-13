---
title: Meta Ads Dashboard (Meta Sub Dashboard) — xem nhiều ad account, ROAS×0.7 T-1..T-3 và auto rules
type: reference
topic: 06-tools
tags: [tool, meta-ads, facebook-ads, roas, auto-rules, budget, marketing-api, subscription]
app: general
status: draft
confidence: medium
sources:
  - "AI Knownledge/APR-138 - Meta Sub Dashboard/PRD.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-138 - Meta Sub Dashboard/meta-ads-dashboard-main.zip → README.md, src/lib/meta-api.ts, src/lib/rules-engine.ts (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 00-overview/glossary-chi-so.md
  - 03-monetization/paywall-subscription-checklist-policy.md
  - 06-tools/apero-data-intraday-mcp-auto-action.md
  - 06-tools/apero-comment-tool-facebook.md
summary: "Web app Next.js của UA Apero (Giang Nguyễn) gọi Meta Marketing API v21 — cây Product→Channel→Campaign→Country, cột ROAS×0.7 hôm nay và T-1/T-2/T-3, sửa budget/pause tại bảng, auto rules chạy mỗi 30 phút."
---

# Meta Ads Dashboard

## Làm gì
Thay việc mở Meta Ads Manager nhiều lần mỗi ngày:
- Xem **nhiều ad account** trên 1 màn, dạng cây **Product ID → Channel → Campaign → Country**.
- Metric: Spend, Impressions, Clicks, CTR, CPC, CPM, Installs, CPI, Purchases, Purchase Value, ROAS, CVR, Pay Rate. Thêm cột **ROAS×0.7** hôm nay và **T-1/T-2/T-3** để so với 3 ngày trước.
- Sửa daily/lifetime budget, Pause/Resume ngay trên bảng. Mọi thao tác được ghi vào Action Logs.
- **Auto Rules** mỗi 30 phút: điều kiện metric + toán tử + ngưỡng (vd `ROAS T-1 < 1.5`) → Pause / Resume / tăng / giảm / set budget, có `budget_cap`/`budget_floor`.
- Lọc tên campaign (contains / does not contain / exact), lưu preset cột, export CSV, dùng được trên điện thoại.

- **Dùng ở bước:** Launch campaign và tối ưu hằng ngày trên kênh Meta. Tên "Sub" và cột Purchase/Pay Rate cho thấy tool được làm cho **app subscription/IAP**. App ads-only tối ưu theo ad revenue sẽ cần thêm nguồn doanh thu khác (MMP/ILRD), vì Meta purchase value không chứa ad revenue.
- **Owner:** Giang Nguyễn Thị (UA Marketer). v1.0, 04/07/2026. Bản live nội bộ trên Railway (URL trong PRD).
- **Vị trí:** `AI Knownledge/APR-138 - Meta Sub Dashboard` (`meta-ads-dashboard-main.zip`, video `Result.mp4` ~12MB).

[▶ Video kết quả: cây Product → Channel → Campaign → Country, cột ROAS×0.7 và T-1..T-3 (12 MB)](../../media/2026-10/2026-10-14-meta-ads-dashboard-ket-qua-1.mp4)

## Định nghĩa metric trong tool
ROAS = Purchase Value ÷ Spend (purchase lấy action `purchase`, nếu không có thì `omni_purchase`) · CPI = Spend ÷ Installs · CVR = Registrations ÷ Clicks · Pay Rate = Purchases ÷ Registrations · CPM = Spend ÷ Impressions × 1000.

⚠️ PRD và README **không giải thích hệ số 0.7**. Giả thuyết: quy về doanh thu net sau phí store 30% của Google/Apple (khớp với app subscription). Chưa xác nhận, hỏi owner trước khi dùng làm chuẩn.

## Cách chạy
```bash
npm install
cp .env.local.example .env.local   # điền biến môi trường
npm run dev                         # http://localhost:3000
```
Deploy: push GitHub → Railway auto-deploy, khai env trong Railway → Variables.

Biến môi trường (chỉ tên, không ghi giá trị):
- `META_ACCESS_TOKEN`: <cần Meta long-lived access token>
- `META_AD_ACCOUNTS`: danh sách `act_id:Tên`, `META_AD_ACCOUNT_ID`
- `META_APP_ID` / `META_APP_SECRET`: tuỳ chọn, để gia hạn token
- `CRON_SECRET`: bảo vệ endpoint `/api/cron/rules`
- Source có module Keycloak SSO (`libs/keycloak-sso`) cho đăng nhập nội bộ.

## Giới hạn / rủi ro
- Auto rule dựa trên ROAS của **1 ngày** (T-1) với app sub thì nhiễu cao, vì purchase về trễ và trial chưa convert. Nên đặt ngưỡng spend tối thiểu và dùng nhiều ngày trước khi pause/scale. Đây là nhận định của người viết, chưa có số thật.
- Rules và logs lưu trong file JSON trên server. Redeploy có thể mất dữ liệu nếu không có volume (cần kiểm tra).
- Token có quyền sửa budget nên lộ token là rủi ro lớn. Chỉ lưu trong env.
