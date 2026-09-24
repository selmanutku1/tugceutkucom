import { Linkedin, ExternalLink, GraduationCap, Building2 } from 'lucide-react';
import { TUĞÇE_PROFILE } from '../data/consultingContent';

interface ExecutivePortraitProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export default function ExecutivePortrait({ size = 'md', showBadge = true }: ExecutivePortraitProps) {
  const containerClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
  }[size];

  return (
    <div className="relative inline-block">
      {/* Decorative Outer Aura */}
      <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 rounded-3xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>

      {/* Main Portrait Frame */}
      <div className={`relative ${containerClasses} rounded-2xl overflow-hidden bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center`}>
        {/* Stylized Executive Portrait Illustration grounded in Tugce.png */}
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full object-cover select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c2523" />
              <stop offset="65%" stopColor="#5a4537" />
              <stop offset="100%" stopColor="#9a7b56" />
            </linearGradient>
            <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a3728" />
              <stop offset="60%" stopColor="#8d6e4f" />
              <stop offset="100%" stopColor="#c2a67e" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f7d5c0" />
              <stop offset="100%" stopColor="#ebd0ba" />
            </linearGradient>
            <linearGradient id="blazerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Clean Studio Background */}
          <rect width="200" height="200" fill="url(#bgGrad)" />

          {/* Back Long Hair Flowing Behind Shoulders */}
          <path d="M45,85 C40,110 38,150 42,200 L158,200 C162,150 160,110 155,85 Z" fill="url(#hairGrad)" />

          {/* Black Blazer / Business Suit */}
          <path d="M40,200 C40,155 70,145 100,150 C130,145 160,155 160,200 Z" fill="url(#blazerGrad)" />
          {/* Lapel & Collar details */}
          <path d="M75,150 L100,185 L125,150 L115,145 L100,165 L85,145 Z" fill="#334155" />
          <path d="M92,165 L100,180 L108,165 Z" fill="#ffffff" />

          {/* Neck */}
          <path d="M85,120 L85,150 C95,155 105,155 115,150 L115,120 Z" fill="url(#skinGrad)" />

          {/* Face Oval */}
          <ellipse cx="100" cy="95" rx="35" ry="42" fill="url(#skinGrad)" />

          {/* Long Front Hair Framing with Layered Blonde Highlights */}
          {/* Left Hair Stream */}
          <path d="M68,65 C60,95 55,140 60,195 C68,195 76,170 78,135 C75,100 80,80 85,70 Z" fill="url(#hairGrad)" />
          <path d="M62,120 C58,150 59,185 64,195 C68,195 72,175 73,145 Z" fill="url(#highlightGrad)" opacity="0.9" />

          {/* Right Hair Stream */}
          <path d="M132,65 C140,95 145,140 140,195 C132,195 124,170 122,135 C125,100 120,80 115,70 Z" fill="url(#hairGrad)" />
          <path d="M138,120 C142,150 141,185 136,195 C132,195 128,175 127,145 Z" fill="url(#highlightGrad)" opacity="0.9" />

          {/* Top Hair Volume & Center Parting */}
          <path d="M68,75 C70,45 130,45 132,75 C125,55 75,55 68,75 Z" fill="url(#hairGrad)" />
          <path d="M96,52 L100,75 L104,52 Z" fill="#2c2523" opacity="0.4" />

          {/* Eyes & Warm Expression */}
          <path d="M80,92 Q88,88 94,92" stroke="#2c2523" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="87" cy="94" r="3.2" fill="#2c2523" />
          <circle cx="88" cy="93" r="1" fill="#ffffff" />

          <path d="M106,92 Q112,88 120,92" stroke="#2c2523" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="113" cy="94" r="3.2" fill="#2c2523" />
          <circle cx="114" cy="93" r="1" fill="#ffffff" />

          {/* Eyebrows */}
          <path d="M78,85 Q87,81 94,84" stroke="#4a3728" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M106,84 Q113,81 122,85" stroke="#4a3728" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Gentle Nose */}
          <path d="M100,95 L98,107 Q100,109 102,107 Z" fill="#e0bba2" opacity="0.7" />

          {/* Radiant Friendly Smile */}
          <path d="M86,115 Q100,128 114,115" stroke="#a2484b" strokeWidth="2.2" fill="#ffffff" strokeLinecap="round" />
          <path d="M89,116 Q100,124 111,116" fill="#c05c60" />
          <path d="M92,116 Q100,120 108,116" fill="#ffffff" />
        </svg>

        {/* Live Active Pill */}
        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>
      </div>

      {/* Verified LinkedIn Badge Overlay */}
      {showBadge && (
        <a
          href={TUĞÇE_PROFILE.linkedin}
          target="_blank"
          rel="noreferrer"
          title="Tuğçe Utku LinkedIn Profilini Görüntüle"
          className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:scale-110 transition-transform cursor-pointer flex items-center justify-center border-2 border-white"
        >
          <Linkedin className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}

export function ExecutiveBioBadge() {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
      <div className="flex items-center gap-1.5 font-semibold text-blue-800 px-2 py-0.5 rounded-md bg-blue-100/70">
        <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
        <span>Marmara Üniversitesi Sigortacılık '18</span>
      </div>
      <div className="flex items-center gap-1.5 font-semibold text-slate-800 px-2 py-0.5 rounded-md bg-white border border-slate-200">
        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
        <span>AcerPro / AcerCrea & InsurUp</span>
      </div>
      <a 
        href={TUĞÇE_PROFILE.linkedin} 
        target="_blank" 
        rel="noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        <Linkedin className="w-3 h-3 text-blue-600" />
        <span>LinkedIn</span>
        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
      </a>
    </div>
  );
}
