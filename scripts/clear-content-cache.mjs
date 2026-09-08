import { rm } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fetchCache = resolve(projectRoot, ".next", "cache", "fetch-cache");
if (!fetchCache.startsWith(`${projectRoot}${sep}`)) throw new Error("Unexpected fetch cache path");

// Next's static export can reuse fetch responses across builds. Clear only
// that generated cache so each export uses the current published CMS content;
// retain compilation caches and within-build request deduplication.
await rm(fetchCache, { recursive: true, force: true });
