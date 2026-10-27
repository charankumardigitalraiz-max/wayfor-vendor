/**
 * UTC Date and Time parsing and formatting utilities for DigitalRaiz Wayfor.
 *
 * Backend APIs consistently return timestamps in UTC:
 * - "2026-10-27T07:30:00Z"
 * - "2026-10-27T07:30:00.000Z"
 * - "2026-10-27T07:30:00" (ISO without trailing Z - correctly treated as UTC)
 * - "2026-10-27" (Date-only string - prevented from day-shift rollback)
 *
 * Converts UTC timestamps into the user's local timezone (e.g. IST, etc.)
 * with clean, human-readable formatting.
 */

/**
 * Safely parses any date string from a backend API, ensuring UTC is respected.
 *
 * @param value Date string, number timestamp, or Date object
 * @returns Valid Date object in local representation, or null if invalid
 */
export function parseUtcDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    // Check if timestamp is in seconds (10 digits) vs milliseconds (13 digits)
    const ms = value < 10000000000 ? value * 1000 : value;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // Handle date-only format (YYYY-MM-DD) without timezone shifts
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [yearStr, monthStr, dayStr] = trimmed.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1;
      const day = parseInt(dayStr, 10);
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }

    // Handle ISO date-time without trailing 'Z' or timezone offset:
    // If backend returns e.g. "2026-10-27T12:00:00" in UTC, appending 'Z'
    // prevents standard JS engines from incorrectly parsing it as local time.
    let isoString = trimmed.replace(' ', 'T');
    const hasTimezone = /[zZ]$|[+-]\d{2}(:?\d{2})?$/.test(isoString);

    if (!hasTimezone && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(isoString)) {
      isoString = `${isoString}Z`;
    }

    const d = new Date(isoString);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/**
 * Formats a UTC backend date to local Date string (e.g. "27 Oct 2026").
 */
export function formatUtcDate(
  value: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  fallback = '—'
): string {
  const date = parseUtcDate(value);
  if (!date) return fallback;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };

  return date.toLocaleDateString('en-IN', options || defaultOptions);
}

/**
 * Formats a UTC backend date to local Time string (e.g. "06:42 PM").
 */
export function formatUtcTime(
  value: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  fallback = '—'
): string {
  const date = parseUtcDate(value);
  if (!date) return fallback;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  return date.toLocaleTimeString('en-IN', options || defaultOptions);
}

/**
 * Formats a UTC backend date to local Date & Time string (e.g. "27 Oct 2026, 06:42 PM").
 */
export function formatUtcDateTime(
  value: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  fallback = '—'
): string {
  const date = parseUtcDate(value);
  if (!date) return fallback;

  const datePart = formatUtcDate(date, options, fallback);
  const timePart = formatUtcTime(date, options, fallback);

  return `${datePart}, ${timePart}`;
}

/**
 * Formats relative time (e.g. "Just now", "5 minutes ago", "Yesterday").
 */
export function formatRelativeTime(
  value: string | number | Date | null | undefined,
  fallback = '—'
): string {
  const date = parseUtcDate(value);
  if (!date) return fallback;

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffSeconds) < 45) {
    return 'Just now';
  }
  if (Math.abs(diffMinutes) < 60) {
    return diffMinutes > 0 ? `${diffMinutes}m ago` : `in ${Math.abs(diffMinutes)}m`;
  }
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `${diffHours}h ago` : `in ${Math.abs(diffHours)}h`;
  }
  if (diffDays === 1) {
    return `Yesterday at ${formatUtcTime(date)}`;
  }
  if (diffDays === -1) {
    return `Tomorrow at ${formatUtcTime(date)}`;
  }
  if (Math.abs(diffDays) < 7) {
    return diffDays > 0 ? `${diffDays}d ago` : `in ${Math.abs(diffDays)}d`;
  }

  return formatUtcDate(date);
}
