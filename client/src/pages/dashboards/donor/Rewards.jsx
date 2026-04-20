import React, { useEffect, useState } from 'react';
import { Crown, Medal, Sparkles, TicketPercent, Trophy } from 'lucide-react';
import api from '../../../utils/api';
import { getStoredUser, setStoredUser } from '../../../utils/auth';
import { useToast } from '../../../components/ui/ToastProvider';

function BadgePill({ label, active }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold',
        active ? 'bg-primary-600 text-white' : 'bg-black/5 text-slate-700 dark:bg-white/10 dark:text-slate-200',
      ].join(' ')}
    >
      <Medal className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export default function Rewards() {
  const toast = useToast();
  const [me, setMe] = useState(getStoredUser());
  const [leaders, setLeaders] = useState([]);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemForm, setRedeemForm] = useState({ provider: 'Flipkart', points: 100 });
  const [latestVoucher, setLatestVoucher] = useState(null);

  const loadRewards = async () => {
    const [meRes, leaderboardRes] = await Promise.all([api.get('/users/me'), api.get('/users/leaderboard')]);
    setMe(meRes.data);
    setStoredUser(meRes.data);
    setLeaders(leaderboardRes.data);
  };

  useEffect(() => {
    loadRewards().catch(() => {});
  }, []);

  const points = me?.totalPoints ?? me?.points ?? 0;
  const availablePoints = me?.availablePoints ?? points;
  const badge = me?.currentBadge || 'Bronze';

  const redeem = async (event) => {
    event.preventDefault();
    setRedeemLoading(true);
    try {
      if (Number(redeemForm.points) > availablePoints) {
        throw new Error('Not enough points available for this voucher.');
      }

      const response = await api.post('/users/redeem', {
        provider: redeemForm.provider,
        points: Number(redeemForm.points),
      });
      setLatestVoucher(response.data.voucher);
      setMe(response.data.user);
      setStoredUser(response.data.user);
      toast.push({
        type: 'success',
        title: 'Voucher generated',
        message: `${response.data.voucher.code} gives you Rs.${response.data.voucher.discountValue} off on ${response.data.voucher.provider}.`,
        ttl: 5000,
      });
      await loadRewards();
    } catch (error) {
      toast.push({
        type: 'error',
        title: 'Redemption failed',
        message: error.response?.data?.message || error.message || 'Could not generate voucher.',
      });
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Rewards</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Points, badges, and vouchers</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">Redeem your points into mock discount codes for Flipkart and Meesho.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass ring-soft rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Your points</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{points}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Available for vouchers: {availablePoints}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <BadgePill label="Bronze (0-50)" active={points <= 50} />
                <BadgePill label="Silver (51-99)" active={points >= 51 && points <= 99} />
                <BadgePill label="Gold (100+)" active={points >= 100} />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-primary-600/20 via-cyan-500/10 to-emerald-500/15 p-5 text-right">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">Current badge</p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-extrabold text-slate-900 dark:bg-white/10 dark:text-white">
                {badge === 'Gold' ? <Crown className="h-4 w-4 text-amber-500" /> : <Sparkles className="h-4 w-4 text-primary-600" />}
                {badge}
              </div>
            </div>
          </div>

          <form onSubmit={redeem} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Provider</span>
              <select
                value={redeemForm.provider}
                onChange={(event) => setRedeemForm((current) => ({ ...current, provider: event.target.value }))}
                className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
              >
                <option value="Flipkart">Flipkart</option>
                <option value="Meesho">Meesho</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Points to redeem</span>
              <input
                type="number"
                min="100"
                step="100"
                value={redeemForm.points}
                onChange={(event) => setRedeemForm((current) => ({ ...current, points: event.target.value }))}
                className="mt-1 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 dark:border-white/10 dark:bg-white/5"
              />
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={redeemLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-primary-700 disabled:opacity-60"
              >
                <TicketPercent className="h-4 w-4" />
                {redeemLoading ? 'Generating...' : 'Generate Voucher'}
              </button>
            </div>
          </form>

          <div className="mt-4 rounded-2xl border border-black/5 bg-white/60 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            Conversion rule: 100 points = Rs.10 discount. This is a mock checkout integration concept for your platform.
          </div>

          {latestVoucher ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Latest voucher</p>
              <p className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">{latestVoucher.code}</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Apply this code on {latestVoucher.provider} checkout to get Rs.{latestVoucher.discountValue} off.
              </p>
            </div>
          ) : null}
        </div>

        <div className="glass ring-soft rounded-3xl p-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Leaderboard</h2>
          </div>
          <div className="mt-4 space-y-2">
            {leaders.slice(0, 10).map((user, index) => (
              <div
                key={user._id || user.name + index}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
                    #{index + 1} {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-600 dark:text-slate-300">
                    {user.currentBadge || 'Bronze'} donor
                  </p>
                </div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">{user.totalPoints ?? user.points ?? 0}</p>
              </div>
            ))}
            {leaders.length === 0 ? <p className="text-sm text-slate-600 dark:text-slate-300">No leaderboard yet.</p> : null}
          </div>
        </div>
      </div>

      <div className="glass ring-soft rounded-3xl p-6">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Voucher history</p>
        <div className="mt-4 space-y-3">
          {(me?.vouchers || []).length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">No vouchers redeemed yet.</p>
          ) : (
            (me?.vouchers || []).slice().reverse().map((voucher) => (
              <div key={voucher.code} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{voucher.code}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{voucher.provider} - Rs.{voucher.discountValue} off</p>
                </div>
                <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">{voucher.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
