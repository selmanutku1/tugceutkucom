import { useState, useEffect } from 'react';
import { Calendar, Menu, X, ChevronRight, Rocket, Mail, Linkedin, Sparkles, Sliders } from 'lucide-react';
import { TUĞÇE_PROFILE } from '../data/consultingContent';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  onOpenBooking: () => void;
  onScrollTo: (id: string) => void;
}

export default function Navbar({ onOpenBooking, onScrollTo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Bulut Sigorta CRM', id: 'insurup-teknolojisi', isSpecial: true },
    { label: '6 Temel Hizmet', id: 'ana-hizmetler' },
    { label: 'Acentenizi Dijitalleştirin', id: 'acente-paketi', highlight: true },
    { label: '8 Uzmanlık Alanı', id: 'hizmetler' },
    { label: 'Dijital Olgunluk Testi', id: 'risk-analizi' },
    { label: 'Hakkımda', id: 'hakkimda' },
    { label: 'Vakalar', id: 'vakalar' },
    { label: 'SSS', id: 'sss' },
  ];

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top micro-announcement bar */}
      <div className="bg-slate-950 text-slate-200 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="font-semibold text-emerald-400 shrink-0">Dijital Dönüşüm:</span>
            <span className="text-slate-300 truncate text-[11px] sm:text-xs">
              Tuğçe Utku • Sigorta CRM & InsurTech Danışmanı
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400 shrink-0 text-xs">
            <span className="text-slate-300 font-medium">Bulut CRM Altyapısı</span>
            <span>•</span>
            <span>InsurTech & Dijital Büyüme</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (mobileMenuOpen) setMobileMenuOpen(false);
            }}
            className="cursor-pointer"
          >
            <BrandLogo theme="light" size="sm" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  link.isSpecial
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                    : link.highlight
                    ? 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100/80'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => handleNavClick('insurup-teknolojisi')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>CRM Çözümleri</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:scale-95 rounded-xl shadow-md shadow-blue-700/20 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>30 Dk Keşif Randevusu</span>
            </button>
          </div>

          {/* Mobile Right Controls: Fast Randevu + Hamburger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-white bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
            >
              <Calendar className="w-3 h-3" />
              <span>Randevu</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 cursor-pointer border border-slate-200 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[97px] z-50 bg-slate-950/40 backdrop-blur-xs xl:hidden animate-in fade-in duration-150">
          <div className="bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-2xl max-h-[calc(100vh-100px)] overflow-y-auto">
            
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-left cursor-pointer transition-colors ${
                    link.isSpecial
                      ? 'bg-slate-900 text-white font-bold'
                      : link.highlight
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-bold'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isSpecial && <Sparkles className="w-4 h-4 text-emerald-400" />}
                    {link.highlight && <Rocket className="w-4 h-4 text-emerald-600" />}
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </nav>

            {/* Mobile CTAs */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3.5 text-center text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Ücretsiz 30 Dk Keşif & CRM Demosu</span>
              </button>
            </div>

            {/* Direct Contact Links in Mobile Drawer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-600">
              <a
                href={`mailto:${TUĞÇE_PROFILE.email}`}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-700"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{TUĞÇE_PROFILE.email}</span>
              </a>
              <a
                href={TUĞÇE_PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-blue-700 font-semibold"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn Profilini İncele</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
