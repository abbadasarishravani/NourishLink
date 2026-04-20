import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="glass ring-soft rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-300">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Access denied</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          This page is not available for your role. If you think this is a mistake, contact an admin.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-2xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 hover:bg-primary-700"
          >
            Go home
          </Link>
          <Link
            to="/login"
            className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

