import { useState } from 'react';

const BRAND_LOGO = '/assets/aistudio/Gemini_Generated_Image_u0c53tu0c53tu0c5_9f641ea2.jpg';

interface BrandLogoProps {
  theme?: 'light' | 'dark';
}

export default function BrandLogo({ theme = 'light' }: BrandLogoProps) {
  const isDark = theme === 'dark';
  const [imgError, setImgError] = useState(false);

  return (
    <div className="inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0">
      <div
        className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${
          isDark ? 'bg-white ring-1 ring-white/15' : 'bg-transparent'
        }`}
      >
        {!imgError ? (
          <img
            src={BRAND_LOGO}
            alt="Tuğçe Utku Logo"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover object-center scale-[1.95] ${
              isDark ? '' : 'mix-blend-multiply brightness-[1.04] contrast-[1.06]'
            }`}
          />
        ) : (
          <span className="font-display text-sm font-extrabold tracking-tight text-[#0e2753]">
            TU
          </span>
        )}
      </div>

      <span className="font-display text-[13.5px] sm:text-[14.5px] tracking-[0.14em] uppercase leading-none flex items-center gap-1.5">
        <span
          className={`font-bold ${
            isDark ? 'text-white' : 'text-[#0e2753]'
          }`}
        >
          TUĞÇE
        </span>
        <span
          className={`font-semibold ${
            isDark ? 'text-cyan-300' : 'text-[#0c6278]'
          }`}
        >
          UTKU
        </span>
      </span>
    </div>
  );
}
