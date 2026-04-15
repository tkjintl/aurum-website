// api/prices.js — Vercel Serverless Function
// Fetches live gold, silver, platinum from Yahoo Finance + KRW from er-api
// No API key needed. Edge-cached 5 min.
//
// DROP THIS AT: api/prices.js (project root, NEW folder + file)

const SYMBOLS = { gold: 'GC=F', silver: 'SI=F', platinum: 'PL=F' };
const FALLBACK = { gold: 4850, silver: 80, platinum: 2130, krw: 1470 };

async function fetchYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AurumKorea/1.0)' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Yahoo ${symbol}: HTTP ${res.status}`);
  const data = await res.json();
  if (data.chart.error) throw new Error(data.chart.error.description);
  const meta = data.chart.result[0].meta;
  return {
    price: meta.regularMarketPrice,
    prevClose: meta.chartPreviousClose || null,
  };
}

async function fetchKRW() {
  const res = await fetch('https://open.er-api.com/v6/latest/USD', {
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error('er-api: HTTP ' + res.status);
  const data = await res.json();
  if (!data.rates?.KRW) throw new Error('KRW rate missing');
  return data.rates.KRW;
}

export default async function handler(req, res) {
  // CORS — allow browser fetch from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(204).end();

  // Edge cache: 5 min fresh, serve stale up to 10 min while revalidating
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  try {
    const [gd, sv, pt, krw] = await Promise.allSettled([
      fetchYahoo(SYMBOLS.gold),
      fetchYahoo(SYMBOLS.silver),
      fetchYahoo(SYMBOLS.platinum),
      fetchKRW(),
    ]);

    const prices = {
      gold:     gd.status === 'fulfilled' ? gd.value.price : FALLBACK.gold,
      silver:   sv.status === 'fulfilled' ? sv.value.price : FALLBACK.silver,
      platinum: pt.status === 'fulfilled' ? pt.value.price : FALLBACK.platinum,
    };

    // Day-over-day % change from previous close
    const changes = {};
    for (const [metal, result] of [['gold', gd], ['silver', sv], ['platinum', pt]]) {
      if (result.status === 'fulfilled' && result.value.prevClose) {
        const { price, prevClose } = result.value;
        changes[metal] = ((price - prevClose) / prevClose * 100).toFixed(2);
      }
    }

    const krwRate = krw.status === 'fulfilled' ? krw.value : FALLBACK.krw;

    // Track which sources succeeded for debugging
    const sources = {
      gold:     gd.status === 'fulfilled' ? 'yahoo' : 'fallback',
      silver:   sv.status === 'fulfilled' ? 'yahoo' : 'fallback',
      platinum: pt.status === 'fulfilled' ? 'yahoo' : 'fallback',
      krw:      krw.status === 'fulfilled' ? 'er-api' : 'fallback',
    };

    return res.status(200).json({ prices, changes, krwRate, ts: Date.now(), sources });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      prices: { gold: FALLBACK.gold, silver: FALLBACK.silver, platinum: FALLBACK.platinum },
      changes: {},
      krwRate: FALLBACK.krw,
      ts: Date.now(),
      sources: { gold: 'fallback', silver: 'fallback', platinum: 'fallback', krw: 'fallback' },
    });
  }
}
