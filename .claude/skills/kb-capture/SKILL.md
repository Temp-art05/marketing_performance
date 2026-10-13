---
name: kb-capture
description: Nạp kiến thức vào knowledge base của repo (knowledge/ + assets/screenshots/). Dùng NGAY khi trong lúc làm việc xuất hiện điều đáng giữ lại — bài học rút từ data, số liệu có bối cảnh (CPI/ROAS/eCPM theo GEO, kênh, ngày), bước setup campaign/SDK đã làm đúng hoặc sai, quyết định và lý do, bẫy/lỗi của platform, thông tin app/campaign, screenshot dashboard quan trọng — và khi hook Stop nhắc nạp knowledge. Cũng dùng khi user bảo "nạp/lưu/ghi lại cái này vào knowledge".
---

# kb-capture — nạp knowledge

Mục tiêu: mỗi điều học được trong session thành tài liệu Markdown chuẩn, tìm lại được, có ảnh, có nguồn — rồi commit + push.

## 1. Cái gì đáng nạp

**Nạp:**
- Bài học từ data thật: "campaign X ở GEO Y, sau 7 ngày ROAS D7 = …, nguyên nhân …".
- Số liệu có bối cảnh đủ (app, GEO, kênh, khoảng ngày, nguồn dashboard). Thiếu bối cảnh → ghi rõ là thiếu.
- Bước setup đã làm (campaign, Firebase, AdMob, MMP…): làm thế nào, chỗ nào dễ sai, kết quả.
- Quyết định + lý do + phương án đã loại.
- Bẫy/lỗi/giới hạn của platform, policy, thay đổi UI.
- Thông tin app (package, ad units, mediation, event) và lịch sử campaign của từng app.
- Screenshot làm rõ một cấu hình, một biểu đồ, một lỗi.

**Không nạp:** chat vặt; câu hỏi đã có đáp án trong knowledge (trừ khi có thông tin mới); dữ liệu thô (bảng CSV dài — chỉ tóm tắt insight); **credential** (token, API key, dev key, password, private key) — repo private nên số liệu, tên app, email, ID tài khoản được phép ghi.

## 2. Quy trình

1. **Tìm trùng trước**: đọc `knowledge/INDEX.md` (đã có trong context) và chạy
   `node scripts/kb/cli.mjs search "<từ khoá>"`. Cùng chủ đề → **cập nhật file đó** (thêm mục, sửa nội dung, bump `updated`, thêm `sources`). Chỉ tạo mới khi thật sự là chủ đề khác.
2. **Chọn chỗ** (`node scripts/kb/cli.mjs topics`):
   - kiến thức chung theo chủ đề → `00-overview` … `05-optimization` (có thể có thư mục con, vd `02-ua-channels/google-ads/`)
   - checklist làm lại nhiều lần → `playbooks/`
   - bài học có ngày từ việc thật → `lessons/` (tên file: `YYYY-MM-<slug>.md`)
   - quyết định → `decisions/`
   - riêng 1 app → `apps/<app-slug>/` (`profile.md` là hồ sơ app, `campaigns.md` là nhật ký campaign)
3. **Tạo file mới**: `node scripts/kb/cli.mjs new --topic <topic> --title "<tiêu đề>" --type <type> --summary "<1 câu>" [--app <slug>] [--tags a,b]` rồi Edit nội dung. Hoặc Write trực tiếp theo khung ở mục 3.
4. **Ảnh**: user dán ảnh trong session → `node scripts/kb/cli.mjs images list` để xem số thứ tự, rồi
   `node scripts/kb/cli.mjs images save <n> --slug <mô-tả-ngắn> --doc <topic/file.md>`.
   Ảnh là file trên máy → `images import <file> --slug ... --doc ...`.
   Lệnh in ra đường dẫn: thêm vào field `images` **và** chèn `![mô tả cụ thể](đường-dẫn-tương-đối)` vào đúng đoạn trong bài, kèm 1 câu giải thích ảnh cho thấy gì.
5. **Kiểm tra + commit**: hook tự lint khi ghi file (lỗi sẽ được báo lại — sửa ngay). Xong thì
   `node scripts/kb/cli.mjs commit -m "kb: <mô tả ngắn>"` (tự sinh INDEX, lint, commit, pull --rebase, push).
6. Báo user **1 dòng**: đã nạp/cập nhật file nào.

Nếu rà xong thấy không có gì đáng nạp: `node scripts/kb/cli.mjs skip "<lý do>"`.

## 3. Khung tài liệu

```markdown
---
title: Tiêu đề rõ nghĩa
type: lesson            # overview | concept | playbook | lesson | decision | app-profile | reference
topic: lessons          # = đường dẫn thư mục trong knowledge/, phải khớp
tags: [google-ads, roas]
app: home-morph         # slug app, hoặc general
geo: [US, EU]           # nếu liên quan
status: draft           # draft khi Claude tự nạp; user duyệt → verified; lỗi thời → outdated
confidence: medium      # low | medium | high — mức chắc chắn
sources: ["session 2026-10-14: đọc báo cáo Google Ads 7 ngày", "https://support.google.com/..."]
created: 2026-10-14
updated: 2026-10-14
images: [assets/screenshots/2026-10/2026-10-14-roas-7d-1.png]
related: [playbooks/launch-google-app-campaign.md]   # đường dẫn trong knowledge/
summary: Một câu ≤ 220 ký tự — đây là dòng xuất hiện trong INDEX.
---

# Tiêu đề

## Bối cảnh
App, GEO, kênh, thời gian, nguồn số liệu.

## Nội dung / Diễn biến
...

## Bài học / Kết luận
- ...

## Việc tiếp theo (nếu có)
```

Quy tắc:
- Tên file kebab-case không dấu. Viết tiếng Việt, giữ thuật ngữ tiếng Anh (CPI, ROAS, eCPM…).
- Số liệu luôn kèm nguồn + thời điểm + bối cảnh. Không bịa benchmark; không chắc → `confidence: low` và nói rõ.
- **Mâu thuẫn với knowledge cũ**: không âm thầm ghi đè. Thêm mục "⚠️ Mâu thuẫn" nêu cả hai, nguồn mỗi bên; nếu chắc cái cũ sai → sửa và ghi lại lý do trong bài; nếu cả bài cũ lỗi thời → `status: outdated` + link bài mới trong `related`.
- Không sửa `knowledge/INDEX.md` (sinh tự động).
- Không đổi `status: verified` của bài user đã duyệt thành draft; thêm thông tin mới thì ghi rõ "(bổ sung YYYY-MM-DD, chưa duyệt)".
