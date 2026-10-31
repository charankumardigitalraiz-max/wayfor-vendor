import React, { useState, useMemo, useRef } from 'react';
import { Tag, MapPin } from 'lucide-react';
import type { StrangerMeet } from '../../types';

export interface StrangerMeetDistributionChartProps {
  meets: StrangerMeet[];
  formatCurrency?: (val: number) => string;
  className?: string;
}

export const StrangerMeetDistributionChart: React.FC<StrangerMeetDistributionChartProps> = ({
  meets = [],
  formatCurrency: customFormatCurrency,
  className = ''
}) => {
  const [dimension, setDimension] = useState<'category' | 'city'>('category');
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
    '#0D9488', // Teal
    '#06B6D4', // Cyan
    '#10B981', // Emerald
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#3B82F6', // Blue
    '#F43F5E'  // Rose
  ];

  const segments = useMemo(() => {
    const map = new Map<string, { label: string; count: number; volume: number; revenue: number }>();

    meets.forEach((m) => {
      const key = (dimension === 'category' ? m.category || 'Other' : m.city || 'Other').trim();
      const buddies = m.participants?.length || 0;
      const rev = buddies * (m.pricePerPerson || 0);

      if (!map.has(key)) {
        map.set(key, { label: key, count: 0, volume: 0, revenue: 0 });
      }
      const existing = map.get(key)!;
      existing.count += 1;
      existing.volume += buddies;
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
  }, [meets, dimension, metricMode]);

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
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            {dimension === 'category' ? <Tag className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              {dimension === 'category' ? 'Mixer Category Distribution' : 'Host Cities Community Share'}
            </h3>
          </div>
        </div>

        {/* Dimension & Metric Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Dimension Selector (Category vs City) */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setDimension('category')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${dimension === 'category'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Category
            </button>
            <button
              type="button"
              onClick={() => setDimension('city')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${dimension === 'city'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              City
            </button>
          </div>

          {/* Metric Selector (Revenue vs Buddies) */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMetricMode('revenue')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${metricMode === 'revenue'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Revenue
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('volume')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer ${metricMode === 'volume'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Buddies
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
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 shrink-0">
                {activeSegment.percentage}% share
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-1 pt-0.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Gross Volume:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(activeSegment.revenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">RSVP Buddies:</span>
                <span className="font-semibold text-slate-800">
                  {activeSegment.volume.toLocaleString()} buddies
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Mixers:</span>
                <span className="font-semibold text-slate-800">
                  {activeSegment.count} {activeSegment.count === 1 ? 'event' : 'events'}
                </span>
              </div>
              {activeSegment.volume > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-slate-400">
                  <span>Avg Pass Price:</span>
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
            <span className="text-[11px] font-semibold text-teal-800">
              {activeSegment
                ? metricMode === 'revenue'
                  ? formatCurrency(activeSegment.revenue)
                  : `${activeSegment.volume.toLocaleString()} buddies`
                : metricMode === 'revenue'
                  ? formatCurrency(totalCalculated)
                  : `${totalCalculated.toLocaleString()} buddies`}
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
                    ? 'border-teal-300 bg-teal-50/50 shadow-2xs'
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
