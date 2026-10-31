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
  Eye,
  Globe2,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Pencil,
  RefreshCw,
  Loader2,
  Upload,
  UserCheck,
  UserX
} from 'lucide-react';
import type { Artist } from '../../types';
import { CreateArtistModal, ARTIST_CATEGORIES } from '../common/CreateArtistModal';
import { MetricCard } from '../common/MetricCard';
import { Table, type Column } from '../common/Table';
import { Pagination } from '../common/Pagination';
import { Modal } from '../common/Modal';
import { AppImage } from '../common/AppImage';
import { vendorArtistService } from '../../services/vendorArtistService';

interface ArtistsViewProps {
  artists?: Artist[];
  onAddArtist?: (artist: Omit<Artist, 'id'>, avatarFile?: File | null) => Promise<void> | void;
  onDeleteArtist?: (id: string) => Promise<void> | void;
  onArtistsChange?: (artists: Artist[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const CATEGORY_FILTERS = [
  'All Categories',
  ...ARTIST_CATEGORIES
];

export const ArtistsView: React.FC<ArtistsViewProps> = ({
  artists: propArtists,
  onAddArtist,
  onDeleteArtist,
  onShowToast,
  onArtistsChange
}) => {
  // Screen-level state: self-contained API data
  const [artists, setArtists] = useState<Artist[]>(() => {
    return propArtists && propArtists.length > 0
      ? propArtists
      : vendorArtistService.getStoredArtists();
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit Artist Modal State (PATCH API)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<Artist['status']>('active');
  const [editCategory, setEditCategory] = useState('Singing / Vocalist');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarPreview, setEditAvatarPreview] = useState('');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRiderArtist, setSelectedRiderArtist] = useState<Artist | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // 1. GET ALL ARTISTS API: fetch directly inside screen on mount / filter change
  const fetchArtists = async () => {
    try {
      setIsLoading(true);
      const data = await vendorArtistService.getArtists({
        genre: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
      });
      setArtists(data);
      onArtistsChange?.(data);
    } catch (err) {
      console.error('Error fetching artists in ArtistsView:', err);
      onShowToast('Could not sync with live backend; displaying cached roster.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [selectedCategory]);

  // Sync state if prop changes from outside
  useEffect(() => {
    if (propArtists && propArtists.length > 0) {
      setArtists(propArtists);
    }
  }, [propArtists]);

  // 2. CREATE ARTIST API (POST /vendor/concerts/artists) inside screen
  const handleCreateArtist = async (
    newArtistData: Omit<Artist, 'id'>,
    avatarFile?: File | null
  ) => {
    try {
      if (onAddArtist) {
        await onAddArtist(newArtistData, avatarFile);
      } else {
        const created = await vendorArtistService.createArtist(newArtistData, avatarFile);
        setArtists((prev) => {
          const next = [created, ...prev.filter((a) => a.id !== created.id)];
          onArtistsChange?.(next);
          return next;
        });
      }
      onShowToast(`Artist "${newArtistData.name}" created and saved!`, 'success');
      setIsCreateOpen(false);
    } catch (err) {
      console.error('Error creating artist inside screen:', err);
      onShowToast(err instanceof Error ? err.message : 'Failed to create artist.', 'error');
      throw err;
    }
  };

  // 3. UPDATE ARTIST API (PATCH /vendor/concerts/artists/:id) inside screen
  const handleOpenEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setEditName(artist.name);
    setEditStatus(artist.status);
    setEditCategory(artist.genre || 'Singing / Vocalist');
    setEditEmail(artist.management?.email || '');
    setEditPhone(artist.management?.phone || '');
    setEditBio(artist.bio || '');
    setEditAvatarPreview(artist.avatar);
    setEditAvatarFile(null);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtist || !editName.trim() || isSavingEdit) return;

    try {
      setIsSavingEdit(true);
      const updated = await vendorArtistService.updateArtist(
        editingArtist.id,
        {
          name: editName.trim(),
          status: editStatus,
          genre: editCategory,
          email: editEmail.trim(),
          phone: editPhone.trim(),
          bio: editBio.trim(),
          aboutus: editBio.trim(),
        },
        editAvatarFile
      );

      setArtists((prev) => {
        const next = prev.map((a) => (a.id === editingArtist.id ? updated : a));
        onArtistsChange?.(next);
        return next;
      });

      onShowToast(`Artist "${updated.name}" updated successfully!`, 'success');
      setIsEditOpen(false);
      setEditingArtist(null);
    } catch (err) {
      console.error('Error updating artist inside screen:', err);
      onShowToast(err instanceof Error ? err.message : 'Failed to update artist.', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 4. DELETE ARTIST API (DELETE /vendor/concerts/artists/:id) inside screen
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your artist roster?`)) {
      return;
    }
    try {
      if (onDeleteArtist) {
        await onDeleteArtist(id);
      } else {
        await vendorArtistService.deleteArtist(id);
      }
      setArtists((prev) => {
        const next = prev.filter((a) => a.id !== id);
        onArtistsChange?.(next);
        return next;
      });
      onShowToast(`Artist "${name}" removed from roster.`);
    } catch (err) {
      console.error('Error deleting artist inside screen:', err);
      onShowToast(err instanceof Error ? err.message : 'Failed to delete artist.', 'error');
    }
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Filtered artists
  const filteredArtists = artists.filter((artist) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      artist.name.toLowerCase().includes(q) ||
      (artist.stageName && artist.stageName.toLowerCase().includes(q)) ||
      artist.management?.email?.toLowerCase().includes(q) ||
      artist.management?.phone?.toLowerCase().includes(q) ||
      artist.bio?.toLowerCase().includes(q) ||
      artist.subGenres?.some(sg => sg.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'All Categories' ||
      artist.genre.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus =
      selectedStatus === 'all' || artist.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = filteredArtists.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedArtists = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredArtists.slice(startIndex, startIndex + pageSize);
  }, [filteredArtists, safeCurrentPage, pageSize]);

  // Calculate metrics: Total, Active, and Inactive artists
  const totalArtists = artists.length;
  const activeCount = artists.filter((a) => a.status === 'active').length;
  const inactiveCount = artists.filter((a) => a.status === 'inactive').length;

  const columns: Column<Artist>[] = [
    {
      key: 'name',
      header: 'Artist',
      render: (artist) => (
        <div className="flex items-center gap-3 min-w-[200px] max-w-[280px]">
          <div className="relative shrink-0">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="h-10 w-10 rounded-lg object-cover border border-slate-200 shadow-2xs"
            />
            {artist.verified && (
              <div
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-purple-600 text-white flex items-center justify-center border border-white"
                title="Verified Artist"
              >
                <CheckCircle2 className="h-2.5 w-2.5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-sm text-slate-900 truncate block" title={artist.name}>
              {artist.name}
            </span>
            <span
              className="text-[11.5px] text-slate-500 truncate block mt-0.5"
              title={artist.bio}
            >
              {artist.bio || '—'}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (artist) => (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 whitespace-nowrap">
          {artist.genre || 'General'}
        </span>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (artist) => (
        <span className="text-slate-700 text-xs truncate max-w-[180px] block">
          {artist.management?.email ? (
            <a
              href={`mailto:${artist.management.email}`}
              className="text-slate-700 hover:text-purple-700 hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {artist.management.email}
            </a>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </span>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (artist) => (
        <span className="text-slate-700 text-xs whitespace-nowrap">
          {artist.management?.phone ? (
            <a
              href={`tel:${artist.management.phone}`}
              className="text-slate-700 hover:text-purple-700 hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {artist.management.phone}
            </a>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (artist) => {
        const isActive = artist.status === 'active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${isActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
            />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
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
            className="p-1.5 rounded-md text-purple-700 hover:text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
            title="View Artist Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleOpenEdit(artist)}
            className="p-1.5 rounded-md text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-colors cursor-pointer"
            title="Edit Artist"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleDelete(artist.id, artist.name)}
            className="p-1.5 rounded-md text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
            title="Delete Artist"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
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
            <div className="h-10 w-10 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
              <Mic2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="PageTitle">
                Artists & Headliners
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage touring headliners, update performance status, upload technical riders, and coordinate tour lineups.
              </p>
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* <button
            type="button"
            onClick={fetchArtists}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
            title="Sync latest roster from backend API"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Sync Live'}</span>
          </button> */}

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs shadow-purple-200 transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Artist</span>
          </button>
        </div>
      </div>

      {/* Metrics Row: Total Artists, Active Artists, Inactive Artists */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <MetricCard
          label="Total Artists"
          value={totalArtists}
          subtext="Managed in vendor catalog"
          icon={Users}
          accentColor="purple"
        />

        <MetricCard
          label="Active Artists"
          value={activeCount}
          subtext="Available & touring on platform"
          icon={UserCheck}
          accentColor="emerald"
        />

        <MetricCard
          label="Inactive Artists"
          value={inactiveCount}
          subtext="On hiatus, break or paused"
          icon={UserX}
          accentColor="rose"
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
              className="w-full h-10 rounded-lg border border-slate-200 bg-white pl-9.5 pr-9 py-2 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 "
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
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              {CATEGORY_FILTERS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              <option value="all">All Statuses ({totalArtists})</option>
              <option value="active">Active ({activeCount})</option>
              <option value="inactive">Inactive ({inactiveCount})</option>
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
              No artists match your current search criteria. Try modifying your search query or category filter.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
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
                            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs backdrop-blur-md ${artist.status === 'active'
                              ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                              : 'bg-slate-800/90 text-slate-300 border-slate-700'
                              }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${artist.status === 'active' ? 'bg-white' : 'bg-slate-400'
                                }`}
                            />
                            {artist.status === 'active' ? 'Active' : 'Inactive'}
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

                          {/* <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {artist.genre}
                          </span> */}
                        </div>

                        {/* Artist Title & Bio */}
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate" title={artist.name}>
                            {artist.name}
                          </h3>
                          <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500 line-clamp-2 font-normal" title={artist.bio}>
                            {artist.bio || 'No bio provided.'}
                          </p>
                        </div>

                        {/* Contact: Email & Phone from Form */}
                        <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
                          {artist.management?.email ? (
                            <a
                              href={`mailto:${artist.management.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 min-w-0 max-w-[150px] px-2 py-1 rounded-md text-[11px] font-medium text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/70 transition-colors shadow-2xs"
                              title={artist.management.email}
                            >
                              <Mail className="h-3 w-3 text-blue-500 shrink-0" />
                              <span className="truncate">{artist.management.email}</span>
                            </a>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                              <Mail className="h-3 w-3 text-slate-300 shrink-0" />
                              <span className="italic">No email</span>
                            </div>
                          )}
                          {artist.management?.phone ? (
                            <a
                              href={`tel:${artist.management.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-md text-[11px] font-medium text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/70 transition-colors shadow-2xs"
                              title={artist.management.phone}
                            >
                              <Phone className="h-3 w-3 text-emerald-500 shrink-0" />
                              <span className="truncate">{artist.management.phone}</span>
                            </a>
                          ) : null}
                        </div>

                        {/* Subgenre Tags */}
                        {/* {artist.subGenres && artist.subGenres.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            {artist.subGenres.slice(0, 3).map((sg, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80 transition-colors shadow-2xs"
                              >
                                {sg}
                              </span>
                            ))}
                            {artist.subGenres.length > 3 && (
                              <span className="text-[10px] font-semibold text-slate-400 pl-0.5">
                                +{artist.subGenres.length - 3} more
                              </span>
                            )}
                          </div>
                        )} */}
                      </div>
                    </div>

                    {/* Footer specs & actions */}
                    <div className="px-4.5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRiderArtist(artist)}
                        className="p-1.5 inline-flex items-center gap-1.5 rounded-md text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
                        title="View technical and hospitality rider"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(artist)}
                          className="p-1.5 rounded-md text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-colors cursor-pointer"
                          title="Edit artist details"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(artist.id, artist.name)}
                          className="p-1.5 rounded text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
                          title="Delete artist from roster"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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

      {/* Global Create Artist Modal (POST /api/vendor/concerts/artists) */}
      <CreateArtistModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddArtist={handleCreateArtist}
        onShowToast={onShowToast}
      />

      {/* Edit Artist Modal (PATCH /api/vendor/concerts/artists/:id) */}
      {isEditOpen && editingArtist && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingArtist(null);
          }}
          title={`Edit Artist: ${editingArtist.name}`}
          subtitle="Update category, contact details, status, bio, or upload a new headshot photo"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Artist Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Category *</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  {ARTIST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Email (Optional)</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="artist@example.com"
                  className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Phone (Optional)</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as Artist['status'])}
                className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
              >
                <option value="active">Active (Available for Concerts)</option>
                <option value="inactive">Inactive (Unavailable)</option>
              </select>
            </div>

            {/* Profile Photo / Avatar Upload (Supports Multipart Form-Data as in artists.txt Option A) */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Profile Photo / Avatar</label>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <img
                  src={editAvatarPreview || editingArtist.avatar}
                  alt={editingArtist.name}
                  className="h-12 w-12 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-600 font-medium truncate">
                    {editAvatarFile ? editAvatarFile.name : 'Current photo loaded'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditAvatarFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditAvatarPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Bio / About Us */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">About Us / Bio</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Artist biography or touring details..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs resize-y"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingArtist(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingEdit}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Artist Details View Modal */}
      {selectedRiderArtist && (
        <Modal
          isOpen={!!selectedRiderArtist}
          onClose={() => setSelectedRiderArtist(null)}
          title="Artist Details"
          subtitle="Profile overview and contact information"
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Header: Photo, Name, Category, Status */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-xs">
                <AppImage
                  src={selectedRiderArtist.avatar}
                  alt={selectedRiderArtist.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {selectedRiderArtist.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${selectedRiderArtist.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${selectedRiderArtist.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                    />
                    {selectedRiderArtist.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200">
                    {selectedRiderArtist.genre || 'General'}
                  </span>
                </div> */}
              </div>
            </div>

            {/* Contact Details: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">Email Address</span>
                </div>
                {selectedRiderArtist.management?.email ? (
                  <a
                    href={`mailto:${selectedRiderArtist.management.email}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline block truncate"
                  >
                    {selectedRiderArtist.management.email}
                  </a>
                ) : (
                  <span className="text-sm text-slate-500 italic">Not provided</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">Phone Number</span>
                </div>
                {selectedRiderArtist.management?.phone ? (
                  <a
                    href={`tel:${selectedRiderArtist.management.phone}`}
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline block truncate"
                  >
                    {selectedRiderArtist.management.phone}
                  </a>
                ) : (
                  <span className="text-sm text-slate-500 italic">Not provided</span>
                )}
              </div>
            </div>

            {/* About Us / Bio */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">About / Biography</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedRiderArtist.bio || 'No biography provided for this artist.'}
              </p>
            </div>

            {/* Actions: Edit & Close */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedRiderArtist(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = selectedRiderArtist;
                  setSelectedRiderArtist(null);
                  handleOpenEdit(current);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-colors cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Artist</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
