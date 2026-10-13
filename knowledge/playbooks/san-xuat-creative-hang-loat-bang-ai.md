---
title: Sản xuất creative hàng loạt bằng AI — từ trend đến bộ asset đa kênh, đa ngôn ngữ (dây chuyền tool nội bộ Apero)
type: playbook
topic: playbooks
tags: [creative, video-ads, ai-image, ai-video, localization, resize, after-effects, tiktok, google-flow, workflow, policy-check]
app: general
status: verified
confidence: low
sources:
  - AI Knownledge/APR-160, APR-170, APR-171, APR-195, APR-196, APR-246, APR-247, APR-250, APR-255, APR-262 (đọc 2026-10-14) — tài liệu các tool creative nội bộ Apero
  - AI Knownledge/APR-067 - Social Tracker/social-tracker-prd.md (đọc 2026-10-14)
  - AI Knownledge/APR-146 - Khung mẫu tạo prompt ảnh chính xác/Khung tạo prompt ảnh.txt (đọc 2026-10-14)
  - AI Knownledge/APR-114 - XPrompt/Docs/huong-dan-su-dung.md (đọc 2026-10-14)
  - AI Knownledge/APR-075 - Genius Easy Creative/3 - skill.md (đọc 2026-10-14)
  - AI Knownledge/APR-127 - Tool cắt ghép outro hàng loạt siêu nhanh gọn/HUONG_DAN_SU_DUNG.md (đọc 2026-10-14)
  - AI Knownledge/APR-015 - Visual prompting, APR-030 - Tool ghép outro hàng loạt, APR-006 - Auto upload video Youtube, APR-094 - URender (đọc 2026-10-14)
  - "KB: 01-pre-marketing/creative-assets-google-app-campaigns.md (spec chính thức)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/creative-assets-google-app-campaigns.md
  - 01-pre-marketing/nghien-cuu-trend-cho-creative.md
  - 01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md
  - 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md
  - 06-tools/tong-quan-cong-cu-ai-marketing.md
  - 06-tools/social-tracker-tiktok.md
  - 06-tools/xprompt.md
  - 06-tools/genius-easy-creative.md
  - 06-tools/cat-outro-watermark-video-hang-loat.md
  - 06-tools/render-pro-after-effects-render-hang-loat.md
  - 06-tools/tiktok-creative-mcp-avatar-dubbing-image-to-video.md
  - 06-tools/omni-resize-anh-video-da-kenh.md
  - 06-tools/youtube-auto-uploader.md
  - 06-tools/flow-ghep-nhac-slideshow-video.md
  - 06-tools/hanh-creative-google-flow-nhan-vat-nhat-quan.md
  - 06-tools/ka-tool-bulk-google-flow.md
  - 06-tools/leave-the-text-alone-dich-text-after-effects.md
  - 06-tools/urender-ghep-video-ugc.md
  - 06-tools/visual-prompting-skill-anh-video.md
summary: Dây chuyền 9 bước ghép tool AI nội bộ — trend → concept → ảnh/video nguồn → render hàng loạt → hậu kỳ outro → localize → đủ tỉ lệ → soát spec/policy → upload YouTube; kèm chỗ tool còn thiếu.
---

# Sản xuất creative hàng loạt bằng AI

## Bối cảnh

Roadmap yêu cầu bộ creative lớn cho Google App campaigns (ảnh 1:1, 1.91:1, 4:5 và video 3 hướng — xem [spec](../01-pre-marketing/creative-assets-google-app-campaigns.md)) và thêm biến thể khi scale. Các tool dưới đây do từng người ở Apero làm riêng (06–09/2026); **chưa có tài liệu nào xác nhận đây là quy trình chính thức**. Playbook này là cách ghép đề xuất dựa trên input/output của từng tool. Thời gian/hiệu quả là mô tả của chủ tool, chưa có số đo độc lập → `confidence: low`. Hợp nhất với app **AI photo/video**.

> Gộp 2026-10-14 từ 2 playbook ứng viên ("research và sản xuất creative video hàng loạt" và "sản xuất creative hàng loạt bằng AI"). Bản đồ tool đầy đủ: [tổng quan công cụ AI marketing](../06-tools/tong-quan-cong-cu-ai-marketing.md).

## Dây chuyền

| Bước | Việc | Tool |
|---|---|---|
| 1. Tìm idea | Video organic AI đang viral (lọc 5–15 ngày hoặc 48h, view ≥ ngưỡng, đúng ngôn ngữ GEO); video đối thủ từ Ads Library; sound đang lên | [Social Tracker](../06-tools/social-tracker-tiktok.md), [TikTok Trend Tool](../06-tools/tiktok-trend-crawler-video-ai-viral.md), [TrendGrab](../06-tools/trendgrab-kham-pha-trend-tai-video.md), [Video Download](../06-tools/video-download-tai-video-hang-loat.md) — phương pháp: [nghiên cứu trend](../01-pre-marketing/nghien-cuu-trend-cho-creative.md) |
| 2. Concept + brief | Hook 3 giây đầu, angle, CTA; mổ xẻ bằng khung Why-It-Works; ghi chú hook/format của video top | [Trend Research Engine](../06-tools/trend-research-engine-why-it-works.md) (khung) |
| 3. Ảnh nguồn theo concept | Thủ công: ảnh ref + [khung prompt](../01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md) → GPT/Gemini/Flow. Tự động: [XPrompt](../06-tools/xprompt.md). Viết prompt kỹ thuật: [Visual Prompting](../06-tools/visual-prompting-skill-anh-video.md). **Duyệt ảnh**: loại méo mặt, thừa chi, sai concept | — |
| 4. Biến thể ảnh/video | Nhân vật nhất quán, đổi ngoại hình theo GEO/độ tuổi; áp template lên lô ảnh; ảnh → video; avatar AI đọc script | [Hạnh Creative](../06-tools/hanh-creative-google-flow-nhan-vat-nhat-quan.md), [KA Tool Bulk](../06-tools/ka-tool-bulk-google-flow.md), [TikTok Creative MCP](../06-tools/tiktok-creative-mcp-avatar-dubbing-image-to-video.md) |
| 5. Render hàng loạt | Bộ ảnh → ~25 video 9:16/persona (hook → fake UI → kết quả → nhạc → outro); template AE head/body/tail → 30–100 tổ hợp; slideshow từ folder ảnh; video UGC 2 người (app học ngôn ngữ) | [Genius Easy Creative](../06-tools/genius-easy-creative.md), [Render Pro](../06-tools/render-pro-after-effects-render-hang-loat.md), [Flow slideshow](../06-tools/flow-ghep-nhac-slideshow-video.md), [URender](../06-tools/urender-ghep-video-ugc.md) |
| 6. Hậu kỳ | Gắn outro + logo/watermark app mình | [Creative Editor / Video Studio / Outro Tool](../06-tools/cat-outro-watermark-video-hang-loat.md) |
| 7. Localize | Dịch text layer AE theo nước; lồng tiếng 13 ngôn ngữ | [Leave The Text Alone](../06-tools/leave-the-text-alone-dich-text-after-effects.md), TikTok AI Dubbing |
| 8. Đủ tỉ lệ | 1:1, 9:16, 16:9 (+ 4:5) | [OmniResize](../06-tools/omni-resize-anh-video-da-kenh.md) — **thiếu 1.91:1 và 4:5**; Outro Tool có 4:5 cho video |
| 9. Soát + upload | Spec từng kênh, policy, bản quyền; video lên YouTube lấy link cho App campaign | checklist dưới, [YouTube Auto Uploader](../06-tools/youtube-auto-uploader.md) |

## Checklist trước khi upload

- [ ] Đủ tỉ lệ: Google App campaigns cần ảnh 1200×1200, **1200×628**, **1200×1500** và video ngang/dọc/vuông trên YouTube (Public/Unlisted, không Private).
- [ ] Ngôn ngữ asset khớp ngôn ngữ targeting của ad group ([GEO & ngôn ngữ](../02-ua-channels/google-ads/geo-va-ngon-ngu-targeting.md)).
- [ ] UI/tính năng trong video (kể cả "fake UI") **khớp app thật** — nếu không dễ dính Deceptive Behavior / Misleading Claims và sinh review "false advertising".
- [ ] Không hình nhạy cảm (App Promotion policy); không style/nhân vật dính bản quyền (Impersonation, Apple 4.1).
- [ ] Không dùng lại nguyên video/nhạc tải về của người khác; nhạc có quyền thương mại.
- [ ] Ảnh/khuôn mặt người thật có quyền sử dụng; dubbing/image-to-video đã xác nhận consent theo TikTok.
- [ ] Nội dung AI tuân policy kênh (nhãn AI-generated nếu kênh yêu cầu; không giả mạo người nổi tiếng).
- [ ] Tên file có concept + biến thể + ngôn ngữ + tỉ lệ (vd hậu tố `_9-16` như OmniResize) để đọc asset report sau này.

Chi tiết policy: [lỗi policy thường gặp](../01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md) (App Promotion, Deceptive Behavior, Impersonation).

## Chỗ còn thiếu
- Không có tool nào xuất ảnh **1.91:1** và **4:5** cho Google App campaigns — phải crop/dựng tay hoặc thêm vào OmniResize.
- Không có bước đo: chưa tool nào nối asset → kết quả (CTR/IPM/CPI). Cần tự ghi.

## Việc tiếp theo
- Ghi kết quả asset theo concept (CTR, IPM, CPI, performance label của Google) vào `apps/<app>/campaigns.md` và `lessons/` để biết bước nào thực sự tạo creative thắng.
