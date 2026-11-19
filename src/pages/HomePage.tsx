import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import {
  BRAND_PROFILE,
  EXPERTISE_AREAS,
  APPROACH_PILLARS,
  PROJECT_ITEMS,
  FAQ_CATEGORIES,
} from '../data/siteContent';
import { BLOG_POSTS } from '../data/blogPosts';
import { useRouter } from '../context/RouterContext';
import ExecutivePortrait from '../components/ExecutivePortrait';
import BlogCoverVisual from '../components/BlogCoverVisual';
import LinkedInPostsSection from '../components/LinkedInPostsSection';

export default function HomePage() {
  const { navigate } = useRouter();
  const [openPreviewFaqId, setOpenPreviewFaqId] = useState<string | null>('soru-1');

  const latestPosts = BLOG_POSTS.slice(0, 3);
  const previewFaqs = [
    FAQ_CATEGORIES[0].questions[0],
    FAQ_CATEGORIES[1].questions[0],
    FAQ_CATEGORIES[1].questions[2],
    FAQ_CATEGORIES[3].questions[0],
  ];

  return (
    <div>
      {/* 1. HERO ALANI */}
      <section className="bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-16 sm:pt-18 sm:pb-22">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Main Editorial Positioning */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <p className="text-sm font-medium text-blue-700">
                {BRAND_PROFILE.positioning}
              </p>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.14] [text-wrap:balance]">
                Dijital dönüşümün merkezinde teknoloji ve doğru strateji var.
              </h1>

              <div className="space-y-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <p>
                  Dijital pazarlama, ürün stratejisi ve sigortacılık teknolojileri alanlarında edindiğim deneyimle dijital dünyanın değişen dinamiklerine odaklanıyorum.
                </p>
                <p className="text-sm sm:text-base text-slate-500">
                  Teknoloji, pazarlama ve iş stratejisini bir araya getirerek dijital ürünlerin gelişimini, markaların büyümesini ve sürdürülebilir iş modellerini destekleyen çalışmalarda yer alıyorum.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/hakkimda')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Hakkımda</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/uzmanlik-alanlarim')}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  Uzmanlık Alanlarım
                </button>
              </div>
            </div>

            {/* Right: Compact Executive Portrait Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200/90 space-y-6">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
                  <ExecutivePortrait size="md" />
                  <div className="min-w-0 space-y-1">
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                      {BRAND_PROFILE.name}
                    </h2>
                    <p className="text-sm text-slate-600 leading-snug">
                      {BRAND_PROFILE.positioning}
                    </p>
                    <a
                      href={BRAND_PROFILE.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline pt-0.5"
                    >
                      LinkedIn Profili →
                    </a>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-200/80 space-y-2.5 text-center sm:text-left">
                  <p className="text-xs font-medium text-slate-500">
                    Odak Alanları
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
                    <p>Dijital Pazarlama ve Büyüme</p>
                    <p>Ürün Stratejisi ve SaaS Büyüme Modelleri</p>
                    <p>Sigortacılık Teknolojileri ve Yapay Zekâ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KISA TANITIM */}
      <section className="py-16 sm:py-22 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6 text-center sm:text-left">
          <p className="text-sm font-medium text-blue-700">Kısa Tanıtım</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Dijital dünyayı yalnızca takip etmiyor, dönüşümünü anlamaya çalışıyorum.
          </h2>
          <div className="space-y-4 text-base text-slate-600 leading-relaxed">
            <p>
              Ben Tuğçe Utku. Dijital pazarlama, teknoloji ve ürün stratejisi alanlarında farklı sorumluluklar üstlenmiş bir profesyonelim.
            </p>
            <p>
              Kariyerim boyunca dijital pazarlama operasyonlarından ajans yönetimine, ürün pazarlamasından dijital büyüme stratejilerine uzanan farklı alanlarda çalıştım.
            </p>
            <p>
              Özellikle sigortacılık sektörünün dijital dönüşümü, yeni nesil iş modelleri, yapay zekâ uygulamaları ve dijital ürünlerin büyüme stratejileri üzerine odaklanıyorum.
            </p>
            <p className="font-medium text-slate-900">
              Benim için teknoloji bir araç, strateji ise bu aracın değer üretmesini sağlayan temel unsurdur.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/hakkimda')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer transition-colors"
            >
              <span>Hakkımda Daha Fazla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. UZMANLIK ALANLARIM */}
      <section className="py-16 sm:py-22 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 text-center sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-blue-700">
                Uzmanlık Alanlarım
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                Stratejiyi teknolojiyle, teknolojiyi iş hedefleriyle buluşturuyorum.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('/uzmanlik-alanlarim')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Tüm Uzmanlık Alanlarım</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXPERTISE_AREAS.map((area) => (
              <div
                key={area.id}
                className="bg-slate-50/70 rounded-2xl p-6 sm:p-8 border border-slate-200/90 space-y-3 text-center sm:text-left"
              >
                <p className="text-sm font-semibold text-blue-700 tabular-nums">
                  {area.number}
                </p>
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                  {area.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {area.homeSummary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DENEYİM VE YAKLAŞIM */}
      <section className="py-16 sm:py-22 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="max-w-2xl mx-auto sm:mx-0 space-y-3 text-center sm:text-left">
            <p className="text-sm font-medium text-blue-700">
              Deneyim ve Yaklaşım
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              Farklı disiplinler, ortak bir hedef: Sürdürülebilir büyüme.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Dijital pazarlama operasyonlarından teknoloji ürünlerinin pazarlanmasına kadar farklı alanlarda edindiğim deneyimi stratejik bir bakış açısıyla değerlendiriyorum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {APPROACH_PILLARS.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="pt-6 border-t border-slate-200 space-y-2.5 text-center md:text-left"
              >
                <span className="text-sm font-semibold text-blue-700 tabular-nums">
                  0{idx + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center sm:text-left">
            <button
              type="button"
              onClick={() => navigate('/deneyim')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
            >
              <span>Deneyim Geçmişini İncele</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. ÖNE ÇIKAN PROJELER (KONU BAZLI) */}
      <section className="py-16 sm:py-22 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 text-center sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-blue-700">
                Öne Çıkan Projeler
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                Stratejinin uygulamaya dönüştüğü çalışmalar.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('/projeler')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Projeleri İnceleyin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECT_ITEMS.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 flex flex-col justify-between gap-4 text-center sm:text-left"
              >
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-blue-700 tabular-nums">
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
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-700 cursor-pointer transition-colors"
                  >
                    <span>Çalışma kapsamını gör</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. İÇGÖRÜLER — SON 3 BLOG YAZISI */}
      <section className="py-16 sm:py-22 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 text-center sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-blue-700">
                İçgörüler &amp; Blog
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                Değişen dünyayı anlamak, geleceği şekillendirmekle başlar.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Dijital dönüşüm, sigortacılık teknolojileri, yapay zekâ ve dijital büyüme üzerine değerlendirmelerimi, sektörel analizlerimi ve profesyonel görüşlerimi paylaşıyorum.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Tüm Yazılarım</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <a
                    href={`/blog/${post.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/blog/${post.slug}`);
                    }}
                    className="block"
                  >
                    <BlogCoverVisual
                      theme={post.coverTheme}
                      title={post.title}
                      categoryLabel={post.categoryLabel}
                    />
                  </a>

                  <div className="p-6 space-y-3 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500">
                      <span className="font-medium text-blue-700">
                        {post.categoryLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{post.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
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
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    <span>Devamını Oku</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SIKÇA SORULAN SORULAR (KISA ÖN İZLEME) */}
      <section className="py-16 sm:py-22 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 text-center sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-blue-700">
                Sıkça Sorulan Sorular
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Merak Edilenler
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Çalışma alanlarım, danışmanlık yaklaşımım ve profesyonel iş birlikleri hakkında sıkça sorulan soruların yanıtlarını burada bulabilirsiniz.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/sss')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Tüm Soruları Görüntüle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {previewFaqs.map((faq) => {
              const isOpen = openPreviewFaqId === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPreviewFaqId(isOpen ? null : faq.id)
                    }
                    aria-expanded={isOpen}
                    className="w-full py-5 min-h-[52px] text-left flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-700' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 pr-6 space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                      <p>{faq.answer}</p>
                      <button
                        type="button"
                        onClick={() => navigate(`/sss#${faq.id}`)}
                        className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                      >
                        SSS sayfasında görüntüle →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. LINKEDIN PAYLAŞIMLARI */}
      <LinkedInPostsSection />

      {/* 9. İLETİŞİM CTA */}
      <section className="py-16 sm:py-22 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <p className="text-sm font-medium text-blue-700">İletişim</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Fikirlerin ve profesyonel bağlantıların değer yarattığı bir alan.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Dijital dönüşüm, teknoloji, sigortacılık ve iş stratejileri üzerine fikir alışverişinde bulunmak, profesyonel bağlantılar kurmak ve iş birliği fırsatlarını değerlendirmek için benimle iletişime geçebilirsiniz.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/iletisim')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm sm:text-base font-semibold transition-colors cursor-pointer"
            >
              <span>İletişime Geçin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
