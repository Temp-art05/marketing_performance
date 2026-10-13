---
title: Creative assets cho Google App campaigns — spec và số lượng
type: reference
topic: 01-pre-marketing
tags: [google-ads, app-campaigns, creative, asset, video, html5]
app: general
status: verified
confidence: high
sources:
  - "Google Ads Help — Asset types for App campaigns: https://support.google.com/google-ads/answer/9948381 (truy cập 2026-10-14)"
  - "Google Ads Help — Best practices guide: Setting up your App campaigns: https://support.google.com/google-ads/answer/6167162 (truy cập 2026-10-14)"
  - "Google Ads Help — Tips for maximizing your App campaign: https://support.google.com/google-ads/answer/9176652 (truy cập 2026-10-14)"
  - "Google Ads Help — Best practices for App campaigns: https://support.google.com/google-ads/answer/14104492 (truy cập 2026-10-14)"
  - "Google Ads Help — Set up an App campaign for installs: https://support.google.com/google-ads/answer/12575501 (truy cập 2026-10-14)"
  - "Google Ads Help — Asset requirements for App campaigns for engagement: https://support.google.com/google-ads/answer/9234183 (truy cập 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 00-overview/roadmap.md
  - 01-pre-marketing/aso-google-play-store-listing.md
  - 02-ua-channels/google-ads/app-campaigns-tong-quan.md
  - playbooks/launch-google-app-campaign-tcpa-den-roas.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
  - 01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md
  - 06-tools/youtube-auto-uploader.md
  - 06-tools/omni-resize-anh-video-da-kenh.md
  - 06-tools/cat-outro-watermark-video-hang-loat.md
  - 01-pre-marketing/nghien-cuu-trend-cho-creative.md
  - 06-tools/genius-easy-creative.md
  - 06-tools/visual-prompting-skill-anh-video.md
summary: Spec asset cho Google App campaigns (headline 30/description 90 ký tự, ảnh 1:1·1.91:1·4:5, video YouTube 3 hướng, HTML5 zip ≤5MB), số lượng tối đa mỗi ad group và đối chiếu với yêu cầu creative trong roadmap.
---

# Creative assets cho Google App campaigns

## Bối cảnh

App campaigns không cho dựng từng quảng cáo. Ta nạp **asset** (text, ảnh, video, HTML5) vào từng ad group, Google tự ghép và phân phối trên Search, Google Play, YouTube, Discover và Display network. Chất lượng và **độ đa dạng** của asset là đòn bẩy lớn nhất mà người chạy còn kiểm soát được. Spec dưới đây lấy từ Google Ads Help, truy cập 2026-10-14.

## 1. Spec chính thức

### Text
- **Headlines**: tối đa **5**, mỗi cái ≤ **30 ký tự**.
- **Descriptions**: tối đa **5**, mỗi cái ≤ **90 ký tự**.
- Mỗi dòng text phải **đứng được một mình**, vì Google ghép ngẫu nhiên. Nên có độ dài khác nhau. Mỗi text asset dùng tối đa 1 dấu "!".
- Lưu ý: trang best-practice (6167162) nói chung "up to 10 text assets per ad group", còn trang asset types (9948381) tách thành 5 headline + 5 description. Hai trang khớp nhau (5 + 5 = 10).

### Image
| Tỉ lệ | Tối thiểu | Khuyến nghị |
|---|---|---|
| 1:1 (vuông) | 200 × 200 | **1200 × 1200** |
| 1.91:1 (ngang) | 600 × 314 | **1200 × 628** |
| 4:5 (dọc) | 320 × 400 | **1200 × 1500** |

- Định dạng .jpg/.png, ≤ **5 MB**. Tối đa **20 ảnh mỗi ad group**.
- Ảnh nên lấp kín khung, ít khoảng trống, độ nét cao, **ít text đè**. Không tự chèn logo hay nút CTA lên ảnh vì Google tự thêm.
- Trang engagement (9234183) ghi thêm: tỉ lệ không được lệch quá 1%. Cắt đúng pixel.

### Video
- Phải **host trên YouTube** (upload lên kênh, để unlisted được).
- Hướng: **ngang, dọc, vuông**. Google khuyên có đủ cả 3. Trang 9176652 nêu các tỉ lệ lý tưởng 16:9, 1:1, 2:3 và nói video dọc có CVR cao hơn ngang 60% (số do Google công bố, không rõ năm/bối cảnh đo).
- Độ dài khuyến nghị **10 đến 30 giây** (6167162). Dùng nhiều độ dài khác nhau.
- Tối đa **20 video mỗi ad group**. Không có video thì Google có thể tự tạo từ asset + store listing (chất lượng thường kém, nên tự làm).

### HTML5 (playable)
- File **.zip ≤ 5 MB**, ≤ **512 file** trong zip. Tối đa **20 zip mỗi ad group**.
- Khai báo hướng bằng meta `ad.orientation` (portrait / landscape / portrait,landscape) hoặc `ad.size` (320×480 dọc, 480×320 ngang). Dùng UTF-8.
- Trang 6167162 nói HTML5/playable dành cho **mobile game marketers**. Kiểm tra bằng Google Ads HTML5 Validator trước khi upload. App utility thường bỏ qua loại này.

## 2. Đối chiếu yêu cầu trong roadmap

| Roadmap yêu cầu | Spec Google | Đánh giá |
|---|---|---|
| 15 keywords + description cho từng từ | 5 headline (≤30) + 5 description (≤90) **mỗi ad group** | App campaigns **không có keyword targeting**. "15 keywords" nên hiểu là 15 *chủ đề/thông điệp*, chuyển thành headline ≤30 và description ≤90, rồi chia cho các ad group (mỗi ad group 5+5). Có thể dùng lại khi khai audience signal (tuỳ chọn khi tạo ad group, xem answer/12575501). |
| 5 ảnh vuông 1200×1200 | 1:1, khuyến nghị 1200×1200 | Khớp. |
| 5 ảnh ngang 1200×628 | 1.91:1, khuyến nghị 1200×628 | Khớp. |
| 5 ảnh dọc 1200×1500 | 4:5, khuyến nghị 1200×1500 | Khớp. |
| 15 ảnh tổng | tối đa 20 | Còn trống 5 slot. Google "recommended to use all the asset slots". |
| 5 video vuông 1080×1080 | 1:1 | Khớp. Upload YouTube. |
| 5 video ngang 1920×1080 | 16:9 | Khớp. |
| 5 video dọc 1080×1920 | 9:16 (Google cũng liệt kê 2:3) | Khớp. Video dọc là ưu tiên theo dữ liệu Google công bố. |
| 15 video tổng | tối đa 20 | Còn 5 slot. Nên thêm biến thể độ dài (vd bản 15s và 30s). |

Kết luận: bộ creative trong roadmap **đủ để đạt mức đa dạng Google yêu cầu** cho 1 ad group. Khi tạo thêm ad group cho campaign ROAS (bước 2 của roadmap), mỗi ad group nên có **bộ asset theo một chủ đề/thông điệp riêng**, không copy y nguyên.

## 3. Quy tắc vận hành asset (chính thức)

- Mỗi ad group cần ít nhất 1 text, 1 ảnh, 1 video được duyệt. Giữ **Ad Strength ≥ "Good"** (14104492).
- Asset được xếp hạng *Waiting / Learning / Low / Good / Best* **so với các asset khác trong cùng campaign**. Google khuyên **thêm asset mới thay vì xoá** asset Good/Low, và **không đổi asset đang hiệu quả** trong giai đoạn học (100 conversion đầu).
- Thay asset kém theo asset report, định kỳ.

## 4. Gợi ý sản xuất (kinh nghiệm, chưa kiểm chứng)

- *Chưa kiểm chứng*: 3 giây đầu video nên là hook (kết quả hoặc vấn đề), sau đó demo tính năng. Text trên video đặt trong vùng an toàn vì UI YouTube/Play che mép.
- *Chưa kiểm chứng*: mỗi đợt làm creative nên giữ 1 biến, ví dụ cùng hook khác nhạc, để đọc được asset report.
- Đặt tên file/asset có quy ước (ngày_chủ-đề_tỉ-lệ_độ-dài) để sau tra lại được trong asset report.

## 5. Công cụ nội bộ để làm đủ bộ asset (bổ sung 2026-10-14 từ AI Knownledge, chưa duyệt)

- Dây chuyền tool AI nội bộ (trend → ảnh/video nguồn → render hàng loạt → outro → localize → resize → upload): [sản xuất creative hàng loạt](../playbooks/san-xuat-creative-hang-loat-bang-ai.md). Kỹ thuật viết prompt ảnh/video: [viết prompt AI](prompt-ai-tao-anh-video-quang-cao.md).
- **Lỗ hổng tỉ lệ**: [OmniResize](../06-tools/omni-resize-anh-video-da-kenh.md) chỉ xuất 1:1 / 9:16 / 16:9 — **thiếu 1.91:1 (1200×628) và 4:5 (1200×1500)** mà App campaigns cần cho ảnh; 16:9 không thay được 1.91:1. Ảnh 2 tỉ lệ này phải crop/dựng riêng. [Outro Tool](../06-tools/cat-outro-watermark-video-hang-loat.md) có 4:5 cho video (pad viền đen).
- Video phải lên YouTube: [YouTube Auto Uploader](../06-tools/youtube-auto-uploader.md) upload hàng loạt; kiểm video không ở chế độ Private.

## Việc tiếp theo

- Khi có asset report thật: ghi asset nào lên Best/Low vào `lessons/`.
