---
title: TikTok Creative MCP — AI avatar, AI dubbing, image-to-video cho ads TikTok
type: reference
topic: 06-tools
tags: [tiktok, creative, ai-avatar, dubbing, image-to-video, localization, mcp, tool-noi-bo]
app: general
status: draft
confidence: medium
sources: ["AI Knownledge/APR-195 - Tiktok Gen AI MCP/asset.rar: 01-noi-dung-asset.md, 02-huong-dan-su-dung.md (đọc 2026-10-14)", "AI Knownledge/APR-195 - Tiktok Gen AI MCP/_info.md (đọc 2026-10-14)"]
created: 2026-10-14
updated: 2026-10-14
related: [playbooks/san-xuat-creative-hang-loat-bang-ai.md]
summary: MCP server gọi TikTok Business Creative API (Alpha) bằng câu lệnh tự nhiên — avatar AI đọc script, lồng tiếng 13 ngôn ngữ, ảnh → 1–5 video; submit-then-notify qua Discord DM. Cần API key MCP, URL public, consent.
---

# TikTok Creative MCP (Tiktok Gen AI MCP)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-195 - Tiktok Gen AI MCP/asset.rar` (2 file md + `video_demo/Tiktok_AI_Gen.mp4`).
- Owner: Nguyễn Minh Đức (Data). Đã deploy Cloud Run.
- Bước roadmap: **giai đoạn 1 — creative** và **localize creative** cho GEO mới (dubbing). Đầu ra là video chạy được trên TikTok ads.

## Làm gì
8 tool, 3 chức năng, gọi TikTok Business **Creative API** (tài liệu Alpha — chủ asset ghi đã đối chiếu khớp spec):

| Chức năng | Input chính | Output / hạn link |
|---|---|---|
| **AI Avatar** (`list_avatars`, `submit_avatar_video`, `get_avatar_results`) | `avatar_id` + `script` ≤ 2000 ký tự, không emoji; tuỳ chọn `voice_id`, `voice_speed` (mặc định 1.1x), `voice_volume` 0–10, nền trong suốt | `preview_url` 180 ngày, `srt` 7 ngày; job ~100–500 s |
| **AI Dubbing** (`list_dubbing_voices`, `submit_dubbing`, `get_dubbing_results`) | `video_url` mp4 **public** ≤ 300 s, ≤ 200 MB; `target_language` ∈ ar/en/fr/de/id/it/ja/ko/pt/es/th/tr/vi; `consent_confirmed`; tuỳ chọn lipsync, phụ đề, script dịch tự chỉnh theo timestamp | `preview_url` 180 ngày, `srt` 7 ngày; job tới ~1 giờ |
| **Image-to-Video** (`submit_image_to_video`, `get_image_to_video_results`) | `image_url` JPG/PNG **public**, `consent_confirmed`; `background_prompt` ≤ 2000 (vd Photoshoot, Living room, Golden hour), `animation_prompt` ≤ 200 (vd Product demo, Holding product, Dance), 1–5 video, model GOKU/GEN_4_Turbo | 1 `task_id`/video, `preview_url` 180 ngày; ~1 phút |

Kiến trúc **submit-then-notify**: submit trả `task_id` sau 2–5 s (không timeout), tiến trình nền poll 30 s, xong thì bot Discord DM link video.

## Cách chạy
- **<cần MCP API key — xin owner>**, URL Cloud Run (xin owner), Discord user ID của mình (Settings → Advanced → Developer Mode → Copy User ID) và join server Discord của bot.
- Claude Code: `claude mcp add --transport http tiktok https://<CLOUD-RUN-URL>/mcp --header "x-api-key: <key>" --header "x-discord-id: <discord id>" -s user`. Test: "list 3 tiktok dubbing voices".
- Prompt mẫu (quảng cáo app): chọn avatar trước ("List 8 young female avatars, region eastern_asia… cho tôi link ảnh + avatar_id, đừng gen vội"), sau đó gen với `avatar_id` đã chọn và script ~45 s; dubbing clip promo sang tiếng Nhật bật phụ đề; biến key visual/screenshot app thành 2 video "Product demo".

## Giới hạn / rủi ro
- File phải là **URL HTTP(S) public** (S3/R2/GCS/Cloudinary…) — link local, Google Drive, Dropbox đều fail.
- **Consent gate bắt buộc** (TikTok Developer Terms): dubbing cần đủ quyền với video và người trong video, ≥ 18 tuổi, không ở Illinois/Texas; image-to-video cần quyền với ảnh. Vi phạm → có thể bị treo access.
- Hình avatar do `avatar_id` quyết định; tag lọc do TikTok gán đôi khi sai, preview avatar chỉ sống 6 giờ; tag `race` không lọc được (dùng `region`).
- Job lưu in-memory: redeploy giữa chừng mất DM (video vẫn xong, tự check bằng `get_*_results`).
- Job FAILED "content violates guidelines" → script/video vi phạm policy TikTok.
- API đang Alpha — có thể thay đổi; quyền truy cập do tài khoản TikTok Business của owner.

## Media
[▶ Demo gọi TikTok Creative MCP từ Claude để gen video (5 MB)](../../media/2026-10/2026-10-14-tiktok-creative-mcp-demo-1.mp4)
