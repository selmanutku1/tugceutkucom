import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import BrandLogo from './BrandLogo';
import LanguageSwitcher from './LanguageSwitcher';
import { EXECUTIVE_EASE } from './MotionPrimitives';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { pathname, navigate } = useRouter();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isEn = lang === 'en';

  const desktopNavLinks = [
    { label: isEn ? 'About' : 'Hakkımda', path: '/hakkimda' },
    { label: isEn ? 'Expertise' : 'Uzmanlık', path: '/uzmanlik-alanlarim' },
    { label: isEn ? 'Experience' : 'Deneyim', path: '/deneyim' },
    { label: isEn ? 'Projects' : 'Projeler', path: '/projeler' },
    { label: 'Blog', path: '/blog' },
    { label: isEn ? 'FAQ' : 'SSS', path: '/sss' },
  ];

  const mobileNavLinks = [
    { label: isEn ? 'Home' : 'Ana Sayfa', path: '/' },
    { label: isEn ? 'About' : 'Hakkımda', path: '/hakkimda' },
    { label: isEn ? 'Expertise' : 'Uzmanlık Alanlarım', path: '/uzmanlik-alanlarim' },
    { label: isEn ? 'Experience' : 'Deneyim', path: '/deneyim' },
    { label: isEn ? 'Projects' : 'Projeler', path: '/projeler' },
    { label: 'Blog', path: '/blog' },
    { label: isEn ? 'FAQ' : 'SSS', path: '/sss' },
    { label: isEn ? 'Contact' : 'İletişim', path: '/iletisim' },
  ];

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b transition-all duration-200 ${
        scrolled
          ? 'border-[#012253]/12 shadow-[0_6px_24px_-10px_rgba(1,34,83,0.14)] bg-white/85'
          : 'border-[#012253]/8'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 sm:h-18 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-teal focus-visible:outline-offset-4 rounded-lg shrink-0 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
          aria-label={isEn ? 'Tuğçe Utku — Home' : 'Tuğçe Utku — Ana Sayfa'}
        >
          <BrandLogo theme="light" />
        </a>

        {/* Zone 2: Clean Single-Line Nav Links with Sliding Active Indicator */}
        <nav
          className="hidden lg:flex items-center gap-6"
          aria-label={isEn ? 'Main navigation' : 'Ana menü'}
        >
          {desktopNavLinks.map((link) => {
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
                className={`relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'text-brand-navy font-semibold'
                    : 'text-slate-600 hover:text-brand-navy'
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-brand-navy via-[#01526C] to-brand-teal-mid"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher (TR/EN Flags) + Primary CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <LanguageSwitcher />
          <a
            href="/iletisim"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/iletisim');
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy-hover rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:shadow-brand-navy/20 active:translate-y-0 whitespace-nowrap shrink-0"
          >
            {isEn ? 'Contact' : 'İletişim'}
          </a>
        </div>

        {/* Mobile Right Controls: Compact Flag Switcher + Menu Trigger */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
            aria-label={
              mobileMenuOpen
                ? isEn
                  ? 'Close menu'
                  : 'Menüyü kapat'
                : isEn
                  ? 'Open menu'
                  : 'Menüyü aç'
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EXECUTIVE_EASE }}
            className="lg:hidden border-t border-slate-200 bg-white px-5 py-5 space-y-2 shadow-lg max-h-[calc(100vh-56px)] overflow-y-auto"
          >
            <nav
              className="flex flex-col space-y-1"
              aria-label={isEn ? 'Mobile navigation' : 'Mobil menü'}
            >
              {mobileNavLinks.map((link, idx) => {
                const active = isActive(link.path);
                return (
                  <motion.a
                    key={link.path}
                    href={link.path}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: idx * 0.03,
                      ease: EXECUTIVE_EASE,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.path);
                    }}
                    aria-current={active ? 'page' : undefined}
                    className={`w-full text-center px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-brand-teal-light text-brand-navy font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-brand-navy'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
