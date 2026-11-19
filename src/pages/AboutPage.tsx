import { ArrowRight, Linkedin } from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import ExecutivePortrait from '../components/ExecutivePortrait';

export default function AboutPage() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { brand, aboutPrinciples } = getSiteContent(lang);

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6 text-center sm:text-left">
          <p className="text-sm font-medium text-blue-700">
            {isEn ? 'About' : 'Hakkımda'}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] [text-wrap:balance]">
            {isEn
              ? 'Understanding change in the digital world, crafting the right strategy, and creating value.'
              : 'Dijital dünyada değişimi anlamak, doğru stratejiyi geliştirmek ve değer üretmek.'}
          </h1>
        </div>
      </section>

      {/* Main Bio */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100 text-center sm:text-left">
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
          </div>

          <div className="space-y-5 text-base sm:text-lg text-slate-600 leading-relaxed text-center sm:text-left">
            {isEn ? (
              <>
                <p>
                  I am Tuğçe Utku, a professional working across digital marketing,
                  product strategy, and insurance technologies.
                </p>
                <p>
                  Throughout my career, I have taken on diverse roles spanning digital
                  marketing operations, brand management, agency leadership, product
                  marketing, and digital growth strategies.
                </p>
                <p>
                  A significant part of my work has focused on the digital transformation
                  of the insurance sector—including the digitalization of insurance
                  agencies and brokers, online sales channels, CRM technologies, customer
                  experience, and next-generation insurance models.
                </p>
                <p>
                  I believe product and marketing processes in technology companies cannot
                  be evaluated independently. A product succeeds not only through strong
                  technology, but through clear positioning, genuine alignment with user
                  needs, and a sustainable growth model.
                </p>
                <p>
                  For this reason, I treat marketing not simply as a communication or
                  visibility exercise, but as a strategic function directly tied to
                  commercial goals.
                </p>
              </>
            ) : (
              <>
                <p>
                  Ben Tuğçe Utku. Dijital pazarlama, ürün stratejisi ve sigortacılık
                  teknolojileri alanlarında çalışan bir profesyonelim.
                </p>
                <p>
                  Kariyerim boyunca dijital pazarlama operasyonlarından marka yönetimine,
                  ajans yönetiminden ürün pazarlamasına ve dijital büyüme stratejilerine
                  uzanan farklı sorumluluklar üstlendim.
                </p>
                <p>
                  Çalışma hayatımın önemli bir bölümünde sigorta sektörünün
                  dijitalleşmesine odaklandım. Sigorta acentelerinin ve brokerların dijital
                  dönüşümü, online satış kanalları, CRM teknolojileri, müşteri deneyimi ve
                  yeni nesil sigortacılık modelleri bu alandaki temel çalışma konularım
                  arasında yer alıyor.
                </p>
                <p>
                  Teknoloji şirketlerinde ürün ve pazarlama süreçlerinin birbirinden
                  bağımsız değerlendirilemeyeceğine inanıyorum. Bir ürünün başarılı olması
                  yalnızca güçlü bir teknolojiye sahip olmasına değil, doğru
                  konumlandırılmasına, hedef kitlesinin ihtiyaçlarını karşılamasına ve
                  sürdürülebilir bir büyüme modeline sahip olmasına bağlıdır.
                </p>
                <p>
                  Bu nedenle pazarlamayı yalnızca iletişim ve görünürlük faaliyeti olarak
                  değil, iş hedefleriyle doğrudan ilişkili stratejik bir fonksiyon olarak
                  ele alıyorum.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Profesyonel Yaklaşımım */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
          <div className="space-y-2 text-center sm:text-left">
            <p className="text-sm font-medium text-blue-700">
              {isEn ? 'Working Principles' : 'Çalışma İlkeleri'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {isEn ? 'My professional approach' : 'Profesyonel yaklaşımım'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutPrinciples.map((item, idx) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 space-y-2.5 text-center sm:text-left"
              >
                <span className="text-xs font-semibold text-blue-700 tabular-nums">
                  0{idx + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <p className="text-lg sm:text-xl font-medium text-slate-900 leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? 'Within the constantly evolving dynamics of the digital world, I continue learning, building, and creating new areas of value.'
              : 'Dijital dünyanın sürekli değişen dinamikleri içinde öğrenmeye, geliştirmeye ve yeni değer alanları oluşturmaya devam ediyorum.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/iletisim')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>{isEn ? 'Get in Touch' : 'İletişime Geçin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/deneyim')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-sm font-medium transition-colors cursor-pointer"
            >
              {isEn ? 'Experience Page' : 'Deneyim Sayfası'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
