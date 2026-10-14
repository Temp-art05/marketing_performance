// API media cho web: trạng thái, export (tải .tar), import (upload .tar). Gắn vào server.mjs như api-extra.
// Route stream thẳng ra/vào res/req nên trả null (đã tự trả lời).
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import { root, today } from '../scripts/kb/lib.mjs';
import { loadManifest, mediaStatus, importMedia, MANIFEST } from '../scripts/kb/media.mjs';

export function mediaRoutes({ scheduleCommit } = {}) {
  return {
    // { total, bytes, missing, untracked, byKind: {video:{n,bytes,present}, ...} }
    'GET /api/media/status': () => {
      const r = root();
      const st = mediaStatus({ r });
      const byKind = {};
      for (const [p, v] of Object.entries(loadManifest(r).files)) {
        const k = byKind[v.kind] ||= { n: 0, bytes: 0, present: 0 };
        k.n++; k.bytes += v.bytes || 0;
        if (fs.existsSync(path.join(r, p))) k.present++;
      }
      return [200, { ...st, byKind }];
    },

    // Tải gói media (manifest + mọi file đang có) dạng .tar, stream thẳng từ tar — không tạo file tạm.
    'GET /api/media/export': (q, req, res) => {
      const r = root();
      const files = Object.keys(loadManifest(r).files).filter(p => fs.existsSync(path.join(r, p)));
      const list = path.join(r, '.claude/state/media-export.list');
      fs.mkdirSync(path.dirname(list), { recursive: true });
      fs.writeFileSync(list, [MANIFEST, ...files].join('\n') + '\n');
      res.writeHead(200, {
        'Content-Type': 'application/x-tar',
        'Content-Disposition': `attachment; filename="kb-media-${today()}.tar"`,
      });
      const tar = spawn('tar', ['-cf', '-', '-C', r, '-T', list], { stdio: ['ignore', 'pipe', 'ignore'] });
      tar.stdout.pipe(res);
      req.on('close', () => tar.kill());
      return null;
    },

    // Nhận file .tar (body thô), ghi tạm vào .claude/state rồi importMedia (chỉ chép file có trong manifest, kiểm sha).
    'POST /api/media/import': async (q, req) => {
      const r = root();
      const dir = path.join(r, '.claude/state');
      fs.mkdirSync(dir, { recursive: true });
      const tmp = path.join(dir, `media-upload-${Date.now()}.tar`);
      try {
        await pipeline(req, fs.createWriteStream(tmp));
        if (!fs.statSync(tmp).size) return [400, { error: 'File rỗng' }];
        const readM = () => { try { return fs.readFileSync(path.join(r, MANIFEST), 'utf8'); } catch { return ''; } };
        const before = readM();
        const res = importMedia(tmp, { r });
        if (scheduleCommit && readM() !== before) scheduleCommit('kb(web): nhập media từ máy khác (manifest)');
        return [200, { ...res, status: mediaStatus({ r }) }];
      } catch (e) {
        return [400, { error: `Không nhập được: ${e.message.split('\n')[0]}` }];
      } finally {
        fs.rmSync(tmp, { force: true });
      }
    },
  };
}
