import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-aurora">
      <div className="pointer-events-none fixed inset-0 pattern-grid opacity-[0.35] dark:opacity-[0.22]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-xl">
          <div className="glass ring-soft rounded-3xl p-8 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-300">
              <SearchX className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Page not found</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">The link you followed doesn’t exist.</p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 hover:bg-primary-700"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

