// API gợi ý / mốc theo dõi (site/api-extra.mjs) — test trực tiếp các route, không cần server.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { makeRepo, doc } from '../helpers.mjs';

const repo = makeRepo({ docs: { 'lessons/2026-10-de.md': doc({ topic: 'lessons', type: 'lesson', title: 'Germany ROAS D7 thấp', summary: 'tROAS ở Đức ROAS D7 14%' }) } });
process.env.KB_ROOT = repo.root;
const { extraRoutes } = await import('../../site/api-extra.mjs');
const commits = [];
const readJsonBody = async req => { let s = ''; for await (const c of req) s += c; return JSON.parse(s || '{}'); };
const routes = extraRoutes({ scheduleCommit: m => commits.push(m), readJsonBody });
const body = obj => Readable.from([JSON.stringify(obj)]);
const call = (key, params = '', b) => routes[key](new URLSearchParams(params), b ? body(b) : undefined);

test('POST /api/followup → thêm mốc + commit; trùng không commit; sai → 400', async () => {
  const [s1, r1] = await call('POST /api/followup', '', { when: '2020-01-01', app: 'home-morph', text: 'Xem ROAS D7' });
  assert.equal(s1, 201);
  assert.match(r1.item, /2020-01-01 · home-morph · Xem ROAS D7/);
  assert.equal((await call('POST /api/followup', '', { when: '2020-01-01', app: 'home-morph', text: 'Xem ROAS D7' }))[0], 200);
  assert.equal(commits.length, 1);
  assert.equal((await call('POST /api/followup', '', { when: 'mai', text: 'x' }))[0], 400);
});

test('GET /api/suggestions → mốc quá hạn + draft', async () => {
  const [s, dx] = await call('GET /api/suggestions');
  assert.equal(s, 200);
  assert.equal(dx.followups.due[0].text, 'Xem ROAS D7');
  assert.ok(dx.drafts.some(d => d.rel === 'lessons/2026-10-de.md'));
});

test('POST /api/followup/done → chuyển sang đã xong; không tồn tại → 404', async () => {
  const [s] = await call('POST /api/followup/done', '', { selector: 1, note: 'D7 48%' });
  assert.equal(s, 200);
  const [, list] = await call('GET /api/followups');
  assert.equal(list.filter(f => !f.done).length, 0);
  assert.equal((await call('POST /api/followup/done', '', { selector: 'không có' }))[0], 404);
});

test('GET /api/recall', async () => {
  const [, hits] = await call('GET /api/recall', 'q=' + encodeURIComponent('tROAS ở Đức ROAS D7 thế nào'));
  assert.equal(hits[0].rel, 'lessons/2026-10-de.md');
});
