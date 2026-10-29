import { buildSchema, graphql } from 'graphql';
import { db, Admin } from './db.ts';

export const typeDefs = `
  type Profile {
    id: Int!
    full_name_en: String!
    full_name_km: String!
    title_en: String!
    title_km: String!
    bio_en: String!
    bio_km: String!
    about_details_en: String
    about_details_km: String
    avatar_url: String!
    resume_url: String
    email: String!
    phone: String
    telegram_handle: String
    location_en: String!
    location_km: String!
    years_experience: Int!
    github_url: String
    linkedin_url: String
    facebook_url: String
    youtube_url: String
  }

  type Skill {
    id: Int!
    name_en: String!
    name_km: String!
    category: String!
    proficiency: Int!
    icon: String
    is_featured: Boolean!
    sort_order: Int!
  }

  type Education {
    id: Int!
    institution_en: String!
    institution_km: String!
    degree_en: String!
    degree_km: String!
    field_en: String!
    field_km: String!
    start_year: String!
    end_year: String!
    description_en: String
    description_km: String
    sort_order: Int!
  }

  type Experience {
    id: Int!
    company_en: String!
    company_km: String!
    role_en: String!
    role_km: String!
    period_en: String!
    period_km: String!
    is_current: Boolean!
    description_en: String!
    description_km: String!
    technologies: String
    sort_order: Int!
  }

  type Certification {
    id: Int!
    title_en: String!
    title_km: String!
    issuer_en: String!
    issuer_km: String!
    issue_date: String!
    credential_id: String
    credential_url: String
    sort_order: Int!
  }

  type GalleryItem {
    id: Int!
    title_en: String!
    title_km: String!
    description_en: String
    description_km: String
    image_url: String!
    category: String!
    activity_date: String!
    is_published: Boolean!
  }

  type Project {
    id: Int!
    title_en: String!
    title_km: String!
    slug: String!
    summary_en: String!
    summary_km: String!
    description_en: String!
    description_km: String!
    cover_image: String!
    category: String!
    technologies: String!
    status: String!
    demo_url: String
    source_code_url: String
    is_featured: Boolean!
    is_published: Boolean!
    views_count: Int!
    created_at: String!
  }

  type Software {
    id: Int!
    category_id: Int!
    category_name: String
    name: String!
    slug: String!
    logo_url: String!
    short_desc_en: String!
    short_desc_km: String!
    description_en: String!
    description_km: String!
    supported_os: String!
    version: String!
    file_size: String!
    license_type: String!
    official_url: String!
    download_url: String!
    install_guide_en: String
    install_guide_km: String
    system_req_en: String
    system_req_km: String
    downloads_count: Int!
    is_featured: Boolean!
    is_published: Boolean!
    created_at: String!
  }

  type BlogPost {
    id: Int!
    category_id: Int!
    category_name: String
    title_en: String!
    title_km: String!
    slug: String!
    cover_image: String!
    summary_en: String!
    summary_km: String!
    content_en: String!
    content_km: String!
    author_name: String!
    read_time_minutes: Int!
    views_count: Int!
    seo_title: String
    seo_desc: String
    tags: [String]
    is_published: Boolean!
    published_at: String!
  }

  type AITool {
    id: Int!
    name: String!
    category: String!
    description_en: String!
    description_km: String!
    official_url: String!
    use_cases_en: String!
    use_cases_km: String!
    pricing: String!
    icon_url: String
    is_featured: Boolean!
    sort_order: Int!
  }

  type Service {
    id: Int!
    title_en: String!
    title_km: String!
    slug: String!
    description_en: String!
    description_km: String!
    features_en: [String]!
    features_km: [String]!
    starting_price: String
    icon_name: String!
    is_active: Boolean!
    sort_order: Int!
  }

  type ContactMessage {
    id: Int!
    name: String!
    email: String!
    subject: String!
    message: String!
    phone_or_telegram: String
    is_read: Boolean!
    status: String!
    created_at: String!
  }

  type ServiceInquiry {
    id: Int!
    service_id: Int
    service_title: String!
    client_name: String!
    client_email: String!
    client_phone: String
    project_scope: String!
    budget_range: String
    status: String!
    admin_notes: String
    created_at: String!
  }

  type SearchResults {
    projects: [Project]!
    software: [Software]!
    blog: [BlogPost]!
    ai_tools: [AITool]!
    services: [Service]!
  }

  type DashboardStats {
    totalProjects: Int!
    publishedProjects: Int!
    totalSoftware: Int!
    totalDownloads: Int!
    totalBlogPosts: Int!
    totalBlogViews: Int!
    totalGalleryItems: Int!
    totalAITools: Int!
    totalServices: Int!
    unreadMessages: Int!
    totalMessages: Int!
    newInquiries: Int!
    totalInquiries: Int!
    mediaCount: Int!
  }

  type Query {
    getProfile: Profile
    getSkills: [Skill]
    getEducation: [Education]
    getExperience: [Experience]
    getCertifications: [Certification]
    getGalleryItems(onlyPublished: Boolean): [GalleryItem]
    getProjects(onlyPublished: Boolean): [Project]
    getProjectBySlug(slug: String!): Project
    getSoftware(onlyPublished: Boolean): [Software]
    getSoftwareBySlug(slug: String!): Software
    getBlogPosts(onlyPublished: Boolean): [BlogPost]
    getBlogPostBySlug(slug: String!): BlogPost
    getAITools: [AITool]
    getServices(onlyActive: Boolean): [Service]
    searchAll(query: String!, lang: String): SearchResults
    getSettings: String
    getDashboardStats: DashboardStats
    getContactMessages: [ContactMessage]
    getServiceInquiries: [ServiceInquiry]
  }

  type Mutation {
    submitContactMessage(
      name: String!
      email: String!
      subject: String!
      message: String!
      phone_or_telegram: String
    ): ContactMessage

    submitServiceInquiry(
      service_id: Int
      service_title: String!
      client_name: String!
      client_email: String!
      client_phone: String
      project_scope: String!
      budget_range: String
    ): ServiceInquiry

    incrementSoftwareDownload(id: Int!): Int

    updateProfile(
      full_name_en: String
      full_name_km: String
      title_en: String
      title_km: String
      bio_en: String
      bio_km: String
      about_details_en: String
      about_details_km: String
      avatar_url: String
      resume_url: String
      email: String
      phone: String
      telegram_handle: String
      location_en: String
      location_km: String
      years_experience: Int
      github_url: String
      linkedin_url: String
      facebook_url: String
      youtube_url: String
    ): Profile

    createProject(
      title_en: String!
      title_km: String!
      slug: String!
      summary_en: String!
      summary_km: String!
      description_en: String!
      description_km: String!
      cover_image: String!
      category: String!
      technologies: String!
      status: String!
      demo_url: String
      source_code_url: String
      is_featured: Boolean!
      is_published: Boolean!
    ): Project

    updateProject(
      id: Int!
      title_en: String
      title_km: String
      slug: String
      summary_en: String
      summary_km: String
      description_en: String
      description_km: String
      cover_image: String
      category: String
      technologies: String
      status: String
      demo_url: String
      source_code_url: String
      is_featured: Boolean
      is_published: Boolean
    ): Project

    deleteProject(id: Int!): Boolean

    createSoftware(
      category_id: Int!
      category_name: String
      name: String!
      slug: String!
      logo_url: String!
      short_desc_en: String!
      short_desc_km: String!
      description_en: String!
      description_km: String!
      supported_os: String!
      version: String!
      file_size: String!
      license_type: String!
      official_url: String!
      download_url: String!
      install_guide_en: String
      install_guide_km: String
      system_req_en: String
      system_req_km: String
      is_featured: Boolean!
      is_published: Boolean!
    ): Software

    updateSoftware(
      id: Int!
      category_id: Int
      category_name: String
      name: String
      slug: String
      logo_url: String
      short_desc_en: String
      short_desc_km: String
      description_en: String
      description_km: String
      supported_os: String
      version: String
      file_size: String
      license_type: String
      official_url: String
      download_url: String
      install_guide_en: String
      install_guide_km: String
      system_req_en: String
      system_req_km: String
      is_featured: Boolean
      is_published: Boolean
    ): Software

    deleteSoftware(id: Int!): Boolean

    createBlogPost(
      category_id: Int!
      category_name: String
      title_en: String!
      title_km: String!
      slug: String!
      cover_image: String!
      summary_en: String!
      summary_km: String!
      content_en: String!
      content_km: String!
      author_name: String!
      read_time_minutes: Int!
      seo_title: String
      seo_desc: String
      tags: [String]
      is_published: Boolean!
    ): BlogPost

    updateBlogPost(
      id: Int!
      category_id: Int
      category_name: String
      title_en: String
      title_km: String
      slug: String
      cover_image: String
      summary_en: String
      summary_km: String
      content_en: String
      content_km: String
      author_name: String
      read_time_minutes: Int
      seo_title: String
      seo_desc: String
      tags: [String]
      is_published: Boolean
    ): BlogPost

    deleteBlogPost(id: Int!): Boolean

    createGalleryItem(
      title_en: String!
      title_km: String!
      description_en: String
      description_km: String
      image_url: String!
      category: String!
      activity_date: String!
      is_published: Boolean!
    ): GalleryItem

    updateGalleryItem(
      id: Int!
      title_en: String
      title_km: String
      description_en: String
      description_km: String
      image_url: String
      category: String
      activity_date: String
      is_published: Boolean
    ): GalleryItem

    deleteGalleryItem(id: Int!): Boolean

    createAITool(
      name: String!
      category: String!
      description_en: String!
      description_km: String!
      official_url: String!
      use_cases_en: String!
      use_cases_km: String!
      pricing: String!
      icon_url: String
      is_featured: Boolean!
      sort_order: Int!
    ): AITool

    updateAITool(
      id: Int!
      name: String
      category: String
      description_en: String
      description_km: String
      official_url: String
      use_cases_en: String
      use_cases_km: String
      pricing: String
      icon_url: String
      is_featured: Boolean
      sort_order: Int
    ): AITool

    deleteAITool(id: Int!): Boolean

    createService(
      title_en: String!
      title_km: String!
      slug: String!
      description_en: String!
      description_km: String!
      features_en: [String]!
      features_km: [String]!
      starting_price: String
      icon_name: String!
      is_active: Boolean!
      sort_order: Int!
    ): Service

    updateService(
      id: Int!
      title_en: String
      title_km: String
      slug: String
      description_en: String
      description_km: String
      features_en: [String]
      features_km: [String]
      starting_price: String
      icon_name: String
      is_active: Boolean
      sort_order: Int
    ): Service

    deleteService(id: Int!): Boolean

    updateContactMessageStatus(id: Int!, status: String!): Boolean
    deleteContactMessage(id: Int!): Boolean

    updateServiceInquiryStatus(id: Int!, status: String!, notes: String): Boolean
    deleteServiceInquiry(id: Int!): Boolean
  }
`;

export const schema = buildSchema(typeDefs);

export const rootResolver = {
  getProfile: () => db.getProfile(),
  getSkills: () => db.getSkills(),
  getEducation: () => db.getEducation(),
  getExperience: () => db.getExperience(),
  getCertifications: () => db.getCertifications(),
  getGalleryItems: ({ onlyPublished = true }: { onlyPublished?: boolean }) => db.getGalleryItems(onlyPublished),
  getProjects: ({ onlyPublished = true }: { onlyPublished?: boolean }) => db.getProjects(onlyPublished),
  getProjectBySlug: ({ slug }: { slug: string }) => db.getProjectBySlug(slug),
  getSoftware: ({ onlyPublished = true }: { onlyPublished?: boolean }) => db.getSoftware(onlyPublished),
  getSoftwareBySlug: ({ slug }: { slug: string }) => db.getSoftwareBySlug(slug),
  getBlogPosts: ({ onlyPublished = true }: { onlyPublished?: boolean }) => db.getBlogPosts(onlyPublished),
  getBlogPostBySlug: ({ slug }: { slug: string }) => db.getBlogPostBySlug(slug),
  getAITools: () => db.getAITools(),
  getServices: ({ onlyActive = true }: { onlyActive?: boolean }) => db.getServices(onlyActive),
  searchAll: ({ query, lang }: { query: string; lang?: string }) => db.search(query, lang),
  getSettings: () => JSON.stringify(db.getSettings()),
  getDashboardStats: () => db.getDashboardStats(),
  getContactMessages: () => db.getContactMessages(),
  getServiceInquiries: () => db.getServiceInquiries(),

  submitContactMessage: (args: any) => db.submitContactMessage(args),
  submitServiceInquiry: (args: any) => db.submitServiceInquiry(args),
  incrementSoftwareDownload: ({ id }: { id: number }) => db.incrementSoftwareDownload(id),

  updateProfile: (args: any) => db.updateProfile(args),
  createProject: (args: any) => db.createProject(args),
  updateProject: ({ id, ...rest }: any) => db.updateProject(id, rest),
  deleteProject: ({ id }: { id: number }) => db.deleteProject(id),

  createSoftware: (args: any) => db.createSoftware(args),
  updateSoftware: ({ id, ...rest }: any) => db.updateSoftware(id, rest),
  deleteSoftware: ({ id }: { id: number }) => db.deleteSoftware(id),

  createBlogPost: (args: any) => db.createBlogPost(args),
  updateBlogPost: ({ id, ...rest }: any) => db.updateBlogPost(id, rest),
  deleteBlogPost: ({ id }: { id: number }) => db.deleteBlogPost(id),

  createGalleryItem: (args: any) => db.createGalleryItem(args),
  updateGalleryItem: ({ id, ...rest }: any) => db.updateGalleryItem(id, rest),
  deleteGalleryItem: ({ id }: { id: number }) => db.deleteGalleryItem(id),

  createAITool: (args: any) => db.createAITool(args),
  updateAITool: ({ id, ...rest }: any) => db.updateAITool(id, rest),
  deleteAITool: ({ id }: { id: number }) => db.deleteAITool(id),

  createService: (args: any) => db.createService(args),
  updateService: ({ id, ...rest }: any) => db.updateService(id, rest),
  deleteService: ({ id }: { id: number }) => db.deleteService(id),

  updateContactMessageStatus: ({ id, status }: any) => db.updateContactMessageStatus(id, status),
  deleteContactMessage: ({ id }: { id: number }) => db.deleteContactMessage(id),

  updateServiceInquiryStatus: ({ id, status, notes }: any) => db.updateServiceInquiryStatus(id, status, notes),
  deleteServiceInquiry: ({ id }: { id: number }) => db.deleteServiceInquiry(id),
};

export async function executeGraphQL(query: string, variables: any = {}, context: { admin?: Admin } = {}) {
  return await graphql({
    schema,
    source: query,
    rootValue: rootResolver,
    contextValue: context,
    variableValues: variables,
  });
}
