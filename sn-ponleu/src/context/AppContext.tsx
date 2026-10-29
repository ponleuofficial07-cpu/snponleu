import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme, AdminUser } from '../types/index.ts';
import { translations } from '../locales/translations.ts';
import { checkCurrentAdmin, loginAdmin, logoutAdmin } from '../services/api.ts';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['en'];
  theme: Theme;
  toggleTheme: () => void;
  currentRoute: string;
  routeParam: string | null;
  navigate: (route: string, param?: string | null) => void;
  admin: AdminUser | null;
  isAdminAuthenticated: boolean;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  toast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('sn_lang') as Language) || 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('sn_theme') as Theme;
    return saved || 'dark'; // Default to sleek tech dark mode as designed
  });

  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const t = translations[lang] || translations.en;

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('sn_lang', newLang);
    if (newLang === 'km') {
      document.body.classList.add('lang-km');
    } else {
      document.body.classList.remove('lang-km');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    localStorage.setItem('sn_theme', nextTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (lang === 'km') {
      document.body.classList.add('lang-km');
    } else {
      document.body.classList.remove('lang-km');
    }
  }, [lang]);

  // Check admin session on mount
  useEffect(() => {
    checkCurrentAdmin().then((res) => {
      if (res) setAdmin(res);
    });
  }, []);

  const navigate = (route: string, param: string | null = null) => {
    setCurrentRoute(route);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = async (username: string, pass: string) => {
    const data = await loginAdmin(username, pass);
    localStorage.setItem('sn_admin_token', data.token);
    setAdmin(data.admin);
    toast('Welcome back, Admin!', 'success');
  };

  const logout = async () => {
    await logoutAdmin();
    setAdmin(null);
    toast('Logged out successfully', 'info');
    navigate('home');
  };

  const toast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        theme,
        toggleTheme,
        currentRoute,
        routeParam,
        navigate,
        admin,
        isAdminAuthenticated: !!admin,
        login,
        logout,
        isChatOpen,
        setIsChatOpen,
        toast,
      }}
    >
      {children}
      {/* Global Toast Notifications Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg text-sm shadow-xl transition-all duration-300 border flex items-center justify-between gap-3 ${
              item.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
                : item.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800'
                : 'bg-slate-900/95 text-slate-200 border-slate-700'
            }`}
          >
            <span>{item.text}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== item.id))}
              className="opacity-70 hover:opacity-100 text-xs ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
