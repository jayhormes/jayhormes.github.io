import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { addLanguageToPath } from "./language-utils";
import { getPostRouteInfo } from "./post-language-utils";

type PostUrlInput =
	| string
	| {
		slug: string;
		data?: { lang?: string };
		filePath?: string;
		id?: string;
	  };

export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getPostUrlBySlug(input: PostUrlInput): string {
	if (typeof input === "string") {
		return url(`/posts/${input}/`);
	}

	const route = getPostRouteInfo(input.slug, {
		frontmatterLang: input.data?.lang,
		filePathOrId: input.filePath ?? input.id,
	});
	return url(`/posts/${route.routeSlug.join("/")}/`);
}

function getArchivePath(lang?: string): string {
	return lang ? addLanguageToPath("/archive/", lang as never) : "/archive/";
}

function buildArchiveUrl(searchParams?: URLSearchParams, lang?: string): string {
	const archivePath = getArchivePath(lang);
	const query = searchParams?.toString();
	return url(query ? `${archivePath}?${query}` : archivePath);
}

export function getTagUrl(tag: string, lang?: string): string {
	if (!tag) return buildArchiveUrl(undefined, lang);

	const searchParams = new URLSearchParams();
	searchParams.append("tag", tag.trim());
	return buildArchiveUrl(searchParams, lang);
}

export function getCategoryUrl(category: string | null, lang?: string): string {
	const searchParams = new URLSearchParams();

	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	) {
		searchParams.append("uncategorized", "true");
		return buildArchiveUrl(searchParams, lang);
	}

	searchParams.append("category", category.trim());
	return buildArchiveUrl(searchParams, lang);
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function url(path: string) {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
