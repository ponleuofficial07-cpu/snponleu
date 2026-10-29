import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { BlogPost } from '../types/index.ts';
import { Search, Clock, Eye, Calendar, ArrowRight, Tag } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { lang, t, navigate } = useApp();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const query = `
          query {
            getBlogPosts(onlyPublished: true) {
              id category_id category_name title_en title_km slug cover_image summary_en summary_km read_time_minutes views_count published_at tags
            }
          }
        `;
        const res = await graphqlRequest(query);
        setPosts(res.getBlogPosts || []);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: '1', label: 'Windows Tips & Fixes' },
    { id: '2', label: 'Hardware Diagnostic' },
    { id: '3', label: 'Web Engineering' },
    { id: '4', label: 'Networking & Security' },
  ];

  const filtered = posts.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category_id.toString() === selectedCat;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title_en.toLowerCase().includes(q) ||
      p.title_km.toLowerCase().includes(q) ||
      p.summary_en.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          {t.nav_blog}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          In-depth tutorials, practical Windows maintenance steps, and enterprise computer troubleshooting guides written by SN Ponleu.
        </p>
      </div>

      {/* Control Bar: Filter and Search */}
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
            placeholder="Search tutorials..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0B1220] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
          No tutorial articles found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((post) => {
            const title = lang === 'km' ? post.title_km : post.title_en;
            const summary = lang === 'km' ? post.summary_km : post.summary_en;
            return (
              <div
                key={post.id}
                onClick={() => navigate('blog-detail', post.slug)}
                className="group bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-[#42ADF5]/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={post.cover_image}
                      alt={title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{post.published_at}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.read_time_minutes} {t.blog_read_time}</span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#42ADF5] transition-colors leading-snug">
                      {title}
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {summary}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5 text-xs text-slate-500">
                        {post.tags.map((tg, idx) => (
                          <span key={idx} className="font-mono text-[11px] text-slate-400">
                            #{tg}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">{post.views_count} {t.blog_views}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#1677FF] dark:text-[#42ADF5]">
                    <span>Read Full Tutorial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
