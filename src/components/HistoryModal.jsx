import React from 'react';
import { X, History, Copy, Trash2, ExternalLink, Calendar } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, history, onSelectHistoryItem, onClearHistory, onCopyToast }) {
  if (!isOpen) return null;

  const handleCopyItem = (item) => {
    const fullText = `SUBJECT:\n${item.subject}\n\nEMAIL:\n${item.body}`;
    navigator.clipboard.writeText(fullText);
    onCopyToast("Email copied from history!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Saved Email Drafts History</h3>
              <p className="text-xs text-slate-500">View and reuse past generated emails</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No saved drafts yet</p>
              <p className="text-xs">Emails you generate will appear here automatically.</p>
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all text-left group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {item.meta.purpose}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      To: {item.meta.recipient}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      • {item.meta.generatedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyItem(item)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectHistoryItem(item);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1 text-xs font-medium px-2.5"
                    >
                      <span>Load</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">
                  Subject: {item.subject}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.body}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Drafts are stored locally in your session browser storage.
        </div>

      </div>
    </div>
  );
}
