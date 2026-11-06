import React from 'react';

interface IconProps {
  className?: string;
}

/**
 * Professional App Icon for "Concerts & Events" Module
 * Theme: Arena Tours, Neon Stage Acoustics & Vinyl Disc
 */
export const ConcertsAppIcon: React.FC<IconProps> = ({ className = 'w-14 h-14' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Concerts & Events Icon"
  >
    <defs>
      <linearGradient id="c-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9333EA" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#D946EF" />
      </linearGradient>
      <linearGradient id="c-disc" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
      </linearGradient>
      <filter id="c-drop" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#7C3AED" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Squircle Background & Gloss */}
    <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#c-bg)" filter="url(#c-drop)" />
    <rect x="2.5" y="2.5" width="59" height="59" rx="15.5" stroke="white" strokeOpacity="0.28" strokeWidth="1" />

    {/* Spotlight Arena Beams */}
    <path d="M8 58L26 20L38 20L56 58Z" fill="white" fillOpacity="0.07" />

    {/* Vinyl Disc Body & Acoustic Grooves */}
    <circle cx="32" cy="32" r="20" fill="url(#c-disc)" stroke="white" strokeOpacity="0.2" strokeWidth="0.8" />
    <circle cx="32" cy="32" r="16" stroke="white" strokeOpacity="0.18" strokeWidth="0.7" strokeDasharray="3 3" />
    <circle cx="32" cy="32" r="11" stroke="white" strokeOpacity="0.25" strokeWidth="0.8" />

    {/* Center Red Record Core */}
    <circle cx="32" cy="32" r="5" fill="#F43F5E" />
    <circle cx="32" cy="32" r="1.8" fill="white" />

    {/* Floating 3D Music Note */}
    <path
      d="M36 17V33.2C34.8 32.4 33 32 31 32C27.7 32 25 34.2 25 37C25 39.8 27.7 42 31 42C34.3 42 37 39.8 37 37V22L45 19.5V28.2C43.8 27.4 42 27 40 27C36.7 27 34 29.2 34 32C34 34.8 36.7 37 40 37C43.3 37 46 34.8 46 32V14L36 17Z"
      fill="white"
      fillRule="evenodd"
      clipRule="evenodd"
    />

    {/* Neon Arena Sparkles */}
    <path
      d="M16 16C16 18.5 14.5 20 14.5 20C14.5 20 16 21.5 16 24C16 21.5 17.5 20 17.5 20C17.5 20 16 18.5 16 16Z"
      fill="#FDE047"
    />
    <path
      d="M48 44C48 45.5 47 46.5 47 46.5C47 46.5 48 47.5 48 49C48 47.5 49 46.5 49 46.5C49 46.5 48 45.5 48 44Z"
      fill="white"
      fillOpacity="0.9"
    />
  </svg>
);

/**
 * Professional App Icon for "Stranger Meets" Module
 * Theme: Community Mixers, Verified Buddies & Radiant Connections
 */
export const StrangerMeetsAppIcon: React.FC<IconProps> = ({ className = 'w-14 h-14' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Stranger Meets Icon"
  >
    <defs>
      <linearGradient id="sm-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0D9488" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <filter id="sm-drop" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#059669" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Squircle Background & Gloss */}
    <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#sm-bg)" filter="url(#sm-drop)" />
    <rect x="2.5" y="2.5" width="59" height="59" rx="15.5" stroke="white" strokeOpacity="0.28" strokeWidth="1" />

    {/* Primary Member Silhouette */}
    <circle cx="25" cy="24" r="7" fill="white" fillOpacity="0.95" />
    <path
      d="M14 45C14 38.5 19 35 25 35C31 35 36 38.5 36 45"
      stroke="white"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Companion Buddy Silhouette with Mint Glow */}
    <circle cx="41" cy="26" r="6" fill="#A7F3D0" />
    <path
      d="M33 46C33.5 40.5 37 37.5 42 37.5C47 37.5 50.5 40.5 51 46"
      stroke="#A7F3D0"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />

    {/* Connection Sparkle Flare */}
    <path
      d="M33 15C33 20 29 22 29 22C29 22 33 24 33 29C33 24 37 22 37 22C37 22 33 20 33 15Z"
      fill="#FDE047"
    />
    <circle cx="33" cy="22" r="1.5" fill="white" />

    {/* Accent Stars */}
    <circle cx="49" cy="16" r="1.5" fill="white" fillOpacity="0.85" />
    <circle cx="15" cy="21" r="1.2" fill="#FDE047" />
  </svg>
);

/**
 * Professional App Icon for "Trip Pool (Trip Planner)" Module
 * Theme: Mountain Expeditions, Sunrise & Geographic Waypoints
 */
export const TripPoolAppIcon: React.FC<IconProps> = ({ className = 'w-14 h-14' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Trip Pool Icon"
  >
    <defs>
      <linearGradient id="tp-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="tp-sun" x1="32" y1="12" x2="32" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#F97316" stopOpacity="0.85" />
      </linearGradient>
      <filter id="tp-drop" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#EA580C" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Squircle Background & Gloss */}
    <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#tp-bg)" filter="url(#tp-drop)" />
    <rect x="2.5" y="2.5" width="59" height="59" rx="15.5" stroke="white" strokeOpacity="0.28" strokeWidth="1" />

    {/* Sunrise Glow */}
    <circle cx="32" cy="24" r="10" fill="url(#tp-sun)" />

    {/* Mountain Range */}
    {/* Rear Mountain */}
    <path d="M22 45L34 27L46 45H22Z" fill="#7C2D12" fillOpacity="0.4" />
    <path d="M34 27L30.5 33.5L35 34.5L34 27Z" fill="white" fillOpacity="0.6" />

    {/* Foreground Mountain */}
    <path d="M11 47L24 29L38 47H11Z" fill="#991B1B" fillOpacity="0.55" />
    <path d="M24 29L20 36L25.5 37L24 29Z" fill="white" fillOpacity="0.8" />

    {/* Winding Expedition Route Trail */}
    <path
      d="M32 38C30 42 34 44 32 49"
      stroke="#FDE047"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="2 3"
    />

    {/* Waypoint Marker Pin */}
    <g transform="translate(36, 11)">
      <path
        d="M8 0C3.6 0 0 3.6 0 8C0 14 8 22 8 22C8 22 16 14 16 8C16 3.6 12.4 0 8 0Z"
        fill="white"
      />
      <circle cx="8" cy="8" r="3.5" fill="#DC2626" />
      <circle cx="8" cy="8" r="1.5" fill="white" />
    </g>
  </svg>
);

/**
 * Professional App Icon for "Carpooling & Fleet" Module
 * Theme: Smart Commuter Fleet, Aerodynamic EV & Highway Telemetry
 */
export const CarpoolingAppIcon: React.FC<IconProps> = ({ className = 'w-14 h-14' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Carpooling & Fleet Icon"
  >
    <defs>
      <linearGradient id="cp-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="50%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="cp-car" x1="14" y1="22" x2="50" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E0E7FF" />
      </linearGradient>
      <filter id="cp-drop" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4F46E5" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Squircle Background & Gloss */}
    <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#cp-bg)" filter="url(#cp-drop)" />
    <rect x="2.5" y="2.5" width="59" height="59" rx="15.5" stroke="white" strokeOpacity="0.28" strokeWidth="1" />

    {/* Highway Route Perspective */}
    <path d="M15 53L26 39" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <path d="M49 53L38 39" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 53L32 45" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />

    {/* EV Windshield & Roof */}
    <path
      d="M20 28L25 19C26 17.5 28 17 30 17H34C36 17 38 17.5 39 19L44 28"
      fill="#1E1B4B"
      fillOpacity="0.6"
    />
    <path
      d="M22 27L26 20C26.5 19 28 18.5 29.5 18.5H34.5C36 18.5 37.5 19 38 20L42 27H22Z"
      fill="#93C5FD"
      fillOpacity="0.6"
    />

    {/* Vehicle Chassis */}
    <path
      d="M15 31C15 29 17 28 19 28H45C47 28 49 29 49 31L51 36C51.5 37.5 50.5 39 49 39H15C13.5 39 12.5 37.5 13 36L15 31Z"
      fill="url(#cp-car)"
    />

    {/* Headlights */}
    <rect x="16" y="32" width="6" height="3" rx="1.5" fill="#FDE047" />
    <rect x="42" y="32" width="6" height="3" rx="1.5" fill="#FDE047" />

    {/* Grille Accent */}
    <rect x="25" y="33" width="14" height="2" rx="1" fill="#4B5563" />

    {/* Wheels */}
    <rect x="15" y="38" width="8" height="5" rx="2" fill="#111827" />
    <rect x="41" y="38" width="8" height="5" rx="2" fill="#111827" />

    {/* Fleet Telemetry Arcs */}
    <path
      d="M28 13C30.5 11.5 33.5 11.5 36 13"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M25 9C29.5 7 34.5 7 39 9"
      stroke="white"
      strokeOpacity="0.75"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="32" cy="15" r="1.5" fill="#FDE047" />
  </svg>
);

