import { Linkedin } from 'lucide-react';
import { BRAND_PROFILE } from '../data/siteContent';
import { useRouter } from '../context/RouterContext';
import BrandLogo from './BrandLogo';

const FOOTER_LINKS = [
  { label: 'Ana Sayfa', path: '/' },
  { label: 'Hakkımda', path: '/hakkimda' },
  { label: 'Uzmanlık Alanlarım', path: '/uzmanlik-alanlarim' },
  { label: 'Deneyim', path: '/deneyim' },
  { label: 'Projeler', path: '/projeler' },
  { label: 'Blog', path: '/blog' },
  { label: 'SSS', path: '/sss' },
  { label: 'İletişim', path: '/iletisim' },
];

export default function Footer() {
  const { navigate } = useRouter();

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
              {BRAND_PROFILE.shortTagline}
            </p>
          </div>

          <a
            href={BRAND_PROFILE.linkedin}
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
          aria-label="Alt menü"
          className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2.5 text-sm"
        >
          {FOOTER_LINKS.map((link) => (
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
          <p>© {BRAND_PROFILE.name}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
