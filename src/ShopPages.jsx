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
            <button onClick={() => navigate("agp")} style={{ background: "transparent", color: "#8a7d6b", border: "1px solid #2a2318", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 6, cursor: "pointer" }}>
              {lang === "ko" ? "💰 AGP 저축 플랜 시작하기" : "💰 Start AGP savings plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Kimchi Premium Comparison — 2-panel on desktop, stacked on mobile */}
      <div style={{ background: "#111008", padding: isMobile ? "24px 16px" : "32px 80px", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 14 : 24 }}>
          {/* Left panel: Kimchi Premium sign */}
          <div style={{ background: "#0a0a0a", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
              {lang === "ko" ? "김치 프리미엄 비교" : "Kimchi Premium Comparison"}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 20 : 26, color: "#f5f0e8", marginBottom: 22, lineHeight: 1.2 }}>
              {lang === "ko" ? "왜 Aurum인가?" : "Why Aurum?"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <div style={{ flex: 1, textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 30 : 40, color: "#f87171", fontWeight: 700, lineHeight: 1 }}>10%</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", marginTop: 6 }}>{lang === "ko" ? "KRX 프리미엄" : "KRX Premium"}</div>
              </div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, color: "#333", padding: "0 8px" }}>vs</div>
              <div style={{ flex: 1, textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 30 : 40, color: "#4ade80", fontWeight: 700, lineHeight: 1 }}>3.5%</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", marginTop: 6 }}>{lang === "ko" ? "Aurum 프리미엄" : "Aurum Premium"}</div>
              </div>
            </div>
          </div>
          {/* Right panel: Current market price + savings */}
          <div style={{ background: "#0a0a0a", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
              {lang === "ko" ? "1온스 금 구매 시 절약 금액" : "Your Savings on 1oz Gold"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "KRX ~10%", val: fKRW(krxPrice), col: "#f87171" },
                { label: "AURUM 3.5%", val: fKRW(aurumPrice), col: "#4ade80" },
              ].map((x, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b" }}>{x.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 20, color: x.col, fontWeight: 600 }}>{x.val}</div>
                </div>
              ))}
              <div style={{ background: "rgba(74,222,128,0.07)", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{lang === "ko" ? "절약" : "Save"}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 24, color: "#4ade80", fontWeight: 700 }}>{fKRW(savings)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners / Trust Badges */}
      <div style={{ background: "#0a0a0a", padding: isMobile ? "20px 16px" : "28px 80px", display: "flex", justifyContent: "center", gap: isMobile ? 18 : 52, flexWrap: "wrap" }}>
        {[["🏦", "Malca-Amit"], ["📜", "LBMA"], ["🛡️", lang === "ko" ? "완전 보험" : "Insured"], ["🔐", lang === "ko" ? "완전 배분" : "Allocated"], ["🇸🇬", "Singapore FTZ"]].map(([icon, label], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: isMobile ? 13 : 15, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>
            <span style={{ fontSize: isMobile ? 22 : 26 }}>{icon}</span>{label}
          </div>
        ))}
      </div>

      {/* 왜 싱가포르인가 */}
      <div style={{ background: "#111008", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510", padding: isMobile ? "36px 16px" : "56px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 40 }}>
          <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "왜 싱가포르인가" : "Why Singapore"}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>
            {lang === "ko" ? "Asia의 귀금속 허브" : "Asia's Precious Metals Hub"}
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              title: lang === "ko" ? "Asia의 귀금속 허브 / Asia's Precious Metals Hub" : "Asia's Precious Metals Hub",
              body: lang === "ko"
                ? "싱가포르는 아시아 어느 관할권보다 많은 민간 금고 내 금을 보유합니다. Le Freeport와 기타 FTZ 금고에 추정 400톤 이상이 보관되어 있습니다."
                : "Singapore holds more gold in private vaults than any other Asian jurisdiction. Le Freeport and other FTZ vaults together store an estimated 400+ tonnes."
            },
            {
              title: lang === "ko" ? "국가 신용등급 AAA / AAA Sovereign Credit Rating" : "AAA Sovereign Credit Rating",
              body: lang === "ko"
                ? "Moody's, S&P, Fitch 모두 싱가포르를 AAA로 평가. 한국은 AA (두 단계 낮음). 정치적 안정성이 현저히 높습니다."
                : "Moody's, S&P, and Fitch all rate Singapore AAA. Korea is AA — two notches lower. Political stability is materially higher."
            },
            {
              title: lang === "ko" ? "정부 정책 우호적 / Government Policy Tailwind" : "Government Policy Tailwind",
              body: lang === "ko"
                ? "싱가포르는 2012년 투자용 금에 대한 GST를 완전 면제하여 금고 보관업을 적극 유치해왔습니다. 정책은 13년 이상 유지되고 있습니다."
                : "Singapore exempted investment-grade gold from GST in 2012 specifically to attract vault storage business. The policy has held for 13+ years."
            },
            {
              title: lang === "ko" ? "Aurum 맥락에서 / In the Aurum Context" : "In the Aurum Context",
              body: lang === "ko"
                ? "한국 원화 변동성 헤지와 국내 정책·과세·압수 리스크 분산 효과. 해외 보관은 도피가 아니라 분산입니다."
                : "Hedge against Korean won volatility and diversification away from domestic policy, tax, or seizure risk. Storing abroad is not an escape — it is diversification."
            },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", background: "#0a0a0a", border: "1px solid #1a1510", borderRadius: 8, borderLeft: "3px solid #c5a572" }}>
              <div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#c5a572", fontWeight: 600, marginBottom: 5 }}>{item.title}</div>
                <p style={{ margin: 0, fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works — fixed step numbers */}
      <div style={{ background: "#111008", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510", padding: isMobile ? "36px 16px" : "56px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 40 }}>
          <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "구매 방법" : "How It Works"}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 24 : 32, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "5단계로 완성되는 금 투자" : "5 Steps to Physical Gold Ownership"}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5,1fr)", gap: isMobile ? 12 : 0 }}>
          {[
            { n: "01", icon: "👤", ko: "회원가입", en: "Sign Up", sub: null },
            { n: "02", icon: "🥇", ko: "상품 선택", en: "Select", sub: null },
            { n: "03", icon: "💳", ko: "결제", en: "Pay", sub: "TossPay · KakaoPay · Wire · Card" },
            { n: "04", icon: "✅", ko: "주문 확인", en: "Confirm", sub: null },
            { n: "05", icon: "🏦", ko: "볼트 배정", en: "Vaulted", sub: null },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: isMobile ? "14px 12px" : "24px 10px", position: "relative" }}>
              {!isMobile && i < 4 && <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 1, height: 48, background: "#2a2318" }} />}
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 20, color: "#c5a572", marginBottom: 12, fontWeight: 700 }}>{s.n}</div>
              <div style={{ fontSize: isMobile ? 30 : 36, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 15, color: "#f5f0e8", fontWeight: 600 }}>{lang === "ko" ? s.ko : s.en}</div>
              {s.sub && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 10 : 11, color: "#8a7d6b", marginTop: 6, lineHeight: 1.5 }}>{s.sub}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 실물 인출 */}
      <div style={{ background: "#0a0a0a", padding: isMobile ? "36px 16px" : "56px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 40 }}>
          <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "실물 인출" : "Physical Withdrawal"}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 24 : 32, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>
            {lang === "ko" ? "실물 금을 찾는 3가지 방법" : "3 Ways to Take Your Gold"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 14 : 20, marginBottom: 20 }}>
          {[
            {
              icon: "🏛️",
              title: lang === "ko" ? "싱가포르 현장 수령 / Vault Pickup" : "Vault Pickup",
              bullets: lang === "ko"
                ? ["싱가포르 Malca-Amit 금고에서 직접 수령", "온라인 예약 필수, 여권·구매 증명서 지참", "싱가포르 반출 VAT·관세 없음", "싱가포르 또는 동남아 방문객에게 적합"]
                : ["Collect in person at the Malca-Amit Singapore vault", "Online appointment required with passport and invoice", "No VAT or export restriction from Singapore", "Ideal for customers traveling to Singapore or Southeast Asia"]
            },
            {
              icon: "📦",
              title: lang === "ko" ? "국제 택배 / International Courier" : "International Courier",
              bullets: lang === "ko"
                ? ["보험 적용 전문 운송 (Brinks, Ferrari Group, Malca-Amit 물류)", "한국 또는 전 세계 배송", "한국 수입 시 관세·VAT 합계 13% (VAT 10% + 관세 3%)", "통관 서류는 Aurum이 전담 처리"]
                : ["Insured specialty courier (Brinks, Ferrari Group, or Malca-Amit logistics)", "Ship to Korea or any destination worldwide", "13% Korean import duties (10% VAT + 3% customs)", "Customs documentation handled end-to-end by Aurum"]
            },
            {
              icon: "💰",
              title: lang === "ko" ? "매도 / Sell-Back" : "Sell-Back",
              bullets: lang === "ko"
                ? ["실시간 매수호가로 Aurum에 매도, 실물 이동 불필요", "KRW, USD, SGD 수취 가능", "연결된 은행 계좌로 2영업일 내 정산", "최소 보유기간 없음, 위약금 없음"]
                : ["Sell to Aurum at live bid price, no physical handling", "Payout in KRW, USD, or SGD", "2 business day settlement to linked bank account", "No minimum holding period, no exit fee"]
            },
          ].map((card, i) => (
            <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: "22px 20px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "#f5f0e8", fontWeight: 400, marginBottom: 12 }}>{card.title}</div>
              <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                {card.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 6, lineHeight: 1.55 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 18px", background: "rgba(197,165,114,0.04)", border: "1px solid rgba(197,165,114,0.15)", borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", lineHeight: 1.6 }}>
            {lang === "ko"
              ? "대부분의 Aurum 고객은 장기 보관(5년 이상)을 선택합니다. 보관료가 한국 내 안전 보관 비용보다 저렴하고, 해외 보관을 유지하는 한 세제상 최적 구조가 유지되기 때문입니다."
              : "Most Aurum customers choose long-term storage (5+ years) — storage fees are lower than Korean safe-keeping alternatives, and tax treatment is optimized while metal remains offshore."}
          </p>
        </div>
      </div>

      <NewsSection lang={lang} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHOP
// ═══════════════════════════════════════════════════════════════════════════════
function Shop({ lang, navigate, setProduct, prices, krwRate, addToCart, toast }) {
  const isMobile = useIsMobile();
  const [metal, setMetal] = useState("all");
  const [type, setType] = useState("all");
  const filtered = PRODUCTS.filter(p => (metal === "all" || p.metal === metal) && (type === "all" || p.type === type));
  const Fb = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{ background: active ? "#c5a572" : "transparent", color: active ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${active ? "#c5a572" : "#2a2318"}`, padding: isMobile ? "6px 14px" : "7px 18px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: active ? 600 : 400, transition: "all 0.15s" }}>{children}</button>
  );
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 28 : 38, color: "#f5f0e8", fontWeight: 300, margin: "0 0 4px" }}>{lang === "ko" ? "귀금속 매장" : "Precious Metals Shop"}</h2>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b", margin: "0 0 24px" }}>{lang === "ko" ? "글로벌 현물가 + 투명한 프리미엄 — 실시간 가격" : "Global spot + transparent premium — live prices"}</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        <Fb active={metal === "all"} onClick={() => setMetal("all")}>{lang === "ko" ? "전체" : "All"}</Fb>
        <Fb active={metal === "gold"} onClick={() => setMetal("gold")}>{lang === "ko" ? "금" : "Gold"}</Fb>
        <Fb active={metal === "silver"} onClick={() => setMetal("silver")}>{lang === "ko" ? "은" : "Silver"}</Fb>
        <div style={{ width: 1, height: 28, background: "#2a2318", alignSelf: "center", margin: "0 4px" }} />
        <Fb active={type === "all"} onClick={() => setType("all")}>{lang === "ko" ? "전체" : "All"}</Fb>
        <Fb active={type === "bar"} onClick={() => setType("bar")}>{lang === "ko" ? "바" : "Bars"}</Fb>
        <Fb active={type === "coin"} onClick={() => setType("coin")}>{lang === "ko" ? "코인" : "Coins"}</Fb>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill,minmax(260px,1fr))", gap: isMobile ? 12 : 20 }}>
        {filtered.map(p => {
          const price = calcPrice(p, prices);
          return (
            <div key={p.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 14 : 22, cursor: "pointer", transition: "border-color 0.2s, transform 0.2s", position: "relative" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(197,165,114,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1510"; e.currentTarget.style.transform = "none"; }}
              onClick={() => { setProduct(p); navigate("product"); }}>
              <span style={{ position: "absolute", top: 10, right: 10, background: p.metal === "gold" ? "rgba(197,165,114,0.15)" : "rgba(180,180,180,0.15)", color: p.metal === "gold" ? "#c5a572" : "#aaa", fontSize: 9, padding: "2px 7px", borderRadius: 3, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>
                {p.type === "bar" ? (lang === "ko" ? "바" : "BAR") : (lang === "ko" ? "코인" : "COIN")}
              </span>
              <div style={{ fontSize: isMobile ? 36 : 44, marginBottom: 12 }}>{p.image}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 13, color: "#f5f0e8", fontWeight: 500, marginBottom: 2, lineHeight: 1.3 }}>{lang === "ko" ? p.nameKo : p.name}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", marginBottom: 14 }}>{p.mint} · {p.purity} · {p.weight}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 14 : 17, color: "#c5a572", fontWeight: 600 }}>{fUSD(price)}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#666" }}>{fKRW(price * krwRate)}</div>
                </div>
                <div style={{ fontSize: 10, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>+{(p.premium * 100).toFixed(1)}%</div>
              </div>
              <button onClick={e => { e.stopPropagation(); addToCart(p, 1, "singapore"); toast(lang === "ko" ? "장바구니에 추가되었습니다." : "Added to cart."); }} style={{ width: "100%", background: "rgba(197,165,114,0.1)", border: "1px solid rgba(197,165,114,0.3)", color: "#c5a572", padding: "8px", borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(197,165,114,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(197,165,114,0.1)"; }}>
                {lang === "ko" ? "장바구니 담기" : "Add to Cart"}
              </button>
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
  const [storage, setStorage] = useState("singapore");
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const unit = calcPrice(product, prices);
  const duty = storage === "korea" ? unit * 0.18 : 0;
  const total = (unit + duty) * qty;
  const storageAnnual = unit * 0.008;

  const buyNow = () => {
    if (!user) { setShowLogin(true); return; }
    addToCart(product, qty, storage);
    navigate("checkout");
  };
  const addCart = () => {
    if (!user) { setShowLogin(true); return; }
    addToCart(product, qty, storage);
    toast(lang === "ko" ? "장바구니에 추가되었습니다." : "Added to cart.");
    navigate("cart");
  };

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <button onClick={() => navigate("shop")} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 13, marginBottom: 22, fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>← {lang === "ko" ? "매장으로" : "Back to Shop"}</button>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 28 : 64 }}>
        {/* Image */}
        <div style={{ background: "#111008", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: isMobile ? 220 : 440, border: "1px solid #1a1510", padding: 24 }}>
          <div style={{ fontSize: isMobile ? 90 : 130, marginBottom: 20 }}>{product.image}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {[{ icon: "📜", label: "LBMA" }, { icon: "🔐", label: lang === "ko" ? "완전 배분" : "Allocated" }, { icon: "🛡️", label: lang === "ko" ? "보험" : "Insured" }].map((b, i) => (
              <span key={i} style={{ fontSize: 11, color: "#8a7d6b", background: "#0a0a0a", border: "1px solid #2a2318", padding: "3px 10px", borderRadius: 20, fontFamily: "'Outfit',sans-serif" }}>{b.icon} {b.label}</span>
            ))}
          </div>
        </div>
        {/* Details */}
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>{product.mint}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 400, margin: "0 0 4px" }}>{lang === "ko" ? product.nameKo : product.name}</h1>
          <div style={{ fontSize: 12, color: "#8a7d6b", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{product.purity} · {product.weight}</div>
          {product.descKo && <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b", lineHeight: 1.7, marginBottom: 20 }}>{lang === "ko" ? product.descKo : product.name}</p>}

          {/* Price Breakdown */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 16 : 22, marginBottom: 18 }}>
            {[
              { label: lang === "ko" ? "현물가" : "Spot Price", val: fUSD(unit / (1 + product.premium)), col: "#ddd" },
              { label: `${lang === "ko" ? "프리미엄" : "Premium"} (${(product.premium * 100).toFixed(1)}%)`, val: `+${fUSD(unit - unit / (1 + product.premium))}`, col: "#c5a572" },
              ...(storage === "korea" ? [{ label: lang === "ko" ? "한국 관세/VAT ~18%" : "Korea Duties ~18%", val: `+${fUSD(duty)}`, col: "#f87171" }] : []),
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{row.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: row.col }}>{row.val}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #2a2318", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#f5f0e8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "단가" : "Unit Price"}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 23, color: "#c5a572", fontWeight: 700 }}>{fUSD(unit + duty)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666" }}>{fKRW((unit + duty) * krwRate)}</div>
              </div>
            </div>
          </div>

          {/* Storage Option */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: "#8a7d6b", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "보관 옵션" : "Storage Option"}</div>
            <div style={{ display: "flex", gap: 10, flexDirection: isMobile ? "column" : "row" }}>
              {[
                { key: "singapore", icon: "🇸🇬", label: lang === "ko" ? "싱가포르 볼트" : "Singapore Vault", sub: lang === "ko" ? "GST 면제 · 연 0.8%" : "No GST · 0.8%/yr" },
                { key: "korea", icon: "🇰🇷", label: lang === "ko" ? "한국 배송" : "Ship to Korea", sub: lang === "ko" ? "관세+VAT ~18% 부과" : "~18% duties apply" },
              ].map(o => (
                <button key={o.key} onClick={() => setStorage(o.key)} style={{ flex: 1, background: storage === o.key ? "rgba(197,165,114,0.07)" : "transparent", border: `1px solid ${storage === o.key ? "#c5a572" : "#2a2318"}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 13, color: "#f5f0e8", marginBottom: 2, fontFamily: "'Outfit',sans-serif" }}>{o.icon} {o.label}</div>
                  <div style={{ fontSize: 11, color: storage === o.key ? "#4ade80" : "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{o.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "수량" : "Qty"}</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2318", borderRadius: 6 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "8px 14px", fontSize: 18, lineHeight: 1 }}>−</button>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#f5f0e8", padding: "0 14px", minWidth: 40, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "8px 14px", fontSize: 18, lineHeight: 1 }}>+</button>
            </div>
          </div>

          {/* Total */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: "14px 18px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{lang === "ko" ? "합계" : "Total"}</span>
              {storage === "singapore" && <div style={{ fontSize: 10, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>{lang === "ko" ? `연 보관료 약 ${fUSD(storageAnnual * qty)}` : `~${fUSD(storageAnnual * qty)}/yr storage`}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 20 : 26, color: "#c5a572", fontWeight: 700 }}>{fUSD(total)}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666" }}>{fKRW(total * krwRate)}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={buyNow} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "15px", fontSize: 16, fontWeight: 700, borderRadius: 8, cursor: "pointer", letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "지금 구매하기" : "Buy Now"}
            </button>
            <button onClick={addCart} style={{ width: "100%", background: "transparent", color: "#c5a572", border: "1px solid #c5a572", padding: "13px", fontSize: 14, fontWeight: 600, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "장바구니 담기" : "Add to Cart"}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14 }}>
            {["💙 TossPay", "💛 카카오페이", "🏦 Wire", "💳 Card"].map((x, i) => <span key={i} style={{ fontSize: 11, color: "#555", fontFamily: "'Outfit',sans-serif" }}>{x}</span>)}
          </div>
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
      <div style={{ fontSize: 60, marginBottom: 18 }}>🛒</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: "#f5f0e8", fontWeight: 300, marginBottom: 10 }}>{lang === "ko" ? "장바구니가 비어 있습니다" : "Your cart is empty"}</h2>
      <p style={{ color: "#8a7d6b", marginBottom: 28, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "매장에서 실물 귀금속을 선택하세요." : "Browse our shop for physical precious metals."}</p>
      <button onClick={() => navigate("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 32px", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "매장 둘러보기" : "Browse Shop"}</button>
    </div>
  );
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const storageFee = subtotal * 0.008;
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 300, margin: "0 0 28px" }}>{lang === "ko" ? "장바구니" : "Cart"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 360px", gap: isMobile ? 24 : 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cart.map(item => (
            <div key={item.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 14 : 20, display: "flex", gap: isMobile ? 12 : 20, alignItems: "center" }}>
              <div style={{ fontSize: isMobile ? 36 : 48, flexShrink: 0 }}>{item.image}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 14, color: "#f5f0e8", fontWeight: 500, marginBottom: 2 }}>{lang === "ko" ? item.nameKo : item.name}</div>
                <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{item.storage === "singapore" ? (lang === "ko" ? "🇸🇬 싱가포르 볼트" : "🇸🇬 Singapore Vault") : (lang === "ko" ? "🇰🇷 한국 배송" : "🇰🇷 Ship to Korea")}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572", marginTop: 6 }}>{fUSD(item.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2318", borderRadius: 6 }}>
                <button onClick={() => updateCartQty(item.id, Math.max(1, item.qty - 1))} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "6px 10px", fontSize: 16 }}>−</button>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#f5f0e8", padding: "0 10px", fontSize: 13 }}>{item.qty}</span>
                <button onClick={() => updateCartQty(item.id, item.qty + 1)} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "6px 10px", fontSize: 16 }}>+</button>
              </div>
              <div style={{ textAlign: "right", minWidth: isMobile ? 80 : 100 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#c5a572", fontWeight: 600 }}>{fUSD(item.price * item.qty)}</div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#f87171", fontSize: 11, cursor: "pointer", marginTop: 4, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "삭제" : "Remove"}</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 18 : 24, height: "fit-content" }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: "#f5f0e8", fontWeight: 600, margin: "0 0 20px" }}>{lang === "ko" ? "주문 요약" : "Order Summary"}</h3>
          {[
            { label: lang === "ko" ? "소계" : "Subtotal", val: fUSD(subtotal), col: "#ddd" },
            { label: lang === "ko" ? "예상 연 보관료" : "Est. annual storage", val: fUSD(storageFee), col: "#8a7d6b" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{r.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: r.col }}>{r.val}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #2a2318", paddingTop: 14, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15, color: "#f5f0e8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "합계" : "Total"}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, color: "#c5a572", fontWeight: 700 }}>{fUSD(subtotal)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666" }}>{fKRW(subtotal * krwRate)}</div>
              </div>
            </div>
          </div>
          <button onClick={() => navigate("checkout")} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "14px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "결제 진행" : "Proceed to Checkout"}
          </button>
          <button onClick={() => navigate("shop")} style={{ width: "100%", marginTop: 10, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "12px", fontSize: 13, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "쇼핑 계속하기" : "Continue Shopping"}
          </button>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// CHECKOUT — 5-STEP FLOW
// ═══════════════════════════════════════════════════════════════════════════════
function Checkout({ lang, navigate, cart, clearCart, prices, krwRate, user, addOrder, toast }) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState(null);
  const [terms, setTerms] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [wireDetails, setWireDetails] = useState(null);
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const storageFeeY1 = subtotal * 0.008;

  if (!user) return (
    <div style={{ padding: isMobile ? "60px 16px" : "80px", textAlign: "center", background: "#0a0a0a", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: "#f5f0e8", fontWeight: 300, marginBottom: 10 }}>{lang === "ko" ? "로그인이 필요합니다" : "Login Required"}</h2>
      <p style={{ color: "#8a7d6b", marginBottom: 24, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "구매하려면 먼저 로그인하세요." : "Please log in to proceed with your purchase."}</p>
      <button onClick={() => navigate("home")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 28px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "홈으로" : "Go Home"}</button>
    </div>
  );

  if (cart.length === 0 && step < 5) return (
    <div style={{ padding: "80px", textAlign: "center", background: "#0a0a0a", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: "#f5f0e8", fontWeight: 300 }}>{lang === "ko" ? "장바구니가 비어 있습니다." : "Cart is empty."}</h2>
      <button onClick={() => navigate("shop")} style={{ marginTop: 20, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 28px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "매장으로" : "Go to Shop"}</button>
    </div>
  );

  const placeOrder = async () => {
    if (!terms) { toast(lang === "ko" ? "이용약관에 동의하세요." : "Please accept terms.", "error"); return; }
    if (!payMethod) { toast(lang === "ko" ? "결제 수단을 선택하세요." : "Select a payment method.", "error"); return; }
    setStep(4); setProcessing(true);
    try {
      const { id } = await API.orders.create({ items: cart, total: subtotal, paymentMethod: payMethod });
      setOrderId(id);
      let result;
      if (payMethod === "toss") result = await API.payments.toss({ id, total: subtotal });
      else if (payMethod === "kakao") result = await API.payments.kakao({ id, total: subtotal });
      else if (payMethod === "wire") { result = await API.payments.wire({ id, total: subtotal }); setWireDetails(result.bankDetails); }
      else result = await API.payments.card({ id, total: subtotal });
      addOrder({ id, date: new Date().toISOString(), status: payMethod === "wire" ? "pending_payment" : "processing", items: [...cart], subtotal, total: subtotal, paymentMethod: payMethod, storageOption: "singapore" });
      clearCart();
      setStep(5);
    } catch { toast(lang === "ko" ? "결제 오류가 발생했습니다. 다시 시도하세요." : "Payment error. Please try again.", "error"); setStep(3); }
    finally { setProcessing(false); }
  };

  const steps = [
    { n: 1, ko: "장바구니", en: "Cart" },
    { n: 2, ko: "결제수단", en: "Payment" },
    { n: 3, ko: "주문확인", en: "Confirm" },
    { n: 4, ko: "처리중", en: "Processing" },
    { n: 5, ko: "완료", en: "Done" },
  ];

  const StepBar = () => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 36, overflowX: "auto", paddingBottom: 4 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= s.n ? (step === s.n ? "#c5a572" : "#3a3028") : "#1a1510", border: step === s.n ? "2px solid #c5a572" : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontFamily: "'JetBrains Mono',monospace", color: step >= s.n ? (step === s.n ? "#0a0a0a" : "#c5a572") : "#555", fontWeight: 700, transition: "all 0.3s" }}>
              {step > s.n ? "✓" : s.n}
            </div>
            <span style={{ fontSize: 9, color: step === s.n ? "#c5a572" : "#555", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap" }}>{lang === "ko" ? s.ko : s.en}</span>
          </div>
          {i < steps.length - 1 && <div style={{ width: isMobile ? 20 : 40, height: 1, background: step > s.n ? "#c5a572" : "#2a2318", margin: "0 4px", marginBottom: 20, transition: "background 0.3s" }} />}
        </div>
      ))}
    </div>
  );

  const payMethods = [
    { key: "toss", icon: "💙", name: lang === "ko" ? "토스페이" : "TossPay", desc: lang === "ko" ? "신용·체크카드, 계좌이체" : "Credit/debit, bank transfer", sub: lang === "ko" ? "즉시 처리" : "Instant", badge: lang === "ko" ? "인기" : "Popular" },
    { key: "kakao", icon: "💛", name: lang === "ko" ? "카카오페이" : "KakaoPay", desc: lang === "ko" ? "카카오뱅크 연동" : "Kakao Bank linked", sub: lang === "ko" ? "즉시 처리" : "Instant", badge: null },
    { key: "wire", icon: "🏦", name: lang === "ko" ? "전신환" : "Wire Transfer", desc: lang === "ko" ? "KRW / USD 은행 이체" : "KRW / USD bank transfer", sub: lang === "ko" ? "영업일 1일" : "1 business day", badge: null },
    { key: "card", icon: "💳", name: lang === "ko" ? "신용카드" : "Credit Card", desc: "Visa / Mastercard", sub: lang === "ko" ? "즉시 처리" : "Instant", badge: null },
  ];

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 28px" }}>{lang === "ko" ? "결제" : "Checkout"}</h2>
      <StepBar />

      {step === 1 && (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: "#c5a572", margin: "0 0 18px", fontWeight: 600 }}>{lang === "ko" ? "장바구니 확인" : "Review Your Cart"}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {cart.map(item => (
              <div key={item.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 14 : 18, display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ fontSize: 36, flexShrink: 0 }}>{item.image}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#f5f0e8", fontWeight: 500 }}>{lang === "ko" ? item.nameKo : item.name}</div>
                  <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>Qty: {item.qty} · {item.storage === "singapore" ? (lang === "ko" ? "싱가포르 볼트" : "Singapore Vault") : (lang === "ko" ? "한국 배송" : "Ship to Korea")}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: "#c5a572", fontWeight: 600 }}>{fUSD(item.price * item.qty)}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#666" }}>{fKRW(item.price * item.qty * krwRate)}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 18, marginBottom: 24 }}>
            {[[lang === "ko" ? "상품 소계" : "Subtotal", fUSD(subtotal), "#ddd"], [lang === "ko" ? "보관료 (1년, 예상)" : "Storage (1yr, est.)", fUSD(storageFeeY1), "#8a7d6b"]].map(([l, v, c], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{l}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: c }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #2a2318", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, color: "#f5f0e8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "합계" : "Total"}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, color: "#c5a572", fontWeight: 700 }}>{fUSD(subtotal)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666" }}>{fKRW(subtotal * krwRate)}</div>
              </div>
            </div>
          </div>
          <button onClick={() => setStep(2)} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "14px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "결제 수단 선택 →" : "Select Payment →"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: "#c5a572", margin: "0 0 18px", fontWeight: 600 }}>{lang === "ko" ? "결제 수단 선택" : "Select Payment Method"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {payMethods.map(m => (
              <button key={m.key} onClick={() => setPayMethod(m.key)} style={{ background: payMethod === m.key ? "rgba(197,165,114,0.08)" : "#111008", border: `1.5px solid ${payMethod === m.key ? "#c5a572" : "#2a2318"}`, borderRadius: 10, padding: "16px 18px", cursor: "pointer", textAlign: "left", position: "relative", transition: "all 0.15s" }}>
                {m.badge && <span style={{ position: "absolute", top: 10, right: 10, background: "#c5a572", color: "#0a0a0a", fontSize: 9, padding: "2px 7px", borderRadius: 3, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>{m.badge}</span>}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <span style={{ fontSize: 15, color: "#f5f0e8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{m.name}</span>
                </div>
                <div style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 2 }}>{m.desc}</div>
                <div style={{ fontSize: 11, color: payMethod === m.key ? "#4ade80" : "#555", fontFamily: "'Outfit',sans-serif" }}>{m.sub}</div>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "13px", fontSize: 14, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "이전" : "Back"}</button>
            <button onClick={() => { if (!payMethod) { toast(lang === "ko" ? "결제 수단을 선택하세요." : "Select payment.", "error"); return; } setStep(3); }} style={{ flex: 2, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "13px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "주문 검토 →" : "Review Order →"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: "#c5a572", margin: "0 0 18px", fontWeight: 600 }}>{lang === "ko" ? "최종 주문 확인" : "Review & Place Order"}</h3>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "주문 상품" : "Items"}</div>
            {cart.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? item.nameKo : item.name} ×{item.qty}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{fUSD(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "결제 정보" : "Payment"}</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "결제 수단" : "Method"}</span>
              <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{payMethods.find(m => m.key === payMethod)?.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "보관" : "Storage"}</span>
              <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "싱가포르 Malca-Amit FTZ" : "Singapore Malca-Amit FTZ"}</span>
            </div>
            <div style={{ borderTop: "1px solid #2a2318", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, color: "#f5f0e8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "결제 금액" : "Total"}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, color: "#c5a572", fontWeight: 700 }}>{fUSD(subtotal)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666" }}>{fKRW(subtotal * krwRate)}</div>
              </div>
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 20, background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16 }}>
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ marginTop: 3, accentColor: "#c5a572", width: 16, height: 16 }} />
            <span style={{ fontSize: 12, color: "#8a7d6b", lineHeight: 1.6, fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko"
                ? <>Aurum Korea의 <span style={{ color: "#c5a572" }}>이용약관</span>, <span style={{ color: "#c5a572" }}>개인정보처리방침</span> 및 <span style={{ color: "#c5a572" }}>귀금속 거래 위험 고지</span>에 동의합니다. 투자에는 위험이 따르며 과거 수익률이 미래를 보장하지 않습니다.</>
                : <>I agree to Aurum Korea's <span style={{ color: "#c5a572" }}>Terms</span>, <span style={{ color: "#c5a572" }}>Privacy Policy</span>, and <span style={{ color: "#c5a572" }}>Risk Disclosure</span>. Investing involves risk.</>}
            </span>
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "13px", fontSize: 14, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "이전" : "Back"}</button>
            <button onClick={placeOrder} style={{ flex: 2, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "13px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "주문 완료" : "Place Order"}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", padding: "60px 20px" }}>
          {processing ? (
            <>
              <div style={{ fontSize: 56, marginBottom: 20, animation: "spin 2s linear infinite" }}>⚙️</div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: "#f5f0e8", fontWeight: 300, marginBottom: 10 }}>{lang === "ko" ? "결제 처리 중..." : "Processing Payment..."}</h3>
              <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", fontSize: 14 }}>{lang === "ko" ? "잠시만 기다려 주세요." : "Please wait a moment."}</p>
              {orderId && <div style={{ marginTop: 16, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#c5a572" }}>{lang === "ko" ? "주문번호" : "Order ID"}: {orderId}</div>}
            </>
          ) : null}
        </div>
      )}

      {step === 5 && (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", padding: isMobile ? "20px 0 32px" : "24px 0 40px" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 28 : 36, color: "#f5f0e8", fontWeight: 300, marginBottom: 8 }}>{lang === "ko" ? "주문 완료!" : "Order Confirmed!"}</h2>
            <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", fontSize: 14 }}>{lang === "ko" ? "이메일 및 카카오 알림으로 확인서가 발송되었습니다." : "Confirmation sent via email and KakaoTalk."}</p>
          </div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 18 : 26, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "주문번호" : "Order ID"}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#c5a572", fontWeight: 600 }}>{orderId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "결제 수단" : "Payment"}</span>
              <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{payMethods.find(m => m.key === payMethod)?.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "결제 금액" : "Amount"}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: "#c5a572", fontWeight: 700 }}>{fUSD(subtotal)}</span>
            </div>
            <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ fontSize: 12, color: "#4ade80", fontFamily: "'Outfit',sans-serif", fontWeight: 600, marginBottom: 4 }}>🏦 {lang === "ko" ? "볼트 배정 완료" : "Vault Allocated"}</div>
              <div style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", lineHeight: 1.5 }}>{lang === "ko" ? "Singapore — Malca-Amit FTZ에 배정 처리 중입니다. Lloyd's of London 보험이 즉시 적용됩니다." : "Being allocated at Singapore — Malca-Amit FTZ. Lloyd's of London insurance applies immediately."}</div>
            </div>
          </div>
          {payMethod === "wire" && wireDetails && (
            <div style={{ background: "#0d1a0a", border: "1px solid #1a3a1a", borderRadius: 12, padding: isMobile ? 18 : 24, marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#4ade80", fontFamily: "'Outfit',sans-serif", fontWeight: 600, marginBottom: 14 }}>🏦 {lang === "ko" ? "전신환 결제 안내" : "Wire Transfer Instructions"}</div>
              {[
                [lang === "ko" ? "수취 은행" : "Bank", wireDetails.bank],
                [lang === "ko" ? "계좌명" : "Account Name", wireDetails.accountName],
                [lang === "ko" ? "계좌번호" : "Account No.", wireDetails.accountNo],
                ["SWIFT", wireDetails.swift],
                [lang === "ko" ? "송금 금액 (USD)" : "Amount (USD)", fUSD(wireDetails.amount)],
                [lang === "ko" ? "참조번호 (필수)" : "Reference (required)", wireDetails.reference],
              ].map(([l, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{l}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#f5f0e8" }}>{v}</span>
                </div>
              ))}
              <p style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginTop: 10, lineHeight: 1.5 }}>{lang === "ko" ? "⚠️ 참조번호를 반드시 포함하여 송금하세요. 미포함 시 처리가 지연될 수 있습니다." : "⚠️ Always include the reference number. Orders process within 1 business day of confirmed receipt."}</p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
            <button onClick={() => navigate("dashboard")} style={{ flex: 1, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "13px", fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "내 보유자산 보기" : "View My Holdings"}
            </button>
            <button onClick={() => navigate("shop")} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "13px", fontSize: 14, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "쇼핑 계속하기" : "Continue Shopping"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



export { Home, Shop, ProductPage, CartPage, Checkout };
