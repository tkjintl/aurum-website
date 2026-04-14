import { useState } from 'react';
import FormStep from '../components/FormStep';
import PaymentMethodCard from '../components/PaymentMethodCard';
import ConsentCheckbox from '../components/ConsentCheckbox';

const T = {
  bg: '#0a0a0a',
  bgPanel: '#111008',
  bgField: '#1a1814',
  gold: '#C5A572',
  goldBright: '#E3C187',
  goldDim: '#8a7d6b',
  textPrimary: '#f5f0e8',
  textSecondary: '#a8a096',
  textMuted: '#6b655d',
  border: 'rgba(197, 165, 114, 0.2)',
  borderStrong: 'rgba(197, 165, 114, 0.5)',
  serif: "'Cormorant Garamond', serif",
  sans: "'Outfit', 'Noto Sans KR', sans-serif",
  mono: "'JetBrains Mono', monospace",
  krDisplay: "'Noto Serif KR', serif",
};

const SECTIONS = [
  { num: '01', kr: '본인 정보', en: 'Identity' },
  { num: '02', kr: '투자자 프로필', en: 'Profile' },
  { num: '03', kr: 'AGP 플랜 설계', en: 'Plan' },
  { num: '04', kr: '결제 수단', en: 'Payment' },
  { num: '05', kr: '약관 동의', en: 'Consent' },
  { num: '06', kr: '검토 및 제출', en: 'Review' },
];

const fieldStyle = {
  width: '100%',
  background: T.bgField,
  border: `1px solid ${T.border}`,
  padding: '14px 16px',
  color: T.textPrimary,
  fontFamily: T.sans,
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontFamily: T.sans,
  fontSize: 13,
  color: T.textPrimary,
  fontWeight: 500,
  marginBottom: 8,
  letterSpacing: '0.02em',
};

function FieldGroup({ label, enLabel, required, children, hint, twoCol, style }) {
  return (
    <div style={{ marginBottom: 24, ...(twoCol ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } : {}), ...style }}>
      {label && (
        <div style={{ gridColumn: twoCol ? '1/-1' : undefined }}>
          <label style={labelStyle}>
            {label}
            {enLabel && <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted, fontWeight: 400, marginLeft: 8 }}>{enLabel}</span>}
            {required && <span style={{ color: T.gold, fontSize: 11, marginLeft: 4 }}>필수</span>}
          </label>
        </div>
      )}
      {children}
      {hint && <p style={{ fontSize: 12, color: T.textMuted, marginTop: 6, fontFamily: T.sans, gridColumn: twoCol ? '1/-1' : undefined }}>{hint}</p>}
    </div>
  );
}

export default function AGPEnrollPage({ lang, navigate }) {
  const ko = lang === 'ko';
  const [section, setSection] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [form, setForm] = useState({
    nameKr: '', nameEn: '', rrn: '', nationality: 'KR', phone: '', email: '',
    zipcode: '', address: '', addressDetail: '', passVerified: false,
    occupation: '', income: '', sourceOfFunds: '', expectedMonthly: '', pep: 'no', fatca: 'no',
    composition: 'gold100', monthlyAmount: '500000', frequency: 'monthly', startDate: '', conversionTarget: '100g',
    payMethod: 'toss', bank: '', accountNum: '', accountVerified: false,
    cardNum: '', cardExpiry: '', cardCvc: '', cardName: '',
    cryptoCoin: 'USDT', cryptoNetwork: 'TRC20', cryptoWallet: '',
    consentAll: false, consent1: false, consent2: false, consent3: false, consent4: false, consent5: false, consent6: false,
  });

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const next = () => { if (section < 6) setSection(s => s + 1); else setSubmitted(true); };
  const prev = () => { if (section > 1) setSection(s => s - 1); };
  const gotoSection = (n) => setSection(n);

  // Consent all toggle
  const toggleAll = (val) => setForm(f => ({ ...f, consentAll: val, consent1: val, consent2: val, consent3: val, consent4: val, consent5: val, consent6: val }));

  const btnPrimary = {
    background: T.gold, color: '#0a0a0a', border: 'none',
    padding: '14px 28px', fontFamily: T.sans, fontSize: 15,
    fontWeight: 500, cursor: 'pointer', letterSpacing: '0.03em',
    transition: 'all 0.3s',
  };
  const btnSecondary = {
    background: 'transparent', color: T.textPrimary,
    border: `1px solid ${T.borderStrong}`, padding: '13px 24px',
    fontFamily: T.sans, fontSize: 14, cursor: 'pointer',
  };

  if (submitted) {
    return (
      <div style={{ background: T.bg, minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <div style={{ maxWidth: 640, width: '100%', textAlign: 'center', padding: '80px 48px 60px', background: 'linear-gradient(180deg, #111008 0%, #0a0a0a 100%)', border: `1px solid ${T.borderStrong}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse at center, rgba(197, 165, 114, 0.12), transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ width: 80, height: 80, border: `1px solid ${T.gold}`, borderRadius: '50%', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontSize: 32, position: 'relative' }}>✓</div>
          
          <h3 style={{ fontFamily: T.krDisplay, fontSize: 32, fontWeight: 600, color: T.textPrimary, marginBottom: 6, position: 'relative' }}>신청이 접수되었습니다</h3>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.gold, fontSize: 18, marginBottom: 28, position: 'relative' }}>Your AGP enrollment has been received.</div>
          
          <p style={{ color: T.textSecondary, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.75, fontSize: 14.5, position: 'relative' }}>
            {ko ? '확인 이메일을 다음 주소로 발송했습니다. 이메일 내 확인 링크를 클릭하면 KYC 심사가 시작됩니다. 영업일 기준 24시간 내에 결과를 알려드립니다.' : 'We have sent a confirmation email to the address below. Click the link to begin KYC review. Results within 24 business hours.'}
          </p>
          
          <div style={{ fontFamily: T.mono, fontSize: 13, color: T.gold, padding: '12px 18px', background: 'rgba(197, 165, 114, 0.07)', border: `1px solid ${T.border}`, display: 'inline-block', marginBottom: 32, position: 'relative' }}>
            {form.email || 'you@example.com'}
          </div>

          <div style={{ textAlign: 'left', maxWidth: 460, margin: '0 auto 32px', position: 'relative' }}>
            <ol style={{ listStyle: 'none', padding: 0, counterReset: 's' }}>
              {[
                { title: ko ? '이메일 확인' : 'Verify Email', body: ko ? '수신함에서 Aurum 확인 메일을 열어 링크를 클릭하세요.' : 'Open the Aurum email in your inbox and click the verify link.' },
                { title: ko ? 'KYC 심사' : 'KYC Review', body: ko ? '신분증과 PASS 인증 기준 24시간 내 승인됩니다.' : 'Identity and PASS verification reviewed within 24 hours.' },
                { title: ko ? '첫 자동이체' : 'First Transfer', body: ko ? '승인 후 설정하신 시작일에 첫 입금이 진행됩니다.' : 'First debit runs on your selected start date after approval.' },
                { title: ko ? '대시보드' : 'Dashboard', body: ko ? '그램 적립, 현물가, 보관료, 전환 진행률을 실시간으로 확인하세요.' : 'Track your grams, spot value, fees, and conversion progress live.' },
              ].map((item, i) => (
                <li key={i} style={{ paddingLeft: 48, paddingBottom: 18, color: T.textSecondary, fontSize: 14, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: -2, fontFamily: T.mono, color: T.gold, fontSize: 14, fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</span>
                  <strong style={{ color: T.textPrimary, fontWeight: 500 }}>{item.title}.</strong> {item.body}
                </li>
              ))}
            </ol>
          </div>

          <button onClick={() => navigate('home')} style={{ ...btnSecondary }}>
            {ko ? '홈으로 돌아가기' : 'Return to Home'} →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: '90vh', padding: '80px 20px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'clamp(200px, 25%, 280px) 1fr', gap: 48 }}>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '0.28em', color: T.gold, textTransform: 'uppercase', marginBottom: 16 }}>AGP 가입 신청</div>
          <h2 style={{ fontFamily: T.krDisplay, fontSize: 24, color: T.textPrimary, marginBottom: 6, fontWeight: 600 }}>신규 가입</h2>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.gold, fontSize: 15, marginBottom: 32 }}>New Enrollment</div>
          
          <nav style={{ borderLeft: `1px solid ${T.border}`, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SECTIONS.map((s, i) => {
              const n = i + 1;
              const isActive = section === n;
              const isDone = section > n;
              return (
                <div
                  key={i}
                  style={{
                    padding: '12px 0',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    position: 'relative',
                    fontSize: 13,
                    color: isActive ? T.textPrimary : isDone ? T.textSecondary : T.textMuted,
                    fontWeight: isActive ? 500 : 400,
                    cursor: isDone ? 'pointer' : 'default',
                  }}
                  onClick={() => isDone && gotoSection(n)}
                >
                  <div style={{
                    position: 'absolute',
                    left: -24, width: 8, height: 8,
                    background: isActive ? T.gold : isDone ? T.goldDim : T.border,
                    borderRadius: '50%',
                    boxShadow: isActive ? `0 0 0 4px rgba(197, 165, 114, 0.15)` : 'none',
                    transition: 'all 0.3s',
                  }} />
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: isActive ? T.gold : T.goldDim, fontWeight: 500 }}>{s.num}</span>
                  <span>{s.kr} · {s.en}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main form panel */}
        <main style={{ background: 'linear-gradient(180deg, #111008 0%, #0a0a0a 100%)', border: `1px solid ${T.border}`, padding: 'clamp(24px, 5vw, 48px) clamp(20px, 4vw, 44px)', minHeight: 600 }}>

          {/* SECTION 1: 본인 정보 */}
          <FormStep active={section === 1}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 26, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>본인 정보</h3>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.gold, fontSize: 15, marginBottom: 8 }}>Identity &amp; Contact Verification</div>
            <p style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 36, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
              {ko ? '한국 금융실명법에 따라 실명 확인이 필요합니다. 모든 정보는 암호화 전송·저장되며 KYC 심사에만 사용됩니다.' : 'Real-name verification required under Korean Financial Real-Name Act. All data is encrypted and used for KYC review only.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>성명 (한글) <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Legal name — Korean</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={fieldStyle} type="text" placeholder="홍길동" value={form.nameKr} onChange={update('nameKr')} />
              </div>
              <div>
                <label style={labelStyle}>영문 성명 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Name in English</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={fieldStyle} type="text" placeholder="HONG GIL DONG" value={form.nameEn} onChange={update('nameEn')} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>주민등록번호 앞 7자리 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>RRN (first 7 digits)</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={{ ...fieldStyle, fontFamily: T.mono }} type="text" placeholder="YYMMDD-N" maxLength={8} value={form.rrn} onChange={update('rrn')} inputMode="numeric" />
                <p style={{ fontSize: 12, color: T.textMuted, marginTop: 6, fontFamily: T.sans }}>실명 확인에만 사용 · 뒷자리는 저장하지 않습니다</p>
              </div>
              <div>
                <label style={labelStyle}>국적 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Nationality</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <select style={{ ...fieldStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path d='M1 1l5 5 5-5' stroke='%23C5A572' fill='none' stroke-width='1.5'/></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: 40 }} value={form.nationality} onChange={update('nationality')}>
                  <option value="KR">대한민국 · Republic of Korea</option>
                  <option value="OTHER">기타 · Other</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>휴대폰 번호 본인 인증 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Mobile verification via PASS</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <input style={{ ...fieldStyle, fontFamily: T.mono }} type="tel" placeholder="010-0000-0000" value={form.phone} onChange={update('phone')} />
                <button
                  onClick={() => { set('passVerified', true); alert('PASS 인증 성공 (mock)'); }}
                  style={{ background: form.passVerified ? T.gold : T.bg, color: form.passVerified ? '#0a0a0a' : T.gold, border: `1px solid ${T.gold}`, padding: '0 20px', fontFamily: T.mono, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {form.passVerified ? '✓ 인증완료' : 'PASS 인증'}
                </button>
              </div>
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 6, fontFamily: T.sans }}>PASS 앱 또는 문자 인증으로 본인 확인을 진행합니다</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>이메일 주소 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Email address</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <input style={fieldStyle} type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} />
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 6, fontFamily: T.sans }}>계정 확인 메일과 모든 거래 내역이 이 주소로 발송됩니다</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>주소 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Residential address</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 10 }}>
                <input style={fieldStyle} type="text" placeholder="우편번호" value={form.zipcode} readOnly />
                <button style={{ background: T.bg, color: T.gold, border: `1px solid ${T.gold}`, padding: '0 20px', fontFamily: T.mono, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}>주소 검색</button>
              </div>
              <input style={{ ...fieldStyle, marginBottom: 10 }} type="text" placeholder="기본 주소" value={form.address} readOnly />
              <input style={fieldStyle} type="text" placeholder="상세 주소 (동·호수 등)" value={form.addressDetail} onChange={update('addressDetail')} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>신분증 업로드 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>ID document upload</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <div style={{ border: `1px dashed ${T.borderStrong}`, padding: '28px 20px', textAlign: 'center', background: 'rgba(197, 165, 114, 0.03)', cursor: 'pointer' }}>
                <div style={{ fontSize: 24, color: T.gold, marginBottom: 8 }}>⬆</div>
                <div style={{ color: T.textPrimary, fontSize: 14, marginBottom: 4 }}>주민등록증 앞·뒷면 또는 여권 업로드</div>
                <div style={{ color: T.textMuted, fontSize: 12 }}>JPG, PNG, PDF · 최대 10MB · 얼굴과 이름이 선명하게 보여야 합니다</div>
              </div>
            </div>

            <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <button style={btnSecondary} onClick={() => navigate('agp-intro')}>← 이전 단계</button>
              <button style={btnPrimary} onClick={next}>다음 · Continue →</button>
            </div>
          </FormStep>

          {/* SECTION 2: 투자자 프로필 */}
          <FormStep active={section === 2}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 26, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>투자자 프로필</h3>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.gold, fontSize: 15, marginBottom: 8 }}>Investor Profile</div>
            <p style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 36, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
              {ko ? 'AML(자금세탁방지) 및 FATCA 규정 준수를 위한 기본 정보입니다. 답변은 계정 한도 설정에 사용됩니다.' : 'Required for AML compliance and FATCA declaration. Responses are used for account limit classification.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>직업 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Occupation</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={fieldStyle} type="text" placeholder="예: 회사원, 자영업, 전문직" value={form.occupation} onChange={update('occupation')} />
              </div>
              <div>
                <label style={labelStyle}>연소득 범위 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Annual income bracket</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <select style={{ ...fieldStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path d='M1 1l5 5 5-5' stroke='%23C5A572' fill='none' stroke-width='1.5'/></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: 40 }} value={form.income} onChange={update('income')}>
                  <option value="">선택</option>
                  <option value="under30m">3천만원 이하</option>
                  <option value="30m-70m">3천만원 ~ 7천만원</option>
                  <option value="70m-150m">7천만원 ~ 1.5억원</option>
                  <option value="150m-300m">1.5억원 ~ 3억원</option>
                  <option value="over300m">3억원 이상</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>자금의 출처 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Source of funds</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <select style={{ ...fieldStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path d='M1 1l5 5 5-5' stroke='%23C5A572' fill='none' stroke-width='1.5'/></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: 40 }} value={form.sourceOfFunds} onChange={update('sourceOfFunds')}>
                <option value="">선택</option>
                <option value="employment">근로 소득 · Employment income</option>
                <option value="business">사업 소득 · Business income</option>
                <option value="investment">투자 수익 · Investment returns</option>
                <option value="inheritance">상속 · 증여 · Inheritance or gift</option>
                <option value="retirement">퇴직금 · Retirement</option>
                <option value="other">기타 · Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>예상 월 적립액 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Expected monthly contribution</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <select style={{ ...fieldStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path d='M1 1l5 5 5-5' stroke='%23C5A572' fill='none' stroke-width='1.5'/></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: 40 }} value={form.expectedMonthly} onChange={update('expectedMonthly')}>
                <option value="20-50">20만원 ~ 50만원</option>
                <option value="50-100">50만원 ~ 100만원</option>
                <option value="100-300">100만원 ~ 300만원</option>
                <option value="300-1000">300만원 ~ 1,000만원</option>
                <option value="over1000">1,000만원 이상</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ ...labelStyle, marginBottom: 12 }}>정치적 노출 인물(PEP) 여부 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ val: 'no', kr: '해당 없음', en: 'None' }, { val: 'yes', kr: '해당', en: 'Applicable' }].map(opt => (
                    <div key={opt.val} onClick={() => set('pep', opt.val)} style={{ cursor: 'pointer', padding: '14px 16px', background: form.pep === opt.val ? 'rgba(197, 165, 114, 0.07)' : T.bgField, border: `1px solid ${form.pep === opt.val ? T.gold : T.border}`, borderRadius: 6, transition: 'all 0.2s' }}>
                      <div style={{ fontFamily: T.sans, fontWeight: 500, color: T.textPrimary, fontSize: 14 }}>{opt.kr}</div>
                      <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted, fontSize: 12 }}>{opt.en}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: 12 }}>미국 세법 거주자(FATCA) <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ val: 'no', kr: '아니오', en: 'No' }, { val: 'yes', kr: '예', en: 'Yes' }].map(opt => (
                    <div key={opt.val} onClick={() => set('fatca', opt.val)} style={{ cursor: 'pointer', padding: '14px 16px', background: form.fatca === opt.val ? 'rgba(197, 165, 114, 0.07)' : T.bgField, border: `1px solid ${form.fatca === opt.val ? T.gold : T.border}`, borderRadius: 6, transition: 'all 0.2s' }}>
                      <div style={{ fontFamily: T.sans, fontWeight: 500, color: T.textPrimary, fontSize: 14 }}>{opt.kr}</div>
                      <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted, fontSize: 12 }}>{opt.en}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>다음 · Continue →</button>
            </div>
          </FormStep>

          {/* SECTION 3: AGP 플랜 설계 */}
          <FormStep active={section === 3}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 26, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>AGP 플랜 설계</h3>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.gold, fontSize: 15, marginBottom: 8 }}>Design Your Accumulation Plan</div>
            <p style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 36, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
              {ko ? '자산 구성, 적립액, 주기, 전환 목표를 설정하세요. 모든 설정은 가입 후 대시보드에서 언제든 변경 가능합니다.' : 'Set your asset mix, contribution amount, frequency, and conversion target. All settings are adjustable from your dashboard at any time.'}
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>자산 구성 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Asset composition</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                {[
                  { val: 'gold100', kr: '금 100%', en: 'Gold only', detail: '가장 전통적 · 변동성 낮음' },
                  { val: 'silver100', kr: '은 100%', en: 'Silver only', detail: '공급 부족 · 산업 상승 잠재력' },
                  { val: 'gold70', kr: '금 70% · 은 30%', en: '70/30 blend', detail: '안정 + 성장 균형' },
                  { val: 'custom', kr: '직접 설정', en: 'Custom ratio', detail: '대시보드에서 조정' },
                ].map(opt => (
                  <div key={opt.val} onClick={() => set('composition', opt.val)} style={{ cursor: 'pointer', padding: '18px 16px', background: form.composition === opt.val ? 'rgba(197, 165, 114, 0.07)' : T.bgField, border: `1px solid ${form.composition === opt.val ? T.gold : T.border}`, boxShadow: form.composition === opt.val ? `0 0 0 2px rgba(197, 165, 114, 0.15)` : 'none', transition: 'all 0.25s' }}>
                    <div style={{ fontFamily: T.sans, fontWeight: 500, color: T.textPrimary, fontSize: 14, marginBottom: 4 }}>{opt.kr}</div>
                    <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted, fontSize: 12, marginBottom: 6 }}>{opt.en}</div>
                    <div style={{ color: T.textSecondary, fontSize: 12, lineHeight: 1.5 }}>{opt.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>월 적립액 (KRW) <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Monthly contribution</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={{ ...fieldStyle, fontFamily: T.mono }} type="text" value={form.monthlyAmount} onChange={update('monthlyAmount')} inputMode="numeric" />
                <p style={{ fontSize: 12, color: T.textMuted, marginTop: 6, fontFamily: T.sans }}>최소 200,000원 · 최대 10,000,000원</p>
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: 12 }}>적립 주기 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Contribution frequency</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[{ val: 'daily', kr: '매일', en: 'Daily' }, { val: 'weekly', kr: '매주', en: 'Weekly' }, { val: 'monthly', kr: '매월', en: 'Monthly' }].map(opt => (
                    <div key={opt.val} onClick={() => set('frequency', opt.val)} style={{ cursor: 'pointer', padding: '12px 10px', textAlign: 'center', background: form.frequency === opt.val ? 'rgba(197, 165, 114, 0.07)' : T.bgField, border: `1px solid ${form.frequency === opt.val ? T.gold : T.border}`, transition: 'all 0.2s' }}>
                      <div style={{ fontFamily: T.sans, fontWeight: 500, color: T.textPrimary, fontSize: 14 }}>{opt.kr}</div>
                      <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted, fontSize: 12 }}>{opt.en}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>시작일 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Start date</span> <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={fieldStyle} type="date" value={form.startDate} onChange={update('startDate')} />
              </div>
              <div>
                <label style={labelStyle}>자동 전환 목표 <span style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.textMuted }}>Auto-conversion target</span></label>
                <select style={{ ...fieldStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path d='M1 1l5 5 5-5' stroke='%23C5A572' fill='none' stroke-width='1.5'/></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: 40 }} value={form.conversionTarget} onChange={update('conversionTarget')}>
                  <option value="100g">100g 바 도달 시 전환</option>
                  <option value="1kg">1kg 바 도달 시 전환</option>
                  <option value="manual">수동 결정</option>
                </select>
                <p style={{ fontSize: 12, color: T.textMuted, marginTop: 6, fontFamily: T.sans }}>전환은 무료 · 언제든 변경 가능</p>
              </div>
            </div>

            <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>다음 · Continue →</button>
            </div>
          </FormStep>

          {/* SECTION 4: 결제 수단 */}
          <FormStep active={section === 4}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 26, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>결제 수단</h3>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.gold, fontSize: 15, marginBottom: 8 }}>Funding Method</div>
            <p style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 36, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
              {ko ? '세 가지 방식으로 AGP에 자금을 입금할 수 있습니다. 토스뱅크 자동이체가 수수료 가장 낮고 권장 방식입니다.' : 'Fund your AGP in three ways. Toss Bank auto-debit has the lowest fee and is the recommended method.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px),1fr))', gap: 12, marginBottom: 28 }}>
              <PaymentMethodCard
                value="toss" selected={form.payMethod} onChange={v => set('payMethod', v)}
                badge="권장 · Recommended" label="토스뱅크 자동이체" subtitle="Toss Bank auto-debit" fee="수수료 · ~0.3% (wire 2.5% 기준)"
              >
                {/* Conditional: bank verification */}
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 12, color: T.textMuted }}>은행 선택</label>
                      <select style={{ ...fieldStyle, fontSize: 13, appearance: 'none' }} value={form.bank} onChange={update('bank')}>
                        {['토스뱅크','카카오뱅크','KB국민은행','신한은행','우리은행','하나은행','IBK기업은행','NH농협은행','기타'].map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 12, color: T.textMuted }}>계좌번호</label>
                      <input style={{ ...fieldStyle, fontFamily: T.mono, fontSize: 13 }} type="text" placeholder="0000-00-0000000" value={form.accountNum} onChange={update('accountNum')} inputMode="numeric" />
                    </div>
                  </div>
                  <button
                    onClick={() => { set('accountVerified', true); alert('1원 송금 인증 성공 (mock) — 코드: 3712'); }}
                    style={{ ...btnSecondary, fontSize: 12, padding: '10px 18px', fontFamily: T.mono, letterSpacing: '0.08em', background: form.accountVerified ? 'rgba(74,222,128,0.07)' : 'transparent', borderColor: form.accountVerified ? '#4ade80' : T.borderStrong, color: form.accountVerified ? '#4ade80' : T.textPrimary }}
                  >
                    {form.accountVerified ? '✓ 계좌 인증 완료' : '1원 송금으로 계좌 인증'}
                  </button>
                  <p style={{ fontSize: 12, color: T.textMuted, marginTop: 10, fontFamily: T.sans }}>은행에서 1원과 함께 4자리 확인 코드가 입금됩니다. 해당 코드를 입력해 계좌 소유를 확인합니다.</p>
                </div>
              </PaymentMethodCard>

              <PaymentMethodCard
                value="card" selected={form.payMethod} onChange={v => set('payMethod', v)}
                badge="즉시 처리 · Instant" label="신용·체크카드" subtitle="Credit & debit card" fee="수수료 · ~5.5% (card 5.5% 기준)"
              >
                <div>
                  <label style={{ ...labelStyle, fontSize: 12 }}>카드 번호</label>
                  <input style={{ ...fieldStyle, fontFamily: T.mono, marginBottom: 10 }} type="text" placeholder="0000-0000-0000-0000" value={form.cardNum} onChange={update('cardNum')} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <input style={{ ...fieldStyle, fontFamily: T.mono }} type="text" placeholder="MM/YY" value={form.cardExpiry} onChange={update('cardExpiry')} />
                    <input style={{ ...fieldStyle, fontFamily: T.mono }} type="text" placeholder="CVC" value={form.cardCvc} onChange={update('cardCvc')} />
                  </div>
                  <input style={fieldStyle} type="text" placeholder="카드 소유자명" value={form.cardName} onChange={update('cardName')} />
                  <p style={{ fontSize: 12, color: T.textMuted, marginTop: 8, fontFamily: T.sans }}>Toss Payments 호스티드 필드 (PCI DSS 범위 최소화)</p>
                </div>
              </PaymentMethodCard>

              <PaymentMethodCard
                value="crypto" selected={form.payMethod} onChange={v => set('payMethod', v)}
                badge="저비용 · Low-fee" label="암호화폐 (USDT·USDC)" subtitle="Stablecoin transfer" fee="수수료 · ~2.0% (crypto 2.0% 기준)"
              >
                <div>
                  <div style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#f87171', fontFamily: T.sans, lineHeight: 1.6 }}>
                    ⚠️ {ko ? '암호화폐는 자동 반복 결제가 불가합니다. 매 주기마다 고유 입금 주소가 이메일로 전송됩니다.' : 'Crypto is not auto-recurring. A unique deposit address will be emailed each cycle.'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <select style={{ ...fieldStyle, fontSize: 13, appearance: 'none' }} value={form.cryptoCoin} onChange={update('cryptoCoin')}>
                      <option value="USDT">USDT</option>
                      <option value="USDC">USDC</option>
                    </select>
                    <select style={{ ...fieldStyle, fontSize: 13, appearance: 'none' }} value={form.cryptoNetwork} onChange={update('cryptoNetwork')}>
                      <option value="TRC20">TRC20 (권장)</option>
                      <option value="ERC20">ERC20</option>
                      <option value="Polygon">Polygon</option>
                    </select>
                  </div>
                  <input style={{ ...fieldStyle, fontFamily: T.mono, fontSize: 12 }} type="text" placeholder="지갑 주소 (선택)" value={form.cryptoWallet} onChange={update('cryptoWallet')} />
                </div>
              </PaymentMethodCard>
            </div>

            <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>다음 · Continue →</button>
            </div>
          </FormStep>

          {/* SECTION 5: 약관 동의 */}
          <FormStep active={section === 5}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 26, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>약관 동의</h3>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.gold, fontSize: 15, marginBottom: 8 }}>Terms &amp; Consent</div>
            <p style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 36, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
              {ko ? '필수 항목은 서비스 제공을 위해 반드시 동의가 필요합니다. 선택 항목은 마케팅 메일 수신 여부만 결정합니다.' : 'Required consents are necessary for service provision. The optional item only determines marketing email preferences.'}
            </p>

            {/* All toggle */}
            <div style={{ borderTop: `1px solid ${T.borderStrong}`, borderBottom: `1px solid ${T.borderStrong}`, marginBottom: 8, padding: '18px 0' }}>
              <ConsentCheckbox
                checked={form.consentAll}
                onChange={toggleAll}
                label="전체 약관에 동의합니다 · All of the below"
                required={false}
              />
            </div>

            {/* Required consents */}
            <div style={{ marginBottom: 20 }}>
              {[
                { key: 'consent1', label: '서비스 이용약관 동의', required: true },
                { key: 'consent2', label: '개인정보 수집·이용 동의 (PIPA)', required: true },
                { key: 'consent3', label: '개인정보 국외이전 동의 (싱가포르)', required: true },
                { key: 'consent4', label: '금융 정보 제공 동의 (오픈뱅킹)', required: true },
                { key: 'consent5', label: '투자 위험 고지 확인', required: true },
              ].map(c => (
                <ConsentCheckbox
                  key={c.key}
                  checked={form[c.key]}
                  onChange={v => set(c.key, v)}
                  label={c.label}
                  required={c.required}
                  onView={() => alert(`${c.label} 전문 (준비 중)`)}
                />
              ))}
            </div>

            {/* Optional consent — visually separated */}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
              <p style={{ fontSize: 12, color: T.textMuted, fontFamily: T.sans, marginBottom: 10 }}>선택 동의 항목 · Optional</p>
              <ConsentCheckbox
                checked={form.consent6}
                onChange={v => set('consent6', v)}
                label="마케팅 정보 수신 (이메일·SMS)"
                required={false}
                onView={() => alert('마케팅 수신 동의 안내 (준비 중)')}
              />
            </div>

            <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>다음 · Continue →</button>
            </div>
          </FormStep>

          {/* SECTION 6: 검토 및 제출 */}
          <FormStep active={section === 6}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 26, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>검토 및 제출</h3>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.gold, fontSize: 15, marginBottom: 8 }}>Review &amp; Submit</div>
            <p style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 36, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
              {ko ? '제출 전 입력 내용을 확인하세요. 신청 후 확인 이메일이 발송되고 KYC 심사가 24시간 내 완료됩니다.' : 'Review your details before submitting. A confirmation email will be sent and KYC review will complete within 24 hours.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {/* Identity card */}
              <div style={{ background: T.bgField, border: `1px solid ${T.border}`, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottom: `1px dashed ${T.border}` }}>
                  <span style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 14, color: T.textPrimary }}>본인 정보 · Identity</span>
                  <button onClick={() => gotoSection(1)} style={{ fontFamily: T.mono, fontSize: 10, color: T.gold, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>편집</button>
                </div>
                {[['성명', form.nameKr || '—'], ['영문명', form.nameEn || '—'], ['휴대폰', form.phone ? `${form.phone} ${form.passVerified ? '✓' : '미인증'}` : '—'], ['이메일', form.email || '—']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                    <span style={{ color: T.textMuted }}>{l}</span>
                    <span style={{ color: T.textPrimary, fontFamily: T.mono, fontSize: 12 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Plan card */}
              <div style={{ background: T.bgField, border: `1px solid ${T.border}`, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottom: `1px dashed ${T.border}` }}>
                  <span style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 14, color: T.textPrimary }}>AGP 플랜 · Plan</span>
                  <button onClick={() => gotoSection(3)} style={{ fontFamily: T.mono, fontSize: 10, color: T.gold, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>편집</button>
                </div>
                {[['자산 구성', form.composition], ['월 적립액', `₩${parseInt(form.monthlyAmount || 0).toLocaleString()}`], ['적립 주기', form.frequency === 'daily' ? '매일' : form.frequency === 'weekly' ? '매주' : '매월'], ['자동 전환', form.conversionTarget + ' 도달 시']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                    <span style={{ color: T.textMuted }}>{l}</span>
                    <span style={{ color: T.textPrimary, fontFamily: T.mono, fontSize: 12 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Payment card */}
              <div style={{ background: T.bgField, border: `1px solid ${T.border}`, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottom: `1px dashed ${T.border}` }}>
                  <span style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 14, color: T.textPrimary }}>결제 수단 · Payment</span>
                  <button onClick={() => gotoSection(4)} style={{ fontFamily: T.mono, fontSize: 10, color: T.gold, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>편집</button>
                </div>
                {[['방식', form.payMethod === 'toss' ? '토스뱅크 자동이체' : form.payMethod === 'card' ? '신용·체크카드' : '암호화폐 USDT·USDC'], ['수수료', form.payMethod === 'toss' ? '~0.3% (wire 2.5%)' : form.payMethod === 'card' ? '~5.5%' : '~2.0%']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                    <span style={{ color: T.textMuted }}>{l}</span>
                    <span style={{ color: T.textPrimary, fontFamily: T.mono, fontSize: 12 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>신청 완료 · Submit →</button>
            </div>
          </FormStep>

        </main>
      </div>

      {/* Mobile responsive sidebar */}
      <style>{`
        @media (max-width: 860px) {
          .agp-enroll-grid { grid-template-columns: 1fr !important; }
          .agp-enroll-sidebar { position: static !important; }
        }
      `}</style>
    </div>
  );
}
