'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface ConsoleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

const ConsoleInput = forwardRef<HTMLInputElement, ConsoleInputProps>(
  ({ label, error, required, hint, id, className = '', ...rest }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`group space-y-1.5 ${className}`}>
        <label
          htmlFor={inputId}
          className="flex items-baseline gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-outline"
        >
          <span className="text-primary/50 select-none">{'>'}</span>
          {label}
          {required && <span className="text-primary">*</span>}
        </label>
        {hint && (
          <p className="text-[10px] text-outline/60 leading-tight pl-3">{hint}</p>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`
            w-full border bg-surface-container-lowest/60 px-3 py-2
            font-body text-sm text-on-surface placeholder:text-outline/40
            transition-all duration-200
            focus:outline-none focus:ring-1
            ${error
              ? 'border-error/60 focus:border-error focus:ring-error/40'
              : 'border-outline-variant/30 focus:border-primary/60 focus:ring-primary/30'
            }
            hover:border-outline-variant/50
          `}
          {...rest}
        />
        {error && (
          <p
            id={`${inputId}-error`}
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

ConsoleInput.displayName = 'ConsoleInput';
export default ConsoleInput;
