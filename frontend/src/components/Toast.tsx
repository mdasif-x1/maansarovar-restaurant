import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      bg: 'bg-emerald-900/95 text-emerald-50 border-emerald-700/80',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />,
    },
    error: {
      bg: 'bg-red-950/95 text-red-50 border-red-800/80',
      icon: <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />,
    },
    info: {
      bg: 'bg-charcoal-900/95 text-cream-50 border-charcoal-700/80',
      icon: <Info className="w-4 h-4 text-saffron-400 shrink-0" />,
    },
  }[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-xs font-sans max-w-md animate-fadeIn backdrop-blur-sm ${config.bg}`}
    >
      {config.icon}
      <span className="flex-1 font-medium leading-snug">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded hover:bg-white/10 transition-colors text-cream-200/70 hover:text-white"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
