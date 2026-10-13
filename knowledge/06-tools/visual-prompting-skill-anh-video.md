---
title: Visual Prompting — skill viết prompt ảnh (Nano Banana, GPT Image 2) và video (Seedance, Kling, Veo)
type: reference
topic: 06-tools
tags: [tool, skill, creative, ai-image, ai-video, prompt]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-015 - Visual prompting/image - skill/SKILL.md, video - skill/SKILL.md, _info.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md
  - 01-pre-marketing/creative-assets-google-app-campaigns.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
summary: Hai Claude skill (image, video) đọc tài liệu kỹ thuật từng model rồi xuất prompt hoàn chỉnh kèm model/quality/size — dùng cho ảnh quảng cáo, thumbnail, storyboard, cảnh video từ ý tưởng thô.
---

# Visual Prompting (skill image + video)

## Làm gì
Biến ý tưởng thô thành prompt sẵn dùng. Skill **không tự gen ảnh/video**, chỉ xuất prompt kèm thông số.
- **image**: chọn Nano Banana 2/Pro hoặc GPT Image 2 → đọc file model → golden rules → pattern theo ngành (e-commerce, food, fashion, UI & social, character, poster, multi-panel). Output: `Model / Quality / Size / Prompt / Notes`; edit thì thêm `Change / Preserve / Constraints`.
- **video**: đóng vai đạo diễn + biên kịch + dựng. Đọc bắt buộc dramaturgy → universal rules → 1 file model (Seedance / Kling / Veo). Output dạng A (1 prompt), B (nhiều clip), C (storyboard), D (audit prompt có sẵn), E (director treatment), F (JSON cho Veo).
- **Bước roadmap**: Pre-Marketing → creative (ảnh/video cho App campaign, story ad, screenshot store, thumbnail).
- **Owner**: linhntt4. Vị trí: `AI Knownledge/APR-015 - Visual prompting`.

Tóm tắt kiến thức prompt rút từ skill: [prompt AI tạo ảnh/video quảng cáo](../01-pre-marketing/prompt-ai-tao-anh-video-quang-cao.md).

## Cài đặt
Copy thư mục `image - skill/` và `video - skill/` vào `~/.claude/skills/` (đổi tên thành `image`, `video`). Không cần API key vì skill chỉ viết prompt. Model gen ảnh/video dùng tài khoản riêng.

## Giới hạn / lưu ý
- Reference viết phần lớn bằng **tiếng Nga** (trigger cũng có tiếng Nga); Claude vẫn đọc được nhưng người đọc tay khó dùng.
- Các file `README.md`, `CAPABILITIES.md`, `DEMO_OUTPUT.md`, `HUONG-DAN-SU-DUNG.md` trong thư mục APR-015 thực ra là tài liệu của **DataCr3wl** (đặt nhầm), không mô tả skill này.
- Giá model và thông số (duration, kích thước) có thể đã đổi sau 07/2026. Kiểm tra lại trên trang model.
- `Output Demo.docx` (7 MB) có ví dụ output; chưa trích vào KB.
