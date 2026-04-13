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
// STORAGE
// ═══════════════════════════════════════════════════════════════════════════════
function Storage({ lang }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
        <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "싱가포르 보관" : "Singapore Storage"}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 28 : 42, color: "#f5f0e8", fontWeight: 300, margin: "0 0 12px" }}>{lang === "ko" ? "세계 최고 수준의 볼트 보관" : "World-Class Vault Storage"}</h2>
        <p style={{ fontSize: isMobile ? 13 : 15, color: "#8a7d6b", maxWidth: 600, margin: "0 auto", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "Malca-Amit 싱가포르 FTZ 볼트에서 완전 배분, 완전 보험 보관." : "Fully allocated, insured storage at Malca-Amit Singapore FTZ."}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: isMobile ? 10 : 24, marginBottom: isMobile ? 28 : 48 }}>
        {[
          { icon: "🔐", ko: "완전 배분", en: "Allocated", desc: lang === "ko" ? "고유 일련번호 실물 배분." : "Specific serial-numbered allocation." },
          { icon: "🛡️", ko: "완전 보험", en: "Insured", desc: lang === "ko" ? "Lloyd's of London 100% 보험." : "100% Lloyd's of London coverage." },
          { icon: "📋", ko: "정기 감사", en: "Audited", desc: lang === "ko" ? "독립 제3자 감사." : "Independent third-party audits." },
          { icon: "📸", ko: "사진 증명", en: "Photos", desc: lang === "ko" ? "고해상도 사진 및 인증서." : "HD photos and certificates." },
          { icon: "🌐", ko: "FTZ 면세", en: "Tax-Free", desc: lang === "ko" ? "GST 면제 및 한국 VAT 회피." : "No GST, avoids Korean VAT." },
          { icon: "⚡", ko: "즉시 유동화", en: "Liquid", desc: lang === "ko" ? "원클릭 매도, 원화 수령." : "One-click sell, receive KRW." },
        ].map((x, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 14 : 28 }}>
            <div style={{ fontSize: isMobile ? 24 : 28, marginBottom: 8 }}>{x.icon}</div>
            <h3 style={{ fontSize: isMobile ? 13 : 15, color: "#f5f0e8", margin: "0 0 5px", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? x.ko : x.en}</h3>
            <p style={{ fontSize: isMobile ? 11 : 12, color: "#8a7d6b", lineHeight: 1.6, margin: 0, fontFamily: "'Outfit',sans-serif" }}>{x.desc}</p>
          </div>
        ))}
      </div>
      {/* Malca-Amit description */}
      <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 20 : 36, marginBottom: isMobile ? 20 : 32 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#c5a572", fontWeight: 400, margin: "0 0 16px" }}>Malca-Amit</h3>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b", lineHeight: 1.75, marginBottom: 16 }}>
          {lang === "ko" ? "Malca-Amit은 1963년 설립된 세계 최고 수준의 귀금속·다이아몬드 보관 및 운송 전문 기업입니다. 전 세계 주요 도시에 고급 보안 금고를 운영하며, 싱가포르 창이 공항 FTZ 시설은 아시아 최대 귀금속 보관 시설 중 하나입니다." : "Founded in 1963, Malca-Amit is a world-leading specialist in precious metals and diamond storage and transport. Operating premium security vaults in major global cities, its Singapore Changi Airport FTZ facility is among Asia's largest precious metals vaulting facilities."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {[lang === "ko" ? "24시간 무장 경비 및 다중 생체인식" : "24/7 armed security & biometric access", lang === "ko" ? "Lloyd's of London 완전 보험" : "Full Lloyd's of London insurance", lang === "ko" ? "ISO 9001:2015 인증" : "ISO 9001:2015 certified", lang === "ko" ? "고객 자산 완전 분리 보관" : "Customer assets fully segregated"].map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: "#c5a572", flexShrink: 0, marginTop: 1 }}>▸</span>
              <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: "rgba(197,165,114,0.06)", border: "1px solid rgba(197,165,114,0.2)", borderRadius: 8, padding: "12px 16px" }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#c5a572", margin: 0, lineHeight: 1.6 }}>💡 {lang === "ko" ? "고객 자산은 Aurum Korea의 재무 상태와 완전히 분리됩니다. Aurum Korea가 파산하더라도 고객 금은 보호됩니다." : "Customer assets are fully segregated from Aurum Korea. Even in the event of Aurum Korea insolvency, your gold is protected."}</p>
        </div>
      </div>
      {/* Fee table */}
      <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 18 : 36, overflowX: "auto" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#c5a572", fontWeight: 400, margin: "0 0 20px" }}>{lang === "ko" ? "보관 수수료" : "Storage Fees"}</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 360 }}>
          <thead><tr style={{ borderBottom: "1px solid #2a2318" }}>{[lang === "ko" ? "보관 가치" : "Value", lang === "ko" ? "연간" : "Annual", lang === "ko" ? "최소" : "Minimum"].map((h, i) => <th key={i} style={{ textAlign: "left", padding: "10px 0", color: "#8a7d6b", fontSize: 11, fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>)}</tr></thead>
          <tbody>{[["< $50,000", "0.80%", "$12/mo"], ["$50,000 – $250,000", "0.65%", lang === "ko" ? "면제" : "Waived"], ["> $250,000", "0.50%", lang === "ko" ? "면제" : "Waived"]].map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #1a1510" }}>
              <td style={{ padding: "12px 0", color: "#f5f0e8", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>{row[0]}</td>
              <td style={{ padding: "12px 0", color: "#c5a572", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{row[1]}</td>
              <td style={{ padding: "12px 0", color: "#8a7d6b", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>{row[2]}</td>
            </tr>
          ))}</tbody>
        </table>
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



export { OrderHistoryPage, AccountPage, KYCFlowPage, WhyGold, Learn };
