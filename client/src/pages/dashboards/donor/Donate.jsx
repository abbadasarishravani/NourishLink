import React, { useState } from 'react';
import { MapPin, PackagePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../utils/api';
import { useToast } from '../../../components/ui/ToastProvider';
import { getStoredUser, setStoredUser } from '../../../utils/auth';

export default function Donate() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    foodType: '',
    quantity: '',
    unit: 'servings',
    condition: 'Fresh',
    address: '',
    lat: '',
    lng: '',
  });

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const location = form.lat && form.lng ? { lat: Number(form.lat), lng: Number(form.lng) } : undefined;
      const response = await api.post('/donations', {
        foodType: form.foodType,
        quantity: Number(form.quantity),
        unit: form.unit,
        condition: form.condition,
        address: form.address,
        location,
      });

      const currentUser = getStoredUser();
      if (currentUser && response.data?.user) {
        setStoredUser({
          ...currentUser,
          ...response.data.user,
          points: response.data.totalPoints,
          totalPoints: response.data.totalPoints,
        });
      }

      toast.push({
        type: 'success',
        title: 'Donation submitted',
        message: response.data?.pointsMessage || `Wow! Congratulations! You will earn ${response.data?.potentialPoints || 0} points when an NGO accepts this donation!`,
        ttl: 5000,
      });

      setForm({ foodType: '', quantity: '', unit: 'servings', condition: 'Fresh', address: '', lat: '', lng: '' });
    } catch (error) {
      toast.push({ type: 'error', title: 'Failed', message: error.response?.data?.message || 'Could not submit donation.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">New donation</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Submit surplus food</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          Better quantity and quality information helps reward donors more accurately.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass ring-soft rounded-3xl p-6">
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Food type</span>
            <input
              required
              value={form.foodType}
              onChange={(event) => setForm((current) => ({ ...current, foodType: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
              placeholder="e.g., Rice, Bread, Vegetables"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Quantity</span>
            <input
              required
              type="number"
              min="1"
              value={form.quantity}
              onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Food quality</span>
            <select
              value={form.condition}
              onChange={(event) => setForm((current) => ({ ...current, condition: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
            >
              <option value="Fresh">Fresh</option>
              <option value="Good">Good</option>
              <option value="Cooked">Cooked</option>
              <option value="Packed">Packed</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Unit</span>
            <select
              value={form.unit}
              onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
            >
              <option value="servings">servings</option>
              <option value="kg">kg</option>
              <option value="liters">liters</option>
              <option value="boxes">boxes</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pickup address</span>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <MapPin className="h-4 w-4 text-slate-500" />
              <input
                required
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Street, city"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Latitude (optional)</span>
            <input
              value={form.lat}
              onChange={(event) => setForm((current) => ({ ...current, lat: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
              placeholder="e.g. 19.0760"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Longitude (optional)</span>
            <input
              value={form.lng}
              onChange={(event) => setForm((current) => ({ ...current, lng: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
              placeholder="e.g. 72.8777"
            />
          </label>

          <div className="flex items-center justify-end gap-3 pt-2 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm shadow-primary-600/25 hover:bg-primary-700 disabled:opacity-60"
            >
              <PackagePlus className="h-4 w-4" />
              {loading ? 'Submitting...' : 'Submit donation'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
