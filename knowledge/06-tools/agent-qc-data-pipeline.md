---
title: Agent QC Data pipeline — hỏi xem luồng dữ liệu revenue/cost/sub/install có chạy đúng trước khi tin số trên dashboard
type: reference
topic: 06-tools
tags: [tool, agent, data-pipeline, airflow, bigquery, clickhouse, data-quality, measurement]
app: general
status: verified
confidence: medium
sources:
  - AI Knownledge/APR-135 - Agent QC Data pipeline/README.md (đọc 2026-10-14)
  - AI Knownledge/APR-135 - Agent QC Data pipeline/PRD.md (đọc 2026-10-14)
created: 2026-10-14
updated: 2026-10-14
related: [05-optimization/doc-chi-so-theo-moc-thoi-gian.md, 05-optimization/hau-kiem-version-app-nguong-verdict.md]
summary: Agent Claude Code read-only của team Data (Bùi Anh Độ) điều tra pipeline Airflow + dbt + BigQuery → ClickHouse bằng câu hỏi tiếng Việt ("revenue hôm nay có sự cố không?"), trả lời hỏng ở đâu và ảnh hưởng báo cáo nào.
---

# Agent QC Data pipeline

## Vì sao marketer cần biết
Khi số trên dashboard nội bộ (revenue, cost, sub, install) tụt hoặc tăng bất thường, có thể là **lỗi pipeline dữ liệu** chứ không phải campaign. Nên kiểm luồng dữ liệu trước khi cắt/scale campaign. Agent này trả lời được câu hỏi đó.

## Làm gì
- Hỏi bằng tiếng Việt tự nhiên, ví dụ: "luồng sub ngày 28/06 có chạy ổn không?", "revenue hôm nay có sự cố gì không?", "audit kỹ các luồng revenue, cost, sub, install ngày X trước khi chốt sổ".
- Agent tra bản đồ lineage (MCP `metahub`, tool `find_leaves`: từ từ khoá con số ra bảng báo cáo) và trạng thái runtime Airflow (MCP `airflow`). Kết luận gồm: hỏng ở đâu, ảnh hưởng báo cáo/app nào, khắc phục thế nào. Chế độ audit sâu dùng 3 sub-agent.
- **READ-ONLY**: chỉ kiểm luồng, không sửa gì.

- **Dùng ở bước:** đo lường & tối ưu, trước khi kết luận từ một biến động số liệu.
- **Owner:** Bùi Anh Độ (Data). Người dùng chính là Data Engineer/Analyst. Marketer có thể nhờ team Data chạy.
- **Vị trí:** `AI Knownledge/APR-135 - Agent QC Data pipeline` (`agent-qc.zip`, `PRD.md`, `README.md`, `video.mov`).

## Cách chạy
```bash
cd agent-qc
cp credential_config/airflow.example.yml credential_config/airflow.yml   # điền host/user/pass Airflow
claude   # rồi đặt câu hỏi
```
Cần: <cần tài khoản Airflow nội bộ>, (tuỳ chọn) <cần service account BigQuery>. Có hook chặn lệnh nguy hiểm và chặn ghi secret.

## Giới hạn
- Chỉ phủ hệ pipeline nội bộ (Airflow/dbt/BigQuery/ClickHouse). Không kiểm được số ở Google Ads/AdMob/Firebase gốc.
