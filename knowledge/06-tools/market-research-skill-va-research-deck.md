---
title: Skill market-research + tạo slide báo cáo từ kết quả nghiên cứu thị trường
type: reference
topic: 06-tools
tags: [tool, skill, market-research, sensortower, slides]
app: general
status: draft
confidence: medium
sources:
  - "AI Knownledge/APR-017 - Create Beautful Slide From Research Market result/_info.md, market-research.zip, Create beautiful slide.xlsx (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/market-research-tam-sam-som-go-no-go.md
summary: Claude skill market-research (TAM/SAM/SOM, why-now, persona, benchmark, rubric Go/No-Go dùng SensorTower MCP) kèm bộ prompt GPT dựng slide báo cáo theo brandkit.
---

# Skill market-research + slide báo cáo

## Làm gì
- **Skill `market-research`**: với một ý tưởng app, trả lời "thị trường có đáng làm không, cho ai, vì sao bây giờ", ra kết luận GO / NO-GO / PIVOT và file `market/MARKET-RESEARCH-<ngày>.md`. Phương pháp chi tiết: [nghiên cứu thị trường cho app mới](../01-pre-marketing/market-research-tam-sam-som-go-no-go.md).
- **Bộ prompt slide** (file `Create beautiful slide.xlsx`): các bước prompt GPT dựng slide đẹp theo brandkit từ file research `.md`. Khuyến nghị gen UI **từng slide một** để giữ đồng nhất.
- **Bước roadmap**: trước Pre-Marketing (chọn ý tưởng/GEO), và khi báo cáo cho quản lý.
- **Owner**: Đức Nguyễn Đình. Vị trí: `AI Knownledge/APR-017 - Create Beautful Slide From Research Market result`.

## Cách chạy
Giải nén `market-research.zip` vào `~/.claude/skills/market-research/`. Trigger: "nghiên cứu thị trường", "market sizing", "TAM SAM SOM", "validate ý tưởng".
Cần: kết nối **SensorTower MCP** (<cần tài khoản/OAuth SensorTower>); tuỳ chọn Meta Ads MCP để xem ad library và benchmark. Không có SensorTower thì skill fallback sang web và đánh dấu là ước lượng.

## Giới hạn
- Skill nhắm app sub/IAP. Với app ads-only, tiêu chí WTP cần thay (xem doc phương pháp).
- Các skill `competitor-research` và `research-deck` được nhắc trong pipeline nhưng **không có** trong asset.
- Slide demo (`Slide-demo.pptx`, 32 MB) và `Brandkit-demo.png` chỉ là ví dụ hình thức.
