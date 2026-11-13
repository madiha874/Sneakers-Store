import React, { useState } from 'react';
import { Footprints } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackTitle,
  className = '',
  loading = 'lazy',
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EAE5DC] text-[#52525B] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Footprints className="w-7 h-7 mb-2 opacity-50" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-wide uppercase">
          {fallbackTitle ?? alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
