import React from 'react';
import { Map } from 'lucide-react';
import NgoDonationsMap from '../../../components/maps/NgoDonationsMap';

export default function NgoMap() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nearby map</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Donation requests on map</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          View pending donation requests on a live map. Click a marker to see details.
        </p>
      </div>

      <div className="glass ring-soft rounded-3xl p-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
          <NgoDonationsMap className="absolute inset-0" />
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Map className="h-4 w-4" />
          Map-based matching runs on OpenStreetMap (no API key).
        </div>
      </div>
    </div>
  );
}

