// SPA xem/sửa knowledge. Router theo hash: #/, #/doc/<rel>, #/edit/<rel>, #/new, #/browse, #/search, #/gallery, #/timeline, #/roadmap
import { marked } from '/vendor/marked.js';
import DOMPurify from '/vendor/purify.js';
import MiniSearch from '/vendor/minisearch.js';

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const main = $('#main');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fold = s => String(s ?? '').normalize('NFC').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const slugify = s => fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'untitled';
const TYPE_LABEL = { overview: 'Tổng quan', concept: 'Kiến thức', playbook: 'Playbook', lesson: 'Bài học', decision: 'Quyết định', 'app-profile': 'Hồ sơ app', reference: 'Tham khảo' };
const STATUS_LABEL = { draft: 'Draft', verified: 'Đã duyệt', outdated: 'Lỗi thời' };

const S = { meta: null, docs: [], byRel: new Map(), images: [], ms: null, sig: '', dirty: false };

// ---------- API ----------
async function api(method, url, body, headers = {}) {
  const opts = { method, headers: { ...headers } };
  if (body instanceof Blob) opts.body = body;
  else if (body !== undefined) { opts.body = JSON.stringify(body); opts.headers['Content-Type'] = 'application/json'; }
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || res.statusText), { status: res.status, data });
  return data;
}

async function load() {
  const [meta, docs, images] = await Promise.all([api('GET', '/api/meta'), api('GET', '/api/docs?full=1'), api('GET', '/api/images')]);
  S.meta = meta; S.images = images;
  S.docs = docs.filter(d => !d.error).sort((a, b) => String(b.fm.updated).localeCompare(String(a.fm.updated)) || b.mtime - a.mtime);
  S.broken = docs.filter(d => d.error);
  S.byRel = new Map(S.docs.map(d => [d.rel, d]));
  S.sig = docs.map(d => d.rel + d.mtime).join('|');
  S.ms = new MiniSearch({
    fields: ['title', 'summary', 'tags', 'app', 'body'], storeFields: ['rel'], idField: 'rel',
    processTerm: t => fold(t),
    searchOptions: { boost: { title: 3, summary: 2, tags: 2 }, prefix: true, fuzzy: 0.15, combineWith: 'AND' },
  });
  S.ms.addAll(S.docs.map(d => ({ rel: d.rel, title: d.fm.title, summary: d.fm.summary, tags: (d.fm.tags || []).join(' '), app: d.fm.app, body: d.body })));
  renderGitPill();
}

// ---------- đường dẫn ----------
function resolvePath(baseDir, rel) {
  const parts = baseDir ? baseDir.split('/') : [];
  for (const seg of rel.split('/')) {
    if (seg === '..') parts.pop(); else if (seg !== '.' && seg !== '') parts.push(seg);
  }
  return parts.join('/');
}
function relativePath(fromDir, to) {
  const a = fromDir.split('/').filter(Boolean), b = to.split('/').filter(Boolean);
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return [...Array(a.length - i).fill('..'), ...b.slice(i)].join('/');
}
const dirOf = rel => rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '';
const docHref = rel => `#/doc/${encodeURI(rel)}`;

// ---------- markdown ----------
marked.setOptions({ gfm: true, breaks: false });

function renderMarkdown(body, rel, { interactive = false } = {}) {
  const html = DOMPurify.sanitize(marked.parse(body || ''), { ADD_ATTR: ['target'] });
  const box = document.createElement('div');
  box.className = 'prose';
  box.innerHTML = html;
  const base = 'knowledge/' + dirOf(rel);
  for (const img of $$('img', box)) {
    const src = img.getAttribute('src') || '';
    if (!/^(https?:|data:|\/)/.test(src)) img.src = '/' + resolvePath(base, decodeURI(src));
    img.loading = 'lazy';
  }
  for (const a of $$('a', box)) {
    const href = a.getAttribute('href') || '';
    if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; continue; }
    const m = /^([^#?]+\.md)(#.*)?$/.exec(href);
    if (m) { const target = resolvePath(base, decodeURI(m[1])).replace(/^knowledge\//, ''); a.href = docHref(target); if (!S.byRel.has(target)) a.classList.add('broken'); }
  }
  // Checkbox GFM: bật cho tương tác (lưu thẳng vào file)
  $$('input[type=checkbox]', box).forEach((cb, i) => {
    if (!interactive) return;
    cb.disabled = false;
    cb.addEventListener('change', async () => {
      try { await api('POST', '/api/check', { rel, index: i, checked: cb.checked }); toast(cb.checked ? 'Đã đánh dấu hoàn thành' : 'Đã bỏ đánh dấu'); const y = scrollY; await refresh(); scrollTo(0, y); }
      catch (e) { cb.checked = !cb.checked; toast(e.message, true); }
    });
  });
  for (const tbl of $$('table', box)) tbl.setAttribute('role', 'table');
  const imgs = $$('img', box);
  imgs.forEach((img, i) => img.addEventListener('click', () => openLightbox(imgs.map(x => ({ src: x.src, alt: x.alt })), i)));
  return box;
}

// ---------- UI chung ----------
let toastTimer;
function toast(msg, bad = false) {
  const t = $('#toast');
  t.textContent = msg; t.className = 'toast' + (bad ? ' bad' : ''); t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, bad ? 6000 : 2800);
}

function badges(fm, { link = true } = {}) {
  const out = [];
  if (fm.type) out.push(`<span class="badge type">${esc(TYPE_LABEL[fm.type] || fm.type)}</span>`);
  if (fm.status) out.push(`<span class="badge ${esc(fm.status)}">${esc(STATUS_LABEL[fm.status] || fm.status)}</span>`);
  if (fm.app && fm.app !== 'general') out.push(link ? `<a class="badge" href="#/browse?app=${encodeURIComponent(fm.app)}">📱 ${esc(fm.app)}</a>` : `<span class="badge">📱 ${esc(fm.app)}</span>`);
  for (const g of fm.geo || []) out.push(`<span class="badge">🌍 ${esc(g)}</span>`);
  return out.join('');
}

function docItem(d, { q } = {}) {
  const fm = d.fm;
  const imgs = (fm.images || []).length;
  const snippet = q ? makeSnippet(d.body, q) : '';
  return `<li><a class="t" href="${docHref(d.rel)}">${q ? highlight(fm.title, q) : esc(fm.title)}</a>
    <div class="s">${q ? highlight(fm.summary, q) : esc(fm.summary)}</div>
    ${snippet ? `<div class="s">…${snippet}…</div>` : ''}
    <div class="m">${badges(fm, { link: false })} <span class="muted">${esc(d.rel)} · cập nhật ${esc(fm.updated)}${imgs ? ` · 🖼 ${imgs}` : ''}</span></div></li>`;
}

function terms(q) { return fold(q).split(/\s+/).filter(t => t.length > 1); }
function highlight(text, q) {
  text = String(text ?? '').normalize('NFC');
  const f = fold(text), ts = terms(q);
  if (!ts.length) return esc(text);
  const marks = new Array(text.length).fill(false);
  for (const t of ts) { let i = f.indexOf(t); while (i !== -1) { for (let k = i; k < i + t.length; k++) marks[k] = true; i = f.indexOf(t, i + t.length); } }
  let out = '', open = false;
  for (let i = 0; i < text.length; i++) {
    if (marks[i] && !open) { out += '<mark>'; open = true; }
    if (!marks[i] && open) { out += '</mark>'; open = false; }
    out += esc(text[i]);
  }
  return out + (open ? '</mark>' : '');
}
function makeSnippet(body, q) {
  const text = String(body ?? '').normalize('NFC').replace(/[#*`>|_\[\]()!-]+/g, ' ').replace(/\s+/g, ' ');
  const f = fold(text);
  const pos = Math.min(...terms(q).map(t => f.indexOf(t)).filter(i => i >= 0));
  if (!isFinite(pos)) return '';
  return highlight(text.slice(Math.max(0, pos - 70), pos + 130), q);
}

function renderGitPill() {
  const g = S.meta?.git; const el = $('#git-pill');
  if (!g) return;
  const pending = g.dirty + g.pending;
  if (g.lastCommit?.ok === false) { el.className = 'pill warn'; el.textContent = '⚠ commit lỗi'; el.title = g.lastCommit.output; return; }
  if (pending) { el.className = 'pill warn'; el.textContent = `● ${pending} thay đổi chờ commit`; el.title = 'Tự commit + push sau vài giây'; return; }
  if (g.ahead) { el.className = 'pill warn'; el.textContent = `↑ ${g.ahead} chưa push`; el.title = g.last; return; }
  el.className = 'pill ok'; el.textContent = '✓ đã đồng bộ'; el.title = g.last;
}

// ---------- sidebar ----------
function renderSidebar(active = '') {
  const tree = {};
  for (const d of S.docs) {
    let node = tree;
    for (const seg of dirOf(d.rel).split('/').filter(Boolean)) { node[seg] ??= { __docs: [] }; node = node[seg]; }
    (node.__docs ??= []).push(d);
  }
  const count = n => (n.__docs?.length || 0) + Object.keys(n).filter(k => k !== '__docs').reduce((s, k) => s + count(n[k]), 0);
  const topicOrder = Object.keys(S.meta.topics);
  const renderNode = (node, prefix) => {
    const keys = Object.keys(node).filter(k => k !== '__docs').sort((a, b) => (topicOrder.indexOf(a) + 1 || 99) - (topicOrder.indexOf(b) + 1 || 99) || a.localeCompare(b));
    let html = '';
    for (const k of keys) {
      const p = prefix ? `${prefix}/${k}` : k;
      const open = active.startsWith(p + '/') ? ' open' : '';
      html += `<details${open}><summary title="${esc(S.meta.topics[p] || p)}"><span class="sum-label">${esc(k)}</span><span class="count">${count(node[k])}</span></summary><div class="children">${renderNode(node[k], p)}</div></details>`;
    }
    for (const d of (node.__docs || []).sort((a, b) => a.fm.title.localeCompare(b.fm.title))) {
      html += `<a href="${docHref(d.rel)}" class="${d.rel === active ? 'active' : ''}" title="${esc(d.fm.summary)}">${d.fm.status === 'draft' ? '<span class="muted">◌</span> ' : ''}${esc(d.fm.title)}</a>`;
    }
    return html;
  };
  const drafts = S.docs.filter(d => d.fm.status === 'draft').length;
  const apps = S.meta.apps.map(a => `<a href="#/browse?app=${encodeURIComponent(a)}">📱 ${esc(a)}</a>`).join('');
  $('#sidebar').innerHTML = `
    <h4>Trang</h4>
    <a href="#/">🏠 Trang chủ</a>
    <a href="#/browse">📚 Tất cả tài liệu <span class="count">${S.docs.length}</span></a>
    <a href="#/browse?status=draft">◌ Draft cần duyệt <span class="count">${drafts}</span></a>
    <a href="#/gallery">🖼 Ảnh chụp màn hình <span class="count">${S.images.length}</span></a>
    <a href="#/timeline">🕒 Timeline bài học</a>
    <a href="#/roadmap">🗺 Roadmap</a>
    ${apps ? `<h4>Apps</h4>${apps}` : ''}
    <h4>Chủ đề</h4>
    ${renderNode(tree, '')}`;
}

// <select> bộ lọc; values: chuỗi hoặc [giá trị, nhãn].
function filterSelect(f, name, values, label) {
  const pair = v => Array.isArray(v) ? v : [v, v];
  return `<select data-k="${name}" aria-label="${esc(label)}"><option value="">${esc(label)}</option>${values.map(v => { const [val, lab] = pair(v); return `<option value="${esc(val)}" ${(f[name] ?? '') === val ? 'selected' : ''}>${esc(lab)}</option>`; }).join('')}</select>`;
}

// ---------- trang ----------
const pages = {};

pages.home = () => {
  const drafts = S.docs.filter(d => d.fm.status === 'draft');
  const lessons = S.docs.filter(d => d.fm.type === 'lesson');
  const cs = S.byRel.get('00-overview/current-state.md');
  main.innerHTML = `
    <div class="page-head"><div><h1>UA Marketing Knowledge</h1><div class="muted">Kho kiến thức UA cho app Android kiếm tiền bằng quảng cáo — Claude tự nạp sau mỗi session.</div></div>
      <div class="actions"><a class="btn primary" href="#/new">+ Tạo tài liệu</a></div></div>
    <div class="grid stats">
      <a class="card stat" href="#/browse"><div class="n">${S.docs.length}</div><div class="l">tài liệu</div></a>
      <a class="card stat" href="#/browse?status=draft"><div class="n">${drafts.length}</div><div class="l">draft cần duyệt</div></a>
      <a class="card stat" href="#/timeline"><div class="n">${lessons.length}</div><div class="l">bài học</div></a>
      <a class="card stat" href="#/gallery"><div class="n">${S.images.length}</div><div class="l">ảnh chụp màn hình</div></a>
    </div>
    ${S.broken.length ? `<div class="err-box">⚠ ${S.broken.length} file lỗi frontmatter, không hiển thị được: ${S.broken.map(b => esc(b.rel)).join(', ')}</div>` : ''}
    <div class="grid two-col">
      <div class="card" id="cs"><div class="page-head" style="margin:0"><h2 style="margin:0">Trạng thái hiện tại</h2>${cs ? `<a class="btn small" href="#/edit/${encodeURI(cs.rel)}">Sửa</a>` : ''}</div></div>
      <div class="card"><h2 style="margin-top:0">Mới cập nhật</h2><ul class="doc-list">${S.docs.slice(0, 8).map(d => docItem(d)).join('') || '<li class="muted">Chưa có tài liệu</li>'}</ul></div>
    </div>
    ${drafts.length ? `<h2>Draft cần duyệt</h2><div class="card"><ul class="doc-list">${drafts.slice(0, 10).map(d => docItem(d)).join('')}</ul>${drafts.length > 10 ? `<a href="#/browse?status=draft">Xem tất cả ${drafts.length} →</a>` : ''}</div>` : ''}
    ${S.images.length ? `<h2>Ảnh mới</h2><div class="grid gallery" id="home-shots"></div>` : ''}`;
  if (cs) $('#cs').append(renderMarkdown(cs.body.replace(/^\s*#\s.*\n/, ''), cs.rel));
  if (S.images.length) renderShots($('#home-shots'), S.images.slice(0, 8));
};

pages.doc = async (rel) => {
  let d;
  try { d = await api('GET', `/api/doc?rel=${encodeURIComponent(rel)}`); } catch (e) { main.innerHTML = `<div class="empty">Không tìm thấy <code>${esc(rel)}</code></div>`; return; }
  const fm = d.fm;
  const related = (fm.related || []).map(r => S.byRel.get(r)).filter(Boolean);
  const backlinks = S.docs.filter(x => x.rel !== rel && !related.includes(x) && ((x.fm.related || []).includes(rel) || x.body.includes(rel.split('/').pop()))).slice(0, 10);
  const imgs = (fm.images || []);
  const crumbs = dirOf(rel).split('/').filter(Boolean).map((seg, i, arr) => `<a href="#/browse?topic=${encodeURIComponent(arr.slice(0, i + 1).join('/'))}">${esc(seg)}</a>`).join(' / ');
  main.innerHTML = `
    <div class="crumbs">${crumbs}</div>
    <div class="page-head"><div><h1>${esc(fm.title)}</h1><div>${badges(fm)}</div></div>
      <div class="actions">
        ${fm.status === 'draft' ? '<button class="btn" id="verify">✓ Duyệt</button>' : ''}
        <a class="btn primary" href="#/edit/${encodeURI(rel)}">✎ Sửa</a>
        <button class="btn danger" id="del">Xoá</button>
      </div></div>
    ${d.error ? `<div class="err-box">${esc(d.error)}</div>` : ''}
    ${fm.status === 'outdated' ? '<div class="warn-box">Tài liệu này đã lỗi thời — xem các tài liệu liên quan để có thông tin mới.</div>' : ''}
    <div class="doc-wrap"><div><div class="summary-box">${esc(fm.summary)}</div><div id="body"></div></div>
    <aside class="meta-side card"><dl>
      <dt>Cập nhật</dt><dd>${esc(fm.updated)} <span class="muted">(tạo ${esc(fm.created)})</span></dd>
      ${fm.confidence ? `<dt>Độ tin cậy</dt><dd>${esc(fm.confidence)}</dd>` : ''}
      ${(fm.tags || []).length ? `<dt>Tags</dt><dd>${fm.tags.map(t => `<a class="badge" href="#/browse?tag=${encodeURIComponent(t)}">#${esc(t)}</a>`).join('')}</dd>` : ''}
      ${(fm.sources || []).length ? `<dt>Nguồn</dt><dd>${fm.sources.map(s => `<div>${/^https?:/.test(s) ? `<a href="${esc(s.split(' ')[0])}" target="_blank" rel="noopener">${esc(s)}</a>` : esc(s)}</div>`).join('')}</dd>` : ''}
      ${imgs.length ? `<dt>Ảnh (${imgs.length})</dt><dd class="thumbs">${imgs.map((p, i) => `<img src="/${esc(p)}" data-i="${i}" alt="">`).join('')}</dd>` : ''}
      ${related.length ? `<dt>Liên quan</dt><dd>${related.map(r => `<div><a href="${docHref(r.rel)}">${esc(r.fm.title)}</a></div>`).join('')}</dd>` : ''}
      ${backlinks.length ? `<dt>Được nhắc tới ở</dt><dd>${backlinks.map(r => `<div><a href="${docHref(r.rel)}">${esc(r.fm.title)}</a></div>`).join('')}</dd>` : ''}
      <dt>File</dt><dd><code>knowledge/${esc(rel)}</code></dd>
    </dl></aside></div>`;
  $('#body').append(renderMarkdown(d.body, rel, { interactive: true }));
  $$('.thumbs img').forEach(img => img.addEventListener('click', () => openLightbox(imgs.map(p => ({ src: '/' + p, alt: p })), Number(img.dataset.i))));
  $('#verify')?.addEventListener('click', async () => {
    try { await api('PUT', '/api/doc', { rel, fm: { ...fm, status: 'verified' }, body: d.body, baseHash: d.hash }); toast('Đã duyệt'); await refresh(); }
    catch (e) { toast(e.message, true); }
  });
  $('#del').addEventListener('click', async () => {
    if (!confirm(`Xoá "${fm.title}"? (vẫn khôi phục được từ git)`)) return;
    try { const r = await api('DELETE', `/api/doc?rel=${encodeURIComponent(rel)}`); toast(r.brokenRelated.length ? `Đã xoá. Chú ý: ${r.brokenRelated.length} tài liệu đang trỏ tới bài này` : 'Đã xoá'); await load(); location.hash = '#/browse'; }
    catch (e) { toast(e.message, true); }
  });
  renderSidebar(rel);
};

pages.browse = (params) => {
  const f = Object.fromEntries(params);
  let list = S.docs.filter(d =>
    (!f.topic || d.rel.startsWith(f.topic + '/')) && (!f.type || d.fm.type === f.type) && (!f.status || d.fm.status === f.status)
    && (!f.app || d.fm.app === f.app) && (!f.tag || (d.fm.tags || []).includes(f.tag)) && (!f.geo || (d.fm.geo || []).includes(f.geo)));
  if (f.sort === 'title') list = [...list].sort((a, b) => a.fm.title.localeCompare(b.fm.title));
  if (f.sort === 'created') list = [...list].sort((a, b) => String(b.fm.created).localeCompare(String(a.fm.created)));
  const geos = [...new Set(S.docs.flatMap(d => d.fm.geo || []))].sort();
  const tags = Object.entries(S.meta.tags).sort((a, b) => b[1] - a[1]).map(([t, n]) => [t, `#${t} (${n})`]);
  main.innerHTML = `
    <div class="page-head"><h1>Tài liệu ${f.topic ? `<span class="muted">/ ${esc(f.topic)}</span>` : ''}</h1><div class="actions"><a class="btn primary" href="#/new${f.topic ? `?topic=${encodeURIComponent(f.topic)}` : ''}">+ Tạo tài liệu${f.topic ? ' ở đây' : ''}</a></div></div>
    ${f.topic && S.meta.topics[f.topic] ? `<p class="muted">${esc(S.meta.topics[f.topic])}</p>` : ''}
    <div class="filters">
      ${filterSelect(f, 'topic', S.meta.allTopics, 'Mọi chủ đề')}
      ${filterSelect(f, 'type', S.meta.types.map(t => [t, TYPE_LABEL[t] || t]), 'Mọi loại')}
      ${filterSelect(f, 'status', S.meta.statuses.map(s => [s, STATUS_LABEL[s]]), 'Mọi trạng thái')}
      ${filterSelect(f, 'app', ['general', ...S.meta.apps], 'Mọi app')}
      ${filterSelect(f, 'geo', geos, 'Mọi GEO')}
      ${filterSelect(f, 'tag', tags, 'Mọi tag')}
      ${filterSelect(f, 'sort', [['', 'Mới cập nhật'], ['created', 'Mới tạo'], ['title', 'Theo tên']].slice(1), 'Mới cập nhật')}
    </div>
    <div class="muted" style="margin-bottom:8px">${list.length} tài liệu</div>
    ${list.length ? `<div class="card"><ul class="doc-list">${list.map(d => docItem(d)).join('')}</ul></div>` : '<div class="empty">Không có tài liệu nào khớp bộ lọc</div>'}`;
  $$('.filters select').forEach(sel => sel.addEventListener('change', () => {
    const p = new URLSearchParams(params); if (sel.value) p.set(sel.dataset.k, sel.value); else p.delete(sel.dataset.k);
    location.hash = `#/browse${p.toString() ? '?' + p : ''}`;
  }));
  renderSidebar(f.topic ? f.topic + '/' : '');
};

function search(q, limit = 50) {
  if (!q.trim()) return [];
  let hits = S.ms.search(q);
  if (!hits.length) hits = S.ms.search(q, { combineWith: 'OR' });
  return hits.slice(0, limit).map(h => S.byRel.get(h.id)).filter(Boolean);
}

pages.search = (params) => {
  const q = params.get('q') || '';
  const res = search(q);
  main.innerHTML = `<div class="page-head"><h1>Tìm: “${esc(q)}”</h1></div><div class="muted" style="margin-bottom:8px">${res.length} kết quả</div>
    ${res.length ? `<div class="card"><ul class="doc-list">${res.map(d => docItem(d, { q })).join('')}</ul></div>` : '<div class="empty">Không có kết quả. Thử từ khoá khác hoặc bỏ bớt từ.</div>'}`;
  renderSidebar();
};

function renderShots(container, shots) {
  container.innerHTML = shots.map((s, i) => `<figure class="shot" data-i="${i}" style="margin:0">
    <img src="/${esc(s.path)}" alt="${esc(s.path)}" loading="lazy">
    <figcaption class="cap">${s.docs.length ? s.docs.map(d => esc(d.title)).join(', ') : '<span class="muted">Chưa gắn tài liệu</span>'}<div class="muted">${esc(s.date || '')}</div></figcaption></figure>`).join('');
  $$('.shot', container).forEach(el => el.addEventListener('click', () => openLightbox(shots.map(s => ({ src: '/' + s.path, alt: s.path, shot: s })), Number(el.dataset.i))));
}

pages.gallery = (params) => {
  const f = Object.fromEntries(params);
  const months = [...new Set(S.images.map(i => (i.date || '').slice(0, 7)).filter(Boolean))].sort().reverse();
  let shots = S.images.filter(s => (!f.month || (s.date || '').startsWith(f.month))
    && (!f.app || s.docs.some(d => d.app === f.app)) && (!f.topic || s.docs.some(d => String(d.topic || '').startsWith(f.topic)))
    && (f.orphan !== '1' || !s.docs.length));
  main.innerHTML = `<div class="page-head"><h1>Ảnh chụp màn hình</h1></div>
    <div class="filters">${filterSelect(f, 'month', months, 'Mọi tháng')}${filterSelect(f, 'app', S.meta.apps, 'Mọi app')}${filterSelect(f, 'topic', Object.keys(S.meta.topics), 'Mọi chủ đề')}${filterSelect(f, 'orphan', [['1', 'Chưa gắn tài liệu']], 'Gắn/không gắn')}</div>
    <div class="muted" style="margin-bottom:8px">${shots.length} ảnh</div>
    ${shots.length ? '<div class="grid gallery" id="shots"></div>' : '<div class="empty">Chưa có ảnh. Dán ảnh vào chat với Claude hoặc kéo thả ảnh vào trình sửa tài liệu.</div>'}`;
  if (shots.length) renderShots($('#shots'), shots);
  $$('.filters select').forEach(sel => sel.addEventListener('change', () => {
    const p = new URLSearchParams(params); if (sel.value) p.set(sel.dataset.k, sel.value); else p.delete(sel.dataset.k);
    location.hash = `#/gallery${p.toString() ? '?' + p : ''}`;
  }));
  renderSidebar();
};

pages.timeline = () => {
  const items = S.docs.filter(d => ['lesson', 'decision'].includes(d.fm.type)).sort((a, b) => String(b.fm.created).localeCompare(String(a.fm.created)));
  let html = '', month = '';
  for (const d of items) {
    const m = String(d.fm.created).slice(0, 7);
    if (m !== month) { html += `<div class="tl-month">Tháng ${esc(m.slice(5))}/${esc(m.slice(0, 4))}</div>`; month = m; }
    const imgs = d.fm.images || [];
    html += `<div class="tl-item ${esc(d.fm.type)}"><div class="card"><div class="muted" style="font-size:12px">${esc(d.fm.created)} · ${esc(TYPE_LABEL[d.fm.type])}</div>
      <a class="t" href="${docHref(d.rel)}"><strong>${esc(d.fm.title)}</strong></a><div class="muted">${esc(d.fm.summary)}</div><div style="margin-top:6px">${badges(d.fm)}</div>
      ${imgs.length ? `<div class="thumbs" style="display:flex;gap:6px;margin-top:8px">${imgs.slice(0, 4).map(p => `<img src="/${esc(p)}" style="width:72px;height:54px;object-fit:cover;border-radius:6px;border:1px solid var(--border)" alt="">`).join('')}</div>` : ''}
    </div></div>`;
  }
  main.innerHTML = `<div class="page-head"><h1>Timeline bài học & quyết định</h1><div class="actions"><a class="btn primary" href="#/new?topic=lessons&type=lesson">+ Ghi bài học</a></div></div>
    ${items.length ? `<div class="timeline">${html}</div>` : '<div class="empty">Chưa có bài học nào. Claude sẽ tự nạp khi bạn làm việc (đọc data, setup campaign…).</div>'}`;
  renderSidebar();
};

pages.roadmap = async () => {
  const rel = '00-overview/roadmap.md';
  const d = S.byRel.get(rel);
  if (!d) { main.innerHTML = '<div class="empty">Chưa có knowledge/00-overview/roadmap.md</div>'; return; }
  const total = (d.body.match(/^\s*[-*] \[( |x|X)\]/gm) || []).length;
  const done = (d.body.match(/^\s*[-*] \[(x|X)\]/gm) || []).length;
  main.innerHTML = `<div class="page-head"><div><h1>${esc(d.fm.title)}</h1><div class="muted">Tick để đánh dấu hoàn thành — lưu thẳng vào file và tự commit.</div></div><a class="btn" href="#/edit/${encodeURI(rel)}">✎ Sửa</a></div>
    <div class="card" style="margin-bottom:18px"><strong>${done}/${total}</strong> mục hoàn thành
      <div style="height:8px;background:var(--surface-2);border-radius:99px;margin-top:8px;overflow:hidden"><div style="height:100%;width:${total ? (done / total * 100).toFixed(1) : 0}%;background:var(--ok)"></div></div></div>
    <div id="body"></div>`;
  $('#body').append(renderMarkdown(d.body.replace(/^\s*#\s.*\n/, ''), rel, { interactive: true }));
  renderSidebar(rel);
};

// ---------- editor ----------
pages.edit = async (rel, params) => {
  const isNew = !rel;
  let d = { fm: { type: params.get('type') || 'concept', status: 'draft', confidence: 'medium', app: 'general', tags: [], geo: [], sources: [], images: [], related: [] }, body: '', hash: null };
  if (!isNew) {
    try { d = await api('GET', `/api/doc?rel=${encodeURIComponent(rel)}`); } catch { main.innerHTML = '<div class="empty">Không tìm thấy tài liệu</div>'; return; }
  }
  const fm = d.fm;
  let images = [...(fm.images || [])];
  const topic = isNew ? (params.get('topic') || '') : dirOf(rel);
  const list = v => (v || []).join(', ');
  const lines = v => (v || []).join('\n');
  const opts = (values, cur, labels = {}) => values.map(v => `<option value="${esc(v)}" ${v === cur ? 'selected' : ''}>${esc(labels[v] || v)}</option>`).join('');
  main.innerHTML = `
    <div class="page-head"><h1>${isNew ? 'Tạo tài liệu' : `Sửa: ${esc(fm.title)}`}</h1>
      <div class="actions">${isNew ? '' : '<button class="btn small" id="raw-toggle">Sửa nguyên văn (raw)</button>'}</div></div>
    <div id="errors"></div>
    <form class="editor" id="ed" autocomplete="off">
      <div class="form-grid">
        <div class="field wide"><label>Tiêu đề *</label><input name="title" required value="${esc(fm.title)}" placeholder="vd: Launch tCPA First_Open cho app X ở US"></div>
        <div class="field"><label>Chủ đề (thư mục) *</label>
          ${isNew ? `<input name="topic" list="topics" required value="${esc(topic)}" placeholder="vd: 02-ua-channels/google-ads"><datalist id="topics">${S.meta.allTopics.map(t => `<option value="${esc(t)}">${esc(S.meta.topics[t] || '')}</option>`).join('')}</datalist><div class="hint">Chọn có sẵn hoặc gõ thư mục con mới (không dấu, gạch ngang)</div>`
            : `<input value="${esc(topic)}" disabled><div class="hint">Đổi chủ đề = di chuyển file; làm qua Claude.</div>`}</div>
        <div class="field"><label>Loại</label><select name="type">${opts(S.meta.types, fm.type, TYPE_LABEL)}</select></div>
        <div class="field"><label>Trạng thái</label><select name="status">${opts(S.meta.statuses, fm.status, STATUS_LABEL)}</select></div>
        <div class="field"><label>Độ tin cậy</label><select name="confidence">${opts(S.meta.confidences, fm.confidence || 'medium')}</select></div>
        <div class="field"><label>App</label><input name="app" list="apps" value="${esc(fm.app || 'general')}"><datalist id="apps">${['general', ...S.meta.apps].map(a => `<option value="${esc(a)}">`).join('')}</datalist></div>
        <div class="field"><label>Tags (phẩy)</label><input name="tags" value="${esc(list(fm.tags))}" placeholder="google-ads, roas"></div>
        <div class="field"><label>GEO (phẩy)</label><input name="geo" value="${esc(list(fm.geo))}" placeholder="US, VN"></div>
        <div class="field wide"><label>Tóm tắt 1 câu * <span class="muted" id="sum-n"></span></label><input name="summary" required maxlength="220" value="${esc(fm.summary)}" placeholder="Dòng này hiện trong INDEX mà Claude đọc mỗi session"></div>
        <div class="field"><label>Nguồn (mỗi dòng 1 nguồn)</label><textarea name="sources" rows="3" placeholder="session 2026-10-14: ...\nhttps://support.google.com/...">${esc(lines(fm.sources))}</textarea></div>
        <div class="field"><label>Liên quan (mỗi dòng 1 file trong knowledge/)</label><textarea name="related" rows="3">${esc(lines(fm.related))}</textarea><div class="hint">vd: playbooks/launch-google-app-campaign-tcpa-den-roas.md</div></div>
      </div>
      <div>
        <div class="toolbar" style="margin-bottom:8px">
          <strong>Nội dung (Markdown)</strong><span class="sep"></span>
          <button type="button" class="btn small" data-ins="## ">H2</button>
          <button type="button" class="btn small" data-wrap="**">B</button>
          <button type="button" class="btn small" data-ins="- [ ] ">☐ Checklist</button>
          <button type="button" class="btn small" data-ins="| Chỉ số | Giá trị | Ghi chú |\n|---|---|---|\n|  |  |  |\n">Bảng</button>
          <label class="btn small" style="cursor:pointer">🖼 Chèn ảnh<input type="file" accept="image/*" multiple hidden id="file"></label>
          <span class="muted" style="font-size:12px">hoặc dán (⌘V) / kéo thả ảnh vào ô soạn</span>
        </div>
        <div class="md-split"><textarea name="body" id="body-ta" spellcheck="false">${esc(d.body)}</textarea><div class="preview" id="preview"></div></div>
      </div>
      <div><label class="muted" style="font-size:12px;font-weight:600">ẢNH ĐÍNH KÈM</label><div class="img-chips" id="chips"></div></div>
      <div class="sticky-save"><span class="muted" id="save-state"></span><a class="btn" href="${isNew ? '#/' : docHref(rel)}">Huỷ</a><button class="btn primary" type="submit">${isNew ? 'Tạo' : 'Lưu'}  ⌘S</button></div>
    </form>`;
  const form = $('#ed'), ta = $('#body-ta'), preview = $('#preview');
  const curTopic = () => isNew ? form.topic.value.trim() : topic;
  let t;
  const updatePreview = () => { clearTimeout(t); t = setTimeout(() => { preview.replaceChildren(renderMarkdown(ta.value, `${curTopic()}/x.md`)); }, 150); };
  const renderChips = () => {
    $('#chips').innerHTML = images.length ? images.map((p, i) => `<span class="img-chip"><img src="/${esc(p)}" alt=""><span>${esc(p.split('/').pop())}</span><button type="button" data-rm="${i}" title="Bỏ khỏi danh sách">✕</button></span>`).join('') : '<span class="muted">Chưa có</span>';
    $$('[data-rm]', $('#chips')).forEach(b => b.addEventListener('click', () => { images.splice(Number(b.dataset.rm), 1); renderChips(); S.dirty = true; }));
  };
  const sumN = () => { $('#sum-n').textContent = `(${form.summary.value.length}/220)`; };
  updatePreview(); renderChips(); sumN();
  form.summary.addEventListener('input', sumN);
  form.addEventListener('input', () => { S.dirty = true; $('#save-state').textContent = 'Chưa lưu'; });
  ta.addEventListener('input', updatePreview);
  if (isNew) form.topic.addEventListener('change', updatePreview);

  const insertAtCursor = (text) => {
    const s = ta.selectionStart, e = ta.selectionEnd;
    ta.setRangeText(text, s, e, 'end'); ta.focus(); updatePreview(); S.dirty = true;
  };
  $$('[data-ins]').forEach(b => b.addEventListener('click', () => insertAtCursor(b.dataset.ins.replace(/\\n/g, '\n'))));
  $$('[data-wrap]').forEach(b => b.addEventListener('click', () => { const w = b.dataset.wrap, s = ta.selectionStart, e = ta.selectionEnd; ta.setRangeText(w + ta.value.slice(s, e) + w, s, e, 'end'); ta.focus(); updatePreview(); }));

  async function upload(files) {
    const tp = curTopic();
    if (!tp) { toast('Chọn chủ đề trước khi chèn ảnh', true); return; }
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const slug = slugify(form.title.value || file.name.replace(/\.\w+$/, '') || 'screenshot');
      toast(`Đang tải ${file.name || 'ảnh'}…`);
      try {
        const r = await api('POST', `/api/upload?slug=${encodeURIComponent(slug)}`, file, { 'Content-Type': file.type, 'X-Filename': encodeURIComponent(file.name || 'paste.png') });
        if (!images.includes(r.path)) images.push(r.path);
        const alt = prompt('Mô tả ngắn cho ảnh (ảnh cho thấy gì?)', '') || 'ảnh';
        insertAtCursor(`\n![${alt}](${relativePath('knowledge/' + tp, r.path)})\n`);
        renderChips();
        toast(r.duplicate ? 'Ảnh đã có sẵn — dùng lại file cũ' : 'Đã tải ảnh');
      } catch (e) { toast(e.message, true); }
    }
  }
  $('#file').addEventListener('change', e => upload([...e.target.files]));
  ta.addEventListener('paste', e => { const files = [...(e.clipboardData?.files || [])]; if (files.length) { e.preventDefault(); upload(files); } });
  ta.addEventListener('dragover', e => { e.preventDefault(); ta.classList.add('drag'); });
  ta.addEventListener('dragleave', () => ta.classList.remove('drag'));
  ta.addEventListener('drop', e => { e.preventDefault(); ta.classList.remove('drag'); upload([...e.dataTransfer.files]); });

  const split = v => v.split(',').map(s => s.trim()).filter(Boolean);
  const splitLines = v => v.split('\n').map(s => s.trim()).filter(Boolean);
  const showErrors = (e) => { $('#errors').innerHTML = `<div class="err-box">${esc(e.message)}${e.data?.errors ? '\n• ' + e.data.errors.map(esc).join('\n• ') : ''}</div>`; window.scrollTo({ top: 0, behavior: 'smooth' }); };

  async function save(force = false) {
    const nfm = { ...fm, title: form.title.value.trim(), type: form.type.value, status: form.status.value, confidence: form.confidence.value,
      app: form.app.value.trim() || 'general', tags: split(form.tags.value), geo: split(form.geo.value), summary: form.summary.value.trim(),
      sources: splitLines(form.sources.value), related: splitLines(form.related.value), images };
    if (!nfm.geo.length) delete nfm.geo;
    if (!nfm.related.length) delete nfm.related;
    $('#errors').innerHTML = '';
    try {
      if (isNew) {
        const r = await api('POST', '/api/doc', { topic: curTopic(), title: nfm.title, type: nfm.type, summary: nfm.summary, app: nfm.app, tags: nfm.tags, body: ta.value, fm: nfm });
        S.dirty = false; toast('Đã tạo — sẽ tự commit + push'); await load(); location.hash = docHref(r.rel);
      } else {
        const r = await api('PUT', '/api/doc', { rel, fm: nfm, body: ta.value, baseHash: d.hash, force });
        d.hash = r.hash; S.dirty = false; $('#save-state').textContent = 'Đã lưu';
        toast(r.warnings?.length ? `Đã lưu (cảnh báo: ${r.warnings[0]})` : 'Đã lưu — sẽ tự commit + push'); await load(); location.hash = docHref(rel);
      }
    } catch (e) {
      if (e.status === 409 && confirm(`${e.message}\n\nLưu đè bản của bạn?`)) return save(true);
      showErrors(e);
    }
  }
  form.addEventListener('submit', e => { e.preventDefault(); save(); });

  $('#raw-toggle')?.addEventListener('click', () => {
    main.innerHTML = `<div class="page-head"><h1>Sửa nguyên văn: ${esc(fm.title)}</h1></div><div id="errors"></div>
      <div class="md-split"><textarea id="raw" spellcheck="false">${esc(d.raw)}</textarea><div class="preview" id="preview"></div></div>
      <div class="sticky-save"><a class="btn" href="${docHref(rel)}">Huỷ</a><button class="btn primary" id="raw-save">Lưu</button></div>`;
    const raw = $('#raw');
    const upd = () => { const m = /^---\n[\s\S]*?\n---\n?([\s\S]*)$/.exec(raw.value); $('#preview').replaceChildren(renderMarkdown(m ? m[1] : raw.value, rel)); };
    upd(); raw.addEventListener('input', () => { S.dirty = true; upd(); });
    $('#raw-save').addEventListener('click', async () => {
      try { await api('PUT', '/api/raw', { rel, raw: raw.value, baseHash: d.hash }); S.dirty = false; toast('Đã lưu'); await load(); location.hash = docHref(rel); }
      catch (e) { $('#errors').innerHTML = `<div class="err-box">${esc(e.message)}${e.data?.errors ? '\n• ' + e.data.errors.map(esc).join('\n• ') : ''}</div>`; }
    });
  });
  renderSidebar(rel || '');
};

// ---------- lightbox ----------
let lb = { items: [], i: 0 };
function openLightbox(items, i) { lb = { items, i }; drawLightbox(); $('#lightbox').hidden = false; }
function closeLightbox() { $('#lightbox').hidden = true; }
function drawLightbox() {
  const it = lb.items[lb.i];
  const s = it.shot;
  $('#lightbox').innerHTML = `<button class="lb-close" aria-label="Đóng">✕</button>
    ${lb.items.length > 1 ? '<button class="lb-nav lb-prev" aria-label="Trước">‹</button><button class="lb-nav lb-next" aria-label="Sau">›</button>' : ''}
    <img src="${esc(it.src)}" alt="${esc(it.alt)}">
    <div class="lb-bar"><span>${lb.i + 1}/${lb.items.length}</span>${s ? `<span>${esc(s.date || '')}</span>${s.docs.map(d => `<a href="${docHref(d.rel)}">${esc(d.title)}</a>`).join('')}${s.source ? `<span class="muted">nguồn: ${esc(s.source)}</span>` : ''}` : `<span>${esc(it.alt)}</span>`}<a href="${esc(it.src)}" target="_blank">Mở ảnh gốc ↗</a></div>`;
  $('.lb-close').onclick = closeLightbox;
  $('#lightbox img').onclick = closeLightbox;
  const prev = $('.lb-prev'), next = $('.lb-next');
  if (prev) prev.onclick = () => { lb.i = (lb.i - 1 + lb.items.length) % lb.items.length; drawLightbox(); };
  if (next) next.onclick = () => { lb.i = (lb.i + 1) % lb.items.length; drawLightbox(); };
  $$('.lb-bar a[href^="#"]').forEach(a => a.addEventListener('click', closeLightbox));
}
document.addEventListener('keydown', e => {
  if (!$('#lightbox').hidden) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') $('.lb-prev')?.click();
    if (e.key === 'ArrowRight') $('.lb-next')?.click();
    return;
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 's' && $('#ed')) { e.preventDefault(); $('#ed').requestSubmit(); }
  if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); }
});

// ---------- tìm nhanh ----------
const q = $('#q'), qr = $('#q-results');
let qSel = -1;
q.addEventListener('input', () => {
  const res = search(q.value, 8); qSel = -1;
  if (!q.value.trim()) { qr.hidden = true; return; }
  qr.innerHTML = res.length ? res.map(d => `<a href="${docHref(d.rel)}"><div class="t">${highlight(d.fm.title, q.value)}</div><div class="s">${highlight(d.fm.summary, q.value)}</div></a>`).join('') + `<a href="#/search?q=${encodeURIComponent(q.value)}" class="s">Xem tất cả kết quả →</a>`
    : '<div class="muted" style="padding:10px">Không có kết quả</div>';
  qr.hidden = false;
});
q.addEventListener('keydown', e => {
  const links = $$('a', qr);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); qSel = (qSel + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length; links.forEach((l, i) => l.classList.toggle('active', i === qSel)); }
  if (e.key === 'Enter') { e.preventDefault(); location.hash = qSel >= 0 ? links[qSel].getAttribute('href') : `#/search?q=${encodeURIComponent(q.value)}`; qr.hidden = true; q.blur(); }
  if (e.key === 'Escape') { qr.hidden = true; q.blur(); }
});
q.addEventListener('blur', () => setTimeout(() => { qr.hidden = true; }, 150));
qr.addEventListener('click', () => { qr.hidden = true; });

// ---------- theme, menu ----------
$('#theme-btn').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('kb-theme', document.documentElement.dataset.theme); } catch {}
});
$('#menu-btn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

// ---------- router ----------
let lastHash = location.hash;
async function route() {
  if (S.dirty && !confirm('Có thay đổi chưa lưu. Rời trang?')) { history.replaceState(null, '', lastHash); return; }
  S.dirty = false; lastHash = location.hash;
  $('#sidebar').classList.remove('open');
  const h = location.hash.slice(1) || '/';
  const [p, qs] = h.split('?');
  const params = new URLSearchParams(qs || '');
  const seg = p.split('/').filter(Boolean);
  $$('.topnav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#/${seg[0] || ''}`));
  const rest = decodeURI(seg.slice(1).join('/'));
  window.scrollTo(0, 0);
  switch (seg[0]) {
    case undefined: pages.home(); renderSidebar(); break;
    case 'doc': await pages.doc(rest); break;
    case 'edit': await pages.edit(rest, params); break;
    case 'new': await pages.edit('', params); break;
    case 'browse': pages.browse(params); break;
    case 'search': pages.search(params); break;
    case 'gallery': pages.gallery(params); break;
    case 'timeline': pages.timeline(); break;
    case 'roadmap': await pages.roadmap(); break;
    default: main.innerHTML = '<div class="empty">Không có trang này</div>';
  }
  document.title = `${$('h1', main)?.textContent?.trim() || 'UA Knowledge'} · UA Knowledge`;
}

// Làm mới dữ liệu; rerender nếu không đang sửa.
async function refresh(rerender = true) {
  await load();
  if (rerender && !$('#ed') && !$('#raw')) await route();
  else renderGitPill();
}

// Theo dõi thay đổi từ Claude/CLI: poll mỗi 10s.
setInterval(async () => {
  try {
    const docs = await api('GET', '/api/docs');
    const sig = docs.map(d => d.rel + d.mtime).join('|');
    S.meta.git = (await api('GET', '/api/meta')).git; renderGitPill();
    if (sig !== S.sig && !$('#ed') && !$('#raw')) { await refresh(); toast('Knowledge vừa được cập nhật'); }
  } catch { /* server tắt */ }
}, 10000);

window.addEventListener('hashchange', route);
window.addEventListener('beforeunload', e => { if (S.dirty) { e.preventDefault(); e.returnValue = ''; } });
await load();
await route();
