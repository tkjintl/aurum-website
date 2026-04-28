// api/advisor.js — consolidated advisor router (Hobby plan: 12-function limit)
// Routes all /api/advisor/* requests based on URL path segment.

import loginHandler  from './_lib/advisor-handler-login.js';
import logoutHandler from './_lib/advisor-handler-logout.js';
import dealsHandler  from './_lib/advisor-handler-deals.js';
import meHandler     from './_lib/advisor-handler-me.js';
import { json }      from './_lib/http.js';

export default async function handler(req, res) {
  const seg = (req.url || '').split('?')[0].replace(/\/+$/, '').split('/').at(-1);

  switch (seg) {
    case 'login':  return loginHandler(req, res);
    case 'logout': return logoutHandler(req, res);
    case 'deals':  return dealsHandler(req, res);
    case 'me':     return meHandler(req, res);
    default:
      return json(res, 404, { ok: false, error: `unknown advisor route: ${seg}` });
  }
}
