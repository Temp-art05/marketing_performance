import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { listImages, analyzeWork, needsCapture, digest, projectSlug } from '../../scripts/kb/transcript.mjs';
import { saveImage, imageSize, mdImagePath } from '../../scripts/kb/images.mjs';
import { commitKnowledge } from '../../scripts/kb/git.mjs';
import { makeRepo, doc, makePng, Transcript, tmpDir, cli } from '../helpers.mjs';

test('projectSlug khớp cách Claude Code đặt tên thư mục transcript', () => {
  assert.equal(projectSlug('/Users/temp/DATA/AREA/UA_Marketing/marketing_performance'), '-Users-temp-DATA-AREA-UA-Marketing-marketing-performance');
});

test('listImages: lấy ảnh dán + ảnh trong tool_result, kèm text ngữ cảnh, bỏ sidechain', () => {
  const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t.user('[Image #1] setup EU, US như này đúng chưa', [makePng(5, 5)]);
  t.add({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'x', content: [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: makePng().toString('base64') } }] }] } });
  t.add({ type: 'user', isSidechain: true, message: { content: [{ type: 'image', source: { type: 'base64', media_type: 'image/png', data: 'AAAA' } }] } });
  fs.appendFileSync(t.file, '{"type":"user", "message": {"content": [{"type":"im'); // dòng đang ghi dở
  const imgs = listImages(t.file);
  assert.equal(imgs.length, 2);
  assert.equal(imgs[0].origin, 'pasted');
  assert.match(imgs[0].context, /setup EU, US/);
  assert.equal(imgs[1].origin, 'tool');
  assert.deepEqual(Buffer.from(imgs[0].data, 'base64'), makePng(5, 5));
});

test('analyzeWork/needsCapture: chat thuần và chỉ đọc knowledge → không cần nạp', () => {
  const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t.user('CPI là gì?').tool('Read', { file_path: '/r/knowledge/00-overview/glossary.md' }).tool('Grep', { pattern: 'CPI', path: '/r/knowledge' })
    .tool('Bash', { command: 'node scripts/kb/cli.mjs search CPI' }).assistant('CPI là ...');
  const a = analyzeWork(t.file);
  assert.equal(a.substantive, 0);
  assert.equal(needsCapture(a), false);
});

test('analyzeWork/needsCapture: làm việc thật → cần nạp; có ảnh/MCP → cần nạp ngay', () => {
  const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t.user('đọc data').tool('Bash', { command: 'python3 analyze.py exports/a.csv' }).tool('Read', { file_path: '/r/exports/a.csv' });
  assert.equal(needsCapture(analyzeWork(t.file)), false, '2 thao tác chưa đủ ngưỡng');
  t.tool('WebFetch', { url: 'https://support.google.com' });
  assert.equal(needsCapture(analyzeWork(t.file)), true);

  const t2 = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t2.user('[Image #1] xem giúp', [makePng()]);
  assert.equal(needsCapture(analyzeWork(t2.file)), true);
  const t3 = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t3.user('lấy report').tool('mcp__claude_ai_Meta_Ads_MCP__get_insights', {});
  assert.equal(needsCapture(analyzeWork(t3.file)), true);
});

test('analyzeWork: ghi vào knowledge/ hoặc chạy kb skip/commit/images save = đã xử lý', () => {
  for (const capture of [
    ['Write', { file_path: '/r/knowledge/lessons/x.md', content: '' }],
    ['Edit', { file_path: 'knowledge/00-overview/a.md' }],
    ['Bash', { command: 'node scripts/kb/cli.mjs skip "không có gì"' }],
    ['Bash', { command: 'node scripts/kb/cli.mjs commit -m "kb: x"' }],
    ['Bash', { command: 'node scripts/kb/cli.mjs images save 1 --slug a' }],
  ]) {
    const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
    t.user('x', [makePng()]).tool('Bash', { command: 'ls' }).tool('Bash', { command: 'ls' }).tool('Bash', { command: 'ls' }).tool(...capture);
    const a = analyzeWork(t.file);
    assert.equal(a.captured, true, JSON.stringify(capture));
    assert.equal(needsCapture(a), false);
  }
});

test('analyzeWork: chỉ xét phần sau checkpoint', () => {
  const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t.user('x', [makePng()]).tool('Bash', { command: 'a' }).tool('Bash', { command: 'b' }).tool('Bash', { command: 'c' });
  const cp = t.count;
  t.user('cảm ơn').assistant('ok');
  const a = analyzeWork(t.file, cp);
  assert.equal(a.substantive, 0);
  assert.equal(a.images, 0);
  assert.equal(a.lastLine, t.count);
});

test('digest: không chứa base64, đánh số ảnh, đánh dấu phần đã xử lý', () => {
  const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
  const png = makePng(50, 50);
  t.user('cũ').assistant('trả lời cũ');
  const cp = t.count;
  t.user('[Image #1] dashboard', [png]).tool('Bash', { command: 'echo hi' }, 'hi');
  const d = digest(t.file, { fromLine: cp });
  assert.ok(!d.includes(png.toString('base64').slice(0, 40)));
  assert.match(d, /\[ẢNH #1 do user dán — lưu bằng: node scripts\/kb\/cli.mjs images save 1 --transcript/);
  assert.match(d, /\[USER L1 \(đã xử lý trước đó\)\] cũ/);
  assert.match(d, /\[TOOL Bash\] \{"command":"echo hi"\}/);
});

test('saveImage: lưu đúng thư mục tháng, chống trùng theo nội dung, resize ảnh lớn', () => {
  const { root } = makeRepo();
  const a = saveImage(makePng(10, 10), { slug: 'Google Ads ROAS', date: '2026-10-14', r: root });
  assert.equal(a.path, 'assets/screenshots/2026-10/2026-10-14-google-ads-roas-1.png');
  assert.equal(a.duplicate, false);
  const b = saveImage(makePng(10, 10), { slug: 'khác', date: '2026-10-15', r: root });
  assert.equal(b.duplicate, true);
  assert.equal(b.path, a.path);
  const c = saveImage(makePng(10, 10, [0, 0, 255]), { slug: 'Google Ads ROAS', date: '2026-10-14', r: root });
  assert.equal(c.path, 'assets/screenshots/2026-10/2026-10-14-google-ads-roas-2.png');
  if (process.platform === 'darwin') {
    const big = saveImage(makePng(3200, 100), { slug: 'big', date: '2026-10-14', r: root });
    assert.equal(big.resized, true);
    assert.deepEqual(imageSize(fs.readFileSync(path.join(root, big.path))), { w: 1600, h: 50 });
  }
  assert.equal(mdImagePath(a.path, 'lessons/x.md'), '../../assets/screenshots/2026-10/2026-10-14-google-ads-roas-1.png');
  assert.equal(mdImagePath(a.path, '02-ua-channels/google-ads/x.md'), '../../../assets/screenshots/2026-10/2026-10-14-google-ads-roas-1.png');
});

test('CLI images save: lấy ảnh từ transcript → file + markdown dùng được trong tài liệu (lint qua)', () => {
  const { root } = makeRepo();
  const t = new Transcript(path.join(tmpDir(), 's.jsonl'));
  t.user('[Image #1] cấu hình GEO', [makePng(8, 8)]);
  const list = cli(['images', 'list', '--transcript', t.file], { root });
  assert.match(list.stdout, /#1 {2}pasted/);
  const res = cli(['images', 'save', '1', '--slug', 'geo-setup', '--doc', 'lessons/2026-10-geo.md', '--transcript', t.file], { root });
  assert.equal(res.code, 0, res.stderr);
  const imgPath = /Đã lưu: (\S+)/.exec(res.stdout)[1];
  const md = /markdown: (!\[.*\]\(.*\))/.exec(res.stdout)[1];
  fs.mkdirSync(path.join(root, 'knowledge/lessons'), { recursive: true });
  fs.writeFileSync(path.join(root, 'knowledge/lessons/2026-10-geo.md'), doc({ topic: 'lessons', type: 'lesson', extra: `images: [${imgPath}]\n`, body: md + '\n' }));
  const lint = cli(['lint'], { root });
  assert.equal(lint.code, 0, lint.stdout);
  assert.equal(cli(['images', 'save', '9', '--slug', 'x', '--transcript', t.file], { root }).code, 1);
});

test('commitKnowledge: commit chỉ knowledge/assets, push lên remote, không commit khi lint lỗi', () => {
  const { root, bare, git } = makeRepo({ remote: true });
  fs.writeFileSync(path.join(root, 'other.txt'), 'không được commit');
  fs.mkdirSync(path.join(root, 'knowledge/00-overview'), { recursive: true });
  fs.writeFileSync(path.join(root, 'knowledge/00-overview/a.md'), doc());
  const res = commitKnowledge('kb: thêm a', { r: root, push: true });
  assert.equal(res.committed, true);
  assert.equal(res.pushed, true, res.warnings.join());
  const files = git('show', '--name-only', '--format=', 'HEAD').trim().split('\n').sort();
  assert.deepEqual(files, ['knowledge/00-overview/a.md', 'knowledge/INDEX.md']);
  assert.equal(execFileSync('git', ['--git-dir', bare, 'log', '-1', '--format=%s'], { encoding: 'utf8' }).trim(), 'kb: thêm a');
  assert.match(git('status', '--porcelain'), /other\.txt/);

  fs.writeFileSync(path.join(root, 'knowledge/00-overview/b.md'), '# không frontmatter');
  assert.throws(() => commitKnowledge('kb: lỗi', { r: root }), /Lint lỗi/);
  assert.equal(git('log', '-1', '--format=%s').trim(), 'kb: thêm a');

  fs.rmSync(path.join(root, 'knowledge/00-overview/b.md'));
  assert.equal(commitKnowledge('kb: rỗng', { r: root }).committed, false);
});

test('commitKnowledge: tự gỡ conflict INDEX.md khi remote có commit khác', () => {
  const { root, bare } = makeRepo({ remote: true });
  // máy khác push 1 tài liệu
  const other = tmpDir();
  execFileSync('git', ['clone', '-q', bare, other]);
  execFileSync('git', ['-C', other, 'config', 'user.email', 'o@o']);
  execFileSync('git', ['-C', other, 'config', 'user.name', 'o']);
  fs.mkdirSync(path.join(other, 'knowledge/00-overview'), { recursive: true });
  fs.writeFileSync(path.join(other, 'knowledge/00-overview/from-other.md'), doc({ title: 'Khác' }));
  assert.equal(commitKnowledge('kb: từ máy khác', { r: other, push: true }).pushed, true);
  // máy này thêm tài liệu khác → INDEX.md conflict
  fs.mkdirSync(path.join(root, 'knowledge/00-overview'), { recursive: true });
  fs.writeFileSync(path.join(root, 'knowledge/00-overview/local.md'), doc({ title: 'Local' }));
  const res = commitKnowledge('kb: local', { r: root, push: true });
  assert.equal(res.pushed, true, res.warnings.join());
  const idx = fs.readFileSync(path.join(root, 'knowledge/INDEX.md'), 'utf8');
  assert.match(idx, /from-other\.md/);
  assert.match(idx, /local\.md/);
  assert.match(idx, /2 tài liệu/);
});

test('commitKnowledge: lỗi lint có sẵn ở file KHÔNG đổi không chặn commit file mới (chỉ cảnh báo)', () => {
  const { root, git } = makeRepo({ docs: { '00-overview/old.md': doc({ title: 'Old', body: '[x](../05-optimization/khong-co.md)\n' }) } });
  fs.mkdirSync(path.join(root, 'knowledge/lessons'), { recursive: true });
  fs.writeFileSync(path.join(root, 'knowledge/lessons/2026-10-new.md'), doc({ topic: 'lessons', type: 'lesson', title: 'New' }));
  const res = commitKnowledge('kb: new', { r: root, push: false });
  assert.equal(res.committed, true);
  assert.match(res.warnings.join(), /lỗi lint có sẵn ở file khác.*old\.md/);
  assert.match(git('show', '--name-only', '--format=', 'HEAD'), /lessons\/2026-10-new\.md/);
  // file mới bị lỗi thì vẫn chặn
  fs.writeFileSync(path.join(root, 'knowledge/lessons/2026-10-bad.md'), '# no frontmatter');
  assert.throws(() => commitKnowledge('kb: bad', { r: root, push: false }), /2026-10-bad\.md/);
});
