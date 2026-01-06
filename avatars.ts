const svgToDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

// Martin: Confused, scratchy head, question marks
export const MARTIN_AVATAR = svgToDataUri(`
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#8ca2ad"/>
  <circle cx="50" cy="60" r="30" fill="#f5d0b0"/>
  <path d="M35 55 Q50 55 65 55" stroke="#333" stroke-width="3" fill="none"/>
  <circle cx="40" cy="50" r="4" fill="#333"/>
  <circle cx="60" cy="50" r="4" fill="#333"/>
  <path d="M45 75 Q50 65 55 75" stroke="#333" stroke-width="3" fill="none"/>
  <text x="75" y="40" font-family="sans-serif" font-size="40" font-weight="bold" fill="#fff" transform="rotate(15 75 40)">?</text>
  <text x="25" y="30" font-family="sans-serif" font-size="30" font-weight="bold" fill="#fff" transform="rotate(-15 25 30)">?</text>
</svg>
`);

// Aria: Glasses, focused, book/learning
export const ARIA_AVATAR = svgToDataUri(`
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#6e96bb"/>
  <path d="M50 90 Q20 90 20 40 Q20 10 50 10 Q80 10 80 40 Q80 90 50 90" fill="#5c4033"/>
  <circle cx="50" cy="55" r="28" fill="#f5d0b0"/>
  <g stroke="#333" stroke-width="2" fill="#fff" opacity="0.8">
    <circle cx="40" cy="52" r="10"/>
    <circle cx="60" cy="52" r="10"/>
    <line x1="50" y1="52" x2="50" y2="52" stroke-width="2"/>
  </g>
  <path d="M45 70 Q50 75 55 70" stroke="#d67a7a" stroke-width="2" fill="none"/>
</svg>
`);

// Bob: Fire, sunglasses, cool
export const BOB_AVATAR = svgToDataUri(`
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#c4a450"/>
  <path d="M50 15 Q70 40 70 50 Q70 65 50 65 Q30 65 30 50 Q30 40 50 15" fill="#ff4d00"/>
  <path d="M50 25 Q60 40 60 50 Q60 58 50 58 Q40 58 40 50 Q40 40 50 25" fill="#ffcc00"/>
  <circle cx="50" cy="65" r="25" fill="#f5d0b0"/>
  <path d="M35 60 H65 V70 H35 Z" fill="#000"/>
  <path d="M45 80 Q50 82 55 80" stroke="#333" stroke-width="2" fill="none"/>
</svg>
`);

// Elena: Elderly, tea, calm
export const ELENA_AVATAR = svgToDataUri(`
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#d67575"/>
  <circle cx="50" cy="50" r="35" fill="#ddd"/> 
  <circle cx="50" cy="60" r="28" fill="#f5d0b0"/>
  <path d="M35 55 Q40 50 45 55" stroke="#999" stroke-width="2" fill="none"/>
  <path d="M55 55 Q60 50 65 55" stroke="#999" stroke-width="2" fill="none"/>
  <path d="M40 75 Q50 85 60 75" stroke="#d67a7a" stroke-width="2" fill="none"/>
  <circle cx="30" cy="80" r="10" fill="#fff" stroke="#ccc"/>
  <path d="M30 75 V65" stroke="#fff" stroke-width="2" opacity="0.6"/>
</svg>
`);

// Sven: Cyber, visor, digital
export const SVEN_AVATAR = svgToDataUri(`
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#2b2b2b"/>
  <path d="M0 0 L100 100 M100 0 L0 100" stroke="#6f528a" stroke-width="1" opacity="0.5"/>
  <circle cx="50" cy="60" r="30" fill="#e0c0a0"/>
  <rect x="30" y="50" width="40" height="10" fill="#0ff" opacity="0.6"/>
  <path d="M25 55 H75" stroke="#0ff" stroke-width="1"/>
  <path d="M45 75 Q50 78 55 75" stroke="#333" stroke-width="2" fill="none"/>
  <circle cx="20" cy="20" r="2" fill="#0ff"/>
  <circle cx="80" cy="80" r="2" fill="#0ff"/>
</svg>
`);

// Antonio: Classy, beard, suit
export const ANTONIO_AVATAR = svgToDataUri(`
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#a83232"/>
  <circle cx="50" cy="60" r="30" fill="#f5d0b0"/>
  <path d="M30 60 Q50 90 70 60 L70 50 H30 Z" fill="#ccc"/> 
  <path d="M40 70 Q50 80 60 70" stroke="#333" stroke-width="2" fill="none"/>
  <circle cx="40" cy="55" r="3" fill="#333"/>
  <circle cx="60" cy="55" r="3" fill="#333"/>
  <path d="M20 100 L50 80 L80 100" fill="#111"/>
  <path d="M45 85 L55 85 L52 90 L48 90 Z" fill="#000"/>
</svg>
`);

// User: Generic happy player
export const USER_AVATAR = svgToDataUri(`
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#81b64c"/>
  <circle cx="50" cy="55" r="30" fill="#f5d0b0"/>
  <circle cx="40" cy="45" r="4" fill="#333"/>
  <circle cx="60" cy="45" r="4" fill="#333"/>
  <path d="M35 65 Q50 80 65 65" stroke="#333" stroke-width="3" stroke-linecap="round" fill="none"/>
</svg>
`);