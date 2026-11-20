import { useState } from 'react';

const FULL_BRAND_LOGO = '/assets/aistudio/IMG_8967_231027ea.png';
const MONOGRAM_LOGO = '/assets/aistudio/IMG_8969_35f4cedb.png';

interface BrandLogoProps {
  theme?: 'light' | 'dark';
  variant?: 'full' | 'icon';
}

export default function BrandLogo({
  theme = 'light',
  variant = 'full',
}: BrandLogoProps) {
  const isDark = theme === 'dark';
  const [imgError, setImgError] = useState(false);

  if (variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center select-none shrink-0 ${
          isDark ? 'bg-white p-1.5 rounded-xl ring-1 ring-white/15' : ''
        }`}
      >
        {!imgError ? (
          <img
            src={MONOGRAM_LOGO}
            alt="TU — Tuğçe Utku"
            onError={() => setImgError(true)}
            className="h-9 w-auto object-contain"
          />
        ) : (
          <span className="font-display text-sm font-extrabold tracking-tight text-[#0e2753]">
            TU
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center select-none whitespace-nowrap shrink-0 ${
        isDark ? 'bg-white px-3.5 py-2 rounded-xl ring-1 ring-white/15' : ''
      }`}
    >
      {!imgError ? (
        <img
          src={FULL_BRAND_LOGO}
          alt="Tuğçe Utku"
          onError={() => setImgError(true)}
          className={`w-auto object-contain ${
            isDark ? 'h-8 sm:h-9' : 'h-9 sm:h-11'
          }`}
        />
      ) : (
        <span className="font-display text-sm font-bold tracking-[0.14em] uppercase text-[#0e2753]">
          TUĞÇE UTKU
        </span>
      )}
    </div>
  );
}
