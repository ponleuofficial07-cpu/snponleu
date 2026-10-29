import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { SearchResults } from '../types/index.ts';
import { Search, FolderGit2, FileCode2, BookOpen, Sparkles, Wrench, ArrowRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { lang, t, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    software: [],
    blog: [],
    ai_tools: [],
    services: [],
  });
  const [activeTab, setActiveTab] = useState<'all' | 'projects' | 'software' | 'blog' | 'ai' | 'services'>('all');
  const [loading, setLoading] = useState(false);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults({ projects: [], software: [], blog: [], ai_tools: [], services: [] });
      return;
    }
    setLoading(true);
    try {
      const gql = `
        query Search($query: String!, $lang: String) {
          searchAll(query: $query, lang: $lang) {
            projects {
              id title_en title_km slug summary_en summary_km cover_image category
            }
            software {
              id name slug logo_url short_desc_en short_desc_km version
            }
            blog {
              id title_en title_km slug summary_en summary_km read_time_minutes
            }
            ai_tools {
              id name category description_en description_km pricing official_url
            }
            services {
              id title_en title_km slug description_en description_km starting_price
            }
          }
        }
      `;
      const res = await graphqlRequest(gql, { query: searchTerm, lang });
      setResults(res.searchAll || { projects: [], software: [], blog: [], ai_tools: [], services: [] });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, lang]);

  const totalResults =
    results.projects.length +
    results.software.length +
    results.blog.length +
    results.ai_tools.length +
    results.services.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Search Header & Input */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Unified Hub Search
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Search across projects, downloadable tools, ICT articles, and professional services.
        </p>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search_placeholder}
            className="w-full pl-12 pr-4 py-3 text-sm bg-white dark:bg-[#0B1220] border-2 border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#42ADF5] shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      {query.trim() && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl max-w-xl mx-auto border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            All Results ({totalResults})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'projects' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            Projects ({results.projects.length})
          </button>
          <button
            onClick={() => setActiveTab('software')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'software' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            Software ({results.software.length})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'blog' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            Tutorials ({results.blog.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'ai' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            AI Tools ({results.ai_tools.length})
          </button>
        </div>
      )}

      {/* Results View */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Searching directory...</div>
      ) : !query.trim() ? (
        <div className="text-center py-16 text-slate-400 space-y-2">
          <p>Type keywords to discover content across the hub.</p>
          <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs">
            {['Windows 11', 'Disk Usage', 'Nimbus', 'DevStack', 'Network', 'Hardware'].map((hint) => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#42ADF5] cursor-pointer"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0B1220] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">No results found for "{query}"</p>
          <p className="text-xs">Try different keywords or browse our main categories.</p>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Projects */}
          {(activeTab === 'all' || activeTab === 'projects') && results.projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects ({results.projects.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.projects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate('project-detail', p.slug)}
                    className="p-4 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-[#42ADF5]/50 transition-colors cursor-pointer space-y-1.5"
                  >
                    <span className="text-[10px] uppercase font-mono text-[#42ADF5]">{p.category}</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'km' ? p.title_km : p.title_en}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {lang === 'km' ? p.summary_km : p.summary_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Software */}
          {(activeTab === 'all' || activeTab === 'software') && results.software.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Software Utilities ({results.software.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.software.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate('software-detail', s.slug)}
                    className="p-4 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-[#42ADF5]/50 transition-colors cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Software</span>
                      <span>{s.version}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{s.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {lang === 'km' ? s.short_desc_km : s.short_desc_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tutorials */}
          {(activeTab === 'all' || activeTab === 'blog') && results.blog.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>ICT Tutorials & Articles ({results.blog.length})</span>
              </h3>
              <div className="space-y-3">
                {results.blog.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => navigate('blog-detail', b.slug)}
                    className="p-4 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-[#42ADF5]/50 transition-colors cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lang === 'km' ? b.title_km : b.title_en}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                        {lang === 'km' ? b.summary_km : b.summary_en}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 shrink-0">
                      {b.read_time_minutes} min read
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
