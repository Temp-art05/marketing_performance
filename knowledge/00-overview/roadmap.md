---
title: Roadmap UA marketing cho app Android kiếm tiền bằng quảng cáo
type: overview
topic: 00-overview
tags: [roadmap, checklist]
app: general
status: verified
confidence: medium
sources:
  - ROADMAP UA MARKETING.xlsx (thư mục cha của repo), đọc 2026-10-14
  - "Khoá UA Marketing Mobile App 2026 (Quocmedia, Quốc Anh), bài 1.1, 1.2 và 4.1 — video ~11–12/2024, transcribe 2026-10-15"
  - "Khoá UA Marketing Mobile App 2026 (Quocmedia, Quốc Anh), bài 4.10 — transcribe 2026-10-15"
created: 2026-10-14
updated: 2026-10-15
related:
  - 06-tools/tong-quan-cong-cu-ai-marketing.md
  - 00-overview/khoa-hoc-quocmedia-ua-marketing-2026.md
  - playbooks/launch-google-app-campaign-tcpa-den-roas.md
  - 01-pre-marketing/research-doi-thu-va-keyword-cho-app.md
  - playbooks/lap-ke-hoach-marketing-app-game.md
summary: Lộ trình 3 giai đoạn — Pre-Marketing (ASO, creative, Firebase) → Launch campaign (tCPA First_Open → ROAS) → Đo lường & tối ưu (Ads, AdMob, Firebase).
---

# Roadmap UA marketing

Nguồn: file `ROADMAP UA MARKETING.xlsx` do user lập. Mỗi mục trỏ tới tài liệu chi tiết; web hiển thị trang này như checklist.

> Nguồn gốc (bổ sung 2026-10-15 từ khoá Quocmedia): checklist này trùng gần nguyên văn với sheet "ROADMAP UA MARKETING" và file "Checklist Pre-Marketing UA Mobile App" của khoá **UA Marketing Mobile App 2026** (Quocmedia, giảng viên Quốc Anh, bài 1.2 và 4.1) — xem [tổng quan khoá học](khoa-hoc-quocmedia-ua-marketing-2026.md). Chỗ khoá học khác Google Help (thời điểm chuyển tROAS, target ROAS) được ghi ở [playbook launch](../playbooks/launch-google-app-campaign-tcpa-den-roas.md).

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

## Chi tiết thêm từ khoá Quocmedia (bổ sung 2026-10-15 từ khoá Quocmedia)

Khoá học (bài 1.1, 1.2, 4.1) giải thích thêm từng giai đoạn; phần nào là ý giảng viên, chưa kiểm chứng, đánh 🧪.

- **3 trụ UA** của khoá: ASO, quảng cáo trả phí, social media (tăng nhận diện). Roadmap này tập trung vào 2 trụ đầu; social xem [đánh giá social organic](../05-optimization/danh-gia-hieu-qua-social-organic.md).
- **Pre-Marketing — ASO**, checklist bài 4.1 chi tiết hơn sheet:
  - 1 video App Promotion **16:9 HD, 10–25 giây**.
  - **1–3 screenshot ngang 16:9 + 5–6 screenshot dọc 9:16**.
  - Nhấn keyword/tính năng chính trong full description bằng thẻ `<b>…</b>`; cuối full description có **liên hệ / FAQ** để tạo niềm tin. Spec và giới hạn chính thức: [ASO Google Play](../01-pre-marketing/aso-google-play-store-listing.md).
- **Pre-Marketing — research**: trước khi làm creative, khoá cài thử app, liệt kê chức năng → persona → gom keyword theo từng chức năng bằng Keyword Planner (thành "15 keyword + description"), và spy đối thủ qua Transparency Center / Meta Ads Library / TikTok Top Ads: [research đối thủ và keyword](../01-pre-marketing/research-doi-thu-va-keyword-cho-app.md).
- **Firebase**: giảng viên nhấn mạnh không có Firebase thì chạy ads như "mò kim đáy bể" — là điều kiện bắt buộc, không phải tuỳ chọn.
- **Launching**: campaign CPI (`first_open`) chỉ để **test performance**, 🧪 chạy **2–3 ngày, tối đa ~300 download**, budget ≤ ₫200k/ngày; sau đó import `ad_impression` (event chỉ xuất hiện khi đã có user xem ad); chỉ chuyển sang ROAS khi đã có đủ creative cho **3 ad group**. ⚠️ Mốc "2–3 ngày / vài trăm install" **mâu thuẫn** với Google (30+ conversion/30 ngày, 3–4 tuần dữ liệu value) — bảng so sánh và gợi ý dung hoà: [playbook bước 3](../playbooks/launch-google-app-campaign-tcpa-den-roas.md). "Global" của khoá là All countries and territories + English: [GEO](../02-ua-channels/google-ads/geo-va-ngon-ngu-targeting.md).
- **Thêm ad group** cho campaign ROAS là để test nhóm nào có chỉ số tốt rồi phát triển nhóm đó; mỗi ad group content/ảnh/video khác nhau.
- **Đo lường**: nhịp đọc chỉ số và thay đổi **hằng ngày hoặc hằng tuần**; lời giảng có lúc nói mốc "3 tháng" nhưng sheet ghi 4 tháng — giữ theo sheet. Khung đọc: [đọc chỉ số theo mốc](../05-optimization/doc-chi-so-theo-moc-thoi-gian.md).

### 5 yếu tố thành công UA theo khoá (bài 4.10) — bổ sung 2026-10-15 từ khoá Quocmedia

Giảng viên tóm 5 yếu tố. Không có số liệu đi kèm. Các yếu tố khớp với 3 giai đoạn ở trên, riêng yếu tố 5 nằm ngoài roadmap.

1. **Target chuẩn**: research kỹ khách hàng tiềm năng, rồi ra keyword và creative từ đó (mục 1).
2. **Creative chất lượng và nhiều**: đủ nhiều để A/B thường xuyên và loại content kém (mục 1–2).
3. **Tracking chính xác, tối ưu theo ngày/tuần** (mục 3).
4. **Scale ROAS từ từ**: không tăng budget gấp 2–4 lần. Khớp Google: tránh đổi budget/bid > 20% một lần (9176652). Quy tắc chi tiết ở [App campaigns](../02-ua-channels/google-ads/app-campaigns-tong-quan.md) mục 4.
5. **Liên tục cập nhật app** để tăng trải nghiệm và retention. Roadmap hiện chỉ có việc *đo* retention/crash ở mục 3, chưa có bước "đưa kết quả đo về team product".
   - [ ] Gợi ý thêm vào checklist mục 3: sau mỗi mốc đọc chỉ số (7 ngày, 1 tháng…), chuyển vấn đề retention/crash/ad placement cho product.
   - [ ] Trước khi tăng rollout version mới, so version cũ và mới theo [hậu kiểm version](../05-optimization/hau-kiem-version-app-nguong-verdict.md).

Khung plan đầy đủ theo giai đoạn của khoá (thời gian, ngân sách, chiến lược, mục tiêu, tình huống), có phân biệt app và game: [lập kế hoạch marketing app/game](../playbooks/lap-ke-hoach-marketing-app-game.md).

## Công cụ hỗ trợ từng bước (bổ sung 2026-10-14 từ AI Knownledge)

Bản đồ ~40 tool AI nội bộ Apero xếp theo đúng 3 giai đoạn trên (ASO, creative, launch, đo lường, monetization, policy): [tổng quan công cụ AI marketing](../06-tools/tong-quan-cong-cu-ai-marketing.md). Quy trình ghép tool cho creative: [sản xuất creative hàng loạt](../playbooks/san-xuat-creative-hang-loat-bang-ai.md).
