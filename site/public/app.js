// SPA xem/sửa knowledge. Router theo hash: #/, #/doc/<rel>, #/edit/<rel>, #/new, #/browse, #/search, #/gallery, #/timeline, #/roadmap
import { marked } from '/vendor/marked.js';
import DOMPurify from '/vendor/purify.js';
import MiniSearch from '/vendor/minisearch.js';

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const main = $('#main');
const mainWrap = $('#main-wrap');
const ic = (name, cls = '') => `<span class="ms ${cls}" aria-hidden="true">${name}</span>`;
// Header trang kiểu Station: tile icon + tiêu đề + 1 dòng phụ + nút bên phải.
const head = (title, { icon, sub = '', actions = '', extra = '' } = {}) => `<div class="page-head">
  ${icon ? `<div class="head-icon">${ic(icon)}</div>` : ''}
  <div class="head-main"><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}${extra}</div>
  ${actions ? `<div class="actions">${actions}</div>` : ''}</div>`;
const empty = (icon, text) => `<div class="empty">${ic(icon)}<div>${text}</div></div>`;
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
  const [meta, docs, images, sugg] = await Promise.all([api('GET', '/api/meta'), api('GET', '/api/docs?full=1'), api('GET', '/api/images'), api('GET', '/api/suggestions').catch(() => null)]);
  S.meta = meta; S.images = images; S.sugg = sugg;
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
      try { await api('POST', '/api/check', { rel, index: i, checked: cb.checked }); toast(cb.checked ? 'Đã đánh dấu hoàn thành' : 'Đã bỏ đánh dấu'); const y = mainWrap.scrollTop; await refresh(); mainWrap.scrollTop = y; }
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
  if (fm.app && fm.app !== 'general') out.push(link ? `<a class="badge" href="#/browse?app=${encodeURIComponent(fm.app)}">${ic('smartphone')}${esc(fm.app)}</a>` : `<span class="badge">${ic('smartphone')}${esc(fm.app)}</span>`);
  for (const g of fm.geo || []) out.push(`<span class="badge">${ic('public')}${esc(g)}</span>`);
  return out.join('');
}

function docItem(d, { q } = {}) {
  const fm = d.fm;
  const imgs = (fm.images || []).length;
  const snippet = q ? makeSnippet(d.body, q) : '';
  return `<li><a class="t" href="${docHref(d.rel)}">${q ? highlight(fm.title, q) : esc(fm.title)}</a>
    <div class="s">${q ? highlight(fm.summary, q) : esc(fm.summary)}</div>
    ${snippet ? `<div class="s">…${snippet}…</div>` : ''}
    <div class="m">${badges(fm, { link: false })}<span class="muted">cập nhật ${esc(fm.updated)}${imgs ? ` · ${imgs} ảnh` : ''}</span><span class="muted path">${esc(d.rel)}</span></div></li>`;
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
  const set = (cls, icon, text, title) => { el.className = `pill ${cls}`; el.innerHTML = `${ic(icon, 'xs')}${esc(text)}`; el.title = title; };
  if (g.lastCommit?.ok === false) return set('warn', 'error', 'commit lỗi', g.lastCommit.output);
  if (pending) return set('warn', 'sync', `${pending} thay đổi chờ commit`, 'Tự commit + push sau vài giây');
  if (g.ahead) return set('warn', 'cloud_upload', `${g.ahead} chưa push`, g.last);
  set('ok', 'cloud_done', 'đã đồng bộ', g.last);
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
      html += `<details${open}><summary title="${esc(S.meta.topics[p] || p)}">${ic('chevron_right', 'sm chev')}<span class="sum-label">${esc(k)}</span><span class="count">${count(node[k])}</span></summary><div class="children">${renderNode(node[k], p)}</div></details>`;
    }
    for (const d of (node.__docs || []).sort((a, b) => a.fm.title.localeCompare(b.fm.title))) {
      html += `<a href="${docHref(d.rel)}" class="leaf${d.rel === active ? ' active' : ''}" title="${esc(d.fm.summary)}"><span>${esc(d.fm.title)}</span>${d.fm.status === 'draft' ? '<i class="dot" title="Draft"></i>' : ''}</a>`;
    }
    return html;
  };
  const drafts = S.docs.filter(d => d.fm.status === 'draft').length;
  // Mục nav đang chọn = khớp đúng hash hiện tại (doc đang mở thì sáng ở cây chủ đề).
  const cur = location.hash || '#/';
  const item = (href, icon, label, n) => `<a href="${href}" class="nav-item${cur === href ? ' active' : ''}">${ic(icon)}<span class="lbl">${label}</span>${n != null ? `<span class="count">${n}</span>` : ''}</a>`;
  const apps = S.meta.apps.map(a => item(`#/browse?app=${encodeURIComponent(a)}`, 'smartphone', esc(a))).join('');
  $('#side-nav').innerHTML = `
    <div class="side-group">
      ${item('#/', 'home', 'Trang chủ')}
      ${item('#/suggestions', 'tips_and_updates', 'Gợi ý', S.sugg ? (S.sugg.followups.due.length + S.sugg.issues.filter(i => i.severity === 'warn').length) || null : null)}
      ${item('#/browse', 'description', 'Tài liệu', S.docs.length)}
      ${item('#/browse?status=draft', 'edit_note', 'Draft cần duyệt', drafts)}
      ${item('#/gallery', 'photo_library', 'Ảnh chụp', S.images.length)}
      ${item('#/timeline', 'timeline', 'Timeline')}
      ${item('#/roadmap', 'flag', 'Roadmap')}
    </div>
    ${apps ? `<div class="side-group"><div class="side-label">Apps</div>${apps}</div>` : ''}
    <div class="side-group tree"><div class="side-label">Chủ đề</div>${renderNode(tree, '')}</div>`;
}

// <select> bộ lọc; values: chuỗi hoặc [giá trị, nhãn].
function filterSelect(f, name, values, label) {
  const pair = v => Array.isArray(v) ? v : [v, v];
  return `<select data-k="${name}" aria-label="${esc(label)}"${f[name] ? ' class="on"' : ''}><option value="">${esc(label)}</option>${values.map(v => { const [val, lab] = pair(v); return `<option value="${esc(val)}" ${(f[name] ?? '') === val ? 'selected' : ''}>${esc(lab)}</option>`; }).join('')}</select>`;
}

// ---------- trang ----------
const pages = {};

pages.home = () => {
  const drafts = S.docs.filter(d => d.fm.status === 'draft');
  const lessons = S.docs.filter(d => d.fm.type === 'lesson');
  const cs = S.byRel.get('00-overview/current-state.md');
  main.innerHTML = `
    ${head('UA Marketing Knowledge', { icon: 'menu_book', sub: 'Kho kiến thức UA cho app Android kiếm tiền bằng quảng cáo — Claude tự nạp sau mỗi session.' })}
    <div class="grid stats">
      ${[['#/browse', 'description', S.docs.length, 'tài liệu'], ['#/browse?status=draft', 'edit_note', drafts.length, 'draft cần duyệt'], ['#/timeline', 'lightbulb', lessons.length, 'bài học'], ['#/gallery', 'photo_library', S.images.length, 'ảnh chụp màn hình']]
        .map(([href, icon, n, l]) => `<a class="card stat" href="${href}"><span class="tile">${ic(icon, 'fill')}</span><div><div class="n">${n}</div><div class="l">${l}</div></div></a>`).join('')}
    </div>
    ${S.sugg?.followups.due.length ? `<a class="warn-box" href="#/suggestions">${ic('alarm')}<span><strong>${S.sugg.followups.due.length} mốc theo dõi đến hạn</strong> — ${S.sugg.followups.due.slice(0, 3).map(f => esc(`${f.app}: ${f.text}`)).join(' · ')}</span></a>` : ''}
    ${S.broken.length ? `<div class="err-box">${ic('error')}<span>${S.broken.length} file lỗi frontmatter, không hiển thị được: ${S.broken.map(b => esc(b.rel)).join(', ')}</span></div>` : ''}
    <div class="grid two-col">
      <div class="card" id="cs"><div class="card-head"><h2>Trạng thái hiện tại</h2>${cs ? `<a class="btn ghost sm" href="#/edit/${encodeURI(cs.rel)}">${ic('edit')}Sửa</a>` : ''}</div></div>
      <div class="card"><div class="card-head"><h2>Mới cập nhật</h2></div><ul class="doc-list">${S.docs.slice(0, 8).map(d => docItem(d)).join('') || '<li class="muted">Chưa có tài liệu</li>'}</ul></div>
    </div>
    ${drafts.length ? `<div class="section-title">Draft cần duyệt</div><div class="card"><ul class="doc-list">${drafts.slice(0, 10).map(d => docItem(d)).join('')}</ul>${drafts.length > 10 ? `<a href="#/browse?status=draft">Xem tất cả ${drafts.length} →</a>` : ''}</div>` : ''}
    ${S.images.length ? `<div class="section-title">Ảnh mới</div><div class="grid gallery" id="home-shots"></div>` : ''}`;
  if (cs) $('#cs').append(renderMarkdown(cs.body.replace(/^\s*#\s.*\n/, ''), cs.rel));
  if (S.images.length) renderShots($('#home-shots'), S.images.slice(0, 8));
};

pages.doc = async (rel) => {
  let d;
  try { d = await api('GET', `/api/doc?rel=${encodeURIComponent(rel)}`); } catch (e) { main.innerHTML = empty('search_off', `Không tìm thấy <code>${esc(rel)}</code>`); return; }
  const fm = d.fm;
  const related = (fm.related || []).map(r => S.byRel.get(r)).filter(Boolean);
  const backlinks = S.docs.filter(x => x.rel !== rel && !related.includes(x) && ((x.fm.related || []).includes(rel) || x.body.includes(rel.split('/').pop()))).slice(0, 10);
  const imgs = (fm.images || []);
  const crumbs = dirOf(rel).split('/').filter(Boolean).map((seg, i, arr) => `<a href="#/browse?topic=${encodeURIComponent(arr.slice(0, i + 1).join('/'))}">${esc(seg)}</a>`).join(ic('chevron_right', 'xs'));
  main.innerHTML = `
    <div class="crumbs">${crumbs}</div>
    ${head(esc(fm.title), { extra: `<div class="head-badges">${badges(fm)}</div>`, actions: `
        ${fm.status === 'draft' ? `<button class="btn sm" id="verify">${ic('check')}Duyệt</button>` : ''}
        <a class="btn sm" href="#/suggestions?app=${encodeURIComponent(fm.app || 'general')}&text=${encodeURIComponent('Xem lại: ' + fm.title)}" title="Đặt mốc xem lại tài liệu này">${ic('add_alarm')}Đặt mốc</a>
        <a class="btn primary sm" href="#/edit/${encodeURI(rel)}">${ic('edit')}Sửa</a>
        <button class="btn ghost sm" id="del" title="Xoá">${ic('delete')}</button>` })}
    ${d.error ? `<div class="err-box">${esc(d.error)}</div>` : ''}
    ${fm.status === 'outdated' ? `<div class="warn-box">${ic('history')}<span>Tài liệu này đã lỗi thời — xem các tài liệu liên quan để có thông tin mới.</span></div>` : ''}
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
    ${head(`Tài liệu${f.topic ? ` <span class="muted">/ ${esc(f.topic)}</span>` : ''}`, { icon: 'description', sub: f.topic && S.meta.topics[f.topic] ? esc(S.meta.topics[f.topic]) : '',
      actions: `<a class="btn sm" href="#/new${f.topic ? `?topic=${encodeURIComponent(f.topic)}` : ''}">${ic('add')}Tạo tài liệu${f.topic ? ' ở đây' : ''}</a>` })}
    <div class="filters">
      ${filterSelect(f, 'topic', S.meta.allTopics, 'Mọi chủ đề')}
      ${filterSelect(f, 'type', S.meta.types.map(t => [t, TYPE_LABEL[t] || t]), 'Mọi loại')}
      ${filterSelect(f, 'status', S.meta.statuses.map(s => [s, STATUS_LABEL[s]]), 'Mọi trạng thái')}
      ${filterSelect(f, 'app', ['general', ...S.meta.apps], 'Mọi app')}
      ${filterSelect(f, 'geo', geos, 'Mọi GEO')}
      ${filterSelect(f, 'tag', tags, 'Mọi tag')}
      ${filterSelect(f, 'sort', [['', 'Mới cập nhật'], ['created', 'Mới tạo'], ['title', 'Theo tên']].slice(1), 'Mới cập nhật')}
    </div>
    <div class="count-line">${list.length} tài liệu</div>
    ${list.length ? `<div class="card"><ul class="doc-list">${list.map(d => docItem(d)).join('')}</ul></div>` : empty('filter_alt_off', 'Không có tài liệu nào khớp bộ lọc')}`;
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
  main.innerHTML = `${head(`Tìm: “${esc(q)}”`, { icon: 'search' })}<div class="count-line">${res.length} kết quả</div>
    ${res.length ? `<div class="card"><ul class="doc-list">${res.map(d => docItem(d, { q })).join('')}</ul></div>` : empty('search_off', 'Không có kết quả. Thử từ khoá khác hoặc bỏ bớt từ.')}`;
  renderSidebar();
};

function renderShots(container, shots) {
  container.innerHTML = shots.map((s, i) => `<figure class="shot" data-i="${i}">
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
  main.innerHTML = `${head('Ảnh chụp màn hình', { icon: 'photo_library' })}
    <div class="filters">${filterSelect(f, 'month', months, 'Mọi tháng')}${filterSelect(f, 'app', S.meta.apps, 'Mọi app')}${filterSelect(f, 'topic', Object.keys(S.meta.topics), 'Mọi chủ đề')}${filterSelect(f, 'orphan', [['1', 'Chưa gắn tài liệu']], 'Gắn/không gắn')}</div>
    <div class="count-line">${shots.length} ảnh</div>
    ${shots.length ? '<div class="grid gallery" id="shots"></div>' : empty('image', 'Chưa có ảnh. Dán ảnh vào chat với Claude hoặc kéo thả ảnh vào trình sửa tài liệu.')}`;
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
    html += `<div class="tl-item ${esc(d.fm.type)}"><div class="card"><div class="date">${esc(d.fm.created)} · ${esc(TYPE_LABEL[d.fm.type])}</div>
      <a class="t" href="${docHref(d.rel)}">${esc(d.fm.title)}</a><div class="s">${esc(d.fm.summary)}</div><div>${badges(d.fm)}</div>
      ${imgs.length ? `<div class="tl-thumbs">${imgs.slice(0, 4).map(p => `<img src="/${esc(p)}" alt="">`).join('')}</div>` : ''}
    </div></div>`;
  }
  main.innerHTML = `${head('Timeline bài học & quyết định', { icon: 'timeline', actions: `<a class="btn sm" href="#/new?topic=lessons&type=lesson">${ic('add')}Ghi bài học</a>` })}
    ${items.length ? `<div class="timeline">${html}</div>` : empty('lightbulb', 'Chưa có bài học nào. Claude sẽ tự nạp khi bạn làm việc (đọc data, setup campaign…).')}`;
  renderSidebar();
};

// kind → [icon, nhãn, cách sửa]
const ISSUE_LABEL = {
  'stale-draft': ['hourglass_bottom', 'Draft để lâu chưa duyệt', 'Đọc lại, sửa nếu cần rồi bấm Duyệt — hoặc đánh dấu lỗi thời.'],
  conflict: ['report', 'Mâu thuẫn chưa xử lý', 'Kiểm tra số liệu nào đúng, sửa bài và xoá mục "⚠️ Mâu thuẫn".'],
  'outdated-no-replacement': ['history', 'Lỗi thời nhưng chưa có bài thay thế', 'Thêm bài mới vào "Liên quan" để người đọc biết xem ở đâu.'],
  'app-missing-profile': ['smartphone', 'App thiếu hồ sơ', 'Tạo apps/<app>/profile.md: package, ID tài khoản, ai giữ quyền gì.'],
  'current-state-long': ['notes', 'Trạng thái hiện tại quá dài', 'File này nạp vào mọi session Claude — rút còn ≤ 40 dòng.'],
  'low-confidence': ['help', 'Độ tin cậy thấp', 'Cần số liệu thật của app hoặc nguồn chính thức để xác nhận.'],
  'orphan-image': ['image_not_supported', 'Ảnh chưa gắn tài liệu', 'Chèn ảnh vào bài liên quan hoặc xoá nếu không cần.'],
  'one-way-related': ['link', 'Liên kết một chiều', 'Bài A trỏ tới B nhưng B không trỏ lại — bấm "Thêm liên kết ngược".'],
};
const WHEN = [['7d', '+7 ngày'], ['14d', '+14 ngày'], ['1m', '+1 tháng'], ['4m', '+4 tháng'], ['6m', '+6 tháng']];

// Duyệt draft không cần mở trang sửa: đọc bản mới nhất rồi chỉ đổi status.
async function verifyDoc(rel) {
  const d = await api('GET', `/api/doc?rel=${encodeURIComponent(rel)}`);
  await api('PUT', '/api/doc', { rel, fm: { ...d.fm, status: 'verified' }, body: d.body, baseHash: d.hash });
}

pages.suggestions = async (params) => {
  let dx, fus;
  try { [dx, fus] = await Promise.all([api('GET', '/api/suggestions'), api('GET', '/api/followups')]); S.sugg = dx; }
  catch (e) { main.innerHTML = empty('error', esc(e.message)); renderSidebar(); return; }
  // completeFollowup đánh số theo thứ tự mốc đang mở trong file (1-based).
  const open = fus.filter(f => !f.done).map((f, i) => ({ ...f, sel: i + 1 }));
  const in7 = new Date(`${dx.today}T00:00:00`); in7.setDate(in7.getDate() + 7);
  const horizon = in7.toISOString().slice(0, 10);
  const byDate = [...open].sort((a, b) => a.date.localeCompare(b.date));
  const fuGroups = [['Đến hạn', byDate.filter(f => f.due)], ['7 ngày tới', byDate.filter(f => !f.due && f.date <= horizon)], ['Sau đó', byDate.filter(f => f.date > horizon)]].filter(([, l]) => l.length);
  const fuRow = f => `<li class="fu-row${f.overdue ? ' overdue' : f.due ? ' due' : ''}">
    <span class="fu-date">${esc(f.date.slice(8))}/${esc(f.date.slice(5, 7))}</span>
    <div class="fu-main"><div>${esc(f.text)}</div><div class="m">${f.app !== 'general' ? `<a class="badge" href="#/browse?app=${encodeURIComponent(f.app)}">${ic('smartphone')}${esc(f.app)}</a>` : ''}${f.overdue ? '<span class="badge outdated">quá hạn</span>' : f.due ? '<span class="badge draft">hôm nay</span>' : ''}</div></div>
    <button class="btn sm" data-done="${f.sel}" title="Đánh dấu đã xem lại">${ic('check')}Xong</button></li>`;
  const groups = {};
  for (const i of dx.issues) (groups[i.kind] ??= []).push(i);
  const issueLink = i => i.rel.endsWith('.md') && S.byRel.has(i.rel) ? `<a href="${docHref(i.rel)}">${esc(S.byRel.get(i.rel).fm.title)}</a>`
    : i.rel.startsWith('assets/') ? `<a href="/${esc(i.rel)}" data-img="${esc(i.rel)}">${esc(i.rel.split('/').pop())}</a>` : `<code>${esc(i.rel)}</code>`;
  const issueAction = i => {
    if (i.kind === 'one-way-related') { const to = /tới (\S+\.md)/.exec(i.msg)?.[1]; return to && S.byRel.has(to) ? `<button class="btn ghost sm" data-backlink="${esc(to)}" data-from="${esc(i.rel)}">${ic('add_link')}Thêm liên kết ngược</button>` : ''; }
    if (i.kind === 'app-missing-profile') { const app = i.rel.split('/')[1]; return `<a class="btn ghost sm" href="#/new?topic=apps/${encodeURIComponent(app)}&type=app-profile">${ic('add')}Tạo hồ sơ</a>`; }
    if (i.kind === 'stale-draft') return `<button class="btn ghost sm" data-verify="${esc(i.rel)}">${ic('check')}Duyệt</button>`;
    return '';
  };
  const issueHtml = Object.entries(groups).map(([k, list]) => {
    const [icon, label, hint] = ISSUE_LABEL[k] || ['info', k, ''];
    const warn = list[0].severity === 'warn';
    return `<details class="card issue${warn ? ' warn' : ''}" ${warn ? 'open' : ''}><summary><span class="issue-ic">${ic(icon)}</span><span class="issue-t"><strong>${esc(label)}</strong>${hint ? `<span class="s">${esc(hint)}</span>` : ''}</span><span class="count">${list.length}</span>${ic('expand_more', 'chev')}</summary>
      <ul class="doc-list">${list.map(i => `<li class="issue-row"><div><div class="t">${issueLink(i)}</div><div class="s">${esc(i.msg)}</div></div>${issueAction(i)}</li>`).join('')}</ul></details>`;
  }).join('');
  const warnN = dx.issues.filter(i => i.severity === 'warn').length;
  const apps = ['general', ...S.meta.apps];
  const pre = { app: params.get('app') || '', text: params.get('text') || '' };
  main.innerHTML = `
    ${head('Gợi ý', { icon: 'tips_and_updates', sub: 'Mốc cần xem lại, draft chờ duyệt và chỗ knowledge còn yếu — Claude cũng nhắc những mục này đầu mỗi session.' })}
    <div class="grid stats">
      ${[['alarm', dx.followups.due.length, 'mốc đến hạn'], ['event_upcoming', dx.followups.upcoming.length, 'mốc trong 7 ngày'], ['edit_note', dx.drafts.length, 'draft chờ duyệt'], ['healing', warnN, 'vấn đề cần sửa']]
        .map(([icon, n, l]) => `<div class="card stat${icon === 'alarm' && n ? ' hot' : ''}"><span class="tile">${ic(icon, 'fill')}</span><div><div class="n">${n}</div><div class="l">${l}</div></div></div>`).join('')}
    </div>
    <div class="grid two-col">
      <div class="card"><div class="card-head"><h2>Mốc theo dõi</h2><a class="btn ghost sm" href="${docHref(dx.watchlist)}">${ic('list')}Mở watchlist</a></div>
        ${fuGroups.length ? fuGroups.map(([t, l]) => `<div class="fu-group">${t}</div><ul class="fu-list">${l.map(fuRow).join('')}</ul>`).join('') : '<p class="muted">Chưa có mốc nào đang mở. Thêm mốc mỗi khi launch, đổi bid/budget/creative.</p>'}
        <form id="fu-add" class="fu-add" autocomplete="off">
          <div class="fu-add-row"><input name="text" required placeholder="Xem lại gì? vd: ROAS D7 campaign X (target ≥ 40%)" value="${esc(pre.text)}"></div>
          <div class="fu-add-row">
            <div class="seg" role="radiogroup" aria-label="Khi nào">${WHEN.map(([v, l], i) => `<label><input type="radio" name="when" value="${v}" ${i === 0 ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>
            <select name="app" aria-label="App">${apps.map(a => `<option ${a === pre.app ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select>
            <button class="btn primary sm">${ic('add_alarm')}Thêm mốc</button>
          </div>
        </form></div>
      <div class="card"><div class="card-head"><h2>Draft chờ duyệt</h2><a class="btn ghost sm" href="#/browse?status=draft">Tất cả ${dx.drafts.length}</a></div>
        ${dx.drafts.length ? `<ul class="doc-list">${dx.drafts.slice(0, 8).map(d => `<li class="issue-row"><div><a class="t" href="${docHref(d.rel)}">${esc(d.title)}</a><div class="s">${d.age != null ? (d.age ? `${d.age} ngày trước` : 'hôm nay') : ''}</div></div><button class="btn ghost sm" data-verify="${esc(d.rel)}">${ic('check')}Duyệt</button></li>`).join('')}</ul>` : '<p class="muted">Không có draft nào.</p>'}</div>
    </div>
    <div class="section-title">Sức khoẻ knowledge</div>
    ${issueHtml || empty('verified', 'Không có vấn đề nào')}`;

  const busy = async (btn, fn, ok) => { btn.disabled = true; try { await fn(); toast(ok); await refresh(); } catch (e) { btn.disabled = false; toast(e.message, true); } };
  $$('[data-done]').forEach(b => b.addEventListener('click', () => {
    const note = prompt('Kết quả khi xem lại? (vd: ROAS D7 = 48%, giữ bid) — để trống cũng được', '');
    if (note === null) return;
    busy(b, () => api('POST', '/api/followup/done', { selector: b.dataset.done, note }), 'Đã đánh dấu xong — nhớ nạp kết quả thành bài học');
  }));
  $$('[data-verify]').forEach(b => b.addEventListener('click', () => busy(b, () => verifyDoc(b.dataset.verify), 'Đã duyệt')));
  $$('[data-backlink]').forEach(b => b.addEventListener('click', () => busy(b, async () => {
    const rel = b.dataset.backlink, d = await api('GET', `/api/doc?rel=${encodeURIComponent(rel)}`);
    const related = [...new Set([...(d.fm.related || []), b.dataset.from])];
    await api('PUT', '/api/doc', { rel, fm: { ...d.fm, related }, body: d.body, baseHash: d.hash });
  }, 'Đã thêm liên kết ngược')));
  $$('[data-img]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openLightbox([{ src: '/' + a.dataset.img, alt: a.dataset.img }], 0); }));
  $('#fu-add').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    try {
      const r = await api('POST', '/api/followup', { when: f.when.value, app: f.app.value, text: f.text.value });
      toast(r.duplicate ? 'Mốc này đã có' : 'Đã thêm mốc — sẽ tự commit');
      if (params.toString()) location.hash = '#/suggestions'; else await refresh();
    } catch (err) { toast(err.message, true); }
  });
  renderSidebar();
};

pages.roadmap = async () => {
  const rel = '00-overview/roadmap.md';
  const d = S.byRel.get(rel);
  if (!d) { main.innerHTML = empty('flag', 'Chưa có knowledge/00-overview/roadmap.md'); return; }
  const total = (d.body.match(/^\s*[-*] \[( |x|X)\]/gm) || []).length;
  const done = (d.body.match(/^\s*[-*] \[(x|X)\]/gm) || []).length;
  main.innerHTML = `${head(esc(d.fm.title), { icon: 'flag', sub: 'Tick để đánh dấu hoàn thành — lưu thẳng vào file và tự commit.', actions: `<a class="btn sm" href="#/edit/${encodeURI(rel)}">${ic('edit')}Sửa</a>` })}
    <div class="card" style="margin-bottom:18px"><strong>${done}/${total}</strong> <span class="muted">mục hoàn thành</span>
      <div class="progress"><div style="width:${total ? (done / total * 100).toFixed(1) : 0}%"></div></div></div>
    <div id="body"></div>`;
  $('#body').append(renderMarkdown(d.body.replace(/^\s*#\s.*\n/, ''), rel, { interactive: true }));
  renderSidebar(rel);
};

// ---------- editor ----------
pages.edit = async (rel, params) => {
  const isNew = !rel;
  let d = { fm: { type: params.get('type') || 'concept', status: 'draft', confidence: 'medium', app: 'general', tags: [], geo: [], sources: [], images: [], related: [] }, body: '', hash: null };
  if (!isNew) {
    try { d = await api('GET', `/api/doc?rel=${encodeURIComponent(rel)}`); } catch { main.innerHTML = empty('search_off', 'Không tìm thấy tài liệu'); return; }
  }
  const fm = d.fm;
  let images = [...(fm.images || [])];
  const topic = isNew ? (params.get('topic') || '') : dirOf(rel);
  const list = v => (v || []).join(', ');
  const lines = v => (v || []).join('\n');
  const opts = (values, cur, labels = {}) => values.map(v => `<option value="${esc(v)}" ${v === cur ? 'selected' : ''}>${esc(labels[v] || v)}</option>`).join('');
  main.innerHTML = `
    ${head(isNew ? 'Tạo tài liệu' : `Sửa: ${esc(fm.title)}`, { icon: isNew ? 'note_add' : 'edit_document', actions: isNew ? '' : `<button class="btn ghost sm" id="raw-toggle">${ic('code')}Sửa nguyên văn (raw)</button>` })}
    <div id="errors"></div>${isNew ? '<div id="dup"></div>' : ''}
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
        <div class="toolbar">
          <span class="title">Nội dung</span><span class="sep"></span>
          <button type="button" class="btn sm" data-ins="## " title="Tiêu đề">${ic('title')}H2</button>
          <button type="button" class="btn sm" data-wrap="**" title="In đậm">${ic('format_bold')}</button>
          <button type="button" class="btn sm" data-ins="- [ ] ">${ic('checklist')}Checklist</button>
          <button type="button" class="btn sm" data-ins="| Chỉ số | Giá trị | Ghi chú |\n|---|---|---|\n|  |  |  |\n">${ic('table')}Bảng</button>
          <label class="btn sm">${ic('add_photo_alternate')}Chèn ảnh<input type="file" accept="image/*" multiple hidden id="file"></label>
          <span class="muted" style="font-size:12px">hoặc dán (⌘V) / kéo thả ảnh vào ô soạn</span>
        </div>
        <div class="md-split"><textarea name="body" id="body-ta" spellcheck="false">${esc(d.body)}</textarea><div class="preview" id="preview"></div></div>
      </div>
      <div><div class="section-title" style="margin-top:0">Ảnh đính kèm</div><div class="img-chips" id="chips"></div></div>
      <div class="sticky-save glass-raised"><span class="state" id="save-state"></span><a class="btn ghost" href="${isNew ? '#/' : docHref(rel)}">Huỷ</a><button class="btn primary" type="submit">${ic('check')}${isNew ? 'Tạo' : 'Lưu'} <kbd>⌘S</kbd></button></div>
    </form>`;
  const form = $('#ed'), ta = $('#body-ta'), preview = $('#preview');
  const curTopic = () => isNew ? form.topic.value.trim() : topic;
  let t;
  const updatePreview = () => { clearTimeout(t); t = setTimeout(() => { preview.replaceChildren(renderMarkdown(ta.value, `${curTopic()}/x.md`)); }, 150); };
  const renderChips = () => {
    $('#chips').innerHTML = images.length ? images.map((p, i) => `<span class="img-chip"><img src="/${esc(p)}" alt=""><span>${esc(p.split('/').pop())}</span><button type="button" data-rm="${i}" title="Bỏ khỏi danh sách">${ic('close', 'sm')}</button></span>`).join('') : '<span class="muted">Chưa có</span>';
    $$('[data-rm]', $('#chips')).forEach(b => b.addEventListener('click', () => { images.splice(Number(b.dataset.rm), 1); renderChips(); S.dirty = true; }));
  };
  const sumN = () => { $('#sum-n').textContent = `(${form.summary.value.length}/220)`; };
  updatePreview(); renderChips(); sumN();
  form.summary.addEventListener('input', sumN);
  form.addEventListener('input', () => { S.dirty = true; $('#save-state').textContent = 'Chưa lưu'; });
  ta.addEventListener('input', updatePreview);
  if (isNew) {
    form.topic.addEventListener('change', updatePreview);
    // CLAUDE.md: tìm bài cùng chủ đề trước khi tạo mới → gợi ý cập nhật bài cũ thay vì tạo trùng.
    let rt;
    const checkDup = () => { clearTimeout(rt); rt = setTimeout(async () => {
      const hits = await api('GET', `/api/recall?q=${encodeURIComponent(`${form.title.value} ${form.summary.value}`)}`).catch(() => []);
      const box = $('#dup'); if (!box) return; // đã rời trang trong lúc chờ
      box.innerHTML = hits.length ? `<div class="warn-box dup-warn">${ic('content_copy')}<div><strong>Có thể đã có tài liệu cùng chủ đề</strong> — cân nhắc cập nhật bài cũ thay vì tạo mới:
        <ul>${hits.map(h => `<li><a href="${docHref(h.rel)}" target="_blank">${esc(h.title)}</a></li>`).join('')}</ul></div></div>` : '';
    }, 400); };
    form.title.addEventListener('input', checkDup);
    form.summary.addEventListener('input', checkDup);
  }

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
  const showErrors = (e) => { $('#errors').innerHTML = `<div class="err-box">${esc(e.message)}${e.data?.errors ? '\n• ' + e.data.errors.map(esc).join('\n• ') : ''}</div>`; mainWrap.scrollTo({ top: 0, behavior: 'smooth' }); };

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
    main.innerHTML = `${head(`Sửa nguyên văn: ${esc(fm.title)}`, { icon: 'code' })}<div id="errors"></div>
      <div class="md-split"><textarea id="raw" spellcheck="false">${esc(d.raw)}</textarea><div class="preview" id="preview"></div></div>
      <div class="sticky-save glass-raised" style="margin-top:16px"><a class="btn ghost" href="${docHref(rel)}">Huỷ</a><button class="btn primary" id="raw-save">${ic('check')}Lưu</button></div>`;
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
  $('#lightbox').innerHTML = `<button class="lb-close" aria-label="Đóng">${ic('close')}</button>
    ${lb.items.length > 1 ? `<button class="lb-nav lb-prev" aria-label="Trước">${ic('chevron_left')}</button><button class="lb-nav lb-next" aria-label="Sau">${ic('chevron_right')}</button>` : ''}
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
const setMenu = open => { $('#sidebar').classList.toggle('open', open); $('#scrim').hidden = !open; };
$('#menu-btn').addEventListener('click', () => setMenu(!$('#sidebar').classList.contains('open')));
$('#scrim').addEventListener('click', () => setMenu(false));

// ---------- router ----------
let lastHash = location.hash;
async function route() {
  if (S.dirty && !confirm('Có thay đổi chưa lưu. Rời trang?')) { history.replaceState(null, '', lastHash); return; }
  S.dirty = false; lastHash = location.hash;
  setMenu(false);
  const h = location.hash.slice(1) || '/';
  const [p, qs] = h.split('?');
  const params = new URLSearchParams(qs || '');
  const seg = p.split('/').filter(Boolean);
  const rest = decodeURI(seg.slice(1).join('/'));
  mainWrap.scrollTo(0, 0);
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
    case 'suggestions': await pages.suggestions(params); break;
    default: main.innerHTML = empty('explore_off', 'Không có trang này'); renderSidebar();
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
