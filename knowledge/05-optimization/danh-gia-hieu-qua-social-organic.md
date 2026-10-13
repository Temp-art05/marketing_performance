---
title: Đánh giá hiệu quả bài social organic — ER đúng công thức từng nền tảng, so trung vị 3 tháng, bẫy số liệu Meta Business Suite
type: concept
topic: 05-optimization
tags: [social, organic, engagement-rate, facebook, tiktok, linkedin, meta-business-suite, graph-api, content]
app: general
status: draft
confidence: medium
sources:
  - "AI Knownledge/APR-076 - Report Social Media/PRD.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-076 - Report Social Media/apero-social-report-agent.zip → .claude/skills/apero-social-branding-evaluator/SKILL.md + references/hessbic_framework.md, cart_framework.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-076 - Report Social Media/apero-social-report-agent.zip → memory/memory.md (mục LỖI SỐ QUAN TRỌNG) (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 06-tools/apero-social-report-agent.md
  - 06-tools/social-tracker-tiktok.md
  - 00-overview/glossary-chi-so.md
  - 06-tools/apero-comment-tool-facebook.md
summary: "Công thức ER theo mẫu số riêng của Facebook/LinkedIn/TikTok, cách chấm bài so trung vị 3 tháng (loại bài boosted), phễu chẩn đoán reach→tương tác→share/save, và bẫy cột export Meta Business Suite bị thổi ~3 lần."
---

# Đánh giá hiệu quả bài social organic

## Bối cảnh

- Nguồn là agent báo cáo social của **team Employer Branding Apero** (APR-076, tác giả Thu Hiền, 06–07/2026). Agent chạy với Fanpage Apero, Fanpage Career, LinkedIn, TikTok, Website.
- Bối cảnh gốc là **branding nhà tuyển dụng**, không phải fanpage sản phẩm. Phần phương pháp đo (ER, baseline, phễu chẩn đoán) và các bẫy dữ liệu Meta vẫn dùng được cho fanpage/TikTok của app. Các tiêu chí nội dung (HESSBIC, TABOO) thì riêng cho Apero branding.

## 1. ER: mỗi nền tảng một mẫu số

| Kênh | Công thức | Ghi chú |
|---|---|---|
| Facebook Page | ER = (reactions + comments + shares) ÷ **reach** × 100 | Reach organic FB thấp, nên chia theo reach chứ không theo follower |
| LinkedIn | ER = (reactions + comments + shares + clicks/follows) ÷ **impressions** × 100 | Tỉ lệ comment/like nói lên nhiều hơn % ER |
| TikTok | ER = (likes + comments + shares + saves) ÷ **views** × 100 | Phân phối theo thuật toán, tài khoản nhỏ vẫn có thể có view lớn, đừng nhìn follower |
| Website | Không tính ER | Xem view + retention/avg time |

Lấy số **sau 48h** kể từ lúc đăng. Báo cáo **từng kênh riêng**, không gộp thành 1 con số.

## 2. Chấm bài: so với trung vị 3 tháng của chính kênh

- Mốc = **median per-post** của reach và tương tác trên kênh đó trong 3 tháng gần nhất (cuốn chiếu). Dùng median để 1–2 bài bất thường không kéo lệch.
- **Loại bài boosted/chạy ads khỏi baseline.** Dấu hiệu: reach gấp > 3 lần các bài còn lại. Không chắc thì hỏi lại trước khi tính.
- 🟢 ≥ 120% median · 🟡 khoảng 80–120% · 🔴 < 80% (đặc biệt < 60%) ở **cả** reach lẫn tương tác.
- Baseline nội bộ tại thời điểm viết (chỉ của fanpage Apero, không áp cho app): Fanpage ~48 react/bài, LinkedIn ~20 react/bài.
- Benchmark ngoài ngành (median ER 2025–2026, theo tổng hợp trong skill từ Socialinsider/Hootsuite/Buffer, **chưa kiểm chứng lại**, chỉ để định hướng): FB organic ~0,15%/follower; LinkedIn ~3–3,5%; TikTok ~3,4–3,7% theo follower, ~4,2% theo view. Các nguồn lệch nhau nhiều vì khác mẫu số, nên luôn so với baseline của chính mình.

## 3. Phễu chẩn đoán 1 bài (metric-first)

1. **Reach thấp** → lỗi hook, format/ảnh, giờ đăng (bài không được đẩy).
2. **Reach ổn, tương tác thấp** → nội dung không liên quan, thiếu CTA (thấy mà không tương tác).
3. **Tương tác ổn, share/save thấp** → thiếu giá trị đáng lưu/đáng khoe.
- Theo dõi **share + save riêng**. Hai chỉ số này có trọng số thuật toán cao và là tín hiệu lan toả thật.
- Reach/like cao nhưng share/save/comment thấp là vanity metric.
- Đề xuất luôn kết thúc bằng hành động: sửa hook trước nếu reach thấp; 5 đòn bẩy là pillar, format, hook/cách viết, giờ & tần suất, chủ đề. Nhất quán quan trọng hơn số lượng bài.
- Hai khung viết dùng kèm: **HESSBIC** (Hook, Explain, Selling A/B, Branding, Indicator, CTA) cho bài thông báo/sản phẩm; **C.A.R.T** (Context, Adversity, Resolution, Takeaway) cho bài kể chuyện.

## 4. Bẫy số liệu Meta (đã gặp thật)

- **Tương tác Facebook phải lấy cột "Lượt tương tác"** trong file export Meta Business Suite, vì cột này khớp UI. **Không cộng tay** "Cảm xúc" + "Bình luận" + "Lượt chia sẻ": hai cột "Cảm xúc"/"Bình luận" trong export bị thổi khoảng 3 lần. Ví dụ thật: 1 bài có Lượt tương tác = 78 (đúng UI), nhưng export ghi Cảm xúc = 148, Bình luận = 60. Cột Share/Save thì khớp UI.
- Ba chỉ số khác nhau, đừng lẫn: **Lượt xem (Views) ≠ Người xem (Reach) ≠ Lượt tương tác**.
- **Graph API (v23.0) không trả reach cấp Trang**: các metric `page_impressions*`, `page_fan_adds` đã bị khai tử. Reach/views từng bài phải lấy từ file export Business Suite. Lấy danh sách bài + reach từng bài cần quyền `pages_read_user_content`.
- Token lấy từ Graph API Explorer chỉ sống khoảng 1–2 giờ. Chạy tự động hằng tuần cần **System User token** (Business Manager).
- Page đối thủ: chỉ thấy react/comment/share công khai, không có reach. So sánh bằng **engagement/follower** và không trộn số đối thủ vào thang chấm bài của mình.

## Bài học

- Với fanpage/TikTok của app, phải tách bài organic khỏi bài boosted trước khi kết luận "content nào thắng". Nếu không, bài chạy ads sẽ làm lệch baseline.
- Muốn tìm ý tưởng content đang viral (không phải đo bài của mình) thì dùng [Social Tracker](../06-tools/social-tracker-tiktok.md).
