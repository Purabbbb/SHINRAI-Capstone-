import { cn } from "@/lib/utils";

export function ShinraiMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#12121c" stroke="#8b7cff" strokeWidth="1.2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={16 + Math.cos(r) * 7}
            y1={16 + Math.sin(r) * 7}
            x2={16 + Math.cos(r) * 13}
            y2={16 + Math.sin(r) * 13}
            stroke="#8b7cff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        );
      })}
      <rect x="11" y="12" width="10" height="8" rx="3" fill="#ff5a8a" />
      <circle cx="14.2" cy="16" r="0.9" fill="#070712" />
      <circle cx="17.8" cy="16" r="0.9" fill="#070712" />
    </svg>
  );
}

export function ShinraiWordmark({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <ShinraiMark />
      <div className="leading-tight">
        <div className="font-display text-base font-bold tracking-tight text-fg">Shinrai</div>
        {!compact && <div className="text-[11px] text-muted">From Concern to Completion</div>}
      </div>
    </div>
  );
}
