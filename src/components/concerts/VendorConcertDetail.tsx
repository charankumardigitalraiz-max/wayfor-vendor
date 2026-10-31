import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  TrendingUp,
  Music,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Share2,
  Trash2,
  Edit3,
  DollarSign,
  UserCheck,
  ShieldCheck,
  Building,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Crown,
  Plus,
  Image as ImageIcon,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Radio,
  Smile,
  Theater,
  Wand2,
  Play,
  Volume2,
  Layers,
  Globe
} from 'lucide-react';
import type { ConcertEvent, AttendeeBooking } from '../../types';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';
import { Table, type Column } from '../common/Table';
import { Pagination } from '../common/Pagination';
import { AppImage } from '../common/AppImage';
import { BookTicketModal } from './BookTicketModal';
import { formatUtcDate, formatUtcTime } from '../../utils/dateUtils';
import { vendorConcertService } from '../../services/vendorConcertService';
import { EVENT_CATEGORIES, type EventCategoryType } from './CreateConcertScreen';

const getEventCategoryConfig = (concert: ConcertEvent) => {
  if (concert.eventCategory && concert.eventCategory in EVENT_CATEGORIES) {
    return EVENT_CATEGORIES[concert.eventCategory as EventCategoryType];
  }
  const lowerGenre = (concert.genre || '').toLowerCase();
  const lowerTitle = (concert.title || '').toLowerCase();
  if (lowerGenre.includes('comedy') || lowerGenre.includes('stand-up') || lowerTitle.includes('comedy')) {
    return EVENT_CATEGORIES.comedy;
  }
  if (
    lowerGenre.includes('edm') ||
    lowerGenre.includes('techno') ||
    lowerGenre.includes('house') ||
    lowerGenre.includes('dj') ||
    lowerTitle.includes('dj') ||
    lowerTitle.includes('afterlife') ||
    lowerTitle.includes('electronic')
  ) {
    return EVENT_CATEGORIES['dj-electronic'];
  }
  if (lowerGenre.includes('theatre') || lowerGenre.includes('drama') || lowerGenre.includes('play')) {
    return EVENT_CATEGORIES.theatre;
  }
  if (lowerGenre.includes('dance') || lowerGenre.includes('choreography')) {
    return EVENT_CATEGORIES.dance;
  }
  if (lowerGenre.includes('magic') || lowerGenre.includes('illusion') || lowerGenre.includes('mentalism')) {
    return EVENT_CATEGORIES['magic-variety'];
  }
  return EVENT_CATEGORIES.music;
};

interface VendorConcertDetailProps {
  concerts: ConcertEvent[];
  attendees: AttendeeBooking[];
  onStatusChange: (id: string, status: ConcertEvent['status']) => void;
  onDeleteConcert: (id: string) => void;
  onToggleCheckIn: (bookingId: string) => void;
  onShowToast: (msg: string) => void;
  onAddBooking?: (booking: AttendeeBooking) => void;
}

export const VendorConcertDetail: React.FC<VendorConcertDetailProps> = ({
  concerts,
  attendees,
  onStatusChange,
  onDeleteConcert,
  onToggleCheckIn,
  onShowToast,
  onAddBooking
}) => {
  const { concertId } = useParams<{ concertId: string }>();
  const navigate = useNavigate();

  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeFilter, setAttendeeFilter] = useState<'all' | 'checkedIn' | 'pending'>('all');

  const [attendeePage, setAttendeePage] = useState(1);
  const [attendeePageSize, setAttendeePageSize] = useState(5);

  // Booking Modal State
  const [isBookTicketOpen, setIsBookTicketOpen] = useState(false);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(true);

  const concert = concerts.find(c => c.id === concertId) || concerts[0];

  const categoryConfig = useMemo(() => {
    return concert ? getEventCategoryConfig(concert) : EVENT_CATEGORIES.music;
  }, [concert]);

  // Gallery and Lightbox State
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const handleScrollThumbs = (direction: 'up' | 'down') => {
    if (thumbsRef.current) {
      const scrollAmount = direction === 'up' ? -108 : 108;
      thumbsRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  // Fallback demo gallery photos if stored concert doesn't have gallery defined yet
  const galleryImages = useMemo(() => {
    if (concert?.gallery && concert.gallery.length > 0) {
      return concert.gallery;
    }
    return [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=900&auto=format&fit=crop&q=80'
    ];
  }, [concert?.gallery]);

  const allImages = useMemo(() => {
    if (!concert) return [];
    const list = [concert.image, ...galleryImages];
    return Array.from(new Set(list.filter(Boolean)));
  }, [concert?.image, galleryImages]);

  const currentDisplayImage = activePreviewImage || concert?.image || '';

  // Reset active preview when concert changes
  useEffect(() => {
    setActivePreviewImage(null);
  }, [concert?.id]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, allImages.length]);

  if (!concert) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-3">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-semibold text-slate-800">Concert Not Found</h3>
        <p className="text-xs text-slate-500">The event could not be located in your vendor roster.</p>
        <button
          onClick={() => navigate('/concerts')}
          className="mt-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white cursor-pointer"
        >
          Return to All Concerts
        </button>
      </div>
    );
  }

  // Filter attendees for this concert
  const eventAttendees = attendees.filter(a => a.concertId === concert.id || a.concertTitle === concert.title);
  const filteredAttendees = eventAttendees.filter(a => {
    const q = attendeeSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.customerName.toLowerCase().includes(q) ||
      a.ticketCode.toLowerCase().includes(q) ||
      a.orderNumber.toLowerCase().includes(q) ||
      a.ticketTier.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (attendeeFilter === 'checkedIn' && !a.checkedIn) return false;
    if (attendeeFilter === 'pending' && a.checkedIn) return false;
    return true;
  });

  const totalAttendeePages = Math.max(1, Math.ceil(filteredAttendees.length / attendeePageSize));
  const safeAttendeePage = Math.min(Math.max(1, attendeePage), totalAttendeePages);
  const startAttendeeIdx = (safeAttendeePage - 1) * attendeePageSize;
  const paginatedAttendees = filteredAttendees.slice(startAttendeeIdx, startAttendeeIdx + attendeePageSize);

  const soldPct = Math.round((concert.ticketsSold / concert.totalCapacity) * 100);
  const avgPrice = (concert.minPrice + concert.maxPrice) / 2;
  const grossEst = concert.ticketsSold * avgPrice;
  const checkedInCount = eventAttendees.filter(a => a.checkedIn).length;
  const totalTierQuota = concert.ticketTiers.reduce((acc, t) => acc + t.total, 0);
  const totalTierAvailable = concert.ticketTiers.reduce((acc, t) => acc + t.available, 0);
  const totalTierSold = totalTierQuota - totalTierAvailable;
  const totalTierRevenue = concert.ticketTiers.reduce((acc, t) => acc + (t.total - t.available) * t.price, 0);
  const totalTierSoldPct = totalTierQuota > 0 ? Math.round((totalTierSold / totalTierQuota) * 100) : 0;

  const attendeeColumns: Column<AttendeeBooking>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket Code',
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/80 shadow-2xs">
          {item.ticketCode}
        </span>
      )
    },
    {
      key: 'customerName',
      header: 'Attendee Name',
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-purple-100 text-purple-700 border border-purple-200/70 flex items-center justify-center font-medium text-xs shrink-0">
            {item.customerName.charAt(0)}
          </div>
          <div>
            <span className="font-medium text-slate-900 block">{item.customerName}</span>
            <span className="text-[11px] text-slate-500 font-normal">{item.customerEmail}</span>
          </div>
        </div>
      )
    },
    {
      key: 'ticketTier',
      header: 'Tier & Seats',
      render: (item) => {
        const lower = item.ticketTier.toLowerCase();
        const tierColor = lower.includes('vvip')
          ? 'text-amber-700'
          : lower.includes('vip')
            ? 'text-purple-700'
            : lower.includes('standing') || lower.includes('phase')
              ? 'text-blue-700'
              : 'text-emerald-700';

        return (
          <div>
            <span className={`font-medium block ${tierColor}`}>{item.ticketTier}</span>
            <span className="text-[11px] text-slate-500 font-normal">{item.seatsCount} admission(s) • ₹{item.totalPaid.toLocaleString()}</span>
          </div>
        );
      }
    },
    {
      key: 'checkedIn',
      header: 'Attendance Status',
      render: (item) => (
        <div>
          {item.checkedIn ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Admitted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 whitespace-nowrap">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              Pending Check-In
            </span>
          )}
        </div>
      )
    },
    {
      key: 'checkInDate',
      header: 'Check-In Timestamp',
      render: (item) => {
        if (!item.checkedIn || !item.checkedInAt) {
          return (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-normal">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="italic">Not checked in</span>
            </div>
          );
        }

        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
              <Calendar className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              <span>{formatUtcDate(item.checkedInAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-normal pl-5">
              <Clock className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{formatUtcTime(item.checkedInAt)}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (item) => (
        <button
          type="button"
          onClick={() => {
            onToggleCheckIn(item.id);
            onShowToast(item.checkedIn ? `Check-in reverted for ${item.customerName}` : `Checked in ${item.customerName}!`);
          }}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${item.checkedIn
            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
        >
          {item.checkedIn ? 'Revert Check-in' : 'Mark Checked-in'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Navigation matching Redesign */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 py-1 text-[13px] font-medium text-slate-500 hover:text-purple-700 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-purple-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={concert.status}
              onChange={(e) => onStatusChange(concert.id, e.target.value as ConcertEvent['status'])}
              className="appearance-none h-9 rounded-lg border border-purple-200 bg-[#FAF5FF] pl-3.5 pr-8 text-xs font-semibold text-purple-700 outline-none focus:border-purple-500 cursor-pointer shadow-2xs hover:bg-purple-100/60 transition-colors"
            >
              <option value="active">● Active Live</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-purple-600 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => navigate(`/concerts/${concert.id}/edit`)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[#dfe3ea] bg-white hover:bg-[#FAF5FF] hover:border-purple-200 hover:text-purple-700 text-xs font-semibold text-[#475467] transition-all cursor-pointer shadow-2xs shrink-0"
            title="Edit Concert Details"
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-500" />
            <span>Edit Event</span>
          </button>

          {totalTierAvailable > 0 && (
            <button
              type="button"
              onClick={() => setIsBookTicketOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-purple-600 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs shadow-purple-200 transition-all cursor-pointer shrink-0"
            >
              <Ticket className="h-3.5 w-3.5" />
              <span>Book a Ticket</span>
            </button>
          )}
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] gap-6 bg-white border border-[#e8ebf0] rounded-[16px] p-5 shadow-[0_8px_28px_rgba(34,42,58,0.05)]">
        {/* Column 1: Gallery */}
        <div className="flex flex-col gap-2.5 min-w-0">
          {/* Main Poster */}
          <div
            onClick={() => {
              const idx = allImages.indexOf(currentDisplayImage);
              setSelectedImageIdx(idx >= 0 ? idx : 0);
              setIsLightboxOpen(true);
            }}
            className="relative aspect-[16/11] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer group w-full"
            title="Click to view full photo"
          >
            <AppImage
              src={currentDisplayImage}
              alt={concert.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Top Floating Chips */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              {concert.ageRestriction ? (
                <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-medium text-slate-700 border border-slate-200/60 shadow-xs">
                  {concert.ageRestriction}
                </span>
              ) : <div />}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-md text-slate-700 p-1 rounded-md text-xs shadow-xs border border-slate-200/60">
                <Maximize2 className="h-3 w-3" />
              </div>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/75 backdrop-blur-md text-[10px] font-medium text-purple-200 border border-purple-500/20">
                <categoryConfig.icon className="h-3 w-3 text-purple-400" />
                <span>{categoryConfig.shortName}</span>
              </span>

              {allImages.length > 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/75 backdrop-blur-md text-[10px] font-medium text-white/90 border border-white/10">
                  <ImageIcon className="h-3 w-3" />
                  <span>{allImages.length} Photos</span>
                </span>
              )}
            </div>
          </div>

          {/* Horizontal Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden">
              {allImages.map((img, idx) => {
                const isActive = currentDisplayImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActivePreviewImage(img);
                      setSelectedImageIdx(idx);
                    }}
                    className={`relative w-[52px] h-[38px] rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${isActive
                      ? 'border-2 border-purple-600 ring-2 ring-purple-100'
                      : 'border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100'
                      }`}
                    title={`View photo ${idx + 1}`}
                  >
                    <AppImage
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Column 2: Event Details */}
        <div className="min-w-0 flex flex-col justify-start py-0.5 space-y-3 sm:space-y-3.5">
          {/* Top: Status Badges, Headline, Lineup */}
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge status={concert.status} />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 text-[11px] font-medium text-purple-700">
                  <categoryConfig.icon className="h-3 w-3" />
                  <span>{categoryConfig.name}</span>
                </span>
                {concert.tourName && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200/70 px-2.5 py-0.5 text-[11px] font-medium text-slate-600" title={concert.tourName}>
                    {concert.tourName}
                  </span>
                )}
              </div>

              {concert.videoUrl && (
                <a
                  href={concert.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 text-[11px] font-medium transition-colors"
                >
                  <Play className="h-3 w-3 fill-rose-700" />
                  <span>Promo Video</span>
                </a>
              )}
            </div>

            {/* Clean Title */}
            <h1 className="text-xl sm:text-2xl lg:text-[25px] font-semibold tracking-[-0.03em] text-[#172033] leading-snug">
              {concert.title}
            </h1>

            {/* Clean Inline Lineup */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-2 text-[#667085] text-[13px]">
              <span className="inline-flex items-center gap-1">
                {categoryConfig.performerLabel.split('/')[0].trim()}: <strong className="text-purple-700 font-semibold">{concert.artist}</strong>
              </span>
              {concert.supportingActs && concert.supportingActs.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#c4c9d1] shrink-0" />
                  <span>
                    {categoryConfig.lineupLabel.split('&')[0].trim()}: <span className="text-[#344054] font-medium">{concert.supportingActs.join(', ')}</span>
                  </span>
                </span>
              )}
              {(concert.genres && concert.genres.length > 0 ? concert.genres : [concert.genre || categoryConfig.defaultGenre]).length > 0 && (
                <span className="inline-flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#c4c9d1] shrink-0" />
                  <span className="text-slate-500 font-normal">
                    {(concert.genres && concert.genres.length > 0 ? concert.genres : [concert.genre || categoryConfig.defaultGenre]).join(', ')}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* 4 Cards Grid Layout (2 cards per row on desktop, covering space without empty gaps or truncation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Card 1: Schedule & Doors */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[#697586] text-[11px] font-medium mb-0.5">Event Date & Showtime</span>
                <span className="block text-[#1f2937] text-[13px] font-semibold leading-snug">
                  {formatUtcDate(concert.date)}
                </span>
                <span className="block text-purple-700 text-[11px] font-medium mt-0.5">
                  Doors {concert.doorsOpen} • Starts {concert.showTime || '20:00'}
                </span>
              </div>
            </div>

            {/* Card 2: Venue & Location */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-[#effaf6] text-[#16866b] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[#697586] text-[11px] font-medium mb-0.5">Venue & Staging</span>
                <span className="block text-[#1f2937] text-[13px] font-semibold leading-snug">
                  {concert.venueName}, {concert.city}
                </span>
                {/* <span className="block text-slate-500 text-[11px] font-normal mt-0.5">
                  {concert.soundSystem ? `Acoustics: ${concert.soundSystem}` : `${concert.city}, India`}
                </span> */}
              </div>
            </div>

            {/* Card 3: Ticket Pricing */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-[#fff8e8] text-[#b46a00] flex items-center justify-center shrink-0 mt-0.5">
                <Ticket className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[#697586] text-[11px] font-medium mb-0.5">Ticket Pricing & Categories</span>
                <span className="block text-[#1f2937] text-[13px] font-semibold leading-snug">
                  ₹{concert.minPrice.toLocaleString()} – ₹{concert.maxPrice.toLocaleString()}
                </span>
                <span className="block text-amber-700 text-[11px] font-medium mt-0.5">
                  Avg ₹{Math.round(avgPrice).toLocaleString()} / pass • {concert.ticketTiers.length} Active Tiers
                </span>
              </div>
            </div>

            {/* Card 4: Capacity & Allocation */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
                <Users className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[#697586] text-[11px] font-medium mb-0.5">Total Capacity & Sales</span>
                <span className="block text-[#1f2937] text-[13px] font-semibold leading-snug">
                  {concert.totalCapacity.toLocaleString()} Total Passes
                </span>
                <span className="block text-blue-700 text-[11px] font-medium mt-0.5">
                  {concert.ticketsSold.toLocaleString()} sold ({soldPct}% allocated)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 4 Metric Cards reflecting Event Details from Concert Creation */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Event Classification"
          value={categoryConfig.shortName}
          isPositive={true}
          change={concert.genre || categoryConfig.defaultGenre}
          subtext={concert.genres && concert.genres.length > 1 ? concert.genres.join(' • ') : categoryConfig.tagline}
          icon={categoryConfig.icon as any}
          accentColor="purple"
        />

        <MetricCard
          label="Showtime & Duration"
          value={concert.showTime ? `${concert.showTime} Show` : 'Evening Event'}
          isPositive={true}
          change={concert.durationHours || categoryConfig.defaultDuration}
          subtext={`Doors entry at ${concert.doorsOpen}`}
          icon={Clock}
          accentColor="indigo"
        />

        <MetricCard
          label="Venue & Audio Array"
          value={`${concert.totalCapacity.toLocaleString()} Capacity`}
          isPositive={true}
          change={concert.soundSystem ? concert.soundSystem.split(' ')[0] + ' ' + (concert.soundSystem.split(' ')[1] || 'Rig') : 'Arena Staging'}
          subtext={concert.venueName}
          icon={Building}
          accentColor="amber"
        />

        <MetricCard
          label="Est. Gross Box Office"
          value={concert.isFree ? 'Free Admission' : `₹${(grossEst / 10000000).toFixed(2)} Cr`}
          isPositive={true}
          change={concert.isFree ? 'Open Entry' : `${soldPct}% Sold`}
          subtext={concert.isFree ? 'Community Pass' : `${concert.ticketTiers.length} Tiered Categories`}
          icon={TrendingUp}
          accentColor="emerald"
        />
      </div> */}

      {/* Event Production Specifications & Setup Details */}
      <div className="rounded-xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden transition-all">
        {/* Header with Title and Toggle */}
        <div className="p-3.5 sm:px-5 sm:py-3.5 border-b border-slate-100 bg-white flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-[13px] font-semibold text-slate-900">Event Production Specifications & Schedule</h3>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                  {categoryConfig.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Live staging parameters, technical sound rig, and production schedule</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/concerts/${concert.id}/edit`)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/70 transition-colors cursor-pointer"
            >
              <Edit3 className="h-3 w-3" />
              <span>Edit Specs</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              title={isSpecsExpanded ? 'Collapse specifications' : 'Expand specifications'}
              aria-label="Toggle event specifications"
            >
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSpecsExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Proper 4-Cards Grid (2 cards per row on desktop) */}
        {isSpecsExpanded && (
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/40">
            {/* Card 1: Creative & Performer Lineup */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
              <div className="flex items-center gap-3 pb-2.5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <categoryConfig.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[13px] font-semibold text-slate-900 leading-tight">Creative & Performer Lineup</h4>
                  {/* <p className="text-[11px] text-slate-400 mt-0.5">Classification, headliner, and production style</p> */}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Category Classification</span>
                  <span className="font-semibold text-slate-800 text-right">{categoryConfig.name}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">{categoryConfig.performerLabel}</span>
                  <span className="font-semibold text-purple-700 text-right">{concert.artist}</span>
                </div>

                {concert.supportingActs && concert.supportingActs.length > 0 && (
                  <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                    <span className="text-[11px] text-slate-500 font-medium">{categoryConfig.lineupLabel}</span>
                    <span className="font-medium text-slate-700 text-right truncate max-w-[220px]" title={concert.supportingActs.join(', ')}>
                      {concert.supportingActs.join(', ')}
                    </span>
                  </div>
                )}

                {concert.tourName && (
                  <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                    <span className="text-[11px] text-slate-500 font-medium">Tour / Production Run</span>
                    <span className="font-medium text-slate-800 text-right truncate max-w-[220px]" title={concert.tourName}>
                      {concert.tourName}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">{categoryConfig.genreLabel}</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {(concert.genres && concert.genres.length > 0 ? concert.genres : [concert.genre || categoryConfig.defaultGenre]).map((g, i) => (
                      <span key={i} className="inline-block px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200/60">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Show Schedule & Performance Timings */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
              <div className="flex items-center gap-3 pb-2.5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[13px] font-semibold text-slate-900 leading-tight">Show Schedule & Timings</h4>
                  {/* <p className="text-[11px] text-slate-400 mt-0.5">Event date, gate entry, and main stage timings</p> */}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Event Date</span>
                  <span className="font-semibold text-slate-800 text-right">{formatUtcDate(concert.date)}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Doors / Gate Entry</span>
                  <span className="font-semibold text-slate-800 text-right">{concert.doorsOpen}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Main Showtime</span>
                  <span className="font-bold text-purple-700 text-right">{concert.showTime || '20:00'}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Performance Duration</span>
                  <span className="font-medium text-slate-800 text-right">{concert.durationHours || categoryConfig.defaultDuration}</span>
                </div>

                {concert.languages && concert.languages.length > 0 && (
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-500 font-medium">Languages / Medium</span>
                    <span className="font-medium text-slate-700 text-right truncate max-w-[220px]" title={concert.languages.join(', ')}>
                      {concert.languages.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Venue & Technical Infrastructure */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
              <div className="flex items-center gap-3 pb-2.5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[13px] font-semibold text-slate-900 leading-tight">Venue & Technical Staging</h4>
                  {/* <p className="text-[11px] text-slate-400 mt-0.5">Arena capacity, audio line array, and address</p> */}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Venue Name</span>
                  <span className="font-semibold text-slate-800 text-right">{concert.venueName}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Total Arena Capacity</span>
                  <span className="font-semibold text-slate-800 text-right">{concert.totalCapacity.toLocaleString()} seats</span>
                </div>

                {concert.soundSystem && (
                  <div className="py-1 border-b border-slate-50">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500 font-medium shrink-0">Sound Rig & Line Array</span>
                      <span className="font-medium text-slate-800 text-right text-xs truncate max-w-[240px]" title={concert.soundSystem}>
                        {concert.soundSystem}
                      </span>
                    </div>
                  </div>
                )}

                <div className="py-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500 font-medium shrink-0">Venue Location</span>
                    <span className="font-medium text-slate-700 text-right text-xs truncate max-w-[240px]" title={concert.venueAddress || `${concert.venueName}, ${concert.city}`}>
                      {concert.venueAddress || `${concert.venueName}, ${concert.city}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Policies, Media & Guidelines */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
              <div className="flex items-center gap-3 pb-2.5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[13px] font-semibold text-slate-900 leading-tight">Policies, Entity & Media</h4>
                  {/* <p className="text-[11px] text-slate-400 mt-0.5">Age policy, promoter management, and admission</p> */}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Age Restriction</span>
                  <span className="font-semibold text-slate-800 text-right">{concert.ageRestriction || categoryConfig.defaultAge}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Promoter / Organizer</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[220px]" title={concert.organizer}>
                    {concert.organizer}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium">Admission Mode</span>
                  <span className="font-medium text-slate-800 text-right">
                    {concert.isFree ? 'Free Community Entry' : 'Paid Tiered Box Office'}
                  </span>
                </div>

                {concert.videoUrl && (
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-500 font-medium">Promo Media</span>
                    <a
                      href={concert.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200/70 transition-colors"
                    >
                      <Play className="h-3 w-3 fill-purple-700" />
                      <span>Watch Promo Video</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Tiers & Allocations Card */}
      <div className="rounded-lg border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
        {/* Header Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Ticket className="h-4 w-4 text-purple-600" />
              <span>Ticket Tiers & Quota Allocations</span>
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {totalTierAvailable > 0 && (
              <button
                type="button"
                onClick={() => setIsBookTicketOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs shadow-purple-200 transition-all cursor-pointer"
              >
                <Plus className="h-3 w-3 stroke-[2.5]" />
                <span>Book Ticket</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Tier Category</th>
                <th className="py-3.5 px-4">Price / Pass</th>
                <th className="py-3.5 px-4 min-w-[180px]">Quota & Sales</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Gross Inflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
              {concert.ticketTiers.map((tier, idx) => {
                const tierSold = tier.total - tier.available;
                const tierPercent = Math.round((tierSold / (tier.total || 1)) * 100);
                const tierRevenue = tierSold * tier.price;
                const isSoldOut = tier.available === 0;
                const isSellingFast = tierPercent >= 80 && !isSoldOut;

                const lowerName = tier.name.toLowerCase();
                const tierBadgeStyle = lowerName.includes('vvip')
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : lowerName.includes('vip')
                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                    : lowerName.includes('standing') || lowerName.includes('floor') || lowerName.includes('mosh')
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                return (
                  <tr
                    key={idx}
                    className="hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg border flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs ${tierBadgeStyle}`}>
                          {tier.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{tier.name}</div>
                          <div className="text-[11px] text-slate-500">
                            <span className="font-medium text-slate-700">{tier.available.toLocaleString()}</span> available of {tier.total.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      ₹{tier.price.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-medium text-slate-700">{tierSold.toLocaleString()} sold</span>
                        <span className="font-semibold text-purple-700">{tierPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isSoldOut
                            ? 'bg-rose-500'
                            : isSellingFast
                              ? 'bg-amber-500'
                              : 'bg-purple-600'
                            }`}
                          style={{ width: `${tierPercent}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isSoldOut ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                          Sold Out
                        </span>
                      ) : isSellingFast ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                          Selling Fast
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                          Available
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right text-[13px] font-bold text-purple-700 whitespace-nowrap">
                      ₹{tierRevenue.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-800">
              <tr>
                <td className="py-3.5 px-5">
                  <div className="font-semibold text-slate-900">Total Portfolio Allocation</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    {totalTierAvailable.toLocaleString()} remaining across {concert.ticketTiers.length} categories
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                  Avg ₹{Math.round(totalTierQuota > 0 ? (concert.ticketTiers.reduce((acc, t) => acc + t.price * t.total, 0) / totalTierQuota) : 0).toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-800">{totalTierSold.toLocaleString()} total sold</span>
                    <span className="font-semibold text-purple-700">{totalTierSoldPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all duration-500"
                      style={{ width: `${totalTierSoldPct}%` }}
                    />
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100/80 text-purple-800 border border-purple-200/80 shadow-2xs">
                    {concert.ticketTiers.length} Active Categories
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right font-extrabold text-sm text-purple-800 whitespace-nowrap">
                  ₹{totalTierRevenue.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Book Concert Ticket Modal */}
      <BookTicketModal
        isOpen={isBookTicketOpen}
        onClose={() => setIsBookTicketOpen(false)}
        concert={concert}
        onAddBooking={onAddBooking}
        onShowToast={onShowToast}
      />

      {/* Photo Lightbox Modal */}
      {
        isLightboxOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar */}
            <div
              className="flex items-center justify-between text-white max-w-6xl w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/10 text-white/90">
                  {selectedImageIdx + 1} / {allImages.length}
                </span>
                <span className="text-xs text-white/70 font-medium truncate max-w-xs sm:max-w-md">
                  {concert.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Center Image with Prev / Next */}
            <div
              className="relative flex items-center justify-center flex-1 max-w-6xl w-full mx-auto my-3 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
                  }
                  className="absolute left-2 sm:left-4 z-10 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-sm transition-all cursor-pointer shadow-lg hover:scale-105"
                  title="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <div className="relative max-h-[72vh] max-w-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <AppImage
                  src={allImages[selectedImageIdx]}
                  alt={`${concert.title} photo ${selectedImageIdx + 1}`}
                  className="max-h-[72vh] max-w-full object-contain"
                />
              </div>

              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
                  }
                  className="absolute right-2 sm:right-4 z-10 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-sm transition-all cursor-pointer shadow-lg hover:scale-105"
                  title="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails Strip */}
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto max-w-3xl w-full mx-auto pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-md overflow-hidden border shrink-0 transition-all cursor-pointer ${selectedImageIdx === idx
                    ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105'
                    : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/50'
                    }`}
                  title={`Jump to photo ${idx + 1}`}
                >
                  <AppImage
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )
      }
    </div>
  );
};
