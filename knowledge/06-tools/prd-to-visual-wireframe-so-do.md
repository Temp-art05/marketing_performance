---
title: PRD → Visual (prd-visual-suite) — PRD ra wireframe + sơ đồ luồng, soạn PRD chuẩn, metrics plan cho PO
type: reference
topic: 06-tools
tags: [tool, skill, product-owner, prd, wireframe, diagram, metrics, tracking-spec, claude-code]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-102 - PRD → Visual (Claude-powered)/_info.md, 01-LINK-TOOL.txt, 03-mo-ta-ky-thuat-SKILL.md, 03b-README.md (đọc 2026-10-14)
  - AI Knownledge/APR-102 - PRD → Visual (Claude-powered)/prd-to-visual-tool-full.zip → server.mjs, gen.sh, package.json, prd-visual-suite/ (4 skill), validate_coverage.py (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 04-measurement/tracking-spec-va-metrics-plan-cho-feature.md
  - 05-optimization/khung-phan-tich-metrics-aarrr-cohort-funnel.md
  - 04-measurement/firebase-events-cho-ua.md
  - 06-tools/product-skills-artimind-vision-lab.md
  - 06-tools/tong-quan-cong-cu-ai-marketing.md
summary: Bộ skill Claude cho PO (Anh Trần Thế) — prd-to-visual dựng wireframe + sơ đồ SVG từ PRD, kiểm coverage FR bằng máy; kèm po-prd-writer (PRD 17 mục) và po-metrics-analysis (metrics plan, tracking spec).
---

# PRD → Visual (prd-visual-suite)

## Làm gì
Plugin `prd-visual-suite` gồm 4 skill nối thành pipeline của Product Owner (repo này cài 3, bỏ `html-diagram` vì là sơ đồ kiến trúc cho dev):

| Skill | Làm gì | Output |
|---|---|---|
| `po-prd-writer` | Soạn/review PRD 17 mục (Overview, Scope, Screen Inventory, User Flows, FR theo màn, Tech Spec, Business Rules, UI Spec, Analytics Events, Test Cases, AC, Rollout…). ID truy vết `FR-S<n>-<nn>`, `BR-`, `TC-`, `AC-`; viết MUST/SHOULD kiểu RFC 2119. Thiếu context thì hỏi gom 1 lần (6–8 câu), không tự bịa. | PRD Markdown **tiếng Anh** |
| `prd-to-visual` | Đọc PRD (.md/.docx), **chấm điểm** chất lượng (% FR có Acceptance Criteria), rồi dựng 2 file HTML bám 2 mẫu "gold": `wireframe.html` (mockup iPhone, design system Frost) và `logic-diagram.html` (flowchart SVG). Mỗi màn/node gắn `<!-- FR-xx -->`. | 2 file HTML trong `output/<tên-prd>/` |
| `html-diagram` *(không cài)* | Vẽ 1 file HTML sơ đồ kiến trúc full-screen bằng SVG. Thiên về dev. | 1 file HTML |
| `po-metrics-analysis` | 3 use case: (1) trước release — Metrics Plan + Tracking Spec Firebase; (2) sau release 1–4 tuần — Analysis Report ra quyết định Scale/Iterate/Kill; (3) báo cáo định kỳ cho stakeholder (TL;DR-first). Có checklist tự review. | Markdown **tiếng Anh** |

Kiến thức rút từ `po-metrics-analysis` đã tách thành tài liệu riêng: [tracking spec & metrics plan cho feature](../04-measurement/tracking-spec-va-metrics-plan-cho-feature.md) và [khung phân tích AARRR/cohort/funnel](../05-optimization/khung-phan-tich-metrics-aarrr-cohort-funnel.md).

**Kiểm coverage bằng máy** (`validate_coverage.py`, chỉ dùng stdlib Python): so tập FR-id giữa PRD và 2 file HTML → báo `N/N FR covered`, **MISSING** (FR chưa vẽ) và **ORPHAN** (màn hình không có FR nguồn, tức LLM tự bịa).

## Dùng ở bước nào
- Không phải công cụ UA trực tiếp. Dùng khi **làm feature mới cho app** (vd Home Morph thêm luồng mới, thêm placement ads/rewarded): PO viết PRD → visual cho Dev/Design/QA → Tracking Spec để có event chuẩn ngay từ bản build.
- Với UA, phần đáng dùng nhất là `po-metrics-analysis`: event được đặt tên/định nghĩa chuẩn trước release thì sau này mới import được conversion sạch cho Google Ads và đọc được funnel/retention theo cohort.

## Cách gọi trong repo này
Skill cài tại `.claude/skills/<tên>/`: `prd-to-visual`, `po-prd-writer`, `po-metrics-analysis`. Hai skill sau trùng nội dung với bộ APR-026 — repo cài **bản tách từ APR-026** vì có đủ `assets/` + `references/` (bản trong zip APR-102 để phẳng, đường dẫn gãy). Xem [Viết PRD (APR-026)](viet-prd-agent-apero.md).

- **PRD → hình**: đưa file PRD và nói "visual hóa PRD này" / "PRD ra wireframe". Skill chạy `scripts/validate_coverage.py` trước và sau khi vẽ. Bản cài đã đổi thư mục ra thành `exports/po/<tên-prd>/` (gitignore).
- **Soạn PRD**: "viết PRD cho feature X" → `po-prd-writer`.
- **Metrics/tracking**: "viết tracking spec cho feature X", "metrics plan", "phân tích số sau release" → `po-metrics-analysis`. Bản cài lưu ra `exports/po/<app>/` (bản gốc ghi `/mnt/user-data/outputs/` của claude.ai).
- Kiểm coverage thủ công:
  ```bash
  python3 -I .claude/skills/prd-to-visual/scripts/validate_coverage.py \
    --prd exports/po/<prd>/prd.md \
    --wireframe exports/po/<prd>/wireframe.html \
    --diagram exports/po/<prd>/logic-diagram.html
  ```

### Web tool (không cài vào repo)
Bản đầy đủ có thêm server local và CLI, **không** cài vào repo này. Muốn dùng thì giải nén `prd-to-visual-tool-full.zip` ra thư mục riêng (ngoài repo):
```bash
npm start                     # = node server.mjs → http://localhost:5178, tải PRD → "Gen bằng Claude"
./gen.sh input/<prd>.md [model]   # CLI: ra output/<prd>/{prd.md, wireframe.html, logic-diagram.html}
```
Cần Claude Code CLI đã đăng nhập (server gọi `claude -p`), Node ≥ 18, Python 3 (tuỳ chọn, để chấm coverage). `gen.sh` đọc .docx bằng `textutil` (chỉ macOS). Có thêm `prd-to-visual-tool.html` mở thẳng trình duyệt, dựng bằng regex/template, chỉ dùng khi không có Claude.

## Giới hạn
- **Mâu thuẫn nội bộ**: SKILL.md nói thiếu AC "chỉ hạ điểm, không chặn", nhưng `validate_coverage.py` **exit 1 (FAIL)** khi > 30% FR thiếu AC (`AC_MISSING_THRESHOLD = 0.30`). Khi đọc kết quả, FAIL ở PARSE GATE không có nghĩa là không dựng được.
- Scope là **PRD feature mobile app**, mockup cố định khung iPhone. App Android vẫn dùng được để trao đổi luồng nhưng không đúng chrome Android.
- `po-metrics-analysis` viết cho **farming/casual game có IAP**. Catalog metrics và "healthy range" trong `farming-app-metrics.md` **không có nguồn** — không dùng làm benchmark cho app ads-only.
- SKILL.md của `po-metrics-analysis` bản zip APR-102 trỏ tới `assets/…`/`references/…` nhưng file để phẳng — đã xử lý bằng cách cài bản APR-026.
- Skill tham chiếu `po-ab-testing` ("sắp build") — chưa có.
- Gold template và mockup tải font từ Google Fonts khi mở (cần mạng để hiển thị đúng font).
- Video demo `Bandicam_…mp4` (~7,7 MB) ở thư mục nguồn, chưa xem.

## Nguồn / owner
- Owner trên hub: **Anh Trần Thế** (APR-102, hub #112). `package.json`/plugin ghi author `chaulb@apero.vn` — có thể là người đóng gói, chưa xác nhận.
- Repo gốc: `github.com/anhtt6-apero/prd-to-visual`. Bản dự phòng: `AI Knownledge/APR-102 - PRD → Visual (Claude-powered)/prd-to-visual-tool-full.zip`. License khai báo MIT.
