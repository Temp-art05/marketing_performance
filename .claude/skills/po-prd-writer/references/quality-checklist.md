<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- Phần 5: Quality Checklist — tách từ po-agent-bundle.md (skill gốc po-prd-writer) -->

# PHẦN 5: Quality Checklist

> **Khi nào dùng**: Đọc phần này trước khi finalize PRD (self-review) hoặc khi review PRD của người khác. PRD phải pass tất cả Critical checks và ≥80% Important checks.

---

# PRD Quality Checklist (17-Section Format)

Đọc file này khi cần self-review PRD trước khi giao cho user, hoặc khi review PRD có sẵn.

PRD phải pass:
- TẤT CẢ Critical checks (C1-C20)
- Tối thiểu 80% Important checks
- Cross-reference validation phải pass 100%

---

## Critical (BẮT BUỘC, fail dù 1 cái cũng phải sửa)

### Structure
- [ ] **C1. Có Document Metadata table** ở đầu với Version, Status, Owner, Audience, Major change description?
- [ ] **C2. Có Table of Contents** (có thể placeholder)?
- [ ] **C3. Có đủ 17 sections** (hoặc giải thích rõ tại sao bỏ section nào)?
- [ ] **C4. Có §17.3 Change Log** với version history?

### Section §1 Overview
- [ ] **C5. §1.1 Purpose** ngắn (2-3 câu), không sa vào background?
- [ ] **C6. §1.3 có cả Goals VÀ Non-Goals** (4-6 goals, 3-5 non-goals)?
- [ ] **C7. §1.4 Target Users** có ≥2 personas trong bảng 3 cột?
- [ ] **C8. §1.5 Success Metrics** có ≥4 metrics, mỗi metric có target number đo lường được?

### Section §3 Screen Inventory
- [ ] **C9. Có bảng Screen Inventory** với S1, S2... có Purpose ngắn?

### Section §7 Functional Requirements
- [ ] **C10. Mọi FR có ID format FR-S<n>-<NN>**?
- [ ] **C11. Dùng MUST / MUST NOT** trong FR (không phải "should" mơ hồ)?
- [ ] **C12. FR là behavior, KHÔNG có visual detail** (visual nằm ở §10)?

### Section §8 Technical Spec
- [ ] **C13. §8.1 Data Model** có đủ các trường chuẩn (id, user_id, created_at, updated_at, deleted_at)?
- [ ] **C14. §8.3 API Endpoints** liệt kê đủ CRUD + summary endpoints?
- [ ] **C15. §8.4 Pseudocode** có comments cho mỗi step + reference §X.Y nguồn?
- [ ] **C16. §8.6 Validation Rules** có bounds cụ thể cho mỗi field?

### Section §9-14 (Rules, UI, Analytics, Edge, Test, AC)
- [ ] **C17. §9 Business Rules Summary** có ≥5 BR rules với ID rõ ràng?
- [ ] **C18. §11 Analytics Events** liệt kê đủ events cho open/save/edit/delete/critical?
- [ ] **C19. §13 Test Cases** có ≥10 TCs với expected output cụ thể, đánh số liên tục?
- [ ] **C20. §14 Acceptance Criteria** có AC-IDs ref đến FR hoặc TC?

---

## Important (nên pass, fail nhiều thì sửa)

### Domain logic
- [ ] **I1. §4-5** đầy đủ NẾU feature có domain logic (classification, calculation, dispatch)?
- [ ] **I2. §4.x Smart Default** rule có condition table + rationale + edge cases?
- [ ] **I3. §5.x Dispatch Summary** có bảng mapping key → threshold table?

### User Flows
- [ ] **I4. §6 có 3 flows** Primary / Secondary / Tertiary?
- [ ] **I5. Mỗi flow** mention screen IDs (S1→S2→S3)?

### UI/Design Spec
- [ ] **I6. §10.1 Design Tokens** có hex colors, không chỉ tên token?
- [ ] **I7. §10.8 Empty/Loading/Error states** liệt kê cho tất cả screens?
- [ ] **I8. §10.9 Accessibility** có ≥5 requirements?

### Edge Cases & Risks
- [ ] **I9. §12.1 Edge Cases** ≥5 scenarios?
- [ ] **I10. §12.2 Risks** bảng 3 cột (Risk/Impact/Mitigation) ≥3 risks?
- [ ] **I11. §12.3 Open Questions** ≥3 questions với tentative decision?

### Design Review
- [ ] **I12. §15 Notes for Design Review** có Action for designer trên mỗi note?

### Rollout
- [ ] **I13. §16 Rollout Plan** có Alpha/Beta/GA/next phases?

### Glossary & References
- [ ] **I14. §17.1 Glossary** có terms chính + acronyms?
- [ ] **I15. §17.2 References** có authoritative sources?

### Cross-reference
- [ ] **I16. Mọi §X.Y reference** trỏ đến section có tồn tại?
- [ ] **I17. Mọi FR-XX, BR-XX, TC-XX, AC-XX** trỏ đến ID có tồn tại?
- [ ] **I18. Không có "as mentioned above"** mơ hồ?

---

## Nice-to-have (bonus)

- [ ] **N1. Có italic commentary** giải thích "why this matters" ở các decision quan trọng?
- [ ] **N2. Mỗi metric quan trọng** có rationale ngắn (như "critical — confirms X")?
- [ ] **N3. Recommendations Copy Table** có disclaimer + reviewer note?
- [ ] **N4. Test Cases** có cột Notes giải thích why mỗi TC tồn tại?
- [ ] **N5. §15 Notes** có ⚠ NOTE markers trong §7 nơi FR cần design update?
- [ ] **N6. Change Log** dùng markers REMOVED/ADDED/REPLACED?

---

## Anti-pattern Detection

Nếu thấy bất kỳ pattern nào dưới đây trong PRD → flag là Critical issue cần sửa:

1. **Vague success metric**: "improve UX", "increase engagement", "make better" → fail C8
2. **FR mơ hồ**: "system should handle X smoothly" → fail C11
3. **Mixing visual into FR**: "FR-S2-01: button is blue and rounded" → fail C12, move to §10
4. **No FR ID**: paragraph requirements without IDs → fail C10
5. **Stale cross-reference**: ref §5.6 nhưng section đã renumbered → fail I16
6. **Test case without expected output**: "TC-01: enter value 100" without expected zone → fail C19
7. **AC = restating FR**: "AC-S2-01: System does FR-S2-01" → fail C20, AC must describe HOW to verify
8. **No data in Background**: "many users want this" without numbers → fail I (data-driven background)
9. **Missing Document Metadata**: no version, no Last Updated → fail C1
10. **No change log**: latest version but no §17.3 entry → fail C4

---

## Cách dùng checklist khi REVIEW PRD của user

1. Đọc PRD user gửi
2. Đánh dấu pass/fail từng check
3. Phân loại:
   - **Critical fails** (fail C1-C20)
   - **Important fails** (fail I1-I18)
   - **Anti-patterns detected**
4. Trả về dạng:
   ```
   ## Critical Issues (must fix)
   - C12 fail: FR-S2-04 mixes visual ("blue button") → move to §10.x
   - C19 fail: §13 chỉ có 5 TCs, thiếu unit conversion category
   
   ## Important Issues (should fix)
   - I9 fail: §12.1 chỉ có 2 edge cases, thiếu timezone & offline scenarios
   - I16 fail: Reference "§5.7" trong §7.2 nhưng PRD chỉ có đến §5.6
   
   ## Suggestions
   - Add italic "why this matters" commentary trong §4.3 Smart Default
   - Consider adding TC notes column for QA context
   ```
5. Đề xuất concrete fix, không chỉ "section X cần improve"

---

## Khi self-review PRD vừa viết xong

1. Đọc lướt từ đầu đến cuối — có flow logic không?
2. Chạy through từng item C1-C20 — pass tất cả?
3. Spot-check cross-references: pick random 5 references → check valid
4. Đọc §17.3 Change Log — có ghi rõ thay đổi version này?
5. Nếu pass → bàn giao user, ghi "Self-checked against quality checklist, all Critical pass."

---
