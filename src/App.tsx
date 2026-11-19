import { useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
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

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Tuğçe Utku — Dijital Dönüşüm, Teknoloji ve Strateji',
  '/hakkimda': 'Hakkımda | Tuğçe Utku',
  '/uzmanlik-alanlarim': 'Uzmanlık Alanlarım | Tuğçe Utku',
  '/deneyim': 'Deneyim | Tuğçe Utku',
  '/projeler': 'Projeler | Tuğçe Utku',
  '/blog': 'Blog ve İçgörüler | Tuğçe Utku',
  '/sss': 'Sıkça Sorulan Sorular | Tuğçe Utku',
  '/iletisim': 'İletişim | Tuğçe Utku',
};

function AppShell() {
  const { pathname } = useRouter();

  useEffect(() => {
    if (!pathname.startsWith('/blog/')) {
      document.title =
        ROUTE_TITLES[pathname] || 'Tuğçe Utku — Dijital Dönüşüm, Teknoloji ve Strateji';
    }
  }, [pathname]);

  const renderPage = () => {
    if (pathname === '/') return <HomePage />;
    if (pathname === '/hakkimda') return <AboutPage />;
    if (pathname === '/uzmanlik-alanlarim') return <ExpertisePage />;
    if (pathname === '/deneyim') return <ExperiencePage />;
    if (pathname === '/projeler') return <ProjectsPage />;
    if (pathname === '/blog') return <BlogListPage />;
    if (pathname.startsWith('/blog/')) {
      const slug = decodeURIComponent(pathname.slice('/blog/'.length));
      return <BlogDetailPage slug={slug} />;
    }
    if (pathname === '/sss') return <FaqPage />;
    if (pathname === '/iletisim') return <ContactPage />;
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
    <RouterProvider>
      <AppShell />
    </RouterProvider>
  );
}
