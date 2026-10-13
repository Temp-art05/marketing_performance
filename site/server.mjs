#!/usr/bin/env node
// Web app local xem/sửa knowledge. Đọc thẳng knowledge/ + assets/ mỗi request — sửa file là thấy ngay.
// Chạy: npm run web  (PORT mặc định 4321, chỉ nghe 127.0.0.1)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawn, execFileSync } from 'node:child_process';
import {
  root, listDocs, parseDoc, serializeDoc, lintDocs, writeIndex, newDoc, walk, today,
  TOPICS, TYPES, STATUSES, CONFIDENCES, KNOWLEDGE_DIR, SCREENSHOT_DIR, STATE_DIR, readJSON,
} from '../scripts/kb/lib.mjs';
import { saveImage, mdImagePath } from '../scripts/kb/images.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(HERE, 'public');
const NODE_MODULES = path.resolve(HERE, '..', 'node_modules');
const CLI = path.resolve(HERE, '..', 'scripts/kb/cli.mjs');

const VENDOR = {
  'marked.js': 'marked/lib/marked.esm.js',
  'purify.js': 'dompurify/dist/purify.es.mjs',
  'minisearch.js': 'minisearch/dist/es/index.js',
};
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon' };

const hash = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

// Chặn path traversal: rel phải nằm trong knowledge/ và là .md.
function safeDocPath(rel) {
  if (typeof rel !== 'string' || !rel.endsWith('.md') || rel.includes('\0')) return null;
  const kdir = path.join(root(), KNOWLEDGE_DIR);
  const abs = path.resolve(kdir, rel);
  if (!abs.startsWith(kdir + path.sep)) return null;
  if (path.relative(kdir, abs) === 'INDEX.md') return null;
  return abs;
}

function send(res, status, body, type = 'application/json') {
  const data = type === 'application/json' ? JSON.stringify(body) : body;
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(data);
}

async function readBody(req, limit = 20 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const c of req) { size += c.length; if (size > limit) throw Object.assign(new Error('Body quá lớn'), { status: 413 }); chunks.push(c); }
  return Buffer.concat(chunks);
}
const readJsonBody = async req => JSON.parse((await readBody(req)).toString('utf8') || '{}');

// ---------- git ----------

let commitTimer = null;
const pendingMessages = new Set();
let lastCommit = { at: null, ok: null, output: '' };

// Gom nhiều lần lưu liên tiếp thành 1 commit (debounce 4s), chạy CLI ở tiến trình con để không chặn server.
function scheduleCommit(message) {
  if (process.env.KB_WEB_NO_COMMIT === '1') return;
  pendingMessages.add(message);
  clearTimeout(commitTimer);
  commitTimer = setTimeout(() => {
    const msgs = [...pendingMessages];
    pendingMessages.clear();
    const msg = msgs.length === 1 ? msgs[0] : `kb(web): ${msgs.length} thay đổi\n\n${msgs.map(m => `- ${m.replace(/^kb\(web\): /, '')}`).join('\n')}`;
    const child = spawn(process.execPath, [CLI, 'commit', '-m', msg], { cwd: root(), env: process.env });
    let out = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { out += d; });
    child.on('close', code => { lastCommit = { at: new Date().toISOString(), ok: code === 0, output: out.trim() }; });
  }, Number(process.env.KB_WEB_COMMIT_DELAY ?? 4000));
}

function gitInfo() {
  const g = args => { try { return execFileSync('git', args, { cwd: root(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).trim(); } catch { return ''; } };
  const dirty = g(['status', '--porcelain', '--', 'knowledge', 'assets']).split('\n').filter(Boolean).length;
  return {
    dirty, pending: pendingMessages.size,
    ahead: Number(g(['rev-list', '--count', '@{u}..HEAD']) || 0),
    last: g(['log', '-1', '--format=%h %s (%cr)', '--', 'knowledge', 'assets']),
    lastCommit,
  };
}

// ---------- dữ liệu ----------

function docSummary(d) {
  const st = fs.statSync(d.abs);
  return { rel: d.rel, fm: d.fm, error: d.error ?? null, mtime: st.mtimeMs, words: d.body.split(/\s+/).filter(Boolean).length };
}

function allImages() {
  const docs = listDocs().filter(d => !d.error);
  const usage = new Map();
  for (const d of docs) {
    const refs = new Set(Array.isArray(d.fm.images) ? d.fm.images : []);
    for (const m of d.body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
      if (/^https?:/.test(m[1])) continue;
      refs.add(path.posix.normalize(path.posix.join('knowledge', path.posix.dirname(d.rel), decodeURI(m[1]))));
    }
    for (const r of refs) { if (!usage.has(r)) usage.set(r, []); usage.get(r).push({ rel: d.rel, title: d.fm.title, app: d.fm.app, topic: d.fm.topic }); }
  }
  const manifest = readJSON(path.join(root(), 'assets/manifest.json'), {});
  const bySavedPath = new Map(Object.values(manifest).map(m => [m.path, m]));
  return walk(path.join(root(), SCREENSHOT_DIR), p => /\.(png|jpe?g|gif|webp)$/i.test(p)).map(abs => {
    const rel = path.relative(root(), abs).split(path.sep).join('/');
    const m = /(\d{4}-\d{2}-\d{2})-/.exec(path.basename(abs));
    return { path: rel, date: m?.[1] ?? null, bytes: fs.statSync(abs).size, docs: usage.get(rel) ?? [], source: bySavedPath.get(rel)?.source ?? null };
  }).sort((a, b) => String(b.date).localeCompare(String(a.date)) || b.path.localeCompare(a.path));
}

function saveDocFile(abs, rel, fm, body, { baseHash, force } = {}) {
  if (fs.existsSync(abs) && baseHash && !force) {
    const cur = hash(fs.readFileSync(abs, 'utf8'));
    if (cur !== baseHash) return { status: 409, body: { error: 'Tài liệu vừa bị sửa ở nơi khác (Claude hoặc tab khác). Tải lại để xem bản mới, hoặc lưu đè.' } };
  }
  const prev = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  fm = { ...fm, topic: path.posix.dirname(rel) === '.' ? '' : path.posix.dirname(rel) };
  if (!fm.created) fm.created = today();
  fm.updated = today();
  const text = serializeDoc(fm, body);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text);
  const { errors, warnings } = lintDocs(root(), [rel]);
  if (errors.length) {
    if (prev === null) fs.rmSync(abs); else fs.writeFileSync(abs, prev);
    return { status: 422, body: { error: 'Tài liệu chưa hợp lệ, chưa lưu.', errors: errors.map(e => e.msg), warnings: warnings.map(w => w.msg) } };
  }
  writeIndex();
  return { status: 200, body: { ok: true, rel, hash: hash(text), warnings: warnings.map(w => w.msg) } };
}

// ---------- routes ----------

const routes = {
  'GET /api/meta': () => {
    const docs = listDocs();
    const apps = [...new Set(docs.map(d => d.fm.app).filter(a => a && a !== 'general'))].sort();
    const tags = {};
    for (const d of docs) for (const t of d.fm.tags ?? []) tags[t] = (tags[t] ?? 0) + 1;
    const topics = [...new Set([...Object.keys(TOPICS), ...docs.map(d => path.posix.dirname(d.rel))])].filter(t => t !== '.').sort();
    return [200, { topics: TOPICS, allTopics: topics, types: TYPES, statuses: STATUSES, confidences: CONFIDENCES, apps, tags, git: gitInfo(), today: today() }];
  },
  'GET /api/docs': (q) => {
    const full = q.get('full') === '1';
    return [200, listDocs().map(d => ({ ...docSummary(d), ...(full ? { body: d.body } : {}) }))];
  },
  'GET /api/doc': (q) => {
    const rel = q.get('rel');
    const abs = safeDocPath(rel);
    if (!abs || !fs.existsSync(abs)) return [404, { error: 'Không tìm thấy tài liệu' }];
    const raw = fs.readFileSync(abs, 'utf8');
    const { fm, body, error } = parseDoc(raw);
    return [200, { rel, fm: fm ?? {}, body, raw, error: error ?? null, hash: hash(raw) }];
  },
  'PUT /api/doc': async (q, req) => {
    const { rel, fm, body, baseHash, force } = await readJsonBody(req);
    const abs = safeDocPath(rel);
    if (!abs || !fs.existsSync(abs)) return [404, { error: 'Không tìm thấy tài liệu' }];
    const r = saveDocFile(abs, rel, fm, body, { baseHash, force });
    if (r.status === 200) scheduleCommit(`kb(web): cập nhật ${rel}`);
    return [r.status, r.body];
  },
  'PUT /api/raw': async (q, req) => {
    // Sửa nguyên văn (frontmatter + body) — cho người quen Markdown.
    const { rel, raw, baseHash, force } = await readJsonBody(req);
    const abs = safeDocPath(rel);
    if (!abs || !fs.existsSync(abs)) return [404, { error: 'Không tìm thấy tài liệu' }];
    const { fm, body, error } = parseDoc(String(raw));
    if (error) return [422, { error, errors: [error] }];
    const r = saveDocFile(abs, rel, fm, body, { baseHash, force });
    if (r.status === 200) scheduleCommit(`kb(web): cập nhật ${rel}`);
    return [r.status, r.body];
  },
  'POST /api/doc': async (q, req) => {
    const { topic, title, type, summary, app, tags, body, fm: extra } = await readJsonBody(req);
    if (!topic || !title) return [400, { error: 'Cần topic và title' }];
    if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(topic) || !(topic.split('/')[0] in TOPICS)) return [400, { error: `Topic không hợp lệ: ${topic}` }];
    let created;
    try { created = newDoc({ topic, title, type: type || 'concept', summary, app: app || 'general', tags: tags || [], sources: extra?.sources ?? ['nhập tay trên web'] }); }
    catch (e) { return [409, { error: e.message }]; }
    const { fm } = parseDoc(fs.readFileSync(created.abs, 'utf8'));
    const r = saveDocFile(created.abs, created.rel, { ...fm, ...(extra ?? {}), title, type: type || fm.type }, body || `# ${title}\n`, {});
    if (r.status !== 200) { if (fs.existsSync(created.abs)) fs.rmSync(created.abs); return [r.status, r.body]; }
    scheduleCommit(`kb(web): tạo ${created.rel}`);
    return [201, r.body];
  },
  'DELETE /api/doc': (q) => {
    const rel = q.get('rel');
    const abs = safeDocPath(rel);
    if (!abs || !fs.existsSync(abs)) return [404, { error: 'Không tìm thấy tài liệu' }];
    const refs = listDocs().filter(d => d.rel !== rel && (d.fm.related ?? []).includes(rel)).map(d => d.rel);
    fs.rmSync(abs);
    writeIndex();
    scheduleCommit(`kb(web): xoá ${rel}`);
    return [200, { ok: true, brokenRelated: refs }];
  },
  'POST /api/upload': async (q, req) => {
    const buf = await readBody(req);
    const mediaType = String(req.headers['content-type'] || '').split(';')[0];
    if (!/^image\/(png|jpeg|gif|webp)$/.test(mediaType)) return [415, { error: `Chỉ nhận ảnh png/jpeg/gif/webp (nhận: ${mediaType || 'không rõ'})` }];
    if (!buf.length) return [400, { error: 'Ảnh rỗng' }];
    const slug = q.get('slug') || path.parse(decodeURIComponent(String(req.headers['x-filename'] || 'screenshot'))).name;
    const res = saveImage(buf, { slug, mediaType, source: 'web upload' });
    const doc = q.get('doc');
    return [200, { ...res, md: doc ? mdImagePath(res.path, doc) : null }];
  },
  'GET /api/images': () => [200, allImages()],
  'POST /api/check': async (q, req) => {
    // Bật/tắt checkbox "- [ ]" ở dòng `line` (0-based trong body) của tài liệu.
    const { rel, index, checked } = await readJsonBody(req);
    const abs = safeDocPath(rel);
    if (!abs || !fs.existsSync(abs)) return [404, { error: 'Không tìm thấy tài liệu' }];
    const raw = fs.readFileSync(abs, 'utf8');
    const { fm, body } = parseDoc(raw);
    let i = -1;
    const next = body.replace(/^(\s*[-*] )\[( |x|X)\]/gm, (m, pre) => (++i === index ? `${pre}[${checked ? 'x' : ' '}]` : m));
    if (i < index) return [400, { error: 'Không tìm thấy checkbox' }];
    const r = saveDocFile(abs, rel, fm, next, {});
    if (r.status === 200) scheduleCommit(`kb(web): ${checked ? 'hoàn thành' : 'bỏ đánh dấu'} mục roadmap trong ${rel}`);
    return [r.status, r.body];
  },
  'POST /api/commit': () => { scheduleCommit('kb(web): commit thủ công'); return [200, { ok: true }]; },
};

async function serveStatic(res, file) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return send(res, 404, 'Not found', 'text/plain');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
}

export function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const p = decodeURIComponent(url.pathname);
    try {
      const route = routes[`${req.method} ${p}`];
      if (route) {
        const [status, body] = await route(url.searchParams, req);
        return send(res, status, body);
      }
      if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
      if (p.startsWith('/vendor/')) {
        const v = VENDOR[p.slice(8)];
        return v ? serveStatic(res, path.join(NODE_MODULES, v)) : send(res, 404, 'Not found', 'text/plain');
      }
      if (p.startsWith('/assets/')) {
        const abs = path.resolve(root(), '.' + p);
        if (!abs.startsWith(path.join(root(), 'assets') + path.sep)) return send(res, 403, 'Forbidden', 'text/plain');
        return serveStatic(res, abs);
      }
      const file = path.resolve(PUBLIC, '.' + (p === '/' ? '/index.html' : p));
      if (!file.startsWith(PUBLIC + path.sep)) return send(res, 403, 'Forbidden', 'text/plain');
      return serveStatic(res, fs.existsSync(file) ? file : path.join(PUBLIC, 'index.html'));
    } catch (e) {
      return send(res, e.status || 500, { error: e.message });
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4321);
  createServer().listen(port, '127.0.0.1', () => {
    console.log(`Knowledge web: http://localhost:${port}  (repo: ${root()})`);
  });
}
