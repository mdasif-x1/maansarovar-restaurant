import React, { useEffect, useRef } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';

export interface InlineConfirmProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  align?: 'left' | 'right' | 'center';
  onConfirm: () => void;
  onCancel: () => void;
}

export const InlineConfirm: React.FC<InlineConfirmProps> = ({
  isOpen,
  title,
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  align = 'right',
  onConfirm,
  onCancel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onCancel();
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          onCancel();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const alignClass =
    align === 'left'
      ? 'left-0 origin-top-left'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2 origin-top'
      : 'right-0 origin-top-right';

  return (
    <div
      ref={containerRef}
      role="alertdialog"
      aria-modal="false"
      aria-label={title}
      className={`absolute ${alignClass} z-30 mt-1.5 w-72 rounded-xl bg-cream-50 p-3.5 shadow-xl border border-cream-300 ring-1 ring-charcoal-950/5 text-charcoal-900 transition-all duration-150 animate-fadeIn`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
            isDestructive
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isDestructive ? <Trash2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-charcoal-900 truncate leading-snug" title={title}>
            {title}
          </p>
          <p className="text-[11px] text-charcoal-800/70 mt-0.5 leading-tight">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-cream-200/80">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="px-2.5 py-1 text-xs font-semibold text-charcoal-800 hover:text-charcoal-950 hover:bg-cream-200/60 rounded-md transition-colors border border-cream-300/80 focus:outline-none focus:ring-1 focus:ring-charcoal-400"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          ref={confirmBtnRef}
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md text-white transition-colors shadow-xs focus:outline-none ${
            isDestructive
              ? 'bg-red-700 hover:bg-red-800 focus:ring-2 focus:ring-red-600/30'
              : 'bg-forest-800 hover:bg-forest-700 focus:ring-2 focus:ring-forest-700/30'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
};
