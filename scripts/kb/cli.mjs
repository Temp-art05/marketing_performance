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

  topics() {
    for (const [k, v] of Object.entries(TOPICS)) console.log(`${k.padEnd(18)} ${v}`);
    console.log(`\ntype: ${TYPES.join(', ')}`);
  },
};

if (!cmd || cmd === 'help' || cmd === '--help') { console.log(HELP); process.exit(0); }
if (!commands[cmd]) fail(`Lệnh không hợp lệ: ${cmd}\n\n${HELP}`);
await commands[cmd](rest);
