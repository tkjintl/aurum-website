import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile, useInView, useLivePrices, useToast, calcPrice, fUSD, fKRW, fDateLong, PRODUCTS, MOCK_HOLDINGS, MOCK_ORDERS_INIT, AUDIT_TRAIL_INIT, API } from "./lib.jsx";
import { ToastContainer, Ticker, Nav, LoginModal } from "./BaseUI.jsx";
import { Home, Shop, ProductPage, CartPage, Checkout } from "./ShopPages.jsx";
import { OrderHistoryPage, AccountPage, KYCFlowPage, WhyGold, Learn, Storage, AGP, AGPBackingReport } from "./UserPages.jsx";
// Phase 2: Visual foundation + Phase 3: New pages
import "./styles/aurum-motion.css";
import { initMagneticCards } from "./lib/magnetic";
import ShopSelectorPage from "./pages/ShopSelectorPage";
import AGPIntroPage from "./pages/AGPIntroPage";
import AGPEnrollPage from "./pages/AGPEnrollPage";

// Inline flag SVG for holdings table
const FlagSG = ({ size = 14 }) => (
  <svg width={size} height={Math.round(size * 0.67)} viewBox="0 0 20 14" style={{ display: "inline-block", verticalAlign: "middle", borderRadius: 2, flexShrink: 0 }}>
    <rect width="20" height="7" fill="#EF3340" />
    <rect y="7" width="20" height="7" fill="#fff" />
    <circle cx="5" cy="7" r="3" fill="#fff" />
    <circle cx="6.2" cy="7" r="2.3" fill="#EF3340" />
    <g fill="#fff">
      <circle cx="9" cy="4.5" r="0.65" /><circle cx="10.3" cy="5.8" r="0.65" />
      <circle cx="9.8" cy="7.6" r="0.65" /><circle cx="8.2" cy="7.6" r="0.65" />
      <circle cx="7.7" cy="5.8" r="0.65" />
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// VAULT DASHBOARD — Enhanced
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({ lang, navigate, prices, krwRate, user, orders, holdings, toast }) {
  const isMobile = useIsMobile();
  const [showAudit, setShowAudit] = useState(false);
  const [genCert, setGenCert] = useState(false);
  const [auditTrail] = useState(AUDIT_TRAIL_INIT);
  const [activeHolding, setActiveHolding] = useState(null);

  if (!user) return (
    <div style={{ padding: "80px", textAlign: "center", background: "#0a0a0a", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: "#f5f0e8", fontWeight: 300, marginBottom: 10 }}>{lang === "ko" ? "로그인이 필요합니다" : "Login Required"}</h2>
      <button onClick={() => navigate("home")} style={{ marginTop: 8, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 28px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "홈으로" : "Go Home"}</button>
    </div>
  );

  const goldOz = holdings.filter(h => h.metal === "gold").reduce((s, h) => s + h.weightOz, 0);
  const silverOz = holdings.filter(h => h.metal === "silver").reduce((s, h) => s + h.weightOz, 0);
  const goldVal = goldOz * prices.gold;
  const silverVal = silverOz * prices.silver;
  const totalVal = goldVal + silverVal;
  const totalCost = holdings.reduce((s, h) => s + h.purchasePrice, 0);
  const totalPnL = totalVal - totalCost;
  const goldPct = totalVal > 0 ? (goldVal / totalVal * 100).toFixed(0) : 0;
  const silverPct = totalVal > 0 ? (silverVal / totalVal * 100).toFixed(0) : 0;

  const curVal = (h) => (h.metal === "gold" ? prices.gold : prices.silver) * h.weightOz;

  const requestCert = async () => {
    setGenCert(true);
    await API.vault.generateCertificate(user.id);
    setGenCert(false);
    toast(lang === "ko" ? "볼트 인증서가 이메일로 발송되었습니다." : "Vault certificate sent to your email.", "info");
  };

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 24, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 14 : 0 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 3px" }}>{lang === "ko" ? "내 보유자산" : "My Holdings"}</h2>
          <p style={{ fontSize: 12, color: "#8a7d6b", margin: 0, fontFamily: "'Outfit',sans-serif" }}>Malca-Amit Singapore FTZ · Lloyd's of London Insured</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => navigate("sell")} style={{ background: "transparent", border: "1px solid rgba(248,113,113,0.4)", color: "#f87171", padding: isMobile ? "9px 14px" : "9px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "매도" : "Sell"}</button>
          <button onClick={() => navigate("withdraw")} style={{ background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: isMobile ? "9px 14px" : "9px 18px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "실물 인출" : "Withdraw"}</button>
          <button onClick={() => navigate("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: isMobile ? "9px 14px" : "9px 18px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>+ {lang === "ko" ? "구매" : "Buy More"}</button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 16, marginBottom: 20 }}>
        {[
          { label: lang === "ko" ? "총 가치" : "Total Value", value: fUSD(totalVal), sub: fKRW(totalVal * krwRate), col: "#c5a572" },
          { label: lang === "ko" ? "금" : "Gold", value: `${goldOz.toFixed(2)} oz`, sub: fUSD(goldVal), col: "#c5a572" },
          { label: lang === "ko" ? "은" : "Silver", value: `${silverOz.toFixed(0)} oz`, sub: fUSD(silverVal), col: "#aaa" },
          { label: "P&L", value: `${totalPnL >= 0 ? "+" : ""}${fUSD(totalPnL)}`, sub: `${totalCost > 0 ? ((totalPnL / totalCost) * 100).toFixed(1) : "0"}%`, col: totalPnL >= 0 ? "#4ade80" : "#f87171" },
        ].map((c, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 12 : 20 }}>
            <div style={{ fontSize: 10, color: "#8a7d6b", marginBottom: 5, fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{c.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 14 : 19, color: c.col, fontWeight: 600 }}>{c.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#666", marginTop: 3 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Allocation bar */}
      {totalVal > 0 && (
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 14 : 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "자산 배분" : "Allocation"}</span>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ fontSize: 12, color: "#c5a572", fontFamily: "'Outfit',sans-serif" }}>🥇 {lang === "ko" ? "금" : "Gold"} {goldPct}%</span>
              <span style={{ fontSize: 12, color: "#aaa", fontFamily: "'Outfit',sans-serif" }}>🥈 {lang === "ko" ? "은" : "Silver"} {silverPct}%</span>
            </div>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: "#1a1510", overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${goldPct}%`, background: "linear-gradient(90deg,#c5a572,#8a6914)", transition: "width 0.6s ease" }} />
            <div style={{ width: `${silverPct}%`, background: "#666", transition: "width 0.6s ease" }} />
          </div>
        </div>
      )}

      {/* Insurance badge */}
      <div style={{ background: "linear-gradient(135deg,rgba(197,165,114,0.05),rgba(197,165,114,0.08))", border: "1px solid rgba(197,165,114,0.2)", borderRadius: 8, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>🛡️</span>
        <div>
          <div style={{ fontSize: 13, color: "#c5a572", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>Lloyd's of London — {lang === "ko" ? "완전 보험 적용" : "Fully Insured"}</div>
          <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "보유 자산 전액에 대해 Lloyd's of London 보험이 적용됩니다." : "All holdings covered by Lloyd's of London insurance."}</div>
        </div>
        <button onClick={requestCert} disabled={genCert} style={{ marginLeft: "auto", background: "none", border: "1px solid rgba(197,165,114,0.3)", color: "#c5a572", padding: "6px 14px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
          {genCert ? "..." : (lang === "ko" ? "인증서 발급" : "Get Certificate")}
        </button>
      </div>

      {/* Holdings Table / Cards */}
      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#8a7d6b", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 14px" }}>{lang === "ko" ? "보유 항목" : "Holdings"}</h3>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {holdings.map(h => {
            const cur = curVal(h);
            const pnl = cur - h.purchasePrice;
            return (
              <div key={h.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 28 }}>{h.image}</span>
                    <div>
                      <div style={{ fontSize: 13, color: "#f5f0e8", fontWeight: 500, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? h.nameKo : h.product}</div>
                      <div style={{ fontSize: 10, color: "#8a7d6b", fontFamily: "'JetBrains Mono',monospace" }}>{h.serial}</div>
                    </div>
                  </div>
                  <button onClick={() => { setActiveHolding(h); navigate("sell"); }} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "4px 10px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "매도" : "Sell"}</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {[[lang === "ko" ? "매수가" : "Bought", fUSD(h.purchasePrice), "#ddd"], [lang === "ko" ? "현재가" : "Now", fUSD(cur), "#c5a572"], ["P&L", `${pnl >= 0 ? "+" : ""}${fUSD(pnl)}`, pnl >= 0 ? "#4ade80" : "#f87171"]].map(([l, v, c], i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#555", fontFamily: "'Outfit',sans-serif", marginBottom: 2 }}>{l}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: c }}>{v}</div>
                    </div>
                  ))}
                </div>
                {h.assayCert && <div style={{ marginTop: 8, fontSize: 10, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>📜 {lang === "ko" ? "순도 인증서 포함" : "Assay cert included"} · {h.zone}</div>}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
            <thead><tr style={{ background: "#0d0b08" }}>{[lang === "ko" ? "상품" : "Product", lang === "ko" ? "일련번호" : "Serial", lang === "ko" ? "매수가" : "Buy Price", lang === "ko" ? "현재가" : "Current", "P&L", lang === "ko" ? "볼트" : "Vault", ""].map((h, i) => <th key={i} style={{ textAlign: "left", padding: "12px 14px", color: "#8a7d6b", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Outfit',sans-serif" }}>{h}</th>)}</tr></thead>
            <tbody>{holdings.map(h => {
              const cur = curVal(h);
              const pnl = cur - h.purchasePrice;
              return (
                <tr key={h.id} style={{ borderBottom: "1px solid #1a1510" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0d0c08"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ padding: 14 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 24 }}>{h.image}</span>
                      <div><div style={{ color: "#f5f0e8", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? h.nameKo : h.product}</div><div style={{ fontSize: 10, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{h.weightOz} oz · {h.purchaseDate}</div></div>
                    </div>
                  </td>
                  <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#8a7d6b", fontSize: 11 }}>{h.serial}</td>
                  <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#ddd", fontSize: 13 }}>{fUSD(h.purchasePrice)}</td>
                  <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#c5a572", fontSize: 13 }}>{fUSD(cur)}</td>
                  <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: pnl >= 0 ? "#4ade80" : "#f87171", fontSize: 13 }}>{pnl >= 0 ? "+" : ""}{fUSD(pnl)}</td>
                  <td style={{ padding: 14, fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 4 }}><FlagSG size={14} /> {h.zone}</td>
                  <td style={{ padding: 14 }}><button onClick={() => navigate("sell")} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "5px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "매도" : "Sell"}</button></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {/* Audit Trail */}
      <div style={{ marginTop: 28 }}>
        <button onClick={() => setShowAudit(!showAudit)} style={{ background: "none", border: "none", color: "#8a7d6b", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <span style={{ transform: showAudit ? "rotate(180deg)" : "none", transition: "0.2s", display: "inline-block" }}>▾</span>
          {lang === "ko" ? "감사 추적 (Audit Trail)" : "Audit Trail"}
        </button>
        {showAudit && (
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, overflow: "hidden" }}>
            {auditTrail.map((entry, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "12px 16px", borderBottom: i < auditTrail.length - 1 ? "1px solid #1a1510" : "none", alignItems: "flex-start" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.type === "vault" ? "#c5a572" : "#4ade80", marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif", fontWeight: 500, marginBottom: 2 }}>{entry.event}</div>
                  <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.detail}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#555", flexShrink: 0 }}>{entry.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SELL FLOW
// ═══════════════════════════════════════════════════════════════════════════════
function SellFlowPage({ lang, navigate, prices, krwRate, holdings, toast }) {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState(1);
  const [payout, setPayout] = useState("krw");
  const [submitting, setSubmitting] = useState(false);
  const bidFactor = 0.995;

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const selHoldings = holdings.filter(h => selected.includes(h.id));
  const totalBid = selHoldings.reduce((s, h) => s + (h.metal === "gold" ? prices.gold : prices.silver) * h.weightOz * bidFactor, 0);

  const submit = async () => {
    setSubmitting(true);
    await API.vault.requestSell(selected);
    setSubmitting(false);
    toast(lang === "ko" ? "매도 요청이 접수되었습니다. 영업일 1일 내에 처리됩니다." : "Sell request submitted. Processed within 1 business day.", "info");
    navigate("dashboard");
  };

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <button onClick={() => navigate("dashboard")} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "보유자산으로" : "Back to Holdings"}</button>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 24px" }}>{lang === "ko" ? "실물 금 매도" : "Sell Holdings"}</h2>

      {step === 1 && (
        <div style={{ maxWidth: 660 }}>
          <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", fontSize: 13, marginBottom: 20 }}>{lang === "ko" ? "매도할 자산을 선택하세요. 현재 매수 호가로 정산됩니다." : "Select holdings to sell. Settlement at current bid price."}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {holdings.map(h => {
              const bid = (h.metal === "gold" ? prices.gold : prices.silver) * h.weightOz * bidFactor;
              const isSel = selected.includes(h.id);
              return (
                <div key={h.id} onClick={() => toggle(h.id)} style={{ background: "#111008", border: `1.5px solid ${isSel ? "#c5a572" : "#1a1510"}`, borderRadius: 8, padding: 16, cursor: "pointer", display: "flex", gap: 14, alignItems: "center", transition: "border-color 0.15s" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${isSel ? "#c5a572" : "#2a2318"}`, background: isSel ? "#c5a572" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>{isSel && <span style={{ color: "#0a0a0a", fontSize: 12, fontWeight: 700 }}>✓</span>}</div>
                  <span style={{ fontSize: 28 }}>{h.image}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>{lang === "ko" ? h.nameKo : h.product}</div>
                    <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'JetBrains Mono',monospace" }}>{h.serial}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#c5a572", fontWeight: 600 }}>{fUSD(bid)}</div>
                    <div style={{ fontSize: 10, color: "#555", fontFamily: "'Outfit',sans-serif" }}>bid {((1 - bidFactor) * 100).toFixed(1)}% spread</div>
                  </div>
                </div>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 18, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "선택 항목" : "Selected"}</span>
                <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{selected.length}개</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{lang === "ko" ? "예상 정산금" : "Expected Payout"}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, color: "#4ade80", fontWeight: 700 }}>{fUSD(totalBid)}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666" }}>{fKRW(totalBid * krwRate)}</div>
                </div>
              </div>
            </div>
          )}
          <button disabled={selected.length === 0} onClick={() => setStep(2)} style={{ width: "100%", background: selected.length > 0 ? "linear-gradient(135deg,#c5a572,#8a6914)" : "#1a1510", border: "none", color: selected.length > 0 ? "#0a0a0a" : "#555", padding: "14px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: selected.length > 0 ? "pointer" : "not-allowed", fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "계속" : "Continue"} →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: 560 }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#c5a572", margin: "0 0 18px", fontWeight: 600 }}>{lang === "ko" ? "정산 방법 선택" : "Payout Method"}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[{ k: "krw", label: lang === "ko" ? "KRW 은행 이체 (한국)" : "KRW Bank Transfer (Korea)" }, { k: "usd", label: lang === "ko" ? "USD 전신환 (국제)" : "USD Wire Transfer (International)" }].map(o => (
              <button key={o.k} onClick={() => setPayout(o.k)} style={{ background: payout === o.k ? "rgba(197,165,114,0.08)" : "#111008", border: `1.5px solid ${payout === o.k ? "#c5a572" : "#2a2318"}`, borderRadius: 8, padding: "14px 18px", cursor: "pointer", textAlign: "left", fontSize: 14, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>
                {o.label}
              </button>
            ))}
          </div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "정산 금액" : "Payout"}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, color: "#4ade80", fontWeight: 700 }}>{payout === "krw" ? fKRW(totalBid * krwRate) : fUSD(totalBid)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#555", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "처리 시간" : "Settlement"}</span>
              <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "영업일 1일" : "1 business day"}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "13px", borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "이전" : "Back"}</button>
            <button onClick={submit} disabled={submitting} style={{ flex: 2, background: submitting ? "#2a2318" : "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: submitting ? "#555" : "#0a0a0a", padding: "13px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? (lang === "ko" ? "처리 중..." : "Submitting...") : (lang === "ko" ? "매도 요청" : "Submit Sell Request")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WITHDRAW FLOW (Physical Delivery)
// ═══════════════════════════════════════════════════════════════════════════════
function WithdrawFlowPage({ lang, navigate, holdings, krwRate, toast }) {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({ name: "", street: "", city: "", zip: "", country: "KR" });
  const [shipping, setShipping] = useState("express");
  const [submitting, setSubmitting] = useState(false);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const selItems = holdings.filter(h => selected.includes(h.id));
  const dutyRate = addr.country === "KR" ? 0.13 : 0;
  const shippingFee = { express: 150, standard: 80 }[shipping] || 80;

  const submit = async () => {
    setSubmitting(true);
    await API.vault.requestWithdraw(selected, addr);
    setSubmitting(false);
    toast(lang === "ko" ? "실물 인출 요청이 접수되었습니다. 영업일 2~3일 내에 발송됩니다." : "Withdrawal request submitted. Ships within 2–3 business days.", "info");
    navigate("dashboard");
  };

  const inp = { width: "100%", background: "#0a0a0a", border: "1px solid #2a2318", borderRadius: 6, color: "#f5f0e8", padding: "10px 13px", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box", marginBottom: 10 };

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <button onClick={() => navigate("dashboard")} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "보유자산으로" : "Back"}</button>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 24px" }}>{lang === "ko" ? "실물 인출 요청" : "Request Physical Withdrawal"}</h2>
      <div style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: "#f87171", fontFamily: "'Outfit',sans-serif", margin: 0, lineHeight: 1.6 }}>⚠️ {lang === "ko" ? "한국으로 반입 시 관세(3%) + 부가세(10%) = 약 13%가 부과됩니다. 인출 전 세무사 상담을 권장합니다." : "Import to Korea incurs ~13% duties. Consult a tax advisor before withdrawing."}</p>
      </div>

      {step === 1 && (
        <div style={{ maxWidth: 640 }}>
          <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", fontSize: 13, marginBottom: 16 }}>{lang === "ko" ? "인출할 자산을 선택하세요." : "Select items to withdraw."}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {holdings.map(h => {
              const isSel = selected.includes(h.id);
              return (
                <div key={h.id} onClick={() => toggle(h.id)} style={{ background: "#111008", border: `1.5px solid ${isSel ? "#c5a572" : "#1a1510"}`, borderRadius: 8, padding: 16, cursor: "pointer", display: "flex", gap: 12, alignItems: "center", transition: "border-color 0.15s" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${isSel ? "#c5a572" : "#2a2318"}`, background: isSel ? "#c5a572" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{isSel && <span style={{ color: "#0a0a0a", fontSize: 12, fontWeight: 700 }}>✓</span>}</div>
                  <span style={{ fontSize: 28 }}>{h.image}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? h.nameKo : h.product}</div>
                    <div style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'JetBrains Mono',monospace" }}>{h.serial} · {h.vault}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <button disabled={selected.length === 0} onClick={() => setStep(2)} style={{ width: "100%", background: selected.length > 0 ? "linear-gradient(135deg,#c5a572,#8a6914)" : "#1a1510", border: "none", color: selected.length > 0 ? "#0a0a0a" : "#555", padding: "14px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: selected.length > 0 ? "pointer" : "not-allowed" }}>
            {lang === "ko" ? "배송지 입력" : "Enter Delivery Address"} →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: 560 }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#c5a572", margin: "0 0 18px", fontWeight: 600 }}>{lang === "ko" ? "배송지 정보" : "Delivery Address"}</h3>
          <input value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} placeholder={lang === "ko" ? "수령인 이름" : "Recipient Name"} style={inp} />
          <input value={addr.street} onChange={e => setAddr({ ...addr, street: e.target.value })} placeholder={lang === "ko" ? "주소" : "Street Address"} style={inp} />
          <input value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} placeholder={lang === "ko" ? "도시" : "City"} style={inp} />
          <input value={addr.zip} onChange={e => setAddr({ ...addr, zip: e.target.value })} placeholder={lang === "ko" ? "우편번호" : "Postal Code"} style={inp} />
          <select value={addr.country} onChange={e => setAddr({ ...addr, country: e.target.value })} style={{ ...inp }}>
            <option value="KR">{lang === "ko" ? "대한민국" : "South Korea"}</option>
            <option value="SG">{lang === "ko" ? "싱가포르" : "Singapore"}</option>
            <option value="US">{lang === "ko" ? "미국" : "United States"}</option>
            <option value="OTHER">{lang === "ko" ? "기타" : "Other"}</option>
          </select>
          <div style={{ marginTop: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 8 }}>{lang === "ko" ? "배송 옵션" : "Shipping"}</div>
            {[{ k: "express", label: `${lang === "ko" ? "특급 보험 배송" : "Express Insured"} (DHL/FedEx)`, price: "$150" }, { k: "standard", label: `${lang === "ko" ? "일반 보험 배송" : "Standard Insured"}`, price: "$80" }].map(o => (
              <button key={o.k} onClick={() => setShipping(o.k)} style={{ width: "100%", background: shipping === o.k ? "rgba(197,165,114,0.07)" : "#111008", border: `1.5px solid ${shipping === o.k ? "#c5a572" : "#2a2318"}`, borderRadius: 8, padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{o.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{o.price}</span>
              </button>
            ))}
          </div>
          {addr.country === "KR" && (
            <div style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#f87171", fontFamily: "'Outfit',sans-serif", margin: 0 }}>{lang === "ko" ? "한국 반입 시 약 13% 관세/부가세가 별도 부과됩니다." : "~13% duties apply on import to Korea (separate from this fee)."}</p>
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "13px", borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "이전" : "Back"}</button>
            <button onClick={submit} disabled={submitting || !addr.name || !addr.street} style={{ flex: 2, background: (!addr.name || !addr.street || submitting) ? "#2a2318" : "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: (!addr.name || !addr.street || submitting) ? "#555" : "#0a0a0a", padding: "13px", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer" }}>
              {submitting ? (lang === "ko" ? "처리 중..." : "Submitting...") : (lang === "ko" ? "인출 요청" : "Submit Request")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
function Footer({ lang, navigate }) {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid #1a1510", padding: isMobile ? "28px 16px 16px" : "44px 80px 24px", marginTop: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 20 : 40, marginBottom: isMobile ? 20 : 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div className="aurum-logo-mark" style={{ width: 24, height: 24, border: "1px solid rgba(197, 165, 114, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 10, fontWeight: 500, color: "#C5A572", letterSpacing: "0.04em" }}>AU</div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "#c5a572", letterSpacing: 2 }}>AURUM KOREA</span>
          </div>
          <p style={{ fontSize: 11, color: "#555", lineHeight: 1.65, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "Aurum Korea Pte Ltd. 싱가포르 등록 귀금속 딜러. AML/CFT 준수." : "Aurum Korea Pte Ltd. Singapore Registered Precious Metals Dealer. AML/CFT Compliant."}</p>
          <p style={{ fontSize: 11, color: "#444", lineHeight: 1.6, fontFamily: "'Outfit',sans-serif", marginTop: 8 }}>📧 support@aurumkorea.com</p>
        </div>
        {[
          { title: lang === "ko" ? "매장" : "Shop", items: [{ ko: "금 바", en: "Gold Bars", fn: () => navigate("shop") }, { ko: "금 코인", en: "Gold Coins", fn: () => navigate("shop") }, { ko: "은", en: "Silver", fn: () => navigate("shop") }] },
          { title: lang === "ko" ? "정보" : "Info", items: [{ ko: "보관", en: "Storage", fn: () => navigate("storage") }, { ko: "AGP 저축 플랜", en: "AGP Savings Plan", fn: () => navigate("agp") }, { ko: "왜 금인가", en: "Why Gold", fn: () => navigate("why") }, { ko: "교육", en: "Learn", fn: () => navigate("learn") }] },
          { title: lang === "ko" ? "법률" : "Legal", items: [{ ko: "이용약관", en: "Terms", fn: () => {} }, { ko: "개인정보", en: "Privacy", fn: () => {} }, { ko: "AML/KYC", en: "AML/KYC", fn: () => {} }] },
        ].map((col, ci) => (
          <div key={ci}>
            <h4 style={{ fontSize: 10, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px", fontFamily: "'Outfit',sans-serif" }}>{col.title}</h4>
            {col.items.map((x, j) => <div key={j} onClick={x.fn} style={{ fontSize: 12, color: "#555", marginBottom: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "#c5a572"} onMouseLeave={e => e.currentTarget.style.color = "#555"}>{lang === "ko" ? x.ko : x.en}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #1a1510", paddingTop: 14, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 6 }}>
        <span style={{ fontSize: 10, color: "#3a3a3a", fontFamily: "'Outfit',sans-serif" }}>© 2026 Aurum Korea Pte Ltd. All rights reserved.</span>
        <span style={{ fontSize: 10, color: "#3a3a3a", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "투자에는 위험이 따릅니다. 과거 수익률은 미래 성과를 보장하지 않습니다." : "Investing involves risk. Past performance does not guarantee future results."}</span>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("ko");
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currency, setCurrency] = useState("KRW");
  const [cartPayMethod, setCartPayMethod] = useState("toss");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(MOCK_ORDERS_INIT);
  const [holdings] = useState(MOCK_HOLDINGS);
  const { prices, krwRate, priceError, dailyChanges } = useLivePrices();
  const { toasts, show: toast } = useToast();

  const navigate = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Phase 2: Init magnetic card cursor tracking on every page change
  useEffect(() => {
    const cleanup = initMagneticCards();
    return cleanup;
  }, [page]);

  // E-1: Composite cart key = ${productId}_${storageOption}
  const addToCart = useCallback((product, qty = 1, storageOption = "singapore") => {
    const price = calcPrice(product, { gold: prices.gold, silver: prices.silver, platinum: prices.platinum });
    const cartKey = `${product.id}_${storageOption}`;
    setCart(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) return prev.map(i => i.cartKey === cartKey ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty, storage: storageOption, price, cartKey }];
    });
  }, [prices]);

  const removeFromCart = useCallback((cartKey) => setCart(prev => prev.filter(i => i.cartKey !== cartKey)), []);
  const updateCartQty = useCallback((cartKey, qty) => setCart(prev => prev.map(i => i.cartKey === cartKey ? { ...i, qty } : i).filter(i => i.qty > 0)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const addOrder = useCallback((order) => setOrders(prev => [order, ...prev]), []);

  const onLogin = useCallback((u) => {
    setUser(u);
    setShowLogin(false);
    toast(lang === "ko" ? `환영합니다, ${u.name || u.email}님!` : `Welcome, ${u.name || u.email}!`);
  }, [lang, toast]);

  return (
    <div style={{ background: "#0a0a0a", color: "#f5f0e8", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Outfit','Pretendard Variable','Pretendard',sans-serif" }}>
      <ToastContainer toasts={toasts} />
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onLogin={onLogin} lang={lang} />

      {priceError && (
        <div style={{ background: "#1a0808", borderBottom: "1px solid rgba(248,113,113,0.3)", padding: "6px 20px", fontSize: 11, color: "#f87171", textAlign: "center", fontFamily: "'Outfit',sans-serif" }}>
          {priceError}
        </div>
      )}

      <Ticker lang={lang} prices={prices} krwRate={krwRate} dailyChanges={dailyChanges} />
      <Nav page={page} navigate={navigate} lang={lang} setLang={setLang} user={user} setUser={setUser} setShowLogin={setShowLogin} cart={cart} />

      <main style={{ flex: 1 }}>
        {page === "home" && <Home lang={lang} navigate={navigate} prices={prices} krwRate={krwRate} currency={currency} setCurrency={setCurrency} />}
        {/* Phase 3 routing: shop → ShopSelector (new front door); shop-physical → existing listing */}
        {page === "shop" && <ShopSelectorPage lang={lang} navigate={navigate} />}
        {page === "shop-physical" && <Shop lang={lang} navigate={navigate} setProduct={setSelectedProduct} prices={prices} krwRate={krwRate} addToCart={addToCart} toast={toast} currency={currency} setCurrency={setCurrency} />}
        {page === "product" && <ProductPage product={selectedProduct} lang={lang} navigate={navigate} prices={prices} krwRate={krwRate} user={user} setShowLogin={setShowLogin} addToCart={addToCart} toast={toast} currency={currency} setCurrency={setCurrency} />}
        {page === "cart" && <CartPage lang={lang} navigate={navigate} cart={cart} removeFromCart={removeFromCart} updateCartQty={updateCartQty} prices={prices} krwRate={krwRate} currency={currency} setCurrency={setCurrency} setProduct={setSelectedProduct} cartPayMethod={cartPayMethod} setCartPayMethod={setCartPayMethod} />}
        {page === "checkout" && <Checkout lang={lang} navigate={navigate} cart={cart} clearCart={clearCart} prices={prices} krwRate={krwRate} user={user} addOrder={addOrder} toast={toast} currency={currency} setCurrency={setCurrency} initialPayMethod={cartPayMethod} />}
        {page === "orders" && <OrderHistoryPage lang={lang} navigate={navigate} orders={orders} krwRate={krwRate} />}
        {page === "account" && <AccountPage lang={lang} navigate={navigate} user={user} setUser={setUser} toast={toast} />}
        {page === "kyc" && <KYCFlowPage lang={lang} navigate={navigate} user={user} setUser={setUser} toast={toast} />}
        {page === "why" && <WhyGold lang={lang} navigate={navigate} />}
        {page === "storage" && <Storage lang={lang} navigate={navigate} />}
        {page === "agp" && <AGP lang={lang} navigate={navigate} />}
        {page === "agp-report" && <AGPBackingReport lang={lang} navigate={navigate} />}
        {/* Phase 3 new routes: AGP onboarding flow */}
        {page === "agp-intro" && <AGPIntroPage lang={lang} navigate={navigate} />}
        {page === "agp-enroll" && <AGPEnrollPage lang={lang} navigate={navigate} />}
        {page === "learn" && <Learn lang={lang} navigate={navigate} />}
        {page === "dashboard" && <Dashboard lang={lang} navigate={navigate} prices={prices} krwRate={krwRate} user={user} orders={orders} holdings={holdings} toast={toast} />}
        {page === "sell" && <SellFlowPage lang={lang} navigate={navigate} prices={prices} krwRate={krwRate} holdings={holdings} toast={toast} />}
        {page === "withdraw" && <WithdrawFlowPage lang={lang} navigate={navigate} holdings={holdings} krwRate={krwRate} toast={toast} />}
      </main>

      <Footer lang={lang} navigate={navigate} />
    </div>
  );
}
