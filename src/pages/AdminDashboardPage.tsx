import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  FilePlus2,
  FileText,
  ImagePlus,
  Link2,
  Lock,
  LogOut,
  Pencil,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { BlogCategoryKey, BlogPost } from '../types';
import {
  ensureUniqueSlug,
  sectionsToBodyText,
  slugifyTurkish,
  useBlog,
} from '../context/BlogContext';
import { getBlogData } from '../data/blogPostsEn';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import BrandLogo from '../components/BrandLogo';

const DASHBOARD_PASSCODE = '2027';
const SESSION_AUTH_KEY = 'tu_dashboard_unlocked';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const RECOMMENDED_WIDTH = 1200;
const RECOMMENDED_HEIGHT = 675;
const MIN_WIDTH = 800;
const MIN_HEIGHT = 450;

const CATEGORY_OPTIONS: { key: BlogCategoryKey; labelTr: string; labelEn: string }[] = [
  { key: 'dijital-donusum', labelTr: 'Dijital Dönüşüm', labelEn: 'Digital Transformation' },
  {
    key: 'insurtech',
    labelTr: 'Insurtech ve Dijital Sigortacılık',
    labelEn: 'Insurtech & Digital Insurance',
  },
  { key: 'yapay-zeka', labelTr: 'Yapay Zekâ ve Teknoloji', labelEn: 'AI & Technology' },
  {
    key: 'dijital-pazarlama',
    labelTr: 'Dijital Büyüme ve Performans Pazarlaması',
    labelEn: 'Digital Growth & Performance Marketing',
  },
  { key: 'strateji-yonetim', labelTr: 'Strateji ve Yönetim', labelEn: 'Strategy & Management' },
];

const COVER_OPTIONS: { value: BlogPost['coverTheme']; labelTr: string; labelEn: string }[] = [
  { value: 'photo', labelTr: 'Mimari Fotoğraf', labelEn: 'Architectural Photo' },
  { value: 'transformation', labelTr: 'Dijital Dönüşüm', labelEn: 'Digital Transformation' },
  { value: 'insurtech', labelTr: 'Insurtech', labelEn: 'Insurtech' },
  { value: 'ai', labelTr: 'Yapay Zekâ', labelEn: 'Artificial Intelligence' },
  { value: 'growth', labelTr: 'Büyüme & Pazarlama', labelEn: 'Growth & Marketing' },
  { value: 'strategy', labelTr: 'Strateji & Yönetim', labelEn: 'Strategy & Leadership' },
];

function isInitiallyUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SESSION_AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

interface ProcessedImageResult {
  dataUrl: string;
  meta: NonNullable<BlogPost['coverImageMeta']>;
  warning?: string;
}

function processUploadedImage(
  file: File,
  isEn: boolean
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const isJpeg =
      file.type === 'image/jpeg' || /\.(jpe?g)$/i.test(file.name);
    const isPng = file.type === 'image/png' || /\.png$/i.test(file.name);

    if (!isJpeg && !isPng) {
      reject(
        new Error(
          isEn
            ? 'Only JPEG (.jpg, .jpeg) and PNG (.png) images are supported.'
            : 'Yalnızca JPEG (.jpg, .jpeg) ve PNG (.png) formatındaki görseller yüklenebilir.'
        )
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      reject(
        new Error(
          isEn
            ? 'Image file size must be 5 MB or smaller.'
            : 'Görsel dosya boyutu en fazla 5 MB olabilir.'
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      reject(
        new Error(
          isEn
            ? 'Could not read the selected image file.'
            : 'Seçilen görsel dosyası okunamadı.'
        )
      );
    };

    reader.onload = () => {
      const rawDataUrl = String(reader.result || '');
      const img = new Image();
      img.onerror = () => {
        reject(
          new Error(
            isEn
              ? 'Invalid or corrupted image file.'
              : 'Geçersiz veya bozuk görsel dosyası.'
          )
        );
      };

      img.onload = () => {
        const origW = img.naturalWidth;
        const origH = img.naturalHeight;

        let warning: string | undefined;
        if (origW < MIN_WIDTH || origH < MIN_HEIGHT) {
          warning = isEn
            ? `Uploaded image is ${origW} × ${origH} px. For sharp results on cards and detail pages, 1200 × 675 px (min. 800 × 450 px) is recommended.`
            : `Yüklenen görsel ${origW} × ${origH} px boyutunda. Kartlarda ve detay sayfasında net görünüm için 1200 × 675 px (en az 800 × 450 px) önerilir.`;
        } else if (origH > origW) {
          warning = isEn
            ? `Uploaded image is vertical (${origW} × ${origH} px). It will be center-cropped to 16:9 landscape; 1200 × 675 px horizontal is ideal.`
            : `Yüklenen görsel dikey (${origW} × ${origH} px). 16:9 yatay alana ortalanarak kırpılacaktır; 1200 × 675 px yatay görsel en iyi sonucu verir.`;
        }

        // Resize cleanly if wider than 1200px to keep page load & storage fast
        const maxWidth = RECOMMENDED_WIDTH;
        const scale = origW > maxWidth ? maxWidth / origW : 1;
        const targetW = Math.round(origW * scale);
        const targetH = Math.round(origH * scale);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            dataUrl: rawDataUrl,
            meta: {
              width: origW,
              height: origH,
              format: isPng ? 'PNG' : 'JPEG',
              sizeKb: Math.max(1, Math.round(file.size / 1024)),
            },
            warning,
          });
          return;
        }

        if (isJpeg) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetW, targetH);
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);

        let outputMime: 'image/jpeg' | 'image/png' = isPng
          ? 'image/png'
          : 'image/jpeg';
        let outputDataUrl = isPng
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', 0.86);

        // If a large PNG produces a very heavy data URL (> 700 KB), keep crisp quality via high-quality JPEG fallback
        if (isPng && outputDataUrl.length > 950_000) {
          const jpegCanvas = document.createElement('canvas');
          jpegCanvas.width = targetW;
          jpegCanvas.height = targetH;
          const jCtx = jpegCanvas.getContext('2d');
          if (jCtx) {
            jCtx.fillStyle = '#ffffff';
            jCtx.fillRect(0, 0, targetW, targetH);
            jCtx.drawImage(img, 0, 0, targetW, targetH);
            outputDataUrl = jpegCanvas.toDataURL('image/jpeg', 0.88);
            outputMime = 'image/jpeg';
          }
        }

        const approxBytes = Math.round((outputDataUrl.length * 3) / 4);
        resolve({
          dataUrl: outputDataUrl,
          meta: {
            width: targetW,
            height: targetH,
            format: outputMime === 'image/png' ? 'PNG' : 'JPEG',
            sizeKb: Math.max(1, Math.round(approxBytes / 1024)),
          },
          warning,
        });
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

export default function AdminDashboardPage() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const {
    customPosts,
    deletedBaseIds,
    getPosts,
    isBuiltInPost,
    isModifiedBuiltInPost,
    addPost,
    updatePost,
    deletePost,
    resetBuiltInPost,
  } = useBlog();

  // Passcode Gate State
  const [unlocked, setUnlocked] = useState<boolean>(() => isInitiallyUnlocked());
  const [codeInput, setCodeInput] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [codeError, setCodeError] = useState(false);

  // Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [spot, setSpot] = useState('');
  const [categoryKey, setCategoryKey] = useState<BlogCategoryKey>('dijital-donusum');
  const [tagsText, setTagsText] = useState('');
  const [coverTheme, setCoverTheme] = useState<BlogPost['coverTheme']>('transformation');
  const [coverImage, setCoverImage] = useState<string>('');
  const [coverImageMeta, setCoverImageMeta] = useState<BlogPost['coverImageMeta']>(undefined);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageWarning, setImageWarning] = useState<string | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [readingTime, setReadingTime] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedPost, setSavedPost] = useState<{ post: BlogPost; wasEdit: boolean } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [listFilter, setListFilter] = useState<'all' | 'builtin' | 'custom'>('all');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allPosts = getPosts(lang);
  const allTrPosts = getPosts('tr');

  const newCustomCount = useMemo(
    () => customPosts.filter((p) => !isBuiltInPost(p.id)).length,
    [customPosts, isBuiltInPost]
  );

  const editedBuiltInCount = useMemo(
    () => customPosts.filter((p) => isBuiltInPost(p.id)).length,
    [customPosts, isBuiltInPost]
  );

  const deletedBuiltInPosts = useMemo(() => {
    if (deletedBaseIds.length === 0) return [];
    const deletedSet = new Set(deletedBaseIds);
    return getBlogData(lang).posts.filter((p) => deletedSet.has(p.id));
  }, [deletedBaseIds, lang]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPosts.filter((post) => {
      if (listFilter === 'builtin' && !isBuiltInPost(post.id)) return false;
      if (listFilter === 'custom' && isBuiltInPost(post.id)) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.categoryLabel.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [allPosts, isBuiltInPost, listFilter, searchQuery]);

  // Compute unique preview slug in real time across all active posts excluding the post currently being edited
  const existingSlugsForCheck = useMemo(() => {
    return new Set(
      allTrPosts.filter((p) => p.id !== editingId).map((p) => p.slug)
    );
  }, [allTrPosts, editingId]);

  const resolvedPreviewSlug = useMemo(() => {
    const source = slugManuallyEdited && customSlug.trim() ? customSlug : title;
    if (!source.trim()) return 'yeni-blog-yazisi';
    return ensureUniqueSlug(source, existingSlugsForCheck);
  }, [slugManuallyEdited, customSlug, title, existingSlugsForCheck]);

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (codeInput.trim() === DASHBOARD_PASSCODE) {
      setUnlocked(true);
      setCodeError(false);
      setCodeInput('');
      try {
        window.sessionStorage.setItem(SESSION_AUTH_KEY, '1');
      } catch {
        // Ignore sessionStorage errors
      }
    } else {
      setCodeError(true);
    }
  };

  const handleLogout = () => {
    setUnlocked(false);
    setCodeInput('');
    setCodeError(false);
    try {
      window.sessionStorage.removeItem(SESSION_AUTH_KEY);
    } catch {
      // Ignore
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCustomSlug('');
    setSlugManuallyEdited(false);
    setSpot('');
    setCategoryKey('dijital-donusum');
    setTagsText('');
    setCoverTheme('transformation');
    setCoverImage('');
    setCoverImageMeta(undefined);
    setImageError(null);
    setImageWarning(null);
    setReadingTime('');
    setBodyText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setCustomSlug(post.slug);
    setSlugManuallyEdited(true);
    setSpot(post.spot);
    setCategoryKey(post.categoryKey);
    setTagsText(post.tags.join(', '));
    setCoverTheme(post.coverTheme);
    setCoverImage(post.coverImage || '');
    setCoverImageMeta(post.coverImageMeta);
    setImageError(null);
    setImageWarning(null);
    setReadingTime(post.readingTime);
    setBodyText(sectionsToBodyText(post.sections));
    setSavedPost(null);
    setConfirmDeleteId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageFile = async (file: File | undefined | null) => {
    if (!file) return;
    setImageError(null);
    setImageWarning(null);
    setProcessingImage(true);
    try {
      const result = await processUploadedImage(file, isEn);
      setCoverImage(result.dataUrl);
      setCoverImageMeta(result.meta);
      setImageWarning(result.warning || null);
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : isEn
            ? 'Image upload failed.'
            : 'Görsel yüklenemedi.'
      );
    } finally {
      setProcessingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleImageFile(e.target.files?.[0]);
  };

  const handleDropImage = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImage(false);
    handleImageFile(e.dataTransfer.files?.[0]);
  };

  const handleRemoveImage = () => {
    setCoverImage('');
    setCoverImageMeta(undefined);
    setImageError(null);
    setImageWarning(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyArticleUrl = async (slug: string) => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://tugceutku.com';
    const fullUrl = `${origin}/blog/${slug}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      }
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug((prev) => (prev === slug ? null : prev)), 2200);
    } catch {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug((prev) => (prev === slug ? null : prev)), 2200);
    }
  };

  const handleSubmitPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !spot.trim() || !bodyText.trim() || saving) return;

    setSaving(true);
    try {
      const parsedTags = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const input = {
        title: title.trim(),
        slug: slugManuallyEdited && customSlug.trim() ? customSlug.trim() : title.trim(),
        spot: spot.trim(),
        categoryKey,
        tags: parsedTags,
        coverTheme,
        coverImage: coverImage || undefined,
        coverImageMeta: coverImage ? coverImageMeta : undefined,
        readingTime: readingTime.trim() || undefined,
        bodyText: bodyText.trim(),
      };

      const wasEdit = Boolean(editingId);
      const result = editingId
        ? await updatePost(editingId, input, DASHBOARD_PASSCODE)
        : await addPost(input, DASHBOARD_PASSCODE);

      setSavedPost({ post: result, wasEdit });
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    await deletePost(id, DASHBOARD_PASSCODE);
    setConfirmDeleteId(null);
    if (editingId === id) {
      resetForm();
    }
  };

  const handleResetBuiltIn = async (id: string) => {
    await resetBuiltInPost(id, DASHBOARD_PASSCODE);
    if (editingId === id) {
      resetForm();
    }
  };

  // PASSCODE GATE SCREEN
  if (!unlocked) {
    return (
      <section className="min-h-[72vh] bg-transparent flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xs p-7 sm:p-9 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <BrandLogo theme="light" />
            <div className="w-11 h-11 rounded-xl bg-brand-teal-light border border-brand-teal-soft text-brand-teal flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {isEn ? 'Blog Dashboard Login' : 'Blog Yönetim Paneli'}
              </h1>
              <p className="text-sm text-slate-500">
                {isEn
                  ? 'Enter your passcode to add and manage blog articles.'
                  : 'Yeni blog yazısı eklemek ve yönetmek için geçiş kodunu girin.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="dashboard-passcode"
                className="block text-sm font-medium text-slate-700"
              >
                {isEn ? 'Passcode' : 'Geçiş Kodu'}
              </label>
              <div className="relative">
                <input
                  id="dashboard-passcode"
                  type={showCode ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="off"
                  autoFocus
                  required
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    if (codeError) setCodeError(false);
                  }}
                  placeholder={isEn ? 'Enter passcode' : 'Geçiş kodunu girin'}
                  className={`w-full pl-4 pr-11 py-3 text-base tracking-widest rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                    codeError
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-brand-teal'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCode((prev) => !prev)}
                  aria-label={showCode ? 'Gizle' : 'Göster'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {codeError && (
                <p className="text-xs font-medium text-red-600 pt-1">
                  {isEn
                    ? 'Incorrect passcode. Please try again.'
                    : 'Geçiş kodu hatalı. Lütfen tekrar deneyin.'}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {isEn ? 'Sign In' : 'Giriş Yap'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to Website' : 'Siteye Dön'}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const previewTags = tagsText
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  // UNLOCKED DASHBOARD
  return (
    <div className="bg-transparent min-h-[80vh]">
      {/* Top Bar */}
      <section className="bg-white/55 backdrop-blur-md border-b border-[#012253]/8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
              {isEn ? 'Content Studio' : 'İçerik Yönetimi'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isEn ? 'Blog Dashboard' : 'Blog Yönetim Paneli'}
            </h1>
            <p className="text-sm text-slate-500">
              {isEn
                ? `${allPosts.length} total articles (${newCustomCount} newly added · ${editedBuiltInCount} edited)`
                : `Toplam ${allPosts.length} yazı (${newCustomCount} yeni eklendi · ${editedBuiltInCount} mevcut yazı düzenlendi)`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <span>{isEn ? 'View Blog' : 'Blogu Gör'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-navy-deep hover:bg-brand-navy text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{isEn ? 'Lock' : 'Çıkış'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: New / Edit Article Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <FilePlus2 className="w-5 h-5 text-brand-teal" />
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? isEn
                      ? 'Edit Article'
                      : 'Yazıyı Düzenle'
                    : isEn
                      ? 'Add New Blog Article'
                      : 'Yeni Blog Yazısı Ekle'}
                </h2>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  {isEn ? 'Cancel Edit' : 'Düzenlemeyi İptal Et'}
                </button>
              )}
            </div>

            {savedPost && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-900 min-w-0 flex-1">
                    <p className="font-semibold">
                      {savedPost.wasEdit
                        ? isEn
                          ? 'Changes saved!'
                          : 'Değişiklikler kaydedildi!'
                        : isEn
                          ? 'Article published!'
                          : 'Yazı yayınlandı!'}
                    </p>
                    <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                      {savedPost.post.title}
                    </p>
                    <p className="text-xs text-emerald-700 font-mono truncate mt-1">
                      /blog/{savedPost.post.slug}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-7">
                  <button
                    type="button"
                    onClick={() => navigate(`/blog/${savedPost.post.slug}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold text-white cursor-pointer"
                  >
                    <span>{isEn ? 'Open Article' : 'Yazıyı Aç'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyArticleUrl(savedPost.post.slug)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-100/50 text-xs font-semibold text-emerald-800 cursor-pointer"
                  >
                    {copiedSlug === savedPost.post.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isEn ? 'URL Copied' : 'URL Kopyalandı'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Copy URL' : 'URL Kopyala'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitPost} className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label
                  htmlFor="post-title"
                  className="block text-sm font-medium text-slate-700"
                >
                  {isEn ? 'Article Title' : 'Makale Başlığı'}{' '}
                  <span className="text-brand-teal">*</span>
                </label>
                <input
                  id="post-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    const nextTitle = e.target.value;
                    setTitle(nextTitle);
                    if (!slugManuallyEdited) {
                      setCustomSlug(slugifyTurkish(nextTitle));
                    }
                  }}
                  placeholder={
                    isEn
                      ? 'e.g. Digital Transformation Priorities for 2027'
                      : 'ör. 2027’de Sigortacılıkta Dijital Dönüşüm Öncelikleri'
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal"
                />
              </div>

              {/* Automatic Title-Matching Unique URL (Slug) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="post-slug"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600"
                  >
                    <Link2 className="w-3.5 h-3.5 text-brand-teal" />
                    <span>
                      {isEn
                        ? 'Article URL (auto-generated from title)'
                        : 'Blog URL Adresi (başlığa göre otomatik oluşur)'}
                    </span>
                  </label>
                  {slugManuallyEdited && (
                    <button
                      type="button"
                      onClick={() => {
                        setSlugManuallyEdited(false);
                        setCustomSlug(slugifyTurkish(title));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal hover:underline cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{isEn ? 'Sync with title' : 'Başlıktan yenile'}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-brand-teal overflow-hidden">
                  <span className="px-3 py-2 text-xs font-mono text-slate-500 bg-slate-100/80 border-r border-slate-200 select-none shrink-0">
                    /blog/
                  </span>
                  <input
                    id="post-slug"
                    type="text"
                    value={slugManuallyEdited ? customSlug : resolvedPreviewSlug}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      setCustomSlug(e.target.value);
                    }}
                    onBlur={() => {
                      if (slugManuallyEdited) {
                        setCustomSlug(slugifyTurkish(customSlug));
                      }
                    }}
                    placeholder="ornek-blog-basligi"
                    className="w-full px-3 py-2 text-xs font-mono text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {isEn
                    ? `Final unique URL: /blog/${resolvedPreviewSlug}`
                    : `Oluşacak benzersiz adres: /blog/${resolvedPreviewSlug}`}
                </p>
              </div>

              {/* Blog Cover Image Upload (JPEG / PNG) */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <ImagePlus className="w-4 h-4 text-brand-teal" />
                    <span>
                      {isEn
                        ? 'Blog Cover Image (JPEG / PNG)'
                        : 'Blog Kapak Görseli (JPEG / PNG)'}
                    </span>
                  </label>
                  <span className="text-xs font-medium text-slate-500">
                    {isEn ? 'Recommended: 1200 × 675 px (16:9)' : 'Önerilen: 1200 × 675 px (16:9)'}
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {coverImage ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                      <img
                        src={coverImage}
                        alt={title || 'Blog görseli ön izleme'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="text-xs text-slate-600 space-y-0.5">
                        {coverImageMeta && (
                          <p className="font-medium text-slate-800">
                            {coverImageMeta.width} × {coverImageMeta.height} px ·{' '}
                            {coverImageMeta.format} · {coverImageMeta.sizeKb} KB
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500">
                          {isEn
                            ? 'Displayed in 16:9 aspect ratio on homepage, blog list, and article header.'
                            : 'Ana sayfa, blog listesi ve yazı üst alanında 16:9 oranında gösterilir.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Replace' : 'Değiştir'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Remove' : 'Kaldır'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(true);
                    }}
                    onDragLeave={() => setIsDraggingImage(false)}
                    onDrop={handleDropImage}
                    className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer space-y-2.5 ${
                      isDraggingImage
                        ? 'border-brand-teal bg-brand-teal-light/80'
                        : 'border-slate-300 bg-slate-50/60 hover:border-brand-teal hover:bg-brand-teal-light/40'
                    }`}
                  >
                    <div className="w-11 h-11 mx-auto rounded-xl bg-white border border-slate-200 text-brand-teal flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {processingImage
                          ? isEn
                            ? 'Processing image...'
                            : 'Görsel hazırlanıyor...'
                          : isEn
                            ? 'Click to upload or drag & drop a cover image'
                            : 'Kapak görseli yüklemek için tıklayın veya sürükleyip bırakın'}
                      </p>
                      <p className="text-xs font-medium text-brand-teal">
                        {isEn
                          ? 'Recommended size: 1200 × 675 px (16:9 landscape) · Min: 800 × 450 px'
                          : 'Önerilen boyut: 1200 × 675 px (16:9 yatay) · En az: 800 × 450 px'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isEn
                          ? 'Accepted formats: JPEG (.jpg, .jpeg) or PNG (.png) · Max 5 MB'
                          : 'Kabul edilen formatlar: JPEG (.jpg, .jpeg) veya PNG (.png) · Maks. 5 MB'}
                      </p>
                    </div>
                  </div>
                )}

                {imageError && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{imageError}</span>
                  </div>
                )}

                {imageWarning && !imageError && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{imageWarning}</span>
                  </div>
                )}
              </div>

              {/* Category + Fallback Cover Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="post-category"
                    className="block text-sm font-medium text-slate-700"
                  >
                    {isEn ? 'Category' : 'Kategori'}
                  </label>
                  <select
                    id="post-category"
                    value={categoryKey}
                    onChange={(e) => setCategoryKey(e.target.value as BlogCategoryKey)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-teal"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {isEn ? opt.labelEn : opt.labelTr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="post-cover"
                    className="block text-sm font-medium text-slate-700"
                  >
                    {isEn
                      ? 'Fallback Cover Theme (if no image)'
                      : 'Yedek Kapak Teması (görsel yoksa)'}
                  </label>
                  <select
                    id="post-cover"
                    value={coverTheme}
                    onChange={(e) =>
                      setCoverTheme(e.target.value as BlogPost['coverTheme'])
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-teal"
                  >
                    {COVER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {isEn ? opt.labelEn : opt.labelTr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Spot / Excerpt */}
              <div className="space-y-1.5">
                <label
                  htmlFor="post-spot"
                  className="block text-sm font-medium text-slate-700"
                >
                  {isEn ? 'Summary / Excerpt' : 'Kısa Özet (Spot)'}{' '}
                  <span className="text-brand-teal">*</span>
                </label>
                <textarea
                  id="post-spot"
                  required
                  rows={2}
                  value={spot}
                  onChange={(e) => setSpot(e.target.value)}
                  placeholder={
                    isEn
                      ? 'A concise 1–2 sentence summary shown on blog cards.'
                      : 'Blog kartlarında görünecek 1-2 cümlelik kısa özet.'
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal resize-y"
                />
              </div>

              {/* Tags + Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="post-tags"
                    className="block text-sm font-medium text-slate-700"
                  >
                    {isEn
                      ? 'Content Tags (comma-separated)'
                      : 'İçerik Etiketleri (virgülle ayırın)'}
                  </label>
                  <input
                    id="post-tags"
                    type="text"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    placeholder={
                      isEn
                        ? 'AI, Insurance CRM, Strategy'
                        : 'Yapay Zekâ, Sigorta CRM, Strateji'
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal"
                  />
                  {previewTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {previewTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="post-reading-time"
                    className="block text-sm font-medium text-slate-700"
                  >
                    {isEn ? 'Reading Time' : 'Okuma Süresi'}
                  </label>
                  <input
                    id="post-reading-time"
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder={isEn ? 'Auto (e.g. 4 min)' : 'Otomatik (ör. 4 dk)'}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal"
                  />
                </div>
              </div>

              {/* Body Text */}
              <div className="space-y-1.5">
                <label
                  htmlFor="post-body"
                  className="block text-sm font-medium text-slate-700"
                >
                  {isEn ? 'Article Content' : 'Makale İçeriği'}{' '}
                  <span className="text-brand-teal">*</span>
                </label>
                <textarea
                  id="post-body"
                  required
                  rows={9}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Write your paragraphs here. Tip: Start a line with "## " to create a section heading for the Table of Contents.'
                      : 'Paragraflarınızı buraya yazın. İpucu: Satır başına "## " ekleyerek İçindekiler bölümünde görünecek alt başlıklar oluşturabilirsiniz.'
                  }
                  className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal resize-y leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={saving || processingImage}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-hover disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <FilePlus2 className="w-4 h-4" />
                  <span>
                    {editingId
                      ? isEn
                        ? 'Save Changes'
                        : 'Değişiklikleri Kaydet'
                      : isEn
                        ? 'Publish Article'
                        : 'Yazıyı Yayınla'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Unified All Articles Management List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-teal" />
                  <h2 className="text-base font-bold text-slate-900">
                    {isEn ? 'All Blog Articles' : 'Tüm Blog Yazıları'}
                  </h2>
                </div>
                <span className="text-xs font-semibold text-brand-teal">
                  {filteredPosts.length} / {allPosts.length}
                </span>
              </div>

              {/* Search & Source Filter */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Search by title, category, or URL...'
                        : 'Başlık, kategori veya URL ara...'
                    }
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label={isEn ? 'Clear search' : 'Aramayı temizle'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  {(
                    [
                      { key: 'all', labelTr: 'Tümü', labelEn: 'All' },
                      { key: 'builtin', labelTr: 'Mevcut Yazılar', labelEn: 'Existing' },
                      { key: 'custom', labelTr: 'Yeni Eklenen', labelEn: 'Added' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setListFilter(tab.key)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                        listFilter === tab.key
                          ? 'bg-brand-navy text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                      }`}
                    >
                      {isEn ? tab.labelEn : tab.labelTr}
                    </button>
                  ))}
                </div>
              </div>

              {filteredPosts.length === 0 ? (
                <p className="text-sm text-slate-500 leading-relaxed py-4 text-center">
                  {isEn
                    ? 'No articles match the current search or filter.'
                    : 'Aramanıza veya seçili filtreye uygun yazı bulunamadı.'}
                </p>
              ) : (
                <div className="max-h-[760px] overflow-y-auto divide-y divide-slate-100 pr-1">
                  {filteredPosts.map((post) => {
                    const isBuiltIn = isBuiltInPost(post.id);
                    const isModified = isModifiedBuiltInPost(post.id);
                    const isEditingThis = editingId === post.id;

                    return (
                      <div
                        key={post.id}
                        className={`py-3.5 first:pt-1 last:pb-0 space-y-2.5 transition-colors ${
                          isEditingThis
                            ? 'bg-brand-teal-light/40 -mx-2 px-2.5 rounded-xl border border-brand-teal/30'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {post.coverImage && (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-16 h-10 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5"
                            />
                          )}
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-medium text-brand-teal">
                                {post.categoryLabel} · {post.publishedAt}
                              </span>
                              {!isBuiltIn ? (
                                <span className="px-1.5 py-0.5 rounded bg-brand-teal-light text-[10px] font-semibold text-brand-teal">
                                  {isEn ? 'New' : 'Yeni'}
                                </span>
                              ) : isModified ? (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-[10px] font-semibold text-amber-800">
                                  {isEn ? 'Edited' : 'Düzenlendi'}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600">
                                  {isEn ? 'Existing' : 'Mevcut'}
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-[11px] font-mono text-slate-400 truncate">
                              /blog/{post.slug}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(post)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                              isEditingThis
                                ? 'bg-brand-teal text-white'
                                : 'bg-brand-teal-light hover:bg-brand-teal-soft text-brand-teal'
                            }`}
                          >
                            <Pencil className="w-3 h-3" />
                            <span>
                              {isEditingThis
                                ? isEn
                                  ? 'Editing'
                                  : 'Düzenleniyor'
                                : isEn
                                  ? 'Edit'
                                  : 'Düzenle'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-700 cursor-pointer"
                          >
                            <span>{isEn ? 'View' : 'Görüntüle'}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyArticleUrl(post.slug)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-700 cursor-pointer"
                          >
                            {copiedSlug === post.slug ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">
                                  {isEn ? 'Copied' : 'Kopyalandı'}
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>URL</span>
                              </>
                            )}
                          </button>

                          {isModified && (
                            <button
                              type="button"
                              onClick={() => handleResetBuiltIn(post.id)}
                              title={
                                isEn
                                  ? 'Revert to original content'
                                  : 'Orijinal içeriğe geri dön'
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-xs font-medium text-amber-800 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{isEn ? 'Reset' : 'Orijinale Dön'}</span>
                            </button>
                          )}

                          {confirmDeleteId === post.id ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleConfirmDelete(post.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white cursor-pointer"
                              >
                                {isEn ? 'Confirm Delete' : 'Evet, Sil'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                              >
                                {isEn ? 'Cancel' : 'Vazgeç'}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(post.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-medium text-red-700 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{isEn ? 'Delete' : 'Sil'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {deletedBuiltInPosts.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">
                    {isEn ? 'Removed Built-in Articles' : 'Kaldırılan Mevcut Yazılar'}
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    {deletedBuiltInPosts.length}
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {deletedBuiltInPosts.map((post) => (
                    <div
                      key={post.id}
                      className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                    >
                      <p className="text-xs text-slate-600 truncate">{post.title}</p>
                      <button
                        type="button"
                        onClick={() => handleResetBuiltIn(post.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-teal hover:underline shrink-0 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{isEn ? 'Restore' : 'Geri Yükle'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
