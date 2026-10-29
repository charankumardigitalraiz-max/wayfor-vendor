import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  Calendar,
  ShieldCheck,
  Luggage,
  Sparkles,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import type { TripPlan } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import { TripDetailModal } from './TripDetailModal';
import { CreateTripModal } from './CreateTripModal';
import {
  ModuleTrendLineChart,
  ModuleInventoryFillChart,
  RadarChart,
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
  const [selectedTripModal, setSelectedTripModal] = React.useState<TripPlan | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [timeframe, setTimeframe] = React.useState<Timeframe>('30D');
  const [chartView, setChartView] = React.useState<'radar-rank' | 'trend-fill'>('radar-rank');

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

  // Recent travelers roster preview
  const recentTravelers = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      avatar: string;
      tripTitle: string;
      joinedAt: string;
      pickupStop?: string;
      seatsBooked?: number;
    }> = [];

    trips.forEach((trip) => {
      (trip.joinedTravelers || []).forEach((trav) => {
        list.push({
          id: `${trip.id}-${trav.id}`,
          name: trav.name,
          avatar: trav.avatar,
          tripTitle: trip.title,
          joinedAt: trav.joinedAt,
          pickupStop: trav.pickupStop,
          seatsBooked: trav.seatsBooked || 1
        });
      });
    });

    return list.slice(0, 5);
  }, [trips]);

  // Categories breakdown
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    trips.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [trips]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Trips Overview
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor curated road trips, multi-day Himalayan treks, group traveler rosters, and expedition logistics.
          </p>
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
          value={`${activeTrips.length} Active`}
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

      {/* Chart Section Header with Chart Type Switcher */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Expeditions Intelligence & Quality Metrics
          </h3>
          <p className="text-[11px] text-slate-400">
            {chartView === 'radar-rank'
              ? 'Multi-dimensional expedition rating radar & ranked itinerary companion bookings'
              : 'Historical booking velocity wave & group occupancy utilization breakdown'}
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setChartView('radar-rank')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              chartView === 'radar-rank'
                ? 'bg-white text-amber-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Radar & Ranked
          </button>
          <button
            type="button"
            onClick={() => setChartView('trend-fill')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              chartView === 'trend-fill'
                ? 'bg-white text-amber-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Velocity & Donut
          </button>
        </div>
      </div>

      {/* Two Specialized Charts */}
      {chartView === 'radar-rank' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RadarChart
            title="Expedition Experience Radar"
            subtitle="Multi-attribute rating across top adventure tours"
            dimensions={[
              { key: 'scenic', label: 'Scenic Vibe' },
              { key: 'safety', label: 'Guide & Safety' },
              { key: 'comfort', label: 'Stay & Transit' },
              { key: 'value', label: 'Value for Money' },
              { key: 'pace', label: 'Itinerary Pace' }
            ]}
            series={[
              {
                id: 'trip-1',
                name: trips[0]?.title ? trips[0].title.slice(0, 20) : 'Ridge Trail',
                color: '#3B82F6',
                values: { scenic: 95, safety: 88, comfort: 82, value: 90, pace: 85 }
              },
              {
                id: 'trip-2',
                name: trips[1]?.title ? trips[1].title.slice(0, 20) : 'Coastal Expedition',
                color: '#A855F7',
                values: { scenic: 86, safety: 95, comfort: 92, value: 84, pace: 90 }
              },
              {
                id: 'trip-3',
                name: trips[2]?.title ? trips[2].title.slice(0, 20) : 'Forest Trek',
                color: '#F59E0B',
                values: { scenic: 92, safety: 86, comfort: 76, value: 94, pace: 80 }
              }
            ]}
          />

          <HorizontalBarChart
            title="Top Expeditions by Confirmed Companions"
            subtitle="Ranked companion bookings across current active itineraries"
            axisLabel="Confirmed Travelers"
            items={trips.slice(0, 6).map((t, idx) => ({
              id: t.id,
              label: t.title,
              subtext: `${t.origin} ➔ ${t.destination}`,
              value: t.joinedTravelers?.length || (idx === 0 ? 38 : idx === 1 ? 26 : 18 - idx * 2)
            }))}
            formatValue={(v) => `${v.toLocaleString()} companions`}
          />
        </div>
      ) : (
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
      )}

      {/* Categories & High-Level Summary */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(categoryStats).map(([cat, count]) => (
          <div
            key={cat}
            className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] text-slate-500 font-medium">{cat}</div>
              <div className="text-base font-semibold text-slate-900 mt-0.5">{count} Expeditions</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-semibold text-xs">
              {count}
            </div>
          </div>
        ))}
      </div> */}

      {/* Active & Priority Expeditions */}
      {/* <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Active Expedition Itineraries & Group Occupancy
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live capacity breakdown, route waypoints, and traveler slots status.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 cursor-pointer"
          >
            <span>View All Itineraries</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => {
            const joined = trip.joinedTravelers?.length || 0;
            const max = trip.maxTravelers || 1;
            const pct = Math.min(100, Math.round((joined / max) * 100));

            return (
              <div
                key={trip.id}
                onClick={() => {
                  setSelectedTripModal(trip);
                  if (onSelectTrip) onSelectTrip(trip);
                }}
                className="group rounded-xl border border-slate-200/90 bg-white p-4 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={trip.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'}
                      alt={trip.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
                        {trip.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${trip.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : trip.status === 'upcoming'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                        }`}>
                        {trip.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                    {trip.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-amber-600 shrink-0" />
                    <span>{trip.origin} → {trip.destination} ({trip.totalDays}D/{Math.max(1, trip.totalDays - 1)}N)</span>
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Traveler Slots</span>
                    <span className="font-semibold text-amber-800">
                      {joined} / {max} Booked ({pct}%)
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-800 font-semibold">
                      ₹{trip.estimatedBudget?.toLocaleString()} <span className="text-slate-400 font-normal">/person</span>
                    </span>
                    <span className="text-amber-700 font-semibold group-hover:underline inline-flex items-center gap-1">
                      Itinerary <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Confirmed Companions Feed Preview */}
      {/* <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Recent Companion Registrations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified travel companions booked on upcoming agency expeditions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/trips/companions')}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 cursor-pointer"
          >
            <span>View Full Roster</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTravelers.map((traveler) => (
            <div key={traveler.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={traveler.avatar}
                  alt={traveler.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {traveler.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Booked on: <span className="text-amber-700 font-medium">{traveler.tripTitle}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-right">
                <div className="hidden sm:block text-[11px] text-slate-500">
                  Pickup: {traveler.pickupStop || 'Main Hub'}
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-100">
                  {traveler.seatsBooked} {traveler.seatsBooked === 1 ? 'Slot' : 'Slots'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Trip Details Modal */}
      {/* <TripDetailModal
        isOpen={Boolean(selectedTripModal)}
        trip={selectedTripModal}
        onClose={() => setSelectedTripModal(null)}
      /> */}

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
