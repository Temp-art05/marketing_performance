// Test API của web app trên repo tạm: đọc, tạo, sửa, xung đột, upload ảnh, checkbox, xoá, chặn path traversal, auto-commit.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeRepo, doc, makePng } from '../helpers.mjs';

const repo = makeRepo({
  docs: {
    '00-overview/roadmap.md': doc({ title: 'Roadmap', body: '# Roadmap\n\n- [ ] Việc A\n- [x] Việc B\n  - [ ] Việc C\n' }),
    '02-ua-channels/google-ads/tcpa.md': doc({ title: 'tCPA', topic: '02-ua-channels/google-ads', summary: 'Đặt giá thầu tCPA' }),
  },
});
process.env.KB_ROOT = repo.root;
process.env.KB_NO_PUSH = '1';
process.env.KB_WEB_COMMIT_DELAY = '50';
const { createServer } = await import('../../site/server.mjs');
let server, base;
before(async () => { server = createServer(); await new Promise(r => server.listen(0, '127.0.0.1', r)); base = `http://127.0.0.1:${server.address().port}`; });
after(() => server.close());

const req = async (method, url, body, headers = {}) => {
  const opts = { method, headers };
  if (Buffer.isBuffer(body)) opts.body = body;
  else if (body !== undefined) { opts.body = JSON.stringify(body); opts.headers['Content-Type'] = 'application/json'; }
  const r = await fetch(base + url, opts);
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = null; }
  return { status: r.status, json, text, type: r.headers.get('content-type') };
};
const waitCommit = async (re) => { for (let i = 0; i < 100; i++) { if (re.test(repo.git('log', '--format=%B', '-5'))) return true; await new Promise(r => setTimeout(r, 100)); } return false; };

test('GET meta/docs/doc + static + vendor', async () => {
  const meta = await req('GET', '/api/meta');
  assert.ok(meta.json.types.includes('lesson'));
  assert.ok(meta.json.allTopics.includes('02-ua-channels/google-ads'));
  const docs = await req('GET', '/api/docs?full=1');
  assert.equal(docs.json.length, 2);
  assert.ok(docs.json[0].body !== undefined);
  const d = await req('GET', '/api/doc?rel=02-ua-channels/google-ads/tcpa.md');
  assert.equal(d.json.fm.title, 'tCPA');
  assert.match(d.json.hash, /^[0-9a-f]{12}$/);
  assert.match((await req('GET', '/')).type, /text\/html/);
  assert.match((await req('GET', '/app.js')).type, /javascript/);
  for (const v of ['marked.js', 'purify.js', 'minisearch.js']) assert.equal((await req('GET', `/vendor/${v}`)).status, 200, v);
});

test('chặn path traversal ở doc và assets', async () => {
  assert.equal((await req('GET', '/api/doc?rel=../package.json')).status, 404);
  assert.equal((await req('GET', '/api/doc?rel=../../etc/passwd.md')).status, 404);
  assert.equal((await req('GET', '/api/doc?rel=INDEX.md')).status, 404);
  assert.equal((await req('PUT', '/api/doc', { rel: '../x.md', fm: {}, body: '' })).status, 404);
  assert.ok(!(await req('GET', '/assets/../.git/config')).text.includes('[core]'));
  assert.notEqual((await req('GET', '/assets/%2e%2e/.git/config')).text.includes('[core]'), true);
});

test('tạo tài liệu mới → file hợp lệ, INDEX cập nhật, auto-commit', async () => {
  const r = await req('POST', '/api/doc', { topic: 'lessons', title: 'ROAS tụt sau khi tăng budget', type: 'lesson', summary: 'Tăng budget 50% làm ROAS D7 tụt', tags: ['roas'], body: '# ROAS\n\nNội dung', fm: { sources: ['web test'], geo: ['US'] } });
  assert.equal(r.status, 201, r.text);
  assert.match(r.json.rel, /^lessons\/\d{4}-\d{2}-roas-tut-sau-khi-tang-budget\.md$/);
  const text = fs.readFileSync(path.join(repo.root, 'knowledge', r.json.rel), 'utf8');
  assert.match(text, /type: lesson/);
  assert.match(text, /geo: \[US\]/);
  assert.match(fs.readFileSync(path.join(repo.root, 'knowledge/INDEX.md'), 'utf8'), /Tăng budget 50%/);
  assert.ok(await waitCommit(/kb\(web\): tạo lessons\//), repo.git('log', '--oneline', '-3'));
  assert.equal((await req('POST', '/api/doc', { topic: 'lessons', title: 'ROAS tụt sau khi tăng budget', summary: 'x', fm: { sources: ['x'] } })).status, 409, 'không tạo trùng');
  assert.equal((await req('POST', '/api/doc', { topic: '../evil', title: 'x' })).status, 400);
  assert.equal((await req('POST', '/api/doc', { topic: 'random-topic', title: 'x' })).status, 400);
});

test('sửa tài liệu: lưu, lỗi validate trả 422 và không ghi, xung đột 409, force ghi đè', async () => {
  const rel = '02-ua-channels/google-ads/tcpa.md';
  const d = (await req('GET', `/api/doc?rel=${rel}`)).json;
  const ok = await req('PUT', '/api/doc', { rel, fm: { ...d.fm, status: 'verified' }, body: d.body + '\nThêm dòng.\n', baseHash: d.hash });
  assert.equal(ok.status, 200, ok.text);
  const after1 = fs.readFileSync(path.join(repo.root, 'knowledge', rel), 'utf8');
  assert.match(after1, /status: verified/);
  assert.match(after1, /Thêm dòng/);

  const bad = await req('PUT', '/api/doc', { rel, fm: { ...d.fm, type: 'blog' }, body: 'x', baseHash: ok.json.hash });
  assert.equal(bad.status, 422);
  assert.match(bad.json.errors.join(), /type không hợp lệ/);
  assert.equal(fs.readFileSync(path.join(repo.root, 'knowledge', rel), 'utf8'), after1, 'file không bị đổi khi lỗi');

  const stale = await req('PUT', '/api/doc', { rel, fm: d.fm, body: 'bản cũ', baseHash: d.hash });
  assert.equal(stale.status, 409);
  const forced = await req('PUT', '/api/doc', { rel, fm: d.fm, body: 'bản ép\n', baseHash: d.hash, force: true });
  assert.equal(forced.status, 200);
  assert.match(fs.readFileSync(path.join(repo.root, 'knowledge', rel), 'utf8'), /bản ép/);
});

test('sửa raw: frontmatter hỏng bị từ chối', async () => {
  const rel = '02-ua-channels/google-ads/tcpa.md';
  const d = (await req('GET', `/api/doc?rel=${rel}`)).json;
  assert.equal((await req('PUT', '/api/raw', { rel, raw: '---\ntitle: [x\n---\nb', baseHash: d.hash })).status, 422);
  const ok = await req('PUT', '/api/raw', { rel, raw: d.raw.replace('bản ép', 'bản raw'), baseHash: d.hash });
  assert.equal(ok.status, 200, ok.text);
});

test('upload ảnh: lưu vào assets, trả markdown path, chống trùng, từ chối file không phải ảnh', async () => {
  const png = makePng(20, 10);
  const r = await req('POST', '/api/upload?slug=dashboard admob&doc=lessons/x.md', png, { 'Content-Type': 'image/png' });
  assert.equal(r.status, 200, r.text);
  assert.match(r.json.path, /^assets\/screenshots\/\d{4}-\d{2}\/\d{4}-\d{2}-\d{2}-dashboard-admob-1\.png$/);
  assert.equal(r.json.md, '../../' + r.json.path);
  assert.ok(fs.existsSync(path.join(repo.root, r.json.path)));
  const img = await fetch(`${base}/${r.json.path}`);
  assert.equal(img.headers.get('content-type'), 'image/png');
  const dup = await req('POST', '/api/upload?slug=khac', png, { 'Content-Type': 'image/png' });
  assert.equal(dup.json.duplicate, true);
  assert.equal((await req('POST', '/api/upload', Buffer.from('hello'), { 'Content-Type': 'text/plain' })).status, 415);
  const imgs = await req('GET', '/api/images');
  assert.equal(imgs.json.length, 1);
  assert.deepEqual(imgs.json[0].docs, []);
});

test('ảnh gắn vào tài liệu xuất hiện trong /api/images với tài liệu dùng nó', async () => {
  const imgs = (await req('GET', '/api/images')).json;
  const p = imgs[0].path;
  const r = await req('POST', '/api/doc', { topic: '03-monetization', title: 'eCPM theo GEO', summary: 'eCPM', body: `![bảng eCPM](../../${p})\n`, fm: { images: [p], sources: ['x'] } });
  assert.equal(r.status, 201, r.text);
  const after = (await req('GET', '/api/images')).json;
  assert.equal(after[0].docs[0].title, 'eCPM theo GEO');
});

test('checkbox roadmap: bật/tắt đúng mục (kể cả mục lồng)', async () => {
  const rel = '00-overview/roadmap.md';
  assert.equal((await req('POST', '/api/check', { rel, index: 2, checked: true })).status, 200);
  assert.equal((await req('POST', '/api/check', { rel, index: 1, checked: false })).status, 200);
  const body = fs.readFileSync(path.join(repo.root, 'knowledge', rel), 'utf8');
  assert.match(body, /- \[ \] Việc A\n- \[ \] Việc B\n {2}- \[x\] Việc C/);
  assert.equal((await req('POST', '/api/check', { rel, index: 9, checked: true })).status, 400);
});

test('xoá tài liệu → file mất, INDEX cập nhật, commit', async () => {
  const rel = '02-ua-channels/google-ads/tcpa.md';
  const r = await req('DELETE', `/api/doc?rel=${rel}`);
  assert.equal(r.status, 200);
  assert.ok(!fs.existsSync(path.join(repo.root, 'knowledge', rel)));
  assert.doesNotMatch(fs.readFileSync(path.join(repo.root, 'knowledge/INDEX.md'), 'utf8'), /tcpa\.md/);
  assert.ok(await waitCommit(/xoá 02-ua-channels\/google-ads\/tcpa\.md/));
});
