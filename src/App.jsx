import { useState, useEffect, useCallback } from "react";

// ─── Static Data ──────────────────────────────────────────────────────────────

const FALLBACK_PRICES = { gold: 2347.80, silver: 28.45, platinum: 982.30 };
const FALLBACK_KRW = 1365.20;

const PRODUCTS = [
  { id: 1, name: "1oz Gold Bar - PAMP Suisse", nameKo: "1온스 금바 - PAMP 스위스", metal: "gold", type: "bar", weight: "1 oz", purity: "99.99%", mint: "PAMP Suisse", premium: 0.035, image: "🥇" },
  { id: 2, name: "1kg Gold Bar - Heraeus", nameKo: "1kg 금바 - 헤레우스", metal: "gold", type: "bar", weight: "1 kg", purity: "99.99%", mint: "Heraeus", premium: 0.025, image: "🥇" },
  { id: 3, name: "1oz Gold Maple Leaf", nameKo: "1온스 골드 메이플리프", metal: "gold", type: "coin", weight: "1 oz", purity: "99.99%", mint: "Royal Canadian Mint", premium: 0.045, image: "🪙" },
  { id: 4, name: "1oz Gold Krugerrand", nameKo: "1온스 골드 크루거랜드", metal: "gold", type: "coin", weight: "1 oz", purity: "91.67%", mint: "South African Mint", premium: 0.04, image: "🪙" },
  { id: 5, name: "100oz Silver Bar - PAMP", nameKo: "100온스 은바 - PAMP", metal: "silver", type: "bar", weight: "100 oz", purity: "99.99%", mint: "PAMP Suisse", premium: 0.04, image: "🥈" },
  { id: 6, name: "1oz Silver Maple Leaf", nameKo: "1온스 실버 메이플리프", metal: "silver", type: "coin", weight: "1 oz", purity: "99.99%", mint: "Royal Canadian Mint", premium: 0.06, image: "🥈" },
  { id: 7, name: "1kg Silver Bar - Heraeus", nameKo: "1kg 은바 - 헤레우스", metal: "silver", type: "bar", weight: "1 kg", purity: "99.99%", mint: "Heraeus", premium: 0.035, image: "🥈" },
  { id: 8, name: "10oz Gold Bar - Valcambi", nameKo: "10온스 금바 - 발캄비", metal: "gold", type: "bar", weight: "10 oz", purity: "99.99%", mint: "Valcambi", premium: 0.028, image: "🥇" },
];

const HOLDINGS = [
  { id: 1, product: "1oz Gold Bar - PAMP Suisse", serial: "PAMP-2026-44891", purchasePrice: 2389.50, purchaseDate: "2026-03-15", weight: "1 oz", metal: "gold", vault: "Singapore - Malca-Amit FTZ" },
  { id: 2, product: "100oz Silver Bar - PAMP", serial: "PAMP-AG-77234", purchasePrice: 2920.00, purchaseDate: "2026-03-20", weight: "100 oz", metal: "silver", vault: "Singapore - Malca-Amit FTZ" },
  { id: 3, product: "1oz Gold Maple Leaf", serial: "RCM-ML-88123", purchasePrice: 2445.20, purchaseDate: "2026-04-01", weight: "1 oz", metal: "gold", vault: "Singapore - Malca-Amit FTZ" },
];

const WHY_GOLD = [
  { title: "김치 프리미엄 절약", titleEn: "Save on Kimchi Premium", icon: "💰", desc: "한국 KRX 금 시장은 지속적으로 5-15% 프리미엄이 붙습니다. 글로벌 현물가로 구매하여 즉시 절약하세요.", descEn: "The Korean KRX gold market consistently carries a 5-15% premium. Buy at global spot prices and save immediately." },
  { title: "세금 혜택", titleEn: "Tax Advantages", icon: "🏛️", desc: "싱가포르에 보관하는 동안 한국 부가가치세와 관세가 면제됩니다.", descEn: "No Korean VAT or customs duties while stored in Singapore." },
  { title: "관할권 다변화", titleEn: "Jurisdictional Diversification", icon: "🌏", desc: "세계적 수준의 싱가포르 볼트에 안전하게 보관하여 지정학적 리스크를 분산하세요.", descEn: "Diversify geopolitical risk by securely storing in world-class Singapore vaults." },
  { title: "원화 헤지", titleEn: "KRW Hedge", icon: "📊", desc: "금은 수세기 동안 통화 가치 하락에 대한 검증된 헤지 수단입니다.", descEn: "Gold has been a proven hedge against currency devaluation for centuries." },
  { title: "완전 배분 소유", titleEn: "Fully Allocated Ownership", icon: "🔒", desc: "귀하의 금은 고유 일련번호가 있는 실물 바와 코인으로 완전 배분됩니다.", descEn: "Your gold is fully allocated as specific serial-numbered bars and coins." },
  { title: "즉시 유동화", titleEn: "Instant Liquidity", icon: "⚡", desc: "언제든지 원클릭으로 보유 자산을 시장가에 매도하고 원화로 수령하세요.", descEn: "Sell your holdings at market price with one click anytime and receive KRW." },
];

const NEWS = [
  { date: "2026-04-08", title: "Gold Reaches $2,350 as Central Banks Continue Buying", ko: "중앙은행 매수 지속으로 금값 $2,350 도달" },
  { date: "2026-04-07", title: "Silver Demand Surges on Green Energy Push", ko: "그린 에너지 수요로 은 수요 급증" },
  { date: "2026-04-05", title: "Korean Won Weakens Against Dollar — Gold Hedge Interest Grows", ko: "원화 약세 지속 — 금 헤지 관심 증가" },
  { date: "2026-04-03", title: "Singapore Vaults Report Record Inflows from Asian Investors", ko: "싱가포르 볼트, 아시아 투자자 유입 사상 최고 기록" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcPrice(p, prices) {
  const spot = prices[p.metal] ?? prices.gold;
  const oz = p.weight.includes("kg") ? parseFloat(p.weight) * 32.1507 : parseFloat(p.weight);
  return spot * oz * (1 + p.premium);
}

function fUSD(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fKRW(n) { return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(n); }

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

// ─── Live Price Hook ──────────────────────────────────────────────────────────
// gold-api.com — completely free, no API key, no rate limits, CORS enabled
// open.er-api.com — free FX rates, no key required
// Both refresh every 60 seconds

function useLivePrices() {
  const [prices, setPrices] = useState(FALLBACK_PRICES);
  const [krwRate, setKrwRate] = useState(FALLBACK_KRW);
  const [priceError, setPriceError] = useState(null);

  const fetchPrices = useCallback(async () => {
    try {
      const [goldRes, silverRes, platRes, fxRes] = await Promise.all([
        fetch("https://api.gold-api.com/price/XAU"),
        fetch("https://api.gold-api.com/price/XAG"),
        fetch("https://api.gold-api.com/price/XPT"),
        fetch("https://open.er-api.com/v6/latest/USD"),
      ]);
      const [gold, silver, plat, fx] = await Promise.all([
        goldRes.json(), silverRes.json(), platRes.json(), fxRes.json(),
      ]);
      setPrices({ gold: gold.price, silver: silver.price, platinum: plat.price });
      if (fx.rates?.KRW) setKrwRate(fx.rates.KRW);
      setPriceError(null);
    } catch (err) {
      console.warn("Price fetch failed, using fallback:", err);
      setPriceError("가격 로딩 실패 — 최근 데이터 표시 중");
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, krwRate, priceError };
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
// FIX: Math.random() moved into useEffect — was causing render inconsistencies

function Ticker({ lang, prices, krwRate }) {
  const isMobile = useIsMobile();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const build = () => [
      { label: lang === "ko" ? "금" : "XAU", price: prices.gold + (Math.random() - 0.5) * prices.gold * 0.001, change: "+0.42%", up: true },
      { label: lang === "ko" ? "은" : "XAG", price: prices.silver + (Math.random() - 0.5) * prices.silver * 0.001, change: "+1.15%", up: true },
      { label: lang === "ko" ? "백금" : "XPT", price: prices.platinum + (Math.random() - 0.5) * prices.platinum * 0.001, change: "-0.23%", up: false },
      { label: "KRW/USD", price: krwRate + (Math.random() - 0.5) * krwRate * 0.001, change: "+0.18%", up: true },
    ];
    setItems(build());
    const interval = setInterval(() => setItems(build()), 3000);
    return () => clearInterval(interval);
  }, [lang, prices, krwRate]);

  return (
    <div style={{ background: "linear-gradient(90deg,#0d0d0d,#1a1510,#0d0d0d)", borderBottom: "1px solid #2a2318", padding: isMobile ? "8px 12px" : "10px 0" }}>
      <div style={{ display: "flex", justifyContent: isMobile ? "space-between" : "center", gap: isMobile ? 8 : 48, fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 10 : 13, flexWrap: isMobile ? "wrap" : "nowrap" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            <span style={{ color: "#8a7d6b" }}>{item.label}</span>
            <span style={{ color: "#c5a572", fontWeight: 600 }}>${item.price.toFixed(2)}</span>
            <span style={{ color: item.up ? "#4ade80" : "#f87171", fontSize: isMobile ? 8 : 11 }}>{item.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ page, setPage, lang, setLang, isLoggedIn, setIsLoggedIn }) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { key: "shop", label: lang === "ko" ? "매장" : "Shop" },
    { key: "why", label: lang === "ko" ? "왜 금인가" : "Why Gold" },
    { key: "storage", label: lang === "ko" ? "보관" : "Storage" },
    { key: "learn", label: lang === "ko" ? "교육" : "Learn" },
  ];

  const navigate = (key) => { setPage(key); setMenuOpen(false); };

  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate("home")}>
      <div style={{ width: isMobile ? 30 : 36, height: isMobile ? 30 : 36, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 13 : 16, fontWeight: 700, color: "#0a0a0a" }}>Au</div>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 17 : 22, fontWeight: 600, color: "#c5a572", letterSpacing: 2 }}>AURUM KOREA</span>
    </div>
  );

  if (isMobile) return (
    <>
      <nav style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1510", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <Logo />
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#c5a572", fontSize: 22, cursor: "pointer" }}>{menuOpen ? "✕" : "☰"}</button>
      </nav>
      {menuOpen && (
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, background: "#0a0a0a", zIndex: 999, padding: 24, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          {links.map(x => (
            <button key={x.key} onClick={() => navigate(x.key)} style={{ background: page === x.key ? "rgba(197,165,114,0.1)" : "none", border: "none", color: page === x.key ? "#c5a572" : "#8a7d6b", fontSize: 18, fontFamily: "'Outfit',sans-serif", padding: "14px 0", textAlign: "left", cursor: "pointer", borderBottom: "1px solid #1a1510" }}>{x.label}</button>
          ))}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            {isLoggedIn && <button onClick={() => navigate("dashboard")} style={{ flex: 1, background: "none", border: "1px solid #c5a572", color: "#c5a572", padding: "10px", borderRadius: 4, fontSize: 14, cursor: "pointer" }}>{lang === "ko" ? "내 보유자산" : "My Holdings"}</button>}
            <button onClick={() => { setIsLoggedIn(!isLoggedIn); setMenuOpen(false); }} style={{ flex: 1, background: isLoggedIn ? "transparent" : "linear-gradient(135deg,#c5a572,#8a6914)", border: isLoggedIn ? "1px solid #333" : "none", color: isLoggedIn ? "#888" : "#0a0a0a", padding: "10px", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{isLoggedIn ? (lang === "ko" ? "로그아웃" : "Logout") : (lang === "ko" ? "로그인" : "Login")}</button>
            <button onClick={() => { setLang(lang === "en" ? "ko" : "en"); setMenuOpen(false); }} style={{ background: "none", border: "1px solid #2a2318", color: "#8a7d6b", padding: "10px 14px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>{lang === "en" ? "한국어" : "EN"}</button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <nav style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1510", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
      <Logo />
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {links.map(x => (
          <button key={x.key} onClick={() => setPage(x.key)} style={{ background: "none", border: "none", color: page === x.key ? "#c5a572" : "#8a7d6b", cursor: "pointer", fontSize: 14, fontFamily: "'Outfit',sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>{x.label}</button>
        ))}
        <div style={{ width: 1, height: 20, background: "#2a2318" }} />
        {isLoggedIn && <button onClick={() => setPage("dashboard")} style={{ background: "none", border: "1px solid #c5a572", color: "#c5a572", padding: "6px 16px", borderRadius: 4, fontSize: 13, cursor: "pointer" }}>{lang === "ko" ? "내 보유자산" : "My Holdings"}</button>}
        <button onClick={() => setIsLoggedIn(!isLoggedIn)} style={{ background: isLoggedIn ? "transparent" : "linear-gradient(135deg,#c5a572,#8a6914)", border: isLoggedIn ? "1px solid #333" : "none", color: isLoggedIn ? "#888" : "#0a0a0a", padding: "6px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{isLoggedIn ? (lang === "ko" ? "로그아웃" : "Logout") : (lang === "ko" ? "로그인" : "Login")}</button>
        <button onClick={() => setLang(lang === "en" ? "ko" : "en")} style={{ background: "none", border: "1px solid #2a2318", color: "#8a7d6b", padding: "4px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>{lang === "en" ? "한국어" : "EN"}</button>
      </div>
    </nav>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────

function Home({ lang, setPage, prices, krwRate }) {
  const isMobile = useIsMobile();
  const krxPrice = prices.gold * krwRate * 1.10;
  const aurumPrice = prices.gold * krwRate * 1.035;
  const savings = krxPrice - aurumPrice;

  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", minHeight: isMobile ? 400 : 520, background: "linear-gradient(135deg,#0a0a0a,#1a1510 40%,#0d0b08)", display: "flex", alignItems: "center", padding: isMobile ? "32px 16px" : "0 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg,#c5a572 0,#c5a572 1px,transparent 1px,transparent 40px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: isMobile ? "100%" : 640 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 11 : 13, color: "#c5a572", letterSpacing: isMobile ? 2 : 4, textTransform: "uppercase", marginBottom: isMobile ? 12 : 20 }}>
            {lang === "ko" ? "싱가포르 보관 · 글로벌 가격 · 한국 고객" : "Singapore Vaulted · Global Pricing · Korea Focused"}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 32 : 52, fontWeight: 300, color: "#f5f0e8", lineHeight: 1.15, margin: "0 0 20px 0" }}>
            {lang === "ko"
              ? <><span style={{ color: "#c5a572", fontWeight: 600 }}>김치 프리미엄</span> 없이<br />금을 소유하세요</>
              : <>Own Gold<br /><span style={{ color: "#c5a572", fontWeight: 600 }}>Without the</span><br />Kimchi Premium</>}
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 17, color: "#8a7d6b", lineHeight: 1.7, margin: "0 0 28px 0" }}>
            {lang === "ko"
              ? "글로벌 현물가에 실물 금·은을 구매하고 세계 최고 수준의 싱가포르 볼트에 안전하게 보관하세요. 한국 VAT·관세 면제."
              : "Buy physical gold and silver at global spot prices. Stored securely in world-class Singapore vaults. No Korean VAT or customs duties."}
          </p>
          <div style={{ display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row" }}>
            <button onClick={() => setPage("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 4, cursor: "pointer", letterSpacing: 1 }}>{lang === "ko" ? "매장 둘러보기" : "Browse Shop"}</button>
            <button onClick={() => setPage("why")} style={{ background: "transparent", color: "#c5a572", border: "1px solid #c5a572", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>{lang === "ko" ? "왜 금인가?" : "Why Gold?"}</button>
          </div>
        </div>
      </div>

      {/* Live Savings Strip */}
      <div style={{ background: "#111008", padding: isMobile ? "24px 16px" : "32px 80px", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 20 : 0 }}>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{lang === "ko" ? "김치 프리미엄 비교" : "Kimchi Premium Comparison"}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 28, color: "#f5f0e8" }}>{lang === "ko" ? "1온스 금 구매 시 절약 금액" : "Your Savings on 1oz Gold"}</div>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 10 : 40, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", flex: isMobile ? 1 : "none" }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 4 }}>KRX ~10%</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 24, color: "#f87171" }}>{fKRW(krxPrice)}</div>
            </div>
            <div style={{ textAlign: "center", flex: isMobile ? 1 : "none" }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 4 }}>AURUM 3.5%</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 24, color: "#4ade80" }}>{fKRW(aurumPrice)}</div>
            </div>
            <div style={{ textAlign: "center", flex: isMobile ? "1 1 100%" : "none", background: "rgba(74,222,128,0.08)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)" }}>
              <div style={{ fontSize: 11, color: "#4ade80", marginBottom: 4 }}>{lang === "ko" ? "절약" : "Save"}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 24, color: "#4ade80", fontWeight: 700 }}>{fKRW(savings)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div style={{ background: "#0a0a0a", padding: isMobile ? "24px 16px" : "40px 80px", display: "flex", justifyContent: "center", gap: isMobile ? 16 : 64, flexWrap: "wrap" }}>
        {[{ icon: "🏦", label: "Malca-Amit" }, { icon: "📜", label: "LBMA" }, { icon: "🛡️", label: lang === "ko" ? "완전 보험" : "Insured" }, { icon: "🔐", label: lang === "ko" ? "완전 배분" : "Allocated" }, { icon: "🇸🇬", label: "Singapore FTZ" }].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: isMobile ? 11 : 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>
            <span style={{ fontSize: isMobile ? 16 : 20 }}>{x.icon}</span>{x.label}
          </div>
        ))}
      </div>

      {/* News */}
      <div style={{ background: "#111008", padding: isMobile ? "24px 16px" : "32px 80px", borderTop: "1px solid #1a1510" }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>{lang === "ko" ? "최신 뉴스" : "Latest News"}</div>
        {NEWS.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 8 : 16, padding: "10px 0", borderBottom: i < NEWS.length - 1 ? "1px solid #1a1510" : "none", flexDirection: isMobile ? "column" : "row" }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>{n.date}</span>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 15, color: "#ddd" }}>{lang === "ko" ? n.ko : n.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shop ─────────────────────────────────────────────────────────────────────

function Shop({ lang, setPage, setProduct, prices, krwRate }) {
  const isMobile = useIsMobile();
  const [metalFilter, setMetalFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const filtered = PRODUCTS.filter(p => (metalFilter === "all" || p.metal === metalFilter) && (typeFilter === "all" || p.type === typeFilter));

  const FilterBtn = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{ background: active ? "#c5a572" : "transparent", color: active ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${active ? "#c5a572" : "#2a2318"}`, padding: isMobile ? "6px 14px" : "8px 20px", borderRadius: 4, cursor: "pointer", fontSize: isMobile ? 12 : 13, fontFamily: "'Outfit',sans-serif", fontWeight: active ? 600 : 400 }}>{children}</button>
  );

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 36, color: "#f5f0e8", fontWeight: 300, margin: "0 0 6px 0" }}>{lang === "ko" ? "귀금속 매장" : "Precious Metals Shop"}</h2>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 14, color: "#8a7d6b", margin: "0 0 24px 0" }}>{lang === "ko" ? "글로벌 현물가 + 투명한 프리미엄" : "Global spot + transparent premium"}</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <FilterBtn active={metalFilter === "all"} onClick={() => setMetalFilter("all")}>{lang === "ko" ? "전체" : "All"}</FilterBtn>
        <FilterBtn active={metalFilter === "gold"} onClick={() => setMetalFilter("gold")}>{lang === "ko" ? "금" : "Gold"}</FilterBtn>
        <FilterBtn active={metalFilter === "silver"} onClick={() => setMetalFilter("silver")}>{lang === "ko" ? "은" : "Silver"}</FilterBtn>
        <div style={{ width: 1, height: 28, background: "#2a2318", alignSelf: "center", margin: "0 4px" }} />
        <FilterBtn active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>{lang === "ko" ? "전체" : "All"}</FilterBtn>
        <FilterBtn active={typeFilter === "bar"} onClick={() => setTypeFilter("bar")}>{lang === "ko" ? "바" : "Bars"}</FilterBtn>
        <FilterBtn active={typeFilter === "coin"} onClick={() => setTypeFilter("coin")}>{lang === "ko" ? "코인" : "Coins"}</FilterBtn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(280px,1fr))", gap: isMobile ? 16 : 24 }}>
        {filtered.map(p => {
          const price = calcPrice(p, prices);
          return (
            <div key={p.id} onClick={() => { setProduct(p); setPage("product"); }} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 16 : 24, cursor: "pointer", position: "relative" }}>
              <span style={{ position: "absolute", top: 10, right: 10, background: p.metal === "gold" ? "rgba(197,165,114,0.15)" : "rgba(180,180,180,0.15)", color: p.metal === "gold" ? "#c5a572" : "#aaa", fontSize: 10, padding: "2px 6px", borderRadius: 3 }}>{p.type === "bar" ? (lang === "ko" ? "바" : "Bar") : (lang === "ko" ? "코인" : "Coin")}</span>
              <div style={{ fontSize: isMobile ? 36 : 48, marginBottom: 12 }}>{p.image}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 14, color: "#f5f0e8", fontWeight: 500, marginBottom: 3 }}>{lang === "ko" ? p.nameKo : p.name}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 12 }}>{p.mint} · {p.purity} · {p.weight}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 18, color: "#c5a572", fontWeight: 600 }}>{fUSD(price)}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666" }}>{fKRW(price * krwRate)}</div>
                </div>
                <div style={{ fontSize: 10, color: "#8a7d6b" }}>+{(p.premium * 100).toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────────

function ProductPage({ product, lang, setPage, prices, krwRate, isLoggedIn }) {
  const isMobile = useIsMobile();
  const [storageOption, setStorageOption] = useState("singapore");
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const unitPrice = calcPrice(product, prices);
  const dutyFee = storageOption === "korea" ? unitPrice * 0.18 : 0;
  const total = (unitPrice + dutyFee) * qty;

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert(lang === "ko" ? "구매하려면 먼저 로그인하세요." : "Please log in to purchase.");
      return;
    }
    // TODO: Wire to Toss Payments via /api/checkout
    alert(lang === "ko" ? "결제 시스템 연동 준비 중입니다." : "Payment integration coming soon.");
  };

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <button onClick={() => setPage("shop")} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 13, marginBottom: 20 }}>← {lang === "ko" ? "매장으로" : "Back to Shop"}</button>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 60 }}>
        <div style={{ background: "#111008", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: isMobile ? 200 : 400, border: "1px solid #1a1510" }}>
          <div style={{ fontSize: isMobile ? 80 : 120 }}>{product.image}</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{product.mint}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 24 : 32, color: "#f5f0e8", fontWeight: 400, margin: "0 0 6px 0" }}>{lang === "ko" ? product.nameKo : product.name}</h1>
          <div style={{ fontSize: 12, color: "#8a7d6b", marginBottom: 20 }}>{product.purity} · {product.weight}</div>

          {/* Price Breakdown */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 16 : 24, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "현물가" : "Spot"}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#ddd" }}>{fUSD(unitPrice / (1 + product.premium))}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "프리미엄" : "Premium"} ({(product.premium * 100).toFixed(1)}%)</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#c5a572" }}>+{fUSD(unitPrice - unitPrice / (1 + product.premium))}</span>
            </div>
            {storageOption === "korea" && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "한국 관세/VAT ~18%" : "Korea Duties ~18%"}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#f87171" }}>+{fUSD(dutyFee)}</span>
              </div>
            )}
            <div style={{ borderTop: "1px solid #2a2318", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#f5f0e8", fontWeight: 600 }}>{lang === "ko" ? "단가" : "Unit Price"}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 22, color: "#c5a572", fontWeight: 600 }}>{fUSD(unitPrice + dutyFee)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#666" }}>{fKRW((unitPrice + dutyFee) * krwRate)}</div>
              </div>
            </div>
          </div>

          {/* Storage */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#8a7d6b", marginBottom: 8 }}>{lang === "ko" ? "보관 옵션" : "Storage Option"}</div>
            <div style={{ display: "flex", gap: 10, flexDirection: isMobile ? "column" : "row" }}>
              {[{ key: "singapore", label: lang === "ko" ? "🇸🇬 싱가포르 보관" : "🇸🇬 Singapore Vault", sub: lang === "ko" ? "VAT 면제 · 연 0.8%" : "No VAT · 0.8%/yr" },
                { key: "korea", label: lang === "ko" ? "🇰🇷 한국 배송" : "🇰🇷 Ship to Korea", sub: "~18% duties" }
              ].map(o => (
                <button key={o.key} onClick={() => setStorageOption(o.key)} style={{ flex: 1, background: storageOption === o.key ? "rgba(197,165,114,0.08)" : "transparent", border: `1px solid ${storageOption === o.key ? "#c5a572" : "#2a2318"}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontSize: 13, color: "#f5f0e8", marginBottom: 2 }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: storageOption === o.key ? "#4ade80" : "#8a7d6b" }}>{o.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "#8a7d6b" }}>{lang === "ko" ? "수량" : "Qty"}</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2318", borderRadius: 4 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "8px 12px", fontSize: 18 }}>−</button>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#f5f0e8", padding: "0 12px" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "8px 12px", fontSize: 18 }}>+</button>
            </div>
          </div>

          {/* Total */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#f5f0e8" }}>{lang === "ko" ? "총액" : "Total"}</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 20 : 26, color: "#c5a572", fontWeight: 700 }}>{fUSD(total)}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#666" }}>{fKRW(total * krwRate)}</div>
            </div>
          </div>

          <button onClick={handleBuyNow} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: 16, fontSize: 16, fontWeight: 700, borderRadius: 6, cursor: "pointer", letterSpacing: 1 }}>
            {lang === "ko" ? "지금 구매하기" : "Buy Now"}
          </button>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
            {["💳 Toss Pay", "🏧 카드", "🏦 Wire"].map((x, i) => <span key={i} style={{ fontSize: 11, color: "#666" }}>{x}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Why Gold ─────────────────────────────────────────────────────────────────

function WhyGold({ lang }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
        <div style={{ fontSize: 12, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>{lang === "ko" ? "왜 금인가" : "Why Gold"}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 28 : 40, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "실물 금 투자의 핵심 원칙" : "Core Principles of Physical Gold"}</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 16 : 24, marginBottom: isMobile ? 32 : 60 }}>
        {WHY_GOLD.map((x, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 20 : 32 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{x.icon}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 18 : 22, color: "#c5a572", fontWeight: 500, margin: "0 0 8px 0" }}>{lang === "ko" ? x.title : x.titleEn}</h3>
            <p style={{ fontSize: isMobile ? 13 : 14, color: "#8a7d6b", lineHeight: 1.7, margin: 0 }}>{lang === "ko" ? x.desc : x.descEn}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 24 : 48 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 28, color: "#f5f0e8", fontWeight: 300, margin: "0 0 20px 0" }}>{lang === "ko" ? "글로벌 리스크 & 자산 보전" : "Global Risks & Wealth Preservation"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 32 }}>
          {[{ t: lang === "ko" ? "통화 가치 하락" : "Currency Devaluation", d: lang === "ko" ? "모든 법정화폐는 시간이 지남에 따라 구매력을 상실합니다." : "All fiat currencies lose purchasing power over time." },
            { t: lang === "ko" ? "지정학적 불확실성" : "Geopolitical Uncertainty", d: lang === "ko" ? "무역 전쟁, 지역 분쟁은 전통적 금융 자산에 위험을 초래합니다." : "Trade wars and conflicts pose risks to traditional assets." },
            { t: lang === "ko" ? "금융 시스템 리스크" : "Financial System Risk", d: lang === "ko" ? "은행 위기, 양적완화, 과도한 부채는 시스템적 취약성을 증가시킵니다." : "Banking crises and excessive debt increase systemic vulnerabilities." },
            { t: lang === "ko" ? "인플레이션 헤지" : "Inflation Hedge", d: lang === "ko" ? "중앙은행의 통화 팽창 정책에 대한 가장 검증된 보호 수단입니다." : "The most proven protection against monetary expansion." }
          ].map((x, i) => (
            <div key={i} style={{ padding: "16px 0", borderBottom: i < 2 ? "1px solid #1a1510" : "none" }}>
              <h4 style={{ fontSize: 15, color: "#c5a572", margin: "0 0 6px 0" }}>{x.t}</h4>
              <p style={{ fontSize: 13, color: "#8a7d6b", lineHeight: 1.6, margin: 0 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Storage ──────────────────────────────────────────────────────────────────

function Storage({ lang }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
        <div style={{ fontSize: 12, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>{lang === "ko" ? "싱가포르 보관" : "Singapore Storage"}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 40, color: "#f5f0e8", fontWeight: 300, margin: "0 0 12px 0" }}>{lang === "ko" ? "세계 최고 수준의 볼트 보관" : "World-Class Vault Storage"}</h2>
        <p style={{ fontSize: isMobile ? 13 : 15, color: "#8a7d6b", maxWidth: 600, margin: "0 auto" }}>{lang === "ko" ? "Malca-Amit 싱가포르 FTZ 볼트에서 완전 배분, 완전 보험 보관." : "Fully allocated, insured storage at Malca-Amit Singapore FTZ."}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 12 : 24, marginBottom: isMobile ? 28 : 48 }}>
        {[{ icon: "🔐", title: lang === "ko" ? "완전 배분" : "Allocated", desc: lang === "ko" ? "고유 일련번호 실물 배분." : "Specific serial-numbered allocation." },
          { icon: "🛡️", title: lang === "ko" ? "완전 보험" : "Insured", desc: lang === "ko" ? "Lloyd's of London 보험 100% 보장." : "100% Lloyd's of London coverage." },
          { icon: "📋", title: lang === "ko" ? "정기 감사" : "Audited", desc: lang === "ko" ? "독립적 제3자 감사." : "Independent third-party audits." },
          { icon: "📸", title: lang === "ko" ? "사진 증명" : "Photos", desc: lang === "ko" ? "고해상도 사진 및 인증서." : "HD photos and certificates." },
          { icon: "🌏", title: "FTZ", desc: lang === "ko" ? "GST 면제 및 한국 VAT 회피." : "No GST, avoids Korean VAT." },
          { icon: "⚡", title: lang === "ko" ? "즉시 유동화" : "Liquid", desc: lang === "ko" ? "원클릭 매도, 원화 수령." : "One-click sell, receive KRW." }
        ].map((x, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 16 : 28 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{x.icon}</div>
            <h3 style={{ fontSize: isMobile ? 14 : 16, color: "#f5f0e8", margin: "0 0 6px 0" }}>{x.title}</h3>
            <p style={{ fontSize: 12, color: "#8a7d6b", lineHeight: 1.6, margin: 0 }}>{x.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 20 : 40, overflowX: "auto" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#c5a572", fontWeight: 400, margin: "0 0 20px 0" }}>{lang === "ko" ? "보관 수수료" : "Storage Fees"}</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
          <thead><tr style={{ borderBottom: "1px solid #2a2318" }}>
            {[lang === "ko" ? "보관 가치" : "Value", lang === "ko" ? "연간" : "Annual", lang === "ko" ? "최소" : "Min"].map((h, i) => <th key={i} style={{ textAlign: "left", padding: "10px 0", color: "#8a7d6b", fontSize: 12 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {[["< $50K", "0.80%", "$12/mo"], ["$50K–$250K", "0.65%", lang === "ko" ? "면제" : "Waived"], ["> $250K", "0.50%", lang === "ko" ? "면제" : "Waived"]].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1a1510" }}>
                <td style={{ padding: "12px 0", color: "#f5f0e8", fontSize: 13 }}>{row[0]}</td>
                <td style={{ padding: "12px 0", color: "#c5a572", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{row[1]}</td>
                <td style={{ padding: "12px 0", color: "#8a7d6b", fontSize: 13 }}>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ lang, prices, krwRate }) {
  const isMobile = useIsMobile();

  const totalGoldOz = HOLDINGS.filter(h => h.metal === "gold").reduce((acc, h) => acc + parseFloat(h.weight), 0);
  const totalSilverOz = HOLDINGS.filter(h => h.metal === "silver").reduce((acc, h) => acc + parseFloat(h.weight), 0);
  const totalValue = totalGoldOz * prices.gold + totalSilverOz * prices.silver;
  const totalCost = HOLDINGS.reduce((acc, h) => acc + h.purchasePrice, 0);
  const totalPnL = totalValue - totalCost;

  const getCurrentValue = (h) =>
    h.metal === "gold" ? prices.gold * parseFloat(h.weight) : prices.silver * parseFloat(h.weight);

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 24, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 4px 0" }}>{lang === "ko" ? "내 보유자산" : "My Holdings"}</h2>
          <p style={{ fontSize: 12, color: "#8a7d6b", margin: 0 }}>Malca-Amit Singapore FTZ</p>
        </div>
        <button style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "10px 20px", fontSize: 14, fontWeight: 600, borderRadius: 4, cursor: "pointer", width: isMobile ? "100%" : "auto" }}>+ {lang === "ko" ? "구매" : "Buy More"}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 16, marginBottom: 24 }}>
        {[
          { label: lang === "ko" ? "총 가치" : "Total Value", value: fUSD(totalValue), sub: fKRW(totalValue * krwRate), color: "#c5a572" },
          { label: lang === "ko" ? "금" : "Gold", value: `${totalGoldOz.toFixed(2)} oz`, sub: fUSD(totalGoldOz * prices.gold), color: "#c5a572" },
          { label: lang === "ko" ? "은" : "Silver", value: `${totalSilverOz.toFixed(0)} oz`, sub: fUSD(totalSilverOz * prices.silver), color: "#aaa" },
          { label: "P&L", value: `${totalPnL >= 0 ? "+" : ""}${fUSD(totalPnL)}`, sub: `${totalCost > 0 ? ((totalPnL / totalCost) * 100).toFixed(1) : "0"}%`, color: totalPnL >= 0 ? "#4ade80" : "#f87171" },
        ].map((card, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 12 : 20 }}>
            <div style={{ fontSize: 11, color: "#8a7d6b", marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 14 : 20, color: card.color, fontWeight: 600 }}>{card.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666", marginTop: 3 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {HOLDINGS.map(h => {
            const cur = getCurrentValue(h);
            const pnl = cur - h.purchasePrice;
            return (
              <div key={h.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, color: "#f5f0e8", fontWeight: 500 }}>{h.product}</div>
                  <button style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "4px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>{lang === "ko" ? "매도" : "Sell"}</button>
                </div>
                <div style={{ fontSize: 11, color: "#8a7d6b", marginBottom: 8 }}>{h.serial} · {h.weight}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><div style={{ fontSize: 10, color: "#8a7d6b" }}>{lang === "ko" ? "매수가" : "Buy"}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#ddd" }}>{fUSD(h.purchasePrice)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8a7d6b" }}>{lang === "ko" ? "현재가" : "Now"}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{fUSD(cur)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8a7d6b" }}>P&L</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: pnl >= 0 ? "#4ade80" : "#f87171" }}>{pnl >= 0 ? "+" : ""}{fUSD(pnl)}</div></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr style={{ background: "#0d0b08" }}>
              {["Product", "Serial", "Buy Price", "Current", "P&L", "Vault", ""].map((h, i) => <th key={i} style={{ textAlign: "left", padding: "12px 14px", color: "#8a7d6b", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {HOLDINGS.map(h => {
                const cur = getCurrentValue(h);
                const pnl = cur - h.purchasePrice;
                return (
                  <tr key={h.id} style={{ borderBottom: "1px solid #1a1510" }}>
                    <td style={{ padding: 14, color: "#f5f0e8", fontSize: 13 }}><div>{h.product}</div><div style={{ fontSize: 10, color: "#8a7d6b" }}>{h.weight} · {h.purchaseDate}</div></td>
                    <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#8a7d6b", fontSize: 12 }}>{h.serial}</td>
                    <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#ddd", fontSize: 13 }}>{fUSD(h.purchasePrice)}</td>
                    <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#c5a572", fontSize: 13 }}>{fUSD(cur)}</td>
                    <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: pnl >= 0 ? "#4ade80" : "#f87171", fontSize: 13 }}>{pnl >= 0 ? "+" : ""}{fUSD(pnl)}</td>
                    <td style={{ padding: 14, fontSize: 11, color: "#8a7d6b" }}>🇸🇬 Malca-Amit</td>
                    <td style={{ padding: 14 }}><button style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "5px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Sell</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Learn ────────────────────────────────────────────────────────────────────

function Learn({ lang, prices, krwRate }) {
  const isMobile = useIsMobile();
  const sections = [
    { cat: lang === "ko" ? "초보자 가이드" : "Beginner's Guide", items: [
      { title: lang === "ko" ? "실물 금 vs ETF vs 종이 금" : "Physical Gold vs ETFs vs Paper", time: "8 min" },
      { title: lang === "ko" ? "금 순도 이해하기" : "Understanding Gold Purity", time: "5 min" },
      { title: lang === "ko" ? "바 vs 코인" : "Bars vs Coins: Which?", time: "6 min" },
      { title: lang === "ko" ? "김치 프리미엄 분석" : "Kimchi Premium Explained", time: "10 min" },
    ]},
    { cat: lang === "ko" ? "보관 & 보안" : "Storage & Security", items: [
      { title: lang === "ko" ? "싱가포르 보관의 장점" : "Singapore Storage Benefits", time: "7 min" },
      { title: lang === "ko" ? "완전 배분 vs 풀 저장" : "Allocated vs Pooled", time: "5 min" },
    ]},
    { cat: lang === "ko" ? "시장 분석" : "Market Analysis", items: [
      { title: lang === "ko" ? "2026년 금값 전망" : "Gold Outlook 2026", time: "12 min" },
      { title: lang === "ko" ? "중앙은행 금 매수 트렌드" : "Central Bank Buying", time: "8 min" },
    ]},
  ];
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 48 }}>
        <div style={{ fontSize: 12, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>{lang === "ko" ? "교육 센터" : "Education"}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 40, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "귀금속 투자 가이드" : "Investment Guide"}</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: isMobile ? 20 : 32 }}>
        <div>
          {sections.map((s, si) => (
            <div key={si} style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px 0" }}>{s.cat}</h3>
              {s.items.map((item, ii) => (
                <div key={ii} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "12px" : "12px 16px", background: "#111008", border: "1px solid #1a1510", borderRadius: 6, marginBottom: 6, cursor: "pointer" }}>
                  <span style={{ fontSize: isMobile ? 13 : 14, color: "#f5f0e8" }}>{item.title}</span>
                  <span style={{ fontSize: 11, color: "#8a7d6b", whiteSpace: "nowrap", marginLeft: 8 }}>{item.time}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 16 : 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, color: "#c5a572", margin: "0 0 12px 0" }}>{lang === "ko" ? "오늘의 시장" : "Market Today"}</h3>
            {[{ label: lang === "ko" ? "금" : "Gold XAU", price: fUSD(prices.gold), change: "+0.42%" },
              { label: lang === "ko" ? "은" : "Silver XAG", price: fUSD(prices.silver), change: "+1.15%" },
              { label: "KRW/USD", price: `₩${krwRate.toFixed(0)}`, change: "+0.18%" }
            ].map((x, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? "1px solid #1a1510" : "none" }}>
                <span style={{ fontSize: 13, color: "#ddd" }}>{x.label}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{x.price}</div>
                  <div style={{ fontSize: 10, color: "#4ade80" }}>{x.change}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(197,165,114,0.05)", border: "1px solid #c5a572", borderRadius: 8, padding: isMobile ? 16 : 24 }}>
            <h3 style={{ fontSize: 14, color: "#c5a572", margin: "0 0 6px 0" }}>{lang === "ko" ? "무료 가이드" : "Free Guide"}</h3>
            <p style={{ fontSize: 12, color: "#8a7d6b", margin: "0 0 12px 0", lineHeight: 1.5 }}>{lang === "ko" ? "한국 투자자를 위한 해외 금 투자 가이드 (PDF)" : "Offshore Gold Guide for Korean Investors (PDF)"}</p>
            <button style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: 10, fontSize: 13, fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>{lang === "ko" ? "다운로드" : "Download"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ lang }) {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid #1a1510", padding: isMobile ? "28px 16px 16px" : "40px 80px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 20 : 40, marginBottom: isMobile ? 20 : 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0a0a0a" }}>Au</div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "#c5a572", letterSpacing: 2 }}>AURUM KOREA</span>
          </div>
          <p style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>{lang === "ko" ? "싱가포르 Pte Ltd. 귀금속 규제 딜러. AML/CFT 준수." : "Singapore Pte Ltd. Registered Dealer. AML/CFT Compliant."}</p>
        </div>
        {[{ title: lang === "ko" ? "매장" : "Shop", items: [lang === "ko" ? "금 바" : "Gold Bars", lang === "ko" ? "금 코인" : "Gold Coins", lang === "ko" ? "은" : "Silver"] },
          { title: lang === "ko" ? "정보" : "Info", items: [lang === "ko" ? "보관" : "Storage", lang === "ko" ? "수수료" : "Fees", "FAQ"] },
          { title: lang === "ko" ? "법률" : "Legal", items: [lang === "ko" ? "이용약관" : "Terms", lang === "ko" ? "개인정보" : "Privacy", "AML/KYC"] }
        ].map((col, ci) => (
          <div key={ci}>
            <h4 style={{ fontSize: 11, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px 0" }}>{col.title}</h4>
            {col.items.map((x, j) => <div key={j} style={{ fontSize: 12, color: "#555", marginBottom: 6, cursor: "pointer" }}>{x}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #1a1510", paddingTop: 12, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 6 }}>
        <span style={{ fontSize: 10, color: "#444" }}>© 2026 Aurum Korea Pte Ltd.</span>
        <span style={{ fontSize: 10, color: "#444" }}>{lang === "ko" ? "투자에는 위험이 따릅니다. 과거 수익률이 미래 수익을 보장하지 않습니다." : "Investing involves risk. Past performance does not guarantee future returns."}</span>
      </div>
    </footer>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("ko");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { prices, krwRate, priceError } = useLivePrices();

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div style={{ background: "#0a0a0a", color: "#f5f0e8", minHeight: "100vh", fontFamily: "'Outfit',sans-serif" }}>
      {priceError && (
        <div style={{ background: "#1a0a0a", borderBottom: "1px solid #f87171", padding: "6px 20px", fontSize: 11, color: "#f87171", textAlign: "center" }}>{priceError}</div>
      )}
      <Ticker lang={lang} prices={prices} krwRate={krwRate} />
      <Nav page={page} setPage={setPage} lang={lang} setLang={setLang} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {page === "home" && <Home lang={lang} setPage={setPage} prices={prices} krwRate={krwRate} />}
      {page === "shop" && <Shop lang={lang} setPage={setPage} setProduct={setSelectedProduct} prices={prices} krwRate={krwRate} />}
      {page === "product" && <ProductPage product={selectedProduct} lang={lang} setPage={setPage} prices={prices} krwRate={krwRate} isLoggedIn={isLoggedIn} />}
      {page === "why" && <WhyGold lang={lang} />}
      {page === "storage" && <Storage lang={lang} />}
      {page === "learn" && <Learn lang={lang} prices={prices} krwRate={krwRate} />}
      {page === "dashboard" && <Dashboard lang={lang} prices={prices} krwRate={krwRate} />}

      <Footer lang={lang} />
    </div>
  );
}
