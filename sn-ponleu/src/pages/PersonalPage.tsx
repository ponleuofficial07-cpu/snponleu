import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { Profile, Skill, Education, Experience, Certification } from '../types/index.ts';
import {
  Download,
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const PersonalPage: React.FC = () => {
  const { lang, t, navigate } = useApp();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonal() {
      try {
        const query = `
          query {
            getProfile {
              full_name_en full_name_km title_en title_km bio_en bio_km about_details_en about_details_km avatar_url years_experience email phone telegram_handle location_en location_km github_url linkedin_url
            }
            getSkills {
              id name_en name_km category proficiency icon is_featured sort_order
            }
            getEducation {
              id institution_en institution_km degree_en degree_km field_en field_km start_year end_year description_en description_km
            }
            getExperience {
              id company_en company_km role_en role_km period_en period_km is_current description_en description_km technologies
            }
            getCertifications {
              id title_en title_km issuer_en issuer_km issue_date credential_id credential_url
            }
          }
        `;
        const res = await graphqlRequest(query);
        setProfile(res.getProfile);
        setSkills(res.getSkills || []);
        setEducation(res.getEducation || []);
        setExperience(res.getExperience || []);
        setCertifications(res.getCertifications || []);
      } catch (err) {
        console.error('Failed to load profile details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPersonal();
  }, []);

  const fullName = profile ? (lang === 'km' ? profile.full_name_km : profile.full_name_en) : 'SN Ponleu';
  const jobTitle = profile ? (lang === 'km' ? profile.title_km : profile.title_en) : 'ICT Specialist & Creative Designer';
  const bio = profile ? (lang === 'km' ? profile.bio_km : profile.bio_en) : '';
  const about = profile ? (lang === 'km' ? profile.about_details_km : profile.about_details_en) : '';
  const avatar = profile?.avatar_url || '/src/assets/images/sn_ponleu_hero_portrait_1793269460566.jpg';

  const skillCategories = [
    { id: 'all', label: 'All Domains' },
    { id: 'ict_hardware', label: 'Hardware & Systems' },
    { id: 'frontend', label: 'Frontend & UI' },
    { id: 'backend', label: 'Backend & DB' },
    { id: 'devops_cloud', label: 'DevOps & Linux' },
    { id: 'design', label: 'Graphic Design' },
  ];

  const filteredSkills = activeSkillCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeSkillCategory);

  const handleDownloadCV = () => {
    // Generate text/markdown or trigger printable resume window
    const resumeText = `# CURRICULUM VITAE — ${fullName}
Title: ${jobTitle}
Email: ${profile?.email || 'ponleuofficial07@gmail.com'}
Phone: ${profile?.phone || '+855 12 345 678'}
Location: Phnom Penh, Cambodia

## SUMMARY
${bio}

## ABOUT & EXPERTISE
${about}

## WORK EXPERIENCE
${experience.map((e) => `- ${e.role_en} at ${e.company_en} (${e.period_en})\n  ${e.description_en}\n  Tech: ${e.technologies}`).join('\n\n')}

## EDUCATION
${education.map((ed) => `- ${ed.degree_en} in ${ed.field_en} — ${ed.institution_en} (${ed.start_year}-${ed.end_year})`).join('\n')}

## CERTIFICATIONS
${certifications.map((c) => `- ${c.title_en} (${c.issuer_en}) - Credential: ${c.credential_id}`).join('\n')}
`;
    const blob = new Blob([resumeText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SN_Ponleu_Resume_${new Date().getFullYear()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-8">
      {/* Top Profile Card */}
      <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 border-2 border-[#42ADF5]/40 shadow-lg">
          <img
            src={avatar}
            alt={fullName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4 flex-1 text-center md:text-left">
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-[#1677FF] dark:text-[#42ADF5]">
              <span>Verified ICT Professional</span>
              <span aria-hidden="true">·</span>
              <span>5+ Years Experience</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 font-display">
              {fullName}
            </h1>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              {jobTitle}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {about || bio}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#42ADF5]" />
              {profile?.email}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#42ADF5]" />
              {lang === 'km' ? profile?.location_km : profile?.location_en}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#42ADF5]" />
              Telegram: {profile?.telegram_handle}
            </span>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={handleDownloadCV}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] dark:hover:bg-white rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.btn_download_cv} (Markdown / Printable)</span>
            </button>
            <button
              onClick={() => navigate('contact')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {t.btn_contact_me}
            </button>
          </div>
        </div>
      </div>

      {/* Skills & Technical Expertise */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Technical Expertise & Skills
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Proficiency across hardware, systems administration, full-stack programming, and UI design.
            </p>
          </div>
          {/* Filter Bar with Functional Buttons */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            {skillCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveSkillCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeSkillCategory === c.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredSkills.map((s) => {
            const skillName = lang === 'km' ? s.name_km : s.name_en;
            return (
              <div
                key={s.id}
                className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {skillName}
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#1677FF] dark:text-[#42ADF5]">
                    {s.proficiency}%
                  </span>
                </div>
                {/* Clean Progress Meter */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1677FF] to-[#42ADF5] rounded-full transition-all duration-700"
                    style={{ width: `${s.proficiency}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                  {s.category.replace('_', ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience & Education Timelines (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Work Experience */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <Briefcase className="w-5 h-5 text-[#1677FF] dark:text-[#42ADF5]" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Professional Work Experience
            </h2>
          </div>

          <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 pl-6">
            {experience.map((exp) => {
              const company = lang === 'km' ? exp.company_km : exp.company_en;
              const role = lang === 'km' ? exp.role_km : exp.role_en;
              const period = lang === 'km' ? exp.period_km : exp.period_en;
              const desc = lang === 'km' ? exp.description_km : exp.description_en;
              return (
                <div key={exp.id} className="relative space-y-2">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#1677FF] dark:bg-[#42ADF5] border-2 border-white dark:border-[#0B1220]" />
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{period}</span>
                    {exp.is_current && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {role}
                  </h3>
                  <div className="text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5]">
                    {company}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                  {exp.technologies && (
                    <div className="pt-1 text-[11px] font-mono text-slate-500">
                      Core Stack: {exp.technologies}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Education & Academic Foundation */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <GraduationCap className="w-5 h-5 text-[#1677FF] dark:text-[#42ADF5]" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Education & Academic Background
            </h2>
          </div>

          <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 pl-6">
            {education.map((edu) => {
              const inst = lang === 'km' ? edu.institution_km : edu.institution_en;
              const degree = lang === 'km' ? edu.degree_km : edu.degree_en;
              const field = lang === 'km' ? edu.field_km : edu.field_en;
              const desc = lang === 'km' ? edu.description_km : edu.description_en;
              return (
                <div key={edu.id} className="relative space-y-2">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 border-2 border-white dark:border-[#0B1220]" />
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.start_year} - {edu.end_year}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {degree} — {field}
                  </h3>
                  <div className="text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5]">
                    {inst}
                  </div>
                  {desc && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Professional Certifications (3-in-a-Row Grid as per Portfolio Guidelines) */}
      <section className="space-y-6">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Industry Certifications & Credentials
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Standardized technical credentials verifying network, security, and cloud mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert) => {
            const certTitle = lang === 'km' ? cert.title_km : cert.title_en;
            const issuer = lang === 'km' ? cert.issuer_km : cert.issuer_en;
            return (
              <div
                key={cert.id}
                className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {certTitle}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {issuer}
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
                    <div>Issue Date: {cert.issue_date}</div>
                    {cert.credential_id && <div>ID: {cert.credential_id}</div>}
                  </div>
                </div>

                {cert.credential_url && (
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-[#1677FF] dark:text-[#42ADF5] hover:underline flex items-center gap-1"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
