import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import profile from "./profile.config";
import { cvByteSize } from "./src/cv/render";

// The discovery suite compares dist/ against SITE_URL, and vite.config.ts
// reads SITE_URL from .env when the shell doesn't set it — so the tests
// must see the same value, or a locally built dist/ looks wrong to them.
// Assigned only when the file has it: `process.env.X = undefined` stores the
// string "undefined", which would read as "set" to every guard downstream.
const fromEnvFile = loadEnv("production", process.cwd(), "")["SITE_URL"];
if (!process.env["SITE_URL"] && fromEnvFile) process.env["SITE_URL"] = fromEnvFile;

export default defineConfig({
  define: {
    __SITE_URL__: JSON.stringify((process.env["SITE_URL"] ?? "").replace(/\/$/, "")),
    __CV_BYTES__: JSON.stringify(profile.cv ? cvByteSize(profile, profile.terminal.defaultLocale) : 0),
  },
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["tests/**/*.test.ts"],
  },
});
