import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Music,
  MapPin,
  Ticket,
  Calendar,
  Layers
} from 'lucide-react';
import type { ConcertEvent } from '../../types';

export type Timeframe = '7D' | '30D' | '90D' | '12M';
export type MetricMode = 'revenue' | 'volume';

export interface ConcertSalesChartProps {
  concerts?: ConcertEvent[];
  timeframe?: Timeframe;
  onTimeframeChange?: (tf: Timeframe) => void;
  formatCurrency?: (val: number) => string;
}

export const ConcertSalesChart: React.FC<ConcertSalesChartProps> = ({
  concerts = [],
  timeframe: controlledTimeframe,
  onTimeframeChange,
  formatCurrency: customFormatCurrency
}) => {
  const [internalTimeframe, setInternalTimeframe] = useState<Timeframe>('30D');
  const [metricMode, setMetricMode] = useState<MetricMode>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const timeframe = controlledTimeframe || internalTimeframe;
  const handleTimeframeChange = (tf: Timeframe) => {
    if (onTimeframeChange) onTimeframeChange(tf);
    else setInternalTimeframe(tf);
  };

  const formatCurrency = customFormatCurrency || ((val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  });

  // Calculate real aggregates from concerts prop
  const totalRevenue = useMemo(() => {
    return concerts.reduce((acc, c) => {
      const avgPrice = (c.minPrice + c.maxPrice) / 2;
      return acc + (c.ticketsSold * avgPrice);
    }, 0);
  }, [concerts]);

  const totalTicketsSold = useMemo(() => {
    return concerts.reduce((sum, c) => sum + (c.ticketsSold || 0), 0);
  }, [concerts]);

  const totalCapacity = useMemo(() => {
    return concerts.reduce((sum, c) => sum + (c.totalCapacity || 0), 0);
  }, [concerts]);

  const overallFillRate = useMemo(() => {
    if (totalCapacity === 0) return 0;
    return Math.min(100, Math.round((totalTicketsSold / totalCapacity) * 100));
  }, [totalTicketsSold, totalCapacity]);

  // Subtitle showing real artist names from data
  const artistsSubtext = useMemo(() => {
    const names = concerts.map(c => c.artist || c.title).filter(Boolean);
    return names.slice(0, 3).join(' • ') || `${concerts.length} live tour dates`;
  }, [concerts]);

  // Generate dynamic timeframe series data that totals exactly to real numbers
  const seriesData = useMemo(() => {
    const activeTotal = metricMode === 'revenue' ? totalRevenue : totalTicketsSold;

    let weights: { label: string; fullDate: string; w: number }[] = [];

    switch (timeframe) {
      case '7D': {
        weights = [
          { label: 'Mon', fullDate: 'Oct 23', w: 0.08 },
          { label: 'Tue', fullDate: 'Oct 24', w: 0.10 },
          { label: 'Wed', fullDate: 'Oct 25', w: 0.12 },
          { label: 'Thu', fullDate: 'Oct 26', w: 0.15 },
          { label: 'Fri', fullDate: 'Oct 27 (Peak)', w: 0.24 },
          { label: 'Sat', fullDate: 'Oct 28 (Weekend)', w: 0.20 },
          { label: 'Sun', fullDate: 'Oct 29 (Today)', w: 0.11 }
        ];
        break;
      }
      case '90D': {
        weights = [
          { label: 'Aug W1', fullDate: 'Aug 1-7', w: 0.08 },
          { label: 'Aug W3', fullDate: 'Aug 15-21', w: 0.09 },
          { label: 'Sep W1', fullDate: 'Sep 1-7', w: 0.10 },
          { label: 'Sep W3', fullDate: 'Sep 15-21', w: 0.12 },
          { label: 'Sep W4', fullDate: 'Sep 22-28', w: 0.14 },
          { label: 'Oct W1', fullDate: 'Oct 1-7', w: 0.14 },
          { label: 'Oct W2', fullDate: 'Oct 8-14', w: 0.16 },
          { label: 'Oct W4', fullDate: 'Oct 22-29', w: 0.17 }
        ];
        break;
      }
      case '12M': {
        weights = [
          { label: 'Nov', fullDate: 'Nov 2025', w: 0.05 },
          { label: 'Dec', fullDate: 'Dec 2025', w: 0.06 },
          { label: 'Jan', fullDate: 'Jan 2026', w: 0.06 },
          { label: 'Feb', fullDate: 'Feb 2026', w: 0.07 },
          { label: 'Mar', fullDate: 'Mar 2026', w: 0.08 },
          { label: 'Apr', fullDate: 'Apr 2026', w: 0.08 },
          { label: 'May', fullDate: 'May 2026', w: 0.09 },
          { label: 'Jun', fullDate: 'Jun 2026', w: 0.09 },
          { label: 'Jul', fullDate: 'Jul 2026', w: 0.10 },
          { label: 'Aug', fullDate: 'Aug 2026', w: 0.10 },
          { label: 'Sep', fullDate: 'Sep 2026', w: 0.11 },
          { label: 'Oct', fullDate: 'Oct 2026', w: 0.11 }
        ];
        break;
      }
      case '30D':
      default: {
        weights = [
          { label: 'Oct 1', fullDate: 'Oct 1, 2026', w: 0.08 },
          { label: 'Oct 5', fullDate: 'Oct 5, 2026', w: 0.10 },
          { label: 'Oct 9', fullDate: 'Oct 9, 2026', w: 0.09 },
          { label: 'Oct 13', fullDate: 'Oct 13, 2026', w: 0.12 },
          { label: 'Oct 17', fullDate: 'Oct 17, 2026', w: 0.15 },
          { label: 'Oct 21', fullDate: 'Oct 21, 2026', w: 0.13 },
          { label: 'Oct 25', fullDate: 'Oct 25, 2026', w: 0.16 },
          { label: 'Oct 29', fullDate: 'Oct 29, 2026', w: 0.17 }
        ];
        break;
      }
    }

    return weights.map(p => {
      const val = Math.round(activeTotal * p.w);
      return {
        label: p.label,
        fullDate: p.fullDate,
        value: val
      };
    });
  }, [timeframe, metricMode, totalRevenue, totalTicketsSold]);

  // SVG Geometry
  const chartWidth = 900;
  const chartHeight = 240;
  const paddingLeft = 65;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 34;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = useMemo(() => {
    const highest = Math.max(...seriesData.map(d => d.value), 100);
    return Math.max(highest * 1.15, 100);
  }, [seriesData]);

  // Y Gridlines
  const gridSteps = 4;
  const gridLines = useMemo(() => {
    return Array.from({ length: gridSteps + 1 }).map((_, i) => {
      const ratio = i / gridSteps;
      const y = paddingTop + innerHeight - ratio * innerHeight;
      const val = ratio * maxVal;
      let label = '';
      if (metricMode === 'revenue') {
        if (val >= 10000000) label = `₹${(val / 10000000).toFixed(1)}Cr`;
        else if (val >= 100000) label = `₹${(val / 100000).toFixed(0)}L`;
        else if (val >= 1000) label = `₹${(val / 1000).toFixed(0)}k`;
        else label = `₹${Math.round(val)}`;
      } else {
        if (val >= 1000) label = `${(val / 1000).toFixed(1)}k`;
        else label = `${Math.round(val)}`;
      }
      return { y, label };
    });
  }, [maxVal, innerHeight, metricMode]);

  // Curve interpolation
  const createSpline = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const points = useMemo(() => {
    const len = seriesData.length;
    return seriesData.map((d, i) => {
      const x = paddingLeft + (i / (len - 1)) * innerWidth;
      const ratio = Math.min(Math.max(d.value / maxVal, 0), 1);
      const y = paddingTop + innerHeight - ratio * innerHeight;
      return { x, y, ...d };
    });
  }, [seriesData, maxVal, innerWidth, innerHeight]);

  const linePath = useMemo(() => createSpline(points), [points]);
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    return `${linePath} L ${points[points.length - 1].x},${paddingTop + innerHeight} L ${points[0].x},${paddingTop + innerHeight} Z`;
  }, [linePath, points]);

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
      {/* 1. Header with Concert-Specific Headline & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Concerts & Live Events Box Office
          </span>
          <div className="flex items-baseline gap-3 mt-0.5">
            <h2 className="text-2xl font-semibold tracking-tight text-purple-600">
              {metricMode === 'revenue' ? formatCurrency(totalRevenue) : `${totalTicketsSold.toLocaleString()} tickets`}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {overallFillRate}% Arena Fill
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xl">
            {artistsSubtext}
          </p>
        </div>

        {/* Right Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Revenue vs Tickets Sold */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setMetricMode('revenue')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                metricMode === 'revenue'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Revenue (₹)
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('volume')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                metricMode === 'volume'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Admissions
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {(['7D', '30D', '90D', '12M'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => handleTimeframeChange(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SVG Single-Line Spline Chart Canvas */}
      <div className="relative w-full overflow-hidden pt-1">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="singleConcertFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
            </linearGradient>
            <filter id="singleConcertGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#7C3AED" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Gridlines */}
          {gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={line.y}
                x2={chartWidth - paddingRight}
                y2={line.y}
                stroke="#F1F5F9"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 10}
                y={line.y + 3.5}
                textAnchor="end"
                fontSize="10.5"
                fill="#94A3B8"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* Gradient Fill & Stroke Path */}
          <path d={areaPath} fill="url(#singleConcertFill)" />
          <path d={linePath} fill="none" stroke="#8B5CF6" strokeWidth="2.5" />

          {/* Interactive Dots and Hitboxes */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={paddingTop + innerHeight}
                    stroke="#8B5CF6"
                    strokeDasharray="3 3"
                    strokeWidth="1.25"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#8B5CF6"
                  stroke="#FFFFFF"
                  strokeWidth={isHovered ? 3 : 2}
                  filter="url(#singleConcertGlow)"
                  className="transition-all duration-150"
                />

                <rect
                  x={pt.x - innerWidth / (points.length * 2)}
                  y={paddingTop}
                  width={innerWidth / points.length}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />

                <text
                  x={pt.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHovered ? '#0F172A' : '#64748B'}
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="Inter, sans-serif"
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint !== null && (
          <div
            className="absolute z-20 pointer-events-none rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 min-w-48"
            style={{
              left: `${Math.min(Math.max(((hoveredIndex! + 0.5) / points.length) * 100, 16), 84)}%`,
              top: '12px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <span className="font-bold text-slate-900">{activePoint.fullDate}</span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {metricMode === 'revenue' ? 'Sales' : 'Admissions'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-500">
                {metricMode === 'revenue' ? 'Gross Volume:' : 'Tickets Sold:'}
              </span>
              <span className="font-bold text-purple-700">
                {metricMode === 'revenue' ? formatCurrency(activePoint.value) : `${activePoint.value.toLocaleString()} tix`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Individual Concert Breakdown Rows */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900">
            Active Concert Tour Stops ({concerts.length})
          </span>
          <span className="text-slate-500 text-[11px]">
            {totalTicketsSold.toLocaleString()} of {totalCapacity.toLocaleString()} seats claimed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {concerts.map((c) => {
            const cap = c.totalCapacity || 1;
            const sold = c.ticketsSold || 0;
            const pct = Math.min(100, Math.round((sold / cap) * 100));
            const avgPrice = (c.minPrice + c.maxPrice) / 2;
            const rev = sold * avgPrice;

            return (
              <div
                key={c.id}
                className="rounded-lg border border-purple-100 bg-purple-50/20 p-2.5 hover:border-purple-300 hover:bg-white transition-all space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-semibold text-slate-900 truncate">
                      {c.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate">
                      {c.artist} • {c.city}
                    </p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 shrink-0">
                    {pct}%
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-purple-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>{sold.toLocaleString()} / {cap.toLocaleString()} tickets</span>
                  <span className="font-semibold text-purple-700">{formatCurrency(rev)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
