#!/usr/bin/env node
// CLI quản lý knowledge. Chạy: node scripts/kb/cli.mjs <lệnh> (hoặc npm run kb -- <lệnh>)
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import MiniSearch from 'minisearch';
import { root, writeIndex, lintDocs, listDocs, newDoc, foldVi, STATE_DIR, TOPICS, TYPES } from './lib.mjs';
import { resolveTranscript, listImages, digest } from './transcript.mjs';
import { saveImage, importImageFile, mdImagePath } from './images.mjs';
import { commitKnowledge } from './git.mjs';
import { addFollowup, listFollowups, completeFollowup, ensureWatchlist } from './followups.mjs';
import { diagnose } from './doctor.mjs';
import { recall } from './recall.mjs';
import { addMedia, mediaStatus, exportMedia, importMedia } from './media.mjs';

const HELP = `kb — quản lý knowledge base

  index                         Sinh lại knowledge/INDEX.md
  lint [file...] [--json]       Kiểm tra frontmatter, ảnh, link, credential
  search <từ khoá> [--limit N]  Tìm trong knowledge (có/không dấu đều được)
  new --topic T --title "..." [--type concept] [--summary "..."] [--app slug]
                                Tạo tài liệu mới từ khung chuẩn (status draft)
  images list [--transcript F]  Liệt kê ảnh trong transcript session hiện tại
  images save <n...> --slug S [--doc rel] [--transcript F]
                                Lưu ảnh số n vào assets/screenshots/, in đường dẫn + markdown
  images import <file...> --slug S [--doc rel]
                                Copy file ảnh vào assets/screenshots/
  commit -m "kb: ..."           index + lint + commit knowledge/assets + pull --rebase + push
  skip "<lý do>"                Ghi nhận session này không có gì đáng nạp
  digest [--transcript F] [--from N]
                                In transcript dạng text (không base64)
  topics                        Liệt kê nhánh topic và type hợp lệ
  followup add --when 7d|YYYY-MM-DD --app slug --text "..."
                                Thêm mốc theo dõi vào knowledge/00-overview/watchlist.md
  followup list [--all]         Mốc đang mở (đánh số), đến hạn/quá hạn được đánh dấu
  followup done <số|từ khoá> [--note "kết quả"]
                                Đánh dấu xong (chuyển sang "Đã xong", kèm kết quả)
  doctor [--json]               Sức khoẻ knowledge: mốc đến hạn, draft cũ, mâu thuẫn, ảnh mồ côi...
  media add <file...> --slug S [--doc rel] [--source "..."]
                                Đưa video/ảnh lớn/file mẫu vào media/ (ngoài git, có manifest)
  media status [--verify]       So media/ trên máy với manifest (thiếu / thừa / hỏng)
  media export [--out file.tar] Đóng gói media để chép sang máy khác
  media import <file.tar|thư mục>
                                Nhập media từ gói export hoặc từ repo/media của máy khác
  recall "<câu hỏi>"            Tài liệu liên quan nhất tới câu hỏi (dùng như hook UserPromptSubmit)
`;

const [cmd, ...rest] = process.argv.slice(2);

function opts(args, spec) {
  return parseArgs({ args, options: spec, allowPositionals: true, strict: false });
}

// Ngày theo giờ máy (timestamp transcript là UTC).
function localDate(iso) {
  const d = new Date(iso);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function fail(msg) { console.error(msg); process.exit(1); }

const commands = {
  index() {
    const { changed } = writeIndex();
    console.log(changed ? 'INDEX.md đã cập nhật' : 'INDEX.md không đổi');
  },

  lint(args) {
    const { values, positionals } = opts(args, { json: { type: 'boolean' } });
    const rels = positionals.length ? positionals.map(p => path.relative(path.join(root(), 'knowledge'), path.resolve(p)).split(path.sep).join('/')) : null;
    const res = lintDocs(root(), rels);
    if (values.json) { console.log(JSON.stringify(res, null, 2)); process.exit(res.errors.length ? 1 : 0); }
    for (const e of res.errors) console.log(`✗ ${e.file}: ${e.msg}`);
    for (const w of res.warnings) console.log(`! ${w.file}: ${w.msg}`);
    console.log(`${res.count} tài liệu — ${res.errors.length} lỗi, ${res.warnings.length} cảnh báo`);
    process.exit(res.errors.length ? 1 : 0);
  },

  search(args) {
    const { values, positionals } = opts(args, { limit: { type: 'string' } });
    const q = positionals.join(' ');
    if (!q) fail('Cần từ khoá');
    const docs = listDocs().filter(d => !d.error).map((d, id) => ({ id, rel: d.rel, title: d.fm.title, summary: d.fm.summary, tags: (d.fm.tags || []).join(' '), app: d.fm.app, body: d.body }));
    const ms = new MiniSearch({ fields: ['title', 'summary', 'tags', 'app', 'body'], storeFields: ['rel', 'title', 'summary'], processTerm: t => foldVi(t).toLowerCase(), searchOptions: { boost: { title: 3, summary: 2, tags: 2 }, prefix: true, fuzzy: 0.2 } });
    ms.addAll(docs);
    const hits = ms.search(q).slice(0, Number(values.limit || 10));
    if (!hits.length) console.log('Không có kết quả');
    for (const h of hits) console.log(`knowledge/${h.rel}  (${h.score.toFixed(1)})\n    ${h.title} — ${h.summary ?? ''}`);
  },

  new(args) {
    const { values } = opts(args, { topic: { type: 'string' }, title: { type: 'string' }, type: { type: 'string' }, summary: { type: 'string' }, app: { type: 'string' }, tags: { type: 'string' } });
    if (!values.topic || !values.title) fail('Cần --topic và --title');
    const r = newDoc({ topic: values.topic, title: values.title, type: values.type || 'concept', summary: values.summary, app: values.app || 'general', tags: values.tags ? values.tags.split(',').map(s => s.trim()) : [] });
    console.log(`Đã tạo knowledge/${r.rel}`);
  },

  images(args) {
    const [sub, ...a] = args;
    const { values, positionals } = opts(a, { transcript: { type: 'string' }, slug: { type: 'string' }, doc: { type: 'string' }, date: { type: 'string' } });
    const print = (res, doc) => {
      console.log(`${res.duplicate ? 'ĐÃ CÓ (trùng)' : 'Đã lưu'}: ${res.path}${res.resized ? ' (đã resize)' : ''}`);
      console.log(`  images: thêm "${res.path}"`);
      if (doc) console.log(`  markdown: ![mô tả](${mdImagePath(res.path, doc)})`);
      else console.log('  markdown: (truyền --doc <topic/file.md> để in đường dẫn tương đối)');
    };
    if (sub === 'import') {
      if (!positionals.length || !values.slug) fail('Cần <file...> và --slug');
      for (const f of positionals) print(importImageFile(f, { slug: values.slug, date: values.date }), values.doc);
      return;
    }
    const t = resolveTranscript(values.transcript);
    if (!t) fail('Không tìm thấy transcript của session (truyền --transcript)');
    const imgs = listImages(t);
    if (sub === 'list' || !sub) {
      console.log(`Transcript: ${t}`);
      if (!imgs.length) console.log('Không có ảnh nào trong session này');
      for (const i of imgs) console.log(`#${i.n}  ${i.origin}  ${i.timestamp ?? ''}  ${(i.bytes / 1024).toFixed(0)}KB  ${i.mediaType}\n     "${i.context}"`);
      return;
    }
    if (sub === 'save') {
      if (!positionals.length || !values.slug) fail('Cần số thứ tự ảnh và --slug');
      for (const n of positionals.map(Number)) {
        const img = imgs.find(i => i.n === n);
        if (!img) fail(`Không có ảnh #${n} (session có ${imgs.length} ảnh)`);
        const date = values.date || (img.timestamp ? localDate(img.timestamp) : undefined);
        print(saveImage(Buffer.from(img.data, 'base64'), { slug: values.slug, mediaType: img.mediaType, date, source: `${path.basename(t)}#${n}` }), values.doc);
      }
      return;
    }
    fail(`images: lệnh con không hợp lệ "${sub}"`);
  },

  commit(args) {
    const { values } = opts(args, { m: { type: 'string', short: 'm' }, message: { type: 'string' } });
    const msg = values.m || values.message;
    if (!msg) fail('Cần -m "kb: ..."');
    try {
      const res = commitKnowledge(msg);
      console.log(res.committed ? `Commit ${res.sha}: ${msg}` : 'Không có thay đổi knowledge để commit');
      if (res.pushed) console.log('Đã push');
      for (const w of res.warnings) console.log(`! ${w}`);
    } catch (e) { fail(e.message); }
  },

  skip(args) {
    const reason = args.join(' ').trim();
    if (!reason) fail('Cần lý do, vd: skip "chỉ hỏi định nghĩa đã có trong knowledge"');
    const log = path.join(root(), STATE_DIR, 'skips.log');
    fs.mkdirSync(path.dirname(log), { recursive: true });
    fs.appendFileSync(log, `${new Date().toISOString()}\t${process.env.KB_SESSION_ID ?? '-'}\t${reason}\n`);
    console.log('Đã ghi nhận: không nạp knowledge cho phần việc này');
  },

  digest(args) {
    const { values } = opts(args, { transcript: { type: 'string' }, from: { type: 'string' } });
    const t = resolveTranscript(values.transcript);
    if (!t) fail('Không tìm thấy transcript');
    console.log(digest(t, { fromLine: Number(values.from || 0) }));
  },

  followup(args) {
    const [sub, ...a] = args;
    const { values, positionals } = opts(a, { when: { type: 'string' }, date: { type: 'string' }, app: { type: 'string' }, text: { type: 'string' }, note: { type: 'string' }, all: { type: 'boolean' } });
    if (sub === 'add') {
      const when = values.when || values.date;
      if (!when || !values.text) fail('Cần --when (7d, 1m, YYYY-MM-DD) và --text');
      const r = addFollowup({ date: when, app: values.app || 'general', text: values.text });
      console.log(r.duplicate ? `Đã có: ${r.item}` : `Đã thêm: ${r.item}`);
      return;
    }
    if (sub === 'done') {
      if (!positionals.length) fail('Cần số thứ tự (theo followup list) hoặc từ khoá');
      const f = completeFollowup(positionals.join(' '), { note: values.note });
      console.log(`Xong: ${f.date} · ${f.app} · ${f.text}`);
      return;
    }
    if (sub === 'list' || !sub) {
      ensureWatchlist();
      const all = listFollowups();
      const open = all.filter(f => !f.done);
      if (!open.length) console.log('Không có mốc nào đang mở');
      open.forEach((f, i) => console.log(`${String(i + 1).padStart(2)}. ${f.overdue ? '⚠ QUÁ HẠN ' : f.due ? '⏰ HÔM NAY ' : ''}${f.date} · ${f.app} · ${f.text}`));
      if (values.all) for (const f of all.filter(f => f.done)) console.log(`    ✓ ${f.date} · ${f.app} · ${f.text}`);
      return;
    }
    fail(`followup: lệnh con không hợp lệ "${sub}"`);
  },

  doctor(args) {
    const { values } = opts(args, { json: { type: 'boolean' } });
    const dx = diagnose();
    if (values.json) { console.log(JSON.stringify(dx, null, 2)); return; }
    const { due, upcoming } = dx.followups;
    console.log(`Mốc theo dõi: ${due.length} đến hạn, ${upcoming.length} trong 7 ngày tới`);
    for (const f of due) console.log(`  ⏰ ${f.date}${f.overdue ? ' (quá hạn)' : ''} · ${f.app} · ${f.text}`);
    for (const f of upcoming) console.log(`  · ${f.date} · ${f.app} · ${f.text}`);
    console.log(`Draft chờ duyệt: ${dx.drafts.length}${dx.drafts.length ? ` (cũ nhất ${dx.drafts[0].age} ngày: ${dx.drafts[0].rel})` : ''}`);
    if (!dx.issues.length) console.log('Không có vấn đề nào');
    for (const i of dx.issues) console.log(`  ${i.severity === 'warn' ? '!' : '·'} [${i.kind}] ${i.rel}: ${i.msg}`);
  },

  media(args) {
    const [sub, ...a] = args;
    const { values, positionals } = opts(a, { slug: { type: 'string' }, doc: { type: 'string' }, source: { type: 'string' }, out: { type: 'string' }, verify: { type: 'boolean' }, date: { type: 'string' } });
    const mb = b => `${(b / 1048576).toFixed(1)}MB`;
    if (sub === 'add') {
      if (!positionals.length) fail('Cần đường dẫn file');
      for (const f of positionals) {
        const r = addMedia(f, { slug: values.slug, source: values.source ?? path.basename(f), date: values.date });
        console.log(`${r.duplicate ? 'ĐÃ CÓ (trùng)' : 'Đã thêm'}: ${r.path}`);
        if (values.doc) console.log(`  markdown: ${/\.(mp4|mov|webm|m4v)$/i.test(r.path) ? '[▶ mô tả video]' : '![mô tả]'}(${mdImagePath(r.path, values.doc)})`);
      }
      return;
    }
    if (sub === 'status' || !sub) {
      const s = mediaStatus({ verify: values.verify });
      console.log(`Manifest: ${s.total} file, ${mb(s.bytes)}`);
      console.log(`Thiếu trên máy này: ${s.missing.length}${s.missing.length ? ' → chạy kb media import <gói export>' : ''}`);
      for (const p of s.missing.slice(0, 20)) console.log(`  - ${p}`);
      if (s.untracked.length) { console.log(`Có trên đĩa nhưng chưa vào manifest: ${s.untracked.length}`); for (const p of s.untracked.slice(0, 20)) console.log(`  ? ${p}`); }
      if (s.corrupt.length) { console.log(`Hỏng (sha lệch): ${s.corrupt.length}`); for (const p of s.corrupt) console.log(`  ✗ ${p}`); }
      return;
    }
    if (sub === 'export') {
      const out = values.out || `media-export-${new Date().toISOString().slice(0, 10)}.tar`;
      const r = exportMedia(out);
      console.log(`Đã đóng gói ${r.files} file (${mb(r.bytes)}) → ${r.out}\nSang máy khác: node scripts/kb/cli.mjs media import ${path.basename(r.out)}`);
      return;
    }
    if (sub === 'import') {
      if (!positionals[0]) fail('Cần file .tar hoặc thư mục');
      const r = importMedia(positionals[0]);
      console.log(`Đã chép ${r.copied} file, bỏ qua ${r.skipped} file đã có${r.bad.length ? `, ${r.bad.length} file sha lệch (không chép): ${r.bad.join(', ')}` : ''}`);
      return;
    }
    fail(`media: lệnh con không hợp lệ "${sub}"`);
  },

  recall(args) {
    const hits = recall(args.join(' '));
    if (!hits.length) console.log('Không có tài liệu nào đủ liên quan');
    for (const h of hits) console.log(`knowledge/${h.rel}  (${h.score}; ${h.terms.join(', ')})\n    ${h.title} — ${h.summary}`);
  },

  topics() {
    for (const [k, v] of Object.entries(TOPICS)) console.log(`${k.padEnd(18)} ${v}`);
    console.log(`\ntype: ${TYPES.join(', ')}`);
  },
};

if (!cmd || cmd === 'help' || cmd === '--help') { console.log(HELP); process.exit(0); }
if (!commands[cmd]) fail(`Lệnh không hợp lệ: ${cmd}\n\n${HELP}`);
await commands[cmd](rest);
