---
name: prd-to-visual
description: "Biến file PRD/SRS (Markdown, .docx) thành wireframe HTML (mockup app) và diagram luồng xử lý (SVG) trực quan cho Dev/Design/QA. Trigger khi user upload 1 file PRD/SRS và muốn hình ảnh hóa, hoặc nói 'PRD ra wireframe', 'visual hóa PRD', 'vẽ wireframe từ tài liệu', 'diagram từ SRS', 'PRD to visual'. LUÔN chấm điểm chất lượng PRD trước (% FR có AC) rồi VẪN dựng best-effort — thiếu AC chỉ hạ điểm + góp ý, KHÔNG chặn; chỉ khi 0 FR mới dừng và gợi ý po-prd-writer. Output BẮT BUỘC bám đúng 2 mẫu gold trong assets/ — mockup iPhone theo Frost cho wireframe, flowchart SVG theo palette Anthropic cho diagram. KHÔNG tự chế style khác."
---

<!-- Nguồn: AI Knownledge APR-102 PRD → Visual, owner Anh Trần Thế, nhập 2026-10-14. Output → exports/po/<app>/ -->

# PRD → Visual

> **Mô hình.** INPUT (file PRD/SRS: .md / .docx) → **[đọc → VALIDATE (cổng vào) → render wireframe → render diagram → COVERAGE (cổng ra)]** → OUTPUT (wireframe.html + logic-diagram.html).
>
> **Bản chất là transform, không sáng tạo.** Tool parse yêu cầu đã có rồi render thành hình theo **mẫu chuẩn cố định**. Nhờ vậy "đúng/sai" kiểm được bằng máy (mọi FR có mặt trên output) và "đẹp/xấu" cũng cố định (bám 2 file gold). Đổi INPUT trong cùng scope "PRD mobile app" → cùng cấu trúc output → Adaptability verify bằng `scripts/validate_coverage.py`.

---

## 0. Thứ tự chạy — HAI BƯỚC

```
BƯỚC 1 — VALIDATE (cổng vào)
  1. Đọc doc (.md đọc thẳng · .docx dùng textutil/pandoc)
  2. Chạy scripts/validate_coverage.py --prd prd.md
     ├─ FAIL → KHÔNG VẼ. Gọi skill po-prd-writer sinh bản GÓP Ý
     │         (PRD còn thiếu FR/AC gì) trả cho user. Dừng, chờ user bổ sung/upload lại.
     └─ có ≥1 FR → LUÔN sang BƯỚC 2 (điểm thấp chỉ hạ chất lượng, không chặn).
        chỉ 0 FR mới dừng + góp ý.

BƯỚC 2 — RENDER (best-effort, luôn chạy khi có FR)
  3. wireframe.html      ← bám assets/wireframe-template.html (Frost · mockup iPhone)
  4. logic-diagram.html  ← bám assets/diagram-template.html  (Anthropic · flowchart SVG)
  5. Chạy validate_coverage.py với cả 2 file → COVERAGE. Báo N/N FR + điểm.
```

Output ghi vào `exports/po/<prd-name>/`.

---

## 1. Đọc doc

| Input | Cách đọc |
|---|---|
| `.md` / `.txt` | đọc thẳng bằng Read tool |
| `.docx` | `textutil -convert txt "file.docx" -stdout` (macOS) hoặc `pandoc -t markdown` |

Lưu bản chuẩn hóa ra `exports/po/<prd-name>/prd.md` để §2 và script làm việc. Chỉ chuẩn hóa cái đã có (heading `### FR-xx` + AC Given/When/Then), **không tự bịa thêm yêu cầu**.

---

## 2. BƯỚC 1 — CHẤM ĐIỂM (không chặn) + góp ý

Chạy `python3 scripts/validate_coverage.py --prd exports/po/<prd-name>/prd.md` để lấy số. **Đây là bước CHẤM ĐIỂM chất lượng PRD, KHÔNG phải cổng chặn.**

```
Điểm chất lượng = số FR có AC / tổng FR  (vd 8 FR, 4 có AC → 50%).
```

- **Có ≥ 1 FR → LUÔN DỰNG** (best-effort), dù điểm thấp. FR nào thiếu AC vẫn vẽ màn chính/node cơ bản; chỉ là ít state hơn. Kèm **thẻ điểm + góp ý** (FR nào nên bổ sung Given/When/Then để lên điểm). Không bắt user sửa mới cho dựng.
- **0 FR (không có heading/row FR nào)** → không có gì để vẽ. Lúc này mới dừng, trả góp ý và gợi ý dùng **po-prd-writer** sinh PRD chuẩn.

Vì sao không chặn: user upload gì cũng phải thấy kết quả ngay; điểm thấp là tín hiệu cải thiện, không phải rào cản. Ghép đôi vẫn còn giá trị: **po-prd-writer** giúp nâng điểm PRD → **prd-to-visual** dựng ra bản đầy đủ state hơn.

---

## 3. BƯỚC 2 — WIREFRAME `wireframe.html` (bám mẫu gold)

**BẮT BUỘC copy `assets/wireframe-template.html` làm khung và giữ nguyên toàn bộ design system trong đó.** Đây là mẫu chuẩn — KHÔNG tự chế palette/layout khác. Đặc điểm phải giữ:

- **Frost tokens** y nguyên: brand `#3B6CF5`, review `#7C3AED`, reward gradient, success/error, font **Space Grotesk + Figtree + Fira Code** (giữ link Google Fonts trong `<head>`).
- **Doc chrome**: nút toggle dark (◐, localStorage), header (`.eyebrow` mono + `h1.doc` + `.lead` + `.scope`), mỗi feature là một `<section>` với `.sec-head` (số + h2) + `.sec-intro`.
- **Màn hình = mockup iPhone thật**: dùng `.phone` (300×600, dynamic `.island`, `.status` 9:41, `.body-scroll`, `.tabbar`). Xếp các màn của một luồng thành `.row` gallery, nối bằng `<div class="arrow">→</div>`, mỗi màn có `.caption` (tiêu đề đậm + mô tả) và `.annot` khi cần chú thích.
- **Dùng đúng thư viện component có sẵn**: `.card` `.btn`(pri/out/ghost/suc/rev/dis) `.pill` `.chip`(sel/bad) `.opt`(sel/ok/no) `.feed`(suc/err/hint) `.audio` `.mic` `.wave` `.pbar` `.ring`. Không tự tạo class lạ.
- **Vẽ đủ các state của mỗi FR**: màn chính + state đúng (success) + state sai/lỗi (error) + màn hoàn thành. State lỗi dùng `.feed.f-err` / `.opt.no` / viền error.
- Kết thúc bằng `.legend` map màu.

**Gắn FR-id để kiểm coverage:** mỗi `<section>` (hoặc mỗi màn `.phone`) chèn comment `<!-- FR-01 -->` tương ứng FR nó thể hiện. Ví dụ:

```html
<section><!-- FR-01 -->
  <div class="sec-head"><span class="num">01</span><h2>Đăng nhập</h2></div>
  <p class="sec-intro">...</p>
  <div class="row"> ...các .phone screen... </div>
</section>
```

> So sánh với `references/gold-wireframe.html` (bản gold đầy đủ) trước khi ship. Nếu output nhìn khác mẫu gold → sửa lại cho khớp.

---

## 4. BƯỚC 2 — DIAGRAM `logic-diagram.html` (bám mẫu gold)

**BẮT BUỘC copy `assets/diagram-template.html` làm khung và giữ nguyên design system.** KHÔNG dùng Mermaid — vẽ **flowchart bằng SVG tự tay** như mẫu. Đặc điểm phải giữ:

- **Palette Anthropic** y nguyên: ivory `#FAF9F5`, clay `#D97757`, olive `#788C5D`, violet `#8466A8`, blue `#3E7CA8`, rust `#B04A3F`; heading **serif** (`ui-serif`), body sans, label mono. Toggle dark (localStorage).
- **Header + summary strip** (3 cell tóm tắt) + các `<section>` đánh số.
- **Mỗi feature/FR = một `.canvas` chứa `<svg class="flow">`**: khai báo `<defs>` markers (`ar`, `ar-olive`, `ar-rust`, `ar-clay`); node dùng class `.node.box/.term/.hub/.gate/.llm/...`; edge dùng `.edge` + `.edge.yes` (olive) / `.edge.no` (rust, dashed) / `.edge.loop` (clay, dashed). Có `.legend` + `.caption` dưới mỗi canvas.
- Kèm bảng `.tbl-wrap`, JSON `<pre>` (span `.k/.s/.c`), `.note`/`.note.warn`, `.step-list` khi cần diễn giải — như mẫu.

**BẮT BUỘC:** mọi decision và mọi error/fallback state trong AC ("Then …" tiêu cực) phải là một node; **nhãn node hoặc section gắn FR-id** để kiểm coverage:

```html
<section><!-- FR-01 -->
  <div class="sec-head"><span class="num">01</span><h2>Đăng nhập</h2></div>
  <div class="canvas"><svg class="flow" viewBox="0 0 900 300"> ...nodes/edges... </svg>
    <p class="caption">FR-01 · luồng đăng nhập; nhánh sai mật khẩu → error state.</p></div>
</section>
```

> So sánh với `references/gold-diagram.html` trước khi ship. Khác mẫu → sửa cho khớp.

---

## 5. COVERAGE GATE (cổng ra)

```bash
python3 scripts/validate_coverage.py \
  --prd exports/po/<prd-name>/prd.md \
  --wireframe exports/po/<prd-name>/wireframe.html \
  --diagram exports/po/<prd-name>/logic-diagram.html
```

| Check | Ý nghĩa |
|---|---|
| MISSING | FR có trong PRD nhưng thiếu trên wireframe/diagram → bổ sung |
| ORPHAN | Màn hình/node không truy về FR nào → tool bịa, phải bỏ |

- **PASS (exit 0)** → present 2 file.
- **FAIL (exit 1)** → sửa cho khớp rồi chạy lại. Không present khi chưa PASS.

**Vì sao chịu được lỗi LLM:** coverage gate so tập FR-id giữa input↔output → bắt cả thiếu (quên vẽ) lẫn thừa (bịa màn hình) bằng máy. "Đúng" theo coverage, "đẹp" theo 2 mẫu gold → cả hai đều cố định, không phụ thuộc LLM bịa.

---

## 6. Nguyên tắc vàng — ĐỪNG GEN LINH TINH

1. **Luôn validate trước khi vẽ.** Input thiếu → po-prd-writer góp ý, KHÔNG vẽ đại.
2. **Output phải giống 2 file gold** trong `assets/` (và `references/`): wireframe = Frost + mockup iPhone; diagram = Anthropic + SVG flow. Không tự chế palette, font, layout, class name khác.
3. **Mỗi FR phải xuất hiện** trên cả wireframe và diagram, gắn `<!-- FR-xx -->`. Không thêm màn hình/node không có FR nguồn.
4. Chỉ present khi COVERAGE GATE = PASS.

Scope = "PRD/SRS của feature mobile app". Đổi PRD trong scope → cùng bộ output, cùng style gold, kiểm bằng cùng script.
