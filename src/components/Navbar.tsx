import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  onOpenBooking: () => void;
  onScrollTo: (id: string) => void;
}

const NAV_LINKS = [
  { label: 'Hizmetler', id: 'hizmetler' },
  { label: 'Nasıl Çalışırız?', id: 'surec' },
  { label: 'Hakkımda', id: 'hakkimda' },
  { label: 'Paylaşımlar', id: 'paylasimlar' },
  { label: 'Sık Sorulanlar', id: 'sss' },
];

export default function Navbar({ onOpenBooking, onScrollTo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Clean single-line brand */}
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileMenuOpen(false);
          }}
          className="cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-4 rounded-lg"
          aria-label="Ana sayfaya dön"
        >
          <BrandLogo theme="light" />
        </button>

        {/* Zone 2: 4 clean single-line text nav links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Ana menü">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA */}
        <div className="hidden md:flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenBooking}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Görüşme Planla
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
          aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 py-5 space-y-2 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer transition-colors"
            >
              Ücretsiz Ön Görüşme Planla
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
