export function slugifyTurkish(text: string): string {
  const map: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    İ: 'i',
    I: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
    â: 'a',
    Â: 'a',
    î: 'i',
    Î: 'i',
    û: 'u',
    Û: 'u',
  };

  return text
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’'`"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 90)
    .replace(/^-+|-+$/g, '');
}

export function ensureUniqueSlug(rawSlug: string, existingSlugs: Set<string>): string {
  const cleanBase = slugifyTurkish(rawSlug) || `yazi-${Date.now().toString().slice(-6)}`;
  if (!existingSlugs.has(cleanBase)) {
    return cleanBase;
  }

  let counter = 2;
  let candidate = `${cleanBase}-${counter}`;
  while (existingSlugs.has(candidate)) {
    counter += 1;
    candidate = `${cleanBase}-${counter}`;
  }
  return candidate;
}
