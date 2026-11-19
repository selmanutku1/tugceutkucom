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
          isDark
            ? 'bg-white ring-1 ring-white/15'
            : 'bg-white border border-slate-200/80'
        }`}
      >
        {!imgError ? (
          <img
            src={BRAND_LOGO}
            alt="Tuğçe Utku Logo"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center scale-[1.9]"
          />
        ) : (
          <span className="text-xs font-bold tracking-tight text-slate-900">
            TU
          </span>
        )}
      </div>
      <span
        className={`text-base font-semibold tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}
      >
        Tuğçe Utku
      </span>
    </div>
  );
}
