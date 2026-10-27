export type NavigationTab =
  | 'overview'
  | 'concerts'
  | 'artists'
  | 'gate-scanner'
  | 'attendees'
  | 'venues'
  | 'payouts'
  | 'settings'
  | 'profile';

export type StatusType = 'active' | 'upcoming' | 'completed' | 'cancelled' | 'draft' | 'pending' | 'verified';

export * from './auth';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  available: number;
  total: number;
  description?: string;
  perks?: string[];
}

export interface ProductionChecklist {
  soundCheck: boolean;
  lightingRig: boolean;
  barricadesChecked: boolean;
  paramedicOnSite: boolean;
  securityGuardsCount: number;
}

export interface ConcertEvent {
  id: string;
  title: string;
  artist: string;
  supportingActs?: string[];
  tourName?: string;
  genre: 'EDM' | 'Rock' | 'Pop' | 'Hip-Hop' | 'Indie' | 'Classical' | 'Jazz';
  genres?: string[];
  date: string;
  doorsOpen: string;
  showTime?: string;
  venueName: string;
  venueAddress?: string;
  city: string;
  country: string;
  image: string;
  totalCapacity: number;
  ticketsSold: number;
  minPrice: number;
  maxPrice: number;
  currency: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled' | 'draft';
  ticketTiers: TicketTier[];
  organizer: string;
  connectedRidesCount?: number;
  soundSystem?: string;
  ageRestriction?: string;
  durationHours?: string;
  languages?: string[];
  gallery?: string[];
  videoUrl?: string;
  productionChecklist?: ProductionChecklist;
}

export interface AttendeeBooking {
  id: string;
  orderNumber: string;
  concertId: string;
  concertTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  ticketTier: string;
  seatsCount: number;
  totalPaid: number;
  currency: string;
  purchaseDate: string;
  ticketCode: string;
  checkedIn: boolean;
  checkedInAt?: string;
  gateStaff?: string;
  gateNumber?: string;
}

export interface GateScanLog {
  id: string;
  timestamp: string;
  ticketCode: string;
  attendeeName: string;
  ticketTier: string;
  concertTitle: string;
  status: 'granted' | 'duplicate' | 'invalid';
  gateNumber: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: number;
  address: string;
  soundSystem: string;
  type: 'Stadium' | 'Arena' | 'Open Grounds' | 'Club' | 'Auditorium';
  contactPerson: string;
  status: 'active' | 'maintenance';
  image?: string;
}

export interface PayoutTransaction {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'processing' | 'pending';
  method: string;
  concertTitle: string;
  grossRevenue: number;
  platformFee: number;
  taxWithheld: number;
  referenceId: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  avatar: string;
  serviceModule?: string;
  serviceModules?: string[];
  gstNumber: string;
  panNumber?: string;
  panPhoto?: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  isVerified: boolean;
  isRegistered?: boolean;
  rating: number;
  totalConcertsHosted: number;
  totalTicketsSold: number;
}

export interface ArtistSocialLinks {
  spotify?: string;
  instagram?: string;
  youtube?: string;
  appleMusic?: string;
  twitter?: string;
}

export interface ArtistManagement {
  managerName?: string;
  agency?: string;
  email?: string;
  phone?: string;
}

export interface ArtistRider {
  microphonePreference?: string;
  inEarMonitors?: string;
  hospitalityNotes?: string;
  stagePlotNotes?: string;
}

export interface Artist {
  id: string;
  name: string;
  stageName?: string;
  genre: string;
  subGenres?: string[];
  avatar: string;
  bannerImage?: string;
  bio: string;
  country: string;
  city?: string;
  monthlyListeners?: string;
  status: 'touring' | 'active' | 'available' | 'on-break';
  socialLinks?: ArtistSocialLinks;
  management?: ArtistManagement;
  rider?: ArtistRider;
  totalConcerts?: number;
  upcomingConcerts?: number;
  verified?: boolean;
}
