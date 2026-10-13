---
title: Roadmap UA marketing cho app Android kiếm tiền bằng quảng cáo
type: overview
topic: 00-overview
tags: [roadmap, checklist]
app: general
status: draft
confidence: medium
sources: ["ROADMAP UA MARKETING.xlsx (thư mục cha của repo), đọc 2026-10-14"]
created: 2026-10-14
updated: 2026-10-14
summary: Lộ trình 3 giai đoạn — Pre-Marketing (ASO, creative, Firebase) → Launch campaign (tCPA First_Open → ROAS) → Đo lường & tối ưu (Ads, AdMob, Firebase).
---

# Roadmap UA marketing

Nguồn: file `ROADMAP UA MARKETING.xlsx` do user lập. Mỗi mục trỏ tới tài liệu chi tiết; web hiển thị trang này như checklist.

## 1. Pre-Marketing

- [ ] ASO
  - [ ] Video App Promotion
  - [ ] Screenshot design
  - [ ] Short description hấp dẫn
  - [ ] Nhấn mạnh main keywords (chức năng app) trong full description
- [ ] Creative Ads
  - [ ] Keywords/text chạy ads: research 15 keywords + description cho từng từ
  - [ ] Hình ảnh: 5 vuông 1200×1200, 5 ngang 1200×628, 5 dọc 1200×1500
  - [ ] Video: 5 vuông 1080×1080, 5 ngang 1920×1080, 5 dọc 1080×1920
- [ ] Firebase
  - [ ] Tích hợp Firebase SDK
  - [ ] Liên kết Firebase project với Google Ads
  - [ ] Liên kết Firebase project với AdMob
  - [ ] Import sự kiện `first_open` từ Firebase vào Google Ads

## 2. Launching Ads Campaign (App Promotion)

- [ ] Launch campaign tăng lượt cài (tCPA) tối ưu sự kiện `first_open`
- [ ] Sau ~3 ngày: tạo/import sự kiện `ad_impression` trên Google Ads
- [ ] Launch campaign ROAS (global)
- [ ] Tạo thêm ad group cho campaign ROAS

## 3. Đo lường, tối ưu và thay đổi

Mốc theo dõi campaign ROAS: **7 ngày · 1 tháng · 4 tháng · 6 tháng**.

- [ ] Google Ads: CPI, CR (conversion rate), Cost, ROAS
- [ ] AdMob: request/impression, eCPM, match rate, theo ad unit, top quốc gia
- [ ] Firebase: retention, `first_open`, `app_remove`, nguồn traffic, crash/bug
