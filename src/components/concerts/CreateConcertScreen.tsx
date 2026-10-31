import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Music,
  DollarSign,
  Ticket,
  Plus,
  Trash2,
  Upload,
  X,
  Check,
  Globe,
  Hourglass,
  Building,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronDown,
  Search,
  Video,
  Play,
  Image as ImageIcon,
  Film,
  Mic2,
  Smile,
  Wand2,
  Theater,
  Radio,
  RefreshCw
} from 'lucide-react';
import type { ConcertEvent, TicketTier, Venue, Artist } from '../../types';
import { mockVenues, mockArtists } from '../../data/mockVendorData';
import { AddVenueModal } from '../common/AddVenueModal';
import { CreateArtistModal } from '../common/CreateArtistModal';
import { CustomDatePicker } from '../common/CustomDatePicker';

interface CreateConcertScreenProps {
  onAddConcert: (concert: Omit<ConcertEvent, 'id' | 'ticketsSold' | 'connectedRidesCount'>) => void | Promise<void>;
  onUpdateConcert?: (id: string, updates: Partial<ConcertEvent>) => void | Promise<void>;
  concerts?: ConcertEvent[];
  venues?: Venue[];
  onAddVenue?: (venue: Venue) => void;
  artists?: Artist[];
  onAddArtist?: (artist: Omit<Artist, 'id'>) => void;
  onShowToast?: (message: string, type?: 'info' | 'success' | 'error') => void;
}

export type EventCategoryType =
  | 'music'
  | 'comedy'
  | 'dance'
  | 'theatre'
  | 'dj-electronic'
  | 'magic-variety';

export interface EventCategoryConfig {
  id: EventCategoryType;
  name: string;
  shortName: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  titleLabel: string;
  titlePlaceholder: string;
  performerLabel: string;
  performerPlaceholder: string;
  lineupLabel: string;
  lineupPlaceholder: string;
  genreLabel: string;
  genrePlaceholder: string;
  genres: string[];
  defaultGenre: string;
  defaultAge: string;
  defaultDuration: string;
  presetPosters: { genre: string; label: string; url: string }[];
}

export const EVENT_CATEGORIES: Record<EventCategoryType, EventCategoryConfig> = {
  music: {
    id: 'music',
    name: 'Live Music & Concert',
    shortName: 'Music Concert',
    tagline: 'Live bands, vocalists & orchestral tours',
    icon: Music,
    titleLabel: 'Concert / Tour Title',
    titlePlaceholder: 'e.g. Neon Odyssey: World Electronic Symphony 2026',
    performerLabel: 'Headlining Artist / Band',
    performerPlaceholder: 'Search roster or enter artist / band name...',
    lineupLabel: 'Supporting Acts & Opening Bands',
    lineupPlaceholder: 'e.g. Kevin de Vries, Argy, Massano, Cassian',
    genreLabel: 'Music Genre Classification',
    genrePlaceholder: 'Search music genres (e.g. Rock, Techno, Pop)...',
    genres: [
      'EDM',
      'Rock',
      'Pop',
      'Hip-Hop',
      'Indie',
      'Classical',
      'Jazz',
      'Techno',
      'House',
      'Bollywood',
      'Sufi',
      'Acoustic',
      'Folk',
      'Metal'
    ],
    defaultGenre: 'EDM',
    defaultAge: '16+ (Valid ID Required)',
    defaultDuration: '3.5 Hours',
    presetPosters: [
      {
        genre: 'EDM',
        label: 'Festival Laser Arena',
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Rock',
        label: 'Stadium Rock Crowd',
        url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Pop',
        label: 'Neon Stage Lights',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Hip-Hop',
        label: 'Underground Soundstage',
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Indie',
        label: 'Golden Hour Acoustics',
        url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&auto=format&fit=crop&q=80'
      }
    ]
  },
  comedy: {
    id: 'comedy',
    name: 'Standup Comedy & Funny Show',
    shortName: 'Standup Comedy',
    tagline: 'Stand-up specials, improv & funny roasts',
    icon: Smile,
    titleLabel: 'Comedy Show / Special Title',
    titlePlaceholder: 'e.g. Bassi Live: Kisi Ko Batana Mat, Zakir Khan India Tour',
    performerLabel: 'Lead Comedian / Host',
    performerPlaceholder: 'e.g. Anubhav Singh Bassi, Zakir Khan, Vir Das...',
    lineupLabel: 'Opening Acts & Guest Comics',
    lineupPlaceholder: 'e.g. Abhishek Upamanyu, Gaurav Kapoor, Rahul Subramanian',
    genreLabel: 'Comedy Style & Format',
    genrePlaceholder: 'Search styles (e.g. Stand-up, Roast, Improv)...',
    genres: [
      'Stand-up',
      'Observational Comedy',
      'Crowd Work Special',
      'Roast & Banter',
      'Improv & Comedy Jam',
      'Storytelling',
      'Dark Comedy',
      'Musical Comedy',
      'Sketch & Parody'
    ],
    defaultGenre: 'Stand-up',
    defaultAge: '18+ (Mature Audience / Language Warning)',
    defaultDuration: '2.0 Hours',
    presetPosters: [
      {
        genre: 'Comedy',
        label: 'Comedy Club Spotlight',
        url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Comedy',
        label: 'Vintage Live Stage Mic',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Comedy',
        label: 'Auditorium Laughs',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80'
      }
    ]
  },
  dance: {
    id: 'dance',
    name: 'Dance Show & Choreography',
    shortName: 'Dance Performance',
    tagline: 'Classical, contemporary & street dance tours',
    icon: Sparkles,
    titleLabel: 'Dance Production / Showcase Title',
    titlePlaceholder: 'e.g. Rhythm of Passion: Contemporary Dance Tour 2026',
    performerLabel: 'Lead Troupe / Choreographer / Dancer',
    performerPlaceholder: 'e.g. Kings United, Shiamak Davar Troupe, Terence Lewis Co...',
    lineupLabel: 'Featured Dance Troupes & Ensembles',
    lineupPlaceholder: 'e.g. Urban Hip-Hop Crew, Contemporary Soloists',
    genreLabel: 'Dance Form & Style',
    genrePlaceholder: 'Search dance styles (e.g. Hip-Hop, Classical, Salsa)...',
    genres: [
      'Classical / Kathak',
      'Bharatanatyam',
      'Contemporary',
      'Hip-Hop / Street Battle',
      'Salsa / Latin',
      'Ballet & Neoclassical',
      'Folk / Garba / Bhangra',
      'Jazz & Modern',
      'Bollywood Choreography'
    ],
    defaultGenre: 'Contemporary',
    defaultAge: 'Open for All Ages (Family Friendly)',
    defaultDuration: '2.5 Hours',
    presetPosters: [
      {
        genre: 'Dance',
        label: 'Dynamic Dance Stage',
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Dance',
        label: 'Spotlight Choreography',
        url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Dance',
        label: 'Contemporary Motion',
        url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&auto=format&fit=crop&q=80'
      }
    ]
  },
  theatre: {
    id: 'theatre',
    name: 'Theatre, Drama & Acting',
    shortName: 'Theatre & Drama',
    tagline: 'Live plays, dramatic acts, musicals & street drama',
    icon: Theater,
    titleLabel: 'Play / Drama Production Title',
    titlePlaceholder: 'e.g. Mughal-e-Azam: The Grand Musical, A Doll\'s House',
    performerLabel: 'Theatre Troupe / Director / Star Lead',
    performerPlaceholder: 'e.g. Motley Productions, National School of Drama...',
    lineupLabel: 'Star Cast & Ensemble Actors',
    lineupPlaceholder: 'e.g. Naseeruddin Shah, Ratna Pathak Shah, Paresh Rawal',
    genreLabel: 'Play Genre & Theatrical Style',
    genrePlaceholder: 'Search styles (e.g. Drama, Satire, Musical)...',
    genres: [
      'Dramatic Play',
      'Satire & Comedy',
      'Historical / Epic',
      'Musical Theatre',
      'Tragedy',
      'Suspense & Crime Thriller',
      'Experimental / Monologue',
      'Street Play / Nukkad Natak'
    ],
    defaultGenre: 'Dramatic Play',
    defaultAge: '12+ (Parental Guidance Recommended)',
    defaultDuration: '2.5 Hours',
    presetPosters: [
      {
        genre: 'Theatre',
        label: 'Velvet Proscenium Stage',
        url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Theatre',
        label: 'Dramatic Stage Illumination',
        url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Theatre',
        label: 'Classic Theatre Auditorium',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80'
      }
    ]
  },
  'dj-electronic': {
    id: 'dj-electronic',
    name: 'DJ Night & EDM Festival',
    shortName: 'DJ Night & Club',
    tagline: 'Club raves, poolside beats & electronic mainstages',
    icon: Radio,
    titleLabel: 'DJ Night / Festival Title',
    titlePlaceholder: 'e.g. Sunburn Arena: Afterlife Melodic Techno Night',
    performerLabel: 'Headlining DJ / Electronic Producer',
    performerPlaceholder: 'e.g. Martin Garrix, Anyma, Tale Of Us, DJ Chetas...',
    lineupLabel: 'Warm-Up & Resident Lineup',
    lineupPlaceholder: 'e.g. Lost Stories, Zaeden, Nucleya, Sickflip',
    genreLabel: 'Electronic Sub-genres',
    genrePlaceholder: 'Search electronic genres (e.g. Techno, Psytrance)...',
    genres: [
      'Melodic Techno',
      'Deep House',
      'Tech House',
      'Psytrance & Goa',
      'Big Room / Mainstage EDM',
      'Bass & Dubstep',
      'Drum & Bass',
      'Hardstyle',
      'Afro House / Amapiano'
    ],
    defaultGenre: 'Melodic Techno',
    defaultAge: '21+ (Government Photo ID Mandatory)',
    defaultDuration: '5.0 Hours',
    presetPosters: [
      {
        genre: 'DJ Night',
        label: 'Festival Laser Arena',
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'DJ Night',
        label: 'Underground Club Vibe',
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'DJ Night',
        label: 'Massive Neon Mainstage',
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=900&auto=format&fit=crop&q=80'
      }
    ]
  },
  'magic-variety': {
    id: 'magic-variety',
    name: 'Magic, Illusion & Variety',
    shortName: 'Magic & Illusion',
    tagline: 'Mentalism, grand stage illusions, hypnosis & acrobatics',
    icon: Wand2,
    titleLabel: 'Illusion / Variety Show Title',
    titlePlaceholder: 'e.g. Beyond Reality: The Mentalist World Tour 2026',
    performerLabel: 'Performers',
    performerPlaceholder: 'e.g. Karan Singh Magic, Suhani Shah, PC Sorcar...',
    lineupLabel: 'Guest Performers & Stage Assistants',
    lineupPlaceholder: 'e.g. Special Guest Acrobat, Mentalist Assistant',
    genreLabel: 'Act Type & Variety Format',
    genrePlaceholder: 'Search formats (e.g. Mentalism, Grand Illusion)...',
    genres: [
      'Mentalism & Mind Reading',
      'Grand Stage Illusions',
      'Close-Up Sleight of Hand',
      'Hypnosis & Suggestion',
      'Escapology & Danger Stunts',
      'Comedy Magic',
      'Circus & Aerial Acrobatics'
    ],
    defaultGenre: 'Mentalism & Mind Reading',
    defaultAge: 'All Ages Welcome (Family Friendly)',
    defaultDuration: '2.0 Hours',
    presetPosters: [
      {
        genre: 'Magic',
        label: 'Mystic Stage Lights',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Magic',
        label: 'Grand Illusion Hall',
        url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=900&auto=format&fit=crop&q=80'
      },
      {
        genre: 'Magic',
        label: 'Dramatic Spotlights',
        url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&auto=format&fit=crop&q=80'
      }
    ]
  }
};

export const CATEGORY_LIST = Object.values(EVENT_CATEGORIES);

const AVAILABLE_LANGUAGES = [
  'Hindi',
  'English',
  'Punjabi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Bhojpuri',
  'Urdu',
  'Assamese',
  'Odia',
  'Rajasthani',
  'Haryanvi',
  'Konkani',
  'Instrumental'
];

const STANDARD_AGE_PRESETS = [
  'All Ages (Kids under 12 accompanied by adult)',
  'Open for All Ages (Family Friendly)',
  '12+ (Parental Guidance Recommended)',
  '16+ (Valid Govt ID Required)',
  '18+ (Adults Only · Photo ID Mandatory)',
  '21+ (Full Access Pass)'
];

const DEFAULT_GENRES = EVENT_CATEGORIES.music.genres;
const PRESET_POSTERS = EVENT_CATEGORIES.music.presetPosters;

const SAMPLE_GALLERY_PRESETS = [
  { label: 'Stage Lights', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80' },
  { label: 'Arena Crowd Wave', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&auto=format&fit=crop&q=80' },
  { label: 'Laser Show FX', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80' },
  { label: 'VIP Lounge Deck', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80' },
  { label: 'Backstage Console', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=80' }
];

export const CreateConcertScreen: React.FC<CreateConcertScreenProps> = ({
  onAddConcert,
  onUpdateConcert,
  concerts,
  venues,
  onAddVenue,
  artists,
  onAddArtist,
  onShowToast
}) => {
  const navigate = useNavigate();
  const { concertId } = useParams<{ concertId: string }>();

  const existingConcert = useMemo(() => {
    if (!concertId || !concerts) return undefined;
    return concerts.find((c) => c.id === concertId);
  }, [concertId, concerts]);

  const isEditMode = Boolean(existingConcert);

  // Venues State & Global Add Modal
  const [venueList, setVenueList] = useState<Venue[]>(() => {
    return (venues && venues.length > 0) ? venues : mockVenues;
  });
  const [isAddVenueOpen, setIsAddVenueOpen] = useState(false);
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);
  const [venueSearch, setVenueSearch] = useState('');
  const venueDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (venues && venues.length > 0) {
      setVenueList(venues);
    }
  }, [venues]);

  // Artists State, Searchable Combobox & Global Add Modal
  const [artistList, setArtistList] = useState<Artist[]>(() => {
    return (artists && artists.length > 0) ? artists : mockArtists;
  });
  const [isArtistDropdownOpen, setIsArtistDropdownOpen] = useState(false);
  const [artistSearch, setArtistSearch] = useState('');
  const [isCreateArtistOpen, setIsCreateArtistOpen] = useState(false);
  const artistDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (artists && artists.length > 0) {
      setArtistList(artists);
    }
  }, [artists]);

  // Category Selection & Dynamic Adjustments
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryType>('music');
  const currentCategoryConfig = EVENT_CATEGORIES[selectedCategory];
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [isFreeEvent, setIsFreeEvent] = useState(false);

  const filteredCategories = CATEGORY_LIST.filter(c =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase().trim()) ||
    c.shortName.toLowerCase().includes(categorySearch.toLowerCase().trim()) ||
    c.tagline.toLowerCase().includes(categorySearch.toLowerCase().trim())
  );

  // Basic Details
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [supportingActs, setSupportingActs] = useState('');
  const [tourName, setTourName] = useState('');
  const [availableGenres, setAvailableGenres] = useState<string[]>(EVENT_CATEGORIES.music.genres);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([EVENT_CATEGORIES.music.defaultGenre]);
  const [genreSearch, setGenreSearch] = useState('');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  // Pre-fill state when editing an existing concert
  useEffect(() => {
    if (existingConcert) {
      setTitle(existingConcert.title || '');
      setArtist(existingConcert.artist || '');
      setSupportingActs(existingConcert.supportingActs?.join(', ') || '');
      setTourName(existingConcert.tourName || '');
      if (existingConcert.eventCategory && existingConcert.eventCategory in EVENT_CATEGORIES) {
        setSelectedCategory(existingConcert.eventCategory as EventCategoryType);
      }
      if (existingConcert.genres && existingConcert.genres.length > 0) {
        setSelectedGenres(existingConcert.genres);
      } else if (existingConcert.genre) {
        setSelectedGenres([existingConcert.genre]);
      }
      setIsFreeEvent(Boolean(existingConcert.isFree));
      setDate(existingConcert.date || '2026-12-20');
      setDoorsOpen(existingConcert.doorsOpen || '17:00');
      setShowTime(existingConcert.showTime || '19:30');
      setDurationHours(existingConcert.durationHours || '3.5 Hours');
      if (existingConcert.languages && existingConcert.languages.length > 0) {
        setSelectedLanguages(existingConcert.languages);
      }
      setAgeRestriction(existingConcert.ageRestriction || '16+ (Valid ID Required)');
      setSelectedVenue(existingConcert.venueName || existingConcert.venue || mockVenues[0].name);
      setVenueAddress(existingConcert.venueAddress || '');
      setCity(existingConcert.city || '');
      setCountry(existingConcert.country || 'India');
      setTotalCapacity(existingConcert.totalCapacity || mockVenues[0].capacity);
      setSoundSystem(existingConcert.soundSystem || mockVenues[0].soundSystem);
      setImageUrl(existingConcert.image || '');
      setGalleryImages(existingConcert.gallery || []);
      setVideoUrl(existingConcert.videoUrl || '');
      if (existingConcert.ticketTiers && existingConcert.ticketTiers.length > 0) {
        setTiers(existingConcert.ticketTiers);
      }
    }
  }, [existingConcert]);

  const handleCategoryChange = (catId: EventCategoryType) => {
    setSelectedCategory(catId);
    const cfg = EVENT_CATEGORIES[catId];
    setAvailableGenres(cfg.genres);
    setSelectedGenres([cfg.defaultGenre]);
    setAgeRestriction(cfg.defaultAge);
    setDurationHours(cfg.defaultDuration);
    // if (cfg.presetPosters && cfg.presetPosters.length > 0) {
    //   setImageUrl();
    // }
  };

  const handleFreeToggle = (free: boolean) => {
    setIsFreeEvent(free);
    if (free) {
      setTiers(prev => prev.map(t => ({ ...t, price: 0 })));
    } else {
      setTiers(prev =>
        prev.map((t, i) => ({
          ...t,
          price: t.price > 0 ? t.price : i === 0 ? 1999 : i === 1 ? 4999 : 12999
        }))
      );
    }
  };

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const [languageDropdownPlacement, setLanguageDropdownPlacement] = useState<'bottom' | 'top'>('bottom');
  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);
  const ageDropdownRef = useRef<HTMLDivElement>(null);
  const [ageDropdownPlacement, setAgeDropdownPlacement] = useState<'bottom' | 'top'>('bottom');
  const [customAgeInput, setCustomAgeInput] = useState('');

  const handleToggleAgeDropdown = () => {
    if (!isAgeDropdownOpen && ageDropdownRef.current) {
      const rect = ageDropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 330 && spaceAbove > spaceBelow) {
        setAgeDropdownPlacement('top');
      } else {
        setAgeDropdownPlacement('bottom');
      }
    }
    setIsAgeDropdownOpen(prev => !prev);
  };

  const handleToggleLanguageDropdown = () => {
    if (!isLanguageDropdownOpen && languageDropdownRef.current) {
      const rect = languageDropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 330 && spaceAbove > spaceBelow) {
        setLanguageDropdownPlacement('top');
      } else {
        setLanguageDropdownPlacement('bottom');
      }
    }
    setIsLanguageDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
        setCategorySearch('');
      }
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
      if (ageDropdownRef.current && !ageDropdownRef.current.contains(event.target as Node)) {
        setIsAgeDropdownOpen(false);
      }
      if (artistDropdownRef.current && !artistDropdownRef.current.contains(event.target as Node)) {
        setIsArtistDropdownOpen(false);
      }
      if (venueDropdownRef.current && !venueDropdownRef.current.contains(event.target as Node)) {
        setIsVenueDropdownOpen(false);
        setVenueSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleGenre = (g: string) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(selectedGenres.filter(item => item !== g));
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const handleSelectArtist = (selected: Artist) => {
    setArtist(selected.name);
    if (!tourName) {
      setTourName(selected.stageName || `${selected.name} World Tour`);
    }
    if (selected.genre && !selectedGenres.includes(selected.genre)) {
      setSelectedGenres([selected.genre]);
    }
    if (selected.bannerImage) {
      setImageUrl(selected.bannerImage);
    } else if (selected.avatar) {
      setImageUrl(selected.avatar);
    }
    setIsArtistDropdownOpen(false);
    setArtistSearch('');
  };

  const handleAddNewArtist = (newArtistData: Omit<Artist, 'id'>) => {
    const newArtist: Artist = {
      ...newArtistData,
      id: `art-${Date.now().toString().slice(-4)}`
    };
    setArtistList(prev => [newArtist, ...prev]);
    if (onAddArtist) {
      onAddArtist(newArtistData);
    }
    setArtist(newArtist.name);
    if (!tourName) {
      setTourName(newArtist.stageName || `${newArtist.name} Live`);
    }
    if (newArtist.genre && !selectedGenres.includes(newArtist.genre)) {
      setSelectedGenres([newArtist.genre]);
    }
    if (newArtist.bannerImage || newArtist.avatar) {
      setImageUrl(newArtist.bannerImage || newArtist.avatar);
    }
    setIsArtistDropdownOpen(false);
  };

  const filteredArtists = artistList.filter(a => {
    // Only active artists can be assigned to events/concerts
    if (a.status === 'inactive') return false;
    const q = artistSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      (a.stageName && a.stageName.toLowerCase().includes(q)) ||
      a.genre.toLowerCase().includes(q) ||
      (a.city && a.city.toLowerCase().includes(q))
    );
  });

  const handleAddCustomGenre = (name: string) => {
    const formatted = name.trim();
    if (!formatted) return;
    if (!availableGenres.includes(formatted)) {
      setAvailableGenres(prev => [...prev, formatted]);
    }
    if (!selectedGenres.includes(formatted)) {
      setSelectedGenres(prev => [...prev, formatted]);
    }
    setGenreSearch('');
  };

  const filteredGenres = availableGenres.filter(g =>
    g.toLowerCase().includes(genreSearch.toLowerCase().trim())
  );

  const filteredVenues = venueList.filter(v => {
    const q = venueSearch.toLowerCase().trim();
    if (!q) return true;
    return v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q);
  });

  // Schedule, Duration & Languages
  const [date, setDate] = useState('2026-12-20');
  const [doorsOpen, setDoorsOpen] = useState('17:00');
  const [showTime, setShowTime] = useState('19:30');
  const [durationHours, setDurationHours] = useState('3.5 Hours');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(AVAILABLE_LANGUAGES);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageSearch, setLanguageSearch] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('16+ (Valid ID Required)');

  // Venue & Capacity
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0].name);
  const [venueAddress, setVenueAddress] = useState('Bandra Kurla Complex, G Block');
  const [city, setCity] = useState(mockVenues[0].city);
  const [country, setCountry] = useState('India');
  const [totalCapacity, setTotalCapacity] = useState(mockVenues[0].capacity);
  const [soundSystem, setSoundSystem] = useState(mockVenues[0].soundSystem);

  // Artwork & Banner
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show Photo Gallery
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // YouTube Promo Video URL
  const [videoUrl, setVideoUrl] = useState('');

  // Ticket Tiers
  const [tiers, setTiers] = useState<TicketTier[]>([
    {
      id: 'tier-1',
      name: 'General Admission Floor',
      price: 1999,
      total: 15000,
      available: 15000,
      description: 'Open lawn standing area with dual LED screen sightlines',
      perks: ['Standard Arena Entry', 'F&B Zone Access']
    },
    {
      id: 'tier-2',
      name: 'VIP Front Stage Pit',
      price: 4999,
      total: 8000,
      available: 8000,
      description: 'Dedicated front row barricade enclosure closest to stage',
      perks: ['Express Gate 2 Check-in', 'Dedicated Bar Counter', 'Souvenir Lanyard']
    },
    {
      id: 'tier-3',
      name: 'VVIP Hospitality Deck',
      price: 12999,
      total: 2000,
      available: 2000,
      description: 'Elevated AC lounge terrace with panoramic soundstage view',
      perks: ['Complimentary Gourmet Buffet', 'Valet Parking Pass', 'Private Restrooms']
    }
  ]);

  // Calculations
  const totalAllocatedSeats = tiers.reduce((acc, t) => acc + Number(t.total || 0), 0);
  const estGrossRevenue = tiers.reduce((acc, t) => acc + Number(t.total || 0) * Number(t.price || 0), 0);
  const prices = tiers.map(t => Number(t.price || 0));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  // Language toggle handler
  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleAddCustomLanguage = (name: string) => {
    const formatted = name.trim();
    if (!formatted) return;
    if (!availableLanguages.includes(formatted)) {
      setAvailableLanguages(prev => [...prev, formatted]);
    }
    if (!selectedLanguages.includes(formatted)) {
      setSelectedLanguages(prev => [...prev, formatted]);
    }
    setLanguageSearch('');
  };

  const filteredLanguages = availableLanguages.filter(lang =>
    lang.toLowerCase().includes(languageSearch.toLowerCase().trim())
  );

  // Venue change handler
  const handleVenueChange = (venueName: string) => {
    setSelectedVenue(venueName);
    const v = venueList.find(item => item.name === venueName);
    if (v) {
      setCity(v.city);
      setVenueAddress(v.address);
      setTotalCapacity(v.capacity);
      setSoundSystem(v.soundSystem);
      setCountry('India');
    }
  };

  const handleAddNewVenue = (newVenue: Venue) => {
    setVenueList(prev => [newVenue, ...prev]);
    if (onAddVenue) {
      onAddVenue(newVenue);
    }
    // Auto-select the newly added venue and sync fields
    setSelectedVenue(newVenue.name);
    setCity(newVenue.city);
    setVenueAddress(newVenue.address);
    setTotalCapacity(newVenue.capacity);
    setSoundSystem(newVenue.soundSystem);
    setCountry('India');
  };

  // Image Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to extract YouTube ID
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  // Gallery multi-upload handler
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setGalleryImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPresetToGallery = (url: string) => {
    if (!galleryImages.includes(url)) {
      setGalleryImages((prev) => [...prev, url]);
    }
  };

  // Tier Handlers
  const handleAddTier = () => {
    const newTier: TicketTier = {
      id: `tier-${Date.now().toString().slice(-4)}`,
      name: 'Silver Seated Stand',
      price: isFreeEvent ? 0 : 2999,
      total: 3000,
      available: 3000,
      description: 'Numbered stadium seating with clear elevated acoustics',
      perks: ['Numbered Reserved Chair', 'Level 1 Concourse Access']
    };
    setTiers([...tiers, newTier]);
  };

  const handleRemoveTier = (id: string) => {
    if (tiers.length <= 1) return;
    setTiers(tiers.filter(t => t.id !== id));
  };

  const handleTierChange = (index: number, field: keyof TicketTier, value: unknown) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent, status: ConcertEvent['status'] = 'active') => {
    e.preventDefault();
    if (!title || !artist || !city) {
      alert('Please fill in the required fields: Title, Artist, and City.');
      return;
    }

    if (isEditMode && existingConcert && onUpdateConcert) {
      onUpdateConcert(existingConcert.id, {
        title,
        artist,
        supportingActs: supportingActs ? supportingActs.split(',').map(s => s.trim()).filter(Boolean) : [],
        tourName: tourName || `${title} Live`,
        genre: (selectedGenres[0] as ConcertEvent['genre']) || currentCategoryConfig.defaultGenre,
        genres: selectedGenres,
        eventCategory: selectedCategory,
        venue: selectedVenue,
        venueName: selectedVenue,
        venueAddress,
        city,
        country,
        date,
        doorsOpen,
        showTime,
        durationHours,
        languages: selectedLanguages,
        totalCapacity: Number(totalCapacity),
        minPrice: isFreeEvent ? 0 : minPrice,
        maxPrice: isFreeEvent ? 0 : maxPrice,
        isFree: isFreeEvent,
        currency: 'INR',
        image: imageUrl,
        gallery: galleryImages,
        videoUrl: videoUrl.trim(),
        status,
        organizer: existingConcert.organizer || 'Zenith Live Touring & Entertainment',
        soundSystem,
        ageRestriction,
        ticketTiers: tiers
      });

      navigate(`/concerts/${existingConcert.id}`);
      return;
    }

    onAddConcert({
      title,
      artist,
      supportingActs: supportingActs ? supportingActs.split(',').map(s => s.trim()).filter(Boolean) : [],
      tourName: tourName || `${title} Live`,
      genre: (selectedGenres[0] as ConcertEvent['genre']) || currentCategoryConfig.defaultGenre,
      genres: selectedGenres,
      eventCategory: selectedCategory,
      venueName: selectedVenue,
      venueAddress,
      city,
      country,
      date,
      doorsOpen,
      showTime,
      durationHours,
      languages: selectedLanguages,
      totalCapacity: Number(totalCapacity),
      minPrice: isFreeEvent ? 0 : minPrice,
      maxPrice: isFreeEvent ? 0 : maxPrice,
      isFree: isFreeEvent,
      currency: 'INR',
      image: imageUrl,
      gallery: galleryImages,
      videoUrl: videoUrl.trim(),
      status,
      organizer: 'Zenith Live Touring & Entertainment',
      soundSystem,
      ageRestriction,
      ticketTiers: tiers
    });

    navigate('/concerts');
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Top Navigation & Sticky Header Bar */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => isEditMode && existingConcert ? navigate(`/concerts/${existingConcert.id}`) : navigate('/concerts')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50 border border-slate-200/80 transition-all cursor-pointer group"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-600 group-hover:-translate-x-0.5 transition-all" />
            <span>Cancel</span>
          </button>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              {isEditMode ? `Edit Concert: ${existingConcert?.title}` : 'Publish New Concert Tour Stop'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? 'Update tour stop schedule, ticket tier quotas, pricing, and arena specifications.'
                : 'Configure event details, ticket tier quotas, schedule duration, languages, and arena logistics.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            className="px-4 py-2 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'active')}
            className="flex items-center gap-2 px-5 py-2 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs shadow-purple-200 transition-all cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>{isEditMode ? 'Save Changes' : 'Publish Live Event'}</span>
          </button>
        </div>
      </div>

      {/* Full-Width Form Layout - Single Unified Card Container */}
      <form onSubmit={(e) => handleSubmit(e, 'active')}>
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-8">
          {/* Section 01: Event basics */}
          <div className="space-y-5">
            <div className="section-top">
              <div className="section-label">
                <span className="section-no">01</span>
                <h2>Event basics</h2>
              </div>
              <span className="section-note">Required details first</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Event Category Dropdown */}
              <div className="space-y-2 sm:col-span-1 relative" ref={categoryDropdownRef}>
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    <span>Concert/Event Category <span className="text-rose-500">*</span></span>
                  </span>
                </label>

                {/* Searchable Dropdown Container */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 font-medium flex items-center justify-between cursor-pointer hover:border-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-5 w-5 rounded bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        {React.createElement(currentCategoryConfig.icon, { className: 'h-3.5 w-3.5' })}
                      </div>
                      <span className="font-semibold text-slate-900 truncate">
                        {currentCategoryConfig.name}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-purple-600' : ''}`} />
                  </button>

                  {/* Searchable Dropdown Menu */}
                  {isCategoryDropdownOpen && (
                    <div className="absolute z-30 mt-1.5 w-full left-0 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      {/* Search Bar inside dropdown */}
                      <div className="p-2 border-b border-slate-100 bg-slate-50/80">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            placeholder="Search category (e.g. Comedy, Dance, DJ)..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* Filtered Category Options */}
                      <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 p-1">
                        {filteredCategories.length === 0 ? (
                          <div className="p-3 text-center text-xs text-slate-500">
                            No categories matching "{categorySearch}"
                          </div>
                        ) : (
                          filteredCategories.map((cat) => {
                            const isSelected = selectedCategory === cat.id;
                            const CatIcon = cat.icon;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  handleCategoryChange(cat.id);
                                  setIsCategoryDropdownOpen(false);
                                  setCategorySearch('');
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${isSelected
                                  ? 'bg-purple-50/90 text-purple-900 font-semibold'
                                  : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    <CatIcon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold leading-tight truncate">{cat.name}</div>
                                    {/* <div className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">{cat.tagline}</div> */}
                                  </div>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-purple-600 shrink-0 ml-2" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Title based on selected category */}
              <div className="space-y-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>{currentCategoryConfig.titleLabel} <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!tourName) setTourName(`${e.target.value} Live`);
                  }}
                  placeholder={currentCategoryConfig.titlePlaceholder}
                  className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Headlining Artist / Host with Searchable Dropdown & Add New Artist */}
              <div className="space-y-2 relative" ref={artistDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    {React.createElement(currentCategoryConfig.icon, { className: 'h-3.5 w-3.5 text-purple-600' })}
                    <span>{currentCategoryConfig.performerLabel} <span className="text-rose-500">*</span></span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCreateArtistOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3 stroke-[2.5]" />
                    <span>Add Performer</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={artist}
                      onChange={(e) => {
                        setArtist(e.target.value);
                        setArtistSearch(e.target.value);
                        if (!isArtistDropdownOpen) setIsArtistDropdownOpen(true);
                      }}
                      onFocus={() => setIsArtistDropdownOpen(true)}
                      placeholder="Search roster or enter artist name..."
                      className="w-full rounded-md border border-slate-300 bg-white pl-3.5 pr-16 py-2.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none transition-colors"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      {artist && (
                        <button
                          type="button"
                          onClick={() => {
                            setArtist('');
                            setArtistSearch('');
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                          title="Clear artist"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsArtistDropdownOpen(!isArtistDropdownOpen)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Toggle artist roster"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isArtistDropdownOpen ? 'rotate-180 text-purple-600' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Searchable Artists Dropdown */}
                  {isArtistDropdownOpen && (
                    <div className="absolute z-30 mt-1.5 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      {/* Search Bar inside dropdown */}
                      <div className="p-2 border-b border-slate-100 bg-slate-50/80">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={artistSearch}
                            onChange={(e) => setArtistSearch(e.target.value)}
                            placeholder="Type to filter artist roster..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Artist List */}
                      <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 p-1">
                        {filteredArtists.length === 0 ? (
                          <div className="p-3 text-center space-y-2">
                            <p className="text-xs text-slate-500">
                              No artists found matching "{artistSearch}"
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setIsArtistDropdownOpen(false);
                                setIsCreateArtistOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Create "{artistSearch || 'New Artist'}"</span>
                            </button>
                          </div>
                        ) : (
                          filteredArtists.map((a) => {
                            const isSelected = artist.toLowerCase() === a.name.toLowerCase();
                            return (
                              <button
                                key={a.id}
                                type="button"
                                onClick={() => handleSelectArtist(a)}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${isSelected ? 'bg-purple-50/80 text-purple-900' : 'hover:bg-slate-50 text-slate-800'
                                  }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="h-8 w-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                    <img src={a.avatar} alt={a.name} className="h-full w-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-semibold text-slate-900 truncate">{a.name}</span>
                                      {a.verified && <CheckCircle2 className="h-3 w-3 text-purple-600 shrink-0" />}
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate">
                                      {a.genre} {a.city ? `• ${a.city}` : ''}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {a.status === 'active' && (
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                      Active
                                    </span>
                                  )}
                                  {isSelected && <Check className="h-4 w-4 text-purple-600" />}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Dropdown Footer: Quick Register */}
                      <div className="p-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {filteredArtists.length} artists in catalog
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsArtistDropdownOpen(false);
                            setIsCreateArtistOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                        >
                          <Plus className="h-3 w-3 stroke-[2.5]" />
                          <span>Register New Artist</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Official Tour Run Name
                </label>
                <input
                  type="text"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder="e.g. Genesys Global Arena Run"
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
              </div> */}


              <div className="space-y-2 sm:col-span-1 relative" ref={genreDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    {currentCategoryConfig.genreLabel}
                  </label>
                  {/* <span className="text-[11px] text-slate-500 font-medium">
                    {selectedGenres.length} selected
                  </span> */}
                </div>

                {/* Dropdown Trigger */}
                <div
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  className={`w-full min-h-[42px] rounded-md border bg-white px-3 py-1.5 text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${isGenreDropdownOpen
                    ? 'border-purple-600 ring-1 ring-purple-600'
                    : 'border-slate-300 hover:border-slate-400'
                    }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 py-0.5">
                    {selectedGenres.length === 0 ? (
                      <span className="text-slate-400">Select {currentCategoryConfig.shortName.toLowerCase()} genre(s)...</span>
                    ) : (
                      selectedGenres.map((g) => (
                        <span
                          key={g}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGenre(g);
                          }}
                        >
                          <span>{g}</span>
                          <X className="h-3 w-3 hover:text-purple-900 cursor-pointer" />
                        </span>
                      ))
                    )}
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isGenreDropdownOpen ? 'rotate-180 text-purple-600' : ''
                      }`}
                  />
                </div>

                {/* Dropdown Menu Popup */}
                {isGenreDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-lg border border-slate-200 bg-white p-2.5 shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-100">
                    {/* Search Input Filter */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={genreSearch}
                        onChange={(e) => setGenreSearch(e.target.value)}
                        placeholder={currentCategoryConfig.genrePlaceholder}
                        className="w-full rounded-md border border-slate-300 bg-white pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                      {genreSearch && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGenreSearch('');
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <div className="px-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span>{genreSearch ? `Matches (${filteredGenres.length})` : 'Available Genres'}</span>
                      <div className="flex items-center gap-2">
                        {selectedGenres.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGenres([]);
                            }}
                            className="text-[10px] text-slate-500 hover:text-rose-600 font-medium cursor-pointer"
                          >
                            Clear all
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const toAdd = genreSearch ? filteredGenres : availableGenres;
                            setSelectedGenres(Array.from(new Set([...selectedGenres, ...toAdd])));
                          }}
                          className="text-[10px] text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
                        >
                          {genreSearch ? 'Select visible' : 'Select all'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-52 overflow-y-auto pr-0.5">
                      {filteredGenres.map((g) => {
                        const isSelected = selectedGenres.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleGenre(g)}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium text-left transition-colors cursor-pointer ${isSelected
                              ? 'bg-purple-50 text-purple-800 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                              }`}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`h-3.5 w-3.5 rounded border flex items-center justify-center transition-colors ${isSelected
                                  ? 'bg-purple-600 border-purple-600 text-white'
                                  : 'border-slate-300 bg-white'
                                  }`}
                              >
                                {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                              </span>
                              <span>{g}</span>
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-semibold text-purple-600 bg-purple-100/60 px-1.5 py-0.2 rounded">
                                Selected
                              </span>
                            )}
                          </button>
                        );
                      })}

                      {filteredGenres.length === 0 && (
                        <div className="col-span-full py-4 text-center space-y-2">
                          <p className="text-xs text-slate-500">
                            No genres found matching <span className="font-semibold text-slate-700">"{genreSearch}"</span>
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddCustomGenre(genreSearch);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Add "{genreSearch.trim()}" as custom genre</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 02: When & where */}
          <div className="border-t border-slate-100 pt-8 space-y-5">
            <div className="section-top">
              <div className="section-label">
                <span className="section-no">02</span>
                <h2>When & where</h2>
              </div>
              <span className="section-note">Schedule and venue</span>
            </div>

            <div className="grid grid-cols-12 gap-[25px]">
              {/* Host Arena Dropdown */}
              <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4 relative" ref={venueDropdownRef}>
                <label className="block text-xs font-semibold text-slate-600">
                  Select Host Arena / Venue <span className="req">*</span>
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsVenueDropdownOpen(!isVenueDropdownOpen)}
                    className="w-full min-h-[44px] rounded-[7px] border border-[#d9ddd7] bg-white px-3.5 py-2.5 text-[13px] text-slate-900 font-medium flex items-center justify-between cursor-pointer hover:border-[#b8beb7] focus:border-purple-600 focus:ring-3 focus:ring-purple-600/12 focus:outline-none transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Building className="h-4 w-4 text-purple-600 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">
                        {selectedVenue ? `${selectedVenue} — ${city}` : 'Select host arena / venue...'}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isVenueDropdownOpen ? 'rotate-180 text-purple-600' : ''}`} />
                  </button>

                  {/* Dropdown Menu Popup */}
                  {isVenueDropdownOpen && (
                    <div className="absolute z-30 mt-1.5 w-full left-0 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      {/* Search Bar inside dropdown */}
                      <div className="p-2 border-b border-slate-100 bg-slate-50/80">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={venueSearch}
                            onChange={(e) => setVenueSearch(e.target.value)}
                            placeholder="Type to filter arenas by name or city..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* Venue List */}
                      <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 p-1">
                        {filteredVenues.length === 0 ? (
                          <div className="p-3 text-center space-y-2">
                            <p className="text-xs text-slate-500">
                              No arenas found matching "{venueSearch}"
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setIsVenueDropdownOpen(false);
                                setIsAddVenueOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add "{venueSearch || 'New Arena'}"</span>
                            </button>
                          </div>
                        ) : (
                          filteredVenues.map((v) => {
                            const isSelected = selectedVenue === v.name;
                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => {
                                  handleVenueChange(v.name);
                                  setIsVenueDropdownOpen(false);
                                  setVenueSearch('');
                                }}
                                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${isSelected
                                  ? 'bg-purple-50/90 text-purple-900 font-semibold'
                                  : 'hover:bg-slate-50 text-slate-800'
                                  }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${isSelected ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    <Building className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold leading-tight truncate">{v.name}</div>
                                    <div className="text-[10px] text-slate-500 leading-tight truncate mt-0.5">
                                      {v.city} {v.capacity ? `• ${Number(v.capacity).toLocaleString()} seats` : ''}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-purple-600 shrink-0 ml-2" />}
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Dropdown Footer: Add Partner Arena button moved here */}
                      <div className="p-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {filteredVenues.length} partner arenas in roster
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsVenueDropdownOpen(false);
                            setIsAddVenueOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
                        >
                          <Plus className="h-3 w-3 stroke-[2.5]" />
                          <span>Add Partner Arena</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Date */}
              <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-600">
                  Event Date <span className="req">*</span>
                </label>
                <CustomDatePicker
                  value={date}
                  onChange={setDate}
                  placeholder="Select event date"
                  required
                />
              </div>

              {/* Showtime / Event Time */}
              <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-600">
                  Showtime / Event Time <span className="req">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={showTime}
                  onChange={(e) => {
                    setShowTime(e.target.value);
                    setDoorsOpen(e.target.value);
                  }}
                  className="concert-field-input"
                />
              </div>

              {/* Total Hours of Show (Duration) */}
              <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-600">
                  Total Hours of Show <span className="optional">Optional</span>
                </label>
                <input
                  type="number"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  placeholder="e.g. 3.5 Hours, 4 Hours"
                  className="concert-field-input"
                />
              </div>

              {/* Languages (Multiple Selection Dropdown with Search) */}
              <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4 relative" ref={languageDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-blue-600" />
                    <span>Performance & Event Languages</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedLanguages.length} selected
                  </span>
                </div>

                {/* Dropdown Trigger */}
                <div
                  onClick={handleToggleLanguageDropdown}
                  className={`w-full min-h-[42px] rounded-md border bg-white px-3 py-1.5 text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${isLanguageDropdownOpen
                    ? 'border-blue-600 ring-1 ring-blue-600'
                    : 'border-slate-300 hover:border-slate-400'
                    }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 py-0.5">
                    {selectedLanguages.length === 0 ? (
                      <span className="text-slate-400">Select event languages...</span>
                    ) : (
                      selectedLanguages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLanguage(lang);
                          }}
                        >
                          <span>{lang}</span>
                          <X className="h-3 w-3 hover:text-blue-900 cursor-pointer" />
                        </span>
                      ))
                    )}
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                  />
                </div>

                {/* Dropdown Menu Popup - Smart Position */}
                {isLanguageDropdownOpen && (
                  <div className={`absolute left-0 right-0 z-40 rounded-lg border border-slate-200 bg-white p-2.5 shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-100 ${languageDropdownPlacement === 'top'
                    ? 'bottom-full mb-1.5'
                    : 'top-full mt-1.5'
                    }`}>
                    {/* Search Input Filter */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        placeholder="Search languages (e.g. Hindi, Punjabi, Tamil)..."
                        className="w-full rounded-md border border-slate-300 bg-white pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                      {languageSearch && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLanguageSearch('');
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <div className="px-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span>{languageSearch ? `Matches (${filteredLanguages.length})` : 'Available Languages'}</span>
                      <div className="flex items-center gap-2">
                        {selectedLanguages.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLanguages([]);
                            }}
                            className="text-[10px] text-slate-500 hover:text-rose-600 font-medium cursor-pointer"
                          >
                            Clear all
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const toAdd = languageSearch ? filteredLanguages : availableLanguages;
                            setSelectedLanguages(Array.from(new Set([...selectedLanguages, ...toAdd])));
                          }}
                          className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                        >
                          {languageSearch ? 'Select visible' : 'Select all'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-52 overflow-y-auto pr-0.5">
                      {filteredLanguages.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium text-left transition-colors cursor-pointer ${isSelected
                              ? 'bg-blue-50 text-blue-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                              }`}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`h-3.5 w-3.5 rounded border flex items-center justify-center transition-colors ${isSelected
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-slate-300 bg-white'
                                  }`}
                              >
                                {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                              </span>
                              <span>{lang}</span>
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/60 px-1.5 py-0.2 rounded">
                                Selected
                              </span>
                            )}
                          </button>
                        );
                      })}

                      {filteredLanguages.length === 0 && (
                        <div className="col-span-full py-4 text-center space-y-2">
                          <p className="text-xs text-slate-500">
                            No languages found matching <span className="font-semibold text-slate-700">"{languageSearch}"</span>
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddCustomLanguage(languageSearch);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Add "{languageSearch.trim()}" as custom language</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Age Restriction Dropdown */}
              <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4 relative" ref={ageDropdownRef}>
                <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                    <span>Age Restriction & Entry Policy</span>
                  </span>
                </label>

                <div className="relative">
                  {/* Dropdown Trigger - Normal Clean High-Contrast Dropdown with Smart Placement */}
                  <button
                    type="button"
                    onClick={handleToggleAgeDropdown}
                    className="w-full min-h-[42px] px-3.5 py-2.5 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium flex items-center justify-between cursor-pointer hover:border-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />
                      <span className="truncate text-slate-900 font-semibold">
                        {ageRestriction || 'Select age policy...'}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${isAgeDropdownOpen ? 'rotate-180 text-purple-600' : ''}`} />
                  </button>

                  {/* Dropdown Menu Popup - Smart Position (Opens Top or Bottom dynamically) */}
                  {isAgeDropdownOpen && (
                    <div className={`absolute z-30 w-full left-0 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${ageDropdownPlacement === 'top'
                      ? 'bottom-full mb-1.5'
                      : 'top-full mt-1.5'
                      }`}>
                      {/* Presets List */}
                      <div className="max-h-56 overflow-y-auto">
                        {STANDARD_AGE_PRESETS.map((preset) => {
                          const isSelected = ageRestriction === preset;
                          return (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                setAgeRestriction(preset);
                                setIsAgeDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors cursor-pointer ${isSelected
                                ? 'bg-purple-50 text-purple-900 font-bold'
                                : 'text-slate-800 hover:bg-slate-50 font-medium'
                                }`}
                            >
                              <span className="truncate pr-2">{preset}</span>
                              {isSelected && <Check className="h-4 w-4 text-purple-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Restriction Entering Option */}
                      <div className="p-3 border-t border-slate-200 bg-slate-50/90 space-y-2">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Or enter custom restriction:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={customAgeInput}
                            onChange={(e) => setCustomAgeInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (customAgeInput.trim()) {
                                  setAgeRestriction(customAgeInput.trim());
                                  setIsAgeDropdownOpen(false);
                                }
                              }
                            }}
                            placeholder="e.g. 14+ with guardian, 25+ VIP..."
                            className="flex-1 px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (customAgeInput.trim()) {
                                setAgeRestriction(customAgeInput.trim());
                                setIsAgeDropdownOpen(false);
                              }
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors shrink-0 cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 03: Ticket categories */}
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <div className="section-top flex-col sm:flex-row sm:items-baseline gap-3">
                <div className="section-label">
                  <span className="section-no">03</span>
                  <h2>Ticket categories</h2>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
                  {/* <span className="section-note hidden sm:inline">Pricing and allocation</span> */}
                  {/* Mixed Tier Indicator Badge */}
                  {/* {!isFreeEvent && tiers.some(t => Number(t.price || 0) === 0) && tiers.some(t => Number(t.price || 0) > 0) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/80">
                      <Sparkles className="h-3 w-3 text-purple-600" />
                      Mixed: Paid & Free Tiers
                    </span>
                  )} */}

                  {/* Paid / Free Pricing Switcher */}
                  <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/80 p-1 text-xs shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleFreeToggle(false)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${!isFreeEvent
                        ? 'bg-white text-purple-700 shadow-xs border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-900 font-medium'
                        }`}
                    >
                      <Ticket className={`h-3.5 w-3.5 ${!isFreeEvent ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span>Paid Event</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFreeToggle(true)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${isFreeEvent
                        ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200/60'
                        : 'text-slate-500 hover:text-slate-900 font-medium'
                        }`}
                    >
                      <Sparkles className={`h-3.5 w-3.5 ${isFreeEvent ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>Free Event</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTier}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs shadow-purple-200 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Add Tier</span>
                  </button>
                </div>
              </div>



              {/* Small Horizontal Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {tiers.map((tier, idx) => {
                  const badgeColors = [
                    'bg-blue-50 text-blue-700 border-blue-200',
                    'bg-purple-50 text-purple-700 border-purple-200',
                    'bg-amber-50 text-amber-700 border-amber-200',
                    'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'bg-rose-50 text-rose-700 border-rose-200',
                    'bg-indigo-50 text-indigo-700 border-indigo-200'
                  ];
                  const badgeColor = badgeColors[idx % badgeColors.length];
                  const tierRevenue = Number(tier.total || 0) * Number(tier.price || 0);
                  const tierPct = totalCapacity > 0 ? Math.round((Number(tier.total || 0) / totalCapacity) * 100) : 0;

                  return (
                    <div
                      key={tier.id}
                      className="rounded-md border border-slate-200 bg-white p-3.5 shadow-2xs hover:shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between gap-3 group"
                    >
                      {/* Card Header: Tier Badge + Revenue + Delete */}
                      {/* <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                          Tier #{idx + 1}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {isFreeEvent
                              ? 'Free'
                              : tierRevenue >= 10000000
                                ? `₹${(tierRevenue / 10000000).toFixed(2)} Cr`
                                : `₹${tierRevenue.toLocaleString()}`}
                          </span>
                        </div>
                      </div> */}

                      {/* Tier Name */}
                      <div>
                        <div className="flex items-center justify-between h-6 mb-1.5">
                          <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider block">
                            Pass / Zone Name
                          </label>

                          <div className="flex items-center gap-2">
                            {!isFreeEvent && (
                              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (Number(tier.price || 0) === 0) {
                                      handleTierChange(idx, 'price', idx === 0 ? 1999 : idx === 1 ? 4999 : 2999);
                                    }
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${Number(tier.price || 0) > 0
                                    ? 'bg-white text-purple-700 shadow-2xs'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                  title="Set paid ticket price"
                                >
                                  Paid
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleTierChange(idx, 'price', 0)}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${Number(tier.price || 0) === 0
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                  title="Make this tier completely free"
                                >
                                  Free
                                </button>
                              </div>
                            )}

                            {tiers.length > 1 && (
                              <div className="flex items-center pl-1 border-l border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTier(tier.id)}
                                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded-md transition-colors cursor-pointer"
                                  title="Delete tier"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                          placeholder="e.g. VIP Front Pit"
                          className="w-full min-h-[38px] rounded-[7px] border border-[#d9ddd7] bg-white px-3 text-[13px] font-semibold text-slate-700 placeholder:text-[#aeb3ad] focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-600/12 transition-all"
                        />
                      </div>

                      {/* Price & Quota Side-by-Side */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        {/* Price */}
                        <div>
                          <div className="flex items-center justify-between h-5 mb-1">
                            <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider block">
                              Price {Number(tier.price || 0) > 0 ? '(₹)' : ''}
                            </label>
                          </div>

                          {isFreeEvent || Number(tier.price || 0) === 0 ? (
                            <div
                              onClick={() => {
                                if (!isFreeEvent) {
                                  handleTierChange(idx, 'price', idx === 0 ? 1999 : idx === 1 ? 4999 : 2999);
                                }
                              }}
                              className={`min-h-[38px] rounded-[7px] border border-emerald-300 bg-emerald-50/80 px-2.5 flex items-center justify-between transition-colors ${!isFreeEvent ? 'cursor-pointer hover:bg-emerald-100/70 group/free' : 'select-none'
                                }`}
                              title={!isFreeEvent ? 'Click to set a ticket price' : 'Free event tier'}
                            >
                              <span className="font-bold text-[11px] text-emerald-700 flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-emerald-600" />
                                FREE (₹0)
                              </span>
                              {!isFreeEvent ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 group-hover/free:text-emerald-900 group-hover/free:underline">
                                  <Plus className="h-2.5 w-2.5 stroke-[2.5]" />
                                  <span>Set Price</span>
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                                  Free Event
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">₹</span>
                              <input
                                type="number"
                                min="0"
                                value={tier.price}
                                onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                                placeholder="0"
                                className="w-full min-h-[38px] rounded-[7px] border border-[#d9ddd7] bg-white pl-6 pr-2 text-[13px] font-bold text-slate-700 focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-600/12 transition-all"
                              />
                            </div>
                          )}
                        </div>

                        {/* Quota */}
                        <div>
                          <div className="flex items-center justify-between h-5 mb-1">
                            <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider block">
                              Seats Quota
                            </label>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {tierPct}%
                            </span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            value={tier.total}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              handleTierChange(idx, 'total', val);
                              handleTierChange(idx, 'available', val);
                            }}
                            placeholder="Passes"
                            className="w-full min-h-[38px] rounded-[7px] border border-[#d9ddd7] bg-white px-2.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-600/12 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Tier Action Card in Grid */}
                {/* <button
                  type="button"
                  onClick={handleAddTier}
                  className="rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/20 hover:bg-purple-50/60 p-4 flex flex-col items-center justify-center gap-1.5 text-purple-700 transition-all cursor-pointer min-h-[148px] group"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold">Add Another Tier</span>
                  <span className="text-[10px] text-slate-400">Configure new zone & quota</span>
                </button> */}
              </div>
            </div>




            {/* Section 04: Media */}
            <div className="border-t border-slate-100 pt-7 space-y-5">
              <div className="section-top">
                <div className="section-label">
                  <span className="section-no">04</span>
                  <h2>Media</h2>
                </div>
                <span className="section-note">Optional except poster</span>
              </div>

              <div className="grid grid-cols-12 gap-5">
                {/* Field 1: Cover poster (wide / 8 cols) */}
                <div className="col-span-12 lg:col-span-8 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Cover poster <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      16:9 · JPG, PNG or WEBP · 1600 × 900 recommended
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    id="concert-artwork-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group min-h-[140px] max-h-[175px] flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt="Cover poster preview"
                        className="w-full h-full object-cover max-h-[175px]"
                      />
                      <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-2xs">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 rounded-lg bg-white/95 hover:bg-white text-xs font-semibold text-purple-700 shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Change image</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-purple-200 hover:border-purple-400 rounded-xl bg-purple-50/20 hover:bg-purple-50/50 min-h-[140px] flex items-center justify-center text-center p-5 cursor-pointer transition-colors"
                    >
                      <div className="space-y-1">
                        <strong className="text-xs font-semibold text-slate-800 block">
                          Upload your cover poster
                        </strong>
                        <p className="text-[11px] text-slate-500">
                          Use a clear image that represents the event.
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="mt-2.5 px-3.5 py-1.5 rounded-lg border border-purple-200 bg-white text-xs font-semibold text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-colors shadow-2xs inline-block cursor-pointer"
                        >
                          Choose image
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Field 2: YouTube promo video (4 cols) */}
                <div className="col-span-12 lg:col-span-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      YouTube promo video
                    </label>
                    <span className="text-[11px] text-slate-400">Optional</span>
                  </div>

                  <div className="relative">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/..."
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none transition-colors"
                    />
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setVideoUrl('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                        title="Clear link"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    A short trailer can help attendees decide faster.
                  </p>
                </div>

                {/* Field 3: Photo gallery highlights (full / 12 cols) */}
                <div className="col-span-12 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Photo gallery highlights
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Optional · up to 8 images
                    </span>
                  </div>

                  {/* Hidden multi-file input */}
                  <input
                    ref={galleryInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group"
                      >
                        <img
                          src={img}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {galleryImages.length < 8 && (
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="aspect-[4/3] rounded-lg border border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/20 hover:bg-purple-50/60 text-purple-700 font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="h-4 w-4 stroke-[2.5]" />
                        <span>Add photos</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions Footer Bar */}
            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Review all fields carefully before publishing live to the platform.</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/concerts')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'draft')}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs shadow-purple-200 transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>{isEditMode ? 'Save Changes' : 'Publish Tour Stop Live'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Global Add Partner Arena Modal */}
      <AddVenueModal
        isOpen={isAddVenueOpen}
        onClose={() => setIsAddVenueOpen(false)}
        onAddVenue={handleAddNewVenue}
        onShowToast={onShowToast}
      />

      {/* Global Create Artist Modal */}
      <CreateArtistModal
        isOpen={isCreateArtistOpen}
        onClose={() => setIsCreateArtistOpen(false)}
        onAddArtist={handleAddNewArtist}
        onShowToast={onShowToast}
      />
    </div>
  );
};
