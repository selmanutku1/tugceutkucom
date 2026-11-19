import { Linkedin } from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const { brand } = getSiteContent(lang);
  const isEn = lang === 'en';

  const footerLinks = [
    { label: isEn ? 'Home' : 'Ana Sayfa', path: '/' },
    { label: isEn ? 'About' : 'Hakkımda', path: '/hakkimda' },
    { label: isEn ? 'Expertise' : 'Uzmanlık Alanlarım', path: '/uzmanlik-alanlarim' },
    { label: isEn ? 'Experience' : 'Deneyim', path: '/deneyim' },
    { label: isEn ? 'Projects' : 'Projeler', path: '/projeler' },
    { label: 'Blog', path: '/blog' },
    { label: isEn ? 'FAQ' : 'SSS', path: '/sss' },
    { label: isEn ? 'Contact' : 'İletişim', path: '/iletisim' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-14 space-y-8">
        {/* Brand & Positioning */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
          <div className="space-y-3 max-w-md flex flex-col items-center md:items-start">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              <BrandLogo theme="dark" />
            </a>
            <p className="text-sm text-slate-400 leading-relaxed">
              {brand.shortTagline}
            </p>
          </div>

          <a
            href={brand.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700 text-sm font-medium text-slate-200 hover:text-white transition-colors shrink-0"
          >
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Full Menu Row */}
        <nav
          aria-label={isEn ? 'Footer navigation' : 'Alt menü'}
          className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2.5 text-sm"
        >
          {footerLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(link.path);
              }}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Quiet Copyright */}
        <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-500 text-center md:text-left">
          <p>
            <button
              type="button"
              onClick={() => navigate('/yonetim')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
              title={isEn ? 'Blog Management' : 'Blog Yönetim Paneli'}
            >
              © {brand.name}
            </button>
            . {isEn ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
