---
title: Viết PRD (PO Agent) — PRD hand-off 17 section và Metrics Plan / Tracking Spec Firebase cho feature app mobile
type: reference
topic: 06-tools
tags: [tool, claude-skill, product-owner, prd, metrics-plan, tracking-spec, firebase, bigquery, event-naming]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-026 - Viết Product Requirements Document/_info.md (đọc 2026-10-14)
  - AI Knownledge/APR-026 - Viết Product Requirements Document/po-agent-bundle.md — Phần A (agent), B (po-prd-writer v1.1), C (po-metrics-analysis v1.3) (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related:
  - 04-measurement/prd-success-metrics-va-yeu-cau-ua.md
  - 06-tools/po-copilot-pipeline-tai-lieu-san-pham.md
  - 04-measurement/firebase-events-cho-ua.md
  - 04-measurement/ga4-bigquery-chi-so-suc-khoe-san-pham.md
  - 05-optimization/hau-kiem-version-app-nguong-verdict.md
summary: Bundle APR-026 (Hoài Nguyễn Thị Vĩnh) gồm agent điều phối và 2 skill — PRD hand-off 17 section có FR/BR/TC/AC ID, và metrics plan/tracking spec/analysis report Firebase+BigQuery; output tiếng Anh.
---

# Viết PRD — PO Agent (APR-026)

## Làm gì
`po-agent-bundle.md` gộp 3 phần trong 1 file (thiết kế để upload vào Claude.ai Project knowledge). Đã tách thành 3 skill cài được:

| Skill trong repo | Bản gốc | Làm gì |
|---|---|---|
| `po-prd-writer` | `po-prd-writer` v1.1 | Viết/review/update PRD **17 section** hand-off cho Dev, Design, QA: Overview (§1.5 Success Metrics), Scope, Screen Inventory, Domain Logic, User Flows, Functional Requirements (RFC 2119 MUST/MUST NOT), Technical Spec (data model, API, pseudocode), Business Rules, UI/Design Spec, **§11 Analytics Events**, Edge Cases, Test Cases, Acceptance Criteria, Design Review notes, **§16 Rollout Plan**, Appendix. Mọi requirement có ID (`FR-S2-01`, `BR-V01`, `TC-09`, `AC-S2-01`), tham chiếu chéo dạng `§X.Y`. Self-review theo checklist 20 Critical + 18 Important. |
| `po-metrics-analysis` | `po-metrics-analysis` v1.3 | 3 use case: (1) **pre-release** Metrics Plan + Tracking Spec, (2) **post-release** Analysis Report với verdict Scale/Iterate/Kill, (3) **Product Health Report** weekly/monthly. Kèm reference Firebase (hard limits, default events, naming convention, param catalog, SQL BigQuery mẫu), framework AARRR/retention/cohort/funnel, catalog metric (viết cho game farming). |
| `po-prd-metrics-agent` | Phần A `po-agent` v0.2.0 | Điều phối: route request sang 1 hoặc cả 2 skill (PRD trước, Metrics sau), gom câu hỏi intake **1 lần** (tối đa 6–8 câu), cross-check §1.5 ↔ Metrics Plan và §11 ↔ Tracking Spec (từng event, từng param). |

Theo `_info.md`, output mong muốn là file `.docx` PRD kèm product metrics. Skill xuất `.md` rồi gợi ý convert `.docx` bằng docx skill. Mẫu output: `Output_PRD.pdf` (chưa đọc được trong lần nhập này vì máy thiếu công cụ đọc PDF).

## Dùng ở bước nào
- **Viết PRD cho feature mới** khi cần tài liệu đủ để Dev/QA làm không phải hỏi lại. Skill bắt hỏi đủ checklist context (goals, non-goals, 2–4 persona, 4–6 success metric, screens, data model) trước khi viết, không tự bịa.
- **Chốt tracking trước khi build**: `po-metrics-analysis` UC1 ra Tracking Spec cho dev, có quy tắc đặt tên event toàn công ty. Đây là chỗ UA chen vào để có đủ event cho tCPA/tROAS và đọc ROAS. Xem tóm tắt ở [PRD & product metrics](../04-measurement/prd-success-metrics-va-yeu-cau-ua.md).
- **1–4 tuần sau release**: UC2 Analysis Report, decision criteria đã chốt trước launch. Bổ trợ cho [hậu kiểm version app](../05-optimization/hau-kiem-version-app-nguong-verdict.md) (bên đó so 2 version bằng mktpro/AdMob, bên này đo theo feature).
- Agent tự khai **scope OUT**: A/B testing setup, OKR/North Star cấp company, SQL phức tạp, ML, UI design prompt, **marketing copy**.

## Cách gọi trong repo này
Skill cài ở `.claude/skills/po-prd-writer/`, `.claude/skills/po-metrics-analysis/`, `.claude/skills/po-prd-metrics-agent/`.
- "Viết PRD 17 section / PRD hand-off cho feature …" → `po-prd-writer`
- "Làm metrics plan + tracking spec cho feature …" → `po-metrics-analysis`
- "Phân tích số feature X sau release" (kèm data) → `po-metrics-analysis`
- "Feature mới cần cả PRD lẫn đo lường" → `po-prd-metrics-agent`

Phân biệt với [PO Copilot (APR-229)](po-copilot-pipeline-tai-lieu-san-pham.md): `prd-writer` bên đó là PRD ngắn mức product. Bản 17 section ở đây là spec chi tiết, gần SRS.

## Giới hạn / yêu cầu
- **Output luôn tiếng Anh**, giao tiếp tiếng Việt.
- File gốc lưu vào `/mnt/user-data/outputs/` (sandbox claude.ai). Trong Claude Code cần chỉ định nơi lưu, đề xuất `exports/po/<app>/` (đã gitignore).
- **Mâu thuẫn trong bản gốc** (giữ nguyên khi nhập, cần owner chốt):
  - §11 Analytics Events của PRD đặt tên event `<feature>_<action>` (vd `bs_saved`). `po-metrics-analysis` bắt buộc `[screen]_[element]_[action]` (vd `video_generation_save_success`). Cross-check của agent sẽ báo lệch nếu dùng cả hai.
  - `po-metrics-analysis` nhắc "§3.4 Decision Criteria" của PRD, nhưng template 17 section không có mục này (§3 là Screen Inventory).
  - Agent trỏ tới `demo-03-clarify` và `evaluation/self-check-6-buoc.md`, không có trong bundle.
- Catalog metric và ví dụ viết cho **game farming B2C**. Không có metric monetization quảng cáo (eCPM, imps/DAU, ARPDAU theo ad revenue) hay UA (CPI, ROAS theo cohort). App ads-only như Home Morph phải tự bổ sung.
- Reference Firebase ghi `in_app_purchase` là "iOS, Android dùng `purchase`". Điểm này lệch với [Firebase events cho UA](../04-measurement/firebase-events-cho-ua.md), nơi `in_app_purchase` là event tự thu thập cho cả Android (dùng làm value cho tROAS). Kiểm tra lại trước khi dùng.
- Số trong template (D7 25% → 32%, crash-free 99.7%…) là **placeholder minh hoạ**, không phải benchmark.

## Nguồn / owner
- **Owner (hub):** Hoài Nguyễn Thị Vĩnh (Product — PO). Bundle ghi owner "PO/Design Team — Astronex", status "SUBMITTED FOR REVIEW". Hub: knowledgehub.aperogroup.ai/library/36.
- Bundle kể tài liệu đã ship bằng workflow này: Scan Food PRD (HCM134), AI Video PRD (Helixa/Quin), LusoLearn PRD suite, phân tích AdMob AR Drawing v0.4.2 vs v0.5.2 (phát hiện bug show rate làm earnings sụt ~94%), retention plan AR Drawing.
- **Vị trí:** `AI Knownledge/APR-026 - Viết Product Requirements Document/` (`po-agent-bundle.md`, `Output_PRD.pdf`, video `HDSD Agent PRD.mp4` ~10 MB chưa xem).
