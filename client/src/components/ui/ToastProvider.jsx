import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const ToastCtx = createContext(null);

const icons = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertTriangle,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((toast) => {
    const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
    const next = { id, type: 'info', title: '', message: '', ttl: 3500, ...toast };
    setToasts((prev) => [next, ...prev].slice(0, 4));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, next.ttl);
  }, []);

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-3">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = icons[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="glass ring-soft w-[360px] max-w-[92vw] rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      'mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl',
                      t.type === 'success' && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
                      t.type === 'error' && 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
                      t.type === 'warning' && 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
                      t.type === 'info' && 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    {t.title ? <p className="font-semibold text-slate-900 dark:text-white">{t.title}</p> : null}
                    <p className="text-sm text-slate-600 dark:text-slate-300">{t.message}</p>
                  </div>

                  <button
                    onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                    className="rounded-xl p-1 text-slate-500 hover:bg-black/5 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

