import fs from 'fs';
import path from 'path';

export interface Admin {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'superadmin' | 'editor' | 'moderator';
  avatar_url?: string;
  is_active: number;
  created_at: string;
}

export interface AdminSession {
  id: number;
  admin_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

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

export interface DatabaseStore {
  admins: Admin[];
  sessions: AdminSession[];
  profile: Profile;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  working_gallery: GalleryItem[];
  projects: Project[];
  software: Software[];
  blog_posts: BlogPost[];
  ai_tools: AITool[];
  services: Service[];
  service_inquiries: ServiceInquiry[];
  contact_messages: ContactMessage[];
  media_files: MediaFile[];
  website_settings: Record<string, string>;
  audit_logs: AuditLog[];
}

const DATA_FILE = path.resolve(process.cwd(), 'database', 'store.json');

// Initial seed matching database/sn_ponleu_db.sql
const initialData: DatabaseStore = {
  admins: [
    {
      id: 1,
      username: 'ponleu',
      email: 'ponleuofficial07@gmail.com',
      password_hash: 'admin123', // Demo/development direct verification with hashing support
      full_name: 'SN Ponleu',
      role: 'superadmin',
      avatar_url: '/src/assets/images/sn_ponleu_hero_portrait_1793269460566.jpg',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
  ],
  sessions: [],
  profile: {
    id: 1,
    full_name_en: 'SN Ponleu',
    full_name_km: 'ស៊ុន ពន្លឺ',
    title_en: 'ICT Specialist & Creative Designer',
    title_km: 'អ្នកឯកទេសបច្ចេកវិទ្យា ICT & អ្នករចនាច្នៃប្រឌិត',
    bio_en: 'Passionate ICT Specialist and Creative Designer dedicated to building high-performance digital platforms, enterprise IT infrastructure, and visually striking interactive web applications.',
    bio_km: 'អ្នកឯកទេសបច្ចេកវិទ្យាព័ត៌មាន (ICT) និងអ្នករចនាច្នៃប្រឌិត ដែលមានការប្តេជ្ញាចិត្តខ្ពស់ក្នុងការកសាងប្រព័ន្ធឌីជីថលហេដ្ឋារចនាសម្ព័ន្ធ IT និងកម្មវិធីគេហទំព័រទំនើប។',
    about_details_en: 'With over 5 years of hands-on experience in computer troubleshooting, network infrastructure, full-stack web engineering, and modern creative UI/UX design, I bridge technology and artistic presentation to empower businesses and learners.',
    about_details_km: 'ជាមួយនឹងបទពិសោធន៍ជាក់ស្តែងជាង ៥ ឆ្នាំក្នុងវិស័យដោះស្រាយបញ្ហាកុំព្យូទ័រ ហេដ្ឋារចនាសម្ព័ន្ធបណ្តាញ អភិវឌ្ឍន៍គេហទំព័រ និងការរចនា UI/UX ខ្ញុំផ្សារភ្ជាប់បច្ចេកវិទ្យានិងសិល្បៈច្នៃប្រឌិត ដើម្បីជួយសម្រួលដល់អាជីវកម្ម និងអ្នកសិក្សា។',
    avatar_url: '/src/assets/images/sn_ponleu_hero_portrait_1793269460566.jpg',
    resume_url: '#resume-download',
    email: 'ponleuofficial07@gmail.com',
    phone: '+855 12 345 678',
    telegram_handle: '@snponleu',
    location_en: 'Phnom Penh, Cambodia',
    location_km: 'រាជធានីភ្នំពេញ កម្ពុជា',
    years_experience: 5,
    github_url: 'https://github.com/snponleu',
    linkedin_url: 'https://linkedin.com/in/snponleu',
    facebook_url: 'https://facebook.com/snponleu',
    youtube_url: 'https://youtube.com/@snponleu',
  },
  skills: [
    { id: 1, name_en: 'React & TypeScript', name_km: 'React & TypeScript', category: 'frontend', proficiency: 95, icon: 'Code2', is_featured: true, sort_order: 1 },
    { id: 2, name_en: 'Node.js & Express', name_km: 'Node.js & Express', category: 'backend', proficiency: 90, icon: 'Server', is_featured: true, sort_order: 2 },
    { id: 3, name_en: 'Computer Systems & IT Support', name_km: 'ប្រព័ន្ធកុំព្យូទ័រ & IT Support', category: 'ict_hardware', proficiency: 98, icon: 'Cpu', is_featured: true, sort_order: 3 },
    { id: 4, name_en: 'Network Engineering (LAN/VLAN/Routing)', name_km: 'វិស្វកម្មបណ្តាញ (LAN/Routing)', category: 'ict_hardware', proficiency: 92, icon: 'Network', is_featured: true, sort_order: 4 },
    { id: 5, name_en: 'UI/UX & Graphic Design (Figma/Photoshop)', name_km: 'រចនា UI/UX & ក្រាហ្វិក', category: 'design', proficiency: 94, icon: 'Palette', is_featured: true, sort_order: 5 },
    { id: 6, name_en: 'MySQL & Database Architecture', name_km: 'MySQL & ស្ថាបត្យកម្មទិន្នន័យ', category: 'database', proficiency: 88, icon: 'Database', is_featured: true, sort_order: 6 },
    { id: 7, name_en: 'Linux Server Administration', name_km: 'គ្រប់គ្រងម៉ាស៊ីនមេ Linux', category: 'devops_cloud', proficiency: 86, icon: 'Terminal', is_featured: true, sort_order: 7 },
    { id: 8, name_en: 'Artificial Intelligence & Prompt Engineering', name_km: 'បញ្ញាសិប្បនិម្មិត & Prompting', category: 'tools', proficiency: 92, icon: 'Sparkles', is_featured: true, sort_order: 8 },
  ],
  education: [
    {
      id: 1,
      institution_en: 'Royal University of Phnom Penh (RUPP)',
      institution_km: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ',
      degree_en: 'Bachelor of Science (B.Sc.)',
      degree_km: 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រ',
      field_en: 'Computer Science and Engineering',
      field_km: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ និងវិស្វកម្ម',
      start_year: '2019',
      end_year: '2023',
      description_en: 'Focused on system software development, advanced network topology, and database management systems with academic honors.',
      description_km: 'ផ្តោតលើការអភិវឌ្ឍប្រព័ន្ធសូហ្វវែរ ស្ថាបត្យកម្មបណ្តាញ និងប្រព័ន្ធគ្រប់គ្រងមូលដ្ឋានទិន្នន័យ ដោយទទួលបានលទ្ធផលសិក្សាល្អប្រសើរ។',
      sort_order: 1,
    },
    {
      id: 2,
      institution_en: 'National Institute of Posts, Telecom & ICT (NIPTICT)',
      institution_km: 'វិទ្យាស្ថានជាតិប្រៃសណីយ៍ ទូរគមនាគមន៍ និងបច្ចេកវិទ្យា',
      degree_en: 'Professional Diploma',
      degree_km: 'សញ្ញាបត្រវិជ្ជាជីវៈជាន់ខ្ពស់',
      field_en: 'Network Security & Infrastructure',
      field_km: 'សន្តិសុខបណ្តាញ និងហេដ្ឋារចនាសម្ព័ន្ធ',
      start_year: '2021',
      end_year: '2022',
      description_en: 'Specialized practical laboratory training in firewall configuration, server hardening, and enterprise routing.',
      description_km: 'ការបណ្តុះបណ្តាលអនុវត្តផ្ទាល់ក្នុងការកំណត់ Firewall ការពារម៉ាស៊ីនមេ និងប្រព័ន្ធបណ្តាញកម្រិតសហគ្រាស។',
      sort_order: 2,
    },
  ],
  experience: [
    {
      id: 1,
      company_en: 'Ponleu Tech Solutions',
      company_km: 'ពន្លឺ ថេក សូលូសិន',
      role_en: 'Senior ICT Consultant & Lead Developer',
      role_km: 'ទីប្រឹក្សាជាន់ខ្ពស់ ICT & ប្រធានផ្នែកអភិវឌ្ឍន៍',
      period_en: '2023 - Present',
      period_km: '២០២៣ - បច្ចុប្បន្ន',
      is_current: true,
      description_en: 'Directing end-to-end digital transformation for SME clients, delivering resilient full-stack platforms and enterprise computer diagnostics.',
      description_km: 'ដឹកនាំការកែប្រែប្រព័ន្ធឌីជីថលសម្រាប់អតិថិជនសហគ្រាស ផ្តល់ជូនដំណោះស្រាយគេហទំព័រ និងការដោះស្រាយបញ្ហាប្រព័ន្ធកុំព្យូទ័រ។',
      technologies: 'React, Node.js, Linux, MySQL, Docker',
      sort_order: 1,
    },
    {
      id: 2,
      company_en: 'CyberNet Global Cambodia',
      company_km: 'សាយប័រណេត ហ្គ្លូប៊ល កម្ពុជា',
      role_en: 'ICT Support Specialist & Systems Engineer',
      role_km: 'អ្នកឯកទេសគាំទ្របច្ចេកវិទ្យា & វិស្វករប្រព័ន្ធ',
      period_en: '2021 - 2023',
      period_km: '២០២១ - ២០២៣',
      is_current: false,
      description_en: 'Maintained 150+ network endpoints, server racks, managed corporate backup schedules, and resolved urgent hardware/software bottlenecks.',
      description_km: 'គ្រប់គ្រងម៉ាស៊ីនមេនិងឧបករណ៍បណ្តាញជាង ១៥០ គ្រឿង ត្រួតពិនិត្យប្រព័ន្ធបម្រុងទុកទិន្នន័យ និងដោះស្រាយបញ្ហាបច្ចេកវិទ្យាប្រចាំថ្ងៃ។',
      technologies: 'Windows Server, MikroTik, Cisco, Active Directory',
      sort_order: 2,
    },
  ],
  certifications: [
    {
      id: 1,
      title_en: 'Cisco Certified Network Associate (CCNA)',
      title_km: 'វិញ្ញាបនបត្របណ្តាញ Cisco (CCNA)',
      issuer_en: 'Cisco Systems',
      issuer_km: 'ក្រុមហ៊ុន Cisco Systems',
      issue_date: '2023-04-15',
      credential_id: 'CSCO-14298110',
      credential_url: 'https://cisco.com/verify',
      sort_order: 1,
    },
    {
      id: 2,
      title_en: 'CompTIA Security+ Certification',
      title_km: 'វិញ្ញាបនបត្រសុវត្ថិភាព CompTIA Security+',
      issuer_en: 'CompTIA',
      issuer_km: 'វិទ្យាស្ថាន CompTIA',
      issue_date: '2023-09-20',
      credential_id: 'COMP001029381',
      credential_url: 'https://comptia.org/verify',
      sort_order: 2,
    },
    {
      id: 3,
      title_en: 'Google Professional Cloud Architect',
      title_km: 'ស្ថាបត្យករពពកអាជីព Google Cloud',
      issuer_en: 'Google Cloud',
      issuer_km: 'ហ្គូហ្គល',
      issue_date: '2024-02-10',
      credential_id: 'GCP-ARCH-99412',
      credential_url: 'https://cloud.google.com',
      sort_order: 3,
    },
  ],
  working_gallery: [
    {
      id: 1,
      title_en: 'Data Center Rack Optimization & Patch Panel Assembly',
      title_km: 'ការរៀបចំទូ Rack និងខ្សែបណ្តាញ Patch Panel',
      description_en: 'Cable management, enterprise Gigabit switch configuration, and uninterruptible power supply check.',
      description_km: 'ការរៀបចំខ្សែបណ្តាញឱ្យមានសណ្តាប់ធ្នាប់ កំណត់ Switch Gigabit និងត្រួតពិនិត្យប្រព័ន្ធភ្លើងបម្រុងទុក UPS។',
      image_url: '/src/assets/images/sn_working_activity_1793269461758.jpg',
      category: 'server_network',
      activity_date: '2026-03-12',
      is_published: true,
    },
    {
      id: 2,
      title_en: 'Dual-Monitor Workstation & Creative Interface Coding',
      title_km: 'តុការងារអេក្រង់ភ្លោះ និងការសរសេរកូដ UI ច្នៃប្រឌិត',
      description_en: 'Designing high-fidelity UI components for the client portal and fine-tuning responsive layout breakpoints.',
      description_km: 'ការរចនាផ្ទាំងទិដ្ឋភាពកម្មវិធីសម្រាប់អតិថិជន និងការសរសេរកូដរៀបចំទំហំអេក្រង់ទូរស័ព្ទ និងកុំព្យូទ័រ។',
      image_url: '/src/assets/images/sn_software_toolkit_1793269461578.jpg',
      category: 'workspace_setup',
      activity_date: '2026-03-25',
      is_published: true,
    },
    {
      id: 3,
      title_en: 'Hardware Diagnostic & Thermal Pasting Overhaul',
      title_km: 'ការពិនិត្យម៉ាស៊ីន និងផ្លាស់ប្តូរស៊ីលីកូនកម្ដៅ (Thermal Paste)',
      description_en: 'Deep cleaning industrial grade desktop towers, repasting CPU heat sinks, and stress-testing RAM banks.',
      description_km: 'ការសម្អាតម៉ាស៊ីនកុំព្យូទ័រធំៗ ប្តូរស៊ីលីកូនត្រជាក់លើ CPU និងធ្វើតេស្តសាកល្បងល្បឿន RAM។',
      image_url: '/src/assets/images/sn_working_activity_1793269461758.jpg',
      category: 'troubleshooting',
      activity_date: '2026-04-02',
      is_published: true,
    },
  ],
  projects: [
    {
      id: 1,
      title_en: 'Nimbus Cloud Infrastructure Console',
      title_km: 'ផ្ទាំងគ្រប់គ្រងហេដ្ឋារចនាសម្ព័ន្ធពពក Nimbus',
      slug: 'nimbus-cloud-console',
      summary_en: 'Real-time telemetry and resource provisioning platform for hybrid cloud clusters.',
      summary_km: 'ប្រព័ន្ធតាមដានទិន្នន័យជាក់ស្តែង និងគ្រប់គ្រងធនធានម៉ាស៊ីនមេលើពពកសម្រាប់សហគ្រាស។',
      description_en: 'Nimbus is an enterprise-grade cloud management console providing zero-latency server metrics, network traffic analytics, automated SSL lifecycle renewing, and node scale triggers.',
      description_km: 'Nimbus គឺជាផ្ទាំងបញ្ជាគ្រប់គ្រងកម្រិតសហគ្រាស ដែលផ្តល់ព័ត៌មានល្បឿនលឿនពីម៉ាស៊ីនមេ វិភាគចរាចរណ៍បណ្តាញ ការបន្តវិញ្ញាបនបត្រ SSL ដោយស្វ័យប្រវត្តិ។',
      cover_image: '/src/assets/images/sn_project_showcase_1793269462759.jpg',
      category: 'systems_ict',
      technologies: 'React, TypeScript, Node.js, Tailwind CSS, Docker',
      status: 'completed',
      demo_url: 'https://nimbus-demo.internal',
      source_code_url: 'https://github.com/snponleu/nimbus-cloud',
      is_featured: true,
      is_published: true,
      views_count: 1420,
      created_at: '2026-01-15',
    },
    {
      id: 2,
      title_en: 'Smart ICT Diagnostic & Asset Registry',
      title_km: 'ប្រព័ន្ធវិភាគរោគសញ្ញា ICT និងបញ្ជីឧបករណ៍',
      slug: 'smart-ict-diagnostic',
      summary_en: 'Automated equipment auditing tool and hardware fault isolation portal.',
      summary_km: 'ឧបករណ៍ស្កេនពិនិត្យបញ្ជីឧបករណ៍បច្ចេកវិទ្យា និងកំណត់ចំណុចខូចខាតកុំព្យូទ័រដោយស្វ័យប្រវត្តិ។',
      description_en: 'Designed for enterprise IT desks to track device warranty, system specs, IP allocation, and remote ticket resolution history.',
      description_km: 'បង្កើតឡើងសម្រាប់ក្រុមការងារ IT ដើម្បីតាមដានការធានា ព័ត៌មានម៉ាស៊ីន ការបែងចែក IP និងប្រវត្តិដោះស្រាយបញ្ហា។',
      cover_image: '/src/assets/images/sn_working_activity_1793269461758.jpg',
      category: 'web_development',
      technologies: 'React, Express, MySQL, GraphQL',
      status: 'completed',
      demo_url: 'https://ict-asset.internal',
      source_code_url: 'https://github.com/snponleu/ict-audit',
      is_featured: true,
      is_published: true,
      views_count: 980,
      created_at: '2026-02-20',
    },
    {
      id: 3,
      title_en: 'Khmer Typography & Creative Graphic Hub',
      title_km: 'មជ្ឈមណ្ឌលអក្សរពុម្ពខ្មែរ និងក្រាហ្វិកឌីហ្សាញ',
      slug: 'khmer-typography-hub',
      summary_en: 'Interactive digital showcase of modern Khmer font design and vector asset library.',
      summary_km: 'កន្លែងបង្ហាញពុម្ពអក្សរខ្មែរទំនើប និងបណ្ណាល័យរូបភាព Vector សម្រាប់អ្នករចនា។',
      description_en: 'Features interactive font previews, kerning adjustment playgrounds, and downloadable vector branding resources tailored for Cambodian creatives.',
      description_km: 'មានមុខងារសាកល្បងពុម្ពអក្សរ កែសម្រួលគម្លាតអក្សរ និងទាញយករូបភាព Vector សម្រាប់អ្នកច្នៃប្រឌិតខ្មែរ។',
      cover_image: '/src/assets/images/sn_software_toolkit_1793269461578.jpg',
      category: 'ui_ux_design',
      technologies: 'Figma, React, Tailwind CSS, SVG Engine',
      status: 'completed',
      demo_url: 'https://khmertype.internal',
      source_code_url: 'https://github.com/snponleu/khmer-type',
      is_featured: false,
      is_published: true,
      views_count: 750,
      created_at: '2026-03-05',
    },
  ],
  software: [
    {
      id: 1,
      category_id: 1,
      category_name: 'Computer Utilities & Maintenance',
      name: 'Ponleu FastSystem Cleaner Pro',
      slug: 'ponleu-fastsystem-cleaner',
      logo_url: '/src/assets/images/sn_software_toolkit_1793269461578.jpg',
      short_desc_en: 'Lightweight utility for temp cache flushing, registry audit, and startup app trim.',
      short_desc_km: 'កម្មវិធីលុបឯកសារសំរាម កែសម្រួល Startup និងបង្កើនល្បឿន Windows យ៉ាងរហ័ស។',
      description_en: 'A trusted computer maintenance utility tailored for Windows and macOS to reclaim disk space, identify background CPU hogs, and optimize startup sequences.',
      description_km: 'កម្មវិធីថែទាំកុំព្យូទ័រដែលទុកចិត្តបាន ជួយបង្កើនទំហំផ្ទុកថាសរឹង ស្វែងរកកម្មវិធីស៊ី CPU និងបង្កើនល្បឿនបើកម៉ាស៊ីន។',
      supported_os: 'Windows 10/11 (64-bit), macOS 13+',
      version: 'v3.2.0',
      file_size: '18.4 MB',
      license_type: 'Free',
      official_url: 'https://github.com/snponleu/system-cleaner',
      download_url: 'https://github.com/snponleu/system-cleaner/releases/download/v3.2.0/FastSystemCleaner-Setup.exe',
      install_guide_en: '1. Download the setup file.\n2. Run as Administrator.\n3. Follow the clean wizard steps.',
      install_guide_km: '១. ទាញយកឯកសារដំឡើង\n២. ចុច Run as Administrator\n៣. អនុវត្តតាមការណែនាំលើអេក្រង់',
      system_req_en: '2 GB RAM, 50 MB Free Disk Space',
      system_req_km: 'RAM 2 GB, ទំហំផ្ទុកទំនេរ 50 MB',
      downloads_count: 3420,
      is_featured: true,
      is_published: true,
      created_at: '2026-02-10',
    },
    {
      id: 2,
      category_id: 2,
      category_name: 'Web Development & Coding',
      name: 'DevStack Local Server Suite',
      slug: 'devstack-local-server',
      logo_url: '/src/assets/images/sn_project_showcase_1793269462759.jpg',
      short_desc_en: 'Portable multi-version PHP, Node, and MySQL local sandbox environment.',
      short_desc_km: 'កញ្ចប់ម៉ាស៊ីនមេក្នុងស្រុកសម្រាប់សរសេរកូដ PHP, Node.js និង MySQL ដោយងាយស្រួល។',
      description_en: 'Configured with instant phpMyAdmin access, SSL local certificates, and zero port conflicts.',
      description_km: 'ភ្ជាប់មកជាមួយ phpMyAdmin វិញ្ញាបនបត្រ SSL សម្រាប់តេស្ត និងមិនជាន់ Port គ្នា។',
      supported_os: 'Windows 11, macOS Apple Silicon, Ubuntu 22.04+',
      version: 'v2.8.4',
      file_size: '124 MB',
      license_type: 'Open Source',
      official_url: 'https://github.com/snponleu/devstack-suite',
      download_url: 'https://github.com/snponleu/devstack-suite/releases/download/v2.8.4/DevStackInstaller.pkg',
      install_guide_en: '1. Extract or run the installer.\n2. Open dashboard on localhost:8080.\n3. Launch phpMyAdmin.',
      install_guide_km: '១. បើកដំណើរការកម្មវិធីដំឡើង\n២. បើកផ្ទាំងគ្រប់គ្រង localhost:8080\n៣. ចូលប្រើប្រាស់ phpMyAdmin',
      system_req_en: '4 GB RAM, Dual Core CPU',
      system_req_km: 'RAM 4 GB, CPU ២ គ្រាប់',
      downloads_count: 2890,
      is_featured: true,
      is_published: true,
      created_at: '2026-02-28',
    },
    {
      id: 3,
      category_id: 4,
      category_name: 'Network & Security Tools',
      name: 'NetProbe IP & Port Visualizer',
      slug: 'netprobe-ip-visualizer',
      logo_url: '/src/assets/images/sn_working_activity_1793269461758.jpg',
      short_desc_en: 'Intuitive subnet discovery, open port tester, and latency graphing utility.',
      short_desc_km: 'ឧបករណ៍ស្កេន IP ក្នុងបណ្តាញ តេស្តច្រក Port និងវាស់ល្បឿន Ping ក្រាហ្វិក។',
      description_en: 'Essential ICT tool for network admins to audit devices, detect DHCP collisions, and verify gateway responsiveness.',
      description_km: 'ឧបករណ៍ចាំបាច់សម្រាប់អ្នកគ្រប់គ្រងបណ្តាញ ដើម្បីស្វែងរកឧបករណ៍ ពិនិត្យបញ្ហា DHCP និងល្បឿន Gateway។',
      supported_os: 'Cross-Platform (Electron / Native C++)',
      version: 'v1.4.1',
      file_size: '32.1 MB',
      license_type: 'Free',
      official_url: 'https://github.com/snponleu/netprobe',
      download_url: 'https://github.com/snponleu/netprobe/releases/download/v1.4.1/NetProbe-Setup.exe',
      install_guide_en: 'Run directly as portable or install with one click.',
      install_guide_km: 'អាចដំណើរការផ្ទាល់ជា Portable ឬដំឡើងមួយចុច។',
      system_req_en: 'Any 64-bit OS with network interface',
      system_req_km: 'ប្រព័ន្ធប្រតិបត្តិការ 64-bit ដែលមានកាតបណ្តាញ',
      downloads_count: 1950,
      is_featured: false,
      is_published: true,
      created_at: '2026-03-15',
    },
  ],
  blog_posts: [
    {
      id: 1,
      category_id: 1,
      category_name: 'Windows Tips & Fixes',
      title_en: 'Top 7 Methods to Fix 100% Disk Usage in Windows 11',
      title_km: 'វិធីសាស្ត្រកំពូលទាំង ៧ ដើម្បីដោះស្រាយបញ្ហា Disk Usage 100% លើ Windows 11',
      slug: 'fix-100-percent-disk-usage-windows-11',
      cover_image: '/src/assets/images/sn_working_activity_1793269461758.jpg',
      summary_en: 'Step-by-step diagnostic guide to stop background freezing, disable runaway SysMain, and restore snappy system response.',
      summary_km: 'ការណែនាំលម្អិតជាជំហានៗដើម្បីបញ្ឈប់ភាពគាំង ផ្អាកសេវា SysMain ដែលដំណើរការខុសប្រក្រតី និងធ្វើឱ្យកុំព្យូទ័រដើរលឿនដូចដើម។',
      content_en: `When your Task Manager shows a persistent 100% disk usage, your laptop or desktop can stutter dramatically.

### Step 1: Disable SysMain Service
Open Services (services.msc), scroll down to **SysMain**, right-click and choose **Properties**. Change Startup type to **Disabled** and click **Stop**.

### Step 2: Check for Storage Drive File System Errors
Run an elevated Command Prompt (\`cmd\` as Administrator) and execute:
\`\`\`bash
chkdsk C: /f /r
\`\`\`

### Step 3: Upgrade to NVMe SSD if using an HDD
Legacy mechanical spinning drives cannot handle modern Windows telemetry and background indexing simultaneously. Upgrading to a fast SATA or NVMe solid state drive will immediately eliminate the bottleneck.`,
      content_km: `នៅពេលដែល Task Manager បង្ហាញ Disk 100% ជាប់រហូត ម៉ាស៊ីនកុំព្យូទ័ររបស់អ្នកនឹងមានសភាពគាំងយឺតខ្លាំង។

### ជំហានទី ១៖ បិទសេវាកម្ម SysMain
បើក Services (services.msc) រួចស្វែងរក **SysMain** ចុចកណ្ដុរស្ដាំជ្រើសរើស **Properties** ប្តូរ Startup type ទៅជា **Disabled** រួចចុច **Stop**។

### ជំហានទី ២៖ ត្រួតពិនិត្យកំហុស Hard Disk
បើក Command Prompt (cmd as Administrator) រួចវាយពាក្យបញ្ជា៖
\`\`\`bash
chkdsk C: /f /r
\`\`\`

### ជំហានទី ៣៖ ប្តូរមកប្រើ SSD ប្រសិនបើកំពុងប្រើ Hard Disk ចាស់
Hard Disk ចានបង្វិលបុរាណមិនអាចទ្រទ្រង់ដំណើរការរបស់ Windows 11 ជំនាន់ថ្មីបានឡើយ។ ការប្តូរមកប្រើប្រាស់ SSD នឹងធ្វើឱ្យម៉ាស៊ីនដំណើរការលឿនជាងមុន ១០ ដងភ្លាមៗ។`,
      author_name: 'SN Ponleu',
      read_time_minutes: 6,
      views_count: 2340,
      seo_title: 'Fix 100% Disk Usage Windows 11 - SN Ponleu ICT Blog',
      seo_desc: 'Complete tutorial for resolving high disk usage issues on Windows 10 and 11.',
      tags: ['Windows 11', 'Troubleshooting', 'SSD', 'Performance'],
      is_published: true,
      published_at: '2026-03-01',
    },
    {
      id: 2,
      category_id: 2,
      category_name: 'Computer Troubleshooting',
      title_en: 'Complete Computer Hardware Diagnostic: Testing RAM & SSD Health',
      title_km: 'វិធីសាស្ត្រតេស្តសុខភាព RAM និង SSD កុំព្យូទ័រដោយខ្លួនឯង',
      slug: 'complete-computer-hardware-diagnostic',
      cover_image: '/src/assets/images/sn_software_toolkit_1793269461578.jpg',
      summary_en: 'Learn how to detect failing memory modules (Blue Screen of Death) and monitor SSD TBW endurance before data loss happens.',
      summary_km: 'ស្វែងយល់ពីរបៀបពិនិត្យ RAM ដែលមានបញ្ហាបណ្តាលឱ្យឡើងផ្ទាំងខៀវ (BSOD) និងតាមដានអាយុកាល SSD ដើម្បីការពារការបាត់បង់ទិន្នន័យ។',
      content_en: `Proactive hardware testing prevents critical data loss and random system restarts.

### 1. Memory Diagnostic Tool
Press \`Windows + R\`, type \`mdsched.exe\` and select **Restart now and check for problems**. This built-in Windows tester checks every address sector in physical RAM.

### 2. SMART Attributes on NVMe Drives
Use tools like CrystalDiskInfo to read the Drive Life percentage, Total Bytes Written (TBW), and Bad Sector reallocations. If health drops below 70%, schedule an immediate cloud backup!`,
      content_km: `ការថែទាំជាប្រចាំជួយសង្គ្រោះទិន្នន័យដ៏មានតម្លៃរបស់អ្នក។

### ១. ឧបករណ៍តេស្ត RAM
ចុច \`Windows + R\` វាយពាក្យ \`mdsched.exe\` ហើយជ្រើសរើស **Restart now and check for problems**។ កម្មវិធីនឹងស្កេនគ្រប់ទីតាំងរបស់ RAM ដើម្បីរកមើលកំហុស។

### ២. ពិនិត្យសុខភាព SSD
ប្រើប្រាស់កម្មវិធី CrystalDiskInfo ដើម្បីមើលភាគរយសុខភាព Drive និងចំនួនទិន្នន័យដែលបានសរសេរ (TBW)។ ប្រសិនបើសុខភាពធ្លាក់ចុះក្រោម 70% គួរបម្រុងទុកទិន្នន័យជាបន្ទាន់!`,
      author_name: 'SN Ponleu',
      read_time_minutes: 5,
      views_count: 1870,
      seo_title: 'Testing RAM and SSD Health - SN Ponleu',
      seo_desc: 'Hardware diagnostics tutorial for ICT specialists and enthusiasts.',
      tags: ['Hardware', 'RAM', 'Storage', 'Diagnostic'],
      is_published: true,
      published_at: '2026-03-10',
    },
  ],
  ai_tools: [
    {
      id: 1,
      name: 'Google Gemini 2.5 / 3.0',
      category: 'AI Productivity',
      description_en: 'Google flagship multimodal model with ultra-fast reasoning, search grounding, and vast context window.',
      description_km: 'ម៉ូដែលឆ្លាតវៃពហុទម្រង់របស់ Google ដែលមានសមត្ថភាពវិភាគខ្ពស់ និងឆ្លើយសំណួរយ៉ាងរហ័ស។',
      official_url: 'https://gemini.google.com',
      use_cases_en: 'Coding, document synthesis, real-time research, Khmer language comprehension.',
      use_cases_km: 'ការសរសេរកូដ សង្ខេបឯកសារ ស្រាវជ្រាវ និងការយល់ដឹងភាសាខ្មែរយ៉ាងច្បាស់។',
      pricing: 'Free & Paid (Advanced)',
      is_featured: true,
      sort_order: 1,
    },
    {
      id: 2,
      name: 'Claude 3.7 Sonnet',
      category: 'AI Coding',
      description_en: 'Industry-leading coding model with hybrid standard and extended thinking capabilities.',
      description_km: 'ម៉ូដែលឈានមុខគេលើពិភពលោកសម្រាប់ការសរសេរកូដ និងការគិតស៊ីជម្រៅ។',
      official_url: 'https://claude.ai',
      use_cases_en: 'Full-stack software engineering, architecture reviews, debugging complex bugs.',
      use_cases_km: 'ការសរសេរកូដគេហទំព័រ ពិនិត្យស្ថាបត្យកម្ម និងដោះស្រាយកំហុសកូដស្មុគស្មាញ។',
      pricing: 'Freemium',
      is_featured: true,
      sort_order: 2,
    },
    {
      id: 3,
      name: 'Midjourney v6',
      category: 'AI Image Generation',
      description_en: 'Photorealistic visual asset generation for marketing campaigns, mockups, and UI backdrops.',
      description_km: 'ការបង្កើតរូបភាពកម្រិតខ្ពស់ដូចរូបថតពិត សម្រាប់ទីផ្សារ និងផ្ទាំងទស្សនីយភាព។',
      official_url: 'https://midjourney.com',
      use_cases_en: 'Website concept art, product packaging renders, graphic illustrations.',
      use_cases_km: 'ការបង្កើតគំនំរចនាគេហទំព័រ ការវេចខ្ចប់ និងរូបភាពគំនូរច្នៃប្រឌិត។',
      pricing: 'Paid Subscription',
      is_featured: true,
      sort_order: 3,
    },
  ],
  services: [
    {
      id: 1,
      title_en: 'Modern Website & Web App Development',
      title_km: 'សេវាកម្មបង្កើតគេហទំព័រ និងកម្មវិធីទំនើប',
      slug: 'modern-web-development',
      description_en: 'Bespoke web applications built with React, Node.js, and high-performance databases, tailored for startups and businesses.',
      description_km: 'បង្កើតគេហទំព័រតាមតម្រូវការជាក់ស្តែងដោយប្រើប្រាស់ React និងប្រព័ន្ធទិន្នន័យមានសុវត្ថិភាពខ្ពស់។',
      features_en: [
        'Responsive Design for Mobile & Desktop',
        'GraphQL & RESTful APIs',
        'Fast Loading Speed & SEO Ready',
        'Administrative Control Panel',
      ],
      features_km: [
        'រចនាឡើងសម្រាប់ទាំងទូរស័ព្ទ និងកុំព្យូទ័រ',
        'ភ្ជាប់ប្រព័ន្ធ API និងទិន្នន័យសុវត្ថិភាព',
        'ល្បឿនលឿន និងត្រូវក្បួន SEO',
        'ផ្ទាំងគ្រប់គ្រង Admin ងាយស្រួលប្រើ',
      ],
      starting_price: '$350',
      icon_name: 'Code2',
      is_active: true,
      sort_order: 1,
    },
    {
      id: 2,
      title_en: 'Computer Repair & OS Optimization',
      title_km: 'សេវាជួសជុលកុំព្យូទ័រ និងដំឡើង Windows',
      slug: 'computer-repair-os-setup',
      description_en: 'Comprehensive hardware diagnostics, clean operating system installation, thermal servicing, and SSD upgrades.',
      description_km: 'ការពិនិត្យម៉ាស៊ីន ដំឡើង Windows ស្អាត ផ្លាស់ប្តូរស៊ីលីកូនកម្ដៅ និងតម្លើងល្បឿន SSD។',
      features_en: [
        'Genuine Drivers & Essential Software Suite',
        'Deep Malware & Adware Removal',
        'Thermal Paste Refresh',
        'Complete Data Preservation',
      ],
      features_km: [
        'ដំឡើង Driver និងកម្មវិធីចាំបាច់',
        'កម្ចាត់មេរោគ និងកម្មវិធីរំខាន',
        'ផ្លាស់ប្តូរស៊ីលីកូនត្រជាក់ CPU',
        'រក្សាសុវត្ថិភាពទិន្នន័យចាស់',
      ],
      starting_price: '$25',
      icon_name: 'Wrench',
      is_active: true,
      sort_order: 2,
    },
    {
      id: 3,
      title_en: 'Enterprise Network & Server Setup',
      title_km: 'សេវាកម្មរៀបចំប្រព័ន្ធបណ្តាញ និង Server',
      slug: 'enterprise-network-setup',
      description_en: 'Design and deployment of robust office LAN, Wi-Fi mesh networks, MikroTik router configuration, and NAS storage.',
      description_km: 'រចនានិងដំឡើងប្រព័ន្ធបណ្តាញ LAN ក្នុងក្រុមហ៊ុន ប្រព័ន្ធ Wi-Fi Mesh និងប្រព័ន្ធផ្ទុកទិន្នន័យ NAS។',
      features_en: [
        'VLAN Segmentation & Guest Wi-Fi',
        'Firewall Rules & Bandwidth Allocation',
        'Network Attached Storage (NAS) Setup',
        'Remote Access VPN',
      ],
      features_km: [
        'ការបែងចែកបណ្តាញ VLAN និង Wi-Fi ភ្ញៀវ',
        'កំណត់ Firewall និងគ្រប់គ្រងល្បឿនអ៊ីនធឺណិត',
        'ដំឡើងប្រព័ន្ធផ្ទុកទិន្នន័យ NAS រួម',
        'ភ្ជាប់ប្រព័ន្ធ VPN ពីចម្ងាយ',
      ],
      starting_price: '$120',
      icon_name: 'Network',
      is_active: true,
      sort_order: 3,
    },
  ],
  service_inquiries: [
    {
      id: 1,
      service_id: 3,
      service_title: 'Enterprise Network & Server Setup',
      client_name: 'Dara Heng',
      client_email: 'dara.heng@techcambodia.com',
      client_phone: '+855 17 889 900',
      project_scope: 'Need a structured cabling audit and Synology NAS raid setup for our design team.',
      budget_range: '$200 - $500',
      status: 'new',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  contact_messages: [
    {
      id: 1,
      name: 'Sokha Rith',
      email: 'sokha.rith@example.com',
      subject: 'Inquiry regarding Office Network Installation',
      message: 'Hello Ponleu, we have a new office in Toul Kork with 25 workstations and need LAN cabling and router setup. Please advise your availability.',
      phone_or_telegram: '@sokharith',
      is_read: false,
      status: 'unread',
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  media_files: [
    {
      id: 1,
      file_name: 'sn_ponleu_hero_portrait.jpg',
      file_path: '/src/assets/images/sn_ponleu_hero_portrait_1793269460566.jpg',
      mime_type: 'image/jpeg',
      file_size_bytes: 345000,
      alt_text: 'Sn Ponleu Profile Portrait',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      file_name: 'sn_working_activity.jpg',
      file_path: '/src/assets/images/sn_working_activity_1793269461758.jpg',
      mime_type: 'image/jpeg',
      file_size_bytes: 420000,
      alt_text: 'Rack Cabling Work',
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      file_name: 'sn_project_showcase.jpg',
      file_path: '/src/assets/images/sn_project_showcase_1793269462759.jpg',
      mime_type: 'image/jpeg',
      file_size_bytes: 380000,
      alt_text: 'Nimbus Cloud Interface',
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      file_name: 'sn_software_toolkit.jpg',
      file_path: '/src/assets/images/sn_software_toolkit_1793269461578.jpg',
      mime_type: 'image/jpeg',
      file_size_bytes: 360000,
      alt_text: 'Tech Setup Workstation',
      created_at: new Date().toISOString(),
    },
  ],
  website_settings: {
    site_name: 'SN PONLEU',
    site_tagline_en: 'Personal Digital Hub | ICT Specialist & Creative Designer',
    site_tagline_km: 'មជ្ឈមណ្ឌលឌីជីថលផ្ទាល់ខ្លួន | អ្នកឯកទេស ICT & អ្នករចនាច្នៃប្រឌិត',
    contact_email: 'ponleuofficial07@gmail.com',
    contact_phone: '+855 12 345 678',
    telegram_link: 'https://t.me/snponleu',
    theme_mode_default: 'dark',
    ai_chatbot_enabled: 'true',
  },
  audit_logs: [
    {
      id: 1,
      admin_id: 1,
      action: 'SYSTEM_INITIALIZED',
      target_module: 'system',
      details: 'SN PONLEU database and store initialized with bilingual seed data.',
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString(),
    },
  ],
};

class DatabaseManager {
  private data: DatabaseStore;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseStore {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read store.json, creating initial store:', e);
    }
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseStore): void {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save store.json:', e);
    }
  }

  public getStore(): DatabaseStore {
    return this.data;
  }

  public logAudit(action: string, target_module: string, details?: string, admin_id?: number, ip?: string): void {
    const log: AuditLog = {
      id: Date.now(),
      admin_id: admin_id || 1,
      action,
      target_module,
      details,
      ip_address: ip || '127.0.0.1',
      created_at: new Date().toISOString(),
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 200) {
      this.data.audit_logs.pop();
    }
    this.saveData(this.data);
  }

  // Profile
  public getProfile(): Profile {
    return this.data.profile;
  }

  public updateProfile(updates: Partial<Profile>, admin_id?: number): Profile {
    this.data.profile = { ...this.data.profile, ...updates };
    this.logAudit('UPDATE_PROFILE', 'profile', 'Updated profile information', admin_id);
    this.saveData(this.data);
    return this.data.profile;
  }

  // Skills
  public getSkills(): Skill[] {
    return this.data.skills.sort((a, b) => a.sort_order - b.sort_order);
  }

  // Education & Experience & Certifications
  public getEducation(): Education[] {
    return this.data.education.sort((a, b) => a.sort_order - b.sort_order);
  }

  public getExperience(): Experience[] {
    return this.data.experience.sort((a, b) => a.sort_order - b.sort_order);
  }

  public getCertifications(): Certification[] {
    return this.data.certifications.sort((a, b) => a.sort_order - b.sort_order);
  }

  // Projects
  public getProjects(onlyPublished = true): Project[] {
    return this.data.projects.filter(p => !onlyPublished || p.is_published);
  }

  public getProjectBySlug(slug: string): Project | undefined {
    const p = this.data.projects.find(p => p.slug === slug);
    if (p) {
      p.views_count = (p.views_count || 0) + 1;
      this.saveData(this.data);
    }
    return p;
  }

  public createProject(input: Omit<Project, 'id' | 'views_count' | 'created_at'>, admin_id?: number): Project {
    const newProject: Project = {
      ...input,
      id: Date.now(),
      views_count: 0,
      created_at: new Date().toISOString().split('T')[0],
    };
    this.data.projects.unshift(newProject);
    this.logAudit('CREATE_PROJECT', 'projects', `Created project: ${newProject.title_en}`, admin_id);
    this.saveData(this.data);
    return newProject;
  }

  public updateProject(id: number, input: Partial<Project>, admin_id?: number): Project | null {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.projects[index] = { ...this.data.projects[index], ...input };
    this.logAudit('UPDATE_PROJECT', 'projects', `Updated project id: ${id}`, admin_id);
    this.saveData(this.data);
    return this.data.projects[index];
  }

  public deleteProject(id: number, admin_id?: number): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== initialLen) {
      this.logAudit('DELETE_PROJECT', 'projects', `Deleted project id: ${id}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Software
  public getSoftware(onlyPublished = true): Software[] {
    return this.data.software.filter(s => !onlyPublished || s.is_published);
  }

  public getSoftwareBySlug(slug: string): Software | undefined {
    return this.data.software.find(s => s.slug === slug);
  }

  public incrementSoftwareDownload(id: number): number {
    const s = this.data.software.find(s => s.id === id);
    if (s) {
      s.downloads_count = (s.downloads_count || 0) + 1;
      this.saveData(this.data);
      return s.downloads_count;
    }
    return 0;
  }

  public createSoftware(input: Omit<Software, 'id' | 'downloads_count' | 'created_at'>, admin_id?: number): Software {
    const item: Software = {
      ...input,
      id: Date.now(),
      downloads_count: 0,
      created_at: new Date().toISOString().split('T')[0],
    };
    this.data.software.unshift(item);
    this.logAudit('CREATE_SOFTWARE', 'software', `Added software: ${item.name}`, admin_id);
    this.saveData(this.data);
    return item;
  }

  public updateSoftware(id: number, input: Partial<Software>, admin_id?: number): Software | null {
    const idx = this.data.software.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.software[idx] = { ...this.data.software[idx], ...input };
    this.logAudit('UPDATE_SOFTWARE', 'software', `Updated software id: ${id}`, admin_id);
    this.saveData(this.data);
    return this.data.software[idx];
  }

  public deleteSoftware(id: number, admin_id?: number): boolean {
    const initialLen = this.data.software.length;
    this.data.software = this.data.software.filter(s => s.id !== id);
    if (this.data.software.length !== initialLen) {
      this.logAudit('DELETE_SOFTWARE', 'software', `Deleted software id: ${id}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Blog Posts
  public getBlogPosts(onlyPublished = true): BlogPost[] {
    return this.data.blog_posts.filter(b => !onlyPublished || b.is_published);
  }

  public getBlogPostBySlug(slug: string): BlogPost | undefined {
    const b = this.data.blog_posts.find(p => p.slug === slug);
    if (b) {
      b.views_count = (b.views_count || 0) + 1;
      this.saveData(this.data);
    }
    return b;
  }

  public createBlogPost(input: Omit<BlogPost, 'id' | 'views_count' | 'published_at'>, admin_id?: number): BlogPost {
    const post: BlogPost = {
      ...input,
      id: Date.now(),
      views_count: 0,
      published_at: new Date().toISOString().split('T')[0],
    };
    this.data.blog_posts.unshift(post);
    this.logAudit('CREATE_BLOG_POST', 'blog', `Created article: ${post.title_en}`, admin_id);
    this.saveData(this.data);
    return post;
  }

  public updateBlogPost(id: number, input: Partial<BlogPost>, admin_id?: number): BlogPost | null {
    const idx = this.data.blog_posts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.blog_posts[idx] = { ...this.data.blog_posts[idx], ...input };
    this.logAudit('UPDATE_BLOG_POST', 'blog', `Updated article id: ${id}`, admin_id);
    this.saveData(this.data);
    return this.data.blog_posts[idx];
  }

  public deleteBlogPost(id: number, admin_id?: number): boolean {
    const initialLen = this.data.blog_posts.length;
    this.data.blog_posts = this.data.blog_posts.filter(p => p.id !== id);
    if (this.data.blog_posts.length !== initialLen) {
      this.logAudit('DELETE_BLOG_POST', 'blog', `Deleted article id: ${id}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Gallery
  public getGalleryItems(onlyPublished = true): GalleryItem[] {
    return this.data.working_gallery.filter(g => !onlyPublished || g.is_published);
  }

  public createGalleryItem(input: Omit<GalleryItem, 'id'>, admin_id?: number): GalleryItem {
    const item: GalleryItem = { ...input, id: Date.now() };
    this.data.working_gallery.unshift(item);
    this.logAudit('CREATE_GALLERY_ITEM', 'gallery', `Added working photo: ${item.title_en}`, admin_id);
    this.saveData(this.data);
    return item;
  }

  public updateGalleryItem(id: number, input: Partial<GalleryItem>, admin_id?: number): GalleryItem | null {
    const idx = this.data.working_gallery.findIndex(g => g.id === id);
    if (idx === -1) return null;
    this.data.working_gallery[idx] = { ...this.data.working_gallery[idx], ...input };
    this.logAudit('UPDATE_GALLERY_ITEM', 'gallery', `Updated gallery item id: ${id}`, admin_id);
    this.saveData(this.data);
    return this.data.working_gallery[idx];
  }

  public deleteGalleryItem(id: number, admin_id?: number): boolean {
    const initialLen = this.data.working_gallery.length;
    this.data.working_gallery = this.data.working_gallery.filter(g => g.id !== id);
    if (this.data.working_gallery.length !== initialLen) {
      this.logAudit('DELETE_GALLERY_ITEM', 'gallery', `Deleted gallery item id: ${id}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // AI Tools
  public getAITools(): AITool[] {
    return this.data.ai_tools.sort((a, b) => a.sort_order - b.sort_order);
  }

  public createAITool(input: Omit<AITool, 'id'>, admin_id?: number): AITool {
    const item: AITool = { ...input, id: Date.now() };
    this.data.ai_tools.push(item);
    this.logAudit('CREATE_AI_TOOL', 'ai_tools', `Added AI tool: ${item.name}`, admin_id);
    this.saveData(this.data);
    return item;
  }

  public updateAITool(id: number, input: Partial<AITool>, admin_id?: number): AITool | null {
    const idx = this.data.ai_tools.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.ai_tools[idx] = { ...this.data.ai_tools[idx], ...input };
    this.logAudit('UPDATE_AI_TOOL', 'ai_tools', `Updated AI tool id: ${id}`, admin_id);
    this.saveData(this.data);
    return this.data.ai_tools[idx];
  }

  public deleteAITool(id: number, admin_id?: number): boolean {
    const initialLen = this.data.ai_tools.length;
    this.data.ai_tools = this.data.ai_tools.filter(t => t.id !== id);
    if (this.data.ai_tools.length !== initialLen) {
      this.logAudit('DELETE_AI_TOOL', 'ai_tools', `Deleted AI tool id: ${id}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Services
  public getServices(onlyActive = true): Service[] {
    return this.data.services
      .filter(s => !onlyActive || s.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  public createService(input: Omit<Service, 'id'>, admin_id?: number): Service {
    const item: Service = { ...input, id: Date.now() };
    this.data.services.push(item);
    this.logAudit('CREATE_SERVICE', 'services', `Added service: ${item.title_en}`, admin_id);
    this.saveData(this.data);
    return item;
  }

  public updateService(id: number, input: Partial<Service>, admin_id?: number): Service | null {
    const idx = this.data.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...input };
    this.logAudit('UPDATE_SERVICE', 'services', `Updated service id: ${id}`, admin_id);
    this.saveData(this.data);
    return this.data.services[idx];
  }

  public deleteService(id: number, admin_id?: number): boolean {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter(s => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.logAudit('DELETE_SERVICE', 'services', `Deleted service id: ${id}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Contact Messages & Inquiries
  public submitContactMessage(input: Omit<ContactMessage, 'id' | 'is_read' | 'status' | 'created_at'>): ContactMessage {
    const msg: ContactMessage = {
      ...input,
      id: Date.now(),
      is_read: false,
      status: 'unread',
      created_at: new Date().toISOString(),
    };
    this.data.contact_messages.unshift(msg);
    this.saveData(this.data);
    return msg;
  }

  public getContactMessages(): ContactMessage[] {
    return this.data.contact_messages;
  }

  public updateContactMessageStatus(id: number, status: 'unread' | 'read' | 'replied' | 'spam', admin_id?: number): boolean {
    const msg = this.data.contact_messages.find(m => m.id === id);
    if (msg) {
      msg.status = status;
      msg.is_read = status !== 'unread';
      this.logAudit('UPDATE_CONTACT_MSG', 'contact', `Updated message #${id} to ${status}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public deleteContactMessage(id: number, admin_id?: number): boolean {
    const len = this.data.contact_messages.length;
    this.data.contact_messages = this.data.contact_messages.filter(m => m.id !== id);
    if (this.data.contact_messages.length !== len) {
      this.logAudit('DELETE_CONTACT_MSG', 'contact', `Deleted message #${id}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public submitServiceInquiry(input: Omit<ServiceInquiry, 'id' | 'status' | 'created_at'>): ServiceInquiry {
    const inq: ServiceInquiry = {
      ...input,
      id: Date.now(),
      status: 'new',
      created_at: new Date().toISOString(),
    };
    this.data.service_inquiries.unshift(inq);
    this.saveData(this.data);
    return inq;
  }

  public getServiceInquiries(): ServiceInquiry[] {
    return this.data.service_inquiries;
  }

  public updateServiceInquiryStatus(id: number, status: ServiceInquiry['status'], notes?: string, admin_id?: number): boolean {
    const inq = this.data.service_inquiries.find(i => i.id === id);
    if (inq) {
      inq.status = status;
      if (notes !== undefined) inq.admin_notes = notes;
      this.logAudit('UPDATE_INQUIRY', 'inquiries', `Updated inquiry #${id} to ${status}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public deleteServiceInquiry(id: number, admin_id?: number): boolean {
    const len = this.data.service_inquiries.length;
    this.data.service_inquiries = this.data.service_inquiries.filter(i => i.id !== id);
    if (this.data.service_inquiries.length !== len) {
      this.logAudit('DELETE_INQUIRY', 'inquiries', `Deleted inquiry #${id}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Settings
  public getSettings(): Record<string, string> {
    return this.data.website_settings;
  }

  public updateSettings(settings: Record<string, string>, admin_id?: number): Record<string, string> {
    this.data.website_settings = { ...this.data.website_settings, ...settings };
    this.logAudit('UPDATE_SETTINGS', 'settings', 'Updated website configuration', admin_id);
    this.saveData(this.data);
    return this.data.website_settings;
  }

  // Media
  public getMediaFiles(): MediaFile[] {
    return this.data.media_files;
  }

  public addMediaFile(media: Omit<MediaFile, 'id' | 'created_at'>, admin_id?: number): MediaFile {
    const item: MediaFile = {
      ...media,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    this.data.media_files.unshift(item);
    this.logAudit('UPLOAD_MEDIA', 'media', `Uploaded file: ${item.file_name}`, admin_id);
    this.saveData(this.data);
    return item;
  }

  public deleteMediaFile(id: number, admin_id?: number): boolean {
    const item = this.data.media_files.find(m => m.id === id);
    if (item) {
      this.data.media_files = this.data.media_files.filter(m => m.id !== id);
      this.logAudit('DELETE_MEDIA', 'media', `Removed media: ${item.file_name}`, admin_id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Auth & Admin
  public findAdminByUsername(username: string): Admin | undefined {
    return this.data.admins.find(a => (a.username.toLowerCase() === username.toLowerCase() || a.email.toLowerCase() === username.toLowerCase()) && a.is_active === 1);
  }

  public createSession(admin_id: number): string {
    const token = 'sntk_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    this.data.sessions.push({
      id: Date.now(),
      admin_id,
      token,
      expires_at: expires,
      created_at: new Date().toISOString(),
    });
    this.saveData(this.data);
    return token;
  }

  public verifySession(token: string): Admin | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token && new Date(s.expires_at) > new Date());
    if (!session) return null;
    return this.data.admins.find(a => a.id === session.admin_id) || null;
  }

  public deleteSession(token: string): void {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.saveData(this.data);
  }

  public updateAdminCredentials(id: number, newPasswordHash: string, fullName?: string, email?: string): boolean {
    const admin = this.data.admins.find(a => a.id === id);
    if (admin) {
      admin.password_hash = newPasswordHash;
      if (fullName) admin.full_name = fullName;
      if (email) admin.email = email;
      this.logAudit('UPDATE_ADMIN_CREDENTIALS', 'auth', `Updated credentials for admin #${id}`, id);
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Unified Search
  public search(query: string, lang = 'en') {
    const q = query.trim().toLowerCase();
    if (!q) return { projects: [], software: [], blog: [], ai_tools: [], services: [] };

    const projects = this.data.projects.filter(p =>
      p.is_published && (
        p.title_en.toLowerCase().includes(q) ||
        p.title_km.toLowerCase().includes(q) ||
        p.technologies.toLowerCase().includes(q) ||
        p.summary_en.toLowerCase().includes(q)
      )
    );

    const software = this.data.software.filter(s =>
      s.is_published && (
        s.name.toLowerCase().includes(q) ||
        s.short_desc_en.toLowerCase().includes(q) ||
        s.short_desc_km.toLowerCase().includes(q) ||
        s.supported_os.toLowerCase().includes(q)
      )
    );

    const blog = this.data.blog_posts.filter(b =>
      b.is_published && (
        b.title_en.toLowerCase().includes(q) ||
        b.title_km.toLowerCase().includes(q) ||
        b.summary_en.toLowerCase().includes(q) ||
        b.tags?.some(t => t.toLowerCase().includes(q))
      )
    );

    const ai_tools = this.data.ai_tools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.use_cases_en.toLowerCase().includes(q) ||
      t.use_cases_km.toLowerCase().includes(q)
    );

    const services = this.data.services.filter(s =>
      s.is_active && (
        s.title_en.toLowerCase().includes(q) ||
        s.title_km.toLowerCase().includes(q) ||
        s.description_en.toLowerCase().includes(q)
      )
    );

    return { projects, software, blog, ai_tools, services };
  }

  // Metrics
  public getDashboardStats() {
    return {
      totalProjects: this.data.projects.length,
      publishedProjects: this.data.projects.filter(p => p.is_published).length,
      totalSoftware: this.data.software.length,
      totalDownloads: this.data.software.reduce((acc, s) => acc + (s.downloads_count || 0), 0),
      totalBlogPosts: this.data.blog_posts.length,
      totalBlogViews: this.data.blog_posts.reduce((acc, b) => acc + (b.views_count || 0), 0),
      totalGalleryItems: this.data.working_gallery.length,
      totalAITools: this.data.ai_tools.length,
      totalServices: this.data.services.length,
      unreadMessages: this.data.contact_messages.filter(m => m.status === 'unread').length,
      totalMessages: this.data.contact_messages.length,
      newInquiries: this.data.service_inquiries.filter(i => i.status === 'new').length,
      totalInquiries: this.data.service_inquiries.length,
      mediaCount: this.data.media_files.length,
    };
  }
}

export const db = new DatabaseManager();
