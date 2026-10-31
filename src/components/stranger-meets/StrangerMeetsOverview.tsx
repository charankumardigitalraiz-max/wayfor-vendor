import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users2,
  Calendar,
  MapPin,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  ShieldCheck,
  Coffee,
  CheckCircle2,
  Heart,
  Tag
} from 'lucide-react';
import type { StrangerMeet } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { StrangerMeetDetailModal } from './StrangerMeetDetailModal';
import { CreateStrangerMeetModal } from './CreateStrangerMeetModal';
import {
  ModuleTrendLineChart,
  ModuleInventoryFillChart,
  HeatmapChart,
  BubbleChart,
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
  const [selectedMeetModal, setSelectedMeetModal] = React.useState<StrangerMeet | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [timeframe, setTimeframe] = React.useState<Timeframe>('30D');
  const [chartView, setChartView] = React.useState<'heatmap-bubble' | 'trend-fill'>('heatmap-bubble');

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

  // Recent Buddies roster preview
  const recentBuddies = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      avatar: string;
      meetTitle: string;
      joinedAt: string;
      status: string;
      gender?: string;
      verifiedKYC?: boolean;
    }> = [];

    meets.forEach((meet) => {
      (meet.participants || []).forEach((p) => {
        list.push({
          id: `${meet.id}-${p.id}`,
          name: p.name,
          avatar: p.avatar,
          meetTitle: meet.title,
          joinedAt: p.joinedAt,
          status: p.status,
          gender: p.gender,
          verifiedKYC: p.verifiedKYC
        });
      });
    });

    return list.slice(0, 5);
  }, [meets]);

  // Categories breakdown
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    meets.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [meets]);

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

      {/* Chart Section Header with Chart Type Switcher */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Community Dynamics & Mixer Intelligence
          </h3>
          <p className="text-[11px] text-slate-400">
            {chartView === 'heatmap-bubble'
              ? 'Weekly activity check-in heatmap & community category growth bubble matrix'
              : 'Historical RSVP velocity wave & attendance slot utilization breakdown'}
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setChartView('heatmap-bubble')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${chartView === 'heatmap-bubble'
              ? 'bg-white text-teal-800 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Heatmap & Bubbles
          </button>
          <button
            type="button"
            onClick={() => setChartView('trend-fill')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${chartView === 'trend-fill'
              ? 'bg-white text-teal-800 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Velocity & Donut
          </button>
        </div>
      </div>

      {/* Two Specialized Charts */}
      {chartView === 'heatmap-bubble' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HeatmapChart
            title="Mixer Activity & Check-ins Heatmap"
            subtitle="Member RSVP density and check-in frequency across days of week"
            xLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            yLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            data={(() => {
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const cells = [];
              for (const m of months) {
                for (const d of days) {
                  // Heavy spikes on Fri, Sat, Sun evenings
                  let base = (d === 'Sat' || d === 'Sun') ? 35 : d === 'Fri' ? 24 : 8;
                  if (m === 'Jul' || m === 'Aug' || m === 'Oct' || m === 'Dec') base *= 1.8;
                  const noise = Math.floor(Math.sin(m.charCodeAt(0) + d.charCodeAt(0)) * 6);
                  cells.push({
                    x: m,
                    y: d,
                    value: Math.max(2, Math.round(base + noise))
                  });
                }
              }
              return cells;
            })()}
          />

          <BubbleChart
            title="Mixer Categories & Member Growth"
            subtitle="RSVP scale (X) vs monthly growth % (Y) sized by total revenue"
            xAxisLabel="Confirmed Buddies / RSVPs"
            yAxisLabel="RSVP Growth Rate (%)"
            sizeLabel="Bubble diameter represents total pass GMV"
            bubbles={[
              {
                id: 'music-jam',
                name: 'Music & Jam Sessions',
                x: 255,
                y: 38,
                size: 42,
                category: 'Music',
                metricText: '₹4.8L revenue'
              },
              {
                id: 'trek-adventure',
                name: 'Weekend Trekkers',
                x: 185,
                y: 26,
                size: 32,
                category: 'Outdoor',
                metricText: '₹3.2L revenue'
              },
              {
                id: 'boardgames',
                name: 'Cafe & Boardgames',
                x: 130,
                y: 16,
                size: 20,
                category: 'Social',
                metricText: '₹1.8L revenue'
              },
              {
                id: 'tech-founder',
                name: 'Startup Founders',
                x: 220,
                y: 44,
                size: 48,
                category: 'Tech',
                metricText: '₹5.6L revenue'
              },
              {
                id: 'sunset-walk',
                name: 'Sunset Photo Walks',
                x: 75,
                y: 8,
                size: 14,
                category: 'Lifestyle',
                metricText: '₹95k revenue'
              }
            ]}
          />
        </div>
      ) : (
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
      )}

      {/* Category Distribution Tiles */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(categoryStats).map(([cat, count]) => (
          <div
            key={cat}
            className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] text-slate-500 font-medium">{cat}</div>
              <div className="text-base font-semibold text-slate-900 mt-0.5">{count} Mixers</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-semibold text-xs">
              {count}
            </div>
          </div>
        ))}
      </div> */}

      {/* Active & Priority Community Mixers */}
      {/* <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Live Mixers & Spot Reservations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live RSVP counts, venue spots, vibe tags, and community passes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/stranger-meets')}
            className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
          >
            <span>View All Mixers</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meets.map((meet) => {
            const joined = meet.participants?.length || 0;
            const max = meet.maxParticipants || 1;
            const pct = Math.min(100, Math.round((joined / max) * 100));

            return (
              <div
                key={meet.id}
                onClick={() => {
                  setSelectedMeetModal(meet);
                  if (onSelectMeet) onSelectMeet(meet);
                }}
                className="group rounded-xl border border-slate-200/90 bg-white p-4 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={meet.coverImage || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80'}
                      alt={meet.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
                        {meet.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${meet.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : meet.status === 'upcoming'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-slate-100 text-slate-700'
                        }`}>
                        {meet.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                    {meet.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-teal-600 shrink-0" />
                    <span>{meet.meetingPoint}, {meet.city}</span>
                  </p>

                
                  <div className="flex flex-wrap gap-1 mt-2">
                    {meet.vibeTags.slice(0, 3).map((vibe) => (
                      <span
                        key={vibe}
                        className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-600"
                      >
                        #{vibe}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Reserved Spots</span>
                    <span className="font-semibold text-teal-800">
                      {joined} / {max} ({pct}%)
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-800 font-semibold">
                      {meet.pricePerPerson && meet.pricePerPerson > 0 ? (
                        <>₹{meet.pricePerPerson.toLocaleString()} <span className="text-slate-400 font-normal">/pass</span></>
                      ) : (
                        <span className="text-emerald-600 font-semibold">Free RSVP</span>
                      )}
                    </span>
                    <span className="text-teal-700 font-semibold group-hover:underline inline-flex items-center gap-1">
                      Event Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Confirmed Buddies Roster Preview */}
      {/* <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Recent Confirmed Buddies & RSVPs
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified community members signed up for upcoming city mixers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/stranger-meets/buddies')}
            className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
          >
            <span>View Full Roster</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentBuddies.map((buddy) => (
            <div key={buddy.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={buddy.avatar}
                  alt={buddy.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {buddy.name}
                    </span>
                    {buddy.verifiedKYC && (
                      <CheckCircle2 className="h-3 w-3 text-teal-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    RSVP for: <span className="text-teal-700 font-medium">{buddy.meetTitle}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-right">
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-semibold border border-teal-100">
                  {buddy.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Meet Details Modal */}
      <StrangerMeetDetailModal
        isOpen={Boolean(selectedMeetModal)}
        meet={selectedMeetModal}
        onClose={() => setSelectedMeetModal(null)}
      />

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
