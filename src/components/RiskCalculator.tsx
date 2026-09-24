import { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Calendar, 
  Sparkles,
  Building2,
  Rocket,
  Layers
} from 'lucide-react';
import { AssessmentResult } from '../types';

interface RiskCalculatorProps {
  onOpenBookingWithDetails: (topic: string, note: string) => void;
}

export default function RiskCalculator({ onOpenBookingWithDetails }: RiskCalculatorProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<'acente' | 'kurumsal' | 'insurtech'>('acente');
  const [techStatus, setTechStatus] = useState('');
  const [bottleneck, setBottleneck] = useState('');
  const [digitalPriority, setDigitalPriority] = useState('');
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const calculateAssessment = () => {
    let score = 50;
    let gaps: string[] = [];
    let steps: string[] = [];
    let title = '';
    let grade: 'Kritik Risk' | 'Gelişime Açık' | 'Yarı Dijital' | 'İleri Seviye' = 'Gelişime Açık';
    let suggestedPackage = 'Acente Dijital Dönüşüm Programı';

    if (profile === 'acente') {
      suggestedPackage = 'Acente Dijital Dönüşüm Programı';
      if (techStatus.includes('Excel') || techStatus.includes('manuel')) {
        score = 36;
        grade = 'Kritik Risk';
        title = 'Geleneksel Manuel Süreç & Yüksek Müşteri Kaybı Riski';
        gaps = [
          'Yenilemeler ve teklifler manuel takip edildiği için her ay ortalama %25-30 potansiyel müşteri kaçırılıyor.',
          'Mesai saatleri dışında gelen online talepleri karşılayacak 7/24 AI veya web otomasyonu bulunmuyor.',
          'WhatsApp ve CRM entegrasyonu olmadığı için operasyon ekibi günde 3+ saat veri kopyalamakla vakit kaybediyor.',
        ];
        steps = [
          '“Acentenizi Dijitalleştirin” paketiyle 3 hafta içinde modern web sitesi ve online teklif motoru kurulumu.',
          'Vadeye 30/15 gün kala otomatik devreye giren WhatsApp ve SMS hatırlatma botlarının entegrasyonu.',
          'Tüm portföyün tek ekrandan yönetileceği bulut CRM sisteminin yapılandırılması.',
        ];
      } else {
        score = 64;
        grade = 'Yarı Dijital';
        title = 'Temel Altyapı Mevcut, AI & Otomasyon ile Büyüme Fırsatı';
        gaps = [
          'Mevcut web sitesinden yeterli nitelikli müşteri (lead) dönüşümü sağlanamıyor.',
          'Hasar ve teklif bilgilendirmeleri omnichannel (WhatsApp + E-posta) olarak tam otomatik akmıyor.',
        ];
        steps = [
          'Web teklif hunisinin (funnel) UX/UI dönüşüm optimizasyonu.',
          'Yapay zekâ destekli 7/24 teklif ve soru-cevap asistanının devreye alınması.',
          'Google Yerel Arama reklamları ile hedef bölgeden nitelikli talep çekilmesi.',
        ];
      }
    } else if (profile === 'kurumsal') {
      suggestedPackage = 'Kurumsal AI & Dijital Dönüşüm';
      score = 52;
      grade = 'Yarı Dijital';
      title = 'Legacy Sistem Tıkanıklığı & AI Fırsat Alanları';
      gaps = [
        'Hasar evrakları, ekspertiz raporları ve faturalar uzmanlar tarafından manuel inceleniyor; dosya kapatma süresi uzuyor.',
        'Legacy (eski) çekirdek sistemler nedeniyle modern API ve açık sigortacılık entegrasyonları aylar sürüyor.',
        'Müşteri kayıp (churn) riski ve kârlılık analizleri gerçek zamanlı yönetim dashboard’larında izlenemiyor.',
      ];
      steps = [
        'Hasar ve operasyon süreçleri için Görsel LLM + OCR doküman analizi prototipinin (PoC) çıkarılması.',
        'Açık sigortacılık (Open Insurance) API mimarisinin ve standartlarının belirlenmesi.',
        'Müşteri kaybını 60 gün önceden tahminleyen analitik karar destek modelinin kurulması.',
      ];
    } else {
      suggestedPackage = 'InsurTech Ürün & Büyüme Danışmanlığı';
      score = 58;
      grade = 'Gelişime Açık';
      title = 'Yüksek İnovasyon Potansiyeli & Regülasyon/API Entegrasyon İhtiyacı';
      gaps = [
        'SEDDK lisanslama, mesafeli satış ve regülasyon uyumluluk yol haritasının netleştirilmesi gerekiyor.',
        'Sigorta şirketleri ve reasürörlerle API entegrasyon anlaşmalarının teknik şartnamesi eksik.',
        'Gömülü sigorta (Embedded) satın alma akışında kullanıcı deneyimi (UX) dönüşüm sürtünmesi yaşanıyor.',
      ];
      steps = [
        'MVP kapsamının belirlenmesi ve regülasyon uyumlu B2B2C ürün mimarisinin çizilmesi.',
        'Sigorta şirketi ve reasürans API sağlayıcılarıyla teknik entegrasyon köprüsünün kurulması.',
        'Pazara çıkış (Go-to-Market) ve dijital müşteri kazanım hunisi optimizasyonu.',
      ];
    }

    setResult({
      score,
      grade,
      title,
      analysis: `${profile === 'acente' ? 'Acentenizin dijitalleşme ve satış süreçlerinde' : profile === 'kurumsal' ? 'Kurumunuzun operasyon ve yapay zekâ mimarisinde' : 'InsurTech girişiminizin ürün ve entegrasyon yolculuğunda'} somut büyüme ve verimlilik fırsatları belirlendi.`,
      identifiedGaps: gaps,
      recommendedSteps: steps,
      suggestedPackage,
    });
    setStep(5);
  };

  const handleReset = () => {
    setStep(1);
    setTechStatus('');
    setBottleneck('');
    setDigitalPriority('');
    setResult(null);
  };

  const stepLabels = ['Kurum Türü', 'Mevcut Teknoloji', 'Temel Tıkanıklık', 'Öncelikli Hedef'];

  return (
    <section id="risk-analizi" className="py-12 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2.5 sm:space-y-3 pb-6 sm:pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>2 Dakikalık İnteraktif Değerlendirme</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Dijital Sigortacılık & InsurTech Olgunluk Testi
          </h2>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">
            Acentenizin, sigorta şirketinizin veya InsurTech girişiminizin teknoloji olgunluğunu ölçün, operasyonel darboğazları ve AI fırsatlarını anında keşfedin.
          </p>
        </div>

        {/* Step Progress Bar (Optimized for Mobile) */}
        {step <= 4 && (
          <div className="mb-6 sm:mb-8">
            {/* Mobile simplified progress indicator */}
            <div className="sm:hidden space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Adım {step} / 4</span>
                <span className="text-blue-700">{stepLabels[step - 1]}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-700 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Desktop Stepper */}
            <div className="hidden sm:flex items-center justify-between text-xs font-semibold text-slate-500">
              {stepLabels.map((lbl, idx) => {
                const sNum = idx + 1;
                const isPassed = step > sNum;
                const isCurrent = step === sNum;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isPassed || isCurrent ? 'bg-blue-700 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {sNum}
                    </span>
                    <span className={isCurrent ? 'text-blue-900 font-bold' : ''}>{lbl}</span>
                    {idx < 3 && <div className="w-8 lg:w-16 h-0.5 bg-slate-200 mx-1"></div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Card Body */}
        <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs">
          
          {/* STEP 1: Institution Profile */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Hangi kurum veya iş modeli için değerlendirme yapıyorsunuz?
                </h3>
                <p className="text-xs text-slate-500">Size en uygun analiz kriterlerini getirmemiz için lütfen seçin.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  {
                    id: 'acente',
                    title: 'Sigorta Acentesi & Broker',
                    desc: 'Web sitesi, CRM otomasyonu, otomatik WhatsApp yenileme ve müşteri kazanımı',
                    badge: 'Acente Dönüşümü',
                    icon: Rocket,
                  },
                  {
                    id: 'kurumsal',
                    title: 'Sigorta Şirketi & Kurumsal',
                    desc: 'AI doküman/hasar analizi, süreç optimizasyonu, legacy modernizasyon',
                    badge: 'Enterprise & AI',
                    icon: Building2,
                  },
                  {
                    id: 'insurtech',
                    title: 'InsurTech & FinTech Girişimi',
                    desc: 'Gömülü sigorta (Embedded), açık sigortacılık API mimarisi ve MVP stratejisi',
                    badge: 'Start-Up & API',
                    icon: Layers,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setProfile(item.id as any);
                        setStep(2);
                      }}
                      className={`p-4 sm:p-5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-auto sm:h-48 gap-3 ${
                        profile === item.id
                          ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {item.badge}
                          </span>
                          <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center justify-end text-xs font-semibold text-blue-700 pt-2 border-t border-slate-100">
                        <span>Seç ve İlerle →</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Current Tech Status */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Mevcut teknoloji ve dijital operasyon durumunuz nedir?
                </h3>
                <p className="text-xs text-slate-500">Durumunuzu en iyi yansıtan seçeneği işaretleyin.</p>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {(profile === 'acente'
                  ? [
                      'Müşteri takibini, yenilemeleri ve teklif süreçlerini Excel veya eski masaüstü yazılımlarla manuel yürütüyoruz.',
                      'Temel bir CRM sistemimiz var ancak WhatsApp otomasyonu, otomatik bildirimler ve online teklif altyapımız bulunmuyor.',
                      'Web sitemiz var fakat mobil uyumsuz ve Google’dan düzenli yeni müşteri/talep üretemiyoruz.',
                    ]
                  : profile === 'kurumsal'
                  ? [
                      'Hasar evrakları, sağlık faturaları ve poliçe şartnameleri eksperler tarafından manuel inceleniyor; operasyonel maliyet yüksek.',
                      'Eski çekirdek (core) sistemlerimiz sebebiyle yeni dijital ürünlerin ve API entegrasyonlarının pazara çıkışı aylar sürüyor.',
                      'Yapay zekâ ve makine öğrenmesi projeleri fikir aşamasında kaldı; somut use-case’ler canlıya alınamadı.',
                    ]
                  : [
                      'Yeni bir InsurTech fikrimiz veya MVP’miz var; SEDDK mevzuatı ve sigorta şirketi API eşleştirmesine ihtiyacımız var.',
                      'E-ticaret veya FinTech platformumuza "Gömülü Sigorta" (Embedded Insurance) modülü entegre etmek istiyoruz.',
                      'Ürünümüz hazır ancak B2B2C müşteri edinme hunisi (funnel) ve kullanıcı deneyimi (UX) optimizasyonuna ihtiyacımız var.',
                    ]
                ).map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTechStatus(text);
                      setStep(3);
                    }}
                    className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/40 text-left text-xs sm:text-sm text-slate-700 font-medium transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <span>{text}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  ← Önceki Adıma Dön
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Biggest Bottleneck */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  En öncelikli çözmek istediğiniz operasyonel veya teknolojik darboğaz nedir?
                </h3>
                <p className="text-xs text-slate-500">Öncelikli hedefinizi seçin.</p>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {[
                  'Manuel süreçler nedeniyle ekibin zaman kaybetmesi ve müşteri kaybı (churn) oranının yükselmesi',
                  'Hasar ve evrak inceleme süreçlerinin yavaşlığı nedeniyle uzayan dosya kapanış süreleri',
                  'Dijital kanallardan düzenli nitelikli talep (lead) ve yeni üretim yaratamamak',
                  'Yapay zekâ ve açık sigortacılık API mimarisini kurumlara entegre edecek uzman mimar eksikliği',
                ].map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBottleneck(text);
                      setStep(4);
                    }}
                    className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/40 text-left text-xs sm:text-sm text-slate-700 font-medium transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <span>{text}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  ← Önceki Adıma Dön
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Consulting Priority */}
          {step === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Tuğçe Utku danışmanlığında en çok hangi somut çıktıya ulaşmak istersiniz?
                </h3>
                <p className="text-xs text-slate-500">Hedeflenen sonucu seçin ve anında analizinizi görün.</p>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {[
                  'Acentemizin modern web sitesi, CRM ve otomatik WhatsApp yenileme botlarıyla tam dijitalleşmesi',
                  'Hasar ve evrak süreçlerinde Yapay Zekâ (Görsel LLM & OCR) otomasyonunun anahtar teslim kurulması',
                  'Açık sigortacılık (Open Insurance) & Gömülü Sigorta (Embedded) API mimarisinin devreye alınması',
                  'Uçtan uca dijital ürün yönetimi (PRD, UX/UI ve müşteri portalı) tasarımı',
                ].map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDigitalPriority(text);
                      calculateAssessment();
                    }}
                    className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/40 text-left text-xs sm:text-sm text-slate-700 font-medium transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <span>{text}</span>
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  ← Önceki Adıma Dön
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL SCORECARD & ASSESSMENT REPORT */}
          {step === 5 && result && (
            <div className="space-y-5 sm:space-y-6">
              
              {/* Scorecard Box (Responsive) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 inline-block">
                    Dijital Olgunluk: {result.grade}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900">
                    {result.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                    {result.analysis}
                  </p>
                </div>

                {/* Circular Score display */}
                <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-900 text-white shrink-0 border-4 border-blue-500 shadow-lg">
                  <span className="text-2xl sm:text-3xl font-black">{result.score}</span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-300">/ 100 Puan</span>
                </div>
              </div>

              {/* Identified Gaps */}
              <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5 sm:space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  Tespit Edilen Teknoloji & Süreç Boşlukları:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-amber-950">
                  {result.identifiedGaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold shrink-0">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action Steps */}
              <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5 sm:space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  Önerilen 3 Aşamalı Dijital Büyüme Yol Haritası:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-blue-950">
                  {result.recommendedSteps.map((st, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold shrink-0">{idx + 1}.</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={handleReset}
                  className="order-2 sm:order-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Testi Baştan Başlat</span>
                </button>

                <button
                  onClick={() =>
                    onOpenBookingWithDetails(
                      result.suggestedPackage,
                      `Dijital Olgunluk Skoru: ${result.score}/100 (${result.grade}) - ${result.title}`
                    )
                  }
                  className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md cursor-pointer transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Bu Analizle 30 Dk Ücretsiz Randevu Al</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
