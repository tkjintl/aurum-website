export default function Logo({ size = 40, showWordmark = true, onClick }) {
  return (
    <a
      href="/"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '14px',
        textDecoration: 'none',
      }}
    >
      <span
        className="aurum-logo-mark"
        style={{
          width: size,
          height: size,
          border: '1px solid rgba(197, 165, 114, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: size * 0.42,
          fontWeight: 500,
          color: '#C5A572',
          letterSpacing: '0.04em',
          transition: 'border-color 0.3s ease',
          flexShrink: 0,
        }}
      >
        AU
      </span>
      {showWordmark && (
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: size * 0.52,
            fontWeight: 500,
            letterSpacing: '0.32em',
            color: '#f5f0e8',
          }}
        >
          AURUM
        </span>
      )}
    </a>
  );
}
