import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

// Export gallery config for multi-language support
export { galleryConfig } from "./config/gallery";

// All available languages in the i18n system
// code: internal route key / config key
// bcp47: HTML / structured data locale
// ogLocale: Open Graph locale
export const availableLanguages = {
	en: { code: "en", bcp47: "en", ogLocale: "en_US", name: "English", flag: "🇺🇸" },
	"zh-tw": { code: "zh-tw", bcp47: "zh-TW", ogLocale: "zh_TW", name: "正體中文", flag: "🇹🇼" },
	"zh-cn": { code: "zh-cn", bcp47: "zh-CN", ogLocale: "zh_CN", name: "简体中文", flag: "🇨🇳" },
	ja: { code: "ja", bcp47: "ja", ogLocale: "ja_JP", name: "日本語", flag: "🇯🇵" },
	ko: { code: "ko", bcp47: "ko", ogLocale: "ko_KR", name: "한국어", flag: "🇰🇷" },
	es: { code: "es", bcp47: "es", ogLocale: "es_ES", name: "Español", flag: "🇪🇸" },
	th: { code: "th", bcp47: "th", ogLocale: "th_TH", name: "ไทย", flag: "🇹🇭" },
} as const;

export type AvailableLanguage = keyof typeof availableLanguages;

// User-configurable languages - modify this array to enable/disable languages
export const enabledLanguages: AvailableLanguage[] = ["en", "zh-tw", "ja"];

// Multilingual post settings
export const multilingualSettings = {
	// Behavior for posts without lang field in frontmatter
	// 'default': Use siteConfig.lang as default (recommended for backward compatibility)
	// 'strict': Require lang field in all posts (shows warning in dev mode)
	legacyBehavior: "default" as "default" | "strict",

	// Show warning in console for posts without lang field
	warnMissingLang: true,
};

// Helper function to get supported languages based on user configuration
export const getSupportedLanguages = () => {
	return Object.fromEntries(
		enabledLanguages.map((lang) => [lang, availableLanguages[lang]]),
	) as Record<
		AvailableLanguage,
		(typeof availableLanguages)[AvailableLanguage]
	>;
};

export type SupportedLanguage = (typeof enabledLanguages)[number];

export const siteConfig: SiteConfig = {
	title: "JayHormes",
	subtitle: "Code, Create, Immerse",
	lang: "en", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 0, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "/site-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
		typewriter: {
			enable: true,
			texts: [
				"Stay curious. Keep building.",
				"Make something people want.",
				'console.log("Hello, World!").',
				"404: Sleep not found.",
			],
			speed: 100, // Typing speed in milliseconds
			delay: 2000, // Delay between texts in milliseconds
			fontSize: "3rem",
			fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
			fontWeight: "700", // (100-900 or normal, bold)
			color: "#ffffffff",
			cursorColor: "#ffffffff",
			textAlign: "center",
		},
	},
	pages: {
		archive: {
			src: "/site-banner-light.png", // Custom banner for Archive page - you can change this to any image path
			position: "center",
		},
		gallery: {
			src: "/site-banner-light.png", // Custom banner for Gallery page - you can change this to any image path
			position: "center",
		},
		projects: {
			src: "/site-banner-light.png", // Custom banner for Projects page - you can change this to any image path
			position: "center",
		},
		about: {
			src: "/site-banner-light.png", // Custom banner for About page - you can change this to any image path
			position: "center",
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.Gallery,
		LinkPreset.Projects,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/jayhormes", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

// Multilingual profile configuration
// You can configure different profile information for each language
// If a language is not configured, it will fall back to the default language (siteConfig.lang)
export const profileConfig: Record<string, ProfileConfig> = {
	// English (default)
	en: {
		avatar: "assets/images/avatar.png",
		name: "Jay Hormes",
		bio: "Code, Create, Immerse",
		links: [
			{
				name: "X (Twitter)",
				icon: "fa6-brands:x-twitter",
				url: "https://twitter.com",
			},
			{
				name: "GitHub",
				icon: "fa6-brands:github",
				url: "https://github.com/jayhormes",
			},
		],
		about: {
			avatar: "assets/images/avatar.png",
			title: "Jay Hormes",
			subtitle: "Code, Create, Immerse",
			enableProfessionalMode: true,
			badge: {
				enable: true,
				icon: "fa6-solid:briefcase",
			},
		},
	},
	// Traditional Chinese
	"zh-tw": {
		avatar: "assets/images/avatar.png",
		name: "Jay Hormes",
		bio: "Code, Create, Immerse",
		links: [
			{
				name: "X (Twitter)",
				icon: "fa6-brands:x-twitter",
				url: "https://twitter.com",
			},
			{
				name: "GitHub",
				icon: "fa6-brands:github",
				url: "https://github.com/jayhormes",
			},
		],
		about: {
			avatar: "assets/images/avatar.png",
			title: "Jay Hormes",
			subtitle: "Code, Create, Immerse",
			enableProfessionalMode: true,
			badge: {
				enable: true,
				icon: "fa6-solid:briefcase",
			},
		},
	},
	// Japanese
	ja: {
		avatar: "assets/images/avatar.png",
		name: "Jay Hormes",
		bio: "Code, Create, Immerse",
		links: [
			{
				name: "X (ツイッター)",
				icon: "fa6-brands:x-twitter",
				url: "https://twitter.com",
			},
			{
				name: "GitHub",
				icon: "fa6-brands:github",
				url: "https://github.com/jayhormes",
			},
		],
		about: {
			avatar: "assets/images/avatar.png",
			title: "Jay Hormes",
			subtitle: "Code, Create, Immerse",
			enableProfessionalMode: true,
			badge: {
				enable: true,
				icon: "fa6-solid:briefcase",
			},
		},
	},
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
