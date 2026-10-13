#!/usr/bin/env node
// Lưới an toàn: chạy nền sau SessionEnd/PreCompact. Nếu phần transcript chưa xử lý có việc thực chất
// mà chưa nạp knowledge → gọi `claude -p` headless đọc digest và nạp theo skill kb-capture, rồi commit + push.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';
import { root, STATE_DIR } from './lib.mjs';
import { analyzeWork, needsCapture, digest } from './transcript.mjs';
import { commitKnowledge, kbDirty, withLock } from './git.mjs';
import { loadState, saveState } from './hooks/common.mjs';

const { values } = parseArgs({ options: { session: { type: 'string' }, transcript: { type: 'string' }, mode: { type: 'string' }, reason: { type: 'string' }, 'dry-run': { type: 'boolean' } }, strict: false });
const id = values.session, transcript = values.transcript, mode = values.mode || 'end';
const stamp = () => new Date().toISOString();
const say = m => console.log(`${stamp()} [${String(id).slice(0, 8)} ${mode}] ${m}`);

if (!id || !transcript || !fs.existsSync(transcript)) { say('thiếu session/transcript, bỏ qua'); process.exit(0); }
// SessionEnd ghi transcript xong ngay trước hook; đợi 1 nhịp cho chắc.
await new Promise(r => setTimeout(r, 1500));

// Chiếm phần transcript cần xử lý (dưới lock để PreCompact và SessionEnd không cùng xử lý 1 đoạn).
const claim = withLock(root(), () => {
  const state = loadState(id);
  const from = state.checkpoint || 0;
  const a = analyzeWork(transcript, from);
  if (!needsCapture(a)) return { skip: true, a, from };
  saveState(id, { ...state, checkpoint: a.lastLine, backgroundRuns: [...(state.backgroundRuns || []), { at: stamp(), mode, from, to: a.lastLine }] });
  return { skip: false, a, from };
}, { waitMs: 120000 });

if (claim.skip) {
  say(`không cần nạp (captured=${claim.a.captured}, tools=${claim.a.substantive}, images=${claim.a.images})`);
  if (kbDirty()) { try { say(`commit: ${JSON.stringify(commitKnowledge(`kb: auto-commit (session ${String(id).slice(0, 8)})`))}`); } catch (e) { say(`commit lỗi: ${e.message}`); } }
  process.exit(0);
}

const dir = path.join(root(), STATE_DIR, 'digests');
fs.mkdirSync(dir, { recursive: true });
const digestFile = path.join(dir, `${id}-${Date.now()}.md`);
fs.writeFileSync(digestFile, digest(transcript, { fromLine: claim.from }));
say(`cần nạp: tools=${claim.a.substantive} images=${claim.a.images} mcp=${claim.a.mcp} — digest ${digestFile}`);

const prompt = `Bạn là agent nạp knowledge chạy nền cho repo này (không có user tương tác).
Đọc file digest session: ${digestFile}
Đó là transcript (dạng text) của một session Claude vừa ${mode === 'precompact' ? 'bị nén context' : 'kết thúc'}. Các đoạn gắn "(đã xử lý trước đó)" chỉ để hiểu bối cảnh — CHỈ nạp điều mới từ các đoạn còn lại.

Việc cần làm: theo đúng skill kb-capture (.claude/skills/kb-capture/SKILL.md — đọc nó trước),
1. Xác định những điều đáng nạp (bài học từ data, số liệu có bối cảnh, bước setup đúng/sai, quyết định + lý do, bẫy platform, thông tin app/campaign, screenshot quan trọng).
2. Với mỗi điều: tìm tài liệu cùng chủ đề trong knowledge/ (xem knowledge/INDEX.md, dùng \`node scripts/kb/cli.mjs search\`) → cập nhật nếu có, tạo mới nếu chưa. Status draft.
3. Ảnh: digest ghi sẵn lệnh lưu cho từng ảnh (images save <n> --transcript ...). Chỉ lưu ảnh có giá trị tham khảo, đặt vào tài liệu liên quan.
4. Chạy \`node scripts/kb/cli.mjs lint\` và sửa đến khi hết lỗi. KHÔNG tự commit (wrapper sẽ commit).
5. Nếu không có gì đáng nạp (hoặc đã được nạp trong session — kiểm tra knowledge hiện có), không sửa gì, chỉ trả lời "NOTHING".
Trả lời cuối cùng: danh sách file đã tạo/sửa, mỗi dòng 1 file.`;

if (values['dry-run']) { say('dry-run, không gọi claude'); process.exit(0); }

const bin = process.env.KB_CLAUDE_BIN || 'claude';
const args = ['-p', prompt, '--permission-mode', 'acceptEdits',
  '--allowedTools', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash(node scripts/kb/cli.mjs:*)',
  '--max-turns', '60', '--output-format', 'json'];
if (process.env.KB_BG_MODEL) args.push('--model', process.env.KB_BG_MODEL);
const res = spawnSync(bin, args, { cwd: root(), encoding: 'utf8', timeout: 20 * 60 * 1000, env: { ...process.env, KB_BACKGROUND: '1', KB_TRANSCRIPT: transcript }, maxBuffer: 64 * 1024 * 1024 });
let summary = res.stdout?.trim() ?? '';
try { const j = JSON.parse(summary); summary = `${j.result} (cost $${j.total_cost_usd?.toFixed?.(3)}, turns ${j.num_turns})`; } catch {}
say(`claude exit=${res.status} ${res.error ? res.error.message : ''}\n${summary}\n${(res.stderr || '').slice(0, 2000)}`);

try {
  const r = commitKnowledge(`kb: nạp nền từ session ${String(id).slice(0, 8)} (${mode})`);
  say(`commit: ${JSON.stringify(r)}`);
} catch (e) { say(`commit lỗi: ${e.message}`); }
