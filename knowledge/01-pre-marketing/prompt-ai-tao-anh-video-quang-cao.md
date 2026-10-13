---
title: Viết prompt AI tạo ảnh/video quảng cáo — GPT Image 2, Nano Banana, Seedance, Kling, Veo và khung tái tạo concept từ ảnh reference
type: reference
topic: 01-pre-marketing
tags: [creative, ai-image, ai-video, prompt, gpt-image-2, nano-banana, seedance, kling, veo, ugc]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-015 - Visual prompting/image - skill/SKILL.md + references/models.md, gpt-image.md, nano-banana.md, golden-rules.md, patterns/ui-social.md (đọc 2026-10-14)
  - AI Knownledge/APR-015 - Visual prompting/video - skill/SKILL.md + references/universal-rules.md, patterns-and-genres.md, seedance.md, kling.md, veo.md (đọc 2026-10-14)
  - AI Knownledge/APR-146 - Khung mẫu tạo prompt ảnh chính xác/Khung tạo prompt ảnh.txt, _info.md (owner Hiếu Hoàng Minh) (đọc 2026-10-14)
  - AI Knownledge/APR-114 - XPrompt/Docs/huong-dan-su-dung.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/creative-assets-google-app-campaigns.md
  - 06-tools/visual-prompting-skill-anh-video.md
  - 01-pre-marketing/thiet-ke-screenshot-store-quality-bar.md
  - 06-tools/xprompt.md
  - 06-tools/genius-easy-creative.md
  - 06-tools/hanh-creative-google-flow-nhan-vat-nhat-quan.md
  - 06-tools/ka-tool-bulk-google-flow.md
  - 01-pre-marketing/policy-loi-thuong-gap-va-cach-fix.md
  - playbooks/san-xuat-creative-hang-loat-bang-ai.md
summary: Chọn model và cấu trúc prompt ảnh (GPT Image 2 5-slot, Nano Banana văn xuôi) và video (skeleton, quy tắc 3 chi tiết, clip 5s), khung tái tạo concept từ ảnh ref (APR-146), template story ad và screenshot.
---

# Viết prompt AI tạo ảnh/video quảng cáo

## Bối cảnh

Rút gọn từ skill **Visual Prompting** (APR-015, owner linhntt4, 07/2026; reference gốc phần lớn bằng tiếng Nga/Anh, có vẻ chuyển thể từ một skill cộng đồng). Đây là hướng dẫn kỹ thuật viết prompt, **không phải** spec asset của kênh. Kích thước và số lượng asset cho Google App campaigns xem [creative assets](creative-assets-google-app-campaigns.md). Giá model chỉ là ước lượng trong tài liệu (07/2026), cần kiểm tra lại trước khi lập ngân sách.

## 1. Chọn model ảnh

| Việc | Model gợi ý |
|---|---|
| UI mockup, screenshot store, chữ nhỏ/dày, poster có **chữ chính xác** | **GPT Image 2** (`quality: high`) |
| Edit giữ nguyên mặt/dáng (đổi nền, đồ, thời tiết) | GPT Image 2 (logic Change/Preserve) |
| Địa danh/vật thể có thật (tra ảnh thật trước khi vẽ) | Nano Banana 2 (image grounding) |
| Tỷ lệ cực đoan 1:4, 4:1, 1:8 (banner, strip) | Nano Banana (GPT Image 2 tối đa 3:1) |
| Sinh hàng loạt giá rẻ để thăm dò ý tưởng | Nano Banana 2 (~$0,04/ảnh) hoặc gpt-image-1-mini |
| Nhiều ảnh tham chiếu | Nano Banana Pro (≤14) / GPT Image 2 (≤16), đánh số và ghi vai trò từng ảnh |

Tiết kiệm chi phí: chạy thăm dò ở chất lượng thấp (NB 0.5K / GPT `quality: low`), chọn ra bản tốt rồi mới render lại ở chất lượng cao.

## 2. Cấu trúc prompt ảnh

**GPT Image 2: 5 slot có nhãn.** Slot cuối là nơi prompt dở thường hỏng:
```
Scene: bối cảnh, thời điểm, nền
Subject: chủ thể chính
Important Details: chất liệu, ánh sáng, góc máy, bố cục, mood
Use Case: Instagram story ad / app store screenshot / poster...
Constraints: không watermark, không chữ thừa, giữ nguyên mặt...
```
- **Anti-slop**: không viết "stunning, epic, masterpiece", không gán nhãn style kiểu "luxury minimal". Thay bằng sự thật thị giác cụ thể (màu hex, chất liệu, "50mm feel").
- Chữ trong ảnh: để trong `"..."`, ghi rõ font, cỡ, vị trí và thêm "no extra words, no duplicate text".
- Kích thước: hai cạnh là bội số của 16, tỷ lệ ≤ 3:1, mốc ổn định 2560×1440. Hay dùng: 1024×1536, 1536×1024, 1024×1024.
- Edit: mỗi lần chỉ đổi **một** thứ. **Lặp lại danh sách Preserve** ở mọi lượt, nếu không ảnh sẽ trôi dần.

**Nano Banana: văn xuôi 1–2 đoạn** theo thứ tự Subject → Action → Location → Composition → Style. **Không** ghi số ống kính (50mm, f/2.8 bị bỏ qua), mô tả bằng chữ ("shallow depth of field"). Scene có từ 5 phần tử trở lên thì dùng JSON.

**Quy tắc chung**: mở đầu bằng động từ (Create/Generate/Edit); diễn đạt khẳng định ("empty street" thay vì "no cars"); có ngữ cảnh ("for a children's educational app"); ảnh đúng khoảng 80% thì sửa tiếp, đừng gen lại từ đầu; không so sánh kiểu "như quảng cáo Apple" mà mô tả thuộc tính thị giác.

## 3. Template hay dùng cho UA

- **Story ad 9:16**: gradient 2 màu hex, sản phẩm ở 2/3 trên, headline ở 1/3 trên, chừa **15% dưới cùng làm vùng CTA**, không đặt chữ trong **5% dưới cùng** (bị UI hệ thống che), tối đa 3 phần tử trang trí. GPT Image 2 `quality: high`.
- **Feed post 1:1**: tối đa 2 cỡ chữ, chữ đọc được ở bề ngang 320 px, palette giới hạn, contrast ≥ WCAG AA.
- **App store screenshot**: 1 thiết bị có bezel thật, UI thật bên trong, headline không đè lên máy, nền chỉ gradient. Quy tắc thiết kế chi tiết xem [thiết kế screenshot store](thiet-ke-screenshot-store-quality-bar.md).

## 4. Prompt video

**Khung chung (mọi model)**: Subject → Action → Scene → Camera/lens → Lighting → Style/palette → Sound → Duration/ratio/resolution → Continuity → Negative (nếu model hỗ trợ). Prompt video tốt nhất **viết bằng tiếng Anh**.

- **Quy tắc 3 chi tiết cho mỗi shot**: 1 yếu tố môi trường (hơi nước, đèn nhấp nháy, mặt đường ướt), 1 vi chuyển động cơ thể (siết tay, nuốt khan), 1 điểm neo âm thanh hoặc motif hình ảnh. Shot thiếu cả 3 thì là shot thừa.
- Từ không render được, nên bỏ: "cinematic", "high quality", "epic", "he is sad". Thay bằng hành động vật lý thể hiện cảm xúc.
- Mỗi shot **một chuyển động camera chính**. Không viết mâu thuẫn trong cùng prompt.
- **Video dài = ghép nhiều clip khoảng 5 giây** (15s = 3 clip, 30s = 6 clip). Model không nhớ giữa các lần gen, nên **mỗi clip phải lặp lại khối nhận diện**: nhân vật, trang phục, địa điểm, style, ngôn ngữ camera.
- **UGC/social**: handheld, ánh sáng tự nhiên, 9:16, nói thẳng vào camera, nhịp nhanh, đọc được ở thumbnail.

| Model | Điểm mạnh / thông số (theo tài liệu, 07/2026) |
|---|---|
| **Seedance** (ByteDance) | Nhiều shot trong 1 clip 5–10s (API tới 12s), 1080p, tỷ lệ 16:9 → 9:21. Hợp montage quảng cáo nhịp nhanh |
| **Kling 3.0** | Tới 15s, multi-shot (≤6 shot), audio + lip-sync, giữ nhân vật tốt bằng nhãn `[Character A: ...]`. Bản 2.6 Pro rẻ hơn cho series clip social |
| **Veo** (Google) | Clip 4/6/8s, thoại đồng bộ ≤8s mỗi clip, SFX, hỗ trợ prompt JSON. Hợp quảng cáo có voice-over |

## 5. Tái tạo concept từ ảnh reference (khung APR-146 + XPrompt)

> Gộp 2026-10-14 từ tài liệu ứng viên "khung prompt ảnh bám sát ảnh ref" (APR-146, owner Hiếu Hoàng Minh; đối tượng Marketing Performance, ASO, Graphic Designer). Chưa có số đo hiệu quả — độ tin thấp.

Tình huống: có 1 ảnh ref (concept đang chạy tốt trên TikTok/ads đối thủ, hoặc ảnh mẫu designer) và muốn sinh ảnh mới **cùng concept** cho creative/screenshot. Đưa ảnh ref + khung dưới cho GPT/Gemini để nó viết prompt:

1. **Tên concept** — tự đặt để gọi lại.
2. **Nhân vật** — chỉ mô tả cái chuyển được sang người khác: biểu cảm, tư thế, hành động, trang phục/phụ kiện. **Không** mô tả tóc, tuổi, quốc tịch, giới tính (để model không bị kéo về mặt người trong ảnh ref khi dùng ảnh nhân vật riêng / template đổi mặt).
3. **Bối cảnh** — background, **ánh sáng**, các element.
4. **Kỹ thuật camera** — góc máy, cỡ cảnh (+ tiêu cự), khẩu độ (tuỳ chọn).
5. Output viết liền **không xuống dòng** để dán thẳng vào ô prompt.

Nguyên tắc tách vai (XPrompt, APR-114): ảnh **Reference** cho concept (bố cục, tư thế, ánh sáng, màu, phong cách) — không lấy mặt; ảnh **Input** cho danh tính cần giữ. Muốn tự động vòng "phân tích → viết prompt → sinh → chấm điểm → sửa" thì dùng [XPrompt](../06-tools/xprompt.md). Sinh hàng loạt giữ nhân vật trên Google Flow: [Hạnh Creative](../06-tools/hanh-creative-google-flow-nhan-vat-nhat-quan.md); áp cùng template lên lô ảnh: [KA Tool Bulk](../06-tools/ka-tool-bulk-google-flow.md).

[▶ Video demo + hướng dẫn dùng khung prompt ảnh ref (10 MB)](../../media/2026-10/2026-10-14-khung-prompt-anh-ref-demo-1.mp4)

**⚠️ Khác biệt nhỏ giữa hai nguồn nội bộ — số tiêu cự**: khung APR-146 yêu cầu ghi "số tiêu cự cụ thể" (vd 50mm); skill APR-015 nói Nano Banana **bỏ qua** số ống kính và nên tả bằng chữ ("shallow depth of field"), còn GPT Image 2 hiểu kiểu "50mm feel". Cả hai đều là kinh nghiệm, không có tài liệu chính thức của model. Cách dung hoà: tả hiệu ứng bằng chữ, có thể thêm số tiêu cự như gợi ý phụ; với Nano Banana đừng dựa vào con số.

## Lưu ý rủi ro

- Ảnh/video AI dùng cho ad vẫn phải **đúng với trải nghiệm thật của app**. Creative hứa tính năng app không có sẽ sinh review "false advertising" và có rủi ro policy (xem [trả lời review Google Play](tra-loi-review-google-play.md)).
- Không dùng tên/khuôn mặt người nổi tiếng hay nhân vật có bản quyền (genre anchor "Studio Ghibli style" chỉ là hướng thẩm mỹ, không áp vào creative thương mại khi chưa có Legal duyệt).
- Concept lấy từ ảnh đối thủ chỉ dùng làm **cảm hứng bố cục/ánh sáng**; không tái tạo style/nhân vật có bản quyền (Ghibli, nhân vật phim…) — đã có case Apple 4.1 Copycats và Google Impersonation, xem [lỗi policy thường gặp](policy-loi-thuong-gap-va-cach-fix.md).
