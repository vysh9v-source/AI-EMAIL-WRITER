import React from 'react';
import { EXAMPLE_PROMPTS } from '../utils/emailGenerator';
import { GraduationCap, Briefcase, Calendar, HeartHandshake, Send, KeyRound, Sparkles } from 'lucide-react';

const ICON_MAP = {
  GraduationCap: GraduationCap,
  Briefcase: Briefcase,
  Calendar: Calendar,
  HeartHandshake: HeartHandshake,
  Send: Send,
  KeyRound: KeyRound,
};

export default function ExamplePromptsSection({ onSelectPrompt, selectedPromptTitle }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-8">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Quick Start Examples
          </h2>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Click an example to pre-fill the form
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {EXAMPLE_PROMPTS.map((prompt, idx) => {
          const Icon = ICON_MAP[prompt.icon] || Sparkles;
          const isSelected = selectedPromptTitle === prompt.title;

          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(prompt)}
              className={`group relative text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-indigo-200 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-2.5 mb-2">
                <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-slate-200 group-hover:bg-indigo-50'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1">
                    "{prompt.label}"
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200/60 text-slate-700">
                      To: {prompt.recipient}
                    </span>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-100/60 text-indigo-800">
                      {prompt.tone}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
