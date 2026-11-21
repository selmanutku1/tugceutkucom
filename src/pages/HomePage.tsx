import { useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Cpu,
  Linkedin,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { getSiteContent } from '../data/siteContentEn';
import { FaqCategory } from '../types';
import { useBlog } from '../context/BlogContext';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import ExecutivePortrait from '../components/ExecutivePortrait';
import BlogCoverVisual from '../components/BlogCoverVisual';
import LinkedInPostsSection from '../components/LinkedInPostsSection';
import ProfileCredentialsStrip from '../components/ProfileCredentialsStrip';
import {
  AccordionBody,
  EXECUTIVE_EASE,
  Reveal,
  StaggerGroup,
  StaggerItem,
} from '../components/MotionPrimitives';

function FaqCategoryIcon({ icon }: { icon: FaqCategory['icon'] }) {
  const iconClass = 'w-5 h-5 text-brand-teal';
  switch (icon) {
    case 'compass':
      return <Compass className={iconClass} />;
    case 'shield':
      return <ShieldCheck className={iconClass} />;
    case 'cpu':
      return <Cpu className={iconClass} />;
    case 'message':
      return <MessageSquare className={iconClass} />;
  }
}

export default function HomePage() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const { getPosts } = useBlog();
  const isEn = lang === 'en';
  const prefersReduced = useReducedMotion();

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const portraitY = useTransform(heroScrollProgress, [0, 1], [0, 26]);

  const {
    brand,
    expertiseAreas,
    approachPillars,
    projectItems,
    faqCategories,
  } = getSiteContent(lang);
  const posts = getPosts(lang);

  const [selectedFaqCategoryId, setSelectedFaqCategoryId] = useState<string | null>(null);
  const [openPreviewFaqId, setOpenPreviewFaqId] = useState<string | null>('soru-1');

  const latestPosts = posts.slice(0, 3);
  const defaultPreviewFaqs = [
    faqCategories[0].questions[0],
    faqCategories[1].questions[0],
    faqCategories[1].questions[2],
    faqCategories[3].questions[0],
  ];

  const activeFaqCategory = selectedFaqCategoryId
    ? faqCategories.find((cat) => cat.id === selectedFaqCategoryId) || null
    : null;
  const displayedFaqs = activeFaqCategory
    ? activeFaqCategory.questions
    : defaultPreviewFaqs;

  const handleSelectFaqCategory = (category: FaqCategory) => {
    if (selectedFaqCategoryId === category.id) {
      setSelectedFaqCategoryId(null);
      setOpenPreviewFaqId(defaultPreviewFaqs[0]?.id ?? null);
    } else {
      setSelectedFaqCategoryId(category.id);
      setOpenPreviewFaqId(category.questions[0]?.id ?? null);
    }
  };

  return (
    <div>
      {/* 1. HERO ALANI */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-transparent border-b border-[#012253]/8"
      >
        {/* Soft Logo-Color Accent Glow for Hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="animate-ambient-slow absolute -top-24 -right-20 w-[440px] h-[440px] rounded-full bg-gradient-to-br from-[#017B86]/18 via-[#C4E5E8]/45 to-transparent blur-3xl" />
          <div className="animate-ambient-reverse absolute -bottom-28 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#012253]/14 via-[#EBF1F8]/55 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-16 sm:pt-18 sm:pb-22">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Main Editorial Positioning */}
            <StaggerGroup
              immediate
              staggerDelay={0.09}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <StaggerItem distance={22}>
                <p className="text-sm font-medium text-brand-teal">{brand.positioning}</p>
              </StaggerItem>

              <StaggerItem distance={28}>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-navy leading-[1.14] [text-wrap:balance]">
                  {isEn ? (
                    <>
                      <span>A Strategic Perspective on the </span>
                      <span className="text-brand-teal">
                        Digital Future of Insurance.
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Sigortacılığın Dijital Geleceğine </span>
                      <span className="text-brand-teal">Stratejik Bakış.</span>
                    </>
                  )}
                </h1>
              </StaggerItem>

              <StaggerItem distance={24}>
                <div className="space-y-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  <p>
                    {isEn
                      ? 'I bring my experience across digital marketing, product management, and insurance technologies into developing digital business models, structuring sales channels, and improving operational workflows.'
                      : 'Dijital pazarlama, ürün yönetimi ve sigorta teknolojileri alanlarındaki deneyimimi; dijital iş modellerinin geliştirilmesi, satış kanallarının yapılandırılması ve operasyonel süreçlerin iyileştirilmesine yönelik çalışmalara taşıyorum.'}
                  </p>
                  <p className="hidden md:block text-sm sm:text-base text-slate-500">
                    {isEn
                      ? 'I evaluate technology investments not solely through a software and infrastructure lens, but across business objectives, operational efficiency, customer experience, and commercial performance.'
                      : 'Teknoloji yatırımlarını yalnızca yazılım ve altyapı perspektifinden değil; iş hedefleri, operasyonel verimlilik, müşteri deneyimi ve ticari performans ekseninde değerlendiriyorum.'}
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem distance={20}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/hakkimda')}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-brand-navy hover:bg-brand-navy-hover rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#012253]/15 active:translate-y-0 cursor-pointer whitespace-nowrap"
                  >
                    <span>{isEn ? 'About Me' : 'Hakkımda'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/uzmanlik-alanlarim')}
                    className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
                  >
                    {isEn ? 'Areas of Expertise' : 'Uzmanlık Alanlarım'}
                  </button>
                </div>
              </StaggerItem>
            </StaggerGroup>

            {/* Right: Compact Executive Portrait Card with Subtle Slide-In & Scroll Depth */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, x: 34, y: 12 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.68, delay: 0.18, ease: EXECUTIVE_EASE }}
              style={prefersReduced ? undefined : { y: portraitY }}
              className="lg:col-span-5"
            >
              <div className="bg-white/75 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/80 ring-1 ring-[#012253]/8 space-y-6 transition-all duration-300 hover:bg-white/85 hover:shadow-[0_14px_34px_-16px_rgba(1,34,83,0.16)]">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
                  <ExecutivePortrait size="md" />
                  <div className="min-w-0 space-y-1">
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                      {brand.name}
                    </h2>
                    <p className="text-sm text-slate-600 leading-snug">
                      {brand.positioning}
                    </p>
                    <a
                      href={brand.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={
                        isEn
                          ? 'Tuğçe Utku LinkedIn Profile'
                          : 'Tuğçe Utku LinkedIn Profili'
                      }
                      title="LinkedIn"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0A66C2] hover:bg-[#0958a8] text-white transition-all duration-200 hover:-translate-y-0.5 mt-1.5"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-200/80 space-y-2.5 text-center sm:text-left">
                  <p className="text-xs font-medium text-slate-500">
                    {isEn ? 'Core Focus' : 'Odak Alanları'}
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
                    <p>
                      {isEn
                        ? 'Digital Growth & Performance Marketing'
                        : 'Dijital Büyüme ve Performans Pazarlaması'}
                    </p>
                    <p>
                      {isEn
                        ? 'Digital Product Management & SaaS Business Models'
                        : 'Dijital Ürün Yönetimi ve SaaS İş Modelleri'}
                    </p>
                    <p>
                      {isEn
                        ? 'Insurance Technologies & Digital Sales Ecosystems'
                        : 'Sigorta Teknolojileri ve Dijital Satış Ekosistemleri'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. KISA TANITIM */}
      <section className="py-16 sm:py-22 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
        <Reveal className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6 text-center sm:text-left">
          <p className="text-sm font-medium text-brand-teal">
            {isEn ? 'Introduction' : 'Kısa Tanıtım'}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            {isEn
              ? 'Turning technology into business outcomes, and strategy into sustainable growth.'
              : 'Teknolojiyi iş sonuçlarına, stratejiyi sürdürülebilir büyümeye dönüştürüyorum.'}
          </h2>
          <div className="space-y-4 text-base text-slate-600 leading-relaxed">
            <p>
              {isEn
                ? 'With over 10 years of experience in the insurance sector, I work across insurance technologies, digital insurance, digital product strategy, and marketing. Throughout my career, I have taken on responsibilities spanning digital marketing operations, agency management, SaaS product management, digital sales channels, and business development. My core areas of focus include developing insurance CRM systems, online sales platforms, insurance company integrations, and digital distribution models, while integrating technology infrastructures with sales and operational processes.'
                : 'Sigortacılık sektöründe 10 yılı aşkın deneyimimle sigorta teknolojileri, dijital sigortacılık, dijital ürün stratejisi ve pazarlama alanlarında çalışıyorum. Kariyerim boyunca dijital pazarlama operasyonları, ajans yönetimi, SaaS ürün yönetimi, dijital satış kanalları ve iş geliştirme süreçlerinde farklı sorumluluklar üstlendim. Özellikle sigorta CRM sistemleri, online satış platformları, sigorta şirketi entegrasyonları ve dijital dağıtım modellerinin geliştirilmesi; teknoloji altyapılarının satış ve operasyon süreçleriyle bütünleştirilmesi temel çalışma alanlarımı oluşturuyor.'}
            </p>
            <p>
              {isEn
                ? 'For me, the true value of technology investments emerges when they deliver operational efficiency, a strong customer experience, and measurable commercial outcomes.'
                : 'Benim için teknoloji yatırımlarının gerçek değeri; operasyonel verimlilik, güçlü müşteri deneyimi ve ölçülebilir ticari çıktılar üretmesiyle ortaya çıkar.'}
            </p>
            <p className="font-medium text-slate-900">
              {isEn
                ? 'I work with an approach that connects technology with business objectives and digital strategy with measurable commercial performance.'
                : 'Teknolojiyi iş hedefleriyle, dijital stratejiyi ölçülebilir ticari performansla buluşturan bir yaklaşımla çalışıyorum.'}
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/hakkimda')}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover cursor-pointer transition-colors"
            >
              <span>{isEn ? 'More About Me' : 'Hakkımda Daha Fazla'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mt-12 sm:mt-14">
          <ProfileCredentialsStrip />
        </div>
      </section>

      {/* 3. UZMANLIK ALANLARIM */}
      <section className="py-16 sm:py-22 bg-transparent border-b border-[#012253]/8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          <Reveal className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 text-center sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-brand-teal">
                {isEn ? 'Areas of Expertise' : 'Uzmanlık Alanlarım'}
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                {isEn
                  ? 'Connecting strategy with technology, and technology with business goals.'
                  : 'Stratejiyi teknolojiyle, teknolojiyi iş hedefleriyle buluşturuyorum.'}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('/uzmanlik-alanlarim')}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isEn ? 'All Expertise Areas' : 'Tüm Uzmanlık Alanlarım'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertiseAreas.map((area) => (
              <StaggerItem key={area.id}>
                <div className="h-full bg-white/75 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#012253]/8 space-y-3 text-center sm:text-left transition-all duration-200 hover:-translate-y-1 hover:bg-white/92 hover:border-brand-teal/25 hover:shadow-[0_14px_30px_-14px_rgba(1,34,83,0.14)]">
                  <p className="text-sm font-semibold text-brand-teal tabular-nums">
                    {area.number}
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                    {area.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {area.homeSummary}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* 4. DENEYİM VE YAKLAŞIM */}
      <section className="py-16 sm:py-22 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          <Reveal className="max-w-2xl mx-auto sm:mx-0 space-y-3 text-center sm:text-left">
            <p className="text-sm font-medium text-brand-teal">
              {isEn ? 'Experience & Approach' : 'Deneyim ve Yaklaşım'}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              {isEn
                ? 'Diverse disciplines, one shared goal: Sustainable growth.'
                : 'Farklı disiplinler, ortak bir hedef: Sürdürülebilir büyüme.'}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {isEn
                ? 'I bring together experience ranging from digital marketing operations to technology product marketing under a cohesive strategic perspective.'
                : 'Dijital pazarlama operasyonlarından teknoloji ürünlerinin pazarlanmasına kadar farklı alanlarda edindiğim deneyimi stratejik bir bakış açısıyla değerlendiriyorum.'}
            </p>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approachPillars.map((pillar, idx) => (
              <StaggerItem key={pillar.title}>
                <div className="pt-6 border-t border-slate-200 space-y-2.5 text-center md:text-left">
                  <span className="text-sm font-semibold text-brand-teal tabular-nums">
                    0{idx + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="text-center sm:text-left">
            <button
              type="button"
              onClick={() => navigate('/deneyim')}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover cursor-pointer"
            >
              <span>
                {isEn ? 'Explore Experience' : 'Deneyim Geçmişini İncele'}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* 5. ÖNE ÇIKAN PROJELER (KONU BAZLI) */}
      <section className="py-16 sm:py-22 bg-transparent border-b border-[#012253]/8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          <Reveal className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 text-center sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-brand-teal">
                {isEn ? 'Featured Projects' : 'Öne Çıkan Projeler'}
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                {isEn
                  ? 'Initiatives where strategy turns into execution.'
                  : 'Stratejinin uygulamaya dönüştüğü çalışmalar.'}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('/projeler')}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isEn ? 'Explore Projects' : 'Projeleri İnceleyin'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectItems.map((project) => (
              <StaggerItem key={project.id}>
                <div className="h-full bg-white/75 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#012253]/8 flex flex-col justify-between gap-4 text-center sm:text-left transition-all duration-200 hover:-translate-y-1 hover:bg-white/92 hover:border-brand-teal/25 hover:shadow-[0_14px_30px_-14px_rgba(1,34,83,0.14)]">
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-brand-teal tabular-nums">
                      {project.number}
                    </p>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                      {project.topicTitle}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {project.homeSummary}
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => navigate('/projeler')}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-brand-teal cursor-pointer transition-colors"
                    >
                      <span>{isEn ? 'View scope of work' : 'Çalışma kapsamını gör'}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* 6. İÇGÖRÜLER — SON 3 BLOG YAZISI */}
      <section className="py-16 sm:py-22 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          <Reveal className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 text-center sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-brand-teal">
                {isEn ? 'Insights & Blog' : 'İçgörüler & Blog'}
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                {isEn
                  ? 'Understanding a changing world is where shaping the future begins.'
                  : 'Değişen dünyayı anlamak, geleceği şekillendirmekle başlar.'}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {isEn
                  ? 'I share evaluations, industry analyses, and professional perspectives on digital transformation, insurance technologies, artificial intelligence, and digital growth.'
                  : 'Dijital dönüşüm, sigortacılık teknolojileri, yapay zekâ ve dijital büyüme üzerine değerlendirmelerimi, sektörel analizlerimi ve profesyonel görüşlerimi paylaşıyorum.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isEn ? 'All Articles' : 'Tüm Yazılarım'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <StaggerItem key={post.id} className="h-full">
                <article className="group h-full bg-white/85 backdrop-blur-md rounded-2xl border border-[#012253]/8 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:border-brand-teal/25 hover:shadow-[0_14px_30px_-14px_rgba(1,34,83,0.16)]">
                  <div>
                    <a
                      href={`/blog/${post.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/blog/${post.slug}`);
                      }}
                      className="block overflow-hidden"
                    >
                      <BlogCoverVisual
                        theme={post.coverTheme}
                        coverImage={post.coverImage}
                        title={post.title}
                        categoryLabel={post.categoryLabel}
                        slug={post.slug}
                      />
                    </a>

                    <div className="p-6 space-y-3 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500">
                        <span className="font-medium text-brand-teal">
                          {post.categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{post.publishedAt}</span>
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900 leading-snug group-hover:text-brand-navy transition-colors">
                        <a
                          href={`/blog/${post.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/blog/${post.slug}`);
                          }}
                        >
                          {post.title}
                        </a>
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {post.spot}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 text-center sm:text-left">
                    <a
                      href={`/blog/${post.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/blog/${post.slug}`);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover transition-colors"
                    >
                      <span>{isEn ? 'Read More' : 'Devamını Oku'}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* 7. SIKÇA SORULAN SORULAR (KISA ÖN İZLEME) */}
      <section className="py-16 sm:py-22 bg-transparent border-b border-[#012253]/8">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-8">
          <Reveal className="max-w-2xl mx-auto sm:mx-0 space-y-3 text-center sm:text-left">
            <p className="text-sm font-medium text-brand-teal">
              {isEn ? 'Frequently Asked Questions' : 'Sıkça Sorulan Sorular'}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              {isEn ? 'Key Questions' : 'Merak Edilenler'}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {isEn
                ? 'Find answers to common questions about my focus areas, consulting approach, and professional collaborations.'
                : 'Çalışma alanlarım, danışmanlık yaklaşımım ve profesyonel iş birlikleri hakkında sıkça sorulan soruların yanıtlarını burada bulabilirsiniz.'}
            </p>
          </Reveal>

          {/* Interactive FAQ Categories (matching FAQ page) */}
          <StaggerGroup
            staggerDelay={0.06}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {faqCategories.map((category) => {
              const isSelected = selectedFaqCategoryId === category.id;
              return (
                <StaggerItem key={category.id} distance={20}>
                  <button
                    type="button"
                    onClick={() => handleSelectFaqCategory(category)}
                    aria-pressed={isSelected}
                    className={`w-full min-h-[58px] p-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3 text-left cursor-pointer ${
                      isSelected
                        ? 'border-brand-teal bg-brand-teal-light/85 shadow-xs ring-1 ring-brand-teal/20'
                        : 'border-[#012253]/10 bg-white/75 backdrop-blur-md hover:border-brand-teal-soft hover:bg-white/95'
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-white border-brand-teal-soft'
                          : 'bg-white border-slate-200/80'
                      }`}
                    >
                      <FaqCategoryIcon icon={category.icon} />
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold truncate transition-colors ${
                          isSelected ? 'text-brand-navy' : 'text-slate-900'
                        }`}
                      >
                        {category.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {category.questions.length} {isEn ? 'questions' : 'soru'}
                      </p>
                    </div>
                  </button>
                </StaggerItem>
              );
            })}
          </StaggerGroup>

          <Reveal className="divide-y divide-slate-200/90 border-t border-b border-slate-200/90">
            {displayedFaqs.map((faq) => {
              const isOpen = openPreviewFaqId === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    onClick={() => setOpenPreviewFaqId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="w-full py-5 min-h-[52px] text-left flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className="text-base font-semibold text-slate-900 group-hover:text-brand-teal transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-teal' : ''
                      }`}
                    />
                  </button>
                  <AccordionBody
                    isOpen={isOpen}
                    className="pb-5 pr-6 space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed"
                  >
                    <p>{faq.answer}</p>
                    <button
                      type="button"
                      onClick={() => navigate(`/sss#${faq.id}`)}
                      className="text-xs font-semibold text-brand-teal hover:underline cursor-pointer"
                    >
                      {isEn ? 'View on FAQ page →' : 'SSS sayfasında görüntüle →'}
                    </button>
                  </AccordionBody>
                </div>
              );
            })}
          </Reveal>

          {/* Bottom Centered "View All Questions" Action */}
          <Reveal className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() =>
                navigate(
                  selectedFaqCategoryId ? `/sss#${selectedFaqCategoryId}` : '/sss'
                )
              }
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#012253]/12 bg-white/80 hover:bg-white hover:border-brand-teal/40 text-sm font-semibold text-brand-navy hover:text-brand-teal transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>{isEn ? 'View All Questions' : 'Tüm Soruları Görüntüle'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* 8. LINKEDIN PAYLAŞIMLARI */}
      <LinkedInPostsSection />

      {/* 9. İLETİŞİM CTA */}
      <section className="py-16 sm:py-22 bg-transparent border-b border-[#012253]/8">
        <Reveal className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <p className="text-sm font-medium text-brand-teal">
            {isEn ? 'Contact' : 'İletişim'}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            {isEn
              ? 'A space where ideas and professional connections create lasting value.'
              : 'Fikirlerin ve profesyonel bağlantıların değer yarattığı bir alan.'}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? 'Feel free to get in touch to exchange ideas on digital transformation, technology, insurance, and business strategy, build professional connections, or explore collaboration opportunities.'
              : 'Dijital dönüşüm, teknoloji, sigortacılık ve iş stratejileri üzerine fikir alışverişinde bulunmak, profesyonel bağlantılar kurmak ve iş birliği fırsatlarını değerlendirmek için benimle iletişime geçebilirsiniz.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/iletisim')}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white text-sm sm:text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#012253]/15 active:translate-y-0 cursor-pointer"
            >
              <span>{isEn ? 'Get in Touch' : 'İletişime Geçin'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
