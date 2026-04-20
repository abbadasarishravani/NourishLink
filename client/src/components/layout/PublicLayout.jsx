import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import ChatbotWidget from './ChatbotWidget';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-aurora">
      <div className="pointer-events-none fixed inset-0 pattern-grid opacity-[0.35] dark:opacity-[0.22]" />
      <TopNav />
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
      <footer className="relative border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-500 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} Nourish Link. Built to reduce food waste and hunger.
          </p>
        </div>
      </footer>
      <ChatbotWidget />
    </div>
  );
}

