import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;

	lang: string;

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
		typewriter: {
			enable: boolean;
			texts: string[];
			speed?: number;
			delay?: number;
			fontSize?: string;
			fontFamily?: string;
			fontWeight?: string;
			color?: string;
			cursorColor?: string;
			textAlign?: string;
		};
	};
	pages: {
		archive?: PageBannerConfig;
		gallery?: PageBannerConfig;
		projects?: PageBannerConfig;
		about?: PageBannerConfig;
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};

	favicon: Favicon[];
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export type PageBannerConfig = {
	src: string;
	position?: "top" | "center" | "bottom";
};

export type GalleryCollection = {
	name: string;
	description?: string;
	tags: string[];
	displayMode?: "grid" | "table";
};

// Multilingual Gallery Config - allows different collection names/descriptions per language
export type MultilingualGalleryConfig = {
	collections: GalleryCollection[];
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	Gallery = 2,
	Projects = 3,
	About = 4,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
	about?: {
		avatar?: string; // Professional avatar for About page
		title?: string; // Professional title for About page
		subtitle?: string; // Professional subtitle for About page
		enableProfessionalMode?: boolean; // Enable professional mode (shows professional header + full width layout, hides sidebar)
		badge?: {
			enable?: boolean; // Enable/disable the professional badge
			icon?: string; // Icon for the badge (e.g., "fa6-solid:briefcase")
		};
	};
};

// Multilingual Profile Config - allows different profile info per language
export type MultilingualProfileConfig = Record<string, ProfileConfig>;

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};
