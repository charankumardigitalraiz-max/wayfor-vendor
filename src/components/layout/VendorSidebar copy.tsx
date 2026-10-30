import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Music,
  Users,
  Building2,
  Wallet,
  Settings,
  Mic2,
  MapPin,
  Sparkles,
  Car,
  ChevronDown,
  ShieldCheck,
  Layers,
  Calendar,
  LogOut,
  LayoutDashboard,
  Radio,
  Ticket,
  ChevronRight
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
  icon: React.ElementType;
  badge?: number | string;
}

interface ModuleGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  themeColor: {
    accent: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    activeBg: string;
    activeText: string;
  };
  items: ModuleSubItem[];
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  activeTab,
  onTabChange,
  activeConcertsCount,
  totalAttendeesCount: _totalAttendeesCount,
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
    themeColor: {
      accent: 'purple',
      iconBg: 'bg-purple-100 text-purple-700',
      iconColor: 'text-purple-600',
      badgeBg: 'bg-purple-100 text-purple-700 border-purple-200',
      badgeText: 'text-purple-700',
      activeBg: 'bg-purple-50 text-purple-700 font-semibold',
      activeText: 'text-purple-700'
    },
    items: [
      { id: 'concerts-overview', label: 'Concerts Overview', path: '/concerts/overview', icon: LayoutDashboard },
      { id: 'concerts', label: 'My Concerts', path: '/concerts', icon: Music, badge: activeConcertsCount },
      { id: 'artists', label: 'Artists & Lineup', path: '/artists', icon: Mic2, badge: artistsCount },
      { id: 'venues', label: 'Venues & Stages', path: '/venues', icon: Building2 },
    ]
  };

  // 2. Trips Module Definition
  const tripsModule: ModuleGroup = {
    id: 'trips',
    label: 'Trip Planner',
    icon: MapPin,
    badge: tripsCount,
    themeColor: {
      accent: 'amber',
      iconBg: 'bg-amber-100 text-amber-800',
      iconColor: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      badgeText: 'text-amber-800',
      activeBg: 'bg-amber-50 text-amber-800 font-semibold',
      activeText: 'text-amber-800'
    },
    items: [
      { id: 'trips-overview', label: 'Trips Overview', path: '/trips/overview', icon: LayoutDashboard },
      { id: 'trips', label: 'Trip Itineraries', path: '/trips', icon: MapPin, badge: tripsCount },
      { id: 'trip-companions', label: 'Travel Companions', path: '/trips/companions', icon: Users }
    ]
  };

  // 3. Stranger Meets Module Definition
  const strangerMeetsModule: ModuleGroup = {
    id: 'stranger-meets',
    label: 'Stranger Meets',
    icon: Sparkles,
    badge: meetsCount,
    themeColor: {
      accent: 'teal',
      iconBg: 'bg-teal-100 text-teal-800',
      iconColor: 'text-teal-600',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
      badgeText: 'text-teal-800',
      activeBg: 'bg-teal-50 text-teal-800 font-semibold',
      activeText: 'text-teal-800'
    },
    items: [
      { id: 'stranger-meets-overview', label: 'Meets Overview', path: '/stranger-meets/overview', icon: LayoutDashboard },
      { id: 'stranger-meets', label: 'Community Meets', path: '/stranger-meets', icon: Sparkles, badge: meetsCount },
      { id: 'stranger-buddies', label: 'Meet Buddies Roster', path: '/stranger-meets/buddies', icon: Users }
    ]
  };

  // 4. Carpooling Module Definition (if enabled for partner)
  const carpoolingModule: ModuleGroup = {
    id: 'carpooling',
    label: 'Carpooling & Fleet',
    icon: Car,
    badge: 0,
    themeColor: {
      accent: 'indigo',
      iconBg: 'bg-indigo-100 text-indigo-700',
      iconColor: 'text-indigo-600',
      badgeBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      badgeText: 'text-indigo-700',
      activeBg: 'bg-indigo-50 text-indigo-700 font-semibold',
      activeText: 'text-indigo-700'
    },
    items: [
      { id: 'overview', label: 'Intercity Routes', path: '/overview', icon: Car }
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
    <aside className="w-[260px] shrink-0 border-r border-slate-200/90 bg-white flex flex-col h-screen sticky top-0 z-20 font-sans select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand Identity Header */}
      <div className="shrink-0 px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-purple-700 to-indigo-600 p-[1.5px] shadow-sm shadow-purple-600/20 group cursor-pointer hover:scale-105 transition-transform flex items-center justify-center shrink-0">
            <div className="h-full w-full rounded-[10px] bg-purple-600 flex items-center justify-center text-white">
              <Ticket className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold tracking-tight text-slate-900 truncate">
                DigitalRaiz
              </span>
              <span className="rounded-full bg-purple-50 px-1.5 py-0.2 text-[9px] font-bold text-purple-700 border border-purple-200/90">
                PROMOTER
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <p className="text-[11px] font-medium text-slate-400 truncate">
                Console Studio
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 min-h-0 px-3 py-3 space-y-4 overflow-y-auto">
        {/* Core Studio Dashboard */}
        <div>
          <button
            type="button"
            onClick={() => handleNav('overview', '/overview')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${location.pathname === '/overview' || location.pathname === '/'
              ? 'bg-purple-50 text-purple-700 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Compass
                className={`h-4 w-4 shrink-0 transition-colors ${location.pathname === '/overview' || location.pathname === '/'
                  ? 'text-purple-600'
                  : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <span>Studio Dashboard</span>
            </div>
            {(location.pathname === '/overview' || location.pathname === '/') && (
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
            )}
          </button>
        </div>

        {/* Assigned Modules (Modern Collapsible Sections) */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            {vendorActiveModules.map((module) => {
              const isExpanded = Boolean(expandedModules[module.id]);
              const Icon = module.icon;
              const isModuleActive = module.items.some(
                (sub) => sub.id === activeTab || location.pathname.startsWith(sub.path)
              );

              return (
                <div key={module.id} className="space-y-1">
                  {/* Collapsible Module Header */}
                  <button
                    type="button"
                    onClick={(e) => toggleModule(module.id, e)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all text-left ${isModuleActive && !isExpanded
                      ? `${module.themeColor.activeBg}`
                      : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${isModuleActive
                          ? module.themeColor.iconBg
                          : 'bg-slate-100 text-slate-500'
                          }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{module.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {module.badge !== undefined && module.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold border ${module.themeColor.badgeBg}`}
                        >
                          {module.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-slate-600' : ''
                          }`}
                      />
                    </div>
                  </button>

                  {/* Sub-Items Tree */}
                  {isExpanded && (
                    <div className="ml-5 pl-2.5 border-l border-slate-200/80 space-y-0.5 pt-0.5 pb-1">
                      {module.items.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive =
                          activeTab === sub.id ||
                          location.pathname === sub.path ||
                          (sub.path !== '/concerts' &&
                            sub.path !== '/overview' &&
                            location.pathname.startsWith(sub.path));

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleNav(sub.id, sub.path)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left cursor-pointer group ${isSubActive
                              ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-normal'
                              }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <SubIcon
                                className={`h-3.5 w-3.5 shrink-0 transition-colors ${isSubActive
                                  ? 'text-purple-600'
                                  : 'text-slate-400 group-hover:text-slate-600'
                                  }`}
                              />
                              <span className="truncate">{sub.label}</span>
                            </div>

                            {sub.badge !== undefined && sub.badge !== 0 && (
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${isSubActive
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80'
                                  }`}
                              >
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
        </div>

        {/* Finance & Management Controls */}
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <div className="px-2 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Finance & Controls
          </div>

          <button
            type="button"
            onClick={() => handleNav('payouts', '/payouts')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left cursor-pointer group ${location.pathname.startsWith('/payouts')
              ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Wallet
                className={`h-4 w-4 shrink-0 transition-colors ${location.pathname.startsWith('/payouts')
                  ? 'text-purple-600'
                  : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <span>Box Office & Payouts</span>
            </div>
            {location.pathname.startsWith('/payouts') && (
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('settings', '/settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left cursor-pointer group ${location.pathname.startsWith('/settings')
              ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings
                className={`h-4 w-4 shrink-0 transition-colors ${location.pathname.startsWith('/settings')
                  ? 'text-purple-600'
                  : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <span>Studio Settings</span>
            </div>
            {location.pathname.startsWith('/settings') && (
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div className="shrink-0 p-3 border-t border-slate-100 bg-slate-50/50">
        <div
          onClick={() => handleNav('profile', '/profile')}
          className="flex items-center justify-between p-2 rounded-md border border-slate-200/80 bg-white hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer group"
          title="Open Promoter Profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={activeProfile.avatar}
                alt={activeProfile.name}
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 group-hover:ring-purple-300 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                  {activeProfile.companyName?.split(' ')[0] || 'Studio'}
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Promoter Partner
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="p-1.5 rounded-lg  text-rose-600 bg-rose-50 active:scale-95 transition-colors cursor-pointer shrink-0 ml-1"
            title="Log out of Promoter Studio"
            aria-label="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
