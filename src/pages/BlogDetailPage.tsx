import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Link2,
  Linkedin,
  List,
} from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { slugifyTurkish, useBlog } from '../context/BlogContext';
import { upsertLinkTag, upsertMetaTag } from '../components/SeoHead';
import BlogCoverVisual from '../components/BlogCoverVisual';
import ExecutivePortrait from '../components/ExecutivePortrait';

interface BlogDetailPageProps {
  slug: string;
}

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const { getPosts, isLoading } = useBlog();
  const isEn = lang === 'en';
  const posts = getPosts(lang);
  const { brand } = getSiteContent(lang);

  const [copied, setCopied] = useState(false);

  const post = useMemo(() => {
    const cleanSlug = slug.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
    const normalizedSlug = slugifyTurkish(cleanSlug);
    return posts.find((item) => {
      const itemSlug = item.slug.toLowerCase();
      return (
        itemSlug === cleanSlug ||
        itemSlug === normalizedSlug ||
        slugifyTurkish(item.title) === normalizedSlug
      );
    });
  }, [posts, slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const sameCategory = posts.filter(
      (item) => item.slug !== post.slug && item.categoryKey === post.categoryKey
    );
    const others = posts.filter(
      (item) => item.slug !== post.slug && item.categoryKey !== post.categoryKey
    );
    return [...sameCategory, ...others].slice(0, 3);
  }, [post, posts]);

  useEffect(() => {
    if (!post) return;

    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://www.tugceutku.com';
    const canonicalUrl = `${origin}/blog/${post.slug}`;
    const fullTitle = `${post.title} | ${brand.name}`;
    const keywords = [...post.tags, post.categoryLabel, brand.name].join(', ');
    const isCustomPost = post.id.startsWith('custom-');
    const ogImageUrl = isCustomPost
      ? post.coverImage
        ? `${origin}/api/blog-cover/${encodeURIComponent(post.slug)}`
        : `${origin}/og-covers/theme-${post.coverTheme}.png`
      : `${origin}/og-covers/${post.slug}.png`;

    document.title = fullTitle;
    upsertMetaTag('name', 'description', post.spot);
    upsertMetaTag('name', 'keywords', keywords);
    upsertMetaTag(
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    upsertLinkTag('canonical', canonicalUrl);

    upsertMetaTag('property', 'og:type', 'article');
    upsertMetaTag('property', 'og:title', fullTitle);
    upsertMetaTag('property', 'og:description', post.spot);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:locale', isEn ? 'en_US' : 'tr_TR');
    upsertMetaTag('property', 'og:image', ogImageUrl);
    upsertMetaTag('property', 'og:image:secure_url', ogImageUrl);
    upsertMetaTag('property', 'og:image:type', 'image/png');
    upsertMetaTag('property', 'og:image:width', '1200');
    upsertMetaTag('property', 'og:image:height', '630');
    upsertMetaTag('property', 'og:image:alt', post.title);
    upsertMetaTag('property', 'article:published_time', post.publishedIso);
    upsertMetaTag('property', 'article:author', brand.name);
    upsertMetaTag('property', 'article:section', post.categoryLabel);
    upsertMetaTag('name', 'twitter:title', fullTitle);
    upsertMetaTag('name', 'twitter:description', post.spot);
    upsertMetaTag('name', 'twitter:image', ogImageUrl);

    const allText = post.sections
      .map((section) => `${section.heading}. ${section.paragraphs.join(' ')}`)
      .join(' ');
    const wordCount = allText.trim().split(/\s+/).filter(Boolean).length;
    const minutesMatch = post.readingTime.match(/\d+/);
    const timeRequired = `PT${minutesMatch ? minutesMatch[0] : '5'}M`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${canonicalUrl}#article`,
          headline: post.title,
          alternativeHeadline: post.spot,
          description: post.spot,
          abstract: post.spot,
          image: {
            '@type': 'ImageObject',
            url: ogImageUrl,
            width: 1200,
            height: 630,
          },
          keywords: post.tags.join(', '),
          about: post.tags.map((tag) => ({
            '@type': 'Thing',
            name: tag,
          })),
          wordCount,
          timeRequired,
          isAccessibleForFree: true,
          datePublished: post.publishedIso,
          dateModified: post.publishedIso,
          inLanguage: isEn ? 'en-US' : 'tr-TR',
          url: canonicalUrl,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
          },
          author: {
            '@type': 'Person',
            '@id': `${origin}/#person`,
            name: brand.name,
            url: `${origin}/`,
            sameAs: [brand.linkedin],
          },
          publisher: {
            '@type': 'Person',
            '@id': `${origin}/#person`,
            name: brand.name,
            url: `${origin}/`,
          },
          articleSection: post.categoryLabel,
          articleBody: allText,
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', '.geo-summary'],
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: isEn ? 'Home' : 'Ana Sayfa',
              item: `${origin}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: `${origin}/blog`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: canonicalUrl,
            },
          ],
        },
      ],
    };

    const existing = document.getElementById('blog-detail-jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-detail-jsonld';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('blog-detail-jsonld');
      if (el) el.remove();
    };
  }, [post, brand.name, brand.linkedin, isEn]);

  if (!post && isLoading) {
    return (
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-5 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-10 w-3/4 bg-slate-200 rounded" />
          <div className="h-5 w-full bg-slate-100 rounded" />
          <div className="aspect-[16/9] w-full bg-slate-100 rounded-2xl mt-6" />
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center space-y-5">
          <p className="text-sm font-medium text-blue-700">Blog</p>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
            {isEn ? 'Article not found.' : 'Aradığınız yazı bulunamadı.'}
          </h1>
          <p className="text-base text-slate-600">
            {isEn
              ? 'This link may have been updated or moved. You can browse all published articles on the blog page.'
              : 'Bağlantı güncellenmiş veya kaldırılmış olabilir. Tüm güncel analiz ve yazılara blog sayfasından ulaşabilirsiniz.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? 'Back to All Articles' : 'Tüm Yazılara Dön'}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://tugceutku.com';
  const currentUrl = `${origin}/blog/${post.slug}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    currentUrl
  )}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const scrollToHeading = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <article className="bg-white">
      {/* Header Area */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 pb-10 sm:pt-14 sm:pb-12 space-y-6">
          {/* 1. Breadcrumb */}
          <nav
            aria-label={isEn ? 'Breadcrumb' : 'Sayfa yolu'}
            className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm text-slate-500"
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="hover:text-slate-900 transition-colors"
            >
              {isEn ? 'Home' : 'Ana Sayfa'}
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                navigate('/blog');
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Blog
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-700 font-medium">{post.categoryLabel}</span>
          </nav>

          {/* 2. Category + 3. Title + 4. Spot */}
          <div className="space-y-4 text-center sm:text-left">
            <p className="text-sm font-semibold text-blue-700">{post.categoryLabel}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 leading-[1.16] [text-wrap:balance]">
              {post.title}
            </h1>
            <p className="geo-summary text-base sm:text-lg text-slate-600 leading-relaxed">
              {post.spot}
            </p>
          </div>

          {/* 5. Author & Date + 6. Reading Time + Share */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{brand.name}</span>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedIso}>{post.publishedAt}</time>
              </span>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0A66C2] text-xs font-semibold text-slate-700 hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>{isEn ? 'Share on LinkedIn' : "LinkedIn'de Paylaş"}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">
                      {isEn ? 'Copied' : 'Kopyalandı'}
                    </span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Link' : 'Bağlantı'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 7. Cover Image */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10">
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <BlogCoverVisual
            theme={post.coverTheme}
            coverImage={post.coverImage}
            title={post.title}
            categoryLabel={post.categoryLabel}
          />
        </div>
      </div>

      {/* Main Content + 8. Table of Contents */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-10">
        {post.sections.length > 1 && (
          <aside
            aria-label={isEn ? 'Table of Contents' : 'İçindekiler'}
            className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <List className="w-4 h-4 text-blue-700" />
              <span>{isEn ? 'Table of Contents' : 'İçindekiler'}</span>
            </div>
            <ol className="space-y-2 text-sm text-slate-600">
              {post.sections.map((section, idx) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToHeading(section.id)}
                    className="text-left hover:text-blue-700 transition-colors cursor-pointer flex items-baseline gap-2"
                  >
                    <span className="text-xs font-semibold text-slate-400">
                      0{idx + 1}.
                    </span>
                    <span>{section.heading}</span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        )}

        {/* 9. Article Body */}
        <div className="space-y-10">
          {post.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {section.heading}
              </h2>
              <div className="space-y-4 text-base sm:text-[17px] text-slate-700 leading-[1.8]">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Content Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600"
              >
                <span className="opacity-60">#</span>
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* 12. Bottom Share Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to All Articles' : 'Tüm Yazılara Dön'}</span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={linkedInShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#0958a8] text-sm font-semibold text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>{isEn ? 'Share on LinkedIn' : "LinkedIn'de Paylaş"}</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">
                    {isEn ? 'Link Copied' : 'Bağlantı Kopyalandı'}
                  </span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>{isEn ? 'Copy Link' : 'Bağlantıyı Kopyala'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 10. Author Bio Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
          <ExecutivePortrait size="md" />
          <div className="space-y-2.5 min-w-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                {isEn ? 'About the Author' : 'Yazar Hakkında'}
              </p>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{brand.name}</h3>
              <p className="text-xs font-medium text-slate-500">{brand.positioning}</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isEn
                ? 'Working across digital marketing, product strategy, and insurance technologies—bringing technology, marketing, and business strategy together to support sustainable growth for brands and digital products.'
                : 'Dijital pazarlama, ürün stratejisi ve sigortacılık teknolojileri alanlarında çalışıyorum. Teknoloji, pazarlama ve iş stratejisini bir araya getirerek markaların ve dijital ürünlerin sürdürülebilir büyümesini destekleyen projelerde yer alıyorum.'}
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm">
              <button
                type="button"
                onClick={() => navigate('/hakkimda')}
                className="font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
              >
                {isEn ? 'About Me →' : 'Hakkımda →'}
              </button>
              <a
                href={brand.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-600 hover:text-slate-900"
              >
                {isEn ? 'LinkedIn Profile' : 'LinkedIn Profili'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 11. Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-14 sm:py-16 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {isEn ? 'Related Articles' : 'İlgili Yazılar'}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
              >
                {isEn ? 'All Articles →' : 'Tüm Yazılarım →'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <article
                  key={related.id}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors overflow-hidden flex flex-col"
                >
                  <a
                    href={`/blog/${related.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/blog/${related.slug}`);
                    }}
                    className="block overflow-hidden"
                  >
                    <BlogCoverVisual
                      theme={related.coverTheme}
                      coverImage={related.coverImage}
                      title={related.title}
                      categoryLabel={related.categoryLabel}
                    />
                  </a>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4 text-center sm:text-left">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-blue-700">
                        {related.categoryLabel}
                      </p>
                      <h3 className="text-base font-semibold text-slate-900 leading-snug">
                        <a
                          href={`/blog/${related.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/blog/${related.slug}`);
                          }}
                          className="hover:text-blue-700 transition-colors"
                        >
                          {related.title}
                        </a>
                      </h3>
                    </div>
                    <a
                      href={`/blog/${related.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/blog/${related.slug}`);
                      }}
                      className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      <span>{isEn ? 'Read More' : 'Devamını Oku'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
