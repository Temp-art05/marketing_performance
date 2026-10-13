// Stop: nếu từ lần nạp/nhắc gần nhất session đã làm việc thực chất mà chưa nạp knowledge → chặn dừng 1 lần để nhắc.
// Khi cho dừng: knowledge còn thay đổi chưa commit → commit + push nền.
import path from 'node:path';
import { readInput, isBackground, loadState, saveState, spawnDetached, log, SCRIPTS } from './common.mjs';
import { analyzeWork, needsCapture } from '../transcript.mjs';
import { kbDirty } from '../git.mjs';

const input = await readInput();
const { session_id: id, transcript_path: transcript, stop_hook_active: active } = input;

function autoCommit() {
  try {
    if (kbDirty()) spawnDetached([path.join(SCRIPTS, 'cli.mjs'), 'commit', '-m', `kb: auto-commit cuối lượt (session ${String(id).slice(0, 8)})`], 'auto-commit');
  } catch (e) { log('hooks', `auto-commit lỗi: ${e.message}`); }
}

// Agent nền: wrapper (background-capture.mjs) tự commit với message riêng → không auto-commit ở đây.
if (isBackground()) process.exit(0);
if (!transcript) { autoCommit(); process.exit(0); }

const state = loadState(id);
let a;
try { a = analyzeWork(transcript, state.checkpoint || 0); } catch (e) { log('hooks', `stop analyze lỗi: ${e.message}`); process.exit(0); }

if (active || a.captured) {
  // Đã nhắc ở lượt này, hoặc đã nạp → chốt mốc, cho dừng.
  saveState(id, { ...state, checkpoint: a.lastLine });
  autoCommit();
  process.exit(0);
}

if (needsCapture(a)) {
  saveState(id, { ...state, checkpoint: a.lastLine, reminders: (state.reminders || 0) + 1 });
  const what = [a.images && `${a.images} ảnh`, a.dataReads && `${a.dataReads} lần đọc file dữ liệu`, a.mcp && `${a.mcp} lần gọi MCP`, a.substantive && `${a.substantive} thao tác`, a.userChars >= 600 && 'thông tin user kể chi tiết'].filter(Boolean).join(', ');
  const reason = `[KB] Trước khi kết thúc lượt này: từ lần nạp gần nhất session đã có ${what} nhưng chưa nạp knowledge. `
    + 'Rà lại phần việc vừa làm theo tiêu chí trong skill kb-capture: '
    + 'nếu có bài học / số liệu có bối cảnh / bước setup / quyết định / bẫy platform / screenshot đáng giữ → nạp ngay theo skill kb-capture (cập nhật file có sẵn nếu cùng chủ đề, lưu ảnh, rồi kb commit). '
    + 'Nếu thật sự không có gì đáng nạp → chạy `node scripts/kb/cli.mjs skip "<lý do ngắn>"`. '
    + 'Không cần báo cáo dài với user về việc này, chỉ 1 dòng nếu có nạp.';
  console.log(JSON.stringify({ decision: 'block', reason }));
  process.exit(0);
}

// Chưa đủ ngưỡng: giữ nguyên checkpoint để việc tích luỹ qua nhiều lượt.
autoCommit();
