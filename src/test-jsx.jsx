import { useState } from 'react';

const GOLD_PRICE = 4750.00;
const KRW = 1395.00;

function fUSD(n) { return `$${n.toFixed(2)}`; }
function fKRW(n) { return `\u20a9${n.toLocaleString()}`; }

const DATA = [
  { id: 1, name: '\uae08\ubc14', price: 4892.50, ko: '\uc218\uccad \ub144\uac04' },
  { id: 2, name: 'Gold Bar', price: 4945.20, ko: '\uc218\uccad \ub144\uac04' },
];

export default function Test() {
  const [qty, setQty] = useState(1);
  const total = GOLD_PRICE * qty * KRW;
  return (
    <div style={{ background: '#0a0a0a', color: '#f5f0e8' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif" }}>Test</h1>
      <p>{fUSD(total)} / {fKRW(total)}</p>
      <button onClick={() => setQty(q => q + 1)}>+</button>
    </div>
  );
}
