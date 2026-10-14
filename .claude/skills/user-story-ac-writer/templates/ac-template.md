# Acceptance Criteria Template (Given-When-Then)

Mỗi User Story tối thiểu **3 AC**: happy path + edge/validation + negative/error.

```
**AC1: [Tên scenario — happy path]**
- **Given** [tiền điều kiện cụ thể]
- **When** [hành động user / system event]
- **Then** [kết quả mong đợi, đo được]
- **And** [kết quả phụ nếu có]

**AC2: [Tên scenario — edge case / validation]**
- **Given** ...
- **When** ...
- **Then** ...

**AC3: [Tên scenario — negative / error path]**
- **Given** ...
- **When** ...
- **Then** ...
```

## Quy tắc AC tốt
- 1 AC = 1 scenario duy nhất (không gộp nhiều case).
- Mỗi mệnh đề Given/When/Then đo được (trạng thái/số liệu rõ), tránh "nhanh", "hợp lý".
- Mô tả **kết quả hệ thống**, không mô tả UI chi tiết ("button turns blue") hay logic impl
  ("call API /v1/..."). → "Then system displays a confirmation message" / "Then data is persisted".
- Bao đủ 3 nhánh: happy / edge / negative.

<!-- Tương thích SRS: format Given/When/Then này feed thẳng vào section Acceptance Criteria
     của srs-writer. -->
