import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music,
  Calendar,
  Ticket,
  TrendingUp,
  MapPin,
  Building2,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Car,
  AlertTriangle,
  Radio,
  Sliders,
  DollarSign,
  Compass,
  Sparkles,
  Users2,
  ChevronRight
} from 'lucide-react';
import type { ConcertEvent, TripPlan, StrangerMeet } from '../../types';
import type { VendorUser } from '../../types/auth';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import {
  MultiModuleTrendChart,
  GroupedModuleBarChart,
  ModuleDistributionDonutChart,
  ModuleCapacityHealthChart,
  type Timeframe
} from '../charts';
import { mockVendorProfile } from '../../data/mockVendorData';

interface VendorOverviewProps {
  concerts: ConcertEvent[];
  trips?: TripPlan[];
  strangerMeets?: StrangerMeet[];
  currentVendor?: VendorUser | null;
  onOpenCreateConcert: () => void;
  onSelectConcert: (concert: ConcertEvent) => void;
}

export const VendorOverview: React.FC<VendorOverviewProps> = ({
  concerts,
  trips = [],
  strangerMeets = [],
  currentVendor,
  onOpenCreateConcert,
  onSelectConcert
}) => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');

  // Assigned module permissions
  const assignedModules: string[] = useMemo(() => {
    if (currentVendor?.serviceModules && currentVendor.serviceModules.length > 0) {
      return currentVendor.serviceModules as string[];
    }
    return [currentVendor?.serviceModule || 'concerts'];
  }, [currentVendor]);

  const hasConcerts = assignedModules.includes('concerts');
  const hasTrips = assignedModules.includes('trips');
  const hasMeets = assignedModules.includes('stranger-meets');

  // Concerts Module Stats
  const activeEvents = useMemo(() => concerts.filter(c => c.status === 'active'), [concerts]);
  const concertsTickets = useMemo(() => concerts.reduce((sum, c) => sum + c.ticketsSold, 0), [concerts]);
  const concertsGMV = useMemo(() => {
    return concerts.reduce((acc, c) => {
      const avgPrice = (c.minPrice + c.maxPrice) / 2;
      return acc + (c.ticketsSold * avgPrice);
    }, 0);
  }, [concerts]);

  // Trips Module Stats
  const tripsActiveCount = useMemo(() => trips.filter(t => t.status === 'active' || t.status === 'upcoming').length, [trips]);
  const tripsTravelers = useMemo(() => trips.reduce((sum, t) => sum + (t.joinedTravelers?.length || 0), 0), [trips]);
  const tripsGMV = useMemo(() => {
    return trips.reduce((sum, t) => {
      const travelersCount = t.joinedTravelers?.length || 0;
      return sum + (travelersCount * (t.estimatedBudget || 0));
    }, 0);
  }, [trips]);

  // Stranger Meets Module Stats
  const meetsActiveCount = useMemo(() => strangerMeets.filter(m => m.status === 'active' || m.status === 'upcoming').length, [strangerMeets]);
  const meetsBuddies = useMemo(() => strangerMeets.reduce((sum, m) => sum + (m.participants?.length || 0), 0), [strangerMeets]);
  const meetsGMV = useMemo(() => {
    return strangerMeets.reduce((sum, m) => {
      const buddies = m.participants?.length || 0;
      return sum + (buddies * (m.pricePerPerson || 0));
    }, 0);
  }, [strangerMeets]);

  // Combined Multi-Module Metrics (strictly computed for assigned modules)
  const totalCombinedGMV = useMemo(() => {
    let sum = 0;
    if (hasConcerts) sum += concertsGMV;
    if (hasTrips) sum += tripsGMV;
    if (hasMeets) sum += meetsGMV;
    return sum;
  }, [hasConcerts, hasTrips, hasMeets, concertsGMV, tripsGMV, meetsGMV]);

  const totalCombinedParticipants = useMemo(() => {
    let sum = 0;
    if (hasConcerts) sum += concertsTickets;
    if (hasTrips) sum += tripsTravelers;
    if (hasMeets) sum += meetsBuddies;
    return sum;
  }, [hasConcerts, hasTrips, hasMeets, concertsTickets, tripsTravelers, meetsBuddies]);

  const totalCombinedActivePrograms = useMemo(() => {
    let count = 0;
    if (hasConcerts) count += activeEvents.length;
    if (hasTrips) count += tripsActiveCount;
    if (hasMeets) count += meetsActiveCount;
    return count;
  }, [hasConcerts, hasTrips, hasMeets, activeEvents.length, tripsActiveCount, meetsActiveCount]);

  const netPayoutEstimate = Math.round(totalCombinedGMV * 0.95);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakh`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Top 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Gross Volume (GMV)"
          value={formatCurrency(totalCombinedGMV)}
          isPositive={true}
          icon={TrendingUp}
          accentColor="purple"
        />

        <MetricCard
          label="Total Reach & Admissions"
          value={totalCombinedParticipants.toLocaleString()}
          isPositive={true}
          icon={Ticket}
          accentColor="emerald"
        />

        <MetricCard
          label="Net Settlement Payable"
          value={formatCurrency(netPayoutEstimate)}
          isPositive={true}
          icon={DollarSign}
          accentColor="cyan"
        />

        <MetricCard
          label="Active Operations Hosted"
          value={`${totalCombinedActivePrograms} Active`}
          isPositive={true}
          icon={Radio}
          accentColor="amber"
        />
      </div>



      {/* Global Modular Charts Suite (Rendered Directly Without Tabs) */}
      <MultiModuleTrendChart
        concerts={concerts}
        trips={trips}
        strangerMeets={strangerMeets}
        assignedModules={assignedModules}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        formatCurrency={formatCurrency}
      />

      <GroupedModuleBarChart
        concerts={concerts}
        trips={trips}
        strangerMeets={strangerMeets}
        assignedModules={assignedModules}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        formatCurrency={formatCurrency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModuleDistributionDonutChart
          concerts={concerts}
          trips={trips}
          strangerMeets={strangerMeets}
          assignedModules={assignedModules}
          formatCurrency={formatCurrency}
        />
        {/* <ModuleCapacityHealthChart
          concerts={concerts}
          trips={trips}
          strangerMeets={strangerMeets}
          assignedModules={assignedModules}
          formatCurrency={formatCurrency}
        /> */}
      </div>

    </div>
  );
};
