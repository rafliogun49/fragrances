type OptionCardProps = {
  value: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
  compact?: boolean;
};

export function OptionCard({ label, selected, onClick, multiSelect, compact }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border-2 transition-all duration-150 font-medium ${compact ? 'px-3 py-3 text-sm' : 'px-5 py-4'}`}
      style={{
        borderColor: selected ? 'var(--color-primary)' : 'var(--color-hairline)',
        backgroundColor: selected ? 'rgba(255,56,92,0.04)' : 'var(--color-canvas)',
        color: selected ? 'var(--color-primary)' : 'var(--color-ink)',
        borderRadius: 'var(--r-md)',
      }}
    >
      <span className="flex items-center gap-3">
        <span
          className="w-5 h-5 flex-shrink-0 transition-all duration-150 flex items-center justify-center border-2"
          style={{
            borderRadius: multiSelect ? '4px' : '50%',
            borderColor: selected ? 'var(--color-primary)' : 'var(--color-hairline)',
            backgroundColor: selected ? 'var(--color-primary)' : 'transparent',
          }}
        >
          {selected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        {label}
      </span>
    </button>
  );
}
