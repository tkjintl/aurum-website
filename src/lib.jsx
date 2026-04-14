import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// API SERVICE LAYER — stubbed. Replace with live SDK calls.
// ═══════════════════════════════════════════════════════════════════════════════
const _delay = (ms) => new Promise((r) => setTimeout(r, ms));
const _genOrderId = () =>
  "AK-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 900000) + 100000);

const API = {
  auth: {
    login: async (email) => {
      await _delay(900);
      return { id: "usr_" + Date.now(), email, name: email.split("@")[0], phone: "", kycStatus: "unverified", createdAt: new Date().toISOString() };
    },
    register: async (data) => {
      await _delay(1100);
      return { id: "usr_" + Date.now(), ...data, kycStatus: "unverified", createdAt: new Date().toISOString() };
    },
  },
  payments: {
    toss: async (_order) => { await _delay(1600); return { success: true, paymentKey: "toss_" + Date.now() }; },
    kakao: async (_order) => { await _delay(1600); return { success: true, tid: "kakao_" + Date.now() }; },
    wire: async (order) => {
      await _delay(500);
      return {
        success: true,
        bankDetails: {
          bank: "DBS Bank Singapore",
          accountName: "Aurum Korea Pte Ltd",
          accountNo: "003-938871-01-0",
          swift: "DBSSSGSG",
          reference: order.id,
          currency: "USD",
          amount: order.total,
        },
      };
    },
    card: async (_order) => { await _delay(1600); return { success: true, chargeId: "ch_" + Date.now() }; },
  },
  orders: {
    create: async (_data) => { await _delay(200); return { id: _genOrderId() }; },
  },
  vault: {
    getHoldings: async () => { await _delay(300); return MOCK_HOLDINGS; },
    generateCertificate: async () => { await _delay(1200); return { url: "#cert-stub" }; },
    requestSell: async (holdingIds) => { await _delay(700); return { requestId: "SELL-" + Date.now(), holdingIds }; },
    requestWithdraw: async (holdingIds, address) => { await _delay(700); return { requestId: "WD-" + Date.now(), holdingIds, address }; },
  },
  kyc: {
    submit: async (_data) => { await _delay(1200); return { submissionId: "KYC-" + Date.now(), status: "in_review" }; },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MARKET FACTS — Last verified April 2026
// ═══════════════════════════════════════════════════════════════════════════════
const MARKET_FACTS = {
  goldATH: 5608.35,
  goldATHLabel: "역대 최고가 (2026년 1월)",
  totalMinedTonnes: 219890,
  centralBanksWithGold: 80,
  tenYearReturn: "+280%",
  cbBuying2023: "1,037t",
  silverDeficitOz: "~200M oz",
  silverDeficitYears: 6,
  silverIndustrialPct: "60%+",
  lastVerified: "2026-04-11",
};

const FALLBACK_PRICES = { gold: 4750.00, silver: 32.15, platinum: 1020.00 };
const FALLBACK_KRW = 1395.00;

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — shared across all page components
// ═══════════════════════════════════════════════════════════════════════════════
const T = {
  bg: "#0a0a0a",
  panel: "#111008",
  panelAlt: "#0d0b08",
  border: "#1a1510",
  borderStrong: "#2a2318",
  accent: "#C5A572",
  accentDark: "#8a6914",
  textPrimary: "#f5f0e8",
  textSecondary: "#8a7d6b",
  textMuted: "#6b6b6b",
  green: "#4ade80",
  red: "#f87171",
  serif: "'Cormorant Garamond',serif",
  sans: "'Outfit',sans-serif",
  mono: "'JetBrains Mono',monospace",
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS — bilingual descriptions
// ═══════════════════════════════════════════════════════════════════════════════
const PRODUCTS = [
  { id: 1, name: "1oz Gold Bar — PAMP Suisse", nameKo: "1온스 금바 — PAMP 스위스", metal: "gold", type: "bar", weight: "1 oz", weightOz: 1, purity: "99.99%", mint: "PAMP Suisse", premium: 0.035, image: "🥇", inStock: true, descKo: "세계에서 가장 인지도 높은 금바. LBMA 인증 PAMP Suisse 제조. Lady Fortuna 디자인.", descEn: "One of the world's most recognized gold bars. LBMA-certified PAMP Suisse manufacture with the signature Lady Fortuna design." },
  { id: 2, name: "1kg Gold Bar — Heraeus", nameKo: "1kg 금바 — 헤레우스", metal: "gold", type: "bar", weight: "1 kg", weightOz: 32.1507, purity: "99.99%", mint: "Heraeus", premium: 0.025, image: "🥇", inStock: true, descKo: "기관 및 고액 투자자 선호. 최저 프리미엄으로 최대 효율. 독일 헤레우스 제조.", descEn: "Preferred by institutional and high-net-worth investors. Lowest premium, maximum efficiency. Manufactured by Heraeus in Germany." },
  { id: 3, name: "1oz Gold Maple Leaf", nameKo: "1온스 골드 메이플리프", metal: "gold", type: "coin", weight: "1 oz", weightOz: 1, purity: "99.99%", mint: "Royal Canadian Mint", premium: 0.045, image: "🪙", inStock: true, descKo: "캐나다 왕립 조폐국 발행. 세계적으로 가장 많이 거래되는 금화 중 하나.", descEn: "Issued by the Royal Canadian Mint. One of the most widely traded gold coins in the world." },
  { id: 4, name: "1oz Gold Krugerrand", nameKo: "1온스 골드 크루거랜드", metal: "gold", type: "coin", weight: "1 oz", weightOz: 1, purity: "91.67%", mint: "South African Mint", premium: 0.04, image: "🪙", inStock: true, descKo: "세계 최초 투자용 금화(1967년 발행). 남아프리카 공화국 조폐국 제조.", descEn: "The world's first investment-grade gold coin (first minted 1967). Manufactured by the South African Mint." },
  { id: 5, name: "100oz Silver Bar — PAMP", nameKo: "100온스 은바 — PAMP", metal: "silver", type: "bar", weight: "100 oz", weightOz: 100, purity: "99.99%", mint: "PAMP Suisse", premium: 0.04, image: "🥈", inStock: true, descKo: "대규모 은 투자에 최적. PAMP 스위스 제조, LBMA 인증 순은 바.", descEn: "Ideal for large-scale silver holdings. PAMP Suisse manufacture, LBMA-certified fine silver." },
  { id: 6, name: "1oz Silver Maple Leaf", nameKo: "1온스 실버 메이플리프", metal: "silver", type: "coin", weight: "1 oz", weightOz: 1, purity: "99.99%", mint: "Royal Canadian Mint", premium: 0.06, image: "🥈", inStock: true, descKo: "캐나다 왕립 조폐국 발행 순은 동전. 컬렉터와 투자자 모두 선호.", descEn: "Fine silver coin issued by the Royal Canadian Mint. Preferred by both collectors and investors." },
  { id: 7, name: "1kg Silver Bar — Heraeus", nameKo: "1kg 은바 — 헤레우스", metal: "silver", type: "bar", weight: "1 kg", weightOz: 32.1507, purity: "99.99%", mint: "Heraeus", premium: 0.035, image: "🥈", inStock: true, descKo: "독일 헤레우스 제조 순은 바. 산업용·투자 수요 모두 높은 표준 규격.", descEn: "Fine silver bar manufactured by Heraeus in Germany. Standard size serving both industrial and investment demand." },
  { id: 8, name: "10oz Gold Bar — Valcambi", nameKo: "10온스 금바 — 발캄비", metal: "gold", type: "bar", weight: "10 oz", weightOz: 10, purity: "99.99%", mint: "Valcambi", premium: 0.028, image: "🥇", inStock: true, descKo: "스위스 발캄비 제조 10온스 금바. 개인 고액 투자자에게 적합한 크기.", descEn: "10oz gold bar manufactured by Valcambi in Switzerland. A size well suited to high-net-worth private investors." },
];

const MOCK_HOLDINGS = [
  { id: 1, product: "1oz Gold Bar — PAMP Suisse", nameKo: "1온스 금바 — PAMP 스위스", serial: "PAMP-2026-44891", purchasePrice: 4892.50, purchaseDate: "2026-03-15", weightOz: 1, metal: "gold", vault: "Singapore — Malca-Amit FTZ", zone: "Zone A, Bay 204", image: "🥇", assayCert: true, insurance: "Lloyd's of London" },
  { id: 2, product: "100oz Silver Bar — PAMP", nameKo: "100온스 은바 — PAMP", serial: "PAMP-AG-77234", purchasePrice: 2920.00, purchaseDate: "2026-03-20", weightOz: 100, metal: "silver", vault: "Singapore — Malca-Amit FTZ", zone: "Zone B, Bay 118", image: "🥈", assayCert: true, insurance: "Lloyd's of London" },
  { id: 3, product: "1oz Gold Maple Leaf", nameKo: "1온스 골드 메이플리프", serial: "RCM-ML-88123", purchasePrice: 4945.20, purchaseDate: "2026-04-01", weightOz: 1, metal: "gold", vault: "Singapore — Malca-Amit FTZ", zone: "Zone A, Bay 204", image: "🪙", assayCert: true, insurance: "Lloyd's of London" },
];

const MOCK_ORDERS_INIT = [
  { id: "AK-2026-001847", date: "2026-04-01T14:30:00Z", status: "vaulted", items: [{ nameKo: "1온스 골드 메이플리프", name: "1oz Gold Maple Leaf", qty: 1, unitPrice: 4945.20, metal: "gold", image: "🪙" }], subtotal: 4945.20, total: 4945.20, paymentMethod: "toss", storageOption: "singapore" },
  { id: "AK-2026-001612", date: "2026-03-20T09:15:00Z", status: "vaulted", items: [{ nameKo: "100온스 은바 — PAMP", name: "100oz Silver Bar — PAMP", qty: 1, unitPrice: 2920.00, metal: "silver", image: "🥈" }], subtotal: 2920.00, total: 2920.00, paymentMethod: "wire", storageOption: "singapore" },
  { id: "AK-2026-001344", date: "2026-03-15T11:45:00Z", status: "vaulted", items: [{ nameKo: "1온스 금바 — PAMP 스위스", name: "1oz Gold Bar — PAMP Suisse", qty: 2, unitPrice: 4892.50, metal: "gold", image: "🥇" }], subtotal: 9785.00, total: 9785.00, paymentMethod: "toss", storageOption: "singapore" },
];

const AUDIT_TRAIL_INIT = [
  { date: "2026-04-01", event: "보관 배정", detail: "1온스 골드 메이플리프 → Malca-Amit SG FTZ (Zone A, Bay 204)", type: "vault" },
  { date: "2026-04-01", event: "결제 완료", detail: "주문 AK-2026-001847 · TossPay · $4,945.20", type: "payment" },
  { date: "2026-03-20", event: "보관 배정", detail: "100온스 은바 PAMP → Malca-Amit SG FTZ (Zone B, Bay 118)", type: "vault" },
  { date: "2026-03-20", event: "결제 완료", detail: "주문 AK-2026-001612 · Wire Transfer · $2,920.00", type: "payment" },
  { date: "2026-03-15", event: "보관 배정", detail: "1온스 금바 PAMP (×2) → Malca-Amit SG FTZ (Zone A, Bay 191)", type: "vault" },
  { date: "2026-03-15", event: "결제 완료", detail: "주문 AK-2026-001344 · TossPay · $9,785.00", type: "payment" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// WHY GOLD — bilingual (bodyKo/bodyEn), HNW tone
// ═══════════════════════════════════════════════════════════════════════════════
const WHY_GOLD_REASONS = [
  {
    icon: "🛡️", titleKo: "인플레이션과 구매력 방어", titleEn: "Inflation & Purchasing Power",
    bodyKo: "금은 수천 년간 구매력을 보존해온 유일한 자산입니다. 법정화폐의 장기 실질 가치는 우하향해 왔으며, 금은 이 흐름에 대한 가장 검증된 방어 수단입니다. 한국의 CPI가 구조적으로 상승하는 구간에서 금은 원화 자산의 실질 가치를 보호합니다.",
    bodyEn: "Gold is the only asset that has preserved purchasing power across millennia. Fiat currencies have trended lower in real terms over the long run; gold is the most tested defence against that drift. As structural CPI pressure persists in Korea, gold protects the real value of a KRW-denominated portfolio.",
    stat: MARKET_FACTS.tenYearReturn, statLabelKo: "최근 10년 금 수익률 (USD 기준)", statLabelEn: "10-year gold return (USD)"
  },
  {
    icon: "🌍", titleKo: "지정학적 안전 자산", titleEn: "Geopolitical Safe Haven",
    bodyKo: "전쟁, 금융위기, 제재, 통화 충돌이 발생할 때마다 자본은 금으로 이동합니다. 2008 금융위기, 2020 팬데믹, 2022~2024 지정학 리스크 국면 모두에서 금이 우상향한 것은 우연이 아닙니다. 금은 어느 국가의 대차대조표에도 속하지 않습니다.",
    bodyEn: "Capital rotates into gold whenever war, financial crisis, sanctions, or currency conflict emerges. The 2008 crisis, 2020 pandemic, and 2022–2024 geopolitical stress each lifted gold — no coincidence. Gold sits on no government's balance sheet and inside no counterparty's promise.",
    stat: "$5,608", statLabelKo: "역대 최고가 (2026년 1월, USD/oz)", statLabelEn: "All-time high (Jan 2026, USD/oz)"
  },
  {
    icon: "⚖️", titleKo: "포트폴리오 분산 효과", titleEn: "Portfolio Diversification",
    bodyKo: "금은 주식·채권과 낮은 상관관계를 가집니다. Morgan Stanley를 비롯한 주요 기관은 전통적 60/40 포트폴리오에 금을 5~15% 편입할 것을 권고하며, 이는 장기 변동성은 낮추면서 위험조정 수익률을 개선합니다.",
    bodyEn: "Gold exhibits low correlation with equities and bonds. Major institutions — including Morgan Stanley — now recommend a 5–15% allocation on top of the classic 60/40 portfolio, reducing long-run volatility while improving risk-adjusted returns.",
    stat: "-0.02", statLabelKo: "S&P 500과의 상관계수 (장기 평균)", statLabelEn: "Correlation vs S&P 500 (long-run)"
  },
  {
    icon: "🏛️", titleKo: "중앙은행의 선택", titleEn: "Central Bank Choice",
    bodyKo: "한국은행을 포함한 약 80개 중앙은행이 외환보유액의 일부를 금으로 보유합니다. 중앙은행들은 2022년 이후 매년 1,000톤 이상 금을 순매입하며, 이는 기록적인 규모입니다. 이는 세계 재정 당국이 장기적으로 금을 어떻게 평가하는지에 대한 강력한 시그널입니다.",
    bodyEn: "Roughly 80 central banks — including the Bank of Korea — hold gold as part of their reserves. Central banks have net-purchased more than 1,000 tonnes a year since 2022, a record pace. That is a strong signal of how the world's fiscal authorities value gold on a multi-decade horizon.",
    stat: MARKET_FACTS.cbBuying2023, statLabelKo: "2023년 중앙은행 금 순매입량", statLabelEn: "2023 central bank net purchases"
  },
  {
    icon: "💎", titleKo: "희소성과 무기명 내재 가치", titleEn: "Scarcity & Bearer Value",
    bodyKo: "역사상 채광된 모든 금은 올림픽 수영장 약 3.5개 분량에 불과합니다. 신규 채광은 제한적이고, 금은 부식되거나 소멸되지 않습니다. 일련번호와 소유권 증서만 있으면 금은 세대에 걸쳐 이전 가능한 무기명 자산입니다.",
    bodyEn: "All the gold ever mined fits into roughly 3.5 Olympic swimming pools. New mining is limited, and gold does not corrode or degrade. With a serial number and a certificate of title, gold is a bearer asset that transfers cleanly across generations.",
    stat: "~220천t", statLabelKo: "역대 총 채광량 추정 (WGC 2024)", statLabelEn: "Total mined to date (WGC 2024)"
  },
  {
    icon: "🏦", titleKo: "원화 및 국내 정책 리스크 헤지", titleEn: "KRW & Domestic Policy Hedge",
    bodyKo: "원화가 약세를 보일 때 달러 기준 금의 원화 가치는 상승합니다. 미국 금리 정책, 글로벌 리스크-오프, 한국 고유의 정책·과세·압수 리스크에 대한 자연 헤지로 기능하며, 해외 보관은 도피가 아니라 지리적 분산입니다.",
    bodyEn: "When the won weakens, USD-denominated gold rises in KRW terms. Gold is a natural hedge against US rate policy, global risk-off episodes, and Korea-specific policy, tax, and seizure risk. Offshore storage is not escape — it is geographic diversification.",
    stat: null, statLabelKo: null, statLabelEn: null
  },
];

const WHY_GOLD_STATS = [
  { value: "5,000+", labelKo: "년의 가치 저장 역사", labelEn: "years as a store of value" },
  { value: `약 ${MARKET_FACTS.centralBanksWithGold}개국`, labelKo: "중앙은행 금 보유", labelEn: "central banks hold gold" },
  { value: "0%", labelKo: "발행자 리스크 (무기명 실물 자산)", labelEn: "issuer risk (bearer asset)" },
  { value: "99.99%", labelKo: "순도 보장 (Malca-Amit 보관)", labelEn: "purity (Malca-Amit vaulted)" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// WHY SILVER — NEW. Structural deficit, industrial demand, China, Korean shortage.
// ═══════════════════════════════════════════════════════════════════════════════
const WHY_SILVER_REASONS = [
  {
    icon: "⚙️", titleKo: "구조적 공급 부족", titleEn: "Structural Supply Deficit",
    bodyKo: "세계 은 시장은 2026년 기준 6년 연속 구조적 공급 부족 상태입니다. Silver Institute는 2026년 부족분이 약 2억 온스에 달할 것으로 전망하며, 일부 애널리스트는 그보다 큰 규모를 예측합니다. 이는 단기 수급 불일치가 아니라 장기 공급 구조의 문제입니다.",
    bodyEn: "The global silver market is entering its sixth consecutive year of structural deficit in 2026. The Silver Institute projects the 2026 shortfall at roughly 200 million ounces — and some analysts forecast materially larger gaps. This is not a short-term supply-demand mismatch; it is a long-term structural problem.",
    stat: "6 years", statLabelKo: "연속 공급 부족", statLabelEn: "consecutive deficit years"
  },
  {
    icon: "☀️", titleKo: "폭발하는 산업 수요", titleEn: "Explosive Industrial Demand",
    bodyKo: "세계 은 수요의 60% 이상이 산업용입니다 — 태양광 패널, 전기차, 5G/6G 전자, AI 데이터센터, 의료기기, 방위 시스템. 이 수요는 경기 민감형이 아니라 구조적이며 가속화되고 있습니다. 태양광 한 패널에 약 20g의 은이 필요합니다.",
    bodyEn: "More than 60% of global silver demand is industrial — solar panels, electric vehicles, 5G/6G electronics, AI data centres, medical devices, and defence systems. This demand is not cyclical; it is structural and accelerating. A single solar panel contains roughly 20g of silver.",
    stat: "60%+", statLabelKo: "산업용 수요 비중", statLabelEn: "industrial demand share"
  },
  {
    icon: "🇨🇳", titleKo: "중국 수출 규제의 충격", titleEn: "China Export-Control Shock",
    bodyKo: "세계 최대 은 정련국인 중국은 2026년 1월 은에 대한 엄격한 수출 라이선스 규제를 도입했습니다. 이로 인해 글로벌 가용 공급이 급격히 축소되었고, 아시아 실물 은 프리미엄은 국제 현물가 대비 큰 폭으로 확대되었습니다.",
    bodyEn: "China — the world's largest silver refiner — introduced strict export-licensing controls on silver in January 2026, sharply reducing globally available supply. Asian physical silver premiums have since widened materially over international spot.",
    stat: "Jan 2026", statLabelKo: "중국 수출 규제 시행", statLabelEn: "export controls enacted"
  },
  {
    icon: "🇰🇷", titleKo: "한국 내 실물 은 부족", titleEn: "Korean Physical Silver Shortage",
    bodyKo: "한국에서 실물 은 접근성은 금보다 훨씬 제한적입니다. KRX에는 실질적인 은 현물 시장이 없으며, 한국 은행들은 반복적으로 은 바 판매를 중단해왔습니다. 국내 실물 은은 국제 현물 대비 상당한 실물 프리미엄에 거래되는 경우가 빈번합니다.",
    bodyEn: "Access to physical silver is materially more constrained in Korea than access to gold. The KRX has no equivalent silver spot market, and Korean banks have repeatedly suspended silver-bar sales due to chronic shortages. Domestic physical silver often trades at a substantial premium over international spot.",
    stat: null, statLabelKo: null, statLabelEn: null
  },
  {
    icon: "📏", titleKo: "금·은 비율의 장기 평균 회귀", titleEn: "Gold-Silver Ratio Mean Reversion",
    bodyKo: "역사적 금·은 가격 비율은 평균 약 60:1입니다. 2026년 현재 이 비율은 구조적으로 그보다 높은 구간에 머물러 있으며, 역사적으로 이런 구간 이후 은은 금을 크게 아웃퍼폼하는 경향을 보여 왔습니다. 포트폴리오 관점에서 이는 비대칭 기회입니다.",
    bodyEn: "The historical gold-silver price ratio averages around 60:1. As of 2026 the ratio sits structurally above that average, and historically silver has tended to outperform gold significantly as the ratio mean-reverts. From a portfolio perspective this is an asymmetric opportunity.",
    stat: "60:1", statLabelKo: "장기 평균 금·은 비율", statLabelEn: "long-run avg. gold-silver ratio"
  },
  {
    icon: "👑", titleKo: "화폐성 + 산업성의 이중 역할", titleEn: "Monetary + Industrial Dual Role",
    bodyKo: "은은 금과 동일한 화폐성 보호 기능을 가지면서, 동시에 실물 경제의 전동화·디지털화로부터 직접적인 산업적 upside를 포착합니다. 이 이중 역할이 정교한 투자자에게 은을 독특하게 매력적으로 만듭니다.",
    bodyEn: "Silver offers the same monetary-hedge function as gold while simultaneously capturing direct industrial upside from the electrification and digitisation of the real economy. This dual role is what makes silver uniquely attractive to sophisticated investors.",
    stat: null, statLabelKo: null, statLabelEn: null
  },
];

const SILVER_STATS = [
  { value: "~200M oz", labelKo: "2026 공급 부족 전망", labelEn: "2026 projected deficit" },
  { value: "60%+", labelKo: "산업·군사용 수요 비중", labelEn: "industrial & defence demand" },
  { value: "Jan 2026", labelKo: "중국 수출 규제 시행", labelEn: "China export controls" },
  { value: "6 yrs", labelKo: "연속 공급 부족", labelEn: "consecutive deficit" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EDUCATION ARTICLES — bodyKo/bodyEn, bulletsKo/bulletsEn, highlightKo/highlightEn
// 4 new featured articles placed first, then original 6.
// ═══════════════════════════════════════════════════════════════════════════════
const EDUCATION_ARTICLES = [
  {
    id: "paper-vs-physical", emoji: "📜", category: "기초", featured: true,
    titleKo: "종이 금·은 vs. 실물 금·은", titleEn: "Paper vs. Physical — Why the Difference Matters",
    subtitleKo: "은행 통장·KRX 계좌·ETF와 실물 보유의 근본적 차이", subtitleEn: "The fundamental difference between a bank claim and real ownership",
    readTimeKo: "6분", readTimeEn: "6 min",
    sections: [
      {
        headingKo: "대부분의 한국 금·은 상품은 종이입니다", headingEn: "Most Korean gold and silver products are paper",
        bodyKo: "국내 시장에서 가장 흔한 금·은 상품 — 은행 금통장, KRX 금 계좌, 금 ETF, 증권사 펀드 — 은 모두 실제 금속을 당신이 소유하게 만드는 상품이 아닙니다. 당신이 보유하는 것은 금융기관의 대차대조표 상 계약상 청구권입니다.",
        bodyEn: "The most common gold and silver products in Korea — bank passbooks, KRX accounts, gold ETFs, securities-firm funds — are not products that give you ownership of physical metal. What you actually hold is a contractual claim on a financial institution's balance sheet.",
        bulletsKo: [
          "은행 금통장: 은행이 금을 대신 보유한다고 가정. 예금자 보호 미적용. 은행 파산 시 일반 채권자로 취급.",
          "KRX 금 계좌: 한국 내 금 현물 거래. 실물 인출 시 10% VAT 발생. KRX 가격은 국제 현물가에 실물 프리미엄이 더해진 가격.",
          "금 ETF: 거래소 상장 펀드. 편리하지만 발행사·수탁기관 리스크 존재. 실제 금괴에 대한 법적 권리 없음.",
          "증권사 금 펀드: 파생상품·스왑 기반. 실물 보유 비율 낮거나 0%.",
        ],
        bulletsEn: [
          "Bank passbook: the bank claims to hold gold on your behalf. Not covered by depositor protection. In bank insolvency you are a general creditor.",
          "KRX gold account: domestic gold spot trading. Physical withdrawal triggers 10% VAT. KRX pricing includes a Korean physical-premium on top of international spot.",
          "Gold ETF: exchange-listed fund. Convenient, but exposed to issuer and custodian risk. No legal claim on specific bars.",
          "Securities-firm gold fund: derivative and swap based. Low-to-zero physical backing.",
        ],
        highlightKo: "이 모든 상품의 공통점: 당신은 금속을 소유하지 않습니다. 금융기관의 약속을 소유합니다.",
        highlightEn: "The common thread: you do not own the metal. You own a financial institution's promise.",
      },
      {
        headingKo: "실물 금·은은 무엇이 다른가", headingEn: "What's different about physical",
        bodyKo: "Aurum은 전혀 다른 구조를 제공합니다. 당신이 구매하는 금·은은 실제 금속이며, Malca-Amit 싱가포르 FTZ 금고에 고객님 명의로 일련번호가 부여되어 개별 보관됩니다. 어떤 은행의 대차대조표에도 등장하지 않습니다.",
        bodyEn: "Aurum offers a fundamentally different structure. The gold or silver you buy is real metal, stored at the Malca-Amit Singapore FTZ vault in your name, with specific serial numbers, segregated from any other customer. It appears on no bank's balance sheet.",
        bulletsKo: [
          "일련번호가 있는 실제 LBMA 인증 금·은 바",
          "고객별 완전 분리 보관 (pooled 아님, leased 아님, collateralized 아님)",
          "Aurum 파산 시에도 고객 자산 보호 — Malca-Amit가 수탁자로서 직접 반환",
          "고해상도 사진, 볼트 증명서, 대시보드 실시간 확인",
        ],
        bulletsEn: [
          "Real LBMA-certified gold and silver bars with unique serial numbers",
          "Fully segregated by customer — never pooled, leased, or used as collateral",
          "Customer assets protected even in Aurum's insolvency — Malca-Amit, as custodian, returns metal directly",
          "High-resolution photos, vault certificates, and real-time dashboard visibility",
        ],
        highlightKo: "약속이 아니라 자산. 청구권이 아니라 소유권.",
        highlightEn: "An asset, not a promise. Ownership, not a claim.",
      },
      {
        headingKo: "왜 정교한 투자자는 실물을 선택하는가", headingEn: "Why sophisticated investors choose physical",
        bodyKo: "세계 최대 가문 사무소, 소버린 웰스 펀드, 중앙은행들은 모두 일정 비율을 실물 금으로 보유합니다. 편리함 때문이 아니라, 종이 청구권이 실패할 수 있는 모든 시나리오 — 은행 위기, 자본 통제, 압수, 통화 리셋 — 에 대한 최종적 방어선이기 때문입니다.",
        bodyEn: "The world's largest family offices, sovereign wealth funds, and central banks all hold a portion of their reserves in physical gold. Not for convenience, but because physical is the final line of defence against every scenario where a paper claim can fail — banking crisis, capital controls, seizure, currency reset.",
        bulletsKo: null, bulletsEn: null, highlightKo: null, highlightEn: null,
      },
    ],
  },
  {
    id: "why-silver", emoji: "🥈", category: "자산", featured: true,
    titleKo: "왜 은인가 — 구조적 부족과 산업 수요 이야기", titleEn: "Why Silver — The Structural Deficit Story",
    subtitleKo: "2026년 은의 투자 논리: 공급 부족, 산업 수요, 한국 실물 부족",
    subtitleEn: "The 2026 silver thesis: deficit, industrial demand, and Korean shortage",
    readTimeKo: "8분", readTimeEn: "8 min",
    sections: [
      {
        headingKo: "2026년 은의 상황은 금보다 더 강력합니다", headingEn: "In 2026, the case for silver is more compelling than gold",
        bodyKo: "많은 투자자가 금에 관심을 갖지만 은을 간과합니다. 수급 관점에서 2026년의 은은 금보다 훨씬 더 비대칭적 기회를 제공합니다. Silver Institute에 따르면 세계 은 시장은 6년 연속 구조적 공급 부족에 있으며, 2026년 부족분은 약 2억 온스에 달할 것으로 전망됩니다.",
        bodyEn: "Most investors focus on gold and overlook silver. From a supply-demand perspective, the case for silver in 2026 is more asymmetric than the case for gold. According to the Silver Institute, the global silver market is in its sixth consecutive year of structural deficit, with the 2026 shortfall projected at roughly 200 million ounces.",
        bulletsKo: null, bulletsEn: null,
        highlightKo: "은은 단기 수급 이슈가 아니라 장기 구조 문제입니다.",
        highlightEn: "This is not a cyclical issue — it is a structural one.",
      },
      {
        headingKo: "산업 수요의 구조적 상승", headingEn: "The structural rise of industrial demand",
        bodyKo: "전 세계 은 수요의 60%를 초과하는 비중이 산업 용도에서 발생합니다. 이 수요는 인류 경제의 가장 빠르게 성장하는 부문과 직접 연결됩니다.",
        bodyEn: "More than 60% of global silver demand comes from industrial applications, directly tied to the fastest-growing sectors of the global economy.",
        bulletsKo: [
          "태양광 패널 — 단일 패널 약 20g의 은 필요. 전 세계 태양광 설치량은 매년 급증.",
          "전기차 — 단일 EV 약 25~50g의 은 사용. 전동화 전환으로 수요 폭발.",
          "5G/6G 전자제품 — 안테나, PCB, 커넥터.",
          "AI 데이터센터 — 고성능 서버, 냉각 시스템, 전력 인프라.",
          "의료기기 — 항균 코팅, 영상 진단, 수술 기구.",
          "방위 시스템 — 레이더, 미사일 전자, 위성.",
        ],
        bulletsEn: [
          "Solar panels — ~20g of silver per panel; global solar capacity installation is surging yearly.",
          "Electric vehicles — ~25–50g of silver per EV; electrification transition is driving demand.",
          "5G/6G electronics — antennas, PCBs, connectors.",
          "AI data centres — high-performance servers, cooling, power infrastructure.",
          "Medical devices — antimicrobial coatings, imaging, surgical instruments.",
          "Defence systems — radar, missile electronics, satellites.",
        ],
        highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "중국의 수출 라이선스 규제 — 2026년 1월", headingEn: "China's export-licensing shock — January 2026",
        bodyKo: "세계 최대 은 정련국인 중국은 2026년 1월부터 은 수출에 엄격한 라이선스 규제를 도입했습니다. 이로 인해 글로벌 공급 가용성이 즉각 감소했고, 아시아 지역 실물 은 프리미엄이 국제 현물가 대비 크게 벌어졌습니다.",
        bodyEn: "China — the world's largest silver refiner — introduced strict export-licensing controls on silver starting in January 2026. Global supply availability contracted immediately, and physical silver premiums across Asia widened materially over international spot.",
        bulletsKo: null, bulletsEn: null,
        highlightKo: "공급 측 제약은 가격 발견에 구조적 편향을 만듭니다.",
        highlightEn: "Supply-side constraints create structural bias in price discovery.",
      },
      {
        headingKo: "한국 내 실물 은 부족", headingEn: "The Korean physical silver shortage",
        bodyKo: "한국 투자자들이 은에 접근하는 것은 금에 비해 훨씬 어렵습니다. KRX에는 실질적인 은 현물 시장이 존재하지 않으며, 국내 주요 은행들은 은 바 판매를 반복적으로 중단해 왔습니다. 접근 가능한 실물 은은 국제 현물가 대비 상당한 실물 프리미엄에 거래됩니다.",
        bodyEn: "Korean investors face materially greater difficulty accessing physical silver than gold. The KRX has no meaningful silver spot market, and major domestic banks have repeatedly suspended silver-bar sales. Accessible physical silver often trades at a substantial premium over international spot.",
        bulletsKo: null, bulletsEn: null,
        highlightKo: "Aurum의 싱가포르 보관 구조는 이 국내 제약을 완전히 우회합니다.",
        highlightEn: "Aurum's Singapore storage structure completely bypasses this domestic constraint.",
      },
      {
        headingKo: "금·은 비율의 장기 평균", headingEn: "The long-run gold-silver ratio",
        bodyKo: "역사적으로 금과 은의 가격 비율은 평균 약 60:1 수준입니다. 2026년 현재 이 비율은 구조적으로 평균보다 높게 형성되어 있으며, 역사적으로 비율이 평균 회귀할 때 은은 금 대비 큰 폭으로 아웃퍼폼했습니다. 포트폴리오 관점에서 이는 비대칭 상방 기회를 제공합니다.",
        bodyEn: "Historically, the gold-silver price ratio averages around 60:1. In 2026 the ratio sits structurally above that average. Historically, when the ratio mean-reverts, silver has tended to outperform gold substantially. From a portfolio perspective, this is an asymmetric upside opportunity.",
        bulletsKo: null, bulletsEn: null, highlightKo: null, highlightEn: null,
      },
    ],
  },
  {
    id: "generational-wealth", emoji: "🏛️", category: "자산", featured: true,
    titleKo: "세대를 잇는 자산 보호 — 왜 실물 금·은인가", titleEn: "Generational Wealth Preservation",
    subtitleKo: "수세기에 걸친 구매력 보존, 그리고 상속의 구조적 단순성",
    subtitleEn: "Preserving purchasing power across centuries — and simplifying inheritance",
    readTimeKo: "7분", readTimeEn: "7 min",
    sections: [
      {
        headingKo: "자산을 세대에 걸쳐 옮긴다는 것", headingEn: "What it means to move wealth across generations",
        bodyKo: "정교한 가문의 자산 관리는 단기 수익률 경쟁이 아닙니다. 핵심은 장기 — 통상 30~100년 — 에 걸쳐 실질 구매력을 유지하는 것입니다. 이 시간 지평에서 대부분의 금융 자산은 이벤트 리스크에 노출됩니다. 은행 붕괴, 통화 개혁, 정책 변경, 압수, 과세 체제의 전환.",
        bodyEn: "Managing wealth in a sophisticated family is not a short-term returns competition. The core task is preserving real purchasing power across long horizons — typically 30 to 100 years. Over that span, most financial assets are exposed to event risk: bank failures, currency reforms, policy changes, seizure, or tax-regime transitions.",
        bulletsKo: null, bulletsEn: null, highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "실물 금이 검증된 이유", headingEn: "Why physical gold has stood the test",
        bodyKo: "금은 5,000년 이상 구매력을 보존해온 유일한 자산입니다. 로마 제국 시대의 금 1온스는 오늘날에도 비슷한 양의 정장, 식량, 주거를 구매할 수 있습니다. 같은 시간 동안 거의 모든 법정화폐는 소멸하거나 급격히 가치를 잃었습니다.",
        bodyEn: "Gold is the only asset that has preserved purchasing power across more than 5,000 years. One ounce of gold in the Roman era bought a comparable quantity of fine clothing, food, or shelter to what it buys today. Over the same span, virtually every fiat currency has either vanished or lost value dramatically.",
        bulletsKo: [
          "로마 시대 1온스 금 = 1벌의 고품질 정장 (오늘날과 유사)",
          "1933년 미국 달러의 실질 구매력 = 오늘날의 약 5%",
          "1971년 금 가격 $35/oz → 2026년 $4,750+/oz",
          "중앙은행들이 여전히 외환보유액에 금을 포함하는 이유",
        ],
        bulletsEn: [
          "1oz gold in Roman times ≈ one fine garment (similar today)",
          "Real purchasing power of 1933 US dollar ≈ 5% of today's",
          "Gold price 1971: $35/oz → 2026: $4,750+/oz",
          "The reason central banks still include gold in their reserves",
        ],
        highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "상속의 구조적 단순성", headingEn: "The structural simplicity of inheritance",
        bodyKo: "일련번호가 부여된 실물 금·은 바는 상속의 관점에서 가장 단순한 자산 중 하나입니다. 복잡한 상속 절차, 금융기관 의존, 통화 리스크, 또는 파생 상품의 청산 복잡성이 없습니다. 명확한 법적 소유권과 실물 일련번호만 있으면 세대에 걸쳐 투명하게 이전됩니다.",
        bodyEn: "Serial-numbered physical gold and silver bars are among the simplest assets to inherit. No complex estate procedures, no dependence on a financial institution, no currency risk, no derivative-contract unwind complexity. A clear legal title and a physical serial number transfer transparently across generations.",
        bulletsKo: [
          "Malca-Amit 볼트 등록 — 고객님 명의의 명확한 법적 소유권",
          "일련번호 기반 체인 오브 커스터디",
          "Singapore 관할 — 안정적 법치주의, AAA 국가 신용등급",
          "상속인에게 단순 이전 가능 — 복잡한 법적 절차 최소화",
        ],
        bulletsEn: [
          "Malca-Amit vault registration — clear legal title in your name",
          "Serial-number-based chain of custody",
          "Singapore jurisdiction — stable rule of law, AAA sovereign credit rating",
          "Simple transfer to heirs — minimizing complex legal procedures",
        ],
        highlightKo: "종이 청구권을 상속하는 것보다 실물 금을 상속하는 것이 법적·구조적으로 훨씬 깨끗합니다.",
        highlightEn: "Inheriting physical gold is legally and structurally far cleaner than inheriting a paper claim.",
      },
      {
        headingKo: "Aurum이 적합한 이유", headingEn: "Why Aurum fits this use case",
        bodyKo: "세대 자산 보존 관점에서 Aurum은 단일 은행·단일 국가·단일 통화 리스크를 분산합니다. 실물은 싱가포르 FTZ에 보관되고, 법적 소유권은 명확하고, Lloyd's of London 보험이 완전 적용되며, Aurum 파산 시에도 Malca-Amit가 수탁자로서 고객 자산을 직접 반환합니다.",
        bodyEn: "From a generational wealth-preservation lens, Aurum diversifies single-bank, single-country, and single-currency risk. Metal is vaulted in Singapore's Free Trade Zone, legal title is clear, Lloyd's of London insurance is in full effect, and in the event of Aurum's insolvency Malca-Amit — as custodian — returns assets to customers directly.",
        bulletsKo: null, bulletsEn: null, highlightKo: null, highlightEn: null,
      },
    ],
  },
  {
    id: "physical-premium", emoji: "📊", category: "가격", featured: true,
    titleKo: "실물 프리미엄 — 한국 내 금·은 가격이 비싼 이유",
    titleEn: "The Physical Premium — Why Korean Gold Costs More",
    subtitleKo: "국내 KRX·은행·소매 가격과 국제 현물가의 구조적 간극",
    subtitleEn: "The structural gap between domestic Korean pricing and international spot",
    readTimeKo: "6분", readTimeEn: "6 min",
    sections: [
      {
        headingKo: "실물 프리미엄이란 무엇인가", headingEn: "What is the physical premium",
        bodyKo: "한국 내 실물 금·은은 오랫동안 국제 현물가 대비 상당한 프리미엄에 거래되어 왔습니다. 한국 재정 언론에서는 이를 '실물 프리미엄'이라고 부르며, 과거에는 구어체로 '김치 프리미엄'이라고도 불렸습니다. 실질적으로 한국 소비자는 동일한 1온스 금을 국제 투자자보다 약 10~20% 비싸게 지불합니다.",
        bodyEn: "Physical gold and silver in Korea have traded at a meaningful premium over international spot for years. Korean financial media calls this the Physical Premium; it was previously referred to colloquially as the Kimchi Premium. In practical terms, Korean consumers pay roughly 10–20% more for the same one-ounce gold bar than an international investor would.",
        bulletsKo: null, bulletsEn: null, highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "이 프리미엄이 왜 존재하는가", headingEn: "Why this premium exists",
        bodyKo: "실물 프리미엄은 세 가지 구조적 요인의 산물입니다.",
        bodyEn: "The physical premium is the product of three structural factors.",
        bulletsKo: [
          "수입 규제와 관세: 금·은 수입에 대한 국내 관세·부가세 체계",
          "유통 마진: 국내 유통 단계(은행, 증권사, 금은방)마다 누적되는 마진",
          "수요 공급 불일치: 한국은 주요 금·은 생산국이 아니며, 국내 유통 재고가 제한적",
        ],
        bulletsEn: [
          "Import regulations and duties: domestic tariff and VAT regime on gold and silver imports",
          "Distribution margins: cumulative markups through each domestic channel (banks, brokerages, jewellers)",
          "Supply-demand mismatch: Korea is not a major gold or silver producer, and domestic inventory is constrained",
        ],
        highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "Aurum은 이 프리미엄을 어떻게 회피하는가", headingEn: "How Aurum bypasses this premium",
        bodyKo: "Aurum의 구조는 한국 국내 유통망을 거치지 않습니다. 금·은은 Malca-Amit 싱가포르 FTZ(자유무역지대)에 직접 보관되며, 국제 현물가 + 투명한 Aurum 프리미엄(3.5%)으로 거래됩니다. 한국 내로 실물을 반입하지 않는 한 한국 VAT·관세가 발생하지 않습니다.",
        bodyEn: "Aurum's structure does not pass through the domestic Korean distribution chain. Gold and silver are vaulted directly at Malca-Amit Singapore FTZ (Free Trade Zone), priced at international spot plus a transparent Aurum premium (3.5%). No Korean VAT or customs duties apply as long as the metal stays offshore.",
        bulletsKo: null, bulletsEn: null,
        highlightKo: "국내 1온스 금: 국제 현물가 + 약 10~15%. Aurum 1온스 금: 국제 현물가 + 3.5%. 그 차이가 저축입니다.",
        highlightEn: "Domestic 1oz gold: international spot + ~10–15%. Aurum 1oz gold: international spot + 3.5%. The difference is your savings.",
      },
    ],
  },
  {
    id: "what-is-gold", emoji: "🥇", category: "기초",
    titleKo: "실물 금이란 무엇인가?", titleEn: "What is Physical Gold?",
    subtitleKo: "금 ETF, 금 통장과 다른 진짜 금의 의미",
    subtitleEn: "The difference between real gold and paper gold",
    readTimeKo: "5분", readTimeEn: "5 min",
    sections: [
      {
        headingKo: "실물 금 vs 종이 금", headingEn: "Physical gold vs paper gold",
        bodyKo: "투자용 금은 크게 두 종류로 나뉩니다. 종이 금은 금 ETF, KRX 금 시장, 금 통장처럼 금을 실제 보유하지 않고 가격만 추종하는 상품입니다. 실물 금은 실제로 제련된 금 바(bar) 또는 금화(coin)로, 당신이 손에 들고 금고에 넣을 수 있는 금속 그 자체입니다.",
        bodyEn: "Investment-grade gold comes in two broad categories. Paper gold — ETFs, KRX gold accounts, bank passbooks — tracks the gold price without giving you ownership of actual metal. Physical gold is a refined bar or coin that you can hold in your hand and lock in a vault.",
        bulletsKo: ["금 ETF: 거래소 상장 펀드. 편리하지만 발행사 리스크 존재.", "KRX 금 시장: 한국 내 금 현물 거래. 세금 혜택 있음.", "실물 금 바: 직접 소유하는 순도 999.9 금괴. Aurum Korea가 취급.", "금 통장(KB, 신한 등): 은행이 금을 대신 보유. 예금자 보호 미적용."],
        bulletsEn: ["Gold ETF: exchange-listed fund. Convenient, but carries issuer risk.", "KRX gold market: domestic Korean gold spot trading with tax advantages.", "Physical gold bar: directly owned 999.9 fineness bullion. Handled by Aurum Korea.", "Bank passbook (KB, Shinhan, etc.): the bank holds gold on your behalf. Not covered by depositor protection."],
        highlightKo: "실물 금은 발행자도, 거래상대방 리스크도 없는 유일한 금융 자산입니다.",
        highlightEn: "Physical gold is the only financial asset with no issuer and no counterparty risk.",
      },
      {
        headingKo: "Aurum Korea가 취급하는 금의 종류", headingEn: "Gold products at Aurum Korea",
        bodyKo: "저희는 LBMA(런던 귀금속 시장협회) 인증 정련소에서 제조된 제품만을 취급합니다.",
        bodyEn: "We only carry products manufactured by LBMA-certified refineries.",
        bulletsKo: ["1g 금 바 — 소액 투자 시작점", "5g 금 바 — 선물·기념일 수요 높음", "10g 금 바 — 가장 인기 있는 크기", "1oz (31.1g) 금 바 — 국제 표준 단위", "100g 금 바 — 기관·고액 투자자 선호", "1kg 금 바 — 최저 프리미엄, 최고 효율"],
        bulletsEn: ["1g gold bar — entry point for smaller allocations", "5g gold bar — popular for gifting and milestones", "10g gold bar — the most widely owned size", "1oz (31.1g) gold bar — the international standard unit", "100g gold bar — favoured by institutional and HNW investors", "1kg gold bar — lowest premium, highest efficiency"],
        highlightKo: null, highlightEn: null,
      },
    ],
  },
  {
    id: "gold-pricing", emoji: "📈", category: "가격",
    titleKo: "금 가격은 어떻게 결정되나?", titleEn: "How Gold Prices Are Determined",
    subtitleKo: "현물가, 프리미엄, 환율의 3중 구조", subtitleEn: "Spot price, premium, and FX: the three layers",
    readTimeKo: "7분", readTimeEn: "7 min",
    sections: [
      {
        headingKo: "국제 현물가 (Spot Price)", headingEn: "International spot price",
        bodyKo: "금 가격의 기준은 LBMA가 하루 두 번 발표하는 현물가입니다. 이 가격은 트로이 온스(31.1034g) 당 USD로 표시됩니다.",
        bodyEn: "The reference price for gold is the spot fix, published twice daily by the LBMA. The quote is USD per troy ounce (31.1034g).",
        bulletsKo: null, bulletsEn: null,
        highlightKo: "현재 금 현물가는 홈페이지 상단의 실시간 시세 위젯에서 확인할 수 있습니다.",
        highlightEn: "The current gold spot price is displayed in the live ticker at the top of every page.",
      },
      {
        headingKo: "환율 (USD/KRW)", headingEn: "FX rate (USD/KRW)",
        bodyKo: "국제 금 가격은 달러(USD) 기준이므로, 원화(KRW) 가격 = 현물가 × 환율입니다. 달러가 강세일 때 원화 금 가격이 올라가고, 원화 약세(환율 상승) 시에도 같은 효과가 납니다.",
        bodyEn: "International gold is priced in USD, so KRW price = spot × FX rate. When the dollar strengthens, gold rises in KRW terms. When the won weakens (USD/KRW rises), the same effect occurs.",
        bulletsKo: null, bulletsEn: null, highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "프리미엄 (Premium)", headingEn: "Premium",
        bodyKo: "실물 금 바의 판매가 = 현물가 + 프리미엄입니다. 프리미엄은 제련·제조비, 운송·보험, 딜러 마진으로 구성됩니다.",
        bodyEn: "Physical bar price = spot + premium. The premium covers refining, fabrication, transport, insurance, and dealer margin.",
        bulletsKo: ["제련·제조비: 정련소가 금괴를 만드는 비용 (보통 0.5~1%)", "운송·보험료: 싱가포르 → 보관 금고까지", "Aurum 수수료: 투명하게 공개 (상품 페이지 확인)", "소량일수록 프리미엄 높음 → 1g < 10g < 1oz < 1kg 순"],
        bulletsEn: ["Refining and fabrication: the cost of producing the bar (typically 0.5–1%)", "Transport and insurance: Singapore through to the vault", "Aurum margin: fully disclosed on each product page", "Smaller sizes carry higher premiums → 1g < 10g < 1oz < 1kg efficiency ladder"],
        highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "매수-매도 스프레드", headingEn: "Bid-ask spread",
        bodyKo: "구매(매수)가와 매각(매도)가의 차이를 스프레드라고 합니다. 실물 금은 유동성이 낮아 스프레드가 ETF보다 넓습니다.",
        bodyEn: "The gap between the buy (ask) price and sell (bid) price is called the spread. Physical gold is less liquid than ETFs, so its spread is wider.",
        bulletsKo: null, bulletsEn: null, highlightKo: null, highlightEn: null,
      },
    ],
  },
  {
    id: "how-to-buy", emoji: "🛒", category: "구매",
    titleKo: "Aurum Korea에서 금 구매하는 방법", titleEn: "How to Buy with Aurum Korea",
    subtitleKo: "회원가입부터 보관까지 5단계 가이드", subtitleEn: "From signup to vault — a five-step guide",
    readTimeKo: "4분", readTimeEn: "4 min",
    sections: [
      {
        headingKo: "구매 프로세스 (5단계)", headingEn: "The five-step purchase process",
        bodyKo: "Aurum Korea의 구매 과정은 단순하고 투명합니다.",
        bodyEn: "The Aurum Korea purchase flow is transparent and streamlined.",
        bulletsKo: ["1단계: 회원가입 — 이메일 또는 카카오 소셜 로그인 (5분 이내)", "2단계: 상품 선택 — 중량·브랜드별 금 바 선택", "3단계: 결제 — 토스페이, 카카오페이, 전신환(Wire Transfer)", "4단계: 주문 확인 — 이메일 + 카카오 알림으로 즉시 발송", "5단계: 보관 시작 — Malca-Amit 싱가포르 금고에 즉시 배정"],
        bulletsEn: ["Step 1: Sign up — email or Kakao social login (under 5 minutes)", "Step 2: Select — choose a bar by weight and refiner", "Step 3: Pay — TossPay, KakaoPay, or international wire transfer", "Step 4: Order confirmation — email and Kakao notification delivered immediately", "Step 5: Vault allocation — metal assigned to your segregated slot at Malca-Amit Singapore"],
        highlightKo: "구매 즉시 Malca-Amit 전용 금고에 배정됩니다. 별도 보관 신청 불필요.",
        highlightEn: "Metal is allocated to your Malca-Amit vault slot on purchase. No separate storage request required.",
      },
      {
        headingKo: "결제 방법", headingEn: "Payment methods",
        bodyKo: "현재 지원되는 결제 수단입니다.",
        bodyEn: "The currently supported payment rails.",
        bulletsKo: ["토스페이: 신용카드·체크카드·계좌이체 (즉시 처리)", "카카오페이: 카카오뱅크 연동 즉시 결제", "전신환(Wire Transfer): 법인·고액 거래 권장. 영업일 1일 처리.", "신용카드: Visa / Mastercard (국내외)"],
        bulletsEn: ["TossPay: credit card, debit card, and account transfer (instant)", "KakaoPay: instant payment via KakaoBank integration", "Wire transfer: recommended for corporate and large-ticket transactions. T+1 business day.", "Credit card: Visa and Mastercard (domestic and international)"],
        highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "실물 인출", headingEn: "Physical withdrawal",
        bodyKo: "금은 기본적으로 싱가포르 Malca-Amit 금고에 보관됩니다. 실물 인출을 원하실 경우 별도 배송 신청이 가능하며, 국내 반입 시 관세 및 부가세가 부과될 수 있습니다.",
        bodyEn: "By default, metal is held at the Malca-Amit Singapore vault. Physical withdrawal is available on request; importing into Korea triggers customs duties and VAT.",
        bulletsKo: null, bulletsEn: null, highlightKo: null, highlightEn: null,
      },
    ],
  },
  {
    id: "storage-security", emoji: "🔐", category: "보관",
    titleKo: "보관 및 안전성", titleEn: "Storage & Security",
    subtitleKo: "Malca-Amit 싱가포르 금고의 보안 구조", subtitleEn: "Inside the Malca-Amit Singapore vault",
    readTimeKo: "5분", readTimeEn: "5 min",
    sections: [
      {
        headingKo: "Malca-Amit이란?", headingEn: "What is Malca-Amit?",
        bodyKo: "Malca-Amit은 다이아몬드·귀금속 보관 및 운송 분야 세계 최고 수준의 전문 업체입니다. 1963년 설립, 전 세계 주요 도시에 고급 보안 금고를 운영하고 있습니다.",
        bodyEn: "Malca-Amit is a world-leading specialist in diamond and precious-metals custody and logistics. Founded in 1963, it operates high-security vaults across major global cities.",
        bulletsKo: ["24시간 무장 경비 및 다중 생체인식 보안", "고객별 분리 보관 (세그리게이션) 가능", "보험: Lloyd's of London 신디케이트 완전 보장", "ISO 9001:2015 인증", "싱가포르 MAS(금융통화청) 규제 환경"],
        bulletsEn: ["24-hour armed security and multi-factor biometric access", "Per-customer segregated storage", "Insurance: full coverage through Lloyd's of London syndicates", "ISO 9001:2015 certified", "Operates within Singapore's MAS regulatory framework"],
        highlightKo: "고객 자산은 Aurum Korea의 재무 상태와 완전히 분리됩니다. Aurum Korea가 파산하더라도 고객 금은 보호됩니다.",
        highlightEn: "Customer assets are fully segregated from Aurum Korea's balance sheet. Even in Aurum's insolvency, customer metal is protected.",
      },
      {
        headingKo: "싱가포르 보관의 장점", headingEn: "Why Singapore",
        bodyKo: "싱가포르는 아시아 최대 귀금속 허브입니다.",
        bodyEn: "Singapore is Asia's largest precious-metals hub.",
        bulletsKo: ["금 수입·수출 GST(부가세) 면제 (투자용 금)", "정치적 안정성 — AAA 국가 신용등급", "한국 원화 환율 위험 분산 효과", "국제 금 시장 접근성 최고"],
        bulletsEn: ["GST exemption on investment-grade gold imports and exports", "Political stability — AAA sovereign credit rating", "Currency and jurisdictional diversification from the Korean won", "Top-tier access to global bullion markets"],
        highlightKo: null, highlightEn: null,
      },
    ],
  },
  {
    id: "tax-legal", emoji: "📋", category: "세금·법률",
    titleKo: "세금 및 법률 (한국)", titleEn: "Korean Tax & Legal Notes",
    subtitleKo: "해외 실물 금 투자 시 알아야 할 의무", subtitleEn: "What offshore physical gold investors should know",
    readTimeKo: "8분", readTimeEn: "8 min",
    sections: [
      {
        headingKo: "해외 금융계좌 신고", headingEn: "Offshore account reporting",
        bodyKo: "해외 금융계좌 잔액이 연중 어느 하루라도 5억 원을 초과하면 다음 해 6월 1일~30일 사이에 국세청에 신고해야 합니다.",
        bodyEn: "If the aggregate balance of offshore financial accounts exceeds KRW 500M on any single day of the year, the NTS (Korean tax authority) requires a report between June 1 and June 30 of the following year.",
        bulletsKo: null, bulletsEn: null,
        highlightKo: "미신고 시 최대 20% 과태료. 세무사 상담을 권장합니다.",
        highlightEn: "Failure to report may result in penalties of up to 20%. Consult a licensed Korean tax professional.",
      },
      {
        headingKo: "양도소득세", headingEn: "Capital gains",
        bodyKo: "국내에서 실물 금을 매각할 경우, 기타소득세(필요경비 공제 후 22%) 또는 사업소득세가 부과될 수 있습니다.",
        bodyEn: "When physical gold is sold in Korea, the gain may be taxed as miscellaneous income (22% after allowable deductions) or as business income, depending on circumstances.",
        bulletsKo: ["KRX 금 시장 거래: 비과세 (특례)", "은행 금 통장 이익: 배당소득세 15.4%", "실물 금 매각이익: 기타소득 or 사업소득 분류 가능", "반드시 세무사·세무대리인과 개별 상담 필요"],
        bulletsEn: ["KRX gold market trades: tax-exempt (special rule)", "Bank passbook gains: dividend income tax 15.4%", "Physical gold sale gains: classifiable as miscellaneous or business income", "Always consult a licensed Korean tax professional"],
        highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "실물 금 국내 반입 시 관세", headingEn: "Importing physical gold into Korea",
        bodyKo: "싱가포르 보관 금을 국내로 반입할 경우 관세(3%) + 부가가치세(10%)가 부과됩니다.",
        bodyEn: "When metal held in Singapore is imported into Korea, customs duty (3%) plus VAT (10%) apply.",
        bulletsKo: null, bulletsEn: null,
        highlightKo: "본 내용은 일반 정보 제공 목적이며 법적·세무적 조언이 아닙니다. 공인 세무사 또는 법률 전문가와 상담하시기 바랍니다.",
        highlightEn: "This content is general information only and is not legal or tax advice. Please consult a licensed Korean tax professional or attorney.",
      },
    ],
  },
  {
    id: "glossary", emoji: "📚", category: "용어집",
    titleKo: "금 투자 용어 사전", titleEn: "Precious Metals Glossary",
    subtitleKo: "알아두면 유용한 귀금속 투자 용어 A–Z",
    subtitleEn: "Key precious-metals investing terms A to Z",
    readTimeKo: "3분", readTimeEn: "3 min",
    sections: [
      {
        headingKo: "기본 용어", headingEn: "Core terms",
        bodyKo: "", bodyEn: "",
        bulletsKo: ["Spot Price (현물가): 즉시 인도 기준 금 시세. 국제 금 가격의 기준.", "Troy Ounce (트로이 온스): 금 계량 단위. 1 troy oz = 31.1034g.", "Premium (프리미엄): 현물가 대비 실물 금 판매가의 추가 마진.", "Bid/Ask Spread: 매수-매도 가격 차이. 스프레드가 좁을수록 거래 비용 낮음.", "LBMA: 런던 귀금속 시장협회. 국제 금 가격 Fix 기준.", "COMEX: 미국 뉴욕 상품거래소. 금 선물 가격 형성 시장."],
        bulletsEn: ["Spot Price: the immediate-delivery reference price for gold — the international benchmark.", "Troy Ounce: the standard gold weight unit. 1 troy oz = 31.1034g.", "Premium: the markup over spot on a physical bar or coin.", "Bid/Ask Spread: the gap between sell and buy prices. Narrower = lower transaction cost.", "LBMA: London Bullion Market Association — sets the international gold fix.", "COMEX: New York commodities exchange where gold futures price."],
        highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "순도 관련", headingEn: "Purity",
        bodyKo: "", bodyEn: "",
        bulletsKo: ["999.9 (4 Nines): 순도 99.99%. 투자용 금의 국제 표준.", "24K: 순도 99.9% 이상 금. 투자용 금바는 보통 24K.", "Assay Certificate: 순도 인증서. 투자용 금바에 동봉."],
        bulletsEn: ["999.9 (4 Nines): 99.99% pure — the international standard for investment gold.", "24K: gold of 99.9% purity or higher. Investment bars are typically 24K.", "Assay Certificate: a purity certificate included with investment-grade bars."],
        highlightKo: null, highlightEn: null,
      },
      {
        headingKo: "보관 관련", headingEn: "Storage",
        bodyKo: "", bodyEn: "",
        bulletsKo: ["Allocated Storage: 고객 자산이 특정 금괴로 지정되어 분리 보관.", "Unallocated Storage: 풀(pool)에 혼합 보관. 비용 낮지만 상대방 리스크 존재.", "Segregated: 완전 분리 보관. Aurum Korea 기본 옵션.", "Custodian: 자산 보관 수탁 기관. Aurum Korea의 경우 Malca-Amit."],
        bulletsEn: ["Allocated Storage: client assets are assigned to specific bars and segregated.", "Unallocated Storage: metal held in a common pool — cheaper but exposed to counterparty risk.", "Segregated: fully separated storage. Aurum Korea's default setup.", "Custodian: the institution holding the assets. For Aurum Korea, that is Malca-Amit."],
        highlightKo: null, highlightEn: null,
      },
    ],
  },
];

const EDUCATION_CATEGORIES = ["전체", "기초", "자산", "가격", "구매", "보관", "세금·법률", "용어집"];

const EDUCATION_CATEGORY_LABELS = {
  "전체": { ko: "전체", en: "All" },
  "기초": { ko: "기초", en: "Basics" },
  "자산": { ko: "자산", en: "Assets" },
  "가격": { ko: "가격", en: "Pricing" },
  "구매": { ko: "구매", en: "Buying" },
  "보관": { ko: "보관", en: "Storage" },
  "세금·법률": { ko: "세금·법률", en: "Tax & Legal" },
  "용어집": { ko: "용어집", en: "Glossary" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS
// ═══════════════════════════════════════════════════════════════════════════════
const STATIC_NEWS = [
  { title: "Gold Holds Near $4,700 Amid Record Central Bank Accumulation", link: "https://www.kitco.com/news/gold", pubDate: "2026-04-11T06:00:00Z", source: "Kitco", category: "gold", snippet: "Gold prices remain elevated above $4,700 per troy ounce as central banks continued accumulating the precious metal at near-record pace through Q1 2026." },
  { title: "Fed Rate Pause Signals Extended Gold Bull Run", link: "https://www.kitco.com/news/gold", pubDate: "2026-04-10T08:30:00Z", source: "Kitco", category: "gold", snippet: "Analysts say the Federal Reserve's decision to pause rate hikes creates a favourable environment for gold, with real yields expected to fall further." },
  { title: "Silver Demand Hits 10-Year High on Solar Panel Boom", link: "https://www.kitco.com/news/silver", pubDate: "2026-04-10T04:00:00Z", source: "Kitco", category: "silver", snippet: "Industrial demand for silver surged to a decade-high driven by solar panel manufacturing, creating a structural supply deficit that supports prices." },
  { title: "Korean Won Weakens — Gold Hedge Interest Spikes", link: "https://www.bullionstar.com/blogs", pubDate: "2026-04-09T09:00:00Z", source: "BullionStar", category: "gold", snippet: "Korean retail investors are increasingly turning to physical gold as the won softens against the dollar, with vault enquiries up 40% month-on-month." },
  { title: "Singapore FTZ Vaults Report Record Inflows from Asian Investors", link: "https://www.bullionstar.com/blogs", pubDate: "2026-04-08T07:00:00Z", source: "BullionStar", category: "gold", snippet: "Singapore freeport vaults reported record new deposits in Q1 2026, driven primarily by high-net-worth investors from South Korea and Japan." },
  { title: "Silver Industrial Deficit to Widen in 2026 — Silver Institute", link: "https://www.kitco.com/news/silver", pubDate: "2026-04-07T05:00:00Z", source: "Kitco", category: "silver", snippet: "The Silver Institute projects the global silver market deficit will widen to over 200 million ounces in 2026, the fourth consecutive year of structural undersupply." },
];

const RSS_FEEDS = [
  { url: "https://www.kitco.com/rss/news.rss", source: "Kitco", category: "gold" },
  { url: "https://www.kitco.com/rss/silver-news.rss", source: "Kitco", category: "silver" },
  { url: "https://www.bullionstar.com/rss", source: "BullionStar", category: "gold" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
function calcPrice(p, prices) {
  const spot = prices[p.metal] ?? prices.gold;
  const oz = p.weightOz || (p.weight && p.weight.includes("kg") ? parseFloat(p.weight) * 32.1507 : parseFloat(p.weight));
  return spot * oz * (1 + p.premium);
}
function fUSD(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fKRW(n) { return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(n); }
function fDate(dateStr) {
  const d = new Date(dateStr);
  const hrs = Math.floor((Date.now() - d.getTime()) / 3_600_000);
  if (hrs < 1) return "방금 전";
  if (hrs < 24) return `${hrs}시간 전`;
  if (hrs < 48) return "어제";
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}
function fDateLong(dateStr) {
  return new Date(dateStr).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.05, rootMargin: "-50px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function useLivePrices() {
  const [prices, setPrices] = useState(FALLBACK_PRICES);
  const [krwRate, setKrwRate] = useState(FALLBACK_KRW);
  const [priceError, setPriceError] = useState(null);
  const fetch_ = useCallback(async () => {
    try {
      const [g, s, p, fx] = await Promise.all([
        fetch("https://api.gold-api.com/price/XAU"),
        fetch("https://api.gold-api.com/price/XAG"),
        fetch("https://api.gold-api.com/price/XPT"),
        fetch("https://open.er-api.com/v6/latest/USD"),
      ]);
      const [gd, sd, pd, fxd] = await Promise.all([g.json(), s.json(), p.json(), fx.json()]);
      setPrices({ gold: gd.price, silver: sd.price, platinum: pd.price });
      if (fxd.rates?.KRW) setKrwRate(fxd.rates.KRW);
      setPriceError(null);
    } catch {
      setPriceError("가격 로딩 실패 — 최근 데이터 표시 중");
    }
  }, []);
  useEffect(() => { fetch_(); const t = setInterval(fetch_, 60_000); return () => clearInterval(t); }, [fetch_]);
  return { prices, krwRate, priceError };
}

function useNewsData() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await Promise.allSettled(
          RSS_FEEDS.map(feed =>
            fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=6`)
              .then(r => r.ok ? r.json() : null)
              .then(d => (!d || d.status !== "ok") ? [] : d.items.map(i => ({ title: i.title || "", link: i.link || "#", pubDate: i.pubDate || new Date().toISOString(), source: feed.source, category: feed.category, snippet: (i.description || "").replace(/<[^>]*>/g, "").trim().slice(0, 200) })))
              .catch(() => [])
          )
        );
        if (!cancelled) {
          const all = res.flatMap(r => r.status === "fulfilled" ? r.value : []);
          setArticles(all.length >= 4 ? all.slice(0, 12) : STATIC_NEWS);
        }
      } catch { if (!cancelled) setArticles(STATIC_NEWS); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);
  return { articles, loading };
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  }, []);
  return { toasts, show };
}

export {
  API, FALLBACK_PRICES, FALLBACK_KRW, MARKET_FACTS, T,
  PRODUCTS, MOCK_HOLDINGS, MOCK_ORDERS_INIT, AUDIT_TRAIL_INIT,
  WHY_GOLD_REASONS, WHY_GOLD_STATS, WHY_SILVER_REASONS, SILVER_STATS,
  EDUCATION_ARTICLES, EDUCATION_CATEGORIES, EDUCATION_CATEGORY_LABELS,
  STATIC_NEWS, RSS_FEEDS,
  calcPrice, fUSD, fKRW, fDate, fDateLong,
  useIsMobile, useInView, useLivePrices, useNewsData, useToast
};
