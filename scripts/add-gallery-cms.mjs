import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) throw new Error("Configure the existing Studio project and dataset first.");
const cli = resolve("node_modules/sanity/bin/sanity");
function api(endpoint, args) {
  return JSON.parse(execFileSync(process.execPath, [cli, "api", endpoint, "--project-id", projectId,
    "--dataset", dataset, "--api-version", "2026-08-24", ...args], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
}
const { result } = api("data/query/{dataset}", ["-X", "GET", "-f", "perspective=raw", "-f",
  'query={"documents": *[_type in ["siteSettings", "galleryPage"] && !(_id in path("versions.**"))], "assets": *[_type == "sanity.imageAsset"]{_id, originalFilename}}']);
const settings = result.documents.find((doc) => doc._id === "siteSettings");
if (!settings) throw new Error("Publish Site Settings in the configured dataset before adding the gallery.");
const mutations = [];
if (!result.documents.some((doc) => doc._type === "galleryPage")) {
  const descriptions = [
    ["stage-audio.jpg", "Stage and speaker setup for an event", "Stage audio"],
    ["audio-console.jpg", "Digital audio console at an event", "Audio mixing"],
    ["outdoor-screen.jpg", "Outdoor event screen and production setup", "Outdoor production"],
  ];
  const photos = process.argv.includes("--empty") ? [] : descriptions.map(([filename, alt, caption]) => {
    const asset = result.assets.find((item) => item.originalFilename === filename);
    if (!asset) throw new Error(`Missing existing gallery asset: ${filename}`);
    return { _type: "galleryPhoto", _key: filename.replace(".jpg", ""), asset: { _type: "reference", _ref: asset._id }, alt, caption };
  });
  mutations.push({ createIfNotExists: {
    _id: "galleryPage", _type: "galleryPage", heading: "Sound and event setups",
    description: "Take a closer look at audio equipment and event production setups.", photos,
    advanced: { _type: "object", eyebrow: "Photo Gallery", seo: { _type: "seoOverride", title: `Gallery | ${settings.businessName}`,
      description: "Explore sound and event production photos for North Georgia rental inspiration." } },
  } });
}
for (const doc of result.documents.filter((item) => item._type === "siteSettings")) {
  if (!doc.advanced) throw new Error(`Complete advanced Site Settings first: ${doc._id}`);
  const labels = Object.fromEntries(["galleryLabel", "footerGalleryLabel"].filter((key) => doc.advanced[key] === undefined).map((key) => [`advanced.${key}`, "Gallery"]));
  if (Object.keys(labels).length) mutations.push({ patch: { id: doc._id, ifRevisionID: doc._rev, setIfMissing: labels } });
}
console.log(JSON.stringify({ projectId, dataset, apply: process.argv.includes("--apply"), mutations }, null, 2));
if (process.argv.includes("--apply") && mutations.length) {
  const folder = resolve(".sanity/gallery", new Date().toISOString().replaceAll(/[:.]/g, "-"));
  mkdirSync(folder, { recursive: true });
  writeFileSync(resolve(folder, "before.json"), JSON.stringify({ projectId, dataset, ...result }, null, 2));
  const payload = resolve(folder, "mutations.json");
  writeFileSync(payload, JSON.stringify({ mutations }));
  const response = api("data/mutate/{dataset}", ["-X", "POST", "--input", payload, "-H", "Content-Type: application/json"]);
  console.log(JSON.stringify({ transactionId: response.transactionId, backup: folder, updated: response.results?.length }));
}
