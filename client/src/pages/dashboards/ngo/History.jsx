import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';

export default function NgoHistory() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api
      .get('/donations?my_requests=true')
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">My pickups</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Accepted donation history</h1>
      </div>

      <div className="glass ring-soft rounded-3xl p-6">
        {items === null ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">No pickups yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((d) => (
              <div
                key={d._id}
                className="rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 dark:text-white truncate">{d.foodType}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                      {d.quantity} {d.unit} • {d.address}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-black/5 px-3 py-1 text-xs font-extrabold dark:bg-white/10">
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

