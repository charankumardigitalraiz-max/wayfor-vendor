import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  Music,
  Compass,
  Sparkles,
  Layers
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
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!circleRef.current) return;
    const rect = circleRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

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

  // Concentric Radial Activity Rings configuration for each assigned module
  const rings = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      fillPct: number;
      color: string;
      trackColor: string;
    }> = [];

    if (hasConcerts) {
      list.push({
        id: 'concerts',
        name: 'Concert Arenas',
        fillPct: concertsData.fillPct,
        color: '#8B5CF6',
        trackColor: '#EDE9FE'
      });
    }
    if (hasTrips) {
      list.push({
        id: 'trips',
        name: 'Group Travel',
        fillPct: tripsData.fillPct,
        color: '#F59E0B',
        trackColor: '#FEF3C7'
      });
    }
    if (hasMeets) {
      list.push({
        id: 'stranger-meets',
        name: 'Stranger Meets',
        fillPct: meetsData.fillPct,
        color: '#10B981',
        trackColor: '#D1FAE5'
      });
    }

    const baseRadii = [82, 66, 50];
    return list.map((item, idx) => {
      const radius = baseRadii[idx] || (50 - idx * 14);
      const circumference = 2 * Math.PI * radius;
      return {
        ...item,
        radius,
        circumference
      };
    });
  }, [hasConcerts, hasTrips, hasMeets, concertsData.fillPct, tripsData.fillPct, meetsData.fillPct]);

  const overallAvgFill = useMemo(() => {
    if (rings.length === 0) return 0;
    const sum = rings.reduce((acc, r) => acc + r.fillPct, 0);
    return Math.round(sum / rings.length);
  }, [rings]);

  const activeRing = hoveredModule ? rings.find(r => r.id === hoveredModule) : null;

  // Active ring full metrics for the floating tooltip
  const activeRingDetails = useMemo(() => {
    if (!hoveredModule) return null;
    if (hoveredModule === 'concerts' && hasConcerts) {
      return {
        id: 'concerts',
        name: 'Concert Arenas',
        color: '#8B5CF6',
        fillPct: concertsData.fillPct,
        booked: concertsData.totalSold,
        capacity: concertsData.totalCap,
        unit: 'seats',
        count: concertsData.count,
        avgPrice: concertsData.avgPrice
      };
    }
    if (hoveredModule === 'trips' && hasTrips) {
      return {
        id: 'trips',
        name: 'Group Travel',
        color: '#F59E0B',
        fillPct: tripsData.fillPct,
        booked: tripsData.totalJoined,
        capacity: tripsData.totalCap,
        unit: 'travelers',
        count: tripsData.count,
        avgPrice: tripsData.avgBudget
      };
    }
    if (hoveredModule === 'stranger-meets' && hasMeets) {
      return {
        id: 'stranger-meets',
        name: 'Stranger Meets',
        color: '#10B981',
        fillPct: meetsData.fillPct,
        booked: meetsData.totalJoined,
        capacity: meetsData.totalCap,
        unit: 'buddies',
        count: meetsData.count,
        avgPrice: meetsData.avgPrice
      };
    }
    return null;
  }, [hoveredModule, hasConcerts, hasTrips, hasMeets, concertsData, tripsData, meetsData]);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-slate-900">
              Cross-Vertical Capacity & Booking Health
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Realized booking and capacity utilization calculated from active listings.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 pt-1 min-w-0">
        {/* SVG Concentric Multi-Ring Activity Gauge */}
        <div
          ref={circleRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredModule(null);
            setMousePos(null);
          }}
          className="relative shrink-0 w-44 h-44"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full select-none overflow-visible">
            {rings.map((ring) => {
              const isHovered = hoveredModule === ring.id;
              const strokeWidth = isHovered ? 11 : 9;
              const dashOffset = isMounted
                ? ring.circumference - (ring.fillPct / 100) * ring.circumference
                : ring.circumference;

              return (
                <g
                  key={ring.id}
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    setHoveredModule(ring.id);
                    handleMouseMove(e);
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => {
                    setHoveredModule(null);
                    setMousePos(null);
                  }}
                >
                  {/* Background Track Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r={ring.radius}
                    fill="none"
                    stroke={ring.trackColor}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-200"
                  />

                  {/* Animated Fill Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r={ring.radius}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={ring.circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                    style={{
                      transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.2s ease',
                      filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' : 'none'
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Callout Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[110px]">
              {activeRing ? activeRing.name : 'AVG FILL'}
            </span>
            <span className="text-xl font-extrabold text-slate-900 leading-tight">
              {activeRing ? `${activeRing.fillPct}%` : `${overallAvgFill}%`}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600">
              Occupancy
            </span>
          </div>

          {/* Floating Tooltip for Circle Ring Hover */}
          {activeRingDetails && mousePos && (
            <div
              className="absolute z-30 pointer-events-none rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 min-w-48 transition-transform duration-75"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                transform: `translate(${mousePos.x > 88 ? '-90%' : '10%'}, ${mousePos.y > 88 ? '-110%' : '15px'})`
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: activeRingDetails.color }}
                  />
                  <span className="font-bold text-slate-900 truncate">
                    {activeRingDetails.name}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0"
                  style={{
                    backgroundColor: `${activeRingDetails.color}15`,
                    color: activeRingDetails.color,
                    borderColor: `${activeRingDetails.color}30`
                  }}
                >
                  {activeRingDetails.fillPct}%
                </span>
              </div>

              <div className="space-y-1 pt-0.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Utilization:</span>
                  <span className="font-bold text-slate-900">
                    {activeRingDetails.booked.toLocaleString()} / {activeRingDetails.capacity.toLocaleString()} {activeRingDetails.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Scheduled:</span>
                  <span className="font-semibold text-slate-800">
                    {activeRingDetails.count} listings
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-1">
                  <span className="text-slate-500">Avg Value:</span>
                  <span className="font-bold text-purple-700">
                    {formatCurrency(activeRingDetails.avgPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Multi-Module Detail Cards */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* 1. Concerts Module */}
          {hasConcerts && (
            <div
              onMouseEnter={() => setHoveredModule('concerts')}
              onMouseLeave={() => setHoveredModule(null)}
              className={`rounded-lg border p-3 transition-all cursor-pointer space-y-2 min-w-0 overflow-hidden ${hoveredModule === 'concerts'
                ? 'border-purple-300 bg-purple-50/60 shadow-xs'
                : 'border-slate-200/80 bg-slate-50/50 hover:bg-white'
                }`}
            >
              <div className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-6 w-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Music className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 block truncate">Concert Arena Fill Rate</span>
                    <span className="text-[10.5px] text-slate-500 block truncate">
                      {concertsData.subtitle}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-purple-700 text-sm block">
                    {concertsData.fillPct}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {concertsData.totalSold.toLocaleString()} / {concertsData.totalCap.toLocaleString()} seats
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-purple-100 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-700 max-w-full"
                  style={{ width: `${Math.min(100, Math.max(0, concertsData.fillPct))}%` }}
                />
              </div>
            </div>
          )}

          {/* 2. Trips Module */}
          {hasTrips && (
            <div
              onMouseEnter={() => setHoveredModule('trips')}
              onMouseLeave={() => setHoveredModule(null)}
              className={`rounded-lg border p-3 transition-all cursor-pointer space-y-2 min-w-0 overflow-hidden ${hoveredModule === 'trips'
                ? 'border-amber-300 bg-amber-50/60 shadow-xs'
                : 'border-slate-200/80 bg-slate-50/50 hover:bg-white'
                }`}
            >
              <div className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-6 w-6 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Compass className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 block truncate">Group Travel Slot Utilization</span>
                    <span className="text-[10.5px] text-slate-500 block truncate">
                      {tripsData.subtitle}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-amber-800 text-sm block">
                    {tripsData.fillPct}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {tripsData.totalJoined.toLocaleString()} / {tripsData.totalCap.toLocaleString()} travelers
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-amber-100 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700 max-w-full"
                  style={{ width: `${Math.min(100, Math.max(0, tripsData.fillPct))}%` }}
                />
              </div>
            </div>
          )}

          {/* 3. Stranger Meets Module */}
          {hasMeets && (
            <div
              onMouseEnter={() => setHoveredModule('stranger-meets')}
              onMouseLeave={() => setHoveredModule(null)}
              className={`rounded-lg border p-3 transition-all cursor-pointer space-y-2 min-w-0 overflow-hidden ${hoveredModule === 'stranger-meets'
                ? 'border-teal-300 bg-teal-50/60 shadow-xs'
                : 'border-slate-200/80 bg-slate-50/50 hover:bg-white'
                }`}
            >
              <div className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-6 w-6 rounded bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 block truncate">Stranger Meets RSVP Utilization</span>
                    <span className="text-[10.5px] text-slate-500 block truncate">
                      {meetsData.subtitle}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-teal-800 text-sm block">
                    {meetsData.fillPct}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {meetsData.totalJoined.toLocaleString()} / {meetsData.totalCap.toLocaleString()} buddies
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-teal-100 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-700 max-w-full"
                  style={{ width: `${Math.min(100, Math.max(0, meetsData.fillPct))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
