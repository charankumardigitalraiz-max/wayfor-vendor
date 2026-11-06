import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  RotateCcw,
  Sliders,
  FolderTree,
  Music,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  X
} from 'lucide-react';
import { initialCategories, EventCategory } from '../../data/categoryData';
import { CategoryForm } from './CategoryForm';
import { Table, type Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';
import { Pagination } from '../common/Pagination';
import { formatUtcDate } from '../../utils/dateUtils';

type ViewMode = 'list' | 'create' | 'edit';

const STORAGE_KEY = 'wayfor_vendor_categories';

export const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<EventCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved categories, falling back to initial data', e);
    }
    return initialCategories;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const saveCategories = (cats: EventCategory[]) => {
    setCategories(cats);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  };

  const hasActiveFilters = search.trim() !== '' || statusFilter !== 'all' || sortBy !== 'name-asc';

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setSortBy('name-asc');
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  const filteredCategories = useMemo(() => {
    const list = categories.filter((cat) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cat.name.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'all' || cat.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    list.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'events-desc') {
        return (b.eventsCount || 0) - (a.eventsCount || 0);
      }
      if (sortBy === 'fields-desc') {
        return (b.customFields?.length || 0) - (a.customFields?.length || 0);
      }
      if (sortBy === 'date-desc') {
        return new Date(b.createdDate || '').getTime() - new Date(a.createdDate || '').getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.createdDate || '').getTime() - new Date(b.createdDate || '').getTime();
      }
      return 0;
    });

    return list;
  }, [categories, search, statusFilter, sortBy]);

  // Pagination calculations
  const totalItems = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedCategories = useMemo(() => {
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, startIndex, endIndex]);

  // Calculate summary metrics for the Cards
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === 'active').length;
  const totalEventsMapped = categories.reduce((sum, c) => sum + (c.eventsCount || 0), 0);
  const totalDynamicFields = categories.reduce((sum, c) => sum + (c.customFields?.length || 0), 0);

  const handleStartCreate = () => {
    setSelectedCategory(null);
    setViewMode('create');
  };

  const handleStartEdit = (category: EventCategory) => {
    setSelectedCategory(category);
    setViewMode('edit');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      const updated = categories.filter((c) => c.id !== id);
      saveCategories(updated);
    }
  };

  const handleSaveForm = (categoryData: Partial<EventCategory>) => {
    if (viewMode === 'edit' && selectedCategory) {
      const updated = categories.map((c) => {
        if (c.id === selectedCategory.id) {
          return {
            ...c,
            ...categoryData
          } as EventCategory;
        }
        return c;
      });
      saveCategories(updated);
    } else {
      const newCat: EventCategory = {
        id: `cat-${Date.now()}`,
        name: categoryData.name || 'Untitled Category',
        status: categoryData.status || 'active',
        eventsCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        customFields: categoryData.customFields || []
      };
      saveCategories([newCat, ...categories]);
    }
    setViewMode('list');
    setSelectedCategory(null);
  };

  // If in create or edit mode, display full screen CategoryForm
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <CategoryForm
        initialData={selectedCategory}
        onSave={handleSaveForm}
        onCancel={() => {
          setViewMode('list');
          setSelectedCategory(null);
        }}
      />
    );
  }

  // Consistent Table Columns
  const columns: Column<EventCategory>[] = [
    {
      key: 'name',
      header: 'Category Name',
      render: (cat) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60 shrink-0">
            <FolderTree className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleStartEdit(cat);
              }}
              className="font-semibold text-slate-900 hover:text-purple-600 cursor-pointer block truncate"
            >
              {cat.name}
            </span>
            {cat.description && (
              <p className="text-[11px] text-slate-400 truncate max-w-xs">{cat.description}</p>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'eventsCount',
      header: 'Events Listed',
      render: (cat) => (
        <span className="font-semibold text-slate-800 whitespace-nowrap">
          {cat.eventsCount.toLocaleString()} events
        </span>
      )
    },
    {
      key: 'dynamicFields',
      header: 'Dynamic Fields',
      render: (cat) => {
        const count = cat.customFields?.length || 0;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              count > 0
                ? 'bg-purple-50 text-purple-700 border-purple-200/80'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <Sliders className="h-3 w-3 text-purple-500" />
            <span>{count} {count === 1 ? 'Dynamic Field' : 'Dynamic Fields'}</span>
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: (cat) => <Badge status={cat.status} />
    },
    {
      key: 'createdDate',
      header: 'Created Date',
      render: (cat) => (
        <span className="text-slate-600 whitespace-nowrap text-xs">
          {formatUtcDate(cat.createdDate) || cat.createdDate}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (cat) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStartEdit(cat);
            }}
            className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200/80 transition-all cursor-pointer shadow-2xs"
            title="Edit Category"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(cat.id, cat.name);
            }}
            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200/80 transition-all cursor-pointer shadow-2xs"
            title="Delete Category"
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
          <h1 className="PageTitle">
            Event Categories & Dynamic Fields
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize concert classifications, booking standards, and category-level dynamic questionnaires.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Categories"
          value={totalCategories}
          isPositive={true}
          icon={FolderTree}
          accentColor="purple"
        />

        <MetricCard
          label="Active Status"
          value={activeCategories}
          isPositive={true}
          icon={TrendingUp}
          accentColor="emerald"
        />

        <MetricCard
          label="Total Events Listed"
          value={totalEventsMapped}
          isPositive={true}
          icon={Music}
          accentColor="cyan"
        />

        <MetricCard
          label="Custom Dynamic Fields"
          value={totalDynamicFields}
          isPositive={true}
          icon={Sliders}
          accentColor="amber"
        />
      </div>

      {/* Unified Attached Card: Header Controls + Table Body + Pagination Footer */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
        {/* Card Header: Search & Filter Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white">
          {/* Left: Search Bar */}
          <div className="relative flex-1 sm:max-w-xs md:max-w-sm group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category name, description..."
              className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white pl-10 pr-9 py-2 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right: Dropdowns + Sort + Reset */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* Status Dropdown */}
            <div className="relative inline-flex items-center group">
              <SlidersHorizontal
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors pointer-events-none ${
                  statusFilter !== 'all' ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`appearance-none h-10 rounded-md border pl-9 pr-8 py-2 text-xs sm:text-[13px] font-medium outline-none transition-all cursor-pointer shadow-2xs ${
                  statusFilter !== 'all'
                    ? 'bg-purple-50/80 text-purple-900 border-purple-200'
                    : 'bg-white hover:bg-white border-slate-200/90 text-slate-700'
                }`}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`appearance-none h-10 rounded-md border pl-3.5 pr-8 py-2 text-xs sm:text-[13px] font-medium outline-none transition-all cursor-pointer shadow-2xs ${
                  sortBy !== 'name-asc'
                    ? 'bg-purple-50/80 text-purple-900 border-purple-200'
                    : 'bg-white hover:bg-white border-slate-200/90 text-slate-700'
                }`}
              >
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="events-desc">Most Events Listed</option>
                <option value="fields-desc">Most Dynamic Fields</option>
                <option value="date-desc">Created: Latest First</option>
                <option value="date-asc">Created: Earliest First</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-10 px-3 rounded-md border border-rose-200/80 bg-rose-50/70 text-rose-700 hover:bg-rose-100 hover:border-rose-300 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                title="Reset all filters"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-slate-400">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-medium shadow-2xs">
                  <span>"{search}"</span>
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 text-purple-800 font-medium shadow-2xs">
                  <span>Status: {statusFilter === 'active' ? 'Active Only' : 'Inactive Only'}</span>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className="text-purple-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {sortBy !== 'name-asc' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-medium shadow-2xs">
                  <span>Sorted</span>
                  <button
                    type="button"
                    onClick={() => setSortBy('name-asc')}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>

            <span className="text-[11px] font-medium text-slate-400 ml-auto">
              Showing <span className="text-slate-700 font-semibold">{filteredCategories.length}</span> of{' '}
              <span className="text-slate-700 font-semibold">{categories.length}</span> categories
            </span>
          </div>
        )}

        {/* Table Body Directly Attached */}
        {paginatedCategories.length > 0 ? (
          <Table
            columns={columns}
            data={paginatedCategories}
            keyExtractor={(cat) => cat.id}
            onRowClick={(cat) => handleStartEdit(cat)}
            pageSize={pageSize}
            showPagination={false}
            containerClassName="border-0 rounded-none shadow-none bg-transparent"
            footer={
              filteredCategories.length > 0 ? (
                <Pagination
                  variant="attached"
                  currentPage={safeCurrentPage}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  pageSizeOptions={[5, 10, 15, 20]}
                  itemName="categories"
                />
              ) : null
            }
          />
        ) : (
          <div className="p-12 text-center space-y-3">
            <FolderTree className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">
              No event categories found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or filters, or create a new event classification.
            </p>
            <button
              type="button"
              onClick={handleStartCreate}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Category</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
