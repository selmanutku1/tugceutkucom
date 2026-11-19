import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import MethodologySection from './components/MethodologySection';
import AboutSection from './components/AboutSection';
import LinkedInPostsSection from './components/LinkedInPostsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import BookingContactModal from './components/BookingContactModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingTopic, setBookingTopic] = useState('Genel Tanışma Görüşmesi');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (topic?: string) => {
    setBookingTopic(topic || 'Genel Tanışma Görüşmesi');
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-blue-700 selection:text-white">
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onScrollTo={scrollToSection}
      />

      <main className="flex-1">
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onScrollTo={scrollToSection}
        />

        <ServicesSection
          onOpenBookingWithService={(serviceName) => handleOpenBooking(serviceName)}
        />

        <MethodologySection />

        <AboutSection />

        <LinkedInPostsSection />

        <FaqSection />
      </main>

      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onScrollTo={scrollToSection}
      />

      <BookingContactModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        prefilledTopic={bookingTopic}
      />

      <WhatsAppFloatingButton />
    </div>
  );
}
