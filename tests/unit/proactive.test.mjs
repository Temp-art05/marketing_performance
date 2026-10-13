// Mốc theo dõi, sức khoẻ knowledge, recall theo prompt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { addFollowup, listFollowups, completeFollowup, resolveDate, WATCHLIST_REL } from '../../scripts/kb/followups.mjs';
import { diagnose, sessionSummary } from '../../scripts/kb/doctor.mjs';
import { recall } from '../../scripts/kb/recall.mjs';
import { lintDocs, today } from '../../scripts/kb/lib.mjs';
import { makeRepo, doc, makePng, cli } from '../helpers.mjs';

test('resolveDate: 7d / 2w / 1m / ngày cụ thể; sai định dạng báo lỗi', () => {
  assert.equal(resolveDate('7d', '2026-10-14'), '2026-10-21');
  assert.equal(resolveDate('2w', '2026-10-14'), '2026-10-28');
  assert.equal(resolveDate('1m', '2026-10-14'), '2026-11-13');
  assert.equal(resolveDate('2026-12-01'), '2026-12-01');
  assert.throws(() => resolveDate('tuần sau'), /không hợp lệ/);
});

test('followup: thêm theo thứ tự ngày, chống trùng, đánh dấu xong kèm kết quả, file vẫn hợp lệ', () => {
  const { root } = makeRepo();
  addFollowup({ date: '2026-11-01', app: 'home-morph', text: 'Xem ROAS 1 tháng' }, root);
  addFollowup({ date: '2026-10-21', app: 'home-morph', text: 'Xem ROAS D7' }, root);
  addFollowup({ date: '2026-10-25', app: 'general', text: 'Duyệt draft' }, root);
  assert.equal(addFollowup({ date: '2026-10-21', app: 'home-morph', text: 'Xem ROAS D7' }, root).duplicate, true);
  let open = listFollowups(root).filter(f => !f.done);
  assert.deepEqual(open.map(f => f.date), ['2026-10-21', '2026-10-25', '2026-11-01']);
  completeFollowup('ROAS D7', { note: 'D7 = 48%, giữ bid' }, root);
  open = listFollowups(root).filter(f => !f.done);
  assert.equal(open.length, 2);
  const text = fs.readFileSync(path.join(root, 'knowledge', WATCHLIST_REL), 'utf8');
  assert.match(text, /## Đã xong\n- \[x\] 2026-10-21 · home-morph · Xem ROAS D7 — D7 = 48%, giữ bid/);
  assert.deepEqual(lintDocs(root).errors, []);
  assert.throws(() => completeFollowup('không có', {}, root), /Không tìm thấy/);
  assert.throws(() => addFollowup({ date: '7d', app: 'Home Morph', text: 'x' }, root), /slug/);
});

test('followup: đến hạn / quá hạn tính theo hôm nay; lint bắt dòng sai định dạng', () => {
  const { root } = makeRepo();
  addFollowup({ date: '2020-01-01', app: 'a', text: 'quá hạn' }, root);
  addFollowup({ date: today(), app: 'a', text: 'hôm nay' }, root);
  addFollowup({ date: '2099-01-01', app: 'a', text: 'xa' }, root);
  const fu = listFollowups(root);
  assert.deepEqual(fu.map(f => [f.text, f.due, f.overdue]), [['quá hạn', true, true], ['hôm nay', true, false], ['xa', false, false]]);
  fs.appendFileSync(path.join(root, 'knowledge', WATCHLIST_REL), '- [ ] mai xem lại ROAS\n');
  assert.match(lintDocs(root).errors.map(e => e.msg).join(), /Mốc sai định dạng/);
});

test('CLI followup add/list/done', () => {
  const { root } = makeRepo();
  assert.match(cli(['followup', 'add', '--when', '7d', '--app', 'home-morph', '--text', 'Xem ROAS D7'], { root }).stdout, /Đã thêm: - \[ \] \d{4}-\d{2}-\d{2} · home-morph · Xem ROAS D7/);
  assert.match(cli(['followup', 'list'], { root }).stdout, / 1\. .* · home-morph · Xem ROAS D7/);
  assert.match(cli(['followup', 'done', '1', '--note', 'ok'], { root }).stdout, /Xong/);
  assert.match(cli(['followup', 'list'], { root }).stdout, /Không có mốc nào đang mở/);
  assert.equal(cli(['followup', 'add', '--text', 'x'], { root }).code, 1);
});

test('doctor: phát hiện draft cũ, mâu thuẫn, outdated thiếu thay thế, app thiếu profile, ảnh mồ côi, mốc đến hạn', () => {
  const { root } = makeRepo({
    docs: {
      'lessons/2026-01-old.md': doc({ topic: 'lessons', type: 'lesson', title: 'Cũ' }).replace('created: 2026-10-01', 'created: 2026-01-01'),
      '02-ua-channels/x.md': doc({ topic: '02-ua-channels', title: 'X', body: '## ⚠️ Mâu thuẫn\nA nói 50, B nói 12\n' }),
      '02-ua-channels/y.md': doc({ topic: '02-ua-channels', title: 'Y', status: 'outdated' }),
      'apps/foo/campaigns.md': doc({ topic: 'apps/foo', title: 'Foo', type: 'app-profile' }).replace('app: general', 'app: foo'),
    },
  });
  fs.mkdirSync(path.join(root, 'assets/screenshots/2026-10'), { recursive: true });
  fs.writeFileSync(path.join(root, 'assets/screenshots/2026-10/lonely.png'), makePng());
  addFollowup({ date: '2020-01-01', app: 'foo', text: 'Xem ROAS' }, root);
  const dx = diagnose(root);
  const kinds = dx.issues.map(i => `${i.kind}:${i.rel}`);
  for (const k of ['stale-draft:lessons/2026-01-old.md', 'conflict:02-ua-channels/x.md', 'outdated-no-replacement:02-ua-channels/y.md', 'app-missing-profile:apps/foo/profile.md', 'orphan-image:assets/screenshots/2026-10/lonely.png']) {
    assert.ok(kinds.includes(k), `thiếu ${k}\n${kinds.join('\n')}`);
  }
  assert.equal(dx.followups.due.length, 1);
  const summary = sessionSummary(root).join('\n');
  assert.match(summary, /1 mốc theo dõi ĐẾN HẠN/);
  assert.match(summary, /2020-01-01 \(quá hạn\) · foo · Xem ROAS/);
  assert.match(summary, /Sức khoẻ knowledge:/);
});

test('recall: prompt liên quan → đúng tài liệu; prompt ngắn/không liên quan → rỗng; bỏ outdated', () => {
  const { root } = makeRepo({
    docs: {
      'lessons/2026-10-de-roas.md': doc({ topic: 'lessons', type: 'lesson', title: 'Germany ROAS D7 thấp', summary: 'Campaign tROAS ở Đức (DE) ROAS D7 chỉ 14%, CPI cao', body: '# DE\nCắt budget Đức.\n' }),
      '03-monetization/admob.md': doc({ topic: '03-monetization', title: 'AdMob cơ bản', summary: 'Ad format, eCPM, match rate', body: 'interstitial rewarded banner\n' }),
      '02-ua-channels/old.md': doc({ topic: '02-ua-channels', title: 'tROAS cần 50 conversion Đức', summary: 'cũ', status: 'outdated', body: 'tROAS Đức\n' }),
    },
  });
  const hits = recall('Có nên tăng budget campaign tROAS ở Đức không, ROAS D7 đang thấp', { r: root });
  assert.equal(hits[0]?.rel, 'lessons/2026-10-de-roas.md');
  assert.ok(!hits.some(h => h.rel === '02-ua-channels/old.md'), 'không gợi ý bài outdated');
  assert.deepEqual(recall('cảm ơn nhé', { r: root }), []);
  assert.deepEqual(recall('ok', { r: root }), []);
  assert.deepEqual(recall('hôm nay trời đẹp quá, đi cafe không', { r: root }), []);
  assert.equal(recall('eCPM interstitial thấp quá, match rate có vấn đề không', { r: root })[0]?.rel, '03-monetization/admob.md');
});
