// PostToolUse (Write|Edit|MultiEdit): file trong knowledge/ vừa đổi → lint file đó + sinh lại INDEX.
// Lỗi lint → exit 2, stderr đưa về cho Claude sửa ngay.
import path from 'node:path';
import { readInput } from './common.mjs';
import { root, lintDocs, writeIndex } from '../lib.mjs';

const input = await readInput();
const file = input.tool_input?.file_path ?? input.tool_input?.path;
if (!file) process.exit(0);

const kdir = path.join(root(), 'knowledge');
const abs = path.resolve(input.cwd ?? root(), file);
const rel = path.relative(kdir, abs).split(path.sep).join('/');
if (rel.startsWith('..') || !rel.endsWith('.md')) process.exit(0);

if (rel === 'INDEX.md') {
  writeIndex();
  console.error('knowledge/INDEX.md là file sinh tự động — đã sinh lại, đừng sửa tay. Sửa tài liệu gốc thay vì INDEX.');
  process.exit(2);
}

const { errors, warnings } = lintDocs(root(), [rel]);
writeIndex();
if (errors.length) {
  console.error(`Lint knowledge/${rel} có lỗi, sửa ngay:\n${errors.map(e => `- ${e.msg}`).join('\n')}\n(Quy cách: .claude/skills/kb-capture/SKILL.md)`);
  process.exit(2);
}
if (warnings.length) {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `Cảnh báo lint knowledge/${rel}:\n${warnings.map(w => `- ${w.msg}`).join('\n')}` } }));
}
