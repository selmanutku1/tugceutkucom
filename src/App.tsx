import { RouterProvider, useRouter } from './context/RouterContext';
import { LanguageProvider } from './context/LanguageContext';
import { BlogProvider } from './context/BlogContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SeoHead from './components/SeoHead';
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

function AppShell() {
  const { pathname } = useRouter();

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
      <SeoHead />

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
