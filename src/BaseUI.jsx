import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile, useNewsData, fDate, STATIC_NEWS } from "./lib.jsx";

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED PRICING CONSTANTS — single source of truth for Korean retail premiums
//   - Used by Ticker (BaseUI.jsx) AND Home savings panel (ShopPages.jsx)
//   - Adjust here only; both surfaces will stay in sync
// ═══════════════════════════════════════════════════════════════════════════════
export const KR_GOLD_PREMIUM = 0.20;     // 20% — 한국금거래소 매도가 (부가세 + 유통 마진 포함)
export const KR_SILVER_PREMIUM = 0.30;   // 30% — 한국 시중 은 실물 프리미엄 (부가세 + 공급 부족 반영)
export const AURUM_GOLD_PREMIUM = 0.08;  // Aurum gold spot premium (display reference)
export const AURUM_SILVER_PREMIUM = 0.15; // Aurum silver spot premium (display reference)

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════════════════════════
function ToastContainer({ toasts }) {
  const colors = { success: ["#080f08","#4ade80"], error: ["#1a0808","#f87171"], info: ["#080a1a","#60a5fa"] };
  return (
    <div style={{ position: "fixed", top: 76, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map(t => {
        const [bg, col] = colors[t.type] || colors.success;
        return (
          <div key={t.id} style={{ background: bg, border: `1px solid ${col}`, color: col, padding: "10px 16px", borderRadius: 6, fontSize: 13, fontFamily: "'Outfit',sans-serif", maxWidth: 320, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
            {t.msg}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TICKER — Scrolling marquee, KRW-primary display
//   Items: 금(GOLD/oz) · 은(SILVER/oz) · KRW/USD · 한국금값 (red) · Aurum 절약 (green)
//   Removed: 백금, AGP 최소, Vault info, Aurum standalone price, VAT annotation
// ═══════════════════════════════════════════════════════════════════════════════
function Ticker({ lang, prices, krwRate, dailyChanges }) {
  // KRW price calculations
  const goldKRW    = Math.round(prices.gold   * krwRate * (1 + AURUM_GOLD_PREMIUM));
  const silverKRW  = Math.round(prices.silver * krwRate * (1 + AURUM_SILVER_PREMIUM));
  const krGoldKRW  = Math.round(prices.gold   * krwRate * (1 + KR_GOLD_PREMIUM));
  const savingsKRW = krGoldKRW - goldKRW;
  const savingsPct = krGoldKRW > 0 ? ((savingsKRW / krGoldKRW) * 100).toFixed(1) : "0";

  const goldChange   = dailyChanges.gold   ? `${parseFloat(dailyChanges.gold)   >= 0 ? '+' : ''}${dailyChanges.gold}%`   : '—';
  const silverChange = dailyChanges.silver ? `${parseFloat(dailyChanges.silver) >= 0 ? '+' : ''}${dailyChanges.silver}%` : '—';
  const goldUp   = parseFloat(dailyChanges.gold   || 0) >= 0;
  const silverUp = parseFloat(dailyChanges.silver || 0) >= 0;

  // Shared item style
  const itemStyle  = { display:'inline-flex', alignItems:'center', gap:8, padding:'0 24px', borderRight:'1px solid rgba(197,165,114,.08)', fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, letterSpacing:'.06em', flexShrink:0 };
  const lblStyle   = { color:'#666' };
  const priceStyle = { color:'#C5A572', fontWeight:500 };

  // The 5 items — rendered twice for seamless loop
  const Items = () => (
    <>
      {/* Live dot */}
      <div style={itemStyle}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:'#5ead77', animation:'pulse 2s infinite', display:'inline-block', flexShrink:0 }} />
        <span style={lblStyle}>LIVE</span>
      </div>
      {/* 금 (GOLD/oz) */}
      <div style={itemStyle}>
        <span style={lblStyle}>금 (GOLD/oz)</span>
        <span style={priceStyle}>₩{goldKRW.toLocaleString('ko-KR')}</span>
        <span style={{ color: goldUp ? '#5ead77' : '#e05555', fontSize:9.5 }}>{goldChange}</span>
      </div>
      {/* 은 (SILVER/oz) */}
      <div style={itemStyle}>
        <span style={lblStyle}>은 (SILVER/oz)</span>
        <span style={priceStyle}>₩{silverKRW.toLocaleString('ko-KR')}</span>
        <span style={{ color: silverUp ? '#5ead77' : '#e05555', fontSize:9.5 }}>{silverChange}</span>
      </div>
      {/* KRW/USD */}
      <div style={itemStyle}>
        <span style={lblStyle}>KRW/USD</span>
        <span style={priceStyle}>₩{krwRate.toFixed(1)}</span>
      </div>
      {/* 한국금값 — red, shows premium you're avoiding */}
      <div style={itemStyle}>
        <span style={lblStyle}>한국금값</span>
        <span style={{ color:'#e05555', fontWeight:500 }}>₩{krGoldKRW.toLocaleString('ko-KR')}</span>
        <span style={{ color:'#444', fontSize:9 }}>/oz</span>
      </div>
      {/* Aurum 절약 — green, shows your saving */}
      <div style={{ ...itemStyle, borderRight:'none' }}>
        <span style={lblStyle}>Aurum 절약</span>
        <span style={{ color:'#5ead77', fontWeight:500 }}>₩{savingsKRW.toLocaleString('ko-KR')} · {savingsPct}%</span>
      </div>
    </>
  );

  return (
    <div style={{ background:'linear-gradient(90deg,#0d0d0d,#141414,#0d0d0d)', borderBottom:'1px solid #1e1e1e', overflow:'hidden', height:34, display:'flex', alignItems:'center' }}>
      <div className="ticker-wrap" style={{ overflow:'hidden', width:'100%' }}>
        <div className="ticker-track">
          <Items />
          <Items />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAV — B-1: Prevent scrunching at intermediate widths
// ═══════════════════════════════════════════════════════════════════════════════
function Nav({ page, navigate, lang, setLang, user, setUser, setShowLogin, cart }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  // B-1: Detect intermediate width (tablet zone 768–1100px)
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsNarrow(w >= 768 && w < 1100);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const go = (k) => { navigate(k); setOpen(false); };
  // Nav link order: 매장 · Founders Club (gold) · AGP · 보관 · 배우기
  // "왜 금인가" removed — content merged into Learn page
  const links = [
    { key: "shop", ko: "매장", en: "Shop", gold: false },
    { key: "founders", ko: "Founders Club", en: "Founders Club", gold: true },
    { key: "agp", ko: "AGP", en: "AGP", gold: false },
    { key: "storage", ko: "보관", en: "Storage", gold: false },
    { key: "learn", ko: "배우기", en: "Learn", gold: false },
  ];

  const logoSize = isMobile ? 32 : 38;
  const Logo = () => (
    <div onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textDecoration: "none", flexShrink: 0 }}>
      <div
        className="aurum-logo-mark"
        style={{
          width: logoSize, height: logoSize,
          border: "1.5px solid rgba(197,165,114,.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: logoSize * 0.42, fontWeight: 500, color: "#C5A572",
          letterSpacing: "0.06em", transition: "border-color 0.3s ease", flexShrink: 0,
        }}
      >AU</div>
    </div>
  );

  const CartBtn = () => (
    <button onClick={() => go("cart")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px 6px", fontSize: 19, lineHeight: 1 }}>
      🛒
      {cartCount > 0 && <span style={{ position: "absolute", top: -2, right: -2, background: "#c5a572", color: "#0a0a0a", borderRadius: "50%", width: 17, height: 17, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace" }}>{cartCount}</span>}
    </button>
  );

  // Mobile: collapse to hamburger at 900px to handle scrunching
  const shouldUseMobileNav = isMobile || (window.innerWidth < 900);

  if (isMobile) return (
    <>
      <nav style={{ background: "rgba(10,10,10,.93)", backdropFilter: "blur(14px) saturate(160%)", WebkitBackdropFilter: "blur(14px) saturate(160%)", borderBottom: "1px solid rgba(197,165,114,.18)", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 200 }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* AGP gold CTA always visible on mobile */}
          <button onClick={() => go("agp-enroll")} style={{ height: 32, padding: "0 12px", fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 700, background: "#C5A572", color: "#0a0a0a", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>AGP 시작</button>
          <CartBtn />
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#C5A572", fontSize: 22, cursor: "pointer", lineHeight: 1, padding: "4px" }}>{open ? "✕" : "☰"}</button>
        </div>
      </nav>
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,10,.97)", zIndex: 199, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <button onClick={() => setOpen(false)} style={{ position: "absolute", top: 20, right: 24, fontSize: 20, color: "#a09080", background: "none", border: "none", cursor: "pointer" }}>✕</button>
          {/* 5 nav links — serif style */}
          {links.map(x => (
            <button key={x.key} onClick={() => go(x.key)} className="mobile-nav-link" style={{ color: x.gold ? "#C5A572" : (page === x.key ? "#C5A572" : "#f5f0e8") }}>
              {lang === "ko" ? x.ko : x.en}
            </button>
          ))}
          {/* Bottom actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 240, marginTop: 12 }}>
            <button onClick={() => go("agp-enroll")} style={{ width: "100%", padding: "14px", fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif", background: "#C5A572", color: "#0a0a0a", border: "none", cursor: "pointer" }}>AGP 가입하기 →</button>
            <button onClick={() => { setShowLogin(true); setOpen(false); }} style={{ width: "100%", padding: "13px", fontSize: 13, fontFamily: "'Outfit',sans-serif", background: "transparent", color: "#a09080", border: "1px solid rgba(197,165,114,.35)", cursor: "pointer" }}>{lang === "ko" ? "로그인 / 회원가입" : "Login / Sign Up"}</button>
            <button onClick={() => { setLang(lang === "en" ? "ko" : "en"); setOpen(false); }} style={{ background: "none", border: "1px solid rgba(197,165,114,.35)", color: "#C5A572", padding: "8px 0", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", cursor: "pointer" }}>{lang === "en" ? "한국어" : "KR / EN"}</button>
          </div>
        </div>
      )}
    </>
  );

  // Desktop nav — B-1: tighter gap and smaller font at narrow widths
  const navFontSize = isNarrow ? 11 : 12;
  const navGap = isNarrow ? 8 : 14;

  return (
    <nav style={{ background: "rgba(10,10,10,.93)", backdropFilter: "blur(14px) saturate(160%)", WebkitBackdropFilter: "blur(14px) saturate(160%)", borderBottom: "1px solid rgba(197,165,114,.18)", padding: isNarrow ? "0 20px" : "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 200, overflow: "hidden" }}>
      <Logo />
      <div style={{ display: "flex", gap: navGap, alignItems: "center", flexWrap: "nowrap", overflow: "hidden", marginLeft: 20, flex: 1 }}>
        {links.map(x => (
          <button key={x.key} onClick={() => navigate(x.key)} style={{ background: "none", border: "none", borderBottom: page === x.key ? "1px solid #C5A572" : "1px solid transparent", color: x.gold ? "#C5A572" : (page === x.key ? "#C5A572" : "#666"), cursor: "pointer", fontSize: navFontSize, fontFamily: "'Outfit',sans-serif", letterSpacing: ".06em", paddingBottom: 3, transition: "color 0.15s", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}
            onMouseEnter={e => { if (!x.gold) e.currentTarget.style.color = "#f5f0e8"; }}
            onMouseLeave={e => { if (!x.gold) e.currentTarget.style.color = page === x.key ? "#C5A572" : "#666"; }}
          >{lang === "ko" ? x.ko : x.en}</button>
        ))}
      </div>
      {/* Right cluster — all buttons uniform height 34px */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <CartBtn />
        {user && <>
          <button onClick={() => navigate("dashboard")} className="nav-btn nav-btn-ghost" style={{ minWidth: isNarrow ? 60 : 80 }}>{lang === "ko" ? "내 보유자산" : "Holdings"}</button>
          <button onClick={() => navigate("account")} className="nav-btn nav-btn-ghost">{user.name ? user.name.slice(0, 8) : user.email.split("@")[0]}</button>
        </>}
        {!user && <button onClick={() => setShowLogin(true)} className="nav-btn nav-btn-ghost">{lang === "ko" ? "로그인" : "Login"}</button>}
        <button onClick={() => navigate("agp-enroll")} className="nav-btn nav-btn-gold">AGP 시작 →</button>
        <button onClick={() => setLang(lang === "en" ? "ko" : "en")} className="nav-btn nav-btn-lang">{lang === "en" ? "KR" : "EN"}</button>
      </div>
    </nav>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function LoginModal({ show, onClose, onLogin, lang }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => { if (show) { setErr(""); setLoading(false); } }, [show]);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!show) return null;

  const inp = { width: "100%", background: "#0a0a0a", border: "1px solid #282828", borderRadius: 6, color: "#f5f0e8", padding: "11px 13px", fontSize: 14, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box", transition: "border-color 0.15s" };

  const submit = async (e) => {
    e.preventDefault();
    if (!email) { setErr(lang === "ko" ? "이메일을 입력하세요." : "Enter your email."); return; }
    if (!pw) { setErr(lang === "ko" ? "비밀번호를 입력하세요." : "Enter your password."); return; }
    if (tab === "register") {
      if (!name) { setErr(lang === "ko" ? "이름을 입력하세요." : "Enter your name."); return; }
      if (!terms) { setErr(lang === "ko" ? "이용약관에 동의하세요." : "Please accept terms."); return; }
    }
    setLoading(true); setErr("");
    await new Promise(r => setTimeout(r, 450));
    try {
      const isTest = email.trim().toLowerCase() === "wsl@aurum.com" && pw === "1234";
      const u = { id: `user_${Date.now()}`, email: email.trim().toLowerCase(), name: isTest ? "WSL" : (tab === "register" ? name : email.split("@")[0]), phone: phone || "", kycStatus: isTest ? "verified" : "unverified" };
      onLogin(u);
    } catch { setErr(lang === "ko" ? "오류가 발생했습니다. 다시 시도하세요." : "An error occurred. Please try again."); }
    finally { setLoading(false); }
  };

  const socialLogin = async (provider) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const u = { id: `user_${Date.now()}`, email: `${provider}@user.kr`, name: provider === "kakao" ? "카카오 사용자" : "네이버 사용자", phone: "", kycStatus: "unverified" };
    onLogin(u);
    setLoading(false);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#141414", border: "1px solid #282828", borderRadius: 16, width: "100%", maxWidth: isMobile ? "100%" : 420, padding: isMobile ? "28px 20px" : "36px 32px", boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: "#f5f0e8", fontWeight: 400 }}>
            {tab === "login" ? (lang === "ko" ? "로그인" : "Sign In") : (lang === "ko" ? "회원가입" : "Create Account")}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#a09080", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ display: "flex", background: "#0a0a0a", borderRadius: 8, padding: 4, marginBottom: 24 }}>
          {["login","register"].map(t => (
            <button key={t} onClick={() => { setTab(t); setErr(""); }} style={{ flex: 1, background: tab === t ? "#1e1e1e" : "transparent", border: "none", color: tab === t ? "#c5a572" : "#6b6b6b", padding: "9px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: tab === t ? 600 : 400, transition: "all 0.15s" }}>
              {t === "login" ? (lang === "ko" ? "로그인" : "Sign In") : (lang === "ko" ? "회원가입" : "Sign Up")}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          <button disabled={loading} onClick={() => socialLogin("kakao")} style={{ width: "100%", background: "#FEE500", border: "none", color: "#1a1a1a", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
            <span style={{ fontSize: 18 }}>💬</span>{lang === "ko" ? "카카오로 계속하기" : "Continue with Kakao"}
          </button>
          <button disabled={loading} onClick={() => socialLogin("naver")} style={{ width: "100%", background: "#03C75A", border: "none", color: "#fff", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
            <span style={{ fontWeight: 900, fontSize: 16 }}>N</span>{lang === "ko" ? "네이버로 계속하기" : "Continue with Naver"}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: "#282828" }} />
          <span style={{ fontSize: 11, color: "#6b6b6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "이메일로 계속" : "or with email"}</span>
          <div style={{ flex: 1, height: 1, background: "#282828" }} />
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tab === "register" && <input value={name} onChange={e => setName(e.target.value)} placeholder={lang === "ko" ? "이름 (실명)" : "Full Name"} style={inp} />}
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder={lang === "ko" ? "이메일 주소" : "Email address"} style={inp} />
          <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder={lang === "ko" ? "비밀번호" : "Password"} style={inp} />
          {tab === "register" && <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={lang === "ko" ? "휴대폰 번호 (선택사항)" : "Phone number (optional)"} style={inp} />}
          {tab === "register" && (
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginTop: 4 }}>
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ marginTop: 3, accentColor: "#c5a572" }} />
              <span style={{ fontSize: 12, color: "#a09080", lineHeight: 1.5 }}>
                {lang === "ko" ? <>이용약관 및 <span style={{ color: "#c5a572" }}>개인정보처리방침</span>에 동의합니다.</> : <>I agree to the <span style={{ color: "#c5a572" }}>Terms</span> and <span style={{ color: "#c5a572" }}>Privacy Policy</span>.</>}
              </span>
            </label>
          )}
          {err && <p style={{ color: "#f87171", fontSize: 12, margin: "4px 0 0", fontFamily: "'Outfit',sans-serif" }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ marginTop: 6, width: "100%", background: loading ? "#282828" : "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: loading ? "#6b6b6b" : "#ffffff", padding: "13px", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.2s" }}>
            {loading ? (lang === "ko" ? "처리 중..." : "Processing...") : tab === "login" ? (lang === "ko" ? "로그인" : "Sign In") : (lang === "ko" ? "계정 만들기" : "Create Account")}
          </button>
        </form>
        {tab === "login" && <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#6b6b6b", fontFamily: "'Outfit',sans-serif" }}>
          <span style={{ color: "#c5a572", cursor: "pointer" }}>{lang === "ko" ? "비밀번호를 잊으셨나요?" : "Forgot password?"}</span>
        </p>}
        <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#444", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.3 }}>
          🔧 test: wsl@aurum.com / 1234
        </p>
        <p style={{ textAlign: "center", marginTop: 4, fontSize: 11, color: "#333", fontFamily: "'Outfit',sans-serif" }}>
          {lang === "ko" ? "어떤 이메일/비밀번호로도 로그인 가능 (데모)" : "Any email + password works (demo mode)"}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS SECTION — I: Updated with A-2 RSS feeds
// ═══════════════════════════════════════════════════════════════════════════════
function NewsSection({ lang }) {
  const isMobile = useIsMobile();
  const { articles, loading } = useNewsData();
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? articles : articles.filter(a => a.category === tab);
  const tabs = [{ k: "all", ko: "전체", en: "All" }, { k: "gold", ko: "금", en: "Gold" }, { k: "silver", ko: "은", en: "Silver" }];
  return (
    <div style={{ background: "#0d0d0d", padding: isMobile ? "36px 16px" : "56px 80px", borderTop: "1px solid #1e1e1e" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 28, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 0 }}>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
            {lang === "ko" ? "시장 인텔리전스" : "Market Intelligence"}
          </div>
          {/* Section title min 36px mobile / 48px desktop */}
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 36 : 48, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>
            {lang === "ko" ? "금·은 시장 뉴스" : "Gold & Silver News"}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map(t => <button key={t.k} onClick={() => setTab(t.k)} style={{ background: tab === t.k ? "#c5a572" : "transparent", color: tab === t.k ? "#0a0a0a" : "#a09080", border: `1px solid ${tab === t.k ? "#c5a572" : "#282828"}`, padding: "6px 16px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: tab === t.k ? 600 : 400 }}>{lang === "ko" ? t.ko : t.en}</button>)}
        </div>
      </div>
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 8, padding: 20, height: 160 }}><div style={{ height: 10, background: "#1e1e1e", borderRadius: 4, width: "40%", marginBottom: 12 }} /><div style={{ height: 14, background: "#1e1e1e", borderRadius: 4, marginBottom: 8 }} /><div style={{ height: 14, background: "#1e1e1e", borderRadius: 4, width: "70%" }} /></div>)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 12 : 20 }}>
          {filtered.slice(0, 6).map((a, i) => (
            <a key={i} href={a.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 8, padding: isMobile ? 16 : 20, height: "100%", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(197,165,114,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Outfit',sans-serif" }}>{a.source}</span>
                  <span style={{ fontSize: 10, color: "#6b6b6b", fontFamily: "'JetBrains Mono',monospace" }}>{fDate(a.pubDate)}</span>
                </div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500, color: "#f5f0e8", lineHeight: 1.5, margin: "0 0 8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</h3>
                {a.snippet && <p style={{ fontSize: 12, color: "#a09080", lineHeight: 1.6, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: "'Outfit',sans-serif" }}>{a.snippet}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 600, background: a.category === "gold" ? "rgba(197,165,114,0.12)" : "rgba(180,180,180,0.1)", color: a.category === "gold" ? "#c5a572" : "#aaa", fontFamily: "'Outfit',sans-serif" }}>{a.category === "gold" ? (lang === "ko" ? "금" : "Gold") : (lang === "ko" ? "은" : "Silver")}</span>
                  <span style={{ fontSize: 11, color: "#6b6b6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "자세히 →" : "Read →"}</span>
                </div>
              </div>
            </a>
          ))}
          {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "#6b6b6b", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>{lang === "ko" ? "현재 표시할 뉴스가 없습니다." : "No articles to display."}</div>}
        </div>
      )}
    </div>
  );
}

export { ToastContainer, Ticker, Nav, LoginModal, NewsSection };
