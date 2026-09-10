import { describe, expect, it } from "vitest";
import { createFileSystem } from "../src/fs";
import { createFakeContext } from "./helpers";
import { skillsFor, socialsFor } from "../src/core/profile";

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

  /**
   * `ls` used to count the <span>/<a> wrappers a rendered file adds,
   * reporting contact.txt as 950 bytes for 184 bytes of visible text.
   * Size must track what `cat` shows, not how it is marked up.
   */
  describe("size", () => {
    const bytes = (s: string): number => new TextEncoder().encode(s).length;
    const stripped = (s: string): string =>
      s
        .replace(/<[^>]*>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&");

    it("never counts presentation markup", () => {
      for (const node of nodes) {
        const lines = node.read?.(ctx);
        if (!lines) continue;
        const rendered = lines.join("\n");
        if (!rendered.includes("<")) continue;
        expect(node.size, `${node.name} counts its markup`).toBeLessThan(bytes(rendered));
      }
    });

    it("tracks the visible text of every node", () => {
      for (const node of nodes) {
        const lines = node.read?.(ctx);
        if (!lines) continue;
        const visible = bytes(stripped(lines.join("\n")));
        // Plain files measure the bytes on disk, which carry a trailing
        // newline that `cat` trims — hence the one-byte tolerance.
        expect(
          Math.abs(node.size - visible),
          `${node.name}: size ${node.size} vs ${visible} bytes of visible text`
        ).toBeLessThanOrEqual(1);
      }
    });

    it("reports a plain file's real size on disk", () => {
      // .bashrc is a real file; its size is the file's, not the rendered
      // form's (which adds dim spans around the comment lines).
      const bashrc = nodes.find((n) => n.name === ".bashrc")!;
      const rendered = bashrc.read!(ctx)!.join("\n");
      expect(bashrc.size).toBeGreaterThan(0);
      expect(bashrc.size).not.toBe(bytes(rendered));
    });

    it("matches the byte count a reader could verify by hand", () => {
      // contact.txt renders one "Label: display" line per social link.
      const contact = nodes.find((n) => n.name === "contact.txt")!;
      const expected = socialsFor(ctx.profile, "terminal")
        .map((s) => `${s.label}: ${s.display}`)
        .join("\n");
      expect(contact.size).toBe(bytes(expected));
    });
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
    expect(fs.read("skills.txt")?.length).toBe(skillsFor(ctx.profile, "terminal").length);
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
