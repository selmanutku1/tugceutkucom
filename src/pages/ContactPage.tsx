import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Linkedin, MessageCircle, Send } from 'lucide-react';
import { BRAND_PROFILE, CONTACT_CATEGORIES } from '../data/siteContent';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(CONTACT_CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setCompany('');
    setEmail('');
    setTopic(CONTACT_CATEGORIES[0]);
    setMessage('');
    setSubmitted(false);
  };

  const buildWhatsAppUrl = () => {
    const lines = [
      'Merhaba Tuğçe Hanım, web sitenizdeki iletişim formundan yazıyorum.',
      `Ad Soyad: ${name.trim()}`,
      company.trim() ? `Şirket / Kurum: ${company.trim()}` : null,
      `E-posta: ${email.trim()}`,
      `Konu: ${topic}`,
      `Mesaj: ${message.trim()}`,
    ].filter(Boolean);

    return `https://wa.me/${BRAND_PROFILE.whatsappNumber}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-12 sm:pt-16 sm:pb-14">
          <div className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            <p className="text-sm font-medium text-blue-700">İletişim</p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.14] [text-wrap:balance]">
              Birlikte neler geliştirebiliriz?
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Dijital dönüşüm, teknoloji, sigortacılık, ürün stratejisi ve dijital büyüme
              alanlarında fikir alışverişinde bulunmak, profesyonel bağlantılar kurmak ve
              iş birliği fırsatlarını değerlendirmek için iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: 7 Contact Categories + LinkedIn */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 text-center sm:text-left">
                <div className="space-y-1.5">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    İletişim Konuları
                  </h2>
                  <p className="text-sm text-slate-500">
                    Görüşmek istediğiniz konuyu seçerek formu doğrudan doldurabilirsiniz.
                  </p>
                </div>

                <div className="space-y-2">
                  {CONTACT_CATEGORIES.map((category) => {
                    const selected = topic === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setTopic(category);
                          if (submitted) setSubmitted(false);
                        }}
                        className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl border text-sm font-medium text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          selected
                            ? 'bg-blue-50 border-blue-200 text-blue-800 font-semibold'
                            : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span>{category}</span>
                        <ArrowRight
                          className={`w-4 h-4 shrink-0 ${
                            selected ? 'text-blue-700' : 'text-slate-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LinkedIn Direct Connection */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 text-center sm:text-left">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900">
                    Profesyonel Bağlantı
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Güncel paylaşımlar, sektörel değerlendirmeler ve profesyonel ağ için
                    LinkedIn üzerinden de bağlantı kurabilirsiniz.
                  </p>
                </div>
                <a
                  href={BRAND_PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#0A66C2] text-sm font-semibold text-slate-800 hover:text-[#0A66C2] transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span>LinkedIn Profilini Ziyaret Et</span>
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                {submitted ? (
                  <div className="py-8 text-center space-y-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 max-w-md mx-auto">
                      <h2 className="text-xl font-bold text-slate-900">
                        Mesajınız başarıyla iletildi. İlginiz için teşekkür ederim.
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Talebinizi en kısa sürede değerlendirip belirttiğiniz e-posta adresi
                        üzerinden dönüş yapacağım. Dilerseniz mesajınızı doğrudan WhatsApp
                        üzerinden de iletebilirsiniz.
                      </p>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                      <a
                        href={buildWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-sm font-semibold text-white transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp ile de İlet</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-sm font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        Yeni Mesaj Gönder
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1 text-center sm:text-left pb-2 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Mesaj Gönderin
                      </h2>
                      <p className="text-sm text-slate-500">
                        Talebinizin konusu ve hedefi hakkında kısa bilgi paylaşmanız,
                        görüşmenin daha verimli ilerlemesini sağlar.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Ad Soyad <span className="text-blue-700">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Adınız ve soyadınız"
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-company"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Şirket / Kurum
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Kurum adı (opsiyonel)"
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium text-slate-700"
                        >
                          E-posta <span className="text-blue-700">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ornek@kurum.com"
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-topic"
                          className="block text-sm font-medium text-slate-700"
                        >
                          İletişim konusu
                        </label>
                        <select
                          id="contact-topic"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                        >
                          {CONTACT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Mesajınız <span className="text-blue-700">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Projeniz, danışmanlık ihtiyacınız veya iş birliği talebiniz hakkında kısa bilgi paylaşabilirsiniz."
                        className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors resize-y"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Mesaj Gönder</span>
                      </button>

                      <a
                        href={`https://wa.me/${BRAND_PROFILE.whatsappNumber}?text=${encodeURIComponent(
                          `Merhaba Tuğçe Hanım, "${topic}" konusu hakkında görüşmek istiyorum.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <span>WhatsApp ile Yaz</span>
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
