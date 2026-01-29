import { siteConfig } from "../config";
import type { SupportedLanguage } from "../config";

/**
 * Normalize language code to URL format
 * e.g., zh_TW -> zh-tw, zh_CN -> zh-cn
 */
export function normalizeLanguageCode(lang: string): string {
    const langMap: Record<string, string> = {
        'zh_TW': 'zh-tw',
        'zh_CN': 'zh-cn',
        'ja': 'ja',
        'ko': 'ko',
        'es': 'es',
        'th': 'th',
        'en': 'en'
    };
    return langMap[lang] || lang.toLowerCase().replace('_', '-');
}

/**
 * Get the default language key from siteConfig
 * Maps siteConfig.lang (like 'zh_TW') to URL key (like 'zh-tw')
 */
export function getSiteDefaultLanguage(): SupportedLanguage {
    return normalizeLanguageCode(siteConfig.lang) as SupportedLanguage;
}

/**
 * Get the default locale for Astro i18n config from siteConfig.lang
 */
export function getAstroDefaultLocale(): string {
    return getSiteDefaultLanguage();
}

/**
 * Check if a language is the site's default language
 */
export function isDefaultLanguage(lang: string): boolean {
    return lang === getSiteDefaultLanguage();
}

/**
 * Generate correct URL for language switching
 */
export function getLanguageUrl(targetLang: string, basePath: string): string {
    const defaultLang = getSiteDefaultLanguage();
    const result = targetLang === defaultLang ? basePath : `/${targetLang}${basePath}`;
    return result;
}
