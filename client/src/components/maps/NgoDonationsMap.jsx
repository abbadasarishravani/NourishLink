import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../utils/api';
import { useToast } from '../ui/ToastProvider';

// Fix Leaflet default icon paths (Vite + React)
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker1x from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker1x,
  shadowUrl: markerShadow,
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export default function NgoDonationsMap({ className }) {
  const toast = useToast();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr('');
        // NGO: view pending donations (markers)
        const res = await api.get('/donations?status=Pending');
        if (!alive) return;
        setDonations(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!alive) return;
        setErr(e.response?.data?.message || 'Failed to load donations.');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const points = useMemo(() => {
    return donations
      .map((d) => ({
        id: d._id,
        foodType: d.foodType,
        quantity: d.quantity,
        unit: d.unit,
        status: d.status,
        donorName: d.donor?.name,
        lat: d.latitude ?? d.location?.lat,
        lng: d.longitude ?? d.location?.lng,
      }))
      .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number');
  }, [donations]);

  const accept = async (id) => {
    try {
      await api.put(`/donations/${id}`, { status: 'Accepted' });
      toast.push({ type: 'success', title: 'Accepted', message: 'Donation accepted successfully.' });
      setDonations((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      toast.push({ type: 'error', title: 'Failed', message: e.response?.data?.message || 'Could not accept donation.' });
    }
  };

  const defaultCenter = useMemo(() => [19.076, 72.8777], []);

  return (
    <div className={className}>
      {err ? (
        <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-700 dark:text-rose-300">
          {err}
        </div>
      ) : null}

      <div className="relative h-full w-full">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom
          className="h-full w-full"
          style={{ background: 'transparent' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds points={points} />

          {points.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{p.foodType || 'Donation'}</div>
                  <div className="text-sm">
                    {p.quantity} {p.unit || ''}
                  </div>
                  <div className="text-sm">Donor: {p.donorName || '—'}</div>
                  <div className="text-xs opacity-80">Status: {p.status}</div>
                  <button
                    onClick={() => accept(p.id)}
                    className="mt-2 w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-bold text-white"
                  >
                    Accept donation
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {loading ? (
          <div className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-black/5 px-3 py-1 text-xs font-extrabold text-slate-700 dark:bg-white/10 dark:text-slate-200">
            Loading donations…
          </div>
        ) : null}

        {!loading && points.length === 0 ? (
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              No donation locations to show.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

