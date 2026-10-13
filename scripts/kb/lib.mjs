// Thư viện lõi của knowledge base: đọc/ghi tài liệu, validate, sinh INDEX.
// Không phụ thuộc gì ngoài `yaml`. Mọi hàm nhận `root` để test được trên repo tạm.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const root = () => process.env.KB_ROOT ? path.resolve(process.env.KB_ROOT) : REPO_ROOT;

export const KNOWLEDGE_DIR = 'knowledge';
export const ASSETS_DIR = 'assets';
export const SCREENSHOT_DIR = 'assets/screenshots';
export const STATE_DIR = '.claude/state';

export const TYPES = ['overview', 'concept', 'playbook', 'lesson', 'decision', 'app-profile', 'reference'];
export const STATUSES = ['draft', 'verified', 'outdated'];
export const CONFIDENCES = ['low', 'medium', 'high'];
export const REQUIRED = ['title', 'type', 'topic', 'status', 'created', 'updated', 'summary'];
// Thứ tự field khi ghi frontmatter, để diff gọn và đồng nhất.
export const FIELD_ORDER = ['title', 'type', 'topic', 'tags', 'app', 'geo', 'status', 'confidence',
  'sources', 'created', 'updated', 'images', 'related', 'summary'];

// Tên & mô tả các nhánh topic cấp 1 — dùng cho INDEX, web sidebar.
export const TOPICS = {
  '00-overview': 'Tổng quan: roadmap, glossary chỉ số, trạng thái hiện tại',
  '01-pre-marketing': 'Chuẩn bị trước khi chạy: ASO, store listing, creative, Firebase/SDK',
  '02-ua-channels': 'Kênh UA: Google Ads, Meta, TikTok, AppLovin, Mintegral...',
  '03-monetization': 'Monetization: AdMob, MAX, mediation, ad format/placement, eCPM',
  '04-measurement': 'Đo lường: Firebase events, MMP, attribution',
  '05-optimization': 'Đọc chỉ số và tối ưu: ROAS/CPI/retention theo mốc, quy tắc scale/cut',
  '06-tools': 'Công cụ & workflow AI phục vụ marketing (nội bộ Apero + bên ngoài): làm gì, dùng ở bước nào, cách chạy',
  'playbooks': 'Checklist từng bước cho các việc lặp lại',
  'lessons': 'Bài học rút ra từ data/việc thật (có ngày, bối cảnh)',
  'decisions': 'Quyết định đã chốt và lý do',
  'apps': 'Hồ sơ từng app: thông số, lịch sử campaign, kết quả',
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Credential bị chặn (repo private nên số liệu/tên app/email được phép, chỉ chặn bí mật truy cập).
export const SECRET_PATTERNS = [
  { name: 'Google API key', re: /AIza[0-9A-Za-z_\-]{35}/ },
  { name: 'Google OAuth token', re: /ya29\.[0-9A-Za-z_\-]{20,}/ },
  { name: 'AWS access key', re: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { name: 'Private key block', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'GitHub token', re: /\b(ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{20,}/ },
  { name: 'Slack token', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}/ },
  { name: 'Meta access token', re: /\bEAA[A-Za-z0-9]{40,}/ },
  { name: 'Anthropic/OpenAI key', re: /\bsk-(ant-)?[A-Za-z0-9_\-]{20,}/ },
  { name: 'Bearer token', re: /Bearer\s+[A-Za-z0-9_\-.=]{30,}/ },
  { name: 'Gán credential', re: /\b(api[_-]?key|dev[_-]?key|secret|client[_-]?secret|access[_-]?token|refresh[_-]?token|password|passwd|auth[_-]?token)\b["']?\s*[:=]\s*["']?(?![<{])[A-Za-z0-9_\-\/+=.]{12,}/i },
];

export function findSecrets(text) {
  const hits = [];
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const p of SECRET_PATTERNS) if (p.re.test(line)) hits.push({ line: i + 1, name: p.name });
  });
  return hits;
}

// ---------- chuỗi ----------

// Bỏ dấu tiếng Việt để search và tạo slug.
export function foldVi(s) {
  return String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export function slugify(s) {
  return foldVi(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'untitled';
}

export function today() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ---------- đọc / ghi tài liệu ----------

export function parseDoc(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { fm: null, body: text, error: 'Thiếu frontmatter (khối --- ở đầu file)' };
  try {
    const fm = YAML.parse(m[1], { schema: 'core' }) ?? {};
    // YAML có thể parse ngày thành Date nếu không phải core schema; chuẩn hoá về chuỗi.
    for (const k of ['created', 'updated']) if (fm[k] instanceof Date) fm[k] = fm[k].toISOString().slice(0, 10);
    return { fm, body: m[2] };
  } catch (e) {
    return { fm: null, body: m[2], error: `Frontmatter YAML lỗi: ${e.message.split('\n')[0]}` };
  }
}

const isEmpty = (k, v) => v === undefined || v === null || (Array.isArray(v) && !v.length && k !== 'tags');

export function serializeDoc(fm, body) {
  const ordered = {};
  for (const k of [...FIELD_ORDER, ...Object.keys(fm)]) if (!(k in ordered) && !isEmpty(k, fm[k])) ordered[k] = fm[k];
  const y = YAML.stringify(ordered, { lineWidth: 0 });
  const b = String(body ?? '').replace(/^\n+/, '');
  return `---\n${compactArrays(y)}---\n\n${b.endsWith('\n') ? b : b + '\n'}`;
}

// Mảng scalar ngắn (tags, geo, images, related) viết dạng flow `[a, b]` cho frontmatter dễ đọc.
function compactArrays(y) {
  const lines = y.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^([a-z_]+):$/.exec(lines[i]);
    if (m && ['tags', 'geo', 'images', 'related'].includes(m[1])) {
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s*- /.test(lines[j])) { items.push(lines[j].replace(/^\s*- /, '')); j++; }
      const simple = items.length && items.every(it => !/[,\[\]{}#]|: /.test(it) || /^".*"$/.test(it));
      const flow = `${m[1]}: [${items.join(', ')}]`;
      if (simple && flow.length <= 160) { out.push(flow); i = j - 1; continue; }
    }
    out.push(lines[i]);
  }
  return out.join('\n');
}

export function walk(dir, filter = () => true) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, filter));
    else if (filter(p)) out.push(p);
  }
  return out.sort();
}

export function isIndexFile(rel) {
  return rel === 'INDEX.md' || /(^|\/)README\.md$/.test(rel);
}

// Danh sách tài liệu (không gồm INDEX.md). rel = đường dẫn tương đối từ knowledge/.
export function listDocs(r = root()) {
  const kdir = path.join(r, KNOWLEDGE_DIR);
  return walk(kdir, p => p.endsWith('.md')).map(abs => {
    const rel = path.relative(kdir, abs).split(path.sep).join('/');
    if (isIndexFile(rel)) return null;
    const text = fs.readFileSync(abs, 'utf8');
    const { fm, body, error } = parseDoc(text);
    return { rel, abs, fm: fm ?? {}, body, error };
  }).filter(Boolean);
}

export function topicOf(rel) {
  return path.posix.dirname(rel) === '.' ? '' : path.posix.dirname(rel);
}

// ---------- lint ----------

const _manifests = new Map();
function mediaInManifest(r, rel) {
  if (!_manifests.has(r)) _manifests.set(r, readJSON(path.join(r, 'media/manifest.json'), { files: {} }));
  return Boolean(_manifests.get(r).files?.[rel]);
}

// Trả về { errors: [{file, msg}], warnings: [...] }.
export function lintDocs(r = root(), onlyRels = null) {
  _manifests.delete(r);
  const docs = listDocs(r);
  const errors = [], warnings = [];
  const E = (file, msg) => errors.push({ file, msg });
  const W = (file, msg) => warnings.push({ file, msg });
  const titles = new Map();

  for (const d of docs) {
    if (onlyRels && !onlyRels.includes(d.rel)) { titles.set(d.fm.title, d.rel); continue; }
    const f = `knowledge/${d.rel}`;
    if (d.error) { E(f, d.error); continue; }
    const fm = d.fm;
    const base = path.posix.basename(d.rel, '.md');
    if (!SLUG_RE.test(base)) E(f, `Tên file phải kebab-case không dấu (vd: ${slugify(base)}.md)`);
    for (const k of REQUIRED) if (fm[k] === undefined || fm[k] === null || fm[k] === '') E(f, `Thiếu field bắt buộc: ${k}`);
    if (fm.type && !TYPES.includes(fm.type)) E(f, `type không hợp lệ "${fm.type}" (cho phép: ${TYPES.join(', ')})`);
    if (fm.status && !STATUSES.includes(fm.status)) E(f, `status không hợp lệ "${fm.status}" (cho phép: ${STATUSES.join(', ')})`);
    if (fm.confidence && !CONFIDENCES.includes(fm.confidence)) E(f, `confidence không hợp lệ "${fm.confidence}"`);
    for (const k of ['created', 'updated']) if (fm[k] && !DATE_RE.test(String(fm[k]))) E(f, `${k} phải dạng YYYY-MM-DD`);
    if (fm.created && fm.updated && String(fm.updated) < String(fm.created)) E(f, 'updated nhỏ hơn created');
    const topic = topicOf(d.rel);
    if (fm.topic !== undefined && fm.topic !== topic) E(f, `topic "${fm.topic}" không khớp thư mục "${topic}"`);
    const top = topic.split('/')[0];
    if (!(top in TOPICS)) E(f, `Thư mục cấp 1 "${top || '(gốc)'}" không thuộc cây topic (${Object.keys(TOPICS).join(', ')})`);
    for (const k of ['tags', 'geo', 'sources', 'images', 'related']) if (fm[k] !== undefined && !Array.isArray(fm[k])) E(f, `${k} phải là danh sách`);
    if (fm.summary && String(fm.summary).length > 220) W(f, 'summary nên ≤ 220 ký tự (nó là 1 dòng trong INDEX)');
    if (fm.type === 'lesson' && !(fm.sources?.length)) E(f, 'lesson phải có sources (nguồn: session/ngày/data)');
    if (fm.app !== undefined && fm.app !== 'general' && !SLUG_RE.test(String(fm.app))) E(f, 'app phải là slug (vd: home-morph) hoặc "general"');

    // Ảnh: field images + link markdown trong body phải tồn tại.
    const imgs = new Set(Array.isArray(fm.images) ? fm.images : []);
    for (const m of d.body.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const url = m[1];
      if (/^https?:/.test(url)) continue;
      const resolved = path.posix.normalize(path.posix.join('knowledge', path.posix.dirname(d.rel), decodeURI(url)));
      if (!fs.existsSync(path.join(r, resolved))) {
        // media/ không nằm trong git: máy này có thể chưa import → chỉ cảnh báo nếu manifest có file đó
        if (resolved.startsWith('media/') && mediaInManifest(r, resolved)) W(f, `Media chưa có trên máy này (chạy kb media import): ${resolved}`);
        else E(f, `Ảnh không tồn tại: ${url}`);
      }
      else if (!imgs.has(resolved)) W(f, `Ảnh ${resolved} có trong bài nhưng thiếu trong field images`);
    }
    for (const img of imgs) if (!fs.existsSync(path.join(r, img)) && !(img.startsWith('media/') && mediaInManifest(r, img))) E(f, `images: file không tồn tại ${img}`);

    // Link tới media/ (video, file mẫu): phải có trong manifest
    for (const m of d.body.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s#]*media\/[^)\s#]+)\)/g)) {
      const resolved = path.posix.normalize(path.posix.join('knowledge', path.posix.dirname(d.rel), decodeURI(m[1])));
      if (!mediaInManifest(r, resolved)) E(f, `Media chưa đăng ký trong media/manifest.json: ${resolved} (dùng kb media add)`);
      else if (!fs.existsSync(path.join(r, resolved))) W(f, `Media chưa có trên máy này (chạy kb media import): ${resolved}`);
    }

    // Link nội bộ .md phải tồn tại.
    for (const m of d.body.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s#]+\.md)(#[^)]*)?\)/g)) {
      if (/^https?:/.test(m[1]) || /(^|\/)media\//.test(m[1])) continue; // media/ (kể cả secrets) kiểm ở trên
      const target = path.join(r, 'knowledge', path.posix.dirname(d.rel), decodeURI(m[1]));
      if (!fs.existsSync(target)) E(f, `Link hỏng: ${m[1]}`);
    }
    for (const rel of Array.isArray(fm.related) ? fm.related : []) {
      if (!fs.existsSync(path.join(r, KNOWLEDGE_DIR, rel))) E(f, `related trỏ tới file không tồn tại: ${rel}`);
    }

    for (const s of findSecrets(d.body + '\n' + JSON.stringify(fm))) E(f, `Nghi là credential (${s.name}) — không được lưu vào knowledge`);
    if (d.rel === '00-overview/watchlist.md') {
      for (const line of d.body.split('\n')) if (/^\s*- \[( |x|X)\] /.test(line) && !/^\s*- \[( |x|X)\] \d{4}-\d{2}-\d{2} · [a-z0-9-]+ · .+/.test(line)) E(f, `Mốc sai định dạng: "${line.trim().slice(0, 80)}" — cần "- [ ] YYYY-MM-DD · app-slug · việc cần làm"`);
    }

    if (fm.title) {
      if (titles.has(fm.title)) W(f, `Trùng title với knowledge/${titles.get(fm.title)} — có nên gộp?`);
      titles.set(fm.title, d.rel);
    }
  }

  // File dữ liệu thô không được nằm trong knowledge/ hoặc assets/.
  if (!onlyRels) {
    for (const dir of [KNOWLEDGE_DIR, ASSETS_DIR]) {
      for (const p of walk(path.join(r, dir), p => /\.(csv|xlsx?|json|env|pem|p12|keystore)$/i.test(p))) {
        const rel = path.relative(r, p).split(path.sep).join('/');
        if (rel === 'assets/manifest.json') continue;
        E(rel, 'File dữ liệu thô/credential không được để trong knowledge/ hay assets/ — tóm tắt vào Markdown, file gốc để raw/ hoặc exports/');
      }
    }
  }
  return { errors, warnings, count: docs.length };
}

// ---------- INDEX ----------

export function buildIndex(r = root()) {
  const docs = listDocs(r).filter(d => !d.error);
  const groups = new Map();
  for (const d of docs) {
    const topic = topicOf(d.rel) || '(gốc)';
    const top = topic.split('/')[0];
    if (!groups.has(top)) groups.set(top, []);
    groups.get(top).push(d);
  }
  const order = [...Object.keys(TOPICS), ...[...groups.keys()].filter(k => !(k in TOPICS)).sort()];
  const latest = docs.map(d => String(d.fm.updated ?? '')).sort().pop() || '-';
  const drafts = docs.filter(d => d.fm.status === 'draft').length;
  const lines = [
    '# Knowledge Index',
    '',
    `> AUTO-GENERATED bởi \`npm run kb:index\` — không sửa tay. ${docs.length} tài liệu (${drafts} draft), cập nhật gần nhất ${latest}.`,
    '> Mỗi dòng: `đường dẫn trong knowledge/` — tóm tắt `[type · status · updated · app]`. Mở file khi cần chi tiết.',
    '',
  ];
  for (const top of order) {
    const g = groups.get(top);
    if (!g) continue;
    lines.push(`## ${top}${TOPICS[top] ? ` — ${TOPICS[top]}` : ''}`, '');
    g.sort((a, b) => a.rel.localeCompare(b.rel));
    for (const d of g) {
      const fm = d.fm;
      const meta = [fm.type, fm.status, fm.updated, fm.app && fm.app !== 'general' ? fm.app : null].filter(Boolean).join(' · ');
      const img = Array.isArray(fm.images) && fm.images.length ? ` 🖼${fm.images.length}` : '';
      lines.push(`- \`${d.rel}\` — ${oneLine(fm.summary || fm.title)} \`[${meta}]\`${img}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function oneLine(s) { return String(s ?? '').replace(/\s+/g, ' ').trim(); }

export function writeIndex(r = root()) {
  const p = path.join(r, KNOWLEDGE_DIR, 'INDEX.md');
  const next = buildIndex(r);
  const prev = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  if (prev !== next) fs.writeFileSync(p, next);
  return { changed: prev !== next, path: p };
}

// ---------- tạo tài liệu ----------

export function newDoc({ topic, title, type = 'concept', summary = '', app = 'general', tags = [], body = '', status = 'draft', sources = [] }, r = root()) {
  const prefix = topic.split('/')[0] === 'lessons' ? `${today().slice(0, 7)}-` : '';
  const rel = `${topic}/${prefix}${slugify(title)}.md`;
  const abs = path.join(r, KNOWLEDGE_DIR, rel);
  if (fs.existsSync(abs)) throw new Error(`Đã tồn tại: knowledge/${rel} — hãy cập nhật file đó thay vì tạo mới`);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const d = today();
  const fm = { title, type, topic, tags, app, status, confidence: 'medium', sources, created: d, updated: d, images: [], summary: summary || title };
  fs.writeFileSync(abs, serializeDoc(fm, body || `# ${title}\n`));
  return { rel, abs };
}

export function readJSON(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

export function writeJSON(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const tmp = `${p}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n');
  fs.renameSync(tmp, p);
}
