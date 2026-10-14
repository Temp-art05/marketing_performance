// Web phục vụ media/ (video tua được nhờ Range), gallery có video, chặn path traversal.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeRepo, doc, tmpDir } from '../helpers.mjs';

const repo = makeRepo();
process.env.KB_ROOT = repo.root;
process.env.KB_WEB_NO_COMMIT = '1';
const { addMedia } = await import('../../scripts/kb/media.mjs');
const src = path.join(tmpDir(), 'demo.mp4');
fs.writeFileSync(src, Buffer.from(Array.from({ length: 1000 }, (_, i) => i % 256)));
const vid = addMedia(src, { slug: 'demo', r: repo.root }).path;
fs.mkdirSync(path.join(repo.root, 'knowledge/06-tools'), { recursive: true });
fs.writeFileSync(path.join(repo.root, 'knowledge/06-tools/demo.md'), doc({ topic: '06-tools', type: 'reference', title: 'Tool demo', body: `[▶ demo](../../${vid})\n` }));
const { createServer } = await import('../../site/server.mjs');
let server, base;
before(async () => { server = createServer(); await new Promise(r => server.listen(0, '127.0.0.1', r)); base = `http://127.0.0.1:${server.address().port}`; });
after(() => server.close());

test('GET /media/... trả video đủ + Range 206', async () => {
  const full = await fetch(`${base}/${vid}`);
  assert.equal(full.status, 200);
  assert.equal(full.headers.get('content-type'), 'video/mp4');
  assert.equal((await full.arrayBuffer()).byteLength, 1000);
  const part = await fetch(`${base}/${vid}`, { headers: { Range: 'bytes=100-199' } });
  assert.equal(part.status, 206);
  assert.equal(part.headers.get('content-range'), 'bytes 100-199/1000');
  const buf = Buffer.from(await part.arrayBuffer());
  assert.equal(buf.length, 100);
  assert.equal(buf[0], 100);
  assert.equal((await fetch(`${base}/${vid}`, { headers: { Range: 'bytes=5000-' } })).status, 416);
});

test('/api/images gồm video trong media/ kèm tài liệu dùng nó', async () => {
  const imgs = await (await fetch(`${base}/api/images`)).json();
  const v = imgs.find(i => i.path === vid);
  assert.equal(v.kind, 'video');
  assert.equal(v.inGit, false);
  assert.equal(v.docs[0].title, 'Tool demo');
});

test('chặn đọc ngoài media/', async () => {
  const r = await fetch(`${base}/media/%2e%2e/package.json`);
  assert.ok(!(await r.text()).includes('"name"'));
});

test('/api/media/status, export .tar rồi import sang repo khác', async () => {
  const st = await (await fetch(`${base}/api/media/status`)).json();
  assert.equal(st.total, 1);
  assert.equal(st.byKind.video.present, 1);
  const ex = await fetch(`${base}/api/media/export`);
  assert.equal(ex.status, 200);
  assert.match(ex.headers.get('content-disposition'), /kb-media-.*\.tar/);
  const tar = Buffer.from(await ex.arrayBuffer());
  assert.ok(tar.length > 1000);
  // Máy "mới": xoá video, import lại từ gói vừa tải
  fs.rmSync(path.join(repo.root, vid));
  assert.equal((await (await fetch(`${base}/api/media/status`)).json()).missing.length, 1);
  const im = await (await fetch(`${base}/api/media/import`, { method: 'POST', body: tar, headers: { 'Content-Type': 'application/x-tar' } })).json();
  assert.equal(im.copied, 1);
  assert.deepEqual(im.bad, []);
  assert.equal(im.status.missing.length, 0);
  assert.equal(fs.statSync(path.join(repo.root, vid)).size, 1000);
});

test('import file rác → 400, không làm hỏng media', async () => {
  const r = await fetch(`${base}/api/media/import`, { method: 'POST', body: 'không phải tar' });
  assert.equal(r.status, 400);
  assert.equal((await (await fetch(`${base}/api/media/status`)).json()).missing.length, 0);
});
