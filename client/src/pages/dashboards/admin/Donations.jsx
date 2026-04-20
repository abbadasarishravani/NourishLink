import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';

export default function AdminDonations() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api
      .get('/admin/donations')
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Admin</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Donations monitor</h1>
      </div>

      <div className="glass ring-soft rounded-3xl p-6 overflow-x-auto">
        {items === null ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">No donations found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2 pr-3">Food</th>
                <th className="py-2 pr-3">Donor</th>
                <th className="py-2 pr-3">Assigned NGO</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {items.map((d) => (
                <tr key={d._id} className="text-slate-700 dark:text-slate-200">
                  <td className="py-3 pr-3 font-semibold">{d.foodType}</td>
                  <td className="py-3 pr-3">{d.donor?.name || '—'}</td>
                  <td className="py-3 pr-3">{d.assignedNgo?.organizationName || d.assignedNgo?.name || '—'}</td>
                  <td className="py-3 pr-3">{d.status}</td>
                  <td className="py-3">{new Date(d.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

