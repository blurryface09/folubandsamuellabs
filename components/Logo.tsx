export default function Logo({ size = 40 }: { size?: number }) {
  const s = size / 80;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d060" />
          <stop offset="45%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#9a7228" />
        </linearGradient>
      </defs>
      <path d="M40 8 L60 8 L60 32 L48 40 L60 40 L60 52" fill="none" stroke="url(#logoGold)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40 72 L20 72 L20 48 L32 40 L20 40 L20 28" fill="none" stroke="url(#logoGold)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="20" y1="40" x2="60" y2="40" stroke="url(#logoGold)" strokeWidth="9" strokeLinecap="round"/>
    </svg>
  );
}
