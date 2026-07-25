import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const staticOutput = resolve(root, "out");
const deploymentOutput = resolve(root, "dist");

await rm(deploymentOutput, { recursive: true, force: true });
await mkdir(resolve(deploymentOutput, "client"), { recursive: true });
await mkdir(resolve(deploymentOutput, "server"), { recursive: true });
await cp(staticOutput, resolve(deploymentOutput, "client"), { recursive: true });
await cp(
  resolve(root, "hosting", "worker.js"),
  resolve(deploymentOutput, "server", "index.js")
);
