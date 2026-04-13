import { useState } from "react";
import { useIsMobile } from "./lib.jsx";

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

  // ── FAQ ──────────────────────────────────────────
  const faqItems = [
    {
      q: ko ? "Q1. AGP 그램은 실제 금입니까? / Are AGP grams real physical gold?" : "Q1. Are AGP grams real physical gold?",
      a: ko
        ? "네. 모든 AGP 그램은 Malca-Amit 싱가포르 금고에 보관된 실물 금·은·백금으로 100% 백업됩니다. 매일 공개 감사 리포트로 백업 비율을 확인하실 수 있으며, Bureau Veritas가 연 2회 실물 검증을 수행합니다."
        : "Yes. Every AGP gram is 100% backed by physical gold, silver, or platinum held at Malca-Amit Singapore. You can verify the backing ratio in the daily public audit report, and Bureau Veritas performs physical verification twice per year."
    },
    {
      q: ko ? "Q2. 최소 얼마부터 시작할 수 있나요? / What is the minimum starting amount?" : "Q2. What is the minimum starting amount?",
      a: ko
        ? "단일 입금 최소는 1g(현재 시세로 약 USD 153 / KRW 210,000 수준)입니다. 월간 자동이체 최소는 KRW 100,000부터 설정 가능합니다."
        : "The minimum single purchase is 1 gram (~USD 153 / KRW 210,000 at current spot). The minimum monthly auto-debit is KRW 100,000."
    },
    {
      q: ko ? "Q3. 토스뱅크 자동이체 설정은 어떻게 하나요? / How do I set up Toss Bank auto-debit?" : "Q3. How do I set up Toss Bank auto-debit?",
      a: ko
        ? "Aurum 계정 개설 후 대시보드의 '자동이체 설정'에서 토스뱅크 계정 연결. 이체 금액, 주기(주간·월간), 시작일 선택 후 저장. 초기 버전은 수동 이체 방식이며, API 연동은 향후 업데이트됩니다."
        : "After Aurum account setup, go to Dashboard → Auto-Debit Setup and connect your Toss Bank account. Choose amount, frequency (weekly/monthly), and start date. Initial version uses manual transfer; API integration is a planned upgrade."
    },
    {
      q: ko ? "Q4. 언제든 실물 바로 전환할 수 있나요? / Can I convert to physical bar anytime?" : "Q4. Can I convert to physical bar anytime?",
      a: ko
        ? "전환 기준점(금 100g·1kg, 은 1kg, 백금 100g)에 도달하면 언제든 무료로 전환 가능합니다. 전환 요청 후 공급업체 체결 및 배정까지 5~10영업일이 소요됩니다."
        : "Once you hit the conversion threshold (100g or 1,000g gold, 1,000g silver, 100g platinum), you may convert anytime for free. Conversion takes 5–10 business days for supplier fulfillment and allocation."
    },
    {
      q: ko ? "Q5. 전환할 때 추가 비용이 있나요? / Are there conversion fees?" : "Q5. Are there conversion fees?",
      a: ko
        ? "전환 수수료는 없습니다. 전환된 실물 바는 배분 보관 요율(0.50~0.80%/년)이 적용됩니다. 한국 배송을 선택할 경우 13% 관세·VAT와 운송·보험료가 별도 부과됩니다."
        : "No conversion fees. Converted bars move to allocated storage rate (0.50–0.80%/yr). If you choose to ship to Korea, 13% import duties and shipping/insurance fees apply separately."
    },
    {
      q: ko ? "Q6. 세금은 어떻게 처리되나요? / How are taxes handled?" : "Q6. How are taxes handled?",
      a: ko
        ? "싱가포르 보관 중에는 한국 세금이 발생하지 않습니다. 매도 시 발생한 차익은 기타소득으로 과세될 수 있으며, 실물을 한국으로 반입할 경우 13% 관세·VAT가 부과됩니다. 해외금융계좌 잔액이 연중 5억원을 초과한 경우 신고 의무. 본 내용은 법률·세무 조언이 아니므로 반드시 공인 세무사와 상담하세요."
        : "No Korean taxes apply while stored in Singapore. Gains upon sale may be taxable as other income. Importing physical into Korea triggers 13% duties. Offshore balances exceeding KRW 500M aggregate in a year trigger reporting. This is not tax advice — consult a certified Korean tax professional."
    },
    {
      q: ko ? "Q7. Aurum 파산 시 내 AGP 그램은 어떻게 되나요? / What if Aurum goes bankrupt?" : "Q7. What if Aurum goes bankrupt?",
      a: ko
        ? "AGP 그램을 뒷받침하는 실물 금속은 Malca-Amit에 AGP 전용 풀로 보관되며 Aurum 대차대조표와 분리되어 있습니다. Aurum 파산 시 수탁자인 Malca-Amit이 AGP 그램 비율에 따라 고객에게 직접 반환합니다."
        : "The physical metal backing AGP grams is held in a dedicated AGP pool at Malca-Amit, segregated from Aurum's balance sheet. In Aurum's insolvency, Malca-Amit returns metal to customers directly, proportional to their AGP gram holdings."
    },
    {
      q: ko ? "Q8. NH투자증권 + 토스뱅크 금 적립과 뭐가 다른가요? / How is this different from NH Investment + Toss Bank gold savings?" : "Q8. How is this different from NH Investment + Toss Bank gold savings?",
      a: ko
        ? "NH + 토스는 KRX 금시장에서 운용되는 한국 국내 서비스입니다. 실물 인출 시 10% VAT가 발생하고, KRX 가격(김치 프리미엄 포함)으로 거래됩니다. AGP는 싱가포르 자유무역지대에 보관되는 해외 실물이며, 국제 현물가로 거래되고, 전환 시 한국 VAT가 발생하지 않습니다(실물을 한국으로 반입하지 않는 한). 두 상품은 서로 다른 카테고리입니다 — 국내 페이퍼·한국 과세 vs. 해외 실물·세제 최적화."
        : "NH + Toss is a domestic Korean service operating on the KRX gold market. Physical withdrawal triggers 10% Korean VAT, and pricing is in KRX (which includes kimchi premium). AGP is offshore physical stored in Singapore's Free Trade Zone, priced at international spot, with no Korean VAT on conversion (as long as you don't ship into Korea). The two products are different categories — domestic paper with Korean taxation vs. offshore physical with tax optimization."
    },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* ── SECTION A: HERO ── */}
      <div style={{ padding: isMobile ? "64px 20px 48px" : "96px 80px 72px", textAlign: "center", borderBottom: `1px solid ${T.border}` }}>
        <SectionLabel>{ko ? "아름 골드 플랜 (AGP)" : "Aurum Gold Plan (AGP)"}</SectionLabel>
        <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 30 : 52, color: T.textPrimary, fontWeight: 300, margin: "0 0 14px", maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          {ko ? "월 10만원부터 시작하는 싱가포르 실물 금 저축" : "Save in physical gold, stored in Singapore, starting from KRW 100,000/month."}
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: T.textSecondary, fontFamily: T.sans, maxWidth: 680, margin: "0 auto 20px", lineHeight: 1.75 }}>
          {ko
            ? "그램 단위로 실물 금을 꾸준히 적립하세요. Malca-Amit 싱가포르 금고에 100% 실물 백업. 언제든 완전한 바로 전환 가능. 싱가포르 보관 중에는 한국 VAT 없음."
            : "Accumulate real physical gold by the gram. 100% physically backed at Malca-Amit Singapore. Convert to a full bar anytime. No Korean VAT while stored offshore."}
        </p>
        {/* Trust chips */}
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
        {/* Hero CTAs */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "15px 36px", fontSize: 15, fontWeight: 700, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}
          >
            🚀 {ko ? "AGP 가입하기 / Start AGP" : "Start AGP"}
          </button>
          {navigate && (
            <button
              onClick={() => navigate("agp-report")}
              style={{ background: "transparent", color: T.accent, border: `1px solid ${T.accent}`, padding: "15px 36px", fontSize: 15, fontWeight: 600, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}
            >
              📊 {ko ? "오늘의 백업 리포트 / Today's Backing Report" : "Today's Backing Report"}
            </button>
          )}
        </div>
      </div>

      {/* ── SECTION B: HOW AGP WORKS ── */}
      {section(
        <>
          {h2("AGP는 이렇게 작동합니다", "How Aurum Gold Plan Works")}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <StepCard num={1} icon="✍️" title={ko ? "가입 / Enroll" : "Enroll"} body={ko ? "10분 내 온라인 가입 및 한국 표준 KYC 완료 / 10-minute online signup with Korean-standard KYC" : "10-minute online signup with Korean-standard KYC"} />
            <StepCard num={2} icon="💰" title={ko ? "입금 / Fund" : "Fund"} body={ko ? "토스뱅크·한국 은행에서 일회 또는 월간 자동이체 / One-time or recurring auto-debit from Toss Bank or any Korean bank" : "One-time or recurring auto-debit from Toss Bank or any Korean bank"} />
            <StepCard num={3} icon="⚖️" title={ko ? "그램 적립 / Accumulate" : "Accumulate"} body={ko ? "입금액이 실시간 현물가 + 2.0% 프리미엄으로 AGP 그램으로 전환 / Each deposit converts to AGP grams at live spot plus 2.0% premium" : "Each deposit converts to AGP grams at live spot plus 2.0% premium"} />
            <StepCard num={4} icon="📊" title={ko ? "관리 / Monitor" : "Monitor"} body={ko ? "대시보드에서 그램, KRW 가치, 손익, 보관료, 전환 기준 진행률 확인 / Dashboard shows grams, KRW value, P&L, storage fees, and progress to conversion threshold" : "Dashboard shows grams, KRW value, P&L, storage fees, and progress to conversion threshold"} />
            <StepCard num={5} icon="🥇" title={ko ? "전환 / Convert" : "Convert"} body={ko ? "100g(또는 1kg 기준) 도달 시 실물 바로 무료 전환 또는 언제든 KRW 매도 / At 100g (or 1kg for flagship), convert to a physical bar for free — or sell back for KRW anytime" : "At 100g (or 1kg for flagship), convert to a physical bar for free — or sell back for KRW anytime"} />
          </div>
        </>
      )}

      {/* ── SECTION C: COMPARISON TABLE ── */}
      {section(
        <>
          {h2("AGP vs 국내 금 투자 상품", "AGP vs Other Korean Gold Savings Options")}
          {lead(
            "한국 은행과 증권사가 금 저축 상품을 출시하고 있는 것은 반가운 변화입니다. 하지만 모든 국내 상품은 한 가지 공통된 한계를 가지고 있습니다. 금이 한국 안에 있다는 것. 이는 곧 실물 인출 시 10% VAT, KRX 기반 가격에 따른 김치 프리미엄 노출, 그리고 한국 금융 시스템에 대한 위험 노출을 의미합니다. AGP는 그 역의 상품입니다. 싱가포르 자유무역지대에 보관되는 진짜 실물 금, 국제 현물가 기준, 원하는 때 PAMP·Heraeus 바로 무료 전환. 직접 수령할 수 있는 한국어 금 저축 계좌입니다.",
            "Korean banks and brokerages now offer gold savings products — a welcome development. But every domestic option has the same limitation: the gold sits in Korea. That means 10% VAT on withdrawal, kimchi-premium pricing via KRX, and exposure to the Korean financial system. AGP is the offshore counterpart — real physical gold in Singapore's Free Trade Zone, priced at international spot, convertible to a PAMP or Heraeus bar anytime. A Korean gold savings account you can physically collect."
          )}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700, tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: "#0d0b08" }}>
                  {[ko ? "특징" : "Feature", "Aurum AGP", "NH + Toss", ko ? "Kbank / KRX" : "Kbank / KRX", ko ? "국내 은행 적금" : "Korean Bank Passbook"].map((h, i) => (
                    <th key={i} style={{ padding: "12px 14px", textAlign: "left", color: i === 1 ? T.accent : T.textSecondary, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: T.sans, border: `1px solid ${T.border}`, width: i === 0 ? "22%" : "19.5%" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: ko ? "실물 백업 / Physical backing" : "Physical backing",
                    aurum: ko ? "✅ 100% 완전 배분 @ Malca-Amit" : "✅ 100% allocated @ Malca-Amit",
                    nh: ko ? "⚠️ KRX 수탁, 장부상" : "⚠️ KRX custody, paper exposure",
                    kbank: ko ? "⚠️ KRX 수탁" : "⚠️ KRX custody",
                    passbook: ko ? "❌ 은행 장부상" : "❌ Bank paper only",
                  },
                  {
                    feature: ko ? "관할 / Jurisdiction" : "Jurisdiction",
                    aurum: "🇸🇬 Singapore FTZ (offshore)",
                    nh: "🇰🇷 Korea domestic",
                    kbank: "🇰🇷 Korea domestic",
                    passbook: "🇰🇷 Korea domestic",
                  },
                  {
                    feature: ko ? "김치 프리미엄 / Kimchi premium" : "Kimchi premium exposure",
                    aurum: ko ? "❌ 없음 — 국제 현물가" : "❌ None — international spot",
                    nh: "✅ KRX pricing",
                    kbank: "✅ KRX pricing",
                    passbook: ko ? "✅ 은행 가격" : "✅ Bank pricing",
                  },
                  {
                    feature: ko ? "실물 전환 / Convert to physical" : "Convert to physical bar",
                    aurum: ko ? "✅ 100g / 1kg 기준 무료" : "✅ Free @ 100g / 1kg",
                    nh: ko ? "⚠️ 100g/1kg, 10% VAT 발생" : "⚠️ 100g/1kg min, 10% VAT triggered",
                    kbank: ko ? "⚠️ 100g/1kg, 10% VAT 발생" : "⚠️ 100g/1kg min, 10% VAT triggered",
                    passbook: ko ? "❌ 실물 전환 불가" : "❌ No retail physical conversion",
                  },
                  {
                    feature: ko ? "최소 구매 / Minimum" : "Minimum purchase",
                    aurum: "1g",
                    nh: "1g",
                    kbank: "1g",
                    passbook: ko ? "0.01g (장부상)" : "0.01g (paper only)",
                  },
                  {
                    feature: ko ? "보관료 / Storage fee" : "Storage fee",
                    aurum: "0.30%/yr AGP",
                    nh: ko ? "~0.00022%/yr (장부)" : "~0.00022%/yr KSD (paper)",
                    kbank: ko ? "~0.00022%/yr (장부)" : "~0.00022%/yr (paper)",
                    passbook: ko ? "은행 수수료 체계" : "Bank fee schedule",
                  },
                  {
                    feature: ko ? "한국어 서비스 / Korean-language service" : "Korean-language service",
                    aurum: ko ? "✅ 완전 지원" : "✅ Full",
                    nh: ko ? "✅ 완전 지원" : "✅ Full",
                    kbank: ko ? "✅ 완전 지원" : "✅ Full",
                    passbook: ko ? "✅ 완전 지원" : "✅ Full",
                  },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "11px 14px", fontFamily: T.sans, fontSize: 12, color: T.textSecondary, border: `1px solid ${T.border}`, background: T.panel }}>{row.feature}</td>
                    <td style={{ padding: "11px 14px", fontFamily: T.sans, fontSize: 12, color: T.textPrimary, border: `1px solid ${T.border}`, background: "rgba(197,165,114,0.04)", fontWeight: 500 }}>{row.aurum}</td>
                    <td style={{ padding: "11px 14px", fontFamily: T.sans, fontSize: 12, color: T.textSecondary, border: `1px solid ${T.border}`, background: T.panel }}>{row.nh}</td>
                    <td style={{ padding: "11px 14px", fontFamily: T.sans, fontSize: 12, color: T.textSecondary, border: `1px solid ${T.border}`, background: T.panel }}>{row.kbank}</td>
                    <td style={{ padding: "11px 14px", fontFamily: T.sans, fontSize: 12, color: T.textSecondary, border: `1px solid ${T.border}`, background: T.panel }}>{row.passbook}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── SECTION D: MIN-JUN EXAMPLE ── */}
      {section(
        <>
          {h2("민준씨의 금 저축 여정", "Min-jun's Gold Savings Journey")}
          <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: isMobile ? "20px" : "28px 32px", marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 22 }}>👨‍💻</span>
              </div>
              <p style={{ margin: 0, fontSize: isMobile ? 13 : 15, color: T.textPrimary, fontFamily: T.sans, lineHeight: 1.7 }}>
                {ko
                  ? "민준씨, 34세, 서울 거주 소프트웨어 엔지니어. 매월 50만원씩 금에 저축하기로 결심했습니다."
                  : "Min-jun, age 34, software engineer in Seoul. Decided to save KRW 500,000 per month in gold."}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                {
                  milestone: ko ? "Month 1" : "Month 1",
                  text: ko
                    ? "AGP 계정 개설, 토스뱅크 자동이체 50만원/월 설정 (매월 15일)"
                    : "Opens AGP account, sets up Toss Bank auto-debit at KRW 500,000/month on the 15th of each month"
                },
                {
                  milestone: ko ? "12개월" : "Month 12",
                  text: ko
                    ? "약 28g 적립 완료 (현 시세 기준). 첫 연간 스테이트먼트 수신"
                    : "~28g accumulated (at current spot). Receives first annual statement"
                },
                {
                  milestone: ko ? "4년" : "Year 4",
                  text: ko
                    ? "약 114g 적립, 100g 전환 기준점 돌파"
                    : "~114g accumulated — crosses the 100g conversion threshold"
                },
                {
                  milestone: ko ? "4년 마일스톤" : "Year 4 milestone",
                  text: ko
                    ? "100g를 실물 PAMP 100g 바로 전환(무료). 배분 금고에 보관. 사진·증명서 수령. 남은 14g는 AGP 계정에서 계속 적립"
                    : "Converts 100g to a real PAMP 100g bar for free. Stored in allocated vault. Photos and certificate received. The remaining 14g stays in AGP and continues accumulating",
                  highlight: true
                },
                {
                  milestone: ko ? "10년" : "Year 10",
                  text: ko
                    ? "약 280g 실물 바 + 약 60g AGP 그램 = 총 ~340g 실물 금 보유"
                    : "~280g in physical allocated bars + ~60g in AGP grams = ~340g total gold ownership"
                },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ minWidth: isMobile ? 60 : 100, flexShrink: 0 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, fontWeight: 600 }}>{item.milestone}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: item.highlight ? T.textPrimary : T.textSecondary, fontFamily: T.sans, lineHeight: 1.6, fontWeight: item.highlight ? 500 : 400 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "14px 18px", background: "rgba(197,165,114,0.04)", border: `1px solid rgba(197,165,114,0.15)`, borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 13, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.7 }}>
              {ko
                ? "대부분의 한국 투자자는 금 투자를 너무 어렵게 생각합니다. 민준씨는 그냥 시작했고, 설정 후 잊었으며, 이제 진짜 실물이고 완전 전환 가능한 귀금속을 소유하고 있습니다. 한 번에 수천만 원을 송금할 필요 없이."
                : "Most Korean investors overthink gold. Min-jun just started, set it and forgot it, and now owns real, physical, convertible precious metal — without wiring millions of won in a single transaction."}
            </p>
          </div>
        </>
      )}

      {/* ── SECTION E: PRICING & FEES ── */}
      {section(
        <>
          {h2("가격과 수수료", "Pricing & Fees")}
          <div style={{ overflowX: "auto", marginBottom: 28 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead>
                <tr style={{ background: "#0d0b08" }}>
                  {[ko ? "상품" : "Product", ko ? "최소" : "Minimum", ko ? "프리미엄" : "Premium over spot", ko ? "보관료" : "Storage fee"].map((h, i) => (
                    <th key={i} style={{ padding: "12px 16px", textAlign: "left", color: T.textSecondary, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: T.sans, border: `1px solid ${T.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [ko ? "AGP 금 그램 / AGP Gold grams" : "AGP Gold grams", "1g", "2.0%", "0.30%/yr"],
                  [ko ? "AGP 은 그램 / AGP Silver grams" : "AGP Silver grams", "10g", "3.5%", "0.50%/yr"],
                  [ko ? "AGP 백금 그램 / AGP Platinum grams" : "AGP Platinum grams", "1g", "2.5%", "0.40%/yr"],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: "12px 16px", fontFamily: j === 2 || j === 3 ? T.mono : T.sans, fontSize: 13, color: j === 2 || j === 3 ? T.accent : T.textPrimary, border: `1px solid ${T.border}`, background: T.panel }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Conversion thresholds */}
          <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 22px" }}>
            <div style={{ fontFamily: T.sans, fontSize: 14, color: T.accent, fontWeight: 600, marginBottom: 12 }}>
              {ko ? "전환 기준점 (수수료 없음) / Conversion Thresholds (free, no fee)" : "Conversion Thresholds (free, no fee)"}
            </div>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: T.textSecondary, fontFamily: T.sans }}>
              {ko ? "전환 기준점 도달 시 수수료 없이 실물 바로 전환:" : "Convert to physical bars for free, no fee, upon reaching threshold:"}
            </p>
            {[
              [ko ? "금 / Gold" : "Gold", ko ? "100g → PAMP/Heraeus 100g 바; 1,000g → PAMP/Heraeus 1kg 바" : "100g → PAMP/Heraeus 100g bar; 1,000g → PAMP/Heraeus 1kg bar"],
              [ko ? "은 / Silver" : "Silver", ko ? "1,000g → 1kg 바" : "1,000g → 1kg bar"],
              [ko ? "백금 / Platinum" : "Platinum", ko ? "100g → 100g 바" : "100g → 100g bar"],
            ].map(([metal, rule], i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontFamily: T.sans, fontSize: 13, color: T.accent, fontWeight: 600, minWidth: 70, flexShrink: 0 }}>{metal}</span>
                <span style={{ fontFamily: T.sans, fontSize: 13, color: T.textSecondary }}>{rule}</span>
              </div>
            ))}
            <p style={{ margin: "12px 0 0", fontSize: 12, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.6 }}>
              {ko
                ? "잔여 그램(예: 237g 중 100g 전환 후 137g)은 계속 AGP에서 적립"
                : "Excess grams (e.g., 237g → convert 100g, 137g remain) stay in AGP."}
            </p>
          </div>
        </>
      )}

      {/* ── SECTION F: DAILY BACKING REPORT ── */}
      {section(
        <>
          {h2("매일 공개되는 물리적 보유량", "Daily Physical Backing Report")}
          {lead(
            "매일 SGT 00:01에 Aurum은 자동 생성된 리포트를 공개합니다. 발행된 총 AGP 그램(고객 부채)과 이를 뒷받침하는 Malca-Amit 내 실물 금·은·백금 총량을 모두 표시합니다. 백업 비율은 항상 100% 이상을 유지해야 합니다.",
            "Every day at 00:01 SGT, Aurum publishes an auto-generated report showing total AGP grams outstanding (customer liability) vs total physical gold, silver, and platinum held at Malca-Amit backing those grams. The backing ratio must always remain at 100% or above."
          )}
          {/* Report preview widget */}
          <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: isMobile ? "20px" : "28px 32px", maxWidth: 560 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: T.serif, fontSize: 18, color: T.textPrimary, fontWeight: 400 }}>
                {ko ? "AGP 백업 리포트 / AGP Backing Report" : "AGP Backing Report"}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textSecondary }}>SGT 00:01</div>
            </div>
            {[
              [ko ? "발행된 AGP 금 그램 (고객 부채)" : "Total AGP gold grams outstanding", "12,847.3g", T.textPrimary],
              [ko ? "Malca-Amit 실물 금 보유량" : "Physical gold at Malca-Amit", "12,994.1g", T.accent],
              [ko ? "금 백업 비율" : "Gold backing ratio", "101.1%", "#4ade80"],
              [ko ? "Bureau Veritas 최신 감사" : "Most recent Bureau Veritas audit", "2026-02-14", T.textSecondary],
            ].map(([label, value, color], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.sans }}>{label}</span>
                <span style={{ fontFamily: T.mono, fontSize: 13, color, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            {navigate && (
              <button
                onClick={() => navigate("agp-report")}
                style={{ marginTop: 20, width: "100%", background: "rgba(197,165,114,0.1)", border: `1px solid rgba(197,165,114,0.3)`, color: T.accent, padding: "12px", borderRadius: 6, cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600 }}
              >
                {ko ? "전체 리포트 보기 / View Full Report →" : "View Full Report →"}
              </button>
            )}
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ko ? "발행된 AGP 그램 총량 (고객 부채) / Total AGP grams outstanding (customer liability)" : "Total AGP grams outstanding (customer liability)",
              ko ? "Malca-Amit AGP 풀의 실물 금속 총량 / Total physical metal in Malca-Amit AGP pool" : "Total physical metal in Malca-Amit AGP pool",
              ko ? "백업 비율 (100% 미만으로 내려가지 않음) / Backing ratio (never below 100%)" : "Backing ratio (never below 100%)",
              ko ? "Bureau Veritas 최신 감사 일자 / Most recent Bureau Veritas audit date" : "Most recent Bureau Veritas audit date",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.textSecondary, fontFamily: T.sans }}>
                <span style={{ color: T.accent, flexShrink: 0 }}>→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── SECTION G: FAQ ── */}
      {section(
        <>
          {h2("자주 묻는 질문", "Frequently Asked Questions")}
          <FAQAccordion items={faqItems} />
        </>
      )}

      {/* ── SECTION H: CTA ── */}
      <div style={{ padding: isMobile ? "48px 20px" : "72px 80px", textAlign: "center", background: "linear-gradient(135deg,rgba(197,165,114,0.06),rgba(197,165,114,0.02))" }}>
        <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 26 : 38, color: T.textPrimary, fontWeight: 300, margin: "0 0 16px" }}>
          {ko ? "10만원으로 오늘 실물 금 저축을 시작하세요." : "Start saving in physical gold today — from just KRW 100,000."}
        </h2>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
          <button style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "15px 36px", fontSize: 15, fontWeight: 700, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}>
            🚀 {ko ? "AGP 가입하기 / Start AGP" : "Start AGP"}
          </button>
          {navigate && (
            <button
              onClick={() => navigate("learn")}
              style={{ background: "transparent", color: T.accent, border: `1px solid ${T.accent}`, padding: "15px 36px", fontSize: 15, fontWeight: 600, borderRadius: 7, cursor: "pointer", fontFamily: T.sans }}
            >
              📖 {ko ? "투자 가이드 보기 / Read investment guide" : "Read investment guide"}
            </button>
          )}
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

  // Static v1 data
  const reportData = {
    date: "2026-04-13",
    time: "00:01 SGT",
    gold: { outstanding: 12847.3, physical: 12994.1, ratio: 101.14 },
    silver: { outstanding: 184200, physical: 186500, ratio: 101.25 },
    platinum: { outstanding: 3420.5, physical: 3480.0, ratio: 101.74 },
    lastAudit: "2026-02-14",
    auditor: "Bureau Veritas (LBMA Approved)",
    custodian: "Malca-Amit Singapore FTZ",
    nextAudit: "2026-08-14",
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      {/* Minimal header */}
      <div style={{ padding: isMobile ? "24px 20px 16px" : "32px 60px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", fontFamily: T.sans, marginBottom: 5 }}>AURUM GOLD PLAN</div>
          <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 22 : 28, color: T.textPrimary, fontWeight: 300, margin: 0 }}>
            {ko ? "일일 물리적 백업 리포트" : "Daily Physical Backing Report"}
          </h1>
        </div>
        {navigate && (
          <button onClick={() => navigate("agp")} style={{ background: "none", border: "none", color: T.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: T.sans }}>
            ← {ko ? "AGP로 돌아가기" : "Back to AGP"}
          </button>
        )}
      </div>

      <div style={{ padding: isMobile ? "28px 20px" : "40px 60px" }}>
        {/* Report header */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
          {[
            { label: ko ? "리포트 날짜" : "Report Date", value: reportData.date },
            { label: ko ? "업데이트 시각" : "Updated At", value: reportData.time },
            { label: ko ? "수탁자" : "Custodian", value: reportData.custodian },
            { label: ko ? "최신 감사" : "Last Audit", value: reportData.lastAudit },
          ].map((item, i) => (
            <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 18px", minWidth: 160 }}>
              <div style={{ fontSize: 10, color: T.textSecondary, fontFamily: T.sans, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{item.label}</div>
              <div style={{ fontFamily: T.mono, fontSize: 13, color: T.textPrimary }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Backing ratios */}
        {[
          { metal: ko ? "금 / Gold" : "Gold", icon: "🥇", data: reportData.gold, unit: "g" },
          { metal: ko ? "은 / Silver" : "Silver", icon: "🥈", data: reportData.silver, unit: "g" },
          { metal: ko ? "백금 / Platinum" : "Platinum", icon: "🔵", data: reportData.platinum, unit: "g" },
        ].map(({ metal, icon, data, unit }, i) => (
          <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>{icon}</span>
                <span style={{ fontFamily: T.serif, fontSize: 18, color: T.textPrimary, fontWeight: 400 }}>{metal}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: T.mono, fontSize: 20, color: "#4ade80", fontWeight: 700 }}>{data.ratio.toFixed(2)}%</div>
                <div style={{ fontSize: 10, color: T.textSecondary, fontFamily: T.sans }}>
                  {ko ? "백업 비율 / Backing ratio" : "Backing ratio"}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: ko ? "발행된 AGP 그램 (고객 부채)" : "AGP grams outstanding", value: `${data.outstanding.toLocaleString()}${unit}`, color: T.textPrimary },
                { label: ko ? "실물 보유량 (Malca-Amit)" : "Physical held (Malca-Amit)", value: `${data.physical.toLocaleString()}${unit}`, color: T.accent },
              ].map(({ label, value, color }, j) => (
                <div key={j} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: T.textSecondary, fontFamily: T.sans, marginBottom: 5, lineHeight: 1.4 }}>{label}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 15, color, fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
            {/* Ratio bar */}
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 6, borderRadius: 3, background: "#1a1510", overflow: "hidden" }}>
                <div style={{ width: "100%", background: "linear-gradient(90deg,#4ade80,#22c55e)", height: "100%", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 10, color: T.textSecondary, fontFamily: T.sans, marginTop: 5 }}>
                {ko ? "100% 이상 유지 중 — 실물 금속이 고객 부채를 초과합니다" : "Maintained above 100% — physical metal exceeds customer liability"}
              </div>
            </div>
          </div>
        ))}

        {/* Audit info */}
        <div style={{ background: "rgba(197,165,114,0.05)", border: `1px solid rgba(197,165,114,0.2)`, borderRadius: 10, padding: "18px 22px", marginTop: 24 }}>
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.accent, fontWeight: 600, marginBottom: 10 }}>
            {ko ? "감사 정보 / Audit Information" : "Audit Information"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              [ko ? "감사기관" : "Auditor", reportData.auditor],
              [ko ? "최신 감사 일자" : "Last audit date", reportData.lastAudit],
              [ko ? "다음 예정 감사" : "Next scheduled audit", reportData.nextAudit],
            ].map(([label, value], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.sans }}>{label}</span>
                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.textPrimary }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 20, padding: "14px 18px", background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: 11, color: T.textSecondary, fontFamily: T.sans, lineHeight: 1.7 }}>
            {ko
              ? "본 리포트는 매일 SGT 00:01 자동 생성됩니다. 고객 부채는 당일 마감 기준 발행된 총 AGP 그램 수량이며, 실물 보유량은 Malca-Amit 금고에 보관된 금속 총량입니다. 백업 비율 100% 미만은 허용되지 않습니다. V1 정적 데이터 — Phase 3에서 실시간 API 연동 예정."
              : "This report is auto-generated daily at 00:01 SGT. Customer liability represents total AGP grams outstanding at end of day; physical holdings represent total metal held in Malca-Amit vault. Backing ratio below 100% is not permitted. V1 static data — live API integration scheduled for Phase 3."}
          </p>
        </div>
      </div>
    </div>
  );
}

export { AGP, AGPBackingReport };
