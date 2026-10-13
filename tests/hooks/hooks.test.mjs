// Chạy từng hook như Claude Code gọi: JSON qua stdin, kiểm stdout/exit code/state.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeRepo, doc, makePng, Transcript, tmpDir, hook, run, HOOKS } from '../helpers.mjs';

const stateOf = (root, id) => JSON.parse(fs.readFileSync(path.join(root, '.claude/state/sessions', `${id}.json`), 'utf8'));
const waitFor = async (fn, ms = 15000) => { const s = Date.now(); while (Date.now() - s < ms) { if (fn()) return true; await new Promise(r => setTimeout(r, 200)); } return false; };

function workSession(root, { images = 0, tools = 3 } = {}) {
  const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t.user('đọc report campaign giúp tao', Array.from({ length: images }, () => makePng()));
  for (let i = 0; i < tools; i++) t.tool('Bash', { command: `python3 x${i}.py` });
  t.assistant('ROAS D7 thấp vì ...');
  return t;
}

test('SessionStart: ghi KB_SESSION_ID/KB_TRANSCRIPT vào CLAUDE_ENV_FILE, sinh INDEX, trả context JSON', () => {
  const { root } = makeRepo({ docs: { '00-overview/a.md': doc() } });
  const envFile = path.join(tmpDir(), 'env.sh');
  const res = hook('session-start', { session_id: 's1', transcript_path: '/tmp/s1.jsonl', source: 'startup' }, { root, env: { CLAUDE_ENV_FILE: envFile } });
  assert.equal(res.code, 0, res.stderr);
  const out = JSON.parse(res.stdout);
  assert.equal(out.hookSpecificOutput.hookEventName, 'SessionStart');
  assert.match(out.hookSpecificOutput.additionalContext, /1 tài liệu \(1 draft\)/);
  assert.match(fs.readFileSync(envFile, 'utf8'), /export KB_SESSION_ID='s1'\nexport KB_TRANSCRIPT='\/tmp\/s1.jsonl'/);
  assert.ok(fs.existsSync(path.join(root, 'knowledge/INDEX.md')));
});

test('SessionStart compact: nhắc rằng phần trước đang được agent nền nạp', () => {
  const { root } = makeRepo();
  const res = hook('session-start', { session_id: 's1', source: 'compact' }, { root });
  assert.match(JSON.parse(res.stdout).hookSpecificOutput.additionalContext, /Context vừa được nén/);
});

test('PostToolUse: tài liệu hợp lệ → exit 0 và INDEX cập nhật', () => {
  const { root } = makeRepo();
  const f = path.join(root, 'knowledge/00-overview/a.md');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, doc({ summary: 'tóm tắt mới' }));
  const res = hook('post-tool-use', { tool_name: 'Write', tool_input: { file_path: f }, cwd: root }, { root });
  assert.equal(res.code, 0, res.stderr);
  assert.match(fs.readFileSync(path.join(root, 'knowledge/INDEX.md'), 'utf8'), /tóm tắt mới/);
});

test('PostToolUse: tài liệu lỗi → exit 2 + stderr liệt kê lỗi cho Claude sửa', () => {
  const { root } = makeRepo();
  const f = path.join(root, 'knowledge/lessons/x.md');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, '---\ntitle: X\n---\nbody');
  const res = hook('post-tool-use', { tool_name: 'Write', tool_input: { file_path: 'knowledge/lessons/x.md' }, cwd: root }, { root });
  assert.equal(res.code, 2);
  assert.match(res.stderr, /Thiếu field bắt buộc: type/);
});

test('PostToolUse: sửa tay INDEX.md → sinh lại + exit 2; file ngoài knowledge → bỏ qua', () => {
  const { root } = makeRepo({ docs: { '00-overview/a.md': doc() } });
  const idx = path.join(root, 'knowledge/INDEX.md');
  fs.writeFileSync(idx, 'sửa tay');
  const res = hook('post-tool-use', { tool_name: 'Edit', tool_input: { file_path: idx } }, { root });
  assert.equal(res.code, 2);
  assert.match(fs.readFileSync(idx, 'utf8'), /AUTO-GENERATED/);
  assert.equal(hook('post-tool-use', { tool_name: 'Write', tool_input: { file_path: path.join(root, 'README.md') } }, { root }).code, 0);
});

test('Stop: làm việc thật mà chưa nạp → block 1 lần với lý do; lần 2 (stop_hook_active) → cho dừng', () => {
  const { root } = makeRepo();
  const t = workSession(root, { tools: 3 });
  const input = { session_id: 'w1', transcript_path: t.file, stop_hook_active: false };
  const r1 = hook('stop', input, { root });
  const out = JSON.parse(r1.stdout);
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /kb-capture/);
  assert.match(out.reason, /3 thao tác/);
  t.tool('Bash', { command: 'node scripts/kb/cli.mjs skip "không có gì"' });
  const r2 = hook('stop', { ...input, stop_hook_active: true }, { root });
  assert.equal(r2.stdout.trim(), '');
  assert.equal(stateOf(root, 'w1').checkpoint, t.count);
});

test('Stop: không lặp nhắc cho cùng phần việc; việc mới sau đó mới nhắc lại', () => {
  const { root } = makeRepo();
  const t = workSession(root, { tools: 3 });
  const input = { session_id: 'w2', transcript_path: t.file, stop_hook_active: false };
  assert.equal(JSON.parse(hook('stop', input, { root }).stdout).decision, 'block');
  t.user('cảm ơn').assistant('ok');
  assert.equal(hook('stop', input, { root }).stdout.trim(), '', 'không nhắc lại cho việc cũ');
  t.user('làm tiếp').tool('Bash', { command: 'a' }).tool('Bash', { command: 'b' }).tool('WebFetch', { url: 'x' });
  assert.equal(JSON.parse(hook('stop', input, { root }).stdout).decision, 'block');
});

test('Stop: chat thuần / hỏi đáp → không chặn; việc nhỏ tích luỹ qua nhiều lượt rồi mới nhắc', () => {
  const { root } = makeRepo();
  const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t.user('CPI là gì').assistant('...');
  const input = { session_id: 'w3', transcript_path: t.file, stop_hook_active: false };
  assert.equal(hook('stop', input, { root }).stdout.trim(), '');
  t.user('chạy giúp lệnh').tool('Bash', { command: 'a' }).assistant('xong');
  assert.equal(hook('stop', input, { root }).stdout.trim(), '');
  t.user('thêm').tool('Bash', { command: 'b' }).tool('Read', { file_path: '/x/src/r.kt' }).assistant('xong');
  assert.equal(JSON.parse(hook('stop', input, { root }).stdout).decision, 'block');
});

test('Stop: đã nạp trong lượt (ghi knowledge/) → không chặn; có ảnh → chặn ngay', () => {
  const { root } = makeRepo();
  const t = workSession(root, { tools: 5 });
  t.tool('Write', { file_path: path.join(root, 'knowledge/lessons/a.md'), content: 'x' });
  assert.equal(hook('stop', { session_id: 'w4', transcript_path: t.file }, { root }).stdout.trim(), '');
  const t2 = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t2.user('[Image #1] xem dashboard', [makePng()]).assistant('Đây là ...');
  assert.match(JSON.parse(hook('stop', { session_id: 'w5', transcript_path: t2.file }, { root }).stdout).reason, /1 ảnh/);
});

test('Stop: trong agent nền (KB_BACKGROUND=1) không bao giờ chặn', () => {
  const { root } = makeRepo();
  const t = workSession(root, { images: 2, tools: 5 });
  assert.equal(hook('stop', { session_id: 'w6', transcript_path: t.file }, { root, env: { KB_BACKGROUND: '1' } }).stdout.trim(), '');
});

test('Stop: knowledge còn thay đổi chưa commit → auto-commit nền', async () => {
  const { root, git } = makeRepo();
  fs.mkdirSync(path.join(root, 'knowledge/00-overview'), { recursive: true });
  fs.writeFileSync(path.join(root, 'knowledge/00-overview/a.md'), doc());
  const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t.user('hi').tool('Write', { file_path: path.join(root, 'knowledge/00-overview/a.md') });
  hook('stop', { session_id: 'w7', transcript_path: t.file }, { root });
  assert.ok(await waitFor(() => /auto-commit/.test(git('log', '-1', '--format=%s'))), 'phải có commit auto');
  assert.equal(git('status', '--porcelain', '--', 'knowledge').trim(), '');
});

test('SessionEnd → background-capture: gọi claude khi có việc chưa nạp, rồi commit kết quả', async () => {
  const { root, git } = makeRepo();
  const t = workSession(root, { images: 1, tools: 3 });
  // claude giả: ghi 1 lesson, in JSON như --output-format json
  const fake = path.join(tmpDir(), 'fake-claude.mjs');
  fs.writeFileSync(fake, `#!/usr/bin/env node
import fs from 'node:fs';
const args = process.argv.slice(2);
fs.writeFileSync(process.cwd() + '/.claude/state/fake-args.json', JSON.stringify({ args, bg: process.env.KB_BACKGROUND }));
fs.mkdirSync('knowledge/lessons', { recursive: true });
fs.writeFileSync('knowledge/lessons/2026-10-bg.md', ${JSON.stringify(doc({ type: 'lesson', topic: 'lessons', title: 'BG' }))});
console.log(JSON.stringify({ result: 'knowledge/lessons/2026-10-bg.md', total_cost_usd: 0.01, num_turns: 3 }));
`);
  fs.chmodSync(fake, 0o755);
  const res = hook('session-end', { session_id: 'e1', transcript_path: t.file, hook_event_name: 'SessionEnd', reason: 'prompt_input_exit' }, { root, env: { KB_CLAUDE_BIN: fake } });
  assert.equal(res.code, 0);
  assert.ok(await waitFor(() => /nạp nền từ session e1/.test(git('log', '-1', '--format=%s')), 20000), fs.existsSync(path.join(root, '.claude/state/logs/background-capture.log')) ? fs.readFileSync(path.join(root, '.claude/state/logs/background-capture.log'), 'utf8') : 'no log');
  const fa = JSON.parse(fs.readFileSync(path.join(root, '.claude/state/fake-args.json'), 'utf8'));
  assert.equal(fa.bg, '1', 'agent nền phải chạy với KB_BACKGROUND=1 (chống đệ quy)');
  assert.ok(fa.args.includes('acceptEdits'));
  const prompt = fa.args[fa.args.indexOf('-p') + 1];
  const digestFile = /Đọc file digest session: (\S+)/.exec(prompt)[1];
  assert.match(fs.readFileSync(digestFile, 'utf8'), /\[ẢNH #1 do user dán/);
  assert.equal(stateOf(root, 'e1').checkpoint, t.count);
  assert.equal(stateOf(root, 'e1').backgroundRuns.length, 1);
});

test('SessionEnd → background-capture: không có việc chưa nạp → không gọi claude', async () => {
  const { root } = makeRepo();
  const t = workSession(root, { tools: 3 });
  t.tool('Bash', { command: 'node scripts/kb/cli.mjs skip "x"' });
  const fake = path.join(tmpDir(), 'fake-claude.mjs');
  fs.writeFileSync(fake, `#!/usr/bin/env node\nrequire('fs').writeFileSync(${JSON.stringify(path.join(root, 'CALLED'))}, '1');`);
  fs.chmodSync(fake, 0o755);
  hook('session-end', { session_id: 'e2', transcript_path: t.file, hook_event_name: 'SessionEnd' }, { root, env: { KB_CLAUDE_BIN: fake } });
  const log = path.join(root, '.claude/state/logs/background-capture.log');
  assert.ok(await waitFor(() => fs.existsSync(log) && /không cần nạp/.test(fs.readFileSync(log, 'utf8'))), 'phải log "không cần nạp"');
  assert.ok(!fs.existsSync(path.join(root, 'CALLED')));
});

test('PreCompact rồi SessionEnd: cùng một đoạn transcript chỉ được agent nền xử lý 1 lần', async () => {
  const { root } = makeRepo();
  const t = workSession(root, { tools: 4 });
  const counter = path.join(root, 'calls.txt');
  const fake = path.join(tmpDir(), 'fake-claude.mjs');
  fs.writeFileSync(fake, `#!/usr/bin/env node\nimport fs from 'node:fs'; fs.appendFileSync(${JSON.stringify(counter)}, 'x'); console.log('{}');`);
  fs.chmodSync(fake, 0o755);
  hook('session-end', { session_id: 'e3', transcript_path: t.file, hook_event_name: 'PreCompact', trigger: 'auto' }, { root, env: { KB_CLAUDE_BIN: fake } });
  hook('session-end', { session_id: 'e3', transcript_path: t.file, hook_event_name: 'SessionEnd' }, { root, env: { KB_CLAUDE_BIN: fake } });
  const log = path.join(root, '.claude/state/logs/background-capture.log');
  assert.ok(await waitFor(() => fs.existsSync(log) && (fs.readFileSync(log, 'utf8').match(/\] (không cần nạp|claude exit)/g) || []).length >= 2, 20000), 'cả 2 tiến trình phải chạy xong');
  assert.equal(fs.readFileSync(counter, 'utf8'), 'x', 'claude chỉ được gọi 1 lần');
});

test('run.mjs: chuyển tiếp tới hook thật; tên hook lạ → bỏ qua an toàn', () => {
  const { root } = makeRepo();
  const ok = run(path.join(HOOKS, 'run.mjs'), ['session-start'], { root, input: { session_id: 'r1', source: 'compact' } });
  assert.match(JSON.parse(ok.stdout).hookSpecificOutput.additionalContext, /Context vừa được nén/);
  const bad = run(path.join(HOOKS, 'run.mjs'), ['../../evil'], { root, input: {} });
  assert.equal(bad.code, 0);
  assert.equal(bad.stdout, '');
});

test('run.mjs: mọi hook đi qua bootstrap đều chạy thật và KHÔNG gọi npm khi đã có node_modules', () => {
  const { root } = makeRepo();
  // npm giả: nếu bị gọi sẽ để lại dấu vết
  const bin = tmpDir();
  const marker = path.join(bin, 'npm-called');
  fs.writeFileSync(path.join(bin, 'npm'), `#!/bin/sh\ntouch ${marker}\n`);
  fs.chmodSync(path.join(bin, 'npm'), 0o755);
  const env = { PATH: `${bin}:${process.env.PATH}` };
  const t = workSession(root, { tools: 4 });
  const stop = run(path.join(HOOKS, 'run.mjs'), ['stop'], { root, env, input: { session_id: 'rb', transcript_path: t.file } });
  assert.equal(JSON.parse(stop.stdout).decision, 'block', 'Stop qua run.mjs phải chạy thật');
  const f = path.join(root, 'knowledge/lessons/x.md');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, '---\ntitle: X\n---\nb');
  assert.equal(run(path.join(HOOKS, 'run.mjs'), ['post-tool-use'], { root, env, input: { tool_input: { file_path: f } } }).code, 2, 'PostToolUse qua run.mjs phải chạy thật');
  run(path.join(HOOKS, 'run.mjs'), ['session-start'], { root, env, input: { session_id: 'rb', source: 'startup' } });
  assert.ok(!fs.existsSync(marker), 'không được chạy npm khi node_modules đã có');
});
