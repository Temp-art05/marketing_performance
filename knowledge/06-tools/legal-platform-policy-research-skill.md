---
title: Skill Legal & Platform Policy Research — tra luật và policy Apple/Google trước khi launch tính năng
type: reference
topic: 06-tools
tags: [tool, skill, policy, legal, google-play, app-store, compliance]
app: general
status: draft
confidence: high
sources:
  - "AI Knownledge/APR-037 - Skill research quy định của pháp luật, policy nền tảng/PRD (3).MD, legal-and-platform-policy-research.md, Demo output.xlsx (đọc 2026-10-14)"
created: 2026-10-14
updated: 2026-10-14
related:
  - 01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md
  - 06-tools/super-legal-check-trademark-ten-app.md
summary: Skill của Legal Apero (v1.1) chuẩn hoá research luật (US/EU/VN) và policy Apple/Google theo SOP LR01–LR07, xuất Excel có hiện trạng, mục tiêu, bảng policy, rủi ro, nguồn hyperlink và đề xuất của Legal.
---

# Skill Legal & Platform Policy Research

## Làm gì
"Trợ lý research pháp lý" của Legal team Apero (legal@apero.vn), owner LinhLNP. Đây là **skill phương pháp**: không lưu sẵn nội dung luật, mỗi lần chạy tự tra văn bản gốc và bản mới nhất.
- **Nhánh A, app/game**: luật Mỹ (COPPA, CCPA/CPRA, FTC Act, 17 U.S.C.), EU (GDPR, DSA, AI Act) **chỉ khi có dữ liệu cá nhân**, và **cả** Apple App Store Review Guidelines lẫn Google Play Developer Program Policies.
- **Nhánh B, vận hành nội bộ VN**: lao động, thuế, công đoàn... (không liên quan marketing).
- **Output**: file Excel gồm khối Hiện trạng / Mục tiêu / Lưu ý → bảng quy định pháp luật → bảng **Apple vs Google vs Rủi ro** → Đề xuất của Legal (phương án an toàn nhất, điều kiện) → Kết luận, có nguồn hyperlink và ngày cập nhật.
- **Bước roadmap**: Pre-Marketing, trước khi build/launch tính năng có dữ liệu ảnh, AI, ad SDK; khi bị reject/cảnh báo policy.
- Vị trí: `AI Knownledge/APR-037 - Skill research quy định của pháp luật, policy nền tảng`.

Ví dụ kết quả thật (app AI chỉnh ảnh chân dung + ad SDK, US/EU) đã tóm vào [policy app AI ảnh và đặt tên app](../01-pre-marketing/policy-app-ai-anh-va-dat-ten-app.md).

## Cách dùng
Chạy trên Cowork/Claude như một skill: `/legal-and-platform-policy-research <mô tả>`. Prompt tốt phải có: **mục tiêu**, bối cảnh tính năng (dữ liệu gì, của ai, lưu bao lâu, gửi cho SDK/API nào), thị trường, có dữ liệu cá nhân hay không. Thiếu mục tiêu thì skill hỏi lại.

Mẫu: "Research compliance cho tính năng mới: app chỉnh sửa ảnh chân dung, user tải ảnh lên rồi AI ghép nền mới; nguồn nền từ kho stock + AI tạo sinh; lưu ảnh user 30 ngày và gửi sang SDK quảng cáo; thị trường Mỹ và EU."

## Giới hạn
- Kết quả **không phải tư vấn pháp lý cuối cùng**. Việc lớn/rủi ro cao chuyển pháp chế.
- Phụ thuộc web fetch. Trang render bằng JS có thể không đọc được; skill phải nói rõ thay vì đoán.
- [▶ Video demo chạy skill research policy (24 MB)](../../media/2026-10/2026-10-14-legal-policy-research-skill-demo-1.mp4)
