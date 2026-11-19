import { BookOpen, CalendarCheck, LayoutGrid, Linkedin } from 'lucide-react';
import { BRAND_PROFILE } from '../data/siteContent';
import { useRouter } from '../context/RouterContext';

export default function MobileBottomBar() {
  const { pathname, navigate } = useRouter();

  const isExpertise = pathname === '/uzmanlik-alanlarim';
  const isBlog = pathname === '/blog' || pathname.startsWith('/blog/');
  const isContact = pathname === '/iletisim';

  return (
    <nav
      aria-label="Mobil hızlı erişim"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom)] print:hidden"
    >
      <div className="grid grid-cols-4 items-center h-16 px-1.5 gap-1">
        {/* 1. Uzmanlık */}
        <button
          type="button"
          onClick={() => navigate('/uzmanlik-alanlarim')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer px-1 ${
            isExpertise
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-slate-600 hover:text-slate-900 active:bg-slate-100'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
            Uzmanlık
          </span>
        </button>

        {/* 2. Blog */}
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer px-1 ${
            isBlog
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-slate-600 hover:text-slate-900 active:bg-slate-100'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
            Blog
          </span>
        </button>

        {/* 3. İletişim / Görüşme */}
        <button
          type="button"
          onClick={() => navigate('/iletisim')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer px-1 ${
            isContact
              ? 'bg-blue-700 text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100/80 active:bg-blue-100'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
            İletişim
          </span>
        </button>

        {/* 4. LinkedIn */}
        <a
          href={BRAND_PROFILE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl text-slate-600 hover:text-slate-900 active:bg-slate-100 transition-colors px-1"
        >
          <Linkedin className="w-5 h-5 text-[#0A66C2]" />
          <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
            LinkedIn
          </span>
        </a>
      </div>
    </nav>
  );
}
