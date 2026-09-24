import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import RiskCalculator from './components/RiskCalculator';
import MethodologySection from './components/MethodologySection';
import PackagesSection from './components/PackagesSection';
import AboutSection from './components/AboutSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import BookingContactModal from './components/BookingContactModal';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingTopic, setBookingTopic] = useState('Bireysel Portföy Check-Up');
  const [bookingNote, setBookingNote] = useState('');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (topic?: string, note?: string) => {
    if (topic) setBookingTopic(topic);
    if (note) setBookingNote(note);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onScrollTo={scrollToSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onScrollTo={scrollToSection}
        />

        {/* 2. Detailed Professional Services */}
        <ServicesSection
          onOpenBookingWithService={(serviceName) =>
            handleOpenBooking(serviceName, `Talep Edilen Hizmet: ${serviceName}`)
          }
        />

        {/* 3. Interactive Digital Risk & Insurance Check-Up Tool */}
        <RiskCalculator
          onOpenBookingWithDetails={(topic, note) => handleOpenBooking(topic, note)}
        />

        {/* 4. 4-Step Methodology */}
        <MethodologySection />

        {/* 5. Consulting Packages */}
        <PackagesSection
          onOpenBookingWithPackage={(pkgName) =>
            handleOpenBooking(pkgName, `Seçilen Paket: ${pkgName}`)
          }
        />

        {/* 6. About Tuğçe Utku & Traditional vs Independent Comparison */}
        <AboutSection />

        {/* 7. Real-life Case Studies */}
        <CaseStudiesSection />

        {/* 8. FAQ */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onScrollTo={scrollToSection}
      />

      {/* Modals */}
      <BookingContactModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        prefilledTopic={bookingTopic}
        prefilledNote={bookingNote}
      />
    </div>
  );
}
