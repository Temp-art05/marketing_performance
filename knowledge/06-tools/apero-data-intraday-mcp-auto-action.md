---
title: Apero Data Intraday MCP — tra cứu automation đã làm gì với campaign Facebook
type: reference
topic: 06-tools
tags: [meta-ads, facebook, automation, mcp, rule, tool-noi-bo]
app: general
status: verified
confidence: high
sources:
  - AI Knownledge/APR-209 - MCP tool tra cứu auto action/huong_dan_su_dung.md (đọc 2026-10-14)
  - AI Knownledge/APR-209 - MCP tool tra cứu auto action/_info.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related: [06-tools/meta-ads-dashboard.md]
summary: MCP server (team data) cho Claude Desktop/Code — hỏi tiếng Việt lịch sử action auto-ads intraday (tăng/giảm budget, pause), vì sao action fail, vì sao rule không match. Chỉ đọc, giờ UTC+7.
---

# Apero Data Intraday MCP (tra cứu auto action)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-209 - MCP tool tra cứu auto action` (hướng dẫn `huong_dan_su_dung.md`, video `demo-mcp-auto-action.mp4`).
- Owner: Nguyễn Trung Hiếu (team data). Đối tượng: Marketing Performance, ASO, Data.
- Bước roadmap: **giai đoạn 3 — Đo lường & tối ưu**, cho campaign **Meta (Facebook)** chạy qua hệ thống auto-ads intraday nội bộ (rule tự tăng/giảm budget, pause, notify). Không áp dụng cho Google Ads.

## Làm gì
Trước đây UA phải nhờ data query DB để biết automation đã làm gì. MCP này cho hỏi trực tiếp trong Claude:

| Tool | Câu hỏi | Output |
|---|---|---|
| `get_campaign_action_history` | "hôm nay hệ thống đã làm gì với camp 1202…" | Danh sách action + rule trigger + budget trước/sau |
| `investigate_failed_action` | "vì sao action giảm budget của camp X bị fail", "tháng 5 có bao nhiêu action fail, nhóm theo lỗi" | Action fail nhóm theo loại lỗi, kèm thông báo lỗi nguyên văn từ Facebook |
| `explain_no_match` | "tại sao rule Upscale_ngon của camp X lúc 14h ngày 26/6 không match" | Các condition fail của rule, giá trị thực tế so với ngưỡng |

## Cách chạy
- Yêu cầu: Claude Desktop hoặc Claude Code, Node.js ≥ 18, **<cần API key riêng — xin team data>**, địa chỉ server MCP (hỏi team data).
- Claude Code: `claude mcp add --transport http apero-data-intraday http://<HOST>:8000/mcp --header "X-API-Key: <API key>"`.
- Claude Desktop: thêm server `apero-data-intraday` chạy `npx mcp-remote http://<HOST>:8000/mcp --header X-API-Key:<key> --transport http-only` vào `claude_desktop_config.json`, quit hẳn (⌘Q) rồi mở lại. Kiểm tra: nhờ Claude "echo hello qua apero-data-intraday".
- Hỏi luôn kèm **campaign ID (hoặc tên) + khoảng thời gian**.

## Giới hạn
- Giờ trong câu hỏi và kết quả là **UTC+7**.
- History / failed: tối đa **31 ngày** mỗi lần hỏi, cắt ở **200 action** gần nhất.
- `explain_no_match`: chỉ **7 ngày** gần nhất, xét theo **khung giờ tròn** (hỏi 14:39 → xét 14:00–15:00).
- Action `is_dryrun: true` là chạy thử, chưa tác động thật lên Facebook.
- Chỉ đọc — không sửa campaign, không retry action.
- Lỗi thường gặp: 401 (key sai/thiếu header), tool không hiện (JSON config sai, chưa quit hẳn app), kết quả rỗng (nhầm múi giờ hoặc sai ID). Hỗ trợ: kênh #vibecode-help (cách dùng), #devops (server).

## Media
[▶ Demo hỏi đáp tiếng Việt về lịch sử action của campaign (19 MB)](../../media/2026-10/2026-10-14-mcp-auto-action-demo-1.mp4)
