import React, { useState } from 'react';
import { Linkedin } from 'lucide-react';
import { TUĞÇE_PROFILE } from '../data/consultingContent';
import tugcePhoto from '../assets/images/tugce_utku_photo_1790257568684.jpg';

interface ExecutivePortraitProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export default function ExecutivePortrait({ 
  size = 'md', 
  showBadge = true,
  className = ''
}: ExecutivePortraitProps) {
  const [imgError, setImgError] = useState(false);

  const containerClasses = {
    sm: 'w-16 h-16 rounded-2xl',
    md: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl',
    lg: 'w-36 h-36 sm:w-44 sm:h-44 rounded-3xl',
  }[size];

  return (
    <div className={`relative inline-block group ${className}`}>
      {/* Decorative Outer Aura */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 rounded-3xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>

      {/* Main Portrait Frame */}
      <div 
        className={`relative ${containerClasses} overflow-hidden bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center select-none transition-all duration-300`}
      >
        {!imgError ? (
          <img
            src={tugcePhoto}
            alt="Tuğçe Utku - Sigorta CRM & InsurTech Danışmanı"
            className="w-full h-full object-cover object-top select-none transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 text-white font-extrabold text-2xl font-mono tracking-wider">
            TU
          </div>
        )}

        {/* Live Active Status Indicator */}
        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs z-10"></div>
      </div>

      {/* Verified LinkedIn Badge Overlay */}
      {showBadge && (
        <a
          href={TUĞÇE_PROFILE.linkedin}
          target="_blank"
          rel="noreferrer"
          title="Tuğçe Utku LinkedIn Profilini Görüntüle"
          className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:scale-110 transition-transform cursor-pointer flex items-center justify-center border-2 border-white z-20"
        >
          <Linkedin className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}
