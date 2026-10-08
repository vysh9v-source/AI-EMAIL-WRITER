import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 text-white border-emerald-700 shadow-emerald-500/10',
    error: 'bg-rose-900/90 text-white border-rose-700 shadow-rose-500/10',
    info: 'bg-indigo-900/90 text-white border-indigo-700 shadow-indigo-500/10',
  }[type] || 'bg-slate-900 text-white border-slate-700';

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type] || CheckCircle2;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short transition-all duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg ${bgStyles}`}>
        <Icon className="w-5 h-5 shrink-0 text-emerald-400" />
        <span className="text-sm font-medium pr-2">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors text-slate-300 hover:text-white"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
