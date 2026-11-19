import { ArrowRight } from 'lucide-react';
import { TUĞÇE_PROFILE } from '../data/consultingContent';
import BrandLogo from './BrandLogo';

interface FooterProps {
  onOpenBooking: () => void;
  onScrollTo: (id: string) => void;
}

export default function Footer({ onOpenBooking, onScrollTo }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* Calm CTA Section */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-18 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Acente ve brokerliğiniz için sade bir başlangıç yapalım
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              30 dakikalık ücretsiz ön görüşmede ihtiyaçlarınızı konuşalım ve size en uygun adımları birlikte belirleyelim.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-base font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Ücretsiz Ön Görüşme Planla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quiet Footer Links & Contact */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <BrandLogo theme="dark" />

          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
            aria-label="Alt menü"
          >
            <button
              type="button"
              onClick={() => onScrollTo('hizmetler')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Hizmetler
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('surec')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Nasıl Çalışırız?
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('hakkimda')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Hakkımda
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('paylasimlar')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Paylaşımlar
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('sss')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sık Sorulanlar
            </button>
          </nav>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <a
              href={`mailto:${TUĞÇE_PROFILE.email}`}
              className="hover:text-white transition-colors"
            >
              {TUĞÇE_PROFILE.email}
            </a>
            <a
              href={`https://wa.me/${TUĞÇE_PROFILE.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              {TUĞÇE_PROFILE.phone}
            </a>
            <a
              href={TUĞÇE_PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {TUĞÇE_PROFILE.name}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
