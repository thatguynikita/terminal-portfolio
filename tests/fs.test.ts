import { describe, expect, it, vi } from "vitest";
import { createFileSystem } from "../src/fs";
import { createFakeContext } from "./helpers";
import { skillsFor, socialsFor } from "../src/core/profile";
import profile from "../profile.config";
import gameFile from "../src/fs/game.sh";
import gameCommand from "../src/commands/game";
import { messages } from "../src/i18n";

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
    if (profile.commands?.game) expect(names).toContain(profile.commands?.game.script);
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

  /** Size must track what `cat` shows, not the <span>/<a> wrappers a rendered file adds. */
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
      if (!profile.commands?.game) return;
      expect(await fs.run(profile.commands?.game.script)).toBe("denied");
      expect(await fs.run(profile.commands?.game.script, { sudo: true })).toBe("ok");
    });
  });
});

/**
 * The launcher's name is `game.script` from the config, and both the file
 * and the `game` command exist only when a game is configured. `enabled`
 * and `name` are decided at module load from the real config, so these are
 * asserted on the modules themselves — that is the wiring, tested as wiring.
 */
describe("game launcher", () => {
  it("takes its filename from game.script", () => {
    expect(gameFile.name).toBe(profile.commands?.game?.script ?? "game.sh");
  });

  it("exists exactly when a game is configured — file and command alike", () => {
    expect(gameFile.enabled).toBe(Boolean(profile.commands?.game));
    expect(gameCommand.enabled).toBe(Boolean(profile.commands?.game));
  });

  it("names itself in its own header line, from a placeholder", () => {
    if (!profile.commands?.game) return;
    const lines = fs.read(profile.commands?.game.script) ?? [];
    expect(lines[1]).toContain(profile.commands?.game.script);
    // Templated, not hardcoded: the catalogue carries {script}, so a fork's
    // name lands here without touching the messages.
    for (const [code, catalogue] of Object.entries(messages)) {
      expect(catalogue.files.game[1], `${code} hardcodes the launcher name`).toContain("{script}");
    }
  });

  it("is what the .bashrc game alias points at", () => {
    const lines = (fs.read(".bashrc") ?? []).map((l) => l.replace(/<[^>]+>/g, ""));
    // Exactly one, or none — a static copy left in the plain file alongside
    // the configured one would be two.
    const aliases = lines.filter((l) => l.startsWith("alias game="));
    if (profile.commands?.game) expect(aliases).toEqual([`alias game='sudo ./${profile.commands?.game.script}'`]);
    else expect(aliases, "a game alias with no game configured").toEqual([]);
  });

  it("keeps .bashrc's ls size honest about the alias line", () => {
    const node = fs.get(".bashrc");
    const visible = (fs.read(".bashrc") ?? []).map((l) => l.replace(/<[^>]+>/g, "")).join("\n");
    expect(node?.size).toBe(new TextEncoder().encode(visible).length);
  });
});

/**
 * "Omit `game` to remove both" — tested for real, with the config mocked
 * so `game` is absent, since `enabled` is fixed at module load and can't be
 * toggled through a fake context. This is the first test of the
 * optional-feature path; the CV's equivalent is only ever exercised by
 * whichever config happens to be live.
 */
describe("game launcher, with no game configured", () => {
  it("registers neither the file nor the command", async () => {
    vi.resetModules();
    vi.doMock("../profile.config", async () => {
      const real = await vi.importActual<typeof import("../profile.config")>("../profile.config");
      const { game: _game, ...commands } = real.default.commands ?? {};
      return { ...real, default: { ...real.default, commands } };
    });
    const file = (await import("../src/fs/game.sh")).default;
    const command = (await import("../src/commands/game")).default;
    expect(file.enabled).toBe(false);
    expect(command.enabled).toBe(false);
    vi.doUnmock("../profile.config");
    vi.resetModules();
  });
});

/**
 * The other optional blocks, the same way: with the config mocked so the
 * block is absent, the command and the file that read it are unregistered.
 */
describe("optional blocks, with each omitted", () => {
  const withoutKey = async (key: "neofetch" | "bio" | "skills" | "socials") => {
    vi.resetModules();
    vi.doMock("../profile.config", async () => {
      const real = await vi.importActual<typeof import("../profile.config")>("../profile.config");
      const { [key]: _gone, ...rest } = real.default;
      // skills/socials resolve to [] in a real defineProfile call; mirror that.
      const patched = key === "skills" || key === "socials" ? { ...rest, [key]: [] } : rest;
      return { ...real, default: patched };
    });
  };
  const restore = () => {
    vi.doUnmock("../profile.config");
    vi.resetModules();
  };

  it("no neofetch: the command is unregistered", async () => {
    await withoutKey("neofetch");
    const command = (await import("../src/commands/neofetch")).default;
    expect(command.enabled).toBe(false);
    restore();
  });

  it("no bio: neither `about` nor about.txt", async () => {
    await withoutKey("bio");
    expect((await import("../src/commands/about")).default.enabled).toBe(false);
    expect((await import("../src/fs/about.txt")).default.enabled).toBe(false);
    restore();
  });

  it("no skills: neither `skills` nor skills.txt", async () => {
    await withoutKey("skills");
    expect((await import("../src/commands/skills")).default.enabled).toBe(false);
    expect((await import("../src/fs/skills.txt")).default.enabled).toBe(false);
    restore();
  });

  it("no socials: neither `contact` nor contact.txt", async () => {
    await withoutKey("socials");
    expect((await import("../src/commands/contact")).default.enabled).toBe(false);
    expect((await import("../src/fs/contact.txt")).default.enabled).toBe(false);
    restore();
  });

  it("with everything present, all of them are registered", async () => {
    vi.resetModules();
    for (const m of ["../src/commands/neofetch", "../src/commands/about", "../src/commands/skills", "../src/commands/contact"]) {
      expect((await import(m)).default.enabled, m).not.toBe(false);
    }
  });
});
