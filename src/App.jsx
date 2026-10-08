import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ExamplePromptsSection from './components/ExamplePromptsSection';
import FormSection from './components/FormSection';
import EmailResultSection from './components/EmailResultSection';
import HistoryModal from './components/HistoryModal';
import Toast from './components/Toast';
import { generateEmail } from './utils/emailGenerator';
import { Sparkles, ShieldCheck, Zap, Mail, ArrowRight, Heart } from 'lucide-react';

export default function App() {
  // Form State
  const [recipient, setRecipient] = useState('Professor');
  const [purpose, setPurpose] = useState('Leave Request');
  const [tone, setTone] = useState('Professional');
  const [details, setDetails] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [variationIndex, setVariationIndex] = useState(0);

  // Application State
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedPromptTitle, setSelectedPromptTitle] = useState(null);

  const resultRef = useRef(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_email_writer_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newResult) => {
    const updated = [newResult, ...history.filter(h => h.subject !== newResult.subject)].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem('ai_email_writer_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Main email generator trigger
  const handleGenerate = (customIndex = null) => {
    setIsGenerating(true);
    const idxToUse = customIndex !== null ? customIndex : variationIndex;

    // Simulate fast typing/AI response generation
    setTimeout(() => {
      const generated = generateEmail({
        recipient,
        purpose,
        tone,
        details,
        senderName,
        recipientName,
        variationIndex: idxToUse,
      });

      setResult(generated);
      setIsGenerating(false);
      saveToHistory(generated);

      // Smooth scroll to result
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }, 650);
  };

  // Regenerate handler
  const handleRegenerate = () => {
    const nextIdx = variationIndex + 1;
    setVariationIndex(nextIdx);
    handleGenerate(nextIdx);
    showToast("Regenerated new version!", "info");
  };

  // Clear form & results
  const handleClear = () => {
    setRecipient('Professor');
    setPurpose('Leave Request');
    setTone('Professional');
    setDetails('');
    setSenderName('');
    setRecipientName('');
    setVariationIndex(0);
    setResult(null);
    setSelectedPromptTitle(null);
    showToast("Form cleared!", "info");
  };

  // Example Prompt selection
  const handleSelectPrompt = (prompt) => {
    setRecipient(prompt.recipient);
    setPurpose(prompt.purpose);
    setTone(prompt.tone);
    setDetails(prompt.details);
    setSelectedPromptTitle(prompt.title);
    setVariationIndex(0);
    showToast(`Loaded example: "${prompt.title}"`, "info");
    
    // Automatically trigger generation for prompt
    setTimeout(() => {
      const generated = generateEmail({
        recipient: prompt.recipient,
        purpose: prompt.purpose,
        tone: prompt.tone,
        details: prompt.details,
        senderName: '',
        recipientName: '',
        variationIndex: 0,
      });

      setResult(generated);
      saveToHistory(generated);
    }, 300);
  };

  // Load history item
  const handleSelectHistoryItem = (item) => {
    setRecipient(item.meta.recipient || 'Manager');
    setPurpose(item.meta.purpose || 'Leave Request');
    setTone(item.meta.tone || 'Professional');
    setResult(item);
    showToast("Draft loaded from history!", "info");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ai_email_writer_history');
    showToast("Draft history cleared!", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Hero Section */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3 border border-white/10">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              100% Free & Local AI Generator • No API Keys
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
              Write Perfect Emails in Seconds
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed mb-6">
              Tailored specifically for Professors, HR, Managers, Clients & Friends. Select your purpose, customize tone, and let our intelligent engine craft polished correspondence instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-indigo-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero Data Upload
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Multiple Variations
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-300" />
                One-Click Clipboard Copy
              </span>
            </div>
          </div>
        </div>

        {/* Example Prompts Carousel / Grid */}
        <ExamplePromptsSection
          onSelectPrompt={handleSelectPrompt}
          selectedPromptTitle={selectedPromptTitle}
        />

        {/* Interactive Workspace Grid (Form + Result) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-6 space-y-6">
            <FormSection
              recipient={recipient}
              setRecipient={setRecipient}
              purpose={purpose}
              setPurpose={setPurpose}
              tone={tone}
              setTone={setTone}
              details={details}
              setDetails={setDetails}
              senderName={senderName}
              setSenderName={setSenderName}
              recipientName={recipientName}
              setRecipientName={setRecipientName}
              onGenerate={() => handleGenerate()}
              onClear={handleClear}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column: Output Result & Actions */}
          <div className="lg:col-span-6 space-y-6" ref={resultRef}>
            <EmailResultSection
              result={result}
              isGenerating={isGenerating}
              onCopy={(msg) => showToast(msg, 'success')}
              onRegenerate={handleRegenerate}
              onClear={handleClear}
              onUpdateResult={(updated) => setResult(updated)}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span>AI Email Writer Assistant</span>
            <span className="text-slate-300">•</span>
            <span>Local AI Productivity System</span>
          </div>
          <p className="text-slate-400">
            Built with React, Vite & Tailwind CSS
          </p>
        </div>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        onCopyToast={(msg) => showToast(msg, 'success')}
      />

      {/* Toast Notification overlay */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

    </div>
  );
}
