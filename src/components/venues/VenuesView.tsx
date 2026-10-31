import React, { useState, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Users,
  Phone,
  Plus,
  Volume2,
  Search,
  X,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  Radio
} from 'lucide-react';
import type { Venue } from '../../types';
import { AddVenueModal } from '../common/AddVenueModal';
import { Modal } from '../common/Modal';
import { AppImage } from '../common/AppImage';
import { Table } from '../common/Table';

interface VenuesViewProps {
  venues: Venue[];
  onAddVenue: (venue: Venue) => void;
  onShowToast: (msg: string) => void;
}

const DEFAULT_VENUE_IMAGES: Record<string, string> = {
  Stadium: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80',
  Arena: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80',
  'Open Grounds': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
  Club: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
  Auditorium: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80'
};

const getVenueImage = (venue: Venue) => {
  if (venue.image && venue.image.trim()) return venue.image;
  return (
    DEFAULT_VENUE_IMAGES[venue.type] ||
    'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80'
  );
};

export const VenuesView: React.FC<VenuesViewProps> = ({
  venues,
  onAddVenue,
  onShowToast
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.soundSystem.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (selectedType !== 'All' && v.type !== selectedType) return false;

      return true;
    });
  }, [venues, searchQuery, selectedType]);

  const totalSeats = useMemo(() => {
    return venues.reduce((acc, v) => acc + (v.capacity || 0), 0);
  }, [venues]);

  const tableColumns = useMemo(
    () => [
      {
        key: 'venue',
        header: 'Venue & Location',
        render: (venue: Venue) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-12 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
              <AppImage
                src={getVenueImage(venue)}
                alt={venue.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 max-w-[200px] sm:max-w-[240px]">
              <span className="font-semibold text-slate-900 block truncate" title={venue.name}>
                {venue.name}
              </span>
              <div
                className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 min-w-0"
                title={`${venue.city} • ${venue.address}`}
              >
                <MapPin className="h-3 w-3 text-purple-600 shrink-0" />
                <span className="truncate">{venue.city} • {venue.address}</span>
              </div>
            </div>
          </div>
        )
      },
      {
        key: 'type',
        header: 'Classification',
        render: (venue: Venue) => (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            <Building2 className="h-3 w-3" />
            {venue.type}
          </span>
        )
      },
      {
        key: 'capacity',
        header: 'Audience Capacity',
        render: (venue: Venue) => (
          <div className="text-xs">
            <span className="font-semibold text-slate-900 block">
              {venue.capacity.toLocaleString()} seats
            </span>
            <span className="text-[10px] text-slate-400">Total Seating</span>
          </div>
        )
      },
      {
        key: 'soundSystem',
        header: 'Audio Rig',
        render: (venue: Venue) => (
          <div className="text-xs text-slate-700 truncate max-w-xs" title={venue.soundSystem}>
            <span className="font-medium block truncate">
              {venue.soundSystem.split(' with ')[0].split(' & ')[0]}
            </span>
            <span className="text-[10px] text-slate-400 truncate block">Line Array System</span>
          </div>
        )
      },
      {
        key: 'contact',
        header: 'Coordinator',
        render: (venue: Venue) => (
          <div className="text-xs">
            <span className="font-medium text-slate-800 flex items-center gap-1">
              <Phone className="h-3 w-3 text-purple-600 shrink-0" />
              {venue.contactPerson}
            </span>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Status',
        render: (venue: Venue) => (
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${venue.status === 'maintenance'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${venue.status === 'maintenance' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
            />
            {venue.status === 'maintenance' ? 'Maintenance' : 'Ready'}
          </span>
        )
      },
      {
        key: 'action',
        header: 'Action',
        align: 'right' as const,
        render: (venue: Venue) => (
          <button
            type="button"
            onClick={() => setSelectedVenue(venue)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
            title="View Arena Specifications"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </button>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="PageTitle">
              Venues & Stages
            </h1>
            {/* <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {venues.length} Partner Arenas
            </span> */}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified concert arenas, total staging capacity of {totalSeats.toLocaleString()} seats, sound rigs, and logistics coordinators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Venue</span>
        </button>
      </div>

      {/* Unified Attached Card: Header Controls + Grid / Table Body + Summary Footer */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
        {/* Card Header: Search & Filter Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          {/* Search Input */}
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by arena, city, acoustic setup..."
              className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white pl-10 pr-8 py-2 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Type Filter + Reset (if filtered) + View Mode Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
            <div className="relative inline-flex items-center group">
              <SlidersHorizontal
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors pointer-events-none ${selectedType !== 'All' ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`appearance-none h-10 rounded-md border pl-8.5 pr-8 py-2 text-xs sm:text-[13px] font-medium outline-none transition-all cursor-pointer shadow-2xs ${selectedType !== 'All'
                  ? 'bg-purple-50/80 border-purple-200 text-purple-900 font-semibold focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10'
                  : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10'
                  }`}
              >
                <option value="All">All Venue Types</option>
                <option value="Stadium">Stadium</option>
                <option value="Arena">Arena</option>
                <option value="Open Grounds">Open Grounds</option>
                <option value="Club">Club / Amphitheatre</option>
                <option value="Auditorium">Auditorium</option>
              </select>
            </div>

            {/* Clear filter button if active */}
            {(searchQuery.trim() !== '' || selectedType !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('All');
                }}
                className="h-10 px-3 rounded-md border border-rose-200/80 bg-rose-50/70 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                title="Reset all filters"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>
        </div>

        {/* Card Body: Table Only */}
        <Table<Venue>
          columns={tableColumns}
          data={filteredVenues}
          keyExtractor={(venue) => venue.id}
          pageSize={10}
          showPagination={filteredVenues.length > 10}
          containerClassName="border-0 rounded-none shadow-none bg-transparent"
          emptyMessage="No venues match your current search criteria."
        />

        {/* Footer Summary Strip */}
        <div className="p-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filteredVenues.length}</span> of{' '}
            <span className="font-semibold text-slate-800">{venues.length}</span> venues
          </span>
          <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
            Total Capacity: {totalSeats.toLocaleString()} seats
          </span>
        </div>
      </div>

      {/* Global Add Venue Modal */}
      <AddVenueModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddVenue={onAddVenue}
        onShowToast={onShowToast}
      />

      {/* Venue Details Modal */}
      {selectedVenue && (
        <Modal
          isOpen={!!selectedVenue}
          onClose={() => setSelectedVenue(null)}
          title="Venue Details"
          subtitle="Overview of registered venue and location information"
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Venue Image */}
            <div className="relative h-28 sm:h-32 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
              <AppImage
                src={getVenueImage(selectedVenue)}
                alt={selectedVenue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                  <Building2 className="h-3.5 w-3.5 text-purple-400" />
                  <span>{selectedVenue.type}</span>
                </span>
              </div>
            </div>

            {/* Venue Name */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedVenue.name}
              </h3>
            </div>

            {/* Details Grid: Exactly matches AddVenueModal fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* City */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">City</span>
                </div>
                <p className="text-sm font-medium text-slate-900">
                  {selectedVenue.city}
                </p>
              </div>

              {/* Max Capacity */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">Max Capacity</span>
                </div>
                <p className="text-sm font-medium text-slate-900">
                  {Number(selectedVenue.capacity).toLocaleString()} seats
                </p>
              </div>

              {/* Contact Phone Number */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 sm:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">Contact Phone Number</span>
                </div>
                {selectedVenue.contactPerson ? (
                  <a
                    href={`tel:${selectedVenue.contactPerson}`}
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline inline-block"
                  >
                    {selectedVenue.contactPerson}
                  </a>
                ) : (
                  <span className="text-sm text-slate-500 italic">Not provided</span>
                )}
              </div>

              {/* Full Address */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 sm:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">Full Address</span>
                </div>
                <p className="text-sm font-medium text-slate-900 leading-snug">
                  {selectedVenue.address || `${selectedVenue.name}, ${selectedVenue.city}`}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 flex items-center justify-end border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedVenue(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
