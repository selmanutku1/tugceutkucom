import { ArrowRight, Linkedin } from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import ExecutivePortrait from '../components/ExecutivePortrait';
import ProfileCredentialsStrip from '../components/ProfileCredentialsStrip';
import { Reveal, StaggerGroup, StaggerItem } from '../components/MotionPrimitives';

export default function AboutPage() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { brand, aboutPrinciples } = getSiteContent(lang);

  return (
    <div>
      {/* Page Header */}
      <section className="py-14 sm:py-20 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
        <Reveal immediate className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6 text-center sm:text-left">
          <p className="text-sm font-medium text-brand-teal">
            {isEn ? 'About' : 'Hakkımda'}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] [text-wrap:balance]">
            {isEn
              ? 'Understanding change in the digital world, crafting the right strategy, and creating value.'
              : 'Dijital dünyada değişimi anlamak, doğru stratejiyi geliştirmek ve değer üretmek.'}
          </h1>
        </Reveal>
      </section>

      {/* Main Bio */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
          <Reveal
            immediate
            delay={0.14}
            direction="left"
            className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100 text-center sm:text-left"
          >
            <ExecutivePortrait size="lg" />
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-slate-900">{brand.name}</h2>
              <p className="text-sm sm:text-base font-medium text-slate-500">
                {brand.positioning}
              </p>
              <a
                href={brand.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isEn ? 'LinkedIn Profile' : 'LinkedIn Profili'}
                title="LinkedIn"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0A66C2] hover:bg-[#0958a8] text-white transition-colors mt-1.5"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </Reveal>

          <Reveal
            immediate
            delay={0.22}
            className="space-y-8 text-base sm:text-lg text-slate-600 leading-relaxed text-center sm:text-left"
          >
            {isEn ? (
              <>
                <div className="space-y-4">
                  <p>
                    I have over 10 years of professional experience in insurance and the
                    digital business world. I have shaped my career at the intersection
                    of insurance domain knowledge, technology, product strategy, and
                    digital growth.
                  </p>
                  <p>
                    The responsibilities I have taken on across digital marketing, brand
                    management, agency leadership, product marketing, and business
                    development have given me a working perspective that evaluates
                    technology-driven business models from both operational and commercial
                    standpoints.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#012253]/8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Insurance & Technology Experience
                  </h3>
                  <p>
                    At the center of my work in the insurance sector are digital insurance
                    models, agency and broker technologies, digital sales channels, and
                    the integration of insurance workflows with technology.
                  </p>
                  <p>
                    I have assumed diverse responsibilities within the insurance
                    technology ecosystem through projects spanning Insurance CRM systems,
                    online sales platforms, multi-carrier insurance integrations, and
                    digital distribution infrastructure.
                  </p>
                  <p>
                    Throughout these initiatives, I have focused not only on product and
                    technology development, but also on market positioning, target
                    audience definition, sales models, user experience, and sustainable
                    growth dynamics.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#012253]/8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Product Strategy & Digital Growth
                  </h3>
                  <p>
                    The success of technology products depends not only on technical
                    capabilities, but also on the right business model, market
                    positioning, and alignment with user needs.
                  </p>
                  <p>
                    Accordingly, I approach digital product strategy, SaaS business
                    models, product marketing, performance marketing, customer
                    acquisition, and digital sales processes holistically.
                  </p>
                  <p>
                    I evaluate marketing activities not solely by brand awareness and
                    communication outputs, but through commercial indicators such as
                    customer acquisition cost, conversion rate, customer lifetime value,
                    and revenue performance.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#012253]/8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Management & Business Development Approach
                  </h3>
                  <p>
                    I connect the experience I have gained in agency management, team
                    coordination, client relations, project management, and digital
                    operations directly with strategic goals.
                  </p>
                  <p>
                    I adopt a management approach in which technology, marketing, and
                    sales functions do not progress independently, and where data,
                    process, and system integration directly impact business performance.
                  </p>
                  <p>
                    For me, a successful digital product or technology investment must
                    evolve into a scalable business model that meets user needs,
                    improves operational workflows, and generates measurable commercial
                    value.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#012253]/8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Areas of Focus
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:text-base text-slate-700">
                    {[
                      'Insurance and Digital Insurance',
                      'Insurance Technologies and Insurtech',
                      'Insurance CRM and Online Sales Platforms',
                      'Digital Product Strategy and SaaS Business Models',
                      'Digital Marketing and Performance Management',
                      'Business Development and Growth Strategies',
                      'Artificial Intelligence and Insurance Applications',
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start justify-center sm:justify-start gap-2.5"
                      >
                        <span
                          aria-hidden="true"
                          className="hidden sm:inline text-brand-teal font-semibold"
                        >
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="pt-4 font-medium text-slate-900">
                  I examine business models across the insurance sector as they are
                  reshaped by technology through the lenses of product, operations,
                  customer experience, and commercial performance—and continue sharing
                  my work and industry perspectives in these areas.
                </p>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <p>
                    Sigortacılık ve dijital iş dünyasında 10 yılı aşkın profesyonel deneyime
                    sahibim. Kariyerimi sigortacılık bilgisi, teknoloji, ürün stratejisi ve
                    dijital büyümenin kesişiminde şekillendirdim.
                  </p>
                  <p>
                    Dijital pazarlama, marka yönetimi, ajans yönetimi, ürün pazarlaması ve
                    iş geliştirme alanlarında üstlendiğim sorumluluklar, teknoloji odaklı iş
                    modellerini hem operasyonel hem de ticari açıdan değerlendiren bir
                    çalışma perspektifi kazandırdı.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#012253]/8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Sigortacılık ve Teknoloji Deneyimi
                  </h3>
                  <p>
                    Sigortacılık sektöründeki çalışmalarımın merkezinde dijital sigortacılık
                    modelleri, acente ve broker teknolojileri, dijital satış kanalları ve
                    sigorta süreçlerinin teknolojiyle entegrasyonu yer alıyor.
                  </p>
                  <p>
                    Sigorta CRM sistemleri, online satış platformları, çoklu sigorta şirketi
                    entegrasyonları ve dijital dağıtım altyapıları üzerine yürüttüğüm
                    çalışmalarla sigorta sektörünün teknoloji ekosisteminde farklı
                    sorumluluklar üstlendim.
                  </p>
                  <p>
                    Bu süreçlerde yalnızca ürün ve teknoloji geliştirme tarafına değil;
                    ürünün pazardaki konumlandırılmasına, hedef kitlesine, satış modeline,
                    kullanıcı deneyimine ve sürdürülebilir büyüme dinamiklerine de
                    odaklandım.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#012253]/8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Ürün Stratejisi ve Dijital Büyüme
                  </h3>
                  <p>
                    Teknoloji ürünlerinin başarısı, teknik yetkinliklerinin yanı sıra doğru
                    iş modeline, pazar konumlandırmasına ve kullanıcı ihtiyaçlarıyla kurduğu
                    ilişkiye bağlıdır.
                  </p>
                  <p>
                    Bu doğrultuda dijital ürün stratejisi, SaaS iş modelleri, ürün
                    pazarlaması, performans pazarlaması, müşteri edinimi ve dijital satış
                    süreçlerini bütünsel bir yaklaşımla ele alıyorum.
                  </p>
                  <p>
                    Pazarlama faaliyetlerini yalnızca marka bilinirliği ve iletişim
                    çıktılarıyla değil; müşteri edinme maliyeti, dönüşüm oranı, müşteri
                    yaşam boyu değeri ve gelir performansı gibi ticari göstergelerle
                    değerlendiriyorum.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#012253]/8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Yönetim ve İş Geliştirme Yaklaşımı
                  </h3>
                  <p>
                    Ajans yönetimi, ekip koordinasyonu, müşteri ilişkileri, proje yönetimi
                    ve dijital operasyon süreçlerinde edindiğim deneyimi stratejik
                    hedeflerle ilişkilendiriyorum.
                  </p>
                  <p>
                    Teknoloji, pazarlama ve satış fonksiyonlarının birbirinden bağımsız
                    ilerlemediği; veri, süreç ve sistem entegrasyonunun iş performansını
                    doğrudan etkilediği bir yönetim yaklaşımını benimsiyorum.
                  </p>
                  <p>
                    Benim için başarılı bir dijital ürün veya teknoloji yatırımı; kullanıcı
                    ihtiyacını karşılayan, operasyonel süreçleri iyileştiren,
                    ölçeklenebilir ve ölçülebilir ticari değer üreten bir iş modeline
                    dönüşmelidir.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#012253]/8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Çalışma Alanlarım
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:text-base text-slate-700">
                    {[
                      'Sigortacılık ve Dijital Sigortacılık',
                      'Sigorta Teknolojileri ve Insurtech',
                      'Sigorta CRM ve Online Satış Platformları',
                      'Dijital Ürün Stratejisi ve SaaS İş Modelleri',
                      'Dijital Pazarlama ve Performans Yönetimi',
                      'İş Geliştirme ve Büyüme Stratejileri',
                      'Yapay Zekâ ve Sigortacılık Uygulamaları',
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start justify-center sm:justify-start gap-2.5"
                      >
                        <span
                          aria-hidden="true"
                          className="hidden sm:inline text-brand-teal font-semibold"
                        >
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="pt-4 font-medium text-slate-900">
                  Sigortacılık sektörünün teknolojiyle yeniden şekillenen iş modellerini;
                  ürün, operasyon, müşteri deneyimi ve ticari performans perspektifleriyle
                  ele alıyor, bu alanlardaki çalışmalarımı ve sektörel değerlendirmelerimi
                  paylaşmaya devam ediyorum.
                </p>
              </>
            )}
          </Reveal>
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mt-12 sm:mt-14">
          <ProfileCredentialsStrip />
        </div>
      </section>

      {/* Profesyonel Yaklaşımım */}
      <section className="py-14 sm:py-20 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
          <Reveal className="space-y-2 text-center sm:text-left">
            <p className="text-sm font-medium text-brand-teal">
              {isEn ? 'Working Principles' : 'Çalışma İlkeleri'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {isEn ? 'My professional approach' : 'Profesyonel yaklaşımım'}
            </h2>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutPrinciples.map((item, idx) => (
              <StaggerItem key={item.title} className="h-full">
                <div className="h-full bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 space-y-2.5 text-center sm:text-left transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_28px_-14px_rgba(15,23,42,0.12)]">
                  <span className="text-xs font-semibold text-brand-teal tabular-nums">
                    0{idx + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-14 sm:py-20">
        <Reveal className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <p className="text-lg sm:text-xl font-medium text-slate-900 leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? 'Within the constantly evolving dynamics of the digital world, I continue learning, building, and creating new areas of value.'
              : 'Dijital dünyanın sürekli değişen dinamikleri içinde öğrenmeye, geliştirmeye ve yeni değer alanları oluşturmaya devam ediyorum.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/iletisim')}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#012253]/15 cursor-pointer"
            >
              <span>{isEn ? 'Get in Touch' : 'İletişime Geçin'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/deneyim')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              {isEn ? 'Experience Page' : 'Deneyim Sayfası'}
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
