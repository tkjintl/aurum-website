import { useEffect } from 'react';
import { initMagneticCards } from '../lib/magnetic';

// ─── Inline flag SVGs for cross-browser rendering ───────────────────────────
const FlagSG = () => (
  <svg width="18" height="12" viewBox="0 0 20 14" style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: 2 }}>
    <rect width="20" height="7" fill="#EF3340" />
    <rect y="7" width="20" height="7" fill="#fff" />
    <circle cx="5" cy="7" r="3" fill="#fff" />
    <circle cx="6.2" cy="7" r="2.3" fill="#EF3340" />
    <g fill="#fff">
      {[[9,4.5],[10.3,5.8],[9.8,7.6],[8.2,7.6],[7.7,5.8]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="0.65" />
      ))}
    </g>
  </svg>
);

export default function ShopSelectorPage({ lang, navigate }) {
  const ko = lang === 'ko';

  useEffect(() => {
    const cleanup = initMagneticCards();
    return cleanup;
  }, []);

  const T = {
    bg: '#0a0a0a',
    panel: '#111008',
    gold: '#C5A572',
    textPrimary: '#f5f0e8',
    textSecondary: '#a8a096',
    textMuted: '#6b655d',
    border: 'rgba(197, 165, 114, 0.2)',
    borderStrong: 'rgba(197, 165, 114, 0.5)',
    serif: "'Cormorant Garamond', 'Noto Serif KR', serif",
    sans: "'Outfit', 'Noto Sans KR', sans-serif",
    mono: "'JetBrains Mono', monospace",
    krDisplay: "'Noto Serif KR', 'Cormorant Garamond', serif",
  };

  return (
    <div style={{ background: T.bg, minHeight: '90vh', padding: '80px 20px 80px' }}>
      {/* Head */}
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '0.28em', color: T.gold, textTransform: 'uppercase', marginBottom: 20 }}>
            매장 · Shop
          </div>
          <h1 style={{ fontFamily: T.krDisplay, fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 500, color: T.textPrimary, lineHeight: 1.2, marginBottom: 14 }}>
            {ko ? '어떻게 시작하시겠습니까' : 'How Would You Like to Begin?'}
          </h1>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 'clamp(16px, 2vw, 22px)', color: T.gold, marginBottom: 22 }}>
            Choose how you begin.
          </div>
          <p style={{ maxWidth: 620, margin: '0 auto', color: T.textSecondary, fontSize: 15, lineHeight: 1.75, fontFamily: T.sans }}>
            {ko
              ? 'Aurum은 두 가지 방식으로 실물 금·은을 제공합니다. 한 번에 구매하는 실물 바·코인 또는 월 20만원부터 시작하는 자동 적립 저축 플랜 (AGP).'
              : 'Aurum offers two ways to own physical gold and silver. A one-time purchase of allocated bars and coins, or an automated monthly accumulation plan starting from KRW 200,000.'}
          </p>
        </div>

        {/* Two-card selector grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 24 }}>

          {/* Card 1 — 실물 금·은 매매 */}
          <div
            className="magnetic-card"
            onClick={() => navigate('shop-physical')}
            style={{
              background: 'linear-gradient(180deg, #111008 0%, #0a0a0a 100%)',
              border: `1px solid ${T.border}`,
              borderRadius: 0,
              padding: '48px 40px 40px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
          >
            {/* Icon */}
            <div style={{
              width: 72, height: 72,
              border: `1px solid ${T.borderStrong}`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 32,
              fontFamily: T.serif,
              fontSize: 22, fontWeight: 500,
              color: T.gold,
              lineHeight: 1.05,
              letterSpacing: '0.08em',
            }}>
              <span>AU</span>
              <span>AG</span>
            </div>

            <h2 style={{ fontFamily: T.krDisplay, fontSize: 30, fontWeight: 600, color: T.textPrimary, marginBottom: 6, lineHeight: 1.25 }}>
              실물 금·은 매매
            </h2>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.gold, fontWeight: 400, marginBottom: 24 }}>
              Physical Gold &amp; Silver — Direct Purchase
            </div>
            <p style={{ color: T.textSecondary, fontSize: 14.5, lineHeight: 1.75, marginBottom: 28, fontFamily: T.sans }}>
              {ko
                ? 'LBMA 승인 골드·실버 바, sovereign-issued 코인을 일회성으로 구매합니다. 국제 현물가 + 투명한 프리미엄으로 고객님 명의 금고에 즉시 배분 보관됩니다.'
                : 'One-time purchase of LBMA-approved gold and silver bars, and sovereign-issued coins. Allocated directly to your vault at international spot price plus a transparent premium.'}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { ko: '1 oz ~ 1 kg 바 · 1/2 oz 코인', en: 'Bars from 1 oz to 1kg · Coins from 1/2 oz' },
                { ko: '한 번의 결제 · 영구 보관', en: 'One-time purchase, permanent allocation' },
                { ko: '유선·카드·암호화폐 결제 지원', en: 'Wire, card, and crypto supported' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 12, borderBottom: i < 2 ? '1px dashed rgba(197, 165, 114, 0.15)' : 'none', fontSize: 14, color: T.textPrimary, fontFamily: T.sans }}>
                  <span style={{ color: T.gold, fontFamily: T.mono, flexShrink: 0 }}>—</span>
                  <div>
                    <div>{item.ko}</div>
                    <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted, fontSize: 13, marginTop: 2 }}>{item.en}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 'auto', borderTop: `1px solid ${T.border}`, paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 12, letterSpacing: '0.15em', color: T.gold, textTransform: 'uppercase' }}>
              <span>제품 둘러보기 · Browse Products</span>
              <span style={{ transition: 'transform 0.3s' }}>→</span>
            </div>
          </div>

          {/* Card 2 — AGP 아름 골드 플랜 (featured) */}
          <div
            className="magnetic-card"
            onClick={() => navigate('agp-intro')}
            style={{
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(197, 165, 114, 0.04) 0%, #0a0a0a 100%)',
              border: `1px solid rgba(197, 165, 114, 0.35)`,
              borderRadius: 0,
              padding: '48px 40px 40px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
          >
            {/* Featured tag */}
            <div style={{
              position: 'absolute', top: 24, right: 24,
              fontFamily: T.mono, fontSize: 10, letterSpacing: '0.15em',
              color: T.gold, padding: '5px 10px',
              border: `1px solid ${T.borderStrong}`,
              textTransform: 'uppercase',
            }}>
              Featured · 추천
            </div>

            {/* Icon */}
            <div style={{
              width: 72, height: 72,
              border: `1px solid ${T.borderStrong}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 32,
              fontFamily: T.serif,
              fontSize: 24, fontWeight: 500,
              color: T.gold,
              letterSpacing: '0.06em',
            }}>
              AGP
            </div>

            <h2 style={{ fontFamily: T.krDisplay, fontSize: 30, fontWeight: 600, color: T.textPrimary, marginBottom: 6, lineHeight: 1.25 }}>
              아름 골드 플랜
            </h2>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.gold, fontWeight: 400, marginBottom: 24 }}>
              Aurum Gold Plan — Automated Accumulation
            </div>
            <p style={{ color: T.textSecondary, fontSize: 14.5, lineHeight: 1.75, marginBottom: 28, fontFamily: T.sans }}>
              {ko
                ? '월 20만원부터 시작하는 그램 단위 자동 적립. 토스뱅크 자동이체, 신용카드, 암호화폐로 입금하고 100g 도달 시 실물 바로 무료 전환합니다.'
                : 'Automated gram accumulation starting from KRW 200,000/month. Fund via Toss Bank auto-debit, credit card, or crypto — convert free to a physical bar at 100g.'}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { ko: '월 200,000원부터 시작', en: 'Start from KRW 200,000 / month' },
                { ko: '매일·매주·매월 자동 적립', en: 'Daily, weekly, or monthly auto-debit' },
                { ko: '100g 도달 시 실물 바 무료 전환', en: 'Free conversion to physical at 100g' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 12, borderBottom: i < 2 ? '1px dashed rgba(197, 165, 114, 0.15)' : 'none', fontSize: 14, color: T.textPrimary, fontFamily: T.sans }}>
                  <span style={{ color: T.gold, fontFamily: T.mono, flexShrink: 0 }}>—</span>
                  <div>
                    <div>{item.ko}</div>
                    <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted, fontSize: 13, marginTop: 2 }}>{item.en}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 'auto', borderTop: `1px solid rgba(197, 165, 114, 0.3)`, paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 12, letterSpacing: '0.15em', color: T.gold, textTransform: 'uppercase' }}>
              <span>AGP 시작하기 · Begin Enrollment</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: T.textMuted, fontFamily: T.sans, lineHeight: 1.7 }}>
          {ko
            ? '모든 귀금속은 싱가포르 Malca-Amit FTZ에 완전 배분 보관됩니다. Lloyd\'s of London 보험 적용.'
            : 'All precious metals are fully allocated at Malca-Amit Singapore FTZ. Insured by Lloyd\'s of London.'}
          &nbsp;<FlagSG />
        </p>
      </div>
    </div>
  );
}
