export type Language = 'en' | 'km';
export type Theme = 'dark' | 'light';

export interface Profile {
  id: number;
  full_name_en: string;
  full_name_km: string;
  title_en: string;
  title_km: string;
  bio_en: string;
  bio_km: string;
  about_details_en: string;
  about_details_km: string;
  avatar_url: string;
  resume_url: string;
  email: string;
  phone: string;
  telegram_handle: string;
  location_en: string;
  location_km: string;
  years_experience: number;
  github_url: string;
  linkedin_url: string;
  facebook_url: string;
  youtube_url: string;
}

export interface Skill {
  id: number;
  name_en: string;
  name_km: string;
  category: 'frontend' | 'backend' | 'devops_cloud' | 'design' | 'ict_hardware' | 'database' | 'tools';
  proficiency: number;
  icon?: string;
  is_featured: boolean;
  sort_order: number;
}

export interface Education {
  id: number;
  institution_en: string;
  institution_km: string;
  degree_en: string;
  degree_km: string;
  field_en: string;
  field_km: string;
  start_year: string;
  end_year: string;
  description_en: string;
  description_km: string;
  sort_order: number;
}

export interface Experience {
  id: number;
  company_en: string;
  company_km: string;
  role_en: string;
  role_km: string;
  period_en: string;
  period_km: string;
  is_current: boolean;
  description_en: string;
  description_km: string;
  technologies: string;
  sort_order: number;
}

export interface Certification {
  id: number;
  title_en: string;
  title_km: string;
  issuer_en: string;
  issuer_km: string;
  issue_date: string;
  credential_id?: string;
  credential_url?: string;
  sort_order: number;
}

export interface GalleryItem {
  id: number;
  title_en: string;
  title_km: string;
  description_en: string;
  description_km: string;
  image_url: string;
  category: 'server_network' | 'workspace_setup' | 'troubleshooting' | 'design_creative' | 'training_workshop';
  activity_date: string;
  is_published: boolean;
}

export interface Project {
  id: number;
  title_en: string;
  title_km: string;
  slug: string;
  summary_en: string;
  summary_km: string;
  description_en: string;
  description_km: string;
  cover_image: string;
  category: 'web_development' | 'systems_ict' | 'ui_ux_design' | 'mobile_app' | 'automation';
  technologies: string;
  status: 'completed' | 'in_progress' | 'planned';
  demo_url?: string;
  source_code_url?: string;
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
  created_at: string;
}

export interface Software {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  slug: string;
  logo_url: string;
  short_desc_en: string;
  short_desc_km: string;
  description_en: string;
  description_km: string;
  supported_os: string;
  version: string;
  file_size: string;
  license_type: 'Free' | 'Open Source' | 'Freemium' | 'Commercial';
  official_url: string;
  download_url: string;
  install_guide_en?: string;
  install_guide_km?: string;
  system_req_en?: string;
  system_req_km?: string;
  downloads_count: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

export interface BlogPost {
  id: number;
  category_id: number;
  category_name?: string;
  title_en: string;
  title_km: string;
  slug: string;
  cover_image: string;
  summary_en: string;
  summary_km: string;
  content_en: string;
  content_km: string;
  author_name: string;
  read_time_minutes: number;
  views_count: number;
  seo_title?: string;
  seo_desc?: string;
  tags?: string[];
  is_published: boolean;
  published_at: string;
}

export interface AITool {
  id: number;
  name: string;
  category: string;
  description_en: string;
  description_km: string;
  official_url: string;
  use_cases_en: string;
  use_cases_km: string;
  pricing: string;
  icon_url?: string;
  is_featured: boolean;
  sort_order: number;
}

export interface Service {
  id: number;
  title_en: string;
  title_km: string;
  slug: string;
  description_en: string;
  description_km: string;
  features_en: string[];
  features_km: string[];
  starting_price?: string;
  icon_name: string;
  is_active: boolean;
  sort_order: number;
}

export interface ServiceInquiry {
  id: number;
  service_id?: number;
  service_title: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  project_scope: string;
  budget_range?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'archived';
  admin_notes?: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone_or_telegram?: string;
  is_read: boolean;
  status: 'unread' | 'read' | 'replied' | 'spam';
  created_at: string;
}

export interface MediaFile {
  id: number;
  file_name: string;
  file_path: string;
  mime_type: string;
  file_size_bytes: number;
  uploaded_by?: number;
  alt_text?: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  admin_id?: number;
  action: string;
  target_module: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalSoftware: number;
  totalDownloads: number;
  totalBlogPosts: number;
  totalBlogViews: number;
  totalGalleryItems: number;
  totalAITools: number;
  totalServices: number;
  unreadMessages: number;
  totalMessages: number;
  newInquiries: number;
  totalInquiries: number;
  mediaCount: number;
}

export interface SearchResults {
  projects: Project[];
  software: Software[];
  blog: BlogPost[];
  ai_tools: AITool[];
  services: Service[];
}
