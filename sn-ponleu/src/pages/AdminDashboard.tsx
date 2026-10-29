import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  graphqlRequest,
  fetchStats,
  fetchAuditLogs,
  uploadMediaFile,
  updateAdminCredentials,
} from '../services/api.ts';
import {
  Profile,
  Project,
  Software,
  BlogPost,
  GalleryItem,
  AITool,
  Service,
  ContactMessage,
  ServiceInquiry,
  MediaFile,
  AuditLog,
  DashboardStats,
} from '../types/index.ts';
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  FolderGit2,
  FileCode2,
  BookOpen,
  Sparkles,
  Wrench,
  Mail,
  FileText,
  Upload,
  Settings,
  Shield,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
  Database,
  ExternalLink,
  Search,
  KeyRound,
  Download,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { admin, logout, toast, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'profile'
    | 'gallery'
    | 'projects'
    | 'software'
    | 'blog'
    | 'ai_tools'
    | 'services'
    | 'inquiries'
    | 'messages'
    | 'media'
    | 'settings'
    | 'logs'
  >('overview');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [software, setSoftware] = useState<Software[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Modal / Form states
  const [modalMode, setModalMode] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Admin password change form state
  const [newPassword, setNewPassword] = useState('');
  const [adminFullName, setAdminFullName] = useState(admin?.full_name || 'SN Ponleu');
  const [adminEmail, setAdminEmail] = useState(admin?.email || 'ponleuofficial07@gmail.com');

  // Load all admin data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const statsData = await fetchStats();
      setStats(statsData);

      const logsData = await fetchAuditLogs();
      setAuditLogs(logsData || []);

      const gql = `
        query {
          getProfile {
            id full_name_en full_name_km title_en title_km bio_en bio_km about_details_en about_details_km avatar_url resume_url email phone telegram_handle location_en location_km years_experience github_url linkedin_url facebook_url youtube_url
          }
          getGalleryItems(onlyPublished: false) {
            id title_en title_km description_en description_km image_url category activity_date is_published
          }
          getProjects(onlyPublished: false) {
            id title_en title_km slug summary_en summary_km description_en description_km cover_image category technologies status demo_url source_code_url is_featured is_published views_count created_at
          }
          getSoftware(onlyPublished: false) {
            id category_id category_name name slug logo_url short_desc_en short_desc_km description_en description_km supported_os version file_size license_type official_url download_url install_guide_en install_guide_km system_req_en system_req_km downloads_count is_featured is_published created_at
          }
          getBlogPosts(onlyPublished: false) {
            id category_id category_name title_en title_km slug cover_image summary_en summary_km content_en content_km author_name read_time_minutes views_count seo_title seo_desc tags is_published published_at
          }
          getAITools {
            id name category description_en description_km official_url use_cases_en use_cases_km pricing icon_url is_featured sort_order
          }
          getServices(onlyActive: false) {
            id title_en title_km slug description_en description_km features_en features_km starting_price icon_name is_active sort_order
          }
          getContactMessages {
            id name email subject message phone_or_telegram is_read status created_at
          }
          getServiceInquiries {
            id service_id service_title client_name client_email client_phone project_scope budget_range status admin_notes created_at
          }
          getSettings
        }
      `;
      const res = await graphqlRequest(gql);
      setProfile(res.getProfile);
      setGallery(res.getGalleryItems || []);
      setProjects(res.getProjects || []);
      setSoftware(res.getSoftware || []);
      setBlogPosts(res.getBlogPosts || []);
      setAiTools(res.getAITools || []);
      setServices(res.getServices || []);
      setMessages(res.getContactMessages || []);
      setInquiries(res.getServiceInquiries || []);
      if (res.getSettings) {
        try {
          const parsed = typeof res.getSettings === 'string' ? JSON.parse(res.getSettings) : res.getSettings;
          setWebsiteSettings(parsed);
        } catch (e) {
          console.warn('Failed to parse getSettings JSON:', e);
        }
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handlers for CRUD
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const mutation = `
        mutation UpdateProf(
          $full_name_en: String, $full_name_km: String, $title_en: String, $title_km: String,
          $bio_en: String, $bio_km: String, $about_details_en: String, $about_details_km: String,
          $email: String, $phone: String, $telegram_handle: String, $location_en: String, $location_km: String,
          $years_experience: Int, $github_url: String, $linkedin_url: String
        ) {
          updateProfile(
            full_name_en: $full_name_en, full_name_km: $full_name_km, title_en: $title_en, title_km: $title_km,
            bio_en: $bio_en, bio_km: $bio_km, about_details_en: $about_details_en, about_details_km: $about_details_km,
            email: $email, phone: $phone, telegram_handle: $telegram_handle, location_en: $location_en, location_km: $location_km,
            years_experience: $years_experience, github_url: $github_url, linkedin_url: $linkedin_url
          ) {
            id full_name_en
          }
        }
      `;
      await graphqlRequest(mutation, profile);
      toast('Profile updated successfully!', 'success');
      loadAdminData();
    } catch (err: any) {
      toast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await graphqlRequest(`mutation Del($id: Int!) { deleteProject(id: $id) }`, { id });
      toast('Project deleted', 'info');
      loadAdminData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleDeleteSoftware = async (id: number) => {
    if (!confirm('Are you sure you want to delete this software tool?')) return;
    try {
      await graphqlRequest(`mutation Del($id: Int!) { deleteSoftware(id: $id) }`, { id });
      toast('Software deleted', 'info');
      loadAdminData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleDeleteBlogPost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tutorial?')) return;
    try {
      await graphqlRequest(`mutation Del($id: Int!) { deleteBlogPost(id: $id) }`, { id });
      toast('Article deleted', 'info');
      loadAdminData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm('Delete this working activity photo?')) return;
    try {
      await graphqlRequest(`mutation Del($id: Int!) { deleteGalleryItem(id: $id) }`, { id });
      toast('Activity photo deleted', 'info');
      loadAdminData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleUpdateMessageStatus = async (id: number, status: string) => {
    try {
      await graphqlRequest(
        `mutation UpMsg($id: Int!, $status: String!) { updateContactMessageStatus(id: $id, status: $status) }`,
        { id, status }
      );
      toast(`Message marked as ${status}`, 'success');
      loadAdminData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleUpdateInquiryStatus = async (id: number, status: string, notes?: string) => {
    try {
      await graphqlRequest(
        `mutation UpInq($id: Int!, $status: String!, $notes: String) { updateServiceInquiryStatus(id: $id, status: $status, notes: $notes) }`,
        { id, status, notes: notes || '' }
      );
      toast(`Inquiry status updated to ${status}`, 'success');
      loadAdminData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast('Uploading media...', 'info');
      const uploaded: any = await uploadMediaFile(file, file.name);
      toast(`File ${uploaded.file_name} uploaded successfully!`, 'success');
      loadAdminData();
    } catch (err: any) {
      toast(err.message || 'Upload failed', 'error');
    }
  };

  const handleUpdateAdminAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminCredentials({
        newPassword: newPassword || undefined,
        fullName: adminFullName,
        email: adminEmail,
      });
      toast('Admin account settings updated successfully!', 'success');
      setNewPassword('');
    } catch (err: any) {
      toast(err.message || 'Failed to update credentials', 'error');
    }
  };

  // Nav Items
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Biography', icon: User },
    { id: 'projects', label: 'Projects Management', icon: FolderGit2, badge: projects.length },
    { id: 'software', label: 'Software Directory', icon: FileCode2, badge: software.length },
    { id: 'blog', label: 'ICT Tutorials & Blog', icon: BookOpen, badge: blogPosts.length },
    { id: 'gallery', label: 'Working Activities', icon: ImageIcon, badge: gallery.length },
    { id: 'ai_tools', label: 'AI Tools Directory', icon: Sparkles, badge: aiTools.length },
    { id: 'services', label: 'Services Packages', icon: Wrench, badge: services.length },
    { id: 'inquiries', label: 'Service Inquiries', icon: FileText, badge: stats?.newInquiries || 0 },
    { id: 'messages', label: 'Contact Messages', icon: Mail, badge: stats?.unreadMessages || 0 },
    { id: 'media', label: 'Media Library & Uploads', icon: Upload },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'logs', label: 'Security Audit Logs', icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-[#1677FF] dark:text-[#42ADF5] flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>SN PONLEU Administration Dashboard</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono">
                ONLINE
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Logged in as <strong className="text-slate-700 dark:text-slate-300">{admin?.username || 'ponleu'}</strong> ({admin?.role || 'superadmin'}) · Full database control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export-db/sql"
            download="sn_ponleu_db.sql"
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Download complete MySQL / phpMyAdmin SQL export"
          >
            <Database className="w-3.5 h-3.5 text-[#42ADF5]" />
            <span className="hidden sm:inline">Export sn_ponleu_db.sql</span>
          </a>
          <button
            onClick={() => navigate('home')}
            className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Visit Public Site
          </button>
          <button
            onClick={logout}
            className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Module Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1677FF] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[600px]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Hub Performance Metrics
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live database statistics across all content modules
                  </p>
                </div>
                <button
                  onClick={loadAdminData}
                  className="text-xs text-[#1677FF] dark:text-[#42ADF5] hover:underline cursor-pointer font-medium"
                >
                  Refresh Data
                </button>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Projects (Pub/Tot)</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {stats.publishedProjects} / {stats.totalProjects}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Software Downloads</span>
                  <div className="text-2xl font-bold font-mono text-[#1677FF] dark:text-[#42ADF5] mt-1">
                    {stats.totalDownloads.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Unread Messages</span>
                  <div className="text-2xl font-bold font-mono text-amber-500 mt-1">
                    {stats.unreadMessages}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Pending Inquiries</span>
                  <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">
                    {stats.newInquiries}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick Shortcuts
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#42ADF5]" />
                    <span>Add Project</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('software')}
                    className="px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#42ADF5]" />
                    <span>Add Software Tool</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('blog')}
                    className="px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#42ADF5]" />
                    <span>Publish Tutorial</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#42ADF5]" />
                    <span>Upload Working Photo</span>
                  </button>
                </div>
              </div>

              {/* Recent Audit Activities */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Activity Trail
                </h3>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-3 text-xs flex items-center justify-between gap-4">
                      <div>
                        <span className="font-mono text-[#42ADF5] font-semibold">{log.action}</span>
                        <span className="text-slate-500 ml-2">[{log.target_module}]</span>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">{log.details}</p>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px] shrink-0">{log.created_at.split('T')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && profile && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Profile & Biography Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update bilingual biographical information displayed across the site
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Save Profile Changes
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name (English)</label>
                  <input
                    type="text"
                    value={profile.full_name_en}
                    onChange={(e) => setProfile({ ...profile, full_name_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name (Khmer - ឈ្មោះខ្មែរ)</label>
                  <input
                    type="text"
                    value={profile.full_name_km}
                    onChange={(e) => setProfile({ ...profile, full_name_km: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Title (English)</label>
                  <input
                    type="text"
                    value={profile.title_en}
                    onChange={(e) => setProfile({ ...profile, title_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Title (Khmer)</label>
                  <input
                    type="text"
                    value={profile.title_km}
                    onChange={(e) => setProfile({ ...profile, title_km: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Telegram Handle</label>
                  <input
                    type="text"
                    value={profile.telegram_handle}
                    onChange={(e) => setProfile({ ...profile, telegram_handle: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Bio (English)</label>
                  <textarea
                    rows={2}
                    value={profile.bio_en}
                    onChange={(e) => setProfile({ ...profile, bio_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Bio (Khmer)</label>
                  <textarea
                    rows={2}
                    value={profile.bio_km}
                    onChange={(e) => setProfile({ ...profile, bio_km: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed About (English)</label>
                  <textarea
                    rows={3}
                    value={profile.about_details_en}
                    onChange={(e) => setProfile({ ...profile, about_details_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Projects Management ({projects.length})
                  </h2>
                  <p className="text-xs text-slate-500">Create, edit, toggle featured status, and archive projects</p>
                </div>
                <button
                  onClick={() => {
                    const newTitle = prompt('Enter new project title:');
                    if (!newTitle) return;
                    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    graphqlRequest(
                      `mutation CreateP($title_en: String!, $title_km: String!, $slug: String!, $summary_en: String!, $summary_km: String!, $description_en: String!, $description_km: String!, $cover_image: String!, $category: String!, $technologies: String!, $status: String!, $is_featured: Boolean!, $is_published: Boolean!) {
                        createProject(title_en: $title_en, title_km: $title_km, slug: $slug, summary_en: $summary_en, summary_km: $summary_km, description_en: $description_en, description_km: $description_km, cover_image: $cover_image, category: $category, technologies: $technologies, status: $status, is_featured: $is_featured, is_published: $is_published) { id }
                      }`,
                      {
                        title_en: newTitle,
                        title_km: newTitle,
                        slug,
                        summary_en: 'Newly initiated engineering project.',
                        summary_km: 'គម្រោងវិស្វកម្មដែលទើបតែចាប់ផ្តើម។',
                        description_en: 'Full technical overview and architecture details.',
                        description_km: 'ព័ត៌មានលម្អិតអំពីស្ថាបត្យកម្មប្រព័ន្ធ។',
                        cover_image: '/src/assets/images/sn_project_showcase_1793269462759.jpg',
                        category: 'systems_ict',
                        technologies: 'React, Node.js, Linux',
                        status: 'in_progress',
                        is_featured: false,
                        is_published: true,
                      }
                    ).then(() => {
                      toast('Project created!', 'success');
                      loadAdminData();
                    });
                  }}
                  className="px-3 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {projects.map((p) => (
                  <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                        <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{p.title_en}</span>
                          {p.is_featured && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-[#42ADF5] font-mono">
                              FEATURED
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {p.category} · {p.technologies} · {p.views_count} views
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => navigate('project-detail', p.slug)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SOFTWARE DIRECTORY */}
          {activeTab === 'software' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Software Directory Management ({software.length})
                  </h2>
                  <p className="text-xs text-slate-500">Manage tool entries, versioning, download URLs, and counts</p>
                </div>
                <button
                  onClick={() => {
                    const name = prompt('Software Tool Name:');
                    if (!name) return;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    graphqlRequest(
                      `mutation CreateS($category_id: Int!, $name: String!, $slug: String!, $logo_url: String!, $short_desc_en: String!, $short_desc_km: String!, $description_en: String!, $description_km: String!, $supported_os: String!, $version: String!, $file_size: String!, $license_type: String!, $official_url: String!, $download_url: String!, $is_featured: Boolean!, $is_published: Boolean!) {
                        createSoftware(category_id: $category_id, name: $name, slug: $slug, logo_url: $logo_url, short_desc_en: $short_desc_en, short_desc_km: $short_desc_km, description_en: $description_en, description_km: $description_km, supported_os: $supported_os, version: $version, file_size: $file_size, license_type: $license_type, official_url: $official_url, download_url: $download_url, is_featured: $is_featured, is_published: $is_published) { id }
                      }`,
                      {
                        category_id: 1,
                        name,
                        slug,
                        logo_url: '/src/assets/images/sn_software_toolkit_1793269461578.jpg',
                        short_desc_en: 'Utility tool for computer diagnostics.',
                        short_desc_km: 'កម្មវិធីជំនួយសម្រាប់ដោះស្រាយបញ្ហាកុំព្យូទ័រ។',
                        description_en: 'Full features and guide for system administrators.',
                        description_km: 'ការណែនាំលម្អិតសម្រាប់អ្នកគ្រប់គ្រងប្រព័ន្ធ។',
                        supported_os: 'Windows 10/11, macOS',
                        version: 'v1.0.0',
                        file_size: '25 MB',
                        license_type: 'Free',
                        official_url: 'https://github.com/snponleu',
                        download_url: 'https://github.com/snponleu',
                        is_featured: true,
                        is_published: true,
                      }
                    ).then(() => {
                      toast('Software added!', 'success');
                      loadAdminData();
                    });
                  }}
                  className="px-3 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Software</span>
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {software.map((s) => (
                  <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{s.name}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {s.version} · {s.file_size} · {s.downloads_count.toLocaleString()} downloads · {s.license_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => navigate('software-detail', s.slug)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSoftware(s.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700"
                        title="Delete Software"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ICT TUTORIALS & BLOG */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    ICT Tutorials & Blog Management ({blogPosts.length})
                  </h2>
                  <p className="text-xs text-slate-500">Draft, edit, publish educational walkthroughs and computer tips</p>
                </div>
                <button
                  onClick={() => {
                    const title = prompt('Tutorial Article Title:');
                    if (!title) return;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    graphqlRequest(
                      `mutation CreateB($category_id: Int!, $title_en: String!, $title_km: String!, $slug: String!, $cover_image: String!, $summary_en: String!, $summary_km: String!, $content_en: String!, $content_km: String!, $author_name: String!, $read_time_minutes: Int!, $tags: [String], $is_published: Boolean!) {
                        createBlogPost(category_id: $category_id, title_en: $title_en, title_km: $title_km, slug: $slug, cover_image: $cover_image, summary_en: $summary_en, summary_km: $summary_km, content_en: $content_en, content_km: $content_km, author_name: $author_name, read_time_minutes: $read_time_minutes, tags: $tags, is_published: $is_published) { id }
                      }`,
                      {
                        category_id: 1,
                        title_en: title,
                        title_km: title,
                        slug,
                        cover_image: '/src/assets/images/sn_working_activity_1793269461758.jpg',
                        summary_en: 'Diagnostic and practical walkthrough.',
                        summary_km: 'ការណែនាំដោះស្រាយបញ្ហាជាក់ស្តែង។',
                        content_en: `### Step 1: Preliminary Diagnostic\nVerify connections and run system probe.\n\n### Step 2: Verification\nConfirm resolution.`,
                        content_km: `### ជំហានទី ១៖ ពិនិត្យបញ្ហាដំបូង\nធ្វើតេស្តសាកល្បងឧបករណ៍។`,
                        author_name: 'SN Ponleu',
                        read_time_minutes: 5,
                        tags: ['Tutorial', 'Windows'],
                        is_published: true,
                      }
                    ).then(() => {
                      toast('Article published!', 'success');
                      loadAdminData();
                    });
                  }}
                  className="px-3 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Write Tutorial</span>
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {blogPosts.map((b) => (
                  <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{b.title_en}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Published {b.published_at} · {b.read_time_minutes} min read · {b.views_count} views
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => navigate('blog-detail', b.slug)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlogPost(b.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: WORKING GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Working Photo Gallery ({gallery.length})
                  </h2>
                  <p className="text-xs text-slate-500">Manage daily tech activity photos and descriptions</p>
                </div>
                <button
                  onClick={() => {
                    const title = prompt('Activity Photo Title:');
                    if (!title) return;
                    graphqlRequest(
                      `mutation CreateG($title_en: String!, $title_km: String!, $description_en: String, $description_km: String, $image_url: String!, $category: String!, $activity_date: String!, $is_published: Boolean!) {
                        createGalleryItem(title_en: $title_en, title_km: $title_km, description_en: $description_en, description_km: $description_km, image_url: $image_url, category: $category, activity_date: $activity_date, is_published: $is_published) { id }
                      }`,
                      {
                        title_en: title,
                        title_km: title,
                        description_en: 'On-site technical workflow.',
                        description_km: 'សកម្មភាពការងារបច្ចេកវិទ្យាជាក់ស្តែង។',
                        image_url: '/src/assets/images/sn_working_activity_1793269461758.jpg',
                        category: 'workspace_setup',
                        activity_date: new Date().toISOString().split('T')[0],
                        is_published: true,
                      }
                    ).then(() => {
                      toast('Photo entry added!', 'success');
                      loadAdminData();
                    });
                  }}
                  className="px-3 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo Entry</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-900">
                    <div className="aspect-video relative">
                      <img src={g.image_url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteGallery(g.id)}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#0B1220]">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{g.title_en}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{g.category} · {g.activity_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Visitor Contact Inquiries ({messages.length})
                </h2>
                <p className="text-xs text-slate-500">Review messages submitted via the public contact form</p>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No contact messages received yet.</div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 border rounded-xl transition-all ${
                        m.status === 'unread'
                          ? 'border-[#42ADF5] bg-blue-50/20 dark:bg-blue-950/20'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{m.name}</span>
                            <span className="text-xs text-slate-400 font-mono">&lt;{m.email}&gt;</span>
                            {m.phone_or_telegram && (
                              <span className="text-xs text-[#42ADF5] font-mono">({m.phone_or_telegram})</span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                            Subject: {m.subject}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 whitespace-pre-wrap">
                            {m.message}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-[11px] font-mono text-slate-400">{m.created_at.split('T')[0]}</span>
                          <select
                            value={m.status}
                            onChange={(e) => handleUpdateMessageStatus(m.id, e.target.value)}
                            className="text-xs px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="spam">Spam</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SERVICE INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Client Service Bookings & Inquiries ({inquiries.length})
                </h2>
                <p className="text-xs text-slate-500">Track and manage service requests from the Services page</p>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No service bookings yet.</div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <span className="text-xs font-mono font-semibold text-[#42ADF5] uppercase">
                            {inq.service_title}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {inq.client_name} ({inq.client_email})
                          </h4>
                          {inq.client_phone && (
                            <span className="text-xs text-slate-500 font-mono">Contact: {inq.client_phone}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">{inq.budget_range || 'Standard'}</span>
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            className="text-xs px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-semibold"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="font-semibold block text-slate-500 mb-1">Project Scope:</span>
                        {inq.project_scope}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Media Library & Secure Uploads
                  </h2>
                  <p className="text-xs text-slate-500">Upload and manage project screenshots, logos, and PDF assets</p>
                </div>
                <label className="px-3 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Sn Ponleu Hero Portrait', path: '/src/assets/images/sn_ponleu_hero_portrait_1793269460566.jpg' },
                  { name: 'Server Workstation Activity', path: '/src/assets/images/sn_working_activity_1793269461758.jpg' },
                  { name: 'Nimbus Project Showcase', path: '/src/assets/images/sn_project_showcase_1793269462759.jpg' },
                  { name: 'Software Toolkit Workspace', path: '/src/assets/images/sn_software_toolkit_1793269461578.jpg' },
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-900 group">
                    <div className="aspect-square relative">
                      <img src={item.path} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5 bg-white dark:bg-[#0B1220] text-xs">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.path);
                          toast('Copied asset path to clipboard!', 'info');
                        }}
                        className="text-[11px] text-[#1677FF] dark:text-[#42ADF5] hover:underline mt-1 block cursor-pointer"
                      >
                        Copy Path
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: SETTINGS & ADMIN ACCOUNT */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  System Configuration & Admin Credentials
                </h2>
                <p className="text-xs text-slate-500">Manage hub branding, database connection, and security</p>
              </div>

              {/* Security & Password Form */}
              <form onSubmit={handleUpdateAdminAccount} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <KeyRound className="w-4 h-4 text-[#42ADF5]" />
                  <span>Update Administrator Credentials</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Admin Full Name</label>
                  <input
                    type="text"
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Admin Email</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors cursor-pointer"
                >
                  Update Credentials
                </button>
              </form>

              {/* Database Schema & phpMyAdmin Instructions */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Database className="w-4 h-4 text-[#42ADF5]" />
                  <span>Database Setup & phpMyAdmin Import Guide</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  This hub is built around the production schema <code className="font-mono text-[#42ADF5]">sn_ponleu_db.sql</code>. To import into phpMyAdmin:
                </p>
                <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 font-mono">
                  <li>Open phpMyAdmin (e.g. at http://localhost/phpmyadmin)</li>
                  <li>Click <strong>Import</strong> tab in the navigation</li>
                  <li>Choose file <code>database/sn_ponleu_db.sql</code> and click <strong>Go</strong></li>
                  <li>Ensure character set is set to <code>utf8mb4</code> for full Khmer Unicode support</li>
                </ol>
                <div className="pt-2">
                  <a
                    href="/api/export-db/sql"
                    download="sn_ponleu_db.sql"
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#1677FF] dark:text-[#42ADF5] border border-blue-300 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download sn_ponleu_db.sql File</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Immutable Security & Audit Trails ({auditLogs.length})
                  </h2>
                  <p className="text-xs text-slate-500">Real-time log of administrative logins, content mutations, and uploads</p>
                </div>
                <button
                  onClick={loadAdminData}
                  className="text-xs text-[#1677FF] dark:text-[#42ADF5] hover:underline cursor-pointer"
                >
                  Refresh Logs
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#42ADF5]">{log.action}</span>
                      <span className="text-slate-500 ml-2">[{log.target_module}]</span>
                      <p className="text-slate-600 dark:text-slate-400 font-sans mt-0.5">{log.details}</p>
                    </div>
                    <div className="text-right text-slate-400 shrink-0 text-[11px]">
                      <div>{log.created_at}</div>
                      <div>IP: {log.ip_address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FALLBACK FOR SERVICES / AI_TOOLS TAB IN ADMIN */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Service Packages ({services.length})
                </h2>
                <p className="text-xs text-slate-500">Live service offerings and starting price tags</p>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                {services.map((srv) => (
                  <div key={srv.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{srv.title_en}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{srv.starting_price} · {srv.features_en.length} deliverables</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-500 font-semibold">ACTIVE</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai_tools' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  AI Tools Directory Listings ({aiTools.length})
                </h2>
                <p className="text-xs text-slate-500">Curated AI technologies and official URLs</p>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                {aiTools.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{t.category} · {t.pricing}</p>
                    </div>
                    <a href={t.official_url} target="_blank" rel="noreferrer" className="text-xs text-[#42ADF5] hover:underline flex items-center gap-1">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
