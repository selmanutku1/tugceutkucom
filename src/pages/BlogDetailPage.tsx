import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
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
import RichArticleContent, {
  extractOutlineFromSections,
  stripMarkdownForStats,
} from '../components/RichArticleContent';
import {
  ReadingProgressBar,
  Reveal,
  StaggerGroup,
  StaggerItem,
} from '../components/MotionPrimitives';

interface BlogDetailPageProps {
  slug: string;
}

function XBrandIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const { getPosts, isBuiltInPost, isLoading } = useBlog();
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
        (item.h1Title ? slugifyTurkish(item.h1Title) === normalizedSlug : false) ||
        slugifyTurkish(item.title) === normalizedSlug
      );
    });
  }, [posts, slug]);

  const outlineItems = useMemo(
    () => (post ? extractOutlineFromSections(post.sections) : []),
    [post]
  );

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
    const displayH1 = post.h1Title?.trim() || post.title;
    const fullTitle = `${post.title} | ${brand.name}`;
    const keywords = [...post.tags, post.categoryLabel, brand.name].join(', ');
    const isCustomPost = !isBuiltInPost(post.id);
    const hasUploadedCover = Boolean(
      post.coverImage && post.coverImage.startsWith('data:image/')
    );
    const hasHttpCover = Boolean(
      post.coverImage && /^https?:\/\//i.test(post.coverImage)
    );
    const coverVersion = hasUploadedCover ? `?v=${post.coverImage?.length || 1}` : '';
    const ogImageUrl = hasUploadedCover
      ? `${origin}/api/blog-cover/${encodeURIComponent(post.slug)}${coverVersion}`
      : hasHttpCover && post.coverImage
        ? post.coverImage
        : isCustomPost
          ? `${origin}/og-covers/theme-${post.coverTheme || 'transformation'}.jpg`
          : `${origin}/og-covers/${encodeURIComponent(post.slug)}.jpg`;
    const ogImageType =
      hasUploadedCover && post.coverImage?.startsWith('data:image/png')
        ? 'image/png'
        : 'image/jpeg';

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
    upsertMetaTag('property', 'og:image:type', ogImageType);
    upsertMetaTag('property', 'og:image:width', String(post.coverImageMeta?.width || 1200));
    upsertMetaTag('property', 'og:image:height', String(post.coverImageMeta?.height || 630));
    upsertMetaTag('property', 'og:image:alt', displayH1);
    upsertMetaTag('property', 'article:published_time', post.publishedIso);
    upsertMetaTag('property', 'article:author', brand.name);
    upsertMetaTag('property', 'article:section', post.categoryLabel);
    upsertMetaTag('name', 'twitter:title', fullTitle);
    upsertMetaTag('name', 'twitter:description', post.spot);
    upsertMetaTag('name', 'twitter:image', ogImageUrl);

    const allText = stripMarkdownForStats(
      post.sections
        .map((section) => `${section.heading}. ${section.paragraphs.join(' ')}`)
        .join(' ')
    );
    const wordCount = allText.split(/\s+/).filter(Boolean).length;
    const minutesMatch = post.readingTime.match(/\d+/);
    const timeRequired = `PT${minutesMatch ? minutesMatch[0] : '5'}M`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${canonicalUrl}#article`,
          headline: displayH1,
          alternativeHeadline: post.title !== displayH1 ? post.title : post.spot,
          description: post.spot,
          abstract: post.spot,
          image: {
            '@type': 'ImageObject',
            url: ogImageUrl,
            width: post.coverImageMeta?.width || 1200,
            height: post.coverImageMeta?.height || 630,
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
              name: displayH1,
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
  }, [post, brand.name, brand.linkedin, isEn, isBuiltInPost]);

  if (!post && isLoading) {
    return (
      <section className="py-20 sm:py-28 bg-transparent">
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
      <section className="py-20 sm:py-28 bg-transparent">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center space-y-5">
          <p className="text-sm font-medium text-brand-teal">Blog</p>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy-hover rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? 'Back to All Articles' : 'Tüm Yazılara Dön'}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const displayH1 = post.h1Title?.trim() || post.title;
  const hasDistinctArticleTitle = Boolean(
    post.h1Title?.trim() && post.h1Title.trim() !== post.title.trim()
  );

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.tugceutku.com';
  const currentUrl = `${origin}/blog/${post.slug}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    currentUrl
  )}`;
  const xShareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
    currentUrl
  )}&text=${encodeURIComponent(displayH1)}`;

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
    <article className="bg-white/55 backdrop-blur-[2px]">
      <ReadingProgressBar />

      {/* Header Area */}
      <header className="border-b border-[#012253]/8 bg-white/40">
        <Reveal immediate className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 pb-10 sm:pt-14 sm:pb-12 space-y-6">
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

          {/* 2. Category + Article Display Title (if distinct from H1) + H1 + Spot */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
              <p className="text-sm font-semibold text-brand-teal">{post.categoryLabel}</p>
              {hasDistinctArticleTitle && (
                <>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <p className="text-sm font-medium text-slate-600">{post.title}</p>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 leading-[1.16] [text-wrap:balance]">
              {displayH1}
            </h1>
            <p className="geo-summary text-base sm:text-lg text-slate-600 leading-relaxed">
              {post.spot}
            </p>
          </div>

          {/* 5. Author & Date + Share */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{brand.name}</span>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedIso}>{post.publishedAt}</time>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isEn ? 'Share on LinkedIn' : "LinkedIn'de paylaş"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0A66C2] text-xs font-semibold text-slate-700 hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </a>
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={isEn ? 'Share on X' : "X'te paylaş"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-900 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
              >
                <XBrandIcon className="w-3.5 h-3.5" />
                <span>X</span>
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
        </Reveal>
      </header>

      {/* 7. Cover Image */}
      <Reveal immediate delay={0.14} distance={32} className="max-w-4xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10">
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
          <BlogCoverVisual
            theme={post.coverTheme}
            coverImage={post.coverImage}
            title={post.title}
            categoryLabel={post.categoryLabel}
            slug={post.slug}
            variant="hero"
          />
        </div>
      </Reveal>

      {/* Main Content + 8. Table of Contents */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-10">
        {outlineItems.length > 1 && (
          <Reveal direction="left" distance={28}>
            <aside
              aria-label={isEn ? 'Table of Contents' : 'İçindekiler'}
              className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 space-y-3"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <List className="w-4 h-4 text-brand-teal" />
                <span>{isEn ? 'Table of Contents' : 'İçindekiler'}</span>
              </div>
              <ol className="space-y-2 text-sm text-slate-600">
                {outlineItems.map((item, idx) => (
                  <li
                    key={`${item.id}-${idx}`}
                    className={
                      item.level === 3
                        ? 'pl-5'
                        : item.level === 4
                          ? 'pl-9'
                          : ''
                    }
                  >
                    <button
                      type="button"
                      onClick={() => scrollToHeading(item.id)}
                      className="text-left hover:text-brand-teal transition-colors cursor-pointer flex items-baseline gap-2"
                    >
                      {item.level === 2 ? (
                        <span className="text-xs font-semibold text-slate-400">
                          {String(
                            outlineItems
                              .slice(0, idx + 1)
                              .filter((h) => h.level === 2).length
                          ).padStart(2, '0')}
                          .
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">↳</span>
                      )}
                      <span>{item.text}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </aside>
          </Reveal>
        )}

        {/* 9. Article Body with H2/H3/H4, Rich Styling, Safe Links, and Inline Images */}
        <div className="space-y-10">
          {post.sections.map((section) => (
            <Reveal key={section.id} distance={28}>
              <section id={section.id} className="scroll-mt-24 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {section.heading}
                </h2>
                <RichArticleContent
                  paragraphs={section.paragraphs}
                  onNavigate={navigate}
                />
              </section>
            </Reveal>
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

        {/* 12. Dedicated End-of-Article Social Share Panel */}
        <Reveal>
          <section
            aria-label={isEn ? 'Share this article' : 'Bu yazıyı paylaş'}
            className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 sm:p-6 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-900">
                  {isEn ? 'Share this article' : 'Bu yazıyı paylaş'}
                </p>
                <p className="text-xs sm:text-sm text-slate-500">
                  {isEn
                    ? 'Found it valuable? Share it directly with your network.'
                    : 'Yazıyı faydalı bulduysanız ağınızla hızlıca paylaşabilirsiniz.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
                <a
                  href={linkedInShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isEn ? 'Share on LinkedIn' : "LinkedIn'de paylaş"}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#0A66C2] hover:bg-[#0A66C2]/[0.05] text-sm font-semibold text-slate-800 hover:text-[#0A66C2] transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={xShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isEn ? 'Share on X' : "X'te paylaş"}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-900 hover:bg-slate-900 text-sm font-semibold text-slate-800 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  <XBrandIcon className="w-4 h-4" />
                  <span>X</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label={isEn ? 'Copy article link' : 'Yazı bağlantısını kopyala'}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-teal hover:text-brand-teal text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">
                        {isEn ? 'Copied' : 'Kopyalandı'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      <span>{isEn ? 'Copy Link' : 'Bağlantı'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-teal transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isEn ? 'Back to All Articles' : 'Tüm Yazılara Dön'}</span>
              </button>
            </div>
          </section>
        </Reveal>

        {/* 10. Author Bio Card */}
        <Reveal>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <ExecutivePortrait size="md" />
            <div className="space-y-2.5 min-w-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
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
                  className="font-semibold text-brand-teal hover:text-brand-teal-hover cursor-pointer"
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
        </Reveal>
      </div>

      {/* 11. Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-14 sm:py-16 bg-white/40 border-t border-[#012253]/8">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {isEn ? 'Related Articles' : 'İlgili Yazılar'}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="text-sm font-semibold text-brand-teal hover:text-brand-teal-hover cursor-pointer"
              >
                {isEn ? 'All Articles →' : 'Tüm Yazılarım →'}
              </button>
            </div>

            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <StaggerItem key={related.id} className="h-full">
                  <article className="group h-full bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_-14px_rgba(15,23,42,0.14)] overflow-hidden flex flex-col">
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
                        slug={related.slug}
                      />
                    </a>
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4 text-center sm:text-left">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-brand-teal">
                          {related.categoryLabel}
                        </p>
                        <h3 className="text-base font-semibold text-slate-900 leading-snug">
                          <a
                            href={`/blog/${related.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/blog/${related.slug}`);
                            }}
                            className="hover:text-brand-navy transition-colors"
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
                        className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover"
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
      )}
    </article>
  );
}
