import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Music,
  Scan,
  Users,
  Building2,
  Wallet,
  Settings,
  Globe2,
  Mic2,
  MapPin,
  Sparkles,
  Car,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Layers,
  Calendar,
  LogOut
} from 'lucide-react';
import type { NavigationTab } from '../../types';
import { mockVendorProfile } from '../../data/mockVendorData';
import { vendorAuthService } from '../../services/vendorAuthService';

interface VendorSidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  activeConcertsCount: number;
  totalAttendeesCount: number;
  artistsCount?: number;
  tripsCount?: number;
  meetsCount?: number;
  currentVendor?: any;
  onLogout?: () => void;
}

interface ModuleSubItem {
  id: NavigationTab;
  label: string;
  path: string;
  badge?: number | string;
}

interface ModuleGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  activeBg: string;
  activeText: string;
  activeIcon: string;
  badgeBg: string;
  items: ModuleSubItem[];
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  activeTab,
  onTabChange,
  activeConcertsCount,
  totalAttendeesCount,
  artistsCount = 0,
  tripsCount = 0,
  meetsCount = 0,
  currentVendor,
  onLogout
}) => {
  const activeProfile = currentVendor || mockVendorProfile;
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onLogout) {
      onLogout();
    } else {
      vendorAuthService.logout();
      navigate('/login', { replace: true });
    }
  };

  // Assigned module access from current vendor partner (defaulting to concerts if not specified)
  const assignedModules: string[] = activeProfile.serviceModules && activeProfile.serviceModules.length > 0
    ? activeProfile.serviceModules
    : [activeProfile.serviceModule || 'concerts'];

  // Collapsible modules state
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    concerts: true,
    trips: true,
    'stranger-meets': true,
    carpooling: false
  });

  // Automatically expand module based on current URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/concerts') || path.startsWith('/artists') || path.startsWith('/venues') || path.startsWith('/gate-scanner') || path.startsWith('/attendees')) {
      setExpandedModules((prev) => ({ ...prev, concerts: true }));
    } else if (path.startsWith('/trips')) {
      setExpandedModules((prev) => ({ ...prev, trips: true }));
    } else if (path.startsWith('/stranger-meets')) {
      setExpandedModules((prev) => ({ ...prev, 'stranger-meets': true }));
    }
  }, [location.pathname]);

  const toggleModule = (modId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const handleNav = (tab: NavigationTab, path: string) => {
    navigate(path);
    onTabChange(tab);
  };

  // 1. Concerts Module Definition
  const concertsModule: ModuleGroup = {
    id: 'concerts',
    label: 'Concerts & Events',
    icon: Music,
    badge: activeConcertsCount,
    activeBg: 'bg-purple-50 text-purple-700',
    activeText: 'text-purple-700',
    activeIcon: 'text-purple-600',
    badgeBg: 'bg-purple-100 text-purple-700',
    items: [
      { id: 'concerts-overview', label: 'Concerts Overview', path: '/concerts/overview' },
      { id: 'concerts', label: 'My Concerts', path: '/concerts', badge: activeConcertsCount },
      { id: 'artists', label: 'Artists & Lineup', path: '/artists', badge: artistsCount },
      { id: 'venues', label: 'Venues & Stages', path: '/venues' },
      // { id: 'gate-scanner', label: 'Live Gate Scanner', path: '/gate-scanner' },
      // { id: 'attendees', label: 'Attendee Manifest', path: '/attendees', badge: totalAttendeesCount }
    ]
  };

  // 2. Trips Module Definition
  const tripsModule: ModuleGroup = {
    id: 'trips',
    label: 'Trip Planner',
    icon: MapPin,
    badge: tripsCount,
    activeBg: 'bg-amber-50 text-amber-800',
    activeText: 'text-amber-800',
    activeIcon: 'text-amber-600',
    badgeBg: 'bg-amber-100 text-amber-800',
    items: [
      { id: 'trips-overview', label: 'Trips Overview', path: '/trips/overview' },
      { id: 'trips', label: 'Trip Itineraries', path: '/trips', badge: tripsCount },
      { id: 'trip-companions', label: 'Travel Companions', path: '/trips/companions' }
    ]
  };

  // 3. Stranger Meets Module Definition
  const strangerMeetsModule: ModuleGroup = {
    id: 'stranger-meets',
    label: 'Stranger Meets',
    icon: Sparkles,
    badge: meetsCount,
    activeBg: 'bg-teal-50 text-teal-800',
    activeText: 'text-teal-800',
    activeIcon: 'text-teal-600',
    badgeBg: 'bg-teal-100 text-teal-800',
    items: [
      { id: 'stranger-meets-overview', label: 'Meets Overview', path: '/stranger-meets/overview' },
      { id: 'stranger-meets', label: 'Community Meets', path: '/stranger-meets', badge: meetsCount },
      { id: 'stranger-buddies', label: 'Meet Buddies Roster', path: '/stranger-meets/buddies' }
    ]
  };

  // 4. Carpooling Module Definition (if enabled for partner)
  const carpoolingModule: ModuleGroup = {
    id: 'carpooling',
    label: 'Carpooling & Fleet',
    icon: Car,
    badge: 0,
    activeBg: 'bg-indigo-50 text-indigo-700',
    activeText: 'text-indigo-700',
    activeIcon: 'text-indigo-600',
    badgeBg: 'bg-indigo-100 text-indigo-700',
    items: [
      { id: 'overview', label: 'Intercity Routes', path: '/overview' }
    ]
  };

  // Filter modules according to vendor access
  const allAvailableModules: ModuleGroup[] = [
    concertsModule,
    strangerMeetsModule,
    tripsModule,
    carpoolingModule
  ];

  const vendorActiveModules = allAvailableModules.filter((mod) =>
    assignedModules.includes(mod.id)
  );

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
              <span className="text-base font-semibold tracking-tight text-slate-900">
                DigitalRaiz
              </span>
              <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 border border-purple-200">
                VENDOR
              </span>
            </div>
            <p className="text-[11px] font-normal text-slate-400">
              Multi-Module Partner Console
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 min-h-0 px-3 py-3 space-y-3 overflow-y-auto">
        {/* Core Dashboard Link */}
        <div>
          <button
            type="button"
            onClick={() => handleNav('overview', '/overview')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${location.pathname === '/overview' || location.pathname === '/'
              ? 'bg-slate-100 text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Compass className={`h-4 w-4 ${location.pathname === '/overview' || location.pathname === '/' ? 'text-purple-600' : 'text-slate-400'}`} />
              <span>Studio Dashboard</span>
            </div>
          </button>
        </div>

        {/* Assigned Modules (Collapsible Sections) */}
        <div className="space-y-3 pt-1">
          {/* <div className="px-3 flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            <span>Authorized Modules</span>
            <span className="text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-semibold text-[9px] border border-purple-200">
              {vendorActiveModules.length} Active
            </span>
          </div> */}

          {vendorActiveModules.map((module) => {
            const isExpanded = Boolean(expandedModules[module.id]);
            const Icon = module.icon;
            const isModuleActive = module.items.some((sub) => sub.id === activeTab);

            return (
              <div key={module.id} className="rounded-md border border-slate-100 bg-slate-50/40 overflow-hidden">
                {/* Collapsible Header */}
                <div
                  onClick={(e) => toggleModule(module.id, e)}
                  className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold cursor-pointer transition-colors select-none ${isModuleActive
                    ? `${module.activeBg} font-bold`
                    : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`h-4 w-4 shrink-0 ${isModuleActive ? module.activeIcon : 'text-slate-400'}`} />
                    <span className="truncate">{module.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {module.badge !== undefined && module.badge > 0 && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${module.badgeBg}`}>
                        {module.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      className="p-0.5 text-slate-400 hover:text-slate-600 rounded"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Sub Items */}
                {isExpanded && (
                  <div className="p-1 space-y-0.5 bg-white border-t border-slate-100/80">
                    {module.items.map((sub) => {
                      const isSubActive = activeTab === sub.id;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleNav(sub.id, sub.path)}
                          className={`w-full flex items-center justify-between pl-7 pr-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer ${isSubActive
                            ? 'bg-slate-100 text-slate-900 font-semibold'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-normal'
                            }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          {sub.badge !== undefined && sub.badge !== 0 && (
                            <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Finance & Settings */}
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Finance & Controls
          </div>

          <button
            type="button"
            onClick={() => handleNav('payouts', '/payouts')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${location.pathname.startsWith('/payouts')
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Wallet className="h-4 w-4 text-slate-400" />
              <span>Box Office & Payouts</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleNav('settings', '/settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${location.pathname.startsWith('/settings')
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Studio Settings</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div className="shrink-0 p-3 border-t border-slate-100 bg-slate-50/50">
        <div
          onClick={() => handleNav('profile', '/profile')}
          className="flex items-center justify-between p-2 rounded-xl border border-slate-200/70 bg-white hover:border-purple-300 hover:shadow-2xs transition-all cursor-pointer group"
          title="Open Promoter Profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0 group-hover:ring-purple-300 transition-all"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                  {activeProfile.companyName?.split(' ')[0] || 'Studio'}
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {assignedModules.length} Modules Authorized
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="p-1.5 rounded-lg text-rose-600 bg-rose-100 active:scale-95 transition-all cursor-pointer shrink-0 ml-1"
            title="Log out of Promoter Studio"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
