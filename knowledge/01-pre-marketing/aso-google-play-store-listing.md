---
title: ASO — spec và best practice store listing Google Play
type: reference
topic: 01-pre-marketing
tags: [aso, google-play, store-listing, screenshot, video]
app: general
status: verified
confidence: high
sources:
  - "Play Console Help — Add preview assets to showcase your app: https://support.google.com/googleplay/android-developer/answer/9866151 (truy cập 2026-10-14)"
  - "Play Console Help — Best practice for your store listing: https://support.google.com/googleplay/android-developer/answer/13393723 (truy cập 2026-10-14)"
  - "Play Console Help — Metadata policy: https://support.google.com/googleplay/android-developer/answer/9898842 (truy cập 2026-10-14)"
  - "Play Console Help — Custom store listings: https://support.google.com/googleplay/android-developer/answer/9867158 (truy cập 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 00-overview/roadmap.md
  - 01-pre-marketing/creative-assets-google-app-campaigns.md
  - 01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md
  - 01-pre-marketing/tra-loi-review-google-play.md
  - 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md
  - 01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md
  - 06-tools/super-legal-check-trademark-ten-app.md
  - 06-tools/aso-agent-review-listing-vitals.md
  - 06-tools/youtube-auto-uploader.md
summary: Giới hạn ký tự title/short/full description, spec icon, feature graphic, screenshot, preview video và quy tắc keyword/metadata của Google Play, kèm checklist ASO theo roadmap.
---

# ASO — store listing Google Play

## Bối cảnh

Bước 1 của [roadmap](../00-overview/roadmap.md) là ASO: video promo, screenshot, short description, keyword trong full description. Store listing quyết định **CVR từ click quảng cáo sang install**, nên làm kỹ trước khi đổ tiền UA. Trong App campaign, Google còn có thể lấy asset từ store listing để dựng quảng cáo. Mọi số dưới đây lấy từ Play Console Help, truy cập 2026-10-14.

## 1. Text

| Trường | Giới hạn | Ghi chú chính thức |
|---|---|---|
| **App name (title)** | ≤ **30 ký tự** | Không dùng chữ khuyến mãi ("Free", "No Ads"), xếp hạng ("#1", "Best"), emoji hay ký tự đặc biệt lặp lại. Không VIẾT HOA TOÀN BỘ trừ khi là tên thương hiệu. |
| **Short description** | ≤ **80 ký tự** | Đưa lợi ích lớn nhất lên đầu. Tránh "Best", "#1", "New", "Discount" và call-to-action kiểu "download now". Google nói keyword nhồi thêm *không giúp ranking*. Không lặp lại nguyên văn trong full description. |
| **Full description** | ≤ **4.000 ký tự** | Ngôn ngữ đời thường, "not a list of keywords". Nêu điểm khác biệt bằng sự thật kiểm chứng được. Lời chứng thực phải có nguồn: Google cấm testimonial ẩn danh. |

### Keyword: làm theo policy

Roadmap muốn "nhấn mạnh main keywords (chức năng app) trong full description". Làm như vậy được, miễn đúng các quy tắc chính thức:

- Viết keyword chính (chức năng cốt lõi) **tự nhiên trong câu**, nhất là ở đoạn đầu và trong các bullet tính năng.
- Policy cấm: "repetitive or unrelated keywords or references", dùng ký tự đặc biệt/all caps để thao túng ranking, và mô tả quá dài, lặp lại, format xấu.
- Không nhắc tên app/thương hiệu khác để câu traffic. Policy xếp mục này vào "unrelated references".
- Policy (kể cả ở bản dịch) áp dụng cho **mọi ngôn ngữ** của listing.
- *Kinh nghiệm ngành, chưa có xác nhận chính thức*: Google Play index title, short và full description để xếp hạng search. Google không công bố trọng số hay mật độ keyword "đúng", nên đừng tin con số mật độ % lưu truyền trên mạng.

## 2. Graphic assets

| Asset | Spec chính thức |
|---|---|
| **App icon** | PNG 32-bit (có alpha), **512 × 512 px**, tối đa **1024 KB**. Theo icon design spec của Google Play. Icon không được gây hiểu nhầm hoặc chứa text về ranking/khuyến mãi. |
| **Feature graphic** | JPEG hoặc PNG 24-bit (không alpha), **1024 × 500 px**. Tránh đặt chi tiết quan trọng ở vùng bị cắt, giữ trọng tâm ở giữa. Alt text ≤ 140 ký tự. |
| **Screenshots (phone)** | Tối thiểu 2 (tính trên các loại thiết bị) để publish, tối đa **8 mỗi loại thiết bị**. JPEG hoặc PNG 24-bit (không alpha). Cạnh từ 320 đến 3840 px, cạnh dài ≤ 2 × cạnh ngắn. |
| **Khuyến nghị cho app** | Ít nhất **4 screenshot**, độ phân giải ≥ 1080 px: dọc ≥ **1080 × 1920** (9:16) hoặc ngang ≥ **1920 × 1080** (16:9). |
| **Khuyến nghị cho game** | Ít nhất 3 screenshot ngang 1920×1080 hoặc dọc 1080×1920. |
| **Tablet / Chromebook** | Tối thiểu 4 ảnh, cạnh 1080 đến 7680 px, 16:9 hoặc 9:16. |
| **Text trên screenshot** | Tagline chiếm **≤ 20% ảnh**. Ảnh có chữ thì làm bản cho từng ngôn ngữ. |

## 3. Preview (promo) video

- Không bắt buộc với app nhưng Google "highly recommended".
- Nhập **URL YouTube** của *một* video, không dùng playlist/channel và không thêm tham số như timecode.
- Video ở chế độ **Public hoặc Unlisted** (không Private), **tắt quảng cáo** (tắt monetization; nội dung có claim bản quyền vẫn có thể bị chèn ad), không giới hạn độ tuổi, **cho phép embed**.
- Chỉ **30 giây đầu** tự phát, ở chế độ tắt tiếng. Cho thấy trải nghiệm cốt lõi trong **10 giây đầu**. Khoảng ≥ 80% video nên là trải nghiệm thật trong app.
- Quay ngang hoặc dọc đều được, nhưng video dọc không để viền đen. Nên có caption.
- Video có chữ thì làm bản theo từng ngôn ngữ.

## 4. Checklist ASO theo roadmap

- [ ] Title ≤ 30 ký tự, có keyword chức năng chính, không chữ khuyến mãi/ranking.
- [ ] Short description ≤ 80 ký tự, lợi ích chính ở đầu, không CTA, không "Best/#1/New".
- [ ] Full description ≤ 4000 ký tự: đoạn mở nêu chức năng chính, bullet tính năng chứa keyword tự nhiên, không liệt kê keyword.
- [ ] Icon 512×512 PNG 32-bit ≤ 1024 KB.
- [ ] Feature graphic 1024×500, chi tiết chính ở giữa.
- [ ] ≥ 4 screenshot 1080×1920 (dọc), text ≤ 20% ảnh, theo thứ tự các tính năng mạnh nhất.
- [ ] Preview video YouTube: unlisted/public, tắt ads, embeddable, 10 giây đầu là core experience.
- [ ] Localize text + screenshot cho các GEO chính sẽ chạy UA.
- [ ] Sau khi có traffic: dùng Store listing experiments / custom store listings của Play Console để A/B test. *Chưa tổng hợp chi tiết, cần bổ sung.*

## 5. Bổ sung (bổ sung 2026-10-14 từ AI Knownledge, chưa duyệt)

- **Metadata policy áp cho cả screenshot và ảnh quảng bá** (WebFetch 9898842, 2026-10-14): cấm ảnh/chữ thể hiện xếp hạng/thành tích ("App of the year", "Best of Play", "Popular", icon giải thưởng), giá/khuyến mãi ("10% off"), chương trình Google Play ("Editor's choice"); screenshot/video phải *"reflect your app's actual experience"*. Tool AI nội bộ hay sinh slide "social proof" vi phạm — xem mục 4 của [thiết kế screenshot store](thiet-ke-screenshot-store-quality-bar.md).
- **Ảnh iOS 1242×2688 không upload được lên Play** (tỉ lệ 2,16 > 2:1). Hai tool nội bộ mặc định xuất kích thước này — luôn xuất 1080×1920 cho Android.
- **Custom store listings**: tối đa 50 listing; target theo quốc gia, Google Ads campaign, URL, search keyword, user không hoạt động/đã gỡ (Play Console Help 9867158). Dùng để khớp screenshot với thông điệp từng ad group — xem mục 7 của [thiết kế screenshot store](thiet-ke-screenshot-store-quality-bar.md).
- Cách dựng bộ screenshot (narrative arc, quality bar) và chọn tool AI: [thiết kế screenshot store](thiet-ke-screenshot-store-quality-bar.md). Rating/review và trả lời review: [trả lời review Google Play](tra-loi-review-google-play.md). Lỗi policy listing đã gặp (Metadata, Impersonation, Misleading Claims): [lỗi policy thường gặp](policy-loi-thuong-gap-va-cach-fix.md). Check trademark tên app trước khi đặt title: [Super Legal](../06-tools/super-legal-check-trademark-ten-app.md).

## Việc tiếp theo

- Bổ sung tài liệu về Store listing experiments (custom store listings đã có tóm tắt ở mục 5).
- Ghi lại CVR store listing trước/sau mỗi lần đổi asset vào `lessons/`.
