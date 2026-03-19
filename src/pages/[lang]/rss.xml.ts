import type { APIContext, GetStaticPaths } from "astro";
import { enabledLanguages } from "@/config";
import { getSiteDefaultLanguage } from "@/utils/site-language-utils";
import { buildRssFeed } from "../rss.xml";

export const getStaticPaths = (() => {
	const defaultLang = getSiteDefaultLanguage();
	return enabledLanguages
		.filter((lang) => lang !== defaultLang)
		.map((lang) => ({ params: { lang } }));
}) satisfies GetStaticPaths;

export async function GET(context: APIContext) {
	return buildRssFeed(context, context.params.lang);
}
