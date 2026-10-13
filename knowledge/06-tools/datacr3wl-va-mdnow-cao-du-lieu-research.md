---
title: DataCr3wl và mdnow — cào web/tài liệu thành Markdown gọn cho AI khi research đối thủ, ASO, policy
type: reference
topic: 06-tools
tags: [tool, skill, crawl, research, competitor, markdown]
app: general
status: draft
confidence: medium
sources:
  - "AI Knownledge/APR-032 - DataCr3wl/README.md, CAPABILITIES.md, DEMO_OUTPUT.md, skill/SKILL.md, skill/references/recipes.md, mcp-auth.md (đọc 2026-10-14)"
  - "AI Knownledge/APR-054 - mdnow — Từ URL đến file, tất cả thành Markdown/repo/README.vi.md (đọc 2026-10-14)"
  - "https://github.com/longlee218/mdnow"
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/market-research-tam-sam-som-go-no-go.md
summary: Hai công cụ local — DataCr3wl (Claude skill trên Crawl4AI cào trang JS/anti-bot/cần login, capture XHR, nén token ~54%) và mdnow (URL/site/PDF/Office/YouTube → Markdown sạch, crawl cả site ra llms.txt).
---

# DataCr3wl và mdnow

## DataCr3wl (APR-032)
Claude skill cào web, owner Nguyễn Thanh Bình (06/2026, MIT, dựa trên Crawl4AI + Playwright).
- Cào trang tĩnh, trang JS/SPA (`--wait-for`), vượt anti-bot (`--stealth`), trang **cần login** (lưu profile trình duyệt hoặc dùng MCP browser, không gửi mật khẩu cho SaaS), bắt dữ liệu XHR/GraphQL (`--capture-network`), phân trang, batch nhiều URL, tải ảnh/PDF.
- **Nén token**: `compress.py --query "<câu hỏi>"` giữ phần liên quan. Demo trên Wikipedia: 18.187 → 8.287 token (−54%), vẫn giữ đủ phần cần. Nhiều URL thì mỗi URL một subagent, chỉ trả bản nén về.
- **Use case marketing**: soi landing/store listing đối thủ, gom review, theo dõi giá, kéo dữ liệu từ tool ad intelligence (owner nhắc SocialPeta, AppGrowing).
- Cài: `cd skill && python scripts/setup_env.py` → `python scripts/crawl_url.py --url URL --out out.md` → `python scripts/compress.py --md out.md --query "..."`. Copy `skill/` vào `~/.claude/skills/datacr3wl/`. Tuỳ chọn: <cần OPENROUTER_API_KEY> cho `--llm` / `qc_check --ai`.

## mdnow (APR-054)
CLI + MCP server + skill, owner Long Lee Hoàng, MIT, 100% local, không cần API key.
- `mdnow <url|file> -o out/`; `mdnow <docs-site> --crawl --max-pages 50 -o out/` (ra kèm `llms.txt`, `manifest.json`). Đầu vào: web, PDF, Office, ảnh, audio, YouTube.
- Cài: `uv tool install "mdnow @ git+https://github.com/longlee218/mdnow"` (hoặc script install.sh).
- **Use case**: tải nguyên văn trang policy Google Play/AdMob, help center Google Ads về Markdown để đối chiếu khi viết KB (giữ nguồn và ngày truy cập).

## Chọn công cụ nào
| Cần | Dùng |
|---|---|
| Trang công khai, tài liệu, PDF, crawl cả site docs | mdnow |
| Trang chặn bot, cần login, dữ liệu nằm trong API, research nhiều URL tiết kiệm context | DataCr3wl |

## Rủi ro
- Cào **tool trả phí cần login** (SocialPeta, AppGrowing, SensorTower web) gần như chắc chắn **vi phạm ToS** của nhà cung cấp và có thể làm khoá tài khoản công ty. Ưu tiên API/MCP chính thức (ví dụ SensorTower MCP) hoặc export chính thức.
- `--stealth` vượt anti-bot cũng có thể trái ToS của site đích. Chỉ dùng cho dữ liệu công khai, khối lượng nhỏ.
- Profile trình duyệt đã lưu (`~/.crawl4ai/profiles/`) chứa cookie phiên đăng nhập. Không chia sẻ, không commit.
