import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { getImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';

export interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt?: string;
  fallbackSrc?: string;
  showIconFallback?: boolean;
  containerClassName?: string;
}

/**
 * Universal Image component for DigitalRaiz Wayfor.
 *
 * Automatically:
 * 1. Resolves relative backend upload URLs (`/upload/...`, `uploads/...`) to full server URLs.
 * 2. Leaves absolute URLs (`https://...`) intact.
 * 3. Gracefully handles broken images or 404s via fallbackSrc or neutral UI fallback.
 */
export const AppImage: React.FC<AppImageProps> = ({
  src,
  alt = '',
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  showIconFallback = false,
  containerClassName = '',
  className = '',
  ...props
}) => {
  const resolvedSrc = getImageUrl(src, fallbackSrc);
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedSrc);
  const [hasError, setHasError] = useState(false);

  // When src changes from props, reset error and sync state
  useEffect(() => {
    const next = getImageUrl(src, fallbackSrc);
    setCurrentSrc(next);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  if (hasError && showIconFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 border border-slate-200/80 ${containerClassName || className}`}
        title={alt || 'Image not available'}
      >
        <ImageIcon className="h-6 w-6 stroke-[1.5]" />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading={props.loading || 'lazy'}
      {...props}
    />
  );
};
