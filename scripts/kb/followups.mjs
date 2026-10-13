// Mốc theo dõi (follow-ups): knowledge/00-overview/watchlist.md, mỗi mục 1 dòng checkbox:
//   - [ ] 2026-10-21 · home-morph · Xem ROAS D7 campaign X ([campaigns](../apps/home-morph/campaigns.md))
import fs from 'node:fs';
import path from 'node:path';
import { root, KNOWLEDGE_DIR, parseDoc, serializeDoc, today } from './lib.mjs';

export const WATCHLIST_REL = '00-overview/watchlist.md';
export const ITEM_RE = /^(\s*)- \[( |x|X)\] (\d{4}-\d{2}-\d{2}) · ([a-z0-9-]+) · (.+?)\s*$/;
// Dòng checkbox nhưng sai định dạng → lint báo
export const LOOSE_ITEM_RE = /^\s*- \[( |x|X)\] /;

const watchPath = r => path.join(r, KNOWLEDGE_DIR, WATCHLIST_REL);

function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  const p = x => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// "7d", "2w", "1m", "6m" → ngày; hoặc YYYY-MM-DD giữ nguyên.
export function resolveDate(spec, from = today()) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(spec)) return spec;
  const m = /^(\d+)\s*(d|w|m)$/i.exec(String(spec).trim());
  if (!m) throw new Error(`Ngày không hợp lệ: "${spec}" (dùng YYYY-MM-DD hoặc 7d / 2w / 1m)`);
  const n = Number(m[1]);
  return addDays(from, m[2].toLowerCase() === 'd' ? n : m[2].toLowerCase() === 'w' ? n * 7 : n * 30);
}

const SKELETON_BODY = `# Mốc theo dõi

> Mỗi dòng: \`- [ ] YYYY-MM-DD · app-slug · việc cần làm (link tài liệu)\`. Tick khi xong.
> Claude thêm mốc khi launch / đổi campaign (theo roadmap: 7 ngày, 1 tháng, 4 tháng, 6 tháng) và nhắc khi đến hạn.

## Đang mở

## Đã xong
`;

export function ensureWatchlist(r = root()) {
  const p = watchPath(r);
  if (fs.existsSync(p)) return p;
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const d = today();
  fs.writeFileSync(p, serializeDoc({
    title: 'Mốc theo dõi', type: 'overview', topic: '00-overview', tags: ['watchlist', 'follow-up'], app: 'general',
    status: 'verified', confidence: 'high', sources: ['hệ thống knowledge'], created: d, updated: d,
    summary: 'Danh sách mốc cần xem lại (ROAS D7, 1 tháng, 4 tháng…) theo app — Claude nhắc khi đến hạn.',
  }, SKELETON_BODY));
  return p;
}

export function listFollowups(r = root()) {
  const p = watchPath(r);
  if (!fs.existsSync(p)) return [];
  const t = today();
  return fs.readFileSync(p, 'utf8').split('\n').map((line, i) => {
    const m = ITEM_RE.exec(line);
    if (!m) return null;
    const done = m[2] !== ' ';
    return { line: i, done, date: m[3], app: m[4], text: m[5], due: !done && m[3] <= t, overdue: !done && m[3] < t };
  }).filter(Boolean);
}

function writeBody(r, mutate) {
  const p = ensureWatchlist(r);
  const { fm, body } = parseDoc(fs.readFileSync(p, 'utf8'));
  const lines = body.split('\n');
  mutate(lines);
  fs.writeFileSync(p, serializeDoc({ ...fm, updated: today() }, lines.join('\n')));
}

// Thêm mục vào "## Đang mở", giữ thứ tự theo ngày. Trùng (cùng ngày+app+text) thì bỏ qua.
export function addFollowup({ date, app = 'general', text }, r = root()) {
  if (!text?.trim()) throw new Error('Thiếu nội dung việc cần làm');
  if (!/^[a-z0-9-]+$/.test(app)) throw new Error(`app phải là slug: ${app}`);
  const d = resolveDate(date);
  const item = `- [ ] ${d} · ${app} · ${text.trim().replace(/\s+/g, ' ')}`;
  if (listFollowups(r).some(f => !f.done && f.date === d && f.app === app && f.text === text.trim())) return { item, duplicate: true };
  writeBody(r, lines => {
    let h = lines.findIndex(l => /^## Đang mở/.test(l));
    if (h === -1) { lines.push('', '## Đang mở', ''); h = lines.length - 2; }
    let end = lines.findIndex((l, i) => i > h && /^## /.test(l));
    if (end === -1) end = lines.length;
    let at = end;
    for (let i = h + 1; i < end; i++) { const m = ITEM_RE.exec(lines[i]); if (m && m[3] > d) { at = i; break; } }
    if (at === end) { while (at > h + 1 && lines[at - 1].trim() === '') at--; }
    lines.splice(at, 0, item);
  });
  return { item, duplicate: false };
}

// Đánh dấu xong: theo số thứ tự trong listFollowups (mở) hoặc chuỗi con của text; chuyển sang "## Đã xong".
export function completeFollowup(selector, { note } = {}, r = root()) {
  const open = listFollowups(r).filter(f => !f.done);
  const target = /^\d+$/.test(String(selector)) ? open[Number(selector) - 1] : open.find(f => f.text.toLowerCase().includes(String(selector).toLowerCase()));
  if (!target) throw new Error(`Không tìm thấy mốc đang mở: ${selector}`);
  writeBody(r, lines => {
    // dòng trong body: tìm lại theo nội dung (listFollowups đánh số theo cả file)
    const idx = lines.findIndex(l => { const m = ITEM_RE.exec(l); return m && m[2] === ' ' && m[3] === target.date && m[4] === target.app && m[5] === target.text; });
    const [line] = lines.splice(idx, 1);
    const doneLine = line.replace('- [ ]', '- [x]') + (note ? ` — ${note.trim()} (${today()})` : ` (xong ${today()})`);
    let h = lines.findIndex(l => /^## Đã xong/.test(l));
    if (h === -1) { lines.push('', '## Đã xong', ''); h = lines.length - 2; }
    lines.splice(h + 1, 0, doneLine);
  });
  return target;
}

// Lint watchlist: dòng checkbox phải đúng định dạng.
export function lintWatchlist(body) {
  return body.split('\n').map((l, i) => (LOOSE_ITEM_RE.test(l) && !ITEM_RE.test(l) ? `Dòng ${i + 1} sai định dạng mốc: "${l.trim().slice(0, 80)}" — cần "- [ ] YYYY-MM-DD · app-slug · việc cần làm"` : null)).filter(Boolean);
}
