// Helper test: tạo repo knowledge tạm, transcript giả, chạy CLI/hook như tiến trình con.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CLI = path.join(REPO, 'scripts/kb/cli.mjs');
export const HOOKS = path.join(REPO, 'scripts/kb/hooks');

export function tmpDir(prefix = 'kbtest-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function doc({ title = 'Tài liệu mẫu', type = 'concept', topic = '00-overview', status = 'draft', summary = 'Tóm tắt mẫu', extra = '', body = '# Nội dung\n' } = {}) {
  return `---\ntitle: ${title}\ntype: ${type}\ntopic: ${topic}\ntags: [test]\napp: general\nstatus: ${status}\nconfidence: medium\nsources: ["test"]\ncreated: 2026-10-01\nupdated: 2026-10-02\nsummary: ${summary}\n${extra}---\n\n${body}`;
}

// Repo tạm có git + (tuỳ chọn) remote bare để test push.
export function makeRepo({ docs = {}, remote = false } = {}) {
  const r = tmpDir();
  for (const [rel, text] of Object.entries(docs)) {
    const p = path.join(r, 'knowledge', rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, text);
  }
  fs.mkdirSync(path.join(r, 'knowledge'), { recursive: true });
  fs.writeFileSync(path.join(r, '.gitignore'), '.claude/state/\n');
  const g = (...a) => execFileSync('git', a, { cwd: r, stdio: 'pipe', encoding: 'utf8' });
  g('init', '-q', '-b', 'main');
  g('config', 'user.email', 't@t');
  g('config', 'user.name', 't');
  g('add', '-A');
  g('commit', '-qm', 'init', '--allow-empty');
  let bare = null;
  if (remote) {
    bare = tmpDir('kbremote-');
    execFileSync('git', ['init', '-q', '--bare', '-b', 'main', bare]);
    g('remote', 'add', 'origin', bare);
    g('push', '-q', '-u', 'origin', 'main');
  }
  return { root: r, bare, git: g };
}

export function run(script, args = [], { root, input, env = {} } = {}) {
  const res = spawnSync(process.execPath, [script, ...args], {
    input: typeof input === 'string' ? input : input ? JSON.stringify(input) : '',
    encoding: 'utf8',
    env: { ...process.env, KB_ROOT: root, KB_NO_PUSH: '1', KB_BACKGROUND: '', CLAUDE_ENV_FILE: '', ...env },
    cwd: root,
  });
  return { code: res.status, stdout: res.stdout, stderr: res.stderr };
}

export const cli = (args, opts) => run(CLI, args, opts);
export const hook = (name, input, opts) => run(path.join(HOOKS, `${name}.mjs`), [], { ...opts, input });

// PNG thật kích thước w×h (màu đơn), để test lưu/resize ảnh.
export function makePng(w = 4, h = 3, rgb = [200, 30, 30]) {
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = b => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) raw.set(rgb, y * (w * 3 + 1) + 1 + x * 3);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

// Builder transcript JSONL giống định dạng thật của Claude Code.
export class Transcript {
  constructor(file) { this.file = file; this.lines = []; }
  user(text, images = []) {
    const content = [{ type: 'text', text }, ...images.map(b => ({ type: 'image', source: { type: 'base64', media_type: 'image/png', data: b.toString('base64') } }))];
    return this.add({ type: 'user', timestamp: '2026-10-14T10:00:00.000Z', message: { role: 'user', content } });
  }
  assistant(text) { return this.add({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text }] } }); }
  tool(name, input, result = 'ok') {
    const id = `tu_${this.lines.length}`;
    this.add({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] } });
    return this.add({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: result }] } });
  }
  meta() { return this.add({ type: 'system', subtype: 'x' }); }
  add(o) { this.lines.push(JSON.stringify(o)); this.save(); return this; }
  save() { fs.writeFileSync(this.file, this.lines.join('\n') + '\n'); return this; }
  get count() { return this.lines.length; }
}
