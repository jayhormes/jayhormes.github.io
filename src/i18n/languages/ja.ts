import Key from "../i18nKey";
import type { Translation } from "../translation";

export const ja: Translation = {
	[Key.home]: "ホーム",
	[Key.about]: "概要",
	[Key.archive]: "アーカイブ",
	[Key.gallery]: "ギャラリー",
	[Key.projects]: "プロジェクト",
	[Key.search]: "検索",

	[Key.tags]: "タグ",
	[Key.categories]: "カテゴリ",
	[Key.recentPosts]: "最近の投稿",

	[Key.comments]: "コメント",

	[Key.untitled]: "タイトルなし",
	[Key.uncategorized]: "カテゴリなし",
	[Key.noTags]: "タグなし",

	[Key.wordCount]: "文字",
	[Key.wordsCount]: "文字",
	[Key.minuteCount]: "分",
	[Key.minutesCount]: "分",
	[Key.readingTime]: "{count} 分",
	[Key.wordCountLabel]: "{count} 文字",
	[Key.postCount]: "件の投稿",
	[Key.postsCount]: "件の投稿",

	[Key.themeColor]: "テーマカラー",

	[Key.lightMode]: "ライト",
	[Key.darkMode]: "ダーク",
	[Key.systemMode]: "システム",

	[Key.more]: "もっと",

	[Key.author]: "作者",
	[Key.publishedAt]: "公開日",
	[Key.license]: "ライセンス",

	// Language selector
	[Key.languageSelector]: "言語",
	[Key.english]: "English",
	[Key.chineseSimplified]: "简体中文",
	[Key.chineseTraditional]: "繁體中文",
	[Key.japanese]: "日本語",
	[Key.korean]: "한국어",
	[Key.spanish]: "Español",
	[Key.thai]: "ไทย",

	// Gallery page
	[Key.galleryFoundPosts]: "{count}件の投稿が見つかりました",
	[Key.galleryNoPostsFound]: "このコレクションの投稿が見つかりませんでした。",
	[Key.galleryTryAddingTags]: "次のタグを持つ投稿を追加してみてください：{tags}",

	// Archive page
	[Key.currentFilters]: "現在のフィルター：",
	[Key.totalPosts]: "{count} 件",
	[Key.removeTag]: "タグを削除：{value}",
	[Key.removeCategory]: "カテゴリを削除：{value}",
	[Key.removeUncategorized]: "未分類を削除",
	[Key.clearAll]: "すべてクリア",
};
