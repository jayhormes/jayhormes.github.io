import { getCollection } from "astro:content";
import { getSiteDefaultLanguage } from "./site-language-utils";
import { multilingualSettings } from "../config";

/**
 * Extract language from post slug
 * Examples:
 *   "my-article" -> null (default language)
 *   "my-article.zh-tw" -> "zh-tw"
 *   "my-article.en" -> "en"
 */
export function extractLanguageFromSlug(slug: string): {
	baseSlug: string;
	lang: string | null;
} {
	const parts = slug.split(".");
	if (parts.length === 1) {
		return { baseSlug: slug, lang: null };
	}

	const possibleLang = parts[parts.length - 1];
	const supportedLangs = ["en", "zh-tw", "zh-cn", "ja", "ko", "es", "th"];

	if (supportedLangs.includes(possibleLang)) {
		return {
			baseSlug: parts.slice(0, -1).join("."),
			lang: possibleLang,
		};
	}

	return { baseSlug: slug, lang: null };
}

/**
 * Get the language of a post, respecting siteConfig.lang
 */
export function getPostLanguage(slug: string, frontmatterLang?: string): string {
	// Priority 1: frontmatter lang field
	if (frontmatterLang) {
		return frontmatterLang;
	}

	// Priority 2: filename language suffix
	const { lang } = extractLanguageFromSlug(slug);
	if (lang) {
		return lang;
	}

	// Priority 3: default language from site config
	const defaultLang = getSiteDefaultLanguage();
	
	// Warn if lang is missing and warnings are enabled
	if (multilingualSettings.warnMissingLang && import.meta.env.DEV) {
		console.warn(
			`[Multilingual] Post "${slug}" has no lang field in frontmatter or filename. ` +
			`Using default language: ${defaultLang}. ` +
			`Consider adding "lang: '${defaultLang}'" to frontmatter or using filename pattern: ${slug}.${defaultLang}.md`
		);
	}
	
	return defaultLang;
}

/**
 * Find all language versions of a post
 * Returns: { lang: slug }
 */
export async function getPostLanguageVersions(
	baseSlug: string,
): Promise<Record<string, string>> {
	const allPosts = await getCollection("posts");
	const versions: Record<string, string> = {};

	for (const post of allPosts) {
		const { baseSlug: postBaseSlug } = extractLanguageFromSlug(post.slug);

		if (postBaseSlug === baseSlug) {
			const postLang = getPostLanguage(post.slug, post.data.lang);
			versions[postLang] = post.slug;
		}
	}

	return versions;
}

/**
 * Find the best matching post for a given base slug and target language
 */
export async function findPostByLanguage(
	baseSlug: string,
	targetLang: string,
): Promise<{
	slug: string;
	isExactMatch: boolean;
	actualLang: string;
} | null> {
	const versions = await getPostLanguageVersions(baseSlug);
	const defaultLang = getSiteDefaultLanguage();

	// Exact match found
	if (versions[targetLang]) {
		return {
			slug: versions[targetLang],
			isExactMatch: true,
			actualLang: targetLang,
		};
	}

	// Fallback to default language
	if (versions[defaultLang]) {
		return {
			slug: versions[defaultLang],
			isExactMatch: false,
			actualLang: defaultLang,
		};
	}

	// Fallback to any available version
	const availableLangs = Object.keys(versions);
	if (availableLangs.length > 0) {
		const fallbackLang = availableLangs[0];
		return {
			slug: versions[fallbackLang],
			isExactMatch: false,
			actualLang: fallbackLang,
		};
	}

	return null;
}

/**
 * Check if a post has a specific language version
 */
export async function hasLanguageVersion(
	baseSlug: string,
	lang: string,
): Promise<boolean> {
	const versions = await getPostLanguageVersions(baseSlug);
	return lang in versions;
}

/**
 * Get available languages for a post
 */
export async function getAvailableLanguages(
	baseSlug: string,
): Promise<string[]> {
	const versions = await getPostLanguageVersions(baseSlug);
	return Object.keys(versions);
}
