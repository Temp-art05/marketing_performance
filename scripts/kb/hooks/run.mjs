// Điểm vào cho mọi hook: đảm bảo đã có node_modules (clone mới chưa npm install) rồi chạy hook thật.
// Không import gì ngoài node built-in để luôn chạy được.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../..'); // scripts/kb/hooks → gốc repo
const name = process.argv[2];
if (!/^[a-z-]+$/.test(name ?? '') || !fs.existsSync(path.join(here, `${name}.mjs`))) process.exit(0);

if (!fs.existsSync(path.join(repo, 'node_modules', 'yaml'))) {
  if (name !== 'session-start') process.exit(0); // hook khác: lặng lẽ bỏ qua, SessionStart sẽ cài
  try { execSync('npm ci --silent --no-audit --no-fund', { cwd: repo, stdio: 'ignore', timeout: 120000 }); }
  catch { console.log('[KB] Chưa cài được dependency (npm ci lỗi) — hooks knowledge tạm tắt. Chạy `npm install` trong repo.'); process.exit(0); }
}
await import(path.join(here, `${name}.mjs`));
