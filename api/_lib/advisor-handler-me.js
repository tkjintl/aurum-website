// GET /api/advisor/me — return advisor session or 401
import { ok, unauthorized, methodNotAllowed, getCookie } from './http.js';
import { verifyToken } from './auth.js';
import { getAdvisor } from './deal-storage.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const tok     = getCookie(req, 'aurum_advisor');
  const session = verifyToken(tok);
  if (!session || session.sub !== 'advisor') return unauthorized(res);
  const advisor = await getAdvisor(session.advisorId);
  if (!advisor || advisor.status !== 'active') return unauthorized(res);
  const { password_hash, ...safe } = advisor;
  return ok(res, { ok:true, advisor:safe, email:advisor.email });
}
