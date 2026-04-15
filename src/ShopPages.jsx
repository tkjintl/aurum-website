import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile, calcPrice, fUSD, fKRW, PRODUCTS, MOCK_ORDERS_INIT, API } from "./lib.jsx";
import { NewsSection } from "./BaseUI.jsx";

// ── A-3: Country flags — hatscripts/circle-flags CDN (replaces broken inline SVG) ──
const FlagSG = ({ size = 20 }) => (
  <img
    src="https://hatscripts.github.io/circle-flags/flags/sg.svg"
    alt="Singapore"
    style={{ width: size, height: size, verticalAlign: "middle", display: "inline-block", flexShrink: 0 }}
  />
);
const FlagKR = ({ size = 20 }) => (
  <img
    src="https://hatscripts.github.io/circle-flags/flags/kr.svg"
    alt="Korea"
    style={{ width: size, height: size, verticalAlign: "middle", display: "inline-block", flexShrink: 0 }}
  />
);

// ── Currency Toggle ─────────────────────────────────────────────────────────
function CurrencyToggle({ currency, setCurrency }) {
  return (
    <button
      onClick={() => setCurrency(c => c === "KRW" ? "USD" : "KRW")}
      title={currency === "KRW" ? "Switch to USD" : "원화로 전환"}
      style={{
        background: "rgba(197,165,114,0.08)",
        border: "1px solid rgba(197,165,114,0.4)",
        color: "#c5a572",
        padding: "5px 14px",
        borderRadius: 4,
        cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        flexShrink: 0,
      }}
    >
      {currency === "KRW" ? "₩ / $" : "$ / ₩"}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════════════
function Home({ lang, navigate, prices, krwRate, currency, setCurrency }) {
  const fPrice = (usdAmt) => currency === "KRW" ? fKRW(usdAmt * krwRate) : fUSD(usdAmt);
  const isMobile = useIsMobile();
  // H-04: Gold tracker — 1돈 (3.75g = 3.75/31.1035 oz) units
  const DON_RATIO = 3.75 / 31.1035;
  // Savings panels — compute in USD for toggle compatibility
  const goldKB_usd = prices.gold * DON_RATIO * 1.15;   // Korean market ~15% over spot
  const goldAurum_usd = prices.gold * DON_RATIO * 1.08; // Aurum spot+8%
  const goldSavings_usd = goldKB_usd - goldAurum_usd;
  const goldKB = goldKB_usd * krwRate;
  const goldAurum = goldAurum_usd * krwRate;
  const goldSavings = goldSavings_usd * krwRate;
  const KG_RATIO = 1000 / 31.1035;
  const silverKB_usd = (prices.silver || 32.15) * KG_RATIO * 1.25;
  const silverAurum_usd = (prices.silver || 32.15) * KG_RATIO * 1.08;
  const silverSavings_usd = silverKB_usd - silverAurum_usd;
  const silverKB = silverKB_usd * krwRate;
  const silverAurum = silverAurum_usd * krwRate;
  const silverSavings = silverSavings_usd * krwRate;
  return (
    <div>

      {/* ── 1a. HERO — rewritten headline, subhead, eyebrow, CTAs ── */}
      <div style={{ position: "relative", minHeight: isMobile ? 420 : 540, background: "linear-gradient(135deg,#0a0a0a,#1a1510 40%,#0d0b08)", display: "flex", alignItems: "center", padding: isMobile ? "40px 16px" : "0 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "repeating-linear-gradient(45deg,#c5a572 0,#c5a572 1px,transparent 1px,transparent 40px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: isMobile ? "100%" : 660 }}>
          {/* Eyebrow — updated */}
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 10 : 12, color: "#c5a572", letterSpacing: isMobile ? 2 : 4, textTransform: "uppercase", marginBottom: isMobile ? 14 : 20 }}>
            {lang === "ko" ? "배분 보관 · 국제 현물가 · 한국 투자자 전용" : "Allocated Vault Storage · International Spot Pricing · Korean Investors"}
          </div>
          {/* H1 — updated */}
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 34 : 54, fontWeight: 300, color: "#f5f0e8", lineHeight: 1.12, margin: "0 0 20px" }}>
            {lang === "ko"
              ? <><span style={{ color: "#c5a572", fontWeight: 600 }}>진짜 금. 진짜 은.</span><br />진짜 소유.</>
              : <>Real Gold. Real Silver.<br /><span style={{ color: "#c5a572", fontWeight: 600 }}>Real Ownership.</span></>}
          </h1>
          {/* Subhead — updated */}
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 16, color: "#8a7d6b", lineHeight: 1.75, margin: "0 0 30px" }}>
            {lang === "ko"
              ? "은행 통장도 아니고, KRX 계좌도 아닙니다. 싱가포르 Malca-Amit 금고에 귀하의 이름으로 등록된 실물 금속 — 국제 현물가 기준."
              : "Not a bank passbook. Not a KRX account. Allocated physical metal — registered in your name at Malca-Amit Singapore — priced at international spot."}
          </p>
          {/* CTAs — updated labels */}
          <div style={{ display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row" }}>
            <button onClick={() => navigate("shop")} style={{ flex: 1, background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#ffffff", border: "none", padding: "14px 20px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 6, cursor: "pointer", letterSpacing: 0.5 }}>
              {lang === "ko" ? "지금 내 자산 배분 시작" : "지금 내 자산 배분 시작"}
            </button>
            <button onClick={() => navigate("agp-intro")} style={{ flex: 1, background: "transparent", color: "#8a7d6b", border: "1px solid #2a2318", padding: "14px 20px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 6, cursor: "pointer" }}>
              {lang === "ko" ? "AGP (골드프랜) – 월 20만원 시작" : "AGP (골드프랜) – 월 20만원 시작"}
            </button>
          </div>
        </div>
      </div>

      {/* ── 1c. PAPER vs PHYSICAL — new section after hero ── */}
      <div style={{ background: "#111008", padding: isMobile ? "36px 16px" : "56px 80px", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 40 }}>
          <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "🥇 근본적인 차이" : "THE FUNDAMENTAL DIFFERENCE"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 36 : 48, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>
            {lang === "ko" ? "금을 소유하는 두 가지 방법. 진짜는 하나입니다." : "You Can Own Gold Two Ways. Only One Is Real."}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 14 : 24 }}>
          {/* Left: Paper Gold — red accent */}
          <div style={{ background: "#0a0a0a", border: "1px solid #2a2318", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171", flexShrink: 0 }} />
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#f87171", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                {lang === "ko" ? "페이퍼 금·은" : "Paper Gold / Silver"}
              </div>
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {(lang === "ko" ? [
                "은행 금통장, KRX 계좌, 또는 펀드",
                "귀하는 계약상 청구권을 보유 — 실물 금속이 아닙니다",
                "상대방 리스크. 법적 소유권 없음. 일련번호 없음."
              ] : [
                "Bank passbook, KRX account, or fund",
                "You own a contractual claim — not the metal",
                "Counterparty risk. No legal title. No serial number."
              ]).map((b, i) => (
                <li key={i} style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 8, lineHeight: 1.6 }}>{b}</li>
              ))}
            </ul>
          </div>
          {/* Right: Physical Allocated — green accent */}
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#4ade80", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                {lang === "ko" ? "실물 배분 금속" : "Physical Allocated"}
              </div>
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {(lang === "ko" ? [
                "실물 금속. 귀하의 이름. 귀하의 일련번호.",
                "완전 분리 보관 — 어떤 은행의 대차대조표에도 없음",
                "법적 소유권은 첫날부터 귀하의 것"
              ] : [
                "Real metal. Your name. Your serial number.",
                "Segregated, never pooled, never on any bank's balance sheet",
                "Legal title is yours from day one"
              ]).map((b, i) => (
                <li key={i} style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 8, lineHeight: 1.6 }}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Physical Premium Comparison — A-1: 2-panel layout (gold LEFT, silver RIGHT), 왜 Aurum box removed ── */}
      <div className="savings-panel-glow" style={{ background: "#0a0a0a", padding: isMobile ? "24px 16px" : "32px 80px", borderBottom: "1px solid #1a1510", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 14 : 24 }}>
          {/* LEFT panel — Gold 1돈 tracker */}
          <div className="lift-card" style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              {lang === "ko" ? "금 1돈 구매 시 절약 금액" : "Savings on 1 Don Gold (3.75g)"}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 30, color: "#f5f0e8", marginBottom: 20, lineHeight: 1.15, fontWeight: 400 }}>
              {lang === "ko" ? "금 절약 비교" : "Gold Savings"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: lang === "ko" ? "한국 실물 시가" : "Korean Market", val: fPrice(goldKB_usd), col: "#f87171" },
                { label: lang === "ko" ? "아름 실물가" : "Aurum Price", val: fPrice(goldAurum_usd), col: "#4ade80" },
              ].map((x, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b" }}>{x.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 20, color: x.col, fontWeight: 600 }}>{x.val}</div>
                </div>
              ))}
              <div style={{ background: "rgba(74,222,128,0.07)", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)", marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{lang === "ko" ? "절약" : "Save"}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 24, color: "#4ade80", fontWeight: 700 }}>{fPrice(goldSavings_usd)}</div>
                </div>
                {/* C-2: % savings row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed rgba(74,222,128,0.2)", paddingTop: 6 }}>
                  <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>절약률</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#4ade80", fontWeight: 700, textAlign: "center" }}>{goldKB > 0 ? (goldSavings / goldKB * 100).toFixed(1) : "0.0"}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT panel — Silver 1kg tracker */}
          <div className="lift-card" style={{ background: "#111008", border: "1px solid rgba(197,165,114,0.15)", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              {lang === "ko" ? "은 1키로 구매시 절약 금액" : "Savings on 1kg Silver Bar"}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 30, color: "#f5f0e8", marginBottom: 20, lineHeight: 1.15, fontWeight: 400 }}>
              {lang === "ko" ? "은 절약 비교" : "Silver Savings"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: lang === "ko" ? "한국 실물 시가" : "Korean Market", val: fPrice(silverKB_usd), col: "#f87171" },
                { label: lang === "ko" ? "아름 실물가" : "Aurum Price", val: fPrice(silverAurum_usd), col: "#4ade80" },
              ].map((x, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b" }}>{x.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 20, color: x.col, fontWeight: 600 }}>{x.val}</div>
                </div>
              ))}
              <div style={{ background: "rgba(74,222,128,0.07)", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)", marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{lang === "ko" ? "절약" : "Save"}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 24, color: "#4ade80", fontWeight: 700 }}>{fPrice(silverSavings_usd)}</div>
                </div>
                {/* C-2: % savings row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed rgba(74,222,128,0.2)", paddingTop: 6 }}>
                  <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>절약률</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#4ade80", fontWeight: 700, textAlign: "center" }}>{silverKB > 0 ? (silverSavings / silverKB * 100).toFixed(1) : "0.0"}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* H-06: Horizontal premium comparison caption — A-1 ── */}
        <div style={{ marginTop: 16, padding: isMobile ? "16px 14px" : "18px 24px", background: "rgba(197,165,114,0.04)", border: "1px solid rgba(197,165,114,0.12)", borderRadius: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? 14 : 0, alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: isMobile ? 0 : "0 12px", borderRight: !isMobile ? "1px solid rgba(197,165,114,0.15)" : "none" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(24px, 4vw, 48px)", color: "#f87171", fontWeight: 700, lineHeight: 1 }}>15-20%+</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 11 : 12, color: "#8a7d6b", lineHeight: 1.4, marginTop: 6, textAlign: "center" }}>한국 평균 금 실물 프리미엄</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: isMobile ? 0 : "0 12px", borderRight: !isMobile ? "1px solid rgba(197,165,114,0.15)" : "none" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(24px, 4vw, 48px)", color: "#f87171", fontWeight: 700, lineHeight: 1 }}>30%+</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 11 : 12, color: "#8a7d6b", lineHeight: 1.4, marginTop: 6, textAlign: "center" }}>한국 평균 은 실물 프리미엄</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: isMobile ? 0 : "0 12px" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(24px, 4vw, 48px)", color: "#4ade80", fontWeight: 700, lineHeight: 1 }}>2.5–5.5%</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 11 : 12, color: "#8a7d6b", lineHeight: 1.4, marginTop: 6, textAlign: "center" }}>결제 대행사 수수료</div>
            </div>
          </div>
          <div style={{ borderTop: "1px dashed rgba(197,165,114,0.12)", paddingTop: 8, fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#555", lineHeight: 1.6 }}>
            {lang === "ko"
              ? "※ 한국 실물 시가는 KB Star 금·은 시세 기준 추정값입니다. 아름 가격은 국제 현물가 + 프리미엄 기준이며, 실시간으로 변동됩니다."
              : "※ Korean market prices are estimates based on KB Star gold & silver rates. Aurum prices are international spot + premium and update in real time."}
          </div>
        </div>
      </div>

      {/* ── 1d. WHY SILVER — new section after premium comparison ── */}
      <div style={{ background: "#111008", padding: isMobile ? "36px 16px" : "56px 80px", borderBottom: "1px solid #1a1510" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 40 }}>
          <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "🥈 2026년 은에 주목해야 하는 이유" : "🥈 WHY SILVER IN 2026"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 36 : 48, color: "#f5f0e8", fontWeight: 300, margin: "0 0 8px" }}>
            {lang === "ko"
              ? "은: 공급 부족은 현실입니다. 프리미엄은 오르고 있습니다."
              : "Silver: The Deficit Is Real. The Supply Is Tightening. The Premium Is Rising."}
          </h2>
        </div>
        {/* Stat strip */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 0, marginBottom: isMobile ? 28 : 40, background: "#0a0a0a", border: "1px solid #1a1510", borderRadius: 10, overflow: "hidden" }}>
          {[
            { val: "67 Moz", en: "2026 Supply Deficit", ko: "2026년 공급 부족" },
            { val: "6th Year", en: "Consecutive Annual Deficit", ko: "연속 공급 부족 연도" },
            { val: ">60%", en: "Industrial Demand Share", ko: "산업용 글로벌 수요 비중" },
            { val: "Scarce", en: "Korean Bank Availability", ko: "한국 은행 은 공급 부족" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: isMobile ? "18px 10px" : "26px 10px", borderRight: (!isMobile && i < 3) ? "1px solid #1a1510" : "none", borderBottom: (isMobile && i < 2) ? "1px solid #1a1510" : "none" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 22 : 28, color: "#c5a572", fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", lineHeight: 1.4 }}>{lang === "ko" ? s.ko : s.en}</div>
            </div>
          ))}
        </div>
        {/* Body */}
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 15, color: "#8a7d6b", lineHeight: 1.8, maxWidth: 760, margin: "0 auto 32px", textAlign: "center" }}>
          {lang === "ko"
            ? "글로벌 은 수요의 60% 이상이 태양광 패널, 전기차, AI 데이터센터, 방위산업에서 발생합니다. 공급은 구조적으로 타이트해지고 있습니다. 중국은 2026년 1월 은 수출에 엄격한 허가제를 도입했습니다. 한국에서는 실물 은에 대한 접근이 만성적으로 어렵고, 은행들은 공급 부족으로 은바 판매를 반복적으로 중단해왔습니다."
            : "Over 60% of global silver demand now comes from solar panels, electric vehicles, AI data centres, and defence systems. Supply is structurally tightening: China imposed strict export licensing controls in January 2026. In Korea, physical silver is chronically difficult to access — Korean banks have repeatedly suspended silver bar sales due to shortages."}
        </p>
        {/* Silver CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
          <button onClick={() => navigate("shop")} style={{ flex: 1, maxWidth: isMobile ? "none" : 320, background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#ffffff", border: "none", padding: "14px 20px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 6, cursor: "pointer", letterSpacing: 0.5 }}>
            {lang === "ko" ? "실물 금과 은 구매하기" : "실물 금과 은 구매하기"}
          </button>
          <button onClick={() => navigate("agp")} style={{ flex: 1, maxWidth: isMobile ? "none" : 320, background: "transparent", color: "#c5a572", border: "1px solid #c5a572", padding: "14px 20px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 6, cursor: "pointer" }}>
            {lang === "ko" ? "AGP 로 실물 금은 저축 시작" : "AGP 로 실물 금은 저축 시작"}
          </button>
        </div>
      </div>

      {/* ── 1b. TRUST BADGES — 2 new chips: Transparent Premium + Gold & Silver ── */}
      <div style={{ background: "#0a0a0a", padding: isMobile ? "20px 16px" : "28px 80px", display: "flex", justifyContent: "center", gap: isMobile ? 14 : 36, flexWrap: "wrap" }}>
        {[
          ["🏦", "Malca-Amit"],
          ["📜", "LBMA"],
          ["🛡️", lang === "ko" ? "완전 보험" : "Insured"],
          ["🔐", lang === "ko" ? "완전 배분" : "Allocated"],
          [<FlagSG size={18} />, "Singapore FTZ"],
          ["💰", lang === "ko" ? "현물가 + 투명한 프리미엄" : "Spot + Transparent Premium"],
          ["🥇🥈", lang === "ko" ? "금·은" : "Gold & Silver"],
        ].map(([icon, label], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: isMobile ? 12 : 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>
            <span style={{ fontSize: isMobile ? 18 : 20 }}>{icon}</span>{label}
          </div>
        ))}
      </div>

      {/* ── 1f. WHY SINGAPORE — compressed: 3 chips + 1 paragraph ── */}
      <div style={{ background: "#111008", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510", padding: isMobile ? "36px 16px" : "56px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 36 }}>
          <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "왜 싱가포르인가" : "Why Singapore"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 36 : 48, color: "#f5f0e8", fontWeight: 300, margin: "0 0 28px" }}>
            {lang === "ko" ? "싱가포르: 아시아 최고의 보관 관할지" : "Singapore: Asia's Most Trusted Vault Jurisdiction"}
          </h2>
        </div>
        {/* C-6: 3 boxes stacked vertically, single column, equal sized */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: isMobile ? 24 : 32, maxWidth: 600, margin: "0 auto 32px" }}>
          {[
            { icon: "🏅", en: "AAA Sovereign Credit Rating (Moody's · S&P · Fitch)", ko: "AAA 국가 신용등급 (Moody's · S&P · Fitch)" },
            { icon: "🚫", en: "Investment-Grade Gold & Silver: Fully GST-Exempt", ko: "투자용 금·은 GST 완전 면제" },
            { icon: "⚖️", en: "Strong Rule of Law · Stable Policy for 13+ Years", ko: "강력한 법치주의 · 13년 이상 일관된 정책" },
          ].map((chip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 10, padding: isMobile ? "14px 18px" : "16px 24px", fontSize: isMobile ? 13 : 14, color: "#a09080", fontFamily: "'Outfit',sans-serif", width: "100%", boxSizing: "border-box" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{chip.icon}</span>
              {lang === "ko" ? chip.ko : chip.en}
            </div>
          ))}
        </div>
        {/* Single paragraph */}
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 15, color: "#8a7d6b", lineHeight: 1.8, maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          {lang === "ko"
            ? "싱가포르는 아시아 어느 관할권보다 많은 민간 금고 내 금을 보유합니다. 싱가포르 통화청(MAS)은 PSPM Act 2019에 따라 귀금속 딜러를 규제합니다. 싱가포르 보관은 지리적 분산이며, 세금 회피가 아닙니다. 귀하의 금속은 한국의 규제·세금·통화 리스크 밖에 위치하면서도, 언제든 귀하가 직접 접근할 수 있습니다."
            : "Singapore holds more private vault gold than any other Asian jurisdiction. The Monetary Authority of Singapore regulates precious metals dealers under the PSPM Act 2019. Storing metal here is geographic diversification — not a tax scheme. Your metal stays outside Korean regulatory, tax, and currency risk while remaining fully accessible to you at any time."}
        </p>
      </div>

      {/* ── 1e. GENERATIONAL WEALTH MODULE — new strip after Why Singapore ── */}
      <div style={{ background: "#0a0a0a", padding: isMobile ? "36px 16px" : "56px 80px", borderBottom: "1px solid #1a1510" }}>
        <div style={{ background: "rgba(197,165,114,0.04)", border: "1px solid rgba(197,165,114,0.12)", borderLeft: "3px solid #c5a572", borderRadius: 8, padding: isMobile ? "24px 20px" : "36px 44px", maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 30, color: "#f5f0e8", fontWeight: 300, margin: "0 0 18px" }}>
            {lang === "ko" ? "세대를 이어 보존하는 자산" : "Built to Last Generations"}
          </h2>
          <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
            {(lang === "ko" ? [
              "금과 은은 수 세기 동안 구매력을 유지했으며, 법정화폐는 반복적으로 가치를 잃었습니다.",
              "법적 소유권이 명확한 배분 금속은 상속인에게 이전하기 가장 간단한 자산 중 하나입니다.",
              "복잡한 상속 절차 없음. 금융기관 의존 없음. 다음 세대를 위한 상대방 리스크 없음."
            ] : [
              "Gold and silver have preserved purchasing power across centuries while fiat currencies lost value.",
              "Allocated bullion with clear legal title is one of the simplest assets to pass to heirs.",
              "No complex probate. No reliance on financial institutions. No counterparty risk for your family."
            ]).map((b, i) => (
              <li key={i} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b", lineHeight: 1.7, marginBottom: 8 }}>{b}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* How It Works — fixed step numbers */}
      <div style={{ background: "#111008", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510", padding: isMobile ? "36px 16px" : "56px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 40 }}>
          <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "구매 방법" : "How It Works"}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 36 : 48, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "5단계로 완성되는 금 투자" : "5 Steps to Physical Gold Ownership"}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5,1fr)", gap: isMobile ? 12 : 0 }}>
          {[
            { n: "01", icon: "👤", ko: "회원가입", en: "Sign Up", sub: null },
            { n: "02", icon: "🥇", ko: "상품 선택", en: "Select", sub: null },
            { n: "03", icon: "💳", ko: "결제", en: "Pay", sub: "TossPay · KakaoPay · Wire · Card · Crypto" },
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
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 36 : 48, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>
            {lang === "ko" ? "실물 금을 찾는 3가지 방법" : "3 Ways to Take Your Gold"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 14 : 20, marginBottom: 20 }}>
          {[
            {
              icon: "💰",
              title: "매도 (Sell Back)",
              bullets: ["실시간 매수호가로 Aurum에 매도, 실물 이동 불필요", "KRW, USD, SGD 수취 가능", "연결된 은행 계좌로 2영업일 내 정산", "최소 보유기간 없음, 위약금 없음"]
            },
            {
              icon: "🏛️",
              title: "금고 방문 (Vault Pickup)",
              bullets: ["싱가포르 Malca-Amit 금고에서 직접 수령", "온라인 예약 필수, 여권·구매 증명서 지참", "싱가포르 반출 VAT·관세 없음", "싱가포르 또는 동남아 방문객에게 적합"]
            },
            {
              icon: "📦",
              title: "국제 택배 (International Courier)",
              bullets: ["보험 적용 전문 운송 (Brinks, Ferrari Group, Malca-Amit 물류)", "한국 또는 전 세계 배송", "한국 수입 시 관세·VAT 합계 13% (VAT 10% + 관세 3%)", "통관 서류는 Aurum이 전담 처리"]
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
function Shop({ lang, navigate, setProduct, prices, krwRate, addToCart, toast, currency, setCurrency }) {
  const fPrice = (usdAmt) => currency === "KRW" ? fKRW(usdAmt * krwRate) : fUSD(usdAmt);
  const isMobile = useIsMobile();
  const [metal, setMetal] = useState("all");
  const [type, setType] = useState("all");
  const filtered = PRODUCTS.filter(p => (metal === "all" || p.metal === metal) && (type === "all" || p.type === type));
  const Fb = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{ background: active ? "#c5a572" : "transparent", color: active ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${active ? "#c5a572" : "#2a2318"}`, padding: isMobile ? "6px 14px" : "7px 18px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: active ? 600 : 400, transition: "all 0.15s" }}>{children}</button>
  );
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 28 : 38, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "귀금속 매장" : "Precious Metals Shop"}</h2>
        <CurrencyToggle currency={currency} setCurrency={setCurrency} />
      </div>
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
                  {/* D-1: toggle-aware primary price */}
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 14 : 17, color: "#c5a572", fontWeight: 600 }}>{fPrice(price)}</div>
                </div>
                <div style={{ fontSize: 10, color: "#a09080", fontFamily: "'Outfit',sans-serif" }}>Aurum가</div>
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
function ProductPage({ product, lang, navigate, prices, krwRate, user, setShowLogin, addToCart, toast, currency, setCurrency }) {
  const fPrice = (usdAmt) => currency === "KRW" ? fKRW(usdAmt * krwRate) : fUSD(usdAmt);
  const isMobile = useIsMobile();
  const [storage, setStorage] = useState("singapore");
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const unit = calcPrice(product, prices);  // = spot * 1.08
  const spot = unit / (1 + product.premium); // international spot for this product
  const koreaPrice = spot * 1.15; // 15% kimchi premium over spot
  const savings = koreaPrice - unit; // what customer saves vs Korean market
  const storageAnnualFee = unit * 0.003; // 0.3%/yr Singapore storage
  const duty = storage === "korea" ? unit * 0.13 : 0; // 13% = 3% customs + 10% VAT
  // Grand total: for Singapore add annual storage; for Korea add 13% duty
  const total = storage === "singapore"
    ? (unit + storageAnnualFee) * qty
    : (unit + duty) * qty;

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <button onClick={() => navigate("shop-physical")} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>← {lang === "ko" ? "매장으로" : "Back to Shop"}</button>
        <CurrencyToggle currency={currency} setCurrency={setCurrency} />
      </div>
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

          {/* D-2: Pricing table — toggle-aware, correct math */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 16 : 22, marginBottom: 18 }}>
            {/* Row 1: Korea physical price (15% kimchi premium) */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#a09080", fontFamily: "'Outfit',sans-serif" }}>한국 물리금 가격</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#f87171" }}>{fPrice(koreaPrice * qty)}</span>
            </div>
            {/* Row 2: Customer savings — green */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#4ade80", fontFamily: "'Outfit',sans-serif" }}>고객 절약액</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#4ade80" }}>−{fPrice(savings * qty)}</span>
            </div>
            {/* Row 3: Aurum price */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#a09080", fontFamily: "'Outfit',sans-serif" }}>Aurum 가격</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{fPrice(unit * qty)}</span>
            </div>
            {/* Row 4: Storage fee (Singapore) or Korea duty — conditional */}
            {storage === "singapore" && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#a09080", fontFamily: "'Outfit',sans-serif" }}>보관료 연 예상 (0.3%)</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#a09080" }}>{fPrice(storageAnnualFee * qty)}</span>
              </div>
            )}
            {storage === "korea" && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#f87171", fontFamily: "'Outfit',sans-serif" }}>한국 관세/VAT (13%)</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#f87171" }}>+{fPrice(duty)}</span>
              </div>
            )}
            {/* Row 5: Total */}
            <div style={{ borderTop: "1px solid #2a2318", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#f5f0e8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>총 결제 금액</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 20 : 26, color: "#c5a572", fontWeight: 700 }}>{fPrice(total)}</span>
            </div>
          </div>

          {/* Storage Option */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: "#8a7d6b", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "보관 옵션" : "Storage Option"}</div>
            <div style={{ display: "flex", gap: 10, flexDirection: isMobile ? "column" : "row" }}>
              {[
                { key: "singapore", icon: <FlagSG size={16} />, label: lang === "ko" ? "싱가포르 볼트" : "Singapore Vault", sub: lang === "ko" ? "GST 면제 · 연 0.3%" : "No GST · 0.3%/yr" },
                { key: "korea", icon: <FlagKR size={16} />, label: lang === "ko" ? "한국 배송" : "Ship to Korea", sub: lang === "ko" ? "관세+VAT 13% 부과" : "13% duties apply" },
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
            <span style={{ fontSize: 14, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>총 결제금액</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 22 : 28, color: "#c5a572", fontWeight: 700 }}>{fPrice(total)}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={buyNow} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "15px", fontSize: 16, fontWeight: 700, borderRadius: 8, cursor: "pointer", letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "지금 구매하기" : "Buy Now"}
            </button>
            <button onClick={addCart} style={{ width: "100%", background: "transparent", color: "#c5a572", border: "1px solid #c5a572", padding: "13px", fontSize: 14, fontWeight: 600, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "장바구니 담기" : "Add to Cart"}
            </button>
            {/* D-4: Back to Products button */}
            <button onClick={() => navigate("shop-physical")} style={{ width: "100%", background: "transparent", color: "#a09080", border: "1px solid #282828", padding: "13px", fontSize: 14, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "← 매장으로 돌아가기" : "← Back to Products"}
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
function CartPage({ lang, navigate, cart, removeFromCart, updateCartQty, prices, krwRate, currency, setCurrency, setProduct, cartPayMethod, setCartPayMethod }) {
  const fPrice = (usdAmt) => currency === "KRW" ? fKRW(usdAmt * krwRate) : fUSD(usdAmt);
  const payFeeRates = { toss: 0.003, card: 0.055, wire: 0.003, crypto: 0.025 };
  const isMobile = useIsMobile();
  if (cart.length === 0) return (
    <div style={{ padding: isMobile ? "60px 16px" : "80px", textAlign: "center", background: "#0a0a0a", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 18 }}>🛒</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: "#f5f0e8", fontWeight: 300, marginBottom: 10 }}>{lang === "ko" ? "장바구니가 비어 있습니다" : "Your cart is empty"}</h2>
      <p style={{ color: "#8a7d6b", marginBottom: 28, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "매장에서 실물 귀금속을 선택하세요." : "Browse our shop for physical precious metals."}</p>
      <button onClick={() => navigate("shop-physical")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 32px", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "매장 둘러보기" : "Browse Shop"}</button>
    </div>
  );
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const storageFee = subtotal * 0.003; // 0.3%/yr
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "장바구니" : "Cart"}</h2>
        <CurrencyToggle currency={currency} setCurrency={setCurrency} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 360px", gap: isMobile ? 24 : 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cart.map(item => (
            <div key={item.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 14 : 20, display: "flex", gap: isMobile ? 12 : 20, alignItems: "center" }}>
              <div style={{ fontSize: isMobile ? 36 : 48, flexShrink: 0 }}>{item.image}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 14, color: "#c5a572", fontWeight: 500, marginBottom: 2, cursor: "pointer", textDecoration: "underline", textDecorationColor: "rgba(197,165,114,0.4)" }} onClick={() => { const prod = PRODUCTS.find(p => p.id === item.id); if (prod && setProduct) { setProduct(prod); navigate("product"); } }}>{lang === "ko" ? item.nameKo : item.name}</div>
                <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 4 }}>{item.storage === "singapore" ? <><FlagSG size={14} /> {lang === "ko" ? "싱가포르 볼트" : "Singapore Vault"}</> : <><FlagKR size={14} /> {lang === "ko" ? "한국 배송" : "Ship to Korea"}</>}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572", marginTop: 6 }}>{fPrice(item.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2318", borderRadius: 6 }}>
                <button onClick={() => updateCartQty(item.cartKey, Math.max(1, item.qty - 1))} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "6px 10px", fontSize: 16 }}>−</button>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#f5f0e8", padding: "0 10px", fontSize: 13 }}>{item.qty}</span>
                <button onClick={() => updateCartQty(item.cartKey, item.qty + 1)} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "6px 10px", fontSize: 16 }}>+</button>
              </div>
              <div style={{ textAlign: "right", minWidth: isMobile ? 80 : 100 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#c5a572", fontWeight: 600 }}>{fPrice(item.price * item.qty)}</div>
                <button onClick={() => removeFromCart(item.cartKey)} style={{ background: "none", border: "none", color: "#f87171", fontSize: 11, cursor: "pointer", marginTop: 4, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "삭제" : "Remove"}</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 18 : 24, height: "fit-content" }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: "#f5f0e8", fontWeight: 600, margin: "0 0 20px" }}>주문 요약</h3>
          {/* E-3: Cart summary — toggle-aware, correct kimchi math */}
          {(() => {
            const spot_sum = subtotal / 1.08;
            const koreaTotal = spot_sum * 1.15;
            const savings = koreaTotal - subtotal;
            return (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#a09080", fontFamily: "'Outfit',sans-serif" }}>한국 물리금 가격 총액</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#f87171" }}>{fPrice(koreaTotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#4ade80", fontFamily: "'Outfit',sans-serif" }}>고객 절약액</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#4ade80" }}>−{fPrice(savings)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#a09080", fontFamily: "'Outfit',sans-serif" }}>Aurum 가격</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#c5a572" }}>{fPrice(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#a09080", fontFamily: "'Outfit',sans-serif" }}>보관료 연 예상 (0.3%)</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#8a7d6b" }}>{fPrice(storageFee)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 11, color: "#a09080", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap" }}>결제 수수료</span>
                    <select value={cartPayMethod} onChange={e => setCartPayMethod(e.target.value)} onClick={e => e.stopPropagation()} style={{ background: "#141414", border: "1px solid #282828", color: "#c5a572", fontSize: 9, padding: "1px 4px", borderRadius: 3, fontFamily: "'Outfit',sans-serif", cursor: "pointer", maxWidth: 90 }}>
                      <option value="toss">토스뱅크</option>
                      <option value="wire">전신환</option>
                      <option value="card">신용카드</option>
                      <option value="crypto">암호화폐</option>
                    </select>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#8a7d6b", flexShrink: 0 }}>{fPrice(subtotal * payFeeRates[cartPayMethod])}</span>
                </div>
              </>
            );
          })()}
          <div style={{ borderTop: "1px solid #2a2318", paddingTop: 14, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15, color: "#f5f0e8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>총 결제금액</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, color: "#c5a572", fontWeight: 700 }}>{fPrice(subtotal + storageFee + subtotal * payFeeRates[cartPayMethod])}</span>
            </div>
          </div>
          <button onClick={() => navigate("checkout")} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "14px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "결제 진행" : "Proceed to Checkout"}
          </button>
          <button onClick={() => navigate("shop-physical")} style={{ width: "100%", marginTop: 10, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "12px", fontSize: 13, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
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
function Checkout({ lang, navigate, cart, clearCart, prices, krwRate, user, addOrder, toast, currency, setCurrency, initialPayMethod }) {
  const fPrice = (usdAmt) => currency === "KRW" ? fKRW(usdAmt * krwRate) : fUSD(usdAmt);
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState(initialPayMethod || null);
  const payFeeRates = { toss: 0.003, kakao: 0.003, wire: 0.003, card: 0.055, crypto: 0.025 };
  const [terms, setTerms] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [wireDetails, setWireDetails] = useState(null);
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const storageFeeY1 = subtotal * 0.003; // 0.3%/yr

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
      <button onClick={() => navigate("shop-physical")} style={{ marginTop: 20, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 28px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "매장으로" : "Go to Shop"}</button>
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
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: "#c5a572", fontWeight: 600 }}>{fPrice(item.price * item.qty)}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 18, marginBottom: 24 }}>
            {[[lang === "ko" ? "상품 소계" : "Subtotal", fPrice(subtotal), "#ddd"], ["보관료 연 예상 (0.3%)", fPrice(storageFeeY1), "#8a7d6b"]].map(([l, v, c], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{l}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: c }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #2a2318", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, color: "#f5f0e8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "합계" : "Total"}</span>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, color: "#c5a572", fontWeight: 700 }}>{fPrice(subtotal + storageFeeY1)}</span>
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
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{fPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          {/* Step 3 payment breakdown — full total including storage + tx fee */}
          {(() => {
            const txFeeRate = payFeeRates[payMethod] || 0.003;
            const txFee = subtotal * txFeeRate;
            const grandTotal = subtotal + storageFeeY1 + txFee;
            const methodName = payMethods.find(m => m.key === payMethod)?.name || '—';
            return (
              <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: 20, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>결제 내역</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>Aurum 가격</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{fPrice(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>보관료 연 예상 (0.3%)</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#8a7d6b" }}>{fPrice(storageFeeY1)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{methodName} 수수료 ({(txFeeRate * 100).toFixed(1)}%)</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#8a7d6b" }}>{fPrice(txFee)}</span>
                </div>
                <div style={{ borderTop: "1px solid #2a2318", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, color: "#f5f0e8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>총 결제금액</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, color: "#c5a572", fontWeight: 700 }}>{fPrice(grandTotal)}</span>
                </div>
              </div>
            );
          })()}
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
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: "#c5a572", fontWeight: 700 }}>{fPrice(subtotal + storageFeeY1 + subtotal * (payFeeRates[payMethod] || 0.003))}</span>
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
                [lang === "ko" ? "송금 금액" : "Amount", fPrice(wireDetails.amount)],
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
            <button onClick={() => navigate("shop-physical")} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "13px", fontSize: 14, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "쇼핑 계속하기" : "Continue Shopping"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



export { Home, Shop, ProductPage, CartPage, Checkout };
