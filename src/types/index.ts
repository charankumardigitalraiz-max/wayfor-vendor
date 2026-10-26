export type NavigationTab =
  | 'overview'
  | 'concerts'
  | 'gate-scanner'
  | 'attendees'
  | 'venues'
  | 'payouts'
  | 'settings';

export type StatusType = 'active' | 'upcoming' | 'completed' | 'cancelled' | 'draft' | 'pending' | 'verified';

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
  gstNumber: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  isVerified: boolean;
  rating: number;
  totalConcertsHosted: number;
  totalTicketsSold: number;
}
