import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Music,
  Ticket,
  TrendingUp,
  Sparkles,
  MapPin,
  Layers,
  BarChart3,
  Flame,
  CheckCircle2
} from 'lucide-react';
import type { ConcertEvent } from '../../types';

export interface ConcertTourOrbitChartProps {
  concerts: ConcertEvent[];
  formatCurrency?: (val: number) => string;
  className?: string;
}

export const ConcertTourOrbitChart: React.FC<ConcertTourOrbitChartProps> = ({
  concerts = [],
  formatCurrency: customFormatCurrency,
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'orbit' | 'capacity'>('orbit');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const formatCurrency = customFormatCurrency || ((val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  });

  const formatK = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
    return `${num.toLocaleString()}`;
  };

  // Top 5 concerts sorted by tickets sold
  const topConcerts = useMemo(() => {
    return [...concerts]
      .sort((a, b) => (b.ticketsSold || 0) - (a.ticketsSold || 0))
      .slice(0, 5);
  }, [concerts]);

  const maxTickets = useMemo(() => {
    return Math.max(...topConcerts.map((c) => c.ticketsSold || 0), 1000);
  }, [topConcerts]);

  const totalSold = useMemo(() => {
    return topConcerts.reduce((acc, c) => acc + (c.ticketsSold || 0), 0);
  }, [topConcerts]);

  // Color theme per tour rank
  const tourColors = [
    { stroke: '#7C3AED', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: ['#7C3AED', '#A855F7'] },
    { stroke: '#6366F1', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', gradient: ['#6366F1', '#818CF8'] },
    { stroke: '#06B6D4', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', gradient: ['#06B6D4', '#22D3EE'] },
    { stroke: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: ['#F59E0B', '#FBBF24'] },
    { stroke: '#EC4899', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', gradient: ['#EC4899', '#F472B6'] }
  ];

  // SVG Geometry for Radial Orbit
  const svgSize = 250;
  const center = svgSize / 2;
  const strokeWidth = 11;
  const gap = 6;
  const baseRadius = 38;

  const activeConcert = hoveredId ? topConcerts.find((c) => c.id === hoveredId) : null;
  const activeIndex = activeConcert ? topConcerts.findIndex((c) => c.id === activeConcert.id) : -1;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredId(null);
        setMousePos(null);
      }}
      className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between relative transition-all duration-200 ${className}`}
    >
      {/* Floating Interactive Tooltip */}
      {activeConcert && mousePos && (
        <div
          className="absolute z-30 pointer-events-none rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 min-w-56 transition-transform duration-75"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: `translate(${
              mousePos.x < 140
                ? '12px'
                : containerRef.current && mousePos.x > containerRef.current.clientWidth - 140
                ? 'calc(-100% - 12px)'
                : '-50%'
            }, ${mousePos.y < 120 ? '16px' : 'calc(-100% - 14px)'})`
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: tourColors[activeIndex % tourColors.length].stroke }}
              />
              <span className="font-semibold text-slate-900 truncate">
                {activeConcert.artist}
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-purple-50 text-purple-700">
              #{activeIndex + 1}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium truncate">
            {activeConcert.title}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
            <div>
              <div className="text-slate-400 text-[10px]">Confirmed Tickets</div>
              <div className="font-bold text-slate-800">
                {activeConcert.ticketsSold.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Arena Occupancy</div>
              <div className="font-bold text-emerald-600">
                {activeConcert.totalCapacity
                  ? `${Math.round((activeConcert.ticketsSold / activeConcert.totalCapacity) * 100)}%`
                  : 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
            <span className="truncate">{activeConcert.venueName || activeConcert.city}</span>
            <span className="font-semibold text-slate-700 shrink-0">
              {formatCurrency(
                activeConcert.ticketsSold *
                  ((activeConcert.minPrice + activeConcert.maxPrice) / 2 || 2500)
              )}
            </span>
          </div>
        </div>
      )}

      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Top Concert Tours by Admissions
            </h3>
            <p className="text-[11px] text-slate-400">
              Real-time ticket volume and arena capacity performance
            </p>
          </div>
        </div>

        {/* View Switcher: Orbit Rings vs Capacity Matrix */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('orbit')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              viewMode === 'orbit'
                ? 'bg-white text-purple-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Concentric Radial Orbit View"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            Orbit
          </button>
          <button
            type="button"
            onClick={() => setViewMode('capacity')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              viewMode === 'capacity'
                ? 'bg-white text-purple-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Arena Capacity Ranking Matrix"
          >
            <BarChart3 className="w-3 h-3 text-indigo-600" />
            Capacity
          </button>
        </div>
      </div>

      {/* Main Visual Content */}
      {viewMode === 'orbit' ? (
        /* Orbit Rings View */
        <div className="py-2 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Radial Concentric Rings SVG */}
          <div className="sm:col-span-6 flex justify-center items-center relative py-1">
            <svg
              width={svgSize}
              height={svgSize}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className="transform -rotate-90 overflow-visible"
            >
              <defs>
                {tourColors.map((tc, idx) => (
                  <linearGradient
                    key={idx}
                    id={`orbitGrad-${idx}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={tc.gradient[0]} />
                    <stop offset="100%" stopColor={tc.gradient[1]} />
                  </linearGradient>
                ))}
              </defs>

              {topConcerts.map((c, idx) => {
                const radius = baseRadius + idx * (strokeWidth + gap);
                const circumference = 2 * Math.PI * radius;
                const fillRatio = Math.min(1, Math.max(0.12, c.ticketsSold / maxTickets));
                const targetOffset = circumference * (1 - fillRatio);
                const isHovered = hoveredId === c.id;
                const isAnyHovered = hoveredId !== null;
                const opacity = !isAnyHovered ? 1 : isHovered ? 1 : 0.35;

                return (
                  <g key={c.id} className="cursor-pointer">
                    {/* Background Track Ring */}
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke="#F1F5F9"
                      strokeWidth={strokeWidth}
                    />

                    {/* Animated Data Arc */}
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke={`url(#orbitGrad-${idx})`}
                      strokeWidth={isHovered ? strokeWidth + 2.5 : strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={mounted ? targetOffset : circumference}
                      opacity={opacity}
                      onMouseEnter={() => setHoveredId(c.id)}
                      className="transition-all duration-700 ease-out"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Central Info Hub */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
              {activeConcert ? (
                <div className="animate-in fade-in zoom-in-95 duration-150 space-y-0.5 max-w-[130px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                    #{activeIndex + 1} Tour
                  </span>
                  <div className="text-base font-bold text-slate-900 leading-tight truncate">
                    {formatK(activeConcert.ticketsSold)}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700 truncate">
                    {activeConcert.artist}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    {activeConcert.venueName || activeConcert.city}
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5 max-w-[130px]">
                  <div className="w-7 h-7 mx-auto rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                    {formatK(totalSold)}
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">
                    Total Top 5 Tickets
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ranked Tour Legend List */}
          <div className="sm:col-span-6 space-y-1.5">
            {topConcerts.map((c, idx) => {
              const tc = tourColors[idx % tourColors.length];
              const isHovered = hoveredId === c.id;
              const isAnyHovered = hoveredId !== null;
              const fillPct = c.totalCapacity
                ? Math.round((c.ticketsSold / c.totalCapacity) * 100)
                : 85;

              return (
                <div
                  key={c.id}
                  onMouseEnter={() => setHoveredId(c.id)}
                  className={`p-2 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 ${
                    isHovered
                      ? 'bg-purple-50/60 border-purple-200 shadow-2xs translate-x-1'
                      : isAnyHovered
                      ? 'bg-white/60 border-slate-100 opacity-50'
                      : 'bg-slate-50/60 border-slate-100 hover:bg-slate-100/70 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tc.stroke }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {c.artist}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {c.venueName || c.city}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900">
                      {formatK(c.ticketsSold)}
                    </div>
                    <div className="text-[10px] font-medium text-emerald-600">
                      {fillPct}% fill
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Capacity Matrix View (Bullet Gauges) */
        <div className="py-2.5 space-y-2.5">
          {topConcerts.map((c, idx) => {
            const tc = tourColors[idx % tourColors.length];
            const isHovered = hoveredId === c.id;
            const fillPct = c.totalCapacity
              ? Math.min(100, Math.round((c.ticketsSold / c.totalCapacity) * 100))
              : 85;

            return (
              <div
                key={c.id}
                onMouseEnter={() => setHoveredId(c.id)}
                className={`p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isHovered
                    ? 'bg-purple-50/70 border-purple-200 shadow-xs'
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-slate-900">{c.artist}</span>
                      <span className="text-slate-400 text-[11px] ml-1.5 truncate">
                        • {c.venueName || c.city}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-slate-900">
                      {c.ticketsSold.toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-slate-400">
                        / {c.totalCapacity?.toLocaleString() || 'N/A'}
                      </span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        fillPct >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {fillPct}%
                    </span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: mounted ? `${fillPct}%` : '0%',
                      background: `linear-gradient(90deg, ${tc.gradient[0]}, ${tc.gradient[1]})`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Insight */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Top performing arena dates across active tour stops</span>
        </div>
        <div className="font-semibold text-slate-600">
          Avg {topConcerts.length > 0 ? Math.round(totalSold / topConcerts.length).toLocaleString() : 0} tkts / show
        </div>
      </div>
    </div>
  );
};
