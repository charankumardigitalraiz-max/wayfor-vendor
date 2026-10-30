import React, { useState, useMemo } from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import type { ConcertEvent, TripPlan, StrangerMeet } from '../../types';

export interface ModuleDistributionDonutChartProps {
  concerts?: ConcertEvent[];
  trips?: TripPlan[];
  strangerMeets?: StrangerMeet[];
  assignedModules?: string[];
  formatCurrency?: (val: number) => string;
}

export const ModuleDistributionDonutChart: React.FC<ModuleDistributionDonutChartProps> = ({
  concerts = [],
  trips = [],
  strangerMeets = [],
  assignedModules = ['concerts', 'trips', 'stranger-meets'],
  formatCurrency: customFormatCurrency
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const formatCurrency = customFormatCurrency || ((val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  });

  const hasConcerts = assignedModules.includes('concerts');
  const hasTrips = assignedModules.includes('trips');
  const hasMeets = assignedModules.includes('stranger-meets');

  // Real calculations directly from incoming data arrays
  const concertsRev = useMemo(() => {
    return concerts.reduce((acc, c) => acc + (c.ticketsSold * ((c.minPrice + c.maxPrice) / 2)), 0);
  }, [concerts]);

  const concertsVolume = useMemo(() => {
    return concerts.reduce((acc, c) => acc + (c.ticketsSold || 0), 0);
  }, [concerts]);

  const tripsRev = useMemo(() => {
    return trips.reduce((acc, t) => acc + ((t.joinedTravelers?.length || 0) * (t.estimatedBudget || 0)), 0);
  }, [trips]);

  const tripsVolume = useMemo(() => {
    return trips.reduce((acc, t) => acc + (t.joinedTravelers?.length || 0), 0);
  }, [trips]);

  const meetsRev = useMemo(() => {
    return strangerMeets.reduce((acc, m) => acc + ((m.participants?.length || 0) * (m.pricePerPerson || 0)), 0);
  }, [strangerMeets]);

  const meetsVolume = useMemo(() => {
    return strangerMeets.reduce((acc, m) => acc + (m.participants?.length || 0), 0);
  }, [strangerMeets]);

  const totalCalculatedRevenue = useMemo(() => {
    let sum = 0;
    if (hasConcerts) sum += concertsRev;
    if (hasTrips) sum += tripsRev;
    if (hasMeets) sum += meetsRev;
    return sum;
  }, [hasConcerts, hasTrips, hasMeets, concertsRev, tripsRev, meetsRev]);

  const segments = useMemo(() => {
    const raw = [
      {
        id: 'concerts',
        name: 'Concerts & Live Events',
        shortName: 'Concerts',
        enabled: hasConcerts,
        value: concertsRev,
        volume: concertsVolume,
        unit: 'tickets',
        count: concerts.length,
        color: '#8B5CF6',
        hoverColor: '#7C3AED'
      },
      {
        id: 'trips',
        name: 'Trip Planner & Expeditions',
        shortName: 'Trips',
        enabled: hasTrips,
        value: tripsRev,
        volume: tripsVolume,
        unit: 'travelers',
        count: trips.length,
        color: '#F59E0B',
        hoverColor: '#D97706'
      },
      {
        id: 'stranger-meets',
        name: 'Stranger Meets & Socials',
        shortName: 'Meets',
        enabled: hasMeets,
        value: meetsRev,
        volume: meetsVolume,
        unit: 'buddies',
        count: strangerMeets.length,
        color: '#10B981',
        hoverColor: '#059669'
      }
    ].filter((s) => s.enabled);

    const sumVal = raw.reduce((acc, s) => acc + s.value, 0) || 1;
    let accumulatedAngle = -90;

    return raw.map((s) => {
      const percentage = sumVal > 0 ? Math.round((s.value / sumVal) * 100) : 0;
      const angle = sumVal > 0 ? (s.value / sumVal) * 360 : 0;
      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + angle;
      accumulatedAngle += angle;

      return {
        ...s,
        percentage,
        startAngle,
        endAngle
      };
    });
  }, [hasConcerts, hasTrips, hasMeets, concertsRev, concertsVolume, concerts.length, tripsRev, tripsVolume, trips.length, meetsRev, meetsVolume, strangerMeets.length]);

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

  const activeDonut = hoveredSegment ? segments.find((s) => s.id === hoveredSegment) : null;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <PieIcon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-tight text-slate-900">
                Cross-Vertical Revenue Contribution
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated proportional gross revenue volume from your active listings.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
        {/* SVG Donut Ring */}
        <div className="relative shrink-0 w-44 h-44">
          <svg viewBox="0 0 200 200" className="w-full h-full select-none">
            {segments.map((seg) => {
              const isHovered = hoveredSegment === seg.id;
              const innerR = isHovered ? 52 : 56;
              const outerR = isHovered ? 86 : 82;
              const path = createDonutArc(100, 100, innerR, outerR, seg.startAngle, seg.endAngle);

              return (
                <path
                  key={seg.id}
                  d={path}
                  fill={isHovered ? seg.hoverColor : seg.color}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredSegment(seg.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}
          </svg>

          {/* Center Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {activeDonut ? activeDonut.shortName : 'TOTAL'}
            </span>
            <span className="text-lg font-bold text-slate-900 leading-tight">
              {activeDonut ? `${activeDonut.percentage}%` : '100%'}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {activeDonut ? formatCurrency(activeDonut.value) : formatCurrency(totalCalculatedRevenue)}
            </span>
          </div>
        </div>

        {/* Dynamic Data Cards */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {segments.map((seg) => {
            const isHovered = hoveredSegment === seg.id;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredSegment(seg.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`rounded-lg border p-3 transition-all cursor-pointer flex items-center justify-between ${isHovered
                  ? 'border-indigo-400 bg-indigo-50/50 shadow-xs'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-white'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900">
                      {seg.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {seg.count} active • {seg.volume.toLocaleString()} {seg.unit}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {formatCurrency(seg.value)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {seg.percentage}% of total
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
