import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { GalleryItem } from '../types/index.ts';
import { Search, Calendar, X, Eye, Filter } from 'lucide-react';

export const WorkingPage: React.FC = () => {
  const { lang, t } = useApp();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const query = `
          query {
            getGalleryItems(onlyPublished: true) {
              id title_en title_km description_en description_km image_url category activity_date
            }
          }
        `;
        const res = await graphqlRequest(query);
        setItems(res.getGalleryItems || []);
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'server_network', label: 'Server & Network' },
    { id: 'workspace_setup', label: 'Workspace & UI' },
    { id: 'troubleshooting', label: 'Diagnostics & Repair' },
    { id: 'design_creative', label: 'Creative Design' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title_en.toLowerCase().includes(q) ||
      item.title_km.toLowerCase().includes(q) ||
      (item.description_en && item.description_en.toLowerCase().includes(q)) ||
      (item.description_km && item.description_km.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          {t.nav_working}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Documentary photo gallery of live engineering tasks, server rack assembly, workstation configurations, and field troubleshooting.
        </p>
      </div>

      {/* Control Bar: Search and Category Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0B1220] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
          No working activities found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const title = lang === 'km' ? item.title_km : item.title_en;
            const desc = lang === 'km' ? item.description_km : item.description_en;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-[#42ADF5]/50 transition-all flex flex-col"
              >
                <div className="aspect-4/3 overflow-hidden bg-slate-950">
                  <img
                    src={item.image_url}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 bg-white dark:bg-[#0B1220] flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1.5">
                      <span className="uppercase text-[#42ADF5] font-semibold">{item.category.replace('_', ' ')}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.activity_date}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#42ADF5] transition-colors">
                      {title}
                    </h3>
                    {desc && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {desc}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5] flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View High-Res Photo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal (Fullscreen Clean Photo Viewer) */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={activeItem.image_url}
                alt={lang === 'km' ? activeItem.title_km : activeItem.title_en}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors cursor-pointer border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-slate-900 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#42ADF5]">
                <span className="uppercase">{activeItem.category.replace('_', ' ')}</span>
                <span aria-hidden="true">·</span>
                <span>{activeItem.activity_date}</span>
              </div>
              <h3 className="text-xl font-bold">
                {lang === 'km' ? activeItem.title_km : activeItem.title_en}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {lang === 'km' ? activeItem.description_km : activeItem.description_en}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
