import type {
  ConcertEvent,
  AttendeeBooking,
  GateScanLog,
  Venue,
  PayoutTransaction,
  VendorProfile,
  Artist,
  VendorModule,
  VendorAssignedModule,
  TripPlan,
  StrangerMeet
} from '../types';

export const ALL_WAYFOR_MODULES = [
  {
    id: 'concerts' as VendorModule,
    name: 'Concerts & Live Events',
    badge: 'Concerts & Events',
    category: 'Live Entertainment',
    description: 'Promote arena shows, manage stadium venues, curate artist lineups & sell box office passes.'
  },
  {
    id: 'trips' as VendorModule,
    name: 'Trip Planner & Group Travel',
    badge: 'Trip Planner',
    category: 'Tours & Packages',
    description: 'Design multi-day group itineraries, travel companion expeditions & adventure packages.'
  },
  {
    id: 'stranger-meets' as VendorModule,
    name: 'Stranger Meets & Socials',
    badge: 'Stranger Meets',
    category: 'Community Experiences',
    description: 'Host verified community icebreakers, weekend mixers, networking sessions & social gatherings.'
  }
];

export const mockAssignedModules: VendorAssignedModule[] = [
  {
    id: 'concerts',
    name: 'Concerts & Live Events',
    badge: 'Concerts & Events',
    category: 'Live Entertainment',
    description: 'Promote arena shows, manage stadium venues, curate artist lineups & sell box office passes.',
    isPrimary: true,
    status: 'active',
    assignedDate: '2025-08-15',
    assignedBy: 'WayFor Admin Operations',
    totalActivities: 28,
    totalRevenue: 84500000
  },
  {
    id: 'trips',
    name: 'Trip Planner & Group Travel',
    badge: 'Trip Planner',
    category: 'Tours & Packages',
    description: 'Design multi-day group itineraries, travel companion expeditions & adventure packages.',
    isPrimary: false,
    status: 'active',
    assignedDate: '2026-01-10',
    assignedBy: 'WayFor Admin Operations',
    totalActivities: 8,
    totalRevenue: 12400000
  },
  {
    id: 'stranger-meets',
    name: 'Stranger Meets & Socials',
    badge: 'Stranger Meets',
    category: 'Community Experiences',
    description: 'Host verified community icebreakers, weekend mixers, networking sessions & social gatherings.',
    isPrimary: false,
    status: 'active',
    assignedDate: '2026-04-20',
    assignedBy: 'WayFor Admin Operations',
    totalActivities: 15,
    totalRevenue: 3800000
  }
];

export const mockVendorProfile: VendorProfile = {
  id: 'vnd-801',
  name: 'Vikramaditya Singhania',
  companyName: 'Zenith Live Touring & Entertainment Ltd.',
  email: 'vikram@zenithentertainment.in',
  phone: '+91 98450 82910',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  city: 'Mumbai',
  country: 'India',
  serviceModule: 'concerts',
  serviceModules: ['concerts', 'trips', 'stranger-meets'],
  assignedModules: mockAssignedModules,
  status: 'active',
  kycStatus: 'verified',
  gstNumber: '36AAACZ8912P1ZV',
  bankName: 'HDFC Bank Ltd - Corporate Banking',
  bankAccountNumber: '50200084918231',
  ifscCode: 'HDFC0000240',
  isVerified: true,
  isRegistered: true,
  rating: 4.9,
  totalConcertsHosted: 28,
  totalTicketsSold: 184500,
  totalActivities: 28,
  totalRevenue: 84500000,
  pendingPayout: 1420000,
  joinedDate: '2025-08-15',
  lastActive: '2026-10-27T10:14:00Z',
  website: 'https://zenithlive.in',
  notes: 'Primary concert organizer for EDM and Rock stadium tours in West Zone.'
};

export const mockVendors: VendorProfile[] = [
  mockVendorProfile,
  {
    id: 'vnd-802',
    name: 'Rohan Deshmukh',
    companyName: 'Genesys Global Touring Infrastructure',
    email: 'production@genesystour.com',
    phone: '+91 98200 44109',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    city: 'Pune',
    country: 'India',
    serviceModule: 'concerts',
    serviceModules: ['concerts'],
    status: 'active',
    kycStatus: 'verified',
    isVerified: true,
    isRegistered: true,
    gstNumber: '27AABCG9104K1ZT',
    bankName: 'Kotak Mahindra Bank',
    bankAccountNumber: '941200481920',
    ifscCode: 'KKBK0000421',
    rating: 4.85,
    totalConcertsHosted: 14,
    totalTicketsSold: 92400,
    totalActivities: 14,
    totalRevenue: 42100000,
    pendingPayout: 850000,
    joinedDate: '2025-11-02',
    lastActive: '2026-10-26T18:20:00Z',
    website: 'https://genesystour.com',
    notes: 'Tour stage production, line-array acoustics, and arena operations partner.'
  },
  {
    id: 'vnd-803',
    name: 'Captain Amitav Roy',
    companyName: 'Expressway Intercity Fleet Services',
    email: 'fleet@expresswayrides.in',
    phone: '+91 98101 23456',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    city: 'Bengaluru',
    country: 'India',
    serviceModule: 'carpooling',
    serviceModules: ['carpooling'],
    status: 'active',
    kycStatus: 'verified',
    isVerified: true,
    isRegistered: true,
    gstNumber: '29AABCE5678Q1Z3',
    bankName: 'State Bank of India - Commercial',
    bankAccountNumber: '381920048192',
    ifscCode: 'SBIN0001420',
    rating: 4.92,
    totalConcertsHosted: 0,
    totalTicketsSold: 0,
    totalActivities: 3120,
    totalRevenue: 15400000,
    pendingPayout: 320000,
    joinedDate: '2025-06-10',
    lastActive: '2026-10-27T11:45:00Z',
    website: 'https://expresswayrides.in',
    notes: 'Operating EV & premium MPV carpooling routes on BLR-CHN and BLR-HYD corridors.'
  },
  {
    id: 'vnd-804',
    name: 'Kavita Nair',
    companyName: 'Western Ghats & Himalayan Expeditions',
    email: 'kavita@westernghatstreks.org',
    phone: '+91 94470 12890',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    city: 'Kochi',
    country: 'India',
    serviceModule: 'trips',
    serviceModules: ['trips'],
    status: 'active',
    kycStatus: 'verified',
    isVerified: true,
    isRegistered: true,
    gstNumber: '32AABCK4819R1Z1',
    bankName: 'Federal Bank Ltd',
    bankAccountNumber: '102900381920',
    ifscCode: 'FDRL0001002',
    rating: 4.94,
    totalConcertsHosted: 0,
    totalTicketsSold: 0,
    totalActivities: 64,
    totalRevenue: 28900000,
    pendingPayout: 640000,
    joinedDate: '2025-09-01',
    lastActive: '2026-10-26T14:10:00Z',
    website: 'https://westernghatstreks.org',
    notes: 'Verified certified mountain leaders for group eco-trips and companion expeditions.'
  },
  {
    id: 'vnd-805',
    name: 'Sameer Sheikh',
    companyName: 'SocialCircle Community Gatherings',
    email: 'sameer@socialcircle.co.in',
    phone: '+91 98210 98765',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    city: 'New Delhi',
    country: 'India',
    serviceModule: 'stranger-meets',
    serviceModules: ['stranger-meets'],
    status: 'active',
    kycStatus: 'verified',
    isVerified: true,
    isRegistered: true,
    gstNumber: '07AAACS1122P1Z6',
    bankName: 'Axis Bank Ltd',
    bankAccountNumber: '91201004819201',
    ifscCode: 'UTIB0000014',
    rating: 4.88,
    totalConcertsHosted: 0,
    totalTicketsSold: 0,
    totalActivities: 142,
    totalRevenue: 7800000,
    pendingPayout: 180000,
    joinedDate: '2025-10-18',
    lastActive: '2026-10-27T08:30:00Z',
    website: 'https://socialcircle.co.in',
    notes: 'Curates verified weekend speed-networking, book clubs & startup mixers in Delhi NCR.'
  },
  {
    id: 'vnd-807',
    name: 'Ananya Mehra',
    companyName: 'Sunwave Live & Festival Co.',
    email: 'ananya@sunshinelive.in',
    phone: '+91 97110 58231',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    city: 'Goa',
    country: 'India',
    serviceModule: 'concerts',
    serviceModules: ['concerts', 'stranger-meets'],
    status: 'active',
    kycStatus: 'verified',
    isVerified: true,
    isRegistered: true,
    gstNumber: '30AAACS4192L1Z4',
    bankName: 'ICICI Bank Ltd - Panaji',
    bankAccountNumber: '001205018932',
    ifscCode: 'ICIC0000012',
    rating: 4.95,
    totalConcertsHosted: 21,
    totalTicketsSold: 142000,
    totalActivities: 21,
    totalRevenue: 68400000,
    pendingPayout: 1100000,
    joinedDate: '2025-07-20',
    lastActive: '2026-10-27T12:00:00Z',
    website: 'https://sunwavelive.com',
    notes: 'Hosts beach music festivals and open-air sunset amphitheater sessions.'
  }
];

export const mockVendorConcerts: ConcertEvent[] = [
  {
    id: 'cnc-01',
    title: 'Neon Odyssey: World Electronic Symphony',
    artist: 'Anyma & Tale of Us',
    supportingActs: ['Kevin de Vries', 'Argy', 'Massano'],
    tourName: 'Genesys & Odyssey Global Run',
    genre: 'EDM',
    date: '2026-11-14',
    doorsOpen: '18:00',
    showTime: '20:30',
    venueName: 'Jio World Garden',
    venueAddress: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
    city: 'Mumbai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80',
    totalCapacity: 22000,
    ticketsSold: 19800,
    minPrice: 1999,
    maxPrice: 8999,
    currency: 'INR',
    status: 'active',
    soundSystem: 'Meyer Sound PANTHER Line Array & Subwoofers',
    ageRestriction: '16+ (Valid Govt ID Required)',
    organizer: 'Zenith Live Touring & Entertainment',
    connectedRidesCount: 42,
    gallery: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80'
    ],
    productionChecklist: {
      soundCheck: true,
      lightingRig: true,
      barricadesChecked: true,
      paramedicOnSite: true,
      securityGuardsCount: 120
    },
    ticketTiers: [
      {
        id: 'tier-1',
        name: 'Early Bird GA',
        price: 1999,
        available: 0,
        total: 5000,
        description: 'Standard access to general lawn arena',
        perks: ['Main arena admission', 'Food stall zone access']
      },
      {
        id: 'tier-2',
        name: 'Phase 2 Standing',
        price: 2999,
        available: 950,
        total: 10000,
        description: 'Unreserved standing in front of main sound console',
        perks: ['Center lawn perspective', 'Express festival gate 2 entry']
      },
      {
        id: 'tier-3',
        name: 'VIP Hologram Circle',
        price: 5499,
        available: 820,
        total: 5000,
        description: 'Elevated platform view with private lounge bar',
        perks: ['Elevated view', 'Exclusive bar & washrooms', 'Complimentary drink voucher']
      },
      {
        id: 'tier-4',
        name: 'VVIP Backstage Table (4 Pax)',
        price: 8999,
        available: 430,
        total: 2000,
        description: 'Prime soundstage immersion right behind the DJ booth',
        perks: ['Backstage access', 'Dedicated hospitality captain', 'Valet parking pass']
      }
    ]
  },
  {
    id: 'cnc-02',
    title: 'Music of the Spheres: Sustainable World Tour',
    artist: 'Coldplay',
    supportingActs: ['CHVRCHES', 'Prateek Kuhad'],
    tourName: 'Eco-Kinetic World Tour',
    genre: 'Rock',
    date: '2026-11-20',
    doorsOpen: '16:30',
    showTime: '19:45',
    venueName: 'Narendra Modi Stadium',
    venueAddress: 'Motera, Sabarmati, Ahmedabad, Gujarat 380005',
    city: 'Ahmedabad',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&auto=format&fit=crop&q=80',
    totalCapacity: 74000,
    ticketsSold: 71800,
    minPrice: 3500,
    maxPrice: 24500,
    currency: 'INR',
    status: 'active',
    soundSystem: 'L-Acoustics K1 Stadium Array & Sub Arc',
    ageRestriction: 'All Ages (Kids under 12 accompanied by adult)',
    organizer: 'Zenith Live Touring & Entertainment',
    connectedRidesCount: 88,
    gallery: [
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&auto=format&fit=crop&q=80'
    ],
    productionChecklist: {
      soundCheck: true,
      lightingRig: true,
      barricadesChecked: true,
      paramedicOnSite: true,
      securityGuardsCount: 380
    },
    ticketTiers: [
      {
        id: 'tier-c1',
        name: 'Kinetic Dance Floor (Ground)',
        price: 4500,
        available: 650,
        total: 35000,
        description: 'Power the concert with every jump on kinetic energy dance floors',
        perks: ['Reusable plant-based LED wristband', 'Direct stage proximity']
      },
      {
        id: 'tier-c2',
        name: 'Grandstand Tier 1 (East Wing)',
        price: 3500,
        available: 1100,
        total: 25000,
        description: 'Numbered bucket seats with stadium-wide panoramic acoustic view',
        perks: ['Reserved seating', 'Dedicated ramp access']
      },
      {
        id: 'tier-c3',
        name: 'Infinity Club Lounge Experience',
        price: 24500,
        available: 450,
        total: 14000,
        description: 'Air-conditioned hospitality suite with all-inclusive gourmet buffet',
        perks: ['Pre-show lounge catering', 'Merchandise gift pack', 'Priority stadium parking']
      }
    ]
  },
  {
    id: 'cnc-03',
    title: 'Dil-Luminati Arena Stadium Spectacle',
    artist: 'Diljit Dosanjh',
    supportingActs: ['The PropheC', 'DJ Frenzy'],
    tourName: 'Dil-Luminati India 2026',
    genre: 'Pop',
    date: '2026-12-02',
    doorsOpen: '17:00',
    showTime: '19:30',
    venueName: 'Jawaharlal Nehru Stadium',
    venueAddress: 'Pragati Vihar, Bhishma Pitamah Marg, New Delhi 110003',
    city: 'Delhi',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80',
    totalCapacity: 45000,
    ticketsSold: 41200,
    minPrice: 2499,
    maxPrice: 14999,
    currency: 'INR',
    status: 'active',
    soundSystem: 'd&b audiotechnik GSL Stadium System',
    ageRestriction: 'All Ages',
    organizer: 'Zenith Live Touring & Entertainment',
    connectedRidesCount: 64,
    gallery: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80'
    ],
    productionChecklist: {
      soundCheck: false,
      lightingRig: true,
      barricadesChecked: true,
      paramedicOnSite: true,
      securityGuardsCount: 220
    },
    ticketTiers: [
      {
        id: 'tier-d1',
        name: 'Silver Fan Pit',
        price: 2499,
        available: 1200,
        total: 20000,
        description: 'High energy open-air standing enclosure',
        perks: ['Official tour light baton']
      },
      {
        id: 'tier-d2',
        name: 'Gold Stagefront Enclosure',
        price: 4999,
        available: 1800,
        total: 18000,
        description: 'Direct runway interaction zone',
        perks: ['Closest visual vantage', 'Express Gate 4 pass']
      },
      {
        id: 'tier-d3',
        name: 'Platinum Hospitality Box',
        price: 14999,
        available: 800,
        total: 7000,
        description: 'Luxury stadium box overlooking center pitch',
        perks: ['AC suite with sofa seating', '5-course banquet', 'Commemorative jersey']
      }
    ]
  },
  {
    id: 'cnc-04',
    title: 'Southern Nights Acoustic & Fusion Odyssey',
    artist: 'Sid Sriram & Live Ensemble',
    supportingActs: ['Sushin Shyam', 'Masala Coffee'],
    tourName: 'Boundless Horizons Live',
    genre: 'Indie',
    date: '2026-12-15',
    doorsOpen: '18:30',
    showTime: '19:45',
    venueName: 'Gachibowli Stadium Athletic Arena',
    venueAddress: 'Old Mumbai Highway, Gachibowli, Hyderabad, Telangana 500032',
    city: 'Hyderabad',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=80',
    totalCapacity: 18000,
    ticketsSold: 13500,
    minPrice: 999,
    maxPrice: 4999,
    currency: 'INR',
    status: 'upcoming',
    soundSystem: 'JBL VTX A12 Acoustic Rig & Delay Towers',
    ageRestriction: 'All Ages',
    organizer: 'Zenith Live Touring & Entertainment',
    connectedRidesCount: 29,
    productionChecklist: {
      soundCheck: false,
      lightingRig: false,
      barricadesChecked: false,
      paramedicOnSite: false,
      securityGuardsCount: 90
    },
    ticketTiers: [
      {
        id: 'tier-s1',
        name: 'Standard Seating',
        price: 999,
        available: 2100,
        total: 10000,
        description: 'Tiered bowl seating with crystal clear audio delay distribution',
        perks: ['Numbered stadium seats']
      },
      {
        id: 'tier-s2',
        name: 'Premium Acoustic Arena',
        price: 2499,
        available: 1600,
        total: 6000,
        description: 'Chairs laid directly on athletic infield',
        perks: ['Frontal sound sweet spot', 'Fast track parking']
      },
      {
        id: 'tier-s3',
        name: 'VIP Backstage Meet Pass',
        price: 4999,
        available: 800,
        total: 2000,
        description: 'Front 3 rows + post-show acoustic signing session',
        perks: ['Artist sound check preview', 'Signed merchandise', 'Photo op']
      }
    ]
  },
  {
    id: 'cnc-05',
    title: 'Urban Underground Hip-Hop Showcase',
    artist: 'Divine & Gully Gang',
    supportingActs: ['Raja Kumari', 'MC Altaf', 'Shah Rule'],
    tourName: 'Gully to Global Vol. 3',
    genre: 'Hip-Hop',
    date: '2026-10-18',
    doorsOpen: '19:00',
    showTime: '20:15',
    venueName: 'Phoenix Marketcity Amphitheatre',
    venueAddress: 'Whitefield Main Road, Mahadevapura, Bengaluru, Karnataka 560048',
    city: 'Bengaluru',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80',
    totalCapacity: 8500,
    ticketsSold: 8500,
    minPrice: 1299,
    maxPrice: 3499,
    currency: 'INR',
    status: 'completed',
    soundSystem: 'Adamson E-Series Line Array',
    ageRestriction: '18+',
    organizer: 'Zenith Live Touring & Entertainment',
    connectedRidesCount: 18,
    productionChecklist: {
      soundCheck: true,
      lightingRig: true,
      barricadesChecked: true,
      paramedicOnSite: true,
      securityGuardsCount: 65
    },
    ticketTiers: [
      {
        id: 'tier-u1',
        name: 'Mosh Pit Standing',
        price: 1299,
        available: 0,
        total: 6500,
        description: 'Standard amphitheatre floor access',
        perks: ['Live cypher zone entry']
      },
      {
        id: 'tier-u2',
        name: 'VIP Balcony & Bar',
        price: 3499,
        available: 0,
        total: 2000,
        description: 'Overhead view with private beer garden',
        perks: ['VIP lanyard', 'Priority entrance']
      }
    ]
  }
];

export const mockAttendees: AttendeeBooking[] = [
  {
    id: 'bk-101',
    orderNumber: 'ORD-98210',
    concertId: 'cnc-01',
    concertTitle: 'Neon Odyssey: World Electronic Symphony',
    customerName: 'Aditya Vardhan',
    customerEmail: 'aditya.vardhan@outlook.com',
    customerPhone: '+91 98112 34567',
    ticketTier: 'VIP Hologram Circle',
    seatsCount: 2,
    totalPaid: 10998,
    currency: 'INR',
    purchaseDate: '2026-10-12',
    ticketCode: 'TKT-9821-VIP',
    checkedIn: true,
    checkedInAt: '2026-11-14T18:42:10Z',
    gateNumber: 'Gate 1 (VIP Fastrack)',
    gateStaff: 'Rahul Sharma (Gate 1)'
  },
  {
    id: 'bk-102',
    orderNumber: 'ORD-98211',
    concertId: 'cnc-01',
    concertTitle: 'Neon Odyssey: World Electronic Symphony',
    customerName: 'Priya Nambiar',
    customerEmail: 'priya.nambiar@gmail.com',
    customerPhone: '+91 99201 88472',
    ticketTier: 'Phase 2 Standing',
    seatsCount: 4,
    totalPaid: 11996,
    currency: 'INR',
    purchaseDate: '2026-10-14',
    ticketCode: 'TKT-9822-GA',
    checkedIn: true,
    checkedInAt: '2026-11-14T18:55:00Z',
    gateNumber: 'Gate 2 (General West)',
    gateStaff: 'Ananya Roy (Gate 2)'
  },
  {
    id: 'bk-103',
    orderNumber: 'ORD-98212',
    concertId: 'cnc-01',
    concertTitle: 'Neon Odyssey: World Electronic Symphony',
    customerName: 'Rohan Mehra',
    customerEmail: 'rohan.mehra@techcorp.io',
    customerPhone: '+91 98450 12093',
    ticketTier: 'VVIP Backstage Table (4 Pax)',
    seatsCount: 4,
    totalPaid: 35996,
    currency: 'INR',
    purchaseDate: '2026-10-15',
    ticketCode: 'TKT-9823-VVIP',
    checkedIn: false,
    gateNumber: 'Gate 1 (VIP Fastrack)'
  },
  {
    id: 'bk-104',
    orderNumber: 'ORD-98213',
    concertId: 'cnc-02',
    concertTitle: 'Music of the Spheres: Sustainable World Tour',
    customerName: 'Sanya Malhotra',
    customerEmail: 'sanya.m@creativestudio.in',
    customerPhone: '+91 97110 44921',
    ticketTier: 'Kinetic Dance Floor (Ground)',
    seatsCount: 2,
    totalPaid: 9000,
    currency: 'INR',
    purchaseDate: '2026-10-18',
    ticketCode: 'TKT-9824-COLD',
    checkedIn: false,
    gateNumber: 'Gate 3 (Ground Arena)'
  },
  {
    id: 'bk-105',
    orderNumber: 'ORD-98214',
    concertId: 'cnc-02',
    concertTitle: 'Music of the Spheres: Sustainable World Tour',
    customerName: 'Kunal Deshmukh',
    customerEmail: 'kunal.desh@gmail.com',
    customerPhone: '+91 98220 91823',
    ticketTier: 'Infinity Club Lounge Experience',
    seatsCount: 2,
    totalPaid: 49000,
    currency: 'INR',
    purchaseDate: '2026-10-19',
    ticketCode: 'TKT-9825-INF',
    checkedIn: false,
    gateNumber: 'Gate 1 (VIP Lounge)'
  },
  {
    id: 'bk-106',
    orderNumber: 'ORD-98215',
    concertId: 'cnc-03',
    concertTitle: 'Dil-Luminati Arena Stadium Spectacle',
    customerName: 'Harpreet Singh',
    customerEmail: 'harpreet.singh@delhiventures.com',
    customerPhone: '+91 98711 02938',
    ticketTier: 'Gold Stagefront Enclosure',
    seatsCount: 3,
    totalPaid: 14997,
    currency: 'INR',
    purchaseDate: '2026-10-21',
    ticketCode: 'TKT-9826-DIL',
    checkedIn: false,
    gateNumber: 'Gate 2 (Stagefront East)'
  },
  {
    id: 'bk-107',
    orderNumber: 'ORD-98216',
    concertId: 'cnc-03',
    concertTitle: 'Dil-Luminati Arena Stadium Spectacle',
    customerName: 'Neha Kapoor',
    customerEmail: 'neha.kapoor@fashionhouse.com',
    customerPhone: '+91 98104 55912',
    ticketTier: 'Platinum Hospitality Box',
    seatsCount: 2,
    totalPaid: 29998,
    currency: 'INR',
    purchaseDate: '2026-10-22',
    ticketCode: 'TKT-9827-PLAT',
    checkedIn: false,
    gateNumber: 'Gate 1 (Hospitality Fastrack)'
  },
  {
    id: 'bk-108',
    orderNumber: 'ORD-98217',
    concertId: 'cnc-04',
    concertTitle: 'Southern Nights Acoustic & Fusion Odyssey',
    customerName: 'Dr. Arvind Swaminathan',
    customerEmail: 'arvind.swami@apollo.in',
    customerPhone: '+91 94440 19283',
    ticketTier: 'VIP Backstage Meet Pass',
    seatsCount: 2,
    totalPaid: 9998,
    currency: 'INR',
    purchaseDate: '2026-10-23',
    ticketCode: 'TKT-9828-SID',
    checkedIn: false,
    gateNumber: 'Gate 1 (VIP Fastrack)'
  },
  {
    id: 'bk-109',
    orderNumber: 'ORD-98218',
    concertId: 'cnc-05',
    concertTitle: 'Urban Underground Hip-Hop Showcase',
    customerName: 'Tanmay Bhattacharya',
    customerEmail: 'tanmay.b@bangalorebeats.com',
    customerPhone: '+91 99800 12894',
    ticketTier: 'VIP Balcony & Bar',
    seatsCount: 2,
    totalPaid: 6998,
    currency: 'INR',
    purchaseDate: '2026-10-05',
    ticketCode: 'TKT-9829-GULLY',
    checkedIn: true,
    checkedInAt: '2026-10-18T19:30:15Z',
    gateNumber: 'Gate North (VIP Access)',
    gateStaff: 'Kavita Menon (Gate North)'
  }
];

export const mockGateScanLogs: GateScanLog[] = [
  {
    id: 'scan-01',
    timestamp: '2026-11-14T18:55:00Z',
    ticketCode: 'TKT-9822-GA',
    attendeeName: 'Priya Nambiar',
    ticketTier: 'Phase 2 Standing',
    concertTitle: 'Neon Odyssey: World Electronic Symphony',
    status: 'granted',
    gateNumber: 'Gate 2 (General West)'
  },
  {
    id: 'scan-02',
    timestamp: '2026-11-14T18:42:10Z',
    ticketCode: 'TKT-9821-VIP',
    attendeeName: 'Aditya Vardhan',
    ticketTier: 'VIP Hologram Circle',
    concertTitle: 'Neon Odyssey: World Electronic Symphony',
    status: 'granted',
    gateNumber: 'Gate 1 (VIP Fastrack)'
  },
  {
    id: 'scan-03',
    timestamp: '2026-11-14T18:35:45Z',
    ticketCode: 'TKT-9821-VIP',
    attendeeName: 'Aditya Vardhan (Attempt 2)',
    ticketTier: 'VIP Hologram Circle',
    concertTitle: 'Neon Odyssey: World Electronic Symphony',
    status: 'duplicate',
    gateNumber: 'Gate 1 (VIP Fastrack)'
  },
  {
    id: 'scan-04',
    timestamp: '2026-11-14T18:20:12Z',
    ticketCode: 'TKT-INVALID-99',
    attendeeName: 'Unknown Visitor',
    ticketTier: 'N/A',
    concertTitle: 'Neon Odyssey: World Electronic Symphony',
    status: 'invalid',
    gateNumber: 'Gate 3 (East Stand)'
  }
];

export const mockVenues: Venue[] = [
  {
    id: 'ven-01',
    name: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    capacity: 74000,
    address: 'Motera, Sabarmati, Ahmedabad, Gujarat 380005',
    soundSystem: 'L-Acoustics K1 Stadium Array with K1-SB subwoofers',
    type: 'Stadium',
    contactPerson: 'Bhavesh Patel (+91 98250 11920)',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ven-02',
    name: 'Jawaharlal Nehru Stadium',
    city: 'Delhi',
    capacity: 45000,
    address: 'Pragati Vihar, Bhishma Pitamah Marg, New Delhi 110003',
    soundSystem: 'd&b audiotechnik GSL System & SL-SUB arc',
    type: 'Stadium',
    contactPerson: 'Sunil Aggarwal (+91 98110 44291)',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ven-03',
    name: 'Jio World Garden',
    city: 'Mumbai',
    capacity: 22000,
    address: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
    soundSystem: 'Meyer Sound PANTHER Line Array & 2100-LFC',
    type: 'Open Grounds',
    contactPerson: 'Farhan Dastoor (+91 98200 88291)',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ven-04',
    name: 'Gachibowli Stadium Athletic Arena',
    city: 'Hyderabad',
    capacity: 18000,
    address: 'Old Mumbai Highway, Gachibowli, Hyderabad, Telangana 500032',
    soundSystem: 'JBL VTX A12 Acoustic Rig & Delay Towers',
    type: 'Stadium',
    contactPerson: 'K. S. Rao (+91 98490 22391)',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ven-05',
    name: 'Phoenix Marketcity Amphitheatre',
    city: 'Bengaluru',
    capacity: 8500,
    address: 'Whitefield Main Road, Mahadevapura, Bengaluru, Karnataka 560048',
    soundSystem: 'Adamson E-Series Line Array',
    type: 'Club',
    contactPerson: 'Cherian George (+91 98860 39182)',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
  }
];

export const mockPayouts: PayoutTransaction[] = [
  {
    id: 'po-701',
    amount: 19845000,
    currency: 'INR',
    date: '2026-10-22',
    status: 'completed',
    method: 'RTGS • HDFC Corporate (***8231)',
    concertTitle: 'Urban Underground Hip-Hop Showcase',
    grossRevenue: 21500000,
    platformFee: 1075000,
    taxWithheld: 580000,
    referenceId: 'RTGS-HDFC-98214-GULLY'
  },
  {
    id: 'po-702',
    amount: 84500000,
    currency: 'INR',
    date: '2026-10-24',
    status: 'processing',
    method: 'Direct Bank Settlement (In Progress)',
    concertTitle: 'Neon Odyssey: World Electronic Symphony (80% Advance)',
    grossRevenue: 98000000,
    platformFee: 4900000,
    taxWithheld: 8600000,
    referenceId: 'STL-BANK-20261024-NEON'
  },
  {
    id: 'po-703',
    amount: 245000000,
    currency: 'INR',
    date: '2026-10-25',
    status: 'pending',
    method: 'Settlement upon Gate Completion',
    concertTitle: 'Music of the Spheres: Sustainable World Tour',
    grossRevenue: 275000000,
    platformFee: 13750000,
    taxWithheld: 16250000,
    referenceId: 'HOLD-ESCROW-COLDPLAY'
  }
];

export const mockArtists: Artist[] = [
  {
    id: 'art-001',
    name: 'Anyma',
    stageName: 'Matteo Milleri (Tale of Us / Anyma)',
    genre: 'EDM',
    subGenres: ['Melodic Techno', 'Cinematic Visuals', 'Cyber Electro'],
    bio: 'Pioneering audiovisual electronic act blending humanoid robotics, AI aesthetics, and soaring melodic techno soundscapes across global stadiums.',
    avatar: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    country: 'United States',
    city: 'New York / Milan',
    monthlyListeners: '14.8M',
    status: 'active',
    verified: true,
    totalConcerts: 34,
    upcomingConcerts: 6,
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/anyma',
      instagram: 'https://instagram.com/anyma_ofc',
      youtube: 'https://youtube.com/@anyma',
      appleMusic: 'https://music.apple.com/artist/anyma'
    },
    management: {
      managerName: 'Alessio DeVecchi',
      agency: 'Wasserman Music Global',
      email: 'booking@afterlife.com',
      phone: '+1 (310) 867-4200'
    },
    rider: {
      microphonePreference: 'Shure Axient Digital Dual Handheld (Custom Black)',
      inEarMonitors: 'JH Audio Roxanne Custom Fit IEMs',
      hospitalityNotes: 'Organic vegan catering, fresh ginger-lemon infusion, dark roast Italian espresso, zero single-use plastic',
      stagePlotNotes: 'Center stage riser for synth & Ableton Push 3 rig, 8k LED wall sync triggers via SMPTE timecode'
    }
  },
  {
    id: 'art-002',
    name: 'Arijit Singh',
    stageName: 'Arijit Singh Live',
    genre: 'Bollywood',
    subGenres: ['Playback', 'Sufi Rock', 'Acoustic Soul', 'Classical Fusion'],
    bio: 'India’s most streamed vocalist and legendary soul singer renowned for captivating arena performances with a 35-piece live grand orchestra.',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    country: 'India',
    city: 'Mumbai',
    monthlyListeners: '43.2M',
    status: 'active',
    verified: true,
    totalConcerts: 52,
    upcomingConcerts: 8,
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/arijitsingh',
      instagram: 'https://instagram.com/arijitsingh',
      youtube: 'https://youtube.com/@arijitsinghofficial'
    },
    management: {
      managerName: 'Tarsame Mittal',
      agency: 'TM Talent Management',
      email: 'arijit@tmtalent.in',
      phone: '+91 98200 45890'
    },
    rider: {
      microphonePreference: 'Neumann KMS 105 Condenser Microphone',
      inEarMonitors: 'Sennheiser 2000 Series Wireless IEM',
      hospitalityNotes: 'Warm honey-lemon water, herbal green tea, private quiet greenroom with acoustic tuning',
      stagePlotNotes: 'Full symphonic stage layout, grand piano stage left, 12 string section risers stage right'
    }
  },
  {
    id: 'art-003',
    name: 'Coldplay',
    stageName: 'Coldplay (Chris, Jonny, Guy, Will)',
    genre: 'Rock',
    subGenres: ['Alternative Rock', 'Stadium Anthems', 'Pop Rock'],
    bio: 'One of the best-selling music acts in history, delivering breathtaking eco-powered stadium experiences with synced LED wristbands and kinetic floors.',
    avatar: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    city: 'London',
    monthlyListeners: '86.4M',
    status: 'active',
    verified: true,
    totalConcerts: 110,
    upcomingConcerts: 14,
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/coldplay',
      instagram: 'https://instagram.com/coldplay',
      youtube: 'https://youtube.com/@coldplay',
      appleMusic: 'https://music.apple.com/artist/coldplay'
    },
    management: {
      managerName: 'Phil Harvey & Dave Holmes',
      agency: 'WME Touring',
      email: 'coldplaytour@wmeagency.com',
      phone: '+44 20 7534 6000'
    },
    rider: {
      microphonePreference: 'Sennheiser Digital 6000 with custom rainbow foam',
      inEarMonitors: 'Ultimate Ears Pro 18+ Custom IEMs',
      hospitalityNotes: '100% sustainable catering, solar battery charging stations, zero single-use plastics',
      stagePlotNotes: 'Kinetic energy dance floors, confetti cannons (biodegradable), XYLO wristband RF transmitter towers'
    }
  },
  {
    id: 'art-004',
    name: 'Diljit Dosanjh',
    stageName: 'Dil-Luminati Tour',
    genre: 'Punjabi',
    subGenres: ['Punjabi Pop', 'Folk Fusion', 'Bhangra Hip-Hop'],
    bio: 'Global Punjabi music superstar who made history selling out iconic arenas and stadiums worldwide with high-voltage folk beats and charisma.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
    country: 'India',
    city: 'Chandigarh / Toronto',
    monthlyListeners: '24.1M',
    status: 'active',
    verified: true,
    totalConcerts: 40,
    upcomingConcerts: 10,
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/diljitdosanjh',
      instagram: 'https://instagram.com/diljitdosanjh',
      youtube: 'https://youtube.com/@diljitdosanjh'
    },
    management: {
      managerName: 'Sonali Singh',
      agency: 'Ripple Effect Studios',
      email: 'management@diljitdosanjh.com',
      phone: '+91 99100 23456'
    },
    rider: {
      microphonePreference: 'Shure KSM9 Wireless Handheld (Gold Plated)',
      inEarMonitors: 'Westone ES60 Custom Monitors',
      hospitalityNotes: 'Almond milk lattes, dry fruit platters, fresh Punjabi kulhad chai',
      stagePlotNotes: 'Center runway thrust 25 meters into stadium crowd, CO2 jets & flame cannons'
    }
  },
  {
    id: 'art-005',
    name: 'Martin Garrix',
    stageName: 'Martin Garrix Live',
    genre: 'EDM',
    subGenres: ['Progressive House', 'Big Room', 'Festival Anthem'],
    bio: 'World #1 DJ and Dutch electronic producer known for explosive festival headlining sets, lasers, pyrotechnics, and uplifting progressive melodies.',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    country: 'Netherlands',
    city: 'Amsterdam',
    monthlyListeners: '32.6M',
    status: 'active',
    verified: true,
    totalConcerts: 65,
    upcomingConcerts: 5,
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/martingarrix',
      instagram: 'https://instagram.com/martingarrix',
      youtube: 'https://youtube.com/@martingarrix'
    },
    management: {
      managerName: 'Scooter Braun & Watse de Jong',
      agency: 'STMPD RCRDS / CAA',
      email: 'info@stmpdrcrds.com',
      phone: '+31 20 540 1200'
    },
    rider: {
      microphonePreference: 'Shure SM58 Wireless DJ Mic',
      inEarMonitors: 'Custom Audio 64 Ears',
      hospitalityNotes: 'Red Bull Sugarfree, electrolyte sports beverages, post-show pizza delivery',
      stagePlotNotes: 'Pioneer CDJ-3000 (x4) + DJM-V10 Mixer setup, synchronized laser array'
    }
  },
  {
    id: 'art-006',
    name: 'Prateek Kuhad',
    stageName: 'Prateek Kuhad (Solo Acoustic)',
    genre: 'Indie',
    subGenres: ['Indie Folk', 'Acoustic Ballads', 'Singer-Songwriter'],
    bio: 'Critically acclaimed indie-folk troubadour whose intimate lyrical poetry and warm fingerstyle guitar melodies sell out theatres worldwide.',
    avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80',
    country: 'India',
    city: 'Jaipur / New Delhi',
    monthlyListeners: '4.8M',
    status: 'active',
    verified: true,
    totalConcerts: 28,
    upcomingConcerts: 2,
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/prateekkuhad',
      instagram: 'https://instagram.com/prateekkuhad',
      youtube: 'https://youtube.com/@prateekkuhadmusic'
    },
    management: {
      managerName: 'Dhruv Singh',
      agency: 'Pagla World Talent',
      email: 'contact@prateekkuhad.com',
      phone: '+91 98110 98765'
    },
    rider: {
      microphonePreference: 'DPA d:facto II Vocal Microphone',
      inEarMonitors: 'Sensaphonics 2MAX Custom Fit',
      hospitalityNotes: 'Sparkling mineral water, assorted fresh berries, warm steam inhaler',
      stagePlotNotes: 'Vintage parlor carpet, warm filament warm tungsten floor lighting, acoustic DI box setup'
    }
  }
];

export const mockVendorTrips: TripPlan[] = [
  {
    id: 'v-trip-101',
    title: 'Sunwave Beach Festival & Coastal Trail Expedition',
    creatorName: 'Zenith Touring & Expeditions',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorBio: 'Curated by Zenith Touring — connecting music festivals with scenic coastal camping and carpooling.',
    origin: 'Mumbai (BKC Hub)',
    destination: 'Goa (Vagator & Anjuna)',
    startDate: '2026-11-18',
    endDate: '2026-11-23',
    totalDays: 5,
    estimatedBudget: 8500,
    currency: 'INR',
    category: 'Music Tour',
    maxTravelers: 12,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    joinedTravelers: [
      { id: 'usr-101', name: 'Kabir Singhania', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', joinedAt: 'Lead Host', seatsBooked: 1 },
      { id: 'usr-102', name: 'Rhea Sen', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', joinedAt: '2 days ago', seatsBooked: 2 },
      { id: 'usr-103', name: 'Devendra Joshi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', joinedAt: 'Yesterday', seatsBooked: 1 }
    ],
    waypoints: ['Mumbai BKC', 'Pune Expressway', 'Kolhapur Heritage Stop', 'Amona Ghats', 'North Goa Vagator Arena'],
    status: 'active',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Mumbai to Kolhapur Escort Run',
        destination: 'Kolhapur',
        description: 'Morning rendezvous at BKC concert hub, group convoy drive with curated audio playlist and lunch stop.',
        highlights: ['Expressway convoy', 'Maharaja Palace visit', 'Regional misal brunch']
      },
      {
        dayNumber: 2,
        title: 'Western Ghats Descent into Goa',
        destination: 'Vagator, Goa',
        description: 'Scenic hill driving through lush Amboli/Chorla passes, campsite check-in and sunset acoustic session.',
        highlights: ['Ghats photography stop', 'Campsite check-in', 'Sunset sundowner']
      },
      {
        dayNumber: 3,
        title: 'Festival Stage Day & Backstage Access',
        destination: 'Sunwave Festival Arena',
        description: 'Full day admission to partner stage festivals with reserved partner viewing deck and lineup meet & greet.',
        highlights: ['Exclusive festival lounge', 'Artist soundcheck preview', 'Headliner set']
      }
    ]
  },
  {
    id: 'v-trip-102',
    title: 'Himalayan High Altitude Stargazing & Acoustic Camp',
    creatorName: 'Zenith Live Touring',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorBio: 'Wilderness expeditions team combining acoustic indie sessions under Milky Way skies.',
    origin: 'New Delhi (Aerocity)',
    destination: 'Spiti Valley & Chandratal Lake',
    startDate: '2026-12-05',
    endDate: '2026-12-12',
    totalDays: 7,
    estimatedBudget: 18500,
    currency: 'INR',
    category: 'Nature & Trek',
    maxTravelers: 8,
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    joinedTravelers: [
      { id: 'usr-201', name: 'Vikramaditya Singhania', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', joinedAt: 'Tour Host', seatsBooked: 1 },
      { id: 'usr-202', name: 'Aarav Mehta', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', joinedAt: '3 days ago', seatsBooked: 1 }
    ],
    waypoints: ['Delhi Aerocity', 'Chandigarh', 'Shimla', 'Kaza High Pass', 'Chandratal Lake Base'],
    status: 'active',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Delhi to Chandigarh Rendezvous',
        destination: 'Chandigarh',
        description: 'Meet travelers at Aerocity hub, transit up to foothills.',
        highlights: ['Comfort luxury coach', 'Welcome briefing']
      },
      {
        dayNumber: 2,
        title: 'Kinnaur Valley Ascent',
        destination: 'Kalpa',
        description: 'Drive along Satluj river canyon, view Kinner Kailash peak.',
        highlights: ['Apple orchard drive', 'Monastery tour']
      }
    ]
  },
  {
    id: 'v-trip-103',
    title: 'Rajasthan Royal Forts & Sufi Night Expedition',
    creatorName: 'Zenith Live Touring',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorBio: 'Cultural journeys discovering palace courtyards and private desert performances.',
    origin: 'Jaipur',
    destination: 'Jaisalmer & Sam Sand Dunes',
    startDate: '2026-12-22',
    endDate: '2026-12-27',
    totalDays: 6,
    estimatedBudget: 14200,
    currency: 'INR',
    category: 'Weekend Escape',
    maxTravelers: 10,
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
    joinedTravelers: [
      { id: 'usr-301', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', joinedAt: 'Curator', seatsBooked: 1 }
    ],
    waypoints: ['Jaipur Pink City', 'Jodhpur Blue City', 'Pokhran', 'Jaisalmer Golden Fort', 'Sam Dunes'],
    status: 'upcoming',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Jaipur & Folk Dinner',
        destination: 'Jaipur',
        description: 'Evening meet up at heritage haveli with traditional musicians.',
        highlights: ['Heritage haveli stay', 'Rajasthani cuisine banquet']
      }
    ]
  }
];

export const mockVendorStrangerMeets: StrangerMeet[] = [
  {
    id: 'v-meet-201',
    title: 'Electronic Music Producers & Sound Engineers Mixer',
    description: 'An exclusive networking evening for sound designers, modular synth hobbyists, audio engineers and EDM promoters to share tracks and collaborate on stadium sound rigs.',
    hostName: 'Zenith Live Studio',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hostRating: 4.95,
    hostVerified: true,
    category: 'Music & Nightlife',
    city: 'Mumbai',
    meetingPoint: 'Zenith Studio Terrace, Bandra West, Mumbai',
    meetDate: '2026-11-10',
    meetTime: '19:30 - 22:30',
    maxParticipants: 16,
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    pricePerPerson: 499,
    currency: 'INR',
    status: 'upcoming',
    vibeTags: ['Synth Wave', 'Ableton & Logic', 'Audio Networking', 'Rooftop Mixer'],
    safetyGuidelines: [
      'Govt photo ID verification compulsory upon arrival',
      'Zero alcohol driving policy — carpooling cabs facilitated',
      'Code of conduct enforced by verified community coordinators'
    ],
    participants: [
      {
        id: 'bp-1',
        name: 'Armaan Kulkarni',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        age: 26,
        gender: 'Male',
        city: 'Mumbai',
        bio: 'Analog modular synth producer and mastering assistant at Bandra Studios.',
        verifiedKYC: true,
        interests: ['Electronic Music', 'Modular Synths', 'Sound Design'],
        joinedAt: '3 days ago',
        status: 'confirmed',
        socialScore: 98
      },
      {
        id: 'bp-2',
        name: 'Neha Chawla',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        age: 24,
        gender: 'Female',
        city: 'Mumbai',
        bio: 'Live acoustic vocalist and indie electronic lyricist.',
        verifiedKYC: true,
        interests: ['Vocals', 'Live Gigs', 'Songwriting'],
        joinedAt: '2 days ago',
        status: 'confirmed',
        socialScore: 96
      },
      {
        id: 'bp-3',
        name: 'Siddharth Rao',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        age: 29,
        gender: 'Male',
        city: 'Pune',
        bio: 'FOH sound engineer for outdoor rock & jazz festivals.',
        verifiedKYC: true,
        interests: ['Line Arrays', 'Audio Acoustics', 'Festivals'],
        joinedAt: 'Yesterday',
        status: 'confirmed',
        socialScore: 99
      }
    ]
  },
  {
    id: 'v-meet-202',
    title: 'Weekend Sunset Rooftop Acoustic Jam & Coffee Mixer',
    description: 'Bring your acoustic guitar, cajón, ukulele or simply your love for acoustic indie ballads. An intimate weekend gathering overlooking the Arabian Sea.',
    hostName: 'Zenith Acoustic Club',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hostRating: 4.9,
    hostVerified: true,
    category: 'Coffee & Chill',
    city: 'Mumbai',
    meetingPoint: 'Carter Road Promenade Amphitheater, Bandra West',
    meetDate: '2026-11-15',
    meetTime: '17:00 - 19:30',
    maxParticipants: 20,
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    pricePerPerson: 299,
    currency: 'INR',
    status: 'active',
    vibeTags: ['Acoustic Jam', 'Coffee & Tea', 'Sunset Vibe', 'Songwriters'],
    safetyGuidelines: [
      'Pre-vetted registration via WayFor stranger meet pass',
      'Peaceful acoustic decibel limits respected',
      'Verified promoter hosts on site throughout the session'
    ],
    participants: [
      {
        id: 'bp-4',
        name: 'Rohan Deshmukh',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        age: 28,
        gender: 'Male',
        city: 'Mumbai',
        bio: 'Fingerstyle guitarist and coffee roaster enthusiast.',
        verifiedKYC: true,
        interests: ['Fingerstyle', 'Cold Brew', 'Indie Folk'],
        joinedAt: '4 days ago',
        status: 'confirmed',
        socialScore: 97
      },
      {
        id: 'bp-5',
        name: 'Tanvi Parikh',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        age: 25,
        gender: 'Female',
        city: 'Mumbai',
        bio: 'Ukulele player and weekend wanderer.',
        verifiedKYC: true,
        interests: ['Ukulele', 'Travel Stories', 'Photography'],
        joinedAt: '3 days ago',
        status: 'confirmed',
        socialScore: 95
      }
    ]
  },
  {
    id: 'v-meet-203',
    title: 'Indie Film & Travel Storytelling Circle',
    description: 'Share your unscripted travel stories, roadtrip memories, and meet fellow backpackers over warm artisanal chai and bonfire snacks.',
    hostName: 'Zenith Community Desk',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    hostRating: 4.88,
    hostVerified: true,
    category: 'City Walk & Food',
    city: 'Bengaluru',
    meetingPoint: 'Indiranagar Creative Studio, 100ft Road, Bengaluru',
    meetDate: '2026-11-25',
    meetTime: '18:00 - 21:00',
    maxParticipants: 14,
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    pricePerPerson: 350,
    currency: 'INR',
    status: 'upcoming',
    vibeTags: ['Travel Stories', 'Chai & Snacks', 'Filmmakers', 'Icebreakers'],
    safetyGuidelines: [
      'Strict verification of all attendees',
      'Respectful and inclusive group discussion etiquette'
    ],
    participants: []
  }
];
