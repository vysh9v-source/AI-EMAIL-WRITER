import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Download, 
  Sparkles, 
  Clock, 
  FileText, 
  Share2,
  CheckCircle2
} from 'lucide-react';

export default function EmailResultSection({
  result,
  isGenerating,
  onCopy,
  onRegenerate,
  onClear,
  onUpdateResult,
}) {
  const [copiedType, setCopiedType] = useState(null); // 'full' | 'subject' | 'body'
  const [isEditing, setIsEditing] = useState(false);

  // If currently generating, render realistic AI process loader
  if (isGenerating) {
    return (
      <div className="bg-white rounded-2xl border border-indigo-100 p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[380px]">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
            <Sparkles className="w-8 h-8 animate-pulse text-indigo-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
        </div>
        
        <h3 className="text-base font-bold text-slate-800 mb-2">
          Generating Your Custom Email
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          Analyzing recipient role, purpose, and tone parameters to craft a high-quality email draft...
        </p>

        {/* Dynamic step bar */}
        <div className="w-full max-w-xs space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Context Analysis Complete
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-700">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-spin"></span>
            Formulating Subject Line & Body...
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-indigo-600 h-full animate-pulse w-3/4 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no result yet, display placeholder empty state
  if (!result) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-slate-700 mb-1">
          No Email Generated Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mb-4">
          Select your recipient, purpose, tone, and click "Generate Email" to craft a personalized message.
        </p>
        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Instant local generation • High privacy
        </span>
      </div>
    );
  }

  // Action handlers
  const handleCopyFull = () => {
    const fullText = `SUBJECT:\n${result.subject}\n\nEMAIL:\n${result.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedType('full');
    onCopy("Email copied successfully!");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopySubject = () => {
    navigator.clipboard.writeText(result.subject);
    setCopiedType('subject');
    onCopy("Subject copied to clipboard!");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(result.body);
    setCopiedType('body');
    onCopy("Email body copied to clipboard!");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownload = () => {
    const textContent = `SUBJECT:\n${result.subject}\n\nEMAIL:\n${result.body}`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `email-${result.meta.purpose.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onCopy("Email downloaded as text file!");
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-100/80 shadow-md p-6 flex flex-col justify-between">
      
      {/* Top Header Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
              Generated Email Output
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Meta Tags */}
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              {result.meta.wordCount} words
            </span>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              {result.meta.tone}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium border flex items-center gap-1 transition-colors ${
                isEditing
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'Editing' : 'Edit'}
            </button>
          </div>
        </div>

        {/* SUBJECT BOX */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              SUBJECT:
            </span>
            <button
              onClick={handleCopySubject}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              {copiedType === 'subject' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedType === 'subject' ? 'Copied!' : 'Copy Subject'}
            </button>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={result.subject}
              onChange={(e) => onUpdateResult({ ...result, subject: e.target.value })}
              className="w-full text-sm font-semibold p-3 bg-amber-50/50 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
            />
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm text-slate-900 select-all">
              {result.subject}
            </div>
          )}
        </div>

        {/* EMAIL BODY BOX */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              EMAIL:
            </span>
            <button
              onClick={handleCopyBody}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              {copiedType === 'body' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedType === 'body' ? 'Copied!' : 'Copy Body'}
            </button>
          </div>
          {isEditing ? (
            <textarea
              rows={10}
              value={result.body}
              onChange={(e) => onUpdateResult({ ...result, body: e.target.value })}
              className="w-full text-sm p-4 bg-amber-50/50 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans text-slate-800 leading-relaxed"
            />
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-all">
              {result.body}
            </div>
          )}
        </div>
      </div>

      {/* RESULT ACTIONS BAR */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Main Copy Button */}
        <button
          type="button"
          onClick={handleCopyFull}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2 transition-all shadow-sm ${
            copiedType === 'full'
              ? 'bg-emerald-600 shadow-emerald-500/20 scale-[1.02]'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-indigo-500/20'
          }`}
        >
          {copiedType === 'full' ? (
            <>
              <Check className="w-4 h-4" />
              <span>Email Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Email</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {/* Regenerate Button */}
          <button
            type="button"
            onClick={onRegenerate}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
            title="Generate another version with current settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Regenerate
          </button>

          {/* Download Text Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Download as text file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={onClear}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Clear result"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
