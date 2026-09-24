import { useState, type FormEvent } from 'react';
import { 
  X, 
  Calendar, 
  CheckCircle2, 
  Send,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Clock,
  User,
  Mail,
  Phone,
  ChevronDown
} from 'lucide-react';

interface BookingContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledTopic?: string;
  prefilledNote?: string;
}

export default function BookingContactModal({
  isOpen,
  onClose,
  prefilledTopic = 'InsurUp CRM & Acente Dönüşümü',
  prefilledNote = '',
}: BookingContactModalProps) {
  const [topic, setTopic] = useState(prefilledTopic);
  const [selectedDate, setSelectedDate] = useState('Yarın (11:00)');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState(prefilledNote);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const dateOptions = [
    'Yarın - 10:30 (Önerilen)',
    'Yarın - 14:00',
    'Yarın - 16:30',
    'Çarşamba - 11:00',
    'Çarşamba - 15:30',
    'Perşembe - 10:00',
    'Perşembe - 14:30',
    'Cuma - 11:30',
    'Cuma - 16:00',
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  const openDirectWhatsApp = () => {
    let message = `Merhaba Tuğçe Hanım, web siteniz üzerinden ulaşıyorum.\n\n`;
    if (name.trim()) {
      message += `👤 *Ad Soyad:* ${name.trim()}\n`;
    }
    message += `🎯 *Görüşme Konusu:* ${topic}\n`;
    message += `⏰ *Tercih Edilen Zaman:* ${selectedDate}\n`;
    if (phone.trim()) {
      message += `📞 *Telefon:* ${phone.trim()}\n`;
    }
    if (email.trim()) {
      message += `✉️ *E-Posta:* ${email.trim()}\n`;
    }
    if (note.trim()) {
      message += `📝 *Not:* ${note.trim()}\n`;
    }
    message += `\nInsurUp CRM ve dijital büyüme danışmanlığı için randevu / demo görüşmesi planlamak istiyorum.`;

    const text = encodeURIComponent(message);
    window.open(`https://wa.me/905468253597?text=${text}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs transition-all duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Minimal Floating Card Container (Mobile-Optimized & Centered) */}
      <div className="bg-white w-full max-w-[420px] rounded-2xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Header: Compact & Clean */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>InsurUp & Keşif Randevusu</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              30 Dk Online Görüşme
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 active:bg-slate-300/60 cursor-pointer transition-colors"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body: Compact & Minimal */}
        <div className="overflow-y-auto px-4 py-3.5 sm:px-5 sm:py-4 space-y-3">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              
              {/* Topic Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Görüşme Konusu:
                </label>
                <div className="relative">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full pl-2.5 pr-7 py-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium appearance-none transition-all cursor-pointer"
                  >
                    <option value="InsurUp CRM & Online Teklif Demosu">InsurUp CRM & Online Karşılaştırmalı Teklif Demosu</option>
                    <option value="Acente Dijital Dönüşüm Programı (InsurUp Destekli)">Acentenizi Dijitalleştirin (InsurUp + Web + WhatsApp)</option>
                    <option value="Kurumsal AI & Doküman Otomasyonu">Kurumsal AI & Doküman Otomasyonu (LLM, OCR & Hasar)</option>
                    <option value="InsurTech Girişim & Gömülü Sigorta (API)">InsurTech Girişim & Gömülü Sigorta (Embedded / API)</option>
                    <option value="Dijital Pazarlama & Google Ads Lead Akışı">Dijital Pazarlama & Sigorta Müşteri Kazanımı (Lead)</option>
                    <option value="Genel Dijital Dönüşüm Danışmanlığı">Genel Dijital Dönüşüm & Süreç Danışmanlığı</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Date & Time (Unified Compact Dropdown) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    <span>Tercih Edilen Zaman:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Google Meet</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-2.5 pr-7 py-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium appearance-none transition-all cursor-pointer"
                  >
                    {dateOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                {/* Full Name */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Adınız & Soyadınız"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium placeholder:text-slate-400"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="E-Posta Adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium placeholder:text-slate-400"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Telefon / WhatsApp Numaranız"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium placeholder:text-slate-400"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Optional Note (Compact) */}
                <div>
                  <input
                    type="text"
                    placeholder="Acente / Kurum Adı veya Notunuz (Opsiyonel)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1.5 space-y-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-700/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Randevuyu Onayla</span>
                </button>

                <button
                  type="button"
                  onClick={openDirectWhatsApp}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>veya WhatsApp'tan Hemen Yazın</span>
                </button>
              </div>

              {/* Minimal Privacy Note */}
              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 pt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Bilgileriniz KVKK ve NDA gizliliği altındadır.</span>
              </p>

            </form>
          ) : (
            /* Confirmation View */
            <div className="text-center py-4 space-y-3">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Talep Alındı
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Görüşme Talebiniz İletildi!
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Sayın <strong>{name}</strong>, randevu davetiniz <strong>{email}</strong> adresinize gönderilecektir.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-xs mx-auto space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Zaman:</span>
                  <span className="font-semibold">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Format:</span>
                  <span className="font-semibold">Online (Google Meet)</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={handleReset}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors"
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
