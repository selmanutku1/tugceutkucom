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
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FilePlus2,
  FileText,
  Heading1,
  ImagePlus,
  Link2,
  Lock,
  LogOut,
  Pencil,
  RefreshCw,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { BlogCategoryKey, BlogPost } from '../types';
import {
  ensureUniqueSlug,
  formatTurkishDateFromIso,
  getTodayIso,
  sectionsToBodyText,
  slugifyTurkish,
  useBlog,
} from '../context/BlogContext';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import BrandLogo from '../components/BrandLogo';
import RichTextToolbarEditor, {
  expandMediaTokensInBody,
  extractInlineDataImagesToTokens,
  type InlineMediaEntry,
} from '../components/RichTextToolbarEditor';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_FIRESTORE_IMAGE_CHARS = 550_000; // Fits safely inside Firestore 1 MB document limit
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
          : canvas.toDataURL('image/jpeg', 0.84);

        if (outputDataUrl.length > MAX_FIRESTORE_IMAGE_CHARS) {
          const jpegCanvas = document.createElement('canvas');
          jpegCanvas.width = targetW;
          jpegCanvas.height = targetH;
          const jCtx = jpegCanvas.getContext('2d');
          if (jCtx) {
            jCtx.fillStyle = '#ffffff';
            jCtx.fillRect(0, 0, targetW, targetH);
            jCtx.drawImage(img, 0, 0, targetW, targetH);
            outputDataUrl = jpegCanvas.toDataURL('image/jpeg', 0.8);
            if (outputDataUrl.length > MAX_FIRESTORE_IMAGE_CHARS) {
              outputDataUrl = jpegCanvas.toDataURL('image/jpeg', 0.68);
            }
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
    isAdmin,
    unsyncedLocalCount,
    verifyAdminPasscode,
    signOutAdmin,
    syncPendingLocalPosts,
    getPosts,
    getTrashedPosts,
    getFeaturedPost,
    isBuiltInPost,
    isModifiedBuiltInPost,
    addPost,
    updatePost,
    deletePost,
    restorePost,
    permanentlyDeletePost,
    resetBuiltInPost,
    setFeaturedPost,
  } = useBlog();

  // Auth Gate State
  const [passcodeVal, setPasscodeVal] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [h1Title, setH1Title] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [publishedIso, setPublishedIso] = useState<string>(() => getTodayIso());
  const [scheduled, setScheduled] = useState(false);
  const [isFeaturedSelected, setIsFeaturedSelected] = useState(false);
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
  const [bodyText, setBodyText] = useState('');
  const [inlineMedia, setInlineMedia] = useState<InlineMediaEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [featuredUpdatingId, setFeaturedUpdatingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedPost, setSavedPost] = useState<{ post: BlogPost; wasEdit: boolean } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmPermanentDeleteId, setConfirmPermanentDeleteId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [listFilter, setListFilter] = useState<'all' | 'builtin' | 'custom' | 'scheduled'>('all');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const todayIso = getTodayIso();
  const allPosts = getPosts(lang, { includeScheduled: true });
  const publicPosts = getPosts(lang, { includeScheduled: false });
  const allTrPosts = getPosts('tr', { includeScheduled: true });
  const trashedPosts = getTrashedPosts(lang);
  const activeFeaturedPost = getFeaturedPost(lang);

  const newCustomCount = useMemo(
    () => customPosts.filter((p) => !p.trashed && !isBuiltInPost(p.id)).length,
    [customPosts, isBuiltInPost]
  );

  const editedBuiltInCount = useMemo(
    () => customPosts.filter((p) => !p.trashed && isBuiltInPost(p.id)).length,
    [customPosts, isBuiltInPost]
  );

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPosts.filter((post) => {
      if (listFilter === 'builtin' && !isBuiltInPost(post.id)) return false;
      if (listFilter === 'custom' && isBuiltInPost(post.id)) return false;
      if (listFilter === 'scheduled' && !(post.scheduled && post.publishedIso > todayIso)) {
        return false;
      }
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        (post.h1Title || '').toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.categoryLabel.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [allPosts, isBuiltInPost, listFilter, searchQuery, todayIso]);

  // Compute unique preview slug from H1 Title (NOT Makale Başlığı) unless manually overridden
  const existingSlugsForCheck = useMemo(() => {
    return new Set(
      allTrPosts.filter((p) => p.id !== editingId).map((p) => p.slug)
    );
  }, [allTrPosts, editingId]);

  const resolvedPreviewSlug = useMemo(() => {
    const source = slugManuallyEdited && customSlug.trim() ? customSlug : h1Title;
    if (!source.trim()) return 'h1-basligina-gore-olusacak';
    return ensureUniqueSlug(source, existingSlugsForCheck);
  }, [slugManuallyEdited, customSlug, h1Title, existingSlugsForCheck]);

  const handlePasscodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    const ok = verifyAdminPasscode(passcodeVal);
    if (!ok) {
      setPasscodeError(
        isEn
          ? 'Incorrect passcode. Please enter 1411.'
          : 'Geçiş kodu hatalı. Lütfen 1411 giriniz.'
      );
    } else {
      setPasscodeVal('');
    }
  };

  const handleLogout = () => {
    setPasscodeError(null);
    signOutAdmin();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setH1Title('');
    setCustomSlug('');
    setSlugManuallyEdited(false);
    setPublishedIso(getTodayIso());
    setScheduled(false);
    setIsFeaturedSelected(false);
    setSpot('');
    setCategoryKey('dijital-donusum');
    setTagsText('');
    setCoverTheme('transformation');
    setCoverImage('');
    setCoverImageMeta(undefined);
    setImageError(null);
    setImageWarning(null);
    setBodyText('');
    setInlineMedia([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartEdit = (post: BlogPost) => {
    const rawBody = sectionsToBodyText(post.sections);
    const { tokenizedBody, mediaEntries } = extractInlineDataImagesToTokens(rawBody);

    setEditingId(post.id);
    setTitle(post.title);
    setH1Title(post.h1Title || post.title);
    setCustomSlug(post.slug);
    setSlugManuallyEdited(true);
    setPublishedIso(post.publishedIso || getTodayIso());
    setScheduled(Boolean(post.scheduled));
    setIsFeaturedSelected(activeFeaturedPost?.id === post.id);
    setSpot(post.spot);
    setCategoryKey(post.categoryKey);
    setTagsText(post.tags.join(', '));
    setCoverTheme(post.coverTheme);
    setCoverImage(post.coverImage || '');
    setCoverImageMeta(post.coverImageMeta);
    setImageError(null);
    setImageWarning(null);
    setBodyText(tokenizedBody);
    setInlineMedia(mediaEntries);
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
      typeof window !== 'undefined' ? window.location.origin : 'https://www.tugceutku.com';
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
    if (!title.trim() || !h1Title.trim() || !spot.trim() || !bodyText.trim() || saving) {
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const parsedTags = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const expandedBody = expandMediaTokensInBody(bodyText.trim(), inlineMedia);

      const input = {
        title: title.trim(),
        h1Title: h1Title.trim(),
        slug: slugManuallyEdited && customSlug.trim() ? customSlug.trim() : h1Title.trim(),
        spot: spot.trim(),
        categoryKey,
        tags: parsedTags,
        coverTheme,
        coverImage: coverImage || undefined,
        coverImageMeta: coverImage ? coverImageMeta : undefined,
        publishedIso: publishedIso || getTodayIso(),
        scheduled,
        featured: isFeaturedSelected,
        bodyText: expandedBody,
      };

      const wasEdit = Boolean(editingId);
      const result = editingId
        ? await updatePost(editingId, input)
        : await addPost(input);

      setSavedPost({ post: result, wasEdit });
      resetForm();
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : isEn
            ? 'Could not save the article to the database.'
            : 'Yazı kalıcı veritabanına kaydedilemedi. Lütfen tekrar deneyin.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangeFeaturedPost = async (postId: string) => {
    if (!postId) return;
    setFeaturedUpdatingId(postId);
    setSaveError(null);
    try {
      await setFeaturedPost(postId);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : isEn
            ? 'Could not update featured article.'
            : 'Öne çıkan yazı değiştirilemedi.'
      );
    } finally {
      setFeaturedUpdatingId(null);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    setSaveError(null);
    try {
      await deletePost(id);
      setConfirmDeleteId(null);
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : isEn
            ? 'Could not move article to trash.'
            : 'Yazı çöp kutusuna taşınamadı. Lütfen tekrar deneyin.'
      );
    }
  };

  const handleRestorePost = async (id: string) => {
    setSaveError(null);
    try {
      await restorePost(id);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : isEn
            ? 'Could not restore the article.'
            : 'Yazı geri yüklenemedi.'
      );
    }
  };

  const handlePermanentDelete = async (id: string) => {
    setSaveError(null);
    try {
      await permanentlyDeletePost(id);
      setConfirmPermanentDeleteId(null);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : isEn
            ? 'Could not permanently delete the article.'
            : 'Yazı kalıcı olarak silinemedi.'
      );
    }
  };

  const handleResetBuiltIn = async (id: string) => {
    setSaveError(null);
    try {
      await resetBuiltInPost(id);
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : isEn
            ? 'Could not reset the article.'
            : 'Yazı varsayılana sıfırlanamadı.'
      );
    }
  };

  // ADMIN AUTH GATE SCREEN (PASSCODE 1411)
  if (!isAdmin) {
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
                {isEn ? 'Blog Dashboard Access' : 'Blog Yönetim Paneli'}
              </h1>
              <p className="text-sm text-slate-500">
                {isEn
                  ? 'Enter your admin passcode to manage and publish articles.'
                  : 'Yazıları yönetmek ve yayınlamak için yönetici şifresini girin.'}
              </p>
            </div>
          </div>

          {passcodeError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              {passcodeError}
            </div>
          )}

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {isEn ? 'Admin Passcode' : 'Yönetici Şifresi'}
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={passcodeVal}
                onChange={(e) => setPasscodeVal(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 text-sm outline-none tracking-widest text-center"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {isEn ? 'Unlock Dashboard' : 'Paneli Aç'}
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

  const isFutureScheduled = scheduled && publishedIso > todayIso;

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
                ? `${allPosts.length} active articles (${newCustomCount} newly added · ${editedBuiltInCount} edited · ${trashedPosts.length} in trash)`
                : `Toplam ${allPosts.length} aktif yazı (${newCustomCount} yeni eklendi · ${editedBuiltInCount} mevcut yazı düzenlendi · ${trashedPosts.length} çöp kutusunda)`}
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

            {saveError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-2.5 text-sm text-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>{saveError}</div>
              </div>
            )}

            {unsyncedLocalCount > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
                <span>
                  {isEn
                    ? `${unsyncedLocalCount} browser-saved article(s) waiting to sync to database.`
                    : `Tarayıcı önbelleğinde kalıcı veritabanına aktarılmayı bekleyen ${unsyncedLocalCount} yazı var.`}
                </span>
                <button
                  type="button"
                  onClick={() => void syncPendingLocalPosts()}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold cursor-pointer"
                >
                  {isEn ? 'Sync Now' : 'Şimdi Aktar'}
                </button>
              </div>
            )}

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
                        : savedPost.post.scheduled && savedPost.post.publishedIso > todayIso
                          ? isEn
                            ? 'Scheduled article saved!'
                            : 'Zamanlı yazı kaydedildi!'
                          : isEn
                            ? 'Article published!'
                            : 'Yazı yayınlandı!'}
                    </p>
                    <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                      {savedPost.post.h1Title || savedPost.post.title}
                    </p>
                    <p className="text-xs text-emerald-700 font-mono truncate mt-1">
                      /blog/{savedPost.post.slug} · {savedPost.post.publishedAt}
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
              {/* 1. Article Display Title (Makale Başlığı — does NOT alter Blog URL) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="post-title"
                  className="block text-sm font-medium text-slate-700"
                >
                  {isEn ? 'Article Title (Card & SEO Title)' : 'Makale Başlığı (Kart & Meta Başlık)'}{' '}
                  <span className="text-brand-teal">*</span>
                </label>
                <input
                  id="post-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    isEn
                      ? 'e.g. Digital Transformation Priorities for 2027'
                      : 'ör. 2027’de Sigortacılıkta Dijital Dönüşüm Öncelikleri'
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal"
                />
              </div>

              {/* 2. H1 Heading right under Article Title (URL source) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="post-h1-title"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700"
                >
                  <Heading1 className="w-4 h-4 text-brand-teal" />
                  <span>
                    {isEn
                      ? 'H1 Heading (Main Page H1 & Blog URL Source)'
                      : 'H1 Başlığı (Sayfa Ana Başlığı & URL Kaynağı)'}
                  </span>{' '}
                  <span className="text-brand-teal">*</span>
                </label>
                <input
                  id="post-h1-title"
                  type="text"
                  required
                  value={h1Title}
                  onChange={(e) => {
                    const nextH1 = e.target.value;
                    setH1Title(nextH1);
                    if (!slugManuallyEdited) {
                      setCustomSlug(slugifyTurkish(nextH1));
                    }
                  }}
                  placeholder={
                    isEn
                      ? 'e.g. How Insurance Companies Structure Digital Transformation'
                      : 'ör. Sigorta Şirketleri Dijital Dönüşümü Nasıl Kurgulamalı?'
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-teal"
                />
                <p className="text-[11px] text-slate-500">
                  {isEn
                    ? 'Rendered as the semantic <h1> on the article page and used to auto-generate the Blog URL.'
                    : 'Yazı detay sayfasında tek ana <h1> başlığı olarak görünür ve Blog URL adresi bu alandan otomatik oluşturulur.'}
                </p>
              </div>

              {/* 3. H1-Driven Editable Unique URL (Slug) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="post-slug"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600"
                  >
                    <Link2 className="w-3.5 h-3.5 text-brand-teal" />
                    <span>
                      {isEn
                        ? 'Blog URL (auto-generated from H1 · editable)'
                        : 'Blog URL Adresi (H1 başlığından oluşur · düzenlenebilir)'}
                    </span>
                  </label>
                  {slugManuallyEdited && (
                    <button
                      type="button"
                      onClick={() => {
                        setSlugManuallyEdited(false);
                        setCustomSlug(slugifyTurkish(h1Title));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal hover:underline cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{isEn ? 'Sync with H1' : 'H1 başlığından yenile'}</span>
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
                    placeholder="h1-basligina-uygun-url"
                    className="w-full px-3 py-2 text-xs font-mono text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {isEn
                    ? `Final unique URL: /blog/${resolvedPreviewSlug}`
                    : `Oluşacak benzersiz adres: /blog/${resolvedPreviewSlug}`}
                </p>
              </div>

              {/* 4. Custom Publish Date (Past / Future) & Scheduling + Featured Toggle */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="post-date"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700"
                    >
                      <Calendar className="w-4 h-4 text-brand-teal" />
                      <span>{isEn ? 'Publish Date' : 'Yayın Tarihi'}</span>
                    </label>
                    <input
                      id="post-date"
                      type="date"
                      value={publishedIso}
                      onChange={(e) => setPublishedIso(e.target.value || getTodayIso())}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-brand-teal"
                    />
                    <p className="text-[11px] text-slate-500">
                      {isEn ? 'Formatted date:' : 'Görünecek tarih:'}{' '}
                      <strong className="text-slate-700">
                        {formatTurkishDateFromIso(publishedIso)}
                      </strong>
                    </p>
                  </div>

                  <div className="space-y-2.5 sm:pt-6">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={scheduled}
                        onChange={(e) => setScheduled(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-teal focus:ring-brand-teal cursor-pointer"
                      />
                      <span className="text-xs text-slate-700 leading-snug">
                        <span className="font-semibold block">
                          {isEn ? 'Schedule for future date' : 'Zamanlı Yayın (tarihi gelince aç)'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {isEn
                            ? 'Hide from visitors until selected date arrives.'
                            : 'İşaretlenirse seçilen tarihe kadar sitede gizli kalır; işaretlenmezse ileri/geri tarihle hemen yayınlanır.'}
                        </span>
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFeaturedSelected}
                        onChange={(e) => setIsFeaturedSelected(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-xs text-slate-700 leading-snug">
                        <span className="font-semibold block">
                          {isEn ? 'Set as Featured Blog Post' : 'Öne Çıkan Blog Yazısı Yap'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {isEn
                            ? 'Pin this article in the featured hero card on /blog.'
                            : 'Blog sayfasının üst kısmındaki büyük öne çıkan kartta gösterilir.'}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                {isFutureScheduled && (
                  <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-2 text-xs text-indigo-800">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                      {isEn
                        ? `This post is scheduled for ${formatTurkishDateFromIso(publishedIso)} and will stay hidden publicly until that date.`
                        : `Bu yazı ${formatTurkishDateFromIso(publishedIso)} tarihine zamanlandı; o tarih gelene kadar ziyaretçilere gizli kalacaktır.`}
                    </span>
                  </div>
                )}
              </div>

              {/* 5. Blog Cover Image Upload (JPEG / PNG) */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <ImagePlus className="w-4 h-4 text-brand-teal" />
                    <span>
                      {isEn
                        ? 'Blog Cover Image (JPEG / PNG · Used for Social Share)'
                        : 'Blog Kapak Görseli (JPEG / PNG · Sosyal Medya Paylaşımında Görünür)'}
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
                        alt={h1Title || title || 'Blog görseli ön izleme'}
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
                            ? 'Displayed on cards, article hero, and LinkedIn / X / WhatsApp link previews.'
                            : 'Kartlarda, yazı detayında ve LinkedIn / X / WhatsApp paylaşımlarında bu görsel gösterilir.'}
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

              {/* Tags */}
              <div className="space-y-1.5">
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

              {/* Rich Article Content Editor */}
              <div className="space-y-1.5">
                <label
                  htmlFor="post-body"
                  className="block text-sm font-medium text-slate-700"
                >
                  {isEn ? 'Article Content' : 'Makale İçeriği'}{' '}
                  <span className="text-brand-teal">*</span>
                </label>
                <RichTextToolbarEditor
                  value={bodyText}
                  onChange={setBodyText}
                  mediaEntries={inlineMedia}
                  onMediaEntriesChange={setInlineMedia}
                  h1Title={h1Title}
                  fallbackTitle={title}
                  isEn={isEn}
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
                      : isFutureScheduled
                        ? isEn
                          ? 'Save Scheduled Article'
                          : 'Zamanlı Yazıyı Kaydet'
                        : isEn
                          ? 'Publish Article'
                          : 'Yazıyı Yayınla'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Featured Blog Switcher + All Articles Management + Trash Recovery */}
          <div className="lg:col-span-5 space-y-6">
            {/* Featured Blog Quick Selector */}
            <div className="bg-white rounded-2xl border border-amber-200/80 p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <h2 className="text-sm font-bold text-slate-900">
                    {isEn ? 'Featured Blog Article' : 'Öne Çıkan Blog Yazısı'}
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[11px] font-semibold text-amber-700">
                  {isEn ? 'Pinned' : 'Sabit'}
                </span>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="featured-post-select"
                  className="block text-xs text-slate-500"
                >
                  {isEn
                    ? 'Choose which published article appears in the featured banner on /blog:'
                    : 'Blog sayfasının üstündeki öne çıkan alanda gösterilecek yazıyı seçin:'}
                </label>
                <select
                  id="featured-post-select"
                  value={activeFeaturedPost?.id || ''}
                  disabled={Boolean(featuredUpdatingId) || publicPosts.length === 0}
                  onChange={(e) => void handleChangeFeaturedPost(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:border-brand-teal"
                >
                  {publicPosts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.h1Title?.trim() || p.title} ({p.publishedAt})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Unified All Articles Management List */}
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
                        ? 'Search by title, H1, category, or URL...'
                        : 'Başlık, H1, kategori veya URL ara...'
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

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {(
                    [
                      { key: 'all', labelTr: 'Tümü', labelEn: 'All' },
                      { key: 'builtin', labelTr: 'Mevcut Yazılar', labelEn: 'Existing' },
                      { key: 'custom', labelTr: 'Yeni Eklenen', labelEn: 'Added' },
                      { key: 'scheduled', labelTr: 'Zamanlı', labelEn: 'Scheduled' },
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
                <div className="max-h-[700px] overflow-y-auto divide-y divide-slate-100 pr-1">
                  {filteredPosts.map((post) => {
                    const isBuiltIn = isBuiltInPost(post.id);
                    const isModified = isModifiedBuiltInPost(post.id);
                    const isEditingThis = editingId === post.id;
                    const isCurrentlyFeatured = activeFeaturedPost?.id === post.id;
                    const isScheduledHidden = Boolean(
                      post.scheduled && post.publishedIso > todayIso
                    );

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
                              alt={post.h1Title?.trim() || post.title}
                              className="w-16 h-10 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5"
                            />
                          )}
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-medium text-brand-teal">
                                {post.categoryLabel} · {post.publishedAt}
                              </span>
                              {isCurrentlyFeatured && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-[10px] font-bold text-amber-800">
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                                  <span>{isEn ? 'Featured' : 'Öne Çıkan'}</span>
                                </span>
                              )}
                              {isScheduledHidden && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-100 text-[10px] font-semibold text-indigo-800">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{isEn ? 'Scheduled' : 'Zamanlandı'}</span>
                                </span>
                              )}
                              {!isBuiltIn ? (
                                <span className="px-1.5 py-0.5 rounded bg-brand-teal-light text-[10px] font-semibold text-brand-teal">
                                  {isEn ? 'New' : 'Yeni'}
                                </span>
                              ) : isModified ? (
                                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-semibold text-amber-800">
                                  {isEn ? 'Edited' : 'Düzenlendi'}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600">
                                  {isEn ? 'Existing' : 'Mevcut'}
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                              {post.h1Title?.trim() || post.title}
                            </h3>
                            {post.h1Title?.trim() && post.h1Title.trim() !== post.title.trim() && (
                              <p className="text-[11px] text-slate-500 truncate">
                                Title: {post.title}
                              </p>
                            )}
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

                          {!isScheduledHidden && (
                            <button
                              type="button"
                              disabled={isCurrentlyFeatured || featuredUpdatingId === post.id}
                              onClick={() => void handleChangeFeaturedPost(post.id)}
                              title={
                                isCurrentlyFeatured
                                  ? isEn
                                    ? 'Currently featured article'
                                    : 'Şu an öne çıkan yazı'
                                  : isEn
                                    ? 'Feature this article'
                                    : 'Bu yazıyı öne çıkar'
                              }
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                isCurrentlyFeatured
                                  ? 'bg-amber-100 text-amber-800 cursor-default'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer'
                              }`}
                            >
                              <Star
                                className={`w-3 h-3 ${
                                  isCurrentlyFeatured ? 'fill-amber-500 text-amber-600' : ''
                                }`}
                              />
                              <span>
                                {isCurrentlyFeatured
                                  ? isEn
                                    ? 'Featured'
                                    : 'Öne Çıkan'
                                  : isEn
                                    ? 'Feature'
                                    : 'Öne Çıkar'}
                              </span>
                            </button>
                          )}

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
                                {isEn ? 'Move to Trash' : 'Çöpe Taşı'}
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

            {/* Trash / Recovery Bin (ALL Deleted Articles: Custom + Built-in) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-800">
                    {isEn ? 'Trash & Recovery Bin' : 'Çöp Kutusu / Silinen Yazılar'}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                  {trashedPosts.length}
                </span>
              </div>

              {trashedPosts.length === 0 ? (
                <p className="text-xs text-slate-500 leading-relaxed py-2">
                  {isEn
                    ? 'Deleted articles are stored here so you can restore them anytime.'
                    : 'Sildiğiniz yazılar doğrudan kaybolmaz; istediğiniz zaman buradan geri alabilirsiniz.'}
                </p>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto pr-1">
                  {trashedPosts.map((post) => {
                    const isBuiltIn = isBuiltInPost(post.id);
                    const deletedDateLabel = post.trashedAt
                      ? formatTurkishDateFromIso(post.trashedAt.slice(0, 10))
                      : post.publishedAt;

                    return (
                      <div key={post.id} className="py-3 first:pt-1 last:pb-0 space-y-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {isBuiltIn
                                ? isEn
                                  ? 'Built-in'
                                  : 'Mevcut Yazı'
                                : isEn
                                  ? 'Custom'
                                  : 'Yeni Eklenen'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {deletedDateLabel}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {post.h1Title?.trim() || post.title}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400 truncate">
                            /blog/{post.slug}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void handleRestorePost(post.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-teal-light hover:bg-brand-teal-soft text-xs font-semibold text-brand-teal cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{isEn ? 'Restore' : 'Geri Al'}</span>
                          </button>

                          {!isBuiltIn && (
                            confirmPermanentDeleteId === post.id ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => void handlePermanentDelete(post.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white cursor-pointer"
                                >
                                  {isEn ? 'Delete Forever' : 'Kalıcı Sil'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmPermanentDeleteId(null)}
                                  className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                                >
                                  {isEn ? 'Cancel' : 'Vazgeç'}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmPermanentDeleteId(post.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>{isEn ? 'Remove Permanently' : 'Kalıcı Sil'}</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
