---
title: PO Copilot — bộ 6 skill đưa ý tưởng feature thành discovery brief, PRD, use case, US/AC, SRS và prototype hi-fi
type: reference
topic: 06-tools
tags: [tool, claude-skill, product-owner, prd, use-case, user-story, acceptance-criteria, srs, prototype, discovery]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-229 - PO Copilot/README.md (đọc 2026-10-14)
  - AI Knownledge/APR-229 - PO Copilot/_info.md (đọc 2026-10-14)
  - AI Knownledge/APR-229 - PO Copilot/CongHT - PO Skill Set.zip → po-doc-pipeline, ask-why-ba, prd-writer, use-case-writer, user-story-ac-writer, srs-to-prototype (SKILL.md + references/assets/templates) (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 06-tools/viet-prd-agent-apero.md
  - 04-measurement/prd-success-metrics-va-yeu-cau-ua.md
  - 04-measurement/firebase-events-cho-ua.md
  - 01-pre-marketing/market-research-tam-sam-som-go-no-go.md
  - 06-tools/tong-quan-cong-cu-ai-marketing.md
summary: Bộ 6 Claude skill của Công Hồ Thành (APR-229) — orchestrator po-doc-pipeline chạy discovery → PRD → use case → US/AC → SRS → prototype HTML hi-fi, dừng duyệt sau mỗi chặng; srs-writer phải cài riêng.
---

# PO Copilot (PO Document Skill Set)

## Làm gì
Bộ 6 skill giúp PO/BA đi từ ý tưởng thô tới bộ tài liệu và prototype để bàn giao cho Dev và UI/UX:

| Skill | Làm gì | Output |
|---|---|---|
| `ask-why-ba` | Discovery/elicitation: phân loại intent (cảnh báo **Solution Bias** khi user nói thẳng giải pháp), rà 5 tầng requirement BABOK, hỏi "why" tối đa 3–5 câu mỗi lượt, quét edge case | Discovery brief (problem, goal, persona, FR list, risk, assumption, open question) |
| `prd-writer` | PRD **mức product** ("cái gì & tại sao"): problem, goals/non-goals, **KPI có baseline + target + deadline**, persona, scope, feature list MoSCoW, detail từng feature | PRD Markdown, có Revision History |
| `use-case-writer` | Use case 13 field (Wiegers/IIBA, Cockburn coffee-break test), normal/alternative/exception course, checklist 20 điểm | UC tiếng Anh, bảng 2 cột |
| `user-story-ac-writer` | User story theo INVEST + AC Given/When/Then (Gherkin) | US + AC |
| `srs-to-prototype` | SRS (có FR-XX + AC) + file design system → prototype HTML mobile hi-fi, gắn banner "Prototype — not final design", đúng contract để import Figma qua Anima | `prototype.html` |
| `po-doc-pipeline` | Orchestrator: hỏi entry point (đã có brief/PRD/SRS chưa), chạy tuần tự, **checkpoint CP1–CP6** chờ user duyệt sau mỗi chặng, lưu state `output/<feature>/01-discovery-brief.md` … `06-prototype.html` | Cả bộ tài liệu |

Chuỗi: `ask-why-ba → prd-writer → use-case-writer → user-story-ac-writer → srs-writer → srs-to-prototype`.

Theo `_info.md`, bộ skill cho kết quả tốt nhất khi kèm **file SOT (Source of Truth)** của dự án: Claude đối chiếu logic feature mới với logic các version cũ để phát hiện xung đột.

## Dùng ở bước nào
- **Trước khi build feature mới** cho app đang chạy UA (vd Home Morph thêm feature sinh ảnh mới, thay đổi paywall/rewarded flow). Đây là lúc nên chốt luôn KPI và event tracking mà UA cần đọc sau launch.
- `prd-writer` bắt mục **Success metrics / KPIs** có baseline, target, deadline. Marketing nên chen vào bước này để KPI có cả chỉ số ảnh hưởng UA (retention D1/D7, số `ad_impression`/user, event conversion dùng cho tCPA). Skill **không có** section analytics events riêng, nên event tracking phải bổ sung thủ công hoặc dùng `po-metrics-analysis` của [APR-026](viet-prd-agent-apero.md).
- `ask-why-ba` dùng được cả cho yêu cầu phía marketing (vd "cần dashboard ROAS theo country"): ép hỏi KPI, baseline, tầng requirement trước khi làm. Câu hỏi mẫu trong `references/question-library.json` thiên về app subscription (trial-to-paid, ARPU).
- Khung so sánh: [Hậu kiểm version app](../05-optimization/hau-kiem-version-app-nguong-verdict.md) là bước đo sau release; bộ skill này là bước viết trước release.

## Cách gọi trong repo này
Skill cài ở `.claude/skills/<tên>/`: `po-doc-pipeline`, `ask-why-ba`, `prd-writer`, `use-case-writer`, `user-story-ac-writer`, `srs-to-prototype`. Skill tự kích hoạt theo câu nói, hoặc gọi tên:
- "Discovery giúp mình feature X" → `ask-why-ba`
- "Viết PRD cho feature này" → `prd-writer`
- "Viết use case / user story + AC cho …" → `use-case-writer` / `user-story-ac-writer`
- "Dựng prototype hi-fi từ SRS này, DS ở file kèm" → `srs-to-prototype`
- "Chạy full pipeline PO document từ ý tưởng này: …" → `po-doc-pipeline`

Phân biệt với [APR-026](viet-prd-agent-apero.md): `prd-writer` ở đây là PRD ngắn mức product. PRD hand-off 17 section (có FR/TC/AC, §11 Analytics Events) dùng `po-prd-writer`.

## Giới hạn / yêu cầu
- **Thiếu `srs-writer`**: pipeline gọi `srs-writer` ở chặng 5 nhưng skill này *không có trong bộ* ("skill có sẵn của team"). Chưa cài thì pipeline dừng ở US/AC. `srs-to-prototype` từ chối chạy nếu SRS thiếu FR-XX + AC.
- `srs-to-prototype` cần **file design system** (token màu/font/radius/spacing/component), thiếu thì prototype sai màu. Output là scaffold, không phải bản thiết kế cuối.
- Mọi skill chạy **tuần tự có dừng hỏi** (từng section, từng feature, từng chặng). Không hợp để sinh nhanh một lèo.
- `use-case-writer` luôn viết UC bằng tiếng Anh. Các skill còn lại viết theo ngôn ngữ chat.
- Pipeline lưu file vào `output/<feature>/` ở thư mục làm việc. Trong repo này nên chỉ định `exports/` (đã gitignore) để không lẫn vào `knowledge/`.
- README viết cho claude.ai (upload zip, bật Code execution). Với Claude Code chỉ cần copy folder vào `.claude/skills/`.

## Nguồn / owner
- **Owner:** Công Hồ Thành (Product — PO). v1.0, MIT. Hub: knowledgehub.aperogroup.ai/library/239.
- **Vị trí:** `AI Knownledge/APR-229 - PO Copilot/` (`CongHT - PO Skill Set.zip`, `README.md`).
