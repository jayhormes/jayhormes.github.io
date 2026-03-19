import { availableLanguages, getSupportedLanguages, siteConfig, type AvailableLanguage } from "@/config";
import { getSiteDefaultLanguage, normalizeLanguageCode } from "./site-language-utils";
import { url } from "./url-utils";
import type { APIContext } from "astro";

export function isSupportedLanguageKey(lang: string): lang is AvailableLanguage {
	return lang in availableLanguages;
}

export function resolveLanguageKey(lang?: string | null): AvailableLanguage {
	if (lang && isSupportedLanguageKey(lang)) {
		return lang;
	}

	if (lang) {
		const normalized = normalizeLanguageCode(lang);
		if (isSupportedLanguageKey(normalized)) {
			return normalized;
		}
	}

	return getSiteDefaultLanguage();
}

export function getLanguageInfo(lang?: string | null) {
	const languageKey = resolveLanguageKey(lang);
	return {
		key: languageKey,
		...availableLanguages[languageKey],
	};
}

export function getLocalizedRssPath(lang?: string | null): string {
	const languageKey = resolveLanguageKey(lang);
	const defaultLang = getSiteDefaultLanguage();
	return languageKey === defaultLang ? url("/rss.xml") : url(`/${languageKey}/rss.xml`);
}

export function getDefaultOgImageUrl(site: APIContext["site"] | URL): string {
	return new URL(url(siteConfig.banner.src), site).toString();
}

export function getOgImageUrl(site: APIContext["site"] | URL, image?: string | null): string {
	if (!image || image.trim() === "") {
		return getDefaultOgImageUrl(site);
	}

	if (/^https?:\/\//.test(image)) {
		return image;
	}

	if (image.startsWith("/")) {
		return new URL(url(image), site).toString();
	}

	return getDefaultOgImageUrl(site);
}

export function getLanguageAlternates() {
	const supportedLanguages = getSupportedLanguages();
	return Object.entries(supportedLanguages).map(([lang, info]) => ({
		lang,
		bcp47: info.bcp47,
	}));
}
