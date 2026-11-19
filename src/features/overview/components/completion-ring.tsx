/** Profile completion ring (Figma: Ellipse 2341/2343, ~93px ring in a 127px box, rotated 30°). */
export function CompletionRing({ percent }: { percent: number }) {
  const size = 93;
  const stroke = 5.6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      role="img"
      aria-label={`Profile ${clamped}% complete`}
      className="relative flex size-[127px] shrink-0 items-center justify-center"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-30"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F5F6F6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#063231"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute font-onest text-[24px] leading-[1.2] font-semibold text-brand-900">
        {clamped}%
      </span>
    </div>
  );
}
