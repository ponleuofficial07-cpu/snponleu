import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { AITool } from '../types/index.ts';
import { Search, Sparkles, ExternalLink, Tag } from 'lucide-react';

export const AIToolsPage: React.FC = () => {
  const { lang, t, setIsChatOpen } = useApp();
  const [tools, setTools] = useState<AITool[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAITools() {
      try {
        const query = `
          query {
            getAITools {
              id name category description_en description_km official_url use_cases_en use_cases_km pricing icon_url is_featured sort_order
            }
          }
        `;
        const res = await graphqlRequest(query);
        setTools(res.getAITools || []);
      } catch (err) {
        console.error('Failed to load AI tools:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAITools();
  }, []);

  const categories = [
    { id: 'all', label: 'All AI Domains' },
    { id: 'AI Productivity', label: 'Productivity' },
    { id: 'AI Coding', label: 'Coding & Dev' },
    { id: 'AI Image Generation', label: 'Image Generation' },
    { id: 'AI Writing', label: 'Writing & Text' },
  ];

  const filtered = tools.filter((tool) => {
    const matchesCat = selectedCat === 'all' || tool.category === selectedCat;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.use_cases_en.toLowerCase().includes(q) ||
      tool.description_en.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header with AI Chat trigger banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Curated Artificial Intelligence Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            {t.nav_ai_tools}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Tested and benchmarked generative AI engines, multimodal reasoning systems, and automated programming assistants.
          </p>
        </div>

        <button
          onClick={() => setIsChatOpen(true)}
          className="self-start md:self-auto px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#1677FF] to-[#42ADF5] hover:opacity-95 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Built-In Gemini AI Assistant</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCat === c.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI tools..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
          />
        </div>
      </div>

      {/* Tools Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0B1220] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
          No AI tools found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tool) => {
            const desc = lang === 'km' ? tool.description_km : tool.description_en;
            const useCases = lang === 'km' ? tool.use_cases_km : tool.use_cases_en;
            return (
              <div
                key={tool.id}
                className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-[#42ADF5]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5] uppercase tracking-wider font-mono">
                      {tool.category}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {tool.pricing}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                      Target Use Cases
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
                      {useCases}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={tool.official_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5] hover:underline flex items-center gap-1.5"
                  >
                    <span>Visit Official Platform</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
