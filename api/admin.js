// api/admin.js — consolidated admin router (Hobby plan: 12-function limit)
// Routes all /api/admin/* requests based on URL path segment.

import listHandler         from './_lib/admin-handler-list.js';
import approveHandler      from './_lib/admin-handler-approve.js';
import createAdvisorHandler from './_lib/admin-handler-create-advisor.js';
import dealUpdateHandler   from './_lib/admin-handler-deal-update.js';
import dealsHandler        from './_lib/admin-handler-deals.js';
import updateHandler       from './_lib/admin-handler-update.js';
import ndaReviewHandler    from './_lib/admin-nda-review.js';
import ndaDownloadHandler  from './_lib/admin-nda-download.js';
import ndaArchiveHandler   from './_lib/admin-nda-archive.js';
import { json, getQuery }  from './_lib/http.js';

export default async function handler(req, res) {
  // Extract last path segment: /api/admin/list → 'list'
  const seg = (req.url || '').split('?')[0].replace(/\/+$/, '').split('/').at(-1);
  const q   = getQuery(req);

  switch (seg) {
    case 'list':           return listHandler(req, res);
    case 'approve':        return approveHandler(req, res);
    case 'create-advisor': return createAdvisorHandler(req, res);
    case 'deal-update':    return dealUpdateHandler(req, res);
    case 'deals':          return dealsHandler(req, res);
    case 'update':         return updateHandler(req, res);
    case 'nda': {
      // Existing ?op= dispatcher preserved
      const op = (q.op || '').toLowerCase();
      if (op === 'review')   return ndaReviewHandler(req, res);
      if (op === 'download') return ndaDownloadHandler(req, res);
      if (op === 'archive')  return ndaArchiveHandler(req, res);
      return json(res, 404, { ok: false, error: 'unknown nda op' });
    }
    // Nice-URL aliases (previously via vercel.json rewrites)
    case 'nda-review':   return ndaReviewHandler(req, res);
    case 'nda-download': return ndaDownloadHandler(req, res);
    case 'nda-archive':  return ndaArchiveHandler(req, res);
    default:
      return json(res, 404, { ok: false, error: `unknown admin route: ${seg}` });
  }
}
