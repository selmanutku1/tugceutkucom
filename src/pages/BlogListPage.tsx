import { useMemo, useState } from 'react';
import { ArrowRight, Calendar, Clock, Linkedin, Search, X } from 'lucide-react';
import { BLOG_FILTERS, BLOG_POSTS } from '../data/blogPosts';
import { BlogCategoryKey } from '../types';
import { useRouter } from '../context/RouterContext';
import BlogCoverVisual from '../components/BlogCoverVisual';

const PAGE_SIZE = 6;

export default function BlogListPage() {
  const { navigate } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'all' | BlogCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const featuredPost = useMemo(
    () => BLOG_POSTS.find((post) => post.featured) || BLOG_POSTS[0],
    []
  );

  const isDefaultView = selectedCategory === 'all' && searchQuery.trim() === '';

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('tr');

    return BLOG_POSTS.filter((post) => {
      if (isDefaultView && post.id === featuredPost.id) {
        return false;
      }

      const matchesCategory =
        selectedCategory === 'all' || post.categoryKey === selectedCategory;

      if (!matchesCategory) return false;

      if (!query) return true;

      const haystack = `${post.title} ${post.spot} ${post.categoryLabel}`.toLocaleLowerCase('tr');
      return haystack.includes(query);
    });
  }, [selectedCategory, searchQuery, isDefaultView, featuredPost.id]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleCategoryChange = (key: 'all' | BlogCategoryKey) => {
    setSelectedCategory(key);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  const getShareUrl = (slug: string) => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://tugceutku.com';
    const postUrl = `${origin}/blog/${slug}`;
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-12 sm:pt-16 sm:pb-14">
          <div className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            <p className="text-sm font-medium text-blue-700">Blog ve İçgörüler</p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.14] [text-wrap:balance]">
              Düşünceler, analizler ve sektörel içgörüler.
            </h1>
            <div className="space-y-3 text-base sm:text-lg text-slate-600 leading-relaxed pt-1">
              <p>
                Dijital dönüşüm, sigortacılık teknolojileri, yapay zekâ ve dijital büyüme
                alanlarında gözlemlerimi, stratejik değerlendirmelerimi ve sektörel
                analizlerimi paylaşıyorum.
              </p>
              <p className="text-sm sm:text-base text-slate-500">
                Karar vericiler, teknoloji ekipleri ve sigorta sektörü profesyonelleri için
                uygulanabilir perspektifler sunmayı hedefliyorum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article (shown in default unfiltered view) */}
      {isDefaultView && featuredPost && (
        <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="mb-5 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Öne Çıkan Yazı
              </p>
            </div>

            <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
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
                  title={featuredPost.title}
                  categoryLabel={featuredPost.categoryLabel}
                  className="h-full w-full"
                />
              </a>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6 text-center sm:text-left">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                    <span className="text-blue-700 font-semibold">
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
                      className="hover:text-blue-700 transition-colors"
                    >
                      {featuredPost.title}
                    </a>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {featuredPost.spot}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={`/blog/${featuredPost.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/blog/${featuredPost.slug}`);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    <span>Devamını Oku</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href={getShareUrl(featuredPost.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#0A66C2] transition-colors"
                    aria-label={`${featuredPost.title} yazısını LinkedIn'de paylaş`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>Paylaş</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Filter Tabs, Search & Article Grid */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            {/* Category Tabs */}
            <div
              role="tablist"
              aria-label="Blog kategorileri"
              className="flex flex-wrap items-center justify-center sm:justify-start gap-2"
            >
              {BLOG_FILTERS.map((filter) => {
                const active = selectedCategory === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleCategoryChange(filter.key)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Yazılarda ara..."
                aria-label="Blog yazılarında ara"
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  aria-label="Aramayı temizle"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Articles Grid */}
          {visiblePosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors overflow-hidden flex flex-col"
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
                      title={post.title}
                      categoryLabel={post.categoryLabel}
                    />
                  </a>

                  <div className="p-6 flex-1 flex flex-col justify-between gap-5 text-center sm:text-left">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="font-semibold text-blue-700">
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
                          className="hover:text-blue-700 transition-colors"
                        >
                          {post.title}
                        </a>
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {post.spot}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
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

                      <a
                        href={getShareUrl(post.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-[#0A66C2] transition-colors"
                        aria-label={`${post.title} yazısını LinkedIn'de paylaş`}
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center space-y-4">
              <p className="text-base font-semibold text-slate-900">
                Aramanızla eşleşen yazı bulunamadı.
              </p>
              <p className="text-sm text-slate-600">
                Farklı bir anahtar kelime deneyebilir veya tüm kategorileri görüntüleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setVisibleCount(PAGE_SIZE);
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

          {/* Load More Pagination */}
          {hasMore && (
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-6 py-3 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
              >
                Daha Fazla Yazı Yükle ({filteredPosts.length - visiblePosts.length} yazı daha)
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
