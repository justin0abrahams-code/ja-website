import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import nextEnv from "@next/env";
import { pausePackageCopy } from "./package-pause-copy.mjs";

nextEnv.loadEnvConfig(process.cwd());
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) throw new Error("Configure the existing Studio project and dataset first.");
const cli = resolve("node_modules/sanity/bin/sanity");
const apiVersion = "2026-08-24";
function api(endpoint, args) {
  return JSON.parse(execFileSync(process.execPath, [cli, "api", endpoint, "--project-id", projectId,
    "--dataset", dataset, "--api-version", apiVersion, ...args], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
}

const { result: documents } = api("data/query/{dataset}", ["-X", "GET", "-f", "perspective=raw", "-f",
  'query=*[_type in ["siteSettings","homePage","aboutPage","quotePage","faqPage","faq","rentalPackage","packagesPage"] && !(_id in path("versions.**"))]']);
const dormantLabels = new Set(["packagesLabel", "footerPackagesLabel", "heroPrimaryLabel", "featuredEyebrow", "featuredLinkLabel", "upgradesLinkLabel", "ctaSecondaryLabel"]);
function changes(value, path = "") {
  if (typeof value === "string") {
    const next = pausePackageCopy(value);
    return value === next ? [] : [{ path, before: value, after: next }];
  }
  if (Array.isArray(value)) return value.flatMap((item, index) => changes(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) =>
    key.startsWith("_") || key === "featuredPackages" || dormantLabels.has(key)
      ? [] : changes(item, path ? `${path}.${key}` : key));
}

const edits = documents.filter((doc) => !["rentalPackage", "packagesPage"].includes(doc._type))
  .map((doc) => ({ doc, changes: changes(doc) })).filter((edit) => edit.changes.length);
const mutations = edits.map(({ doc, changes: fields }) => ({ patch: {
  id: doc._id, ifRevisionID: doc._rev, set: Object.fromEntries(fields.map(({ path, after }) => [path, after])),
} }));

// This existing public page has no document in the connected dataset. Create
// only its fixed singleton; never seed or replace the package collection.
const missingFaqPage = !documents.some((doc) => doc._type === "faqPage");
if (missingFaqPage) {
  mutations.push({ createIfNotExists: {
    _id: "faqPage", _type: "faqPage", heading: "Helpful answers before you request a quote",
    description: "Get answers about equipment rentals, delivery, setup, and support before requesting availability for your event.",
    cta: { _type: "object", heading: "Tell us about your event and Justin can help from there",
      description: "A quote request is the fastest way to figure out the right equipment, support options, and next steps." },
    advanced: { _type: "object", eyebrow: "Frequently Asked Questions", ctaEyebrow: "Still have questions?",
      ctaPrimaryLabel: "Get a Fast Quote",
      seo: { _type: "seoOverride", title: "FAQ | Justin Abrahams Event Production",
        description: "Answers about delivery, setup, operators, equipment options, quote requests, and the North Georgia service area." } },
  } });
}

console.log(JSON.stringify({ projectId, dataset, apply: process.argv.includes("--apply"),
  edits: edits.map(({ doc, changes }) => ({ id: doc._id, changes })), createFaqPage: missingFaqPage,
  preservedPackages: documents.filter((doc) => doc._type === "rentalPackage").length }, null, 2));

if (process.argv.includes("--apply") && mutations.length) {
  const folder = resolve(".sanity/package-pause", new Date().toISOString().replaceAll(/[:.]/g, "-"));
  mkdirSync(folder, { recursive: true });
  writeFileSync(resolve(folder, "before.json"), JSON.stringify({ projectId, dataset, documents }, null, 2));
  const payload = resolve(folder, "mutations.json");
  writeFileSync(payload, JSON.stringify({ mutations }));
  const response = api("data/mutate/{dataset}", ["-X", "POST", "--input", payload, "-H", "Content-Type: application/json"]);
  console.log(JSON.stringify({ transactionId: response.transactionId, backup: folder, updated: response.results?.length }));
}
