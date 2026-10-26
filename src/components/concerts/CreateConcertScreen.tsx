import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Mic2
} from 'lucide-react';
import type { ConcertEvent, TicketTier, Venue, Artist } from '../../types';
import { mockVenues, mockArtists } from '../../data/mockVendorData';
import { AddVenueModal } from '../common/AddVenueModal';
import { CreateArtistModal } from '../common/CreateArtistModal';

interface CreateConcertScreenProps {
  onAddConcert: (concert: Omit<ConcertEvent, 'id' | 'ticketsSold' | 'connectedRidesCount'>) => void;
  venues?: Venue[];
  onAddVenue?: (venue: Venue) => void;
  artists?: Artist[];
  onAddArtist?: (artist: Omit<Artist, 'id'>) => void;
  onShowToast?: (message: string) => void;
}

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

const DEFAULT_GENRES = [
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
  'R&B / Soul',
  'Metal',
  'Acoustic',
  'Folk'
];

const PRESET_POSTERS = [
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
];

const SAMPLE_GALLERY_PRESETS = [
  { label: 'Stage Lights', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80' },
  { label: 'Arena Crowd Wave', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&auto=format&fit=crop&q=80' },
  { label: 'Laser Show FX', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80' },
  { label: 'VIP Lounge Deck', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80' },
  { label: 'Backstage Console', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=80' }
];

export const CreateConcertScreen: React.FC<CreateConcertScreenProps> = ({
  onAddConcert,
  venues,
  onAddVenue,
  artists,
  onAddArtist,
  onShowToast
}) => {
  const navigate = useNavigate();

  // Venues State & Global Add Modal
  const [venueList, setVenueList] = useState<Venue[]>(() => {
    return (venues && venues.length > 0) ? venues : mockVenues;
  });
  const [isAddVenueOpen, setIsAddVenueOpen] = useState(false);

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

  // Basic Details
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [supportingActs, setSupportingActs] = useState('');
  const [tourName, setTourName] = useState('');
  const [availableGenres, setAvailableGenres] = useState<string[]>(DEFAULT_GENRES);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['EDM']);
  const [genreSearch, setGenreSearch] = useState('');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
      if (artistDropdownRef.current && !artistDropdownRef.current.contains(event.target as Node)) {
        setIsArtistDropdownOpen(false);
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

  // Schedule, Duration & Languages
  const [date, setDate] = useState('2026-12-20');
  const [doorsOpen, setDoorsOpen] = useState('17:00');
  const [showTime, setShowTime] = useState('19:30');
  const [durationHours, setDurationHours] = useState('3.5 Hours');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(AVAILABLE_LANGUAGES);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Hindi']);
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
  const [imageUrl, setImageUrl] = useState(PRESET_POSTERS[0].url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show Photo Gallery
  const [galleryImages, setGalleryImages] = useState<string[]>([
    SAMPLE_GALLERY_PRESETS[0].url,
    SAMPLE_GALLERY_PRESETS[1].url,
    SAMPLE_GALLERY_PRESETS[2].url
  ]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // YouTube Promo Video URL
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=kOCkne-Bku4');

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
      price: 2999,
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

    onAddConcert({
      title,
      artist,
      supportingActs: supportingActs ? supportingActs.split(',').map(s => s.trim()).filter(Boolean) : [],
      tourName: tourName || `${title} World Tour`,
      genre: (selectedGenres[0] as ConcertEvent['genre']) || 'EDM',
      genres: selectedGenres,
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
      minPrice,
      maxPrice,
      currency: 'INR',
      image: imageUrl || PRESET_POSTERS[0].url,
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
            onClick={() => navigate('/concerts')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50 border border-slate-200/80 transition-all cursor-pointer group"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-600 group-hover:-translate-x-0.5 transition-all" />
            <span>Cancel</span>
          </button>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Publish New Concert Tour Stop
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure event details, ticket tier quotas, schedule duration, languages, and arena logistics.
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
            <span>Publish Live Event</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <form onSubmit={(e) => handleSubmit(e, 'active')} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Comprehensive Form Cards (8 of 12 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Section 1: Tour & Performance Fundamentals */}
          <div className="rounded-lg border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Music className="h-4 w-4 text-purple-600" />
                  Tour & Performance Fundamentals
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Core branding, headlining talent, and tour run classification.
                </p>
              </div>
              {/* <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Step 1 of 4
              </span> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Tour / Concert Title <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-slate-400 font-normal">Displayed on passes & live marketing</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!tourName) setTourName(`${e.target.value} Live`);
                  }}
                  placeholder="e.g. Neon Odyssey: World Electronic Symphony 2026"
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
              </div>

              {/* Headlining Artist with Searchable Dropdown & Add New Artist */}
              <div className="space-y-1.5 relative" ref={artistDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mic2 className="h-3.5 w-3.5 text-purple-600" />
                    <span>Headlining Artist / Band <span className="text-rose-500">*</span></span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCreateArtistOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3 stroke-[2.5]" />
                    <span>Add New Artist</span>
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
                      className="w-full rounded-md border border-slate-200 bg-slate-50/60 pl-3.5 pr-16 py-2.5 text-xs text-slate-800 font-medium placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
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
                            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-800 focus:border-purple-500 focus:outline-none"
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
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-2xs transition-colors cursor-pointer"
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
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                  isSelected ? 'bg-purple-50/80 text-purple-900' : 'hover:bg-slate-50 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="h-8 w-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                    <img src={a.avatar} alt={a.name} className="h-full w-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-900 truncate">{a.name}</span>
                                      {a.verified && <CheckCircle2 className="h-3 w-3 text-purple-600 shrink-0" />}
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate">
                                      {a.genre} {a.city ? `• ${a.city}` : ''}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {a.status === 'touring' && (
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                      Touring
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
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                        >
                          <Plus className="h-3 w-3 stroke-[2.5]" />
                          <span>Register New Artist</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
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
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Supporting Acts & Lineup</span>
                  <span className="text-[11px] text-slate-400 font-normal">Separate with commas</span>
                </label>
                <input
                  type="text"
                  value={supportingActs}
                  onChange={(e) => setSupportingActs(e.target.value)}
                  placeholder="e.g. Kevin de Vries, Argy, Massano, Cassian"
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
                {supportingActs && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {supportingActs.split(',').map((act, i) => act.trim() ? (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {act.trim()}
                      </span>
                    ) : null)}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-1 relative" ref={genreDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Music Genre Classification
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedGenres.length} selected
                  </span>
                </div>

                {/* Dropdown Trigger */}
                <div
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  className={`w-full min-h-[42px] rounded-md border bg-slate-50/60 px-3 py-1.5 text-xs flex items-center justify-between gap-2 cursor-pointer transition-all shadow-2xs ${isGenreDropdownOpen
                    ? 'border-purple-500 ring-2 ring-purple-500/10 bg-white'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 py-0.5">
                    {selectedGenres.length === 0 ? (
                      <span className="text-slate-400">Select music genre(s)...</span>
                    ) : (
                      selectedGenres.map((g) => (
                        <span
                          key={g}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs"
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
                        placeholder="Search genres (e.g. Rock, Techno, Pop)..."
                        className="w-full rounded-md border border-slate-200 bg-slate-50/70 pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:outline-none transition-all shadow-2xs"
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
                              <span className="text-[10px] font-bold text-purple-600 bg-purple-100/60 px-1.5 py-0.2 rounded">
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer shadow-2xs"
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

          {/* Section 2: Schedule, Duration & Multi-Language Support */}
          <div className="rounded-lg border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  Event Timing, Duration & Languages
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Concert schedule, show duration, performance languages, and admission restrictions.
                </p>
              </div>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Step 2 of 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-purple-600" />
                  Event Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  Gates Open Time
                </label>
                <input
                  type="time"
                  value={doorsOpen}
                  onChange={(e) => setDoorsOpen(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-purple-600" />
                  Showtime / Live Starts
                </label>
                <input
                  type="time"
                  value={showTime}
                  onChange={(e) => setShowTime(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
              </div>

              {/* Total Hours of Show (Duration) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Hourglass className="h-3.5 w-3.5 text-purple-600" />
                  Total Hours of Show
                </label>
                <input
                  type="text"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  placeholder="e.g. 3.5 Hours, 4 Hours"
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
              </div>

              {/* Languages (Multiple Selection Dropdown with Search) */}
              <div className="space-y-1.5 sm:col-span-2 pt-1 relative" ref={languageDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-blue-600" />
                    Performance & Event Languages
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedLanguages.length} selected
                  </span>
                </div>

                {/* Dropdown Trigger */}
                <div
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className={`w-full min-h-[42px] rounded-md border bg-slate-50/60 px-3 py-1.5 text-xs flex items-center justify-between gap-2 cursor-pointer transition-all shadow-2xs ${isLanguageDropdownOpen
                    ? 'border-blue-500 ring-2 ring-blue-500/10 bg-white'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 py-0.5">
                    {selectedLanguages.length === 0 ? (
                      <span className="text-slate-400">Select event languages...</span>
                    ) : (
                      selectedLanguages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
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

                {/* Dropdown Menu Popup */}
                {isLanguageDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-lg border border-slate-200 bg-white p-2.5 shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-100">
                    {/* Search Input Filter */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        placeholder="Search languages (e.g. Hindi, Punjabi, Tamil)..."
                        className="w-full rounded-md border border-slate-200 bg-slate-50/70 pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-2xs"
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
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-1.5 py-0.2 rounded">
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shadow-2xs"
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

              {/* Age Restriction */}
              <div className="space-y-1.5 sm:col-span-3 pt-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  Age Restriction & Entry Policy
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'All Ages (Kids under 12 accompanied by adult)',
                    '16+ (Valid Govt ID Required)',
                    '18+ (Adults Only · Photo ID Mandatory)',
                    '21+ (Full Access Pass)'
                  ].map((policy) => (
                    <button
                      key={policy}
                      type="button"
                      onClick={() => setAgeRestriction(policy)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${ageRestriction === policy
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {policy}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Venue & Arena Infrastructure */}
          <div className="rounded-lg border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  Venue & Arena Location
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select the host arena venue. Address, capacity, city, and acoustics are automatically configured.
                </p>
              </div>
              {/* <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Step 3 of 4
              </span> */}
            </div>

            <div className="space-y-3.5">
              {/* Host Arena Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <span>Select Host Arena / Venue <span className="text-rose-500">*</span></span>
                    {/* <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">(All specs auto-linked)</span> */}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddVenueOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3 stroke-[2.5]" />
                    <span>Add Partner Arena</span>
                  </button>
                </div>
                <select
                  value={selectedVenue}
                  onChange={(e) => handleVenueChange(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-purple-500 focus:bg-white focus:outline-none transition-all shadow-2xs cursor-pointer"
                >
                  {venueList.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} — {v.city} ({v.type} · {v.capacity.toLocaleString()} Max Capacity)
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-populated Venue Overview Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">City & Territory</span>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    <span>{city}, {country}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Arena Max Capacity</span>
                  <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    <span>{totalCapacity.toLocaleString()} Attendees</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Verified Arena Address</span>
                  <div className="text-xs font-medium text-slate-700 truncate" title={venueAddress}>
                    {venueAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Ticket Tiers & Allocation Strategy */}
          <div className="rounded-lg border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-purple-600" />
                  Ticket Tiers & Quota Strategy
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure admission classes, seat quotas, pricing, and VIP privileges.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddTier}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Another Tier</span>
              </button>
            </div>

            {/* Quota Allocation Live Bar */}
            {/* <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Total Quota Allocated: </span>
                <span className="font-bold text-purple-700">{totalAllocatedSeats.toLocaleString()}</span> / {totalCapacity.toLocaleString()} arena capacity
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Estimated Gross Box Office: </span>
                <span className="font-bold text-emerald-700">₹{(estGrossRevenue / 10000000).toFixed(2)} Cr</span>
              </div>
            </div> */}

            {/* Tiers List */}
            <div className="space-y-4">
              {tiers.map((tier, idx) => (
                <div
                  key={tier.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 hover:border-purple-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3.5">
                    <div className="space-y-1 flex-[2] min-w-0">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700">Category Name</label>
                        <span className="text-[10px] text-slate-400 font-medium">Tier #{idx + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                        placeholder="e.g. VIP Front Pit"
                        className="w-full h-[38px] rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500 shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700">Price per Pass (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                          placeholder="Price"
                          className="w-full h-[38px] rounded-md border border-slate-200 bg-white pl-7 pr-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-purple-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700">Seats / Passes Quota</label>
                      <input
                        type="number"
                        value={tier.total}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleTierChange(idx, 'total', val);
                          handleTierChange(idx, 'available', val);
                        }}
                        placeholder="Total Quota"
                        className="w-full h-[38px] rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-purple-500 shadow-2xs"
                      />
                    </div>

                    {tiers.length > 1 && (
                      <div className="shrink-0 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveTier(tier.id)}
                          className="h-[30px] px-2 rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 inline-flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
                          title="Delete this tier"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-rose-500 group-hover:text-rose-700" />
                          {/* <span>Delete</span> */}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Poster Showcase & Image Upload (4 of 12 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-5">

          {/* 1. Banner Artwork & Preset Gallery */}
          <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Upload className="h-4 w-4 text-purple-600" />
                Event Banner & Cover Poster
              </h3>
              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP</span>
            </div>

            {/* File Upload Input */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                id="concert-artwork-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer border border-slate-200 rounded-md bg-slate-50/60 p-1.5 focus:outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
              />
              {imageUrl && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Custom banner loaded
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                  >
                    Reset Banner
                  </button>
                </div>
              )}
            </div>

            {/* Preset Showcase Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-semibold text-slate-600 block">
                Or pick high-resolution stage preset:
              </label>
              {/* <div className="grid grid-cols-2 gap-2">
                {PRESET_POSTERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative rounded-lg overflow-hidden border aspect-[16/10] group text-left transition-all cursor-pointer ${imageUrl === preset.url
                      ? 'border-purple-600 ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold text-white leading-tight">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div> */}
            </div>
          </div>

          {/* 2. Show Photo Gallery & YouTube Video Trailer */}
          <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs space-y-5">
            {/* Gallery Subsection */}
            <div className="space-y-3">
              <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-purple-600" />
                    Show Photo Gallery
                  </h3>
                  <p className="text-[11px] text-slate-500">Stage, crowd & venue highlights</p>
                </div>
                <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {galleryImages.length} Photos
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

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Upload Gallery Photos</span>
                </button>
                <span className="text-[11px] text-slate-400">Multiple files supported</span>
              </div>

              {/* Gallery Thumbnails Grid */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs"
                  >
                    <img
                      src={img}
                      alt={`Gallery Photo ${idx + 1}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Quick Add dashed placeholder */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                  title="Add more photos"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-[10px] font-semibold mt-0.5">Add</span>
                </button>
              </div>

              {/* Quick Preset Sample Chips */}
              <div className="pt-1.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Quick Add Stage Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_GALLERY_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetToGallery(preset.url)}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-colors cursor-pointer ${galleryImages.includes(preset.url)
                        ? 'bg-purple-100 text-purple-800 border-purple-200 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* YouTube Video Subsection */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Video className="h-4 w-4 text-rose-600" />
                    Official YouTube Video Trailer
                  </h3>
                  <p className="text-[11px] text-slate-500">Official teaser, trailer or concert aftermovie</p>
                </div>
                {getYouTubeVideoId(videoUrl) && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Stream Ready
                  </span>
                )}
              </div>

              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-rose-500" />
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="e.g. https://www.youtube.com/watch?v=kOCkne-Bku4"
                  className="w-full pl-9 pr-8 py-2 rounded-md border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:outline-none transition-all shadow-2xs"
                />
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    title="Clear video URL"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Responsive Embedded Player Preview */}
              {getYouTubeVideoId(videoUrl) ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-950 shadow-2xs">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${getYouTubeVideoId(videoUrl)}?rel=0`}
                    title="Concert Promo Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : videoUrl ? (
                <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  Please enter a valid YouTube video link (e.g. <span className="font-mono text-[11px]">https://www.youtube.com/watch?v=...</span>).
                </div>
              ) : null}
            </div>
          </div>

          {/* 3. Live Customer View Preview Card */}
          {/* <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                Live Card Preview
              </span>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Customer View
              </span>
            </div>


            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs group">
              <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                <img
                  src={imageUrl || PRESET_POSTERS[0].url}
                  alt={title || 'Concert Preview'}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                  {selectedGenres.map((g) => (
                    <span key={g} className="rounded-md bg-white/95 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow-2xs">
                      {g}
                    </span>
                  ))}
                  <span className="rounded-md bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white shadow-2xs">
                    {durationHours}
                  </span>
                </div>

     
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  {getYouTubeVideoId(videoUrl) && (
                    <span className="rounded-md bg-rose-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs flex items-center gap-1">
                      <Play className="h-2.5 w-2.5 fill-current" />
                      Trailer
                    </span>
                  )}
                  {galleryImages.length > 0 && (
                    <span className="rounded-md bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white shadow-2xs flex items-center gap-1">
                      <ImageIcon className="h-2.5 w-2.5" />
                      {galleryImages.length}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[11px] font-medium text-purple-300 block">
                    {artist || 'Artist Name'}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">
                    {title || 'Tour Stop Headline'}
                  </h4>
                </div>
              </div>

              <div className="p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {city}
                  </span>
                </div>

          <div className="flex flex-wrap items-center gap-1 pt-1">
            {selectedLanguages.map((l) => (
              <span key={l} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {l}
              </span>
            ))}
          </div>

     
          {galleryImages.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1 text-slate-700">
                  <ImageIcon className="h-3 w-3 text-purple-600" />
                  Show Photo Gallery
                </span>
                <span className="text-[10px] text-purple-600 font-medium">
                  {galleryImages.length} photos
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {galleryImages.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={img} alt={`Gallery thumb ${i + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-semibold">
            <span className="text-[11px] text-slate-400">Pricing from</span>
            <span className="text-sm text-purple-700">
              ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
            </span>
          </div>
        </div>
    </div>
          </div > */}


          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-200 transition-all cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Publish Tour Stop Live</span>
          </button>
        </div >
      </form >

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
