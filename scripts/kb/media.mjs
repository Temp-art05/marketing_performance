// Media nặng (video, ảnh lớn, file mẫu) nằm ở media/ — KHÔNG commit, chỉ commit media/manifest.json.
// Chuyển giữa các máy bằng `kb media export` / `kb media import`.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { root, slugify, today, readJSON, writeJSON, walk } from './lib.mjs';

export const MEDIA_DIR = 'media';
export const MANIFEST = 'media/manifest.json';
const VIDEO = /\.(mp4|mov|webm|m4v)$/i;
const IMAGE = /\.(png|jpe?g|gif|webp)$/i;

export const isVideo = p => VIDEO.test(p);
const manifestPath = r => path.join(r, MANIFEST);
export const loadManifest = (r = root()) => readJSON(manifestPath(r), { version: 1, files: {} });
const saveManifest = (r, m) => writeJSON(manifestPath(r), m);

function sha256File(file) {
  const h = crypto.createHash('sha256');
  const fd = fs.openSync(file, 'r');
  const buf = Buffer.alloc(1 << 20);
  let n;
  while ((n = fs.readSync(fd, buf, 0, buf.length, null)) > 0) h.update(buf.subarray(0, n));
  fs.closeSync(fd);
  return h.digest('hex');
}

// Copy 1 file vào media/YYYY-MM/<date>-<slug>-<n>.<ext>. Trùng nội dung (sha) → dùng lại.
export function addMedia(src, { slug, date = today(), source = null, r = root() } = {}) {
  if (!fs.existsSync(src)) throw new Error(`Không thấy file: ${src}`);
  const sha = sha256File(src);
  const m = loadManifest(r);
  const hit = Object.entries(m.files).find(([, v]) => v.sha256 === sha);
  if (hit) return { path: hit[0], duplicate: true };
  const ext = path.extname(src).toLowerCase() || '.bin';
  const dir = path.join(r, MEDIA_DIR, date.slice(0, 7));
  fs.mkdirSync(dir, { recursive: true });
  const base = `${date}-${slugify(slug || path.parse(src).name)}`;
  let n = 1, dest;
  do { dest = path.join(dir, `${base}-${n}${ext}`); n++; } while (fs.existsSync(dest));
  fs.copyFileSync(src, dest);
  const rel = path.relative(r, dest).split(path.sep).join('/');
  m.files[rel] = { sha256: sha, bytes: fs.statSync(dest).size, kind: VIDEO.test(ext) ? 'video' : IMAGE.test(ext) ? 'image' : 'file', source, addedAt: new Date().toISOString() };
  saveManifest(r, m);
  return { path: rel, duplicate: false };
}

// So manifest với đĩa: missing (manifest có, đĩa không), untracked (đĩa có, manifest không), corrupt (sha lệch, chỉ khi verify).
export function mediaStatus({ r = root(), verify = false } = {}) {
  const m = loadManifest(r);
  const onDisk = walk(path.join(r, MEDIA_DIR), p => !p.endsWith('manifest.json')).map(p => path.relative(r, p).split(path.sep).join('/'));
  const missing = Object.keys(m.files).filter(p => !fs.existsSync(path.join(r, p)));
  const untracked = onDisk.filter(p => !m.files[p]);
  const corrupt = verify ? Object.entries(m.files).filter(([p, v]) => fs.existsSync(path.join(r, p)) && sha256File(path.join(r, p)) !== v.sha256).map(([p]) => p) : [];
  const bytes = Object.values(m.files).reduce((s, v) => s + (v.bytes || 0), 0);
  return { total: Object.keys(m.files).length, bytes, missing, untracked, corrupt };
}

// Đóng gói media/ (kèm manifest) thành 1 file .tar để chép sang máy khác (USB, Drive...).
export function exportMedia(out, { r = root() } = {}) {
  const files = Object.keys(loadManifest(r).files).filter(p => fs.existsSync(path.join(r, p)));
  const list = path.join(r, '.claude/state/media-export.list');
  fs.mkdirSync(path.dirname(list), { recursive: true });
  fs.writeFileSync(list, [MANIFEST, ...files].join('\n') + '\n');
  const target = path.resolve(out);
  execFileSync('tar', ['-cf', target, '-C', r, '-T', list], { stdio: 'ignore', maxBuffer: 1 << 26 });
  return { out: target, files: files.length, bytes: fs.statSync(target).size };
}

// Nhập từ file .tar (do export tạo) hoặc từ 1 thư mục repo/media khác. Chỉ ghi file có trong manifest, kiểm sha.
export function importMedia(src, { r = root() } = {}) {
  const abs = path.resolve(src);
  let fromRoot = abs, tmp = null;
  if (fs.statSync(abs).isFile()) {
    fs.mkdirSync(path.join(r, '.claude/state'), { recursive: true });
    tmp = fs.mkdtempSync(path.join(r, '.claude/state/media-import-'));
    execFileSync('tar', ['-xf', abs, '-C', tmp], { stdio: 'ignore' });
    fromRoot = tmp;
  } else if (path.basename(abs) === MEDIA_DIR) fromRoot = path.dirname(abs);
  const ours = loadManifest(r);
  const theirs = readJSON(path.join(fromRoot, MANIFEST), { files: {} });
  // Gộp manifest: entry mới từ máy kia được thêm vào
  for (const [p, v] of Object.entries(theirs.files)) if (!ours.files[p]) ours.files[p] = v;
  const res = { copied: 0, skipped: 0, bad: [] };
  for (const [p, v] of Object.entries(ours.files)) {
    const dest = path.join(r, p), from = path.join(fromRoot, p);
    if (fs.existsSync(dest)) { res.skipped++; continue; }
    if (!fs.existsSync(from)) continue;
    if (sha256File(from) !== v.sha256) { res.bad.push(p); continue; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(from, dest);
    res.copied++;
  }
  saveManifest(r, ours);
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  return res;
}

// ---------- kho bí mật (credential nội bộ) ----------
// Nằm trong media/secrets/ → KHÔNG lên git, đi theo gói media export/import. Tài liệu knowledge chỉ link tới đây.
export const SECRETS_DIR = 'media/secrets';

export function addSecret(slug, content, { source = null, title = null, r = root() } = {}) {
  const s = slugify(slug);
  const rel = `${SECRETS_DIR}/${s}.md`;
  const abs = path.join(r, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const head = `# ${title || s}\n\n> 🔑 Credential nội bộ — KHÔNG đưa vào knowledge/ hay git. Nguồn: ${source ?? '-'} · cập nhật ${today()}\n\n`;
  fs.writeFileSync(abs, head + String(content).trimEnd() + '\n', { mode: 0o600 });
  const m = loadManifest(r);
  m.files[rel] = { sha256: sha256File(abs), bytes: fs.statSync(abs).size, kind: 'secret', source, addedAt: new Date().toISOString() };
  saveManifest(r, m);
  return { path: rel };
}

export function listSecrets(r = root()) {
  return Object.entries(loadManifest(r).files).filter(([, v]) => v.kind === 'secret').map(([p, v]) => ({ path: p, source: v.source, present: fs.existsSync(path.join(r, p)) }));
}
