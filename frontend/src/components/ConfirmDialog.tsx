import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fadeIn"
    >
      <div className="bg-cream-50 rounded-xl max-w-sm w-full border border-cream-300/90 shadow-2xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
              isDestructive ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {isDestructive ? <Trash2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <h3 id="confirm-dialog-title" className="font-serif text-base font-bold text-charcoal-900 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-charcoal-800/70 mt-0.5 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-charcoal-800/40 hover:text-charcoal-900 transition-colors p-1 rounded"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-cream-200/80">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded text-xs font-semibold text-charcoal-800 hover:bg-cream-200/70 border border-cream-300/80 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmBtnRef}
            onClick={onConfirm}
            className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider text-white shadow-subtle transition-colors ${
              isDestructive ? 'bg-red-700 hover:bg-red-800' : 'bg-forest-800 hover:bg-forest-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
