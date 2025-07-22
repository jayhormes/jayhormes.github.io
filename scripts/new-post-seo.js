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
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "") // Remove special characters
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens with single
		.trim(); // Remove leading/trailing spaces
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No title argument provided
Usage: npm run new-post-seo -- "<Post Title>"
Example: npm run new-post-seo -- "How to Include Videos in Blog Posts"`);
	process.exit(1);
}

const postTitle = args.join(" "); // Join all arguments as title
const dateString = getDate();
const slug = slugify(postTitle);
const fileName = `${slug}.md`;

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
lang: ''
---

# ${postTitle}

Your content here...
`;

fs.writeFileSync(fullPath, content);

console.log(`SEO-friendly post created: ${fullPath}`);
console.log(`URL will be: /posts/${slug}/`);
