// civitai-scrape.mjs
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = "https://civitai.com/api/v1/images";
const OUTPUT_FILE = path.join(__dirname, "civitai_images.json");

const LIMIT = 200;
const BROWSING_LEVEL = 0;
const MAX_PAGES = Number(process.env.MAX_PAGES || 10);
const DELAY_MS = 10_000;
const TAG = 111794; //buildings

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(cursor = null) {
  const url = new URL(API_URL);

  url.searchParams.set("limit", LIMIT);
  url.searchParams.set("sort", "Newest");
  url.searchParams.set("browsingLevel", BROWSING_LEVEL||0);
  url.searchParams.set("tags", TAG);
  if (cursor) url.searchParams.set("cursor", cursor);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" }
  });

  if (res.status === 503) {
    throw new Error("ABORT_503");
  }

  if (!res.ok) {
    throw new Error(`HTTP_${res.status}`);
  }

  return res.json();
}

async function run() {
  let cursor = null;
  let page = 0;

  const results = [];

  try {
    while (page < MAX_PAGES) {
      console.log(`Fetching page ${page + 1}...`);

      const data = await fetchPage(cursor);
      const items = data.items || [];

      if (!items.length) break;

      for (const item of items) {
        results.push({
          externalId: item.id,
          url: item.url,
          hash: item.hash,
          baseModel: item.baseModel,
          browsingLevel: item.browsingLevel,
          width: item.width,
          height: item.height
        });
      }

      cursor = data.metadata?.nextCursor;
      if (!cursor) break;

      page++;

      console.log(`Waiting ${DELAY_MS / 1000}s...`);
      await sleep(DELAY_MS);
    }
  } catch (err) {
    if (err.message === "ABORT_503") {
      console.error("503 received — aborting early but saving data.");
    } else {
      console.error("Error — aborting:", err);
    }
  }

  // ✅ CLEAN OUTPUT FOR MONGODB IMPORT
  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(results, null, 2),
    "utf8"
  );

  console.log(`Saved ${results.length} records to ${OUTPUT_FILE}`);
}

run();