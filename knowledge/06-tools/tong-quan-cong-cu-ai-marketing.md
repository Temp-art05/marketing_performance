---
title: Tổng quan công cụ AI marketing — bản đồ tool theo bước roadmap và chọn tool nào khi nào
type: overview
topic: 06-tools
tags: [tool, overview, roadmap, workflow, ai]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/ (kho asset Apero Knowledge Hub, 127 project triage, 38 tài liệu tool) (đọc 2026-10-14)
  - "KB: 00-overview/roadmap.md"
  - "Khoá UA Marketing Mobile App 2026 (Quocmedia, Quốc Anh), chương 1–3 — video ~11–12/2024, transcribe 2026-10-15 (nhóm tool bên ngoài)"
created: 2026-10-14
updated: 2026-10-15
related:
  - 00-overview/khoa-hoc-quocmedia-ua-marketing-2026.md
  - 06-tools/creatify-ai-video-ads-tu-link-app.md
  - 01-pre-marketing/research-doi-thu-va-keyword-cho-app.md
  - 00-overview/roadmap.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
  - 01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
  - 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md
  - 01-pre-marketing/nghien-cuu-trend-cho-creative.md
  - 05-optimization/doc-chi-so-theo-moc-thoi-gian.md
  - 06-tools/po-copilot-pipeline-tai-lieu-san-pham.md
  - 06-tools/viet-prd-agent-apero.md
  - 06-tools/prd-to-visual-wireframe-so-do.md
  - 06-tools/product-skills-artimind-vision-lab.md
summary: Bản đồ ~40 tool AI nội bộ Apero theo bước roadmap (ASO/creative → launch → đo lường/tối ưu → monetization → policy/legal → research/social → product/PO), mỗi tool 1 dòng, kèm hướng dẫn chọn tool nào khi nào.
---

# Tổng quan công cụ AI marketing

Bản đồ các tool trong `06-tools/` xếp theo [roadmap](../00-overview/roadmap.md). Hầu hết là tool nội bộ Apero do từng người làm (06–09/2026), tài liệu là PRD/hướng dẫn của chính owner — **hiệu quả chưa được đo độc lập**. Nhiều tool cần quyền/API key riêng: xin owner, không chia sẻ credential.

Ký hiệu: 🖥 chạy local · 🌐 web/Google Flow · 🤖 Claude skill/MCP/agent · 🔑 cần key/token/đăng nhập riêng.

## 0. Trước Pre-Marketing — chọn ý tưởng, GEO, mùa vụ

- [Skill market-research + slide](market-research-skill-va-research-deck.md) 🤖🔑 — TAM/SAM/SOM, rubric GO/NO-GO bằng SensorTower MCP ([phương pháp](../01-pre-marketing/market-research-tam-sam-som-go-no-go.md)).
- [Trend Research Engine](trend-research-engine-why-it-works.md) 🖥 — app trending từ App Store + khung 13 chiều Why-It-Works (phần AI còn mock).
- [Global Holiday Map](global-holiday-map-lich-ngay-le.md) 🖥🔑 — lịch lễ 2025–2030 theo nước để lên kế hoạch creative/ASO mùa vụ.
- [DataCr3wl và mdnow](datacr3wl-va-mdnow-cao-du-lieu-research.md) 🖥🤖 — cào web/tài liệu thành Markdown cho AI (đối thủ, policy, help center).

## 1. Pre-Marketing — ASO

- [Terasofts Graphic Pro](terasofts-graphic-pro-tao-screenshot-store.md) 🖥🔑 — bộ screenshot nhanh 1080×1920 từ ảnh UI + file mô tả.
- [ASO_Screenshot (Google Flow)](aso-screenshot-google-flow.md) 🌐 — screenshot đa kích thước iOS/Android, localize nhiều ngôn ngữ.
- [App Store Screenshot Studio](app-store-screenshot-studio.md) 🖥🔑 — nhiều biến thể, sửa từng slide bằng chat, px tuỳ chỉnh.
- [CPP generator](cpp-generator-screenshot-tool.md) 🖥🔑 — bộ 5 slide theo use case/TA, quality bar chặt; **chỉ kích thước iOS**.
- [ASO Agent](aso-agent-review-listing-vitals.md) 🖥🔑 — reply review hàng loạt, Risk Inbox, sửa listing đa ngôn ngữ, Vitals theo version ([quy tắc reply](../01-pre-marketing/tra-loi-review-google-play.md)).
- [Super Legal](super-legal-check-trademark-ten-app.md) 🌐 — check trademark tên app trước khi đặt title.

## 1. Pre-Marketing — creative (ảnh/video ads)

Quy trình ghép các tool: [playbook sản xuất creative hàng loạt](../playbooks/san-xuat-creative-hang-loat-bang-ai.md).

- Tìm idea: [Social Tracker](social-tracker-tiktok.md) 🖥🔑 (account TikTok AI organic) · [TikTok Trend Tool](tiktok-trend-crawler-video-ai-viral.md) 🖥🔑 (hashtag EN/ES/PT, 48h) · [TrendGrab](trendgrab-kham-pha-trend-tai-video.md) 🌐 (đa nguồn + tải video/nhạc) · [Video Download](video-download-tai-video-hang-loat.md) 🖥 (TikTok sound, Facebook Ads Library).
- Prompt & ảnh nguồn: [Visual Prompting](visual-prompting-skill-anh-video.md) 🤖 (viết prompt ảnh/video theo model) · [XPrompt](xprompt.md) 🖥🔑 (vòng lặp ref → Qwen → chấm điểm) · kiến thức: [viết prompt AI](../01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md).
- Sinh biến thể trên Google Flow: [Hạnh Creative](hanh-creative-google-flow-nhan-vat-nhat-quan.md) 🌐 (1 ảnh → nhiều biến thể giữ nhân vật) · [KA Tool Bulk](ka-tool-bulk-google-flow.md) 🌐 (lô ảnh × 1 template/prompt) · [Flow slideshow](flow-ghep-nhac-slideshow-video.md) 🌐 (folder ảnh → video ngẫu nhiên).
- AI video TikTok: [TikTok Creative MCP](tiktok-creative-mcp-avatar-dubbing-image-to-video.md) 🤖🔑 — avatar, dubbing 13 ngôn ngữ, image-to-video.
- Render hàng loạt: [Genius Easy Creative](genius-easy-creative.md) 🖥 (ảnh AI → ~25 video 9:16/persona) · [Render Pro](render-pro-after-effects-render-hang-loat.md) 🖥 (template AE → 30–100 tổ hợp) · [URender](urender-ghep-video-ugc.md) 🖥 (UGC 2 người, app học ngôn ngữ).
- Hậu kỳ & tỉ lệ: [Creative Editor / Video Studio / Outro Tool](cat-outro-watermark-video-hang-loat.md) 🖥 (outro, watermark, resize) · [OmniResize](omni-resize-anh-video-da-kenh.md) 🌐 (1:1/9:16/16:9 — thiếu 1.91:1, 4:5) · [Leave The Text Alone](leave-the-text-alone-dich-text-after-effects.md) 🖥 (dịch text layer AE).

## 2. Launch campaign

- [YouTube Auto Uploader](youtube-auto-uploader.md) 🌐 — upload video hàng loạt lấy link cho Google App campaign (kiểm chế độ Public/Unlisted).
- [Meta Ads Dashboard](meta-ads-dashboard.md) 🖥🔑 — nhiều ad account, ROAS×0.7 T-1..T-3, sửa budget, auto rules (Meta, app sub).
- [Apero Comment Tool](apero-comment-tool-facebook.md) 🌐🔑 — AI trả lời comment dưới bài/ad Facebook.

## 3. Đo lường & tối ưu

- [Apero App Performance Checker](apero-app-performance-checker.md) 🖥 — Chrome extension so 2 version (mktpro + AdMob + GA4 funnel) ra verdict rollout.
- [Stum Weekly Report](stum-weekly-report.md) 🖥🔑 — báo cáo tuần theo mẫu stum vào Google Sheet.
- [AdMob Revenue Report Tool](admob-revenue-report-so-sanh-version.md) 🖥 — so ad unit giữa 2 version từ CSV AdMob, offline.
- [Police-product](police-product-bao-cao-suc-khoe-app-hang-ngay.md) 🤖🔑 — báo cáo DAU/retention hằng ngày từ GA4 BigQuery về Discord ([định nghĩa SQL](../04-measurement/ga4-bigquery-chi-so-suc-khoe-san-pham.md)).
- [Agent QC Data pipeline](agent-qc-data-pipeline.md) 🤖🔑 — kiểm luồng dữ liệu nội bộ trước khi tin số dashboard.
- [Apero Data Intraday MCP](apero-data-intraday-mcp-auto-action.md) 🤖🔑 — automation Meta đã làm gì với campaign, vì sao rule không match.
- Kiến thức đi kèm: [hậu kiểm version app](../05-optimization/hau-kiem-version-app-nguong-verdict.md).

## 4. Monetization

- [Firebase Remote Config MCP + rc_apply.js](firebase-remote-config-mcp-rc-apply.md) 🤖🔑 — đổi ~50 key ads theo phase build/normal/2-floor ([template](../03-monetization/remote-config-ads-theo-phase-build-normal-2floor.md)).
- [Skill ios-integrate-revcat](ios-revenuecat-paywall-skill.md) 🤖 — paywall RevenueCat cho app iOS hybrid ([checklist paywall](../03-monetization/paywall-subscription-checklist-policy.md)).
- Kiến thức: [quy tắc đặt quảng cáo in-app Apero](../03-monetization/quy-tac-dat-quang-cao-in-app-apero.md).

## 5. Policy / Legal

- [Policy Helper](policy-helper-tra-cuu-loi-policy.md) 🖥 — tra 45 loại lỗi policy Google/Apple/Facebook, kể cả bằng ảnh chụp ([kho lỗi](../01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md)).
- [Skill Legal & Platform Policy Research](legal-platform-policy-research-skill.md) 🤖 — research luật + policy trước khi launch tính năng ([ví dụ app AI ảnh](../01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md)).
- [Super Legal](super-legal-check-trademark-ten-app.md) 🌐 — trademark tên app.

## 6. Research / Social

- [Apero Social Report Agent](apero-social-report-agent.md) 🤖🔑 — báo cáo social tuần/tháng, ER đúng mẫu số ([phương pháp đo](../05-optimization/danh-gia-hieu-qua-social-organic.md)).
- Trend/đối thủ: xem mục 1 — creative (Social Tracker, TikTok Trend Tool, TrendGrab, Video Download) và mục 0.

## 7. Product (PO) — PRD, metrics, tracking spec

Skill của PO đã cài sẵn trong repo (`.claude/skills/`), output ghi vào `exports/po/<app>/` (gitignore). Chỉ lấy bộ dành cho PO; skill QA/Dev (APR-168, 242, 043) không cài.

- [PO Copilot](po-copilot-pipeline-tai-lieu-san-pham.md) 🤖 — `po-doc-pipeline`: ý tưởng → discovery (`ask-why-ba`) → PRD → use case → user story/AC → prototype hi-fi, duyệt sau mỗi bước.
- [Viết PRD (APR-026)](viet-prd-agent-apero.md) 🤖 — `po-prd-writer` (PRD hand-off 17 section), `po-metrics-analysis` (metrics plan, tracking spec, phân tích sau release), `po-prd-metrics-agent` điều phối.
- [PRD → Visual](prd-to-visual-wireframe-so-do.md) 🤖 — `prd-to-visual`: PRD ra wireframe + sơ đồ luồng, kiểm coverage FR bằng máy.
- [Skill Product Artimind / Vision Lab](product-skills-artimind-vision-lab.md) 🤖 — doc Confluence chuẩn VL, product thinking, AC + pre-rollout theo remote config, UX flow app AI generate.
- Kiến thức đi kèm: [PRD & những gì UA cần](../04-measurement/prd-success-metrics-va-yeu-cau-ua.md), [tracking spec & metrics plan](../04-measurement/tracking-spec-va-metrics-plan-cho-feature.md), [khung phân tích AARRR/cohort/funnel](../05-optimization/khung-phan-tich-metrics-aarrr-cohort-funnel.md).

## 8. Tool bên ngoài miễn phí/rẻ (bổ sung 2026-10-15 từ khoá Quocmedia, chưa duyệt)

Không phải tool nội bộ; khoá Quocmedia dùng để làm UA "tay không". Giá/giao diện theo video (~11–12/2024 hoặc muộn hơn), cần kiểm lại.

- Research: Google Ads **Keyword Planner** (keyword theo tính năng — cột giá thầu là CPC Search, không phải CPI) · **Sensor Tower** bản free (keyword ranking organic của đối thủ) · **Google Ads Transparency Center**, **Meta Ads Library**, **TikTok Creative Center Top Ads** (spy ads) — cách dùng: [research đối thủ & keyword](../01-pre-marketing/research-doi-thu-va-keyword-cho-app.md).
- Text: **ChatGPT** viết description ASO và text asset — thêm ràng buộc không superlative/không emoji ([ASO](../01-pre-marketing/aso-google-play-store-listing.md) mục 7, [creative assets](../01-pre-marketing/creative-assets-google-app-campaigns.md) mục 6).
- Thiết kế: **Canva** (screenshot, ảnh ads 3 tỉ lệ, video 3 cảnh) · **CapCut** (ghép video theo voice) · TTS **ttsopenai.com** (bên thứ ba, kiểm điều khoản) — quy trình: [đường làm tay](../playbooks/san-xuat-creative-hang-loat-bang-ai.md).
- Video avatar/UGC từ link app: [Creatify](creatify-ai-video-ads-tu-link-app.md) 🌐🔑 (trả phí, $39–99/tháng theo video).

## Chọn tool nào khi nào

| Bạn cần… | Dùng | Đừng dùng / lưu ý |
|---|---|---|
| Screenshot cho app **Android** nhanh | Terasofts (1080×1920 sẵn) hoặc ASO_Screenshot (Flow) | CPP generator và preset mặc định của Screenshot Studio ra 1242×2688 — **Play từ chối** (>2:1) |
| Screenshot theo từng use case/ad group | CPP generator (ý tưởng) + **custom store listing** của Play | Bỏ slide "social proof" kiểu #1/award ([policy](../01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md)) |
| Idea creative app AI photo/video | Social Tracker (account) + TikTok Trend Tool (hashtag 48h) | Tab TikTok của TrendGrab có thể hỏng sau 09/2026 (Video Download đo được hashtag feed trả rỗng) — chưa kiểm chứng |
| Video đối thủ đang chạy ads | Video Download (Facebook Ads Library) | Chỉ để nghiên cứu, không dùng lại làm asset |
| Creative đối thủ trên Google App campaign / TikTok trả phí | Transparency Center (+ My Ad Center) / TikTok Top Ads ([research](../01-pre-marketing/research-doi-thu-va-keyword-cho-app.md)) | Lọc nền tảng Google Play chỉ thấy ads từ 04/09/2023 |
| Nhiều biến thể cùng 1 nhân vật | Hạnh Creative | Tốn credit Flow; giá gói cần xác minh |
| Cùng 1 hiệu ứng cho nhiều ảnh | KA Tool Bulk | PRD nhiều giả định |
| Video 9:16 hàng loạt từ ảnh AI | Genius Easy Creative | Fake UI phải giống app thật |
| Đủ tỉ lệ cho Google App campaigns | OmniResize (video) + crop tay ảnh 1.91:1 và 4:5 | OmniResize thiếu 2 tỉ lệ ảnh của Google |
| Gắn outro cho video tự làm | Outro Tool | Không gắn outro mình lên video creator khác |
| Biết version mới có nên tăng rollout | App Performance Checker → (đào sâu ad unit) AdMob Revenue Report Tool | Kiểm "đủ số" theo tier trước |
| Số dashboard nội bộ bất thường | Agent QC Data pipeline trước, rồi mới kết luận về campaign | Không kiểm số gốc Google Ads/AdMob |
| App bị báo lỗi policy | Policy Helper → policy gốc → team ASO | Kho là kinh nghiệm nội bộ, có thể cũ |
| Bật/tắt ads hàng loạt theo phase | Firebase RC MCP + rc_apply.js | Luôn duyệt diff; ghi ngày đổi phase |
| Viết PRD/tracking cho feature mới của app | `po-prd-metrics-agent` (PRD + metrics) hoặc `po-doc-pipeline` (từ ý tưởng thô) | Đòi thêm event conversion + counter-metric UA ([checklist](../04-measurement/prd-success-metrics-va-yeu-cau-ua.md)); benchmark trong skill là game farming, không dùng |

## Không có trong KB

- **APR-261 Ad Copy Skill** và **APR-252 Analytics Agent** — liên quan UA trực tiếp nhưng không tải được (thiếu quyền); đã ghi ở [trạng thái hiện tại](../00-overview/current-state.md).
- Các project không liên quan marketing/PO (slide, QA test case, chia task Jira, áp feature Android, catalog dịch vụ nội bộ, reverse-engineer APK…) không đưa vào.
