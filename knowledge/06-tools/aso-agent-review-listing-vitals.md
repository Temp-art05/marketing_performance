---
title: ASO Agent — trả lời review hàng loạt, sửa store listing, giám sát rủi ro và Android Vitals
type: reference
topic: 06-tools
tags: [tool, aso, review, store-listing, android-vitals, sensortower]
app: general
status: verified
confidence: high
sources:
  - AI Knownledge/APR-013 - ASO Agent - Auto Reply/ASO-Agent-L2-package.zip → PRD-ASO-Agent.md, README-GOI-L2.md, ASO-Agent-source-v2.11.1.zip (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related: [01-pre-marketing/tra-loi-review-google-play.md, 01-pre-marketing/aso-google-play-store-listing.md]
summary: Web tool nội bộ (v2.11.1) quản lý portfolio app Google Play — gợi ý reply review bằng AI theo Tier/P1–P4, auto-reply review khen, Risk Inbox, sửa listing đa ngôn ngữ, Vitals crash/ANR theo version.
---

# ASO Agent (Auto-reply Tool)

## Làm gì
Công cụ web nội bộ Apero/Terasofts quản lý tập trung hàng chục app Google Play. Theo owner: đã gửi khoảng 3.000 review / 7 ngày trên khoảng 60 app.

| Tab | Chức năng |
|---|---|
| Overview | Rating và phân bố sao (SensorTower), bật auto-quét / auto-reply từng app, gán Venture |
| Daily Report | Reply đã gửi (tay/auto) theo 1/7/14/30/60 ngày; KPI ASO: % phủ reply 1–2★, app tụt rating, app < 4,0★; cụm than phiền (VoC) |
| Rủi ro (Risk Inbox) | Gom review ≤3★ thuộc refund/scam/privacy/ad-policy/false-ad của toàn portfolio |
| Review & Reply | Phân Tier A/B/C + ưu tiên P1–P4, AI gợi ý reply đúng ngôn ngữ (3 tone), người duyệt rồi gửi |
| Theo dõi rating | So sao của từng review trước/sau khi reply |
| Vitals | Crash/ANR/cold-start theo version, phát hiện hồi quy, ngưỡng crash 1,09% / ANR 0,47% |
| Store Listing | Sửa title/short/full, ảnh nhiều ngôn ngữ, lưu nháp → đẩy hàng loạt trong 1 edit |

Quy tắc reply và phân loại chi tiết: [trả lời review Google Play](../01-pre-marketing/tra-loi-review-google-play.md).

- **Bước roadmap**: ASO (Pre-Marketing) và theo dõi sau launch (rating/vitals ảnh hưởng CVR và khả năng hiển thị trên Play).
- **Người dùng**: ASO, PO, UA. Phân quyền viewer / editor / admin theo email.
- **Owner**: LinhNXG. Vị trí: `AI Knownledge/APR-013 - ASO Agent - Auto Reply`. Repo `github.com/linhnxg-hash/ASO-Agent` (private).

## Cách chạy
`npm ci` → tạo `.env` từ `.env.production.example` + `.mcp-auth.json` → `npm start` → http://localhost:3000 (có Dockerfile / docker-compose).
Cần: <cần MCP_URL + token store-mcp (dịch vụ trung gian gọi Google Play API)>, <cần OPENROUTER_API_KEY hoặc ANTHROPIC_API_KEY cho gợi ý reply>, <tuỳ chọn SENSORTOWER_AUTH_TOKEN cho rating>. Service account phải được cấp quyền trong Play Console **cho từng app**.

## Giới hạn / rủi ro
- API Play chỉ trả review 7 ngày gần nhất, có nội dung. Không có country.
- Không có API sắp xếp screenshot: đổi thứ tự = xoá và đẩy lại, tốn edit quota/ngày.
- Reply và listing là hành động **công khai, khó rút lại**: tool bắt xác nhận và ghi audit log. Khi demo không bấm "Gửi"/"Đẩy lên store" trên app live.
- Auto-reply chỉ dùng template cố định cho review khen, mặc định TẮT.

## Media
[▶ Video demo ASO Agent: duyệt và gửi reply review, Risk Inbox (180 MB)](../../media/2026-10/2026-10-14-aso-agent-auto-reply-demo-1.mp4)
