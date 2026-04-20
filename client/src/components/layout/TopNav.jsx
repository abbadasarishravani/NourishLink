import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, LogOut, Moon, Sun, LayoutDashboard } from 'lucide-react';
import { applyTheme, getTheme } from '../../utils/theme';
import { clearAuth, getStoredUser, isAuthed } from '../../utils/auth';

export default function TopNav() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getTheme());
  const [user, setUser] = useState(getStoredUser());
  const authed = isAuthed();

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    window.addEventListener('auth-changed', syncUser);
    return () => window.removeEventListener('auth-changed', syncUser);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  const logout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="group flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary-500/15 to-emerald-500/15 ring-soft">
                <HeartHandshake className="h-5 w-5 text-primary-700 dark:text-primary-300" />
              </span>
              <div className="leading-tight">
                <p className="font-extrabold tracking-tight text-slate-900 dark:text-white">Nourish Link</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Building a Hunger Free World</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              {!authed ? (
                <>
                  <Link
                    to="/login"
                    className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-2xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 hover:bg-primary-700"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={`/dashboard/${(user?.role || 'donor').toLowerCase()}`}
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
