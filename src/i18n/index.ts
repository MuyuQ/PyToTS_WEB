// Internationalization utilities
import zh from './zh.json';
import en from './en.json';

const translations = { zh, en } as const;

type Locale = keyof typeof translations;

/**
 * Get translation for a given key path
 * Supports nested keys using dot notation (e.g., "nav.home")
 */
export function t(
  locale: Locale,
  key: string,
  replacements?: Record<string, string>
): string {
  const keys = key.split('.');
  let value: unknown = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to zh if key not found
      value = getNestedValue(translations.zh, keys);
      break;
    }
  }

  let result = typeof value === 'string' ? value : key;

  // Replace placeholders
  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      result = result.replace(`{{${placeholder}}}`, replacement);
    });
  }

  return result;
}

function getNestedValue(obj: unknown, keys: string[]): unknown {
  let value: unknown = obj;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }
  return value;
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: Locale) {
  return translations[locale];
}

/**
 * Get supported locales
 */
export function getSupportedLocales(): Locale[] {
  return Object.keys(translations) as Locale[];
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): boolean {
  return locale in translations;
}

/**
 * Get default locale
 */
export function getDefaultLocale(): Locale {
  return 'zh';
}

/**
 * Detect locale from URL path
 * Returns the detected locale and the path without the locale prefix
 */
export function detectLocaleFromPath(path: string): {
  locale: Locale;
  pathWithoutLocale: string;
} {
  const localeMatch = path.match(/^\/(zh|en)(?:\/|$)/);
  if (localeMatch) {
    const locale = localeMatch[1] as Locale;
    const pathWithoutLocale = path.replace(/^\/(zh|en)/, '') || '/';
    return { locale, pathWithoutLocale };
  }
  return { locale: getDefaultLocale(), pathWithoutLocale: path };
}
