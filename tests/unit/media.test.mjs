// Media nặng ngoài git: add / status / export / import giữa 2 "máy", lint với media thiếu.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { addMedia, mediaStatus, exportMedia, importMedia, loadManifest, addSecret, listSecrets } from '../../scripts/kb/media.mjs';
import { lintDocs } from '../../scripts/kb/lib.mjs';
import { makeRepo, doc, tmpDir, cli } from '../helpers.mjs';

const fakeVideo = (n = 2048, seed = 1) => { const b = Buffer.alloc(n); for (let i = 0; i < n; i++) b[i] = (i * seed) % 251; return b; };

test('addMedia: copy vào media/YYYY-MM, manifest có sha/bytes/kind, chống trùng', () => {
  const { root } = makeRepo();
  const src = path.join(tmpDir(), 'demo.mp4');
  fs.writeFileSync(src, fakeVideo());
  const a = addMedia(src, { slug: 'Demo tool', date: '2026-10-14', r: root });
  assert.equal(a.path, 'media/2026-10/2026-10-14-demo-tool-1.mp4');
  const m = loadManifest(root).files[a.path];
  assert.equal(m.kind, 'video');
  assert.equal(m.bytes, 2048);
  assert.match(m.sha256, /^[0-9a-f]{64}$/);
  assert.equal(addMedia(src, { slug: 'khác', r: root }).duplicate, true);
});

test('gitignore: file media không vào git, manifest thì có', () => {
  const { root, git } = makeRepo();
  fs.writeFileSync(path.join(root, '.gitignore'), fs.readFileSync(path.resolve('.gitignore'), 'utf8'));
  const src = path.join(tmpDir(), 'v.mp4'); fs.writeFileSync(src, fakeVideo(100));
  const a = addMedia(src, { slug: 'v', r: root });
  git('add', '-A');
  const staged = git('diff', '--cached', '--name-only');
  assert.match(staged, /media\/manifest\.json/);
  assert.doesNotMatch(staged, new RegExp(a.path.replace(/\./g, '\\.')));
});

test('export → import sang máy khác: chép đủ, kiểm sha, gộp manifest; status thấy thiếu trước khi import', () => {
  const A = makeRepo().root, B = makeRepo().root;
  const v1 = path.join(tmpDir(), 'a.mp4'); fs.writeFileSync(v1, fakeVideo(4096, 3));
  const v2 = path.join(tmpDir(), 'b.png'); fs.writeFileSync(v2, fakeVideo(512, 7));
  const p1 = addMedia(v1, { slug: 'a', r: A }).path;
  addMedia(v2, { slug: 'b', r: A });
  // máy B có manifest (qua git) nhưng chưa có file
  fs.mkdirSync(path.join(B, 'media'), { recursive: true });
  fs.copyFileSync(path.join(A, 'media/manifest.json'), path.join(B, 'media/manifest.json'));
  assert.equal(mediaStatus({ r: B }).missing.length, 2);
  const out = path.join(tmpDir(), 'pack.tar');
  const ex = exportMedia(out, { r: A });
  assert.equal(ex.files, 2);
  const im = importMedia(out, { r: B });
  assert.equal(im.copied, 2);
  assert.deepEqual(mediaStatus({ r: B, verify: true }), { ...mediaStatus({ r: B, verify: true }), missing: [], corrupt: [] });
  assert.deepEqual(fs.readFileSync(path.join(B, p1)), fs.readFileSync(v1));
  assert.equal(importMedia(out, { r: B }).skipped, 2, 'import lại không chép đè');
});

test('import từ thư mục media của repo khác + bỏ file hỏng (sha lệch)', () => {
  const A = makeRepo().root, B = makeRepo().root;
  const v = path.join(tmpDir(), 'c.mp4'); fs.writeFileSync(v, fakeVideo(300, 5));
  const p = addMedia(v, { slug: 'c', r: A }).path;
  fs.appendFileSync(path.join(A, p), 'corrupt');
  const r = importMedia(path.join(A, 'media'), { r: B });
  assert.deepEqual(r.bad, [p]);
  assert.ok(!fs.existsSync(path.join(B, p)));
  assert.ok(loadManifest(B).files[p], 'manifest vẫn được gộp');
});

test('lint: media có trong manifest nhưng thiếu trên máy → cảnh báo; không có trong manifest → lỗi; video link được kiểm', () => {
  const { root } = makeRepo();
  const v = path.join(tmpDir(), 'd.mp4'); fs.writeFileSync(v, fakeVideo(64, 9));
  const p = addMedia(v, { slug: 'd', r: root }).path;
  fs.mkdirSync(path.join(root, 'knowledge/06-tools'), { recursive: true });
  fs.writeFileSync(path.join(root, 'knowledge/06-tools/t.md'), doc({ topic: '06-tools', type: 'reference', body: `[▶ demo](../../${p})\n![ảnh](../../${p})\n` }));
  assert.deepEqual(lintDocs(root).errors, []);
  fs.rmSync(path.join(root, p));
  const res = lintDocs(root);
  assert.deepEqual(res.errors, []);
  assert.match(res.warnings.map(w => w.msg).join(), /Media chưa có trên máy này/);
  fs.writeFileSync(path.join(root, 'knowledge/06-tools/u.md'), doc({ title: 'U', topic: '06-tools', type: 'reference', body: '[▶ x](../../media/2026-10/khong-dang-ky.mp4)\n' }));
  assert.match(lintDocs(root).errors.map(e => e.msg).join(), /chưa đăng ký trong media\/manifest\.json/);
});

test('CLI media add/status/export/import', () => {
  const A = makeRepo().root, B = makeRepo().root;
  const v = path.join(tmpDir(), 'e.mp4'); fs.writeFileSync(v, fakeVideo(128, 11));
  const add = cli(['media', 'add', v, '--slug', 'demo', '--doc', '06-tools/x.md'], { root: A });
  assert.match(add.stdout, /Đã thêm: media\/\d{4}-\d{2}\/\d{4}-\d{2}-\d{2}-demo-1\.mp4/);
  assert.match(add.stdout, /\[▶ mô tả video\]\(\.\.\/\.\.\/media\//);
  const out = path.join(tmpDir(), 'p.tar');
  assert.match(cli(['media', 'export', '--out', out], { root: A }).stdout, /Đã đóng gói 1 file/);
  assert.match(cli(['media', 'import', out], { root: B }).stdout, /Đã chép 1 file/);
  assert.match(cli(['media', 'status'], { root: B }).stdout, /Thiếu trên máy này: 0/);
});

test('secret: lưu vào media/secrets (ngoài git, có manifest kind=secret), tài liệu link tới được lint chấp nhận, đi theo export', () => {
  const A = makeRepo().root, B = makeRepo().root;
  const r = addSecret('APR-284 env', 'DATABASE_URL=postgres://u:p@h/db', { source: 'AI Knownledge/APR-284/Tool.zip', r: A });
  assert.equal(r.path, 'media/secrets/apr-284-env.md');
  assert.equal(listSecrets(A)[0].present, true);
  assert.equal((fs.statSync(path.join(A, r.path)).mode & 0o777), 0o600);
  fs.mkdirSync(path.join(A, 'knowledge/06-tools'), { recursive: true });
  fs.writeFileSync(path.join(A, 'knowledge/06-tools/t.md'), doc({ topic: '06-tools', type: 'reference', body: `[🔑 credential](../../${r.path})\n` }));
  assert.deepEqual(lintDocs(A).errors, []);
  const out = path.join(tmpDir(), 's.tar');
  exportMedia(out, { r: A });
  importMedia(out, { r: B });
  assert.match(fs.readFileSync(path.join(B, r.path), 'utf8'), /DATABASE_URL=postgres/);
  // máy chưa import: link vẫn chỉ cảnh báo
  fs.rmSync(path.join(A, r.path));
  assert.deepEqual(lintDocs(A).errors, []);
});
