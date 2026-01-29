import { galleryConfig } from "@/config/gallery";
import { siteConfig } from "@/config";
import type { GalleryCollection } from "@/types/config";
import { normalizeLanguageCode } from "./site-language-utils";

/**
 * Get gallery configuration for a specific language with fallback
 * @param lang - Language code (e.g., 'en', 'zh-tw', 'ja')
 * @returns Gallery config for the specified language, with fallback to default language
 */
export function getGalleryConfig(lang?: string): { collections: GalleryCollection[] } {
	// Normalize language code (e.g., zh_TW -> zh-tw)
	const normalizedLang = lang ? normalizeLanguageCode(lang) : normalizeLanguageCode(siteConfig.lang);
	
	// Try to get gallery config for the requested language
	const requestedConfig = galleryConfig[normalizedLang];
	if (requestedConfig) {
		return requestedConfig;
	}
	
	// Fallback to default language
	const defaultLang = normalizeLanguageCode(siteConfig.lang);
	const defaultConfig = galleryConfig[defaultLang];
	if (defaultConfig) {
		// Log warning in dev mode
		if (import.meta.env.DEV) {
			console.warn(
				`[Gallery I18n] No gallery config found for language "${normalizedLang}". ` +
				`Using default language "${defaultLang}". ` +
				`Consider adding gallery config for "${normalizedLang}" in config/gallery.ts`
			);
		}
		return defaultConfig;
	}
	
	// Fallback to first available language
	const firstAvailableLang = Object.keys(galleryConfig)[0];
	const firstConfig = firstAvailableLang ? galleryConfig[firstAvailableLang] : undefined;
	if (firstConfig) {
		if (import.meta.env.DEV) {
			console.warn(
				`[Gallery I18n] No gallery config found for default language "${defaultLang}". ` +
				`Using first available language "${firstAvailableLang}". ` +
				`Consider adding gallery config for "${defaultLang}" in config/gallery.ts`
			);
		}
		return firstConfig;
	}
	
	// Final fallback - return empty collections
	if (import.meta.env.DEV) {
		console.warn(
			"[Gallery I18n] No gallery configuration found. Returning empty collections."
		);
	}
	return { collections: [] };
}

/**
 * Get all available languages that have gallery configuration
 * @returns Array of language codes that have gallery configs
 */
export function getAvailableGalleryLanguages(): string[] {
	return Object.keys(galleryConfig);
}

/**
 * Check if a language has gallery configuration
 * @param lang - Language code to check
 * @returns true if gallery config exists for the language
 */
export function hasGalleryConfig(lang: string): boolean {
	const normalizedLang = normalizeLanguageCode(lang);
	return normalizedLang in galleryConfig;
}

/**
 * Get a specific collection by tags for a language
 * @param tags - Tags to filter by
 * @param lang - Language code
 * @returns Matching collections
 */
export function getCollectionsByTags(tags: string[], lang?: string): GalleryCollection[] {
	const config = getGalleryConfig(lang);
	return config.collections.filter(collection => 
		tags.some(tag => collection.tags.includes(tag))
	);
}
