import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { BlogProvider, slugifyTurkish, useBlog } from './context/BlogContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SeoHead, { upsertMetaTag } from './components/SeoHead';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import MobileBottomBar from './components/MobileBottomBar';
import {
  EXECUTIVE_EASE,
  PAGE_TRANSITION_VARIANTS,
} from './components/MotionPrimitives';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ExpertisePage from './pages/ExpertisePage';
import ExperiencePage from './pages/ExperiencePage';
import ProjectsPage from './pages/ProjectsPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export const PAGE_META_DESCRIPTIONS: Record<'tr' | 'en', Record<string, string>> = {
  tr: {
    '/': 'Tuğçe Utku’nun dijital dönüşüm, ürün stratejisi, sigortacılık teknolojileri (InsurTech), sigorta CRM ve yapay zekâ çalışmalarını ve içgörülerini keşfedin.',
    '/hakkimda':
      'Tuğçe Utku kimdir? Dijital pazarlama, ürün stratejisi, sigortacılık teknolojileri ve veri odaklı büyüme alanlarındaki profesyonel yaklaşımını keşfedin.',
    '/uzmanlik-alanlarim':
      'Dijital pazarlama ve büyüme, SaaS ürün stratejisi, sigortacılık teknolojileri (InsurTech), yapay zekâ ve B2B stratejik yönetim uzmanlık alanlarını inceleyin.',
    '/deneyim':
      'Dijital pazarlama operasyonları, ajans yönetimi, SaaS ürün pazarlaması ve sigortacılık teknolojileri ekosistemindeki liderlik ve proje deneyimlerini keşfedin.',
    '/projeler':
      'Sigorta CRM dönüşümü, online sigorta satış platformları, yapay zekâ sigortacılık araştırmaları ve bankasürans iletişim çalışmalarını konu bazlı inceleyin.',
    '/blog':
      'Dijital dönüşüm, sigortacılık teknolojileri (InsurTech), yapay zekâ uygulamaları, sigorta CRM ve B2B büyüme stratejileri üzerine güncel blog yazılarını okuyun.',
    '/sss':
      'Çalışma alanları, danışmanlık modeli, sigortacılık teknolojileri, sigorta CRM ve iş birlikleri hakkında sıkça sorulan soruların yanıtlarını inceleyin.',
    '/iletisim':
      'Dijital dönüşüm, teknoloji, sigortacılık ve iş stratejileri üzerine fikir alışverişi, danışmanlık veya iş birliği için Tuğçe Utku ile iletişime geçin.',
    '/yonetim': 'Tuğçe Utku blog içerik yönetim paneli.',
    '/dashboard': 'Tuğçe Utku blog içerik yönetim paneli.',
  },
  en: {
    '/': 'Explore Tuğçe Utku’s work, insights, and strategies across digital transformation, product strategy, InsurTech, Insurance CRM, and artificial intelligence.',
    '/hakkimda':
      'Learn about Tuğçe Utku’s multidisciplinary background combining data-driven marketing, SaaS product strategy, insurance technologies, and sustainable growth.',
    '/uzmanlik-alanlarim':
      'Discover core expertise across digital marketing & growth, SaaS product strategy, insurance technologies (InsurTech), AI applications, and B2B leadership.',
    '/deneyim':
      'Review professional experience across digital marketing operations, agency management, SaaS product marketing, and the insurance technology ecosystem.',
    '/projeler':
      'Browse topic-based initiatives covering Insurance CRM transformation, digital policy distribution platforms, AI research in insurance, and bancassurance.',
    '/blog':
      'Read in-depth articles and industry insights on digital transformation, InsurTech, AI adoption in insurance, Insurance CRM, and B2B SaaS growth strategy.',
    '/sss':
      'Find answers to frequently asked questions about focus areas, consulting approach, insurance technologies, Insurance CRM, AI adoption, and collaborations.',
    '/iletisim':
      'Get in touch with Tuğçe Utku to discuss digital transformation, insurance technologies, strategic advisory, speaking engagements, or collaborations.',
    '/yonetim': 'Tuğçe Utku blog content management dashboard.',
    '/dashboard': 'Tuğçe Utku blog content management dashboard.',
  },
};

function parseBlogSlug(pathname: string): string | null {
  if (!pathname.startsWith('/blog/')) return null;
  const rawSlug = pathname.slice('/blog/'.length).replace(/^\/+|\/+$/g, '');
  if (!rawSlug) return null;
  try {
    return decodeURIComponent(rawSlug);
  } catch {
    return rawSlug;
  }
}

function AppShell() {
  const { pathname, hash } = useRouter();
  const { lang } = useLanguage();
  const { getPosts } = useBlog();

  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const blogSlug = parseBlogSlug(pathname);

  const activeDescription = useMemo(() => {
    if (blogSlug) {
      const posts = getPosts(lang);
      const cleanSlug = blogSlug.trim().toLowerCase();
      const normalizedSlug = slugifyTurkish(cleanSlug);
      const matchedPost = posts.find((item) => {
        const itemSlug = item.slug.toLowerCase();
        return (
          itemSlug === cleanSlug ||
          itemSlug === normalizedSlug ||
          slugifyTurkish(item.title) === normalizedSlug
        );
      });
      if (matchedPost?.spot) {
        return matchedPost.spot;
      }
    }

    return (
      PAGE_META_DESCRIPTIONS[lang][normalizedPath] ||
      PAGE_META_DESCRIPTIONS[lang]['/']
    );
  }, [blogSlug, getPosts, lang, normalizedPath]);

  useEffect(() => {
    upsertMetaTag('name', 'description', activeDescription);
    upsertMetaTag('property', 'og:description', activeDescription);
    upsertMetaTag('name', 'twitter:description', activeDescription);
  }, [activeDescription]);

  const renderPage = () => {
    if (pathname === '/') return <HomePage />;
    if (pathname === '/hakkimda') return <AboutPage />;
    if (pathname === '/uzmanlik-alanlarim') return <ExpertisePage />;
    if (pathname === '/deneyim') return <ExperiencePage />;
    if (pathname === '/projeler') return <ProjectsPage />;
    if (pathname === '/blog') return <BlogListPage />;
    if (blogSlug) return <BlogDetailPage slug={blogSlug} />;
    if (pathname.startsWith('/blog/')) return <BlogListPage />;
    if (pathname === '/sss') return <FaqPage />;
    if (pathname === '/iletisim') return <ContactPage />;
    if (pathname === '/yonetim' || pathname === '/dashboard') {
      return <AdminDashboardPage />;
    }
    return <HomePage />;
  };

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-brand-navy selection:text-white">
      {/* Global Soft Diffused (Flu) Logo-Color Ambient Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(145deg,#edf3f9_0%,#f4f8fb_45%,#e9f4f6_80%,#eef3f9_100%)]"
      >
        <div className="animate-ambient-slow absolute -top-32 -right-24 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(1,123,134,0.22)_0%,rgba(0,110,120,0.10)_42%,transparent_72%)] blur-[90px]" />
        <div className="animate-ambient-reverse absolute top-[18%] -left-36 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(1,34,83,0.17)_0%,rgba(1,82,108,0.09)_46%,transparent_72%)] blur-[100px]" />
        <div className="animate-ambient-slow absolute top-[54%] right-[8%] w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,110,120,0.16)_0%,rgba(196,229,232,0.28)_45%,transparent_74%)] blur-[105px]" />
        <div className="animate-ambient-reverse absolute -bottom-36 left-[24%] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(1,34,83,0.16)_0%,rgba(1,123,134,0.10)_45%,transparent_74%)] blur-[110px]" />
      </div>

      <SeoHead description={activeDescription} />

      <Navbar />

      <main className="flex-1 overflow-x-clip">
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            if (!hash) {
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            }
          }}
        >
          <motion.div
            key={`${normalizedPath}-${lang}`}
            variants={PAGE_TRANSITION_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ willChange: 'transform, opacity' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <WhatsAppFloatingButton />

      <MobileBottomBar />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.44, ease: EXECUTIVE_EASE }}
    >
      <LanguageProvider>
        <BlogProvider>
          <RouterProvider>
            <AppShell />
          </RouterProvider>
        </BlogProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
