import React, { useState, useMemo, useRef } from 'react';
import { Music, MapPin, BarChart3 } from 'lucide-react';
import type { ConcertEvent } from '../../types';

export interface ConcertPerformanceBarChartProps {
  concerts: ConcertEvent[];
  formatCurrency?: (val: number) => string;
  className?: string;
}

export const ConcertPerformanceBarChart: React.FC<ConcertPerformanceBarChartProps> = ({
  concerts = [],
  formatCurrency: customFormatCurrency,
  className = ''
}) => {
  const [dimension, setDimension] = useState<'city' | 'genre'>('city');
  const [metricMode, setMetricMode] = useState<'revenue' | 'volume'>('revenue');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const palette = [
    '#7C3AED', // Purple 600
    '#8B5CF6', // Purple 500
    '#6366F1', // Indigo 500
    '#EC4899', // Pink 500
    '#3B82F6', // Blue 500
    '#14B8A6', // Teal 500
    '#F59E0B'  // Amber 500
  ];

  const segments = useMemo(() => {
    const map = new Map<string, { label: string; count: number; volume: number; revenue: number }>();

    concerts.forEach((c) => {
      const key = (dimension === 'genre' ? c.genre || 'Other' : c.city || 'Other').trim();
      const sold = c.ticketsSold || 0;
      const avgPrice = (c.minPrice + c.maxPrice) / 2 || 0;
      const rev = sold * avgPrice;

      if (!map.has(key)) {
        map.set(key, { label: key, count: 0, volume: 0, revenue: 0 });
      }
      const existing = map.get(key)!;
      existing.count += 1;
      existing.volume += sold;
      existing.revenue += rev;
    });

    const list = Array.from(map.entries()).map(([key, data], idx) => {
      const val = metricMode === 'revenue' ? data.revenue : data.volume;
      return {
        id: key,
        label: data.label,
        count: data.count,
        volume: data.volume,
        revenue: data.revenue,
        value: Math.max(0, val),
        color: palette[idx % palette.length]
      };
    });

    list.sort((a, b) => b.value - a.value);

    const totalVal = list.reduce((sum, s) => sum + s.value, 0) || 1;

    return list.map((s) => ({
      ...s,
      percentage: Math.round((s.value / totalVal) * 100)
    }));
  }, [concerts, dimension, metricMode]);

  const maxVal = Math.max(...segments.map((s) => s.value), 1);

  const activeSegment = hoveredId ? segments.find((s) => s.id === hoveredId) : null;

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
      {activeSegment && mousePos && (
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
            }, ${mousePos.y < 125 ? '15px' : 'calc(-100% - 12px)'})`
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: activeSegment.color }}
              />
              <span className="font-bold text-slate-900 truncate">
                {activeSegment.label}
              </span>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 shrink-0">
              {activeSegment.percentage}% share
            </span>
          </div>

          <div className="space-y-1 pt-0.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Box Office Gross:</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(activeSegment.revenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Admissions Sold:</span>
              <span className="font-semibold text-slate-800">
                {activeSegment.volume.toLocaleString()} tickets
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Concert Count:</span>
              <span className="font-semibold text-slate-800">
                {activeSegment.count} {activeSegment.count === 1 ? 'event' : 'events'}
              </span>
            </div>
            {activeSegment.volume > 0 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-slate-400">
                <span>Avg Ticket Price:</span>
                <span className="font-medium text-slate-700">
                  {formatCurrency(Math.round(activeSegment.revenue / activeSegment.volume))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            {dimension === 'city' ? <MapPin className="h-3.5 w-3.5" /> : <Music className="h-3.5 w-3.5" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              {dimension === 'city' ? 'Tour Cities Box Office Share' : 'Music Genre Box Office Share'}
            </h3>
          </div>
        </div>

        {/* Dimension & Metric Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setDimension('city')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                dimension === 'city'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              City
            </button>
            <button
              type="button"
              onClick={() => setDimension('genre')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                dimension === 'genre'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Genre
            </button>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMetricMode('revenue')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                metricMode === 'revenue'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Revenue
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('volume')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                metricMode === 'volume'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar Canvas */}
      <div className="flex-1 flex flex-col justify-center py-2 space-y-3.5">
        {segments.map((seg) => {
          const barPct = Math.min(100, Math.max(5, (seg.value / maxVal) * 100));
          const isHovered = hoveredId === seg.id;

          return (
            <div
              key={seg.id}
              className={`group rounded-lg p-2 transition-all cursor-pointer border ${
                isHovered
                  ? 'border-purple-300 bg-purple-50/50 shadow-2xs'
                  : 'border-slate-100/80 bg-white hover:border-slate-200'
              }`}
              onMouseEnter={() => setHoveredId(seg.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Row Header */}
              <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-semibold text-slate-900 truncate text-[11.5px] group-hover:text-purple-900">
                    {seg.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                    style={{
                      backgroundColor: `${seg.color}18`,
                      color: seg.color
                    }}
                  >
                    {metricMode === 'revenue' ? formatCurrency(seg.value) : `${seg.value.toLocaleString()} tix`}
                  </span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${barPct}%`,
                    backgroundColor: seg.color,
                    filter: isHovered ? 'brightness(1.08)' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}

        {segments.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400">
            No active concert records available.
          </div>
        )}
      </div>
    </div>
  );
};
