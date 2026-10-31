import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  MapPin,
  Calendar,
  Filter,
  Plus,
  ShieldCheck,
  Search,
  CheckCircle2,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import type { StrangerMeet, StrangerMeetParticipant } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { StrangerMeetCard } from './StrangerMeetCard';
import { StrangerMeetDetailModal } from './StrangerMeetDetailModal';
import { CreateStrangerMeetModal } from './CreateStrangerMeetModal';
import { Table, type Column } from '../common/Table';
import { Badge } from '../common/Badge';

interface VendorStrangerMeetsViewProps {
  meets: StrangerMeet[];
  onAddMeet: (meet: StrangerMeet) => void;
  onDeleteMeet: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  currentVendorName?: string;
  activeSubTab?: 'all-meets' | 'buddies';
}

export const VendorStrangerMeetsView: React.FC<VendorStrangerMeetsViewProps> = ({
  meets,
  onAddMeet,
  onDeleteMeet,
  onShowToast,
  currentVendorName = 'Zenith Community Desk',
  activeSubTab = 'all-meets'
}) => {
  const [currentSubTab, setCurrentSubTab] = useState<'all-meets' | 'buddies'>(activeSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [selectedMeet, setSelectedMeet] = useState<StrangerMeet | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const categories = [
    'All',
    'Music & Nightlife',
    'Coffee & Chill',
    'Weekend Roadtrip',
    'Trek & Adventure',
    'City Walk & Food'
  ];

  // Extract all participants
  const allBuddies: (StrangerMeetParticipant & { meetTitle: string; meetCity: string; meetDate: string })[] = meets.flatMap((m) =>
    m.participants.map((p) => ({
      ...p,
      meetTitle: m.title,
      meetCity: m.city,
      meetDate: m.meetDate
    }))
  );

  // Metrics
  const activeMeetsCount = meets.filter((m) => m.status === 'active' || m.status === 'upcoming').length;
  const totalBuddiesMatched = allBuddies.length;
  const totalEstimatedPassRevenue = meets.reduce(
    (acc, m) => acc + ((m.pricePerPerson || 0) * m.participants.length),
    0
  );

  // Filtered Meets
  const filteredMeets = meets.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.meetingPoint.toLowerCase().includes(q) ||
      m.vibeTags.some((tag) => tag.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
    return true;
  });

  // Filtered Buddies
  const filteredBuddies = allBuddies.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.meetTitle.toLowerCase().includes(q) ||
      b.interests.some((i) => i.toLowerCase().includes(q))
    );
  });

  const meetColumns: Column<StrangerMeet>[] = [
    {
      key: 'title',
      header: 'Meetup / Mixer',
      render: (item) => (
        <div>
          <span
            className="font-semibold text-slate-900 block hover:text-teal-700 cursor-pointer"
            onClick={() => setSelectedMeet(item)}
          >
            {item.title}
          </span>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-teal-600" />
            {item.city} • {item.meetingPoint}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (
        <span className="text-xs bg-teal-50 text-teal-800 font-medium px-2 py-0.5 rounded-full border border-teal-200">
          {item.category}
        </span>
      )
    },
    {
      key: 'timing',
      header: 'Schedule',
      render: (item) => (
        <div className="text-xs text-slate-600">
          <span className="block font-medium">{item.meetDate}</span>
          <span className="text-[11px] text-slate-400">{item.meetTime}</span>
        </div>
      )
    },
    {
      key: 'capacity',
      header: 'Guests Joined',
      render: (item) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800">{item.participants.length}</span>
          <span className="text-slate-400"> / {item.maxParticipants}</span>
          <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full"
              style={{ width: `${Math.min(100, (item.participants.length / item.maxParticipants) * 100)}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Entry Pass',
      render: (item) => (
        <span className="text-xs font-semibold text-teal-700">
          {item.pricePerPerson ? `₹${item.pricePerPerson}` : 'Free Access'}
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
            onClick={() => setSelectedMeet(item)}
            className="text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
          >
            Manifest
          </button>
        </div>
      )
    }
  ];

  const buddyColumns: Column<typeof allBuddies[0]>[] = [
    {
      key: 'attendee',
      header: 'Participant Profile',
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <img src={item.avatar} alt={item.name} className="h-8 w-8 rounded-xl object-cover ring-1 ring-slate-200" />
          <div>
            <span className="text-xs font-semibold text-slate-900 block flex items-center gap-1">
              {item.name}
              {item.verifiedKYC && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
            </span>
            <span className="text-[10px] text-slate-400">{item.city} • Age {item.age}</span>
          </div>
        </div>
      )
    },
    {
      key: 'meet',
      header: 'Enrolled Mixer',
      render: (item) => (
        <div>
          <span className="text-xs font-medium text-slate-800 block truncate max-w-xs">{item.meetTitle}</span>
          <span className="text-[11px] text-slate-500">{item.meetCity} • {item.meetDate}</span>
        </div>
      )
    },
    {
      key: 'interests',
      header: 'Vibes & Interests',
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.interests.slice(0, 2).map((interest, i) => (
            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {interest}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'score',
      header: 'Social Trust Score',
      render: (item) => (
        <span className="text-xs font-semibold text-teal-700">
          {item.socialScore}%
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          KYC Confirmed
        </span>
      )
    }
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200">
              Stranger Meets Module
            </span>
            <span className="text-xs text-slate-400">• Verified Community Mixers</span>
          </div> */}

          <h1 className="PageTitle">
            Stranger Meets & Community Socials
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Host verified speed networking, rooftop acoustic jams, cafe icebreakers, and social clubs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Host Community Meet</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          label="Active Community Mixers"
          value={activeMeetsCount}
          subtext="Scheduled verified events"
          icon={Sparkles}
          accentColor="cyan"
        />
        <MetricCard
          label="Verified Buddies"
          value={totalBuddiesMatched}
          subtext="Confirmed guest registrations"
          icon={Users}
          accentColor="emerald"
        />
        <MetricCard
          label="Safety Compliance"
          value="100%"
          subtext="KYC photo ID verified"
          icon={ShieldCheck}
          accentColor="cyan"
        />
        <MetricCard
          label="Social Pass Volume"
          value={`₹${totalEstimatedPassRevenue.toLocaleString('en-IN')}`}
          subtext="Cleared entrance reservations"
          icon={Users}
          accentColor="purple"
        />
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 gap-2 overflow-x-auto pb-0.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentSubTab('all-meets')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${currentSubTab === 'all-meets'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Community Mixers ({meets.length})
          </button>
          <button
            type="button"
            onClick={() => setCurrentSubTab('buddies')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${currentSubTab === 'buddies'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Attendees & Buddies Roster ({allBuddies.length})
          </button>
        </div>

        {currentSubTab === 'all-meets' && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs cursor-pointer ${viewMode === 'grid' ? 'bg-white text-teal-700 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              title="Grid Cards"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs cursor-pointer ${viewMode === 'table' ? 'bg-white text-teal-700 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
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
            placeholder={currentSubTab === 'all-meets' ? "Search meets by title, city, venue, tags..." : "Search attendee name, city, interest..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-2xs"
          />
        </div>

        {currentSubTab === 'all-meets' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
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
      {currentSubTab === 'all-meets' ? (
        filteredMeets.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <Sparkles className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No community meets found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or host a new session.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeets.map((meet) => (
              <StrangerMeetCard
                key={meet.id}
                meet={meet}
                onSelect={(m) => setSelectedMeet(m)}
                onDelete={(id) => {
                  onDeleteMeet(id);
                  onShowToast('Community mixer archived.', 'info');
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
            <Table columns={meetColumns} data={filteredMeets} keyExtractor={(item) => item.id} />
          </div>
        )
      ) : (
        /* Buddies Roster */
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
          <Table columns={buddyColumns} data={filteredBuddies} keyExtractor={(item) => item.id} />
        </div>
      )}

      {/* Modals */}
      <StrangerMeetDetailModal
        isOpen={Boolean(selectedMeet)}
        meet={selectedMeet}
        onClose={() => setSelectedMeet(null)}
      />

      <CreateStrangerMeetModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddMeet={(newMeet) => {
          onAddMeet(newMeet);
          onShowToast(`Community mixer "${newMeet.title}" published!`);
        }}
        currentVendorName={currentVendorName}
      />
    </div>
  );
};
