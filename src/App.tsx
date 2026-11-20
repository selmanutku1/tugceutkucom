import { useEffect, useMemo } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { BlogProvider, slugifyTurkish, useBlog } from './context/BlogContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SeoHead, { upsertMetaTag } from './components/SeoHead';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import MobileBottomBar from './components/MobileBottomBar';
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
  const { pathname } = useRouter();
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
    <div className="min-h-screen bg-white flex flex-col selection:bg-blue-700 selection:text-white">
      <SeoHead description={activeDescription} />

      <Navbar />

      <main className="flex-1">{renderPage()}</main>

      <Footer />

      <WhatsAppFloatingButton />

      <MobileBottomBar />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BlogProvider>
        <RouterProvider>
          <AppShell />
        </RouterProvider>
      </BlogProvider>
    </LanguageProvider>
  );
}
