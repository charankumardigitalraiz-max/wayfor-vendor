import React, { useState, useEffect } from 'react';

export interface HeatmapCell {
  x: string; // Column label, e.g., 'Jan', 'Feb' or 'W1', 'W2'
  y: string; // Row label, e.g., 'Mon', 'Tue'
  value: number;
  tooltipText?: string;
}

interface HeatmapChartProps {
  title: string;
  subtitle?: string;
  xLabels?: string[];
  yLabels?: string[];
  data: HeatmapCell[];
  legendLabelLow?: string;
  legendLabelHigh?: string;
  className?: string;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({
  title,
  subtitle,
  xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  yLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data,
  legendLabelLow = 'Less activity',
  legendLabelHigh = 'More activity',
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ x: string; y: string; value: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  // 5 intensity levels matching heatmap.png (from light periwinkle to deep violet)
  const colorScale = [
    '#EDF2F7', // 0: no/min activity
    '#DBEAFE', // 1: low
    '#93C5FD', // 2: moderate
    '#60A5FA', // 3: high
    '#3B82F6', // 4: very high
    '#6366F1', // 5: surge
    '#4F46E5'  // 6: peak
  ];

  const getColor = (val: number) => {
    if (val === 0) return colorScale[0];
    const ratio = Math.min(1, val / maxValue);
    const index = Math.min(colorScale.length - 1, Math.ceil(ratio * (colorScale.length - 1)));
    return colorScale[index];
  };

  // Quick lookup dictionary for cell value
  const valueMap = new Map<string, number>();
  data.forEach((d) => {
    valueMap.set(`${d.x}_${d.y}`, d.value);
  });

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
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Activity Matrix
        </span>
      </div>

      {/* Heatmap Grid (matching heatmap.png) */}
      <div className="flex-1 flex flex-col justify-center py-2 overflow-x-auto">
        <div className="min-w-[420px]">
          {/* Top X-Axis Header */}
          <div className="flex items-center pl-12 pr-2 mb-2">
            {xLabels.map((xl) => (
              <div
                key={xl}
                className="flex-1 text-center text-[11px] font-semibold text-slate-500 truncate"
              >
                {xl}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-1.5">
            {yLabels.map((yl) => (
              <div key={yl} className="flex items-center gap-2">
                {/* Left Y-Axis Label */}
                <span className="w-10 shrink-0 text-right text-xs font-medium text-slate-500 pr-1">
                  {yl}
                </span>

                {/* Row Cells */}
                <div className="flex-1 flex items-center gap-1.5">
                  {xLabels.map((xl) => {
                    const val = valueMap.get(`${xl}_${yl}`) ?? 0;
                    const bg = getColor(val);
                    const isHovered = hoveredCell?.x === xl && hoveredCell?.y === yl;

                    return (
                      <div
                        key={xl}
                        className="flex-1 aspect-square rounded-md transition-all duration-200 cursor-pointer relative group"
                        style={{
                          backgroundColor: mounted ? bg : '#F1F5F9',
                          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                          zIndex: isHovered ? 20 : 1
                        }}
                        onMouseEnter={() => setHoveredCell({ x: xl, y: yl, value: val })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {/* Detail tooltip */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 text-white text-[10px] rounded-md shadow-lg pointer-events-none whitespace-nowrap z-30">
                            <span className="font-bold">{yl}, {xl}:</span> {val.toLocaleString()} actions
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Activity Gradient Legend (matching heatmap.png) */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-xs text-slate-500">
        <span className="text-[11px] font-medium">{legendLabelLow}</span>
        <div className="flex items-center gap-1">
          {colorScale.map((c, i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-sm shrink-0"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium">{legendLabelHigh}</span>
      </div>
    </div>
  );
};
