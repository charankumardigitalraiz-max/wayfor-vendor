import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

export type Timeframe = '7D' | '30D' | '90D' | '12M';
export type MetricMode = 'revenue' | 'volume';
export type AccentColor = 'purple' | 'amber' | 'teal' | 'indigo';

export interface ModuleTrendLineChartProps {
  title: string;
  accentColor?: AccentColor;
  totalAmount: number;
  totalVolume: number;
  unit: string;
  timeframe?: Timeframe;
  onTimeframeChange?: (tf: Timeframe) => void;
  formatCurrency?: (val: number) => string;
  subtext?: string;
}

export const ModuleTrendLineChart: React.FC<ModuleTrendLineChartProps> = ({
  title,
  accentColor = 'purple',
  totalAmount,
  totalVolume,
  unit,
  timeframe: controlledTimeframe,
  onTimeframeChange,
  formatCurrency: customFormatCurrency,
  subtext
}) => {
  const [internalTimeframe, setInternalTimeframe] = useState<Timeframe>('30D');
  const [metricMode, setMetricMode] = useState<MetricMode>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    setAnimProgress(0);
    const timer = setTimeout(() => setAnimProgress(1), 60);
    return () => clearTimeout(timer);
  }, [controlledTimeframe, internalTimeframe, metricMode]);

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

  // Color config based on accentColor
  const colorMap = {
    purple: {
      text: 'text-purple-600',
      stroke: '#8B5CF6',
      fillGradId: 'trendGradPurple',
      glowColor: '#7C3AED',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    amber: {
      text: 'text-amber-600',
      stroke: '#F59E0B',
      fillGradId: 'trendGradAmber',
      glowColor: '#D97706',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    teal: {
      text: 'text-teal-600',
      stroke: '#10B981',
      fillGradId: 'trendGradTeal',
      glowColor: '#059669',
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-200'
    },
    indigo: {
      text: 'text-indigo-600',
      stroke: '#6366F1',
      fillGradId: 'trendGradIndigo',
      glowColor: '#4F46E5',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  };

  const activeColors = colorMap[accentColor] || colorMap.purple;

  // Normalized weights to calculate periods that match the actual total
  const seriesData = useMemo(() => {
    const activeTotal = metricMode === 'revenue' ? totalAmount : totalVolume;

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
          { label: 'Oct 1', fullDate: 'Oct 1', w: 0.08 },
          { label: 'Oct 5', fullDate: 'Oct 5', w: 0.10 },
          { label: 'Oct 9', fullDate: 'Oct 9', w: 0.09 },
          { label: 'Oct 13', fullDate: 'Oct 13', w: 0.12 },
          { label: 'Oct 17', fullDate: 'Oct 17', w: 0.15 },
          { label: 'Oct 21', fullDate: 'Oct 21', w: 0.13 },
          { label: 'Oct 25', fullDate: 'Oct 25', w: 0.16 },
          { label: 'Oct 29', fullDate: 'Oct 29', w: 0.17 }
        ];
        break;
      }
    }

    return weights.map(p => ({
      label: p.label,
      fullDate: p.fullDate,
      value: Math.round(activeTotal * p.w)
    }));
  }, [timeframe, metricMode, totalAmount, totalVolume]);

  // SVG Geometry - Expanded Height
  const chartWidth = 540;
  const chartHeight = 230;
  const paddingLeft = 54;
  const paddingRight = 16;
  const paddingTop = 18;
  const paddingBottom = 30;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = useMemo(() => {
    const highest = Math.max(...seriesData.map(d => d.value), 10);
    return Math.max(highest * 1.15, 10);
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

  // Spline
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
      const targetRatio = Math.min(Math.max(d.value / maxVal, 0), 1);
      const ratio = targetRatio * animProgress;
      const y = paddingTop + innerHeight - ratio * innerHeight;
      return { x, y, ...d };
    });
  }, [seriesData, maxVal, innerWidth, innerHeight, animProgress]);

  const linePath = useMemo(() => createSpline(points), [points]);
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    return `${linePath} L ${points[points.length - 1].x},${paddingTop + innerHeight} L ${points[0].x},${paddingTop + innerHeight} Z`;
  }, [linePath, points]);

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4 flex flex-col justify-between min-h-[340px]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className={`text-xl font-semibold tracking-tight ${activeColors.text}`}>
              {metricMode === 'revenue' ? formatCurrency(totalAmount) : `${totalVolume.toLocaleString()} ${unit}`}
            </h3>
          </div>
          {subtext && (
            <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
              {subtext}
            </p>
          )}
        </div>

        {/* Switchers */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {/* Revenue / Volume */}
          <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setMetricMode('revenue')}
              className={`px-2 py-0.5 font-semibold rounded cursor-pointer ${
                metricMode === 'revenue' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ₹
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('volume')}
              className={`px-2 py-0.5 font-semibold rounded cursor-pointer capitalize ${
                metricMode === 'volume' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {unit}
            </button>
          </div>

          {/* Timeframe */}
          <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
            {(['7D', '30D', '90D'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => handleTimeframeChange(tf)}
                className={`px-1.5 py-0.5 font-semibold rounded cursor-pointer ${
                  timeframe === tf ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compact Spline Wave */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={activeColors.fillGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeColors.stroke} stopOpacity="0.35" />
              <stop offset="100%" stopColor={activeColors.stroke} stopOpacity="0.01" />
            </linearGradient>
            <filter id={`glow_${accentColor}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor={activeColors.glowColor} floodOpacity="0.3" />
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
                strokeDasharray={i === 0 ? undefined : '2 2'}
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={line.y + 3}
                textAnchor="end"
                fontSize="9.5"
                fill="#94A3B8"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* Fill & Line Animated from bottom */}
          <path
            d={areaPath}
            fill={`url(#${activeColors.fillGradId})`}
            className="transition-all duration-700 ease-out"
          />
          <path
            d={linePath}
            fill="none"
            stroke={activeColors.stroke}
            strokeWidth="2.25"
            className="transition-all duration-700 ease-out"
          />

          {/* Interactive Marker Dots */}
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
                    stroke={activeColors.stroke}
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5 : 3.5}
                  fill={activeColors.stroke}
                  stroke="#FFFFFF"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  filter={`url(#glow_${accentColor})`}
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
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fontSize="10"
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

        {/* Hover Tooltip */}
        {activePoint !== null && (
          <div
            className="absolute z-20 pointer-events-none rounded-lg border border-slate-200/90 bg-white/95 backdrop-blur-md px-2.5 py-1.5 shadow-md text-xs space-y-0.5 min-w-36"
            style={{
              left: `${Math.min(Math.max(((hoveredIndex! + 0.5) / points.length) * 100, 16), 84)}%`,
              top: '6px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>{activePoint.fullDate}</span>
              <span className="uppercase">{metricMode}</span>
            </div>
            <div className={`font-bold ${activeColors.text} text-xs`}>
              {metricMode === 'revenue' ? formatCurrency(activePoint.value) : `${activePoint.value.toLocaleString()} ${unit}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
