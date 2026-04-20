import React, { useEffect, useMemo, useState } from 'react';
import { Gift, HandHeart, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';
import { getStoredUser, setStoredUser } from '../../../utils/auth';

function Stat({ icon: Icon, label, value, tone = 'primary' }) {
  const toneCls =
    tone === 'emerald'
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
      : tone === 'cyan'
        ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
        : 'bg-primary-600/15 text-primary-700 dark:text-primary-300';

  return (
    <div className="glass ring-soft rounded-3xl p-5">
      <div className="flex items-center gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl ${toneCls}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function DonorOverview() {
  const [me, setMe] = useState(getStoredUser());
  const [donations, setDonations] = useState(null);

  useEffect(() => {
    (async () => {
      const [meRes, donationsRes] = await Promise.all([api.get('/users/me'), api.get('/donations/my')]);
      setMe(meRes.data);
      setStoredUser(meRes.data);
      setDonations(donationsRes.data);
    })().catch(() => {
      setMe(getStoredUser());
      setDonations([]);
    });
  }, []);

  const stats = useMemo(() => {
    const list = donations || [];
    return {
      active: list.filter((item) => ['Pending', 'Accepted', 'In Progress'].includes(item.status)).length,
      delivered: list.filter((item) => item.status === 'Delivered').length,
    };
  }, [donations]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Donor dashboard</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Welcome, {me?.name || 'Donor'}.
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Track your donations, earn rewards, and see the meals you helped deliver.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat icon={Gift} label="Reward points" value={me?.totalPoints ?? me?.points ?? '...'} />
        <Stat icon={Clock} label="Active donations" value={donations ? stats.active : '...'} tone="cyan" />
        <Stat icon={CheckCircle2} label="Delivered" value={donations ? stats.delivered : '...'} tone="emerald" />
      </div>

      <div className="glass ring-soft rounded-3xl p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Recent donations</p>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Your latest activity</h2>
          </div>
          <Link
            to="/dashboard/donor/donate"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm shadow-primary-600/25 hover:bg-primary-700"
          >
            <HandHeart className="h-4 w-4" />
            New donation
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {(donations || []).slice(0, 5).map((donation) => (
            <motion.div
              key={donation._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-slate-900 dark:text-white">{donation.foodType}</p>
                  <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                    {donation.quantity} {donation.unit} - {donation.address}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-black/5 px-3 py-1 text-xs font-extrabold dark:bg-white/10">
                  {donation.status}
                </span>
              </div>
            </motion.div>
          ))}

          {donations && donations.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-white/60 p-5 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              No donations yet. Create your first one to start earning points.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
