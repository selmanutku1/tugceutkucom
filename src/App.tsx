import { useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { BlogProvider } from './context/BlogContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

const ROUTE_TITLES: Record<'tr' | 'en', Record<string, string>> = {
  tr: {
    '/': 'Tuğçe Utku — Dijital Dönüşüm, Teknoloji ve Strateji',
    '/hakkimda': 'Hakkımda | Tuğçe Utku',
    '/uzmanlik-alanlarim': 'Uzmanlık Alanlarım | Tuğçe Utku',
    '/deneyim': 'Deneyim | Tuğçe Utku',
    '/projeler': 'Projeler | Tuğçe Utku',
    '/blog': 'Blog ve İçgörüler | Tuğçe Utku',
    '/sss': 'Sıkça Sorulan Sorular | Tuğçe Utku',
    '/iletisim': 'İletişim | Tuğçe Utku',
    '/yonetim': 'Blog Yönetim Paneli | Tuğçe Utku',
    '/dashboard': 'Blog Yönetim Paneli | Tuğçe Utku',
  },
  en: {
    '/': 'Tuğçe Utku — Digital Transformation, Technology & Strategy',
    '/hakkimda': 'About | Tuğçe Utku',
    '/uzmanlik-alanlarim': 'Expertise | Tuğçe Utku',
    '/deneyim': 'Experience | Tuğçe Utku',
    '/projeler': 'Projects | Tuğçe Utku',
    '/blog': 'Blog & Insights | Tuğçe Utku',
    '/sss': 'Frequently Asked Questions | Tuğçe Utku',
    '/iletisim': 'Contact | Tuğçe Utku',
    '/yonetim': 'Blog Dashboard | Tuğçe Utku',
    '/dashboard': 'Blog Dashboard | Tuğçe Utku',
  },
};

function AppShell() {
  const { pathname } = useRouter();
  const { lang } = useLanguage();

  useEffect(() => {
    if (!pathname.startsWith('/blog/')) {
      const titles = ROUTE_TITLES[lang];
      document.title = titles[pathname] || titles['/'];
    }
  }, [pathname, lang]);

  const renderPage = () => {
    if (pathname === '/') return <HomePage />;
    if (pathname === '/hakkimda') return <AboutPage />;
    if (pathname === '/uzmanlik-alanlarim') return <ExpertisePage />;
    if (pathname === '/deneyim') return <ExperiencePage />;
    if (pathname === '/projeler') return <ProjectsPage />;
    if (pathname === '/blog') return <BlogListPage />;
    if (pathname.startsWith('/blog/')) {
      const rawSlug = pathname.slice('/blog/'.length).replace(/^\/+|\/+$/g, '');
      let slug = rawSlug;
      try {
        slug = decodeURIComponent(rawSlug);
      } catch {
        slug = rawSlug;
      }
      if (!slug) return <BlogListPage />;
      return <BlogDetailPage slug={slug} />;
    }
    if (pathname === '/sss') return <FaqPage />;
    if (pathname === '/iletisim') return <ContactPage />;
    if (pathname === '/yonetim' || pathname === '/dashboard') {
      return <AdminDashboardPage />;
    }
    return <HomePage />;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-blue-700 selection:text-white">
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
