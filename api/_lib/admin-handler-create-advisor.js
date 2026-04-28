// POST /api/admin/create-advisor — create a GP advisor account
// GET  /api/admin/create-advisor — list all advisors
import { ok, bad, unauthorized, methodNotAllowed, readBody, getCookie } from './http.js';
import { verifyToken, signToken } from './auth.js';
import { saveAdvisor, listAdvisors, getAdvisorByEmail } from './deal-storage.js';
import { sendRaw } from './email.js';
import crypto from 'crypto';

function hashPass(password) {
  const secret = process.env.AURUM_SECRET || 'dev-secret';
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

export default async function handler(req, res) {
  const tok = getCookie(req, 'aurum_admin');
  const session = verifyToken(tok);
  if (!session || session.sub !== 'admin') return unauthorized(res);
  const actor = (session.email||'').split('@')[0]||'partner';

  if (req.method === 'GET') {
    const advisors = await listAdvisors();
    // Never return password hashes
    return ok(res, { advisors: advisors.map(({password_hash,...a})=>a) });
  }

  if (req.method === 'POST') {
    const body     = await readBody(req);
    const email    = String(body.email||'').trim().toLowerCase();
    const name     = String(body.name||'').trim().slice(0,200);
    const firm     = String(body.firm||'').trim().slice(0,200);
    const password = String(body.password||'').trim();

    if (!email || !name || !firm || !password)
      return bad(res,'email, name, firm and password required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return bad(res,'invalid email');
    if (password.length < 8)
      return bad(res,'password must be at least 8 characters');

    const existing = await getAdvisorByEmail(email);
    if (existing) return bad(res,'an advisor with this email already exists');

    const now = Date.now();
    const id  = 'adv_' + now.toString(36) + Math.random().toString(36).slice(2,6);
    const advisor = {
      id, email, name, firm,
      password_hash: hashPass(password),
      status:       'active',
      created_at:   now,
      created_by:   session.email||actor,
      specialisations: body.specialisations||[],
    };
    await saveAdvisor(advisor);

    // Email credentials to advisor
    const siteUrl = process.env.SITE_URL || 'https://theaurumcc.com';
    try {
      await sendRaw({
        to: email,
        subject: 'Your Aurum GP Advisor Portal access',
        html: `<p>Dear ${name},</p>
<p>Your advisor account has been created for the Aurum Century Club GP portal.</p>
<p><strong>Login URL:</strong> <a href="${siteUrl}/advisor">${siteUrl}/advisor</a><br>
<strong>Email:</strong> ${email}<br>
<strong>Password:</strong> ${password}</p>
<p>Please change your password after first login.</p>
<p style="font-family:monospace;font-size:11px;color:#888">Confidential · Qualified investors only</p>`,
        text: `Aurum GP Portal access\nURL: ${siteUrl}/advisor\nEmail: ${email}\nPassword: ${password}`,
      });
    } catch {}

    const {password_hash, ...safeAdvisor} = advisor;
    return ok(res, { ok:true, advisor:safeAdvisor });
  }

  return methodNotAllowed(res, ['GET','POST']);
}
