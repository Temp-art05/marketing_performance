# User Story & AC — Quality Checklist

Self-review trước khi xuất. Fail → sửa hoặc flag cho PO.

## User Story
- [ ] Persona cụ thể (không "As a user").
- [ ] "I want to" là hành động cụ thể, đo được.
- [ ] "So that" nêu giá trị thật, không lặp lại "I want".
- [ ] Đạt INVEST (chạy bảng 6 tiêu chí).
- [ ] Không chứa chi tiết implementation (không "call API", "dùng Redis").
- [ ] Không quá to (1 persona, không ôm cả CRUD) — nếu to thì đã split.

## Acceptance Criteria
- [ ] Tối thiểu 3 AC.
- [ ] Bao đủ 3 nhánh: happy path + edge/validation + negative/error.
- [ ] Mỗi AC = 1 scenario duy nhất.
- [ ] Mỗi Given/When/Then đo được (không "nhanh", "hợp lý", "user-friendly").
- [ ] Mô tả kết quả hệ thống, không mô tả UI chi tiết hay logic kỹ thuật.
- [ ] QA đọc là viết được test case (Testable).

## Cờ cảnh báo (dấu hiệu cần sửa)
- ⚠️ Small fail → đề xuất split.
- ⚠️ Story description > 200 từ → quá chi tiết, mất Negotiable.
- ⚠️ 1 AC dài > 10 dòng → quá phức tạp, nên tách.
- ⚠️ Không có AC → không Testable.
- ⚠️ "So that" rỗng / copy "I want to" → không Valuable.

## Output cuối
- [ ] Hỏi PO xem lại toàn bộ + xác nhận format trước khi xuất file.
