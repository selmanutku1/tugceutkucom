import { useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { useBlog } from '../context/BlogContext';
import { getSiteContent } from '../data/siteContentEn';

interface RouteMeta {
  title: string;
  description: string;
  keywords: string;
  schemaType:
    | 'WebPage'
    | 'AboutPage'
    | 'ProfilePage'
    | 'CollectionPage'
    | 'Blog'
    | 'ContactPage';
  noIndex?: boolean;
}

const ROUTE_META: Record<'tr' | 'en', Record<string, RouteMeta>> = {
  tr: {
    '/': {
      title: 'Tuğçe Utku | Dijital Dönüşüm, Strateji ve Sigorta Teknolojileri',
      description:
        'Tuğçe Utku — Dijital pazarlama, ürün stratejisi, sigortacılık teknolojileri (InsurTech), sigorta CRM ve yapay zekâ alanlarında çalışmalar, analizler ve içgörüler.',
      keywords:
        'Tuğçe Utku, dijital dönüşüm, sigortacılık teknolojileri, insurtech, yapay zekâ, sigorta CRM, ürün stratejisi, dijital pazarlama, B2B büyüme',
      schemaType: 'ProfilePage',
    },
    '/hakkimda': {
      title: 'Hakkımda | Tuğçe Utku — Dijital Dönüşüm ve Strateji',
      description:
        'Tuğçe Utku kimdir? Dijital pazarlama, ürün stratejisi, sigortacılık teknolojileri ve veri odaklı büyüme alanlarındaki profesyonel yaklaşımı inceleyin.',
      keywords:
        'Tuğçe Utku hakkımda, dijital strateji lideri, insurtech uzmanı, ürün pazarlaması, veri odaklı pazarlama',
      schemaType: 'AboutPage',
    },
    '/uzmanlik-alanlarim': {
      title: 'Uzmanlık Alanlarım | Tuğçe Utku — InsurTech, Yapay Zekâ ve Büyüme',
      description:
        'Dijital pazarlama ve büyüme, SaaS ürün stratejisi, sigortacılık teknolojileri (InsurTech), sigorta CRM, yapay zekâ ve B2B iş geliştirme uzmanlıkları.',
      keywords:
        'dijital pazarlama ve büyüme, ürün ve büyüme stratejisi, sigortacılık teknolojileri, yapay zekâ sigortacılık, B2B pazarlama, SaaS büyüme',
      schemaType: 'CollectionPage',
    },
    '/deneyim': {
      title: 'Deneyim | Tuğçe Utku — Teknoloji, Ajans ve Sigorta Ekosistemi',
      description:
        'Ajans yönetimi, SaaS ürün pazarlaması, dijital dönüşüm operasyonları ve sigortacılık teknolojileri ekosistemindeki profesyonel deneyim alanları.',
      keywords:
        'Tuğçe Utku deneyim, sigortacılık teknolojileri kariyer, dijital pazarlama yönetimi, B2B SaaS pazarlama',
      schemaType: 'ProfilePage',
    },
    '/projeler': {
      title: 'Projeler ve Çalışma Alanları | Tuğçe Utku',
      description:
        'Sigorta CRM ve acente dijitalleşmesi, online sigorta satış platformları, yapay zekâ araştırmaları ve bankasürans iletişim çalışmaları.',
      keywords:
        'insurtech projeleri, sigorta CRM dönüşümü, online sigorta satış, yapay zekâ sigortacılık araştırmaları, bankasürans',
      schemaType: 'CollectionPage',
    },
    '/blog': {
      title: 'Blog ve İçgörüler | Tuğçe Utku — Yapay Zekâ, InsurTech ve Strateji',
      description:
        'Dijital dönüşüm, sigortacılık teknolojileri, yapay zekâ uygulamaları, sigorta CRM ve B2B büyüme stratejileri üzerine kapsamlı makale ve analizler.',
      keywords:
        'sigortacılık blog, insurtech makaleler, yapay zekâ sigorta, dijital dönüşüm yazıları, B2B pazarlama stratejileri',
      schemaType: 'Blog',
    },
    '/sss': {
      title: 'Sıkça Sorulan Sorular | Tuğçe Utku',
      description:
        'Çalışma alanları, danışmanlık yaklaşımı, sigortacılık teknolojileri, CRM, yapay zekâ ve profesyonel iş birlikleri hakkında merak edilen soruların yanıtları.',
      keywords:
        'Tuğçe Utku SSS, sigortacılık dijital dönüşüm soruları, insurtech danışmanlık, sigorta CRM nedir',
      schemaType: 'WebPage',
    },
    '/iletisim': {
      title: 'İletişim | Tuğçe Utku — İş Birliği ve Strateji Görüşmeleri',
      description:
        'Dijital dönüşüm, teknoloji, sigortacılık ve iş stratejileri üzerine fikir alışverişi, danışmanlık veya iş birliği için Tuğçe Utku ile iletişime geçin.',
      keywords:
        'Tuğçe Utku iletişim, dijital dönüşüm danışmanlığı, insurtech iş birliği',
      schemaType: 'ContactPage',
    },
    '/yonetim': {
      title: 'Blog Yönetim Paneli | Tuğçe Utku',
      description: 'İçerik yönetim paneli.',
      keywords: '',
      schemaType: 'WebPage',
      noIndex: true,
    },
    '/dashboard': {
      title: 'Blog Yönetim Paneli | Tuğçe Utku',
      description: 'İçerik yönetim paneli.',
      keywords: '',
      schemaType: 'WebPage',
      noIndex: true,
    },
  },
  en: {
    '/': {
      title: 'Tuğçe Utku | Digital Transformation, Strategy & Insurance Technologies',
      description:
        'Tuğçe Utku — Work, analyses, and insights across digital marketing, product strategy, insurance technologies (InsurTech), Insurance CRM, and AI.',
      keywords:
        'Tuğçe Utku, digital transformation, insurtech, insurance technology, AI in insurance, insurance CRM, SaaS product strategy, B2B growth',
      schemaType: 'ProfilePage',
    },
    '/hakkimda': {
      title: 'About | Tuğçe Utku — Digital Transformation & Strategy',
      description:
        'Learn about Tuğçe Utku’s multidisciplinary approach combining data-driven marketing, product strategy, InsurTech, and sustainable business growth.',
      keywords:
        'About Tuğçe Utku, digital strategy executive, insurtech specialist, product marketing, data-driven growth',
      schemaType: 'AboutPage',
    },
    '/uzmanlik-alanlarim': {
      title: 'Areas of Expertise | Tuğçe Utku — InsurTech, AI & Growth',
      description:
        'Core expertise across digital marketing & growth, SaaS product strategy, insurance technologies (InsurTech), AI applications, and B2B leadership.',
      keywords:
        'digital marketing growth, SaaS product strategy, insurance technologies, artificial intelligence in insurance, B2B business development',
      schemaType: 'CollectionPage',
    },
    '/deneyim': {
      title: 'Experience | Tuğçe Utku — Technology, Agency & Insurance Ecosystem',
      description:
        'Professional leadership experience across digital marketing operations, agency management, SaaS product marketing, and InsurTech.',
      keywords:
        'Tuğçe Utku experience, insurtech career, product marketing leadership, B2B SaaS growth',
      schemaType: 'ProfilePage',
    },
    '/projeler': {
      title: 'Featured Projects & Initiatives | Tuğçe Utku',
      description:
        'Topic-driven initiatives in Insurance CRM, online policy distribution platforms, AI research in insurance, and bancassurance communications.',
      keywords:
        'insurtech initiatives, insurance CRM transformation, digital sales platforms, AI insurance research, bancassurance',
      schemaType: 'CollectionPage',
    },
    '/blog': {
      title: 'Blog & Insights | Tuğçe Utku — AI, InsurTech & Strategy',
      description:
        'In-depth articles and industry perspectives on digital transformation, insurance technologies, AI adoption, Insurance CRM, and B2B SaaS growth.',
      keywords:
        'insurtech blog, AI in insurance articles, digital transformation insights, B2B SaaS marketing',
      schemaType: 'Blog',
    },
    '/sss': {
      title: 'Frequently Asked Questions | Tuğçe Utku',
      description:
        'Answers to common questions about focus areas, consulting approach, insurance technologies, AI adoption, and collaboration opportunities.',
      keywords:
        'Tuğçe Utku FAQ, insurtech consulting questions, insurance digital transformation',
      schemaType: 'WebPage',
    },
    '/iletisim': {
      title: 'Contact | Tuğçe Utku — Collaborations & Strategy',
      description:
        'Get in touch with Tuğçe Utku to exchange ideas on digital transformation, InsurTech, AI, and strategic collaborations.',
      keywords: 'Contact Tuğçe Utku, digital transformation consulting, insurtech collaboration',
      schemaType: 'ContactPage',
    },
    '/yonetim': {
      title: 'Blog Dashboard | Tuğçe Utku',
      description: 'Content management dashboard.',
      keywords: '',
      schemaType: 'WebPage',
      noIndex: true,
    },
    '/dashboard': {
      title: 'Blog Dashboard | Tuğçe Utku',
      description: 'Content management dashboard.',
      keywords: '',
      schemaType: 'WebPage',
      noIndex: true,
    },
  },
};

export function upsertMetaTag(
  attr: 'name' | 'property',
  key: string,
  content: string
) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(
    `meta[${attr}="${key}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function upsertLinkTag(rel: string, href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(
    `link[rel="${rel}"]`
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

interface SeoHeadProps {
  description?: string;
}

export default function SeoHead({ description }: SeoHeadProps) {
  const { pathname } = useRouter();
  const { lang } = useLanguage();
  const { getPosts } = useBlog();
  const isEn = lang === 'en';

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    document.documentElement.lang = isEn ? 'en' : 'tr';

    // Blog detail pages manage their own detailed Article metadata & JSON-LD
    if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
      const routeScript = document.getElementById('route-seo-jsonld');
      if (routeScript) routeScript.remove();
      return;
    }

    const origin = window.location.origin;
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const canonicalUrl = `${origin}${normalizedPath === '/' ? '/' : normalizedPath}`;

    const meta = ROUTE_META[lang][normalizedPath] || ROUTE_META[lang]['/'];
    const resolvedDescription = description || meta.description;
    const { brand, expertiseAreas, projectItems } = getSiteContent(lang);
    const posts = getPosts(lang);

    document.title = meta.title;
    upsertMetaTag('name', 'description', resolvedDescription);
    if (meta.keywords) {
      upsertMetaTag('name', 'keywords', meta.keywords);
    }
    upsertMetaTag(
      'name',
      'robots',
      meta.noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    upsertLinkTag('canonical', canonicalUrl);

    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:title', meta.title);
    upsertMetaTag('property', 'og:description', resolvedDescription);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:locale', isEn ? 'en_US' : 'tr_TR');

    upsertMetaTag('name', 'twitter:title', meta.title);
    upsertMetaTag('name', 'twitter:description', resolvedDescription);

    // Clear stale blog detail schema when leaving an article
    const blogLd = document.getElementById('blog-detail-jsonld');
    if (blogLd) blogLd.remove();

    const existingRouteLd = document.getElementById('route-seo-jsonld');
    if (existingRouteLd) existingRouteLd.remove();

    if (meta.noIndex) return;

    const personRef = { '@id': `${origin}/#person` };
    const graph: Record<string, unknown>[] = [
      {
        '@type': meta.schemaType,
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: meta.title,
        description: resolvedDescription,
        inLanguage: isEn ? 'en-US' : 'tr-TR',
        isPartOf: { '@id': `${origin}/#website` },
        about: personRef,
        mainEntity: meta.schemaType === 'ProfilePage' || meta.schemaType === 'AboutPage' ? personRef : undefined,
      },
    ];

    if (normalizedPath !== '/' && normalizedPath !== '/sss') {
      graph.push({
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
            name: meta.title.split('|')[0].trim(),
            item: canonicalUrl,
          },
        ],
      });
    }

    if (normalizedPath === '/' || normalizedPath === '/uzmanlik-alanlarim') {
      graph.push({
        '@type': 'ItemList',
        name: isEn ? 'Areas of Expertise' : 'Uzmanlık Alanları',
        itemListElement: expertiseAreas.map((area, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Service',
            name: area.title,
            description: area.homeSummary,
            provider: { '@type': 'Person', name: brand.name },
          },
        })),
      });
    }

    if (normalizedPath === '/projeler') {
      graph.push({
        '@type': 'ItemList',
        name: isEn ? 'Featured Projects & Topics' : 'Öne Çıkan Projeler ve Çalışma Alanları',
        itemListElement: projectItems.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: project.topicTitle,
            description: project.detailDescription,
            author: { '@type': 'Person', name: brand.name },
          },
        })),
      });
    }

    if (normalizedPath === '/blog' || normalizedPath === '/') {
      const listedPosts = normalizedPath === '/' ? posts.slice(0, 3) : posts;
      graph.push({
        '@type': 'ItemList',
        name: isEn ? 'Published Insights & Blog Articles' : 'Yayınlanan Blog Yazıları ve İçgörüler',
        itemListElement: listedPosts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${origin}/blog/${post.slug}`,
          item: {
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.spot,
            datePublished: post.publishedIso,
            url: `${origin}/blog/${post.slug}`,
            keywords: post.tags.join(', '),
            author: { '@type': 'Person', name: brand.name },
          },
        })),
      });
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'route-seo-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('route-seo-jsonld');
      if (el) el.remove();
    };
  }, [pathname, lang, isEn, getPosts, description]);

  return null;
}
