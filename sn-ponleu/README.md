# SN PONLEU — PERSONAL DIGITAL HUB

All-in-one personal digital platform for **SN Ponleu — ICT Specialist & Creative Designer**. Built with React 19, Express, GraphQL, MySQL/MariaDB database architecture (`sn_ponleu_db.sql`), and Google Gemini 3.8 Flash AI Assistant.

---

## 1. System Architecture

```
sn-ponleu/
├── database/
│   ├── sn_ponleu_db.sql          # Complete MySQL 8 / phpMyAdmin DDL & seed data
│   └── store.json                # Persistent database store
├── src/
│   ├── assets/images/            # High-res photography & assets
│   ├── components/               # Navbar, Footer, AIChatbotModal
│   ├── context/AppContext.tsx    # State: Language (EN/KM), Dark Mode, Auth, Routing
│   ├── locales/translations.ts   # Bilingual dictionary (Khmer Unicode & English)
│   ├── pages/                    # 12 Public pages & Admin control panel
│   ├── server/                   # db.ts, graphqlSchema.ts, geminiService.ts
│   ├── services/api.ts           # GraphQL client & REST endpoints
│   ├── types/index.ts            # TypeScript interfaces
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── uploads/                      # Uploaded media files
├── server.ts                     # Full-stack Express server with Vite middleware
├── package.json
└── README.md
```

---

## 2. macOS Quickstart & Installation Guide

### Prerequisites
- macOS Sonoma or newer (Intel or Apple Silicon)
- **Node.js**: v20 or v22 LTS (`brew install node`)
- **MySQL / MariaDB**: 8.0+ or MariaDB 10.5+ (`brew install mysql` or XAMPP / MAMP)
- **phpMyAdmin**: via Homebrew, Docker, or MAMP/XAMPP

### Step 1: Database Setup via phpMyAdmin
1. Start your MySQL service:
   ```bash
   brew services start mysql
   ```
2. Open phpMyAdmin in your web browser (e.g. `http://localhost/phpmyadmin` or `http://localhost:8080/phpmyadmin`).
3. Create a new database named `sn_ponleu_db` with collation `utf8mb4_unicode_ci` (required for Khmer Unicode script).
4. Click the **Import** tab.
5. Select `database/sn_ponleu_db.sql` from the project folder and click **Go**.
6. All 14 relational tables, indexes, constraints, and initial bilingual records will be populated.

### Step 2: Install Project Dependencies
In the project root directory, run:
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your configuration contains:
```env
PORT=3000
GEMINI_API_KEY="your-gemini-api-key"
```

### Step 4: Run the Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 3. Administrative Credentials

- **Admin Login Route**: Click the shield icon in the top navigation or navigate to `/admin-login`
- **Default Username**: `ponleu` (or email: `ponleuofficial07@gmail.com`)
- **Default Password**: `admin123`
- *Note*: You can update your credentials anytime inside the Admin Dashboard under **Website Settings > Update Administrator Credentials**.

---

## 4. Key Capabilities & Features

1. **Top Bar Contract & Responsive UI**: Clean 3-zone header, light & dark theme toggle, instant Khmer (Noto Sans Khmer) and English language switcher.
2. **Personal Portfolio & Biography**: Timeline for education (RUPP, NIPTICT), work experience, skills progress bars, and certifications (CCNA, CompTIA Security+, Google Cloud).
3. **Working Activity Gallery**: Categorized field photography (server racks, workstation setup, hardware troubleshooting) with high-res fullscreen lightbox.
4. **Software & ICT Directory**: Curated developer tools and maintenance utilities with supported OS tags, file sizes, system requirements, and live download count tracking.
5. **ICT Tutorials Blog**: Detailed step-by-step guides (e.g., Windows 11 100% disk usage fix, RAM & SSD diagnostics) with code snippets, read times, and view counters.
6. **Gemini 3.8 Flash AI Assistant**: Server-side multimodal AI answering ICT questions, explaining computer problems, and guiding visitors in both Khmer and English.
7. **Professional Services & Inquiries**: Service packages with feature checklists and interactive inquiry modal saving directly to database.
8. **Contact Form**: Direct messaging with anti-spam protection and database storage.
9. **Unified Search**: Instant keyword discovery across projects, software, tutorials, AI tools, and services.
10. **Administration Dashboard**: 14 management modules with full CRUD capabilities, media library, and security audit logs.
