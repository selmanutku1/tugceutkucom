import { useState, type FormEvent } from 'react';
import { 
  X, 
  Calendar, 
  CheckCircle2, 
  Send,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { TUĞÇE_PROFILE } from '../data/consultingContent';

interface BookingContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledTopic?: string;
  prefilledNote?: string;
}

export default function BookingContactModal({
  isOpen,
  onClose,
  prefilledTopic = 'Acente Dijital Dönüşüm Programı',
  prefilledNote = '',
}: BookingContactModalProps) {
  const [topic, setTopic] = useState(prefilledTopic);
  const [selectedDate, setSelectedDate] = useState('Yarın (10:30)');
  const [selectedSlot, setSelectedSlot] = useState('11:00');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState(prefilledNote);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const dates = [
    { label: 'Bugün', val: 'Bugün (Müsait Slot)', badge: 'Hızlı' },
    { label: 'Yarın', val: 'Yarın (Önerilen)', badge: 'Popüler' },
    { label: 'Çarşamba', val: 'Çarşamba (Online)' },
    { label: 'Perşembe', val: 'Perşembe (Online)' },
    { label: 'Cuma', val: 'Cuma (Online)' },
  ];

  const timeSlots = ['10:00', '11:30', '14:00', '15:30', '17:00'];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  const openDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Merhaba Tuğçe Hanım, web siteniz üzerinden ulaşıyorum. "${topic}" konusuyla ilgili 30 dakikalık ücretsiz keşif görüşmesi planlamak istiyorum.`
    );
    window.open(`https://wa.me/905320000000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 active:bg-slate-200 cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {/* Header */}
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 inline-block">
                Ücretsiz Keşif Görüşmesi
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 leading-tight">
                Tuğçe Utku ile 30 Dk Danışmanlık Planlayın
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Acentenizin dijital dönüşümünü, yapay zekâ senaryolarını veya InsurTech projelerini değerlendirin.
              </p>
            </div>

            {/* Topic Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Görüşme Konusu:
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-sm sm:text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                <option value="Acente Dijital Dönüşüm Programı">Acentenizi Dijitalleştirin (Web + CRM + WhatsApp)</option>
                <option value="Kurumsal AI & Doküman Otomasyonu">Kurumsal AI & Doküman Otomasyonu (LLM, OCR & NLP)</option>
                <option value="InsurTech Girişim & Gömülü Sigorta">InsurTech Girişim & Gömülü Sigorta (Embedded / API)</option>
                <option value="Dijital Ürün & Portal Deneyimi">Dijital Ürün & Portal Deneyimi (Web/Mobil/UX)</option>
                <option value="Veri Analitiği & Churn Tahminleme">Veri Analitiği & Müşteri Kayıp (Churn) Modelleri</option>
                <option value="Genel Dijital Dönüşüm Danışmanlığı">Genel Dijital Dönüşüm & Süreç Danışmanlığı</option>
              </select>
            </div>

            {/* Date Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Tercih Ettiğiniz Gün:</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
                {dates.map((d, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedDate(d.val)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedDate === d.val
                        ? 'bg-blue-700 text-white border-blue-700 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 text-xs font-medium'
                    }`}
                  >
                    <div className="text-xs">{d.label}</div>
                    {d.badge && (
                      <span className={`text-[9px] block ${selectedDate === d.val ? 'text-blue-200' : 'text-blue-600'}`}>
                        {d.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Saat Dilimi (Online Google Meet / Zoom):
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {timeSlots.map((slot, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Inputs (text-base on mobile prevents iOS safari auto-zoom) */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Adınız & Soyadınız:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Mehmet Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    E-Posta Adresiniz:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@sirket.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Telefon / WhatsApp:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kurumunuz ve Proje Hedefiniz (Opsiyonel):
                </label>
                <textarea
                  rows={2}
                  placeholder="Acentemiz için WhatsApp otomasyonu ve web sitesi kurmak istiyoruz..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Randevu Talebini Gönder</span>
              </button>

              <button
                type="button"
                onClick={openDirectWhatsApp}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp ile Yaz</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Görüşme öncesi ve sonrası tüm bilgileriniz NDA güvencesindedir.</span>
            </p>

          </form>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 sm:py-8 space-y-4 sm:space-y-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Talep Alındı
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Keşif Görüşmesi Talebiniz İletildi!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Sayın <strong>{name}</strong>, <strong>{topic}</strong> konulu görüşme talebiniz Tuğçe Utku'ya iletilmiştir. Toplantı bağlantısı <strong>{email}</strong> adresinize gönderilecektir.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-sm mx-auto space-y-1">
              <p><strong>Tarih & Saat:</strong> {selectedDate} - {selectedSlot}</p>
              <p><strong>Platform:</strong> Google Meet / Zoom Online Görüşme</p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                Pencereyi Kapat
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
