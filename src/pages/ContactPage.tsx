import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Linkedin, MessageCircle, Send } from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { brand, contactCategories } = getSiteContent(lang);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [topicIndex, setTopicIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedTopic = contactCategories[topicIndex] || contactCategories[0];

  useEffect(() => {
    if (topicIndex >= contactCategories.length) {
      setTopicIndex(0);
    }
  }, [contactCategories.length, topicIndex]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setCompany('');
    setEmail('');
    setTopicIndex(0);
    setMessage('');
    setSubmitted(false);
  };

  const buildWhatsAppUrl = () => {
    const lines = isEn
      ? [
          'Hello Tuğçe, I am writing via the contact form on your website.',
          `Full Name: ${name.trim()}`,
          company.trim() ? `Company / Organization: ${company.trim()}` : null,
          `Email: ${email.trim()}`,
          `Topic: ${selectedTopic}`,
          `Message: ${message.trim()}`,
        ].filter(Boolean)
      : [
          'Merhaba Tuğçe Hanım, web sitenizdeki iletişim formundan yazıyorum.',
          `Ad Soyad: ${name.trim()}`,
          company.trim() ? `Şirket / Kurum: ${company.trim()}` : null,
          `E-posta: ${email.trim()}`,
          `Konu: ${selectedTopic}`,
          `Mesaj: ${message.trim()}`,
        ].filter(Boolean);

    return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-12 sm:pt-16 sm:pb-14">
          <div className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            <p className="text-sm font-medium text-blue-700">
              {isEn ? 'Contact' : 'İletişim'}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.14] [text-wrap:balance]">
              {isEn ? 'What can we build together?' : 'Birlikte neler geliştirebiliriz?'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {isEn
                ? 'Get in touch to exchange perspectives on digital transformation, technology, insurance, product strategy, and digital growth, or to explore professional collaboration opportunities.'
                : 'Dijital dönüşüm, teknoloji, sigortacılık, ürün stratejisi ve dijital büyüme alanlarında fikir alışverişinde bulunmak, profesyonel bağlantılar kurmak ve iş birliği fırsatlarını değerlendirmek için iletişime geçebilirsiniz.'}
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
                    {isEn ? 'Topics of Inquiry' : 'İletişim Konuları'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEn
                      ? 'Select the topic you would like to discuss to pre-fill the form.'
                      : 'Görüşmek istediğiniz konuyu seçerek formu doğrudan doldurabilirsiniz.'}
                  </p>
                </div>

                <div className="space-y-2">
                  {contactCategories.map((category, idx) => {
                    const selected = topicIndex === idx;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setTopicIndex(idx);
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
                    {isEn ? 'Professional Connection' : 'Profesyonel Bağlantı'}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {isEn
                      ? 'You can also connect on LinkedIn for industry commentary, updates, and professional networking.'
                      : 'Güncel paylaşımlar, sektörel değerlendirmeler ve profesyonel ağ için LinkedIn üzerinden de bağlantı kurabilirsiniz.'}
                  </p>
                </div>
                <a
                  href={brand.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#0A66C2] text-sm font-semibold text-slate-800 hover:text-[#0A66C2] transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span>
                    {isEn ? 'Visit LinkedIn Profile' : 'LinkedIn Profilini Ziyaret Et'}
                  </span>
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
                        {isEn
                          ? 'Your message has been sent successfully. Thank you for reaching out.'
                          : 'Mesajınız başarıyla iletildi. İlginiz için teşekkür ederim.'}
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {isEn
                          ? 'I will review your inquiry and follow up via the email address provided. You may also forward your message directly on WhatsApp.'
                          : 'Talebinizi en kısa sürede değerlendirip belirttiğiniz e-posta adresi üzerinden dönüş yapacağım. Dilerseniz mesajınızı doğrudan WhatsApp üzerinden de iletebilirsiniz.'}
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
                        <span>
                          {isEn ? 'Also Send via WhatsApp' : 'WhatsApp ile de İlet'}
                        </span>
                      </a>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-sm font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        {isEn ? 'Send Another Message' : 'Yeni Mesaj Gönder'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1 text-center sm:text-left pb-2 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        {isEn ? 'Send a Message' : 'Mesaj Gönderin'}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {isEn
                          ? 'Sharing brief context on your topic and objective helps make our conversation more productive.'
                          : 'Talebinizin konusu ve hedefi hakkında kısa bilgi paylaşmanız, görüşmenin daha verimli ilerlemesini sağlar.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-slate-700"
                        >
                          {isEn ? 'Full Name' : 'Ad Soyad'}{' '}
                          <span className="text-blue-700">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={isEn ? 'Your full name' : 'Adınız ve soyadınız'}
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-company"
                          className="block text-sm font-medium text-slate-700"
                        >
                          {isEn ? 'Company / Organization' : 'Şirket / Kurum'}
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder={
                            isEn ? 'Organization name (optional)' : 'Kurum adı (opsiyonel)'
                          }
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
                          {isEn ? 'Email' : 'E-posta'}{' '}
                          <span className="text-blue-700">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={
                            isEn ? 'name@company.com' : 'ornek@kurum.com'
                          }
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-topic"
                          className="block text-sm font-medium text-slate-700"
                        >
                          {isEn ? 'Topic' : 'İletişim konusu'}
                        </label>
                        <select
                          id="contact-topic"
                          value={topicIndex}
                          onChange={(e) => setTopicIndex(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                        >
                          {contactCategories.map((category, idx) => (
                            <option key={category} value={idx}>
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
                        {isEn ? 'Your Message' : 'Mesajınız'}{' '}
                        <span className="text-blue-700">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          isEn
                            ? 'Share a brief summary of your project, consulting need, or collaboration inquiry.'
                            : 'Projeniz, danışmanlık ihtiyacınız veya iş birliği talebiniz hakkında kısa bilgi paylaşabilirsiniz.'
                        }
                        className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors resize-y"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isEn ? 'Send Message' : 'Mesaj Gönder'}</span>
                      </button>

                      <a
                        href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                          isEn
                            ? `Hello Tuğçe, I would like to discuss "${selectedTopic}".`
                            : `Merhaba Tuğçe Hanım, "${selectedTopic}" konusu hakkında görüşmek istiyorum.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <span>{isEn ? 'Message on WhatsApp' : 'WhatsApp ile Yaz'}</span>
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
