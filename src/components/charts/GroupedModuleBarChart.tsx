import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  Music,
  Compass,
  Sparkles,
  MapPin,
  Ticket,
  Users,
  Percent
} from 'lucide-react';
import type { ConcertEvent, TripPlan, StrangerMeet } from '../../types';

export type ModuleCategory = 'all' | 'concerts' | 'trips' | 'stranger-meets';

export interface GroupedModuleBarChartProps {
  concerts?: ConcertEvent[];
  trips?: TripPlan[];
  strangerMeets?: StrangerMeet[];
  assignedModules?: string[];
  timeframe?: string;
  onTimeframeChange?: (tf: any) => void;
  formatCurrency?: (val: number) => string;
}

export const GroupedModuleBarChart: React.FC<GroupedModuleBarChartProps> = ({
  concerts = [],
  trips = [],
  strangerMeets = [],
  assignedModules = ['concerts', 'trips', 'stranger-meets'],
  formatCurrency: customFormatCurrency
}) => {
  const [categoryFilter, setCategoryFilter] = useState<ModuleCategory>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(false);
    const timer = setTimeout(() => setIsMounted(true), 60);
    return () => clearTimeout(timer);
  }, [categoryFilter]);

  const formatCurrency = customFormatCurrency || ((val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  });

  const hasConcerts = assignedModules.includes('concerts');
  const hasTrips = assignedModules.includes('trips');
  const hasMeets = assignedModules.includes('stranger-meets');

  // Derive all active offerings strictly from real data props
  const realOfferings = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      module: 'concerts' | 'trips' | 'stranger-meets';
      moduleLabel: string;
      capacity: number;
      filled: number;
      fillPct: number;
      revenue: number;
      unit: string;
      color: string;
      gradId: string;
    }> = [];

    // Real Concerts
    if (hasConcerts) {
      concerts.forEach((c) => {
        const capacity = c.totalCapacity || 1;
        const filled = c.ticketsSold || 0;
        const fillPct = Math.min(100, Math.round((filled / capacity) * 100));
        const avgPrice = (c.minPrice + c.maxPrice) / 2;
        const revenue = filled * avgPrice;

        list.push({
          id: c.id,
          title: c.title,
          subtitle: `${c.artist || 'Headliner'} • ${c.city || (c as any).venue || c.venueName || 'Venue'}`,
          module: 'concerts',
          moduleLabel: 'Concert',
          capacity,
          filled,
          fillPct,
          revenue,
          unit: 'tickets',
          color: '#8B5CF6',
          gradId: 'url(#barGradConcert)'
        });
      });
    }

    // Real Trips
    if (hasTrips) {
      trips.forEach((t) => {
        const capacity = t.maxTravelers || 1;
        const filled = t.joinedTravelers?.length || 0;
        const fillPct = Math.min(100, Math.round((filled / capacity) * 100));
        const revenue = filled * (t.estimatedBudget || 0);

        list.push({
          id: t.id,
          title: t.title,
          subtitle: `${t.origin} ➔ ${t.destination}`,
          module: 'trips',
          moduleLabel: 'Trip',
          capacity,
          filled,
          fillPct,
          revenue,
          unit: 'travelers',
          color: '#F59E0B',
          gradId: 'url(#barGradTrip)'
        });
      });
    }

    // Real Stranger Meets
    if (hasMeets) {
      strangerMeets.forEach((m) => {
        const capacity = m.maxParticipants || 1;
        const filled = m.participants?.length || 0;
        const fillPct = Math.min(100, Math.round((filled / capacity) * 100));
        const revenue = filled * (m.pricePerPerson || 0);

        list.push({
          id: m.id,
          title: m.title,
          subtitle: `${m.city} • ${m.meetingPoint}`,
          module: 'stranger-meets',
          moduleLabel: 'Meet',
          capacity,
          filled,
          fillPct,
          revenue,
          unit: 'buddies',
          color: '#10B981',
          gradId: 'url(#barGradMeet)'
        });
      });
    }

    return list;
  }, [concerts, trips, strangerMeets, hasConcerts, hasTrips, hasMeets]);

  // Filtered by selected category
  const filteredList = useMemo(() => {
    if (categoryFilter === 'all') return realOfferings;
    return realOfferings.filter((o) => o.module === categoryFilter);
  }, [realOfferings, categoryFilter]);

  // Overall average fill rate calculated from real data
  const averageFillRate = useMemo(() => {
    if (filteredList.length === 0) return 0;
    const sum = filteredList.reduce((acc, o) => acc + o.fillPct, 0);
    return Math.round(sum / filteredList.length);
  }, [filteredList]);

  // Category counts
  const counts = useMemo(() => {
    return {
      all: realOfferings.length,
      concerts: realOfferings.filter((o) => o.module === 'concerts').length,
      trips: realOfferings.filter((o) => o.module === 'trips').length,
      meets: realOfferings.filter((o) => o.module === 'stranger-meets').length
    };
  }, [realOfferings]);

  // SVG Column Chart Geometry
  const chartWidth = 860;
  const chartHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 28;
  const paddingBottom = 25;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const activeItem = hoveredId ? filteredList.find((o) => o.id === hoveredId) : null;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                Live Program Inventory & Capacity Fill
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time occupancy fill percentage for each active event, trip, and mixer.
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic Average Fill Rate Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${categoryFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              All Offerings ({counts.all})
            </button>

            {hasConcerts && counts.concerts > 0 && (
              <button
                type="button"
                onClick={() => setCategoryFilter('concerts')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${categoryFilter === 'concerts'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                  }`}
              >
                <span className="h-2 w-2 rounded-full bg-purple-600" />
                <span>Concerts ({counts.concerts})</span>
              </button>
            )}

            {hasTrips && counts.trips > 0 && (
              <button
                type="button"
                onClick={() => setCategoryFilter('trips')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${categoryFilter === 'trips'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Trips ({counts.trips})</span>
              </button>
            )}

            {hasMeets && counts.meets > 0 && (
              <button
                type="button"
                onClick={() => setCategoryFilter('stranger-meets')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${categoryFilter === 'stranger-meets'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                  }`}
              >
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                <span>Meets ({counts.meets})</span>
              </button>
            )}
          </div>
        </div>
      </div>



      {/* SVG Vertical Column Chart */}
      <div className="relative w-full overflow-hidden pt-1">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredId(null)}
        >
          <defs>
            <linearGradient id="barGradConcert" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="barGradTrip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="barGradMeet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Gridlines for 0%, 25%, 50%, 75%, 100% */}
          {[100, 75, 50, 25, 0].map((pct, i) => {
            const y = paddingTop + innerHeight - (pct / 100) * innerHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeDasharray={pct === 0 ? undefined : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94A3B8"
                  fontWeight="500"
                  fontFamily="Inter, sans-serif"
                >
                  {pct}%
                </text>
              </g>
            );
          })}

          {/* Columns for each real offering */}
          {filteredList.map((item, i) => {
            const isHovered = hoveredId === item.id;
            const slotWidth = innerWidth / filteredList.length;
            const barWidth = Math.min(42, slotWidth * 0.55);
            const cx = paddingLeft + (i + 0.5) * slotWidth;
            const bx = cx - barWidth / 2;

            const targetBarHeight = Math.max(6, (item.fillPct / 100) * innerHeight);
            const barHeight = isMounted ? targetBarHeight : 0;
            const by = isMounted ? (paddingTop + innerHeight - targetBarHeight) : (paddingTop + innerHeight);

            // Short title for X axis
            const shortLabel = item.title.length > 14 ? `${item.title.slice(0, 12)}…` : item.title;

            return (
              <g key={item.id}>
                {/* Background Track Pill */}
                <rect
                  x={bx - 3}
                  y={paddingTop}
                  width={barWidth + 6}
                  height={innerHeight}
                  rx="6"
                  fill={isHovered ? '#F1F5F9' : '#F8FAFC'}
                  className="transition-colors duration-150"
                />

                {/* Fill Bar - Animated from bottom */}
                <rect
                  x={bx}
                  y={by}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill={item.gradId}
                  opacity={isHovered ? 1 : 0.9}
                  className="transition-all duration-700 ease-out"
                />

                {/* High-Contrast Percentage Badge on Top of Bar */}
                <g
                  className="transition-all duration-700 ease-out pointer-events-none"
                  opacity={isMounted ? 1 : 0}
                >
                  {/* Backdrop pill preventing color merge against background or bar */}
                  <rect
                    x={cx - (item.fillPct === 100 ? 17 : 14)}
                    y={by - 18}
                    width={item.fillPct === 100 ? 34 : 28}
                    height={14}
                    rx="4"
                    fill={isHovered ? '#0F172A' : '#FFFFFF'}
                    stroke={isHovered ? '#0F172A' : '#CBD5E1'}
                    strokeWidth="1"
                    className="transition-colors duration-150"
                  />
                  <text
                    x={cx}
                    y={by - 8}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isHovered ? '#FFFFFF' : '#0F172A'}
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                    className="transition-colors duration-150"
                  >
                    {isMounted ? `${item.fillPct}%` : '0%'}
                  </text>
                </g>

                {/* Hitbox */}
                <rect
                  x={cx - slotWidth / 2}
                  y={paddingTop}
                  width={slotWidth}
                  height={innerHeight + paddingBottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredId(item.id)}
                />

                {/* X-Axis Label */}
                {/* <text
                  x={cx}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill={isHovered ? '#0F172A' : '#64748B'}
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="Inter, sans-serif"
                >
                  {shortLabel}
                </text> */}
              </g>
            );
          })}
        </svg>

        {/* Lightweight Popover Tooltip */}
        {activeItem && (
          <div
            className="absolute z-20 pointer-events-none rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3 shadow-lg text-xs space-y-1.5 min-w-52"
            style={{
              left: `${Math.min(
                Math.max(
                  ((filteredList.findIndex((o) => o.id === activeItem.id) + 0.5) / filteredList.length) * 100,
                  18
                ),
                82
              )}%`,
              top: '12px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <span className="font-semibold text-slate-900 truncate max-w-36">{activeItem.title}</span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.2 rounded"
                style={{ backgroundColor: `${activeItem.color}20`, color: activeItem.color }}
              >
                {activeItem.moduleLabel}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">{activeItem.subtitle}</p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500">Occupancy:</span>
              <span className="font-semibold text-slate-900">
                {activeItem.filled.toLocaleString()} / {activeItem.capacity.toLocaleString()} {activeItem.unit} ({activeItem.fillPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Gross Sales:</span>
              <span className="font-semibold text-indigo-700">{formatCurrency(activeItem.revenue)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
