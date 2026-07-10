export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="332 415 600 600"
      role="img"
      aria-label="KoThok"
      fill="none"
    >
      <g transform="translate(362, 380)">
        <rect x="0" y="75" width="150" height="520" rx="75" ry="75" fill="#F42A41" />
        <path
          d="M 500,85 C 530,65 540,85 540,120 L 540,550 C 540,585 530,605 500,585 L 210,365 C 180,345 180,325 210,305 Z"
          fill="#006A4E"
        />
      </g>
    </svg>
  );
}
