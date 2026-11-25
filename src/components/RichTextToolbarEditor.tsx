import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import {
  AlertCircle,
  Bold,
  Eye,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  PencilLine,
  Quote,
  Strikethrough,
  Trash2,
  Underline,
  Upload,
  X,
} from 'lucide-react';
import RichArticleContent, {
  isSafeHref,
  isSafeImageSrc,
  stripMarkdownForStats,
} from './RichArticleContent';
import { parseBodyToSections } from '../utils/blogSections';

export interface InlineMediaEntry {
  token: string; // e.g. "media:img-1"
  dataUrl: string;
  alt: string;
  sizeKb: number;
}

const MAX_INLINE_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_INLINE_DATAURL_CHARS = 240_000;

function compressInlineImage(file: File, isEn: boolean): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const isSupported =
      /^image\/(jpeg|jpg|png|webp)$/i.test(file.type) ||
      /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!isSupported) {
      reject(
        new Error(
          isEn
            ? 'Only JPEG, PNG, or WebP images can be inserted inside the article.'
            : 'Yazı içine yalnızca JPEG, PNG veya WebP görseller eklenebilir.'
        )
      );
      return;
    }

    if (file.size > MAX_INLINE_IMAGE_BYTES) {
      reject(
        new Error(
          isEn
            ? 'Inline image file must be 5 MB or smaller.'
            : 'Yazı içi görsel dosyası en fazla 5 MB olabilir.'
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error(isEn ? 'Failed to read image.' : 'Görsel okunamadı.'));
    reader.onload = () => {
      const rawUrl = String(reader.result || '');
      const img = new Image();
      img.onerror = () => reject(new Error(isEn ? 'Invalid image file.' : 'Geçersiz görsel dosyası.'));
      img.onload = () => {
        const maxW = 1040;
        const scale = img.naturalWidth > maxW ? maxW / img.naturalWidth : 1;
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error(isEn ? 'Canvas unavailable.' : 'Görsel işlenemedi.'));
          return;
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        let output = canvas.toDataURL('image/jpeg', 0.8);
        if (output.length > MAX_INLINE_DATAURL_CHARS) {
          output = canvas.toDataURL('image/jpeg', 0.65);
        }
        if (output.length > MAX_INLINE_DATAURL_CHARS) {
          const smallerCanvas = document.createElement('canvas');
          smallerCanvas.width = Math.round(w * 0.72);
          smallerCanvas.height = Math.round(h * 0.72);
          const sCtx = smallerCanvas.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = '#ffffff';
            sCtx.fillRect(0, 0, smallerCanvas.width, smallerCanvas.height);
            sCtx.drawImage(img, 0, 0, smallerCanvas.width, smallerCanvas.height);
            output = smallerCanvas.toDataURL('image/jpeg', 0.68);
          }
        }

        const sizeKb = Math.max(1, Math.round(((output.length * 3) / 4) / 1024));
        resolve({ dataUrl: output, sizeKb });
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function extractInlineDataImagesToTokens(rawBody: string): {
  tokenizedBody: string;
  mediaEntries: InlineMediaEntry[];
} {
  const entries: InlineMediaEntry[] = [];
  let counter = 1;

  const tokenizedBody = rawBody.replace(
    /!\[([^\]]*)\]\((data:image\/(?:jpeg|jpg|png|webp|gif);base64,[^)\s]+)(\s+"([^"]*)")?\)/gi,
    (_full, alt, dataUrl, captionPart) => {
      const token = `media:img-${counter++}`;
      const sizeKb = Math.max(1, Math.round(((String(dataUrl).length * 3) / 4) / 1024));
      entries.push({
        token,
        dataUrl: String(dataUrl),
        alt: String(alt || '').trim() || `Görsel ${counter - 1}`,
        sizeKb,
      });
      return `![${String(alt || '')}](${token}${captionPart || ''})`;
    }
  );

  return { tokenizedBody, mediaEntries: entries };
}

export function expandMediaTokensInBody(
  tokenizedBody: string,
  mediaEntries: InlineMediaEntry[]
): string {
  let out = tokenizedBody;
  for (const item of mediaEntries) {
    out = out.split(`(${item.token})`).join(`(${item.dataUrl})`);
    out = out.split(`(${item.token} `).join(`(${item.dataUrl} `);
  }
  return out;
}

interface RichTextToolbarEditorProps {
  value: string;
  onChange: (nextTokenizedValue: string) => void;
  mediaEntries: InlineMediaEntry[];
  onMediaEntriesChange: (next: InlineMediaEntry[]) => void;
  h1Title: string;
  fallbackTitle: string;
  isEn: boolean;
}

export default function RichTextToolbarEditor({
  value,
  onChange,
  mediaEntries,
  onMediaEntriesChange,
  h1Title,
  fallbackTitle,
  isEn,
}: RichTextToolbarEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inlineImgInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showLinkBox, setShowLinkBox] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkError, setLinkError] = useState<string | null>(null);

  const [showImageBox, setShowImageBox] = useState(false);
  const [inlineImgUrl, setInlineImgUrl] = useState('');
  const [inlineImgAlt, setInlineImgAlt] = useState('');
  const [inlineImgError, setInlineImgError] = useState<string | null>(null);
  const [processingInlineImg, setProcessingInlineImg] = useState(false);

  const mediaMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const entry of mediaEntries) {
      map[entry.token] = entry.dataUrl;
    }
    return map;
  }, [mediaEntries]);

  useEffect(() => {
    setLinkError(null);
  }, [linkText, linkUrl]);

  const applySelectionWrap = (prefix: string, suffix: string, placeholder: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const inner = selected || placeholder;
    const next = `${value.slice(0, start)}${prefix}${inner}${suffix}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + inner.length;
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const applyLinePrefix = (prefix: string, sampleText: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const lineEndRaw = value.indexOf('\n', start);
    const lineEnd = lineEndRaw === -1 ? value.length : lineEndRaw;
    const currentLine = value.slice(lineStart, lineEnd);

    // Strip existing heading/list/quote prefix if switching heading levels
    const stripped = currentLine.replace(/^(#{2,4}\s+|>\s?|[-*]\s+|\d+\.\s+)/, '');
    const isAlreadySame = currentLine.startsWith(prefix);
    const replacement = isAlreadySame
      ? stripped
      : `${prefix}${stripped || sampleText}`;

    const next = `${value.slice(0, lineStart)}${replacement}${value.slice(lineEnd)}`;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = lineStart + replacement.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const insertBlockAtCursor = (snippet: string) => {
    const el = textareaRef.current;
    const start = el ? (el.selectionStart ?? value.length) : value.length;
    const end = el ? (el.selectionEnd ?? value.length) : value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const needsLeadingBreak = before.length > 0 && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    const needsTrailingBreak = after.length > 0 && !after.startsWith('\n') ? '\n\n' : '';
    const inserted = `${needsLeadingBreak}${snippet}${needsTrailingBreak}`;
    const next = `${before}${inserted}${after}`;
    onChange(next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = before.length + inserted.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleOpenLinkBox = () => {
    const el = textareaRef.current;
    const selected = el ? value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0).trim() : '';
    setLinkText(selected || '');
    setLinkUrl('https://');
    setLinkError(null);
    setShowImageBox(false);
    setShowLinkBox((prev) => !prev);
  };

  const handleInsertLink = () => {
    const cleanUrl = linkUrl.trim();
    if (!isSafeHref(cleanUrl)) {
      setLinkError(
        isEn
          ? 'Please enter a valid link starting with https://, http://, or /'
          : 'Lütfen https://, http:// veya / ile başlayan geçerli bir bağlantı girin.'
      );
      return;
    }
    const cleanLabel = linkText.trim() || cleanUrl;
    const markdownLink = `[${cleanLabel}](${cleanUrl})`;
    const el = textareaRef.current;
    if (!el) {
      onChange(`${value}${markdownLink}`);
    } else {
      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;
      const next = `${value.slice(0, start)}${markdownLink}${value.slice(end)}`;
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + markdownLink.length;
        el.setSelectionRange(pos, pos);
      });
    }
    setShowLinkBox(false);
    setLinkText('');
    setLinkUrl('https://');
  };

  const handleInsertInlineUrlImage = () => {
    const cleanUrl = inlineImgUrl.trim();
    if (!isSafeImageSrc(cleanUrl) || cleanUrl.startsWith('data:')) {
      setInlineImgError(
        isEn
          ? 'Please enter a valid https:// image URL or upload an image file.'
          : 'Lütfen geçerli bir https:// görsel adresi girin veya bilgisayardan görsel yükleyin.'
      );
      return;
    }
    const alt = inlineImgAlt.trim() || (isEn ? 'Article visual' : 'Makale içi görsel');
    insertBlockAtCursor(`![${alt}](${cleanUrl})`);
    setShowImageBox(false);
    setInlineImgUrl('');
    setInlineImgAlt('');
    setInlineImgError(null);
  };

  const handleInlineImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInlineImgError(null);
    setProcessingInlineImg(true);
    try {
      const { dataUrl, sizeKb } = await compressInlineImage(file, isEn);
      const nextIndex =
        mediaEntries.reduce((max, item) => {
          const m = item.token.match(/media:img-(\d+)/);
          return m ? Math.max(max, Number(m[1])) : max;
        }, 0) + 1;
      const token = `media:img-${nextIndex}`;
      const alt =
        inlineImgAlt.trim() ||
        file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ') ||
        (isEn ? `Inline image ${nextIndex}` : `Yazı içi görsel ${nextIndex}`);

      onMediaEntriesChange([
        ...mediaEntries,
        { token, dataUrl, alt, sizeKb },
      ]);
      insertBlockAtCursor(`![${alt}](${token})`);
      setShowImageBox(false);
      setInlineImgAlt('');
    } catch (err) {
      setInlineImgError(
        err instanceof Error ? err.message : isEn ? 'Image failed.' : 'Görsel eklenemedi.'
      );
    } finally {
      setProcessingInlineImg(false);
      if (inlineImgInputRef.current) inlineImgInputRef.current.value = '';
    }
  };

  const handleRemoveInlineMedia = (token: string) => {
    onMediaEntriesChange(mediaEntries.filter((item) => item.token !== token));
    const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cleaned = value
      .replace(new RegExp(`!\\[[^\\]]*\\]\\(${escapedToken}(?:\\s+"[^"]*")?\\)\\n*`, 'g'), '')
      .trim();
    onChange(cleaned);
  };

  // Live SEO Heading Outline (H1 -> H2 -> H3 -> H4)
  const seoHeadings = useMemo(() => {
    const headings: { level: 1 | 2 | 3 | 4; text: string }[] = [
      {
        level: 1,
        text:
          h1Title.trim() ||
          fallbackTitle.trim() ||
          (isEn ? '(H1 Heading not entered yet)' : '(H1 Başlığı henüz girilmedi)'),
      },
    ];
    for (const line of value.split('\n')) {
      const t = line.trim();
      if (t.startsWith('#### ')) {
        headings.push({ level: 4, text: t.slice(5).trim() });
      } else if (t.startsWith('### ')) {
        headings.push({ level: 3, text: t.slice(4).trim() });
      } else if (t.startsWith('## ')) {
        headings.push({ level: 2, text: t.slice(3).trim() });
      }
    }
    return headings;
  }, [value, h1Title, fallbackTitle, isEn]);

  const hasH2 = seoHeadings.some((h) => h.level === 2);
  const firstNonH1 = seoHeadings[1];
  const headingHierarchyWarning =
    firstNonH1 && firstNonH1.level > 2
      ? isEn
        ? 'SEO Tip: Start content sections with an H2 heading before using H3 or H4.'
        : 'SEO İpucu: H3 veya H4 alt başlık kullanmadan önce en az bir H2 bölüm başlığı eklemeniz önerilir.'
      : !hasH2 && value.trim().length > 140
        ? isEn
          ? 'SEO Tip: Add H2 headings (##) to structure your article and populate the Table of Contents.'
          : 'SEO İpucu: Makalenizi yapılandırmak ve İçindekiler menüsünü oluşturmak için H2 (##) başlıklar ekleyin.'
        : null;

  const plainStatsText = useMemo(() => stripMarkdownForStats(value), [value]);
  const wordCount = useMemo(
    () => (plainStatsText ? plainStatsText.split(/\s+/).filter(Boolean).length : 0),
    [plainStatsText]
  );
  const estMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const previewSections = useMemo(
    () => parseBodyToSections(value, h1Title.trim() || fallbackTitle.trim() || 'Önizleme'),
    [value, h1Title, fallbackTitle]
  );

  return (
    <div className="space-y-3">
      {/* Header Row with Edit / Preview Tabs & Word Count */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-white text-brand-navy shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PencilLine className="w-3.5 h-3.5" />
            <span>{isEn ? 'Write & Format' : 'Yaz & Biçimlendir'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-brand-navy shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isEn ? 'Live Preview' : 'Canlı Önizleme'}</span>
          </button>
        </div>

        <span className="text-[11px] font-medium text-slate-500">
          {wordCount} {isEn ? 'words' : 'kelime'} · ~{estMinutes}{' '}
          {isEn ? 'min read' : 'dk okuma'}
        </span>
      </div>

      {/* Formatting Toolbar */}
      {activeTab === 'edit' && (
        <div className="rounded-t-xl border border-b-0 border-slate-200 bg-slate-50/90 px-2.5 py-2 space-y-2">
          <div className="flex flex-wrap items-center gap-1">
            {/* SEO Headings */}
            <div className="inline-flex items-center gap-0.5 pr-2 mr-1 border-r border-slate-200">
              <button
                type="button"
                title={isEn ? 'SEO Heading H2' : 'SEO Ana Bölüm Başlığı (H2)'}
                onClick={() => applyLinePrefix('## ', isEn ? 'Section Heading' : 'Bölüm Başlığı')}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold text-brand-navy hover:bg-brand-teal-light hover:text-brand-teal cursor-pointer transition-colors"
              >
                <Heading2 className="w-3.5 h-3.5" />
                <span>H2</span>
              </button>
              <button
                type="button"
                title={isEn ? 'SEO Subheading H3' : 'SEO Alt Başlık (H3)'}
                onClick={() => applyLinePrefix('### ', isEn ? 'Subheading' : 'Alt Başlık')}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-brand-teal-light hover:text-brand-teal cursor-pointer transition-colors"
              >
                <Heading3 className="w-3.5 h-3.5" />
                <span>H3</span>
              </button>
              <button
                type="button"
                title={isEn ? 'SEO Detail Heading H4' : 'SEO Detay Başlık (H4)'}
                onClick={() => applyLinePrefix('#### ', isEn ? 'Detail Heading' : 'Detay Başlık')}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-brand-teal-light hover:text-brand-teal cursor-pointer transition-colors"
              >
                <Heading4 className="w-3.5 h-3.5" />
                <span>H4</span>
              </button>
            </div>

            {/* Text Styles */}
            <div className="inline-flex items-center gap-0.5 pr-2 mr-1 border-r border-slate-200">
              <button
                type="button"
                title={isEn ? 'Bold' : 'Kalın'}
                onClick={() => applySelectionWrap('**', '**', isEn ? 'bold text' : 'kalın metin')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-brand-navy cursor-pointer transition-colors"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                title={isEn ? 'Italic' : 'İtalik'}
                onClick={() => applySelectionWrap('*', '*', isEn ? 'italic text' : 'italik metin')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-brand-navy cursor-pointer transition-colors"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                title={isEn ? 'Underline' : 'Altı Çizili'}
                onClick={() => applySelectionWrap('<u>', '</u>', isEn ? 'underlined' : 'altı çizili')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-brand-navy cursor-pointer transition-colors"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                type="button"
                title={isEn ? 'Strikethrough' : 'Üstü Çizili'}
                onClick={() => applySelectionWrap('~~', '~~', isEn ? 'strikethrough' : 'üstü çizili')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-brand-navy cursor-pointer transition-colors"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            {/* Lists, Quote, Divider */}
            <div className="inline-flex items-center gap-0.5 pr-2 mr-1 border-r border-slate-200">
              <button
                type="button"
                title={isEn ? 'Bulleted List' : 'Madde İşaretli Liste'}
                onClick={() => applyLinePrefix('- ', isEn ? 'List item' : 'Liste maddesi')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-brand-navy cursor-pointer transition-colors"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                title={isEn ? 'Numbered List' : 'Numaralı Liste'}
                onClick={() => applyLinePrefix('1. ', isEn ? 'Numbered step' : 'Numaralı madde')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-brand-navy cursor-pointer transition-colors"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                title={isEn ? 'Blockquote' : 'Alıntı Kutusu'}
                onClick={() => applyLinePrefix('> ', isEn ? 'Highlighted insight...' : 'Öne çıkan alıntı...')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-brand-navy cursor-pointer transition-colors"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                title={isEn ? 'Horizontal Divider' : 'Bölüm Ayırıcı Çizgi'}
                onClick={() => insertBlockAtCursor('---')}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-brand-navy cursor-pointer transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Link & Inline Image Buttons */}
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={handleOpenLinkBox}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  showLinkBox
                    ? 'bg-brand-navy text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-teal hover:text-brand-teal'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Add Link' : 'Link Ekle'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLinkBox(false);
                  setInlineImgError(null);
                  setShowImageBox((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  showImageBox
                    ? 'bg-brand-navy text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-teal hover:text-brand-teal'
                }`}
              >
                <ImagePlus className="w-3.5 h-3.5" />
                <span>{isEn ? 'Inline Image' : 'Yazı İçi Görsel'}</span>
              </button>
            </div>
          </div>

          {/* Inline Link Insertion Panel */}
          {showLinkBox && (
            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800">
                  {isEn ? 'Insert Hyperlink' : 'Yazı İçi Bağlantı (Link) Ekle'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowLinkBox(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder={isEn ? 'Visible link text' : 'Görünecek link metni'}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-teal focus:outline-none"
                />
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://... veya /iletisim"
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-teal focus:outline-none font-mono"
                />
              </div>
              {linkError && (
                <p className="text-[11px] text-red-600 font-medium">{linkError}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkBox(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Vazgeç'}
                </button>
                <button
                  type="button"
                  onClick={handleInsertLink}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-teal hover:bg-brand-teal-hover text-xs font-semibold text-white cursor-pointer"
                >
                  {isEn ? 'Insert Link' : 'Bağlantıyı Ekle'}
                </button>
              </div>
            </div>
          )}

          {/* Inline Image Insertion Panel */}
          {showImageBox && (
            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800">
                  {isEn ? 'Insert Inline Image' : 'Makale İçine Görsel Ekle'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowImageBox(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                ref={inlineImgInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={handleInlineImageUpload}
                className="hidden"
              />

              <div className="space-y-2">
                <input
                  type="text"
                  value={inlineImgAlt}
                  onChange={(e) => setInlineImgAlt(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Image description / caption (SEO alt text)'
                      : 'Görsel açıklaması / altyazısı (SEO alt metni)'
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-teal focus:outline-none"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={processingInlineImg}
                    onClick={() => inlineImgInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-navy hover:bg-brand-navy-hover disabled:opacity-60 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {processingInlineImg
                        ? isEn
                          ? 'Optimizing...'
                          : 'Hazırlanıyor...'
                        : isEn
                          ? 'Upload from Computer'
                          : 'Bilgisayardan Görsel Yükle'}
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-400">
                    {isEn ? 'or paste HTTPS URL:' : 'veya HTTPS URL girin:'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={inlineImgUrl}
                    onChange={(e) => setInlineImgUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-teal focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleInsertInlineUrlImage}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-teal text-xs font-semibold text-slate-700 hover:text-brand-teal cursor-pointer shrink-0"
                  >
                    {isEn ? 'Insert URL' : 'URL Ekle'}
                  </button>
                </div>
              </div>

              {inlineImgError && (
                <p className="text-[11px] text-red-600 font-medium">{inlineImgError}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Editor Textarea OR Live Preview */}
      {activeTab === 'edit' ? (
        <textarea
          ref={textareaRef}
          id="post-body"
          required
          rows={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            isEn
              ? 'Write your article here. Use the toolbar above for H2/H3/H4 SEO headings, bold, italic, underline, lists, quotes, links, and inline images.'
              : 'Makale içeriğini buraya yazın. Yukarıdaki araç çubuğundan H2/H3/H4 SEO başlıkları, kalın/italik/altı çizili yazı stili, liste, alıntı, link ve yazı içi görsel ekleyebilirsiniz.'
          }
          className="w-full px-3.5 py-3 text-sm rounded-b-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal resize-y leading-relaxed"
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 min-h-[280px] space-y-6">
          <h1 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            {h1Title.trim() || fallbackTitle.trim() || (isEn ? 'Article H1 Heading' : 'Makale H1 Başlığı')}
          </h1>
          {value.trim() ? (
            <div className="space-y-8">
              {previewSections.map((section) => (
                <section key={section.id} className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
                  <RichArticleContent
                    paragraphs={section.paragraphs}
                    resolveMediaUrl={(src) => mediaMap[src] || src}
                  />
                </section>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              {isEn ? 'Start writing to see the formatted preview.' : 'Önizleme için içerik yazmaya başlayın.'}
            </p>
          )}
        </div>
      )}

      {/* Uploaded Inline Images Tray */}
      {mediaEntries.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2">
          <p className="text-[11px] font-semibold text-slate-600">
            {isEn
              ? `Inline Images (${mediaEntries.length})`
              : `Yazı İçi Yüklenen Görseller (${mediaEntries.length})`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mediaEntries.map((item) => (
              <div
                key={item.token}
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2"
              >
                <img
                  src={item.dataUrl}
                  alt={item.alt}
                  className="w-12 h-9 rounded object-cover border border-slate-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-800 truncate">{item.alt}</p>
                  <p className="text-[10px] font-mono text-slate-400">
                    {item.token} · {item.sizeKb} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveInlineMedia(item.token)}
                  title={isEn ? 'Remove inline image' : 'Görseli kaldır'}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live SEO H-Heading Outline */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-700">
            {isEn ? 'SEO Heading Hierarchy (H1 – H4)' : 'SEO Başlık Hiyerarşisi (H1 – H4)'}
          </p>
          <span className="text-[11px] text-slate-500">
            {seoHeadings.length} {isEn ? 'headings' : 'başlık'}
          </span>
        </div>

        <ul className="space-y-1 text-xs">
          {seoHeadings.map((item, idx) => (
            <li
              key={`${item.level}-${idx}`}
              style={{ paddingLeft: `${(item.level - 1) * 14}px` }}
              className="flex items-center gap-1.5 text-slate-700 truncate"
            >
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  item.level === 1
                    ? 'bg-brand-navy text-white'
                    : item.level === 2
                      ? 'bg-brand-teal-light text-brand-teal'
                      : item.level === 3
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-slate-100 text-slate-500'
                }`}
              >
                H{item.level}
              </span>
              <span className="truncate">{item.text}</span>
            </li>
          ))}
        </ul>

        {headingHierarchyWarning && (
          <div className="flex items-start gap-1.5 pt-1 text-[11px] text-amber-700">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{headingHierarchyWarning}</span>
          </div>
        )}
      </div>
    </div>
  );
}
