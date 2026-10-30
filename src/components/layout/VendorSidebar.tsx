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
  LogOut,
  LayoutDashboard,
  Sparkle
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
  items: ModuleSubItem[];
}

interface ModuleColorStyle {
  activeBg: string;
  activeText: string;
  activeIcon: string;
  activeSubBg: string;
  activeBadgeBg: string;
  activeBadgeText: string;
}

const MODULE_STYLES: Record<string, ModuleColorStyle> = {
  concerts: {
    activeBg: 'bg-purple-50 text-purple-700',
    activeText: 'text-purple-700',
    activeIcon: 'text-purple-600',
    activeSubBg: 'bg-purple-50/90 text-purple-700',
    activeBadgeBg: 'bg-purple-100',
    activeBadgeText: 'text-purple-700'
  },
  trips: {
    activeBg: 'bg-amber-50 text-amber-700',
    activeText: 'text-amber-700',
    activeIcon: 'text-amber-600',
    activeSubBg: 'bg-amber-50/90 text-amber-700',
    activeBadgeBg: 'bg-amber-100',
    activeBadgeText: 'text-amber-700'
  },
  'stranger-meets': {
    activeBg: 'bg-teal-50 text-teal-700',
    activeText: 'text-teal-700',
    activeIcon: 'text-teal-600',
    activeSubBg: 'bg-teal-50/90 text-teal-700',
    activeBadgeBg: 'bg-teal-100',
    activeBadgeText: 'text-teal-700'
  },
  carpooling: {
    activeBg: 'bg-indigo-50 text-indigo-700',
    activeText: 'text-indigo-700',
    activeIcon: 'text-indigo-600',
    activeSubBg: 'bg-indigo-50/90 text-indigo-700',
    activeBadgeBg: 'bg-indigo-100',
    activeBadgeText: 'text-indigo-700'
  }
};

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
    if (
      path.startsWith('/concerts') ||
      path.startsWith('/artists') ||
      path.startsWith('/venues') ||
      path.startsWith('/gate-scanner') ||
      path.startsWith('/attendees')
    ) {
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

  const handleParentModuleClick = (module: ModuleGroup) => {
    if (module.items && module.items.length > 0) {
      setExpandedModules((prev) => ({ ...prev, [module.id]: true }));
      const defaultSub = module.items[0];
      handleNav(defaultSub.id, defaultSub.path);
    }
  };

  // 1. Concerts Module Definition
  const concertsModule: ModuleGroup = {
    id: 'concerts',
    label: 'Concerts & Events',
    icon: Music,
    badge: activeConcertsCount,
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
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white flex flex-col h-screen sticky top-0 z-20 font-sans select-none">
      {/* Brand Identity Header */}
      <div className="shrink-0 px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shadow-purple-500/20 shrink-0">
            <Sparkle className="h-4 w-4 fill-white/20 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-slate-900 tracking-tight truncate">
                DigitalRaiz
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              Partner Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 min-h-0 px-3 py-3 space-y-1 overflow-y-auto">
        {/* Core Studio Dashboard */}
        <button
          type="button"
          onClick={() => handleNav('overview', '/overview')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-colors text-left cursor-pointer group ${location.pathname === '/overview' || location.pathname === '/'
              ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
            }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Compass
              className={`h-4 w-4 shrink-0 transition-colors ${location.pathname === '/overview' || location.pathname === '/'
                  ? 'text-purple-600'
                  : 'text-slate-400 group-hover:text-slate-600'
                }`}
            />
            <span className="truncate">Studio Dashboard</span>
          </div>
        </button>

        {/* OPERATIONS Header */}
        <div className="pt-4 pb-1 px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Operations
        </div>

        {/* Assigned Modules (Collapsible Sections) */}
        <div className="space-y-1">
          {vendorActiveModules.map((module) => {
            const isExpanded = Boolean(expandedModules[module.id]);
            const Icon = module.icon;
            const style = MODULE_STYLES[module.id] || MODULE_STYLES.concerts;
            const isModuleActive = module.items.some(
              (sub) =>
                sub.id === activeTab ||
                location.pathname === sub.path ||
                (sub.path !== '/overview' &&
                  sub.path !== '/concerts' &&
                  location.pathname.startsWith(sub.path))
            );

            return (
              <div key={module.id} className="space-y-1">
                {/* Collapsible Module Header */}
                <button
                  type="button"
                  onClick={() => handleParentModuleClick(module)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-colors text-left cursor-pointer group ${isModuleActive && !isExpanded
                      ? `${style.activeBg} font-semibold shadow-2xs`
                      : isModuleActive
                        ? 'text-slate-900 font-semibold bg-slate-50/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${isModuleActive
                          ? style.activeIcon
                          : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                    />
                    <span className="truncate">{module.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {module.badge !== undefined && module.badge > 0 && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${isModuleActive
                            ? `${style.activeBadgeBg} ${style.activeBadgeText}`
                            : 'bg-slate-100 text-slate-600'
                          }`}
                      >
                        {module.badge}
                      </span>
                    )}
                    <span
                      onClick={(e) => toggleModule(module.id, e)}
                      className={`p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer ${isModuleActive ? style.activeText : 'text-slate-400 hover:text-slate-600'
                        }`}
                      title={isExpanded ? 'Collapse section' : 'Expand section'}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                          }`}
                      />
                    </span>
                  </div>
                </button>

                {/* Sub-Items Tree */}
                {isExpanded && module.items.length > 0 && (
                  <div className="ml-6 pl-3 border-l border-slate-200/80 my-1 space-y-0.5">
                    {module.items.map((sub) => {
                      const isSubActive =
                        activeTab === sub.id ||
                        location.pathname === sub.path ||
                        (sub.path !== '/overview' &&
                          sub.path !== '/concerts' &&
                          location.pathname.startsWith(sub.path));

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleNav(sub.id, sub.path)}
                          className={`w-full flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors text-left cursor-pointer group ${isSubActive
                              ? `${style.activeSubBg} font-semibold shadow-2xs`
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                            }`}
                        >
                          <span className="truncate">{sub.label}</span>

                          {sub.badge !== undefined && sub.badge !== 0 && (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ml-1.5 ${isSubActive
                                  ? `${style.activeBadgeBg} ${style.activeBadgeText}`
                                  : 'bg-slate-100 text-slate-500'
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

        {/* MANAGEMENT Header */}
        <div className="pt-5 pb-1 px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Management
        </div>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => handleNav('payouts', '/payouts')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-colors text-left cursor-pointer group ${location.pathname.startsWith('/payouts')
                ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Wallet
                className={`h-4 w-4 shrink-0 transition-colors ${location.pathname.startsWith('/payouts')
                    ? 'text-purple-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <span className="truncate">Box Office & Payouts</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleNav('settings', '/settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-colors text-left cursor-pointer group ${location.pathname.startsWith('/settings')
                ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Settings
                className={`h-4 w-4 shrink-0 transition-colors ${location.pathname.startsWith('/settings')
                    ? 'text-purple-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <span className="truncate">Studio Settings</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div className="shrink-0 p-2.5 border-t border-slate-100 bg-slate-50/40">
        <div
          onClick={() => handleNav('profile', '/profile')}
          className="flex items-center justify-between p-2 rounded-md border border-slate-200/80 bg-white hover:border-purple-300 hover:shadow-2xs transition-all cursor-pointer group"
          title="Open Promoter Profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={activeProfile.avatar}
                alt={activeProfile.name}
                className="h-8 w-8 rounded-md object-cover ring-1 ring-slate-200/80 group-hover:ring-purple-300 transition-all"
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
            className="p-1.5 rounded-md text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 active:scale-95 transition-all cursor-pointer shrink-0 ml-1"
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
