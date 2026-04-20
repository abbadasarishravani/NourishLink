import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Admin</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Rewards & settings</h1>
      </div>

      <div className="glass ring-soft rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary-700 dark:text-primary-300" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Reward system</h2>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          In this build, rewards are computed server-side when a donation becomes <b>Delivered</b>:
          10 points per delivered donation, with Bronze, Silver, and Gold badge levels.
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Next step: make these thresholds editable and log all admin changes in an activity log.
        </p>
      </div>
    </div>
  );
}
