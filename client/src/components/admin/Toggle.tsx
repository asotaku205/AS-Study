type ToggleProps = {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

const Toggle = ({ enabled, onChange, disabled = false }: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        enabled
          ? "bg-slate-900 dark:bg-white"
          : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-900 shadow transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default Toggle;
