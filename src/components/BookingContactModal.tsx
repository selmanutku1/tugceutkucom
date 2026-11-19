import { useState, useEffect, type FormEvent } from 'react';
import { X, CheckCircle2, ChevronDown, Send } from 'lucide-react';
import { TUĞÇE_PROFILE } from '../data/consultingContent';

interface BookingContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledTopic?: string;
}

const TOPIC_OPTIONS = [
  'Sigorta CRM Kurulumu ve Düzeni',
  'Acente & Broker Dijitalleşmesi',
  'Yenileme ve Müşteri Takibi',
  'Dijital Büyüme ve Danışmanlık',
  'Genel Tanışma Görüşmesi',
];

const DATE_OPTIONS = [
  'Yarın — 10:30',
  'Yarın — 14:00',
  'Çarşamba — 11:00',
  'Perşembe — 14:30',
  'Cuma — 11:30',
];

export default function BookingContactModal({
  isOpen,
  onClose,
  prefilledTopic = 'Genel Tanışma Görüşmesi',
}: BookingContactModalProps) {
  const [topic, setTopic] = useState(prefilledTopic);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledTopic) {
      setTopic(prefilledTopic);
    }
  }, [prefilledTopic]);

  if (!isOpen) return null;

  const buildWhatsAppUrl = () => {
    const lines = [
      'Merhaba Tuğçe Hanım, web siteniz üzerinden ön görüşme planlamak istiyorum.',
      '',
      `Konu: ${topic}`,
      `Tercih Edilen Zaman: ${selectedDate}`,
      name.trim() ? `Ad Soyad: ${name.trim()}` : '',
      phone.trim() ? `Telefon: ${phone.trim()}` : '',
      email.trim() ? `E-posta: ${email.trim()}` : '',
      note.trim() ? `Not: ${note.trim()}` : '',
    ].filter((line, idx) => idx === 1 || line !== '');

    return `https://wa.me/${TUĞÇE_PROFILE.whatsappNumber}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const waUrl = buildWhatsAppUrl();

    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const availableTopics = TOPIC_OPTIONS.includes(topic)
    ? TOPIC_OPTIONS
    : [topic, ...TOPIC_OPTIONS];

  const whatsAppUrl = buildWhatsAppUrl();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl max-h-[90vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Ücretsiz Ön Görüşme Planla
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Talebiniz doğrudan WhatsApp üzerinden iletilir
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  Görüşme Konusu
                </label>
                <div className="relative">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                  >
                    {availableTopics.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  Uygun Zaman
                </label>
                <div className="relative">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                  >
                    {DATE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <input
                  type="text"
                  required
                  placeholder="Adınız Soyadınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
                <input
                  type="tel"
                  required
                  placeholder="Telefon numaranız"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
                <input
                  type="email"
                  placeholder="E-posta adresiniz (opsiyonel)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Acente / broker adı veya kısa notunuz (opsiyonel)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp ile Görüşme Planla</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-5 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-semibold text-slate-900">
                  WhatsApp mesajınız hazır
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong>{selectedDate}</strong> için görüşme talebiniz
                  WhatsApp üzerinden iletilmek üzere açıldı. Pencere otomatik
                  açılmadıysa aşağıdaki butona tıklayabilirsiniz.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp&apos;ta Aç ve Gönder</span>
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-sm font-medium cursor-pointer transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
