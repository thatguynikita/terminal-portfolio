import { describe, expect, it } from "vitest";
import { createFileSystem } from "../src/fs";
import { createFakeContext } from "./helpers";

const ctx = createFakeContext("en");
const fs = createFileSystem(() => ctx);
const nodes = fs.list({ all: true });

describe("filesystem", () => {
  it("discovers both plain files and descriptors", () => {
    const names = nodes.map((n) => n.name);
    // A plain dotfile, proving the dotfile glob patterns work.
    expect(names).toContain(".bashrc");
    // Descriptor-backed, rendered from profile.config.ts.
    expect(names).toContain("about.txt");
    expect(names).toContain("skills.txt");
    expect(names).toContain("contact.txt");
    expect(names).toContain("milk-quest.sh");
  });

  it("never surfaces the loader's own modules as files", () => {
    const names = nodes.map((n) => n.name);
    expect(names).not.toContain("index.ts");
    expect(names).not.toContain("define.ts");
    for (const name of names) expect(name.endsWith(".ts")).toBe(false);
  });

  it("gives every node a real, non-zero size", () => {
    for (const node of nodes) {
      expect(node.size, `${node.name} has no size`).toBeGreaterThan(0);
    }
  });

  it("hides dotfiles from a plain listing", () => {
    expect(fs.list().map((n) => n.name)).not.toContain(".bashrc");
    expect(fs.list({ all: true }).map((n) => n.name)).toContain(".bashrc");
  });

  it("marks executables with an x permission bit and accents them", () => {
    for (const node of nodes) {
      if (node.exec) {
        expect(node.perms, `${node.name} is executable but not marked`).toContain("x");
        expect(node.accent).toBe(true);
      } else {
        expect(node.perms).not.toContain("x");
      }
    }
  });

  it("reads text files as lines", () => {
    expect(fs.read("skills.txt")?.length).toBe(ctx.profile.skills.length);
    expect(fs.read(".bashrc")?.[0]).toContain("~/.bashrc");
  });

  it("reports a missing file as undefined, not null", () => {
    expect(fs.read("nope.txt")).toBeUndefined();
  });

  describe("run", () => {
    it("refuses a file that does not exist", async () => {
      expect(await fs.run("nope.sh")).toBe("not-found");
    });

    it("refuses a file with no exec", async () => {
      expect(await fs.run("about.txt")).toBe("not-executable");
    });

    it("denies a sudo-gated file without sudo, and allows it with", async () => {
      expect(await fs.run("milk-quest.sh")).toBe("denied");
      expect(await fs.run("milk-quest.sh", { sudo: true })).toBe("ok");
    });
  });
});
