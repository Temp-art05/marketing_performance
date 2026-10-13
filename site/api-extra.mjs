// API bổ sung cho web: gợi ý (doctor), mốc theo dõi. Gắn vào server.mjs: Object.assign(routes, extraRoutes({ scheduleCommit, readJsonBody })).
// Mỗi route: (searchParams, req) => [status, body].
import { diagnose } from '../scripts/kb/doctor.mjs';
import { addFollowup, completeFollowup, listFollowups, ensureWatchlist } from '../scripts/kb/followups.mjs';
import { recall } from '../scripts/kb/recall.mjs';
import { writeIndex } from '../scripts/kb/lib.mjs';

export function extraRoutes({ scheduleCommit, readJsonBody }) {
  return {
    // { today, followups: {due, upcoming, open}, drafts: [{rel,title,created,age}], issues: [{kind,severity,rel,msg}] }
    'GET /api/suggestions': () => [200, diagnose()],

    'GET /api/followups': () => { ensureWatchlist(); return [200, listFollowups()]; },

    // body: { when: '7d' | 'YYYY-MM-DD', app, text }
    'POST /api/followup': async (q, req) => {
      const { when, app, text } = await readJsonBody(req);
      try {
        const r = addFollowup({ date: when, app: app || 'general', text });
        writeIndex();
        if (!r.duplicate) scheduleCommit(`kb(web): thêm mốc theo dõi — ${String(text).slice(0, 60)}`);
        return [r.duplicate ? 200 : 201, r];
      } catch (e) { return [400, { error: e.message }]; }
    },

    // body: { selector: số thứ tự (1-based, theo mốc đang mở) | từ khoá, note }
    'POST /api/followup/done': async (q, req) => {
      const { selector, note } = await readJsonBody(req);
      try {
        const f = completeFollowup(String(selector), { note });
        writeIndex();
        scheduleCommit(`kb(web): xong mốc — ${f.text.slice(0, 60)}`);
        return [200, f];
      } catch (e) { return [404, { error: e.message }]; }
    },

    // ?q=... → tài liệu liên quan (dùng cho ô "hỏi nhanh" / gợi ý khi soạn)
    'GET /api/recall': (q) => [200, recall(q.get('q') || '')],
  };
}
