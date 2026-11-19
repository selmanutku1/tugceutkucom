import { useState } from 'react';
import { ArrowUpRight, Linkedin } from 'lucide-react';
import { LINKEDIN_POSTS, BRAND_PROFILE } from '../data/siteContent';

export default function LinkedInPostsSection() {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
              LinkedIn Paylaşımları
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              LinkedIn&apos;den öne çıkan notlar
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Dijital dönüşüm, Insurtech, CRM ve yapay zekâ odağında LinkedIn üzerinden paylaştığım kısa sektörel değerlendirmeler.
            </p>
          </div>

          <a
            href={BRAND_PROFILE.linkedinActivityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800 transition-colors whitespace-nowrap shrink-0 self-center sm:self-auto"
          >
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
            <span>LinkedIn&apos;de Takip Et</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* LinkedIn Cards / Live Embeds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LINKEDIN_POSTS.map((post) => {
            if (post.embedUrl) {
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden min-h-[420px]"
                >
                  <iframe
                    src={post.embedUrl}
                    title={post.title}
                    className="w-full h-[460px] border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              );
            }

            const isExpanded = Boolean(expandedIds[post.id]);

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between gap-5 text-center sm:text-left"
              >
                <div className="space-y-4">
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
                        <p className="text-xs text-slate-500 truncate">
                          {post.topic}
                        </p>
                      </div>
                    </div>
                    <Linkedin
                      className="hidden sm:block w-4 h-4 text-[#0A66C2] shrink-0"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-900 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {isExpanded ? post.fullText : post.excerpt}
                    </p>
                  </div>

                  {post.fullText.length > post.excerpt.length && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(post.id)}
                      className="text-xs font-semibold text-slate-700 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      {isExpanded ? 'Daha az göster' : 'Devamını oku'}
                    </button>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    <span>LinkedIn&apos;de Görüntüle</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
