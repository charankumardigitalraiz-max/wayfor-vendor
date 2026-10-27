import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import {
  parseUtcDate,
  formatUtcDate,
  formatUtcTime,
  formatUtcDateTime,
  formatRelativeTime
} from '../../utils/dateUtils';

export interface UtcDateDisplayProps {
  value?: string | number | Date | null;
  format?: 'date' | 'time' | 'datetime' | 'relative';
  options?: Intl.DateTimeFormatOptions;
  fallback?: string;
  showIcon?: boolean;
  className?: string;
  iconClassName?: string;
}

/**
 * Universal UTC Date & Time Display Component.
 *
 * Automatically parses UTC backend responses and displays them in the
 * user's local timezone with clean formatting and accessible <time> tag.
 */
export const UtcDateDisplay: React.FC<UtcDateDisplayProps> = ({
  value,
  format = 'datetime',
  options,
  fallback = '—',
  showIcon = false,
  className = '',
  iconClassName = 'h-3.5 w-3.5 text-purple-600 shrink-0'
}) => {
  const parsed = parseUtcDate(value);

  if (!parsed) {
    return <span className={`text-slate-400 italic ${className}`}>{fallback}</span>;
  }

  let text = '';
  switch (format) {
    case 'date':
      text = formatUtcDate(parsed, options, fallback);
      break;
    case 'time':
      text = formatUtcTime(parsed, options, fallback);
      break;
    case 'relative':
      text = formatRelativeTime(parsed, fallback);
      break;
    case 'datetime':
    default:
      text = formatUtcDateTime(parsed, options, fallback);
      break;
  }

  const IconComponent = format === 'time' ? Clock : Calendar;

  return (
    <time
      dateTime={parsed.toISOString()}
      title={parsed.toLocaleString()}
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      {showIcon && <IconComponent className={iconClassName} />}
      <span>{text}</span>
    </time>
  );
};
