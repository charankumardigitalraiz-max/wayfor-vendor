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
  LayoutGrid,
  List,
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Venues & Stages
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {venues.length} Partner Arenas
            </span>
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

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-md border border-slate-200/80 shrink-0 h-10">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`h-8 px-2.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${viewMode === 'grid'
                  ? 'bg-white text-purple-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`h-8 px-2.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${viewMode === 'table'
                  ? 'bg-white text-purple-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
                title="Table view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Card Body: Directly Attached Grid or Table */}
        {viewMode === 'grid' ? (
          <div className="p-5 bg-slate-50/30">
            {filteredVenues.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
                <Building2 className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-800">No Venues Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No arenas match your search query. Try clearing your search or adding a new venue.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('All');
                  }}
                  className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVenues.map((venue) => (
                  <div
                    key={venue.id}
                    className="group relative overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md hover:border-purple-300 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Visual Image Banner with Gradient & Badges */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        <AppImage
                          src={getVenueImage(venue)}
                          alt={venue.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                        {/* Top Floating Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-xs">
                            <Building2 className="h-3 w-3 text-purple-600" />
                            <span>{venue.type}</span>
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md shadow-xs border ${venue.status === 'maintenance'
                              ? 'bg-amber-500/90 text-white border-amber-400/50'
                              : 'bg-emerald-500/90 text-white border-emerald-400/50'
                              }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            {venue.status === 'maintenance' ? 'Maintenance' : 'Ready for Staging'}
                          </span>
                        </div>

                        {/* Bottom Title & Location inside Banner */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                          <h3
                            className="text-base font-bold tracking-tight text-white drop-shadow-xs truncate"
                            title={venue.name}
                          >
                            {venue.name}
                          </h3>
                          <p className="text-xs text-purple-200 font-medium flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="h-3 w-3 text-purple-300 shrink-0" />
                            <span>{venue.city}</span>
                          </p>
                        </div>
                      </div>

                      {/* Card Body Specs */}
                      <div className="p-4 space-y-3">
                        {/* Clean Specs Row */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <Users className="h-4 w-4 text-purple-600 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10.5px] text-slate-400 block">Capacity</span>
                              <span className="text-xs font-semibold text-slate-800 truncate block">
                                {venue.capacity.toLocaleString()} seats
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 min-w-0">
                            <Volume2 className="h-4 w-4 text-purple-600 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10.5px] text-slate-400 block">Sound Rig</span>
                              <span
                                className="text-xs font-semibold text-slate-800 truncate block"
                                title={venue.soundSystem}
                              >
                                {venue.soundSystem.split(' with ')[0].split(' & ')[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="text-[11px] text-slate-600 truncate" title={venue.address}>
                            {venue.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Coordinator & View Button */}
                    <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Phone className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                        <span
                          className="text-[11px] font-medium text-slate-700 truncate"
                          title={venue.contactPerson}
                        >
                          {venue.contactPerson}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedVenue(venue)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer shrink-0"
                        title="View Arena Specifications"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Table<Venue>
            columns={tableColumns}
            data={filteredVenues}
            keyExtractor={(venue) => venue.id}
            pageSize={10}
            showPagination={false}
            containerClassName="border-0 rounded-none shadow-none bg-transparent"
            emptyMessage="No venues match your current search criteria."
          />
        )}

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
          title={selectedVenue.name}
          subtitle={`${selectedVenue.type} Arena • ${selectedVenue.city}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* 1. Hero Showcase Banner */}
            <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-2xs group">
              <AppImage
                src={getVenueImage(selectedVenue)}
                alt={selectedVenue.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

              {/* Badges on Top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow-xs">
                  <Building2 className="h-3.5 w-3.5 text-purple-400" />
                  <span>{selectedVenue.type}</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md border shadow-xs ${
                    selectedVenue.status === 'maintenance'
                      ? 'bg-amber-500/85 text-white border-amber-400/50'
                      : 'bg-emerald-500/85 text-white border-emerald-400/50'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  <span>{selectedVenue.status === 'maintenance' ? 'Maintenance' : 'Ready for Staging'}</span>
                </span>
              </div>

              {/* Bottom Info inside Banner */}
              <div className="absolute bottom-3 left-3.5 right-3.5 z-10 flex items-end justify-between gap-3 text-white">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-xs">
                      {selectedVenue.name}
                    </span>
                    <span className="h-4 w-4 rounded-full bg-purple-500/90 text-white flex items-center justify-center text-[10px]" title="Certified Arena">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                  </div>
                  <p className="text-xs text-purple-200 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-purple-300 shrink-0" />
                    <span>{selectedVenue.city}</span>
                  </p>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[10.5px] uppercase font-semibold text-purple-200/80 block tracking-wider">Capacity</span>
                  <span className="text-base font-bold text-white">
                    {selectedVenue.capacity.toLocaleString()} seats
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Key Stats Strip (3 Columns) */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/70 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Audience</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 block">
                  {selectedVenue.capacity.toLocaleString()}
                </span>
                <span className="text-[10.5px] text-slate-500 font-medium block">Certified seats</span>
              </div>

              <div className="p-3 rounded-lg border border-purple-200/80 bg-purple-50/60 text-center">
                <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider block">Category</span>
                <span className="text-sm sm:text-base font-bold text-purple-900 mt-0.5 block truncate">
                  {selectedVenue.type}
                </span>
                <span className="text-[10.5px] text-purple-700 font-medium block">Arena Stage</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/70 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Staging Status</span>
                <span className={`text-sm sm:text-base font-bold mt-0.5 block capitalize ${selectedVenue.status === 'maintenance' ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {selectedVenue.status === 'maintenance' ? 'Maintenance' : 'Ready'}
                </span>
                <span className="text-[10.5px] text-slate-500 font-medium block">Inspected</span>
              </div>
            </div>

            {/* 3. Audio Rig & Acoustics */}
            <div className="p-3.5 rounded-lg border border-slate-200/90 bg-white shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/80">
                    <Radio className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Audio Rig & Acoustics
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/80">
                  Live Production Spec
                </span>
              </div>

              <div className="p-2.5 rounded-md bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                <Volume2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-800 block">
                    {selectedVenue.soundSystem}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Pre-rigged line array audio system calibrated for high-SPL concert touring.
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Location & Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg border border-slate-200/90 bg-white shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-purple-600" />
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Venue Address</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  {selectedVenue.address}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {selectedVenue.city}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200/90 bg-white shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="h-3.5 w-3.5 text-purple-600" />
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Stage Coordinator</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  {selectedVenue.contactPerson}
                </p>
                <p className="text-[11px] text-purple-700 font-medium">
                  Direct Logistics Liaison
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-2 flex items-center justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedVenue(null)}
                className="px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
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
