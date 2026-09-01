import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  declarationText?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = 'Confirm Submission',
  declarationText = 'We hereby confirm that all statements, information, documents, and answers provided in this application are true, authentic, and complete. We understand that suppression of any material fact or submission of false information will result in disqualification and immediate cancellation of vendor empanelment by DMRC.',
  confirmText = 'I Agree & Confirm Submit',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-dmrc-red mb-4">
          <div className="w-10 h-10 rounded-full bg-dmrc-lightRed flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-dmrc-red" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-outfit">{title}</h3>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            "{declarationText}"
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 bg-dmrc-red hover:bg-dmrc-darkRed text-white text-sm font-bold rounded-lg shadow-sm hover:shadow flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Submitting...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
