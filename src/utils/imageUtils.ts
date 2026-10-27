/**
 * Image URL normalization utility for DigitalRaiz Wayfor.
 *
 * Automatically resolves image sources whether they arrive as:
 * - Full absolute URLs (https://... or http://...)
 * - Local server relative upload paths (/uploads/..., upload/..., /images/...)
 * - Data URLs (data:image/...) or Blob URLs (blob:...)
 * - Empty/null/undefined values (with high-res fallback support)
 */

const rawApiUrl = (import.meta.env.VITE_API_URL as string) || '';
const rawServerUrl = (import.meta.env.VITE_SERVER_URL as string) || (import.meta.env.VITE_BACKEND_URL as string) || '';

/**
 * Base URL of the backend server hosting uploads (e.g. "http://localhost:5000").
 */
export const SERVER_BASE_URL: string = (
  rawServerUrl ||
  (rawApiUrl ? rawApiUrl.replace(/\/api\/?$/, '') : '') ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.origin
    : 'http://localhost:5000')
).replace(/\/$/, '');

/**
 * Default high-resolution fallback concert/event artwork.
 */
export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&auto=format&fit=crop&q=80';

/**
 * Default avatar fallback.
 */
export const DEFAULT_AVATAR_IMAGE =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

/**
 * Normalizes any image URL from backend response.
 *
 * @param path The raw path or full URL returned by backend API
 * @param fallback Optional fallback image if path is missing or invalid
 * @returns Fully qualified, browser-loadable image URL
 */
export function getImageUrl(path?: string | null, fallback: string = DEFAULT_FALLBACK_IMAGE): string {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return fallback;
  }

  const trimmed = path.trim();

  // Already a full or data URL
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Normalize windows backslashes and redundant leading slashes
  const normalizedPath = trimmed.replace(/\\/g, '/').replace(/^\/+/, '');

  return `${SERVER_BASE_URL}/${normalizedPath}`;
}
