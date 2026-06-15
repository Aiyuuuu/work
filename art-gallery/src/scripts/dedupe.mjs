// dedupe-civitai.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, "civitai_images.json");
const OUTPUT_FILE = path.join(__dirname, "civitai_images.deduped.json");

async function run() {
  console.log("Reading file...");

  const raw = await fs.readFile(INPUT_FILE, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("Input JSON must be an array");
  }

  const seenIds = new Set();
  const seenUrls = new Set();
  const deduped = [];

  for (const item of data) {
    if (!item) continue;

    const id = item.externalId;
    const url = item.url;

    // skip invalid entries
    if (id == null || !url) continue;

    if (seenIds.has(id) || seenUrls.has(url)) {
      continue;
    }

    seenIds.add(id);
    seenUrls.add(url);

    deduped.push(item);
  }

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(deduped, null, 2),
    "utf8"
  );

  console.log(`Original: ${data.length}`);
  console.log(`Deduped:  ${deduped.length}`);
  console.log(`Saved → ${OUTPUT_FILE}`);
}

run().catch(console.error);