// Đọc transcript JSONL của Claude Code: tìm transcript của session, trích ảnh,
// đánh giá "session có làm việc thực chất chưa được nạp knowledge", tạo digest dạng text.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { root } from './lib.mjs';

// Claude Code đặt tên theo realpath (vd /var → /private/var trên macOS).
export function projectSlug(dir) {
  let p = path.resolve(dir);
  try { p = fs.realpathSync(p); } catch { /* chưa tồn tại */ }
  return p.replace(/[^A-Za-z0-9]/g, '-');
}

export function projectTranscriptDir(dir = root()) {
  const base = process.env.KB_CLAUDE_PROJECTS_DIR || path.join(os.homedir(), '.claude', 'projects');
  return path.join(base, projectSlug(dir));
}

// Ưu tiên: tham số → KB_TRANSCRIPT (SessionStart hook ghi) → jsonl mới sửa nhất của project.
export function resolveTranscript(explicit) {
  if (explicit) return path.resolve(explicit);
  if (process.env.KB_TRANSCRIPT && fs.existsSync(process.env.KB_TRANSCRIPT)) return process.env.KB_TRANSCRIPT;
  const dir = projectTranscriptDir();
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))
    .map(f => ({ f: path.join(dir, f), t: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  return files[0]?.f ?? null;
}

// Trả về mảng { line (1-based), entry }; bỏ qua dòng hỏng (file có thể đang được ghi dở).
export function readEntries(file) {
  const text = fs.readFileSync(file, 'utf8');
  const out = [];
  text.split('\n').forEach((l, i) => {
    if (!l.trim()) return;
    try { out.push({ line: i + 1, entry: JSON.parse(l) }); } catch { /* dòng đang ghi dở */ }
  });
  return out;
}

export function lineCount(file) {
  if (!file || !fs.existsSync(file)) return 0;
  const text = fs.readFileSync(file, 'utf8');
  return text.split('\n').filter(Boolean).length;
}

function contentBlocks(entry) {
  const c = entry?.message?.content;
  if (typeof c === 'string') return [{ type: 'text', text: c }];
  return Array.isArray(c) ? c.filter(b => b && typeof b === 'object') : [];
}

// ---------- ảnh ----------

// Liệt kê ảnh: ảnh user dán (origin=pasted) và ảnh trong tool_result (origin=tool).
export function listImages(file) {
  const imgs = [];
  for (const { line, entry } of readEntries(file)) {
    if (entry.type !== 'user' || entry.isSidechain) continue;
    const blocks = contentBlocks(entry);
    const text = blocks.filter(b => b.type === 'text').map(b => b.text).join(' ').replace(/\s+/g, ' ').trim();
    const push = (b, origin) => {
      if (b?.source?.type !== 'base64' || !b.source.data) return;
      imgs.push({
        n: imgs.length + 1, line, origin, timestamp: entry.timestamp ?? null,
        mediaType: b.source.media_type || 'image/png', data: b.source.data,
        bytes: Math.floor(b.source.data.length * 3 / 4), context: text.slice(0, 200),
      });
    };
    for (const b of blocks) {
      if (b.type === 'image') push(b, 'pasted');
      if (b.type === 'tool_result' && Array.isArray(b.content)) for (const bb of b.content) if (bb?.type === 'image') push(bb, 'tool');
    }
  }
  return imgs;
}

// ---------- đánh giá công việc ----------

const KB_PATH_RE = /(^|\/)(knowledge|assets\/screenshots)\//;
const KB_CMD_RE = /scripts\/kb\/|npm run kb|\bkb(:index|:lint)?\b/;
// Lệnh đánh dấu đã xử lý phần nạp knowledge.
const CAPTURE_CMD_RE = /scripts\/kb\/cli\.mjs\s+(skip|commit|images\s+save|images\s+import|new)\b|npm run kb\s+--\s+(skip|commit|new)\b/;
// File dữ liệu (report export, bảng tính, PDF) — đọc 1 lần cũng thường ra insight đáng nạp.
const DATA_RE = /(^|[\s\/'"])(exports|raw)\/|\.(csv|tsv|xlsx?|pdf)\b/i;
// Thông báo tự động / tin nhắn giữa các session / phản hồi hook — không phải user kể.
const AUTOMATED_RE = /\[Cross-session [a-z ]*notice\]|<task-notification|\[SYSTEM NOTIFICATION|<cross-session-message|<agent-message|Stop hook feedback|\[KB\]/;
const TRIVIAL_TOOLS = new Set(['TodoWrite', 'ToolSearch', 'Skill', 'AskUserQuestion', 'ExitPlanMode', 'EnterPlanMode', 'ListAgents', 'ScheduleWakeup']);

function toolPath(input) {
  return String(input?.file_path ?? input?.path ?? input?.notebook_path ?? '');
}

// Phân tích các entry có line > fromLine.
// Trả về { substantive, images, mcp, captured, skipped, tools: [...] }.
export function analyzeWork(file, fromLine = 0) {
  const r = { substantive: 0, images: 0, mcp: 0, dataReads: 0, userChars: 0, captured: false, tools: [], lastLine: fromLine };
  for (const { line, entry } of readEntries(file)) {
    r.lastLine = Math.max(r.lastLine, line);
    if (line <= fromLine) continue;
    if (entry.isSidechain) continue;
    for (const b of contentBlocks(entry)) {
      if (entry.type === 'user' && b.type === 'image') r.images++;
      if (entry.type === 'user' && b.type === 'text' && !b.text.startsWith('<') && !AUTOMATED_RE.test(b.text)) r.userChars += b.text.replace(/\[Image[^\]]*\]/g, '').trim().length;
      if (entry.type !== 'assistant' || b.type !== 'tool_use') continue;
      const name = b.name, input = b.input ?? {};
      const p = toolPath(input);
      if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(name) && KB_PATH_RE.test(p)) { r.captured = true; continue; }
      if (name === 'Bash') {
        const cmd = String(input.command ?? '');
        if (CAPTURE_CMD_RE.test(cmd)) { r.captured = true; continue; }
        if (KB_CMD_RE.test(cmd)) continue;
      }
      if (TRIVIAL_TOOLS.has(name)) continue;
      if (['Read', 'Grep', 'Glob'].includes(name) && (KB_PATH_RE.test(p) || /knowledge/.test(String(input.pattern ?? '') + p))) continue;
      if (name.startsWith('mcp__')) r.mcp++;
      if (DATA_RE.test(p) || (name === 'Bash' && DATA_RE.test(String(input.command ?? '')))) r.dataReads++;
      r.substantive++;
      r.tools.push(name);
    }
  }
  return r;
}

// Có cần nhắc nạp knowledge không.
// userChars: user kể một đoạn dài (bối cảnh, số liệu, diễn biến) cũng thường chứa điều đáng nạp.
export function needsCapture(a, { minTools = 3, minUserChars = 600 } = {}) {
  if (a.captured) return false;
  return a.images > 0 || a.mcp > 0 || a.dataReads > 0 || a.substantive >= minTools || a.userChars >= minUserChars;
}

// ---------- digest ----------

function trunc(s, n) {
  s = String(s ?? '');
  return s.length > n ? s.slice(0, n) + ` …[cắt ${s.length - n} ký tự]` : s;
}

// Chuyển transcript thành text đọc được (không có base64), đánh số ảnh khớp với listImages.
export function digest(file, { fromLine = 0, maxChars = 120000 } = {}) {
  const parts = [];
  let imgN = 0;
  for (const { line, entry } of readEntries(file)) {
    if (entry.isSidechain) continue;
    if (entry.type !== 'user' && entry.type !== 'assistant') continue;
    const marker = line > fromLine ? '' : ' (đã xử lý trước đó)';
    for (const b of contentBlocks(entry)) {
      if (entry.type === 'user') {
        if (b.type === 'text' && !b.text.startsWith('<')) parts.push(`\n[USER L${line}${marker}] ${trunc(b.text, 4000)}`);
        if (b.type === 'image') parts.push(`[ẢNH #${++imgN} do user dán — lưu bằng: node scripts/kb/cli.mjs images save ${imgN} --transcript "${file}" --slug <slug>]`);
        if (b.type === 'tool_result') {
          const c = Array.isArray(b.content) ? b.content : [{ type: 'text', text: b.content }];
          for (const cc of c) {
            if (cc?.type === 'image') parts.push(`[ẢNH #${++imgN} từ tool_result]`);
            else if (cc?.type === 'text') parts.push(`[TOOL RESULT] ${trunc(cc.text, 1500)}`);
          }
        }
      } else {
        if (b.type === 'text') parts.push(`\n[CLAUDE L${line}${marker}] ${trunc(b.text, 3000)}`);
        if (b.type === 'tool_use') parts.push(`[TOOL ${b.name}] ${trunc(JSON.stringify(b.input), 800)}`);
      }
    }
  }
  let text = parts.join('\n');
  if (text.length > maxChars) text = '…[phần đầu bị cắt]\n' + text.slice(text.length - maxChars);
  return text;
}
