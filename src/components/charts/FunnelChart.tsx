import React, { useState, useEffect } from 'react';

export interface FunnelTier {
  id: string;
  label: string;
  value: number;
  subtext?: string;
  color?: string; // Optional custom fill
  badgeColor?: string; // Pill color
  badgeText?: string;
}

interface FunnelChartProps {
  title: string;
  subtitle?: string;
  tiers: FunnelTier[];
  unit?: string;
  className?: string;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
  title,
  subtitle,
  tiers,
  unit = '',
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredTierId, setHoveredTierId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Default color palette matching funnel-chart.png reference
  const defaultColors = [
    { fill: '#3B82F6', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' }, // Visitors (Blue)
    { fill: '#14B8A6', badgeBg: 'bg-teal-50 text-teal-700 border-teal-200' }, // Leads (Teal)
    { fill: '#8B5CF6', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' }, // Trials (Purple)
    { fill: '#F97316', badgeBg: 'bg-orange-50 text-orange-700 border-orange-200' } // Customers (Orange)
  ];

  const totalBase = tiers.length > 0 && tiers[0].value > 0 ? tiers[0].value : 1;

  // Calculate trapezoid geometry for SVG funnel
  // SVG coordinates: 600 width x 360 height
  const svgWidth = 520;
  const svgHeight = 280;
  const numTiers = tiers.length;
  const tierHeight = (svgHeight - (numTiers - 1) * 8) / numTiers;

  // Funnel widths from top to bottom
  const topMaxWidth = 480;
  const bottomMinWidth = 120;

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
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Funnel Analysis
        </span>
      </div>

      {/* Funnel Layout */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="w-full max-w-lg flex items-center gap-4">
          {/* SVG Tapered Tiers */}
          <div className="flex-1 relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
              style={{ maxHeight: '250px' }}
            >
              <defs>
                <filter id="funnelShadow" x="-5%" y="-5%" width="110%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.1" />
                </filter>
              </defs>

              {tiers.map((tier, idx) => {
                const palette = defaultColors[idx % defaultColors.length];
                const fillColor = tier.color || palette.fill;
                const isHovered = hoveredTierId === tier.id;

                // Taper interpolation
                const tTop = idx / numTiers;
                const tBottom = (idx + 1) / numTiers;

                const topW = topMaxWidth - tTop * (topMaxWidth - bottomMinWidth);
                const botW = topMaxWidth - tBottom * (topMaxWidth - bottomMinWidth);

                const y = idx * (tierHeight + 8);
                const topX1 = (svgWidth - topW) / 2;
                const topX2 = topX1 + topW;
                const botX1 = (svgWidth - botW) / 2;
                const botX2 = botX1 + botW;

                const pathData = `M ${topX1} ${y} L ${topX2} ${y} L ${botX2} ${y + tierHeight} L ${botX1} ${y + tierHeight} Z`;

                const pctOfTotal = ((tier.value / totalBase) * 100).toFixed(1);

                return (
                  <g
                    key={tier.id}
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => setHoveredTierId(tier.id)}
                    onMouseLeave={() => setHoveredTierId(null)}
                    style={{
                      transformOrigin: `${svgWidth / 2}px ${y + tierHeight / 2}px`,
                      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                      opacity: mounted ? 1 : 0,
                      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s`
                    }}
                  >
                    {/* Shadow / Tier polygon */}
                    <path
                      d={pathData}
                      fill={fillColor}
                      filter="url(#funnelShadow)"
                      className="transition-all duration-200"
                      opacity={isHovered ? 1 : 0.94}
                    />

                    {/* Subtle top glossy highlight */}
                    <path
                      d={`M ${topX1 + 2} ${y + 1} L ${topX2 - 2} ${y + 1} L ${topX2 - 4} ${y + 3} L ${topX1 + 4} ${y + 3} Z`}
                      fill="#FFFFFF"
                      opacity="0.25"
                    />

                    {/* Text inside tier */}
                    <text
                      x={svgWidth / 2}
                      y={y + tierHeight / 2 - 8}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="12"
                      fontWeight="600"
                      className="pointer-events-none drop-shadow-xs"
                    >
                      {tier.label}
                    </text>
                    <text
                      x={svgWidth / 2}
                      y={y + tierHeight / 2 + 13}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="16"
                      fontWeight="800"
                      className="pointer-events-none tracking-tight drop-shadow-xs"
                    >
                      {tier.value.toLocaleString()} {unit}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right-side Conversion Badges (matching funnel-chart.png) */}
          <div className="flex flex-col justify-between py-1 shrink-0 space-y-4">
            {tiers.map((tier, idx) => {
              const palette = defaultColors[idx % defaultColors.length];
              const pct = idx === 0 ? 100 : Math.round((tier.value / totalBase) * 1000) / 10;
              const isHovered = hoveredTierId === tier.id;

              return (
                <div
                  key={tier.id}
                  className="flex items-center"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'none' : 'translateX(10px)',
                    transition: `all 0.4s ease-out ${idx * 0.12}s`
                  }}
                >
                  <span
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs tracking-tight border transition-all ${
                      tier.badgeColor || palette.badgeBg
                    } ${isHovered ? 'scale-110 shadow-xs' : ''}`}
                  >
                    {tier.badgeText || `${pct}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Overall Funnel Yield</span>
        <span className="font-semibold text-slate-800">
          {tiers.length > 0 ? `${((tiers[tiers.length - 1].value / totalBase) * 100).toFixed(1)}% Conversion` : '0%'}
        </span>
      </div>
    </div>
  );
};
