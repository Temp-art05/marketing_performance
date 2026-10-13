# CLAUDE.md

Repo này là **kho kiến thức**, không phải codebase. Nội dung: UA marketing cho ứng dụng Android kiếm tiền bằng quảng cáo.
User dùng Claude trong repo này để làm việc marketing thật (setup campaign, đọc data, phân tích creative...) — và mọi điều học được phải được nạp ngược vào knowledge.

## Cách làm việc

- Viết tiếng Việt, giữ thuật ngữ ngành bằng tiếng Anh (CPI, ROAS, LTV, eCPM, ARPDAU...).
- Trước khi thêm tài liệu mới, tìm xem đã có file nào cùng chủ đề chưa — cập nhật thay vì tạo trùng.
- Số liệu/benchmark phải kèm nguồn, thời điểm, bối cảnh (GEO, kênh, thể loại app). Không bịa benchmark.
- Không commit dữ liệu thô, token, API key. Dữ liệu export để trong `raw/` hoặc `exports/` (đã gitignore).
- Plan làm việc ghi vào `docs/plans/` (đã gitignore).

## Knowledge base

- Nguồn sự thật: `knowledge/` (Markdown + frontmatter), ảnh ở `assets/screenshots/`. Bản đồ toàn bộ tài liệu ở cuối file này (INDEX, sinh tự động).
- **Trả lời câu hỏi chuyên môn / trước khi làm việc**: tra knowledge trước (skill `kb-search`), dẫn file nguồn.
- **Nạp liên tục**: ngay khi có bài học, số liệu có bối cảnh, bước setup, quyết định, bẫy platform, screenshot đáng giữ → skill `kb-capture`. Không đợi cuối session. Hook `Stop` sẽ nhắc nếu quên; khi session đóng có agent nền rà lại.
- **Chủ động dùng knowledge**: hook `UserPromptSubmit` chèn "Knowledge liên quan" vào mỗi yêu cầu — nếu có bài học/quyết định/số liệu cũ áp dụng được, mở đầu câu trả lời bằng 1–3 lưu ý ngắn kèm file nguồn (vd: "Lần trước DE ROAS D7 chỉ 14% — `lessons/...`"). Không liên quan thì bỏ qua, không nhắc.
- **Mốc theo dõi** (`knowledge/00-overview/watchlist.md`): khi launch / đổi bid / đổi budget / đổi creative / bật tính năng tracking → thêm mốc xem lại theo roadmap (`node scripts/kb/cli.mjs followup add --when 7d --app <slug> --text "..."`; thường 7d, 1m, 4m, 6m cho campaign mới). Đầu session nếu có mốc đến hạn (hook báo) → nhắc user ngay câu đầu. Xem xong → `followup done <n> --note "<kết quả>"` và nạp kết quả như một lesson.
- **Gợi ý cải thiện**: khi user hỏi "nên làm gì tiếp", "review app X", "có gì cần chú ý" → skill `kb-advise`.
- Được phép **tự commit và push thẳng `main`** cho thay đổi knowledge (`node scripts/kb/cli.mjs commit -m "kb: ..."`), không cần PR, không cần hỏi.
- Repo private: được ghi số liệu thật, tên app, ID tài khoản, screenshot nguyên bản. Chỉ cấm credential.
- CLI: `node scripts/kb/cli.mjs help`. Web xem/sửa knowledge: `npm run web` → http://localhost:4321.

## Trạng thái hiện tại

@knowledge/00-overview/current-state.md

## Knowledge index

@knowledge/INDEX.md
