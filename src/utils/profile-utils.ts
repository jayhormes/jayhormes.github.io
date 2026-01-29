import { profileConfig, siteConfig } from "@/config";
import type { ProfileConfig } from "@/types/config";
import { normalizeLanguageCode } from "./site-language-utils";

/**
 * Get profile configuration for a specific language with fallback
 * @param lang - Language code (e.g., 'en', 'zh-tw', 'ja')
 * @returns ProfileConfig for the specified language, with fallback to default language
 */
export function getProfileConfig(lang?: string): ProfileConfig {
	// Normalize language code (e.g., zh_TW -> zh-tw)
	const normalizedLang = lang ? normalizeLanguageCode(lang) : normalizeLanguageCode(siteConfig.lang);
	
	// Try to get profile config for the requested language
	const requestedConfig = profileConfig[normalizedLang];
	if (requestedConfig) {
		return requestedConfig;
	}
	
	// Fallback to default language
	const defaultLang = normalizeLanguageCode(siteConfig.lang);
	const defaultConfig = profileConfig[defaultLang];
	if (defaultConfig) {
		// Log warning in dev mode
		if (import.meta.env.DEV) {
			console.warn(
				`[Profile I18n] No profile config found for language "${normalizedLang}". ` +
				`Using default language "${defaultLang}". ` +
				`Consider adding profile config for "${normalizedLang}" in config.ts`
			);
		}
		return defaultConfig;
	}
	
	// Fallback to first available language
	const firstAvailableLang = Object.keys(profileConfig)[0];
	const firstConfig = firstAvailableLang ? profileConfig[firstAvailableLang] : undefined;
	if (firstConfig) {
		if (import.meta.env.DEV) {
			console.warn(
				`[Profile I18n] No profile config found for default language "${defaultLang}". ` +
				`Using first available language "${firstAvailableLang}". ` +
				`Consider adding profile config for "${defaultLang}" in config.ts`
			);
		}
		return firstConfig;
	}
	
	// This should never happen, but just in case
	throw new Error(
		"[Profile I18n] No profile configuration found. Please add at least one language in config.ts"
	);
}

/**
 * Get all available languages that have profile configuration
 * @returns Array of language codes that have profile configs
 */
export function getAvailableProfileLanguages(): string[] {
	return Object.keys(profileConfig);
}

/**
 * Check if a language has profile configuration
 * @param lang - Language code to check
 * @returns true if profile config exists for the language
 */
export function hasProfileConfig(lang: string): boolean {
	const normalizedLang = normalizeLanguageCode(lang);
	return normalizedLang in profileConfig;
}
