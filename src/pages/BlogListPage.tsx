import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Hash,
  Linkedin,
  Search,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { getBlogData } from '../data/blogPostsEn';
import { BlogCategoryKey } from '../types';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { useBlog } from '../context/BlogContext';
import BlogCoverVisual from '../components/BlogCoverVisual';
import { EXECUTIVE_EASE, Reveal } from '../components/MotionPrimitives';

const PAGE_SIZE = 3;

function normalizeForSearch(input: string, locale: string): string {
  return input
    .toLocaleLowerCase(locale)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .trim();
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);
  return pages;
}

export default function BlogListPage() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const { getPosts } = useBlog();
  const isEn = lang === 'en';
  const locale = isEn ? 'en' : 'tr';
  const { filters } = getBlogData(lang);
  const posts = getPosts(lang);

  const [selectedCategory, setSelectedCategory] = useState<'all' | BlogCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const listSectionRef = useRef<HTMLElement | null>(null);

  const featuredPost = useMemo(
    () => posts.find((post) => post.featured) || posts[0],
    [posts]
  );

  // Compute popular tags across all articles for one-click tag filtering
  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [posts]);

  const isDefaultView = selectedCategory === 'all' && searchQuery.trim() === '';

  const filteredPosts = useMemo(() => {
    const normalizedQuery = normalizeForSearch(searchQuery, locale);

    return posts.filter((post) => {
      if (isDefaultView && post.id === featuredPost.id) {
        return false;
      }

      const matchesCategory =
        selectedCategory === 'all' || post.categoryKey === selectedCategory;

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const normalizedTitle = normalizeForSearch(post.title, locale);
      const normalizedTags = post.tags.map((t) => normalizeForSearch(t, locale));
      const normalizedCategory = normalizeForSearch(post.categoryLabel, locale);

      return (
        normalizedTitle.includes(normalizedQuery) ||
        normalizedTags.some((tag) => tag.includes(normalizedQuery)) ||
        normalizedCategory.includes(normalizedQuery)
      );
    });
  }, [posts, selectedCategory, searchQuery, isDefaultView, featuredPost.id, locale]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  const handleCategoryChange = (key: 'all' | BlogCategoryKey) => {
    setSelectedCategory(key);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    const alreadySelected =
      normalizeForSearch(searchQuery, locale) === normalizeForSearch(tag, locale);
    setSearchQuery(alreadySelected ? '' : tag);
    setCurrentPage(1);
    if (!alreadySelected && listSectionRef.current) {
      listSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === safePage) return;
    setCurrentPage(page);
    if (listSectionRef.current) {
      listSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getShareUrl = (slug: string) => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://tugceutku.com';
    const postUrl = `${origin}/blog/${slug}`;
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
  };

  return (
    <div>
      {/* Page Header + Prominent Title & Tag Search Bar */}
      <section className="border-b border-[#012253]/8 bg-transparent">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-12 sm:pt-16 sm:pb-14 space-y-8">
          <Reveal immediate className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            <p className="text-sm font-medium text-brand-teal">
              {isEn ? 'Blog & Insights' : 'Blog ve İçgörüler'}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.14] [text-wrap:balance]">
              {isEn
                ? 'Thoughts, analyses, and industry insights.'
                : 'Düşünceler, analizler ve sektörel içgörüler.'}
            </h1>
            <div className="space-y-3 text-base sm:text-lg text-slate-600 leading-relaxed pt-1">
              <p>
                {isEn
                  ? 'I share observations, strategic assessments, and industry analyses across digital transformation, insurance technologies, artificial intelligence, and digital growth.'
                  : 'Dijital dönüşüm, sigortacılık teknolojileri, yapay zekâ ve dijital büyüme alanlarında gözlemlerimi, stratejik değerlendirmelerimi ve sektörel analizlerimi paylaşıyorum.'}
              </p>
              <p className="text-sm sm:text-base text-slate-500">
                {isEn
                  ? 'Aimed at offering practical perspectives for executives, technology teams, and insurance industry decision-makers.'
                  : 'Karar vericiler, teknoloji ekipleri ve sigorta sektörü profesyonelleri için uygulanabilir perspektifler sunmayı hedefliyorum.'}
              </p>
            </div>
          </Reveal>

          {/* Search Bar Across Article Titles & Content Tags */}
          <Reveal immediate delay={0.12} className="max-w-2xl mx-auto sm:mx-0 space-y-3">
            <div className="relative">
              <Search
                className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={
                  isEn
                    ? 'Search by article title or content tag (e.g. AI, Insurance CRM, SaaS)...'
                    : 'Makale başlığı veya içerik etiketi ara (ör. Yapay Zekâ, Sigorta CRM, SaaS)...'
                }
                aria-label={
                  isEn
                    ? 'Search across article titles and content tags'
                    : 'Makale başlıkları ve içerik etiketlerinde ara'
                }
                className="w-full pl-12 pr-11 py-3.5 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal focus:ring-2 focus:ring-brand-teal-soft transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  aria-label={isEn ? 'Clear search' : 'Aramayı temizle'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Clickable Content Tags */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <span className="text-xs font-medium text-slate-400 mr-1">
                {isEn ? 'Popular tags:' : 'Popüler etiketler:'}
              </span>
              {popularTags.map((tag) => {
                const isActiveTag =
                  normalizeForSearch(searchQuery, locale) ===
                  normalizeForSearch(tag, locale);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      isActiveTag
                        ? 'bg-brand-navy text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-brand-teal-light hover:text-brand-teal'
                    }`}
                  >
                    <Hash className="w-3 h-3 opacity-70" />
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Article (shown on page 1 of default view) */}
      {isDefaultView && safePage === 1 && featuredPost && (
        <section className="py-12 sm:py-16 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
          <Reveal immediate delay={0.18} distance={36} className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="mb-5 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
                {isEn ? 'Featured Article' : 'Öne Çıkan Yazı'}
              </p>
            </div>

            <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300 hover:border-slate-300 hover:shadow-[0_16px_36px_-18px_rgba(15,23,42,0.16)]">
              <a
                href={`/blog/${featuredPost.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/blog/${featuredPost.slug}`);
                }}
                className="lg:col-span-7 block overflow-hidden"
              >
                <BlogCoverVisual
                  theme={featuredPost.coverTheme}
                  coverImage={featuredPost.coverImage}
                  title={featuredPost.title}
                  categoryLabel={featuredPost.categoryLabel}
                  className="h-full w-full"
                />
              </a>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6 text-center sm:text-left">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                    <span className="text-brand-teal font-semibold">
                      {featuredPost.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredPost.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readingTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
                    <a
                      href={`/blog/${featuredPost.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/blog/${featuredPost.slug}`);
                      }}
                      className="hover:text-brand-navy transition-colors"
                    >
                      {featuredPost.title}
                    </a>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {featuredPost.spot}
                  </p>

                  {/* Featured Post Content Tags */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                    {featuredPost.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-brand-teal-light text-xs font-medium text-slate-600 hover:text-brand-teal transition-colors cursor-pointer"
                      >
                        <span className="opacity-60">#</span>
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={`/blog/${featuredPost.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/blog/${featuredPost.slug}`);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover transition-colors"
                  >
                    <span>{isEn ? 'Read More' : 'Devamını Oku'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>

                  <a
                    href={getShareUrl(featuredPost.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#0A66C2] transition-colors"
                    aria-label={
                      isEn
                        ? `Share ${featuredPost.title} on LinkedIn`
                        : `${featuredPost.title} yazısını LinkedIn'de paylaş`
                    }
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Share' : 'Paylaş'}</span>
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        </section>
      )}

      {/* Category Filter Tabs & Article Grid */}
      <section ref={listSectionRef} className="py-12 sm:py-16 bg-transparent scroll-mt-18">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
          {/* Category Tabs & Active Search Result Summary */}
          <Reveal className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div
              role="tablist"
              aria-label={isEn ? 'Blog categories' : 'Blog kategorileri'}
              className="flex flex-wrap items-center justify-center sm:justify-start gap-2"
            >
              {filters.map((filter) => {
                const active = selectedCategory === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleCategoryChange(filter.key)}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="blog-category-active"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-lg bg-brand-navy"
                      />
                    )}
                    <span className="relative z-10">{filter.label}</span>
                  </button>
                );
              })}
            </div>

            {searchQuery.trim() !== '' && (
              <div className="flex items-center justify-center sm:justify-end gap-2 text-xs sm:text-sm text-slate-600 shrink-0">
                <span>
                  {isEn
                    ? `${filteredPosts.length} result${filteredPosts.length === 1 ? '' : 's'} for "${searchQuery.trim()}"`
                    : `"${searchQuery.trim()}" için ${filteredPosts.length} sonuç`}
                </span>
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="font-semibold text-brand-teal hover:underline cursor-pointer"
                >
                  {isEn ? 'Clear' : 'Temizle'}
                </button>
              </div>
            )}
          </Reveal>

          {/* Articles Grid with Smooth Filter Transitions */}
          {paginatedPosts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {paginatedPosts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{
                      duration: 0.34,
                      delay: idx * 0.04,
                      ease: EXECUTIVE_EASE,
                    }}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_-14px_rgba(15,23,42,0.14)] overflow-hidden flex flex-col"
                  >
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
                    />
                  </a>

                  <div className="p-6 flex-1 flex flex-col justify-between gap-5 text-center sm:text-left">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="font-semibold text-brand-teal">
                          {post.categoryLabel}
                        </span>
                        <span>{post.publishedAt}</span>
                        <span>{post.readingTime}</span>
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900 leading-snug tracking-tight">
                        <a
                          href={`/blog/${post.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/blog/${post.slug}`);
                          }}
                          className="hover:text-brand-navy transition-colors"
                        >
                          {post.title}
                        </a>
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {post.spot}
                      </p>

                      {/* Clickable Content Tags */}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                        {post.tags.map((tag) => {
                          const isMatched =
                            searchQuery.trim() !== '' &&
                            normalizeForSearch(tag, locale).includes(
                              normalizeForSearch(searchQuery, locale)
                            );
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleTagClick(tag)}
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                                isMatched
                                  ? 'bg-brand-teal-light text-brand-navy ring-1 ring-brand-teal-soft'
                                  : 'bg-slate-100 text-slate-600 hover:bg-brand-teal-light hover:text-brand-teal'
                              }`}
                            >
                              <span className="opacity-60">#</span>
                              <span>{tag}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
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

                      <a
                        href={getShareUrl(post.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-[#0A66C2] transition-colors"
                        aria-label={
                          isEn
                            ? `Share ${post.title} on LinkedIn`
                            : `${post.title} yazısını LinkedIn'de paylaş`
                        }
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center space-y-4">
              <p className="text-base font-semibold text-slate-900">
                {isEn
                  ? 'No articles matched your title or tag search.'
                  : 'Başlık veya etiket aramanızla eşleşen yazı bulunamadı.'}
              </p>
              <p className="text-sm text-slate-600">
                {isEn
                  ? 'Try another keyword or reset the category filter.'
                  : 'Farklı bir başlık kelimesi ya da etiket deneyebilir veya filtreleri temizleyebilirsiniz.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-brand-teal bg-brand-teal-light hover:bg-brand-teal-soft rounded-lg transition-colors cursor-pointer"
              >
                {isEn ? 'Reset Filters' : 'Filtreleri Temizle'}
              </button>
            </div>
          )}

          {/* Numbered Pagination (1, 2, 3 ... N) */}
          {totalPages > 1 && (
            <nav
              aria-label={isEn ? 'Blog pagination' : 'Blog sayfalama'}
              className="pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <button
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                aria-label={isEn ? 'Previous page' : 'Önceki sayfa'}
                className="min-w-[40px] h-10 px-2.5 sm:px-3 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{isEn ? 'Prev' : 'Önceki'}</span>
              </button>

              {pageNumbers.map((item, idx) =>
                item === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-10 inline-flex items-center justify-center text-sm text-slate-400 select-none"
                    aria-hidden="true"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePageChange(item)}
                    aria-current={safePage === item ? 'page' : undefined}
                    aria-label={isEn ? `Page ${item}` : `Sayfa ${item}`}
                    className={`min-w-[40px] h-10 px-3 inline-flex items-center justify-center rounded-lg text-sm font-semibold tabular-nums transition-colors cursor-pointer ${
                      safePage === item
                        ? 'bg-brand-navy text-white border border-brand-navy'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                aria-label={isEn ? 'Next page' : 'Sonraki sayfa'}
                className="min-w-[40px] h-10 px-2.5 sm:px-3 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">{isEn ? 'Next' : 'Sonraki'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
