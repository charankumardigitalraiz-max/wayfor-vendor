import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Music, Ticket, TrendingUp } from 'lucide-react';
import type { ConcertEvent } from '../../types';

export interface ConcertTourColumnChartProps {
  concerts: ConcertEvent[];
  formatCurrency?: (val: number) => string;
  className?: string;
}

export const ConcertTourColumnChart: React.FC<ConcertTourColumnChartProps> = ({
  concerts = [],
  formatCurrency: customFormatCurrency,
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);
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
    return `${num}`;
  };

  // Top 5 concerts sorted by tickets sold
  const topConcerts = useMemo(() => {
    return [...concerts]
      .sort((a, b) => (b.ticketsSold || 0) - (a.ticketsSold || 0))
      .slice(0, 5);
  }, [concerts]);

  const maxTickets = useMemo(() => {
    const raw = Math.max(...topConcerts.map((c) => c.ticketsSold || 0), 1000);
    // Round up to clean step: e.g. 71800 -> 80000
    const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
    return Math.ceil(raw / (magnitude * 0.5)) * (magnitude * 0.5);
  }, [topConcerts]);

  // 5 clean Y-axis ticks
  const yTicks = [
    maxTickets,
    Math.round(maxTickets * 0.75),
    Math.round(maxTickets * 0.5),
    Math.round(maxTickets * 0.25),
    0
  ];

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
      className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between relative ${className}`}
    >
      {/* Floating Interactive Tooltip */}
      {activeConcert && mousePos && (
        <div
          className="absolute z-30 pointer-events-none rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 min-w-56 transition-transform duration-75"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: `translate(${
              mousePos.x < 130
                ? '8px'
                : containerRef.current && mousePos.x > containerRef.current.clientWidth - 130
                ? 'calc(-100% - 8px)'
                : '-50%'
            }, ${mousePos.y < 130 ? '15px' : 'calc(-100% - 12px)'})`
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-600 shrink-0" />
              <span className="font-bold text-slate-900 truncate">
                {activeConcert.artist || activeConcert.title}
              </span>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 shrink-0">
              Rank #{activeIndex + 1}
            </span>
          </div>

          <div className="space-y-1 pt-0.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tour Name:</span>
              <span className="font-semibold text-slate-800 truncate max-w-36 text-right">
                {activeConcert.title}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Venue & City:</span>
              <span className="font-semibold text-slate-800 truncate max-w-36 text-right">
                {activeConcert.venueName || activeConcert.city}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tickets Sold:</span>
              <span className="font-bold text-slate-900">
                {activeConcert.ticketsSold.toLocaleString()} admissions
              </span>
            </div>
            {activeConcert.totalCapacity > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Capacity Fill:</span>
                <span className="font-bold text-purple-700">
                  {Math.round((activeConcert.ticketsSold / activeConcert.totalCapacity) * 100)}%
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-slate-400">
              <span>Gross Box Office:</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(activeConcert.ticketsSold * ((activeConcert.minPrice + activeConcert.maxPrice) / 2))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Music className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Top Concert Tours by Admissions
            </h3>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
          Ranked Volume
        </span>
      </div>

      {/* Column Chart Canvas */}
      <div className="flex-1 flex flex-col justify-end pt-3 pb-1 relative min-h-[220px]">
        {/* Background Horizontal Dashed Guide Lines */}
        <div className="absolute inset-x-0 top-3 bottom-14 flex flex-col justify-between pointer-events-none">
          {yTicks.map((tick, idx) => (
            <div key={idx} className="w-full flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-400 w-9 text-right shrink-0">
                {formatK(tick)}
              </span>
              <div className="flex-1 border-b border-dashed border-slate-100" />
            </div>
          ))}
        </div>

        {/* Vertical Columns Grid */}
        <div className="ml-11 relative z-10 flex items-end justify-around gap-2 h-44 mb-2 px-2">
          {topConcerts.map((concert, idx) => {
            const pct = Math.min(100, Math.max(8, (concert.ticketsSold / maxTickets) * 100));
            const isHovered = hoveredId === concert.id;
            const shortName = concert.artist || concert.title.split(' ')[0] || `Tour #${idx + 1}`;

            return (
              <div
                key={concert.id}
                className="flex-1 max-w-[64px] flex flex-col items-center cursor-pointer group"
                onMouseEnter={() => setHoveredId(concert.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Value Chip on Top of Column */}
                <span
                  className={`text-[10px] font-bold mb-1.5 px-1 py-0.2 rounded transition-all duration-200 ${
                    isHovered
                      ? 'bg-purple-600 text-white shadow-xs scale-105'
                      : 'bg-purple-50 text-purple-700'
                  }`}
                >
                  {formatK(concert.ticketsSold)}
                </span>

                {/* Vertical Bar Cylinder */}
                <div className="w-full h-36 rounded-t-lg bg-slate-100/70 relative flex items-end justify-center overflow-hidden">
                  <div
                    className="w-full rounded-t-lg transition-all duration-700 ease-out"
                    style={{
                      height: mounted ? `${pct}%` : '0%',
                      background: isHovered
                        ? 'linear-gradient(to top, #6D28D9, #8B5CF6)'
                        : 'linear-gradient(to top, #7C3AED, #A855F7)',
                      filter: isHovered ? 'brightness(1.08)' : 'none'
                    }}
                  />
                </div>

                {/* X-axis Label below Column */}
                <div className="text-center mt-2 w-full">
                  <span
                    className={`text-[11px] font-semibold block truncate transition-colors ${
                      isHovered ? 'text-purple-700 font-bold' : 'text-slate-700'
                    }`}
                    title={concert.title}
                  >
                    {shortName}
                  </span>
                  <span className="text-[9.5px] text-slate-400 block truncate">
                    {concert.city || 'Arena'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {topConcerts.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-400">
            No live concert admissions data available.
          </div>
        )}
      </div>
    </div>
  );
};
