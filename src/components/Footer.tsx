import { Mail, MapPin, Linkedin, Sparkles, Lock, MessageSquare } from 'lucide-react';
import { TUĞÇE_PROFILE } from '../data/consultingContent';
import BrandLogo from './BrandLogo';

interface FooterProps {
  onOpenBooking: () => void;
  onScrollTo: (id: string) => void;
}

export default function Footer({ onOpenBooking, onScrollTo }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs sm:text-sm">
      
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800 bg-slate-900/60 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/60">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Bulut CRM & Büyüme Mimarisi</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Acentenizi Bulut CRM Teknolojisiyle Büyütmeye Hazır Mısınız?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Sigorta CRM demosu ve ilk 30 dakikalık dijital olgunluk değerlendirme görüşmesi tamamen ücretsizdir.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer text-center"
            >
              Sigorta CRM Demosu Al
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="sm:col-span-2 space-y-4">
            <BrandLogo theme="dark" size="md" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Yeni nesil bulut Sigorta CRM ve online satış altyapısını, sektörel büyüme ve veri odaklı dijital pazarlama danışmanlığıyla birleştirerek acenteleri, brokerları ve şirketleri geleceğe taşıyoruz.
            </p>

            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <p>• Sigorta CRM Mimarisi & Entegrasyon</p>
              <p>• 8+ Yıllık InsurTech Deneyimi</p>
              <p>• Veri Odaklı Dijital Büyüme</p>
            </div>
          </div>

          {/* Col 3: Hızlı Menü */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasyon
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onScrollTo('insurup-teknolojisi')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
                >
                  Bulut Sigorta CRM
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('acente-paketi')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Acentenizi Dijitalleştirin
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('ana-hizmetler')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  6 Temel Hizmet
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('risk-analizi')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dijital Olgunluk Testi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('hakkimda')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tuğçe Utku Kimdir?
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('sss')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sıkça Sorulan Sorular
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Modülleri */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              CRM Modülleri
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>360° Müşteri & Portföy CRM</li>
              <li>Karşılaştırmalı Online Teklif</li>
              <li>Çapraz Satış (Cross-Selling)</li>
              <li>Otomatik WhatsApp Vade Yenileme</li>
              <li>Hasar & Dosya Yönetimi</li>
              <li>Ön Muhasebe & Mutabakat</li>
            </ul>
          </div>

          {/* Col 5: İletişim & Lokasyon */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Doğrudan İletişim
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-300">{TUĞÇE_PROFILE.email}</span>
              </div>
              <a
                href={`https://wa.me/905468253597?text=${encodeURIComponent('Merhaba Tuğçe Hanım, web siteniz üzerinden ulaşıyorum. Bulut Sigorta CRM ve dijital büyüme danışmanlığı hakkında bilgi almak istiyorum.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>WhatsApp: {TUĞÇE_PROFILE.whatsapp}</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{TUĞÇE_PROFILE.location}</span>
              </div>
              <a
                href={TUĞÇE_PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold pt-1"
              >
                <Linkedin className="w-4 h-4 shrink-0" />
                <span>LinkedIn'de Bağlantı Kur</span>
              </a>
            </div>

            <div className="pt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>CRM Demosu İçin Müsait</span>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Tuğçe Utku • Sigorta CRM & InsurTech Danışmanı.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-500" />
              KVKK & Gizlilik Uyumlu
            </span>
            <span>•</span>
            <span>Bulut CRM & InsurTech Mimarisi</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
