import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { Project } from '../types/index.ts';
import { ArrowLeft, ExternalLink, Github, Eye, Calendar, Layers, CheckCircle2 } from 'lucide-react';

export const ProjectDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { lang, t, navigate } = useApp();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const query = `
          query GetProject($slug: String!) {
            getProjectBySlug(slug: $slug) {
              id title_en title_km slug summary_en summary_km description_en description_km cover_image category technologies status demo_url source_code_url is_featured views_count created_at
            }
          }
        `;
        const res = await graphqlRequest(query, { slug });
        setProject(res.getProjectBySlug || null);
      } catch (err) {
        console.error('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Project not found</h2>
        <button
          onClick={() => navigate('projects')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1677FF] rounded-md cursor-pointer"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const title = lang === 'km' ? project.title_km : project.title_en;
  const description = lang === 'km' ? project.description_km : project.description_en;
  const summary = lang === 'km' ? project.summary_km : project.summary_en;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('projects')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.btn_back}</span>
      </button>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
          <span className="uppercase text-[#42ADF5] font-semibold">{project.category.replace('_', ' ')}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{project.views_count} views</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Added {project.created_at}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {summary}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t.btn_live_demo}</span>
            </a>
          )}
          {project.source_code_url && (
            <a
              href={project.source_code_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>{t.btn_source_code}</span>
            </a>
          )}
        </div>
      </div>

      {/* Cover Image Showcase */}
      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl">
        <img
          src={project.cover_image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Technologies & Metadata */}
      <div className="p-6 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Architecture & Technology Stack
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {project.technologies.split(',').map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {tech.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Full Description & Walkthrough */}
      <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Overview & Engineering Implementation
        </h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {description}
        </div>
      </div>
    </div>
  );
};
