/* Script to create a new post with SEO-friendly filename */

import fs from "node:fs";
import path from "node:path";

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function slugify(text) {
	// Remove language codes if they exist at the end
	const langCodes = ["en", "zh-tw", "zh-cn", "ja", "ko", "es", "th"];
	const words = text.split(/\s+/);
	const lastWord = words[words.length - 1]?.toLowerCase();
	
	let textToSlugify = text;
	if (langCodes.includes(lastWord)) {
		textToSlugify = words.slice(0, -1).join(" ");
	}
	
	return textToSlugify
		.toLowerCase()
		.replace(/[\u4e00-\u9fa5]+/g, "") // Remove Chinese characters
		.replace(/[\u3040-\u309f\u30a0-\u30ff]+/g, "") // Remove Japanese characters
		.replace(/[\uac00-\ud7af]+/g, "") // Remove Korean characters
		.replace(/[^\w\s-]/g, "") // Remove remaining special characters
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens with single
		.replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
		.trim();
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No title argument provided
Usage: 
  npm run new-post-seo -- "<Post Title>" [language] [slug]
  
Examples: 
  npm run new-post-seo -- "How to Include Videos"
  npm run new-post-seo -- "如何在文章中加入影片" zh-tw how-to-include-videos
  npm run new-post-seo -- "ビデオを含める方法" ja how-to-include-videos
  
Supported languages: en, zh-tw, zh-cn, ja, ko, es, th

Note: For non-English titles, please provide a slug as the last argument
      Files without language suffix use the default site language`);
	process.exit(1);
}

// Parse arguments
let postTitle = "";
let language = "";
let customSlug = "";

// Check if last argument is a custom slug (contains only alphanumeric and hyphens)
const supportedLanguages = ["en", "zh-tw", "zh-cn", "ja", "ko", "es", "th"];
const lastArg = args[args.length - 1].toLowerCase();
const secondLastArg = args.length > 1 ? args[args.length - 2].toLowerCase() : "";

// Pattern 1: "Title" lang slug
// Pattern 2: "Title" slug  
// Pattern 3: "Title" lang
// Pattern 4: "Title"

if (args.length >= 3 && supportedLanguages.includes(secondLastArg)) {
	// Pattern 1: "Title" lang slug
	language = secondLastArg;
	customSlug = lastArg;
	postTitle = args.slice(0, -2).join(" ");
} else if (args.length >= 2 && /^[a-z0-9-]+$/.test(lastArg) && !supportedLanguages.includes(lastArg)) {
	// Pattern 2: "Title" slug (no language)
	customSlug = lastArg;
	postTitle = args.slice(0, -1).join(" ");
} else if (args.length >= 2 && supportedLanguages.includes(lastArg)) {
	// Pattern 3: "Title" lang
	language = lastArg;
	postTitle = args.slice(0, -1).join(" ");
} else {
	// Pattern 4: "Title" only
	postTitle = args.join(" ");
}

if (!postTitle.trim()) {
	console.error("Error: Post title cannot be empty");
	process.exit(1);
}
const dateString = getDate();
const slug = customSlug || slugify(postTitle);

// Validate slug
if (!slug || slug === "") {
	console.error(`Error: Cannot generate slug from title "${postTitle}"`);
	console.error("Please provide a custom slug as the last argument");
	console.error(`Example: npm run new-post-seo -- "${postTitle}" ${language || 'en'} my-custom-slug`);
	process.exit(1);
}

const fileName = language ? `${slug}.${language}.md` : `${slug}.md`;

const targetDir = "./src/content/posts/";
const fullPath = path.join(targetDir, fileName);

if (fs.existsSync(fullPath)) {
	console.error(`Error: File ${fullPath} already exists`);
	process.exit(1);
}

// Create directory if it doesn't exist
const dirPath = path.dirname(fullPath);
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath, { recursive: true });
}

const content = `---
title: ${postTitle}
published: ${dateString}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ${language ? `'${language}'` : "''"}
---

# ${postTitle}

Your content here...
`;

fs.writeFileSync(fullPath, content);

console.log(`✅ SEO-friendly post created: ${fullPath}`);
if (language) {
	console.log(`🌐 Language: ${language}`);
	console.log(`📝 Base slug: ${slug}`);
}
console.log(`🔗 URL will be: ${language && language !== "en" ? `/${language}` : ""}/posts/${slug}/`);
