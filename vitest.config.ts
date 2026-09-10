import { defineConfig } from "vitest/config";
import profile from "./profile.config";
import { cvByteSize } from "./src/cv/render";

export default defineConfig({
  define: {
    __CV_BYTES__: JSON.stringify(profile.cv ? cvByteSize(profile, profile.terminal.defaultLocale) : 0),
  },
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["tests/**/*.test.ts"],
  },
});
