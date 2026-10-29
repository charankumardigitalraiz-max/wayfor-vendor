import React from 'react';
import type { ConcertEvent, TripPlan, StrangerMeet } from '../../types';
import {
  MultiModuleTrendChart,
  GroupedModuleBarChart,
  ModuleDistributionDonutChart,
  ModuleCapacityHealthChart,
  type Timeframe
} from '../charts';

export type { Timeframe } from '../charts';

export interface VendorSalesChartProps {
  concerts?: ConcertEvent[];
  trips?: TripPlan[];
  strangerMeets?: StrangerMeet[];
  assignedModules?: string[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  formatCurrency: (val: number) => string;
}

export const VendorSalesChart: React.FC<VendorSalesChartProps> = ({
  concerts = [],
  trips = [],
  strangerMeets = [],
  assignedModules = ['concerts', 'trips', 'stranger-meets'],
  timeframe,
  onTimeframeChange,
  formatCurrency
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Cross-Module Velocity & Performance Trend (Multi-Line Continuous) */}
      <MultiModuleTrendChart
        concerts={concerts}
        trips={trips}
        strangerMeets={strangerMeets}
        assignedModules={assignedModules}
        timeframe={timeframe}
        onTimeframeChange={onTimeframeChange}
        formatCurrency={formatCurrency}
      />

      {/* 2. Side-by-side Grouped Multi-Bar Comparison Chart */}
      <GroupedModuleBarChart
        concerts={concerts}
        trips={trips}
        strangerMeets={strangerMeets}
        assignedModules={assignedModules}
        timeframe={timeframe}
        onTimeframeChange={onTimeframeChange}
        formatCurrency={formatCurrency}
      />

      {/* 3. Bottom Row: Revenue Distribution Donut & Capacity Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModuleDistributionDonutChart
          concerts={concerts}
          trips={trips}
          strangerMeets={strangerMeets}
          assignedModules={assignedModules}
          formatCurrency={formatCurrency}
        />
        <ModuleCapacityHealthChart
          concerts={concerts}
          trips={trips}
          strangerMeets={strangerMeets}
          assignedModules={assignedModules}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};
