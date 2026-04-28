// Deal + Advisor storage — same Upstash Redis as storage.js
import { Redis } from '@upstash/redis';

function getRedis() {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    if (!global.__devStore) global.__devStore = {};
    const s = global.__devStore;
    return { async get(k){return s[k]??null;}, async set(k,v){s[k]=v;return'OK';} };
  }
  return new Redis({ url, token });
}
const redis = getRedis();

function parse(v) {
  if (!v) return null;
  if (typeof v === 'string') { try { return JSON.parse(v); } catch { return v; } }
  return v;
}

// ── Deals ──────────────────────────────────────────────────────────────────
export async function getDeal(id) {
  return parse(await redis.get('deal:' + id));
}
export async function saveDeal(deal) {
  await redis.set('deal:' + deal.id, JSON.stringify(deal));
  const ids = parse(await redis.get('deals:all')) || [];
  if (!ids.includes(deal.id)) { ids.unshift(deal.id); await redis.set('deals:all', JSON.stringify(ids)); }
}
export async function listDeals() {
  const ids = parse(await redis.get('deals:all')) || [];
  const deals = await Promise.all(ids.map(id => getDeal(id)));
  return deals.filter(Boolean).sort((a,b) => (b.created_at||0)-(a.created_at||0));
}
export async function nextDealId() {
  const d = new Date();
  const prefix = 'DL-' + String(d.getFullYear()).slice(2) + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0') + '-';
  const ids = parse(await redis.get('deals:all')) || [];
  const seq = String(ids.filter(i=>i.startsWith(prefix)).length + 1).padStart(4,'0');
  return prefix + seq;
}

// ── Advisors ──────────────────────────────────────────────────────────────
export async function getAdvisor(id) {
  return parse(await redis.get('advisor:' + id));
}
export async function getAdvisorByEmail(email) {
  const id = parse(await redis.get('advisor_email:' + email.trim().toLowerCase()));
  return id ? getAdvisor(id) : null;
}
export async function saveAdvisor(advisor) {
  await redis.set('advisor:' + advisor.id, JSON.stringify(advisor));
  await redis.set('advisor_email:' + advisor.email.trim().toLowerCase(), advisor.id);
  const ids = parse(await redis.get('advisors:all')) || [];
  if (!ids.includes(advisor.id)) { ids.push(advisor.id); await redis.set('advisors:all', JSON.stringify(ids)); }
}
export async function listAdvisors() {
  const ids = parse(await redis.get('advisors:all')) || [];
  const advisors = await Promise.all(ids.map(id => getAdvisor(id)));
  return advisors.filter(Boolean);
}
