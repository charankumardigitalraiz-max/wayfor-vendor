import React from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon: LucideIcon;
  accentColor?: 'purple' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'indigo';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  subtext,
  icon: Icon,
  accentColor = 'purple'
}) => {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'purple':
        return {
          iconBg: 'bg-purple-50 text-purple-600',
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600',
        };
      case 'cyan':
        return {
          iconBg: 'bg-sky-50 text-sky-600',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-50 text-amber-600',
        };
      case 'rose':
        return {
          iconBg: 'bg-rose-50 text-rose-600',
        };
      default:
        return {
          iconBg: 'bg-indigo-50 text-indigo-600',
        };
    }
  };

  const styles = getAccentStyles();

  return (
    <div className="rounded-lg border border-slate-200/90 bg-white p-4.5 sm:p-5 shadow-2xs hover:border-slate-300/90 hover:shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12.5px] font-medium text-slate-600 leading-tight">
            {label}
          </span>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.iconBg} shrink-0`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-2.5 flex items-baseline justify-between gap-2 flex-wrap">
          <span className="text-2xl sm:text-[26px] font-semibold tracking-[-0.03em] text-slate-900 leading-none">
            {value}
          </span>

          {change && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
                }`}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{change}</span>
            </span>
          )}
        </div>
      </div>

      {subtext && (
        <p className="mt-2 text-[11.5px] text-slate-500 leading-normal">
          {subtext}
        </p>
      )}
    </div>
  );
};
