// Recall: tìm tài liệu knowledge liên quan tới một đoạn text (prompt của user) để chèn vào context.
import MiniSearch from 'minisearch';
import { root, listDocs, foldVi } from './lib.mjs';

// Từ phổ biến (đã bỏ dấu) — không mang nghĩa chủ đề.
const STOP = new Set(`la cua va cho cac nhung mot nay do thi co khong duoc de voi trong tao may giup minh nao gi the nhu ve khi da se dang ra len vao lam hay roi con nua cung chi toi ban di den tu theo nen neu vi sao bao nhieu the nao duoc xem cai nhe nhi a oi u uh ok vay day kia ay hon het moi rat qua lai cho biet hoi tra loi
the a an of to in for on and or is are be with this that it how what which why can do does i you we my our me please`.split(/\s+/));

let cache = null;
function index(r) {
  const docs = listDocs(r).filter(d => !d.error);
  const sig = docs.map(d => `${d.rel}:${d.fm.updated}:${d.body.length}`).join('|');
  if (cache?.sig === sig && cache.r === r) return cache;
  const ms = new MiniSearch({
    fields: ['title', 'summary', 'tags', 'app', 'body'], storeFields: ['rel', 'title', 'summary', 'status', 'type', 'app'], idField: 'rel',
    processTerm: t => { const f = foldVi(t).toLowerCase(); return f.length < 2 || STOP.has(f) ? null : f; },
    searchOptions: { boost: { title: 3, summary: 2, tags: 2, app: 2 }, prefix: false, fuzzy: false },
  });
  ms.addAll(docs.map(d => ({ rel: d.rel, title: d.fm.title, summary: d.fm.summary, tags: (d.fm.tags ?? []).join(' '), app: d.fm.app, body: d.body, status: d.fm.status, type: d.fm.type })));
  cache = { sig, r, ms };
  return cache;
}

const SKIP = new Set(['00-overview/current-state.md', '00-overview/watchlist.md']);

// Trả về tối đa `limit` tài liệu khớp đủ mạnh: ≥ minTerms từ khoá khác nhau trùng.
export function recall(text, { r = root(), limit = 3, minTerms = 2 } = {}) {
  const q = String(text ?? '').slice(0, 2000);
  if (q.replace(/\s+/g, ' ').trim().length < 12) return [];
  const { ms } = index(r);
  const hits = ms.search(q, { combineWith: 'OR' })
    .filter(h => !SKIP.has(h.id) && h.status !== 'outdated' && new Set(h.terms).size >= minTerms);
  if (!hits.length) return [];
  const top = hits[0].score;
  return hits.filter(h => h.score >= top * 0.35).slice(0, limit)
    .map(h => ({ rel: h.id, title: h.title, summary: h.summary, status: h.status, type: h.type, app: h.app, score: Math.round(h.score * 10) / 10, terms: [...new Set(h.terms)] }));
}
