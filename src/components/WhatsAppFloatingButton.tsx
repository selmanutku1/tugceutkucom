import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import tugcePhoto from '../assets/images/tugce_utku_photo_1790257568684.jpg';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string; // default: 905468253597
  defaultMessage?: string;
}

export default function WhatsAppFloatingButton({
  phoneNumber = '905468253597',
  defaultMessage = 'Merhaba Tuğçe Hanım, Sigorta CRM ve InsurTech danışmanlık hizmetleriniz hakkında bilgi almak istiyorum.'
}: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Clean phone number for URL
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

  // Quick message options
  const quickMessages = [
    'Sigorta CRM ve acente dijitalleşmesi hakkında bilgi almak istiyorum.',
    'Danışmanlık ve online teklif altyapısı için demo planlamak istiyorum.',
    'Portföyümüz için özel check-up ve analiz talep ediyorum.'
  ];

  // Show friendly tooltip after a short delay on initial visit
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleOpenWhatsApp = (messageToSend?: string) => {
    const text = messageToSend || customMsg || defaultMessage;
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setShowTooltip(false);
    setHasInteracted(true);
  };

  const handleTogglePopup = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
    setHasInteracted(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Floating Greeting Bubble (Visible initially or when idle) */}
      {showTooltip && !isOpen && (
        <div className="mb-3 max-w-xs bg-white text-slate-900 rounded-2xl p-3.5 shadow-2xl border border-emerald-100 flex items-start gap-3 animate-bounce-short relative mr-1">
          <div className="relative shrink-0">
            <img
              src={tugcePhoto}
              alt="Tuğçe Utku"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="text-left pr-4">
            <p className="text-xs font-bold text-slate-900">Tuğçe Utku</p>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
              Merhaba! Sigorta CRM ve dijital dönüşüm sorularınız için WhatsApp'tan yazabilirsiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
              setHasInteracted(true);
            }}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            title="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Interactive WhatsApp Chat Widget */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={tugcePhoto}
                  alt="Tuğçe Utku"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  Tuğçe Utku
                  <span className="px-1.5 py-0.5 bg-emerald-500/40 text-[10px] font-medium rounded-full text-emerald-100 border border-emerald-300/30">
                    Çevrimiçi
                  </span>
                </h4>
                <p className="text-xs text-emerald-100/90 font-medium">Sigorta CRM & InsurTech Danışmanı</p>
                <p className="text-[10px] text-emerald-200/75 mt-0.5">Genellikle 15 dakika içinde yanıtlar</p>
              </div>
            </div>
          </div>

          {/* Chat Body & Quick Options */}
          <div className="p-4 bg-slate-50 space-y-3">
            {/* Incoming Greeting message bubble */}
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-xs border border-slate-100 text-slate-800 text-xs leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5 text-emerald-700">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Nasıl yardımcı olabilirim?
              </p>
              Acentenizin CRM, online teklif ve dijital büyüme süreçleriyle ilgili hemen mesaj gönderebilirsiniz.
            </div>

            {/* Quick pre-filled prompt pills */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-600 px-1">Hızlı Konular:</p>
              <div className="flex flex-col gap-1.5">
                {quickMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenWhatsApp(msg)}
                    className="text-left text-xs bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-700 hover:text-emerald-900 p-2.5 rounded-xl transition-all font-medium flex items-center justify-between group shadow-2xs"
                  >
                    <span className="line-clamp-1">{msg}</span>
                    <Send className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom message input */}
            <div className="pt-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Mesajınızı yazın..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleOpenWhatsApp();
                    }
                  }}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs rounded-xl py-2.5 pl-3 pr-10 outline-none text-slate-800 shadow-inner placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                  title="WhatsApp ile Gönder"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer note with Direct Phone */}
          <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Doğrudan İletişim: <strong className="text-slate-700">0546 825 35 97</strong></span>
            <button
              type="button"
              onClick={() => handleOpenWhatsApp(defaultMessage)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              Doğrudan Başlat →
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <div className="relative flex items-center group">
        {/* Hover Label for FAB */}
        <div className="mr-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block">
          WhatsApp ile Hızlı İletişim (0546 825 35 97)
        </div>

        {/* Pulse Background Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping group-hover:opacity-0 transition-opacity"></span>

        {/* Main Floating Button */}
        <button
          type="button"
          onClick={handleTogglePopup}
          aria-label="WhatsApp İletişim Hattı"
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0f776a] text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-600/60 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 active:scale-95 cursor-pointer border-2 border-white z-10 ${
            isOpen ? 'rotate-90 bg-slate-800' : ''
          }`}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <>
              {/* WhatsApp SVG / Icon */}
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-sm"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>

              {/* Little Online indicator dot */}
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
