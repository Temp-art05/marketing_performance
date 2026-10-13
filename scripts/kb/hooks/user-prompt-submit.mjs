// UserPromptSubmit: tìm knowledge liên quan tới prompt → chèn vào context để Claude chủ động dùng bài học cũ.
import { readInput, isBackground, log } from './common.mjs';
import { recall } from '../recall.mjs';

const input = await readInput();
const prompt = String(input.prompt ?? input.user_prompt ?? '');
// Bỏ qua: agent nền, lệnh slash, thông báo tự động của hệ thống / tin nhắn từ session khác (không phải câu hỏi của user).
const AUTOMATED = /<task-notification|\[SYSTEM NOTIFICATION|<cross-session-message|<agent-message|Monitor event:/;
if (isBackground() || !prompt || prompt.trim().startsWith('/') || AUTOMATED.test(prompt)) process.exit(0);

let hits = [];
try { hits = recall(prompt); } catch (e) { log('hooks', `recall lỗi: ${e.message}`); process.exit(0); }
if (!hits.length) process.exit(0);

const lines = [
  '[KB] Knowledge liên quan tới yêu cầu này (đọc trước khi trả lời; nếu có bài học/quyết định/số liệu cũ áp dụng được thì nêu ngắn 1–3 lưu ý cho user và dẫn file; bỏ qua nếu không liên quan):',
  ...hits.map(h => `- knowledge/${h.rel} — ${h.summary ?? h.title} [${h.type} · ${h.status}${h.app && h.app !== 'general' ? ` · ${h.app}` : ''}]`),
];
console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: lines.join('\n') } }));
