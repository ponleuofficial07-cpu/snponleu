import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { Project, Software, BlogPost, GalleryItem, Service, Profile } from '../types/index.ts';
import {
  ArrowRight,
  Download,
  FolderGit2,
  FileCode2,
  BookOpen,
  Send,
  ExternalLink,
  Cpu,
  Server,
  Layers,
  Wrench,
  CheckCircle2,
  Eye,
  Calendar,
  Clock,
  HardDriveDownload,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { lang, t, navigate, setIsChatOpen } = useApp();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [software, setSoftware] = useState<Software[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const query = `
          query {
            getProfile {
              full_name_en full_name_km title_en title_km bio_en bio_km avatar_url years_experience email telegram_handle
            }
            getProjects(onlyPublished: true) {
              id title_en title_km slug summary_en summary_km cover_image category technologies views_count is_featured
            }
            getSoftware(onlyPublished: true) {
              id name slug logo_url short_desc_en short_desc_km version file_size downloads_count is_featured
            }
            getBlogPosts(onlyPublished: true) {
              id title_en title_km slug cover_image summary_en summary_km read_time_minutes views_count published_at
            }
            getGalleryItems(onlyPublished: true) {
              id title_en title_km image_url category activity_date
            }
            getServices(onlyActive: true) {
              id title_en title_km slug description_en description_km features_en features_km starting_price icon_name
            }
          }
        `;
        const res = await graphqlRequest(query);
        setProfile(res.getProfile);
        setProjects(res.getProjects || []);
        setSoftware(res.getSoftware || []);
        setBlogPosts(res.getBlogPosts || []);
        setGalleryItems(res.getGalleryItems || []);
        setServices(res.getServices || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const fullName = profile ? (lang === 'km' ? profile.full_name_km : profile.full_name_en) : 'SN Ponleu';
  const jobTitle = profile ? (lang === 'km' ? profile.title_km : profile.title_en) : 'ICT Specialist & Creative Designer';
  const bio = profile ? (lang === 'km' ? profile.bio_km : profile.bio_en) : t.hero_description;
  const avatar = profile?.avatar_url || '/src/assets/images/sn_ponleu_hero_portrait_1793269460566.jpg';

  const featuredProjects = projects.filter((p) => p.is_featured).slice(0, 3);
  const featuredSoftware = software.slice(0, 3);
  const recentArticles = blogPosts.slice(0, 2);
  const recentActivities = galleryItems.slice(0, 3);

  return (
    <div className="space-y-24">
      {/* =========================================================================
          HERO SECTION (Split-Screen Hero matching Section 2 of Portfolio Guidelines)
          ========================================================================= */}
      <section className="relative pt-8 sm:pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Typographic Hierarchy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed Kicker with separator */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-[#1677FF] dark:text-[#42ADF5]">
                <span>{jobTitle}</span>
                <span aria-hidden="true">·</span>
                <span>Phnom Penh, Cambodia</span>
              </div>

              {/* Main Headline with balanced wrapping */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance font-display">
                {fullName} —{' '}
                <span className="text-[#1677FF] dark:text-[#42ADF5]">{t.hero_tagline}</span>
              </h1>

              {/* Bio Prose */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {bio}
              </p>

              {/* 5 Functional Action Buttons (Single-Line Controls) */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('projects')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] dark:hover:bg-white rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>{t.btn_view_projects}</span>
                </button>

                <button
                  onClick={() => navigate('software')}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <FileCode2 className="w-4 h-4 text-[#42ADF5]" />
                  <span>{t.btn_explore_software}</span>
                </button>

                <button
                  onClick={() => navigate('blog')}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4 text-[#42ADF5]" />
                  <span>{t.btn_read_tutorials}</span>
                </button>

                <button
                  onClick={() => navigate('contact')}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-[#1677FF] dark:hover:text-[#42ADF5] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.btn_contact_me}</span>
                </button>

                <button
                  onClick={() => navigate('personal')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.btn_download_cv}</span>
                </button>
              </div>
            </div>

            {/* Right Column: High-Resolution Visual Anchor */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl group">
                <img
                  src={avatar}
                  alt={fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#42ADF5]">Verified ICT Specialist</span>
                  <p className="text-sm font-medium mt-1">Cisco CCNA · CompTIA Security+ · Google Cloud</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Metrics Strip below split */}
          <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                5+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {t.stats_experience}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                15+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {t.stats_projects}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1677FF] dark:text-[#42ADF5] font-mono tabular-nums">
                8,260+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {t.stats_downloads}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                4,210+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {t.stats_views}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED PROJECTS SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              {t.section_featured_projects}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.section_featured_projects_sub}
            </p>
          </div>
          <button
            onClick={() => navigate('projects')}
            className="text-xs sm:text-sm font-semibold text-[#1677FF] dark:text-[#42ADF5] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => {
            const title = lang === 'km' ? project.title_km : project.title_en;
            const summary = lang === 'km' ? project.summary_km : project.summary_en;
            return (
              <div
                key={project.id}
                onClick={() => navigate('project-detail', project.slug)}
                className="group bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-[#42ADF5]/50 transition-all cursor-pointer flex flex-col"
              >
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
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#42ADF5] transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {summary}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-slate-400">{project.technologies.split(',')[0]}</span>
                    <span className="flex items-center gap-1 font-medium text-[#1677FF] dark:text-[#42ADF5]">
                      <span>{t.btn_details}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SOFTWARE DIRECTORY SPOTLIGHT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              {t.section_software_spotlight}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.section_software_spotlight_sub}
            </p>
          </div>
          <button
            onClick={() => navigate('software')}
            className="text-xs sm:text-sm font-semibold text-[#1677FF] dark:text-[#42ADF5] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore All Software ({software.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSoftware.map((item) => {
            const shortDesc = lang === 'km' ? item.short_desc_km : item.short_desc_en;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-[#42ADF5]/50 transition-all flex flex-col justify-between"
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
                    <h3
                      onClick={() => navigate('software-detail', item.slug)}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-[#42ADF5] transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {shortDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {item.downloads_count.toLocaleString()} downloads
                  </span>
                  <button
                    onClick={() => navigate('software-detail', item.slug)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5] bg-blue-50 dark:bg-blue-950/40 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <HardDriveDownload className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          RECENT WORKING ACTIVITIES (Photo Gallery Teaser)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              {t.section_working_activities}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.section_working_activities_sub}
            </p>
          </div>
          <button
            onClick={() => navigate('working')}
            className="text-xs sm:text-sm font-semibold text-[#1677FF] dark:text-[#42ADF5] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Open Gallery View</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentActivities.map((act) => {
            const title = lang === 'km' ? act.title_km : act.title_en;
            return (
              <div
                key={act.id}
                onClick={() => navigate('working')}
                className="group relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 cursor-pointer shadow-sm"
              >
                <img
                  src={act.image_url}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
                  <div className="text-[11px] font-semibold text-[#42ADF5] uppercase tracking-wider mb-1">
                    {act.category.replace('_', ' ')}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2">
                    {title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{act.activity_date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          LATEST ICT TUTORIALS & BLOG
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              {t.section_latest_articles}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.section_latest_articles_sub}
            </p>
          </div>
          <button
            onClick={() => navigate('blog')}
            className="text-xs sm:text-sm font-semibold text-[#1677FF] dark:text-[#42ADF5] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Read All Tutorials</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentArticles.map((article) => {
            const title = lang === 'km' ? article.title_km : article.title_en;
            const summary = lang === 'km' ? article.summary_km : article.summary_en;
            return (
              <div
                key={article.id}
                onClick={() => navigate('blog-detail', article.slug)}
                className="group bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-[#42ADF5]/50 transition-all cursor-pointer flex flex-col sm:flex-row"
              >
                <div className="sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={article.cover_image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{article.published_at}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.read_time_minutes} {t.blog_read_time}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#42ADF5] transition-colors leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {summary}
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-[#1677FF] dark:text-[#42ADF5] font-semibold">
                    <span>Read Guide →</span>
                    <span className="text-slate-400 font-mono font-normal">{article.views_count} {t.blog_views}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          PROFESSIONAL SERVICES PREVIEW
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t.section_services_summary}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t.section_services_summary_sub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv) => {
            const title = lang === 'km' ? srv.title_km : srv.title_en;
            const desc = lang === 'km' ? srv.description_km : srv.description_en;
            const features = lang === 'km' ? srv.features_km : srv.features_en;
            return (
              <div
                key={srv.id}
                className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-[#42ADF5]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#42ADF5]/10 text-[#42ADF5] flex items-center justify-center">
                      <Cpu className="w-5 h-5" />
                    </div>
                    {srv.starting_price && (
                      <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                        From {srv.starting_price}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6 mt-4">
                  <button
                    onClick={() => navigate('contact')}
                    className="w-full py-2 text-xs font-semibold text-center text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-[#1677FF] hover:text-white dark:hover:bg-[#42ADF5] dark:hover:text-[#0B1220] rounded-md transition-all cursor-pointer"
                  >
                    {t.btn_inquire_service}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION BANNER
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 p-8 sm:p-12 text-white border border-blue-800/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Ready to Upgrade Your Digital Infrastructure?
            </h3>
            <p className="text-sm text-blue-200 leading-relaxed">
              Whether you need enterprise IT diagnostic support, network architecture deployment, or custom web engineering, let’s build high-performance solutions together.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('contact')}
              className="px-6 py-3 text-sm font-bold text-[#0B1220] bg-[#42ADF5] hover:bg-white rounded-lg transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              {t.btn_contact_me}
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-5 py-3 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all cursor-pointer whitespace-nowrap"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
