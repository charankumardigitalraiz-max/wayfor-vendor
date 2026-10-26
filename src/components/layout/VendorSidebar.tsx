import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Music,
  Scan,
  Users,
  Building2,
  Wallet,
  Settings,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Globe2,
  CalendarDays,
  Mic2
} from 'lucide-react';
import type { NavigationTab } from '../../types';
import { mockVendorProfile } from '../../data/mockVendorData';

interface VendorSidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  activeConcertsCount: number;
  totalAttendeesCount: number;
  artistsCount?: number;
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  activeTab,
  onTabChange,
  activeConcertsCount,
  totalAttendeesCount,
  artistsCount
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (tab: NavigationTab, path: string) => {
    navigate(path);
    onTabChange(tab);
  };

  const navItems = [
    {
      id: 'overview' as NavigationTab,
      label: 'Studio Dashboard',
      path: '/overview',
      icon: Compass
    },
    {
      id: 'concerts' as NavigationTab,
      label: 'My Concerts',
      path: '/concerts',
      icon: Music,
      badge: activeConcertsCount
    },
    {
      id: 'artists' as NavigationTab,
      label: 'Artists & Lineup',
      path: '/artists',
      icon: Mic2,
      badge: artistsCount
    },
    {
      id: 'gate-scanner' as NavigationTab,
      label: 'Live Gate Scanner',
      path: '/gate-scanner',
      icon: Scan,
      isLiveBadge: false
    },
    {
      id: 'attendees' as NavigationTab,
      label: 'Attendee Manifest',
      path: '/attendees',
      icon: Users,
      badge: totalAttendeesCount
    },
    {
      id: 'venues' as NavigationTab,
      label: 'Venues & Stages',
      path: '/venues',
      icon: Building2
    },
    {
      id: 'payouts' as NavigationTab,
      label: 'Box Office & Payouts',
      path: '/payouts',
      icon: Wallet
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Studio Settings',
      path: '/settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-65 shrink-0 border-r border-slate-200/80 bg-white flex flex-col h-screen sticky top-0 z-20 font-sans">
      {/* Brand Identity */}
      <div className="shrink-0 p-5 border-b border-slate-100 bg-gradient-to-b from-purple-50/40 via-white to-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-indigo-600 p-[1.5px] shadow-sm group cursor-pointer transition-transform hover:scale-105">
            <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center">
              <Globe2 className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">
                DigitalRaiz
              </span>
              {/* <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                VENDOR
              </span> */}
            </div>
            <p className="text-[11px] font-normal text-slate-400">
              Concert & Live Event Studio
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 min-h-0 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Event Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.path !== '/overview' && location.pathname.startsWith(item.path)) ||
            (item.path === '/overview' && (location.pathname === '/' || location.pathname === '/overview'));

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id, item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all text-left cursor-pointer ${isActive
                ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-purple-600' : 'text-slate-400'
                    }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-slate-100 text-slate-600'
                    }`}
                >
                  {item.badge}
                </span>
              )}

              {item.isLiveBadge && (
                <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                  Live
                </span>
              )}
            </button>
          );
        })}

        {/* Live Tour Notice Widget */}
        {/* <div className="pt-4 px-1">
          <div className="rounded-xl border border-purple-200/70 bg-gradient-to-br from-purple-50/70 via-fuchsia-50/40 to-white p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-purple-700 font-semibold text-xs">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Tonight's Gate Entry</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Neon Odyssey at Jio World Garden doors open at 18:00 IST.
            </p>
            <button
              onClick={() => handleNav('gate-scanner', '/gate-scanner')}
              className="w-full mt-1 py-1.5 px-2.5 rounded-md text-[11px] font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors text-center cursor-pointer shadow-xs"
            >
              Launch Gate Scanner
            </button>
          </div>
        </div> */}
      </div>

      {/* Bottom Profile Footer */}
      <div className="shrink-0 p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between p-2 rounded-xl border border-slate-200/70 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={mockVendorProfile.avatar}
              alt={mockVendorProfile.name}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {mockVendorProfile.companyName.split(' ')[0]} Live
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                GST: {mockVendorProfile.gstNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
