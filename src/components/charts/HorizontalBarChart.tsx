import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export interface HorizontalBarItem {
  id: string;
  label: string;
  value: number;
  subtext?: string;
  color?: string;
  badge?: string;
}

interface HorizontalBarChartProps {
  title: string;
  subtitle?: string;
  items: HorizontalBarItem[];
  axisLabel?: string;
  formatValue?: (v: number) => string;
  className?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  subtitle,
  items,
  axisLabel = 'Confirmed Travelers',
  formatValue = (v) => v.toLocaleString(),
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

  // Sort items descending by value
  const sortedItems = [...items].sort((a, b) => b.value - a.value);

  const realMax = Math.max(...sortedItems.map((i) => i.value), 1);
  // Choose a clean rounded maximum based on realMax so bars look well-proportioned
  const scaleMax = realMax <= 4 ? realMax + 1 : Math.ceil(realMax * 1.2);

  // 5 evenly spaced axis steps
  const axisSteps = [
    0,
    Math.round(scaleMax * 0.25),
    Math.round(scaleMax * 0.5),
    Math.round(scaleMax * 0.75),
    scaleMax
  ];

  // Curated modern expedition amber/sunset gradient palette
  const defaultPalette = [
    '#D97706', // Amber 600
    '#F59E0B', // Amber 500
    '#EA580C', // Orange 600
    '#0D9488', // Teal 600
    '#8B5CF6'  // Purple 600
  ];

  const activeItem = hoveredId ? sortedItems.find((i) => i.id === hoveredId) : null;
  const activeIndex = activeItem ? sortedItems.findIndex((i) => i.id === activeItem.id) : -1;

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
      {activeItem && mousePos && (
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
                style={{ backgroundColor: activeItem.color || defaultPalette[activeIndex % defaultPalette.length] }}
              />
              <span className="font-bold text-slate-900 truncate">
                {activeItem.label}
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
              Rank #{activeIndex + 1}
            </span>
          </div>

          <div className="space-y-1 pt-0.5 text-[11px]">
            {activeItem.subtext && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Route / Waypoint:</span>
                <span className="font-semibold text-slate-800 truncate max-w-36 text-right">
                  {activeItem.subtext}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Confirmed Booking:</span>
              <span className="font-bold text-slate-900">
                {formatValue(activeItem.value)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-slate-400">
              <span>Relative Share:</span>
              <span className="font-medium text-amber-700">
                {Math.round((activeItem.value / scaleMax) * 100)}% of peak
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <BarChart3 className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Bar Canvas */}
      <div className="flex-1 flex flex-col justify-center py-2 space-y-3.5">
        {sortedItems.map((item, idx) => {
          const barPct = Math.min(100, Math.max(4, (item.value / scaleMax) * 100));
          const barColor = item.color || defaultPalette[idx % defaultPalette.length];
          const isHovered = hoveredId === item.id;

          return (
            <div
              key={item.id}
              className={`group rounded-lg p-2 transition-all cursor-pointer border ${
                isHovered
                  ? 'border-amber-300 bg-amber-50/50 shadow-2xs'
                  : 'border-slate-100/80 bg-white hover:border-slate-200'
              }`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Row Header: Title and Numerical Value only */}
              <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: barColor }}
                  />
                  <span className="font-semibold text-slate-900 truncate text-[11.5px] group-hover:text-amber-900">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                    style={{
                      backgroundColor: `${barColor}18`,
                      color: barColor
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              </div>

              {/* Perfectly Aligned Progress Bar Track */}
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: mounted ? `${barPct}%` : '0%',
                    backgroundColor: barColor,
                    filter: isHovered ? 'brightness(1.08)' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}

        {sortedItems.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400">
            No active expeditions available for ranking.
          </div>
        )}

        {/* Bottom Mathematical Axis Guide matching the 100% width of the bars */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 px-1">
            {axisSteps.map((step, idx) => (
              <span key={idx}>
                {step}
              </span>
            ))}
          </div>
          <div className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
            {axisLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
