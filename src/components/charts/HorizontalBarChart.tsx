import React, { useState, useEffect } from 'react';

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
  axisLabel = 'Count',
  formatValue = (v) => v.toLocaleString(),
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const maxValue = Math.max(...items.map((i) => i.value), 10);
  // Round max value up to clean step
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const roundedMax = Math.ceil(maxValue / magnitude) * magnitude || 100;

  // 5 axis steps
  const axisSteps = [
    0,
    Math.round(roundedMax * 0.25),
    Math.round(roundedMax * 0.5),
    Math.round(roundedMax * 0.75),
    roundedMax
  ];

  // Default gradient progression matching horizontal-bar-chart.png (from bright vibrant blue to lavender)
  const defaultColors = [
    '#3B82F6', // Top (Blue)
    '#60A5FA',
    '#6366F1',
    '#818CF8',
    '#A78BFA',
    '#C084FC',
    '#DDD6FE'
  ];

  return (
    <div className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Ranked Comparison
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 flex flex-col justify-center py-2 relative">
        {/* Background Vertical Dashed Guide Lines */}
        <div className="absolute inset-y-6 left-36 right-16 pointer-events-none flex justify-between z-0">
          {axisSteps.map((step, idx) => (
            <div
              key={idx}
              className="h-full border-r border-dashed border-slate-200/70"
            />
          ))}
        </div>

        {/* Horizontal Bars */}
        <div className="space-y-3 relative z-10">
          {items.map((item, idx) => {
            const barPct = Math.min(100, Math.max(3, (item.value / roundedMax) * 100));
            const barColor = item.color || defaultColors[idx % defaultColors.length];
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 group cursor-pointer"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Left Category Label */}
                <div className="w-32 shrink-0 text-right pr-2">
                  <span
                    className={`text-xs font-semibold block truncate transition-colors ${
                      isHovered ? 'text-blue-700 font-bold' : 'text-slate-700'
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                  {item.subtext && (
                    <span className="text-[10px] text-slate-400 block truncate">
                      {item.subtext}
                    </span>
                  )}
                </div>

                {/* Bar Container */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 h-7 rounded-r-lg bg-slate-50 overflow-hidden relative">
                    <div
                      className="h-full rounded-r-lg transition-all duration-700 ease-out flex items-center justify-end pr-2"
                      style={{
                        width: mounted ? `${barPct}%` : '0%',
                        backgroundColor: barColor,
                        filter: isHovered ? 'brightness(1.08)' : 'none'
                      }}
                    />
                  </div>

                  {/* Value on the right */}
                  <span
                    className={`text-xs font-bold shrink-0 min-w-[50px] transition-colors ${
                      isHovered ? 'text-blue-700 scale-105' : 'text-slate-800'
                    }`}
                  >
                    {formatValue(item.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Numeric Axis (matching horizontal-bar-chart.png) */}
        <div className="ml-36 mr-16 pt-3 mt-2 border-t border-slate-200 flex justify-between text-[10px] font-semibold text-slate-400">
          {axisSteps.map((step, idx) => (
            <span key={idx} className="-translate-x-1/2">
              {formatValue(step)}
            </span>
          ))}
        </div>
        <div className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
          {axisLabel}
        </div>
      </div>
    </div>
  );
};
