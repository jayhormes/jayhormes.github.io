import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

interface RehypeExternalLinksOptions {
	site: string | URL;
}

const EXTERNAL_LINK_REL = ["noopener", "noreferrer"];

export default function rehypeExternalLinks(options: RehypeExternalLinksOptions) {
	const siteUrl = new URL(options.site);

	return (tree: Root) => {
		visit(tree, "element", (node) => {
			if (!isAnchorElement(node)) return;

			const href = node.properties.href;
			if (typeof href !== "string" || href.length === 0) return;
			if (!isAbsoluteHttpUrl(href)) return;

			const linkUrl = new URL(href);
			if (linkUrl.host === siteUrl.host) return;

			node.properties.target = "_blank";
			node.properties.rel = mergeRel(node.properties.rel);
		});
	};
}

function isAnchorElement(node: Element): boolean {
	return node.tagName === "a";
}

function isAbsoluteHttpUrl(href: string): boolean {
	return href.startsWith("http://") || href.startsWith("https://");
}

function mergeRel(value: unknown): string[] {
	const relValues = Array.isArray(value)
		? value.filter((item): item is string => typeof item === "string")
		: typeof value === "string"
			? value.split(/\s+/).filter(Boolean)
			: [];

	return [...new Set([...relValues, ...EXTERNAL_LINK_REL])];
}
