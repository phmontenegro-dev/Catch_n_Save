import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertVariant = 'error' | 'success' | 'info';

type AlertProps = {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const VARIANT_STYLES: Record<AlertVariant, { container: string; icon: React.ReactNode }> = {
  error: {
    container: 'bg-signal-down/10 border-signal-down/30 text-signal-down',
    icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
  },
  success: {
    container: 'bg-signal-up/10 border-signal-up/30 text-signal-up',
    icon: <CheckCircle2 className="w-4 h-4 flex-shrink-0" />,
  },
  info: {
    container: 'bg-gold-500/10 border-gold-500/30 text-gold-500',
    icon: <Info className="w-4 h-4 flex-shrink-0" />,
  },
};

export function Alert({ variant, title, children, className }: AlertProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-3 border rounded-lg text-sm',
        styles.container,
        className,
      )}
    >
      {styles.icon}
      <div className="flex-1">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
