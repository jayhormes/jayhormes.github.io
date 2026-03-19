import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { getProfileConfig } from "@/utils/profile-utils";
import { getLanguageInfo, getOgImageUrl } from "@/utils/seo-utils";
import { getSiteDefaultLanguage } from "@/utils/site-language-utils";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export async function buildRssFeed(context: APIContext, lang?: string) {
	const languageKey = getLanguageInfo(lang || getSiteDefaultLanguage()).key;
	const languageInfo = getLanguageInfo(languageKey);
	const blog = await getSortedPosts(languageKey);
	const profileConf = getProfileConfig(languageKey);

	return rss({
		title: `${siteConfig.title} (${languageInfo.name})`,
		description: profileConf.bio || siteConfig.subtitle || "No description",
		site: context.site ?? "https://fuwari.vercel.app",
		items: blog.map((post) => {
			const content = typeof post.body === "string" ? post.body : String(post.body || "");
			const cleanedContent = stripInvalidXmlChars(content);
			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: `/posts/${post.slug}/`,
				customData: `<language>${languageInfo.bcp47}</language><enclosure url="${getOgImageUrl(context.site ?? new URL("https://fuwari.vercel.app"), post.data.image)}" type="image/jpeg" />`,
				content: sanitizeHtml(parser.render(cleanedContent), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),
		customData: `<language>${languageInfo.bcp47}</language>`,
	});
}

export async function GET(context: APIContext) {
	return buildRssFeed(context, getSiteDefaultLanguage());
}
