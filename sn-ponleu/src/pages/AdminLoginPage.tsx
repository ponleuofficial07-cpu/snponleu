import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Shield, Lock, User, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { t, login, navigate } = useApp();
  const [username, setUsername] = useState('ponleu');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate('admin');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Hub</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#1677FF] dark:text-[#42ADF5] flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {t.admin_login_title}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t.admin_login_desc}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.admin_username}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username or email"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.admin_password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-[#42ADF5]" />
              <span>Initial Admin Credentials (Development):</span>
            </div>
            <div>Username: <code className="text-slate-800 dark:text-slate-200 font-mono">ponleu</code></div>
            <div>Password: <code className="text-slate-800 dark:text-slate-200 font-mono">admin123</code></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#42ADF5] dark:bg-[#42ADF5] dark:text-[#0B1220] rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : t.admin_login_btn}
          </button>
        </form>
      </div>
    </div>
  );
};
