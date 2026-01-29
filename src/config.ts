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
export const availableLanguages = {
	en: { code: "en", name: "English", flag: "🇺🇸" },
	"zh-tw": { code: "zh_TW", name: "繁體中文", flag: "🇹🇼" },
	"zh-cn": { code: "zh_CN", name: "简体中文", flag: "🇨🇳" },
	ja: { code: "ja", name: "日本語", flag: "🇯🇵" },
	ko: { code: "ko", name: "한국어", flag: "🇰🇷" },
	es: { code: "es", name: "Español", flag: "🇪🇸" },
	th: { code: "th", name: "ไทย", flag: "🇹🇭" },
} as const;

export type AvailableLanguage = keyof typeof availableLanguages;

// User-configurable languages - modify this array to enable/disable languages
export const enabledLanguages: AvailableLanguage[] = ["en", "zh-tw", "ja"];

// Multilingual post settings
export const multilingualSettings = {
	// Behavior for posts without lang field in frontmatter
	// 'default': Use siteConfig.lang as default (recommended for backward compatibility)
	// 'strict': Require lang field in all posts (shows warning in dev mode)
	legacyBehavior: 'default' as 'default' | 'strict',
	
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
	title: "Fuwari",
	subtitle: "Demo Site",
	lang: "en", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
		typewriter: {
			enable: true,
			texts: [
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit",
				"Lorem Ipsum",
				"dolor sit amet",
				"consectetur adipiscing elit",
			],
			speed: 100, // Typing speed in milliseconds
			delay: 2000, // Delay between texts in milliseconds
			fontSize: "3rem",
			fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
			fontWeight: "700", // (100-900 or normal, bold)
			color: "#ffffffff",
			cursorColor: "#000000",
			textAlign: "center",
		},
	},
	pages: {
		archive: {
			src: "/demo-banner.png", // Custom banner for Archive page - you can change this to any image path
			position: "center",
		},
		gallery: {
			src: "/guide-cover.jpeg", // Custom banner for Gallery page - you can change this to any image path
			position: "center",
		},
		projects: {
			src: "/demo-banner.png", // Custom banner for Projects page - you can change this to any image path
			position: "center",
		},
		about: {
			src: "/guide-cover.jpeg", // Custom banner for About page - you can change this to any image path
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
			url: "https://github.com/saicaca/fuwari", // Internal links should not include the base path, as it is automatically added
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
		avatar: "assets/images/demo-avatar.png",
		name: "Lorem Ipsum",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		links: [
			{
				name: "Twitter",
				icon: "fa6-brands:twitter",
				url: "https://twitter.com",
			},
			{
				name: "Steam",
				icon: "fa6-brands:steam",
				url: "https://store.steampowered.com",
			},
			{
				name: "GitHub",
				icon: "fa6-brands:github",
				url: "https://github.com/saicaca/fuwari",
			},
		],
		about: {
			avatar: "assets/images/demo-avatar.png",
			title: "Lorem Ipsum",
			subtitle: "Full Stack Developer & UI/UX Enthusiast",
			enableProfessionalMode: true,
			badge: {
				enable: true,
				icon: "fa6-solid:briefcase",
			},
		},
	},
	// Traditional Chinese
	"zh-tw": {
		avatar: "assets/images/demo-avatar.png",
		name: "示範帳號",
		bio: "這是一個示範部落格，展示多語言功能。",
		links: [
			{
				name: "推特",
				icon: "fa6-brands:twitter",
				url: "https://twitter.com",
			},
			{
				name: "Steam",
				icon: "fa6-brands:steam",
				url: "https://store.steampowered.com",
			},
			{
				name: "GitHub",
				icon: "fa6-brands:github",
				url: "https://github.com/saicaca/fuwari",
			},
		],
		about: {
			avatar: "assets/images/demo-avatar.png",
			title: "示範帳號",
			subtitle: "全端工程師與 UI/UX 愛好者",
			enableProfessionalMode: true,
			badge: {
				enable: true,
				icon: "fa6-solid:briefcase",
			},
		},
	},
	// Japanese
	ja: {
		avatar: "assets/images/demo-avatar.png",
		name: "デモアカウント",
		bio: "これは多言語機能を紹介するデモブログです。",
		links: [
			{
				name: "ツイッター",
				icon: "fa6-brands:twitter",
				url: "https://twitter.com",
			},
			{
				name: "Steam",
				icon: "fa6-brands:steam",
				url: "https://store.steampowered.com",
			},
			{
				name: "GitHub",
				icon: "fa6-brands:github",
				url: "https://github.com/saicaca/fuwari",
			},
		],
		about: {
			avatar: "assets/images/demo-avatar.png",
			title: "デモアカウント",
			subtitle: "フルスタック開発者 & UI/UX愛好家",
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
