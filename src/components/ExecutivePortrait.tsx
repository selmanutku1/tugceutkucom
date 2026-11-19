import { useState } from 'react';

const TUGCE_PHOTO = '/assets/aistudio/tugce-utku_2f46d5a0.jpg';

interface ExecutivePortraitProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ExecutivePortrait({
  size = 'md',
  className = '',
}: ExecutivePortraitProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16 rounded-2xl',
    md: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl',
    lg: 'w-32 h-32 sm:w-40 sm:h-40 rounded-2xl',
  }[size];

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0 ${sizeClasses} ${className}`}
    >
      {!imgError ? (
        <img
          src={TUGCE_PHOTO}
          alt="Tuğçe Utku — Dijital Dönüşüm, Teknoloji ve Strateji"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top select-none"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-semibold text-xl tracking-tight">
          TU
        </div>
      )}
    </div>
  );
}
