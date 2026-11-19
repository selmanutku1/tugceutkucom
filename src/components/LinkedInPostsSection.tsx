import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Calendar, Linkedin } from 'lucide-react';
import { BRAND_PROFILE } from '../data/siteContent';
import { useLanguage } from '../context/LanguageContext';
import type { LinkedInFeedResponse } from '../types';

export default function LinkedInPostsSection() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [feed, setFeed] = useState<LinkedInFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [oauthMessage, setOauthMessage] = useState<string | null>(null);

  const loadFeed = useCallback(async (forceRefresh = false) => {
    try {
      const endpoint = forceRefresh
        ? '/api/linkedin-posts?refresh=1'
        : '/api/linkedin-posts';
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to load LinkedIn feed');
      }
      const data = (await response.json()) as LinkedInFeedResponse;
      setFeed(data);
    } catch {
      setFeed({
        mode: 'unconfigured',
        oauthConfigured: false,
        profileUrl: BRAND_PROFILE.linkedin,
        activityUrl: BRAND_PROFILE.linkedinActivityUrl,
        posts: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed(false);
  }, [loadFeed]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'linkedin') {
        setOauthMessage(null);
        loadFeed(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loadFeed]);

  const handleConnectLinkedIn = async () => {
    try {
      const res = await fetch('/api/linkedin/auth/url');
      if (!res.ok) {
        setOauthMessage(
          isEn
            ? 'Could not initiate LinkedIn connection.'
            : 'LinkedIn bağlantısı başlatılamadı.'
        );
        return;
      }
      const { url } = (await res.json()) as { url: string };
      const popup = window.open(url, 'linkedin_oauth_popup', 'width=600,height=700');
      if (!popup) {
        setOauthMessage(
          isEn
            ? 'Please allow popups to connect LinkedIn.'
            : 'Lütfen LinkedIn bağlantısı için açılır pencereye izin verin.'
        );
      }
    } catch {
      setOauthMessage(
        isEn
          ? 'An error occurred while connecting LinkedIn.'
          : 'LinkedIn bağlantısı sırasında bir hata oluştu.'
      );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activityUrl = feed?.activityUrl || BRAND_PROFILE.linkedinActivityUrl;

  return (
    <section
      id="paylasimlar"
      className="py-16 sm:py-22 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 text-center sm:text-left">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium text-blue-700">
              {isEn ? 'LinkedIn Posts' : 'LinkedIn Paylaşımları'}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              {isEn
                ? 'Latest industry notes and posts'
                : 'Sektörden güncel notlar ve paylaşımlar'}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {isEn
                ? 'Recent posts shared on my LinkedIn profile covering digital transformation, insurance technologies, product strategy, and AI.'
                : 'Dijital dönüşüm, sigortacılık teknolojileri, ürün stratejisi ve yapay zekâ üzerine LinkedIn hesabımda paylaştığım güncel gönderiler.'}
            </p>
          </div>

          <a
            href={activityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800 transition-colors whitespace-nowrap shrink-0 self-center sm:self-auto"
          >
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
            <span>{isEn ? 'View All Posts' : 'Tüm Paylaşımları Gör'}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-busy="true">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 w-28 bg-slate-200 rounded" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 w-5/6 bg-slate-200 rounded" />
                  <div className="h-3.5 w-full bg-slate-100 rounded" />
                  <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mode 1: Real Synced LinkedIn Posts Grid */}
        {!loading && feed?.mode === 'posts' && feed.posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feed.posts.map((post) => {
              const isExpanded = Boolean(expandedIds[post.id]);
              const hasMoreText = post.fullText.length > post.excerpt.length;

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between text-center sm:text-left"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 min-w-0">
                        <img
                          src={BRAND_PROFILE.portraitUrl}
                          alt={BRAND_PROFILE.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover object-top border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {BRAND_PROFILE.name}
                          </p>
                          <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                            {post.publishedAt ? (
                              <>
                                <Calendar className="w-3 h-3 shrink-0" />
                                <time dateTime={post.publishedIso}>{post.publishedAt}</time>
                              </>
                            ) : (
                              <span>{isEn ? 'LinkedIn Post' : 'LinkedIn Paylaşımı'}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Linkedin
                        className="hidden sm:block w-4 h-4 text-[#0A66C2] shrink-0"
                        aria-hidden="true"
                      />
                    </div>

                    {post.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-100 aspect-[16/9] bg-slate-100">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {isExpanded ? post.fullText : post.excerpt}
                      </p>
                    </div>

                    {hasMoreText && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(post.id)}
                        className="text-xs font-semibold text-slate-700 hover:text-blue-700 cursor-pointer transition-colors"
                      >
                        {isExpanded
                          ? isEn
                            ? 'Show less'
                            : 'Daha az göster'
                          : isEn
                            ? 'Read more'
                            : 'Devamını oku'}
                      </button>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100">
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      <span>{isEn ? 'View on LinkedIn' : "LinkedIn'de Görüntüle"}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Mode 2: Auto-Updating LinkedIn Feed Widget Iframe */}
        {!loading && feed?.mode === 'widget' && feed.widgetUrl && (
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden">
            <iframe
              src={feed.widgetUrl}
              title={isEn ? 'Tuğçe Utku LinkedIn Posts' : 'Tuğçe Utku LinkedIn Paylaşımları'}
              className="w-full min-h-[540px] border-0"
              loading="lazy"
            />
          </div>
        )}

        {/* Mode 3: Official LinkedIn Post Embeds */}
        {!loading && feed?.mode === 'embeds' && feed.posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feed.posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden min-h-[440px]"
              >
                <iframe
                  src={post.embedUrl}
                  title={post.title}
                  className="w-full h-[480px] border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        )}

        {/* Mode 4: Clean Profile CTA (Zero Mock Posts) */}
        {!loading && (!feed || feed.mode === 'unconfigured') && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <img
                src={BRAND_PROFILE.portraitUrl}
                alt={BRAND_PROFILE.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover object-top border border-slate-200 shrink-0"
              />
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span className="text-sm font-semibold text-slate-900">
                    {BRAND_PROFILE.name} · LinkedIn
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {isEn
                    ? 'My latest perspectives, industry analyses, and updates are published directly on my LinkedIn profile.'
                    : 'Güncel değerlendirmelerim, sektörel analizlerim ve son paylaşımlarım doğrudan LinkedIn profilim üzerinden yayınlanmaktadır.'}
                </p>
                {oauthMessage && (
                  <p className="text-xs text-amber-700 pt-1">{oauthMessage}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {feed?.oauthConfigured && (
                <button
                  type="button"
                  onClick={handleConnectLinkedIn}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>{isEn ? 'Connect LinkedIn Feed' : 'LinkedIn Akışını Bağla'}</span>
                </button>
              )}

              <a
                href={activityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0A66C2] hover:bg-[#0958a8] text-sm font-semibold text-white transition-colors whitespace-nowrap"
              >
                <Linkedin className="w-4 h-4" />
                <span>
                  {isEn
                    ? 'View Latest Posts on LinkedIn'
                    : "Son Paylaşımları LinkedIn'de Gör"}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
