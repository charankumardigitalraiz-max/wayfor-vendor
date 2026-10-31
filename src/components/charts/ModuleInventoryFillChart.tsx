import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PieChart as PieIcon } from 'lucide-react';

export type AccentColor = 'purple' | 'amber' | 'teal' | 'indigo';

export interface FillItem {
  id: string;
  title: string;
  subtitle: string;
  filled: number;
  capacity: number;
  fillPct: number;
  revenue: number;
  unit: string;
  tag?: string;
}

export interface ModuleInventoryFillChartProps {
  title: string;
  accentColor?: AccentColor;
  items: FillItem[];
  formatCurrency?: (val: number) => string;
}

export const ModuleInventoryFillChart: React.FC<ModuleInventoryFillChartProps> = ({
  title,
  accentColor = 'purple',
  items = [],
  formatCurrency: customFormatCurrency
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = customFormatCurrency || ((val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  });

  // Color palettes tailored by accent color
  const paletteMap = {
    purple: ['#7C3AED', '#8B5CF6', '#A855F7', '#C084FC', '#D8B4FE', '#E9D5FF'],
    amber: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
    teal: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#CCFBF1'],
    indigo: ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF']
  };

  const palette = paletteMap[accentColor] || paletteMap.purple;

  const totalCap = useMemo(() => items.reduce((sum, item) => sum + item.capacity, 0), [items]);
  const totalFilled = useMemo(() => items.reduce((sum, item) => sum + item.filled, 0), [items]);
  const avgFill = useMemo(() => {
    if (totalCap === 0) return 0;
    return Math.min(100, Math.round((totalFilled / totalCap) * 100));
  }, [totalCap, totalFilled]);

  // Proportional Donut Slices based on item capacity / filled
  const slices = useMemo(() => {
    const sumVal = items.reduce((sum, item) => sum + Math.max(item.filled, 1), 0) || 1;
    let accumulatedAngle = -90;

    return items.map((item, idx) => {
      const sliceVal = Math.max(item.filled, 1);
      const angle = (sliceVal / sumVal) * 360;
      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + angle;
      accumulatedAngle += angle;
      const color = palette[idx % palette.length];

      return {
        ...item,
        color,
        startAngle,
        endAngle,
        sharePct: Math.round((sliceVal / sumVal) * 100)
      };
    });
  }, [items, palette]);

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

  const activeItem = hoveredId ? slices.find(s => s.id === hoveredId) : null;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4 flex flex-col justify-between min-h-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 mt-0.5">
            Capacity Distribution & Occupancy
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium">Avg Fill:</span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-500"
            style={{
              backgroundColor: `${palette[0]}15`,
              color: palette[0]
            }}
          >
            {isMounted ? `${avgFill}%` : '0%'}
          </span>
        </div>
      </div>

      {/* Donut Chart with Visual Capacity Bars */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredId(null);
          setMousePos(null);
        }}
        className="relative flex flex-col sm:flex-row items-center gap-6 py-1 flex-1"
      >
        {/* Floating Interactive Tooltip */}
        {activeItem && mousePos && (
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeItem.color }}
                />
                <span className="font-bold text-slate-900 truncate">
                  {activeItem.title}
                </span>
              </div>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                style={{
                  backgroundColor: `${activeItem.color}18`,
                  color: activeItem.color
                }}
              >
                {activeItem.fillPct}% fill
              </span>
            </div>

            <div className="space-y-1 pt-0.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location / Venue:</span>
                <span className="font-semibold text-slate-800 truncate max-w-36 text-right">
                  {activeItem.subtitle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Occupancy:</span>
                <span className="font-bold text-slate-900">
                  {activeItem.filled} / {activeItem.capacity} {activeItem.unit}
                </span>
              </div>
              {activeItem.revenue > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-1">
                  <span className="text-slate-500">Gross Volume:</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(activeItem.revenue)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SVG Animated Donut Ring */}
        <div className="relative shrink-0 w-44 h-44 sm:w-48 sm:h-48">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full select-none transition-transform duration-700 ease-out"
            style={{
              transform: isMounted ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-90deg)',
              opacity: isMounted ? 1 : 0
            }}
          >
            {slices.map((slice) => {
              const isHovered = hoveredId === slice.id;
              const innerR = isHovered ? 52 : 56;
              const outerR = isHovered ? 90 : 86;
              const path = createDonutArc(100, 100, innerR, outerR, slice.startAngle, slice.endAngle);

              return (
                <path
                  key={slice.id}
                  d={path}
                  fill={slice.color}
                  opacity={isHovered ? 1 : 0.9}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.18))' : 'none',
                    opacity: hoveredId && !isHovered ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    setHoveredId(slice.id);
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

          {/* Center Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider truncate max-w-20">
              {activeItem ? activeItem.title.split(' ')[0] : 'AVG FILL'}
            </span>
            <span className="text-xl font-bold text-slate-900 leading-tight">
              {isMounted ? (activeItem ? `${activeItem.fillPct}%` : `${avgFill}%`) : '0%'}
            </span>
            <span className="text-[10px] font-medium text-slate-500 truncate max-w-20">
              {activeItem ? formatCurrency(activeItem.revenue) : `${items.length} active`}
            </span>
          </div>
        </div>

        {/* Visual Graphic Capacity Bars (No heavy text clutter, rich hover detail) */}
        <div className="flex-1 w-full space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {slices.map((slice) => {
            const isHovered = hoveredId === slice.id;
            return (
              <div
                key={slice.id}
                onMouseEnter={(e) => {
                  setHoveredId(slice.id);
                  handleMouseMove(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setMousePos(null);
                }}
                className={`group rounded-lg p-2 transition-all cursor-pointer border ${isHovered
                    ? 'border-slate-300 bg-slate-50 shadow-2xs'
                    : 'border-slate-100/80 bg-white hover:border-slate-200'
                  }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="font-semibold text-slate-800 truncate text-[11.5px] group-hover:text-slate-900">
                      {slice.title}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0"
                    style={{
                      backgroundColor: `${slice.color}15`,
                      color: slice.color
                    }}
                  >
                    {slice.fillPct}%
                  </span>
                </div>

                {/* Graphical Animated Progress Bar */}
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(slice.fillPct, 3)}%`,
                      backgroundColor: slice.color
                    }}
                  />
                </div>
              </div>
            );
          })}

          {slices.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              No active listings found for this module.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
