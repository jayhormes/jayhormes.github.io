import { getCollection } from "astro:content";
import { siteConfig } from "@/config";
import { normalizeLanguageCode } from "./site-language-utils";

/**
 * Get spec content (about, projects) by name and language
 * @param name - Content name (e.g., 'about', 'projects')
 * @param lang - Language code (e.g., 'en', 'zh-tw', 'ja')
 * @returns The content entry for the specified language, with fallback
 */
export async function getSpecByLangAndName(name: string, lang?: string) {
	const allSpecs = await getCollection("spec");
	
	// Normalize language code
	const normalizedLang = lang ? normalizeLanguageCode(lang) : normalizeLanguageCode(siteConfig.lang);
	const defaultLang = normalizeLanguageCode(siteConfig.lang);
	
	// Try to find content with language suffix first (e.g., about.zh-tw.md)
	const withLangSuffix = allSpecs.find(
		spec => spec.id === `${name}.${normalizedLang}.md`
	);
	if (withLangSuffix) {
		return withLangSuffix;
	}
	
	// Try to find content with lang in frontmatter
	const withLangInFrontmatter = allSpecs.find(
		spec => spec.id === `${name}.md` && spec.data.lang === normalizedLang
	);
	if (withLangInFrontmatter) {
		return withLangInFrontmatter;
	}
	
	// Fallback to default language
	const defaultWithSuffix = allSpecs.find(
		spec => spec.id === `${name}.${defaultLang}.md`
	);
	if (defaultWithSuffix) {
		if (import.meta.env.DEV) {
			console.warn(
				`[Spec I18n] No ${name} content found for language "${normalizedLang}". ` +
				`Using default language "${defaultLang}".`
			);
		}
		return defaultWithSuffix;
	}
	
	const defaultWithFrontmatter = allSpecs.find(
		spec => spec.id === `${name}.md` && spec.data.lang === defaultLang
	);
	if (defaultWithFrontmatter) {
		if (import.meta.env.DEV) {
			console.warn(
				`[Spec I18n] No ${name} content found for language "${normalizedLang}". ` +
				`Using default language "${defaultLang}".`
			);
		}
		return defaultWithFrontmatter;
	}
	
	// Final fallback to any file matching the name
	const anyMatch = allSpecs.find(
		spec => spec.id === `${name}.md` || spec.id.startsWith(`${name}.`)
	);
	if (anyMatch) {
		if (import.meta.env.DEV) {
			console.warn(
				`[Spec I18n] No ${name} content found for language "${normalizedLang}" or default "${defaultLang}". ` +
				`Using first available: ${anyMatch.id}`
			);
		}
		return anyMatch;
	}
	
	return null;
}

/**
 * Get all available languages for a specific spec content
 * @param name - Content name (e.g., 'about', 'projects')
 * @returns Array of language codes that have this content
 */
export async function getAvailableSpecLanguages(name: string): Promise<string[]> {
	const allSpecs = await getCollection("spec");
	const languages: string[] = [];
	
	for (const spec of allSpecs) {
		// Check if filename matches the pattern
		if (spec.id === `${name}.md`) {
			// Check frontmatter lang
			if (spec.data.lang) {
				languages.push(spec.data.lang);
			}
		} else if (spec.id.startsWith(`${name}.`) && spec.id.endsWith('.md')) {
			// Extract language from filename (e.g., about.zh-tw.md -> zh-tw)
			const match = spec.id.match(new RegExp(`${name}\\.([^.]+)\\.md`));
			if (match) {
				languages.push(match[1]);
			}
		}
	}
	
	return [...new Set(languages)]; // Remove duplicates
}
