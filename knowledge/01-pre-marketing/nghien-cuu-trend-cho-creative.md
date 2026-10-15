---
title: Nghiên cứu trend cho creative — nguồn, bộ hashtag, khung "Why It Works" và điểm số
type: concept
topic: 01-pre-marketing
tags: [trend, creative, research, tiktok, hashtag, competitor, photo-video-app]
app: general
geo: [US, LATAM, BR, ES]
status: verified
confidence: medium
sources:
  - "AI Knownledge/APR-196 - Tiktok Crawl Trend/TikTok_Trend_Tool.zip: hashtags.json, crawl_today.py (đọc 2026-10-14)"
  - AI Knownledge/APR-255 - TrendGrab/PRD.md (đọc 2026-10-14)
  - AI Knownledge/APR-231 - reseach sản phẩm/tai-lieu-san-pham/PRD.md, TECHNICAL.md (đọc 2026-10-14)
  - AI Knownledge/APR-258 - Video Download/repo/README.md (đọc 2026-10-14)
  - "Khoá UA Marketing Mobile App 2026 (Quocmedia, Quốc Anh), bài 1.4 — video ~11–12/2024, transcribe 2026-10-15"
created: 2026-10-14
updated: 2026-10-15
related:
  - 00-overview/khoa-hoc-quocmedia-ua-marketing-2026.md
  - 01-pre-marketing/research-doi-thu-va-keyword-cho-app.md
  - 01-pre-marketing/style-video-creative-ads-va-cong-thuc-hook.md
  - 01-pre-marketing/creative-assets-google-app-campaigns.md
  - 06-tools/tiktok-trend-crawler-video-ai-viral.md
  - 06-tools/trendgrab-kham-pha-trend-tai-video.md
  - 06-tools/trend-research-engine-why-it-works.md
  - 06-tools/video-download-tai-video-hang-loat.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
  - 06-tools/social-tracker-tiktok.md
  - 06-tools/global-holiday-map-lich-ngay-le.md
  - 06-tools/tong-quan-cong-cu-ai-marketing.md
summary: Phương pháp nội bộ tìm idea creative — crawl TikTok theo hashtag AI (EN/ES/PT) lọc 48h xếp theo view, gom video đối thủ từ Ads Library, phân tích 13 chiều Why-It-Works, chấm điểm app bằng công thức App Store minh bạch.
---

# Nghiên cứu trend cho creative

## Bối cảnh
Tổng hợp từ 4 tool nội bộ (07–09/2026) do team Marketing/Data Apero làm cho dòng app **AI photo/video**. Đây là phương pháp nội bộ, chưa có số đo cho thấy creative làm từ trend này có CPI/IPM tốt hơn — cần kiểm chứng bằng data campaign thật.

## 1. Nguồn tín hiệu và tool tương ứng
| Câu hỏi | Nguồn | Tool nội bộ |
|---|---|---|
| Nội dung AI nào đang viral 48h qua? | TikTok hashtag | [TikTok Trend Tool](../06-tools/tiktok-trend-crawler-video-ai-viral.md), [TrendGrab](../06-tools/trendgrab-kham-pha-trend-tai-video.md) |
| Sound/hashtag này có bao nhiêu video, format gì? | TikTok music page, hashtag | [Video Download](../06-tools/video-download-tai-video-hang-loat.md) |
| Đối thủ đang chạy ad gì? | Facebook/Meta Ads Library | Video Download (tải MP4 từng ad) |
| Đối thủ chạy creative gì trên Google App campaign? *(bổ sung 2026-10-15 từ khoá Quocmedia, chưa duyệt)* | Google Ads Transparency Center (+ mẹo My Ad Center lấy tên advertiser) | Thủ công — [research đối thủ](research-doi-thu-va-keyword-cho-app.md) mục 3.1 |
| Ad trả phí nào trên TikTok có CTR cao? *(bổ sung 2026-10-15, chưa duyệt)* | TikTok Creative Center → Top Ads (CTR percentile, mức budget) | Thủ công — [research đối thủ](research-doi-thu-va-keyword-cho-app.md) mục 3.3 |
| Chủ đề nào đang lên theo khu vực? | Google Trends, YouTube autocomplete | TrendGrab |
| App nào trong ngách đang mạnh, vì sao? | App Store (iTunes Search API), review | [Trend Research Engine](../06-tools/trend-research-engine-why-it-works.md) |

## 2. Bộ hashtag theo ngôn ngữ (app AI photo/video)
Lấy từ `hashtags.json` của TikTok Trend Tool (07/2026; file ghi chú "cập nhật hằng ngày" — đây là ảnh chụp, không phải danh sách cố định). Mỗi ngôn ngữ ~40 tag, ví dụ:
- **EN**: capcutpioneer, aifilter, aiart, aivideo, aigenerated, geminiai, aitrend, soraai, klingai, hailuoai, dreamina, aidance, aibabydance, aifaceswap, aiportrait, aiclothes, aiyearbook, aianime, effecthouse, hypic, pioneertemplate.
- **ES**: aibaile, inteligenciaartificial, iavideo, fotoia, efectoia, filtroia, hechoconia, creadoconia, tendenciaia, bebebailando, bebeconIA, parati.
- **PT**: aidanca, videoia, fotoia, chatgptbrasil, aibrasil, feitocomia, iaviral, babydanceai, dreaminabr, capcutbrasil, filtroaibrasil, naoflopa.

Nhận xét: nhiều tag là **tên tool/đối thủ** (CapCut, Kling, Hailuo, Dreamina, Hypic, Sora, Gemini) và **template viral** (AI baby dance, faceswap, yearbook, AI clothes) — theo dõi chúng cho biết template nào đối thủ đang đẩy.

## 3. Quy tắc lọc
- Chỉ giữ video đăng trong **48 giờ** (trend AI thay đổi nhanh); lưu "Favorite" 7 ngày để theo dõi.
- Lọc đúng ngôn ngữ caption (EN/ES/PT) để biết trend theo thị trường; caption ngắn dễ nhận sai.
- Xếp theo **views**; xem kèm like/comment/share.

## 4. Khung phân tích "Why It Works" (13 chiều)
Từ Trend Research Engine — dùng như checklist khi mổ xẻ một video/app thắng: Core Pain Point · User Desire · Viral Mechanism · Emotional Trigger · Visual Hook · Transformation Effect · Speed to Value · Monetization Logic · Platform Fit · Competitive Advantage · Content Repeatability · Shareability · Weakness/Warning. Kết quả nên quy về creative brief: hook, angle, offer, CTA, format (Format DNA: cấu trúc cảnh theo thời gian).

## 5. Điểm số app (công thức minh bạch, dữ liệu App Store)
```
ratingScore = rating/5×100
popularity  = clamp(log10(max(ratingCount,1)) / log10(3.000.000) × 100, 3, 100)
freshness   = 100 nếu update ≤ 30 ngày; 10 nếu ≥ 365 ngày; tuyến tính ở giữa
trend       = 0,45·popularity + 0,35·ratingScore + 0,20·freshness
opportunity = 0,40·ratingScore + 0,35·popularity + 0,25·freshness
```
Giới hạn: không có time-series nên "trend" thực chất là độ phổ biến tích luỹ, **không đo tăng trưởng**; dữ liệu là App Store (iOS). Với Android cần nguồn khác (Sensor Tower, AppMagic… — trả phí).

## 6. Nguyên tắc sử dụng
- Học **format, hook, nhịp, angle**; không sao chép hay dùng lại video người khác làm asset ("công khai không có nghĩa là được dùng miễn phí"). *(bổ sung 2026-10-15, chưa duyệt)* Khoá Quocmedia bài 1.4 có gợi ý "lấy content ad iOS trên TikTok, edit lại chạy cho Android" — giữ nguyên tắc này: chỉ lấy ý tưởng, không lấy video.
- Không vượt rào đăng nhập/CAPTCHA; cookie `ms_token` là credential cá nhân.
- Ghi lại trend nào đã biến thành creative và kết quả (CTR/IPM/CPI) vào `lessons/` để biết phương pháp có hiệu quả không.
