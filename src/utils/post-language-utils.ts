import { getSiteDefaultLanguage } from "./site-language-utils";
import { multilingualSettings } from "../config";

const SUPPORTED_LANGUAGES = ["en", "zh-tw", "zh-cn", "ja", "ko", "es", "th"] as const;

function parseLanguageSuffix(value: string): {
	baseSlug: string;
	lang: string | null;
} {
	const parts = value.split(".");
	if (parts.length === 1) {
		return { baseSlug: value, lang: null };
	}

	const possibleLang = parts[parts.length - 1];
	if (SUPPORTED_LANGUAGES.includes(possibleLang as (typeof SUPPORTED_LANGUAGES)[number])) {
		return {
			baseSlug: parts.slice(0, -1).join("."),
			lang: possibleLang,
		};
	}

	return { baseSlug: value, lang: null };
}

function stripExtension(fileName: string): string {
	return fileName.replace(/\.[^.]+$/, "");
}

function getRawPostName(filePathOrId?: string): string | null {
	if (!filePathOrId) return null;
	const normalized = filePathOrId.replace(/\\/g, "/");
	const fileName = normalized.split("/").pop();
	if (!fileName) return null;
	return stripExtension(fileName);
}

/**
 * Extract language from post slug
 * Prefer original filePath / id, because Astro content slug strips dots.
 */
export function extractLanguageFromSlug(
	slug: string,
	filePathOrId?: string,
): {
	baseSlug: string;
	lang: string | null;
} {
	const rawPostName = getRawPostName(filePathOrId);
	if (rawPostName) {
		return parseLanguageSuffix(rawPostName);
	}

	return parseLanguageSuffix(slug);
}

/**
 * Get the language of a post, respecting siteConfig.lang
 */
export function getPostLanguage(
	slug: string,
	frontmatterLang?: string,
	filePathOrId?: string,
): string {
	// Priority 1: frontmatter lang field
	if (frontmatterLang) {
		return frontmatterLang;
	}

	// Priority 2: filename language suffix
	const { lang } = extractLanguageFromSlug(slug, filePathOrId);
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

export function getPostRouteInfo(
	slug: string,
	options?: {
		frontmatterLang?: string;
		filePathOrId?: string;
	},
): {
	baseSlug: string;
	lang: string;
	routeSlug: string[];
} {
	const { frontmatterLang, filePathOrId } = options ?? {};
	const { baseSlug } = extractLanguageFromSlug(slug, filePathOrId);
	const lang = getPostLanguage(slug, frontmatterLang, filePathOrId);
	const defaultLang = getSiteDefaultLanguage();

	return {
		baseSlug,
		lang,
		routeSlug: lang === defaultLang ? [baseSlug] : [lang, baseSlug],
	};
}

