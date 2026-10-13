// Smoke test giao diện bằng Chrome thật (playwright-core, channel chrome). Bỏ qua nếu máy không có Chrome.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeRepo, doc, makePng, tmpDir } from '../helpers.mjs';

let chromium;
try { ({ chromium } = await import('playwright-core')); } catch { chromium = null; }

const shotsDir = process.env.KB_UI_SHOTS || tmpDir('kbshots-');
const repo = makeRepo({
  docs: {
    '00-overview/current-state.md': doc({ title: 'Trạng thái hiện tại', type: 'overview', body: '# Trạng thái\n\n- App **home-morph** đang chạy tROAS US\n' }),
    '00-overview/roadmap.md': doc({ title: 'Roadmap', type: 'overview', body: '# Roadmap\n\n## 1. Pre\n- [ ] ASO\n- [ ] Firebase\n' }),
    '04-measurement/do-luong-firebase.md': doc({ title: 'Đo lường bằng Firebase', topic: '04-measurement', summary: 'Sự kiện first_open và ad_impression', body: '# Đo lường\n\nXem [playbook](../playbooks/launch.md).\n\n| Event | Dùng cho |\n|---|---|\n| first_open | tCPA |\n' }),
    'playbooks/launch.md': doc({ title: 'Launch campaign', topic: 'playbooks', type: 'playbook', summary: 'Checklist launch tCPA', extra: 'related: [04-measurement/do-luong-firebase.md]\n' }),
    'lessons/2026-10-roas.md': doc({ title: 'ROAS D7 thấp ở EU', topic: 'lessons', type: 'lesson', summary: 'ROAS D7 EU chỉ 20%', extra: 'images: [assets/screenshots/2026-10/2026-10-02-roas-1.png]\napp: home-morph\n'.replace('app: home-morph\n', ''), body: '# ROAS\n\n![Biểu đồ ROAS](../../assets/screenshots/2026-10/2026-10-02-roas-1.png)\n' }).replace('app: general', 'app: home-morph'),
  },
});
fs.mkdirSync(path.join(repo.root, 'assets/screenshots/2026-10'), { recursive: true });
fs.writeFileSync(path.join(repo.root, 'assets/screenshots/2026-10/2026-10-02-roas-1.png'), makePng(400, 240, [40, 120, 220]));
const pngFile = path.join(tmpDir(), 'dash.png');
fs.writeFileSync(pngFile, makePng(300, 200, [220, 120, 40]));

process.env.KB_ROOT = repo.root;
process.env.KB_NO_PUSH = '1';
process.env.KB_WEB_COMMIT_DELAY = '50';
const { createServer } = await import('../../site/server.mjs');

let server, base, browser = null, page;
const errors = [];
// Khởi động ngay ở top-level: `skip` của từng test được tính lúc khai báo.
if (chromium) { try { browser = await chromium.launch({ channel: 'chrome' }); } catch { browser = null; } }
before(async () => {
  if (!browser) return;
  server = createServer();
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', d => d.accept(d.type() === 'prompt' ? 'Dashboard AdMob' : undefined));
});
after(async () => { await browser?.close(); server?.close(); console.log(`# screenshots: ${shotsDir}`); });

const skip = () => !browser;
const shot = name => page.screenshot({ path: path.join(shotsDir, `${name}.png`), fullPage: true });
const file = rel => fs.readFileSync(path.join(repo.root, 'knowledge', rel), 'utf8');

test('trang chủ: thống kê, trạng thái hiện tại, không lỗi JS', { skip: skip() }, async () => {
  await page.goto(base + '/');
  await page.waitForSelector('.stats');
  const stats = await page.$$eval('.stat .n', els => els.map(e => e.textContent));
  assert.deepEqual(stats, ['5', '5', '1', '1']);
  assert.match(await page.textContent('#cs'), /home-morph/);
  await shot('home');
  assert.deepEqual(errors, []);
});

test('tìm kiếm không dấu ra tài liệu có dấu + highlight', { skip: skip() }, async () => {
  await page.fill('#q', 'do luong');
  await page.waitForSelector('#q-results a');
  assert.match(await page.textContent('#q-results'), /Đo lường bằng Firebase/);
  assert.ok(await page.$('#q-results mark'));
  await page.keyboard.press('Enter');
  await page.waitForSelector('h1:has-text("Tìm")');
  assert.match(await page.textContent('main'), /1 kết quả|2 kết quả/);
});

test('trang tài liệu: ảnh load được, lightbox mở, link .md nội bộ chuyển đúng, bảng render', { skip: skip() }, async () => {
  await page.goto(base + '/#/doc/lessons/2026-10-roas.md');
  await page.waitForSelector('.prose img');
  const ok = await page.$eval('.prose img', img => img.complete && img.naturalWidth === 400);
  assert.ok(ok, 'ảnh trong bài phải hiển thị');
  await page.click('.prose img');
  assert.equal(await page.isVisible('#lightbox img'), true);
  await shot('lightbox');
  await page.keyboard.press('Escape');
  assert.equal(await page.isHidden('#lightbox'), true);
  await page.goto(base + '/#/doc/04-measurement/do-luong-firebase.md');
  await page.waitForSelector('.prose table');
  await page.click('.prose a:has-text("playbook")');
  await page.waitForSelector('h1:has-text("Launch campaign")');
  assert.match(await page.textContent('.meta-side'), /Đo lường bằng Firebase/);
  await shot('doc');
});

test('sửa tài liệu trên web → file đổi, duyệt draft', { skip: skip() }, async () => {
  await page.goto(base + '/#/edit/playbooks/launch.md');
  await page.waitForSelector('#ed');
  await page.fill('input[name=summary]', 'Checklist launch tCPA (đã sửa trên web)');
  await page.fill('#body-ta', '# Launch\n\n- [ ] Bước 1\n');
  await page.waitForTimeout(250);
  assert.match(await page.textContent('#preview'), /Bước 1/);
  await shot('editor');
  await page.click('button[type=submit]');
  await page.waitForSelector('h1:has-text("Launch campaign")');
  assert.match(file('playbooks/launch.md'), /đã sửa trên web/);
  await page.click('#verify');
  await page.waitForFunction(() => !document.querySelector('#verify'));
  assert.match(file('playbooks/launch.md'), /status: verified/);
});

test('tạo tài liệu mới kèm ảnh tải lên → ảnh vào assets, chèn markdown, hợp lệ', { skip: skip() }, async () => {
  await page.goto(base + '/#/new?topic=03-monetization');
  await page.waitForSelector('#ed');
  await page.fill('input[name=title]', 'eCPM AdMob theo GEO');
  await page.fill('input[name=summary]', 'eCPM interstitial theo GEO tháng 10');
  await page.fill('textarea[name=sources]', 'web test');
  await page.setInputFiles('#file', pngFile);
  await page.waitForSelector('.img-chip img');
  const body = await page.inputValue('#body-ta');
  assert.match(body, /!\[Dashboard AdMob\]\(\.\.\/\.\.\/assets\/screenshots\/\d{4}-\d{2}\/[^)]+-ecpm-admob-theo-geo-1\.png\)/);
  await page.waitForSelector('#preview img');
  await page.click('button[type=submit]');
  await page.waitForSelector('h1:has-text("eCPM AdMob theo GEO")');
  const created = fs.readdirSync(path.join(repo.root, 'knowledge/03-monetization'));
  assert.deepEqual(created, ['ecpm-admob-theo-geo.md']);
  const text = file('03-monetization/ecpm-admob-theo-geo.md');
  assert.match(text, /images: \[assets\/screenshots\//);
  assert.ok(await page.$eval('.prose img', img => img.complete && img.naturalWidth === 300));
});

test('gallery: ảnh kèm tên tài liệu, lọc theo app', { skip: skip() }, async () => {
  await page.goto(base + '/#/gallery');
  await page.waitForSelector('.shot');
  assert.equal((await page.$$('.shot')).length, 2);
  assert.match(await page.textContent('.gallery'), /ROAS D7 thấp ở EU/);
  await page.selectOption('select[data-k=app]', 'home-morph');
  await page.waitForFunction(() => document.querySelectorAll('.shot').length === 1);
  await page.click('.shot');
  assert.match(await page.textContent('.lb-bar'), /ROAS D7 thấp ở EU/);
  await page.keyboard.press('Escape');
  await shot('gallery');
});

test('duyệt: lọc theo chủ đề / loại / app ra đúng tài liệu', { skip: skip() }, async () => {
  await page.goto(base + '/#/browse');
  await page.waitForSelector('.doc-list');
  await page.selectOption('select[data-k=topic]', '04-measurement');
  await page.waitForFunction(() => location.hash.includes('topic=04-measurement'));
  assert.equal((await page.$$('.doc-list li')).length, 1);
  await page.goto(base + '/#/browse?type=lesson&app=home-morph');
  await page.waitForSelector('.doc-list li');
  assert.match(await page.textContent('.doc-list'), /ROAS D7 thấp ở EU/);
  assert.equal(await page.$eval('select[data-k=type]', s => s.value), 'lesson');
  await page.goto(base + '/#/browse?status=draft');
  await page.waitForSelector('main .muted');
  assert.match(await page.textContent('main'), /\d+ tài liệu/);
});

test('timeline + roadmap tick lưu vào file', { skip: skip() }, async () => {
  await page.goto(base + '/#/timeline');
  await page.waitForSelector('.tl-item');
  assert.match(await page.textContent('.timeline'), /ROAS D7 thấp ở EU/);
  await page.goto(base + '/#/roadmap');
  await page.waitForSelector('.prose input[type=checkbox]');
  await page.click('.prose input[type=checkbox] >> nth=1');
  await page.waitForFunction(() => /1\/2/.test(document.querySelector('main').textContent), null, { timeout: 5000 });
  assert.match(file('00-overview/roadmap.md'), /- \[ \] ASO\n- \[x\] Firebase/);
  await shot('roadmap');
});

test('mobile 390px: không tràn ngang, menu mở sidebar; dark mode', { skip: skip() }, async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const h of ['#/', '#/doc/lessons/2026-10-roas.md', '#/gallery', '#/edit/playbooks/launch.md', '#/browse']) {
    await page.goto(base + '/' + h);
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `${h} tràn ngang ${overflow}px`);
  }
  await page.goto(base + '/#/');
  await page.click('#menu-btn');
  assert.equal(await page.isVisible('#sidebar'), true);
  await shot('mobile-menu');
  await page.setViewportSize({ width: 1360, height: 900 });
  await page.click('#theme-btn');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await shot('dark');
  await page.click('#theme-btn');
  const bg2 = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.notEqual(bg, bg2);
  assert.deepEqual(errors, []);
});
