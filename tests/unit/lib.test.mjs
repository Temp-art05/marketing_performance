import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseDoc, serializeDoc, lintDocs, buildIndex, writeIndex, slugify, foldVi, findSecrets, newDoc, listDocs } from '../../scripts/kb/lib.mjs';
import { makeRepo, doc, makePng } from '../helpers.mjs';

test('foldVi/slugify xử lý tiếng Việt', () => {
  assert.equal(foldVi('Đo lường hiệu quả'), 'Do luong hieu qua');
  assert.equal(slugify('Launch campaign tCPA — First_Open!'), 'launch-campaign-tcpa-first-open');
  assert.equal(slugify('   '), 'untitled');
});

test('parseDoc / serializeDoc round-trip giữ dữ liệu', () => {
  const { fm, body } = parseDoc(doc({ title: '"A: b"', summary: '"x, y: z"' }));
  assert.equal(fm.title, 'A: b');
  assert.equal(fm.summary, 'x, y: z');
  assert.deepEqual(fm.tags, ['test']);
  assert.equal(fm.created, '2026-10-01');
  const again = parseDoc(serializeDoc(fm, body));
  assert.deepEqual(again.fm, fm);
  assert.equal(again.body.trim(), body.trim());
});

test('parseDoc báo lỗi khi thiếu frontmatter hoặc YAML hỏng', () => {
  assert.match(parseDoc('# no fm').error, /Thiếu frontmatter/);
  assert.match(parseDoc('---\ntitle: [a\n---\nx').error, /YAML lỗi/);
});

test('lint: tài liệu hợp lệ không có lỗi', () => {
  const { root } = makeRepo({ docs: { '00-overview/a.md': doc() } });
  const res = lintDocs(root);
  assert.deepEqual(res.errors, []);
  assert.equal(res.count, 1);
});

test('lint: bắt thiếu field, enum sai, ngày sai, topic lệch thư mục, tên file', () => {
  const bad = `---\ntitle: X\ntype: blog\ntopic: lessons\nstatus: done\ncreated: 14/10/2026\nupdated: 2026-10-02\n---\nx`;
  const { root } = makeRepo({ docs: { '00-overview/Bad File.md': bad } });
  const msgs = lintDocs(root).errors.map(e => e.msg).join('\n');
  for (const re of [/kebab-case/, /Thiếu field bắt buộc: summary/, /type không hợp lệ/, /status không hợp lệ/, /created phải dạng/, /topic "lessons" không khớp/]) assert.match(msgs, re);
});

test('lint: thư mục cấp 1 ngoài cây topic bị chặn', () => {
  const { root } = makeRepo({ docs: { 'random/a.md': doc({ topic: 'random' }) } });
  assert.match(lintDocs(root).errors.map(e => e.msg).join(), /không thuộc cây topic/);
});

test('lint: lesson bắt buộc có sources', () => {
  const d = doc({ type: 'lesson', topic: 'lessons' }).replace('sources: ["test"]\n', '');
  const { root } = makeRepo({ docs: { 'lessons/2026-10-x.md': d } });
  assert.match(lintDocs(root).errors.map(e => e.msg).join(), /lesson phải có sources/);
});

test('lint: ảnh và link hỏng bị bắt, ảnh đúng thì qua', () => {
  const { root } = makeRepo({
    docs: {
      'lessons/2026-10-a.md': doc({ topic: 'lessons', type: 'lesson', extra: 'images: [assets/screenshots/2026-10/ok.png]\n', body: '![ok](../../assets/screenshots/2026-10/ok.png)\n![miss](../../assets/screenshots/nope.png)\n[link](../00-overview/khong-co.md)\n' }),
    },
  });
  fs.mkdirSync(path.join(root, 'assets/screenshots/2026-10'), { recursive: true });
  fs.writeFileSync(path.join(root, 'assets/screenshots/2026-10/ok.png'), makePng());
  const msgs = lintDocs(root).errors.map(e => e.msg);
  assert.equal(msgs.length, 2, msgs.join('\n'));
  assert.match(msgs.join(), /Ảnh không tồn tại: ..\/..\/assets\/screenshots\/nope.png/);
  assert.match(msgs.join(), /Link hỏng/);
});

test('lint: cảnh báo ảnh có trong bài nhưng thiếu ở field images', () => {
  const { root } = makeRepo({ docs: { '00-overview/a.md': doc({ body: '![x](../../assets/screenshots/a.png)\n' }) } });
  fs.mkdirSync(path.join(root, 'assets/screenshots'), { recursive: true });
  fs.writeFileSync(path.join(root, 'assets/screenshots/a.png'), makePng());
  const res = lintDocs(root);
  assert.equal(res.errors.length, 0);
  assert.match(res.warnings[0].msg, /thiếu trong field images/);
});

test('secret: bắt credential, không bắt số liệu/ID thường', () => {
  const secrets = [
    'key AIzaSyA1234567890abcdefghijklmnopqrstuv',
    'api_key = "sk_live_abcdef1234567890"',
    'dev_key: AbCdEf1234567890XyZ',
    'token ya29.a0AfH6SMBxxxxxxxxxxxxxxxxxxxxxx',
    '-----BEGIN PRIVATE KEY-----',
    'EAAG' + 'a'.repeat(60),
    'password: hunter2hunter2',
  ];
  for (const s of secrets) assert.ok(findSecrets(s).length, `phải bắt: ${s}`);
  const safe = [
    'ROAS D7 = 45%, CPI $0.32, eCPM $8.5 ở US',
    'Google Ads customer ID 123-456-7890, AdMob pub-1234567890123456',
    'ad unit ca-app-pub-3940256099942544/1033173712',
    'email: user@example.com, package com.apero.homemorph',
    'api_key: <điền key của bạn>',
    'Bước 3: nhập API key vào ô AppsFlyer dev key trong Firebase',
  ];
  for (const s of safe) assert.deepEqual(findSecrets(s), [], `không được bắt: ${s}`);
});

test('lint: credential trong tài liệu là lỗi', () => {
  const { root } = makeRepo({ docs: { '00-overview/a.md': doc({ body: 'AppsFlyer api_key = "ZxCvBnM1234567890qwe"\n' }) } });
  assert.match(lintDocs(root).errors.map(e => e.msg).join(), /credential/);
});

test('lint: file dữ liệu thô trong knowledge/assets bị chặn', () => {
  const { root } = makeRepo({ docs: { '00-overview/a.md': doc() } });
  fs.writeFileSync(path.join(root, 'knowledge/00-overview/data.csv'), 'a,b');
  assert.match(lintDocs(root).errors.map(e => e.file).join(), /data\.csv/);
});

test('lint: cảnh báo trùng title', () => {
  const { root } = makeRepo({ docs: { '00-overview/a.md': doc({ title: 'Trùng' }), '01-pre-marketing/b.md': doc({ title: 'Trùng', topic: '01-pre-marketing' }) } });
  assert.match(lintDocs(root).warnings.map(w => w.msg).join(), /Trùng title/);
});

test('INDEX: nhóm theo topic, đủ tài liệu, ổn định (không đổi nếu không có gì đổi)', () => {
  const { root } = makeRepo({
    docs: {
      '02-ua-channels/google-ads/a.md': doc({ topic: '02-ua-channels/google-ads', title: 'A', summary: 'tóm tắt A' }),
      '00-overview/b.md': doc({ title: 'B', summary: 'tóm tắt B', status: 'verified' }),
      'apps/home-morph/profile.md': doc({ topic: 'apps/home-morph', title: 'P', summary: 'hồ sơ', type: 'app-profile' }).replace('app: general', 'app: home-morph'),
    },
  });
  const idx = buildIndex(root);
  assert.match(idx, /3 tài liệu \(2 draft\)/);
  assert.ok(idx.indexOf('## 00-overview') < idx.indexOf('## 02-ua-channels'));
  assert.match(idx, /`02-ua-channels\/google-ads\/a\.md` — tóm tắt A `\[concept · draft · 2026-10-02\]`/);
  assert.match(idx, /hồ sơ `\[app-profile · draft · 2026-10-02 · home-morph\]`/);
  assert.equal(writeIndex(root).changed, true);
  assert.equal(writeIndex(root).changed, false);
  assert.ok(!listDocs(root).some(d => d.rel === 'INDEX.md'), 'INDEX không được tính là tài liệu');
});

test('newDoc: tạo khung hợp lệ, lessons có tiền tố ngày, không ghi đè', () => {
  const { root } = makeRepo();
  const a = newDoc({ topic: '02-ua-channels/meta', title: 'Meta AAA campaign' }, root);
  assert.equal(a.rel, '02-ua-channels/meta/meta-aaa-campaign.md');
  const l = newDoc({ topic: 'lessons', title: 'ROAS giảm sau khi đổi bid', type: 'lesson', sources: ['test'] }, root);
  assert.match(l.rel, /^lessons\/\d{4}-\d{2}-roas-giam-sau-khi-doi-bid\.md$/);
  assert.deepEqual(lintDocs(root).errors, []);
  assert.throws(() => newDoc({ topic: '02-ua-channels/meta', title: 'Meta AAA campaign' }, root), /Đã tồn tại/);
});
