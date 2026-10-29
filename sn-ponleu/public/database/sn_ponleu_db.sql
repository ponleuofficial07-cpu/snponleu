-- ============================================================================
-- SN PONLEU — PERSONAL DIGITAL HUB DATABASE SCHEMA
-- Database: sn_ponleu_db
-- Target: MySQL 8.0+ / MariaDB 10.5+ / phpMyAdmin Compatible
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci (Full Khmer Unicode & Emoji)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `sn_ponleu_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sn_ponleu_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `admin_sessions`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `blog_post_tags`;
DROP TABLE IF EXISTS `blog_tags`;
DROP TABLE IF EXISTS `blog_posts`;
DROP TABLE IF EXISTS `blog_categories`;
DROP TABLE IF EXISTS `project_images`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `software`;
DROP TABLE IF EXISTS `software_categories`;
DROP TABLE IF EXISTS `ai_tools`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `service_inquiries`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `working_gallery`;
DROP TABLE IF EXISTS `certifications`;
DROP TABLE IF EXISTS `experience`;
DROP TABLE IF EXISTS `education`;
DROP TABLE IF EXISTS `skills`;
DROP TABLE IF EXISTS `profiles`;
DROP TABLE IF EXISTS `media_files`;
DROP TABLE IF EXISTS `website_settings`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `chatbot_conversations`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- Table: admins
-- ----------------------------------------------------------------------------
CREATE TABLE `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('superadmin', 'editor', 'moderator') NOT NULL DEFAULT 'superadmin',
  `avatar_url` VARCHAR(255) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_admin_username` (`username`),
  INDEX `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: admin_sessions
-- ----------------------------------------------------------------------------
CREATE TABLE `admin_sessions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` INT UNSIGNED NOT NULL,
  `token` VARCHAR(128) NOT NULL UNIQUE,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_session_token` (`token`),
  CONSTRAINT `fk_session_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: profiles
-- ----------------------------------------------------------------------------
CREATE TABLE `profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name_en` VARCHAR(100) NOT NULL,
  `full_name_km` VARCHAR(100) NOT NULL,
  `title_en` VARCHAR(150) NOT NULL,
  `title_km` VARCHAR(150) NOT NULL,
  `bio_en` TEXT NOT NULL,
  `bio_km` TEXT NOT NULL,
  `about_details_en` MEDIUMTEXT NULL,
  `about_details_km` MEDIUMTEXT NULL,
  `avatar_url` VARCHAR(255) NOT NULL,
  `resume_url` VARCHAR(255) NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `telegram_handle` VARCHAR(50) NULL,
  `location_en` VARCHAR(100) NOT NULL DEFAULT 'Phnom Penh, Cambodia',
  `location_km` VARCHAR(100) NOT NULL DEFAULT 'រាជធានីភ្នំពេញ កម្ពុជា',
  `years_experience` INT UNSIGNED NOT NULL DEFAULT 5,
  `github_url` VARCHAR(255) NULL,
  `linkedin_url` VARCHAR(255) NULL,
  `facebook_url` VARCHAR(255) NULL,
  `youtube_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: skills
-- ----------------------------------------------------------------------------
CREATE TABLE `skills` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_en` VARCHAR(100) NOT NULL,
  `name_km` VARCHAR(100) NOT NULL,
  `category` ENUM('frontend', 'backend', 'devops_cloud', 'design', 'ict_hardware', 'database', 'tools') NOT NULL,
  `proficiency` TINYINT UNSIGNED NOT NULL DEFAULT 85,
  `icon` VARCHAR(50) NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_skills_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: education
-- ----------------------------------------------------------------------------
CREATE TABLE `education` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institution_en` VARCHAR(150) NOT NULL,
  `institution_km` VARCHAR(150) NOT NULL,
  `degree_en` VARCHAR(150) NOT NULL,
  `degree_km` VARCHAR(150) NOT NULL,
  `field_en` VARCHAR(150) NOT NULL,
  `field_km` VARCHAR(150) NOT NULL,
  `start_year` VARCHAR(10) NOT NULL,
  `end_year` VARCHAR(10) NOT NULL,
  `description_en` TEXT NULL,
  `description_km` TEXT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: experience
-- ----------------------------------------------------------------------------
CREATE TABLE `experience` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_en` VARCHAR(150) NOT NULL,
  `company_km` VARCHAR(150) NOT NULL,
  `role_en` VARCHAR(150) NOT NULL,
  `role_km` VARCHAR(150) NOT NULL,
  `period_en` VARCHAR(50) NOT NULL,
  `period_km` VARCHAR(50) NOT NULL,
  `is_current` TINYINT(1) NOT NULL DEFAULT 0,
  `description_en` TEXT NOT NULL,
  `description_km` TEXT NOT NULL,
  `technologies` VARCHAR(255) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: certifications
-- ----------------------------------------------------------------------------
CREATE TABLE `certifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title_en` VARCHAR(150) NOT NULL,
  `title_km` VARCHAR(150) NOT NULL,
  `issuer_en` VARCHAR(150) NOT NULL,
  `issuer_km` VARCHAR(150) NOT NULL,
  `issue_date` DATE NOT NULL,
  `credential_id` VARCHAR(100) NULL,
  `credential_url` VARCHAR(255) NULL,
  `badge_url` VARCHAR(255) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: working_gallery
-- ----------------------------------------------------------------------------
CREATE TABLE `working_gallery` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title_en` VARCHAR(200) NOT NULL,
  `title_km` VARCHAR(200) NOT NULL,
  `description_en` TEXT NULL,
  `description_km` TEXT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `category` ENUM('server_network', 'workspace_setup', 'troubleshooting', 'design_creative', 'training_workshop') NOT NULL DEFAULT 'workspace_setup',
  `activity_date` DATE NOT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_gallery_category` (`category`),
  INDEX `idx_gallery_pub` (`is_published`, `activity_date` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: projects
-- ----------------------------------------------------------------------------
CREATE TABLE `projects` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title_en` VARCHAR(200) NOT NULL,
  `title_km` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `summary_en` VARCHAR(300) NOT NULL,
  `summary_km` VARCHAR(300) NOT NULL,
  `description_en` MEDIUMTEXT NOT NULL,
  `description_km` MEDIUMTEXT NOT NULL,
  `cover_image` VARCHAR(255) NOT NULL,
  `category` ENUM('web_development', 'systems_ict', 'ui_ux_design', 'mobile_app', 'automation') NOT NULL,
  `technologies` VARCHAR(255) NOT NULL,
  `status` ENUM('completed', 'in_progress', 'planned') NOT NULL DEFAULT 'completed',
  `demo_url` VARCHAR(255) NULL,
  `source_code_url` VARCHAR(255) NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_project_slug` (`slug`),
  INDEX `idx_project_cat` (`category`),
  INDEX `idx_project_feat` (`is_featured`, `is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: project_images
-- ----------------------------------------------------------------------------
CREATE TABLE `project_images` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `caption_en` VARCHAR(255) NULL,
  `caption_km` VARCHAR(255) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_project_images` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: software_categories
-- ----------------------------------------------------------------------------
CREATE TABLE `software_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_en` VARCHAR(100) NOT NULL,
  `name_km` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: software
-- ----------------------------------------------------------------------------
CREATE TABLE `software` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `logo_url` VARCHAR(255) NOT NULL,
  `short_desc_en` VARCHAR(300) NOT NULL,
  `short_desc_km` VARCHAR(300) NOT NULL,
  `description_en` MEDIUMTEXT NOT NULL,
  `description_km` MEDIUMTEXT NOT NULL,
  `supported_os` VARCHAR(100) NOT NULL DEFAULT 'Windows 10/11, macOS, Linux',
  `version` VARCHAR(50) NOT NULL DEFAULT '1.0.0',
  `file_size` VARCHAR(50) NOT NULL DEFAULT '45 MB',
  `license_type` ENUM('Free', 'Open Source', 'Freemium', 'Commercial') NOT NULL DEFAULT 'Free',
  `official_url` VARCHAR(255) NOT NULL,
  `download_url` VARCHAR(255) NOT NULL,
  `install_guide_en` TEXT NULL,
  `install_guide_km` TEXT NULL,
  `system_req_en` TEXT NULL,
  `system_req_km` TEXT NULL,
  `downloads_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_software_slug` (`slug`),
  CONSTRAINT `fk_software_cat` FOREIGN KEY (`category_id`) REFERENCES `software_categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: blog_categories
-- ----------------------------------------------------------------------------
CREATE TABLE `blog_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_en` VARCHAR(100) NOT NULL,
  `name_km` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: blog_posts
-- ----------------------------------------------------------------------------
CREATE TABLE `blog_posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_km` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `cover_image` VARCHAR(255) NOT NULL,
  `summary_en` VARCHAR(400) NOT NULL,
  `summary_km` VARCHAR(400) NOT NULL,
  `content_en` LONGTEXT NOT NULL,
  `content_km` LONGTEXT NOT NULL,
  `author_name` VARCHAR(100) NOT NULL DEFAULT 'SN Ponleu',
  `read_time_minutes` TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `seo_title` VARCHAR(200) NULL,
  `seo_desc` VARCHAR(300) NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `published_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_blog_slug` (`slug`),
  INDEX `idx_blog_pub` (`is_published`, `published_at` DESC),
  CONSTRAINT `fk_blog_cat` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: blog_tags
-- ----------------------------------------------------------------------------
CREATE TABLE `blog_tags` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: blog_post_tags
-- ----------------------------------------------------------------------------
CREATE TABLE `blog_post_tags` (
  `post_id` INT UNSIGNED NOT NULL,
  `tag_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  CONSTRAINT `fk_bpt_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bpt_tag` FOREIGN KEY (`tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: ai_tools
-- ----------------------------------------------------------------------------
CREATE TABLE `ai_tools` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM('AI Writing', 'AI Image Generation', 'AI Video Creation', 'AI Coding', 'AI Productivity', 'AI Education') NOT NULL,
  `description_en` TEXT NOT NULL,
  `description_km` TEXT NOT NULL,
  `official_url` VARCHAR(255) NOT NULL,
  `use_cases_en` TEXT NOT NULL,
  `use_cases_km` TEXT NOT NULL,
  `pricing` VARCHAR(100) NOT NULL DEFAULT 'Freemium',
  `icon_url` VARCHAR(255) NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_ai_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: services
-- ----------------------------------------------------------------------------
CREATE TABLE `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title_en` VARCHAR(150) NOT NULL,
  `title_km` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `description_en` TEXT NOT NULL,
  `description_km` TEXT NOT NULL,
  `features_en` JSON NOT NULL,
  `features_km` JSON NOT NULL,
  `starting_price` VARCHAR(50) NULL,
  `icon_name` VARCHAR(50) NOT NULL DEFAULT 'Wrench',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: service_inquiries
-- ----------------------------------------------------------------------------
CREATE TABLE `service_inquiries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_id` INT UNSIGNED NULL,
  `service_title` VARCHAR(150) NOT NULL,
  `client_name` VARCHAR(100) NOT NULL,
  `client_email` VARCHAR(150) NOT NULL,
  `client_phone` VARCHAR(50) NULL,
  `project_scope` TEXT NOT NULL,
  `budget_range` VARCHAR(50) NULL,
  `status` ENUM('new', 'contacted', 'in_progress', 'completed', 'archived') NOT NULL DEFAULT 'new',
  `admin_notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_inquiry_status` (`status`),
  CONSTRAINT `fk_inquiry_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: contact_messages
-- ----------------------------------------------------------------------------
CREATE TABLE `contact_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `phone_or_telegram` VARCHAR(100) NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('unread', 'read', 'replied', 'spam') NOT NULL DEFAULT 'unread',
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_msg_status` (`status`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: media_files
-- ----------------------------------------------------------------------------
CREATE TABLE `media_files` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `file_size_bytes` INT UNSIGNED NOT NULL,
  `uploaded_by` INT UNSIGNED NULL,
  `alt_text` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_media_admin` FOREIGN KEY (`uploaded_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: website_settings
-- ----------------------------------------------------------------------------
CREATE TABLE `website_settings` (
  `key_name` VARCHAR(100) NOT NULL,
  `value_content` TEXT NOT NULL,
  `setting_group` VARCHAR(50) NOT NULL DEFAULT 'general',
  `description` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: audit_logs
-- ----------------------------------------------------------------------------
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` INT UNSIGNED NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_module` VARCHAR(50) NOT NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_admin` (`admin_id`),
  INDEX `idx_audit_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: chatbot_conversations
-- ----------------------------------------------------------------------------
CREATE TABLE `chatbot_conversations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` VARCHAR(100) NOT NULL,
  `user_role` ENUM('user', 'assistant') NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_chat_session` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED SAMPLE DATA (Bilingual English & Khmer)
-- ============================================================================

-- Default Admin (Password: admin123 -- hashed with bcrypt SHA-256 fallback)
INSERT INTO `admins` (`id`, `username`, `email`, `password_hash`, `full_name`, `role`, `avatar_url`, `is_active`) VALUES
(1, 'ponleu', 'ponleuofficial07@gmail.com', '$2b$10$EP0f38QzM0d0t5e3P7G4v.1b2iQJd9p3UqR1kC4gKjJ6U1vW3kP7e', 'SN Ponleu', 'superadmin', '/src/assets/images/sn_ponleu_hero_portrait_1793269460566.jpg', 1);

-- Default Profile
INSERT INTO `profiles` (`id`, `full_name_en`, `full_name_km`, `title_en`, `title_km`, `bio_en`, `bio_km`, `about_details_en`, `about_details_km`, `avatar_url`, `resume_url`, `email`, `phone`, `telegram_handle`, `location_en`, `location_km`, `years_experience`, `github_url`, `linkedin_url`, `facebook_url`, `youtube_url`) VALUES
(1, 'SN Ponleu', 'ស៊ុន ពន្លឺ', 'ICT Specialist & Creative Designer', 'អ្នកឯកទេសបច្ចេកវិទ្យា ICT & អ្នករចនាច្នៃប្រឌិត', 'Passionate ICT Specialist and Creative Designer dedicated to building high-performance digital platforms, enterprise IT infrastructure, and visually striking interactive web applications.', 'អ្នកឯកទេសបច្ចេកវិទ្យាព័ត៌មាន (ICT) និងអ្នករចនាច្នៃប្រឌិត ដែលមានការប្តេជ្ញាចិត្តខ្ពស់ក្នុងការកសាងប្រព័ន្ធឌីជីថលហេដ្ឋារចនាសម្ព័ន្ធ IT និងកម្មវិធីគេហទំព័រទំនើប។', 'With over 5 years of hands-on experience in computer troubleshooting, network infrastructure, full-stack web engineering, and modern creative UI/UX design, I bridge technology and artistic presentation to empower businesses and learners.', 'ជាមួយនឹងបទពិសោធន៍ជាក់ស្តែងជាង ៥ ឆ្នាំក្នុងវិស័យដោះស្រាយបញ្ហាកុំព្យូទ័រ ហេដ្ឋារចនាសម្ព័ន្ធបណ្តាញ អភិវឌ្ឍន៍គេហទំព័រ និងការរចនា UI/UX ខ្ញុំផ្សារភ្ជាប់បច្ចេកវិទ្យានិងសិល្បៈច្នៃប្រឌិត ដើម្បីជួយសម្រួលដល់អាជីវកម្ម និងអ្នកសិក្សា។', '/src/assets/images/sn_ponleu_hero_portrait_1793269460566.jpg', '#resume-download', 'ponleuofficial07@gmail.com', '+855 12 345 678', '@snponleu', 'Phnom Penh, Cambodia', 'រាជធានីភ្នំពេញ កម្ពុជា', 5, 'https://github.com/snponleu', 'https://linkedin.com/in/snponleu', 'https://facebook.com/snponleu', 'https://youtube.com/@snponleu');

-- Skills
INSERT INTO `skills` (`id`, `name_en`, `name_km`, `category`, `proficiency`, `icon`, `is_featured`, `sort_order`) VALUES
(1, 'React & TypeScript', 'React & TypeScript', 'frontend', 95, 'Code2', 1, 1),
(2, 'Node.js & Express', 'Node.js & Express', 'backend', 90, 'Server', 1, 2),
(3, 'Computer Systems & IT Support', 'ប្រព័ន្ធកុំព្យូទ័រ & IT Support', 'ict_hardware', 98, 'Cpu', 1, 3),
(4, 'Network Engineering (LAN/VLAN/Routing)', 'វិស្វកម្មបណ្តាញ (LAN/Routing)', 'ict_hardware', 92, 'Network', 1, 4),
(5, 'UI/UX & Graphic Design (Figma/Photoshop)', 'រចនា UI/UX & ក្រាហ្វិក', 'design', 94, 'Palette', 1, 5),
(6, 'MySQL & Database Architecture', 'MySQL & ស្ថាបត្យកម្មទិន្នន័យ', 'database', 88, 'Database', 1, 6),
(7, 'Linux Server Administration', 'គ្រប់គ្រងម៉ាស៊ីនមេ Linux', 'devops_cloud', 86, 'Terminal', 1, 7),
(8, 'Artificial Intelligence & Prompt Engineering', 'បញ្ញាសិប្បនិម្មិត & Prompting', 'tools', 92, 'Sparkles', 1, 8);

-- Education
INSERT INTO `education` (`id`, `institution_en`, `institution_km`, `degree_en`, `degree_km`, `field_en`, `field_km`, `start_year`, `end_year`, `description_en`, `description_km`, `sort_order`) VALUES
(1, 'Royal University of Phnom Penh (RUPP)', 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ', 'Bachelor of Science (B.Sc.)', 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រ', 'Computer Science and Engineering', 'វិទ្យាសាស្ត្រកុំព្យូទ័រ និងវិស្វកម្ម', '2019', '2023', 'Focused on system software development, advanced network topology, and database management systems with academic honors.', 'ផ្តោតលើការអភិវឌ្ឍប្រព័ន្ធសូហ្វវែរ ស្ថាបត្យកម្មបណ្តាញ និងប្រព័ន្ធគ្រប់គ្រងមូលដ្ឋានទិន្នន័យ ដោយទទួលបានលទ្ធផលសិក្សាល្អប្រសើរ។', 1),
(2, 'National Institute of Posts, Telecom & ICT (NIPTICT)', 'វិទ្យាស្ថានជាតិប្រៃសណីយ៍ ទូរគមនាគមន៍ និងបច្ចេកវិទ្យា', 'Professional Diploma', 'សញ្ញាបត្រវិជ្ជាជីវៈជាន់ខ្ពស់', 'Network Security & Infrastructure', 'សន្តិសុខបណ្តាញ និងហេដ្ឋារចនាសម្ព័ន្ធ', '2021', '2022', 'Specialized practical laboratory training in firewall configuration, server hardening, and enterprise routing.', 'ការបណ្តុះបណ្តាលអនុវត្តផ្ទាល់ក្នុងការកំណត់ Firewall ការពារម៉ាស៊ីនមេ និងប្រព័ន្ធបណ្តាញកម្រិតសហគ្រាស។', 2);

-- Experience
INSERT INTO `experience` (`id`, `company_en`, `company_km`, `role_en`, `role_km`, `period_en`, `period_km`, `is_current`, `description_en`, `description_km`, `technologies`, `sort_order`) VALUES
(1, 'Ponleu Tech Solutions', 'ពន្លឺ ថេក សូលូសិន', 'Senior ICT Consultant & Lead Developer', 'ទីប្រឹក្សាជាន់ខ្ពស់ ICT & ប្រធានផ្នែកអភិវឌ្ឍន៍', '2023 - Present', '២០២៣ - បច្ចុប្បន្ន', 1, 'Directing end-to-end digital transformation for SME clients, delivering resilient full-stack platforms and enterprise computer diagnostics.', 'ដឹកនាំការកែប្រែប្រព័ន្ធឌីជីថលសម្រាប់អតិថិជនសហគ្រាស ផ្តល់ជូនដំណោះស្រាយគេហទំព័រ និងការដោះស្រាយបញ្ហាប្រព័ន្ធកុំព្យូទ័រ។', 'React, Node.js, Linux, MySQL, Docker', 1),
(2, 'CyberNet Global Cambodia', 'សាយប័រណេត ហ្គ្លូប៊ល កម្ពុជា', 'ICT Support Specialist & Systems Engineer', 'អ្នកឯកទេសគាំទ្របច្ចេកវិទ្យា & វិស្វករប្រព័ន្ធ', '2021 - 2023', '២០២១ - ២០២៣', 0, 'Maintained 150+ network endpoints, server racks, managed corporate backup schedules, and resolved urgent hardware/software bottlenecks.', 'គ្រប់គ្រងម៉ាស៊ីនមេនិងឧបករណ៍បណ្តាញជាង ១៥០ គ្រឿង ត្រួតពិនិត្យប្រព័ន្ធបម្រុងទុកទិន្នន័យ និងដោះស្រាយបញ្ហាបច្ចេកវិទ្យាប្រចាំថ្ងៃ។', 'Windows Server, MikroTik, Cisco, Active Directory', 2);

-- Certifications
INSERT INTO `certifications` (`id`, `title_en`, `title_km`, `issuer_en`, `issuer_km`, `issue_date`, `credential_id`, `credential_url`, `sort_order`) VALUES
(1, 'Cisco Certified Network Associate (CCNA)', 'វិញ្ញាបនបត្របណ្តាញ Cisco (CCNA)', 'Cisco Systems', 'ក្រុមហ៊ុន Cisco Systems', '2023-04-15', 'CSCO-14298110', 'https://cisco.com/verify', 1),
(2, 'CompTIA Security+ Certification', 'វិញ្ញាបនបត្រសុវត្ថិភាព CompTIA Security+', 'CompTIA', 'វិទ្យាស្ថាន CompTIA', '2023-09-20', 'COMP001029381', 'https://comptia.org/verify', 2),
(3, 'Google Professional Cloud Architect', 'ស្ថាបត្យករពពកអាជីព Google Cloud', 'Google Cloud', 'ហ្គូហ្គល', '2024-02-10', 'GCP-ARCH-99412', 'https://cloud.google.com', 3);

-- Working Gallery
INSERT INTO `working_gallery` (`id`, `title_en`, `title_km`, `description_en`, `description_km`, `image_url`, `category`, `activity_date`, `is_published`) VALUES
(1, 'Data Center Rack Optimization & Patch Panel Assembly', 'ការរៀបចំទូ Rack និងខ្សែបណ្តាញ Patch Panel', 'Cable management, enterprise Gigabit switch configuration, and uninterruptible power supply check.', 'ការរៀបចំខ្សែបណ្តាញឱ្យមានសណ្តាប់ធ្នាប់ កំណត់ Switch Gigabit និងត្រួតពិនិត្យប្រព័ន្ធភ្លើងបម្រុងទុក UPS។', '/src/assets/images/sn_working_activity_1793269461758.jpg', 'server_network', '2026-03-12', 1),
(2, 'Dual-Monitor Workstation & Creative Interface Coding', 'តុការងារអេក្រង់ភ្លោះ និងការសរសេរកូដ UI ច្នៃប្រឌិត', 'Designing high-fidelity UI components for the client portal and fine-tuning responsive layout breakpoints.', 'ការរចនាផ្ទាំងទិដ្ឋភាពកម្មវិធីសម្រាប់អតិថិជន និងការសរសេរកូដរៀបចំទំហំអេក្រង់ទូរស័ព្ទ និងកុំព្យូទ័រ។', '/src/assets/images/sn_software_toolkit_1793269461578.jpg', 'workspace_setup', '2026-03-25', 1),
(3, 'Hardware Diagnostic & Thermal Pasting Overhaul', 'ការពិនិត្យម៉ាស៊ីន និងផ្លាស់ប្តូរស៊ីលីកូនកម្ដៅ (Thermal Paste)', 'Deep cleaning industrial grade desktop towers, repasting CPU heat sinks, and stress-testing RAM banks.', 'ការសម្អាតម៉ាស៊ីនកុំព្យូទ័រធំៗ ប្តូរស៊ីលីកូនត្រជាក់លើ CPU និងធ្វើតេស្តសាកល្បងល្បឿន RAM។', '/src/assets/images/sn_working_activity_1793269461758.jpg', 'troubleshooting', '2026-04-02', 1);

-- Projects
INSERT INTO `projects` (`id`, `title_en`, `title_km`, `slug`, `summary_en`, `summary_km`, `description_en`, `description_km`, `cover_image`, `category`, `technologies`, `status`, `demo_url`, `source_code_url`, `is_featured`, `is_published`, `views_count`) VALUES
(1, 'Nimbus Cloud Infrastructure Console', 'ផ្ទាំងគ្រប់គ្រងហេដ្ឋារចនាសម្ព័ន្ធពពក Nimbus', 'nimbus-cloud-console', 'Real-time telemetry and resource provisioning platform for hybrid cloud clusters.', 'ប្រព័ន្ធតាមដានទិន្នន័យជាក់ស្តែង និងគ្រប់គ្រងធនធានម៉ាស៊ីនមេលើពពកសម្រាប់សហគ្រាស។', 'Nimbus is an enterprise-grade cloud management console providing zero-latency server metrics, network traffic analytics, automated SSL lifecycle renewing, and node scale triggers.', 'Nimbus គឺជាផ្ទាំងបញ្ជាគ្រប់គ្រងកម្រិតសហគ្រាស ដែលផ្តល់ព័ត៌មានល្បឿនលឿនពីម៉ាស៊ីនមេ វិភាគចរាចរណ៍បណ្តាញ ការបន្តវិញ្ញាបនបត្រ SSL ដោយស្វ័យប្រវត្តិ។', '/src/assets/images/sn_project_showcase_1793269462759.jpg', 'systems_ict', 'React, TypeScript, Node.js, Tailwind CSS, Docker', 'completed', 'https://nimbus-demo.internal', 'https://github.com/snponleu/nimbus-cloud', 1, 1, 1420),
(2, 'Smart ICT Diagnostic & Asset Registry', 'ប្រព័ន្ធវិភាគរោគសញ្ញា ICT និងបញ្ជីឧបករណ៍', 'smart-ict-diagnostic', 'Automated equipment auditing tool and hardware fault isolation portal.', 'ឧបករណ៍ស្កេនពិនិត្យបញ្ជីឧបករណ៍បច្ចេកវិទ្យា និងកំណត់ចំណុចខូចខាតកុំព្យូទ័រដោយស្វ័យប្រវត្តិ។', 'Designed for enterprise IT desks to track device warranty, system specs, IP allocation, and remote ticket resolution history.', 'បង្កើតឡើងសម្រាប់ក្រុមការងារ IT ដើម្បីតាមដានការធានា ព័ត៌មានម៉ាស៊ីន ការបែងចែក IP និងប្រវត្តិដោះស្រាយបញ្ហា។', '/src/assets/images/sn_working_activity_1793269461758.jpg', 'web_development', 'React, Express, MySQL, GraphQL', 'completed', 'https://ict-asset.internal', 'https://github.com/snponleu/ict-audit', 1, 1, 980),
(3, 'Khmer Typography & Creative Graphic Hub', 'មជ្ឈមណ្ឌលអក្សរពុម្ពខ្មែរ និងក្រាហ្វិកឌីហ្សាញ', 'khmer-typography-hub', 'Interactive digital showcase of modern Khmer font design and vector asset library.', 'កន្លែងបង្ហាញពុម្ពអក្សរខ្មែរទំនើប និងបណ្ណាល័យរូបភាព Vector សម្រាប់អ្នករចនា។', 'Features interactive font previews, kerning adjustment playgrounds, and downloadable vector branding resources tailored for Cambodian creatives.', 'មានមុខងារសាកល្បងពុម្ពអក្សរ កែសម្រួលគម្លាតអក្សរ និងទាញយករូបភាព Vector សម្រាប់អ្នកច្នៃប្រឌិតខ្មែរ។', '/src/assets/images/sn_software_toolkit_1793269461578.jpg', 'ui_ux_design', 'Figma, React, Tailwind CSS, SVG Engine', 'completed', 'https://khmertype.internal', 'https://github.com/snponleu/khmer-type', 0, 1, 750);

-- Software Categories
INSERT INTO `software_categories` (`id`, `name_en`, `name_km`, `slug`, `sort_order`) VALUES
(1, 'Computer Utilities & Maintenance', 'កម្មវិធីជំនួយ និងថែទាំកុំព្យូទ័រ', 'utilities-maintenance', 1),
(2, 'Web Development & Coding', 'ឧបករណ៍សរសេរកូដ និងគេហទំព័រ', 'web-development', 2),
(3, 'Graphic Design & Creative', 'កម្មវិធីរចនាក្រាហ្វិក', 'graphic-design', 3),
(4, 'Network & Security Tools', 'ឧបករណ៍បណ្តាញ និងសន្តិសុខ', 'network-security', 4);

-- Software
INSERT INTO `software` (`id`, `category_id`, `name`, `slug`, `logo_url`, `short_desc_en`, `short_desc_km`, `description_en`, `description_km`, `supported_os`, `version`, `file_size`, `license_type`, `official_url`, `download_url`, `install_guide_en`, `install_guide_km`, `system_req_en`, `system_req_km`, `downloads_count`, `is_featured`, `is_published`) VALUES
(1, 1, 'Ponleu FastSystem Cleaner Pro', 'ponleu-fastsystem-cleaner', '/src/assets/images/sn_software_toolkit_1793269461578.jpg', 'Lightweight utility for temp cache flushing, registry audit, and startup app trim.', 'កម្មវិធីលុបឯកសារសំរាម កែសម្រួល Startup និងបង្កើនល្បឿន Windows យ៉ាងរហ័ស។', 'A trusted computer maintenance utility tailored for Windows and macOS to reclaim disk space, identify background CPU hogs, and optimize startup sequences.', 'កម្មវិធីថែទាំកុំព្យូទ័រដែលទុកចិត្តបាន ជួយបង្កើនទំហំផ្ទុកថាសរឹង ស្វែងរកកម្មវិធីស៊ី CPU និងបង្កើនល្បឿនបើកម៉ាស៊ីន។', 'Windows 10/11 (64-bit), macOS 13+', 'v3.2.0', '18.4 MB', 'Free', 'https://github.com/snponleu/system-cleaner', 'https://github.com/snponleu/system-cleaner/releases/download/v3.2.0/FastSystemCleaner-Setup.exe', '1. Download the setup file.\n2. Run as Administrator.\n3. Follow the clean wizard steps.', '១. ទាញយកឯកសារដំឡើង\n២. ចុច Run as Administrator\n៣. អនុវត្តតាមការណែនាំលើអេក្រង់', '2 GB RAM, 50 MB Free Disk Space', 'RAM 2 GB, ទំហំផ្ទុកទំនេរ 50 MB', 3420, 1, 1),
(2, 2, 'DevStack Local Server Suite', 'devstack-local-server', '/src/assets/images/sn_project_showcase_1793269462759.jpg', 'Portable multi-version PHP, Node, and MySQL local sandbox environment.', 'កញ្ចប់ម៉ាស៊ីនមេក្នុងស្រុកសម្រាប់សរសេរកូដ PHP, Node.js និង MySQL ដោយងាយស្រួល។', 'Configured with instant phpMyAdmin access, SSL local certificates, and zero port conflicts.', 'ភ្ជាប់មកជាមួយ phpMyAdmin វិញ្ញាបនបត្រ SSL សម្រាប់តេស្ត និងមិនជាន់ Port គ្នា។', 'Windows 11, macOS Apple Silicon, Ubuntu 22.04+', 'v2.8.4', '124 MB', 'Open Source', 'https://github.com/snponleu/devstack-suite', 'https://github.com/snponleu/devstack-suite/releases/download/v2.8.4/DevStackInstaller.pkg', '1. Extract or run the installer.\n2. Open dashboard on localhost:8080.\n3. Launch phpMyAdmin.', '១. បើកដំណើរការកម្មវិធីដំឡើង\n២. បើកផ្ទាំងគ្រប់គ្រង localhost:8080\n៣. ចូលប្រើប្រាស់ phpMyAdmin', '4 GB RAM, Dual Core CPU', 'RAM 4 GB, CPU ២ គ្រាប់', 2890, 1, 1),
(3, 4, 'NetProbe IP & Port Visualizer', 'netprobe-ip-visualizer', '/src/assets/images/sn_working_activity_1793269461758.jpg', 'Intuitive subnet discovery, open port tester, and latency graphing utility.', 'ឧបករណ៍ស្កេន IP ក្នុងបណ្តាញ តេស្តច្រក Port និងវាស់ល្បឿន Ping ក្រាហ្វិក។', 'Essential ICT tool for network admins to audit devices, detect DHCP collisions, and verify gateway responsiveness.', 'ឧបករណ៍ចាំបាច់សម្រាប់អ្នកគ្រប់គ្រងបណ្តាញ ដើម្បីស្វែងរកឧបករណ៍ ពិនិត្យបញ្ហា DHCP និងល្បឿន Gateway។', 'Cross-Platform (Electron / Native C++)', 'v1.4.1', '32.1 MB', 'Free', 'https://github.com/snponleu/netprobe', 'https://github.com/snponleu/netprobe/releases/download/v1.4.1/NetProbe-Setup.exe', 'Run directly as portable or install with one click.', 'អាចដំណើរការផ្ទាល់ជា Portable ឬដំឡើងមួយចុច។', 'Any 64-bit OS with network interface', 'ប្រព័ន្ធប្រតិបត្តិការ 64-bit ដែលមានកាតបណ្តាញ', 1950, 0, 1);

-- Blog Categories
INSERT INTO `blog_categories` (`id`, `name_en`, `name_km`, `slug`) VALUES
(1, 'Windows Tips & Fixes', 'គន្លឹះ និងដំណោះស្រាយ Windows', 'windows-tips'),
(2, 'Computer Troubleshooting', 'ការដោះស្រាយបញ្ហាកុំព្យូទ័រ', 'computer-troubleshooting'),
(3, 'Web Development', 'ការអភិវឌ្ឍគេហទំព័រ', 'web-development'),
(4, 'Networking & Security', 'បណ្តាញ និងសន្តិសុខ IT', 'networking-security');

-- Blog Posts
INSERT INTO `blog_posts` (`id`, `category_id`, `title_en`, `title_km`, `slug`, `cover_image`, `summary_en`, `summary_km`, `content_en`, `content_km`, `author_name`, `read_time_minutes`, `views_count`, `seo_title`, `seo_desc`, `is_published`) VALUES
(1, 1, 'Top 7 Methods to Fix 100% Disk Usage in Windows 11', 'វិធីសាស្ត្រកំពូលទាំង ៧ ដើម្បីដោះស្រាយបញ្ហា Disk Usage 100% លើ Windows 11', 'fix-100-percent-disk-usage-windows-11', '/src/assets/images/sn_working_activity_1793269461758.jpg', 'Step-by-step diagnostic guide to stop background freezing, disable runaway SysMain, and restore snappy system response.', 'ការណែនាំលម្អិតជាជំហានៗដើម្បីបញ្ឈប់ភាពគាំង ផ្អាកសេវា SysMain ដែលដំណើរការខុសប្រក្រតី និងធ្វើឱ្យកុំព្យូទ័រដើរលឿនដូចដើម។', 'When your Task Manager shows a persistent 100% disk usage, your laptop or desktop can stutter dramatically.\n\n### Step 1: Disable SysMain Service\nOpen Services (services.msc), scroll down to `SysMain`, right-click and choose `Properties`. Change Startup type to `Disabled` and click `Stop`.\n\n### Step 2: Check for Storage Drive File System Errors\nRun an elevated Command Prompt (`cmd` as Admin) and execute:\n```bash\nchkdsk C: /f /r\n```\n\n### Step 3: Upgrade to NVMe SSD if using an HDD\nLegacy mechanical spinning drives cannot handle modern Windows telemetry and background indexing simultaneously.', 'នៅពេលដែល Task Manager បង្ហាញ Disk 100% ជាប់រហូត ម៉ាស៊ីនកុំព្យូទ័ររបស់អ្នកនឹងមានសភាពគាំងយឺតខ្លាំង។\n\n### ជំហានទី ១៖ បិទសេវាកម្ម SysMain\nបើក Services (services.msc) រួចស្វែងរក `SysMain` ចុចកណ្ដុរស្ដាំជ្រើសរើស `Properties` ប្តូរ Startup type ទៅជា `Disabled` រួចចុច `Stop`។\n\n### ជំហានទី ២៖ ត្រួតពិនិត្យកំហុស Hard Disk\nបើក Command Prompt (cmd as Administrator) រួចវាយពាក្យបញ្ជា៖\n```bash\nchkdsk C: /f /r\n```\n\n### ជំហានទី ៣៖ ប្តូរមកប្រើ SSD ប្រសិនបើកំពុងប្រើ Hard Disk ចាស់។', 'SN Ponleu', 6, 2340, 'Fix 100% Disk Usage Windows 11 - SN Ponleu ICT Blog', 'Complete tutorial for resolving high disk usage issues on Windows 10 and 11.', 1),
(2, 2, 'Complete Computer Hardware Diagnostic: Testing RAM & SSD Health', 'វិធីសាស្ត្រតេស្តសុខភាព RAM និង SSD កុំព្យូទ័រដោយខ្លួនឯង', 'complete-computer-hardware-diagnostic', '/src/assets/images/sn_software_toolkit_1793269461578.jpg', 'Learn how to detect failing memory modules (Blue Screen of Death) and monitor SSD TBW endurance before data loss happens.', 'ស្វែងយល់ពីរបៀបពិនិត្យ RAM ដែលមានបញ្ហាបណ្តាលឱ្យឡើងផ្ទាំងខៀវ (BSOD) និងតាមដានអាយុកាល SSD ដើម្បីការពារការបាត់បង់ទិន្នន័យ។', 'Proactive maintenance saves valuable business data.\n\n### 1. Memory Diagnostic Tool\nPress `Windows + R`, type `mdsched.exe` and select `Restart now and check for problems`.\n\n### 2. SMART Attributes on NVMe Drives\nUse tools like CrystalDiskInfo to read the Drive Life percentage and Bad Sector reallocations.', 'ការថែទាំជាប្រចាំជួយសង្គ្រោះទិន្នន័យដ៏មានតម្លៃរបស់អ្នក។\n\n### ១. ឧបករណ៍តេស្ត RAM\nចុច `Windows + R` វាយពាក្យ `mdsched.exe` ហើយជ្រើសរើស Restart ម៉ាស៊ីនដើម្បីតេស្ត។\n\n### ២. ពិនិត្យសុខភាព SSD\nប្រើប្រាស់កម្មវិធី CrystalDiskInfo ដើម្បីមើលភាគរយសុខភាព Drive និង Bad Sectors។', 'SN Ponleu', 5, 1870, 'Testing RAM and SSD Health - SN Ponleu', 'Hardware diagnostics tutorial for ICT specialists and enthusiasts.', 1);

-- AI Tools
INSERT INTO `ai_tools` (`id`, `name`, `category`, `description_en`, `description_km`, `official_url`, `use_cases_en`, `use_cases_km`, `pricing`, `is_featured`, `sort_order`) VALUES
(1, 'Google Gemini 2.5 / 3.0', 'AI Productivity', 'Google flagship multimodal model with ultra-fast reasoning, search grounding, and vast context window.', 'ម៉ូដែលឆ្លាតវៃពហុទម្រង់របស់ Google ដែលមានសមត្ថភាពវិភាគខ្ពស់ និងឆ្លើយសំណួរយ៉ាងរហ័ស។', 'https://gemini.google.com', 'Coding, document synthesis, real-time research, Khmer language comprehension.', 'ការសរសេរកូដ សង្ខេបឯកសារ ស្រាវជ្រាវ និងការយល់ដឹងភាសាខ្មែរយ៉ាងច្បាស់។', 'Free & Paid (Advanced)', 1, 1),
(2, 'Claude 3.7 Sonnet', 'AI Coding', 'Industry-leading coding model with hybrid standard and extended thinking capabilities.', 'ម៉ូដែលឈានមុខគេលើពិភពលោកសម្រាប់ការសរសេរកូដ និងការគិតស៊ីជម្រៅ។', 'https://claude.ai', 'Full-stack software engineering, architecture reviews, debugging complex bugs.', 'ការសរសេរកូដគេហទំព័រ ពិនិត្យស្ថាបត្យកម្ម និងដោះស្រាយកំហុសកូដស្មុគស្មាញ។', 'Freemium', 1, 2),
(3, 'Midjourney v6', 'AI Image Generation', 'Photorealistic visual asset generation for marketing campaigns, mockups, and UI backdrops.', 'ការបង្កើតរូបភាពកម្រិតខ្ពស់ដូចរូបថតពិត សម្រាប់ទីផ្សារ និងផ្ទាំងទស្សនីយភាព។', 'https://midjourney.com', 'Website concept art, product packaging renders, graphic illustrations.', 'ការបង្កើតគំនំរចនាគេហទំព័រ ការវេចខ្ចប់ និងរូបភាពគំនូរច្នៃប្រឌិត។', 'Paid Subscription', 1, 3);

-- Services
INSERT INTO `services` (`id`, `title_en`, `title_km`, `slug`, `description_en`, `description_km`, `features_en`, `features_km`, `starting_price`, `icon_name`, `is_active`, `sort_order`) VALUES
(1, 'Modern Website & Web App Development', 'សេវាកម្មបង្កើតគេហទំព័រ និងកម្មវិធីទំនើប', 'modern-web-development', 'Bespoke web applications built with React, Node.js, and high-performance databases, tailored for startups and businesses.', 'បង្កើតគេហទំព័រតាមតម្រូវការជាក់ស្តែងដោយប្រើប្រាស់ React និងប្រព័ន្ធទិន្នន័យមានសុវត្ថិភាពខ្ពស់។', '["Responsive Design for Mobile & Desktop", "GraphQL & RESTful APIs", "Fast Loading Speed & SEO Ready", "Administrative Control Panel"]', '["រចនាឡើងសម្រាប់ទាំងទូរស័ព្ទ និងកុំព្យូទ័រ", "ភ្ជាប់ប្រព័ន្ធ API និងទិន្នន័យសុវត្ថិភាព", "ល្បឿនលឿន និងត្រូវក្បួន SEO", "ផ្ទាំងគ្រប់គ្រង Admin ងាយស្រួលប្រើ"]', '$350', 'Code2', 1, 1),
(2, 'Computer Repair & OS Optimization', 'សេវាជួសជុលកុំព្យូទ័រ និងដំឡើង Windows', 'computer-repair-os-setup', 'Comprehensive hardware diagnostics, clean operating system installation, thermal servicing, and SSD upgrades.', 'ការពិនិត្យម៉ាស៊ីន ដំឡើង Windows ស្អាត ផ្លាស់ប្តូរស៊ីលីកូនកម្ដៅ និងតម្លើងល្បឿន SSD។', '["Genuine Drivers & Essential Software Suite", "Deep Malware & Adware Removal", "Thermal Paste Refresh", "Complete Data Preservation"]', '["ដំឡើង Driver និងកម្មវិធីចាំបាច់", "កម្ចាត់មេរោគ និងកម្មវិធីរំខាន", "ផ្លាស់ប្តូរស៊ីលីកូនត្រជាក់ CPU", "រក្សាសុវត្ថិភាពទិន្នន័យចាស់"]', '$25', 'Wrench', 1, 2),
(3, 'Enterprise Network & Server Setup', 'សេវាកម្មរៀបចំប្រព័ន្ធបណ្តាញ និង Server', 'enterprise-network-setup', 'Design and deployment of robust office LAN, Wi-Fi mesh networks, MikroTik router configuration, and NAS storage.', 'រចនានិងដំឡើងប្រព័ន្ធបណ្តាញ LAN ក្នុងក្រុមហ៊ុន ប្រព័ន្ធ Wi-Fi Mesh និងប្រព័ន្ធផ្ទុកទិន្នន័យ NAS។', '["VLAN Segmentation & Guest Wi-Fi", "Firewall Rules & Bandwidth Allocation", "Network Attached Storage (NAS) Setup", "Remote Access VPN"]', '["ការបែងចែកបណ្តាញ VLAN និង Wi-Fi ភ្ញៀវ", "កំណត់ Firewall និងគ្រប់គ្រងល្បឿនអ៊ីនធឺណិត", "ដំឡើងប្រព័ន្ធផ្ទុកទិន្នន័យ NAS រួម", "ភ្ជាប់ប្រព័ន្ធ VPN ពីចម្ងាយ"]', '$120', 'Network', 1, 3);

-- Website Settings
INSERT INTO `website_settings` (`key_name`, `value_content`, `setting_group`, `description`) VALUES
('site_name', 'SN PONLEU', 'general', 'Brand title shown across the hub'),
('site_tagline_en', 'Personal Digital Hub | ICT Specialist & Creative Designer', 'general', 'English brand tagline'),
('site_tagline_km', 'មជ្ឈមណ្ឌលឌីជីថលផ្ទាល់ខ្លួន | អ្នកឯកទេស ICT & អ្នករចនាច្នៃប្រឌិត', 'general', 'Khmer brand tagline'),
('contact_email', 'ponleuofficial07@gmail.com', 'contact', 'Primary contact recipient'),
('contact_phone', '+855 12 345 678', 'contact', 'Public inquiry phone line'),
('telegram_link', 'https://t.me/snponleu', 'social', 'Direct Telegram link'),
('theme_mode_default', 'dark', 'appearance', 'Default theme mode (light/dark)'),
('ai_chatbot_enabled', 'true', 'features', 'Enable or disable public AI assistant widget');

-- Contact Messages (Sample initial message)
INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `phone_or_telegram`, `is_read`, `status`) VALUES
(1, 'Sokha Rith', 'sokha.rith@example.com', 'Inquiry regarding Office Network Installation', 'Hello Ponleu, we have a new office in Toul Kork with 25 workstations and need LAN cabling and router setup. Please advise your availability.', '@sokharith', 0, 'unread');

-- Audit Logs
INSERT INTO `audit_logs` (`id`, `admin_id`, `action`, `target_module`, `details`, `ip_address`) VALUES
(1, 1, 'SYSTEM_INITIALIZED', 'system', 'Database schema sn_ponleu_db and initial seed records established successfully.', '127.0.0.1');

-- ============================================================================
-- END OF SQL SCHEMA
-- ============================================================================
