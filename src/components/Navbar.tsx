import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useRouter } from '../context/RouterContext';

const DESKTOP_NAV_LINKS = [
  { label: 'Hakkımda', path: '/hakkimda' },
  { label: 'Uzmanlık', path: '/uzmanlik-alanlarim' },
  { label: 'Deneyim', path: '/deneyim' },
  { label: 'Projeler', path: '/projeler' },
  { label: 'Blog', path: '/blog' },
  { label: 'SSS', path: '/sss' },
];

const MOBILE_NAV_LINKS = [
  { label: 'Ana Sayfa', path: '/' },
  { label: 'Hakkımda', path: '/hakkimda' },
  { label: 'Uzmanlık Alanlarım', path: '/uzmanlik-alanlarim' },
  { label: 'Deneyim', path: '/deneyim' },
  { label: 'Projeler', path: '/projeler' },
  { label: 'Blog', path: '/blog' },
  { label: 'SSS', path: '/sss' },
  { label: 'İletişim', path: '/iletisim' },
];

export default function Navbar() {
  const { pathname, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 sm:h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-4 rounded-lg"
          aria-label="Tuğçe Utku — Ana Sayfa"
        >
          <BrandLogo theme="light" />
        </a>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Ana menü">
          {DESKTOP_NAV_LINKS.map((link) => {
            const active = isActive(link.path);
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.path);
                }}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary CTA */}
        <div className="hidden lg:flex items-center shrink-0">
          <a
            href="/iletisim"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/iletisim');
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            İletişim
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
          aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-5 py-5 space-y-2 shadow-lg max-h-[calc(100vh-56px)] overflow-y-auto">
          <nav className="flex flex-col space-y-1" aria-label="Mobil menü">
            {MOBILE_NAV_LINKS.map((link) => {
              const active = isActive(link.path);
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.path);
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full text-center px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
