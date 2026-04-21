import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { UserPlus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { setAuth } from '../../utils/auth';
import { useToast } from '../../components/ui/ToastProvider';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: 'Donor', phone: '', organizationName: '', address: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      setAuth({ token: res.data.token, user: res.data });
      toast.push({ type: 'success', title: 'Account created', message: 'Welcome to Nourish Link.' });
      navigate(`/dashboard/${res.data.role.toLowerCase()}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[70vh] grid-cols-1 overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/10 lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/25 via-cyan-500/15 to-emerald-500/20" />
        <div className="absolute inset-0 pattern-grid opacity-[0.35]" />
        <div className="relative h-full p-10 flex flex-col justify-between">
          <div className="glass ring-soft rounded-3xl p-6">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-200">
              <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              Start making impact
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Join as a donor or NGO volunteer.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-200">
              Donors earn points and badges. NGOs get map-based pickups and route planning.
            </p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-200">
            By creating an account you agree to use Nourish Link responsibly.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-10 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="glass ring-soft rounded-3xl p-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary-600/10 text-primary-700 dark:text-primary-400">
                <UserPlus className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Create your account</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-200">
                Already have one?{' '}
                <Link to="/login" className="font-semibold text-primary-700 hover:underline dark:text-primary-400">
                  Sign in
                </Link>
              </p>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-700 dark:text-rose-300">
                {error}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Donor' })}
                  className={[
                    'rounded-2xl px-3 py-2 text-sm font-extrabold border transition',
                    formData.role === 'Donor'
                      ? 'border-primary-500 bg-primary-600/10 text-primary-800 dark:text-primary-200'
                      : 'border-black/10 bg-white/50 text-slate-600 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
                  ].join(' ')}
                >
                  Donor
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'NGO' })}
                  className={[
                    'rounded-2xl px-3 py-2 text-sm font-extrabold border transition',
                    formData.role === 'NGO'
                      ? 'border-primary-500 bg-primary-600/10 text-primary-800 dark:text-primary-200'
                      : 'border-black/10 bg-white/50 text-slate-600 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
                  ].join(' ')}
                >
                  NGO / Volunteer
                </button>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                  {formData.role === 'NGO' ? 'Representative name' : 'Full name'}
                </span>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </label>

              {formData.role === 'NGO' ? (
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">Organization name</span>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">Email</span>
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">Password</span>
                <input
                  type="password"
                  required
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">Phone (for SMS updates)</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm shadow-primary-600/25 hover:bg-primary-700 disabled:opacity-60"
              >
                {loading ? 'Creating…' : 'Create account'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
