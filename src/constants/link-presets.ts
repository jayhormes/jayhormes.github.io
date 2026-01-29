import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";
import { getSiteDefaultLanguage } from "@/utils/site-language-utils";

export function getLinkPresets(lang?: string): { [key in LinkPreset]: NavBarLink } {
	const currentLang = lang || getSiteDefaultLanguage();
	const defaultLang = getSiteDefaultLanguage();
	
	// Helper function to create language-specific URLs
	const createUrl = (path: string) => {
		if (currentLang === defaultLang) {
			return path;
		}
		return `/${currentLang}${path}`;
	};

	return {
		[LinkPreset.Home]: {
			name: i18n(I18nKey.home, lang),
			url: createUrl("/"),
		},
		[LinkPreset.About]: {
			name: i18n(I18nKey.about, lang),
			url: createUrl("/about/"),
		},
		[LinkPreset.Archive]: {
			name: i18n(I18nKey.archive, lang),
			url: createUrl("/archive/"),
		},
		[LinkPreset.Gallery]: {
			name: i18n(I18nKey.gallery, lang),
			url: createUrl("/gallery/"),
		},
		[LinkPreset.Projects]: {
			name: i18n(I18nKey.projects, lang),
			url: createUrl("/projects/"),
		},
	};
}
