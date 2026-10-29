import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { Software } from '../types/index.ts';
import { ArrowLeft, HardDriveDownload, ExternalLink, Cpu, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';

export const SoftwareDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { lang, t, navigate, toast } = useApp();
  const [software, setSoftware] = useState<Software | null>(null);
  const [related, setRelated] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const query = `
          query GetSoftware($slug: String!) {
            getSoftwareBySlug(slug: $slug) {
              id category_id category_name name slug logo_url short_desc_en short_desc_km description_en description_km supported_os version file_size license_type official_url download_url install_guide_en install_guide_km system_req_en system_req_km downloads_count is_featured created_at
            }
            getSoftware(onlyPublished: true) {
              id name slug logo_url short_desc_en short_desc_km version downloads_count
            }
          }
        `;
        const res = await graphqlRequest(query, { slug });
        setSoftware(res.getSoftwareBySlug || null);
        setRelated((res.getSoftware || []).filter((s: Software) => s.slug !== slug).slice(0, 2));
      } catch (err) {
        console.error('Failed to load software detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-16 text-center text-slate-500">Loading software details...</div>;
  }

  if (!software) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Software entry not found</h2>
        <button onClick={() => navigate('software')} className="px-4 py-2 text-xs font-semibold text-white bg-[#1677FF] rounded-md cursor-pointer">
          Back to Directory
        </button>
      </div>
    );
  }

  const desc = lang === 'km' ? software.description_km : software.description_en;
  const installGuide = lang === 'km' ? software.install_guide_km : software.install_guide_en;
  const sysReq = lang === 'km' ? software.system_req_km : software.system_req_en;

  const handleDownload = async () => {
    try {
      const mutation = `
        mutation Inc($id: Int!) {
          incrementSoftwareDownload(id: $id)
        }
      `;
      await graphqlRequest(mutation, { id: software.id });
      setSoftware((prev) => (prev ? { ...prev, downloads_count: prev.downloads_count + 1 } : prev));
      toast(`Download initialized for ${software.name}`, 'success');

      const link = document.createElement('a');
      link.href = software.download_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const link = document.createElement('a');
      link.href = software.download_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('software')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Software Directory</span>
      </button>

      {/* Main Software Card Header */}
      <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
          <img src={software.logo_url} alt={software.name} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="uppercase text-[#42ADF5] font-semibold">{software.category_name || 'Software'}</span>
            <span aria-hidden="true">·</span>
            <span>{software.license_type}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{software.downloads_count.toLocaleString()} downloads</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {software.name}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'km' ? software.short_desc_km : software.short_desc_en}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <HardDriveDownload className="w-4 h-4" />
              <span>{t.btn_download} ({software.file_size})</span>
            </button>
            <a
              href={software.official_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.btn_official_site}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono">
        <div>
          <span className="text-slate-400 block">{t.software_version}</span>
          <span className="font-semibold text-slate-800 dark:text-white mt-0.5 block">{software.version}</span>
        </div>
        <div>
          <span className="text-slate-400 block">{t.software_size}</span>
          <span className="font-semibold text-slate-800 dark:text-white mt-0.5 block">{software.file_size}</span>
        </div>
        <div>
          <span className="text-slate-400 block">{t.software_license}</span>
          <span className="font-semibold text-slate-800 dark:text-white mt-0.5 block">{software.license_type}</span>
        </div>
        <div>
          <span className="text-slate-400 block">{t.software_os}</span>
          <span className="font-semibold text-slate-800 dark:text-white mt-0.5 block">{software.supported_os}</span>
        </div>
      </div>

      {/* Full Description */}
      <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
          About this Tool
        </h2>
        <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
          {desc}
        </div>
      </div>

      {/* Installation Guide & Requirements (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white font-display">
            <Terminal className="w-4 h-4 text-[#42ADF5]" />
            <span>{t.software_install_guide}</span>
          </div>
          <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line font-mono bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            {installGuide || 'Run executable installer and follow on-screen prompts.'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white font-display">
            <Cpu className="w-4 h-4 text-[#42ADF5]" />
            <span>{t.software_system_req}</span>
          </div>
          <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            {sysReq || 'Modern 64-bit operating system with standard hardware.'}
          </div>
        </div>
      </div>

      {/* Related Software */}
      {related.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
            Related Tools You May Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate('software-detail', rel.slug)}
                className="p-4 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#42ADF5]/50 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rel.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{rel.version}</p>
                </div>
                <span className="text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5]">View →</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
