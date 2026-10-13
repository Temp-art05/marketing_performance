// Tiện ích chung cho các hook Claude Code.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { root, STATE_DIR, readJSON, writeJSON } from '../lib.mjs';

export async function readInput() {
  let s = '';
  for await (const chunk of process.stdin) s += chunk;
  try { return JSON.parse(s || '{}'); } catch { return {}; }
}

export const isBackground = () => process.env.KB_BACKGROUND === '1';

const statePath = id => path.join(root(), STATE_DIR, 'sessions', `${String(id || 'unknown').replace(/[^A-Za-z0-9_-]/g, '')}.json`);
export const loadState = id => readJSON(statePath(id), { checkpoint: 0, reminders: 0, backgroundRuns: [] });
export const saveState = (id, s) => writeJSON(statePath(id), { ...s, updatedAt: new Date().toISOString() });

export function log(name, msg) {
  const p = path.join(root(), STATE_DIR, 'logs', `${name}.log`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.appendFileSync(p, `${new Date().toISOString()} ${msg}\n`);
}

// Chạy tiến trình tách rời (sống sót sau khi hook/Claude thoát), output vào file log.
export function spawnDetached(args, logName, env = {}) {
  const p = path.join(root(), STATE_DIR, 'logs', `${logName}.log`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const fd = fs.openSync(p, 'a');
  const child = spawn(process.execPath, args, { cwd: root(), detached: true, stdio: ['ignore', fd, fd], env: { ...process.env, ...env } });
  child.unref();
  return child.pid;
}

// Thư mục scripts/kb của chính mã nguồn (không phụ thuộc KB_ROOT, để test trên repo tạm vẫn chạy được).
export const SCRIPTS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
