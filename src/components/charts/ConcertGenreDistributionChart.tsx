import React, { useState, useMemo, useRef } from 'react';
import { Music, MapPin } from 'lucide-react';
import type { ConcertEvent } from '../../types';

export interface ConcertGenreDistributionChartProps {
  concerts: ConcertEvent[];
  formatCurrency?: (val: number) => string;
  className?: string;
}

export const ConcertGenreDistributionChart: React.FC<ConcertGenreDistributionChartProps> = ({
  concerts = [],
  formatCurrency: customFormatCurrency,
  className = ''
}) => {
  const [dimension, setDimension] = useState<'genre' | 'city'>('city');
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

  // Curated vibrant color scheme fitting concert/live entertainment visual aesthetic
  const palette = [
    '#8B5CF6', // Purple
    '#EC4899', // Pink / Magenta
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F43F5E'  // Rose
  ];

  // Aggregate by selected dimension (genre or city)
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
        value: val,
        color: palette[idx % palette.length]
      };
    });

    // Sort descending by selected metric value
    list.sort((a, b) => b.value - a.value);

    const totalVal = list.reduce((sum, s) => sum + s.value, 0) || 1;

    let accumulatedAngle = -90;
    return list.map((s) => {
      const pct = Math.round((s.value / totalVal) * 100);
      const angle = (s.value / totalVal) * 360;
      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + angle;
      accumulatedAngle += angle;

      return {
        ...s,
        percentage: pct,
        startAngle,
        endAngle
      };
    });
  }, [concerts, dimension, metricMode]);

  const totalCalculated = useMemo(() => {
    return segments.reduce((sum, s) => sum + s.value, 0);
  }, [segments]);

  // Geometry helpers for SVG Donut
  const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians)
    };
  };

  const createDonutArc = (
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const clampedEnd = endAngle - startAngle >= 360 ? startAngle + 359.99 : endAngle;
    const startOuter = polarToCartesian(cx, cy, outerRadius, clampedEnd);
    const endOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
    const startInner = polarToCartesian(cx, cy, innerRadius, startAngle);
    const endInner = polarToCartesian(cx, cy, innerRadius, clampedEnd);

    const arcSweep = clampedEnd - startAngle <= 180 ? '0' : '1';

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${arcSweep} 0 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${arcSweep} 1 ${endInner.x} ${endInner.y}`,
      'Z'
    ].join(' ');
  };

  const activeSegment = hoveredId ? segments.find((s) => s.id === hoveredId) : null;

  return (
    <div className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between ${className}`}>
      {/* Header with Title and Dimension/Metric Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              {dimension === 'genre' ? <Music className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                {dimension === 'genre' ? 'Genre Box Office Distribution' : 'Tour Cities Admissions Share'}
              </h3>
              {/* <p className="text-xs text-slate-500 mt-0.5">
                {dimension === 'genre'
                  ? 'Revenue & ticket admissions split across music genres'
                  : 'Geographic demand & attendance density by host city'}
              </p> */}
            </div>
          </div>

        </div>

        {/* Dimension & Metric Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Dimension Selector (Genre vs City) */}


          {/* Metric Selector (Revenue vs Tickets) */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMetricMode('revenue')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${metricMode === 'revenue'
                ? 'bg-white text-purple-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Revenue
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('volume')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${metricMode === 'volume'
                ? 'bg-white text-purple-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Donut Chart + Breakdown List */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredId(null);
          setMousePos(null);
        }}
        className="relative flex flex-col sm:flex-row items-center gap-6 py-3 flex-1"
      >
        {/* Floating Interactive Tooltip */}
        {activeSegment && mousePos && (
          <div
            className="absolute z-30 pointer-events-none rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 min-w-56 transition-transform duration-75"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              transform: `translate(${mousePos.x < 130
                ? '8px'
                : containerRef.current && mousePos.x > containerRef.current.clientWidth - 130
                  ? 'calc(-100% - 8px)'
                  : '-50%'
                }, ${mousePos.y < 125 ? '15px' : 'calc(-100% - 12px)'})`
            }}
          >
            {/* Tooltip Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs"
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

            {/* Metrics Breakdown */}
            <div className="space-y-1 pt-0.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Box Office Gross:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(activeSegment.revenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tickets Sold:</span>
                <span className="font-semibold text-slate-800">
                  {activeSegment.volume.toLocaleString()} tix
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Events:</span>
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

        {/* SVG Donut */}
        <div className="relative shrink-0 w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full select-none">
            {segments.map((seg) => {
              const isHovered = hoveredId === seg.id;
              const innerR = isHovered ? 52 : 56;
              const outerR = isHovered ? 88 : 83;
              const path = createDonutArc(100, 100, innerR, outerR, seg.startAngle, seg.endAngle);

              return (
                <path
                  key={seg.id}
                  d={path}
                  fill={seg.color}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.18))' : 'none',
                    opacity: hoveredId && !isHovered ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    setHoveredId(seg.id);
                    handleMouseMove(e);
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    setMousePos(null);
                  }}
                />
              );
            })}
          </svg>

          {/* Center Callout Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[110px]">
              {activeSegment ? activeSegment.label : 'TOTAL'}
            </span>
            <span className="text-xl font-extrabold text-slate-900 leading-tight">
              {activeSegment ? `${activeSegment.percentage}%` : '100%'}
            </span>
            <span className="text-[11px] font-semibold text-purple-700">
              {activeSegment
                ? metricMode === 'revenue'
                  ? formatCurrency(activeSegment.revenue)
                  : `${activeSegment.volume.toLocaleString()} tix`
                : metricMode === 'revenue'
                  ? formatCurrency(totalCalculated)
                  : `${totalCalculated.toLocaleString()} tix`}
            </span>
          </div>
        </div>

        {/* Visual Graphic Share Bars (Zero text clutter, rich hover detail) */}
        <div className="flex-1 w-full space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {segments.map((seg) => {
            const isHovered = hoveredId === seg.id;
            return (
              <div
                key={seg.id}
                onMouseEnter={(e) => {
                  setHoveredId(seg.id);
                  handleMouseMove(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setMousePos(null);
                }}
                className={`group rounded-lg p-2 transition-all cursor-pointer border ${
                  isHovered
                    ? 'border-purple-300 bg-purple-50/50 shadow-2xs'
                    : 'border-slate-100/80 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="font-semibold text-slate-800 truncate text-[11.5px] group-hover:text-slate-900">
                      {seg.label}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0"
                    style={{
                      backgroundColor: `${seg.color}18`,
                      color: seg.color
                    }}
                  >
                    {seg.percentage}%
                  </span>
                </div>

                {/* Graphical Animated Share Bar */}
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(seg.percentage, 3)}%`,
                      backgroundColor: seg.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
