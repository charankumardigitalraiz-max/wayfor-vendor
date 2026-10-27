import type {
  ConcertEvent,
  AttendeeBooking,
  GateScanLog,
  Venue,
  PayoutTransaction,
  VendorProfile,
  Artist
} from '../types';

export const mockVendorProfile: VendorProfile = {
  id: 'vnd-801',
  name: 'Vikramaditya Singhania',
  companyName: 'Zenith Live Touring & Entertainment',
  email: 'vikram@zenithentertainment.in',
  phone: '+91 98450 82910',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  gstNumber: '36AAACZ8912P1ZV',
  bankName: 'HDFC Bank Ltd - Corporate Banking',
  bankAccountNumber: '50200084918231',
  ifscCode: 'HDFC0000240',
  isVerified: true,
  rating: 4.9,
  totalConcertsHosted: 28,
  totalTicketsSold: 184500
};

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
    status: 'active'
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
    status: 'active'
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
    status: 'active'
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
    status: 'active'
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
    status: 'active'
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
    status: 'touring',
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
    status: 'touring',
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
    status: 'touring',
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
    status: 'touring',
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
    status: 'available',
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


