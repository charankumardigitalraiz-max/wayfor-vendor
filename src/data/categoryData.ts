export type DynamicFieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date' 
  | 'time' 
  | 'datetime';

export interface DynamicFormField {
  id: string;
  label: string;
  name: string; // field key / slug
  type: DynamicFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select dropdowns or radio
  defaultValue?: string | boolean | number;
  helpText?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentCategoryId?: string | null;
  status: 'active' | 'inactive';
  eventsCount: number;
  createdDate: string;
  customFields?: DynamicFormField[];
}

export const initialCategories: EventCategory[] = [
  {
    id: 'cat-bollywood',
    name: 'Bollywood & Punjabi Live Concerts',
    slug: 'bollywood-punjabi-concerts',
    description: 'High-energy arena tours, playback singer showcases, bhangra nights, and Bollywood star live musical gigs across metro cities.',
    imageUrl: '',
    parentCategoryId: null,
    status: 'active',
    eventsCount: 42,
    createdDate: '2026-08-14',
    customFields: [
      {
        id: 'f-1',
        label: 'Music Genre',
        name: 'genre',
        type: 'select',
        options: ['Bollywood Playback', 'Punjabi Pop', 'Sufi & Ghazal', 'Indie Hindi', 'Fusion Classical'],
        required: true,
        placeholder: 'Select genre',
        helpText: 'Primary Indian music genre classification'
      },
      {
        id: 'f-2',
        label: 'Lead Artists / Singers',
        name: 'lead_artists',
        type: 'textarea',
        required: true,
        placeholder: 'e.g. Arijit Singh, Diljit Dosanjh, Shreya Ghoshal, AP Dhillon',
        helpText: 'Featured headline performers for the event'
      },
      {
        id: 'f-3',
        label: 'Seating Layout Type',
        name: 'seating_layout',
        type: 'radio',
        options: ['Seated Only', 'Standing Pit Only', 'Hybrid (Seated + Fan Pit)'],
        required: true
      },
      {
        id: 'f-4',
        label: 'Age Restriction',
        name: 'age_limit',
        type: 'select',
        options: ['Family Friendly (All Ages)', '5+ Years Required', '18+ Adults Only'],
        required: false
      }
    ]
  },
  {
    id: 'cat-standup',
    name: 'Standup Comedy & Open Mics',
    slug: 'standup-comedy-india',
    description: 'Live stand-up comedy specials, improv theatre, regional laughter tours, and comedy club open mic nights.',
    imageUrl: '',
    parentCategoryId: null,
    status: 'active',
    eventsCount: 35,
    createdDate: '2026-09-02',
    customFields: [
      {
        id: 'f-5',
        label: 'Show Language',
        name: 'show_language',
        type: 'select',
        options: ['Hindi', 'English', 'Hinglish', 'Tamil', 'Telugu', 'Kannada', 'Marathi'],
        required: true,
        placeholder: 'Select primary language'
      },
      {
        id: 'f-6',
        label: 'Comedian / Performer Name',
        name: 'comedian_name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Zakir Khan, Bassi, Samay Raina, Vir Das'
      },
      {
        id: 'f-7',
        label: 'Strict 18+ Mature Content',
        name: 'adult_content',
        type: 'checkbox',
        required: false,
        placeholder: 'Check if show contains adult themes/profanity'
      }
    ]
  },
  {
    id: 'cat-festivals',
    name: 'Cultural Festivals, Dandiya & Holi Bashes',
    slug: 'festivals-dandiya-holi',
    description: 'Festive celebrations including Navratri Dandiya Raas, Holi music fests, Diwali Melas, and Durga Puja cultural carnivals.',
    imageUrl: '',
    parentCategoryId: null,
    status: 'active',
    eventsCount: 28,
    createdDate: '2026-09-15',
    customFields: [
      {
        id: 'f-8',
        label: 'Festival Type',
        name: 'festival_type',
        type: 'select',
        options: ['Navratri Dandiya & Garba', 'Holi Rangotsav & Color Fest', 'Diwali Mela', 'Regional Harvest Fair'],
        required: true
      },
      {
        id: 'f-9',
        label: 'Traditional Dress Code Mandatory',
        name: 'dress_code',
        type: 'checkbox',
        required: false,
        placeholder: 'Check if ethnic attire is mandatory for entry'
      },
      {
        id: 'f-10',
        label: 'Food & Beverage Stalls Permitted',
        name: 'fnb_stalls',
        type: 'select',
        options: ['Pure Vegetarian Only', 'Multi-Cuisine Stalls', 'No External Stalls'],
        required: true
      }
    ]
  },
  {
    id: 'cat-musicfests',
    name: 'Multi-Day Music Fests & EDM Arenas',
    slug: 'music-festivals-edm',
    description: 'Multi-stage open air weekend festivals, EDM DJ concerts, Sunburn arena gigs, and NH7 Weekender indie gatherings.',
    imageUrl: '',
    parentCategoryId: null,
    status: 'active',
    eventsCount: 19,
    createdDate: '2026-09-28',
    customFields: [
      {
        id: 'f-11',
        label: 'Festival Edition / Tour Name',
        name: 'tour_name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Sunburn Goa, NH7 Weekender, Zomaland'
      },
      {
        id: 'f-12',
        label: 'Camping & Tent Accommodation Available',
        name: 'camping_available',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'cat-theatre',
    name: 'Theatre, Classical Dance & Natak',
    slug: 'theatre-classical-dance',
    description: 'Traditional Indian natak, Broadway style musicals, Bharatanatyam, Kathak recitals, and modern dramatic arts.',
    imageUrl: '',
    parentCategoryId: null,
    status: 'active',
    eventsCount: 16,
    createdDate: '2026-10-05',
    customFields: [
      {
        id: 'f-13',
        label: 'Art Form',
        name: 'art_form',
        type: 'select',
        options: ['Stage Play / Natak', 'Classical Indian Dance', 'Instrumental Jugalbandi', 'Musical Drama'],
        required: true
      },
      {
        id: 'f-14',
        label: 'Intermission Duration (Minutes)',
        name: 'intermission_minutes',
        type: 'number',
        required: false,
        placeholder: '15'
      }
    ]
  },
  {
    id: 'cat-techsummits',
    name: 'Corporate Summits & Tech Expos',
    slug: 'tech-summits-expos',
    description: 'Bengaluru & Gurgaon tech conferences, venture capital summits, startup demo days, and AI hackathons.',
    imageUrl: '',
    parentCategoryId: null,
    status: 'active',
    eventsCount: 22,
    createdDate: '2026-10-18',
    customFields: [
      {
        id: 'f-15',
        label: 'Target Audience Domain',
        name: 'industry_domain',
        type: 'select',
        options: ['SaaS & Cloud', 'Fintech & Banking', 'AI & Machine Learning', 'E-commerce & Retail', 'Healthcare Tech'],
        required: true
      },
      {
        id: 'f-16',
        label: 'Delegate Certificate Provided',
        name: 'certificate_provided',
        type: 'checkbox',
        required: false
      }
    ]
  }
];
