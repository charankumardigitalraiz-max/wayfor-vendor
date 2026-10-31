import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BarChart2,
  TrendingDown,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface FunnelTier {
  id: string;
  label: string;
  value: number;
  subtext?: string;
  color?: string;
  badgeColor?: string;
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

  // Modern bar theme per stage
  const barColors = [
    {
      fill: '#3B82F6',
      gradient: 'from-blue-500 to-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      trackBg: 'bg-blue-50/50'
    },
    {
      fill: '#06B6D4',
      gradient: 'from-cyan-500 to-teal-500',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      trackBg: 'bg-cyan-50/50'
    },
    {
      fill: '#8B5CF6',
      gradient: 'from-purple-500 to-violet-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      trackBg: 'bg-purple-50/50'
    },
    {
      fill: '#10B981',
      gradient: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      trackBg: 'bg-emerald-50/50'
    }
  ];

  const totalBase = tiers.length > 0 && tiers[0].value > 0 ? tiers[0].value : 1;
  const finalTier = tiers.length > 0 ? tiers[tiers.length - 1] : null;
  const overallYieldPct = finalTier ? ((finalTier.value / totalBase) * 100).toFixed(1) : '0';

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
    return num.toLocaleString();
  };

  // Generate 4 clean X-axis step marks based on max value
  const xAxisTicks = useMemo(() => {
    return [0, totalBase * 0.25, totalBase * 0.5, totalBase * 0.75, totalBase];
  }, [totalBase]);

  const activeTier = hoveredTierId ? tiers.find((t) => t.id === hoveredTierId) : null;
  const activeTierIndex = activeTier ? tiers.findIndex((t) => t.id === activeTier.id) : -1;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredTierId(null);
        setMousePos(null);
      }}
      className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between relative ${className}`}
    >
      {/* Floating Interactive Tooltip */}
      {activeTier && mousePos && (
        <div
          className="absolute z-30 pointer-events-none rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-2 min-w-56 transition-transform duration-75"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: `translate(${
              mousePos.x < 140
                ? '12px'
                : containerRef.current && mousePos.x > containerRef.current.clientWidth - 140
                ? 'calc(-100% - 12px)'
                : '-50%'
            }, ${mousePos.y < 125 ? '16px' : 'calc(-100% - 14px)'})`
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    activeTier.color ||
                    barColors[activeTierIndex % barColors.length].fill
                }}
              />
              <span className="font-bold text-slate-900 truncate">
                {activeTier.label}
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
              Stage {activeTierIndex + 1}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Volume Count:</span>
              <span className="font-bold text-slate-900">
                {activeTier.value.toLocaleString()} {unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Overall Conversion:</span>
              <span className="font-semibold text-slate-800">
                {((activeTier.value / totalBase) * 100).toFixed(1)}% of top
              </span>
            </div>

            {activeTierIndex > 0 ? (
              <>
                <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                  <span className="text-slate-500">Step Conversion:</span>
                  <span className="font-semibold text-emerald-600">
                    {(
                      (activeTier.value / (tiers[activeTierIndex - 1].value || 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Stage Drop-off:</span>
                  <span className="font-medium text-rose-500">
                    -
                    {(
                      tiers[activeTierIndex - 1].value - activeTier.value
                    ).toLocaleString()}{' '}
                    {unit}
                  </span>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-100 pt-1 text-[10px] text-slate-400">
                Top baseline conversion reach (100%)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
          {overallYieldPct}% Overall Yield
        </span>
      </div>

      {/* Bar Graph Body */}
      <div className="py-1 space-y-3">
        {tiers.map((tier, idx) => {
          const color = barColors[idx % barColors.length];
          const pct = Math.min(100, (tier.value / totalBase) * 100);
          const isHovered = hoveredTierId === tier.id;
          const isAnyHovered = hoveredTierId !== null;

          return (
            <div
              key={tier.id}
              onMouseEnter={() => setHoveredTierId(tier.id)}
              className={`space-y-1.5 transition-all duration-150 cursor-pointer p-1 rounded-lg ${
                isHovered
                  ? 'bg-slate-50/80 -translate-y-0.5'
                  : isAnyHovered
                  ? 'opacity-60'
                  : ''
              }`}
            >
              {/* Row Label & Values */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800 truncate">
                    {tier.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-slate-900 text-xs">
                    {tier.value.toLocaleString()}{' '}
                    <span className="text-[10px] font-normal text-slate-400">
                      {unit}
                    </span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      tier.badgeColor || color.badgeBg
                    }`}
                  >
                    {tier.badgeText || `${pct.toFixed(1)}%`}
                  </span>
                </div>
              </div>

              {/* Horizontal Bar Track */}
              <div className="h-6 w-full bg-slate-100 rounded-md overflow-hidden relative border border-slate-200/60 p-0.5">
                <div
                  className={`h-full rounded-sm bg-gradient-to-r ${color.gradient} transition-all duration-700 ease-out flex items-center justify-end pr-2`}
                  style={{
                    width: mounted ? `${Math.max(4, pct)}%` : '0%'
                  }}
                >
                  {pct > 18 && (
                    <span className="text-[10px] font-bold text-white drop-shadow-xs select-none">
                      {formatNumber(tier.value)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* X-Axis Scale Grid */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 select-none px-1">
          {xAxisTicks.map((tick, i) => (
            <span key={i}>{formatNumber(tick)}</span>
          ))}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Stage-by-stage conversion velocity and ticket yield</span>
        </div>
        <span className="font-semibold text-slate-800">
          {overallYieldPct}% Net Admissions
        </span>
      </div>
    </div>
  );
};
