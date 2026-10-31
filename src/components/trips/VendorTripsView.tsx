import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Compass,
  Plus,
  Filter,
  Calendar,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { TripPlan } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { TripCard } from './TripCard';
import { TripDetailModal } from './TripDetailModal';
import { CreateTripModal } from './CreateTripModal';
import { Table, type Column } from '../common/Table';
import { Badge } from '../common/Badge';
interface VendorTripsViewProps {
  trips: TripPlan[];
  onAddTrip: (trip: TripPlan) => void;
  onDeleteTrip: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  currentVendorName?: string;
  activeSubTab?: 'all-trips' | 'companions';
}

export const VendorTripsView: React.FC<VendorTripsViewProps> = ({
  trips,
  onAddTrip,
  onDeleteTrip,
  onShowToast,
  currentVendorName = 'Zenith Touring',
  activeSubTab = 'all-trips'
}) => {
  const [currentSubTab, setCurrentSubTab] = useState<'all-trips' | 'companions'>(activeSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [selectedTrip, setSelectedTrip] = useState<TripPlan | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const categories = ['All', 'Music Tour', 'Roadtrip', 'Nature & Trek', 'City Hopping', 'Weekend Escape'];

  // Metrics
  const totalTravelersMatched = trips.reduce((acc, t) => acc + t.joinedTravelers.length, 0);
  const totalEstimatedRevenue = trips.reduce((acc, t) => acc + (t.estimatedBudget * t.joinedTravelers.length), 0);
  const avgDays = trips.length > 0
    ? (trips.reduce((acc, t) => acc + t.totalDays, 0) / trips.length).toFixed(1)
    : 0;

  // Filtered
  const filteredTrips = trips.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.origin.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.waypoints.some((w) => w.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    return true;
  });

  // Extract all companions flat
  const allCompanions = trips.flatMap((trip) =>
    trip.joinedTravelers.map((traveler, index) => ({
      id: `${trip.id}-traveler-${index}`,
      travelerName: traveler.name,
      avatar: traveler.avatar,
      joinedAt: traveler.joinedAt,
      seatsBooked: traveler.seatsBooked || 1,
      tripId: trip.id,
      tripTitle: trip.title,
      origin: trip.origin,
      destination: trip.destination,
      startDate: trip.startDate,
      budget: trip.estimatedBudget
    }))
  );

  const filteredCompanions = allCompanions.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.travelerName.toLowerCase().includes(q) ||
      c.tripTitle.toLowerCase().includes(q) ||
      c.origin.toLowerCase().includes(q) ||
      c.destination.toLowerCase().includes(q)
    );
  });

  const tripColumns: Column<TripPlan>[] = [
    {
      key: 'title',
      header: 'Expedition Package',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-900 block hover:text-amber-700 cursor-pointer" onClick={() => setSelectedTrip(item)}>
            {item.title}
          </span>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-amber-500" />
            {item.origin} → {item.destination}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Vertical',
      render: (item) => (
        <span className="text-xs bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded-full border border-amber-200">
          {item.category}
        </span>
      )
    },
    {
      key: 'duration',
      header: 'Dates & Duration',
      render: (item) => (
        <div className="text-xs text-slate-600">
          <span className="block font-medium">{item.totalDays} Days</span>
          <span className="text-[11px] text-slate-400">{item.startDate} to {item.endDate}</span>
        </div>
      )
    },
    {
      key: 'travelers',
      header: 'Travelers Booked',
      render: (item) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800">{item.joinedTravelers.length}</span>
          <span className="text-slate-400"> / {item.maxTravelers}</span>
          <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${Math.min(100, (item.joinedTravelers.length / item.maxTravelers) * 100)}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'budget',
      header: 'Package Price',
      render: (item) => (
        <span className="text-xs font-semibold text-amber-700">
          ₹{item.estimatedBudget.toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <Badge status={item.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setSelectedTrip(item)}
            className="text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
          >
            Details
          </button>
        </div>
      )
    }
  ];

  const companionColumns: Column<typeof allCompanions[0]>[] = [
    {
      key: 'traveler',
      header: 'Traveler & Companion',
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <img src={item.avatar} alt={item.travelerName} className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200" />
          <div>
            <span className="text-xs font-semibold text-slate-900 block">{item.travelerName}</span>
            <span className="text-[10px] text-slate-400">Joined {item.joinedAt}</span>
          </div>
        </div>
      )
    },
    {
      key: 'trip',
      header: 'Booked Expedition',
      render: (item) => (
        <div>
          <span className="text-xs font-medium text-slate-800 block truncate max-w-xs">{item.tripTitle}</span>
          <span className="text-[11px] text-slate-500">{item.origin} → {item.destination}</span>
        </div>
      )
    },
    {
      key: 'seats',
      header: 'Seats Booked',
      render: (item) => (
        <span className="text-xs font-medium text-slate-700">{item.seatsBooked} Seat(s)</span>
      )
    },
    {
      key: 'amount',
      header: 'Fare Paid',
      render: (item) => (
        <span className="text-xs font-semibold text-emerald-700">
          ₹{(item.budget * item.seatsBooked).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Booking Status',
      render: () => (
        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Confirmed Ticket
        </span>
      )
    }
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="PageTitle">
            Group Expeditions & Travel Companion Tours
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Design multi-day concert roadtrips, festival packages, and companion expeditions for travelers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create New Expedition</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          label="Published Expeditions"
          value={trips.length}
          subtext="Active multi-day itineraries"
          icon={MapPin}
          accentColor="amber"
        />
        <MetricCard
          label="Travelers Matched"
          value={totalTravelersMatched}
          subtext="Companion bookings confirmed"
          icon={Users}
          accentColor="emerald"
        />
        <MetricCard
          label="Avg. Expedition Days"
          value={`${avgDays} Days`}
          subtext="Route duration average"
          icon={Calendar}
          accentColor="cyan"
        />
        <MetricCard
          label="Package Gross Bookings"
          value={`₹${(totalEstimatedRevenue / 1000).toFixed(1)}k`}
          subtext="Total companion tickets sold"
          icon={Sparkles}
          accentColor="purple"
        />
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 gap-2 overflow-x-auto pb-0.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentSubTab('all-trips')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${currentSubTab === 'all-trips'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Curated Expeditions ({trips.length})
          </button>
          <button
            type="button"
            onClick={() => setCurrentSubTab('companions')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${currentSubTab === 'companions'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Travel Companions & Roster ({allCompanions.length})
          </button>
        </div>

        {currentSubTab === 'all-trips' && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs cursor-pointer ${viewMode === 'grid' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              title="Grid Cards"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs cursor-pointer ${viewMode === 'table' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              title="Table View"
            >
              <TableIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={currentSubTab === 'all-trips' ? "Search expeditions by title, city, waypoint..." : "Search companion name or trip..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
          />
        </div>

        {currentSubTab === 'all-trips' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content */}
      {currentSubTab === 'all-trips' ? (
        filteredTrips.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <Compass className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No expeditions found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onSelect={(t) => setSelectedTrip(t)}
                onDelete={(id) => {
                  onDeleteTrip(id);
                  onShowToast('Expedition archived.', 'info');
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
            <Table columns={tripColumns} data={filteredTrips} keyExtractor={(item) => item.id} />
          </div>
        )
      ) : (
        /* Companions Roster */
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
          <Table columns={companionColumns} data={filteredCompanions} keyExtractor={(item) => item.id} />
        </div>
      )}

      {/* Modals */}
      <TripDetailModal
        isOpen={Boolean(selectedTrip)}
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />

      <CreateTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddTrip={(newTrip) => {
          onAddTrip(newTrip);
          onShowToast(`Expedition "${newTrip.title}" created successfully!`);
        }}
        currentVendorName={currentVendorName}
      />
    </div>
  );
};
