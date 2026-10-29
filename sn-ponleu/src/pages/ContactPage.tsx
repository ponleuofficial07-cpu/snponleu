import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { Mail, Phone, Send, MapPin, CheckCircle2, MessageSquareCode, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { lang, t, toast, setIsChatOpen } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [phoneOrTelegram, setPhoneOrTelegram] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Bot detected, silently finish
      setSubmitted(true);
      return;
    }

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const mutation = `
        mutation SubmitMsg($name: String!, $email: String!, $subject: String!, $message: String!, $phone_or_telegram: String) {
          submitContactMessage(name: $name, email: $email, subject: $subject, message: $message, phone_or_telegram: $phone_or_telegram) {
            id status created_at
          }
        }
      `;
      await graphqlRequest(mutation, {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        phone_or_telegram: phoneOrTelegram.trim() || undefined,
      });

      setSubmitted(true);
      toast(t.form_submit_success, 'success');
      setName('');
      setEmail('');
      setSubject('');
      setPhoneOrTelegram('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      toast(t.form_submit_error, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          {t.contact_title}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          {t.contact_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Direct Contact Details & Quick Channels */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Direct Contact Information
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Feel free to initiate direct correspondence for ICT systems consulting, software engineering, or urgent computer troubleshooting.
            </p>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#42ADF5]/10 text-[#42ADF5] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Primary Email</span>
                  <a href="mailto:ponleuofficial07@gmail.com" className="font-medium hover:text-[#1677FF] dark:hover:text-[#42ADF5] break-all">
                    ponleuofficial07@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#42ADF5]/10 text-[#42ADF5] flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Telegram Channel</span>
                  <a href="https://t.me/snponleu" target="_blank" rel="noreferrer" className="font-medium hover:text-[#1677FF] dark:hover:text-[#42ADF5]">
                    @snponleu
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#42ADF5]/10 text-[#42ADF5] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Direct Hotline</span>
                  <span className="font-medium">+855 12 345 678</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#42ADF5]/10 text-[#42ADF5] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Base of Operations</span>
                  <span className="font-medium">Phnom Penh, Cambodia</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#1677FF] hover:text-white dark:hover:bg-[#42ADF5] dark:hover:text-[#0B1220] transition-colors text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquareCode className="w-4 h-4 text-[#42ADF5]" />
                <span>Instant Inquiry via AI Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-7 sm:p-9 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  {t.form_submit_success}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5] hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="user_verification_token"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.form_name} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sothea Chan"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.form_email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sothea@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.form_subject} *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. New Office Network Setup"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.form_telegram}
                    </label>
                    <input
                      type="text"
                      value={phoneOrTelegram}
                      onChange={(e) => setPhoneOrTelegram(e.target.value)}
                      placeholder="+855 12 345 678 or @username"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.form_message} *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your project, timeline, or issue..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 text-xs sm:text-sm font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? t.btn_submitting : t.btn_submit}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
