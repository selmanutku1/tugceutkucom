import React from 'react';

interface BrandLogoProps {
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function BrandLogo({
  theme = 'light',
  size = 'md',
  showSubtitle = true,
}: BrandLogoProps) {
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Ultra-Minimalist Modern "TU" Emblem */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-transform duration-200 group-hover:scale-105 ${
          isDark
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
            : 'bg-slate-900 text-white shadow-sm'
        }`}
      >
        <span className="text-base tracking-tighter font-extrabold flex items-center font-mono">
          <span className="text-white">T</span>
          <span className={isDark ? 'text-blue-200' : 'text-blue-400'}>U</span>
        </span>
      </div>

      {/* Clean Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-lg font-bold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Tuğçe Utku
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
        </div>

        {showSubtitle && (
          <span
            className={`text-[11px] font-medium tracking-normal ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            InsurUp Pazarlama Yöneticisi • InsurTech
          </span>
        )}
      </div>
    </div>
  );
}
