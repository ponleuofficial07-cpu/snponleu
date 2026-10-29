import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sun, Moon, Globe, Shield, Menu, X, MessageSquareCode, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { lang, setLang, t, theme, toggleTheme, currentRoute, navigate, admin, setIsChatOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.nav_home },
    { id: 'personal', label: t.nav_personal },
    { id: 'projects', label: t.nav_projects },
    { id: 'software', label: t.nav_software },
    { id: 'blog', label: t.nav_blog },
    { id: 'services', label: t.nav_services },
    { id: 'working', label: t.nav_working },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#0B1220]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => handleNav('home')}
          className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:text-[#42ADF5] dark:hover:text-[#42ADF5] transition-colors cursor-pointer flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-[#42ADF5]"></span>
          <span>{t.brand_title}</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
                  isActive
                    ? 'text-[#1677FF] dark:text-[#42ADF5] font-semibold border-b-2 border-[#42ADF5]'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (1 Primary CTA + Utilities: Search, AI, Lang, Theme, Admin) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={() => handleNav('search')}
            title="Search Hub"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#42ADF5] dark:hover:text-[#42ADF5] rounded-md transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* AI Chatbot Launcher */}
          <button
            onClick={() => setIsChatOpen(true)}
            title={t.btn_open_chat}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
          >
            <MessageSquareCode className="w-3.5 h-3.5 text-[#42ADF5]" />
            <span className="hidden xl:inline">{t.btn_open_chat}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'km' : 'en')}
            title="Toggle Language (English / Khmer)"
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'en' ? 'ខ្មែរ' : 'EN'}</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Admin Portal Shortcut */}
          <button
            onClick={() => handleNav(admin ? 'admin' : 'admin-login')}
            title={admin ? `Admin: ${admin.username}` : t.nav_admin}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              admin
                ? 'text-emerald-500 bg-emerald-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleNav('contact')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] dark:hover:bg-white rounded-md transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.btn_contact_me}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0B1220] border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                currentRoute === link.id
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-[#1677FF] dark:text-[#42ADF5] font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('ai-tools')}
            className="w-full text-left px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
          >
            {t.nav_ai_tools}
          </button>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => handleNav('contact')}
              className="flex-1 py-2 text-center text-xs font-semibold text-white bg-[#1677FF] rounded-md cursor-pointer"
            >
              {t.btn_contact_me}
            </button>
            <button
              onClick={() => {
                setIsChatOpen(true);
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MessageSquareCode className="w-3.5 h-3.5 text-[#42ADF5]" />
              AI Chat
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
