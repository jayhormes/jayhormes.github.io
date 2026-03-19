import { getCollection } from "astro:content";
import { getSiteDefaultLanguage } from "./site-language-utils";
import { extractLanguageFromSlug, getPostRouteInfo } from "./post-language-utils";

/**
 * Find all language versions of a post
 * Returns: { lang: routePath }
 */
export async function getPostLanguageVersions(
	baseSlug: string,
): Promise<Record<string, string>> {
	const allPosts = await getCollection("posts");
	const versions: Record<string, string> = {};

	for (const post of allPosts) {
		const { baseSlug: postBaseSlug } = extractLanguageFromSlug(post.slug, post.filePath ?? post.id);

		if (postBaseSlug === baseSlug) {
			const postRoute = getPostRouteInfo(post.slug, {
				frontmatterLang: post.data.lang,
				filePathOrId: post.filePath ?? post.id,
			});
			versions[postRoute.lang] = postRoute.routePath;
		}
	}

	return versions;
}

export async function findPostByLanguage(
	baseSlug: string,
	targetLang: string,
): Promise<{
	slug: string;
	isExactMatch: boolean;
	actualLang: string;
} | null> {
	const versions = await getPostLanguageVersions(baseSlug);
	const defaultLang = getSiteDefaultLanguage();

	if (versions[targetLang]) {
		return {
			slug: versions[targetLang],
			isExactMatch: true,
			actualLang: targetLang,
		};
	}

	if (versions[defaultLang]) {
		return {
			slug: versions[defaultLang],
			isExactMatch: false,
			actualLang: defaultLang,
		};
	}

	const availableLangs = Object.keys(versions);
	if (availableLangs.length > 0) {
		const fallbackLang = availableLangs[0];
		return {
			slug: versions[fallbackLang],
			isExactMatch: false,
			actualLang: fallbackLang,
		};
	}

	return null;
}

export async function hasLanguageVersion(
	baseSlug: string,
	lang: string,
): Promise<boolean> {
	const versions = await getPostLanguageVersions(baseSlug);
	return lang in versions;
}

export async function getAvailableLanguages(
	baseSlug: string,
): Promise<string[]> {
	const versions = await getPostLanguageVersions(baseSlug);
	return Object.keys(versions);
}
