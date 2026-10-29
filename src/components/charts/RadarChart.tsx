import React, { useState, useEffect } from 'react';

export interface RadarDimension {
  key: string;
  label: string;
  max?: number;
}

export interface RadarSeries {
  id: string;
  name: string;
  color: string;
  fillColor?: string;
  values: Record<string, number>; // key -> value (0 to 100)
}

interface RadarChartProps {
  title: string;
  subtitle?: string;
  dimensions: RadarDimension[];
  series: RadarSeries[];
  className?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  title,
  subtitle,
  dimensions,
  series,
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Geometry: SVG 500 x 420
  const cx = 250;
  const cy = 200;
  const radius = 135;
  const numAxes = dimensions.length;
  const gridLevels = [20, 40, 60, 80, 100];

  // Calculate vertex position for angle and radius
  const getVertex = (index: number, r: number) => {
    // Start at top (-90 degrees)
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / numAxes;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  // Build polygon path for a given radius or series
  const getGridPolygon = (r: number) => {
    return dimensions
      .map((_, i) => {
        const pt = getVertex(i, r);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  };

  const getSeriesPolygon = (s: RadarSeries, animFactor: number) => {
    return dimensions
      .map((dim, i) => {
        const val = s.values[dim.key] ?? 50;
        const normalized = Math.min(100, Math.max(0, val)) / 100;
        const pt = getVertex(i, radius * normalized * animFactor);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  };

  return (
    <div className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-1">
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
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          Multi-Axis Radar
        </span>
      </div>

      {/* SVG Radar Visualization */}
      <div className="flex-1 flex items-center justify-center py-2 relative">
        <svg
          viewBox="0 0 500 400"
          className="w-full max-w-[380px] h-auto overflow-visible select-none"
        >
          {/* Concentric Grid Polygons (matching radar-chart.png) */}
          {gridLevels.map((level) => {
            const r = (level / 100) * radius;
            return (
              <polygon
                key={level}
                points={getGridPolygon(r)}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Radial Spokes */}
          {dimensions.map((_, i) => {
            const pt = getVertex(i, radius);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={pt.x}
                y2={pt.y}
                stroke="#E2E8F0"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Grid Level Value Labels along top vertical axis */}
          {gridLevels.map((level) => {
            const r = (level / 100) * radius;
            return (
              <text
                key={level}
                x={cx + 4}
                y={cy - r + 10}
                fill="#94A3B8"
                fontSize="10"
                fontWeight="600"
              >
                {level}
              </text>
            );
          })}

          {/* Series Polygons */}
          {series.map((s, idx) => {
            const isFaded = activeSeriesId && activeSeriesId !== s.id;
            const isHighlighted = activeSeriesId === s.id;
            const factor = mounted ? 1 : 0.05;

            return (
              <g
                key={s.id}
                className="transition-all duration-300"
                opacity={isFaded ? 0.3 : 1}
              >
                {/* Polygon fill & stroke */}
                <polygon
                  points={getSeriesPolygon(s, factor)}
                  fill={s.fillColor || `${s.color}25`}
                  stroke={s.color}
                  strokeWidth={isHighlighted ? 3 : 2}
                  className="transition-all duration-700 ease-out"
                />

                {/* Vertex Dots */}
                {mounted &&
                  dimensions.map((dim, i) => {
                    const val = s.values[dim.key] ?? 50;
                    const normalized = Math.min(100, Math.max(0, val)) / 100;
                    const pt = getVertex(i, radius * normalized);
                    return (
                      <circle
                        key={dim.key}
                        cx={pt.x}
                        cy={pt.y}
                        r={isHighlighted ? 5 : 3.5}
                        fill="#FFFFFF"
                        stroke={s.color}
                        strokeWidth="2.5"
                        className="transition-all duration-200"
                      />
                    );
                  })}
              </g>
            );
          })}

          {/* Axis Labels (Positioned outward from vertices) */}
          {dimensions.map((dim, i) => {
            const pt = getVertex(i, radius + 22);
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (pt.x > cx + 15) textAnchor = 'start';
            else if (pt.x < cx - 15) textAnchor = 'end';

            return (
              <text
                key={dim.key}
                x={pt.x}
                y={pt.y + 4}
                textAnchor={textAnchor}
                fill="#334155"
                fontSize="12"
                fontWeight="600"
              >
                {dim.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Bottom Series Legend (matching radar-chart.png) */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs">
        {series.map((s) => {
          const isSelected = activeSeriesId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSeriesId(isSelected ? null : s.id)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                isSelected ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50 font-medium text-slate-700'
              }`}
            >
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span>{s.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
