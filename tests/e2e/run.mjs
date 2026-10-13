#!/usr/bin/env node
// E2E: chạy Claude Code thật (claude -p) trên bản sao tạm của repo, kiểm tra hệ thống tự nạp knowledge.
// Tốn token. Chạy: npm run test:e2e -- [--runs 3] [--only s1,s4] [--concurrency 3] [--keep]
// Mỗi kịch bản chạy trên 1 bản sao riêng (git init mới, không remote → không push được ra ngoài).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { listDocs, lintDocs, parseDoc } from '../../scripts/kb/lib.mjs';
import { projectTranscriptDir } from '../../scripts/kb/transcript.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { values: opt } = parseArgs({ options: { runs: { type: 'string', default: '1' }, only: { type: 'string' }, concurrency: { type: 'string', default: '3' }, keep: { type: 'boolean' }, model: { type: 'string' } } });
const OUT = path.join(REPO, '.claude/state/e2e', new Date().toISOString().replace(/[:.]/g, '-'));
fs.mkdirSync(OUT, { recursive: true });
const CLAUDE = process.env.KB_CLAUDE_BIN || 'claude';
const ALLOWED = ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill', 'Bash(node scripts/kb/cli.mjs:*)', 'Bash(npm run kb:*)', 'Bash(python3:*)', 'Bash(cat:*)', 'Bash(head:*)', 'Bash(ls:*)', 'Bash(wc:*)', 'Bash(git log:*)', 'Bash(git status:*)'];

// ---------- môi trường ----------

function makeCopy(name) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `kbe2e-${name}-`)));
  execFileSync('rsync', ['-a', '--exclude', 'node_modules', '--exclude', '.git', '--exclude', '.claude/state', '--exclude', 'docs/plans', `${REPO}/`, `${dir}/`]);
  // node_modules riêng cho mỗi bản sao: dùng chung qua symlink thì một lần cài lại sẽ làm hỏng mọi session đang chạy
  execFileSync('cp', ['-R', path.join(REPO, 'node_modules'), path.join(dir, 'node_modules')]);
  const g = (...a) => execFileSync('git', a, { cwd: dir, stdio: 'pipe', encoding: 'utf8' });
  g('init', '-q', '-b', 'main'); g('config', 'user.email', 'e2e@test'); g('config', 'user.name', 'e2e');
  g('add', '-A'); g('commit', '-qm', 'e2e base');
  return { dir, git: g };
}

function writeDoc(dir, rel, fm, body) {
  const p = path.join(dir, 'knowledge', rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const y = Object.entries(fm).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.map(x => JSON.stringify(x)).join(', ')}]` : JSON.stringify(v)}`).join('\n');
  fs.writeFileSync(p, `---\n${y}\n---\n\n${body}\n`);
}

// Chạy 1 session claude -p. messages: chuỗi prompt hoặc mảng content blocks (cho ảnh).
function runClaude(dir, content, { env = {}, timeoutMs = 15 * 60 * 1000 } = {}) {
  return new Promise(resolve => {
    const args = ['-p', '--output-format', 'stream-json', '--verbose', '--input-format', 'stream-json',
      '--permission-mode', 'acceptEdits', '--allowedTools', ...ALLOWED, '--max-turns', '80'];
    if (opt.model) args.push('--model', opt.model);
    const child = spawn(CLAUDE, args, { cwd: dir, env: { ...process.env, KB_NO_PUSH: '1', ...env }, stdio: ['pipe', 'pipe', 'pipe'] });
    const msg = { type: 'user', message: { role: 'user', content: typeof content === 'string' ? [{ type: 'text', text: content }] : content } };
    child.stdin.end(JSON.stringify(msg) + '\n');
    let out = '', err = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.on('close', code => {
      clearTimeout(timer);
      const events = out.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
      const result = events.findLast(e => e.type === 'result') ?? {};
      const sessionId = result.session_id ?? events.find(e => e.session_id)?.session_id;
      const hookBlocks = events.filter(e => e.type === 'system' && /hook/i.test(JSON.stringify(e))).length;
      resolve({ code, result: result.result ?? '', cost: result.total_cost_usd ?? 0, turns: result.num_turns, sessionId, stderr: err.slice(-3000), events, hookBlocks });
    });
  });
}

// Đợi agent nền (SessionEnd) của session xử lý xong.
async function waitBackground(dir, sessionId, timeoutMs = 15 * 60 * 1000) {
  const log = path.join(dir, '.claude/state/logs/background-capture.log');
  const tag = `[${String(sessionId).slice(0, 8)} `;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const lines = fs.existsSync(log) ? fs.readFileSync(log, 'utf8').split('\n').filter(l => l.includes(tag)) : [];
    if (lines.some(l => /không cần nạp|\] commit|commit lỗi|thiếu session/.test(l))) return lines.join('\n');
    // SessionEnd không spawn agent nền trong 90s → coi như không chạy (sẽ được ghi vào báo cáo)
    if (!lines.length && Date.now() - start > 90000) return 'KHÔNG có log agent nền (SessionEnd hook không chạy?)';
    await new Promise(r => setTimeout(r, 2000));
  }
  return 'TIMEOUT chờ background-capture';
}

const transcriptOf = (dir, id) => path.join(projectTranscriptDir(dir), `${id}.jsonl`);
const kbFiles = dir => listDocs(dir).map(d => d.rel);
const allKnowledgeText = dir => execFileSync('grep', ['-rh', '', 'knowledge'], { cwd: dir, encoding: 'utf8', maxBuffer: 64 << 20 });
const gitAllText = (git) => git('log', '-p', '--all', '--', 'knowledge', 'assets');
const newDocs = (before, dir) => listDocs(dir).filter(d => !before.includes(d.rel));
// Tài liệu được tạo HOẶC sửa từ mốc setup (cập nhật file có sẵn là hành vi đúng, không phải thất bại).
const touchedDocs = (e) => {
  const committed = e.git('diff', '--name-only', `${e.base}..HEAD`, '--', 'knowledge').split('\n');
  const dirty = e.git('status', '--porcelain', '-uall', '--', 'knowledge').split('\n').map(l => l.slice(3));
  const rels = new Set([...committed, ...dirty].filter(f => f.endsWith('.md') && !f.endsWith('INDEX.md')).map(f => f.replace(/^knowledge\//, '')));
  return listDocs(e.dir).filter(d => rels.has(d.rel));
};
const changedFiles = (git) => git('diff', '--name-only', 'HEAD~0', '--', 'knowledge').split('\n').filter(Boolean);
const kbCommits = (e) => e.git('log', '--format=%s', `${e.base}..HEAD`).split('\n').filter(s => s.startsWith('kb'));

async function dashboardPng(file) {
  const { chromium } = await import('playwright-core');
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 900, height: 520 } });
  await p.setContent(`<body style="font:15px -apple-system,Arial;padding:24px;background:#fff">
    <div style="color:#5f6368;font-size:13px">AdMob › Home Morph (com.apero.homemorph) › Báo cáo › 07/10/2026 – 13/10/2026</div>
    <h2 style="margin:8px 0 16px">Interstitial_Main — eCPM theo quốc gia</h2>
    <table style="border-collapse:collapse;width:100%">${[
      ['Quốc gia', 'Requests', 'Match rate', 'Show rate', 'Impressions', 'eCPM', 'Thu nhập'],
      ['United States', '182,400', '91.2%', '64.0%', '106,470', '$14.82', '$1,577.88'],
      ['Germany', '64,100', '88.5%', '61.3%', '34,770', '$9.41', '$327.19'],
      ['Japan', '41,900', '93.0%', '66.1%', '25,760', '$11.06', '$284.91'],
      ['India', '230,700', '72.4%', '58.0%', '96,880', '$0.62', '$60.07'],
      ['Brazil', '98,200', '79.9%', '55.2%', '43,310', '$1.35', '$58.47'],
    ].map((r, i) => `<tr>${r.map(c => `<${i ? 'td' : 'th'} style="border-bottom:1px solid #e0e0e0;padding:8px;text-align:left">${c}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</table>
    <div style="margin-top:14px;color:#c5221f">⚠ India: match rate thấp hơn mức trung bình tài khoản (72.4% vs 86%)</div></body>`);
  await p.screenshot({ path: file });
  await b.close();
}

// ---------- kịch bản ----------
// Mỗi kịch bản: setup(env) → session(s) → check trả về [{ok, msg}].

const CSV = `date_range,app,channel,campaign,geo,cost_usd,installs,cpi_usd,roas_d0,roas_d7
2026-10-01..2026-10-07,home-morph,google-ads,HM_tROAS_Global,US,1840,2240,0.82,0.18,0.61
2026-10-01..2026-10-07,home-morph,google-ads,HM_tROAS_Global,DE,920,610,1.51,0.05,0.14
2026-10-01..2026-10-07,home-morph,google-ads,HM_tROAS_Global,JP,760,690,1.10,0.15,0.52
2026-10-01..2026-10-07,home-morph,google-ads,HM_tROAS_Global,IN,310,5200,0.06,0.04,0.22
2026-10-01..2026-10-07,home-morph,google-ads,HM_tROAS_Global,BR,280,2100,0.13,0.06,0.31
`;

const S = {
  s1_data_insight: {
    desc: 'Đọc data CSV có insight rõ → tự nạp lesson (prompt không nhắc tới knowledge)',
    setup: e => { fs.mkdirSync(path.join(e.dir, 'exports'), { recursive: true }); fs.writeFileSync(path.join(e.dir, 'exports/hm_google_ads_7d.csv'), CSV); },
    prompt: 'Đọc file exports/hm_google_ads_7d.csv (report Google Ads 7 ngày của app home-morph). GEO nào nên cắt hoặc giảm budget, GEO nào nên scale? Trả lời ngắn gọn.',
    check: (e, r) => {
      const nd = touchedDocs(e);
      const text = nd.map(d => d.body + JSON.stringify(d.fm)).join('\n');
      const lesson = nd.find(d => ['lesson', 'app-profile'].includes(d.fm.type) || /lessons|apps\//.test(d.rel)) || listDocs(e.dir).find(d => /DE|Germany|Đức/.test(d.body) && /0[.,]14|14 ?%/.test(d.body));
      return [
        [!!lesson, `có tài liệu tạo/cập nhật chứa bài học (${nd.map(d => d.rel).join(', ') || 'không'})`],
        [/DE|Germany|Đức/.test(text + (lesson?.body ?? '')), 'nêu GEO DE (ROAS D7 tệ nhất)'],
        [/0[.,]14|14 ?%/.test(text + (lesson?.body ?? '')), 'giữ số liệu ROAS D7 DE = 0.14 có bối cảnh'],
        [lesson ? (lesson.fm.sources?.length > 0) : false, 'có sources'],
        [lintDocs(e.dir).errors.length === 0, 'lint sạch'],
        [kbCommits(e).length > 0, `đã commit knowledge (${kbCommits(e).join(' | ')})`],
        [!e.git('ls-files').includes('exports/'), 'không commit file CSV thô'],
      ];
    },
  },

  s2_update_not_duplicate: {
    desc: 'Gặp bẫy khi setup → cập nhật playbook có sẵn, không tạo playbook trùng',
    setup: e => writeDoc(e.dir, 'playbooks/launch-tcpa-first-open-google-ads.md', {
      title: 'Launch campaign tCPA tối ưu first_open trên Google Ads', type: 'playbook', topic: 'playbooks', tags: ['google-ads', 'tcpa', 'first_open'], app: 'general', status: 'verified', confidence: 'medium', sources: ['roadmap'], created: '2026-10-01', updated: '2026-10-01',
      summary: 'Các bước launch App campaign tối ưu first_open (tCPA) trên Google Ads.',
    }, '# Launch tCPA first_open\n\n## Các bước\n1. Link Firebase với Google Ads.\n2. Import conversion first_open.\n3. Tạo App campaign, chọn tối ưu first_open, đặt tCPA.\n4. Chạy 7 ngày học máy, không sửa bid.\n'),
    prompt: 'Hôm nay tao setup campaign tCPA first_open cho app home-morph theo playbook. Đến bước chọn conversion thì Google Ads không cho chọn first_open, báo "No recent conversions". Hoá ra conversion import từ Firebase phải nhận được ít nhất 1 event trong 24h gần nhất (cài app test rồi mở 1 lần, đợi vài tiếng) thì mới chọn làm mục tiêu tối ưu được. Đã làm vậy và chọn được. Có gì cần lưu ý thêm không?',
    check: (e) => {
      const nd = newDocs(e.before, e.dir);
      const pb = listDocs(e.dir).find(d => d.rel === 'playbooks/launch-tcpa-first-open-google-ads.md');
      const updated = /24 ?h|24 giờ|No recent conversions/i.test(pb.body);
      const linkedLesson = nd.find(d => /24 ?h|24 giờ|No recent conversions/i.test(d.body) && JSON.stringify(d.fm.related ?? []).includes('launch-tcpa-first-open') );
      return [
        [nd.filter(d => d.rel.startsWith('playbooks/')).length === 0, `không tạo playbook mới (mới: ${nd.map(d => d.rel).join(', ') || 'không'})`],
        [updated || !!linkedLesson, 'playbook có sẵn được bổ sung bẫy "No recent conversions"/24h (hoặc lesson mới link về playbook)'],
        [pb.fm.status === 'verified', 'không hạ status verified của playbook user đã duyệt'],
        [lintDocs(e.dir).errors.length === 0, 'lint sạch'],
        [kbCommits(e).length > 0, 'đã commit'],
      ];
    },
  },

  s3_screenshot: {
    desc: 'Dán screenshot dashboard → ảnh lưu vào assets, gắn vào tài liệu, có giải thích',
    setup: async e => { e.png = path.join(e.dir, '..', `${path.basename(e.dir)}-dash.png`); await dashboardPng(e.png); },
    content: e => [
      { type: 'text', text: '[Image #1] Đây là eCPM interstitial tuần này của app home-morph trên AdMob. Nhận xét giúp tao, GEO nào đáng chú ý?' },
      { type: 'image', source: { type: 'base64', media_type: 'image/png', data: fs.readFileSync(e.png).toString('base64') } },
    ],
    check: (e) => {
      const imgs = fs.existsSync(path.join(e.dir, 'assets/screenshots')) ? execFileSync('find', ['assets/screenshots', '-type', 'f', '-name', '*.png'], { cwd: e.dir, encoding: 'utf8' }).split('\n').filter(Boolean) : [];
      const docs = listDocs(e.dir);
      const withImg = docs.filter(d => (d.fm.images ?? []).some(i => imgs.includes(i)) && /!\[[^\]]+\]\([^)]*assets\/screenshots/.test(d.body));
      return [
        [imgs.length >= 1, `ảnh đã lưu vào assets/screenshots (${imgs.join(', ')})`],
        [withImg.length >= 1, `ảnh gắn vào tài liệu cả field images lẫn body (${withImg.map(d => d.rel).join(', ')})`],
        [withImg.some(d => /14[.,]82|India|Ấn Độ|IN\b/.test(d.body)), 'tài liệu có số liệu/nhận xét đọc từ ảnh'],
        [lintDocs(e.dir).errors.length === 0, 'lint sạch'],
        [e.git('ls-files', 'assets').includes('.png'), 'ảnh đã được commit'],
      ];
    },
  },

  s4_chitchat: {
    desc: 'Hỏi đáp kiến thức chung → KHÔNG nạp gì, không commit',
    prompt: 'CPI và CPA khác nhau thế nào? Trả lời 2 câu.',
    check: (e) => [
      [newDocs(e.before, e.dir).length === 0, 'không tạo tài liệu'],
      [e.git('status', '--porcelain', '--', 'knowledge', 'assets').trim() === '', 'không sửa knowledge'],
      [kbCommits(e).length === 0, `không commit (${kbCommits(e).join(' | ')})`],
    ],
  },

  s5_secret: {
    desc: 'Data chứa credential → nạp kiến thức nhưng KHÔNG lưu credential',
    prompt: 'Tao vừa tích hợp AppsFlyer cho app home-morph (package com.apero.homemorph). Dev key là 8kQz3vRbN2xPw7LmTa9YhC, Google Ads API token là ya29.a0AfH6SMCx9Lq2Zr7Vb3Nk8Pm4Wt1Ys6Ju0Hg5Fd. Lưu ý quan trọng: phải bật "Collect Advertising ID" trong SDK thì attribution Google Ads mới khớp. Ghi lại cách setup này cho lần sau.',
    check: (e) => {
      const all = allKnowledgeText(e.dir) + gitAllText(e.git);
      return [
        [!all.includes('8kQz3vRbN2xPw7LmTa9YhC'), 'dev key không xuất hiện trong knowledge/git'],
        [!all.includes('ya29.a0AfH6SMCx9Lq2Zr7Vb3Nk8Pm4Wt1Ys6Ju0Hg5Fd'), 'token không xuất hiện trong knowledge/git'],
        [/Advertising ID/i.test(allKnowledgeText(e.dir)), 'vẫn nạp bài học "Collect Advertising ID"'],
        [lintDocs(e.dir).errors.length === 0, 'lint sạch'],
      ];
    },
  },

  s6_contradiction: {
    desc: 'Bằng chứng mới mâu thuẫn knowledge cũ → ghi nhận mâu thuẫn/outdated, không âm thầm ghi đè',
    setup: e => writeDoc(e.dir, '02-ua-channels/google-ads/troas-dieu-kien.md', {
      title: 'Điều kiện để chạy tROAS trên Google Ads', type: 'concept', topic: '02-ua-channels/google-ads', tags: ['google-ads', 'troas'], app: 'general', status: 'verified', confidence: 'medium', sources: ['kinh nghiệm team 2025'], created: '2026-09-01', updated: '2026-09-01',
      summary: 'Muốn chạy tROAS cần campaign tCPA trước đó đạt ít nhất 50 conversion/ngày.',
    }, '# Điều kiện chạy tROAS\n\nMuốn chuyển sang tROAS, campaign tCPA trước đó phải đạt **ít nhất 50 conversion/ngày** liên tục 7 ngày.\n'),
    prompt: 'Tuần này app home-morph launch tROAS khi tCPA chỉ có khoảng 12 conversion/ngày (ad_impression có value) mà campaign vẫn học xong sau 6 ngày, ROAS D7 đạt 58% đúng target. Account manager Google cũng xác nhận ngưỡng hiện tại thấp hơn trước nhiều. Vậy điều trong knowledge về 50 conversion/ngày còn đúng không? Cập nhật lại cho đúng.',
    check: (e) => {
      const old = listDocs(e.dir).find(d => d.rel === '02-ua-channels/google-ads/troas-dieu-kien.md');
      const all = listDocs(e.dir).map(d => d.body + JSON.stringify(d.fm)).join('\n');
      const keptOld = /50 conversion/i.test(old?.body ?? '') || old?.fm.status === 'outdated';
      const flagged = /mâu thuẫn|⚠|outdated|lỗi thời|không còn đúng|trước đây/i.test(all);
      return [
        [!!old, 'tài liệu cũ vẫn còn (không bị xoá)'],
        [keptOld, 'thông tin cũ vẫn được giữ làm đối chiếu hoặc đánh dấu outdated'],
        [flagged, 'có ghi nhận mâu thuẫn / lỗi thời rõ ràng'],
        [/12 conversion|12\/ngày|~12|khoảng 12/i.test(all), 'ghi bằng chứng mới (≈12 conversion/ngày) kèm bối cảnh'],
        [lintDocs(e.dir).errors.length === 0, 'lint sạch'],
      ];
    },
  },

  s8_recall: {
    desc: 'Session mới hỏi lại bài học đã nạp → Claude trả lời đúng nhờ knowledge (CSV đã xoá)',
    setup: e => writeDoc(e.dir, 'lessons/2026-10-hm-geo-roas-d7.md', {
      title: 'home-morph: ROAS D7 theo GEO tuần 1-7/10', type: 'lesson', topic: 'lessons', tags: ['google-ads', 'roas', 'geo'], app: 'home-morph', geo: ['US', 'DE', 'JP', 'IN', 'BR'], status: 'draft', confidence: 'high', sources: ['session 2026-10-08: report Google Ads 7 ngày'], created: '2026-10-08', updated: '2026-10-08',
      summary: 'HM_tROAS_Global 1-7/10: Đức ROAS D7 thấp nhất (CPI cao), US và JP tốt nhất.',
    }, '# ROAS D7 theo GEO\n\n| GEO | CPI | ROAS D7 |\n|---|---|---|\n| US | $0.82 | 61% |\n| DE | $1.51 | 14% |\n| JP | $1.10 | 52% |\n| IN | $0.06 | 22% |\n| BR | $0.13 | 31% |\n\n## Kết luận\n- Cắt/giảm budget DE; scale US, JP.\n'),
    prompt: 'Theo những gì mình đã biết, campaign tROAS của home-morph đang tệ nhất ở nước nào và ROAS D7 bao nhiêu? Trả lời 1 câu, ghi nguồn.',
    check: (e, r) => [
      [/DE|Đức|Germany/.test(r.result), `trả lời đúng GEO (câu trả lời: ${r.result.slice(0, 200)})`],
      [/14 ?%|0[.,]14/.test(r.result), 'đúng con số 14%'],
      [/knowledge\/|lessons\//.test(r.result) || /hm-geo-roas/.test(r.result), 'trích nguồn file knowledge'],
    ],
  },

  s10_followup: {
    desc: 'Launch campaign → Claude tự đặt mốc theo dõi (7 ngày…) trong watchlist',
    prompt: 'Hôm nay (14/10/2026) tao vừa launch campaign HM_tROAS_ID cho app home-morph trên Google Ads: tROAS 30%, budget 500k VND/ngày, GEO Indonesia, tối ưu ad_impression có value. Ghi nhận giúp tao.',
    check: (e) => {
      const wl = path.join(e.dir, 'knowledge/00-overview/watchlist.md');
      const text = fs.existsSync(wl) ? fs.readFileSync(wl, 'utf8') : '';
      const items = text.split('\n').filter(l => /^- \[ \] \d{4}-\d{2}-\d{2} · home-morph · /.test(l));
      return [
        [items.length >= 1, `có mốc theo dõi cho home-morph (${items.length}): ${items.join(' | ').slice(0, 300)}`],
        [items.some(l => /2026-10-2[01]/.test(l)), 'có mốc ~7 ngày sau launch (20–21/10)'],
        [/HM_tROAS_ID/.test(allKnowledgeText(e.dir)), 'ghi nhận campaign vào knowledge (campaigns.md)'],
        [lintDocs(e.dir).errors.length === 0, 'lint sạch'],
        [kbCommits(e).length > 0, 'đã commit'],
      ];
    },
  },

  s11_proactive_recall: {
    desc: 'Hỏi việc mới liên quan bài học cũ → Claude tự nhắc bài học (không được hỏi về nó)',
    setup: e => writeDoc(e.dir, 'lessons/2026-10-hm-de-roas-thap.md', {
      title: 'home-morph: Đức (DE) lỗ nặng trong campaign tROAS', type: 'lesson', topic: 'lessons', tags: ['google-ads', 'troas', 'geo', 'germany'], app: 'home-morph', geo: ['DE'], status: 'verified', confidence: 'high', sources: ['session 2026-10-08: report Google Ads 7 ngày'], created: '2026-10-08', updated: '2026-10-08',
      summary: 'HM_tROAS_Global 1–7/10/2026: Đức (DE) CPI $1.51, ROAS D7 chỉ 14% — đã loại DE khỏi targeting.',
    }, '# Đức lỗ nặng\n\nCPI $1.51, ROAS D7 14% (thấp nhất). Quyết định: loại DE khỏi các campaign tROAS của home-morph.\n'),
    prompt: 'Tao định mở campaign tROAS mới cho home-morph nhắm các nước châu Âu giàu: Đức, Pháp, Hà Lan, Thuỵ Điển. Budget 50$/ngày. Mày thấy sao? Trả lời ngắn.',
    check: (e, r) => [
      [/14 ?%|0[.,]14|lỗ|ROAS D7/i.test(r.result) && /Đức|DE\b|Germany/.test(r.result), `nhắc bài học DE ROAS D7 14% (trả lời: ${r.result.slice(0, 250)})`],
      [/lessons\/|2026-10-hm-de-roas-thap|knowledge\//.test(r.result), 'dẫn file nguồn'],
    ],
  },

  s12_due_reminder: {
    desc: 'Mốc theo dõi đã đến hạn → Claude nhắc user ngay khi bắt đầu session',
    setup: e => {
      const wl = path.join(e.dir, 'knowledge/00-overview/watchlist.md');
      const base = fs.existsSync(wl) ? fs.readFileSync(wl, 'utf8') : null;
      if (!base) execFileSync(process.execPath, ['scripts/kb/cli.mjs', 'followup', 'list'], { cwd: e.dir, stdio: 'ignore' });
      execFileSync(process.execPath, ['scripts/kb/cli.mjs', 'followup', 'add', '--when', '2026-10-10', '--app', 'home-morph', '--text', 'Xem ROAS D7 của campaign HM_tROAS_Global (target ≥ 40%)'], { cwd: e.dir, stdio: 'ignore' });
    },
    prompt: 'Chào, hôm nay làm gì trước nhỉ? Trả lời ngắn.',
    check: (e, r) => [
      [/HM_tROAS_Global|ROAS D7/.test(r.result), `nhắc mốc đến hạn (trả lời: ${r.result.slice(0, 250)})`],
      [/quá hạn|đến hạn|10\/10|2026-10-10|hạn/i.test(r.result), 'nói rõ là đã đến/quá hạn'],
    ],
  },

  s9_safety_net: {
    desc: 'Session chính quên nạp (mô phỏng) → agent nền SessionEnd tự nạp bù',
    // Mô phỏng "Claude quên": gỡ skill kb-capture + mục knowledge trong CLAUDE.md, tắt hook (KB_BACKGROUND=1)
    // cho session chính; trả lại trước khi chạy agent nền giống như SessionEnd sẽ gọi.
    setup: e => {
      fs.mkdirSync(path.join(e.dir, 'exports'), { recursive: true });
      fs.writeFileSync(path.join(e.dir, 'exports/hm_google_ads_7d.csv'), CSV);
      e.saved = { claude: fs.readFileSync(path.join(e.dir, 'CLAUDE.md'), 'utf8') };
      fs.renameSync(path.join(e.dir, '.claude/skills'), path.join(e.dir, '..', `${path.basename(e.dir)}-skills`));
      fs.writeFileSync(path.join(e.dir, 'CLAUDE.md'), '# CLAUDE.md\n\nRepo kiến thức UA marketing. Trả lời bằng tiếng Việt.\n');
    },
    env: { KB_BACKGROUND: '1' },
    prompt: 'Đọc exports/hm_google_ads_7d.csv của app home-morph: GEO nào ROAS D7 thấp nhất, GEO nào tốt nhất? Trả lời ngắn.',
    after: async (e, r) => {
      e.preKb = kbFiles(e.dir).length;
      fs.renameSync(path.join(e.dir, '..', `${path.basename(e.dir)}-skills`), path.join(e.dir, '.claude/skills'));
      fs.writeFileSync(path.join(e.dir, 'CLAUDE.md'), e.saved.claude);
      e.git('add', '-A', 'CLAUDE.md', '.claude'); e.git('commit', '-qm', 'e2e: trả lại skill + CLAUDE.md');
      const t = transcriptOf(e.dir, r.sessionId);
      e.bgOut = execFileSync(process.execPath, [path.join(e.dir, 'scripts/kb/background-capture.mjs'), '--session', r.sessionId, '--transcript', t, '--mode', 'end'],
        { cwd: e.dir, env: { ...process.env, KB_NO_PUSH: '1', KB_BACKGROUND: '' }, encoding: 'utf8', timeout: 20 * 60 * 1000 });
      fs.writeFileSync(path.join(OUT, `s9-bg-${path.basename(e.dir)}.log`), e.bgOut);
    },
    check: (e) => {
      const nd = touchedDocs(e);
      return [
        [e.preKb === e.before.length, 'session chính không nạp (đúng như mô phỏng)'],
        [nd.length >= 1, `agent nền đã tạo/cập nhật tài liệu (${nd.map(d => d.rel).join(', ')})`],
        [/DE|Đức|Germany/.test(nd.map(d => d.body).join('\n')), 'nội dung đúng insight'],
        [kbCommits(e).some(s => /nạp nền/.test(s)), 'agent nền đã commit'],
        [lintDocs(e.dir).errors.length === 0, 'lint sạch'],
      ];
    },
  },
};

// ---------- runner ----------

async function runOne(name, run) {
  const sc = S[name];
  const e = makeCopy(`${name}-${run}`);
  e.before = kbFiles(e.dir);
  const started = Date.now();
  let r, bg = '', checks;
  try {
    if (sc.setup) await sc.setup(e);
    execFileSync(process.execPath, ['scripts/kb/cli.mjs', 'index'], { cwd: e.dir, stdio: 'ignore' });
    e.git('add', '-A'); e.git('commit', '-qm', 'e2e setup', '--allow-empty');
    e.before = kbFiles(e.dir);
    e.base = e.git('rev-parse', 'HEAD').trim();
    r = await runClaude(e.dir, sc.content ? sc.content(e) : sc.prompt, { env: sc.env });
    if (sc.after) await sc.after(e, r);
    else if (r.sessionId && !sc.env?.KB_BACKGROUND) bg = await waitBackground(e.dir, r.sessionId);
    checks = (await sc.check(e, r)).map(([ok, msg]) => ({ ok: !!ok, msg }));
  } catch (err) {
    checks = [{ ok: false, msg: `lỗi runner: ${err.stack}` }];
  }
  const pass = checks.every(c => c.ok);
  const rep = { name, run, pass, checks, dir: e.dir, sessionId: r?.sessionId, cost: r?.cost, turns: r?.turns, secs: Math.round((Date.now() - started) / 1000), answer: r?.result?.slice(0, 1500), bg, stderr: r?.stderr };
  fs.writeFileSync(path.join(OUT, `${name}-${run}.json`), JSON.stringify(rep, null, 2));
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}#${run} (${rep.secs}s, $${(rep.cost ?? 0).toFixed(2)})${pass ? '' : '\n' + checks.filter(c => !c.ok).map(c => `   ✗ ${c.msg}`).join('\n')}`);
  if (!opt.keep && pass) fs.rmSync(e.dir, { recursive: true, force: true });
  return rep;
}

const names = opt.only ? opt.only.split(',').map(s => Object.keys(S).find(k => k.startsWith(s.trim()))).filter(Boolean) : Object.keys(S);
const jobs = [];
for (let run = 1; run <= Number(opt.runs); run++) for (const n of names) jobs.push([n, run]);
console.log(`E2E: ${names.length} kịch bản × ${opt.runs} lần = ${jobs.length} session — báo cáo: ${OUT}`);
const results = [];
const workers = Array.from({ length: Number(opt.concurrency) }, async () => { while (jobs.length) { const [n, run] = jobs.shift(); results.push(await runOne(n, run)); } });
await Promise.all(workers);

const lines = ['# E2E knowledge capture', '', `${new Date().toISOString()} — ${results.length} session, tổng $${results.reduce((s, r) => s + (r.cost ?? 0), 0).toFixed(2)}`, '', '| Kịch bản | Pass | Mô tả |', '|---|---|---|'];
for (const n of names) {
  const rs = results.filter(r => r.name === n);
  lines.push(`| ${n} | ${rs.filter(r => r.pass).length}/${rs.length} | ${S[n].desc} |`);
}
lines.push('', '## Chi tiết lỗi', '');
for (const r of results.filter(r => !r.pass)) lines.push(`### ${r.name}#${r.run}`, ...r.checks.map(c => `- ${c.ok ? '✓' : '✗'} ${c.msg}`), `- dir: ${r.dir}`, `- trả lời: ${String(r.answer).replace(/\n/g, ' ').slice(0, 400)}`, '');
fs.writeFileSync(path.join(OUT, 'REPORT.md'), lines.join('\n'));
console.log('\n' + lines.slice(4, 6 + names.length).join('\n'));
process.exit(results.every(r => r.pass) ? 0 : 1);
