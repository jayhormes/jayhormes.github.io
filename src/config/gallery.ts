import type { MultilingualGalleryConfig } from "../types/config";

// Multilingual Gallery Configuration
// Configure different collection names and descriptions for each language
// tags and displayMode remain the same across languages (they are technical parameters)
export const galleryConfig: Record<string, MultilingualGalleryConfig> = {
	en: {
		collections: [
			{
				name: "Reading Notes",
				description: "Collection of reading reviews and notes",
				tags: ["reading"],
				displayMode: "table",
			},
			{
				name: "Travel Experiences",
				description: "Travel blogs and experiences",
				tags: ["travel"],
				displayMode: "grid",
			},
		],
	},
	"zh-tw": {
		collections: [
			{
				name: "閱讀筆記",
				description: "閱讀心得與筆記收藏",
				tags: ["reading"],
				displayMode: "table",
			},
			{
				name: "旅行體驗",
				description: "旅行部落格與經驗分享",
				tags: ["travel"],
				displayMode: "grid",
			},
		],
	},
	ja: {
		collections: [
			{
				name: "読書ノート",
				description: "読書レビューとノートのコレクション",
				tags: ["reading"],
				displayMode: "table",
			},
			{
				name: "旅行体験",
				description: "旅行ブログと体験記",
				tags: ["travel"],
				displayMode: "grid",
			},
		],
	},
};
