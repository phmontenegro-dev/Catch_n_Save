'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, type = 'text', className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const inputId = id ?? props.name;

    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-text-primary">
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-lg',
              'bg-bg-ink border border-border-mist',
              'text-text-primary placeholder:text-text-faded',
              'focus:outline-none focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/20',
              'transition-all',
              error &&
                'border-signal-down/60 focus:border-signal-down/60 focus:ring-signal-down/20',
              isPassword && 'pr-10',
              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-signal-down">{error}</p>}
        {!error && hint && <p className="text-xs text-text-faded">{hint}</p>}
      </div>
    );
  },
);

FormField.displayName = 'FormField';
