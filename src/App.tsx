import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import type {
  ConcertEvent,
  AttendeeBooking,
  Venue,
  PayoutTransaction,
  NavigationTab,
  Artist
} from './types';
import { vendorConcertService } from './services/vendorConcertService';
import { VendorSidebar } from './components/layout/VendorSidebar';
import { VendorHeader } from './components/layout/VendorHeader';
import { VendorOverview } from './components/dashboard/VendorOverview';
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
    setArtists(vendorConcertService.getArtists());
    setPayouts(vendorConcertService.getPayouts());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync active tab with location
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/concerts')) {
      setActiveTab('concerts');
    } else if (path.startsWith('/artists')) {
      setActiveTab('artists');
    } else if (path.startsWith('/gate-scanner')) {
      setActiveTab('gate-scanner');
    } else if (path.startsWith('/attendees')) {
      setActiveTab('attendees');
    } else if (path.startsWith('/venues')) {
      setActiveTab('venues');
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

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      text,
      type
    };
    setToasts((prev) => [...prev, newToast]);
  };

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

  // Attendee Checkin handler
  const handleToggleCheckIn = (bookingId: string) => {
    const updated = vendorConcertService.toggleCheckInManual(bookingId);
    if (updated) {
      setAttendees(vendorConcertService.getAttendees());
    }
  };

  // Venue Handler
  const handleAddVenue = (newVenue: Venue) => {
    setVenues((prev) => [newVenue, ...prev]);
  };

  // Artist Handlers
  const handleCreateArtist = async (artistData: Omit<Artist, 'id'>) => {
    const created = await vendorConcertService.createArtist(artistData);
    setArtists((prev) => [created, ...prev]);
  };

  const handleDeleteArtist = async (id: string) => {
    await vendorConcertService.deleteArtist(id);
    setArtists((prev) => prev.filter((a) => a.id !== id));
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
      {/* Sidebar */}
      <VendorSidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        activeConcertsCount={activeConcertsCount}
        totalAttendeesCount={attendees.length}
        artistsCount={artists.length}
        currentVendor={currentVendor}
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
                  onOpenCreateConcert={() => navigate('/concerts/create')}
                  onSelectConcert={(c) => navigate(`/concerts/${c.id}`)}
                />
              }
            />
            <Route
              path="/concerts"
              element={
                <VendorConcertsList
                  concerts={concerts}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSelectConcert={(c) => navigate(`/concerts/${c.id}`)}
                  onOpenCreateModal={() => navigate('/concerts/create')}
                  onStatusChange={handleStatusChange}
                  onDeleteConcert={handleDeleteConcert}
                />
              }
            />
            <Route
              path="/concerts/create"
              element={
                <CreateConcertScreen
                  onAddConcert={handleCreateConcert}
                  venues={venues}
                  onAddVenue={handleAddVenue}
                  artists={artists}
                  onAddArtist={handleCreateArtist}
                  onShowToast={showToast}
                />
              }
            />
            <Route
              path="/concerts/new"
              element={<Navigate to="/concerts/create" replace />}
            />
            <Route
              path="/concerts/:concertId"
              element={
                <VendorConcertDetail
                  concerts={concerts}
                  attendees={attendees}
                  onStatusChange={handleStatusChange}
                  onDeleteConcert={handleDeleteConcert}
                  onToggleCheckIn={handleToggleCheckIn}
                  onShowToast={showToast}
                />
              }
            />
            <Route
              path="/artists"
              element={
                <ArtistsView
                  artists={artists}
                  onAddArtist={handleCreateArtist}
                  onDeleteArtist={handleDeleteArtist}
                  onShowToast={showToast}
                />
              }
            />
            <Route
              path="/gate-scanner"
              element={
                <GateScannerView
                  concerts={concerts}
                  attendees={attendees}
                  onRefreshData={loadData}
                  onShowToast={showToast}
                />
              }
            />
            <Route
              path="/attendees"
              element={
                <AttendeeManifestView
                  attendees={attendees}
                  concerts={concerts}
                  onToggleCheckIn={handleToggleCheckIn}
                  onShowToast={showToast}
                />
              }
            />
            <Route
              path="/venues"
              element={
                <VenuesView
                  venues={venues}
                  onAddVenue={handleAddVenue}
                  onShowToast={showToast}
                />
              }
            />
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
