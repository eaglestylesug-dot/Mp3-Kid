import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Flag, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ReportModalProps {
  contentType: 'song' | 'artist' | 'album' | 'comment';
  contentId: string;
  contentTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  contentType,
  contentId,
  contentTitle,
  isOpen,
  onClose
}) => {
  const { showToast } = useToast();
  const [reason, setReason] = useState<string>('copyright');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.reportContent({
        contentType,
        contentId,
        contentTitle,
        reason,
        details
      });
      setSubmitted(true);
      showToast('Report submitted successfully for administrative review.', 'success');
    } catch {
      showToast('Error submitting report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#12131d] border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Report Received</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Thank you for protecting our community. The Eagle Icon Music administrative review team will examine this within 24 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2.5 mb-4 text-amber-400">
              <Flag className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Report Content</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 truncate">
              Reporting: <strong className="text-slate-200">{contentTitle}</strong> ({contentType})
            </p>

            <div className="space-y-3 mb-4">
              <label className="text-xs font-semibold text-slate-300 block">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="copyright">Copyright Infringement / DMCA Notice</option>
                <option value="incorrect_metadata">Incorrect Artist / Song / Title Information</option>
                <option value="poor_audio">Poor Audio Quality / Glitched Recording</option>
                <option value="explicit">Unmarked Explicit / Inappropriate Content</option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Additional Details</label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe the issue or cite rights ownership info..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>False copyright claims or malicious reports are strictly against platform guidelines.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
