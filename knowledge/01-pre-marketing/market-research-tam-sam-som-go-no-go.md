---
title: Nghiên cứu thị trường cho app mới — TAM/SAM/SOM, tín hiệu nhu cầu và chấm điểm Go/No-Go
type: playbook
topic: 01-pre-marketing
tags: [market-research, sensortower, tam-sam-som, competitor, go-no-go]
app: general
status: draft
confidence: medium
sources:
  - "AI Knownledge/APR-017 - Create Beautful Slide From Research Market result/market-research.zip → SKILL.md, references/sizing-frameworks.md, scoring-rubric.md, data-sources.md (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 00-overview/roadmap.md
  - 05-optimization/unit-economics-ads-only-theo-tier.md
  - 06-tools/market-research-skill-va-research-deck.md
  - 06-tools/datacr3wl-va-mdnow-cao-du-lieu-research.md
summary: Quy trình 7 bước đánh giá thị trường trước khi làm app — sizing top-down và bottom-up (SensorTower), why-now, persona/beachhead, benchmark CPI/retention, rubric 6 tiêu chí có trọng số ra GO/PIVOT/NO-GO.
---

# Nghiên cứu thị trường cho app mới

## Bối cảnh

Phương pháp lấy từ skill `market-research` trong asset APR-017 (owner Đức Nguyễn Đình, 06/2026). Pipeline: `market-research → competitor-research → research-deck`. Nguồn số liệu chính là **SensorTower** (qua MCP); web (Statista, Grand View, data.ai) chỉ dùng cho bối cảnh vĩ mô. Bài này mô tả phương pháp, không chứa benchmark.

## Quy trình 7 bước

1. **Sizing TAM/SAM/SOM bằng cả hai hướng rồi đối chiếu.**
   - Top-down: quy mô ngành từ report + CAGR. SAM = TAM × % khu vực × % nền tảng × % phân khúc. SOM = SAM × thị phần khả thi (thường 1–10% năm đầu).
   - Bottom-up (ưu tiên): lấy top app cùng category ở khu vực mục tiêu, cộng ước lượng download/doanh thu (`get_sales_estimates`).
   - Hai hướng lệch nhiều thì trình bày dạng **khoảng** và nêu giả định gây lệch. Ghi năm cơ sở và quy về cùng đơn vị.
2. **Tín hiệu nhu cầu + "why now"**: volume/độ nóng keyword (`research_keyword`, `get_trending_searches`), lịch sử thứ hạng category (`get_category_ranking_history`), lực đẩy vĩ mô. Chốt 3–5 lý do.
3. **Persona + beachhead**: demographics của top app cùng loại (`get_demographics`), viết Jobs-to-be-Done và pain point, chọn phân khúc đánh đầu tiên.
4. **Validate vấn đề**: review 1–2★ của app hiện có (pain thật), Reddit/forum.
5. **Benchmark category**: monetization (free/paid/sub, IAP phổ biến: `get_top_iap`), retention và active users (`get_retention`, `get_active_users`), CPI theo khu vực (Meta Ads `ads_insights_industry_benchmark` / web). Với app ads-only, nối sang [unit economics theo tier](../05-optimization/unit-economics-ads-only-theo-tier.md).
6. **Chấm điểm** theo rubric bên dưới.
7. **Xuất report** (`market/MARKET-RESEARCH-<ngày>.md`), kết luận đặt lên đầu, phần cuối bàn giao cho competitor-research: đối thủ đã lộ diện, beachhead, câu hỏi cần đào sâu.

## Rubric Market Attractiveness (mỗi tiêu chí 1–5 × trọng số)

| Tiêu chí | Trọng số | 1 | 3 | 5 |
|---|---|---|---|---|
| Quy mô thị trường (SAM) | 0,20 | Ngách hẹp | Vừa | Lớn |
| Tăng trưởng (CAGR) | 0,20 | Đi ngang/giảm | ~10% | >20% |
| Cạnh tranh (chấm theo độ hấp dẫn) | 0,15 | Leader thống trị | Vài đối thủ mạnh | Phân mảnh |
| **Dễ acquisition** | 0,15 | CPI cao, kênh tắc | Trung bình | CPI thấp, organic/ASO tốt |
| Sẵn lòng chi trả (WTP) | 0,15 | Không trả tiền | Freemium ổn | Sub/IAP mạnh |
| Phù hợp năng lực đội | 0,15 | Lệch | Một phần | Đúng thế mạnh |

Kết luận: **≥ 4,0 → GO**; **3,0–3,9 → GO có điều kiện / PIVOT** (thu hẹp phân khúc, đổi góc); **< 3,0 → NO-GO**. Đổi trọng số thì tổng vẫn phải bằng 1,0 và nêu rõ đã đổi. Mỗi điểm cần 1 câu lý do truy ngược được về dữ liệu.

> Với app **ads-only** của Apero, tiêu chí WTP gần như không áp dụng. *Đề xuất (chưa duyệt)*: thay bằng "eCPM/khả năng monetization bằng ads ở GEO mục tiêu", hoặc hạ trọng số WTP và tăng trọng số "Dễ acquisition".

## Quy tắc nguồn

- Gắn nhãn mọi con số: **[Report]** (vĩ mô) / **[ST]** (ước lượng SensorTower) / **[Suy luận]**. Không trộn mà không chú thích.
- Ưu tiên dữ liệu 6–12 tháng gần nhất. SensorTower chưa auth hoặc trả rỗng thì nói rõ, fallback sang web và đánh dấu là ước lượng. Không bịa.
