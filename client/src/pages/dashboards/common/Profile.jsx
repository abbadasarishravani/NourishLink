import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mail, Phone, ShieldCheck, Trophy, User } from 'lucide-react';
import api from '../../../utils/api';
import { getStoredUser, setStoredUser } from '../../../utils/auth';
import { useToast } from '../../../components/ui/ToastProvider';
import { resolveMediaUrl } from '../../../utils/media';

export default function Profile() {
  const toast = useToast();
  const [me, setMe] = useState(getStoredUser());
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const fileInputRef = useRef(null);

  const syncProfile = (user) => {
    setMe(user);
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setStoredUser(user);
  };

  useEffect(() => {
    api.get('/users/me').then((response) => syncProfile(response.data)).catch(() => {});
  }, []);

  const submitProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.put('/users/update', form);
      syncProfile(response.data);
      setEditing(false);
      toast.push({ type: 'success', title: 'Profile updated', message: 'Your details were saved successfully.' });
    } catch (error) {
      toast.push({ type: 'error', title: 'Update failed', message: error.response?.data?.message || 'Could not save profile.' });
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePic', file);

      const response = await api.post('/upload/profile-pic', formData);

      // Force image refresh by adding timestamp
      const updatedUser = {
        ...response.data.user,
        profilePic: response.data.user?.profilePic ? `${response.data.user.profilePic}?t=${Date.now()}` : response.data.user.profilePic
      };
      
      syncProfile(updatedUser);
      toast.push({ type: 'success', title: 'Photo updated', message: 'Your profile photo was uploaded.' });
    } catch (error) {
      toast.push({ type: 'error', title: 'Upload failed', message: error.response?.data?.message || 'Could not upload image.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const initials = (me?.name || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const totalPoints = me?.totalPoints ?? me?.points ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Profile</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Account details</h1>
      </div>

      {/* WhatsApp-style profile header */}
      <div className="glass ring-soft rounded-3xl p-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-end gap-6 mb-6">
          {/* Profile Photo - WhatsApp Style */}
          <div className="relative group flex-shrink-0">
            {me?.profilePic || me?.profileImage ? (
              <img 
                src={resolveMediaUrl(me?.profilePic || me?.profileImage)} 
                alt={me.name} 
                className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-lg ring-2 ring-primary-600/30"
              />
            ) : (
              <div className="grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white border-4 border-white dark:border-slate-900 shadow-lg ring-2 ring-primary-600/30">
                <span className="text-4xl font-extrabold">{initials || <User className="h-12 w-12" />}</span>
              </div>
            )}

            {/* Camera button positioned like WhatsApp */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-2 right-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60 shadow-md border-4 border-white dark:border-slate-900 transition-all hover:scale-110"
              aria-label="Upload profile image"
            >
              <Camera className="h-5 w-5" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadImage}
            />
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{me?.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{me?.role}</p>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-2">
              ⭐ {totalPoints} points{me?.role === 'Donor' ? ` • ${me?.currentBadge || 'Bronze'} badge` : ''}
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-black/10 dark:border-white/10 mb-6" />

        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1"></div>

          <button
            type="button"
            onClick={() => {
              setEditing((current) => !current);
              setForm({
                name: me?.name || '',
                email: me?.email || '',
                phone: me?.phone || '',
              });
            }}
            className="rounded-2xl bg-primary-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-primary-700"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>

          {me?.role === 'NGO' ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-extrabold dark:bg-white/10">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {me?.ngoApproved ? 'Verified NGO' : 'Pending approval'}
            </div>
          ) : null}
        </div>

        {editing ? (
          <form onSubmit={submitProfile} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
              />
            </label>

            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</span>
              <input
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
              />
            </label>

            <div className="flex justify-end md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</p>
              <p className="mt-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Mail className="h-4 w-4 text-slate-500" />
                {me?.email}
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</p>
              <p className="mt-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Phone className="h-4 w-4 text-slate-500" />
                {me?.phone || '-'}
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rewards</p>
              <p className="mt-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Trophy className="h-4 w-4 text-slate-500" />
                {totalPoints} points{me?.role === 'Donor' ? ` - ${me?.currentBadge || 'Bronze'}` : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
