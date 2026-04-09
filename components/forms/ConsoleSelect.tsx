'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';

interface ConsoleSelectOption {
  value: string;
  label: string;
}

interface ConsoleSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly ConsoleSelectOption[];
  error?: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
}

const ConsoleSelect = forwardRef<HTMLSelectElement, ConsoleSelectProps>(
  ({ label, options, error, required, hint, placeholder, id, className = '', ...rest }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`group space-y-1.5 ${className}`}>
        <label
          htmlFor={selectId}
          className="flex items-baseline gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-outline"
        >
          <span className="text-primary/50 select-none">{'>'}</span>
          {label}
          {required && <span className="text-primary">*</span>}
        </label>
        {hint && (
          <p className="text-[10px] text-outline/60 leading-tight pl-3">{hint}</p>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={`
            w-full border bg-surface-container-lowest/60 px-3 py-2
            font-body text-sm text-on-surface
            transition-all duration-200 appearance-none cursor-pointer
            focus:outline-none focus:ring-1
            ${error
              ? 'border-error/60 focus:border-error focus:ring-error/40'
              : 'border-outline-variant/30 focus:border-primary/60 focus:ring-primary/30'
            }
            hover:border-outline-variant/50
          `}
          defaultValue=""
          {...rest}
        >
          <option value="" disabled className="text-outline/40">
            {placeholder || `Select ${label.toLowerCase()}...`}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-on-surface">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={`${selectId}-error`}
            role="alert"
            className="flex items-center gap-1.5 text-[10px] text-error pl-3"
          >
            <span className="select-none">⚠</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

ConsoleSelect.displayName = 'ConsoleSelect';
export default ConsoleSelect;
