type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
          {current} of {total}
        </span>
        <span className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
          {pct}%
        </span>
      </div>
      <div
        className="w-full h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-hairline)' }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: 'var(--color-primary)',
          }}
        />
      </div>
    </div>
  );
}
