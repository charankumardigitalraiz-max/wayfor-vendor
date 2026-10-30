export type NavigationTab =
  | 'overview'
  | 'concerts-overview'
  | 'concerts'
  | 'artists'
  | 'gate-scanner'
  | 'attendees'
  | 'venues'
  | 'trips-overview'
  | 'trips'
  | 'trip-companions'
  | 'stranger-meets-overview'
  | 'stranger-meets'
  | 'stranger-buddies'
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
  genre: 'EDM' | 'Rock' | 'Pop' | 'Hip-Hop' | 'Indie' | 'Classical' | 'Jazz' | string;
  genres?: string[];
  eventCategory?: 'music' | 'comedy' | 'dance' | 'theatre' | 'dj-electronic' | 'magic-variety' | string;
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
  isFree?: boolean;
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

export type VendorModule = 'concerts' | 'carpooling' | 'trips' | 'stranger-meets';

export interface VendorAssignedModule {
  id: VendorModule;
  name: string;
  badge: string;
  category: string;
  description: string;
  isPrimary: boolean;
  status: 'active' | 'pending' | 'suspended';
  assignedDate: string;
  assignedBy?: string;
  totalActivities?: number;
  totalRevenue?: number;
}

export interface VendorProfile {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  avatar: string;
  city?: string;
  country?: string;
  serviceModule?: VendorModule | string;
  serviceModules?: (VendorModule | string)[];
  assignedModules?: VendorAssignedModule[];
  status?: string;
  kycStatus?: string;
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
  totalActivities?: number;
  totalRevenue?: number;
  pendingPayout?: number;
  joinedDate?: string;
  lastActive?: string;
  website?: string;
  notes?: string;
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
  status: 'active' | 'inactive';
  socialLinks?: ArtistSocialLinks;
  management?: ArtistManagement;
  rider?: ArtistRider;
  totalConcerts?: number;
  upcomingConcerts?: number;
  verified?: boolean;
}

export interface TripItineraryDay {
  dayNumber: number;
  title: string;
  destination: string;
  description: string;
  highlights: string[];
}

export interface TripTraveler {
  id: string;
  name: string;
  avatar: string;
  joinedAt: string;
  pickupStop?: string;
  seatsBooked?: number;
}

export interface TripPlan {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  creatorBio: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  estimatedBudget: number;
  currency: string;
  category: 'Roadtrip' | 'Music Tour' | 'Nature & Trek' | 'City Hopping' | 'Weekend Escape' | string;
  maxTravelers: number;
  joinedTravelers: TripTraveler[];
  itinerary: TripItineraryDay[];
  waypoints: string[];
  linkedCarpoolRideId?: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  coverImage?: string;
  organizerCompany?: string;
}

export interface StrangerMeetParticipant {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: string;
  city: string;
  bio: string;
  verifiedKYC: boolean;
  interests: string[];
  joinedAt: string;
  status: 'confirmed' | 'pending';
  socialScore: number;
}

export interface StrangerMeet {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostAvatar: string;
  hostRating: number;
  hostVerified: boolean;
  category: 'Coffee & Chill' | 'Weekend Roadtrip' | 'Trek & Adventure' | 'Music & Nightlife' | 'City Walk & Food' | string;
  city: string;
  meetingPoint: string;
  meetDate: string;
  meetTime: string;
  maxParticipants: number;
  participants: StrangerMeetParticipant[];
  safetyGuidelines: string[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  vibeTags: string[];
  coverImage?: string;
  pricePerPerson?: number;
  currency?: string;
}
