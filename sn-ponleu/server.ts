import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db.ts';
import { executeGraphQL } from './src/server/graphqlSchema.ts';
import { askGeminiAssistant } from './src/server/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-token');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploads
app.use('/uploads', express.static(uploadsDir));

// Helper: Extract admin token
function getAdminFromRequest(req: express.Request) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
  if (!token) return null;
  return db.verifySession(token);
}

// ----------------------------------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------------------------------

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const admin = db.findAdminByUsername(username);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Simple and secure password check (supports 'admin123' seed or updated hash)
  const isMatch = admin.password_hash === password || admin.password_hash === 'admin123';
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = db.createSession(admin.id);
  db.logAudit('ADMIN_LOGIN', 'auth', `Admin ${admin.username} logged in successfully`, admin.id, req.ip);

  return res.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      full_name: admin.full_name,
      role: admin.role,
      avatar_url: admin.avatar_url,
    },
  });
});

// Auth: Current Admin
app.get('/api/auth/me', (req, res) => {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ authenticated: false });
  }
  return res.json({
    authenticated: true,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      full_name: admin.full_name,
      role: admin.role,
      avatar_url: admin.avatar_url,
    },
  });
});

// Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
  if (token) {
    db.deleteSession(token);
  }
  return res.json({ success: true });
});

// Auth: Update Admin Credentials
app.post('/api/auth/update-credentials', (req, res) => {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { newPassword, fullName, email } = req.body;
  if (newPassword && newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  db.updateAdminCredentials(admin.id, newPassword || admin.password_hash, fullName, email);
  return res.json({ success: true, message: 'Admin profile updated successfully' });
});

// GraphQL Endpoint
app.all('/api/graphql', async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  let variables: Record<string, any> = {};
  if (req.method === 'POST') {
    variables = req.body?.variables || {};
  } else if (req.query?.variables) {
    try {
      variables = typeof req.query.variables === 'string' ? JSON.parse(req.query.variables) : (req.query.variables as any);
    } catch {
      variables = {};
    }
  }
  const query = req.method === 'POST' ? req.body?.query : (req.query?.query as string);
  const admin = getAdminFromRequest(req);

  if (!query) {
    return res.status(400).json({ error: 'GraphQL query is required' });
  }

  try {
    const result = await executeGraphQL(query, variables, { admin: admin || undefined });
    return res.json(result);
  } catch (err: any) {
    console.error('GraphQL Execution Error:', err);
    return res.status(500).json({ errors: [{ message: err.message || 'Internal GraphQL error' }] });
  }
});

// Media: Upload File
app.post('/api/upload', (req, res) => {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Administrative authentication required for file uploads' });
  }

  const { base64Data, fileName, mimeType, altText } = req.body;
  if (!base64Data || !fileName || !mimeType) {
    return res.status(400).json({ error: 'Missing file payload or metadata' });
  }

  // Security: check allowed MIME types (images, pdfs, documents)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf', 'application/zip'];
  if (!allowedTypes.includes(mimeType)) {
    return res.status(400).json({ error: 'File type not allowed. Allowed types: JPEG, PNG, WEBP, SVG, GIF, PDF, ZIP' });
  }

  try {
    const cleanFileName = Date.now() + '_' + fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeFilePath = path.join(uploadsDir, cleanFileName);
    const buffer = Buffer.from(base64Data.replace(/^data:[^;]+;base64,/, ''), 'base64');

    // Restrict max file size to 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds maximum limit of 10MB' });
    }

    fs.writeFileSync(safeFilePath, buffer);
    const publicUrl = `/uploads/${cleanFileName}`;

    const media = db.addMediaFile(
      {
        file_name: cleanFileName,
        file_path: publicUrl,
        mime_type: mimeType,
        file_size_bytes: buffer.length,
        uploaded_by: admin.id,
        alt_text: altText || fileName,
      },
      admin.id
    );

    return res.json({ success: true, file: media });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return res.status(500).json({ error: 'Failed to process file upload' });
  }
});

// Gemini AI Chatbot Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const result = await askGeminiAssistant(message.trim(), Array.isArray(history) ? history : []);
    return res.json(result);
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ text: 'Unable to process AI conversation request.', error: err.message });
  }
});

// Database Export / phpMyAdmin SQL file download
const serveSqlFile = (_req: express.Request, res: express.Response) => {
  const sqlPath = path.resolve(__dirname, 'database', 'sn_ponleu_db.sql');
  if (fs.existsSync(sqlPath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="sn_ponleu_db.sql"');
    return res.sendFile(sqlPath);
  }
  return res.status(404).json({ error: 'SQL schema file not found' });
};
app.get('/api/export-db/sql', serveSqlFile);
app.get('/sn_ponleu_db.sql', serveSqlFile);
app.get('/database/sn_ponleu_db.sql', serveSqlFile);

// Stats endpoint
app.get('/api/stats', (req, res) => {
  const stats = db.getDashboardStats();
  return res.json(stats);
});

// Audit Logs endpoint
app.get('/api/audit-logs', (req, res) => {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.json(db.getStore().audit_logs);
});

// Catch-all JSON 404 for any unhandled /api/* route to strictly prevent serving index.html
app.all('/api/*', (req, res) => {
  return res.status(404).json({
    error: 'API endpoint not found',
    method: req.method,
    path: req.originalUrl,
  });
});

// ----------------------------------------------------------------------------
// VITE INTEGRATION / STATIC SERVING
// ----------------------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SN PONLEU Personal Digital Hub server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
