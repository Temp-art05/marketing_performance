// Lưu screenshot vào assets/screenshots/YYYY-MM/, nén bằng sips (macOS), chống trùng bằng sha256.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { root, SCREENSHOT_DIR, ASSETS_DIR, slugify, today, readJSON, writeJSON } from './lib.mjs';

const MAX_DIM = 1600;
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp' };

const manifestPath = r => path.join(r, ASSETS_DIR, 'manifest.json');

export function imageSize(buf) {
  // PNG: IHDR ở byte 16; JPEG: quét marker SOF.
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1], len = buf.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  return null;
}

function resize(file) {
  if (process.platform !== 'darwin') return false;
  try {
    const size = imageSize(fs.readFileSync(file));
    if (size && Math.max(size.w, size.h) <= MAX_DIM) return false;
    execFileSync('sips', ['-Z', String(MAX_DIM), file], { stdio: 'ignore', timeout: 30000 });
    return true;
  } catch { return false; }
}

// Lưu 1 ảnh (buffer). Trả về { path (tương đối repo), duplicate, resized }.
export function saveImage(buf, { slug, mediaType = 'image/png', date = today(), r = root(), source = null }) {
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  const manifest = readJSON(manifestPath(r), {});
  if (manifest[hash] && fs.existsSync(path.join(r, manifest[hash].path))) return { path: manifest[hash].path, duplicate: true, resized: false };
  const ext = EXT[mediaType] || 'png';
  const dir = path.join(r, SCREENSHOT_DIR, date.slice(0, 7));
  fs.mkdirSync(dir, { recursive: true });
  const base = `${date}-${slugify(slug || 'screenshot')}`;
  let n = 1, file;
  do { file = path.join(dir, `${base}-${n}.${ext}`); n++; } while (fs.existsSync(file));
  fs.writeFileSync(file, buf);
  const resized = resize(file);
  const rel = path.relative(r, file).split(path.sep).join('/');
  manifest[hash] = { path: rel, savedAt: new Date().toISOString(), ...(source ? { source } : {}) };
  writeJSON(manifestPath(r), manifest);
  return { path: rel, duplicate: false, resized };
}

export function importImageFile(src, opts) {
  const ext = path.extname(src).toLowerCase().slice(1);
  const mediaType = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' }[ext];
  if (!mediaType) throw new Error(`Định dạng ảnh không hỗ trợ: ${src}`);
  return saveImage(fs.readFileSync(src), { ...opts, mediaType, source: opts.source ?? path.basename(src) });
}

// Đường dẫn ảnh dùng trong Markdown của 1 tài liệu (tương đối từ file .md).
export function mdImagePath(imgRel, docRel) {
  return path.posix.relative(path.posix.join('knowledge', path.posix.dirname(docRel)), imgRel);
}
