import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TUGCE_PHOTO = '/assets/aistudio/tugce-utku_2f46d5a0.jpg';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
}

export default function WhatsAppFloatingButton({
  phoneNumber = '905468253597',
}: WhatsAppFloatingButtonProps) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

  const defaultMessage = isEn
    ? 'Hello Tuğçe, I would like to get in touch regarding digital transformation, strategy, and consulting.'
    : 'Merhaba Tuğçe Hanım, dijital dönüşüm, strateji ve danışmanlık çalışmaları hakkında bilgi almak istiyorum.';

  const quickMessages = isEn
    ? [
        'I would like to discuss digital growth and product strategy.',
        'I would like information on insurance technologies and CRM transformation.',
        'I would like to share a consulting or collaboration inquiry.',
      ]
    : [
        'Dijital büyüme ve ürün stratejisi hakkında görüşmek istiyorum.',
        'Sigortacılık teknolojileri ve CRM dönüşümü için bilgi almak istiyorum.',
        'Danışmanlık veya iş birliği talebi paylaşmak istiyorum.',
      ];

  const getWhatsAppUrl = (messageToSend?: string) => {
    const text = messageToSend || customMsg.trim() || defaultMessage;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-5 md:right-5 z-50 flex flex-col items-end print:hidden">
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={TUGCE_PHOTO}
                alt="Tuğçe Utku"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover object-top border border-white/20 shrink-0"
              />
              <div>
                <h4 className="font-semibold text-sm text-white leading-tight">
                  Tuğçe Utku
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isEn ? 'WhatsApp Contact' : 'WhatsApp İletişim'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label={isEn ? 'Close' : 'Kapat'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
              {isEn
                ? 'Hello, feel free to send your questions directly via WhatsApp.'
                : 'Merhaba, aklınızdaki soruları doğrudan WhatsApp üzerinden iletebilirsiniz.'}
            </p>

            <div className="space-y-1.5">
              {quickMessages.map((msg) => (
                <a
                  key={msg}
                  href={getWhatsAppUrl(msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left text-xs bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-700 p-2.5 rounded-xl transition-colors flex items-center justify-between gap-2"
                >
                  <span>{msg}</span>
                  <Send className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </a>
              ))}
            </div>

            <div className="relative pt-1">
              <input
                type="text"
                placeholder={isEn ? 'Write your message...' : 'Mesajınızı yazın...'}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs rounded-xl py-2.5 pl-3 pr-10 outline-none text-slate-800 placeholder:text-slate-400"
              />
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="absolute right-1.5 top-[calc(50%+2px)] -translate-y-1/2 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                aria-label={isEn ? 'Send via WhatsApp' : 'WhatsApp ile gönder'}
              >
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Clean Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isEn ? 'Contact via WhatsApp' : 'WhatsApp ile iletişime geç'}
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        )}
      </button>
    </div>
  );
}
