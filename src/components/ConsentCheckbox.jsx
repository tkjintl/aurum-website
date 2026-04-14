// Reusable consent checkbox with PIPA-compliant styling
export default function ConsentCheckbox({ checked, onChange, label, required, onView }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '16px 0',
        borderBottom: '1px dashed rgba(197, 165, 114, 0.2)',
        cursor: 'pointer',
      }}
      onClick={() => onChange(!checked)}
    >
      <div style={{
        width: 18,
        height: 18,
        border: `1.5px solid ${checked ? '#C5A572' : 'rgba(197, 165, 114, 0.3)'}`,
        background: checked ? '#C5A572' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
        transition: 'all 0.2s',
      }}>
        {checked && <span style={{ color: '#0a0a0a', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Noto Sans KR', 'Outfit', sans-serif", color: '#f5f0e8', fontSize: 14 }}>
          <span>{label}</span>
          {required ? (
            <span style={{ color: '#C5A572', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>[필수]</span>
          ) : (
            <span style={{ color: '#8a7d6b', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>[선택]</span>
          )}
          {onView && (
            <button
              onClick={e => { e.stopPropagation(); onView(); }}
              style={{ marginLeft: 'auto', fontSize: 11, color: '#8a7d6b', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              View →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
