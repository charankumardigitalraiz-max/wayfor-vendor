import React, { useState, useEffect } from 'react';

interface GaugeChartProps {
  title: string;
  subtitle?: string;
  value: number; // 0 to 100
  metricLabel?: string;
  metricValue?: string;
  subtext?: string;
  segments?: {
    from: number;
    to: number;
    color: string;
    label?: string;
  }[];
  className?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  title,
  subtitle,
  value,
  metricLabel = 'Performance',
  metricValue,
  subtext,
  segments,
  className = ''
}) => {
  const [currentVal, setCurrentVal] = useState(0);

  // Default segments matching gauge-chart.png (Green, Yellow, Coral Red)
  const defaultSegments = [
    { from: 0, to: 40, color: '#10B981', label: 'Optimal' },
    { from: 40, to: 65, color: '#FBBF24', label: 'Surge' },
    { from: 65, to: 100, color: '#F87171', label: 'Peak / Sold Out' }
  ];

  const activeSegments = segments || defaultSegments;
  const clampedVal = Math.min(100, Math.max(0, value));

  useEffect(() => {
    // Animate needle smoothly from 0 to value on mount
    const timer = setTimeout(() => {
      setCurrentVal(clampedVal);
    }, 100);
    return () => clearTimeout(timer);
  }, [clampedVal]);

  // Geometry: SVG 400 x 250
  const cx = 200;
  const cy = 180;
  const outerR = 140;
  const innerR = 100;

  // Semicircle: from 180 deg (left) to 360 deg (right)
  // Angle for pct: startAngle = 180, endAngle = 360
  const getArcCoords = (pct: number, r: number) => {
    const angleInDeg = 180 + (pct / 100) * 180;
    const angleInRad = (angleInDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleInRad),
      y: cy + r * Math.sin(angleInRad)
    };
  };

  const createSegmentPath = (fromPct: number, toPct: number) => {
    // Slight gap between segments
    const gap = 0.8;
    const startP = Math.min(toPct, fromPct + (fromPct === 0 ? 0 : gap));
    const endP = Math.max(startP, toPct - (toPct === 100 ? 0 : gap));

    const p1 = getArcCoords(startP, outerR);
    const p2 = getArcCoords(endP, outerR);
    const p3 = getArcCoords(endP, innerR);
    const p4 = getArcCoords(startP, innerR);

    return `M ${p1.x} ${p1.y} A ${outerR} ${outerR} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerR} ${innerR} 0 0 0 ${p4.x} ${p4.y} Z`;
  };

  // Needle angle: -90 deg (at 0%) to +90 deg (at 100%)
  const needleAngle = -90 + (currentVal / 100) * 180;

  // Tick marks
  const ticks = [0, 20, 40, 60, 80, 100];

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
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Live Speedometer
        </span>
      </div>

      {/* Speedometer Arc SVG */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-1">
        <svg
          viewBox="0 0 400 230"
          className="w-full max-w-[340px] h-auto overflow-visible select-none"
        >
          {/* Segment Bands */}
          {activeSegments.map((seg, i) => (
            <path
              key={i}
              d={createSegmentPath(seg.from, seg.to)}
              fill={seg.color}
              className="transition-opacity duration-200 hover:opacity-90"
            />
          ))}

          {/* Ticks and numeric markers (matching gauge-chart.png) */}
          {ticks.map((t) => {
            const pText = getArcCoords(t, outerR + 18);
            const pTickInner = getArcCoords(t, outerR - 4);
            const pTickOuter = getArcCoords(t, outerR + 4);

            return (
              <g key={t}>
                {t > 0 && t < 100 && (
                  <line
                    x1={pTickInner.x}
                    y1={pTickInner.y}
                    x2={pTickOuter.x}
                    y2={pTickOuter.y}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}
                <text
                  x={pText.x}
                  y={pText.y + 4}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="12"
                  fontWeight="600"
                >
                  {t}
                </text>
              </g>
            );
          })}

          {/* Needle with Hub */}
          <g
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: `rotate(${needleAngle}deg)`,
              transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Tapered needle pointer */}
            <polygon
              points={`${cx - 5},${cy} ${cx + 5},${cy} ${cx},${cy - outerR + 12}`}
              fill="#1E293B"
            />
            {/* Dark Center Pivot Hub */}
            <circle cx={cx} cy={cy} r="14" fill="#1E293B" />
            <circle cx={cx} cy={cy} r="6" fill="#475569" />
          </g>
        </svg>

        {/* Big Performance Metric Below (matching gauge-chart.png) */}
        <div className="text-center -mt-6">
          <div className="text-3xl font-extrabold text-teal-700 tracking-tight">
            {metricValue || `${clampedVal}%`}
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            {metricLabel}
          </div>
          {subtext && (
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              {subtext}
            </p>
          )}
        </div>
      </div>

      {/* Segment Legend */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px]">
        {activeSegments.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-slate-600 font-medium">
              {s.label || `${s.from}-${s.to}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
