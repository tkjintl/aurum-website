import { useState, useEffect, useCallback, useRef } from "react";
// ═══════════════════════════════════════════════════════════════════════════════
// API SERVICE LAYER — All methods are stubbed. Replace with live SDK calls.
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
  lastVerified: "2026-04-11",
};

const FALLBACK_PRICES = { gold: 4750.00, silver: 32.15, platinum: 1020.00 };
const FALLBACK_KRW = 1395.00;

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS — spot + 8% as Aurum Price (temporary per founder directive)
// premium field = 0.08 for all items
// ═══════════════════════════════════════════════════════════════════════════════
const PRODUCTS = [
  { id: 1, name: "1 oz Gold Bar — PAMP Suisse", nameKo: "1 온스 금바 — PAMP 스위스", metal: "gold", type: "bar", weight: "1 oz", weightOz: 1, purity: "99.99%", mint: "PAMP Suisse", premium: 0.08, image: "🥇", inStock: true, descKo: "세계에서 가장 인지도 높은 금바. LBMA 인증 PAMP Suisse 제조. Lady Fortuna 디자인." },
  { id: 2, name: "1 kg Gold Bar — Heraeus", nameKo: "1 kg 금바 — 헤레우스", metal: "gold", type: "bar", weight: "1 kg", weightOz: 32.1507, purity: "99.99%", mint: "Heraeus", premium: 0.08, image: "🥇", inStock: true, descKo: "기관 및 고액 투자자 선호. 최저 프리미엄으로 최대 효율. 독일 헤레우스 제조." },
  { id: 3, name: "1 oz Gold Maple Leaf", nameKo: "1 온스 골드 메이플리프", metal: "gold", type: "coin", weight: "1 oz", weightOz: 1, purity: "99.99%", mint: "Royal Canadian Mint", premium: 0.08, image: "🪙", inStock: true, descKo: "캐나다 왕립 조폐국 발행. 세계적으로 가장 많이 거래되는 금화 중 하나." },
  { id: 4, name: "1 oz Gold Krugerrand", nameKo: "1 온스 골드 크루거랜드", metal: "gold", type: "coin", weight: "1 oz", weightOz: 1, purity: "91.67%", mint: "South African Mint", premium: 0.08, image: "🪙", inStock: true, descKo: "세계 최초 투자용 금화(1967년 발행). 남아프리카 공화국 조폐국 제조." },
  { id: 5, name: "100 oz Silver Bar — PAMP", nameKo: "100 온스 은바 — PAMP", metal: "silver", type: "bar", weight: "100 oz", weightOz: 100, purity: "99.99%", mint: "PAMP Suisse", premium: 0.08, image: "🥈", inStock: true, descKo: "대규모 은 투자에 최적. PAMP 스위스 제조, LBMA 인증 순은 바." },
  { id: 6, name: "1 oz Silver Maple Leaf", nameKo: "1 온스 실버 메이플리프", metal: "silver", type: "coin", weight: "1 oz", weightOz: 1, purity: "99.99%", mint: "Royal Canadian Mint", premium: 0.08, image: "🥈", inStock: true, descKo: "캐나다 왕립 조폐국 발행 순은 동전. 컬렉터와 투자자 모두 선호." },
  { id: 7, name: "1 kg Silver Bar — Heraeus", nameKo: "1 kg 은바 — 헤레우스", metal: "silver", type: "bar", weight: "1 kg", weightOz: 32.1507, purity: "99.99%", mint: "Heraeus", premium: 0.08, image: "🥈", inStock: true, descKo: "독일 헤레우스 제조 순은 바. 산업용·투자 수요 모두 높은 표준 규격." },
  { id: 8, name: "10 oz Gold Bar — Valcambi", nameKo: "10 온스 금바 — 발캄비", metal: "gold", type: "bar", weight: "10 oz", weightOz: 10, purity: "99.99%", mint: "Valcambi", premium: 0.08, image: "🥇", inStock: true, descKo: "스위스 발캄비 제조 10온스 금바. 개인 고액 투자자에게 적합한 크기." },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK HOLDINGS
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_HOLDINGS = [
  { id: 1, product: "1 oz Gold Bar — PAMP Suisse", nameKo: "1 온스 금바 — PAMP 스위스", serial: "PAMP-2026-44891", purchasePrice: 4892.50, purchaseDate: "2026-03-15", weightOz: 1, metal: "gold", vault: "Singapore — Malca-Amit FTZ", zone: "Zone A, Bay 204", image: "🥇", assayCert: true, insurance: "Lloyd's of London" },
  { id: 2, product: "100 oz Silver Bar — PAMP", nameKo: "100 온스 은바 — PAMP", serial: "PAMP-AG-77234", purchasePrice: 2920.00, purchaseDate: "2026-03-20", weightOz: 100, metal: "silver", vault: "Singapore — Malca-Amit FTZ", zone: "Zone B, Bay 118", image: "🥈", assayCert: true, insurance: "Lloyd's of London" },
  { id: 3, product: "1 oz Gold Maple Leaf", nameKo: "1 온스 골드 메이플리프", serial: "RCM-ML-88123", purchasePrice: 4945.20, purchaseDate: "2026-04-01", weightOz: 1, metal: "gold", vault: "Singapore — Malca-Amit FTZ", zone: "Zone A, Bay 204", image: "🪙", assayCert: true, insurance: "Lloyd's of London" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK ORDERS
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_ORDERS_INIT = [
  { id: "AK-2026-001847", date: "2026-04-01T14:30:00Z", status: "vaulted", items: [{ nameKo: "1 온스 골드 메이플리프", name: "1 oz Gold Maple Leaf", qty: 1, unitPrice: 4945.20, metal: "gold", image: "🪙" }], subtotal: 4945.20, total: 4945.20, paymentMethod: "toss", storageOption: "singapore" },
  { id: "AK-2026-001612", date: "2026-03-20T09:15:00Z", status: "vaulted", items: [{ nameKo: "100 온스 은바 — PAMP", name: "100 oz Silver Bar — PAMP", qty: 1, unitPrice: 2920.00, metal: "silver", image: "🥈" }], subtotal: 2920.00, total: 2920.00, paymentMethod: "wire", storageOption: "singapore" },
  { id: "AK-2026-001344", date: "2026-03-15T11:45:00Z", status: "vaulted", items: [{ nameKo: "1 온스 금바 — PAMP 스위스", name: "1 oz Gold Bar — PAMP Suisse", qty: 2, unitPrice: 4892.50, metal: "gold", image: "🥇" }], subtotal: 9785.00, total: 9785.00, paymentMethod: "toss", storageOption: "singapore" },
];

const AUDIT_TRAIL_INIT = [
  { date: "2026-04-01", event: "보관 배정", detail: "1 온스 골드 메이플리프 → Malca-Amit SG FTZ (Zone A, Bay 204)", type: "vault" },
  { date: "2026-04-01", event: "결제 완료", detail: "주문 AK-2026-001847 · TossPay · $4,945.20", type: "payment" },
  { date: "2026-03-20", event: "보관 배정", detail: "100 온스 은바 PAMP → Malca-Amit SG FTZ (Zone B, Bay 118)", type: "vault" },
  { date: "2026-03-20", event: "결제 완료", detail: "주문 AK-2026-001612 · Wire Transfer · $2,920.00", type: "payment" },
  { date: "2026-03-15", event: "보관 배정", detail: "1 온스 금바 PAMP (×2) → Malca-Amit SG FTZ (Zone A, Bay 191)", type: "vault" },
  { date: "2026-03-15", event: "결제 완료", detail: "주문 AK-2026-001344 · TossPay · $9,785.00", type: "payment" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// WHY GOLD
// ═══════════════════════════════════════════════════════════════════════════════
const WHY_GOLD_REASONS = [
  { icon: "🛡️", titleKo: "인플레이션 헤지", titleEn: "Inflation Hedge", body: "금은 수천 년간 구매력을 보존해왔습니다. 지폐가 인쇄될수록 금의 실질 가치는 올라갑니다. 한국의 소비자물가지수(CPI)가 상승할 때, 금은 원화 자산을 보호하는 방패 역할을 합니다.", stat: MARKET_FACTS.tenYearReturn, statLabel: "최근 10년 금 수익률 (USD 기준)" },
  { icon: "🌍", titleKo: "지정학적 안전 자산", titleEn: "Safe Haven Asset", body: "전쟁, 금융위기, 무역분쟁 등 불확실성이 높아질 때마다 투자자들은 금으로 피신합니다. 2008년 금융위기, 2020년 팬데믹, 2022년 러-우 전쟁 때 금 가격은 급등했습니다.", stat: "$5,608", statLabel: "역대 최고가 (2026년 1월, USD/oz)" },
  { icon: "⚖️", titleKo: "포트폴리오 분산", titleEn: "Portfolio Diversification", body: "금은 주식·채권과 낮은 상관관계를 가집니다. 포트폴리오의 5~15%를 금에 배분하면 변동성을 낮추면서도 장기 수익률을 개선할 수 있습니다.", stat: "10-20%", statLabel: "Morgan Stanley 추천 자산 배분 율" },
  { icon: "🏛️", titleKo: "중앙은행의 선택", titleEn: "Central Bank Reserve", body: "한국은행을 포함한 세계 각국 중앙은행은 외환보유액의 일부를 금으로 보유합니다. 중앙은행들이 2022년 이후 역대 최대 규모로 금을 매입하고 있습니다.", stat: MARKET_FACTS.cbBuying2023, statLabel: "2023 중앙은행 금 순매입량" },
  { icon: "💎", titleKo: "희소성과 내재 가치", titleEn: "Scarcity & Intrinsic Value", body: "지구상에 채광된 금은 올림픽 수영장 약 3.5개 분량에 불과합니다. 새로운 채광량은 매년 제한적이며, 금은 부식되거나 소멸되지 않습니다.", stat: "~220천t", statLabel: "역대 총 채광량 추정 (WGC 2024)" },
  { icon: "🏦", titleKo: "환율 위험 분산", titleEn: "FX Risk Mitigation", body: "원화(KRW)가 약세를 보일 때, 달러로 표시된 금의 원화 가치는 상승합니다. 미국 금리 인상, 글로벌 리스크-오프 국면에서 원화 자산을 보호하는 자연 헤지 수단입니다.", stat: "+394%", statLabel: "최근 10년 금 수익률 (KRW 기준)" },
];

const WHY_GOLD_STATS = [
  { value: "5,000+", label: "년의 가치 저장 역사" },
  { value: `약 ${MARKET_FACTS.centralBanksWithGold}개국`, label: "중앙은행 금 보유" },
  { value: "0%", label: "발행자 리스크 (무기명 실물 자산)" },
  { value: "99.99%", label: "순도 보장 (Malca-Amit 보관)" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EDUCATION ARTICLES
// ═══════════════════════════════════════════════════════════════════════════════
const EDUCATION_ARTICLES = [
  { id: "what-is-gold", emoji: "🥇", category: "기초", title: "실물 금이란 무엇인가?", subtitle: "금 ETF, 금 통장과 다른 진짜 금의 의미", readTime: "5분", sections: [{ heading: "실물 금 vs 종이 금", body: "투자용 금은 크게 두 종류로 나뉩니다. 종이 금은 금 ETF, KRX 금 시장, 금 통장처럼 금을 실제 보유하지 않고 가격만 추종하는 상품입니다. 실물 금은 실제로 제련된 금 바(bar) 또는 금화(coin)로, 당신이 손에 들고 금고에 넣을 수 있는 금속 그 자체입니다.", bullets: ["금 ETF: 거래소에 상장된 펀드. 편리하지만 발행사 리스크 존재.", "KRX 금 시장: 한국 내 금 현물 거래. 세금 혜택 있음.", "실물 금 바: 직접 소유하는 순도 999.9 금괴. Aurum Korea가 취급.", "금 통장(KB, 신한 등): 은행이 금을 대신 보유. 예금자 보호 미적용."], highlight: "실물 금은 발행자도, 거래상대방 리스크도 없는 유일한 금융 자산입니다." }, { heading: "Aurum Korea가 취급하는 금의 종류", body: "저희는 LBMA(런던 귀금속 시장협회) 인증 정련소에서 제조된 제품만을 취급합니다.", bullets: ["1g 금 바 — 소액 투자 시작점", "5g 금 바 — 선물·기념일 수요 높음", "10g 금 바 — 가장 인기 있는 크기", "1oz (31.1g) 금 바 — 국제 표준 단위", "100g 금 바 — 기관·고액 투자자 선호", "1kg 금 바 — 최저 프리미엄, 최고 효율"], highlight: null }] },
  { id: "gold-pricing", emoji: "📈", category: "가격", title: "금 가격은 어떻게 결정되나?", subtitle: "현물가, 프리미엄, 환율의 3중 구조", readTime: "7분", sections: [{ heading: "국제 현물가 (Spot Price)", body: "금 가격의 기준은 LBMA가 하루 두 번 발표하는 현물가입니다. 이 가격은 트로이 온스(31.1034g) 당 USD로 표시됩니다.", bullets: null, highlight: "현재 금 현물가는 홈페이지 상단의 실시간 시세 위젯에서 확인할 수 있습니다." }, { heading: "환율 (USD/KRW)", body: "국제 금 가격은 달러(USD) 기준이므로, 원화(KRW) 가격 = 현물가 × 환율입니다.", bullets: null, highlight: null }, { heading: "프리미엄 (Premium)", body: "실물 금 바의 판매가 = 현물가 + 프리미엄입니다.", bullets: ["제련·제조비: 정련소가 금괴를 만드는 비용 (보통 0.5~1%)", "운송·보험료: 싱가포르 → 보관 금고까지", "Aurum 수수료: 투명하게 공개 (상품 페이지 확인)", "소량일수록 프리미엄 높음 → 1g < 10g < 1oz < 1kg 순"], highlight: null }] },
  { id: "how-to-buy", emoji: "🛒", category: "구매", title: "Aurum Korea에서 금 구매하는 방법", subtitle: "회원가입부터 보관까지 5단계 가이드", readTime: "4분", sections: [{ heading: "구매 프로세스 (5단계)", body: "Aurum Korea의 구매 과정은 단순하고 투명합니다.", bullets: ["1단계: 회원가입 — 이메일 또는 카카오 소셜 로그인 (5분 이내)", "2단계: 상품 선택 — 중량·브랜드별 금 바 선택", "3단계: 결제 — 토스페이, 카카오페이, 전신환(Wire Transfer), 암호화폐", "4단계: 주문 확인 — 이메일 + 카카오 알림으로 즉시 발송", "5단계: 보관 시작 — Malca-Amit 싱가포르 금고에 즉시 배정"], highlight: "구매 즉시 Malca-Amit 전용 금고에 배정됩니다. 별도 보관 신청 불필요." }] },
  { id: "storage-security", emoji: "🔐", category: "보관", title: "보관 및 안전성", subtitle: "Malca-Amit 싱가포르 금고의 보안 구조", readTime: "5분", sections: [{ heading: "Malca-Amit이란?", body: "Malca-Amit은 다이아몬드·귀금속 보관 및 운송 분야 세계 최고 수준의 전문 업체입니다.", bullets: ["24시간 무장 경비 및 다중 생체인식 보안", "고객별 분리 보관 (세그리게이션) 가능", "보험: Lloyd's of London 신디케이트 완전 보장", "ISO 9001:2015 인증", "싱가포르 MAS(금융통화청) 규제 환경"], highlight: "고객 자산은 Aurum Korea의 재무 상태와 완전히 분리됩니다." }] },
  { id: "tax-legal", emoji: "📋", category: "세금·법률", title: "세금 및 법률 (한국)", subtitle: "해외 실물 금 투자 시 알아야 할 의무", readTime: "8분", sections: [{ heading: "해외 금융계좌 신고", body: "해외 금융계좌 잔액이 연중 어느 하루라도 5억 원을 초과하면 다음 해 6월 1일~30일 사이에 국세청에 신고해야 합니다.", bullets: null, highlight: "미신고 시 최대 20% 과태료. 세무사 상담을 권장합니다." }, { heading: "실물 금 국내 반입 시 관세", body: "싱가포르 보관 금을 국내로 반입할 경우 관세(3%) + 부가가치세(10%)가 부과됩니다.", bullets: null, highlight: "본 내용은 일반 정보 제공 목적이며 법적·세무적 조언이 아닙니다." }] },
  { id: "glossary", emoji: "📚", category: "용어집", title: "금 투자 용어 사전", subtitle: "알아두면 유용한 귀금속 투자 용어 A–Z", readTime: "3분", sections: [{ heading: "기본 용어", body: "", bullets: ["Spot Price (현물가): 즉시 인도 기준 금 시세. 국제 금 가격의 기준.", "Troy Ounce (트로이 온스): 금 계량 단위. 1 troy oz = 31.1034g.", "Premium (프리미엄): 현물가 대비 실물 금 판매가의 추가 마진.", "LBMA: 런던 귀금속 시장협회. 국제 금 가격 Fix 기준."], highlight: null }] },
];
const EDUCATION_CATEGORIES = ["전체", "기초", "가격", "구매", "보관", "세금·법률", "용어집"];

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS — A-2: Replace broken Kitco RSS with reliable sources
// ═══════════════════════════════════════════════════════════════════════════════
const STATIC_NEWS = [
  { title: "중앙은행 금 매입 역대 최고 수준 지속 — 금 가격 고공행진", link: "https://www.mining.com/", pubDate: "2026-04-11T06:00:00Z", source: "Mining.com", category: "gold", snippet: "전 세계 중앙은행들이 2026년 1분기에도 기록적인 속도로 금을 매입하며 금 가격이 온스당 $4,700 이상을 유지하고 있습니다." },
  { title: "Fed 금리 동결 신호 — 금 강세장 연장 전망", link: "https://www.mining.com/", pubDate: "2026-04-10T08:30:00Z", source: "Mining.com", category: "gold", snippet: "연방준비제도의 금리 인상 중단 결정이 금에 유리한 환경을 조성, 실질 수익률 추가 하락이 예상됩니다." },
  { title: "태양광 붐으로 은 수요 10년 최고치 — 공급 부족 지속", link: "https://goldbroker.com/news", pubDate: "2026-04-10T04:00:00Z", source: "GoldBroker", category: "silver", snippet: "태양광 패널 제조 수요로 은 산업 수요가 10년 최고치를 기록, 구조적 공급 부족이 가격을 지지하고 있습니다." },
  { title: "2026년 은 공급 부족 확대 전망 — Silver Institute", link: "https://goldbroker.com/news", pubDate: "2026-04-07T05:00:00Z", source: "GoldBroker", category: "silver", snippet: "Silver Institute는 2026년 글로벌 은 시장 부족이 2억 온스 이상으로 확대될 것으로 예측, 4년 연속 구조적 공급 부족입니다." },
  { title: "금값 전망 및 금 투자 전략 — 최신 뉴스", link: "https://news.google.com/rss/search?q=%EA%B8%88%EA%B0%92+%EA%B8%88%ED%88%AC%EC%9E%90&hl=ko&gl=KR&ceid=KR:ko", pubDate: "2026-04-14T00:00:00Z", source: "한국 뉴스", category: "gold", snippet: "한국 금 투자자들이 주목해야 할 최신 금값 동향 및 투자 전략 분석입니다." },
  { title: "은값 상승 — 한국 은 투자 관심 급증", link: "https://news.google.com/rss/search?q=%EC%9D%80%EA%B0%92+%EC%9D%80%ED%88%AC%EC%9E%90&hl=ko&gl=KR&ceid=KR:ko", pubDate: "2026-04-08T00:00:00Z", source: "한국 뉴스", category: "silver", snippet: "은값 상승세와 함께 한국 투자자들의 은 실물 투자 관심이 급증하고 있습니다." },
];

// A-2: Reliable RSS feeds replacing broken Kitco
const RSS_FEEDS = [
  { url: "https://www.mining.com/feed/", source: "Mining.com", category: "gold" },
  { url: "https://goldbroker.com/news/rss-feed-40", source: "GoldBroker", category: "gold" },
  { url: "https://news.google.com/rss/search?q=%EA%B8%88%EA%B0%92+%EA%B8%88%ED%88%AC%EC%9E%90&hl=ko&gl=KR&ceid=KR:ko", source: "한국 뉴스", category: "gold" },
  { url: "https://news.google.com/rss/search?q=%EC%9D%80%EA%B0%92+%EC%9D%80%ED%88%AC%EC%9E%90&hl=ko&gl=KR&ceid=KR:ko", source: "한국 뉴스", category: "silver" },
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

// ─── Stooq price fetching with true day-over-day % change ────────────────────
// Source: Stooq daily history CSV — https://stooq.com/q/d/l/?s={symbol}&i=d
// Returns rows: Date,Open,High,Low,Close,Volume
// We take last two rows: today_close and prev_close → real % change
// Cache: store prev_close per metal per calendar day (ET close ~18:00 ET)
// Refresh: every 10 minutes. Falls back to FALLBACK_PRICES if all fail.

const STOOQ_SYMBOLS = { gold: 'xauusd', silver: 'xagusd', platinum: 'xptusd' };
const STOOQ_CACHE_KEY = 'aurum_stooq_v2';
const STOOQ_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const STOOQ_PROXY = 'https://api.allorigins.win/raw?url=';

function parseStooqCsv(csv) {
  // Returns { close, prevClose } or null on error
  try {
    const lines = csv.trim().split('\n').filter(l => l.trim() && !l.startsWith('Date'));
    if (lines.length < 2) return null;
    const parse = (line) => {
      const cols = line.split(',');
      const close = parseFloat(cols[4]);
      return isNaN(close) || cols[4] === 'N/D' ? null : close;
    };
    const today = parse(lines[lines.length - 1]);
    const prev  = parse(lines[lines.length - 2]);
    if (!today || !prev) return null;
    return { close: today, prevClose: prev };
  } catch { return null; }
}

async function fetchStooqMetal(symbol) {
  const url = `https://stooq.com/q/d/l/?s=${symbol}&i=d`;
  const proxyUrl = STOOQ_PROXY + encodeURIComponent(url);
  try {
    const r = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error('stooq http ' + r.status);
    const csv = await r.text();
    return parseStooqCsv(csv);
  } catch { return null; }
}

function useLivePrices() {
  const [prices, setPrices] = useState(FALLBACK_PRICES);
  const [krwRate, setKrwRate] = useState(FALLBACK_KRW);
  const [priceError, setPriceError] = useState(null);
  const [dailyChanges, setDailyChanges] = useState({});

  const fetch_ = useCallback(async () => {
    // ── 1. KRW rate (always from er-api, reliable) ────────────────────────
    let newKrw = FALLBACK_KRW;
    try {
      const fxR = await fetch('https://open.er-api.com/v6/latest/USD');
      const fxD = await fxR.json();
      if (fxD.rates?.KRW) newKrw = fxD.rates.KRW;
    } catch {}

    // ── 2. Check localStorage cache (TTL = 10 min) ────────────────────────
    let cache = {};
    try { cache = JSON.parse(localStorage.getItem(STOOQ_CACHE_KEY) || '{}'); } catch {}
    const now = Date.now();
    const cacheAge = now - (cache.ts || 0);
    const cacheValid = cacheAge < STOOQ_CACHE_TTL && cache.prices;

    let newPrices, newChanges;

    if (cacheValid) {
      newPrices  = cache.prices;
      newChanges = cache.changes || {};
    } else {
      // ── 3. Fetch all three metals from Stooq in parallel ─────────────
      const [gd, sd, pd] = await Promise.all([
        fetchStooqMetal(STOOQ_SYMBOLS.gold),
        fetchStooqMetal(STOOQ_SYMBOLS.silver),
        fetchStooqMetal(STOOQ_SYMBOLS.platinum),
      ]);

      newPrices = {
        gold:     gd  ? gd.close  : (cache.prices?.gold     || FALLBACK_PRICES.gold),
        silver:   sd  ? sd.close  : (cache.prices?.silver   || FALLBACK_PRICES.silver),
        platinum: pd  ? pd.close  : (cache.prices?.platinum || FALLBACK_PRICES.platinum),
      };

      // ── 4. Compute day-over-day % change from prev close ─────────────
      newChanges = {};
      const stale = !gd && !sd && !pd;
      if (!stale) {
        const pairs = [
          ['gold',     gd ],
          ['silver',   sd ],
          ['platinum', pd ],
        ];
        for (const [metal, data] of pairs) {
          if (data && data.prevClose && data.close) {
            const pct = ((data.close - data.prevClose) / data.prevClose * 100);
            newChanges[metal] = pct.toFixed(2);
          } else if (cache.changes?.[metal]) {
            // Fallback: keep last known change, mark as stale
            newChanges[metal] = cache.changes[metal];
          }
        }
      } else {
        // All requests failed — reuse cached changes if available
        newChanges = cache.changes || {};
      }

      // ── 5. KRW % change (still via er-api, no prev-close available) ──
      if (cache.krw && newKrw) {
        const krwPct = ((newKrw - cache.krw) / cache.krw * 100);
        if (Math.abs(krwPct) < 5) { // sanity check: ignore >5% swings (stale cache)
          newChanges.krw = krwPct.toFixed(2);
        }
      }

      // ── 6. Persist to cache ────────────────────────────────────────────
      try {
        localStorage.setItem(STOOQ_CACHE_KEY, JSON.stringify({
          ts: now, prices: newPrices, changes: newChanges, krw: newKrw,
        }));
      } catch {}
    }

    setPrices(newPrices);
    setKrwRate(newKrw);
    setDailyChanges(newChanges);
    setPriceError(null);
  }, []);

  useEffect(() => {
    fetch_();
    const t = setInterval(fetch_, 10 * 60 * 1000); // 10-minute refresh
    return () => clearInterval(t);
  }, [fetch_]);

  return { prices, krwRate, priceError, dailyChanges };
}

// Keep getDailyChangeData exported for any legacy import (no-op stub)
function getDailyChangeData() { return {}; }

// A-2: News hook with deduplication + new reliable feeds
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
              .then(d => (!d || d.status !== "ok") ? [] : d.items.map(i => ({
                title: i.title || "",
                link: i.link || "#",
                pubDate: i.pubDate || new Date().toISOString(),
                source: feed.source,
                category: feed.category,
                snippet: (i.description || "").replace(/<[^>]*>/g, "").trim().slice(0, 200)
              })))
              .catch(() => [])
          )
        );
        if (!cancelled) {
          const all = res.flatMap(r => r.status === "fulfilled" ? r.value : []);
          // Deduplication by title
          const seen = new Set();
          const unique = all.filter(a => {
            const key = a.title.toLowerCase().trim();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setArticles(unique.length >= 4 ? unique.slice(0, 12) : STATIC_NEWS);
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

// ═══════════════════════════════════════════════════════════════════════════════
// WHY SILVER
// ═══════════════════════════════════════════════════════════════════════════════
const WHY_SILVER_STATS = [
  { value: "67 Moz", label: "2026 공급 부족" },
  { value: "6년째", label: "연속 공급 부족" },
  { value: ">60%", label: "산업·기술 수요 비중" },
  { value: "품귀", label: "한국 은행 은 공급" },
];

const WHY_SILVER_REASONS = [
  { icon: "⚡", titleKo: "산업의 필수 금속", titleEn: "Industrial Backbone", body: "태양광 패널, 전기차, 5G 전자기기, AI 데이터센터, 방위산업 모두 은에 의존합니다. 이 수요는 구조적이며 가속화되고 있습니다.", stat: ">60%", statLabel: "산업·기술 글로벌 수요 비중 (2026)" },
  { icon: "📉", titleKo: "구조적 공급 부족", titleEn: "Structural Supply Deficit", body: "은 시장은 2026년 6년 연속 부족을 기록하며, 6,700만 온스 부족이 예상됩니다. 중국의 수출 통제 강화로 공급이 더욱 타이트해졌습니다.", stat: "67 Moz", statLabel: "2026년 예상 공급 부족" },
  { icon: "🏅", titleKo: "한국 접근 프리미엄", titleEn: "Korean Access Premium", body: "한국 은행들은 만성적인 부족으로 은바 판매를 반복적으로 중단했습니다. Aurum은 국제 현물가로 해외 배분 방식을 통해 이 문제를 해결합니다.", stat: "+394%", statLabel: "최근 10년 금 수익률 (KRW 기준)" },
];

export { API, FALLBACK_PRICES, FALLBACK_KRW, MARKET_FACTS, PRODUCTS, MOCK_HOLDINGS, MOCK_ORDERS_INIT, AUDIT_TRAIL_INIT, WHY_GOLD_REASONS, WHY_GOLD_STATS, WHY_SILVER_STATS, WHY_SILVER_REASONS, EDUCATION_ARTICLES, EDUCATION_CATEGORIES, STATIC_NEWS, RSS_FEEDS, getDailyChangeData, calcPrice, fUSD, fKRW, fDate, fDateLong, useIsMobile, useInView, useLivePrices, useNewsData, useToast };
