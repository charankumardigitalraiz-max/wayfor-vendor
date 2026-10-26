import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import type { Artist } from '../../types';
import { CreateArtistModal } from '../common/CreateArtistModal';

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
        <div className="rounded-lg border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Total Artists</span>
            <span className="h-6 w-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900 mt-1">{totalHeadliners}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Managed in vendor catalog</span>
        </div>

        <div className="rounded-lg border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Actively On Tour</span>
            <span className="h-6 w-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="text-lg font-bold text-emerald-700 mt-1">{touringCount}</p>
          <span className="text-[10px] text-emerald-600 mt-0.5 block">Stadium & arena runs live</span>
        </div>

        <div className="rounded-lg border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Ready For Booking</span>
            <span className="h-6 w-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="text-lg font-bold text-blue-700 mt-1">{availableCount}</p>
          <span className="text-[10px] text-blue-600 mt-0.5 block">Open tour dates & festivals</span>
        </div>

        <div className="rounded-lg border border-slate-200/90 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Upcoming Tour Stops</span>
            <span className="h-6 w-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
              <Radio className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="text-lg font-bold text-amber-700 mt-1">{totalUpcomingShows}</p>
          <span className="text-[10px] text-amber-600 mt-0.5 block">Scheduled arena dates</span>
        </div>
      </div>

      {/* Search & Genre Filter Bar */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by artist name, stage alias, city, agency, or genre tag..."
              className="w-full pl-9 pr-8 py-2 rounded-md border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              <option value="all">All Tour Statuses</option>
              <option value="touring">Active On World Tour</option>
              <option value="active">Active Touring Roster</option>
              <option value="available">Booking Available</option>
              <option value="on-break">On Hiatus / Break</option>
            </select>
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
          {GENRE_FILTERS.map((g) => {
            const isSelected = selectedGenre === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer shrink-0 border ${isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Artists Directory Grid */}
      {filteredArtists.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-2xs space-y-3">
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtists.map((artist) => {
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
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs backdrop-blur-md ${isTouring
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
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[11px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
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

                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {artist.genre}
                      </span>
                    </div>

                    {/* Artist Title & Alias */}
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate" title={artist.name}>
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
                          <span className="truncate text-slate-600 font-medium">{artist.management.agency.split('/')[0]}</span>
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
                  <div className="flex items-center gap-1.5">
                    {artist.socialLinks?.spotify && (
                      <a
                        href={artist.socialLinks.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Spotify Artist Profile"
                      >
                        <Headphones className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {artist.socialLinks?.instagram && (
                      <a
                        href={artist.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
                        title="Instagram"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedRiderArtist(artist)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Rider Specs</span>
                    </button>
                  </div>

                  {onDeleteArtist && (
                    <button
                      type="button"
                      onClick={() => handleDelete(artist.id, artist.name)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
      )}

      {/* Global Create Artist Modal */}
      <CreateArtistModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddArtist={onAddArtist}
        onShowToast={onShowToast}
      />

      {/* Technical Rider Quick View Modal */}
      {selectedRiderArtist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setSelectedRiderArtist(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={selectedRiderArtist.avatar}
                    alt={selectedRiderArtist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedRiderArtist.name}</h3>
                  <p className="text-xs text-purple-600 font-medium">Stage & Hospitality Rider</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRiderArtist(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Vocal Microphone
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {selectedRiderArtist.rider?.microphonePreference || 'Standard Axient Digital Wireless Handheld'}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  In-Ear Monitoring (IEM)
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {selectedRiderArtist.rider?.inEarMonitors || 'Sennheiser Wireless IEM'}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Hospitality & Greenroom Catering
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedRiderArtist.rider?.hospitalityNotes || 'Quiet greenroom with organic refreshments, hot water, lemon and honey.'}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Management Contact
                </span>
                <div className="text-xs text-slate-700 space-y-0.5">
                  <p className="font-semibold">{selectedRiderArtist.management?.managerName || 'Operations Desk'}</p>
                  <p className="text-slate-500">{selectedRiderArtist.management?.agency || 'Talent Management'}</p>
                  <p className="text-purple-600">{selectedRiderArtist.management?.email || 'booking@agency.com'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRiderArtist(null)}
                className="px-4 py-2 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Close Rider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
