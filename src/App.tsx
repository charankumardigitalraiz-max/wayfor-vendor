import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import type {
  ConcertEvent,
  AttendeeBooking,
  Venue,
  PayoutTransaction,
  NavigationTab,
  Artist,
  TripPlan,
  StrangerMeet
} from './types';
import { mockVendorTrips, mockVendorStrangerMeets } from './data/mockVendorData';
import { vendorConcertService } from './services/vendorConcertService';
import { VendorSidebar } from './components/layout/VendorSidebar';
import { VendorHeader } from './components/layout/VendorHeader';
import { VendorOverview } from './components/dashboard/VendorOverview';
import { ConcertsOverview } from './components/concerts/ConcertsOverview';
import { VendorConcertsList } from './components/concerts/VendorConcertsList';
import { VendorConcertDetail } from './components/concerts/VendorConcertDetail';
import { CreateConcertScreen } from './components/concerts/CreateConcertScreen';
import { ArtistsView } from './components/artists/ArtistsView';
import { GateScannerView } from './components/gate/GateScannerView';
import { AttendeeManifestView } from './components/manifest/AttendeeManifestView';
import { VenuesView } from './components/venues/VenuesView';
import { PayoutsView } from './components/payouts/PayoutsView';
import { VendorSettingsView } from './components/settings/VendorSettingsView';
import { VendorProfileView } from './components/profile/VendorProfileView';
import { TripsOverview } from './components/trips/TripsOverview';
import { VendorTripsView } from './components/trips/VendorTripsView';
import { StrangerMeetsOverview } from './components/stranger-meets/StrangerMeetsOverview';
import { VendorStrangerMeetsView } from './components/stranger-meets/VendorStrangerMeetsView';
import { VendorLogin, VendorRegister } from './components/auth';
import { vendorAuthService } from './services/vendorAuthService';
import type { VendorUser } from './types/auth';
import { Toast, type ToastMessage } from './components/common/Toast';

export function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication state
  const [currentVendor, setCurrentVendor] = useState<VendorUser | null>(() => {
    return vendorAuthService.getCurrentVendor();
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [concerts, setConcerts] = useState<ConcertEvent[]>([]);
  const [attendees, setAttendees] = useState<AttendeeBooking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Multi-Module States: Trips & Stranger Meets
  const [trips, setTrips] = useState<TripPlan[]>(() => {
    try {
      const saved = localStorage.getItem('wayfor_vendor_trips');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= mockVendorTrips.length) {
          return parsed;
        }
      }
      return mockVendorTrips;
    } catch {
      return mockVendorTrips;
    }
  });

  const [strangerMeets, setStrangerMeets] = useState<StrangerMeet[]>(() => {
    try {
      const saved = localStorage.getItem('wayfor_vendor_meets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= mockVendorStrangerMeets.length) {
          return parsed;
        }
      }
      return mockVendorStrangerMeets;
    } catch {
      return mockVendorStrangerMeets;
    }
  });

  // Listen to cross-component auth state changes
  useEffect(() => {
    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ user?: VendorUser | null }>;
      setCurrentVendor(customEvent.detail?.user || null);
    };
    window.addEventListener('vendor:auth-changed', handleAuthChange);
    return () => window.removeEventListener('vendor:auth-changed', handleAuthChange);
  }, []);

  const handleLogin = (user: VendorUser) => {
    setCurrentVendor(user);
    showToast(`Welcome back, ${user.name}!`);
    navigate('/overview', { replace: true });
  };

  const handleLogout = () => {
    vendorAuthService.logout();
    setCurrentVendor(null);
    showToast('Signed out of promoter console safely.', 'info');
    navigate('/login', { replace: true });
  };

  // Initialize data from service
  const loadData = async () => {
    const loadedConcerts = await vendorConcertService.getConcerts();
    setConcerts(loadedConcerts);
    setAttendees(vendorConcertService.getAttendees());
    setVenues(vendorConcertService.getVenues());
    setArtists(vendorConcertService.getStoredArtists());
    setPayouts(vendorConcertService.getPayouts());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync active tab with location
  useEffect(() => {
    const path = location.pathname;
    if (path === '/concerts/overview') {
      setActiveTab('concerts-overview');
    } else if (path.startsWith('/concerts')) {
      setActiveTab('concerts');
    } else if (path.startsWith('/artists')) {
      setActiveTab('artists');
    } else if (path.startsWith('/gate-scanner')) {
      setActiveTab('gate-scanner');
    } else if (path.startsWith('/attendees')) {
      setActiveTab('attendees');
    } else if (path.startsWith('/venues')) {
      setActiveTab('venues');
    } else if (path === '/trips/overview') {
      setActiveTab('trips-overview');
    } else if (path.startsWith('/trips/companions')) {
      setActiveTab('trip-companions');
    } else if (path.startsWith('/trips')) {
      setActiveTab('trips');
    } else if (path === '/stranger-meets/overview') {
      setActiveTab('stranger-meets-overview');
    } else if (path.startsWith('/stranger-meets/buddies')) {
      setActiveTab('stranger-buddies');
    } else if (path.startsWith('/stranger-meets')) {
      setActiveTab('stranger-meets');
    } else if (path.startsWith('/payouts')) {
      setActiveTab('payouts');
    } else if (path.startsWith('/settings')) {
      setActiveTab('settings');
    } else if (path.startsWith('/profile')) {
      setActiveTab('profile');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      text,
      type
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Concert handlers
  const handleCreateConcert = async (
    concertData: Omit<ConcertEvent, 'id' | 'ticketsSold' | 'connectedRidesCount'>
  ) => {
    const created = await vendorConcertService.createConcert(concertData);
    setConcerts((prev) => [created, ...prev]);
    showToast(`Tour stop "${created.title}" published to live network!`);
  };

  const handleUpdateConcert = async (
    id: string,
    updates: Partial<ConcertEvent>
  ) => {
    const updated = await vendorConcertService.updateConcert(id, updates);
    setConcerts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    showToast(`Concert "${updated.title}" updated successfully!`);
  };

  const handleStatusChange = async (id: string, status: ConcertEvent['status']) => {
    await vendorConcertService.updateStatus(id, status);
    setConcerts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    showToast(`Concert status updated to ${status}.`);
  };

  const handleDeleteConcert = async (id: string) => {
    await vendorConcertService.deleteConcert(id);
    setConcerts((prev) => prev.filter((c) => c.id !== id));
    showToast('Concert event archived.');
    navigate('/concerts');
  };

  // Trip Handlers
  const handleAddTrip = (newTrip: TripPlan) => {
    setTrips((prev) => {
      const updated = [newTrip, ...prev];
      try {
        localStorage.setItem('wayfor_vendor_trips', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteTrip = (id: string) => {
    setTrips((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('wayfor_vendor_trips', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Stranger Meets Handlers
  const handleAddMeet = (newMeet: StrangerMeet) => {
    setStrangerMeets((prev) => {
      const updated = [newMeet, ...prev];
      try {
        localStorage.setItem('wayfor_vendor_meets', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteMeet = (id: string) => {
    setStrangerMeets((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem('wayfor_vendor_meets', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Attendee Checkin handler
  const handleToggleCheckIn = (bookingId: string) => {
    const updated = vendorConcertService.toggleCheckInManual(bookingId);
    if (updated) {
      setAttendees(vendorConcertService.getAttendees());
    }
  };

  // Add Ticket Booking Handler
  const handleAddBooking = (newBooking: AttendeeBooking) => {
    const currentAttendees = vendorConcertService.getAttendees();
    const updatedAttendees = [newBooking, ...currentAttendees];
    vendorConcertService.saveAttendees(updatedAttendees);
    setAttendees(updatedAttendees);

    // Update concert ticket tiers & ticketsSold
    setConcerts((prev) => {
      const updatedConcerts = prev.map((c) => {
        if (c.id === newBooking.concertId) {
          const updatedTiers = c.ticketTiers.map((t) => {
            if (t.name.toLowerCase() === newBooking.ticketTier.toLowerCase()) {
              return {
                ...t,
                available: Math.max(0, t.available - newBooking.seatsCount)
              };
            }
            return t;
          });
          return {
            ...c,
            ticketsSold: c.ticketsSold + newBooking.seatsCount,
            ticketTiers: updatedTiers
          };
        }
        return c;
      });
      vendorConcertService.saveConcerts(updatedConcerts);
      return updatedConcerts;
    });
  };

  // Venue Handler
  const handleAddVenue = (newVenue: Venue) => {
    setVenues((prev) => [newVenue, ...prev]);
  };

  // Artist Creation Handler for CreateConcertScreen
  const handleCreateArtist = async (artistData: Omit<Artist, 'id'>) => {
    const created = await vendorConcertService.createArtist(artistData);
    setArtists((prev) => [created, ...prev]);
  };

  // Payout Handler
  const handleRequestPayout = (amount: number) => {
    const newPayout: PayoutTransaction = {
      id: `po-${Date.now().toString().slice(-4)}`,
      amount,
      currency: 'INR',
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      method: 'Direct Bank Settlement (RTGS)',
      concertTitle: 'Box Office Cleared Earnings',
      grossRevenue: Math.round(amount / 0.95),
      platformFee: Math.round(amount * 0.05),
      taxWithheld: 0,
      referenceId: `RTGS-HDFC-${Date.now().toString().slice(-6)}`
    };
    setPayouts((prev) => [newPayout, ...prev]);
  };

  const activeConcertsCount = concerts.filter((c) => c.status === 'active').length;

  // Module authorization check
  const assignedModules: string[] = currentVendor?.serviceModules && currentVendor.serviceModules.length > 0
    ? currentVendor.serviceModules
    : [currentVendor?.serviceModule || 'concerts'];

  const isAuthorized = (modId: string) => assignedModules.includes(modId);

  const UnauthorizedNotice = ({ moduleName }: { moduleName: string }) => (
    <div className="p-8 text-center rounded-2xl border border-slate-200 bg-white max-w-lg mx-auto my-12 shadow-sm space-y-4">
      <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900">Module Access Restricted</h2>
        <p className="text-xs text-slate-600 mt-1">
          Your agency account currently does not have access authorization for the <strong>{moduleName}</strong> module.
        </p>
      </div>
      <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
        Active modules assigned by Admin: <strong className="text-purple-700">{assignedModules.join(', ')}</strong>
      </div>
      <div className="pt-2">
        <button
          onClick={() => navigate('/overview')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 cursor-pointer"
        >
          Return to Studio Dashboard
        </button>
      </div>
    </div>
  );

  if (!currentVendor) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-100 selection:text-purple-800">
        <Routes>
          <Route
            path="/login"
            element={<VendorLogin onLogin={handleLogin} onShowToast={showToast} />}
          />
          <Route
            path="/register"
            element={<VendorRegister onRegister={handleLogin} onShowToast={showToast} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-800">
      {/* Sidebar with Collapsible Modules according to Vendor Module Access */}
      <VendorSidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        activeConcertsCount={activeConcertsCount}
        totalAttendeesCount={attendees.length}
        artistsCount={artists.length}
        tripsCount={trips.length}
        meetsCount={strangerMeets.length}
        currentVendor={currentVendor}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <VendorHeader
          activeTab={activeTab}
          onOpenCreateConcert={() => navigate('/concerts/create')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentVendor={currentVendor}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-5 sm:p-7 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/login" element={<Navigate to="/overview" replace />} />
            <Route path="/register" element={<Navigate to="/overview" replace />} />
            <Route
              path="/overview"
              element={
                <VendorOverview
                  concerts={concerts}
                  trips={trips}
                  strangerMeets={strangerMeets}
                  currentVendor={currentVendor}
                  onOpenCreateConcert={() => navigate('/concerts/create')}
                  onSelectConcert={(c) => navigate(`/concerts/${c.id}`)}
                />
              }
            />

            {/* Concerts & Events Module Routes */}
            <Route
              path="/concerts/overview"
              element={
                isAuthorized('concerts') ? (
                  <ConcertsOverview
                    concerts={concerts}
                    onOpenCreateConcert={() => navigate('/concerts/create')}
                    onSelectConcert={(c) => navigate(`/concerts/${c.id}`)}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Concerts & Events" />
                )
              }
            />
            <Route
              path="/concerts"
              element={
                isAuthorized('concerts') ? (
                  <VendorConcertsList
                    concerts={concerts}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSelectConcert={(c) => navigate(`/concerts/${c.id}`)}
                    onOpenCreateModal={() => navigate('/concerts/create')}
                    onStatusChange={handleStatusChange}
                    onDeleteConcert={handleDeleteConcert}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Concerts & Events" />
                )
              }
            />
            <Route
              path="/concerts/create"
              element={
                isAuthorized('concerts') ? (
                  <CreateConcertScreen
                    onAddConcert={handleCreateConcert}
                    venues={venues}
                    onAddVenue={handleAddVenue}
                    artists={artists}
                    onAddArtist={handleCreateArtist}
                    onShowToast={showToast}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Concerts & Events" />
                )
              }
            />
            <Route
              path="/concerts/new"
              element={<Navigate to="/concerts/create" replace />}
            />
            <Route
              path="/concerts/:concertId/edit"
              element={
                isAuthorized('concerts') ? (
                  <CreateConcertScreen
                    onAddConcert={handleCreateConcert}
                    onUpdateConcert={handleUpdateConcert}
                    concerts={concerts}
                    venues={venues}
                    onAddVenue={handleAddVenue}
                    artists={artists}
                    onAddArtist={handleCreateArtist}
                    onShowToast={showToast}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Concerts & Events" />
                )
              }
            />
            <Route
              path="/concerts/:concertId"
              element={
                isAuthorized('concerts') ? (
                  <VendorConcertDetail
                    concerts={concerts}
                    attendees={attendees}
                    onStatusChange={handleStatusChange}
                    onDeleteConcert={handleDeleteConcert}
                    onToggleCheckIn={handleToggleCheckIn}
                    onShowToast={showToast}
                    onAddBooking={handleAddBooking}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Concerts & Events" />
                )
              }
            />
            <Route
              path="/artists"
              element={
                isAuthorized('concerts') ? (
                  <ArtistsView
                    onShowToast={showToast}
                    onArtistsChange={(updated) => setArtists(updated)}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Artists & Headliners" />
                )
              }
            />
            <Route
              path="/gate-scanner"
              element={
                isAuthorized('concerts') ? (
                  <GateScannerView
                    concerts={concerts}
                    attendees={attendees}
                    onRefreshData={loadData}
                    onShowToast={showToast}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Gate Scanner" />
                )
              }
            />
            <Route
              path="/attendees"
              element={
                isAuthorized('concerts') ? (
                  <AttendeeManifestView
                    attendees={attendees}
                    concerts={concerts}
                    onToggleCheckIn={handleToggleCheckIn}
                    onShowToast={showToast}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Attendee Manifest" />
                )
              }
            />
            <Route
              path="/venues"
              element={
                isAuthorized('concerts') ? (
                  <VenuesView
                    venues={venues}
                    onAddVenue={handleAddVenue}
                    onShowToast={showToast}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Venues & Stages" />
                )
              }
            />

            {/* Trip Planner Module Routes */}
            <Route
              path="/trips/overview"
              element={
                isAuthorized('trips') ? (
                  <TripsOverview
                    trips={trips}
                    onAddTrip={handleAddTrip}
                    onShowToast={showToast}
                    currentVendorName={currentVendor.companyName || currentVendor.name}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Trip Planner & Group Travel" />
                )
              }
            />
            <Route
              path="/trips"
              element={
                isAuthorized('trips') ? (
                  <VendorTripsView
                    trips={trips}
                    onAddTrip={handleAddTrip}
                    onDeleteTrip={handleDeleteTrip}
                    onShowToast={showToast}
                    currentVendorName={currentVendor.companyName || currentVendor.name}
                    activeSubTab="all-trips"
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Trip Planner & Group Travel" />
                )
              }
            />
            <Route
              path="/trips/companions"
              element={
                isAuthorized('trips') ? (
                  <VendorTripsView
                    trips={trips}
                    onAddTrip={handleAddTrip}
                    onDeleteTrip={handleDeleteTrip}
                    onShowToast={showToast}
                    currentVendorName={currentVendor.companyName || currentVendor.name}
                    activeSubTab="companions"
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Trip Companions" />
                )
              }
            />

            {/* Stranger Meets Module Routes */}
            <Route
              path="/stranger-meets/overview"
              element={
                isAuthorized('stranger-meets') ? (
                  <StrangerMeetsOverview
                    meets={strangerMeets}
                    onAddMeet={handleAddMeet}
                    onShowToast={showToast}
                    currentVendorName={currentVendor.companyName || currentVendor.name}
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Stranger Meets & Community Mixers" />
                )
              }
            />
            <Route
              path="/stranger-meets"
              element={
                isAuthorized('stranger-meets') ? (
                  <VendorStrangerMeetsView
                    meets={strangerMeets}
                    onAddMeet={handleAddMeet}
                    onDeleteMeet={handleDeleteMeet}
                    onShowToast={showToast}
                    currentVendorName={currentVendor.companyName || currentVendor.name}
                    activeSubTab="all-meets"
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Stranger Meets & Socials" />
                )
              }
            />
            <Route
              path="/stranger-meets/buddies"
              element={
                isAuthorized('stranger-meets') ? (
                  <VendorStrangerMeetsView
                    meets={strangerMeets}
                    onAddMeet={handleAddMeet}
                    onDeleteMeet={handleDeleteMeet}
                    onShowToast={showToast}
                    currentVendorName={currentVendor.companyName || currentVendor.name}
                    activeSubTab="buddies"
                  />
                ) : (
                  <UnauthorizedNotice moduleName="Stranger Meets Buddies Roster" />
                )
              }
            />

            {/* Financials & Settings Routes */}
            <Route
              path="/payouts"
              element={
                <PayoutsView
                  payouts={payouts}
                  onRequestPayout={handleRequestPayout}
                  onShowToast={showToast}
                />
              }
            />
            <Route
              path="/settings"
              element={<VendorSettingsView onShowToast={showToast} />}
            />
            <Route
              path="/profile"
              element={
                <VendorProfileView
                  currentVendor={currentVendor}
                  onShowToast={showToast}
                />
              }
            />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>

      {/* Toast System */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
