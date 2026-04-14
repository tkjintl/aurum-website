import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile, useInView, fUSD, fKRW, fDateLong, fDate, WHY_GOLD_REASONS, WHY_GOLD_STATS, EDUCATION_ARTICLES, EDUCATION_CATEGORIES, MOCK_ORDERS_INIT, API } from "./lib.jsx";

// ═══════════════════════════════════════════════════════════════════════════════
// ORDER HISTORY
// ═══════════════════════════════════════════════════════════════════════════════
function OrderHistoryPage({ lang, navigate, orders, krwRate }) {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const statusConfig = {
    pending_payment: { ko: "입금 대기", en: "Awaiting Payment", col: "#f59e0b" },
    processing: { ko: "처리 중", en: "Processing", col: "#60a5fa" },
    confirmed: { ko: "주문 확인", en: "Confirmed", col: "#60a5fa" },
    vaulted: { ko: "보관 중", en: "Vaulted", col: "#4ade80" },
    delivered: { ko: "배송 완료", en: "Delivered", col: "#c5a572" },
    cancelled: { ko: "취소됨", en: "Cancelled", col: "#f87171" },
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const payLabel = (m) => ({ toss: "TossPay", kakao: "KakaoPay", wire: "Wire", card: "Card" }[m] || m);

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "주문 내역" : "Order History"}</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ k: "all", ko: "전체", en: "All" }, { k: "vaulted", ko: "보관중", en: "Vaulted" }, { k: "processing", ko: "처리중", en: "Processing" }].map(f => (
            <button key={f.k} onClick={() => setFilter(f.k)} style={{ background: filter === f.k ? "#c5a572" : "transparent", color: filter === f.k ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${filter === f.k ? "#c5a572" : "#2a2318"}`, padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: filter === f.k ? 600 : 400 }}>{lang === "ko" ? f.ko : f.en}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#555", fontFamily: "'Outfit',sans-serif" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>{lang === "ko" ? "주문 내역이 없습니다." : "No orders found."}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(order => {
          const sc = statusConfig[order.status] || { ko: order.status, en: order.status, col: "#888" };
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(197,165,114,0.25)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1510"}>
              <div onClick={() => setExpanded(isOpen ? null : order.id)} style={{ padding: isMobile ? "14px" : "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: 10 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: isMobile ? 22 : 28 }}>{order.items[0]?.image || "🥇"}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 11 : 12, color: "#c5a572", marginBottom: 2 }}>{order.id}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 13, color: "#f5f0e8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.items.map(i => (lang === "ko" ? i.nameKo : i.name)).join(", ")}
                    </div>
                    <div style={{ fontSize: 11, color: "#555", fontFamily: "'Outfit',sans-serif" }}>{fDateLong(order.date)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                  <span style={{ background: `${sc.col}18`, color: sc.col, border: `1px solid ${sc.col}40`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}>{lang === "ko" ? sc.ko : sc.en}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 13 : 15, color: "#c5a572", fontWeight: 600 }}>{fUSD(order.total)}</div>
                  </div>
                  <span style={{ color: "#555", fontSize: 16, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ borderTop: "1px solid #1a1510", padding: isMobile ? "14px" : "18px 22px", background: "#0d0c08" }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                    {[
                      [lang === "ko" ? "결제 수단" : "Payment", payLabel(order.paymentMethod)],
                      [lang === "ko" ? "보관" : "Storage", lang === "ko" ? "Singapore FTZ" : "Singapore FTZ"],
                      [lang === "ko" ? "합계 (USD)" : "Total (USD)", fUSD(order.total)],
                    ].map(([l, v], i) => (
                      <div key={i}>
                        <div style={{ fontSize: 10, color: "#555", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{l}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#f5f0e8" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < order.items.length - 1 ? "1px solid #1a1510" : "none" }}>
                        <span style={{ fontSize: 12, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? item.nameKo : item.name} ×{item.qty}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#c5a572" }}>{fUSD(item.unitPrice * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={() => {}} style={{ background: "rgba(197,165,114,0.1)", border: "1px solid rgba(197,165,114,0.3)", color: "#c5a572", padding: "7px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>📥 {lang === "ko" ? "영수증 다운로드" : "Download Receipt"}</button>
                    <button onClick={() => navigate("dashboard")} style={{ background: "none", border: "1px solid #2a2318", color: "#8a7d6b", padding: "7px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "보유자산 확인" : "View Holdings"}</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function AccountPage({ lang, navigate, user, setUser, toast }) {
  const isMobile = useIsMobile();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifKakao, setNotifKakao] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  if (!user) return (
    <div style={{ padding: "80px", textAlign: "center", background: "#0a0a0a", minHeight: "70vh" }}>
      <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "로그인이 필요합니다." : "Login required."}</p>
    </div>
  );

  const kycBadge = { unverified: { ko: "미인증", en: "Unverified", col: "#f87171" }, in_review: { ko: "검토 중", en: "In Review", col: "#f59e0b" }, verified: { ko: "인증 완료", en: "Verified", col: "#4ade80" } };
  const kyc = kycBadge[user.kycStatus] || kycBadge.unverified;
  const initials = (user.name || user.email || "A").slice(0, 2).toUpperCase();

  const saveProfile = () => {
    setUser({ ...user, name, phone });
    setEditMode(false);
    toast(lang === "ko" ? "프로필이 업데이트되었습니다." : "Profile updated.");
  };

  const Card = ({ title, children }) => (
    <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 18 : 26, marginBottom: 16 }}>
      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#c5a572", fontWeight: 600, margin: "0 0 18px", textTransform: "uppercase", letterSpacing: 1 }}>{title}</h3>
      {children}
    </div>
  );

  const Toggle = ({ on, onToggle, label }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{label}</span>
      <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? "#c5a572" : "#2a2318", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#f5f0e8", position: "absolute", top: 3, left: on ? 23 : 3, transition: "left 0.2s" }} />
      </div>
    </div>
  );

  const inp = { width: "100%", background: "#0a0a0a", border: "1px solid #2a2318", borderRadius: 6, color: "#f5f0e8", padding: "10px 13px", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" };

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 28px" }}>{lang === "ko" ? "내 계정" : "My Account"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr", gap: isMobile ? 16 : 28 }}>
        {/* Sidebar */}
        <div>
          <Card title={lang === "ko" ? "계정 정보" : "Profile"}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 18 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#0a0a0a", marginBottom: 10 }}>{initials}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#f5f0e8", fontWeight: 600 }}>{user.name || user.email}</div>
              <div style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>{user.email}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span style={{ background: `${kyc.col}18`, color: kyc.col, border: `1px solid ${kyc.col}40`, padding: "4px 14px", borderRadius: 20, fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>KYC: {lang === "ko" ? kyc.ko : kyc.en}</span>
            </div>
            {user.kycStatus === "unverified" && (
              <button onClick={() => navigate("kyc")} style={{ width: "100%", marginTop: 14, background: "rgba(197,165,114,0.1)", border: "1px solid #c5a572", color: "#c5a572", padding: "9px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                {lang === "ko" ? "KYC 인증 시작" : "Start KYC Verification"}
              </button>
            )}
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ ko: "내 보유자산", en: "Holdings", page: "dashboard" }, { ko: "주문 내역", en: "Orders", page: "orders" }].map(x => (
              <button key={x.page} onClick={() => navigate(x.page)} style={{ background: "#111008", border: "1px solid #1a1510", color: "#8a7d6b", padding: "12px 16px", borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
                {lang === "ko" ? x.ko : x.en} →
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div>
          <Card title={lang === "ko" ? "프로필 편집" : "Edit Profile"}>
            {editMode ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder={lang === "ko" ? "이름" : "Name"} style={inp} />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={lang === "ko" ? "휴대폰" : "Phone"} style={inp} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={saveProfile} style={{ flex: 1, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "10px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "저장" : "Save"}</button>
                  <button onClick={() => setEditMode(false)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#888", padding: "10px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>{lang === "ko" ? "취소" : "Cancel"}</button>
                </div>
              </div>
            ) : (
              <div>
                {[[lang === "ko" ? "이름" : "Name", user.name || "—"], [lang === "ko" ? "이메일" : "Email", user.email], [lang === "ko" ? "휴대폰" : "Phone", user.phone || "—"]].map(([l, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{l}</span>
                    <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{v}</span>
                  </div>
                ))}
                <button onClick={() => setEditMode(true)} style={{ marginTop: 10, background: "none", border: "1px solid #2a2318", color: "#8a7d6b", padding: "8px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "편집" : "Edit"}</button>
              </div>
            )}
          </Card>

          <Card title={lang === "ko" ? "알림 설정" : "Notifications"}>
            <Toggle on={notifEmail} onToggle={() => setNotifEmail(!notifEmail)} label={lang === "ko" ? "이메일 알림 (주문, 보관, 가격)" : "Email notifications (orders, vault, price)"} />
            <Toggle on={notifKakao} onToggle={() => setNotifKakao(!notifKakao)} label={lang === "ko" ? "카카오톡 알림 (주문 업데이트)" : "KakaoTalk alerts (order updates)"} />
          </Card>

          <Card title={lang === "ko" ? "보안" : "Security"}>
            <Toggle on={twoFA} onToggle={() => { setTwoFA(!twoFA); toast(lang === "ko" ? `2단계 인증 ${!twoFA ? "활성화" : "비활성화"}` : `2FA ${!twoFA ? "enabled" : "disabled"}.`); }} label={lang === "ko" ? "2단계 인증 (2FA)" : "Two-factor authentication"} />
            <button onClick={() => toast(lang === "ko" ? "비밀번호 재설정 이메일을 발송했습니다." : "Password reset email sent.", "info")} style={{ marginTop: 6, background: "none", border: "1px solid #2a2318", color: "#8a7d6b", padding: "8px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "비밀번호 변경" : "Change Password"}</button>
          </Card>

          <Card title={lang === "ko" ? "연결된 결제 수단" : "Linked Payments"}>
            <p style={{ fontSize: 12, color: "#555", fontFamily: "'Outfit',sans-serif", marginBottom: 14 }}>{lang === "ko" ? "결제 수단을 미리 등록하면 다음 구매가 더 빠릅니다." : "Pre-register payment methods for faster checkout."}</p>
            <button onClick={() => toast(lang === "ko" ? "결제 수단 연결은 곧 지원됩니다." : "Payment linking coming soon.", "info")} style={{ background: "rgba(197,165,114,0.1)", border: "1px solid #c5a572", color: "#c5a572", padding: "9px 18px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              + {lang === "ko" ? "결제 수단 추가" : "Add Payment Method"}
            </button>
          </Card>

          <button onClick={() => { setUser(null); navigate("home"); toast(lang === "ko" ? "로그아웃되었습니다." : "Logged out."); }} style={{ marginTop: 4, background: "transparent", border: "1px solid #2a2318", color: "#666", padding: "10px 20px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "로그아웃" : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// KYC FLOW
// ═══════════════════════════════════════════════════════════════════════════════
function KYCFlowPage({ lang, navigate, user, setUser, toast }) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullName: user?.name || "", dob: "", nationality: "KR", idType: "passport", idNumber: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!user) return null;

  const total = 4;
  const kycSteps = [{ n: 1, ko: "개인정보", en: "Personal Info" }, { n: 2, ko: "신분증", en: "ID Upload" }, { n: 3, ko: "셀피", en: "Selfie" }, { n: 4, ko: "제출", en: "Submit" }];

  const submit = async () => {
    setLoading(true);
    try {
      await API.kyc.submit(formData);
      setUser({ ...user, kycStatus: "in_review" });
      setSubmitted(true);
      toast(lang === "ko" ? "KYC가 제출되었습니다. 검토 중입니다." : "KYC submitted. Under review.");
    } finally { setLoading(false); }
  };

  const inp = { width: "100%", background: "#0a0a0a", border: "1px solid #2a2318", borderRadius: 6, color: "#f5f0e8", padding: "10px 13px", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box", marginBottom: 10 };

  if (submitted) return (
    <div style={{ padding: isMobile ? "60px 16px" : "80px", textAlign: "center", background: "#0a0a0a", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🕐</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: "#f5f0e8", fontWeight: 300, marginBottom: 10 }}>{lang === "ko" ? "검토 중입니다" : "Under Review"}</h2>
      <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", maxWidth: 400, lineHeight: 1.6, marginBottom: 28 }}>{lang === "ko" ? "KYC 제출이 완료되었습니다. 영업일 1~2일 내에 검토 후 이메일로 결과를 안내드립니다." : "Your KYC has been submitted. We'll email you with the result within 1–2 business days."}</p>
      <button onClick={() => navigate("account")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 28px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "계정으로 돌아가기" : "Back to Account"}</button>
    </div>
  );

  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 8px" }}>{lang === "ko" ? "KYC 본인 인증" : "KYC Verification"}</h2>
      <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", fontSize: 13, marginBottom: 32 }}>{lang === "ko" ? "AML/CFT 규정 준수를 위한 필수 절차입니다." : "Required for AML/CFT compliance."}</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
        {kycSteps.map(s => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s.n ? (step === s.n ? "#c5a572" : "#3a3028") : "#1a1510", color: step >= s.n ? (step === s.n ? "#0a0a0a" : "#c5a572") : "#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{step > s.n ? "✓" : s.n}</div>
            <span style={{ fontSize: 11, color: step === s.n ? "#c5a572" : "#555", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap" }}>{lang === "ko" ? s.ko : s.en}</span>
            {s.n < total && <div style={{ width: 20, height: 1, background: "#2a2318" }} />}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 20 : 32 }}>
        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#c5a572", margin: "0 0 20px", fontWeight: 600 }}>{lang === "ko" ? "개인 정보 입력" : "Personal Information"}</h3>
            <input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder={lang === "ko" ? "실명 (여권 기준)" : "Full legal name (as on passport)"} style={inp} />
            <input value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} type="date" placeholder={lang === "ko" ? "생년월일" : "Date of Birth"} style={inp} />
            <select value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} style={{ ...inp, marginBottom: 10 }}>
              <option value="KR">{lang === "ko" ? "대한민국" : "South Korea"}</option>
              <option value="US">{lang === "ko" ? "미국" : "United States"}</option>
              <option value="SG">{lang === "ko" ? "싱가포르" : "Singapore"}</option>
              <option value="OTHER">{lang === "ko" ? "기타" : "Other"}</option>
            </select>
            <button onClick={() => { if (!formData.fullName || !formData.dob) { toast(lang === "ko" ? "모든 항목을 입력하세요." : "Fill all fields.", "error"); return; } setStep(2); }} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>{lang === "ko" ? "다음" : "Next"} →</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#c5a572", margin: "0 0 16px", fontWeight: 600 }}>{lang === "ko" ? "신분증 업로드" : "ID Document Upload"}</h3>
            <div style={{ background: "#0a0a0a", border: "2px dashed #2a2318", borderRadius: 8, padding: "32px 20px", textAlign: "center", marginBottom: 14, cursor: "pointer" }} onClick={() => toast(lang === "ko" ? "파일 업로드는 곧 지원됩니다." : "File upload coming soon.", "info")}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📄</div>
              <p style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "여권 또는 신분증 앞면을 업로드하세요." : "Upload front of passport or national ID."}</p>
              <p style={{ fontSize: 11, color: "#555", fontFamily: "'Outfit',sans-serif", marginTop: 4 }}>JPG, PNG, PDF · 최대 10MB</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "11px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "이전" : "Back"}</button>
              <button onClick={() => setStep(3)} style={{ flex: 2, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "다음" : "Next"} →</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#c5a572", margin: "0 0 16px", fontWeight: 600 }}>{lang === "ko" ? "셀피 인증" : "Selfie Verification"}</h3>
            <div style={{ background: "#0a0a0a", border: "2px dashed #2a2318", borderRadius: 8, padding: "32px 20px", textAlign: "center", marginBottom: 14, cursor: "pointer" }} onClick={() => toast(lang === "ko" ? "카메라 기능은 곧 지원됩니다." : "Camera coming soon.", "info")}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🤳</div>
              <p style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "신분증을 들고 셀피를 찍어 업로드하세요." : "Take a selfie holding your ID document."}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "11px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "이전" : "Back"}</button>
              <button onClick={() => setStep(4)} style={{ flex: 2, background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{lang === "ko" ? "다음" : "Next"} →</button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#c5a572", margin: "0 0 16px", fontWeight: 600 }}>{lang === "ko" ? "제출 확인" : "Confirm & Submit"}</h3>
            <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, marginBottom: 18 }}>
              {[[lang === "ko" ? "이름" : "Name", formData.fullName], [lang === "ko" ? "생년월일" : "DOB", formData.dob], [lang === "ko" ? "국적" : "Nationality", formData.nationality]].map(([l, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{l}</span>
                  <span style={{ fontSize: 13, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", lineHeight: 1.6, marginBottom: 18 }}>{lang === "ko" ? "제출 시 당사의 개인정보처리방침에 따라 AML/CFT 목적으로 귀하의 정보가 처리됩니다." : "By submitting, your information will be processed for AML/CFT compliance per our Privacy Policy."}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(3)} style={{ flex: 1, background: "transparent", border: "1px solid #2a2318", color: "#8a7d6b", padding: "11px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>← {lang === "ko" ? "이전" : "Back"}</button>
              <button onClick={submit} disabled={loading} style={{ flex: 2, background: loading ? "#2a2318" : "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: loading ? "#555" : "#0a0a0a", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? (lang === "ko" ? "제출 중..." : "Submitting...") : (lang === "ko" ? "KYC 제출" : "Submit KYC")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// WHY GOLD (corrected, enhanced)
// ═══════════════════════════════════════════════════════════════════════════════
function WhyGold({ lang, navigate }) {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);
  const fade = (d = 0) => ({ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${d}s, transform 0.6s ease ${d}s` });
  return (
    <div style={{ background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ padding: isMobile ? "44px 16px 32px" : "64px 80px 44px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>{lang === "ko" ? "왜 금인가" : "Why Gold"}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 30 : 46, color: "#f5f0e8", fontWeight: 300, margin: "0 0 16px", lineHeight: 1.2 }}>{lang === "ko" ? "금은 단순한 금속이 아닙니다" : "Gold Is More Than a Metal"}</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 16, color: "#8a7d6b", maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
          {lang === "ko" ? "수천 년간 인류가 신뢰해온 가치 저장 수단. 지금 당신의 포트폴리오에 금이 필요한 6가지 이유를 확인하세요." : "The world's most trusted store of value for thousands of years. 6 reasons your portfolio needs physical gold."}
        </p>
      </div>
      <div ref={sectionRef} style={{ padding: isMobile ? "0 16px 44px" : "0 80px 60px" }}>
        {/* Stats bar */}
        <div style={{ ...fade(0), display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", borderRadius: 12, overflow: "hidden", border: "1px solid #1a1510", marginBottom: isMobile ? 28 : 48 }}>
          {WHY_GOLD_STATS.map((s, i) => (
            <div key={i} style={{ background: "#111008", padding: isMobile ? "18px 10px" : "26px 22px", textAlign: "center", borderRight: i < WHY_GOLD_STATS.length - 1 ? "1px solid #1a1510" : "none" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 20 : 26, fontWeight: 600, color: "#c5a572", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 9 : 11, color: "#8a7d6b", lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Reason cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 14 : 20, marginBottom: isMobile ? 32 : 48 }}>
          {WHY_GOLD_REASONS.map((r, i) => (
            <div key={i} style={{ ...fade(0.06 * i), background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 20 : 28 }}>
              <div style={{ fontSize: isMobile ? 26 : 30, marginBottom: 14 }}>{r.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 20 : 23, color: "#f5f0e8", fontWeight: 500, margin: "0 0 2px" }}>{lang === "ko" ? r.titleKo : r.titleEn}</h3>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{lang === "ko" ? r.titleEn : r.titleKo}</div>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 14, color: "#8a7d6b", lineHeight: 1.75, margin: 0 }}>{r.body}</p>
              {r.stat && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #1a1510" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 20 : 24, color: "#c5a572", fontWeight: 700 }}>{r.stat}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#555", marginTop: 3 }}>{r.statLabel}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Risks grid */}
        <div style={{ ...fade(0.4), background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 24 : 48, marginBottom: isMobile ? 32 : 48 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 30, color: "#f5f0e8", fontWeight: 300, margin: "0 0 24px" }}>{lang === "ko" ? "글로벌 리스크와 자산 보전" : "Global Risks & Wealth Preservation"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 14 : 28 }}>
            {[
              { ko: "통화 가치 하락", en: "Currency Devaluation", dKo: "모든 법정화폐는 시간이 지남에 따라 구매력을 상실합니다. 금은 지난 100년간 모든 주요 통화 대비 가치를 유지했습니다.", dEn: "All fiat currencies lose purchasing power over time. Gold has maintained its value against all major currencies over the past 100 years." },
              { ko: "지정학적 불확실성", en: "Geopolitical Uncertainty", dKo: "무역 전쟁, 지역 분쟁은 전통적 금융 자산에 위험을 초래합니다. 금은 어떤 국경에도 묶이지 않습니다.", dEn: "Trade wars and conflicts pose risks to traditional assets. Gold is not tied to any border or government." },
              { ko: "금융 시스템 리스크", en: "Financial System Risk", dKo: "은행 위기, 양적완화, 과도한 부채는 시스템적 취약성을 증가시킵니다. 실물 금은 이 시스템 밖에 존재합니다.", dEn: "Banking crises and excessive debt increase systemic vulnerabilities. Physical gold exists outside this system." },
              { ko: "인플레이션 헤지", en: "Inflation Hedge", dKo: "중앙은행의 통화 팽창 정책에 대한 가장 검증된 보호 수단입니다. 2020~2024년 인플레이션기에 금은 주식 대비 우수한 성과를 냈습니다.", dEn: "The most proven protection against monetary expansion. Gold outperformed equities during the 2020–2024 inflationary period." },
            ].map((x, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: !isMobile && i < 2 ? "1px solid #1a1510" : "none" }}>
                <h4 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#c5a572", margin: "0 0 6px", fontWeight: 600 }}>{lang === "ko" ? x.ko : x.en}</h4>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 13, color: "#8a7d6b", lineHeight: 1.65, margin: 0 }}>{lang === "ko" ? x.dKo : x.dEn}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...fade(0.55), textAlign: "center" }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#8a7d6b", marginBottom: 22 }}>{lang === "ko" ? "지금 바로 국제 현물가 기준으로 실물 금·은을 구매하세요" : "Buy physical gold and silver at international spot price today"}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexDirection: isMobile ? "column" : "row", maxWidth: 440, margin: "0 auto" }}>
            <button onClick={() => navigate("shop")} style={{ flex: 1, background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "14px 28px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 30, cursor: "pointer" }}>{lang === "ko" ? "지금 구매하기 →" : "Buy Now →"}</button>
            <button onClick={() => navigate("learn")} style={{ flex: 1, background: "transparent", color: "#c5a572", border: "1px solid rgba(197,165,114,0.4)", padding: "14px 28px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 30, cursor: "pointer" }}>{lang === "ko" ? "투자 교육 보기" : "Education Hub"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS & SHARED COMPONENTS (used by Storage, AGP, AGPBackingReport)
// ═══════════════════════════════════════════════════════════════════════════════
const T = {
  bg: "#0a0a0a",
  panel: "#111008",
  border: "#1a1510",
  accent: "#C5A572",
  textPrimary: "#f5f0e8",
  textSecondary: "#8a7d6b",
  serif: "'Cormorant Garamond',serif",
  sans: "'Outfit',sans-serif",
  mono: "'JetBrains Mono',monospace",
};

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10, color: T.accent, letterSpacing: 4, textTransform: "uppercase", marginBottom: 10, fontFamily: T.sans }}>
      {children}
    </div>
  );
}


function BenefitTile({ icon, title, bullets }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: "22px 20px" }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: T.serif, fontSize: 17, color: T.textPrimary, fontWeight: 400, marginBottom: 12 }}>{title}</div>
      <ul style={{ margin: 0, padding: "0 0 0 16px", listStyle: "disc" }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.sans, marginBottom: 6, lineHeight: 1.55 }}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({ num, icon, title, body }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: T.mono, fontSize: 13, color: "#0a0a0a", fontWeight: 700 }}>{num}</span>
      </div>
      <div>
        <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
        <div style={{ fontFamily: T.serif, fontSize: 16, color: T.textPrimary, fontWeight: 400, marginBottom: 5 }}>{title}</div>
        <div style={{ fontSize: 13, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.6 }}>{body}</div>
      </div>
    </div>
  );
}

function FAQAccordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", background: open === i ? "rgba(197,165,114,0.05)" : T.panel, border: "none", padding: "18px 20px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
          >
            <span style={{ fontSize: 14, color: T.textPrimary, fontFamily: T.sans, fontWeight: 500, lineHeight: 1.4 }}>{item.q}</span>
            <span style={{ color: T.accent, fontSize: 18, flexShrink: 0, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
          </button>
          {open === i && (
            <div style={{ background: T.panel, padding: "0 20px 18px", borderTop: `1px solid ${T.border}` }}>
              <p style={{ margin: "14px 0 0", fontSize: 13, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.7 }}>{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// AGP MAIN PAGE
// ═══════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE — Full 13-section expanded version
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE — Restructured: landing + sub-sections
// ═══════════════════════════════════════════════════════════════════════════════
function Storage({ lang, navigate }) {
  const isMobile = useIsMobile();
  const ko = lang === "ko";

  const section = (content, extra = {}) => (
    <div style={{ padding: isMobile ? "48px 20px" : "72px 80px", borderBottom: `1px solid ${T.border}`, ...extra }}>
      {content}
    </div>
  );

  const h2 = (ko_text, en_text) => (
    <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : 38, color: T.textPrimary, fontWeight: 300, margin: "0 0 16px" }}>
      {ko ? ko_text : en_text}
    </h2>
  );

  const lead = (ko_text, en_text) => (
    <p style={{ fontSize: isMobile ? 13 : 15, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.8, margin: "0 0 24px", maxWidth: 720 }}>
      {ko ? ko_text : en_text}
    </p>
  );

  const faqItems = [
    {
      q: ko ? "Q1. 최소 구매 금액은? / What is the minimum purchase?" : "Q1. What is the minimum purchase?",
      a: ko ? "일회성 실물 바 구매는 최소 1온스(약 USD 3,100~3,500) 수준부터 시작합니다. 더 작은 단위로 시작하고 싶다면 Aurum Gold Plan(AGP)을 통해 월 KRW 100,000(약 USD 73)부터 1g 단위로 저축할 수 있습니다." : "One-off bar purchases start at roughly 1 oz (USD 3,100–3,500). If you want to begin smaller, the Aurum Gold Plan (AGP) lets you save in 1-gram increments from KRW 100,000 (~USD 73) per month."
    },
    {
      q: ko ? "Q2. 카드로 결제 가능한가요? / Can I pay with a Korean credit card?" : "Q2. Can I pay with a Korean credit card?",
      a: ko ? "네. 토스페이를 통해 신용카드 또는 체크카드 결제 가능합니다. 카드 결제 시 프리미엄 5.5%(토스 수수료 포함)이며, 전신환 결제 시 2.5%, 암호화폐 결제 시 2.0%입니다." : "Yes. You can pay via Toss Pay using a Korean credit or debit card. Card premium is 5.5% (includes Toss processing); wire premium is 2.5%; crypto premium is 2.0%."
    },
    {
      q: ko ? "Q3. 한국으로 금을 가져올 때 세금은? / What tax applies when bringing gold to Korea?" : "Q3. What tax applies when bringing gold to Korea?",
      a: ko ? "한국 수입 시 관세 3%와 부가가치세 10%, 합계 약 13%가 금속 가액에 부과됩니다. 금을 싱가포르에 계속 보관하는 동안은 한국 세금이 발생하지 않습니다. 개별 상황은 공인 세무사와 상담하세요." : "Importing into Korea triggers 3% customs + 10% VAT on metal value, totaling ~13%. No Korean taxes apply while metal remains in Singapore. Consult a certified Korean tax advisor for your specific situation."
    },
    {
      q: ko ? "Q4. Aurum이 망하면 내 금은? / What happens to my gold if Aurum goes bankrupt?" : "Q4. What happens to my gold if Aurum goes bankrupt?",
      a: ko ? "귀하의 금은 Aurum 명의가 아닌 귀하 명의로 Malca-Amit 금고에 배분·보관됩니다. Aurum 재무 상태와 완전히 분리되어 있으며, Aurum이 파산하더라도 수탁자인 Malca-Amit이 직접 귀하에게 반환합니다." : "Your gold is allocated in your name at Malca-Amit, not Aurum's. It is fully segregated from Aurum's balance sheet. In the event of Aurum's insolvency, Malca-Amit returns the metal directly to you."
    },
    {
      q: ko ? "Q5. 싱가포르 금고를 직접 방문할 수 있나요? / Can I visit the Singapore vault in person?" : "Q5. Can I visit the Singapore vault in person?",
      a: ko ? "가능합니다. 온라인으로 사전 예약하시면 본인 보유 자산을 직접 실사할 수 있습니다. 여권과 구매 증명서 지참이 필요하며, 현장 감사 수수료는 회당 SGD 500입니다." : "Yes. Book an online appointment and you can inspect your own holdings in person. Bring your passport and invoice. On-site audit fee is SGD 500 per visit."
    },
    {
      q: ko ? "Q6. 보관료는 어떻게 차감되나요? / How are storage fees deducted?" : "Q6. How are storage fees deducted?",
      a: ko ? "일일 보관료는 SGT 00:01 기준 현물가로 계산되며, 매년 3월 1일 또는 전액 매도·인출 시점에 일괄 청구됩니다. Aurum 계정 현금 잔액에서 자동 차감되거나 등록 카드로 청구됩니다." : "Daily storage is calculated at 00:01 SGT spot and billed once per year on 1 March, or when you fully sell/withdraw. Fees are auto-deducted from your Aurum cash balance or charged to your card on file."
    },
    {
      q: ko ? "Q7. 매도 시 원화 수취는 얼마나 걸리나요? / How long to receive KRW when selling?" : "Q7. How long to receive KRW when selling?",
      a: ko ? "온라인 매도 주문 체결 후 2영업일 이내에 연결된 한국 은행 계좌로 원화가 입금됩니다. USD, SGD 수취도 가능합니다." : "After executing an online sell order, KRW is credited to your linked Korean bank account within 2 business days. USD and SGD payouts are also available."
    },
    {
      q: ko ? "Q8. 해외금융계좌 신고 대상인가요? / Does this trigger Korean overseas financial account reporting?" : "Q8. Does this trigger Korean overseas financial account reporting?",
      a: ko ? "한국 거주자로서 연중 어느 하루라도 해외 금융계좌 잔액 합계가 5억 원을 초과하면 다음 해 6월 1일~30일 사이에 국세청에 신고해야 합니다. Aurum은 NTS 양식에 맞춘 연말 잔고 증명서를 제공합니다. 세무사 상담 권장." : "Korean residents with aggregate offshore financial account balances exceeding KRW 500M at any point in the year must report to the NTS between June 1–30 the following year. Aurum provides year-end statements in NTS-compliant format. Consult a tax advisor."
    },
    {
      q: ko ? "Q9. AGP와 실물 보관의 차이는? / AGP vs allocated bullion — what's the difference?" : "Q9. AGP vs allocated bullion — what's the difference?",
      a: ko ? "실물 보관은 구매 즉시 고유 일련번호를 가진 특정 바가 귀하에게 배정됩니다. AGP는 1g 단위로 적립하다가 누적 100g 또는 1kg에 도달하면 실물 PAMP·Heraeus 바로 무료 전환할 수 있는 저축 상품입니다. AGP도 100% 실물 금으로 백업되며 매일 보유량이 공개됩니다." : "Allocated storage assigns a specific serial-numbered bar to you at purchase. AGP is a savings product where you accumulate by the gram and, at 100g or 1kg threshold, convert to a real PAMP or Heraeus bar for free. AGP is also 100% physically backed with daily public backing reports."
    },
    {
      q: ko ? "Q10. 상속 시 처리는? / What happens in case of inheritance?" : "Q10. What happens in case of inheritance?",
      a: ko ? "싱가포르 법률에 따라 귀하의 법정 상속인에게 이전 가능합니다. 고객 대시보드에서 수익자(beneficiary)를 사전 등록할 수 있으며, 상세 프로세스는 계정 개설 시 안내됩니다. 한국 상속세 관련 사항은 별도 전문가 상담이 필요합니다." : "Under Singapore law, your holdings transfer to your legal heirs. You may pre-register a beneficiary in your customer dashboard. Details are provided at account opening. Korean estate tax implications should be discussed with a qualified professional."
    },
  ];

  const subNavItems = [
    { id: "process", ko: "보관 프로세스", en: "Storage Process" },
    { id: "benefits", ko: "보관 혜택", en: "Benefits" },
    { id: "security", ko: "금고 보안 체계", en: "Vault Security" },
    { id: "ownership", ko: "소유권과 분리 보관 원칙", en: "Ownership & Segregation" },
    { id: "fees", ko: "보관 수수료", en: "Storage Fees" },
    { id: "compliance", ko: "규제 및 컴플라이언스", en: "Compliance" },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <div style={{ padding: isMobile ? "64px 20px 48px" : "96px 80px 72px", textAlign: "center", borderBottom: `1px solid ${T.border}` }}>
        <SectionLabel>{ko ? "싱가포르 보관" : "Singapore Storage"}</SectionLabel>
        <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 32 : 52, color: T.textPrimary, fontWeight: 300, margin: "0 0 14px" }}>
          {ko ? "세계 최고 수준의 금고 보관" : "World-Class Vault Storage"}
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: T.textSecondary, fontFamily: T.sans, maxWidth: 640, margin: "0 auto 20px", lineHeight: 1.75 }}>
          {ko ? "Malca-Amit 싱가포르 FTZ 금고에서 완전 배분, 완전 보험 실물 보관." : "Fully allocated, fully insured storage at the Malca-Amit Singapore Free Trade Zone vault."}
        </p>
        <p style={{ fontSize: isMobile ? 12 : 14, color: T.textSecondary, fontFamily: T.sans, maxWidth: 700, margin: "0 auto 36px", lineHeight: 1.75 }}>
          {ko ? "싱가포르 자유무역지대 내 Malca-Amit 금고. 한국 VAT·관세 면제, Lloyd's of London 보험 100% 보장, 고유 일련번호로 개별 배분 보관." : "Stored at Malca-Amit inside Singapore's Free Trade Zone. No Korean VAT or customs duties. 100% Lloyd's of London insurance. Allocated by unique serial number."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {[
            { icon: "🏛️", label: ko ? "Malca-Amit Singapore — 1963년 설립, 세계 최고 귀금속 보관 전문 업체" : "Malca-Amit Singapore — Founded 1963, world's leading precious metals custodian" },
            { icon: "📜", label: ko ? "Lloyd's of London — 완전 가액 보험, 모든 위험 보장" : "Lloyd's of London — Full replacement value insurance, all risks covered" },
            { icon: "🇸🇬", label: ko ? "Singapore FTZ — 자유무역지대, GST 면제, AAA 국가 신용등급" : "Singapore FTZ — Free Trade Zone, GST-exempt, AAA sovereign credit rating" },
          ].map((chip, i) => (
            <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, maxWidth: isMobile ? "100%" : 340 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{chip.icon}</span>
              <span style={{ fontSize: 11, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.5 }}>{chip.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── LANDING: 고객님이 보유한 금, 고객님이 통제합니다 ── */}
      {section(
        <>
          {h2("고객님이 보유한 금, 고객님이 통제합니다", "You Control Your Bullion, 24/7")}
          {lead(
            "Aurum Korea 금고에 보관된 고객님의 실물 금은 24시간 언제든 온라인으로 확인하고 관리할 수 있습니다. 실시간 평가금액 조회, 고유 일련번호 사진 열람, 매도 주문, 실물 인출 요청까지 — 한국어 대시보드에서 모든 것이 가능합니다. 은행 금통장처럼 숫자만 보이는 상품이 아닙니다. 진짜 금이 존재하고, 그 금은 귀하의 것입니다.",
            "Your physical gold stored at Aurum Korea is available online 24/7. Real-time valuation, individual bar serial number photos, sell orders, physical withdrawal requests — all accessible from a Korean-language dashboard. This is not a bank gold passbook where you never see or touch anything. Real metal exists. It is yours."
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "🖥️", title: ko ? "온라인 대시보드 / Online Dashboard" : "Online Dashboard", body: ko ? "실시간 USD·KRW 평가금액, 구매 이력, 개별 바 일련번호, 누적 보관료 확인 / Real-time USD and KRW valuation, purchase history, individual bar serial numbers, storage fees accrued to date." : "Real-time USD and KRW valuation, purchase history, individual bar serial numbers, storage fees accrued to date." },
              { icon: "📸", title: ko ? "실물 사진 확인 / Photo Verification" : "Photo Verification", body: ko ? "모든 바를 일련번호가 보이도록 촬영하여 업로드. 신규 업로드 시 이메일·카카오톡 알림" : "Every bar photographed with serial number visible. Email and KakaoTalk alert when new photos are uploaded." },
              { icon: "📋", title: ko ? "볼트 증명서 / Vault Certificate" : "Vault Certificate", body: ko ? "고객 명의로 보관된 모든 바 목록이 기재된 PDF. 거래 발생 시 자동 업데이트. 자산관리·상속·담보대출 시 활용 가능" : "Downloadable PDF listing all bars held in your name. Auto-updated after every transaction. Useful for wealth planning, estate documentation, or loan collateral." },
              { icon: "💱", title: ko ? "원클릭 매도 / One-Click Sell" : "One-Click Sell", body: ko ? "실시간 매수호가에 Aurum으로 매도. 연결된 한국 은행 계좌로 KRW 2영업일 내 수취" : "Sell to Aurum at live bid price. KRW settlement to your linked Korean bank within 2 business days." },
              { icon: "🔄", title: ko ? "계정 내 현금·실물 동시 보유 / Cash + Bullion in One Account" : "Cash + Bullion in One Account", body: ko ? "USD, SGD, KRW 잔액을 Aurum 계정에 보유하여 신속한 매매와 평균단가 관리" : "Hold USD, SGD, or KRW balances inside your Aurum account for faster trades and price-averaging." },
              { icon: "🌐", title: ko ? "한국어 전담 고객지원 / Korean-Language Support" : "Korean-Language Support", body: ko ? "카카오톡·전화·이메일로 실시간 대응. 영업시간 KST, 긴급 상담 24/7" : "Real-time support via KakaoTalk, phone, and email. KST business hours with 24/7 emergency line." },
            ].map((item, i) => (
              <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 18px", display: "flex", gap: 14 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: T.sans, fontSize: 14, color: T.textPrimary, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textSecondary, lineHeight: 1.6 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── FAQ ── */}
      {section(
        <>
          {h2("자주 묻는 질문", "Frequently Asked Questions")}
          <FAQAccordion items={faqItems} />
        </>
      )}

      {/* ── SUB-SECTION NAV ── */}
      <div style={{ background: T.panel, borderBottom: `1px solid ${T.border}`, padding: isMobile ? "16px 20px" : "18px 80px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: isMobile ? 10 : 8, flexWrap: isMobile ? "nowrap" : "wrap", minWidth: "max-content" }}>
          {subNavItems.map(item => (
            <a key={item.id} href={`#${item.id}`}
              style={{ fontFamily: T.sans, fontSize: 12, color: T.accent, border: `1px solid rgba(197,165,114,0.3)`, borderRadius: 20, padding: "6px 16px", cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap", background: "transparent", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(197,165,114,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              {ko ? item.ko : item.en}
            </a>
          ))}
        </div>
      </div>

      {/* ── SUB-SECTION: 보관 프로세스 ── */}
      <div id="process" style={{ padding: isMobile ? "48px 20px" : "72px 80px", borderBottom: `1px solid ${T.border}` }}>
        {h2("보관 프로세스", "How Storage Works")}
        {lead("주문 즉시 Malca-Amit 금고에 배정됩니다. 5단계, 5분 소요.", "Assigned to the Malca-Amit vault the moment you order. 5 steps, 5 minutes.")}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            { num: 1, icon: "🛒", title: ko ? "구매 / Purchase" : "Purchase", body: ko ? "Aurum 웹사이트에서 실시간 현물가 + 투명한 프리미엄으로 주문" : "Order on the Aurum website at live spot price plus transparent premium." },
            { num: 2, icon: "💳", title: ko ? "결제 / Pay" : "Pay", body: ko ? "토스페이(카드·계좌이체) 또는 국제 전신환" : "Toss Pay (card or bank transfer) or international wire transfer." },
            { num: 3, icon: "🏭", title: ko ? "공급 / Supplier Execution" : "Supplier Execution", body: ko ? "결제 확인 후 수분 이내 LBMA 승인 정련소 네트워크와 물량 체결" : "Aurum executes with the LBMA-approved refiner network within minutes of payment confirmation." },
            { num: 4, icon: "🏛️", title: ko ? "금고 배정 / Vault Allocation" : "Vault Allocation", body: ko ? "고유 일련번호를 가진 특정 바가 귀하의 계정으로 Malca-Amit Singapore FTZ에 배정" : "A specific, serial-numbered bar is assigned to your account at Malca-Amit Singapore FTZ." },
            { num: 5, icon: "📸", title: ko ? "확인 / Confirmation" : "Confirmation", body: ko ? "48시간 이내 사진·증명서·카카오톡 알림 발송" : "Photos, certificate, and KakaoTalk notification sent within 48 hours." },
          ].map(s => <StepCard key={s.num} {...s} />)}
        </div>
        <div style={{ marginTop: 24, padding: "14px 18px", background: "rgba(197,165,114,0.05)", border: `1px solid rgba(197,165,114,0.2)`, borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: 12, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.6 }}>
            {ko ? "Aurum은 재고를 보유하지 않습니다. 귀하의 바는 귀하에게만 배정되며, 풀링되지 않고, 대여되지 않습니다." : "Aurum holds no inventory. Your bar is specifically assigned to you — never pooled, never leased."}
          </p>
        </div>
      </div>

      {/* ── SUB-SECTION: 보관 혜택 ── */}
      <div id="benefits" style={{ padding: isMobile ? "48px 20px" : "72px 80px", borderBottom: `1px solid ${T.border}` }}>
        {h2("보관 혜택", "Storage Benefits")}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
          <BenefitTile icon="🔐" title={ko ? "Allocated / 완전 배분" : "Allocated"} bullets={[
            ko ? "고유 일련번호로 귀하의 이름 하에 개별 등록 / Registered under your name with a unique serial number" : "Registered under your name with a unique serial number",
            ko ? "다른 고객과 혼합 보관(unallocated)하지 않음 / Never pooled or commingled" : "Never pooled or commingled with other customers' metal",
            ko ? "Aurum 파산 시에도 고객 자산 완전 분리 — 법적 소유권은 항상 고객 / Segregated from Aurum's balance sheet" : "Segregated from Aurum's balance sheet — you retain legal title at all times",
          ]} />
          <BenefitTile icon="🛡️" title={ko ? "Insured / 완전 보험" : "Insured"} bullets={[
            ko ? "Marsh 브로커를 통한 Lloyd's of London 신디케이트 언더라이팅" : "Underwritten by Lloyd's of London syndicates via Marsh",
            ko ? "모든 위험 보장 — 화재·도난·천재지변·운송·직원 실수 포함" : "All-risks coverage including fire, theft, natural disaster, transit, and employee error",
            ko ? "교체 가치 100% 보상, 공제액 $0" : "100% replacement value, zero deductible",
          ]} />
          <BenefitTile icon="📋" title={ko ? "Audited / 정기 감사" : "Audited"} bullets={[
            ko ? "LBMA 승인 감사기관 Bureau Veritas 연 2회 실사" : "Bureau Veritas (LBMA-approved) conducts bi-annual audits",
            ko ? "무작위 금괴 일련번호·중량 대조 검증" : "Random-sample serial number and weight verification",
            ko ? "실시간 온라인 감사 리포트 (Live Audit Report) 고객 조회 가능" : "Live Audit Report viewable in customer dashboard",
          ]} />
          <BenefitTile icon="📸" title={ko ? "Photos / 사진 증명" : "Photos"} bullets={[
            ko ? "고해상도 사진 + 일련번호 + 인증서 동시 업로드" : "HD photos with serial numbers and certificates uploaded together",
            ko ? "입고 48시간 이내 이메일·카카오톡 알림" : "Email and KakaoTalk alert within 48 hours of intake",
            ko ? "대시보드에서 언제든 재다운로드 가능" : "Re-download from your dashboard anytime",
          ]} />
          <BenefitTile icon="🌏" title={ko ? "FTZ / 자유무역지대" : "FTZ"} bullets={[
            ko ? "Singapore Freeport Zone 내 Malca-Amit Le Freeport 금고" : "Malca-Amit Le Freeport vault inside Singapore's Free Trade Zone",
            ko ? "GST(싱가포르 부가세) 완전 면제 — 투자용 금 IPM 특례" : "Full GST exemption via the Investment Precious Metals (IPM) regime",
            ko ? "한국 VAT(10%) · 관세(3%) 미적용 — 해외 보관 유지 시" : "No Korean VAT (10%) or customs duties (3%) while metal remains offshore",
          ]} />
          <BenefitTile icon="⚡" title={ko ? "Liquid / 즉시 유동화" : "Liquid"} bullets={[
            ko ? "실시간 매도호가 제공, 원클릭 매도" : "Live bid prices, one-click sell",
            ko ? "한국 등록 은행 계좌로 KRW 2영업일 내 수취" : "KRW settlement to your registered Korean bank within 2 business days",
            ko ? "최소 보유기간·위약금 없음" : "No minimum holding period, no exit fees",
          ]} />
          <BenefitTile icon="🧾" title={ko ? "Tax-Optimized / 세금 최적화" : "Tax-Optimized"} bullets={[
            ko ? "한국 거주자가 해외 보관으로 누리는 합법적 세제 효과" : "Legal tax optimization for Korean residents through offshore custody",
            ko ? "KRX 금시장 대비 VAT 10% 절약 + 관세 3% 회피" : "Save 10% VAT and avoid 3% customs vs. taking KRX gold physical",
            ko ? "매각차익은 인출 시점까지 과세이연 (법률·세무 조언 아님 — 전문가 상담 필수)" : "Gains are tax-deferred until realized (not legal or tax advice — consult a professional)",
          ]} />
          <BenefitTile icon="🇰🇷" title={ko ? "Korean-First Service / 한국어 우선 서비스" : "Korean-First Service"} bullets={[
            ko ? "전 플랫폼·고객지원·문서 한국어 완전 지원" : "Full Korean-language platform, support, and documentation",
            ko ? "카카오톡 상담, KST 영업시간 응대" : "KakaoTalk support during KST business hours",
            ko ? "원화(KRW) 결제·정산 지원, 분기별 원화 가치 리포트" : "KRW payment and settlement, quarterly KRW valuation reports",
          ]} />
        </div>
      </div>

      {/* ── SUB-SECTION: 금고 보안 체계 ── */}
      <div id="security" style={{ padding: isMobile ? "48px 20px" : "72px 80px", borderBottom: `1px solid ${T.border}` }}>
        {h2("금고 보안 체계", "Vault Security Architecture")}
        {lead("싱가포르 Le Freeport는 금융 언론에서 \"아시아의 포트 녹스(Fort Knox)\"로 불립니다.", "Singapore's Le Freeport has been called \"Asia's Fort Knox\" by the financial press.")}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { icon: "🚪", title: ko ? "1톤 금고문" : "1-ton vault door", body: ko ? "강화 콘크리트·강철 철근 구조물 내장" : "Reinforced concrete and steel rebar construction" },
            { icon: "👁️", title: ko ? "7중 이상 감시" : "7+ layers of surveillance", body: ko ? "고해상도 카메라, 동작 감지, 지진파 센서" : "HD cameras, motion detection, seismographic sensors" },
            { icon: "🔍", title: ko ? "생체 인식 출입" : "Biometric access control", body: ko ? "지문·홍채 인식, 이중 승인" : "Fingerprint and iris recognition with dual authorization" },
            { icon: "👮", title: ko ? "무장 대응" : "Armed response", body: ko ? "싱가포르 보조경찰 상시 대기" : "Singapore auxiliary police on constant standby" },
            { icon: "🌏", title: ko ? "관할권 안정성" : "Jurisdictional stability", body: ko ? "싱가포르 AAA 국가신용등급, 강력한 법치주의" : "Singapore AAA sovereign credit rating, strong rule of law" },
            { icon: "🔐", title: ko ? "내부자 부정·원인불명 손실 담보" : "Fidelity + mysterious disappearance coverage", body: ko ? "Lloyd's of London 완전 보장" : "Full Lloyd's of London coverage" },
          ].map((feat, i) => (
            <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{feat.icon}</div>
              <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textPrimary, fontWeight: 600, marginBottom: 5 }}>{feat.title}</div>
              <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textSecondary, lineHeight: 1.5 }}>{feat.body}</div>
            </div>
          ))}
        </div>
        {/* 5중 감사 체계 */}
        <h3 style={{ fontFamily: T.serif, fontSize: isMobile ? 22 : 28, color: T.textPrimary, fontWeight: 300, margin: "0 0 16px" }}>{ko ? "5중 감사 체계" : "5 Layers of Audit Verification"}</h3>
        <p style={{ fontSize: isMobile ? 13 : 14, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.8, margin: "0 0 20px" }}>{ko ? "신뢰를 부탁드리지 않습니다. 다섯 가지 방법으로 증명합니다." : "We don't ask you to trust us. We prove it, five different ways."}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { num: "1", title: ko ? "제3자 감사 (Bureau Veritas) / Third-Party Audit" : "Third-Party Audit (Bureau Veritas)", bullets: ko ? ["LBMA 승인 독립 감사기관", "연 2회 실물 카운트 및 중량 검증", "무작위 샘플 일련번호 대조", "고객 대시보드에서 감사 보고서 다운로드"] : ["LBMA-approved independent auditor", "Bi-annual physical counts and weight verification", "Random-sample serial number matching", "Audit reports downloadable from the customer dashboard"] },
            { num: "2", title: ko ? "실시간 감사 리포트 / Live Audit Report" : "Live Audit Report", bullets: ko ? ["전체 고객 자산 목록 실시간 공개 (익명 처리)", "고객은 본인 보유 내역이 실시간 목록에 포함되어 있는지 직접 확인 가능", "입고·출고 발생 시 즉시 업데이트"] : ["Anonymized real-time vault inventory visible to all customers", "Customers verify their own holdings appear in the live list", "Updated in real time with every deposit and withdrawal"] },
            { num: "3", title: ko ? "고객 현장 감사 / Customer On-Site Audit" : "Customer On-Site Audit", bullets: ko ? ["싱가포르 금고에서 본인 보유 자산 직접 실사 가능", "사전 예약 필수, 회당 SGD 500 수수료", "바 실물 확인 및 일련번호 대조 포함"] : ["Physical on-site inspection at the Singapore vault", "Appointment required, SGD 500 fee per visit", "Hand inspection of bars matched to serial records"] },
            { num: "4", title: ko ? "내부 감사 / Internal Audit" : "Internal Audit", bullets: ko ? ["운영팀이 월간 내부 정기 점검 수행", "Marsh·Lloyd's 보험 계약 의무사항", "7년간 기록 보관"] : ["Monthly internal reconciliation by the operations team", "Required under the Marsh / Lloyd's insurance policy", "Documented and retained for 7 years"] },
            { num: "5", title: ko ? "재무 감사 / Financial Audit" : "Financial Audit", bullets: ko ? ["Aurum Korea Pte Ltd는 싱가포르 회사법에 따라 매년 감사", "싱가포르 등록 회계법인 감사", "연차보고서 공개"] : ["Aurum Korea Pte Ltd is audited annually under the Singapore Companies Act", "Audited by a licensed Singapore auditing firm", "Annual report published"] },
          ].map((card, i) => (
            <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: "18px 20px", display: "flex", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: T.mono, fontSize: 13, color: "#0a0a0a", fontWeight: 700 }}>{card.num}</span>
              </div>
              <div>
                <div style={{ fontFamily: T.sans, fontSize: 14, color: T.textPrimary, fontWeight: 600, marginBottom: 8 }}>{card.title}</div>
                <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                  {card.bullets.map((b, j) => (
                    <li key={j} style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.sans, marginBottom: 4, lineHeight: 1.6 }}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SUB-SECTION: 소유권과 분리 보관 원칙 ── */}
      <div id="ownership" style={{ padding: isMobile ? "48px 20px" : "72px 80px", borderBottom: `1px solid ${T.border}` }}>
        {h2("소유권과 분리 보관 원칙", "Your Bullion Is Yours — Legally and Physically")}
        {[
          {
            title: ko ? "법적 소유권 / Legal Ownership" : "Legal Ownership",
            body: ko ? "배분된 순간부터 귀하의 금은 귀하의 명의로 등록되며, 법적 이름이 기재된 볼트 증명서가 발행됩니다. Aurum Korea Pte Ltd는 중개인 및 보관 조정자 역할을 수행할 뿐 귀하의 금속에 대한 소유자가 아닙니다. 귀하는 항상 완전한 법적 소유권을 보유합니다." : "From the moment of allocation your bullion is registered in your name, with a vault certificate issued under your legal name. Aurum Korea Pte Ltd acts as broker and storage coordinator — not as owner. You retain full legal title at all times."
          },
          {
            title: ko ? "Aurum 자산과 완전 분리 / Segregated From Aurum's Balance Sheet" : "Segregated From Aurum's Balance Sheet",
            body: ko ? "귀하의 금은 Aurum의 대차대조표에 포함되지 않습니다. Malca-Amit에서 귀하의 이름으로 분리된 서브 계정에 보관됩니다. 만에 하나 Aurum이 지급불능 상태에 빠지더라도, 귀하의 금은 회사 자산이 되지 않고 수탁자로부터 직접 귀하에게 반환됩니다." : "Your bullion is not on Aurum's balance sheet. It is held in a segregated sub-account under your name at Malca-Amit. If Aurum were to enter insolvency, your metal does not become a company asset — it is returned to you directly by the custodian."
          },
          {
            title: ko ? "Malca-Amit의 역할 / Malca-Amit as Independent Custodian" : "Malca-Amit as Independent Custodian",
            body: ko ? "Malca-Amit은 1963년 설립된 62년 역사의 귀금속 수탁 전문기업으로 싱가포르, 홍콩, 런던, 취리히, 뉴욕, 상하이에 금고를 운영합니다. 싱가포르 통화청(MAS) 규제를 받으며 ISO 9001:2015 인증을 보유합니다. 수탁자의 선관주의 의무는 금속 소유자인 귀하에게 있으며, Aurum에게 있지 않습니다." : "Malca-Amit is a 62-year-old precious metals custodian (founded 1963) operating vaults in Singapore, Hong Kong, London, Zurich, New York, and Shanghai. Regulated by the Monetary Authority of Singapore (MAS) and certified to ISO 9001:2015. Their fiduciary duty runs to the bullion owner — you — not to Aurum."
          },
        ].map((item, i) => (
          <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 22px", marginBottom: 14 }}>
            <div style={{ fontFamily: T.sans, fontSize: 14, color: T.accent, fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
            <p style={{ margin: 0, fontSize: 13, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.75 }}>{item.body}</p>
          </div>
        ))}
      </div>

      {/* ── SUB-SECTION: 보관 수수료 ── */}
      <div id="fees" style={{ padding: isMobile ? "48px 20px" : "72px 80px", borderBottom: `1px solid ${T.border}` }}>
        {h2("보관 수수료", "Storage Fee Schedule")}
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
            <thead>
              <tr style={{ background: "#0d0b08" }}>
                {[ko ? "보관 가치" : "Vault Value", ko ? "연간 요율" : "Annual Fee", ko ? "최소" : "Minimum"].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: "left", color: T.textSecondary, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: T.sans, border: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["< USD 50,000", "0.80%", "USD 12/month"],
                ["USD 50,000 – 250,000", "0.65%", ko ? "면제 / Waived" : "Waived"],
                ["> USD 250,000", "0.50%", ko ? "면제 / Waived" : "Waived"],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "12px 16px", fontFamily: j === 1 ? T.mono : T.sans, fontSize: j === 1 ? 14 : 13, color: j === 1 ? T.accent : T.textPrimary, border: `1px solid ${T.border}`, background: T.panel }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.textPrimary, fontWeight: 600, marginBottom: 10 }}>{ko ? "수수료 계산 방식" : "Fee Calculation"}</div>
          {[
            ko ? "일일 기준 금 현물가(SGT 00:01)로 계산 / Calculated daily based on metal spot price at 00:01 SGT" : "Calculated daily based on metal spot price at 00:01 SGT",
            ko ? "매년 3월 1일 또는 전액 매도·인출 시점에 청구 / Invoiced on 1 March each year, or upon full withdrawal/sale" : "Invoiced on 1 March each year, or upon full withdrawal/sale",
            ko ? "Aurum 계정 현금 잔액에서 차감 또는 등록 카드 청구 / Paid from cash balance or card on file" : "Paid from cash balance in your Aurum account, or invoiced to card on file",
            ko ? "AGP 그램 보관료 별도 — Aurum Gold Plan 섹션 참고 / No fees for AGP grams — see AGP section" : "No fees for AGP grams — see Aurum Gold Plan section",
          ].map((line, i) => (
            <div key={i} style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.sans, marginBottom: 6, lineHeight: 1.6 }}>• {line}</div>
          ))}
        </div>
        <div style={{ background: "rgba(197,165,114,0.05)", border: `1px solid rgba(197,165,114,0.2)`, borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.accent, fontWeight: 600, marginBottom: 8 }}>{ko ? "예시 계산" : "Example Calculation"}</div>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.6 }}>
            {ko ? "1 kg 금바(2026년 4월 기준 ~USD 153,000)를 싱가포르 금고에 보관하는 경우:" : "Customer holds a 1 kg gold bar (~USD 153,000 at April 2026 spot) in the Singapore vault:"}
          </p>
          {[
            [ko ? "연간 보관료 / Annual fee" : "Annual fee", "0.65% × USD 153,000 = USD 994.50/yr"],
            [ko ? "일일 환산 / Daily" : "Daily", "~USD 2.72/day"],
            [ko ? "월간 환산 / Monthly" : "Monthly", ko ? "~0.054% — 6자릿수 금 보유 기준 세계 최저 수준" : "~0.054% — one of the lowest safe-keeping rates worldwide for six-figure gold holdings"],
          ].map(([l, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: i < 2 ? `1px solid ${T.border}` : "none", padding: "6px 0" }}>
              <span style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.sans }}>{l}</span>
              <span style={{ fontSize: 12, color: T.textPrimary, fontFamily: T.mono }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 14, color: T.textPrimary, fontWeight: 600, marginBottom: 12 }}>{ko ? "비교 분석" : "Fee Comparison"}</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#0d0b08" }}>
                {[ko ? "옵션" : "Option", ko ? "보관료" : "Storage Fee", ko ? "보험" : "Insurance", ko ? "관할" : "Jurisdiction"].map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: "left", color: T.textSecondary, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: T.sans, border: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Aurum Korea", "0.50–0.80%/yr", "Lloyd's, 100%", "Singapore FTZ"],
                [ko ? "국내 은행 금예금 / Korean bank gold deposit" : "Korean bank gold deposit", "~0.80%/yr", ko ? "없음 (장부상)" : "None (paper only)", "Korea"],
                [ko ? "국내 은행 대여금고 / Korean safe deposit box" : "Korean safe deposit box", ko ? "~0.50%/yr + 보증금" : "~0.50%/yr + deposit", ko ? "없음" : "None", "Korea"],
                [ko ? "가정 금고 + 보험 / Home safe + insurance" : "Home safe + insurance", "1.0–1.5%/yr est.", ko ? "제한적" : "Limited", "Korea"],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "10px 14px", fontFamily: T.sans, fontSize: 12, color: i === 0 && j === 0 ? T.accent : T.textPrimary, border: `1px solid ${T.border}`, background: i === 0 ? "rgba(197,165,114,0.04)" : T.panel, fontWeight: i === 0 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SUB-SECTION: 규제 및 컴플라이언스 ── */}
      <div id="compliance" style={{ padding: isMobile ? "48px 20px" : "72px 80px", borderBottom: `1px solid ${T.border}` }}>
        {h2("규제 및 컴플라이언스", "Compliance & Regulation")}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ko ? "Singapore PSPM Act 2019 등록 귀금속 딜러 / Registered precious metals dealer under the Singapore PSPM Act 2019" : "Registered precious metals dealer under the Singapore PSPM Act 2019",
            ko ? "PDPA(싱가포르 개인정보보호법) + 한국 PIPA 준수 / PDPA (Singapore) and Korean PIPA compliant" : "PDPA (Singapore) and Korean PIPA compliant",
            ko ? "MAS Notice PSM-N01에 따른 AML/CFT KYC / AML/CFT KYC per MAS Notice PSM-N01" : "AML/CFT KYC per MAS Notice PSM-N01",
            ko ? "한국 해외금융계좌 신고: 연중 어느 하루라도 잔액이 5억 원을 초과할 경우 다음 해 6월 30일까지 국세청에 신고. Aurum은 NTS 신고 양식에 부합하는 연말 잔고 증명서 제공." : "Korean Foreign Financial Account Reporting: if aggregate offshore balance exceeds KRW 500M at any point during the year, report to the National Tax Service by June 30 of the following year. Aurum provides year-end statements in NTS-compliant format.",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "12px 16px", background: T.panel, border: `1px solid ${T.border}`, borderRadius: 7 }}>
              <span style={{ color: T.accent, fontSize: 14, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 13, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA STRIP ── */}
      <div style={{ padding: isMobile ? "48px 20px" : "72px 80px", textAlign: "center", background: "linear-gradient(135deg,rgba(197,165,114,0.06),rgba(197,165,114,0.02))" }}>
        <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 24 : 34, color: T.textPrimary, fontWeight: 300, margin: "0 0 16px" }}>
          {ko ? "싱가포르 실물 금 보관, 월 10만원 AGP로 시작하거나 첫 바를 KRW 350만원부터 구매하세요." : "Start storing physical gold in Singapore from KRW 100,000/month via AGP — or KRW 3.5M for your first full bar."}
        </h2>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
          {navigate && (
            <>
              <button onClick={() => navigate("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "15px 36px", fontSize: 15, fontWeight: 700, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}>
                🥇 {ko ? "지금 첫 바 구매하기 / Buy your first bar now" : "Buy your first bar now"}
              </button>
              <button onClick={() => navigate("agp")} style={{ background: "transparent", color: T.accent, border: `1px solid ${T.accent}`, padding: "15px 36px", fontSize: 15, fontWeight: 600, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}>
                💰 {ko ? "AGP 저축 플랜 시작하기 / Start AGP savings plan" : "Start AGP savings plan"}
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// LEARN / EDUCATION HUB
// ═══════════════════════════════════════════════════════════════════════════════
function Learn({ lang, navigate }) {
  const isMobile = useIsMobile();
  const [cat, setCat] = useState("전체");
  const [openId, setOpenId] = useState(null);
  const [visible, setVisible] = useState(false);
  const filtered = cat === "전체" ? EDUCATION_ARTICLES : EDUCATION_ARTICLES.filter(a => a.category === cat);
  const article = EDUCATION_ARTICLES.find(a => a.id === openId);
  const openModal = (id) => { setOpenId(id); setVisible(true); document.body.style.overflow = "hidden"; };
  const closeModal = () => { setVisible(false); document.body.style.overflow = ""; setTimeout(() => setOpenId(null), 180); };
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const catLabels = { "전체": lang === "ko" ? "전체" : "All", "기초": lang === "ko" ? "기초" : "Basics", "가격": lang === "ko" ? "가격" : "Pricing", "구매": lang === "ko" ? "구매" : "Buying", "보관": lang === "ko" ? "보관" : "Storage", "세금·법률": lang === "ko" ? "세금·법률" : "Tax & Legal", "용어집": lang === "ko" ? "용어집" : "Glossary" };
  return (
    <div style={{ background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ background: "linear-gradient(135deg,#0a0a0a,#1a1510 50%,#0a0a0a)", padding: isMobile ? "44px 16px 28px" : "60px 80px 36px", textAlign: "center", borderBottom: "1px solid #1a1510" }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>{lang === "ko" ? "교육 허브" : "Education Hub"}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 30 : 44, color: "#f5f0e8", fontWeight: 300, margin: "0 0 14px" }}>{lang === "ko" ? "금 투자 교육" : "Gold Investment Education"}</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 15, color: "#8a7d6b", maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.7 }}>{lang === "ko" ? "실물 금·은 투자에 필요한 모든 지식을 무료로 제공합니다." : "Everything you need to know about physical gold and silver investing — free."}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {[["📖", lang === "ko" ? "6개 심층 가이드" : "6 In-Depth Guides"], ["🎓", lang === "ko" ? "초보자부터 전문가까지" : "Beginner to Advanced"], ["🆓", lang === "ko" ? "완전 무료" : "Completely Free"]].map(([icon, text], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", background: "#111008", border: "1px solid #1a1510", padding: "6px 14px", borderRadius: 20 }}><span>{icon}</span>{text}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: isMobile ? "20px 16px 0" : "24px 80px 0", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 20 }}>
          {EDUCATION_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? "#c5a572" : "transparent", color: cat === c ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${cat === c ? "#c5a572" : "#2a2318"}`, padding: "7px 18px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: cat === c ? 600 : 400 }}>{catLabels[c] || c}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: isMobile ? "24px 16px 56px" : "32px 80px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(290px,1fr))", gap: isMobile ? 12 : 20 }}>
          {filtered.map(a => (
            <button key={a.id} onClick={() => openModal(a.id)} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 20 : 24, cursor: "pointer", textAlign: "left", width: "100%", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(197,165,114,0.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1510"}>
              <div style={{ fontSize: isMobile ? 32 : 36, marginBottom: 14 }}>{a.emoji}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>{catLabels[a.category] || a.category} · {a.readTime} {lang === "ko" ? "읽기" : "read"}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 19 : 21, color: "#f5f0e8", fontWeight: 500, margin: "0 0 8px", lineHeight: 1.3 }}>{a.title}</h3>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b", margin: "0 0 16px", lineHeight: 1.5 }}>{a.subtitle}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#c5a572", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "읽기" : "Read"} →</div>
            </button>
          ))}
        </div>
      </div>
      {article && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: isMobile ? 12 : "40px 20px", overflowY: "auto", opacity: visible ? 1 : 0, transition: "opacity 0.2s" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#111008", border: "1px solid #2a2318", borderRadius: 16, maxWidth: 720, width: "100%", transform: visible ? "translateY(0)" : "translateY(20px)", transition: "transform 0.25s", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
            <div style={{ padding: isMobile ? "24px 18px 18px" : "30px 32px 22px", borderBottom: "1px solid #1a1510", display: "flex", justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: isMobile ? 36 : 42, marginBottom: 12 }}>{article.emoji}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{catLabels[article.category]} · {article.readTime} {lang === "ko" ? "읽기" : "read"}</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 27, color: "#f5f0e8", fontWeight: 500, margin: "0 0 6px", lineHeight: 1.3 }}>{article.title}</h2>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b", margin: 0 }}>{article.subtitle}</p>
              </div>
              <button onClick={closeModal} style={{ background: "#1a1510", border: "1px solid #2a2318", color: "#8a7d6b", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ padding: isMobile ? "20px 18px" : "28px 32px", maxHeight: "58vh", overflowY: "auto" }}>
              {article.sections.map((s, si) => (
                <div key={si} style={{ marginBottom: 26 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 3, height: 18, background: "#c5a572", borderRadius: 2, flexShrink: 0 }} />
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 15, color: "#f5f0e8", fontWeight: 600, margin: 0 }}>{s.heading}</h3>
                  </div>
                  {s.body && <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 14, color: "#8a7d6b", lineHeight: 1.75, margin: "0 0 8px", paddingLeft: 13 }}>{s.body}</p>}
                  {s.bullets && <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", paddingLeft: 13 }}>{s.bullets.map((b, bi) => <li key={bi} style={{ display: "flex", gap: 10, fontSize: isMobile ? 12 : 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", lineHeight: 1.65, marginBottom: 6 }}><span style={{ color: "#c5a572", flexShrink: 0 }}>▸</span><span>{b}</span></li>)}</ul>}
                  {s.highlight && <div style={{ marginTop: 12, background: "rgba(197,165,114,0.06)", border: "1px solid rgba(197,165,114,0.18)", borderRadius: 8, padding: "12px 14px", marginLeft: 13 }}><p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 13, color: "#c5a572", margin: 0, lineHeight: 1.6 }}>💡 {s.highlight}</p></div>}
                </div>
              ))}
            </div>
            <div style={{ padding: isMobile ? "16px 18px 20px" : "18px 32px 26px", borderTop: "1px solid #1a1510", display: "flex", gap: 10, flexDirection: isMobile ? "column" : "row" }}>
              <button onClick={() => { closeModal(); navigate("shop"); }} style={{ flex: 1, background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "12px", fontSize: 14, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 8, cursor: "pointer" }}>{lang === "ko" ? "지금 구매하기" : "Shop Now"}</button>
              <button onClick={closeModal} style={{ flex: 1, background: "transparent", color: "#8a7d6b", border: "1px solid #2a2318", padding: "12px", fontSize: 14, fontFamily: "'Outfit',sans-serif", borderRadius: 8, cursor: "pointer" }}>{lang === "ko" ? "닫기" : "Close"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




// ═══════════════════════════════════════════════════════════════════════════════
// AGP MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function AGP({ lang, navigate }) {
  const isMobile = useIsMobile();
  const ko = lang === "ko";

  const h2 = (ko_text, en_text) => (
    <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : 38, color: T.textPrimary, fontWeight: 300, margin: "0 0 16px" }}>
      {ko ? ko_text : en_text}
    </h2>
  );

  const lead = (ko_text, en_text) => (
    <p style={{ fontSize: isMobile ? 13 : 15, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.8, margin: "0 0 24px", maxWidth: 720 }}>
      {ko ? ko_text : en_text}
    </p>
  );

  const section = (content) => (
    <div style={{ padding: isMobile ? "48px 20px" : "72px 80px", borderBottom: `1px solid ${T.border}` }}>
      {content}
    </div>
  );

  const faqItems = [
    {
      q: ko ? "Q1. AGP 그램은 실제 금입니까? / Are AGP grams real physical gold?" : "Q1. Are AGP grams real physical gold?",
      a: ko ? "네. 모든 AGP 그램은 Malca-Amit 싱가포르 금고에 보관된 실물 금·은·백금으로 100% 백업됩니다. 매일 공개 감사 리포트로 백업 비율을 확인하실 수 있으며, Bureau Veritas가 연 2회 실물 검증을 수행합니다." : "Yes. Every AGP gram is 100% backed by physical gold, silver, or platinum held at Malca-Amit Singapore. You can verify the backing ratio in the daily public audit report, and Bureau Veritas performs physical verification twice per year."
    },
    {
      q: ko ? "Q2. 최소 얼마부터 시작할 수 있나요? / What is the minimum starting amount?" : "Q2. What is the minimum starting amount?",
      a: ko ? "단일 입금 최소는 1g(현재 시세로 약 USD 153 / KRW 210,000 수준)입니다. 월간 자동이체 최소는 KRW 100,000부터 설정 가능합니다." : "The minimum single purchase is 1 gram (~USD 153 / KRW 210,000 at current spot). The minimum monthly auto-debit is KRW 100,000."
    },
    {
      q: ko ? "Q3. 토스뱅크 자동이체 설정은 어떻게 하나요? / How do I set up Toss Bank auto-debit?" : "Q3. How do I set up Toss Bank auto-debit?",
      a: ko ? "Aurum 계정 개설 후 대시보드의 '자동이체 설정'에서 토스뱅크 계정 연결. 이체 금액, 주기(주간·월간), 시작일 선택 후 저장. 초기 버전은 수동 이체 방식이며, API 연동은 향후 업데이트됩니다." : "After Aurum account setup, go to Dashboard → Auto-Debit Setup and connect your Toss Bank account. Choose amount, frequency (weekly/monthly), and start date. Initial version uses manual transfer; API integration is a planned upgrade."
    },
    {
      q: ko ? "Q4. 언제든 실물 바로 전환할 수 있나요? / Can I convert to physical bar anytime?" : "Q4. Can I convert to physical bar anytime?",
      a: ko ? "전환 기준점(금 100g·1kg, 은 1kg, 백금 100g)에 도달하면 언제든 무료로 전환 가능합니다. 전환 요청 후 공급업체 체결 및 배정까지 5~10영업일이 소요됩니다." : "Once you hit the conversion threshold (100g or 1,000g gold, 1,000g silver, 100g platinum), you may convert anytime for free. Conversion takes 5–10 business days for supplier fulfillment and allocation."
    },
    {
      q: ko ? "Q5. 전환할 때 추가 비용이 있나요? / Are there conversion fees?" : "Q5. Are there conversion fees?",
      a: ko ? "전환 수수료는 없습니다. 전환된 실물 바는 배분 보관 요율(0.50~0.80%/년)이 적용됩니다. 한국 배송을 선택할 경우 13% 관세·VAT와 운송·보험료가 별도 부과됩니다." : "No conversion fees. Converted bars move to allocated storage rate (0.50–0.80%/yr). If you choose to ship to Korea, 13% import duties and shipping/insurance fees apply separately."
    },
    {
      q: ko ? "Q6. 세금은 어떻게 처리되나요? / How are taxes handled?" : "Q6. How are taxes handled?",
      a: ko ? "싱가포르 보관 중에는 한국 세금이 발생하지 않습니다. 매도 시 발생한 차익은 기타소득으로 과세될 수 있으며, 실물을 한국으로 반입할 경우 13% 관세·VAT가 부과됩니다. 해외금융계좌 잔액이 연중 5억원을 초과한 경우 신고 의무. 본 내용은 법률·세무 조언이 아니므로 반드시 공인 세무사와 상담하세요." : "No Korean taxes apply while stored in Singapore. Gains upon sale may be taxable as other income. Importing physical into Korea triggers 13% duties. Offshore balances exceeding KRW 500M aggregate in a year trigger reporting. This is not tax advice — consult a certified Korean tax professional."
    },
    {
      q: ko ? "Q7. Aurum 파산 시 내 AGP 그램은 어떻게 되나요? / What if Aurum goes bankrupt?" : "Q7. What if Aurum goes bankrupt?",
      a: ko ? "AGP 그램을 뒷받침하는 실물 금속은 Malca-Amit에 AGP 전용 풀로 보관되며 Aurum 대차대조표와 분리되어 있습니다. Aurum 파산 시 수탁자인 Malca-Amit이 AGP 그램 비율에 따라 고객에게 직접 반환합니다." : "The physical metal backing AGP grams is held in a dedicated AGP pool at Malca-Amit, segregated from Aurum's balance sheet. In Aurum's insolvency, Malca-Amit returns metal to customers directly, proportional to their AGP gram holdings."
    },
    {
      q: ko ? "Q8. NH투자증권 + 토스뱅크 금 적립과 뭐가 다른가요? / How is this different from NH Investment + Toss Bank gold savings?" : "Q8. How is this different from NH Investment + Toss Bank gold savings?",
      a: ko ? "NH + 토스는 KRX 금시장에서 운용되는 한국 국내 서비스입니다. 실물 인출 시 10% VAT가 발생하고, KRX 가격(김치 프리미엄 포함)으로 거래됩니다. AGP는 싱가포르 자유무역지대에 보관되는 해외 실물이며, 국제 현물가로 거래되고, 전환 시 한국 VAT가 발생하지 않습니다(실물을 한국으로 반입하지 않는 한). 두 상품은 서로 다른 카테고리입니다 — 국내 페이퍼·한국 과세 vs. 해외 실물·세제 최적화." : "NH + Toss is a domestic Korean service operating on the KRX gold market. Physical withdrawal triggers 10% Korean VAT, and pricing is in KRX (which includes kimchi premium). AGP is offshore physical stored in Singapore's Free Trade Zone, priced at international spot, with no Korean VAT on conversion (as long as you don't ship into Korea). The two products are different categories — domestic paper with Korean taxation vs. offshore physical with tax optimization."
    },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <div style={{ padding: isMobile ? "64px 20px 48px" : "96px 80px 72px", textAlign: "center", borderBottom: `1px solid ${T.border}` }}>
        <SectionLabel>{ko ? "아름 골드 플랜 (AGP)" : "Aurum Gold Plan (AGP)"}</SectionLabel>
        <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 30 : 52, color: T.textPrimary, fontWeight: 300, margin: "0 0 14px", maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          {ko ? "월 10만원부터 시작하는 싱가포르 실물 금 저축" : "Save in physical gold, stored in Singapore, starting from KRW 100,000/month."}
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: T.textSecondary, fontFamily: T.sans, maxWidth: 680, margin: "0 auto 20px", lineHeight: 1.75 }}>
          {ko ? "그램 단위로 실물 금을 꾸준히 적립하세요. Malca-Amit 싱가포르 금고에 100% 실물 백업. 언제든 완전한 바로 전환 가능. 싱가포르 보관 중에는 한국 VAT 없음." : "Accumulate real physical gold by the gram. 100% physically backed at Malca-Amit Singapore. Convert to a full bar anytime. No Korean VAT while stored offshore."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 32 }}>
          {[
            { icon: "💯", label: ko ? "100% 실물 백업, 매일 공개 감사 / 100% physical backing, audited daily" : "100% physical backing, audited daily" },
            { icon: "🥇", label: ko ? "100g 또는 1kg 도달 시 PAMP·Heraeus 바로 무료 전환 / Free conversion to PAMP or Heraeus bars at 100g or 1kg" : "Free conversion to PAMP or Heraeus bars at 100g or 1kg" },
            { icon: "🇰🇷", label: ko ? "한국어 서비스 + 토스뱅크 자동이체 지원 / Korean-language service, Toss Bank auto-debit" : "Korean-language service, Toss Bank auto-debit" },
          ].map((chip, i) => (
            <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, maxWidth: isMobile ? "100%" : 340 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{chip.icon}</span>
              <span style={{ fontSize: 11, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.5 }}>{chip.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "15px 36px", fontSize: 15, fontWeight: 700, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}>🚀 {ko ? "AGP 가입하기 / Start AGP" : "Start AGP"}</button>
          {navigate && (
            <button onClick={() => navigate("agp-report")} style={{ background: "transparent", color: T.accent, border: `1px solid ${T.accent}`, padding: "15px 36px", fontSize: 15, fontWeight: 600, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}>📊 {ko ? "오늘의 백업 리포트 / Today's Backing Report" : "Today's Backing Report"}</button>
          )}
        </div>
      </div>
      {section(<><br/>{h2("AGP는 이렇게 작동합니다", "How Aurum Gold Plan Works")}<div style={{ display: "flex", flexDirection: "column", gap: 24 }}><StepCard num={1} icon="✍️" title={ko ? "가입 / Enroll" : "Enroll"} body={ko ? "10분 내 온라인 가입 및 한국 표준 KYC 완료" : "10-minute online signup with Korean-standard KYC"} /><StepCard num={2} icon="💰" title={ko ? "입금 / Fund" : "Fund"} body={ko ? "토스뱅크·한국 은행에서 일회 또는 월간 자동이체" : "One-time or recurring auto-debit from Toss Bank or any Korean bank"} /><StepCard num={3} icon="⚖️" title={ko ? "그램 적립 / Accumulate" : "Accumulate"} body={ko ? "입금액이 실시간 현물가 + 2.0% 프리미엄으로 AGP 그램으로 전환" : "Each deposit converts to AGP grams at live spot plus 2.0% premium"} /><StepCard num={4} icon="📊" title={ko ? "관리 / Monitor" : "Monitor"} body={ko ? "대시보드에서 그램, KRW 가치, 손익, 보관료, 전환 기준 진행률 확인" : "Dashboard shows grams, KRW value, P&L, storage fees, and progress to conversion threshold"} /><StepCard num={5} icon="🥇" title={ko ? "전환 / Convert" : "Convert"} body={ko ? "100g(또는 1kg 기준) 도달 시 실물 바로 무료 전환 또는 언제든 KRW 매도" : "At 100g (or 1kg for flagship), convert to a physical bar for free — or sell back for KRW anytime"} /></div></>)}
      {section(<><br/>{h2("AGP vs 국내 금 투자 상품", "AGP vs Other Korean Gold Savings Options")}{lead("한국 은행과 증권사가 금 저축 상품을 출시하고 있는 것은 반가운 변화입니다. 하지만 모든 국내 상품은 한 가지 공통된 한계를 가지고 있습니다. 금이 한국 안에 있다는 것. AGP는 싱가포르 자유무역지대에 보관되는 진짜 실물 금, 국제 현물가 기준, 원하는 때 PAMP·Heraeus 바로 무료 전환 가능한 상품입니다.", "Korean banks and brokerages now offer gold savings products. But every domestic option has the same limitation: the gold sits in Korea. That means 10% VAT on withdrawal and kimchi-premium pricing. AGP is the offshore counterpart — real physical gold in Singapore's Free Trade Zone, priced at international spot.")}<div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}><thead><tr style={{ background: "#0d0b08" }}>{[ko ? "특징" : "Feature", "Aurum AGP", "NH + Toss", "Kbank / KRX", ko ? "국내 은행 적금" : "Korean Bank Passbook"].map((h, i) => <th key={i} style={{ padding: "12px 14px", textAlign: "left", color: i === 1 ? T.accent : T.textSecondary, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: T.sans, border: `1px solid ${T.border}` }}>{h}</th>)}</tr></thead><tbody>{[[ko?"실물 백업":"Physical backing",ko?"✅ 100% 완전 배분":"✅ 100% allocated",ko?"⚠️ KRX 수탁":"⚠️ KRX custody",ko?"⚠️ KRX 수탁":"⚠️ KRX custody",ko?"❌ 은행 장부상":"❌ Bank paper"],[ko?"관할":"Jurisdiction","🇸🇬 Singapore FTZ","🇰🇷 Korea","🇰🇷 Korea","🇰🇷 Korea"],[ko?"실물 전환":"Convert to bar",ko?"✅ 100g/1kg 무료":"✅ Free @ 100g/1kg",ko?"⚠️ 10% VAT 발생":"⚠️ 10% VAT triggered",ko?"⚠️ 10% VAT 발생":"⚠️ 10% VAT triggered",ko?"❌ 불가":"❌ Not available"],[ko?"보관료":"Storage fee","0.30%/yr","~0%/yr (paper)","~0%/yr (paper)",ko?"은행 수수료":"Bank fees"]].map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j} style={{ padding: "11px 14px", fontFamily: T.sans, fontSize: 12, color: j===1?T.textPrimary:T.textSecondary, border: `1px solid ${T.border}`, background: j===1?"rgba(197,165,114,0.04)":T.panel, fontWeight: j===1?500:400 }}>{cell}</td>)}</tr>)}</tbody></table></div></>)}
      {section(<><br/>{h2("민준씨의 금 저축 여정", "Min-jun's Gold Savings Journey")}<div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: isMobile?"20px":"28px 32px" }}>{[{milestone:ko?"Month 1":"Month 1",text:ko?"AGP 계정 개설, 토스뱅크 자동이체 50만원/월 설정":"Opens AGP account, sets Toss Bank auto-debit at KRW 500,000/month"},{milestone:ko?"12개월":"Month 12",text:ko?"약 28g 적립 완료. 첫 연간 스테이트먼트 수신":"~28g accumulated. Receives first annual statement"},{milestone:ko?"4년":"Year 4",text:ko?"약 114g 적립, 100g 전환 기준점 돌파":"~114g accumulated — crosses 100g conversion threshold"},{milestone:ko?"4년 마일스톤":"Year 4 milestone",text:ko?"100g를 실물 PAMP 100g 바로 전환(무료). 남은 14g는 AGP 계속 적립":"Converts 100g to a real PAMP 100g bar for free. 14g stays in AGP.",highlight:true},{milestone:ko?"10년":"Year 10",text:ko?"약 280g 실물 바 + 약 60g AGP 그램 = 총 ~340g 실물 금 보유":"~280g in allocated bars + ~60g in AGP = ~340g total gold ownership"}].map((item,i)=><div key={i} style={{ display:"flex",gap:16,padding:"14px 0",borderBottom:i<4?`1px solid ${T.border}`:"none" }}><div style={{ minWidth:isMobile?60:100,flexShrink:0 }}><span style={{ fontFamily:T.mono,fontSize:11,color:T.accent,fontWeight:600 }}>{item.milestone}</span></div><p style={{ margin:0,fontSize:13,color:item.highlight?T.textPrimary:T.textSecondary,fontFamily:T.sans,lineHeight:1.6,fontWeight:item.highlight?500:400 }}>{item.text}</p></div>)}</div></>)}
      {section(<><br/>{h2("가격과 수수료", "Pricing & Fees")}<div style={{ overflowX:"auto",marginBottom:28 }}><table style={{ width:"100%",borderCollapse:"collapse",minWidth:500 }}><thead><tr style={{ background:"#0d0b08" }}>{[ko?"상품":"Product",ko?"최소":"Minimum",ko?"프리미엄":"Premium over spot",ko?"보관료":"Storage fee"].map((h,i)=><th key={i} style={{ padding:"12px 16px",textAlign:"left",color:T.textSecondary,fontSize:10,letterSpacing:1.5,textTransform:"uppercase",fontFamily:T.sans,border:`1px solid ${T.border}` }}>{h}</th>)}</tr></thead><tbody>{[[ko?"AGP 금 그램":"AGP Gold grams","1g","2.0%","0.30%/yr"],[ko?"AGP 은 그램":"AGP Silver grams","10g","3.5%","0.50%/yr"],[ko?"AGP 백금 그램":"AGP Platinum grams","1g","2.5%","0.40%/yr"]].map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j} style={{ padding:"12px 16px",fontFamily:j===2||j===3?T.mono:T.sans,fontSize:13,color:j===2||j===3?T.accent:T.textPrimary,border:`1px solid ${T.border}`,background:T.panel }}>{cell}</td>)}</tr>)}</tbody></table></div><div style={{ background:T.panel,border:`1px solid ${T.border}`,borderRadius:10,padding:"20px 22px" }}><div style={{ fontFamily:T.sans,fontSize:14,color:T.accent,fontWeight:600,marginBottom:12 }}>{ko?"전환 기준점 (수수료 없음)":"Conversion Thresholds (free)"}</div>{[[ko?"금":"Gold",ko?"100g → PAMP/Heraeus 100g 바; 1,000g → 1kg 바":"100g → PAMP/Heraeus 100g bar; 1,000g → 1kg bar"],[ko?"은":"Silver",ko?"1,000g → 1kg 바":"1,000g → 1kg bar"],[ko?"백금":"Platinum",ko?"100g → 100g 바":"100g → 100g bar"]].map(([metal,rule],i)=><div key={i} style={{ display:"flex",gap:14,padding:"8px 0",borderBottom:i<2?`1px solid ${T.border}`:"none" }}><span style={{ fontFamily:T.sans,fontSize:13,color:T.accent,fontWeight:600,minWidth:70,flexShrink:0 }}>{metal}</span><span style={{ fontFamily:T.sans,fontSize:13,color:T.textSecondary }}>{rule}</span></div>)}</div></>)}
      {section(<><br/>{h2("자주 묻는 질문", "Frequently Asked Questions")}<FAQAccordion items={faqItems} /></>)}
      <div style={{ padding:isMobile?"48px 20px":"72px 80px",textAlign:"center",background:"linear-gradient(135deg,rgba(197,165,114,0.06),rgba(197,165,114,0.02))" }}>
        <h2 style={{ fontFamily:T.serif,fontSize:isMobile?26:38,color:T.textPrimary,fontWeight:300,margin:"0 0 16px" }}>{ko?"10만원으로 오늘 실물 금 저축을 시작하세요.":"Start saving in physical gold today — from just KRW 100,000."}</h2>
        <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginTop:28 }}>
          <button style={{ background:"linear-gradient(135deg,#c5a572,#8a6914)",color:"#0a0a0a",border:"none",padding:"15px 36px",fontSize:15,fontWeight:700,borderRadius:7,cursor:"pointer",fontFamily:T.sans }}>🚀 {ko?"AGP 가입하기":"Start AGP"}</button>
          {navigate&&<button onClick={()=>navigate("learn")} style={{ background:"transparent",color:T.accent,border:`1px solid ${T.accent}`,padding:"15px 36px",fontSize:15,fontWeight:600,borderRadius:7,cursor:"pointer",fontFamily:T.sans }}>📖 {ko?"투자 가이드 보기":"Read investment guide"}</button>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// AGP BACKING REPORT DASHBOARD
// ═══════════════════════════════════════════════════
function AGPBackingReport({ lang, navigate }) {
  const isMobile = useIsMobile();
  const ko = lang === "ko";
  const reportData = {
    date: "2026-04-13", time: "00:01 SGT",
    gold: { outstanding: 12847.3, physical: 12994.1, ratio: 101.14 },
    silver: { outstanding: 184200, physical: 186500, ratio: 101.25 },
    platinum: { outstanding: 3420.5, physical: 3480.0, ratio: 101.74 },
    lastAudit: "2026-02-14", auditor: "Bureau Veritas (LBMA Approved)",
    custodian: "Malca-Amit Singapore FTZ", nextAudit: "2026-08-14",
  };
  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <div style={{ padding: isMobile?"24px 20px 16px":"32px 60px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:10, color:T.accent, letterSpacing:3, textTransform:"uppercase", fontFamily:T.sans, marginBottom:5 }}>AURUM GOLD PLAN</div>
          <h1 style={{ fontFamily:T.serif, fontSize:isMobile?22:28, color:T.textPrimary, fontWeight:300, margin:0 }}>{ko?"일일 물리적 백업 리포트":"Daily Physical Backing Report"}</h1>
        </div>
        {navigate&&<button onClick={()=>navigate("agp")} style={{ background:"none", border:"none", color:T.textSecondary, fontSize:12, cursor:"pointer", fontFamily:T.sans }}>← {ko?"AGP로 돌아가기":"Back to AGP"}</button>}
      </div>
      <div style={{ padding: isMobile?"28px 20px":"40px 60px" }}>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:28 }}>
          {[{label:ko?"리포트 날짜":"Report Date",value:reportData.date},{label:ko?"업데이트 시각":"Updated At",value:reportData.time},{label:ko?"수탁자":"Custodian",value:reportData.custodian},{label:ko?"최신 감사":"Last Audit",value:reportData.lastAudit}].map((item,i)=>(
            <div key={i} style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:8, padding:"12px 18px", minWidth:160 }}>
              <div style={{ fontSize:10, color:T.textSecondary, fontFamily:T.sans, letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>{item.label}</div>
              <div style={{ fontFamily:T.mono, fontSize:13, color:T.textPrimary }}>{item.value}</div>
            </div>
          ))}
        </div>
        {[{metal:ko?"금 / Gold":"Gold",icon:"🥇",data:reportData.gold},{metal:ko?"은 / Silver":"Silver",icon:"🥈",data:reportData.silver},{metal:ko?"백금 / Platinum":"Platinum",icon:"🔵",data:reportData.platinum}].map(({metal,icon,data},i)=>(
          <div key={i} style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:12, padding:"20px 24px", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:24 }}>{icon}</span>
                <span style={{ fontFamily:T.serif, fontSize:18, color:T.textPrimary, fontWeight:400 }}>{metal}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:T.mono, fontSize:20, color:"#4ade80", fontWeight:700 }}>{data.ratio.toFixed(2)}%</div>
                <div style={{ fontSize:10, color:T.textSecondary, fontFamily:T.sans }}>{ko?"백업 비율":"Backing ratio"}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[{label:ko?"발행된 AGP 그램":"AGP grams outstanding",value:`${data.outstanding.toLocaleString()}g`,color:T.textPrimary},{label:ko?"실물 보유량 (Malca-Amit)":"Physical held (Malca-Amit)",value:`${data.physical.toLocaleString()}g`,color:T.accent}].map(({label,value,color},j)=>(
                <div key={j} style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:T.textSecondary, fontFamily:T.sans, marginBottom:5 }}>{label}</div>
                  <div style={{ fontFamily:T.mono, fontSize:15, color, fontWeight:600 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14 }}>
              <div style={{ height:6, borderRadius:3, background:"#1a1510", overflow:"hidden" }}>
                <div style={{ width:"100%", background:"linear-gradient(90deg,#4ade80,#22c55e)", height:"100%", borderRadius:3 }} />
              </div>
              <div style={{ fontSize:10, color:T.textSecondary, fontFamily:T.sans, marginTop:5 }}>{ko?"100% 이상 유지 중":"Maintained above 100%"}</div>
            </div>
          </div>
        ))}
        <div style={{ background:"rgba(197,165,114,0.05)", border:`1px solid rgba(197,165,114,0.2)`, borderRadius:10, padding:"18px 22px", marginTop:24 }}>
          <div style={{ fontFamily:T.sans, fontSize:13, color:T.accent, fontWeight:600, marginBottom:10 }}>{ko?"감사 정보":"Audit Information"}</div>
          {[[ko?"감사기관":"Auditor",reportData.auditor],[ko?"최신 감사 일자":"Last audit date",reportData.lastAudit],[ko?"다음 예정 감사":"Next scheduled audit",reportData.nextAudit]].map(([label,value],i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, color:T.textSecondary, fontFamily:T.sans }}>{label}</span>
              <span style={{ fontFamily:T.mono, fontSize:12, color:T.textPrimary }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, padding:"14px 18px", background:T.panel, border:`1px solid ${T.border}`, borderRadius:8 }}>
          <p style={{ margin:0, fontSize:11, color:T.textSecondary, fontFamily:T.sans, lineHeight:1.7 }}>
            {ko?"본 리포트는 매일 SGT 00:01 자동 생성됩니다. V1 정적 데이터 — Phase 3에서 실시간 API 연동 예정.": "This report is auto-generated daily at 00:01 SGT. V1 static data — live API integration scheduled for Phase 3."}
          </p>
        </div>
      </div>
    </div>
  );
}


export { OrderHistoryPage, AccountPage, KYCFlowPage, WhyGold, Learn, Storage, AGP, AGPBackingReport };
