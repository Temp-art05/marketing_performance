---
title: Thiết kế screenshot store — narrative arc, quality bar, làm bằng AI và checklist policy trước khi upload Google Play
type: playbook
topic: 01-pre-marketing
tags: [aso, screenshot, store-listing, creative, ai-image, custom-store-listing, localization, policy, cvr]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-065 - CPP generator - Screenshot tool/Screenshot Tool byngoclm.zip → PRD.md, app-store-screenshots-main/skills/app-store-screenshots/style-prompts/_QUALITY_BAR.md (đọc 2026-10-14)
  - AI Knownledge/APR-052 - App Store Screenshot Studio/screenshot-studio.zip → app/lib/screenshotSkill.js (đọc 2026-10-14)
  - AI Knownledge/APR-225 - Tool Web tạo bộ ảnh Screenshot…/PRD.md (đọc 2026-10-14)
  - AI Knownledge/APR-257 - AI Tool  ASO Phone Screenshots/Tamvm-ASO-Phone-Screenshots-Tool.md (đọc 2026-10-14)
  - https://github.com/ParthJadhav/app-store-screenshots (skill mã nguồn mở được đóng gói trong APR-065)
  - "Play Console Help — Metadata policy: https://support.google.com/googleplay/android-developer/answer/9898842 (WebFetch 2026-10-14)"
  - "Play Console Help — Custom store listings: https://support.google.com/googleplay/android-developer/answer/9867158 (truy cập 2026-10-14)"
  - "Apple — Screenshot specifications: https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/ (truy cập 2026-10-14)"
  - "Khoá UA Marketing Mobile App 2026 (Quocmedia, Quốc Anh), bài 2.2 và 2.4 — video ~11–12/2024 theo ghi chú khoá, transcribe 2026-10-15"
created: 2026-10-14
updated: 2026-10-15
images: [assets/screenshots/2026-10/2026-10-14-screenshot-studio-demo-slide1-1.png]
related:
  - 00-overview/khoa-hoc-quocmedia-ua-marketing-2026.md
  - 01-pre-marketing/aso-google-play-store-listing.md
  - 01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md
  - 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md
  - 06-tools/app-store-screenshot-studio.md
  - 06-tools/cpp-generator-screenshot-tool.md
  - 06-tools/terasofts-graphic-pro-tao-screenshot-store.md
  - 06-tools/aso-screenshot-google-flow.md
  - 06-tools/tong-quan-cong-cu-ai-marketing.md
summary: Dựng bộ 4–8 screenshot bán hàng (hook → khác biệt → tính năng → chốt), quality bar, chọn tool AI nội bộ, checklist Play (2:1, text ≤20%, cấm
---

# Thiết kế screenshot store

> Spec chính thức của Google Play (số lượng, kích thước, text ≤ 20%) nằm ở [ASO — store listing Google Play](aso-google-play-store-listing.md). Bài này bổ sung **cách thiết kế** để screenshot bán được hàng và **quy trình làm bằng 4 tool AI nội bộ** (07/2026). Quy tắc thiết kế là kinh nghiệm/heuristic; quy tắc policy là chính thức.
>
> Gộp 2026-10-14 từ 2 tài liệu ứng viên: "quality bar" (APR-052/065) và "screenshot làm bằng AI" (APR-225/257).

## 1. Narrative arc của bộ screenshot

Screenshot đầu tiên quyết định phần lớn CVR vì người dùng thường chỉ thấy 2–3 ảnh đầu. Hai tool nội bộ đề xuất mạch gần giống nhau:

| Slide | APR-065 (CPP generator) | APR-225 (Terasofts) |
|---|---|---|
| 1 | **Hero / hook**: lợi ích lớn nhất | **Hook** |
| 2 | **Differentiator** | **Solution** |
| 3–4 | **Core feature** → feature tiếp theo | **Feature 1–3** |
| 5 | **Closer / feature wall**: 4–5 tính năng dạng chip | (Social Proof) → **CTA** |

Cả hai đều chèn "proof/social proof" (rating, số user, giải thưởng). Xem mục 4 — phần này phải soát theo policy Google Play.

## 2. Quy tắc headline

- **Mỗi slide một ý**, 3–6 từ (Terasofts: headline ≤ 6 từ, subtext ≤ 12 từ), tối đa 2 dòng ngắn. Bán **cảm giác/kết quả/nỗi đau được giải**, không liệt kê tính năng.
- Headline **không trùng nhau** giữa các slide và khớp màn hình trong slide.
- Đúng **1 từ nhấn** (màu accent/gạch chân), màu nhấn cũng phải đạt contrast 4.5:1 — lỗi hay gặp nhất là pastel trên nền pastel.
- Không dùng "?" trong headline marketing, không nhiều dấu "!".
- 1 palette màu cho cả bộ.

## 3. Quality bar (tự kiểm trước khi xuất)

- Điện thoại chiếm **68–82% chiều cao canvas** (dưới 65% thì trông trống). Neo vào một mép, không treo lơ lửng.
- Không có dải trống > **22%** chiều cao canvas. Tối đa **3 lớp**: nền → điện thoại/minh hoạ → headline + 1 accent.
- Chữ đạt **WCAG AA 4.5:1** ở điểm *tệ nhất* dưới chữ; trên ảnh/gradient thì thêm scrim/shadow.
- **Thumbnail test**: thu nhỏ còn ~220 px ngang vẫn đọc được headline.
- Bóng điện thoại pha màu theo nền; UI lấp đầy màn hình, không viền trắng, không lặp status bar. Mascot chính ≥ 13% chiều cao canvas, có chiều sâu.
- **Giới hạn chính thức thắng heuristic**: với listing Google Play, phần **chữ ≤ 20% ảnh** (khuyến nghị của Google). "Phone + headline ≥ 80% canvas" của quality bar không loại trừ quy tắc này, nhưng template headline cực lớn (vd "Bold Text") dễ vượt 20% chữ.

## 4. Đối chiếu đã xử lý (theo Google): slide "proof / social proof" vs Metadata policy

- **Phía tool nội bộ**: APR-065 cho slide hero chứa "rating, số user, giải thưởng"; APR-225 có hẳn slide "Social Proof" do Gemini viết — dễ sinh "#1", "Best app", "Editor's choice", "1M+ users".
- **Phía Google (chính thức)**: Metadata policy 9898842 (WebFetch 2026-10-14) áp cho cả screenshot và ảnh quảng bá, cấm *"Images or text that indicate store performance or ranking, such as 'App of the year', 'Best of Play 20XX', 'Popular', award icons"*, *"price and promotional information, such as '10% off'"*, và *"Google Play programs, such as 'Editor's choice'"*; đồng thời yêu cầu *"Provide screenshots and videos that reflect your app's actual experience"*.
- **Kết luận**: nguồn chính thức thắng. Trên Google Play **bỏ** slide social proof dạng xếp hạng/giải thưởng/giá; thay bằng mô tả lợi ích hoặc tính năng. Claim kiểu "1M+ users" không nằm nguyên văn trong danh sách cấm nhưng gần nhóm "store performance" — coi là rủi ro, không dùng nếu không chắc.

## 5. ⚠️ Bẫy kích thước: iOS ≠ Google Play

- APR-052 và APR-065 mặc định xuất **1242 × 2688** — đây là iPhone **6.5"** (PRD APR-065 ghi nhầm 6.9"; theo Apple, 6.9" là 1260×2736 / 1290×2796 / 1320×2868).
- Google Play yêu cầu **cạnh dài ≤ 2 × cạnh ngắn**. 2688/1242 ≈ 2,16 và 2868/1320 ≈ 2,17 đều **vượt 2:1 → không upload được** lên Play.
- App Android: xuất **1080 × 1920 (9:16)**. APR-052 cho nhập px tuỳ chỉnh (1080×1920 hợp lệ); Terasofts (APR-225) xuất sẵn 1080×1920; ASO_Screenshot (APR-257) có preset Android. Tool không có preset thì resize/pad trước khi upload.
- Ảnh "stretch to exact size" (APR-065 dùng `sharp` fit: fill) có thể làm méo UI — kiểm tra bằng mắt.

## 6. Làm bằng tool AI nội bộ

| Tình huống | Tool |
|---|---|
| App mới, cần bộ đơn giản trong vài phút, có file mô tả app; xuất sẵn 1080×1920 | [Terasofts Graphic Pro](../06-tools/terasofts-graphic-pro-tao-screenshot-store.md) (Gemini + Flux, local, cần Gemini key) |
| Nhiều kích thước iOS/Android, localize nhiều ngôn ngữ, chỉnh bằng lời | [ASO_Screenshot trên Google Flow](../06-tools/aso-screenshot-google-flow.md) (tốn credit Flow) |
| Nhiều biến thể nhanh từ ảnh màn hình, sửa từng slide bằng chat, kích thước tuỳ chỉnh | [App Store Screenshot Studio](../06-tools/app-store-screenshot-studio.md) (fal.ai) |
| Bộ theo use case/TA có quality bar chặt, template đẹp — **chỉ iOS** hiện tại | [CPP generator](../06-tools/cpp-generator-screenshot-tool.md) |

Quy trình:
1. Chụp **UI thật** (dọc), chọn 5–8 màn tính năng mạnh nhất.
2. Viết file mô tả: tên app, đối tượng, USP, 3–5 tính năng chính bằng ngôn ngữ GEO đích.
3. Sinh theo mạch ở mục 1, chỉnh copy **trước** khi gen ảnh (rẻ hơn gen lại).
4. Soát theo checklist mục 8. Mỗi GEO chính 1 bộ ngôn ngữ riêng.
5. Upload làm **Store listing experiment** so với bộ hiện tại khi đủ traffic, thay vì thay thẳng. Bộ AI "đẹp" chưa chắc tăng CVR.

Ví dụ output của Screenshot Studio (slide hook 1 điện thoại, headline 4 từ, chip tính năng nổi):

![Slide hook do App Store Screenshot Studio tạo cho một app học ngôn ngữ, headline "Learn Anytime, On The Go"](../../assets/screenshots/2026-10/2026-10-14-screenshot-studio-demo-slide1-1.png)

Ảnh cho thấy bố cục 1 điện thoại + 1 headline mà các tool nội bộ dùng; lưu ý ảnh ở kích thước iOS 1242×2688 nên không upload được lên Play nếu không resize.

## 7. Nhiều use case → nhiều bộ screenshot (CPP / custom store listing)

- iOS: **Custom Product Pages (CPP)** — ý tưởng gốc của tool APR-065.
- Google Play: **Custom store listings**, tối đa **50** listing; target theo quốc gia, theo **Google Ads campaign** (listing được duyệt và chọn làm landing page trong Google Ads), URL riêng, **search keyword**, user không hoạt động/đã gỡ… (Play Console Help, 2026-10-14).
- Gợi ý cho App campaign: mỗi ad group theo một use case trỏ tới custom store listing có slide 1 trùng thông điệp ad. *Chưa kiểm chứng bằng data nội bộ* — test và ghi CVR vào `lessons/`.

## 8. Checklist trước khi upload (Google Play)

- [ ] Dọc 1080×1920 (9:16); cạnh 320–3840 px; cạnh dài ≤ 2× cạnh ngắn; PNG/JPEG 24-bit không alpha; ≤ 8 ảnh mỗi loại thiết bị.
- [ ] Chữ ≤ 20% ảnh.
- [ ] **Không** "#1", "App of the year", "Best of Play", "Popular", icon giải thưởng, "Editor's choice", giá/khuyến mãi ("10% off", "Free trial 50% off").
- [ ] Không claim lừa dối ("best app ever") và không nhắc tên app/thương hiệu khác.
- [ ] Screenshot **phản ánh trải nghiệm thật** — AI không được vẽ thêm UI/tính năng không có (rủi ro Deceptive Behavior / Misleading Claims, xem [lỗi policy thường gặp](policy-loi-thuong-gap-va-cach-fix.md)).
- [ ] Chữ không-Latin (Arabic RTL, Devanagari, Thai…) được người đọc được duyệt.
- [ ] Mockup thiết bị không gây hiểu nhầm (nhận định: listing Android nên dùng khung Android hoặc không khung; Terasofts dùng Samsung S25 Ultra).

## 9. Làm thủ công nhanh bằng Canva (bổ sung 2026-10-15 từ khoá Quocmedia, chưa duyệt)

Khi chưa có tool nội bộ hoặc cần phác thảo để truyền ý cho designer (khoá nhấn mạnh người làm UA nên tự sketch được, đỡ phụ thuộc designer). Theo bài 2.4 của khoá:

- **Dọc 1080×1920**: Canva → Cỡ tuỳ chỉnh → ghép 3 lớp: nền ảnh theo keyword tính năng (lọc ảnh dọc) → element "phone frame" → **UI thật** của app. Tiêu đề = tên tính năng, chữ trắng. Nhân bản trang để giữ vị trí thống nhất; **mỗi ảnh 1 tính năng**.
- **Ngang 1920×1080** (banner): template "Mobile App", tên app ở trên, 3 mockup điện thoại chứa UI thật, nền minh hoạ tính năng.
- Xuất JPG chất lượng 100 (JPG không alpha — khớp yêu cầu 24-bit của Play).
- Khung máy: demo dùng khung giống iPhone — listing Android nên chọn khung Android hoặc không khung (mục 8).

Đánh giá so với bài này: khoá chỉ đặt tiêu đề 1–2 từ (tên tính năng), không có slide hook/lợi ích → coi là **mức tối thiểu cho app tiện ích**; narrative arc ở mục 1–2 chặt hơn. 4 quy tắc screenshot của khoá (điểm nhấn ở giữa, tagline ≤ 20%, không "best/Top/#1") khớp mục 3–4 và 8.

**Giả thuyết chưa có nguồn**: khoá khuyên đặt **1–3 screenshot ngang 16:9 ở đầu** rồi 4–6 ảnh dọc ("Google khuyến dùng gần đây" — không đưa nguồn). Spec Play cho phép cả hai hướng ([ASO](aso-google-play-store-listing.md) mục 2), tổng ≤ 8 ảnh vẫn hợp lệ. Không đổi checklist mặc định (dọc) cho tới khi có nguồn chính thức hoặc kết quả **Store listing experiment** — chạy thì ghi vào `lessons/`.

**⚠️ Mâu thuẫn**: khoá dùng chung ảnh ngang 1920×1080 làm feature graphic ("Feature graphic = screenshot = thumbnail"); spec feature graphic là **1024×500** — xem bảng mâu thuẫn ở [ASO](aso-google-play-store-listing.md) mục 7.

