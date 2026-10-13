---
title: AdMob cơ bản — ad formats, chỉ số report, policy dễ dính
type: reference
topic: 03-monetization
tags: [admob, ad-format, ecpm, match-rate, show-rate, policy]
app: general
status: verified
confidence: high
sources:
  - "AdMob Help — Ad units, ad formats, and ad types: https://support.google.com/admob/answer/6128738 (truy cập 2026-10-14)"
  - "AdMob Help — Reports glossary: https://support.google.com/admob/table/9462111 (truy cập 2026-10-14)"
  - "AdMob Help — AdMob policies and restrictions: https://support.google.com/admob/answer/6128543 (truy cập 2026-10-14)"
  - "AdMob Help — Behavioral policies: https://support.google.com/admob/answer/2753860 (truy cập 2026-10-14)"
  - "AdMob Help — Interstitial ad guidance: https://support.google.com/admob/answer/6066980 (truy cập 2026-10-14)"
  - "AdMob Help — Disallowed interstitial implementations: https://support.google.com/admob/answer/6201362 (truy cập 2026-10-14)"
  - "AdMob Help — Rewarded ads policy: https://support.google.com/admob/answer/7313578 (truy cập 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 00-overview/glossary-chi-so.md
  - 03-monetization/mediation-admob-vs-applovin-max.md
  - 04-measurement/firebase-setup-link-google-ads-admob.md
  - 05-optimization/doc-chi-so-theo-moc-thoi-gian.md
summary: 6 ad format của AdMob và khi nào dùng, định nghĩa chính thức requests/match rate/show rate/impressions/eCPM/ARPU/imps per user, cách đọc phễu, và các policy dễ bị phạt (invalid traffic, interstitial, rewarded).
---

# AdMob cơ bản

## Bối cảnh

AdMob là nền tảng monetization (và mediation) của Google cho app. Với app thuần ads, doanh thu từ AdMob là "R" trong ROAS. Thông tin dưới đây lấy từ AdMob Help, truy cập 2026-10-14.

## 1. Ad formats (6128738)

| Format | Mô tả chính thức | Dùng khi |
|---|---|---|
| **Banner** | Hiển thị ở trên/dưới màn hình | Hiển thị liên tục, ít gây phiền. Hợp app utility (Google gợi ý utility nên cân nhắc banner thay vì interstitial). |
| **Interstitial** | Toàn màn hình, ở điểm chuyển tự nhiên (vd xong level). Hỗ trợ video. | App có luồng tuyến tính, có điểm dừng rõ. |
| **Rewarded** | User chủ động xem video/playable/survey để nhận thưởng | Monetize user free-to-play. User phải **opt-in**. |
| **Rewarded interstitial** *(Beta)* | Toàn màn hình, có thưởng, xuất hiện ở điểm chuyển tự nhiên (user không phải opt-in) | Điểm chuyển muốn tặng thưởng. |
| **Native advanced** | Tuỳ biến theo giao diện app, nằm inline với nội dung. Hỗ trợ video. | Feed, danh sách, màn kết quả. |
| **App open** | Xuất hiện khi user mở app hoặc quay lại app, phủ lên loading screen | Thay cho interstitial lúc mở app (interstitial lúc mở app là **vi phạm**, xem mục 3). |

Mỗi ad unit chỉ nhận ad thuộc các ad type đã chọn (text/image/rich media, video, interactive).

## 2. Chỉ số trong AdMob report (Reports glossary)

Phễu doanh thu:

```
Requests ──match rate──> Matched requests ──show rate──> Impressions ──eCPM──> Estimated earnings
```

| Chỉ số | Định nghĩa / công thức chính thức |
|---|---|
| **Requests** | Số lần app/ad unit gọi ad. **Đếm cả khi không có ad trả về.** |
| **Matched requests** | Số ad mà ad source trả về. Không phải matched request nào cũng thành impression. |
| **Match rate** | Matched requests / Requests × 100% |
| **Impressions** | Tổng số ad đã hiển thị cho user |
| **Show rate** | Impressions / Matched requests × 100% |
| **Clicks / CTR** | CTR = Clicks / Impressions × 100% |
| **Estimated earnings** | Doanh thu ước tính trong kỳ, **có thể thay đổi** |
| **eCPM** | Estimated earnings / Impressions × 1000 |
| **Observed eCPM** | eCPM ước tính của network bên thứ 3 từ dữ liệu lịch sử (chỉ cho network được tối ưu) |
| **Active users** | Số user duy nhất mở app. Theo ngày là DAU. |
| **ARPU** | (Ads earnings + Purchase earnings) / Active users. Gộp theo ngày là ARPDAU. |
| **Imps / AU** | Impressions / Active users, còn gọi là "ad density / ad load" |
| **Imps / Sessions** | Chỉ cho rewarded: số rewarded ad trung bình mỗi session |

### Cách đọc để chẩn đoán

| Triệu chứng | Nghi vấn |
|---|---|
| Match rate thấp | Thiếu demand ở GEO, floor eCPM quá cao, thiếu ad source/bidder, app mới chưa có lịch sử. |
| Show rate thấp | Load ad quá sớm/quá nhiều (preload không dùng), user rời màn hình trước placement, ad hết hạn, logic show sai. Thường là **vấn đề code/placement**. |
| eCPM giảm mà imps tăng | Mở rộng ra GEO eCPM thấp, hoặc tăng ad load ở format rẻ. Đọc theo GEO + format. |
| Imps/AU tăng mạnh | Kiểm tra retention và `app_remove` cùng kỳ. Ad load cao có thể đánh đổi retention. |
| Partner bidding | AdMob tính matched requests khác nên **match rate có thể giảm, show rate tăng mà doanh thu không đổi**. Không kết luận vội. |

Các chiều nên xem: **ad unit**, **format**, **country (top GEO)**, **ad source**, **app version**. Đây cũng là các chiều roadmap yêu cầu ở bước đo lường.

## 3. Policy dễ dính

### Invalid traffic (2753860)
- **Không tự click ad của mình**, kể cả để test. Dùng **test ads** (test ad unit / test device).
- Không dùng bất kỳ cách nào thổi phồng impression/click.
- Không đặt Google ads trong app **trả tiền/thưởng cho việc click hoặc xem ad** (compensation programs). Rewarded ad đúng policy là ngoại lệ.
- Không mở tài khoản phụ để lách. Tài khoản trùng sẽ bị đóng.
- Refresh banner phải nằm trong khoảng SDK cho phép.

### Interstitial: các cách triển khai bị cấm (6201362)
- **Không show interstitial khi app vừa load hoặc khi thoát app.** Muốn có ad lúc mở app thì dùng **App open**.
- **Không show sau mọi hành động** của user, kể cả khi bấm Back.
- **Không bật bất ngờ** giữa lúc user đang thao tác (đang chơi, đang nhập form).
- Không show khi app chạy nền hoặc ngoài môi trường app.
- Không chặn điều hướng hay nội dung chính.
- Lưu ý UX (6066980): một số interstitial cần tới 5 giây mới có nút đóng, video tương tác cao tới 12 giây, một số video third-party bidding tới 30 giây. Tính vào trải nghiệm khi đặt placement.

### Rewarded (7313578)
- Chỉ show **sau khi user chủ động, rõ ràng opt-in**. Từ chối xem thì app vẫn dùng bình thường.
- Công bố rõ hành động cần làm và phần thưởng **trước** mỗi ad.
- **Không thưởng tiền thật** hoặc vật phẩm quy đổi/chuyển nhượng được ra tiền.
- Phải trao đúng phần thưởng đã hứa.

### Chung (6128543)
- AdMob áp dụng AdSense Program policies + Google Publisher Policies. Google có quyền tắt ad serving hoặc đóng tài khoản khi vi phạm.

## Việc tiếp theo

- Khi có app cụ thể: liệt kê ad unit (ID, format, placement) vào `apps/<app>/profile.md`.
- Thêm bài về banner/native placement guidance (6128877) nếu cần.
