import { PACKAGES } from '../data/consultingContent';
import { Check, Calendar, Rocket, Bot } from 'lucide-react';

interface PackagesSectionProps {
  onOpenBookingWithPackage: (packageName: string) => void;
}

export default function PackagesSection({ onOpenBookingWithPackage }: PackagesSectionProps) {
  const acentePaket = PACKAGES.find(p => p.id === 'acente-dijitallesme-paketi');
  const otherPaketler = PACKAGES.filter(p => p.id !== 'acente-dijitallesme-paketi');

  return (
    <section id="acente-paketi" className="py-12 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* ========================================================================= */}
        {/* HERO SHOWCASE: "ACENTENİZİ DİJİTALMEŞTİRİN" ÖZEL PAKETİ */}
        {/* ========================================================================= */}
        {acentePaket && (
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-5 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl overflow-hidden">
            
            {/* Background glow & accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: Heading & Vision */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] sm:text-xs font-bold">
                  <Rocket className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Öne Çıkan Anahtar Teslim Dönüşüm Programı</span>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    “Acentenizi Dijitalleştirin” <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                      Uçtan Uca Büyüme Paketi
                    </span>
                  </h3>
                  <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
                    Acentenizi Excel tablolarından ve mesai saatleriyle sınırlı satıştan kurtarın. Web sitesi, CRM, WhatsApp otomasyonu ve yapay zekâ asistanıyla <strong>7/24 teklif toplayan ve vadesi gelen müşteriyi asla kaçırmayan</strong> modern bir işletmeye dönüştürün.
                  </p>
                </div>

                {/* 2 Fast Facts */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <p className="text-lg sm:text-2xl font-black text-emerald-400">%93</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-tight">Vaka İçi Yenileme Oranı</p>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <p className="text-lg sm:text-2xl font-black text-blue-400">7/24</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-tight">AI Asistan & Online Teklif</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => onOpenBookingWithPackage('Acentenizi Dijitalleştirin')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Acente Dönüşüm Keşfi Planla</span>
                  </button>

                  <span className="text-center sm:text-left text-xs text-slate-400">
                    {acentePaket.priceNote}
                  </span>
                </div>
              </div>

              {/* Right Column: 10 Core Package Deliverables Grid */}
              <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 sm:p-7 border border-slate-800/90 space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Paket İçeriğindeki 10 Temel Bileşen:
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    Eksiksiz Kurulum
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {acentePaket.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 sm:p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-start gap-2.5 text-xs text-slate-200 hover:border-slate-600 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 text-xs text-blue-300 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="leading-relaxed">
                    Kurulum sonrası acente ekibine sistemlerin kullanımı için <strong>birebir eğitim ve 3 ay boyunca kesintisiz danışmanlık</strong> verilir.
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}


        {/* ========================================================================= */}
        {/* OTHER COMPREHENSIVE ENTERPRISE & INSURTECH PACKAGES */}
        {/* ========================================================================= */}
        <div id="paketler" className="space-y-6 sm:space-y-8 pt-4">
          <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Kurumsal & InsurTech
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Diğer Stratejik Danışmanlık Modelleri
            </h3>
            <p className="text-xs sm:text-base text-slate-600">
              Sigorta şirketlerinin inovasyon ekipleri ve InsurTech girişimleri için özel tasarlanmış proje bazlı ve sprint danışmanlıkları.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {otherPaketler.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-slate-50 rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {pkg.badge}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {pkg.priceNote}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                      {pkg.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {pkg.tagline}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Paket Kapsamı & Danışmanlık Çıktıları:
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-200 space-y-3">
                  <p className="text-xs text-slate-500">
                    <strong>Uygunluk:</strong> {pkg.suitableFor}
                  </p>

                  <button
                    onClick={() => onOpenBookingWithPackage(pkg.name)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Bu Paket İçin Keşif Randevusu Planla</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
