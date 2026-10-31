import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users2,
  TrendingUp,
  Plus,
  ShieldCheck,
  Coffee
} from 'lucide-react';
import type { StrangerMeet } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { CreateStrangerMeetModal } from './CreateStrangerMeetModal';
import {
  ModuleTrendLineChart,
  ModuleInventoryFillChart,
  FunnelChart,
  StrangerMeetDistributionChart,
  type Timeframe
} from '../charts';

interface StrangerMeetsOverviewProps {
  meets: StrangerMeet[];
  onOpenCreateMeet?: () => void;
  onSelectMeet?: (meet: StrangerMeet) => void;
  onAddMeet?: (meet: StrangerMeet) => void;
  onShowToast?: (text: string, type?: 'success' | 'error' | 'info') => void;
  currentVendorName?: string;
}

export const StrangerMeetsOverview: React.FC<StrangerMeetsOverviewProps> = ({
  meets,
  onOpenCreateMeet,
  onSelectMeet,
  onAddMeet,
  onShowToast,
  currentVendorName = 'Wayfor Community'
}) => {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [timeframe, setTimeframe] = React.useState<Timeframe>('30D');

  // Calculations
  const activeMeets = useMemo(() => meets.filter(m => m.status === 'active' || m.status === 'upcoming'), [meets]);
  const totalBuddies = useMemo(() => meets.reduce((sum, m) => sum + (m.participants?.length || 0), 0), [meets]);
  const totalCapacity = useMemo(() => meets.reduce((sum, m) => sum + (m.maxParticipants || 1), 0), [meets]);

  const totalGMV = useMemo(() => {
    return meets.reduce((sum, m) => {
      const buddies = m.participants?.length || 0;
      return sum + (buddies * (m.pricePerPerson || 0));
    }, 0);
  }, [meets]);

  const avgFillRate = totalCapacity > 0 ? Math.round((totalBuddies / totalCapacity) * 100) : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakh`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="PageTitle">
                Stranger Meets Overview
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Monitor real-world social mixers, coffee connect events, attendee rosters, and community engagement.
              </p>
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => navigate('/stranger-meets/buddies')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
          >
            <Users2 className="h-3.5 w-3.5 text-teal-600" />
            <span>Buddies Roster</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (onOpenCreateMeet) onOpenCreateMeet();
              else setIsCreateOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 shadow-xs shadow-teal-200 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Host Community Mixer</span>
          </button>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Passes Gross Volume"
          value={formatCurrency(totalGMV)}
          isPositive={true}
          icon={TrendingUp}
          accentColor="cyan"
        />

        <MetricCard
          label="Confirmed Buddies / RSVPs"
          value={totalBuddies.toLocaleString()}
          isPositive={true}
          icon={Users2}
          accentColor="emerald"
        />

        <MetricCard
          label="Active Community Mixers"
          value={`${activeMeets.length} Active`}
          isPositive={true}
          icon={Coffee}
          accentColor="amber"
        />

        <MetricCard
          label="Trust & Safety Rating"
          value="98.5%"
          isPositive={true}
          icon={ShieldCheck}
          accentColor="purple"
        />
      </div>

      {/* Community Analytics Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelChart
          title="Mixer RSVP Conversion Funnel"
          subtitle="Community discovery through confirmed mixer attendees"
          unit="buddies"
          tiers={[
            {
              id: 'views',
              label: 'Mixer Page Visitors',
              value: Math.max(1200, totalBuddies * 24),
              badgeText: '100%'
            },
            {
              id: 'interest',
              label: 'Viewed Slots & Meeting Points',
              value: Math.max(520, Math.round(totalBuddies * 9.8)),
              badgeText: '43%'
            },
            {
              id: 'applications',
              label: 'RSVP Applications Submitted',
              value: Math.max(150, Math.round(totalBuddies * 2.8)),
              badgeText: '12%'
            },
            {
              id: 'confirmed',
              label: 'Confirmed Buddies',
              value: totalBuddies,
              badgeText: `${((totalBuddies / Math.max(1200, totalBuddies * 24)) * 100).toFixed(1)}%`
            }
          ]}
        />

        <StrangerMeetDistributionChart
          meets={meets}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Key Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModuleTrendLineChart
          title="Community Mixer RSVP Velocity"
          accentColor="teal"
          totalAmount={totalGMV}
          totalVolume={totalBuddies}
          unit="buddies"
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          formatCurrency={formatCurrency}
          subtext={meets.map(m => `${m.city} (${m.title})`).slice(0, 2).join(' • ')}
        />

        <ModuleInventoryFillChart
          title="Mixer Attendance & RSVP Utilization"
          accentColor="teal"
          items={meets.map(m => {
            const cap = m.maxParticipants || 1;
            const joined = m.participants?.length || 0;
            return {
              id: m.id,
              title: m.title,
              subtitle: `${m.city} • ${m.meetingPoint}`,
              filled: joined,
              capacity: cap,
              fillPct: Math.min(100, Math.round((joined / cap) * 100)),
              revenue: joined * (m.pricePerPerson || 0),
              unit: 'buddies',
              tag: m.category
            };
          })}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Host Mixer Modal */}
      <CreateStrangerMeetModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddMeet={(newMeet) => {
          if (onAddMeet) onAddMeet(newMeet);
          if (onShowToast) onShowToast(`Community mixer "${newMeet.title}" hosted successfully!`);
          setIsCreateOpen(false);
        }}
        currentVendorName={currentVendorName}
      />
    </div>
  );
};
