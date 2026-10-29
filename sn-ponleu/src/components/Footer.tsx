import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Database, Github, Linkedin, Send, Mail, MapPin, Phone, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, navigate } = useApp();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#42ADF5]"></span>
              <span className="text-xl font-bold tracking-tight text-white">{t.brand_title}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Personal Digital Hub for SN Ponleu — ICT Specialist & Creative Designer. Architecting resilient infrastructure, bespoke web engineering, and modern digital utilities.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-300">
              <a
                href="https://github.com/snponleu"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/snponleu"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/snponleu"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors"
                title="Telegram Channel"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase">{t.footer_quick_links}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('projects')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav_projects}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('software')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav_software}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('blog')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav_blog}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('ai-tools')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav_ai_tools}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('working')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav_working}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('personal')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav_personal}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Connect */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase">{t.footer_connect}</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#42ADF5] shrink-0" />
                <a href="mailto:ponleuofficial07@gmail.com" className="hover:text-white transition-colors break-all">
                  ponleuofficial07@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#42ADF5] shrink-0" />
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#42ADF5] shrink-0" />
                <span>Phnom Penh, Cambodia</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => navigate('services')}
                  className="text-xs text-[#42ADF5] hover:underline cursor-pointer font-medium"
                >
                  View Service Packages →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Database & Administration */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase">Database & Engineering</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipped with MariaDB/MySQL database schema with full phpMyAdmin import compatibility, GraphQL data layer, and Express API.
            </p>
            <div className="pt-2 space-y-2">
              <a
                href="/api/export-db/sql"
                download="sn_ponleu_db.sql"
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors w-full justify-center"
              >
                <Database className="w-3.5 h-3.5 text-[#42ADF5]" />
                <span>{t.footer_download_sql}</span>
              </a>
              <button
                onClick={() => navigate('admin-login')}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors w-full justify-center cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t.nav_admin}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Unboxed Metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SN PONLEU</span>
            <span aria-hidden="true">·</span>
            <span>{t.footer_rights}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Inter & Noto Sans Khmer</span>
            <span aria-hidden="true">·</span>
            <span>Khmer Unicode 5.0 Compliant</span>
            <span aria-hidden="true">·</span>
            <span>MySQL 8 / phpMyAdmin Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
