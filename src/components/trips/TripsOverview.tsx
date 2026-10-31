import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Users,
  TrendingUp,
  Plus,
  ShieldCheck,
  Luggage
} from 'lucide-react';
import type { TripPlan } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { CreateTripModal } from './CreateTripModal';
import {
  ModuleTrendLineChart,
  ModuleInventoryFillChart,
  FunnelChart,
  HorizontalBarChart,
  type Timeframe
} from '../charts';

interface TripsOverviewProps {
  trips: TripPlan[];
  onOpenCreateTrip?: () => void;
  onSelectTrip?: (trip: TripPlan) => void;
  onAddTrip?: (trip: TripPlan) => void;
  onShowToast?: (text: string, type?: 'success' | 'error' | 'info') => void;
  currentVendorName?: string;
}

export const TripsOverview: React.FC<TripsOverviewProps> = ({
  trips,
  onOpenCreateTrip,
  onSelectTrip,
  onAddTrip,
  onShowToast,
  currentVendorName = 'Wayfor Tours'
}) => {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [timeframe, setTimeframe] = React.useState<Timeframe>('30D');

  // Metrics calculations
  const activeTrips = useMemo(() => trips.filter(t => t.status === 'active' || t.status === 'upcoming'), [trips]);
  const totalTravelers = useMemo(() => trips.reduce((sum, t) => sum + (t.joinedTravelers?.length || 0), 0), [trips]);
  const totalCapacity = useMemo(() => trips.reduce((sum, t) => sum + (t.maxTravelers || 1), 0), [trips]);

  const totalGMV = useMemo(() => {
    return trips.reduce((sum, t) => {
      const travelersCount = t.joinedTravelers?.length || 0;
      return sum + (travelersCount * (t.estimatedBudget || 0));
    }, 0);
  }, [trips]);

  const avgOccupancy = totalCapacity > 0 ? Math.round((totalTravelers / totalCapacity) * 100) : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakh`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h1 className="PageTitle">
                Trips Overview
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Monitor curated road trips, multi-day Himalayan treks, group traveler rosters, and expedition logistics.
              </p>
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => navigate('/trips/companions')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
          >
            <Users className="h-3.5 w-3.5 text-amber-600" />
            <span>Companions Roster</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (onOpenCreateTrip) onOpenCreateTrip();
              else setIsCreateOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-xs shadow-amber-200 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Plan New Expedition</span>
          </button>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Expedition Volume"
          value={formatCurrency(totalGMV)}
          isPositive={true}
          icon={TrendingUp}
          accentColor="amber"
        />

        <MetricCard
          label="Confirmed Companions"
          value={totalTravelers.toLocaleString()}
          isPositive={true}
          icon={Users}
          accentColor="cyan"
        />

        <MetricCard
          label="Active Itineraries"
          value={`${activeTrips.length}`}
          isPositive={true}
          icon={Luggage}
          accentColor="emerald"
        />

        <MetricCard
          label="Average Fill Rate"
          value={`${avgOccupancy}%`}
          isPositive={avgOccupancy >= 60}
          icon={ShieldCheck}
          accentColor="purple"
        />
      </div>

      {/* Expedition Analytics Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelChart
          title="Expedition Booking Funnel"
          subtitle="Itinerary discovery through confirmed companion bookings"
          unit="travelers"
          tiers={[
            {
              id: 'views',
              label: 'Tour Itinerary Visitors',
              value: Math.max(1800, totalTravelers * 28),
              badgeText: '100%'
            },
            {
              id: 'waypoints',
              label: 'Waypoints & Stays Explored',
              value: Math.max(760, Math.round(totalTravelers * 11.5)),
              badgeText: '42%'
            },
            {
              id: 'applications',
              label: 'Companion Slot Applications',
              value: Math.max(210, Math.round(totalTravelers * 3.2)),
              badgeText: '12%'
            },
            {
              id: 'confirmed',
              label: 'Confirmed Travelers',
              value: totalTravelers,
              badgeText: `${((totalTravelers / Math.max(1800, totalTravelers * 28)) * 100).toFixed(1)}%`
            }
          ]}
        />

        <HorizontalBarChart
          title="Top Booked Expeditions"
          axisLabel="Travelers"
          items={trips.slice(0, 5).map((t, idx) => ({
            id: t.id,
            label: t.title,
            value: t.joinedTravelers?.length || 0,
            subtext: `${t.origin} ➔ ${t.destination}`,
            color: ['#D97706', '#EA580C', '#F59E0B', '#0D9488', '#8B5CF6'][idx % 5]
          }))}
        />
      </div>

      {/* Key Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModuleTrendLineChart
          title="Expedition Booking Velocity"
          accentColor="amber"
          totalAmount={totalGMV}
          totalVolume={totalTravelers}
          unit="travelers"
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          formatCurrency={formatCurrency}
          subtext={trips.map(t => `${t.origin} ➔ ${t.destination}`).slice(0, 2).join(' • ')}
        />

        <ModuleInventoryFillChart
          title="Itinerary Slots & Group Occupancy"
          accentColor="amber"
          items={trips.map(t => {
            const cap = t.maxTravelers || 1;
            const joined = t.joinedTravelers?.length || 0;
            return {
              id: t.id,
              title: t.title,
              subtitle: `${t.origin} ➔ ${t.destination} • ${t.totalDays || 3} Days`,
              filled: joined,
              capacity: cap,
              fillPct: Math.min(100, Math.round((joined / cap) * 100)),
              revenue: joined * (t.estimatedBudget || 0),
              unit: 'travelers',
              tag: t.category
            };
          })}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Create Expedition Modal */}
      <CreateTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddTrip={(newTrip) => {
          if (onAddTrip) onAddTrip(newTrip);
          if (onShowToast) onShowToast(`Expedition "${newTrip.title}" planned successfully!`);
          setIsCreateOpen(false);
        }}
        currentVendorName={currentVendorName}
      />
    </div>
  );
};
