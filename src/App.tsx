import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InsurupEcosystemSection from './components/InsurupEcosystemSection';
import ServicesSection from './components/ServicesSection';
import PackagesSection from './components/PackagesSection';
import RiskCalculator from './components/RiskCalculator';
import MethodologySection from './components/MethodologySection';
import AboutSection from './components/AboutSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import BookingContactModal from './components/BookingContactModal';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingTopic, setBookingTopic] = useState('InsurUp CRM & Acente Dönüşümü');
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

        {/* 2. InsurUp Platform & Synergy Showcase (Core Brand Integration) */}
        <InsurupEcosystemSection
          onOpenBookingWithTopic={(topic) =>
            handleOpenBooking(topic, `InsurUp Çözümü: ${topic}`)
          }
        />

        {/* 3. Detailed Professional Services */}
        <ServicesSection
          onOpenBookingWithService={(serviceName) =>
            handleOpenBooking(serviceName, `Talep Edilen Hizmet: ${serviceName}`)
          }
        />

        {/* 4. Consulting Packages ("Acentenizi Dijitalleştirin" InsurUp Destekli) */}
        <PackagesSection
          onOpenBookingWithPackage={(pkgName) =>
            handleOpenBooking(pkgName, `Seçilen Paket: ${pkgName}`)
          }
        />

        {/* 5. Interactive Digital Risk & Insurance Check-Up Tool */}
        <RiskCalculator
          onOpenBookingWithDetails={(topic, note) => handleOpenBooking(topic, note)}
        />

        {/* 6. 4-Step Methodology */}
        <MethodologySection />

        {/* 7. About Tuğçe Utku (InsurUp Digital Marketing Manager & InsurTech Consultant) */}
        <AboutSection />

        {/* 8. Real-life Case Studies */}
        <CaseStudiesSection />

        {/* 9. FAQ */}
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
