import { siteConfig } from "../config";
import { getLanguageFromPath } from "../utils/language-utils";
import type I18nKey from "./i18nKey";
import { en } from "./languages/en";
import { es } from "./languages/es";
import { ja } from "./languages/ja";
import { ko } from "./languages/ko";
import { th } from "./languages/th";
import { zh_CN } from "./languages/zh_CN";
import { zh_TW } from "./languages/zh_TW";

export type Translation = {
	[K in I18nKey]: string;
};

const defaultTranslation = en;

const map: { [key: string]: Translation } = {
	es: es,
	en: en,
	en_us: en,
	en_gb: en,
	en_au: en,
	zh_cn: zh_CN,
	"zh-cn": zh_CN, // Map URL route 'zh-cn' to zh_CN translation
	zh_tw: zh_TW,
	"zh-tw": zh_TW, // Map URL route 'zh-tw' to zh_TW translation
	ja: ja,
	ja_jp: ja,
	ko: ko,
	ko_kr: ko,
	th: th,
	th_th: th,
};

export function getTranslation(lang: string): Translation {
	return map[lang.toLowerCase()] || defaultTranslation;
}

export function i18n(key: I18nKey, lang?: string): string {
	// If lang is provided, use it directly
	if (lang) {
		return getTranslation(lang)[key];
	}
	
	// Try to get language from current path
	let currentLang = null;
	if (typeof window !== 'undefined') {
		currentLang = getLanguageFromPath(window.location.pathname);
		
		// Special case: if we're on root path and siteConfig is not 'en', 
		// use the site's configured language instead of defaulting to 'en'
		if (window.location.pathname === '/' && siteConfig.lang !== 'en') {
			// Convert siteConfig lang format to URL format
			const langMap: Record<string, string> = {
				'zh_TW': 'zh-tw',
				'zh_CN': 'zh-cn',
				'ja': 'ja',
				'ko': 'ko',
				'es': 'es',
				'th': 'th'
			};
			currentLang = langMap[siteConfig.lang] || currentLang;
		}
	} else {
		// Server-side: use siteConfig and convert to URL format
		const langMap: Record<string, string> = {
			'zh_TW': 'zh-tw',
			'zh_CN': 'zh-cn',
			'ja': 'ja',
			'ko': 'ko',
			'es': 'es',
			'th': 'th',
			'en': 'en'
		};
		currentLang = langMap[siteConfig.lang] || 'en';
	}
	
	return getTranslation(currentLang)[key];
}
