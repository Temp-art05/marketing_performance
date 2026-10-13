// SessionStart: export KB_SESSION_ID/KB_TRANSCRIPT cho Bash, pull, sinh INDEX, đưa trạng thái KB vào context.
import fs from 'node:fs';
import { readInput, isBackground, loadState, saveState, log } from './common.mjs';
import { writeIndex, listDocs } from '../lib.mjs';
import { quickPull } from '../git.mjs';
import { lineCount } from '../transcript.mjs';
import { sessionSummary } from '../doctor.mjs';

const input = await readInput();
const { session_id: id, transcript_path: transcript, source } = input;

if (process.env.CLAUDE_ENV_FILE && id) {
  try {
    fs.appendFileSync(process.env.CLAUDE_ENV_FILE, `export KB_SESSION_ID='${id}'\nexport KB_TRANSCRIPT='${transcript ?? ''}'\n`);
  } catch (e) { log('hooks', `session-start env file lỗi: ${e.message}`); }
}

if (source === 'startup' || source === 'resume' || source === 'clear') {
  if (!isBackground()) {
    const p = quickPull();
    if (!p.ok) log('hooks', `quick pull lỗi: ${p.out.split('\n')[0]}`);
  }
  // Session mới/resume: chỉ xét việc phát sinh từ giờ.
  if (id) { const s = loadState(id); if (!s.checkpoint) saveState(id, { ...s, checkpoint: lineCount(transcript) }); }
}
try { writeIndex(); } catch (e) { log('hooks', `writeIndex lỗi: ${e.message}`); }

const docs = listDocs();
const drafts = docs.filter(d => d.fm.status === 'draft').length;
const lines = [
  `[KB] Knowledge base: ${docs.length} tài liệu (${drafts} draft). Bản đồ đầy đủ ở knowledge/INDEX.md (đã nạp qua CLAUDE.md).`,
  '[KB] Khi gặp điều đáng nạp (bài học từ data, số liệu có bối cảnh, bước setup đúng/sai, quyết định, bẫy của platform, screenshot quan trọng) → dùng skill kb-capture ngay, không đợi cuối session.',
];
try { lines.push(...sessionSummary()); } catch (e) { log('hooks', `doctor lỗi: ${e.message}`); }
if (source === 'compact') {
  lines.push('[KB] Context vừa được nén. Phần hội thoại trước khi nén đang được agent nền rà và nạp knowledge (không cần nạp lại). Tiếp tục nạp những gì phát sinh từ giờ.');
}
console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: lines.join('\n') } }));
