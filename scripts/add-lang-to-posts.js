/* Script to add lang field to posts without it */

import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = "./src/content/posts/";

// Import config to get default language
// Since we can't easily import TS config in Node, we'll use a parameter
const defaultLang = process.argv[2] || "en";

console.log("🌐 Adding lang field to posts without it...");
console.log(`📝 Default language: ${defaultLang}\n`);

// Get all markdown files
const files = fs
	.readdirSync(POSTS_DIR)
	.filter((file) => file.endsWith(".md"));

let updatedCount = 0;
let skippedCount = 0;
let errorCount = 0;

for (const file of files) {
	const filePath = path.join(POSTS_DIR, file);

	try {
		const content = fs.readFileSync(filePath, "utf-8");

		// Check if file already has lang field in frontmatter
		const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

		if (!frontmatterMatch) {
			console.log(`⚠️  Skipping ${file}: No frontmatter found`);
			skippedCount++;
			continue;
		}

		const frontmatter = frontmatterMatch[1];

		// Check if lang field already exists
		if (/^lang:/m.test(frontmatter)) {
			console.log(`✓  Skipping ${file}: Already has lang field`);
			skippedCount++;
			continue;
		}

		// Extract language from filename if it has a suffix
		const filenameLangMatch = file.match(/\.([a-z]{2}(-[a-z]{2})?)\.md$/);
		const fileLang = filenameLangMatch ? filenameLangMatch[1] : defaultLang;

		// Add lang field before the closing ---
		const newFrontmatter = frontmatter + `\nlang: '${fileLang}'`;
		const newContent = content.replace(
			/^---\n([\s\S]*?)\n---/,
			`---\n${newFrontmatter}\n---`,
		);

		// Write back to file
		fs.writeFileSync(filePath, newContent, "utf-8");

		console.log(
			`✅ Updated ${file}: Added lang: '${fileLang}'`,
		);
		updatedCount++;
	} catch (error) {
		console.error(`❌ Error processing ${file}:`, error.message);
		errorCount++;
	}
}

console.log("\n" + "=".repeat(50));
console.log("📊 Summary:");
console.log(`   ✅ Updated: ${updatedCount}`);
console.log(`   ⏭️  Skipped: ${skippedCount}`);
console.log(`   ❌ Errors:  ${errorCount}`);
console.log("=".repeat(50));

if (updatedCount > 0) {
	console.log(
		"\n💡 Tip: Review the changes with 'git diff' before committing.",
	);
}
