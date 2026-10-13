---
title: Trạng thái hiện tại
type: overview
topic: 00-overview
tags: [status]
app: general
status: verified
confidence: medium
sources: ["setup repo 2026-10-14", "session 2026-09-17→18 (als001 def570ce, e3e3ea4c)", "AI Knownledge/ (kho asset Apero, rà 2026-10-14)"]
created: 2026-10-14
updated: 2026-10-14
summary: Ảnh chụp nhanh "đang ở đâu" — app nào đang chạy, campaign nào, vấn đề đang mở. Cập nhật mỗi khi có thay đổi lớn.
---

# Trạng thái hiện tại

> File này được nạp vào mọi session Claude. Giữ ngắn gọn (≤ 40 dòng), chỉ những gì đang diễn ra.

## Apps đang quản lý

- **Home Morph** (`com.homemorph.app`, AI interior design, Android, ads-only) — [profile](../apps/home-morph/profile.md) · [campaigns](../apps/home-morph/campaigns.md)

## Campaign đang chạy

- Home Morph 1 (Google Ads 252-691-1237): ACi, ID+PH+VN, first_open, tCPI ₫2.125, ₫200k/ngày — dựng 18/09/2026, **chưa rõ đã publish**, chưa có số. Ngưỡng scale: D0 ROAS ≥ 25% theo country ([quyết định](../decisions/2026-09-home-morph-geo-ua-ads-only.md)).

## Vấn đề / việc đang mở

- Nạp knowledge ban đầu từ các session cũ (claude-station; als001 đã nạp 2 session 09/2026). 2026-10-14: đã nạp kho AI Knownledge (≈55 bài draft, chủ yếu `06-tools/`) — chờ duyệt.
- 🔑 Credential lấy từ kho AI Knownledge (APR-284 `.env`, APR-155 login chung, APR-099 token) đã lưu ở `media/secrets/` (ngoài git, `kb secret list`) theo yêu cầu user 2026-10-14 — nên vẫn báo owner xoay vòng vì file gốc đang nằm trên hub.
- Xin quyền truy cập APR-261 Ad Copy Skill và APR-252 Analytics Agent (liên quan UA nhưng chưa tải được).
- Home Morph: xác nhận GA4 ↔ Google Ads đã link, bật Impression-level ad revenue, kiểm tra event `generation_completed`/`rewarded_ad_completed`; lấy số 7 ngày đầu.
