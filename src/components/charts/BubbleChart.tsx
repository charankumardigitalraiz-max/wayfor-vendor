import React, { useState, useEffect } from 'react';

export interface BubbleItem {
  id: string;
  name: string;
  x: number; // e.g. RSVPs / Members (0 to 300)
  y: number; // e.g. Growth Rate % (-10 to 50)
  size: number; // e.g. Revenue / Magnitude (determines circle radius)
  category: string;
  color?: string;
  metricText?: string;
}

interface BubbleChartProps {
  title: string;
  subtitle?: string;
  bubbles: BubbleItem[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  sizeLabel?: string;
  className?: string;
}

export const BubbleChart: React.FC<BubbleChartProps> = ({
  title,
  subtitle,
  bubbles,
  xAxisLabel = 'Participants / RSVPs',
  yAxisLabel = 'Growth Rate (%)',
  sizeLabel = 'Bubble size represents revenue (larger = higher revenue)',
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredBubbleId, setHoveredBubbleId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Category palette matching bubble-chart.png
  const categoryColors: Record<string, string> = {
    Music: '#14B8A6',
    Outdoor: '#3B82F6',
    Social: '#8B5CF6',
    Lifestyle: '#F97316',
    Tech: '#EC4899',
    General: '#6366F1'
  };

  // SVG Geometry: 600 x 380
  const svgW = 600;
  const svgH = 340;
  const padLeft = 60;
  const padRight = 50;
  const padTop = 30;
  const padBottom = 50;

  const chartW = svgW - padLeft - padRight;
  const chartH = svgH - padTop - padBottom;

  // Domain ranges
  const minX = 0;
  const maxX = Math.max(300, ...bubbles.map((b) => b.x * 1.15));
  const minY = -10;
  const maxY = 50;

  const getCanvasX = (val: number) => {
    return padLeft + ((val - minX) / (maxX - minX)) * chartW;
  };

  const getCanvasY = (val: number) => {
    return padTop + chartH - ((val - minY) / (maxY - minY)) * chartH;
  };

  // Radius mapping: from 14px to 38px
  const minSize = Math.min(...bubbles.map((b) => b.size), 1);
  const maxSize = Math.max(...bubbles.map((b) => b.size), 10);
  const getRadius = (sz: number) => {
    const r = 16 + ((sz - minSize) / (maxSize - minSize || 1)) * 24;
    return Math.max(14, Math.min(40, r));
  };

  // Unique categories for legend
  const categories = Array.from(new Set(bubbles.map((b) => b.category)));

  // Grid ticks
  const xTicks = [0, Math.round(maxX * 0.2), Math.round(maxX * 0.4), Math.round(maxX * 0.6), Math.round(maxX * 0.8), Math.round(maxX)];
  const yTicks = [-10, 0, 10, 20, 30, 40, 50];

  return (
    <div className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between ${className}`}>
      {/* Header with Top-Right Category Legend (matching bubble-chart.png) */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 mb-2 gap-2">
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

        {/* Categories Legend */}
        <div className="flex items-center gap-3">
          {categories.map((cat) => {
            const col = categoryColors[cat] || '#3B82F6';
            return (
              <div key={cat} className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col }} />
                <span>{cat}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Scatter Chart */}
      <div className="flex-1 flex items-center justify-center relative py-1">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Subtle Grid Lines (matching bubble-chart.png) */}
          {yTicks.map((yt) => {
            const y = getCanvasY(yt);
            return (
              <g key={yt}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgW - padRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="10"
                  fontWeight="600"
                >
                  {yt}
                </text>
              </g>
            );
          })}

          {xTicks.map((xt) => {
            const x = getCanvasX(xt);
            return (
              <g key={xt}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + chartH}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padTop + chartH + 18}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="10"
                  fontWeight="600"
                >
                  {xt}
                </text>
              </g>
            );
          })}

          {/* Solid 0-lines */}
          <line
            x1={padLeft}
            y1={getCanvasY(0)}
            x2={svgW - padRight}
            y2={getCanvasY(0)}
            stroke="#94A3B8"
            strokeWidth="1"
          />
          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={padTop + chartH}
            stroke="#94A3B8"
            strokeWidth="1"
          />

          {/* Bubbles */}
          {bubbles.map((b, idx) => {
            const cx = getCanvasX(b.x);
            const cy = getCanvasY(b.y);
            const r = getRadius(b.size);
            const col = b.color || categoryColors[b.category] || '#3B82F6';
            const isHovered = hoveredBubbleId === b.id;

            return (
              <g
                key={b.id}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredBubbleId(b.id)}
                onMouseLeave={() => setHoveredBubbleId(null)}
              >
                {/* Bubble Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={mounted ? (isHovered ? r * 1.12 : r) : 0}
                  fill={col}
                  opacity={isHovered ? 0.95 : 0.85}
                  className="transition-all duration-700 ease-out"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none',
                    transitionDelay: `${idx * 80}ms`
                  }}
                />

                {/* Text Label to the right of bubble (matching bubble-chart.png) */}
                {mounted && (
                  <g className="pointer-events-none">
                    <text
                      x={cx + r + 8}
                      y={cy - 2}
                      fill="#0F172A"
                      fontSize="11"
                      fontWeight="700"
                    >
                      {b.name}
                    </text>
                    {b.metricText && (
                      <text
                        x={cx + r + 8}
                        y={cy + 12}
                        fill="#64748B"
                        fontSize="9.5"
                        fontWeight="500"
                      >
                        {b.metricText}
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padLeft + chartW / 2}
            y={svgH - 8}
            textAnchor="middle"
            fill="#475569"
            fontSize="11"
            fontWeight="600"
          >
            {xAxisLabel}
          </text>
          <text
            x={15}
            y={padTop + chartH / 2}
            textAnchor="middle"
            fill="#475569"
            fontSize="11"
            fontWeight="600"
            transform={`rotate(-90, 15, ${padTop + chartH / 2})`}
          >
            {yAxisLabel}
          </text>
        </svg>
      </div>

      {/* Explanatory footer note (matching bubble-chart.png) */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>{sizeLabel}</span>
      </div>
    </div>
  );
};
