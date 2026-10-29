import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { Project } from '../types/index.ts';
import { Search, FolderGit2, ArrowRight, Eye, ExternalLink, Github } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { lang, t, navigate } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const query = `
          query {
            getProjects(onlyPublished: true) {
              id title_en title_km slug summary_en summary_km cover_image category technologies status demo_url source_code_url views_count is_featured
            }
          }
        `;
        const res = await graphqlRequest(query);
        setProjects(res.getProjects || []);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'systems_ict', label: 'Systems & Cloud' },
    { id: 'web_development', label: 'Web Applications' },
    { id: 'ui_ux_design', label: 'UI/UX & Branding' },
  ];

  const filtered = projects.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title_en.toLowerCase().includes(q) ||
      p.title_km.toLowerCase().includes(q) ||
      p.technologies.toLowerCase().includes(q) ||
      p.summary_en.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          {t.nav_projects}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Production software systems, enterprise monitoring consoles, and creative digital applications built with modern architectural standards.
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
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0B1220] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
          No projects found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => {
            const title = lang === 'km' ? project.title_km : project.title_en;
            const summary = lang === 'km' ? project.summary_km : project.summary_en;
            return (
              <div
                key={project.id}
                onClick={() => navigate('project-detail', project.slug)}
                className="group bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-[#42ADF5]/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img
                      src={project.cover_image}
                      alt={title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-[11px] font-medium text-slate-200 px-2.5 py-1 rounded">
                      {project.category.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#42ADF5] transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {summary}
                    </p>
                    <div className="pt-2 text-xs font-mono text-slate-400 truncate">
                      {project.technologies}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{project.views_count} views</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#1677FF] dark:text-[#42ADF5]">
                    <span>{t.btn_details}</span>
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
