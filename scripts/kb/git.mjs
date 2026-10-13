// Commit + push knowledge, có lock để hook nền, web và session Claude không giẫm lên nhau.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, STATE_DIR, writeIndex, lintDocs } from './lib.mjs';

const KB_PATHS = ['knowledge', 'assets', 'CLAUDE.md'];

function git(args, r, opts = {}) {
  return execFileSync('git', args, { cwd: r, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: opts.timeout ?? 60000 }).trim();
}

function tryGit(args, r, opts) {
  try { return { ok: true, out: git(args, r, opts) }; } catch (e) { return { ok: false, out: String(e.stderr || e.message).trim() }; }
}

export function withLock(r, fn, { waitMs = 60000 } = {}) {
  const lock = path.join(r, STATE_DIR, 'commit.lock');
  fs.mkdirSync(path.dirname(lock), { recursive: true });
  const start = Date.now();
  for (;;) {
    try { fs.mkdirSync(lock); break; } catch {
      // lock mồ côi (process chết) quá 5 phút thì phá
      try { if (Date.now() - fs.statSync(lock).mtimeMs > 300000) { fs.rmSync(lock, { recursive: true }); continue; } } catch {}
      if (Date.now() - start > waitMs) throw new Error('Không lấy được commit lock (đang có tiến trình kb commit khác)');
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300);
    }
  }
  try { return fn(); } finally { fs.rmSync(lock, { recursive: true, force: true }); }
}

export function kbDirty(r = root()) {
  return git(['status', '--porcelain', '--', ...KB_PATHS], r).length > 0;
}

// Trả về { committed, pushed, message, sha, warnings }.
export function commitKnowledge(message, { r = root(), push = process.env.KB_NO_PUSH !== '1', allowLintErrors = false } = {}) {
  return withLock(r, () => {
    writeIndex(r);
    // Chỉ chặn commit bởi lỗi trong file đang thay đổi; lỗi có sẵn ở file khác chỉ cảnh báo
    // (để 1 tài liệu cũ hỏng không làm kẹt mọi lần nạp mới).
    const changed = new Set(git(['status', '--porcelain', '-uall', '--', ...KB_PATHS], r).split('\n').filter(Boolean).map(l => l.slice(3).replace(/^.* -> /, '').replace(/^"|"$/g, '')));
    const lint = lintDocs(r);
    const blocking = lint.errors.filter(e => changed.has(e.file));
    const preexisting = lint.errors.filter(e => !changed.has(e.file));
    if (blocking.length && !allowLintErrors) {
      const msg = blocking.map(e => `  ${e.file}: ${e.msg}`).join('\n');
      throw new Error(`Lint lỗi, không commit. Sửa các lỗi sau rồi chạy lại:\n${msg}`);
    }
    const paths = KB_PATHS.filter(p => fs.existsSync(path.join(r, p)) || tryGit(['ls-files', '--', p], r).out);
    git(['add', '-A', '--', ...paths], r);
    const staged = git(['diff', '--cached', '--name-only', '--', ...paths], r);
    const res = { committed: false, pushed: false, sha: null, warnings: preexisting.length ? [`${preexisting.length} lỗi lint có sẵn ở file khác (không chặn commit): ${[...new Set(preexisting.map(e => e.file))].join(', ')}`] : [] };
    if (staged) {
      git(['commit', '-m', message, '--', ...paths], r);
      res.committed = true;
      res.sha = git(['rev-parse', '--short', 'HEAD'], r);
    }
    if (push) {
      const remote = tryGit(['remote'], r);
      if (!remote.ok || !remote.out) { res.warnings.push('Không có remote — bỏ qua push'); return res; }
      const ahead = tryGit(['rev-list', '--count', '@{u}..HEAD'], r);
      if (ahead.ok && ahead.out === '0' && !res.committed) return res;
      const pull = pullRebase(r);
      if (!pull.ok) { res.warnings.push(`Pull lỗi, chưa push: ${pull.out}`); return res; }
      const p = tryGit(['push'], r, { timeout: 60000 });
      res.pushed = p.ok;
      if (!p.ok) res.warnings.push(`Push lỗi (commit vẫn nằm local, lần commit sau sẽ push lại): ${p.out.split('\n')[0]}`);
    }
    return res;
  });
}

// pull --rebase; nếu conflict chỉ ở INDEX.md (file sinh tự động) thì sinh lại và tiếp tục.
export function pullRebase(r = root()) {
  const p = tryGit(['pull', '--rebase', '--autostash'], r, { timeout: 60000 });
  if (p.ok) return p;
  for (let i = 0; i < 20; i++) {
    const conflicts = tryGit(['diff', '--name-only', '--diff-filter=U'], r).out.split('\n').filter(Boolean);
    if (!conflicts.length) break;
    if (conflicts.some(f => f !== 'knowledge/INDEX.md')) {
      tryGit(['rebase', '--abort'], r);
      return { ok: false, out: `Conflict ở ${conflicts.join(', ')} — cần xử lý tay` };
    }
    writeIndex(r);
    git(['add', 'knowledge/INDEX.md'], r);
    const c = tryGit(['-c', 'core.editor=true', 'rebase', '--continue'], r);
    if (c.ok) return c;
  }
  return tryGit(['status', '--short'], r).ok ? { ok: !fs.existsSync(path.join(r, '.git', 'rebase-merge')), out: p.out } : p;
}

// git pull nhanh khi mở session; lỗi thì bỏ qua (offline...).
export function quickPull(r = root()) {
  if (process.env.KB_NO_PUSH === '1') return { ok: true, out: 'skip' };
  const remote = tryGit(['remote'], r);
  if (!remote.ok || !remote.out) return { ok: true, out: 'no remote' };
  return tryGit(['pull', '--ff-only', '--quiet'], r, { timeout: 8000 });
}
