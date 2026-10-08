import React from 'react';
import { 
  User, 
  Target, 
  Sliders, 
  MessageSquareText, 
  Wand2, 
  RotateCcw, 
  Sparkles,
  UserCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  MoreHorizontal
} from 'lucide-react';

const RECIPIENTS = [
  { id: 'Professor', label: 'Professor', icon: GraduationCap },
  { id: 'HR', label: 'HR', icon: Building2 },
  { id: 'Manager', label: 'Manager', icon: Briefcase },
  { id: 'Client', label: 'Client', icon: UserCheck },
  { id: 'Friend', label: 'Friend', icon: Users },
  { id: 'Other', label: 'Other', icon: MoreHorizontal },
];

const PURPOSES = [
  'Leave Request',
  'Job Application',
  'Meeting Request',
  'Complaint',
  'Thank You',
  'Follow-up',
  'Permission Request',
  'Other',
];

const TONES = [
  { id: 'Professional', label: 'Professional', desc: 'Balanced, respectful & workplace-ready' },
  { id: 'Formal', label: 'Formal', desc: 'High etiquette, precise & structured' },
  { id: 'Friendly', label: 'Friendly', desc: 'Warm, approachable & conversational' },
  { id: 'Concise', label: 'Concise', desc: 'Short, direct & to the point' },
];

export default function FormSection({
  recipient,
  setRecipient,
  purpose,
  setPurpose,
  tone,
  setTone,
  details,
  setDetails,
  senderName,
  setSenderName,
  recipientName,
  setRecipientName,
  onGenerate,
  onClear,
  isGenerating,
}) {

  const handleInsertSnippet = (text) => {
    setDetails((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Email Specifications</h2>
            <p className="text-xs text-slate-500">Configure parameters to customize your email output</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors py-1 px-2.5 rounded-lg hover:bg-rose-50"
          title="Reset form"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Form
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }} className="space-y-6">
        
        {/* Recipient Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            1. Select Recipient
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {RECIPIENTS.map((item) => {
              const Icon = item.icon;
              const active = recipient === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRecipient(item.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20 scale-[1.02]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1.5 ${active ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email Purpose */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            2. Email Purpose
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PURPOSES.map((item) => {
              const active = purpose === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPurpose(item)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            3. Choose Tone
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {TONES.map((item) => {
              const active = tone === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTone(item.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs mb-0.5">{item.label}</div>
                  <div className={`text-[11px] leading-tight ${active ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Name Inputs for personalization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Your Name (Sender) - Optional
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Recipient Name - Optional
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Smith / Jane Doe"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Additional Details Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquareText className="w-3.5 h-3.5 text-indigo-600" />
              4. Additional Details
            </label>
            <span className="text-[11px] text-slate-400">
              {details.length} characters
            </span>
          </div>

          <textarea
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe what you want to say in detail... (e.g. dates, key reasons, specific projects, requirements, or deadlines)"
            className="w-full text-sm p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400 transition-all resize-y"
          />

          {/* Quick Helper Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] font-medium text-slate-400">Quick inserts:</span>
            <button
              type="button"
              onClick={() => handleInsertSnippet("Available starting next Monday.")}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              + Next Monday
            </button>
            <button
              type="button"
              onClick={() => handleInsertSnippet("Happy to schedule a call at your convenience.")}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              + Request Call
            </button>
            <button
              type="button"
              onClick={() => handleInsertSnippet("Please see attached document for details.")}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              + Attachment Ref
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md ${
              isGenerating
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] shadow-indigo-500/25'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Email...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-indigo-200" />
                <span>Generate Email</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
