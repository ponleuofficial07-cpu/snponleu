import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { Service } from '../types/index.ts';
import { Cpu, CheckCircle2, Wrench, Network, Code2, ShieldAlert, Send, X, ArrowRight } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { lang, t, toast } = useApp();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Inquiry Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [budgetRange, setBudgetRange] = useState('$100 - $500');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        const query = `
          query {
            getServices(onlyActive: true) {
              id title_en title_km slug description_en description_km features_en features_km starting_price icon_name is_active sort_order
            }
          }
        `;
        const res = await graphqlRequest(query);
        setServices(res.getServices || []);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !projectScope) {
      toast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const mutation = `
        mutation SubmitInquiry($service_id: Int, $service_title: String!, $client_name: String!, $client_email: String!, $client_phone: String, $project_scope: String!, $budget_range: String) {
          submitServiceInquiry(service_id: $service_id, service_title: $service_title, client_name: $client_name, client_email: $client_email, client_phone: $client_phone, project_scope: $project_scope, budget_range: $budget_range) {
            id status created_at
          }
        }
      `;
      await graphqlRequest(mutation, {
        service_id: selectedService?.id,
        service_title: selectedService ? (lang === 'km' ? selectedService.title_km : selectedService.title_en) : 'General Tech Support',
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        project_scope: projectScope,
        budget_range: budgetRange,
      });

      toast('Inquiry submitted successfully! Ponleu will contact you soon.', 'success');
      setSelectedService(null);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setProjectScope('');
    } catch (err) {
      console.error(err);
      toast('Failed to submit inquiry. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Code2':
        return <Code2 className="w-5 h-5" />;
      case 'Network':
        return <Network className="w-5 h-5" />;
      case 'Wrench':
      default:
        return <Wrench className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          {t.nav_services}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Professional technology services covering custom web application engineering, enterprise network deployment, and complete computer hardware diagnostic repairs.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((srv) => {
          const title = lang === 'km' ? srv.title_km : srv.title_en;
          const desc = lang === 'km' ? srv.description_km : srv.description_en;
          const features = lang === 'km' ? srv.features_km : srv.features_en;
          return (
            <div
              key={srv.id}
              className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-sm hover:border-[#42ADF5]/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#42ADF5]/10 text-[#42ADF5] flex items-center justify-center">
                    {getIcon(srv.icon_name)}
                  </div>
                  {srv.starting_price && (
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                      From {srv.starting_price}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider block">
                    Deliverables Included
                  </span>
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedService(srv)}
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] dark:hover:bg-white rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>{t.btn_inquire_service}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Inquiry Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono text-[#42ADF5] uppercase">Service Booking & Inquiry</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {lang === 'km' ? selectedService.title_km : selectedService.title_en}
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  {t.form_name} *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Sokha Heng"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {t.form_email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {t.form_telegram}
                  </label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+855 12 345 678 or @username"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  {t.form_budget}
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                >
                  <option value="Under $100">Under $100 (Single Repair / Diagnostic)</option>
                  <option value="$100 - $500">$100 - $500 (Standard Setup / Small Web Page)</option>
                  <option value="$500 - $1,500">$500 - $1,500 (Full Web App / Network Infrastructure)</option>
                  <option value="$1,500+">$1,500+ (Enterprise Multi-Node Cluster)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  {t.form_message} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={projectScope}
                  onChange={(e) => setProjectScope(e.target.value)}
                  placeholder="Describe your technical requirements, deadlines, or symptoms..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                >
                  {t.btn_close}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-md transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? t.btn_submitting : 'Send Inquiry Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
