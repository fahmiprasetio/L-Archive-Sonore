const { Client } = require("@notionhq/client");
const fs = require("fs").promises;
const path = require("path");

const token = process.env.NOTION_TOKEN;
if (!token) {
  console.error("ERROR: NOTION_TOKEN tidak diset");
  console.error("Set: export NOTION_TOKEN=ntn_...");
  process.exit(1);
}

const notion = new Client({ auth: token });

// Find parent page ID (from env or search)
async function getParentPageId() {
  if (process.env.NOTION_PARENT_PAGE_ID) {
    return process.env.NOTION_PARENT_PAGE_ID;
  }

  // Search untuk page "Archive Sonore" atau workspace root
  console.log("Cari parent page di workspace...");
  try {
    const search = await notion.search({
      query: "Archive Sonore",
      filter: { value: "page", property: "object" },
    });

    if (search.results.length > 0) {
      const page = search.results[0];
      console.log(`✓ Ketemu page: ${page.properties.title?.title?.[0]?.plain_text || page.id}`);
      return page.id;
    }
  } catch (e) {
    console.log("Search error, lanjut...");
  }

  console.error("\n❌ Parent page tidak ditemukan.");
  console.error("Solusi:");
  console.error("  1. Buka Notion web");
  console.error("  2. Buat page baru bernama 'Archive Sonore' atau 'Repo Sync'");
  console.error("  3. Copy page ID dari URL (format: xxxxxxxxxxxxxxxxxxxxx atau xxx-xxx-xxx-xxx-xxx)");
  console.error("  4. Set env var: export NOTION_PARENT_PAGE_ID=<id>");
  console.error("  5. Jalankan script lagi");
  process.exit(1);
}

// Walk directory, collect file paths (skip ignored patterns)
async function collectFiles() {
  const ignore = [
    "node_modules",
    ".git",
    ".vscode",
    ".next",
    "dist",
    "build",
    ".env",
    ".env.local",
    ".env*.local",
  ];

  const files = [];

  async function walk(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (ignore.includes(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else {
          // Skip large files & binary
          if (entry.name.endsWith(".pem") || entry.name.endsWith(".key")) continue;
          files.push(fullPath);
        }
      }
    } catch (e) {
      console.error(`Skip ${dir}: ${e.message}`);
    }
  }

  const srcDir = path.join(process.cwd(), "src");
  const readmeFile = path.join(process.cwd(), "README.md");
  const packageFile = path.join(process.cwd(), "package.json");

  console.log("Scan files...");
  try {
    await walk(srcDir);
  } catch (e) {
    console.warn(`Cannot read src/: ${e.message}`);
  }

  // Add root files
  for (const file of [readmeFile, packageFile]) {
    try {
      await fs.access(file);
      files.push(file);
    } catch {}
  }

  return files;
}

// Upload file as Notion page
async function uploadFile(parentPageId, filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const relativePath = path.relative(process.cwd(), filePath);
  const ext = path.extname(filePath).slice(1) || "text";

  // Truncate jika terlalu besar (Notion limit ~2000 chars per block)
  const maxSize = 2000;
  const truncated =
    content.length > maxSize
      ? content.slice(0, maxSize) + `\n\n... (File terpotong, total ${content.length} chars)`
      : content;

  // Detect language
  const langMap = {
    ts: "typescript",
    tsx: "typescript",
    jsx: "jsx",
    js: "javascript",
    json: "json",
    md: "markdown",
    css: "css",
    html: "html",
  };
  const lang = langMap[ext] || "plaintext";

  try {
    const page = await notion.pages.create({
      parent: { page_id: parentPageId },
      properties: {
        title: {
          title: [{ text: { content: relativePath } }],
        },
      },
      children: [
        {
          object: "block",
          type: "code",
          code: {
            language: lang,
            rich_text: [{ text: { content: truncated } }],
          },
        },
      ],
    });

    console.log(`  ✓ ${relativePath}`);
    return page.id;
  } catch (e) {
    console.error(`  ✗ ${relativePath}: ${e.message}`);
    return null;
  }
}

// Main
(async () => {
  try {
    console.log("=== Notion Repo Sync ===\n");

    const parentPageId = await getParentPageId();
    console.log(`Parent page ID: ${parentPageId}\n`);

    const files = await collectFiles();
    console.log(`\nUpload ${files.length} file ke Notion:\n`);

    let success = 0;
    for (const file of files) {
      const result = await uploadFile(parentPageId, file);
      if (result) success++;
    }

    console.log(`\n✅ Selesai! Upload ${success}/${files.length} file.\n`);
    console.log("Buka Notion workspace untuk lihat hasil.");
  } catch (e) {
    console.error("\n❌ Error:", e.message);
    process.exit(1);
  }
})();
