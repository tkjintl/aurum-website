import { useState, useRef, useEffect } from "react";
import { useIsMobile, useInView } from "./lib.jsx";

// ═══════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════
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
// MAIN STORAGE PAGE
// ═══════════════════════════════════════════════════
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

  // ── FAQ DATA ──────────────────────────────────
  const faqItems = [
    {
      q: ko ? "Q1. 최소 구매 금액은? / What is the minimum purchase?" : "Q1. What is the minimum purchase?",
      a: ko
        ? "일회성 실물 바 구매는 최소 1온스(약 USD 3,100~3,500) 수준부터 시작합니다. 더 작은 단위로 시작하고 싶다면 Aurum Gold Plan(AGP)을 통해 월 KRW 100,000(약 USD 73)부터 1g 단위로 저축할 수 있습니다."
        : "One-off bar purchases start at roughly 1 oz (USD 3,100–3,500). If you want to begin smaller, the Aurum Gold Plan (AGP) lets you save in 1-gram increments from KRW 100,000 (~USD 73) per month."
    },
    {
      q: ko ? "Q2. 카드로 결제 가능한가요? / Can I pay with a Korean credit card?" : "Q2. Can I pay with a Korean credit card?",
      a: ko
        ? "네. 토스페이를 통해 신용카드 또는 체크카드 결제 가능합니다. 카드 결제 시 프리미엄 5.5%(토스 수수료 포함)이며, 전신환 결제 시 2.5%, 암호화폐 결제 시 2.0%입니다."
        : "Yes. You can pay via Toss Pay using a Korean credit or debit card. Card premium is 5.5% (includes Toss processing); wire premium is 2.5%; crypto premium is 2.0%."
    },
    {
      q: ko ? "Q3. 한국으로 금을 가져올 때 세금은? / What tax applies when bringing gold to Korea?" : "Q3. What tax applies when bringing gold to Korea?",
      a: ko
        ? "한국 수입 시 관세 3%와 부가가치세 10%, 합계 약 13%가 금속 가액에 부과됩니다. 금을 싱가포르에 계속 보관하는 동안은 한국 세금이 발생하지 않습니다. 개별 상황은 공인 세무사와 상담하세요."
        : "Importing into Korea triggers 3% customs + 10% VAT on metal value, totaling ~13%. No Korean taxes apply while metal remains in Singapore. Consult a certified Korean tax advisor for your specific situation."
    },
    {
      q: ko ? "Q4. Aurum이 망하면 내 금은? / What happens to my gold if Aurum goes bankrupt?" : "Q4. What happens to my gold if Aurum goes bankrupt?",
      a: ko
        ? "귀하의 금은 Aurum 명의가 아닌 귀하 명의로 Malca-Amit 금고에 배분·보관됩니다. Aurum 재무 상태와 완전히 분리되어 있으며, Aurum이 파산하더라도 수탁자인 Malca-Amit이 직접 귀하에게 반환합니다."
        : "Your gold is allocated in your name at Malca-Amit, not Aurum's. It is fully segregated from Aurum's balance sheet. In the event of Aurum's insolvency, Malca-Amit returns the metal directly to you."
    },
    {
      q: ko ? "Q5. 싱가포르 금고를 직접 방문할 수 있나요? / Can I visit the Singapore vault in person?" : "Q5. Can I visit the Singapore vault in person?",
      a: ko
        ? "가능합니다. 온라인으로 사전 예약하시면 본인 보유 자산을 직접 실사할 수 있습니다. 여권과 구매 증명서 지참이 필요하며, 현장 감사 수수료는 회당 SGD 500입니다."
        : "Yes. Book an online appointment and you can inspect your own holdings in person. Bring your passport and invoice. On-site audit fee is SGD 500 per visit."
    },
    {
      q: ko ? "Q6. 보관료는 어떻게 차감되나요? / How are storage fees deducted?" : "Q6. How are storage fees deducted?",
      a: ko
        ? "일일 보관료는 SGT 00:01 기준 현물가로 계산되며, 매년 3월 1일 또는 전액 매도·인출 시점에 일괄 청구됩니다. Aurum 계정 현금 잔액에서 자동 차감되거나 등록 카드로 청구됩니다."
        : "Daily storage is calculated at 00:01 SGT spot and billed once per year on 1 March, or when you fully sell/withdraw. Fees are auto-deducted from your Aurum cash balance or charged to your card on file."
    },
    {
      q: ko ? "Q7. 매도 시 원화 수취는 얼마나 걸리나요? / How long to receive KRW when selling?" : "Q7. How long to receive KRW when selling?",
      a: ko
        ? "온라인 매도 주문 체결 후 2영업일 이내에 연결된 한국 은행 계좌로 원화가 입금됩니다. USD, SGD 수취도 가능합니다."
        : "After executing an online sell order, KRW is credited to your linked Korean bank account within 2 business days. USD and SGD payouts are also available."
    },
    {
      q: ko ? "Q8. 해외금융계좌 신고 대상인가요? / Does this trigger Korean overseas financial account reporting?" : "Q8. Does this trigger Korean overseas financial account reporting?",
      a: ko
        ? "한국 거주자로서 연중 어느 하루라도 해외 금융계좌 잔액 합계가 5억 원을 초과하면 다음 해 6월 1일~30일 사이에 국세청에 신고해야 합니다. Aurum은 NTS 양식에 맞춘 연말 잔고 증명서를 제공합니다. 세무사 상담 권장."
        : "Korean residents with aggregate offshore financial account balances exceeding KRW 500M at any point in the year must report to the NTS between June 1–30 the following year. Aurum provides year-end statements in NTS-compliant format. Consult a tax advisor."
    },
    {
      q: ko ? "Q9. AGP와 실물 보관의 차이는? / AGP vs allocated bullion — what's the difference?" : "Q9. AGP vs allocated bullion — what's the difference?",
      a: ko
        ? "실물 보관은 구매 즉시 고유 일련번호를 가진 특정 바가 귀하에게 배정됩니다. AGP는 1g 단위로 적립하다가 누적 100g 또는 1kg에 도달하면 실물 PAMP·Heraeus 바로 무료 전환할 수 있는 저축 상품입니다. AGP도 100% 실물 금으로 백업되며 매일 보유량이 공개됩니다."
        : "Allocated storage assigns a specific serial-numbered bar to you at purchase. AGP is a savings product where you accumulate by the gram and, at 100g or 1kg threshold, convert to a real PAMP or Heraeus bar for free. AGP is also 100% physically backed with daily public backing reports."
    },
    {
      q: ko ? "Q10. 상속 시 처리는? / What happens in case of inheritance?" : "Q10. What happens in case of inheritance?",
      a: ko
        ? "싱가포르 법률에 따라 귀하의 법정 상속인에게 이전 가능합니다. 고객 대시보드에서 수익자(beneficiary)를 사전 등록할 수 있으며, 상세 프로세스는 계정 개설 시 안내됩니다. 한국 상속세 관련 사항은 별도 전문가 상담이 필요합니다."
        : "Under Singapore law, your holdings transfer to your legal heirs. You may pre-register a beneficiary in your customer dashboard. Details are provided at account opening. Korean estate tax implications should be discussed with a qualified professional."
    },
  ];

  // ── RENDER ────────────────────────────────────
  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* ── SECTION 1: HERO ── */}
      <div style={{ padding: isMobile ? "64px 20px 48px" : "96px 80px 72px", textAlign: "center", borderBottom: `1px solid ${T.border}` }}>
        <SectionLabel>{ko ? "싱가포르 보관" : "Singapore Storage"}</SectionLabel>
        <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 32 : 52, color: T.textPrimary, fontWeight: 300, margin: "0 0 14px" }}>
          {ko ? "세계 최고 수준의 금고 보관" : "World-Class Vault Storage"}
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: T.textSecondary, fontFamily: T.sans, maxWidth: 640, margin: "0 auto 20px", lineHeight: 1.75 }}>
          {ko
            ? "Malca-Amit 싱가포르 FTZ 금고에서 완전 배분, 완전 보험 실물 보관."
            : "Fully allocated, fully insured storage at the Malca-Amit Singapore Free Trade Zone vault."}
        </p>
        <p style={{ fontSize: isMobile ? 12 : 14, color: T.textSecondary, fontFamily: T.sans, maxWidth: 700, margin: "0 auto 36px", lineHeight: 1.75 }}>
          {ko
            ? "싱가포르 자유무역지대 내 Malca-Amit 금고. 한국 VAT·관세 면제, Lloyd's of London 보험 100% 보장, 고유 일련번호로 개별 배분 보관."
            : "Stored at Malca-Amit inside Singapore's Free Trade Zone. No Korean VAT or customs duties. 100% Lloyd's of London insurance. Allocated by unique serial number."}
        </p>
        {/* Trust chips */}
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

      {/* ── SECTION 2: YOU CONTROL YOUR BULLION ── */}
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
              { icon: "🚚", title: ko ? "실물 인출 / Physical Withdrawal" : "Physical Withdrawal", body: ko ? "한국 주소로 배송(관세+VAT 13% 부과) 또는 싱가포르 금고에서 예약 수령" : "Ship to your Korean address (13% duties apply) or pick up in person at the Singapore vault by appointment." },
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

      {/* ── SECTION 3: HOW STORAGE WORKS ── */}
      {section(
        <>
          {h2("보관 프로세스", "How Storage Works")}
          {lead(
            "주문 즉시 Malca-Amit 금고에 배정됩니다. 5단계, 5분 소요.",
            "Assigned to the Malca-Amit vault the moment you order. 5 steps, 5 minutes."
          )}
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
              {ko
                ? "Aurum은 재고를 보유하지 않습니다. 귀하의 바는 귀하에게만 배정되며, 풀링되지 않고, 대여되지 않습니다."
                : "Aurum holds no inventory. Your bar is specifically assigned to you — never pooled, never leased."}
            </p>
          </div>
        </>
      )}

      {/* ── SECTION 4: BENEFITS GRID (8 tiles) ── */}
      {section(
        <>
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
        </>
      )}

      {/* ── SECTION 5: LEGAL OWNERSHIP ── */}
      {section(
        <>
          {h2("소유권과 분리 보관 원칙", "Your Bullion Is Yours — Legally and Physically")}
          {[
            {
              title: ko ? "법적 소유권 / Legal Ownership" : "Legal Ownership",
              body: ko
                ? "배분된 순간부터 귀하의 금은 귀하의 명의로 등록되며, 법적 이름이 기재된 볼트 증명서가 발행됩니다. Aurum Korea Pte Ltd는 중개인 및 보관 조정자 역할을 수행할 뿐 귀하의 금속에 대한 소유자가 아닙니다. 귀하는 항상 완전한 법적 소유권을 보유합니다."
                : "From the moment of allocation your bullion is registered in your name, with a vault certificate issued under your legal name. Aurum Korea Pte Ltd acts as broker and storage coordinator — not as owner. You retain full legal title at all times."
            },
            {
              title: ko ? "Aurum 자산과 완전 분리 / Segregated From Aurum's Balance Sheet" : "Segregated From Aurum's Balance Sheet",
              body: ko
                ? "귀하의 금은 Aurum의 대차대조표에 포함되지 않습니다. Malca-Amit에서 귀하의 이름으로 분리된 서브 계정에 보관됩니다. 만에 하나 Aurum이 지급불능 상태에 빠지더라도, 귀하의 금은 회사 자산이 되지 않고 수탁자로부터 직접 귀하에게 반환됩니다."
                : "Your bullion is not on Aurum's balance sheet. It is held in a segregated sub-account under your name at Malca-Amit. If Aurum were to enter insolvency, your metal does not become a company asset — it is returned to you directly by the custodian."
            },
            {
              title: ko ? "Malca-Amit의 역할 / Malca-Amit as Independent Custodian" : "Malca-Amit as Independent Custodian",
              body: ko
                ? "Malca-Amit은 1963년 설립된 62년 역사의 귀금속 수탁 전문기업으로 싱가포르, 홍콩, 런던, 취리히, 뉴욕, 상하이에 금고를 운영합니다. 싱가포르 통화청(MAS) 규제를 받으며 ISO 9001:2015 인증을 보유합니다. 수탁자의 선관주의 의무는 금속 소유자인 귀하에게 있으며, Aurum에게 있지 않습니다."
                : "Malca-Amit is a 62-year-old precious metals custodian (founded 1963) operating vaults in Singapore, Hong Kong, London, Zurich, New York, and Shanghai. Regulated by the Monetary Authority of Singapore (MAS) and certified to ISO 9001:2015. Their fiduciary duty runs to the bullion owner — you — not to Aurum."
            },
          ].map((item, i) => (
            <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 22px", marginBottom: 14 }}>
              <div style={{ fontFamily: T.sans, fontSize: 14, color: T.accent, fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
              <p style={{ margin: 0, fontSize: 13, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.75 }}>{item.body}</p>
            </div>
          ))}
        </>
      )}

      {/* ── SECTION 6: 5 LAYERS OF AUDIT ── */}
      {section(
        <>
          {h2("5중 감사 체계", "5 Layers of Audit Verification")}
          {lead(
            "신뢰를 부탁드리지 않습니다. 다섯 가지 방법으로 증명합니다.",
            "We don't ask you to trust us. We prove it, five different ways."
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                num: "1", title: ko ? "제3자 감사 (Bureau Veritas) / Third-Party Audit" : "Third-Party Audit (Bureau Veritas)",
                bullets: ko
                  ? ["LBMA 승인 독립 감사기관", "연 2회 실물 카운트 및 중량 검증", "무작위 샘플 일련번호 대조", "고객 대시보드에서 감사 보고서 다운로드"]
                  : ["LBMA-approved independent auditor", "Bi-annual physical counts and weight verification", "Random-sample serial number matching", "Audit reports downloadable from the customer dashboard"]
              },
              {
                num: "2", title: ko ? "실시간 감사 리포트 / Live Audit Report" : "Live Audit Report",
                bullets: ko
                  ? ["전체 고객 자산 목록 실시간 공개 (익명 처리)", "고객은 본인 보유 내역이 실시간 목록에 포함되어 있는지 직접 확인 가능", "입고·출고 발생 시 즉시 업데이트"]
                  : ["Anonymized real-time vault inventory visible to all customers", "Customers verify their own holdings appear in the live list", "Updated in real time with every deposit and withdrawal"]
              },
              {
                num: "3", title: ko ? "고객 현장 감사 / Customer On-Site Audit" : "Customer On-Site Audit",
                bullets: ko
                  ? ["싱가포르 금고에서 본인 보유 자산 직접 실사 가능", "사전 예약 필수, 회당 SGD 500 수수료", "바 실물 확인 및 일련번호 대조 포함"]
                  : ["Physical on-site inspection at the Singapore vault", "Appointment required, SGD 500 fee per visit", "Hand inspection of bars matched to serial records"]
              },
              {
                num: "4", title: ko ? "내부 감사 / Internal Audit" : "Internal Audit",
                bullets: ko
                  ? ["운영팀이 월간 내부 정기 점검 수행", "Marsh·Lloyd's 보험 계약 의무사항", "7년간 기록 보관"]
                  : ["Monthly internal reconciliation by the operations team", "Required under the Marsh / Lloyd's insurance policy", "Documented and retained for 7 years"]
              },
              {
                num: "5", title: ko ? "재무 감사 / Financial Audit" : "Financial Audit",
                bullets: ko
                  ? ["Aurum Korea Pte Ltd는 싱가포르 회사법에 따라 매년 감사", "싱가포르 등록 회계법인 감사", "연차보고서 공개"]
                  : ["Aurum Korea Pte Ltd is audited annually under the Singapore Companies Act", "Audited by a licensed Singapore auditing firm", "Annual report published"]
              },
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
        </>
      )}

      {/* ── SECTION 7: TAKING PHYSICAL POSSESSION ── */}
      {section(
        <>
          {h2("실물 인출", "Taking Physical Possession")}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                icon: "🏛️",
                title: ko ? "싱가포르 현장 수령 / Vault Pickup" : "Vault Pickup",
                bullets: ko
                  ? ["싱가포르 Malca-Amit 금고에서 직접 수령", "온라인 예약 필수, 여권·구매 증명서 지참", "싱가포르 반출 VAT·관세 없음", "싱가포르 또는 동남아 방문객에게 적합"]
                  : ["Collect in person at the Malca-Amit Singapore vault", "Online appointment required with passport and invoice", "No VAT or export restriction from Singapore", "Ideal for customers traveling to Singapore or Southeast Asia"]
              },
              {
                icon: "📦",
                title: ko ? "국제 택배 / International Courier" : "International Courier",
                bullets: ko
                  ? ["보험 적용 전문 운송 (Brinks, Ferrari Group, Malca-Amit 물류)", "한국 또는 전 세계 배송", "한국 수입 시 관세·VAT 합계 13% (VAT 10% + 관세 3%)", "통관 서류는 Aurum이 전담 처리"]
                  : ["Insured specialty courier (Brinks, Ferrari Group, or Malca-Amit logistics)", "Ship to Korea or any destination worldwide", "13% Korean import duties (10% VAT + 3% customs)", "Customs documentation handled end-to-end by Aurum"]
              },
              {
                icon: "💰",
                title: ko ? "매도 / Sell-Back" : "Sell-Back",
                bullets: ko
                  ? ["실시간 매수호가로 Aurum에 매도, 실물 이동 불필요", "KRW, USD, SGD 수취 가능", "연결된 은행 계좌로 2영업일 내 정산", "최소 보유기간 없음, 위약금 없음"]
                  : ["Sell to Aurum at live bid price, no physical handling", "Payout in KRW, USD, or SGD", "2 business day settlement to linked bank account", "No minimum holding period, no exit fee"]
              },
            ].map((card, i) => (
              <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: "22px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{card.icon}</div>
                <div style={{ fontFamily: T.serif, fontSize: 16, color: T.textPrimary, fontWeight: 400, marginBottom: 12 }}>{card.title}</div>
                <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                  {card.bullets.map((b, j) => (
                    <li key={j} style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.sans, marginBottom: 6, lineHeight: 1.55 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(197,165,114,0.04)", border: `1px solid rgba(197,165,114,0.15)`, borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 12, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.6 }}>
              {ko
                ? "대부분의 Aurum 고객은 장기 보관(5년 이상)을 선택합니다. 보관료가 한국 내 안전 보관 비용보다 저렴하고, 해외 보관을 유지하는 한 세제상 최적 구조가 유지되기 때문입니다."
                : "Most Aurum customers choose long-term storage (5+ years) — storage fees are lower than Korean safe-keeping alternatives, and tax treatment is optimized while metal remains offshore."}
            </p>
          </div>
        </>
      )}

      {/* ── SECTION 8: VAULT SECURITY ── */}
      {section(
        <>
          {h2("금고 보안 체계", "Vault Security Architecture")}
          {lead(
            "싱가포르 Le Freeport는 금융 언론에서 \"아시아의 포트 녹스(Fort Knox)\"로 불립니다.",
            "Singapore's Le Freeport has been called \"Asia's Fort Knox\" by the financial press."
          )}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 14 }}>
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
        </>
      )}

      {/* ── SECTION 9: STORAGE FEES ── */}
      {section(
        <>
          {h2("보관 수수료", "Storage Fee Schedule")}
          {/* Main fee table */}
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
          {/* Fee details */}
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
          {/* Example */}
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
          {/* Comparison table */}
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
        </>
      )}

      {/* ── SECTION 10: WHY SINGAPORE ── */}
      {section(
        <>
          {h2("왜 싱가포르인가", "Why Singapore Is the Gold Standard for Storage")}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                title: ko ? "Asia의 귀금속 허브 / Asia's Precious Metals Hub" : "Asia's Precious Metals Hub",
                body: ko
                  ? "싱가포르는 아시아 어느 관할권보다 많은 민간 금고 내 금을 보유합니다. Le Freeport와 기타 FTZ 금고에 추정 400톤 이상이 보관되어 있습니다."
                  : "Singapore holds more gold in private vaults than any other Asian jurisdiction. Le Freeport and other FTZ vaults together store an estimated 400+ tonnes."
              },
              {
                title: ko ? "국가 신용등급 AAA / AAA Sovereign Credit Rating" : "AAA Sovereign Credit Rating",
                body: ko
                  ? "Moody's, S&P, Fitch 모두 싱가포르를 AAA로 평가. 한국은 AA (두 단계 낮음). 정치적 안정성이 현저히 높습니다."
                  : "Moody's, S&P, and Fitch all rate Singapore AAA. Korea is AA — two notches lower. Political stability is materially higher."
              },
              {
                title: ko ? "정부 정책 우호적 / Government Policy Tailwind" : "Government Policy Tailwind",
                body: ko
                  ? "싱가포르는 2012년 투자용 금에 대한 GST를 완전 면제하여 금고 보관업을 적극 유치해왔습니다. 정책은 13년 이상 유지되고 있습니다."
                  : "Singapore exempted investment-grade gold from GST in 2012 specifically to attract vault storage business. The policy has held for 13+ years."
              },
              {
                title: ko ? "Aurum 맥락에서 / In the Aurum Context" : "In the Aurum Context",
                body: ko
                  ? "한국 원화 변동성 헤지와 국내 정책·과세·압수 리스크 분산 효과. 해외 보관은 도피가 아니라 분산입니다."
                  : "Hedge against Korean won volatility and diversification away from domestic policy, tax, or seizure risk. Storing abroad is not an escape — it is diversification."
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, borderLeft: `3px solid ${T.accent}` }}>
                <div>
                  <div style={{ fontFamily: T.sans, fontSize: 13, color: T.accent, fontWeight: 600, marginBottom: 5 }}>{item.title}</div>
                  <p style={{ margin: 0, fontSize: 13, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.7 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── SECTION 11: COMPLIANCE ── */}
      {section(
        <>
          {h2("규제 및 컴플라이언스", "Compliance & Regulation")}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ko ? "Singapore PSPM Act 2019 등록 귀금속 딜러 / Registered precious metals dealer under the Singapore PSPM Act 2019" : "Registered precious metals dealer under the Singapore PSPM Act 2019",
              ko ? "PDPA(싱가포르 개인정보보호법) + 한국 PIPA 준수 / PDPA (Singapore) and Korean PIPA compliant" : "PDPA (Singapore) and Korean PIPA compliant",
              ko ? "MAS Notice PSM-N01에 따른 AML/CFT KYC / AML/CFT KYC per MAS Notice PSM-N01" : "AML/CFT KYC per MAS Notice PSM-N01",
              ko
                ? "한국 해외금융계좌 신고: 연중 어느 하루라도 잔액이 5억 원을 초과할 경우 다음 해 6월 30일까지 국세청에 신고. Aurum은 NTS 신고 양식에 부합하는 연말 잔고 증명서 제공."
                : "Korean Foreign Financial Account Reporting: if aggregate offshore balance exceeds KRW 500M at any point during the year, report to the National Tax Service by June 30 of the following year. Aurum provides year-end statements in NTS-compliant format.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "12px 16px", background: T.panel, border: `1px solid ${T.border}`, borderRadius: 7 }}>
                <span style={{ color: T.accent, fontSize: 14, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── SECTION 12: FAQ ── */}
      {section(
        <>
          {h2("자주 묻는 질문", "Frequently Asked Questions")}
          <FAQAccordion items={faqItems} />
        </>
      )}

      {/* ── SECTION 13: CTA STRIP ── */}
      <div style={{ padding: isMobile ? "48px 20px" : "72px 80px", textAlign: "center", background: "linear-gradient(135deg,rgba(197,165,114,0.06),rgba(197,165,114,0.02))" }}>
        <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 24 : 34, color: T.textPrimary, fontWeight: 300, margin: "0 0 16px" }}>
          {ko
            ? "싱가포르 실물 금 보관, 월 10만원 AGP로 시작하거나 첫 바를 KRW 350만원부터 구매하세요."
            : "Start storing physical gold in Singapore from KRW 100,000/month via AGP — or KRW 3.5M for your first full bar."}
        </h2>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
          {navigate && (
            <>
              <button
                onClick={() => navigate("shop")}
                style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "15px 36px", fontSize: 15, fontWeight: 700, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}
              >
                🥇 {ko ? "지금 첫 바 구매하기 / Buy your first bar now" : "Buy your first bar now"}
              </button>
              <button
                onClick={() => navigate("agp")}
                style={{ background: "transparent", color: T.accent, border: `1px solid ${T.accent}`, padding: "15px 36px", fontSize: 15, fontWeight: 600, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}
              >
                💰 {ko ? "AGP 저축 플랜 시작하기 / Start AGP savings plan" : "Start AGP savings plan"}
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

export { Storage };
