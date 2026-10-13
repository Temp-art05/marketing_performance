// Sức khoẻ knowledge: chỉ ra chỗ cần duyệt / bổ sung / dọn. Dùng cho CLI `kb doctor`, SessionStart, web /api/suggestions.
import fs from 'node:fs';
import path from 'node:path';
import { root, listDocs, walk, SCREENSHOT_DIR, today, readJSON } from './lib.mjs';
import { listFollowups, WATCHLIST_REL } from './followups.mjs';

const daysBetween = (a, b) => Math.round((new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)) / 86400000);
const STALE_DRAFT_DAYS = 14;
const CURRENT_STATE_MAX_LINES = 40;

// Trả về { followups: {due, upcoming}, drafts, issues: [{kind, severity, rel, msg}] }
export function diagnose(r = root()) {
  const docs = listDocs(r).filter(d => !d.error);
  const t = today();
  const issues = [];
  const add = (kind, severity, rel, msg) => issues.push({ kind, severity, rel, msg });
  const byRel = new Map(docs.map(d => [d.rel, d]));

  for (const d of docs) {
    const fm = d.fm;
    if (fm.status === 'draft' && fm.created && daysBetween(String(fm.created), t) > STALE_DRAFT_DAYS) {
      add('stale-draft', 'warn', d.rel, `Draft ${daysBetween(String(fm.created), t)} ngày chưa duyệt`);
    }
    if (fm.confidence === 'low' && fm.status !== 'outdated') add('low-confidence', 'info', d.rel, 'Độ tin cậy thấp — cần số liệu thật/nguồn chính thức để xác nhận');
    if (fm.status === 'outdated' && !(fm.related ?? []).length) add('outdated-no-replacement', 'warn', d.rel, 'Đã lỗi thời nhưng chưa trỏ tới bài thay thế (related)');
    if (/⚠️\s*Mâu thuẫn/i.test(d.body) && fm.status !== 'outdated') add('conflict', 'warn', d.rel, 'Có mục "⚠️ Mâu thuẫn" chưa giải quyết');
    for (const rel of fm.related ?? []) {
      const other = byRel.get(rel);
      // trang trung tâm (roadmap, glossary...) không cần link ngược
      if (other && !rel.startsWith('00-overview/') && !(other.fm.related ?? []).includes(d.rel)) add('one-way-related', 'info', d.rel, `Liên kết một chiều tới ${rel}`);
    }
  }

  // App có tài liệu nhưng thiếu hồ sơ
  const apps = new Set(docs.map(d => d.fm.app).filter(a => a && a !== 'general'));
  for (const a of apps) if (!byRel.has(`apps/${a}/profile.md`)) add('app-missing-profile', 'warn', `apps/${a}/profile.md`, `App "${a}" chưa có hồ sơ (profile.md)`);

  const cs = byRel.get('00-overview/current-state.md');
  if (cs && cs.body.split('\n').length > CURRENT_STATE_MAX_LINES + 10) add('current-state-long', 'warn', cs.rel, `current-state dài ${cs.body.split('\n').length} dòng — rút gọn (nó được nạp vào mọi session)`);

  // Ảnh không tài liệu nào dùng
  const used = new Set();
  for (const d of docs) {
    for (const p of d.fm.images ?? []) used.add(p);
    for (const m of d.body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) if (!/^https?:/.test(m[1])) used.add(path.posix.normalize(path.posix.join('knowledge', path.posix.dirname(d.rel), decodeURI(m[1]))));
  }
  for (const abs of walk(path.join(r, SCREENSHOT_DIR), p => /\.(png|jpe?g|gif|webp)$/i.test(p))) {
    const rel = path.relative(r, abs).split(path.sep).join('/');
    if (!used.has(rel)) add('orphan-image', 'info', rel, 'Ảnh chưa gắn vào tài liệu nào');
  }

  const fu = listFollowups(r).filter(f => !f.done);
  const in7 = new Date(`${t}T00:00:00`); in7.setDate(in7.getDate() + 7);
  const horizon = in7.toISOString().slice(0, 10);
  const drafts = docs.filter(d => d.fm.status === 'draft').map(d => ({ rel: d.rel, title: d.fm.title, created: d.fm.created, age: d.fm.created ? daysBetween(String(d.fm.created), t) : null }))
    .sort((a, b) => (b.age ?? 0) - (a.age ?? 0));

  return {
    today: t,
    followups: { due: fu.filter(f => f.due), upcoming: fu.filter(f => !f.due && f.date <= horizon), open: fu.length },
    drafts,
    issues: issues.sort((a, b) => (a.severity === b.severity ? a.kind.localeCompare(b.kind) : a.severity === 'warn' ? -1 : 1)),
    watchlist: WATCHLIST_REL,
  };
}

// 1–3 dòng cho SessionStart context.
export function sessionSummary(r = root()) {
  const dx = diagnose(r);
  const lines = [];
  if (dx.followups.due.length) {
    lines.push(`[KB] ⏰ ${dx.followups.due.length} mốc theo dõi ĐẾN HẠN (knowledge/${dx.watchlist}) — nhắc user ngay đầu câu trả lời đầu tiên:`);
    for (const f of dx.followups.due.slice(0, 8)) lines.push(`  - ${f.date}${f.overdue ? ' (quá hạn)' : ''} · ${f.app} · ${f.text}`);
  }
  if (dx.followups.upcoming.length) lines.push(`[KB] Sắp tới (7 ngày): ${dx.followups.upcoming.map(f => `${f.date} ${f.app}: ${f.text.slice(0, 60)}`).join(' | ')}`);
  const warn = dx.issues.filter(i => i.severity === 'warn');
  const counts = {};
  for (const i of warn) counts[i.kind] = (counts[i.kind] ?? 0) + 1;
  if (warn.length) lines.push(`[KB] Sức khoẻ knowledge: ${Object.entries(counts).map(([k, n]) => `${n} ${k}`).join(', ')} — chi tiết: node scripts/kb/cli.mjs doctor`);
  return lines;
}
