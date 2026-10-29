import React, { useMemo } from 'react';
import {
  ShieldCheck,
  Music,
  Compass,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import type { ConcertEvent, TripPlan, StrangerMeet } from '../../types';

export interface ModuleCapacityHealthChartProps {
  concerts?: ConcertEvent[];
  trips?: TripPlan[];
  strangerMeets?: StrangerMeet[];
  assignedModules?: string[];
  formatCurrency?: (val: number) => string;
}

export const ModuleCapacityHealthChart: React.FC<ModuleCapacityHealthChartProps> = ({
  concerts = [],
  trips = [],
  strangerMeets = [],
  assignedModules = ['concerts', 'trips', 'stranger-meets'],
  formatCurrency: customFormatCurrency
}) => {
  const formatCurrency = customFormatCurrency || ((val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  });

  const hasConcerts = assignedModules.includes('concerts');
  const hasTrips = assignedModules.includes('trips');
  const hasMeets = assignedModules.includes('stranger-meets');

  // Real Concerts Data Calculations
  const concertsData = useMemo(() => {
    const totalCap = concerts.reduce((sum, c) => sum + (c.totalCapacity || 0), 0);
    const totalSold = concerts.reduce((sum, c) => sum + (c.ticketsSold || 0), 0);
    const fillPct = totalCap > 0 ? Math.min(100, Math.round((totalSold / totalCap) * 100)) : 0;
    const avgPrice = concerts.length > 0
      ? Math.round(concerts.reduce((sum, c) => sum + (c.minPrice + c.maxPrice) / 2, 0) / concerts.length)
      : 0;
    const artists = concerts.map(c => c.artist || c.title).filter(Boolean).slice(0, 3).join(' • ');

    return {
      totalCap,
      totalSold,
      fillPct,
      avgPrice,
      subtitle: artists || `${concerts.length} Active Events Listed`,
      count: concerts.length
    };
  }, [concerts]);

  // Real Trips Data Calculations
  const tripsData = useMemo(() => {
    const totalCap = trips.reduce((sum, t) => sum + (t.maxTravelers || 0), 0);
    const totalJoined = trips.reduce((sum, t) => sum + (t.joinedTravelers?.length || 0), 0);
    const fillPct = totalCap > 0 ? Math.min(100, Math.round((totalJoined / totalCap) * 100)) : 0;
    const avgBudget = trips.length > 0
      ? Math.round(trips.reduce((sum, t) => sum + (t.estimatedBudget || 0), 0) / trips.length)
      : 0;
    const routes = trips.map(t => `${t.origin} ➔ ${t.destination}`).slice(0, 2).join(' • ');

    return {
      totalCap,
      totalJoined,
      fillPct,
      avgBudget,
      subtitle: routes || `${trips.length} Active Itineraries`,
      count: trips.length
    };
  }, [trips]);

  // Real Stranger Meets Data Calculations
  const meetsData = useMemo(() => {
    const totalCap = strangerMeets.reduce((sum, m) => sum + (m.maxParticipants || 0), 0);
    const totalJoined = strangerMeets.reduce((sum, m) => sum + (m.participants?.length || 0), 0);
    const fillPct = totalCap > 0 ? Math.min(100, Math.round((totalJoined / totalCap) * 100)) : 0;
    const avgPrice = strangerMeets.length > 0
      ? Math.round(strangerMeets.reduce((sum, m) => sum + (m.pricePerPerson || 0), 0) / strangerMeets.length)
      : 0;
    const locations = strangerMeets.map(m => `${m.city} (${m.title})`).slice(0, 2).join(' • ');

    return {
      totalCap,
      totalJoined,
      fillPct,
      avgPrice,
      subtitle: locations || `${strangerMeets.length} Community Sessions`,
      count: strangerMeets.length
    };
  }, [strangerMeets]);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-tight text-slate-900">
                Operational Capacity & Health Metrics
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Realized booking and capacity utilization calculated from active listings.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {/* 1. Concerts Fill Rate */}
        {hasConcerts && (
          <div className="rounded-lg border border-purple-100 bg-purple-50/30 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Music className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Concert Arena Fill Rate</span>
                  <span className="text-[11px] text-slate-500 block truncate max-w-64">
                    {concertsData.subtitle}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-purple-700 text-sm">
                  {concertsData.fillPct}%
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {concertsData.totalSold.toLocaleString()} / {concertsData.totalCap.toLocaleString()} seats
                </span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-purple-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${concertsData.fillPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Avg Ticket Price: <strong className="text-slate-800">{formatCurrency(concertsData.avgPrice)}</strong></span>
              <span className="text-slate-600 font-medium">
                {concertsData.count} live shows scheduled
              </span>
            </div>
          </div>
        )}

        {/* 2. Trips Fill Rate */}
        {hasTrips && (
          <div className="rounded-lg border border-amber-100 bg-amber-50/30 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Compass className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Group Travel Slot Utilization</span>
                  <span className="text-[11px] text-slate-500 block truncate max-w-64">
                    {tripsData.subtitle}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-amber-800 text-sm">
                  {tripsData.fillPct}%
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {tripsData.totalJoined.toLocaleString()} / {tripsData.totalCap.toLocaleString()} traveler slots
                </span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{ width: `${tripsData.fillPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Avg Expedition Budget: <strong className="text-slate-800">{formatCurrency(tripsData.avgBudget)}</strong></span>
              <span className="text-slate-600 font-medium">
                {tripsData.count} active expeditions
              </span>
            </div>
          </div>
        )}

        {/* 3. Stranger Meets Fill Rate */}
        {hasMeets && (
          <div className="rounded-lg border border-teal-100 bg-teal-50/30 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Stranger Meets RSVP Utilization</span>
                  <span className="text-[11px] text-slate-500 block truncate max-w-64">
                    {meetsData.subtitle}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-teal-800 text-sm">
                  {meetsData.fillPct}%
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {meetsData.totalJoined.toLocaleString()} / {meetsData.totalCap.toLocaleString()} buddies
                </span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-teal-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${meetsData.fillPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Avg Pass Price: <strong className="text-slate-800">{formatCurrency(meetsData.avgPrice)}</strong></span>
              <span className="text-slate-600 font-medium">
                {meetsData.count} mixers listed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
