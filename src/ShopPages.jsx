import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile, calcPrice, fUSD, fKRW, PRODUCTS, MOCK_ORDERS_INIT, API } from "./lib.jsx";
import { NewsSection } from "./BaseUI.jsx";

// ═══════════════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════════════
function Home({ lang, navigate, prices, krwRate }) {
  const isMobile = useIsMobile();
  const krxPrice = prices.gold * krwRate * 1.10;
  const aurumPrice = prices.gold * krwRate * 1.035;
  const savings = krxPrice - aurumPrice;
  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", minHeight: isMobile ? 420 : 540, background: "linear-gradient(135deg,#0a0a0a,#1a1510 40%,#0d0b08)", display: "flex", alignItems: "center", padding: isMobile ? "40px 16px" : "0 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "repeating-linear-gradient(45deg,#c5a572 0,#c5a572 1px,transparent 1px,transparent 40px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: isMobile ? "100%" : 660 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 10 : 12, color: "#c5a572", letterSpacing: isMobile ? 2 : 4, textTransform: "uppercase", marginBottom: isMobile ? 14 : 20 }}>
            {lang === "ko" ? "싱가포르 볼트 보관 · 글로벌 현물가 · 한국 고객 전용" : "Singapore Vaulted · Global Pricing · Korea Focused"}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 34 : 54, fontWeight: 300, color: "#f5f0e8", lineHeight: 1.12, margin: "0 0 20px" }}>
            {lang === "ko"
              ? <><span style={{ color: "#c5a572", fontWeight: 600 }}>김치 프리미엄</span> 없이<br />금을 소유하세요</>
              : <>Own Gold<br /><span style={{ color: "#c5a572", fontWeight: 600 }}>Without the</span><br />Kimchi Premium</>}
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 16, color: "#8a7d6b", lineHeight: 1.75, margin: "0 0 30px" }}>
            {lang === "ko"
              ? "글로벌 현물가에 실물 금·은을 구매하고 세계 최고 수준의 싱가포르 볼트에 안전하게 보관하세요. 한국 VAT·관세 면제."
              : "Buy physical gold and silver at global spot prices. Stored securely in world-class Singapore vaults. No Korean VAT or customs duties."}
          </p>
          <div style={{ display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row" }}>
            <button onClick={() => navigate("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 6, cursor: "pointer", letterSpacing: 0.5 }}>
              {lang === "ko" ? "매장 둘러보기 →" : "Browse Shop →"}
            </button>
            <button onClick={() => navigate("why")} style={{ background: "transparent", color: "#c5a572", border: "1px solid #c5a572", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 6, cursor: "pointer" }}>
              {lang === "ko" ? "왜 금인가?" : "Why Gold?"}
            </button>
          </div>
        </div>
      </div>

      {/* Kimchi Premium Comparison */}
      <div style={{ background: "#111008", padding: isMobile ? "24px 16px" : "32px 80px", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 20 : 0 }}>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{lang === "ko" ? "김치 프리미엄 비교" : "Kimchi Premium Comparison"}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 20 : 26, color: "#f5f0e8" }}>{lang === "ko" ? "1온스 금 구매 시 절약 금액" : "Your Savings on 1oz Gold"}</div>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 10 : 40, flexWrap: "wrap" }}>
            {[
              { label: lang === "ko" ? "KRX 가격" : "KRX Price", value: fKRW(krxPrice), col: "#f87171" },
              { label: lang === "ko" ? "Aurum 가격" : "Aurum Price", value: fKRW(aurumPrice), col: "#4ade80" },
              { label: lang === "ko" ? "절약" : "You Save", value: fKRW(savings), col: "#c5a572" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: isMobile ? "center" : "right" }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 15 : 19, color: s.col, fontWeight: 600 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div style={{ padding: isMobile ? "28px 16px" : "40px 80px", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 12 : 24 }}>
          {[
            { icon: "🇸🇬", ko: "Malca-Amit Singapore", en: "Malca-Amit Singapore", sub: lang === "ko" ? "싱가포르 FTZ 볼트" : "Singapore FTZ Vault" },
            { icon: "🛡️", ko: "Lloyd's of London", en: "Lloyd's of London", sub: lang === "ko" ? "100% 보험" : "100% Insured" },
            { icon: "💳", ko: "토스페이멘트", en: "Toss Payments", sub: lang === "ko" ? "한국어 결제" : "Korean Payments" },
            { icon: "⚡", ko: "당일 결제·즉시 승인", en: "Same-Day Settlement", sub: lang === "ko" ? "실시간 현물가 기준" : "Live Spot Pricing" },
          ].map((t, i) => (
            <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 14 : 22, textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 24 : 28, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 14, color: "#f5f0e8", marginBottom: 3 }}>{lang === "ko" ? t.ko : t.en}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 10 : 11, color: "#8a7d6b" }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ padding: isMobile ? "28px 16px" : "44px 80px", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? 16 : 24, flexWrap: "wrap", gap: 10 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 30, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "인기 상품" : "Featured Products"}</h2>
          <button onClick={() => navigate("shop")} style={{ background: "none", border: "1px solid #2a2318", color: "#c5a572", padding: "7px 18px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "전체 보기 →" : "View All →"}</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 16 }}>
          {PRODUCTS.slice(0, 4).map(p => {
            const price = calcPrice(p, { gold: prices.gold, silver: prices.silver, platinum: prices.platinum });
            return (
              <div key={p.id} onClick={() => { navigate("product"); }} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 14 : 20, cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(197,165,114,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1510"}>
                <div style={{ textAlign: "center", fontSize: isMobile ? 36 : 48, marginBottom: 10 }}>{p.image}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 13, color: "#f5f0e8", marginBottom: 4 }}>{lang === "ko" ? p.nameKo : p.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 13 : 16, color: "#c5a572", fontWeight: 600 }}>{fUSD(price)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#555", marginTop: 2 }}>{fKRW(price * krwRate)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* News */}
      <NewsSection lang={lang} />

      {/* AGP Banner */}
      <div style={{ background: "linear-gradient(135deg,rgba(197,165,114,0.08),rgba(197,165,114,0.04))", borderTop: "1px solid rgba(197,165,114,0.2)", borderBottom: "1px solid rgba(197,165,114,0.2)", padding: isMobile ? "28px 16px" : "40px 80px" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: isMobile ? 16 : 0 }}>
          <div style={{ maxWidth: 520 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Aurum Gold Plan (AGP)</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 28, color: "#f5f0e8", fontWeight: 300, margin: "0 0 8px" }}>
              {lang === "ko" ? "월 10만원부터 싱가포르 실물 금 저축" : "Save in physical gold from KRW 100,000/month"}
            </h3>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b", lineHeight: 1.65, margin: 0 }}>
              {lang === "ko" ? "그램 단위 적립, 싱가포르 실물 백업, 100g 도달 시 늬린 바로 무료 전환." : "Accumulate by the gram, physically backed in Singapore, convert to a real bar when you hit 100g — free."}
            </p>
          </div>
          <button onClick={() => navigate("agp")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "14px 32px", fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            {lang === "ko" ? "AGP 알아보기 →" : "Learn About AGP →"}
          </button>
        </div>
      </div>

      {/* Why Aurum */}
      <div style={{ padding: isMobile ? "32px 16px" : "56px 80px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 24 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 28px", textAlign: "center" }}>{lang === "ko" ? "염 아름을 선택하나요?" : "Why Choose Aurum?"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 12 : 20 }}>
          {[
            { icon: "🇸🇬", ko: "싱가포르 FTZ 볼트", en: "Singapore FTZ Vault", desc: lang === "ko" ? "Malca-Amit 1963년 설립. 한국 VAT 없이 토키었이 볼트에 보관." : "Est. 1963. Tokened in vaults without Korean VAT exposure." },
            { icon: "💰", ko: "국제 현물가", en: "International Spot Price", desc: lang === "ko" ? "KRX 가격 대비 10~15% 저렴. 김치 프리미엄 제로." : "10–15% cheaper than KRX. Zero kimchi premium." },
            { icon: "🇰🇷", ko: "한국어 우선 서비스", en: "Korean-First Service", desc: lang === "ko" ? "전 플랫폼 한국어, 카카오톡 고객지원, KRW 정산." : "Full Korean platform, KakaoTalk support, KRW settlement." },
          ].map((x, i) => (
            <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 20 : 28 }}>
              <div style={{ fontSize: isMobile ? 28 : 34, marginBottom: 12 }}>{x.icon}</div>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 15 : 17, color: "#f5f0e8", margin: "0 0 8px" }}>{lang === "ko" ? x.ko : x.en}</h3>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 13, color: "#8a7d6b", lineHeight: 1.65, margin: 0 }}>{x.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHOP
// ═══════════════════════════════════════════════════════════════════════════════
function Shop({ lang, navigate, setProduct, prices, krwRate, addToCart, toast }) {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const metals = ["all", "gold", "silver", "platinum"];
  const metalLabels = { all: lang === "ko" ? "전체" : "All", gold: lang === "ko" ? "금" : "Gold", silver: lang === "ko" ? "은" : "Silver", platinum: lang === "ko" ? "백금" : "Platinum" };

  const filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.metal === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return calcPrice(a, prices) - calcPrice(b, prices);
    if (sortBy === "price-desc") return calcPrice(b, prices) - calcPrice(a, prices);
    return 0;
  });

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "굿집" : "Shop"}</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {metals.map(m => (
            <button key={m} onClick={() => setFilter(m)} style={{ background: filter === m ? "#c5a572" : "transparent", color: filter === m ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${filter === m ? "#c5a572" : "#2a2318"}`, padding: "6px 16px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: filter === m ? 600 : 400 }}>{metalLabels[m]}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill,minmax(240px,1fr))", gap: isMobile ? 10 : 20 }}>
        {sorted.map(p => {
          const price = calcPrice(p, { gold: prices.gold, silver: prices.silver, platinum: prices.platinum });
          return (
            <div key={p.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(197,165,114,0.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1510"}>
              <div onClick={() => { setProduct(p); navigate("product"); }} style={{ padding: isMobile ? 14 : 22 }}>
                <div style={{ textAlign: "center", fontSize: isMobile ? 44 : 60, marginBottom: isMobile ? 10 : 16, padding: "10px 0" }}>{p.image}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{p.metal}</div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 15, color: "#f5f0e8", margin: "0 0 4px", fontWeight: 500 }}>{lang === "ko" ? p.nameKo : p.name}</h3>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 10 : 11, color: "#8a7d6b", margin: "0 0 12px", lineHeight: 1.4 }}>{p.specs}</p>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 15 : 18, color: "#c5a572", fontWeight: 600, marginBottom: 2 }}>{fUSD(price)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#555" }}>{fKRW(price * krwRate)}</div>
              </div>
              <div style={{ padding: isMobile ? "0 14px 14px" : "0 22px 18px" }}>
                <button onClick={() => { addToCart(p); toast(lang === "ko" ? `${p.nameKo}이 장바구니에 담겼습니다.` : `${p.name} added to cart.`); }} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: isMobile ? "9px" : "11px", fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif", borderRadius: 6, cursor: "pointer" }}>
                  {lang === "ko" ? "장바구니 담기" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ProductPage({ product, lang, navigate, prices, krwRate, user, setShowLogin, addToCart, toast }) {
  const isMobile = useIsMobile();
  const [qty, setQty] = useState(1);
  const [storage, setStorage] = useState("singapore");
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) return (
    <div style={{ padding: "80px", textAlign: "center", background: "#0a0a0a", minHeight: "70vh" }}>
      <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "상품을 선택해주세요." : "Please select a product."}</p>
      <button onClick={() => navigate("shop")} style={{ marginTop: 16, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "11px 24px", borderRadius: 6, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>{lang === "ko" ? "상품 보기" : "Browse Products"}</button>
    </div>
  );

  const price = calcPrice(product, { gold: prices.gold, silver: prices.silver, platinum: prices.platinum });
  const total = price * qty;
  const storageOptions = [
    { k: "singapore", ko: "싱가포르 FTZ 볼트", en: "Singapore FTZ Vault", desc: lang === "ko" ? "Malca-Amit · Lloyd's 100% 보험 · VAT 면제" : "Malca-Amit · Lloyd's 100% insured · No VAT", price: 0 },
    { k: "delivery", ko: "한국 배송", en: "Korea Delivery", desc: lang === "ko" ? "13% 관세/세금 적용 • DHL/FedEx 보험" : "13% import duty/tax • DHL/FedEx insured", price: total * 0.13 + 60 },
  ];
  const selStorage = storageOptions.find(o => o.k === storage);
  const grandTotal = total + (selStorage?.price || 0);

  const handleBuy = () => {
    if (!user) { setShowLogin(true); return; }
    addToCart(product, qty, storage);
    setAddedToCart(true);
    toast(lang === "ko" ? "장바구니에 담겼습니다!" : "Added to cart!");
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <button onClick={() => navigate("shop")} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "상품목록" : "Back to Shop"}</button>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 48, alignItems: "start" }}>
        {/* Left — product image + details */}
        <div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 28 : 44, textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: isMobile ? 80 : 120 }}>{product.image}</div>
            <div style={{ marginTop: 16, fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase" }}>{product.metal}</div>
          </div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, overflow: "hidden" }}>
            {[
              [lang === "ko" ? "스펙" : "Specifications", product.specs],
              [lang === "ko" ? "순도" : "Purity", product.purity],
              [lang === "ko" ? "인증" : "Certification", product.certification],
              [lang === "ko" ? "고시단 시세" : "Spot Rate", `${fUSD(prices[product.metal])}/oz`],
            ].filter(([,v]) => v).map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", borderBottom: i < 3 ? "1px solid #1a1510" : "none" }}>
                <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{l}</span>
                <span style={{ fontSize: 12, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — pricing, options, buy */}
        <div style={{ position: isMobile ? "static" : "sticky", top: 20 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 300, margin: "0 0 6px" }}>{lang === "ko" ? product.nameKo : product.name}</h1>
          <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", fontSize: 13, lineHeight: 1.6, margin: "0 0 22px" }}>{product.description}</p>

          {/* Price */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 26 : 32, color: "#c5a572", fontWeight: 600 }}>{fUSD(price)}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#555", marginTop: 2 }}>{fKRW(price * krwRate)}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginTop: 4 }}>
              {lang === "ko" ? `현물가 ${fUSD(prices[product.metal])}/oz + ${product.premium}% 프리미엄` : `Spot ${fUSD(prices[product.metal])}/oz + ${product.premium}% premium`}
            </div>
          </div>

          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "수량" : "Qty"}</span>
            {[1, 2, 5, 10].map(n => (
              <button key={n} onClick={() => setQty(n)} style={{ width: 36, height: 36, borderRadius: 6, background: qty === n ? "#c5a572" : "#111008", border: `1px solid ${qty === n ? "#c5a572" : "#2a2318"}`, color: qty === n ? "#0a0a0a" : "#8a7d6b", fontSize: 13, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: qty === n ? 700 : 400 }}>{n}</button>
            ))}
          </div>

          {/* Storage Options */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "보관 옵션" : "Storage Option"}</div>
            {storageOptions.map(o => (
              <div key={o.k} onClick={() => setStorage(o.k)} style={{ background: storage === o.k ? "rgba(197,165,114,0.06)" : "#111008", border: `1.5px solid ${storage === o.k ? "#c5a572" : "#1a1510"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.15s" }}>
                <div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#f5f0e8", fontWeight: 500 }}>{lang === "ko" ? o.ko : o.en}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginTop: 2 }}>{o.desc}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: o.price > 0 ? "#f87171" : "#4ade80", flexShrink: 0, marginLeft: 10 }}>{o.price > 0 ? `+${fUSD(o.price)}` : lang === "ko" ? "무료" : "Free"}</div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "바가" : "Subtotal"}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#f5f0e8" }}>{fUSD(total)}</span>
            </div>
            {selStorage?.price > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "보관/배송" : "Storage/Shipping"}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#f87171" }}>+{fUSD(selStorage.price)}</span>
              </div>
            )}
            <div style={{ borderTop: "1px solid #2a2318", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#f5f0e8", fontWeight: 600 }}>{lang === "ko" ? "합계" : "Total"}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, color: "#c5a572", fontWeight: 700 }}>{fUSD(grandTotal)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#555" }}>{fKRW(grandTotal * krwRate)}</div>
              </div>
            </div>
          </div>

          <button onClick={handleBuy} style={{ width: "100%", background: addedToCart ? "#1a4a2a" : "linear-gradient(135deg,#c5a572,#8a6914)", border: addedToCart ? "1px solid #4ade80" : "none", color: addedToCart ? "#4ade80" : "#0a0a0a", padding: "16px", fontSize: 16, fontWeight: 700, fontFamily: "'Outfit',sans-serif", borderRadius: 8, cursor: "pointer", transition: "all 0.2s", marginBottom: 10 }}>
            {addedToCart ? (lang === "ko" ? "장바구니에 담겼습니다 ✓" : "Added to Cart ✓") : (lang === "ko" ? "장바구니에 담기" : "Add to Cart")}
          </button>
          {!user && <p style={{ textAlign: "center", fontSize: 11, color: "#555", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "구매 시 로그인이 필요합니다." : "Login required to purchase."}</p>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CART PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function CartPage({ lang, navigate, cart, removeFromCart, updateCartQty, prices, krwRate }) {
  const isMobile = useIsMobile();

  if (cart.length === 0) return (
    <div style={{ padding: isMobile ? "60px 16px" : "80px", textAlign: "center", background: "#0a0a0a", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: "#f5f0e8", fontWeight: 300, marginBottom: 10 }}>{lang === "ko" ? "장바구니가 비어 있습니다" : "Your Cart is Empty"}</h2>
      <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 28 }}>{lang === "ko" ? "아름다운 굿집에서 구경하세요." : "Explore our collection of gold and silver."}</p>
      <button onClick={() => navigate("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 28px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "상품 보기" : "Browse Shop"}</button>
    </div>
  );

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 300, margin: "0 0 28px" }}>{lang === "ko" ? "장바구니" : "Cart"} ({cart.reduce((s, i) => s + i.qty, 0)})</h2>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 380px", gap: isMobile ? 20 : 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cart.map(item => (
            <div key={item.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 14 : 20, display: "flex", gap: isMobile ? 12 : 20, alignItems: "center" }}>
              <div style={{ fontSize: isMobile ? 32 : 44, flexShrink: 0 }}>{item.image}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 15, color: "#f5f0e8", fontWeight: 500, marginBottom: 3 }}>{lang === "ko" ? item.nameKo : item.name}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 8 }}>{lang === "ko" ? (item.storage === "singapore" ? "싱가폼르 FTZ 볼트" : "한국 배송") : (item.storage === "singapore" ? "Singapore Vault" : "Korea Delivery")}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {[1, 2, 5, 10].map(n => (
                    <button key={n} onClick={() => updateCartQty(item.id, n)} style={{ width: 28, height: 28, borderRadius: 4, background: item.qty === n ? "#c5a572" : "#111008", border: `1px solid ${item.qty === n ? "#c5a572" : "#2a2318"}`, color: item.qty === n ? "#0a0a0a" : "#8a7d6b", fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>{n}</button>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 14 : 18, color: "#c5a572", fontWeight: 600, marginBottom: 6 }}>{fUSD(item.price * item.qty)}</div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 18 : 26, height: "fit-content" }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#c5a572", fontWeight: 600, margin: "0 0 18px", textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "주문 요약" : "Order Summary"}</h3>
          {cart.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b" }}>{lang === "ko" ? item.nameKo : item.name} ×{item.qty}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#f5f0e8" }}>{fUSD(item.price * item.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #2a2318", paddingTop: 12, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#f5f0e8", fontWeight: 600 }}>{lang === "ko" ? "합계" : "Total"}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, color: "#c5a572", fontWeight: 700 }}>{fUSD(total)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#555" }}>{fKRW(total * krwRate)}</div>
              </div>
            </div>
          </div>
          <button onClick={() => navigate("checkout")} style={{ width: "100%", marginTop: 16, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "14px", fontSize: 15, fontWeight: 700, fontFamily: "'Outfit',sans-serif", borderRadius: 8, cursor: "pointer" }}>
            {lang === "ko" ? "결제하기 →" : "Proceed to Checkout →"}
          </button>
          <button onClick={() => navigate("shop")} style={{ width: "100%", marginTop: 8, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "11px", fontSize: 13, fontFamily: "'Outfit',sans-serif", borderRadius: 8, cursor: "pointer" }}>
            {lang === "ko" ? "쇼핑 계속" : "Continue Shopping"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════════
function Checkout({ lang, navigate, cart, clearCart, prices, krwRate, user, addOrder, toast }) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("toss");
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const orderId = useRef(`AK-${Date.now().toString(36).toUpperCase()}`);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const paymentMethods = [
    { k: "toss", label: "Toss Pay", desc: lang === "ko" ? "토스페이 / 커드 / 은행" : "Toss / Card / Bank Transfer", icon: "📱" },
    { k: "wire", label: lang === "ko" ? "전신환" : "Wire Transfer", desc: lang === "ko" ? "2.5% 프리미엄 (가장 낙은)" : "2.5% premium (lowest)", icon: "🏦" },
    { k: "crypto", label: lang === "ko" ? "크립토" : "Crypto", desc: lang === "ko" ? "USDT/USDC 2.0% 프리미엄" : "USDT/USDC 2.0% premium", icon: "🔐" },
  ];

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    setConfirmed(true);
    addOrder({
      id: orderId.current,
      date: new Date().toISOString().split("T")[0],
      items: cart.map(i => ({ name: i.name, nameKo: i.nameKo, image: i.image, qty: i.qty, unitPrice: i.price })),
      total,
      paymentMethod: method,
      status: "processing",
    });
    clearCart();
    toast(lang === "ko" ? "주문이 접수되었습니다!" : "Order placed!");
  };

  if (confirmed) return (
    <div style={{ padding: isMobile ? "60px 16px" : "80px", textAlign: "center", background: "#0a0a0a", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🥇</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#f5f0e8", fontWeight: 300, marginBottom: 10 }}>{lang === "ko" ? "주문이 접수되었습니다" : "Order Confirmed"}</h2>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#c5a572", marginBottom: 10 }}>{orderId.current}</div>
      <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", maxWidth: 400, lineHeight: 1.6, marginBottom: 28 }}>{lang === "ko" ? "48시간 이내에 볼트 인증서와 사진을 이메일로 발송해 드립니다." : "You'll receive vault certificate and photos within 48 hours."}</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => navigate("orders")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 24px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "주문 확인" : "View Orders"}</button>
        <button onClick={() => navigate("dashboard")} style={{ background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "12px 24px", borderRadius: 6, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "보유자산" : "Holdings"}</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 300, margin: "0 0 28px" }}>{lang === "ko" ? "결제" : "Checkout"}</h2>

      {step === 1 && (
        <div style={{ maxWidth: 560 }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#c5a572", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{lang === "ko" ? "결제 수단 선택" : "Payment Method"}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {paymentMethods.map(pm => (
              <div key={pm.k} onClick={() => setMethod(pm.k)} style={{ background: method === pm.k ? "rgba(197,165,114,0.07)" : "#111008", border: `1.5px solid ${method === pm.k ? "#c5a572" : "#1a1510"}`, borderRadius: 8, padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.15s" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 20 }}>{pm.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#f5f0e8", fontWeight: 500 }}>{pm.label}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b" }}>{pm.desc}</div>
                  </div>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${method === pm.k ? "#c5a572" : "#2a2318"}`, background: method === pm.k ? "#c5a572" : "transparent", flexShrink: 0 }} />
              </div>
            ))}
          </div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#f5f0e8", fontWeight: 600 }}>{lang === "ko" ? "합계" : "Total"}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, color: "#c5a572", fontWeight: 700 }}>{fUSD(total)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#555" }}>{fKRW(total * krwRate)}</div>
              </div>
            </div>
          </div>
          <button onClick={() => setStep(2)} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "15px", fontSize: 15, fontWeight: 700, fontFamily: "'Outfit',sans-serif", borderRadius: 8, cursor: "pointer" }}>
            {lang === "ko" ? "확인 후 결제" : "Review & Pay"} →
          </button>
          <button onClick={() => navigate("cart")} style={{ width: "100%", marginTop: 8, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "11px", fontSize: 13, fontFamily: "'Outfit',sans-serif", borderRadius: 8, cursor: "pointer" }}>
            {lang === "ko" ? "장바구니로" : "← Back to Cart"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: 560 }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#c5a572", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{lang === "ko" ? "주문 확인" : "Order Review"}</h3>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < cart.length - 1 ? "1px solid #1a1510" : "none" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 20 }}>{item.image}</span>
                  <div>
                    <div style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? item.nameKo : item.name}</div>
                    <div style={{ fontSize: 10, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>x{item.qty}</div>
                  </div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{fUSD(item.price * item.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, marginTop: 4, borderTop: "1px solid #2a2318" }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#f5f0e8", fontWeight: 600 }}>{lang === "ko" ? "합계" : "Total"}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, color: "#c5a572", fontWeight: 700 }}>{fUSD(total)}</span>
            </div>
          </div>
          <div style={{ background: "rgba(197,165,114,0.06)", border: "1px solid rgba(197,165,114,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 18 }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#c5a572", margin: 0, lineHeight: 1.6 }}>📍 {lang === "ko" ? "볼트 인증서와 사진은 48시간 이내 이메일로 발송됩니다." : "Vault certificate and photos will be emailed within 48 hours."}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "13px", borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "이전" : "Back"}</button>
            <button onClick={handlePay} disabled={processing} style={{ flex: 2, background: processing ? "#2a2318" : "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: processing ? "#555" : "#0a0a0a", padding: "13px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: processing ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {processing ? (lang === "ko" ? "처리 중..." : "Processing...") : (lang === "ko" ? "결제 확인" : "Confirm & Pay")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { Home, Shop, ProductPage, CartPage, Checkout };
