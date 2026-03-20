<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: Post[] = [];

let uncategorized: string | null = null;

interface Post {
	slug: string;
	data: {
		title: string;
		tags: string[];
		category?: string;
		published: Date;
		image?: string;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let groups: Group[] = [];

function translate(key: I18nKey, params: Record<string, string | number> = {}) {
	return Object.entries(params).reduce(
		(text, [name, value]) => text.replace(`{${name}}`, String(value)),
		i18n(key),
	);
}

function splitCountLabel(key: I18nKey) {
	const template = i18n(key);
	const [before = "", after = ""] = template.split("{count}");
	return { before, after };
}

$: totalFilteredPosts = groups.reduce((acc, group) => acc + group.posts.length, 0);
$: totalPostsLabel = splitCountLabel(I18nKey.totalPosts);

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

// Generate consistent color for each tag (same logic as PostMeta)
function getTagVariant(
	tagName: string,
): "primary" | "secondary" | "success" | "warning" | "error" {
	const variants: (
		| "primary"
		| "secondary"
		| "success"
		| "warning"
		| "error"
	)[] = ["primary", "secondary", "success", "warning", "error"];
	let hash = 0;
	for (let i = 0; i < tagName.length; i++) {
		const char = tagName.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return variants[Math.abs(hash) % variants.length];
}

function syncFiltersFromLocation() {
	const params = new URLSearchParams(window.location.search);
	tags = params.has("tag") ? params.getAll("tag") : [];
	categories = params.has("category") ? params.getAll("category") : [];
	uncategorized = params.get("uncategorized");
}

function rebuildGroups() {
	let filteredPosts: Post[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr),
		posts: grouped[Number.parseInt(yearStr)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);
	groups = groupedPostsArray;
}

function updateArchiveState() {
	syncFiltersFromLocation();
	rebuildGroups();
}

onMount(() => {
	updateArchiveState();

	window.addEventListener("popstate", updateArchiveState);
	const swupPageViewHandler = () => updateArchiveState();
	const swupHooks = (window as typeof window & {
		swup?: { hooks?: { on?: (event: string, handler: () => void) => unknown; off?: (event: string, handler: () => void) => void } };
	}).swup?.hooks;
	if (swupHooks?.on) {
		swupHooks.on("page:view", swupPageViewHandler);
	}

	return () => {
		window.removeEventListener("popstate", updateArchiveState);
		swupHooks?.off?.("page:view", swupPageViewHandler);
	};
});
</script>

<div class="card-base px-8 py-6">
    <!-- Active Filter Bar -->
    {#if tags.length > 0 || categories.length > 0 || uncategorized}
        <div class="filter-bar flex flex-wrap items-center gap-2 mb-5 pb-4 border-b border-[var(--line-divider)]">
            <span class="text-xs text-50 shrink-0">{translate(I18nKey.currentFilters)}</span>

            <!-- Tag pills -->
            {#each tags as tag}
                <a
                    href="?{(() => { const p = new URLSearchParams(window.location.search); const remaining = p.getAll('tag').filter(t => t !== tag); p.delete('tag'); remaining.forEach(t => p.append('tag', t)); return p.toString(); })()}"
                    class="filter-pill notion-tag notion-tag-{getTagVariant(tag)} flex items-center gap-1 cursor-pointer"
                    style="height: 1.5rem; font-size: 0.7rem; padding: 0.15rem 0.6rem; border-radius: 9999px; display: inline-flex; align-items: center; font-weight: 500; white-space: nowrap; text-decoration: none;"
                    title={translate(I18nKey.removeTag, { value: tag })}
                >
                    <span>#</span><span>{tag}</span>
                    <span class="opacity-60 ml-0.5">✕</span>
                </a>
            {/each}

            <!-- Category pills -->
            {#each categories as cat}
                <a
                    href="?{(() => { const p = new URLSearchParams(window.location.search); const remaining = p.getAll('category').filter(c => c !== cat); p.delete('category'); remaining.forEach(c => p.append('category', c)); return p.toString(); })()}"
                    class="filter-pill category-pill flex items-center gap-1 cursor-pointer"
                    style="height: 1.5rem; font-size: 0.7rem; padding: 0.15rem 0.6rem; border-radius: 9999px; display: inline-flex; align-items: center; font-weight: 500; white-space: nowrap; text-decoration: none; background-color: rgb(254 249 195); color: rgb(161 98 7); border: 1px solid rgb(254 240 138);"
                    title={translate(I18nKey.removeCategory, { value: cat })}
                >
                    <span>📁</span><span>{cat}</span>
                    <span class="opacity-60 ml-0.5">✕</span>
                </a>
            {/each}

            <!-- Uncategorized pill -->
            {#if uncategorized}
                <a
                    href="?{(() => { const p = new URLSearchParams(window.location.search); p.delete('uncategorized'); return p.toString(); })()}"
                    class="filter-pill uncategorized-pill flex items-center gap-1 cursor-pointer"
                    style="height: 1.5rem; font-size: 0.7rem; padding: 0.15rem 0.6rem; border-radius: 9999px; display: inline-flex; align-items: center; font-weight: 500; white-space: nowrap; text-decoration: none; background-color: rgb(243 244 246); color: rgb(75 85 99); border: 1px solid rgb(209 213 219);"
                    title={translate(I18nKey.removeUncategorized)}
                >
                    <span>{i18n(I18nKey.uncategorized)}</span>
                    <span class="opacity-60 ml-0.5">✕</span>
                </a>
            {/if}

            <!-- Divider + post count -->
            <span class="text-[var(--line-divider)] select-none hidden sm:inline">|</span>
            <span class="text-xs text-50">
                {totalPostsLabel.before}<span class="font-semibold text-[var(--primary)]">{totalFilteredPosts}</span>{totalPostsLabel.after}
            </span>

            <!-- Clear all -->
            {#if tags.length + categories.length + (uncategorized ? 1 : 0) > 1}
                <a href="?" class="ml-auto text-xs text-30 hover:text-[var(--primary)] transition-colors underline underline-offset-2 shrink-0">
                    {i18n(I18nKey.clearAll)}
                </a>
            {/if}
        </div>
    {/if}

    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-[3.75rem]">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div
                            class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
                    ></div>
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                </div>
            </div>

            {#each group.posts as post}
                <a
                        href={getPostUrlBySlug(post)}
                        aria-label={post.data.title}
                        class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial] relative overflow-visible post-row"
                        style="transition: all 0.3s ease"
                >
                    <!-- Background image overlay -->
                    {#if post.data.image}
                        <div 
                            class="absolute right-0 top-0 w-1/3 h-full opacity-0 group-hover:opacity-20 transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat pointer-events-none"
                            style="background-image: url('{post.data.image}'); 
                                   background-position: center center;
                                   background-size: cover;
                                   filter: blur(0.5px);"
                        ></div>
                        <!-- Gradient overlay for better text readability -->
                        <div 
                            class="absolute right-0 top-0 w-1/3 h-full opacity-0 group-hover:opacity-40 transition-all duration-500 ease-in-out pointer-events-none"
                            style="background: linear-gradient(90deg, transparent 0%, var(--card-bg) 100%);"
                        ></div>
                    {/if}
                    
                    <!-- Content overlay -->
                    <div class="relative z-10 flex flex-row justify-start items-center h-full overflow-visible">
                        <!-- date -->
                        <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                            {formatDate(post.data.published)}
                        </div>

                        <!-- dot and line -->
                        <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                            <div
                                    class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
                            ></div>
                        </div>

                        <!-- post title -->
                        <div
                                class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                     text-75 pr-4 whitespace-nowrap overflow-ellipsis overflow-hidden"
                        >
                            {post.data.title}
                        </div>

                        <!-- tag list - hover tooltip -->
                        <div class="hidden md:flex md:w-[15%] items-center justify-start relative">
                            {#if post.data.tags && post.data.tags.length > 0}
                                <div class="tag-indicator text-xs text-30 flex items-center gap-1">
                                    <span class="opacity-50">#</span>
                                    <span>{post.data.tags.length}</span>
                                </div>
                                
                                <!-- Tooltip that appears on post row hover -->
                                <div class="tag-tooltip absolute bottom-full right-0 mb-3 p-2 bg-[var(--card-bg)] border border-[var(--line-divider)] rounded-lg shadow-lg z-[100] opacity-0 pointer-events-none transition-all duration-200 transform translate-y-1 min-w-[200px] max-w-[300px]">
                                    <div class="flex flex-wrap gap-1">
                                        {#each post.data.tags as tag}
                                            <span 
                                                class="notion-tag notion-tag-{getTagVariant(tag.trim())}"
                                                style="height: 1.25rem; font-size: 0.65rem; padding: 0.125rem 0.5rem; border-radius: 9999px; display: inline-flex; align-items: center; font-weight: 500; white-space: nowrap;"
                                            >
                                                {tag.trim()}
                                            </span>
                                        {/each}
                                    </div>
                                    <!-- Arrow pointing down -->
                                    <div class="absolute top-full right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[var(--line-divider)]"></div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/each}
</div>

<style>
    /* Tag tooltip shows on post row hover */
    .post-row:hover .tag-tooltip {
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: translateY(0) !important;
    }

    /* Ensure the tooltip container doesn't get cut off */
    .post-row {
        overflow: visible !important;
        position: relative;
    }

    .tag-indicator {
        transition: color 0.2s ease-in-out;
    }
    
    .post-row:hover .tag-indicator {
        color: rgb(var(--primary)) !important;
    }

    /* Filter bar animation */
    .filter-bar {
        animation: slideDown 0.25s ease-out;
    }

    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    /* Filter pills hover effect */
    .filter-pill {
        transition: opacity 0.15s ease, transform 0.15s ease;
    }
    .filter-pill:hover {
        opacity: 0.75;
        transform: scale(0.96);
    }

    /* Dark mode overrides for category/uncategorized pills */
    :root.dark .category-pill {
        background-color: rgba(133 77 14 / 0.3) !important;
        color: rgb(253 224 71) !important;
        border-color: rgb(161 98 7) !important;
    }
    :root.dark .uncategorized-pill {
        background-color: rgba(55 65 81 / 0.5) !important;
        color: rgb(209 213 219) !important;
        border-color: rgb(75 85 99) !important;
    }

    /* Notion-style tags for tooltip */
    :global(.notion-tag) {
        text-decoration: none !important;
        border: 1px solid !important;
        transition: all 0.2s ease-in-out !important;
        color: currentColor !important;
        backdrop-filter: blur(10px);
        box-sizing: border-box !important;
    }

    :global(.notion-tag-primary) {
        background-color: rgb(219 234 254) !important;
        color: rgb(29 78 216) !important;
        border-color: rgb(191 219 254) !important;
    }
    :global(:root.dark .notion-tag-primary) {
        background-color: rgba(30 58 138 / 0.3) !important;
        color: rgb(147 197 253) !important;
        border-color: rgb(29 78 216) !important;
    }

    :global(.notion-tag-secondary) {
        background-color: rgb(243 232 255) !important;
        color: rgb(126 34 206) !important;
        border-color: rgb(221 214 254) !important;
    }
    :global(:root.dark .notion-tag-secondary) {
        background-color: rgba(88 28 135 / 0.3) !important;
        color: rgb(196 181 253) !important;
        border-color: rgb(126 34 206) !important;
    }

    :global(.notion-tag-success) {
        background-color: rgb(220 252 231) !important;
        color: rgb(21 128 61) !important;
        border-color: rgb(187 247 208) !important;
    }
    :global(:root.dark .notion-tag-success) {
        background-color: rgba(20 83 45 / 0.3) !important;
        color: rgb(134 239 172) !important;
        border-color: rgb(21 128 61) !important;
    }

    :global(.notion-tag-warning) {
        background-color: rgb(254 249 195) !important;
        color: rgb(161 98 7) !important;
        border-color: rgb(254 240 138) !important;
    }
    :global(:root.dark .notion-tag-warning) {
        background-color: rgba(133 77 14 / 0.3) !important;
        color: rgb(253 224 71) !important;
        border-color: rgb(161 98 7) !important;
    }

    :global(.notion-tag-error) {
        background-color: rgb(254 226 226) !important;
        color: rgb(185 28 28) !important;
        border-color: rgb(252 165 165) !important;
    }
    :global(:root.dark .notion-tag-error) {
        background-color: rgba(127 29 29 / 0.3) !important;
        color: rgb(252 165 165) !important;
        border-color: rgb(185 28 28) !important;
    }
</style>
