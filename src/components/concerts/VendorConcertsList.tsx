import React, { useState, useMemo, useEffect } from 'react';
import {
  Music,
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  MapPin,
  TrendingUp,
  SlidersHorizontal,
  Eye,
  Trash2,
  DollarSign,
  Ticket,
  ChevronDown,
  X,
  ArrowUpDown,
  Filter,
  CheckCircle2
} from 'lucide-react';
import type { ConcertEvent } from '../../types';
import { VendorConcertCard } from './VendorConcertCard';
import { Table, type Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';
import { Pagination } from '../common/Pagination';
import { AppImage } from '../common/AppImage';
import { formatUtcDate } from '../../utils/dateUtils';

interface VendorConcertsListProps {
  concerts: ConcertEvent[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectConcert: (concert: ConcertEvent) => void;
  onOpenCreateModal: () => void;
  onStatusChange: (id: string, status: ConcertEvent['status']) => void;
  onDeleteConcert: (id: string) => void;
}

export const VendorConcertsList: React.FC<VendorConcertsListProps> = ({
  concerts,
  searchQuery,
  onSearchChange,
  onSelectConcert,
  onOpenCreateModal,
  onStatusChange,
  onDeleteConcert
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  const genres = ['All', 'EDM', 'Rock', 'Pop', 'Indie', 'Hip-Hop'];

  const cities = useMemo(() => {
    const set = new Set<string>();
    concerts.forEach((c) => {
      if (c.city) set.add(c.city);
    });
    return ['All', ...Array.from(set).sort()];
  }, [concerts]);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active Live' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'draft', label: 'Draft' }
  ];

  const sortOptions = [
    { value: 'date-asc', label: 'Date: Earliest First' },
    { value: 'date-desc', label: 'Date: Latest First' },
    { value: 'sold-desc', label: 'Most Tickets Sold' },
    { value: 'gross-desc', label: 'Highest Box Office (GMV)' },
    { value: 'title-asc', label: 'Concert Name (A-Z)' }
  ];

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedGenre !== 'All' ||
    selectedStatus !== 'all' ||
    selectedCity !== 'All' ||
    sortBy !== 'date-asc';

  const handleResetFilters = () => {
    onSearchChange('');
    setSelectedGenre('All');
    setSelectedStatus('all');
    setSelectedCity('All');
    setSortBy('date-asc');
    setCurrentPage(1);
  };

  // Reset to first page whenever search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedStatus, selectedCity, sortBy]);

  // Filter and Sort logic
  const filteredConcerts = useMemo(() => {
    const list = concerts.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.artist.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.venueName.toLowerCase().includes(q) ||
        (c.genre && c.genre.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedGenre !== 'All' && c.genre !== selectedGenre) return false;
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (selectedCity !== 'All' && c.city !== selectedCity) return false;

      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'sold-desc') {
        return b.ticketsSold - a.ticketsSold;
      }
      if (sortBy === 'gross-desc') {
        const grossA = a.ticketsSold * ((a.minPrice + a.maxPrice) / 2);
        const grossB = b.ticketsSold * ((b.minPrice + b.maxPrice) / 2);
        return grossB - grossA;
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return list;
  }, [concerts, searchQuery, selectedGenre, selectedStatus, selectedCity, sortBy]);

  // Pagination calculations
  const totalItems = filteredConcerts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedConcerts = useMemo(() => {
    return filteredConcerts.slice(startIndex, endIndex);
  }, [filteredConcerts, startIndex, endIndex]);

  // Aggregate stats
  const totalCount = concerts.length;
  const activeCount = concerts.filter((c) => c.status === 'active').length;
  const upcomingCount = concerts.filter((c) => c.status === 'upcoming').length;
  const completedCount = concerts.filter((c) => c.status === 'completed').length;

  const columns: Column<ConcertEvent>[] = [
    {
      key: 'title',
      header: 'Concert & Artist',
      render: (concert) => (
        <div className="flex items-center gap-3">
          <AppImage
            src={concert.image}
            alt={concert.title}
            className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <span className="font-semibold text-slate-900 block truncate">
              {concert.title}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              {concert.artist} • <span className="text-purple-600 font-semibold">{concert.genre}</span>
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'venue',
      header: 'Venue & City',
      render: (concert) => (
        <div>
          <span className="font-semibold text-slate-800 block truncate">
            {concert.venueName}
          </span>
          <span className="text-[11px] text-slate-500 font-normal">
            {concert.city}, {concert.country}
          </span>
        </div>
      )
    },
    {
      key: 'date',
      header: 'Event Date & Time',
      width: 'min-w-[135px]',
      render: (concert) => (
        <div className="text-xs min-w-[115px] whitespace-nowrap">
          <span className="font-medium text-slate-800 block">{formatUtcDate(concert.date)}</span>
          <span className="text-[11px] text-slate-400">Entry: {concert.doorsOpen}</span>
        </div>
      )
    },
    {
      key: 'capacity',
      header: 'Capacity Sold',
      render: (concert) => {
        const pct = Math.min(100, Math.round((concert.ticketsSold / concert.totalCapacity) * 100));

        // Dynamic colors based on sales volume / percentage sold
        const color =
          pct >= 90
            ? { text: 'text-emerald-700', bar: 'bg-emerald-500' }
            : pct >= 65
              ? { text: 'text-blue-700', bar: 'bg-blue-600' }
              : pct >= 40
                ? { text: 'text-amber-700', bar: 'bg-amber-500' }
                : { text: 'text-rose-600', bar: 'bg-rose-500' };

        return (
          <div className="space-y-1 w-36">
            <div className="flex justify-between text-[11px]">
              <span className={`font-semibold ${color.text}`}>{pct}%</span>
              <span className="text-slate-400">
                {concert.ticketsSold.toLocaleString()} / {concert.totalCapacity.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${color.bar} transition-all duration-300`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'price',
      header: 'Price Range',
      width: 'min-w-[145px]',
      render: (concert) => (
        <span className="font-semibold min-w-[115px] text-slate-900">
          ₹{concert.minPrice.toLocaleString()} - ₹{concert.maxPrice.toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (concert) => <Badge status={concert.status} />
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (concert) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectConcert(concert);
            }}
            className="p-1.5 rounded-md bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 border border-purple-200/80 transition-all cursor-pointer shadow-2xs"
            title="Manage Event"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Archive concert "${concert.title}"?`)) {
                onDeleteConcert(concert.id);
              }
            }}
            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200/80 transition-all cursor-pointer shadow-2xs"
            title="Archive Concert"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Concert Tours & Event Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your live stadium tours, ticket tiers, gate capacity allocations, and production manifests.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Publish New Concert</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Concerts"
          value={totalCount}
          isPositive={true}
          icon={Music}
          accentColor="purple"
        />

        <MetricCard
          label="Active Concerts"
          value={activeCount}
          isPositive={true}
          icon={TrendingUp}
          accentColor="emerald"
        />

        <MetricCard
          label="Upcoming Concerts"
          value={upcomingCount}
          isPositive={true}
          icon={Calendar}
          accentColor="cyan"
        />

        <MetricCard
          label="Completed Concerts"
          value={completedCount}
          isPositive={true}
          icon={CheckCircle2}
          accentColor="amber"
        />
      </div>

      {/* Unified Attached Card: Header Controls + Table / Grid Body + Pagination Footer */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
        {/* Card Header: Search & Filter Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white">
          {/* Left: Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search concerts, artists, venues, cities..."
              className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/70 pl-9.5 pr-9 py-2 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right: Dropdowns + View Switcher */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* Status Dropdown */}
            <div className="relative inline-flex items-center">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none h-10 rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-9 py-2 text-xs sm:text-[13px] font-medium text-slate-700 outline-none transition-all hover:bg-white focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-2xs"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Genre Dropdown */}
            <div className="relative inline-flex items-center">
              <Music className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="appearance-none h-10 rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-9 py-2 text-xs sm:text-[13px] font-medium text-slate-700 outline-none transition-all hover:bg-white focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-2xs"
              >
                <option value="All">All Genres</option>
                {genres.filter((g) => g !== 'All').map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-10 px-3 rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Reset all filters"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* View mode toggle */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200/70 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors cursor-pointer ${viewMode === 'grid'
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
                className={`p-2 rounded-md transition-colors cursor-pointer ${viewMode === 'table'
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

        {/* Card Body: Directly Attached Table or Grid */}
        {viewMode === 'grid' ? (
          <div>
            {paginatedConcerts.length > 0 ? (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-slate-50/30">
                {paginatedConcerts.map((concert) => (
                  <VendorConcertCard
                    key={concert.id}
                    concert={concert}
                    onSelect={onSelectConcert}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-3">
                <Music className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-800">
                  No concert events found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search terms or genre filters, or publish a new tour stop.
                </p>
                <button
                  type="button"
                  onClick={onOpenCreateModal}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Concert</span>
                </button>
              </div>
            )}

            {filteredConcerts.length > 0 && (
              <Pagination
                variant="attached"
                currentPage={safeCurrentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[6, 9, 12, 24]}
                itemName="concerts"
              />
            )}
          </div>
        ) : (
          <Table
            columns={columns}
            data={paginatedConcerts}
            keyExtractor={(c) => c.id}
            // onRowClick={onSelectConcert}
            pageSize={pageSize}
            showPagination={false}
            containerClassName="border-0 rounded-none shadow-none bg-transparent"
            emptyMessage="No concerts match your filters."
            footer={
              filteredConcerts.length > 0 ? (
                <Pagination
                  variant="attached"
                  currentPage={safeCurrentPage}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  pageSizeOptions={[5, 10, 15, 20]}
                  itemName="concerts"
                />
              ) : null
            }
          />
        )}
      </div>
    </div>
  );
};
