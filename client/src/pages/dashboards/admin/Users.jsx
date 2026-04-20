import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';
import { useToast } from '../../../components/ui/ToastProvider';

export default function AdminUsers() {
  const toast = useToast();
  const [pending, setPending] = useState(null);
  const [users, setUsers] = useState(null);

  const load = async () => {
    const [p, u] = await Promise.all([api.get('/admin/ngos/pending'), api.get('/admin/users')]);
    setPending(p.data);
    setUsers(u.data);
  };

  useEffect(() => {
    load().catch(() => {
      setPending([]);
      setUsers([]);
    });
  }, []);

  const approve = async (id) => {
    await api.post(`/admin/ngos/${id}/approve`);
    toast.push({ type: 'success', title: 'Approved', message: 'NGO account approved.' });
    load();
  };

  const reject = async (id) => {
    await api.post(`/admin/ngos/${id}/reject`);
    toast.push({ type: 'warning', title: 'Rejected', message: 'NGO account rejected.' });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Admin</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Users & NGO approvals</h1>
      </div>

      <div className="glass ring-soft rounded-3xl p-6">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Pending NGO approvals</h2>
        <div className="mt-4 space-y-3">
          {pending === null ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">Loading…</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">No pending NGOs.</p>
          ) : (
            pending.map((n) => (
              <div
                key={n._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 dark:text-white truncate">{n.organizationName || n.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{n.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(n._id)}
                    className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(n._id)}
                    className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-rose-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass ring-soft rounded-3xl p-6">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">All users</h2>
        <div className="mt-4 overflow-x-auto">
          {users === null ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">Loading…</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Approved</th>
                  <th className="py-2">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {users.map((u) => (
                  <tr key={u._id} className="text-slate-700 dark:text-slate-200">
                    <td className="py-3 pr-3 font-semibold">{u.name}</td>
                    <td className="py-3 pr-3">{u.email}</td>
                    <td className="py-3 pr-3">{u.role}</td>
                    <td className="py-3 pr-3">{u.role === 'NGO' ? String(Boolean(u.ngoApproved)) : '—'}</td>
                    <td className="py-3">{u.points ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

