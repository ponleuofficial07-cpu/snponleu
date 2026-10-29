import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { sendChatMessage } from '../services/api.ts';
import { MessageSquareCode, X, Trash2, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const AIChatbotModal: React.FC = () => {
  const { isChatOpen, setIsChatOpen, t, lang } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      role: 'assistant',
      text:
        lang === 'km'
          ? 'សួស្តី! ខ្ញុំជាជំនួយការ AI របស់ ស៊ុន ពន្លឺ (SN Ponleu)។ តើខ្ញុំអាចជួយដោះស្រាយបញ្ហាកុំព្យូទ័រ សំណួរ ICT ឬពន្យល់អំពីគម្រោង និងសេវាកម្មអ្វីខ្លះដល់លោកអ្នក?'
          : 'Hello! I am SN Ponleu’s AI Assistant. How can I help you today with ICT troubleshooting, Windows optimization, networking setups, or exploring Ponleu’s projects and services?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  if (!isChatOpen) return null;

  const quickPrompts = lang === 'km'
    ? [
        'តើធ្វើដូចម្តេចដើម្បីដោះស្រាយបញ្ហា Disk 100% លើ Windows 11?',
        'តើ ស៊ុន ពន្លឺ មានសេវាកម្មអ្វីខ្លះ?',
        'របៀបពិនិត្យសុខភាព SSD និង RAM កុំព្យូទ័រ?',
        'ប្រាប់ខ្ញុំអំពីគម្រោង Nimbus Cloud Console',
      ]
    : [
        'How to fix 100% disk usage in Windows 11?',
        'What professional services does Ponleu provide?',
        'How can I test RAM health for blue screen issues?',
        'Tell me about the Nimbus Cloud Console project',
      ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    setErrorNotice(null);
    const userMsg: ChatMessage = {
      id: Date.now() + '-user',
      role: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await sendChatMessage(textToSend, history);

      if (response.error === 'NO_API_KEY') {
        setErrorNotice('Gemini API key is not configured in environment secrets yet. The assistant provided a fallback response.');
      }

      const botMsg: ChatMessage = {
        id: Date.now() + '-bot',
        role: 'assistant',
        text: response.text || 'Thank you for your question. Please let me know if you need more details!',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + '-bot-err',
          role: 'assistant',
          text: 'Sorry, I encountered an error communicating with the server. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        text: lang === 'km'
          ? 'ការសន្ទនាត្រូវបានសម្អាត។ តើខ្ញុំអាចជួយអ្វីបន្ថែមទៀត?'
          : 'Conversation cleared. How else can I assist you with technology today?',
      },
    ]);
    setErrorNotice(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[620px] max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#42ADF5]/10 text-[#42ADF5] flex items-center justify-center border border-[#42ADF5]/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t.ai_chatbot_title}</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm">
                {t.ai_chatbot_tagline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              title={t.btn_clear_chat}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Banner if any */}
        {errorNotice && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 text-sm leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#42ADF5]/10 text-[#42ADF5] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-xl whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#1677FF] text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {m.text}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          {loading && (
            <div className="flex gap-3 text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#42ADF5]/10 text-[#42ADF5] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#42ADF5] animate-ping" />
                <span>Thinking & drafting response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-5 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
          <span className="text-slate-400 shrink-0 font-medium">Suggestions:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="whitespace-nowrap px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-[11px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1220]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.ai_chatbot_input_placeholder}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#42ADF5]/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-[#1677FF] hover:bg-[#42ADF5] disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer font-medium flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="mt-2 text-[11px] text-center text-slate-400 dark:text-slate-500">
            {t.ai_chatbot_disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
