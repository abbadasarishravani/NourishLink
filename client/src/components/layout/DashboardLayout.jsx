import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Gift, User, Shield, HandHeart, ClipboardList, Settings, Menu, X } from 'lucide-react';
import TopNav from './TopNav';
import ChatbotWidget from './ChatbotWidget';
import { getStoredUser } from '../../utils/auth';

function NavItem({ to, icon: Icon, label }) {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link
      to={to}
      className={[
        'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition',
        active
          ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/25'
          : 'text-slate-700 hover:bg-black/5 dark:text-slate-100 dark:hover:bg-slate-800',
      ].join(' ')}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout() {
  const [user, setUser] = useState(getStoredUser());
  const [open, setOpen] = useState(false);
  const role = user?.role || 'Donor';
  const base = `/dashboard/${role.toLowerCase()}`;

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    window.addEventListener('auth-changed', syncUser);
    return () => window.removeEventListener('auth-changed', syncUser);
  }, []);

  const nav = role === 'Admin'
    ? [
        { to: `${base}`, icon: Shield, label: 'Overview' },
        { to: `${base}/users`, icon: User, label: 'Users' },
        { to: `${base}/donations`, icon: ClipboardList, label: 'Donations' },
        { to: `${base}/settings`, icon: Settings, label: 'Rewards & Settings' },
      ]
    : role === 'NGO'
      ? [
          { to: `${base}`, icon: HandHeart, label: 'Tasks' },
          { to: `${base}/map`, icon: Map, label: 'Nearby Map' },
          { to: `${base}/history`, icon: ClipboardList, label: 'My Pickups' },
          { to: `${base}/profile`, icon: User, label: 'Profile' },
        ]
      : [
          { to: `${base}`, icon: LayoutDashboard, label: 'Dashboard' },
          { to: `${base}/donate`, icon: HandHeart, label: 'New Donation' },
          { to: `${base}/rewards`, icon: Gift, label: 'Rewards' },
          { to: `${base}/profile`, icon: User, label: 'Profile' },
        ];

  return (
    <div className="min-h-screen bg-aurora">
      <div className="pointer-events-none fixed inset-0 pattern-grid opacity-[0.35] dark:opacity-[0.22]" />
      <TopNav />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="glass ring-soft inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />} Menu
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className={['glass ring-soft rounded-3xl p-4 h-fit', open ? 'block' : 'hidden', 'lg:block'].join(' ')}>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                {role} workspace
              </p>
              <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{user?.name || 'Account'}</p>
              <p className="text-sm text-slate-600 dark:text-slate-200 truncate">{user?.email}</p>
            </div>
            <div className="space-y-2">
              {nav.map((i) => (
                <NavItem key={i.to} to={i.to} icon={i.icon} label={i.label} />
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  );
}
