// SessionEnd / PreCompact: hook có ngân sách thời gian rất ngắn (SessionEnd ~1.5s) → chỉ spawn agent nền rồi thoát.
// Agent nền tự quyết định có cần nạp không (background-capture.mjs).
import path from 'node:path';
import { readInput, isBackground, spawnDetached, SCRIPTS } from './common.mjs';

const input = await readInput();
if (isBackground() || !input.transcript_path) process.exit(0);
const mode = input.hook_event_name === 'PreCompact' ? 'precompact' : 'end';
spawnDetached([path.join(SCRIPTS, 'background-capture.mjs'),
  '--session', String(input.session_id), '--transcript', input.transcript_path, '--mode', mode, '--reason', String(input.reason ?? input.trigger ?? '')],
  'background-capture');
