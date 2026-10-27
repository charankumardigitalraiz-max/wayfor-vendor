import React, { useState, useMemo, useEffect } from 'react';
import {
  Mic2,
  Users,
  Search,
  Plus,
  Sparkles,
  ExternalLink,
  MapPin,
  Headphones,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  Trash2,
  Radio,
  FileText,
  Globe2,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List
} from 'lucide-react';
import type { Artist } from '../../types';
import { CreateArtistModal } from '../common/CreateArtistModal';
import { MetricCard } from '../common/MetricCard';
import { Table, type Column } from '../common/Table';
import { Pagination } from '../common/Pagination';
import { Modal } from '../common/Modal';
import { AppImage } from '../common/AppImage';

interface ArtistsViewProps {
  artists: Artist[];
  onAddArtist: (artist: Omit<Artist, 'id'>) => void;
  onDeleteArtist?: (id: string) => void;
  onShowToast: (msg: string) => void;
}

const GENRE_FILTERS = [
  'All Genres',
  'EDM',
  'Bollywood',
  'Rock',
  'Punjabi',
  'Pop',
  'Hip-Hop',
  'Indie'
];

export const ArtistsView: React.FC<ArtistsViewProps> = ({
  artists,
  onAddArtist,
  onDeleteArtist,
  onShowToast
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRiderArtist, setSelectedRiderArtist] = useState<Artist | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedStatus]);

  // Filtered artists
  const filteredArtists = artists.filter((artist) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      artist.name.toLowerCase().includes(q) ||
      (artist.stageName && artist.stageName.toLowerCase().includes(q)) ||
      artist.city?.toLowerCase().includes(q) ||
      artist.country.toLowerCase().includes(q) ||
      artist.management?.agency?.toLowerCase().includes(q) ||
      artist.subGenres?.some(sg => sg.toLowerCase().includes(q));

    const matchesGenre =
      selectedGenre === 'All Genres' ||
      artist.genre.toLowerCase() === selectedGenre.toLowerCase();

    const matchesStatus =
      selectedStatus === 'all' || artist.status === selectedStatus;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  const totalItems = filteredArtists.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedArtists = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredArtists.slice(startIndex, startIndex + pageSize);
  }, [filteredArtists, safeCurrentPage, pageSize]);

  // Calculate metrics
  const totalHeadliners = artists.length;
  const touringCount = artists.filter((a) => a.status === 'touring').length;
  const availableCount = artists.filter((a) => a.status === 'available').length;
  const totalUpcomingShows = artists.reduce((acc, a) => acc + (a.upcomingConcerts || 0), 0);

  const handleDelete = (id: string, name: string) => {
    if (onDeleteArtist) {
      onDeleteArtist(id);
      onShowToast(`Artist "${name}" removed from roster.`);
    }
  };

  const columns: Column<Artist>[] = [
    {
      key: 'name',
      header: 'Artist',
      render: (artist) => (
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="h-10 w-10 rounded-lg object-cover border border-slate-200 shadow-2xs"
            />
            {artist.verified && (
              <div
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-purple-600 text-white flex items-center justify-center border border-white"
                title="Verified Concert Headliner"
              >
                <CheckCircle2 className="h-2.5 w-2.5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-slate-900 block truncate hover:text-purple-600 transition-colors">
              {artist.name}
            </span>
            {artist.stageName && (
              <span className="text-[11px] text-slate-400 block truncate">
                {artist.stageName}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'genre',
      header: 'Genre',
      render: (artist) => (
        <div className="space-y-1">
          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-200/80">
            {artist.genre}
          </span>
          {artist.subGenres && artist.subGenres.length > 0 && (
            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
              {artist.subGenres.slice(0, 2).join(', ')}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Tour Status',
      render: (artist) => {
        const isTouring = artist.status === 'touring';
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${isTouring
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : artist.status === 'available'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isTouring
                  ? 'bg-emerald-500 animate-pulse'
                  : artist.status === 'available'
                    ? 'bg-blue-500'
                    : 'bg-slate-400'
                }`}
            />
            {isTouring
              ? 'On World Tour'
              : artist.status === 'available'
                ? 'Booking Available'
                : 'Roster Ready'}
          </span>
        );
      }
    },
    {
      key: 'location',
      header: 'Location & Agency',
      render: (artist) => (
        <div className="text-slate-600">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{artist.city ? `${artist.city}, ` : ''}{artist.country}</span>
          </div>
          {artist.management?.agency && (
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {artist.management.agency.split('/')[0]}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'monthlyListeners',
      header: 'Listeners',
      render: (artist) =>
        artist.monthlyListeners ? (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/80">
            <Headphones className="h-3.5 w-3.5 text-emerald-600" />
            <span>{artist.monthlyListeners}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">—</span>
        )
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (artist) => (
        <div className="inline-flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedRiderArtist(artist)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
          >
            <FileText className="h-3 w-3" />
            <span>Rider</span>
          </button>

          {onDeleteArtist && (
            <button
              type="button"
              onClick={() => handleDelete(artist.id, artist.name)}
              className="p-1.5 rounded-md text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
              title="Delete artist"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
              <Mic2 className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Artists & Headliners
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Touring headliners, opening acts, technical acoustic riders, Spotify profiles, and talent agency contacts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Artist</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Total Artists"
          value={totalHeadliners}
          subtext="Managed in vendor catalog"
          icon={Users}
          accentColor="purple"
        />

        <MetricCard
          label="Actively On Tour"
          value={touringCount}
          subtext="Stadium & arena runs live"
          icon={Sparkles}
          accentColor="emerald"
        />

        <MetricCard
          label="Ready For Booking"
          value={availableCount}
          subtext="Open tour dates & festivals"
          icon={CheckCircle2}
          accentColor="cyan"
        />

        <MetricCard
          label="Upcoming Tour Stops"
          value={totalUpcomingShows}
          subtext="Scheduled arena dates"
          icon={Radio}
          accentColor="amber"
        />
      </div>

      {/* Unified Attached Card: Header Controls + Table / Grid Body + Summary Footer */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
        {/* Card Header: Search & Filter Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white">
          {/* Left: Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by artist name, stage alias, city, agency..."
              className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/70 pl-9.5 pr-9 py-2 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 shadow-2xs"
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

          {/* Right: Filter Dropdowns + View Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            {/* Genre Dropdown */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              {GENRE_FILTERS.map((g) => (
                <option key={g} value={g}>
                  {g === 'All Genres' ? 'All Genres' : `${g} Genre`}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              <option value="all">All Tour Statuses</option>
              <option value="touring">Active On World Tour</option>
              <option value="active">Active Touring Roster</option>
              <option value="available">Booking Available</option>
              <option value="on-break">On Hiatus / Break</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/70 shrink-0">
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

        {/* Card Body */}
        {filteredArtists.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <Mic2 className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No Artists Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No artists match your current search criteria. Try modifying your search query or genre filter.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('All Genres');
                  setSelectedStatus('all');
                }}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-1.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs transition-colors cursor-pointer"
              >
                + Create New Artist
              </button>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <Table<Artist>
            columns={columns}
            data={paginatedArtists}
            keyExtractor={(artist) => artist.id}
            pageSize={pageSize}
            showPagination={false}
            containerClassName="border-0 rounded-none shadow-none bg-transparent"
            emptyMessage="No artists match your current search criteria."
            footer={
              filteredArtists.length > 0 ? (
                <Pagination
                  variant="attached"
                  currentPage={safeCurrentPage}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  pageSizeOptions={[6, 9, 12, 24]}
                  itemName="artists"
                />
              ) : null
            }
          />
        ) : (
          <div>
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedArtists.map((artist) => {
                const isTouring = artist.status === 'touring';
                return (
                  <div
                    key={artist.id}
                    className="rounded-lg border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Banner */}
                      <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={artist.bannerImage || artist.avatar}
                          alt={artist.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                        {/* Status Pill */}
                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-2xs backdrop-blur-md ${isTouring
                              ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                              : artist.status === 'available'
                                ? 'bg-blue-500/90 text-white border-blue-400/50'
                                : 'bg-slate-700/80 text-slate-200 border-slate-600'
                              }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            {isTouring
                              ? 'On World Tour'
                              : artist.status === 'available'
                                ? 'Booking Available'
                                : 'Roster Ready'}
                          </span>
                        </div>

                        {/* Monthly Listeners badge */}
                        {artist.monthlyListeners && (
                          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[11px] font-semibold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                            <Headphones className="h-3 w-3 text-emerald-400" />
                            <span>{artist.monthlyListeners}</span>
                          </div>
                        )}
                      </div>

                      {/* Avatar & Main Info */}
                      <div className="px-4.5 pt-0 pb-3">
                        <div className="flex items-end justify-between -mt-7 mb-2">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-100">
                              <img
                                src={artist.avatar}
                                alt={artist.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {artist.verified && (
                              <div
                                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-white shadow-2xs"
                                title="Verified Concert Headliner"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </div>
                            )}
                          </div>

                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {artist.genre}
                          </span>
                        </div>

                        {/* Artist Title & Alias */}
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate" title={artist.name}>
                            {artist.name}
                          </h3>
                          {artist.stageName && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {artist.stageName}
                            </p>
                          )}
                        </div>

                        {/* Location & Agency */}
                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1 min-w-0">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{artist.city ? `${artist.city}, ` : ''}{artist.country}</span>
                          </div>
                          {artist.management?.agency && (
                            <div className="flex items-center gap-1 min-w-0 text-slate-400">
                              <span>•</span>
                              <span className="truncate text-slate-600 font-medium">
                                {artist.management.agency.split('/')[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bio Snippet */}
                        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {artist.bio}
                        </p>

                        {/* Subgenre Tags */}
                        {artist.subGenres && artist.subGenres.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {artist.subGenres.slice(0, 3).map((sg, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                              >
                                {sg}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer specs & actions */}
                    <div className="px-4.5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRiderArtist(artist)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Rider Specs</span>
                      </button>

                      {onDeleteArtist && (
                        <button
                          type="button"
                          onClick={() => handleDelete(artist.id, artist.name)}
                          className="p-1.5 rounded text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
                          title="Delete artist from roster"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredArtists.length > 0 && (
              <Pagination
                variant="attached"
                currentPage={safeCurrentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[6, 9, 12, 24]}
                itemName="artists"
              />
            )}
          </div>
        )}
      </div>

      {/* Global Create Artist Modal */}
      <CreateArtistModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddArtist={onAddArtist}
        onShowToast={onShowToast}
      />

      {/* Technical Rider Quick View Modal */}
      {selectedRiderArtist && (
        <Modal
          isOpen={!!selectedRiderArtist}
          onClose={() => setSelectedRiderArtist(null)}
          title={`${selectedRiderArtist.name} — Technical Rider`}
          subtitle="Stage & Hospitality Rider Specifications"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="h-12 w-12 rounded-lg overflow-hidden border border-purple-200 bg-white shrink-0 shadow-2xs">
                <AppImage
                  src={selectedRiderArtist.avatar}
                  alt={selectedRiderArtist.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{selectedRiderArtist.name}</h4>
                <p className="text-xs text-purple-700 font-medium">Headlining Live Artist</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Vocal Microphone
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {selectedRiderArtist.rider?.microphonePreference || 'Standard Axient Digital Wireless Handheld'}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  In-Ear Monitoring (IEM)
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {selectedRiderArtist.rider?.inEarMonitors || 'Sennheiser Wireless IEM'}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Hospitality & Greenroom Catering
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedRiderArtist.rider?.hospitalityNotes || 'Quiet greenroom with organic refreshments, hot water, lemon and honey.'}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Management Contact
                </span>
                <div className="text-xs text-slate-700 space-y-0.5">
                  <p className="font-semibold">{selectedRiderArtist.management?.managerName || 'Operations Desk'}</p>
                  <p className="text-slate-500">{selectedRiderArtist.management?.agency || 'Talent Management'}</p>
                  <p className="text-purple-600">{selectedRiderArtist.management?.email || 'booking@agency.com'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRiderArtist(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer shadow-2xs"
              >
                Close Rider
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
