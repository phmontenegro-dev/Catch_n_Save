import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gold-500 text-bg-void font-semibold hover:bg-gold-100 active:scale-[0.98] shadow-[0_3px_0_0_rgb(var(--gold-700)),0_6px_20px_-6px_rgba(245,197,24,0.4)] hover:shadow-[0_2px_0_0_rgb(var(--gold-700)),0_8px_24px_-6px_rgba(245,197,24,0.5)]',
        outline:
          'border border-border-glass bg-transparent text-text-primary font-medium hover:bg-bg-slate hover:border-text-muted',
        ghost: 'text-text-primary font-medium hover:bg-bg-slate',
      },
      size: {
        sm: 'h-10 px-5 text-sm',
        md: 'h-12 px-7 text-sm',
        lg: 'h-14 px-9 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);

Button.displayName = 'Button';
