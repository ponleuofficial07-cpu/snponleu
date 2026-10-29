import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { Software } from '../types/index.ts';
import { Search, HardDriveDownload, ExternalLink, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const SoftwarePage: React.FC = () => {
  const { lang, t, navigate, toast } = useApp();
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSoftware() {
      try {
        const query = `
          query {
            getSoftware(onlyPublished: true) {
              id category_id category_name name slug logo_url short_desc_en short_desc_km supported_os version file_size license_type official_url download_url downloads_count is_featured
            }
          }
        `;
        const res = await graphqlRequest(query);
        setSoftwareList(res.getSoftware || []);
      } catch (err) {
        console.error('Failed to load software directory:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSoftware();
  }, []);

  const handleDownloadClick = async (e: React.MouseEvent, item: Software) => {
    e.stopPropagation();
    try {
      // Increment counter in database
      const mutation = `
        mutation Inc($id: Int!) {
          incrementSoftwareDownload(id: $id)
        }
      `;
      await graphqlRequest(mutation, { id: item.id });
      setSoftwareList((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, downloads_count: s.downloads_count + 1 } : s))
      );
      toast(`Initiating download for ${item.name}`, 'success');
      
      const link = document.createElement('a');
      link.href = item.download_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      const link = document.createElement('a');
      link.href = item.download_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const categories = [
    { id: 'all', label: 'All Software' },
    { id: '1', label: 'Utilities & Maintenance' },
    { id: '2', label: 'Coding & Web Stack' },
    { id: '4', label: 'Network & Security' },
  ];

  const filtered = softwareList.filter((s) => {
    const matchesCat = selectedCat === 'all' || s.category_id.toString() === selectedCat;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.short_desc_en.toLowerCase().includes(q) ||
      s.short_desc_km.toLowerCase().includes(q) ||
      s.supported_os.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          {t.nav_software}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Curated repository of computer maintenance utilities, development sandboxes, and network diagnostic tools vetted by SN Ponleu.
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
            placeholder="Search software..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
          />
        </div>
      </div>

      {/* Software Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0B1220] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
          No software found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const shortDesc = lang === 'km' ? item.short_desc_km : item.short_desc_en;
            return (
              <div
                key={item.id}
                onClick={() => navigate('software-detail', item.slug)}
                className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-[#42ADF5]/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                      <img src={item.logo_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-right text-xs text-slate-500 font-mono">
                      <span>{item.version}</span>
                      <span className="mx-1">·</span>
                      <span>{item.file_size}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-[#42ADF5] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {shortDesc}
                    </p>
                  </div>

                  <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 pt-1">
                    <Cpu className="w-3.5 h-3.5 text-[#42ADF5]" />
                    <span>{item.supported_os}</span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {item.downloads_count.toLocaleString()} downloads
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDownloadClick(e, item)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <HardDriveDownload className="w-3.5 h-3.5" />
                      <span>{t.btn_download}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
