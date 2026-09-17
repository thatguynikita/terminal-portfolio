import { describe, expect, it } from "vitest";
import { posterizeGray } from "../src/cv/portrait.ts";

/**
 * The portrait pipeline is a pure function over an RGBA buffer precisely so
 * it can be tested here — happy-dom has no canvas 2D context. The canvas
 * glue in src/cv.ts is verified by screenshot instead.
 */

/** A w×1 strip of greys, one pixel per value in `values`. */
function strip(values: number[], alpha = 255): Uint8ClampedArray {
  const out = new Uint8ClampedArray(values.length * 4);
  values.forEach((v, i) => {
    out[i * 4] = v;
    out[i * 4 + 1] = v;
    out[i * 4 + 2] = v;
    out[i * 4 + 3] = alpha;
  });
  return out;
}

const greys = (rgba: Uint8ClampedArray): number[] =>
  Array.from({ length: rgba.length / 4 }, (_, i) => rgba[i * 4] as number);

const distinct = (rgba: Uint8ClampedArray): number[] =>
  [...new Set(greys(rgba))].sort((a, b) => a - b);

describe("posterizeGray", () => {
  it("collapses a full gradient to exactly `levels` greys", () => {
    for (const levels of [2, 4, 6, 8]) {
      const buf = strip(Array.from({ length: 256 }, (_, i) => i));
      posterizeGray(buf, levels);
      expect(distinct(buf), `levels=${levels}`).toHaveLength(levels);
    }
  });

  it("spaces the levels evenly from black to white", () => {
    const buf = strip(Array.from({ length: 256 }, (_, i) => i));
    posterizeGray(buf, 6);
    expect(distinct(buf)).toEqual([0, 51, 102, 153, 204, 255]);
  });

  it("writes true grey — R, G and B equal for every pixel", () => {
    const buf = new Uint8ClampedArray([200, 30, 90, 255, 10, 240, 60, 255, 128, 128, 128, 255]);
    posterizeGray(buf, 4);
    for (let i = 0; i < buf.length; i += 4) {
      expect(buf[i]).toBe(buf[i + 1]);
      expect(buf[i]).toBe(buf[i + 2]);
    }
  });

  it("leaves alpha byte-for-byte unchanged", () => {
    const buf = strip([0, 64, 128, 192, 255], 77);
    posterizeGray(buf, 3);
    for (let i = 3; i < buf.length; i += 4) expect(buf[i]).toBe(77);
  });

  // A soft studio headshot lives in the middle of the range. Without the
  // stretch, posterizing it collapses the face into two tones.
  it("stretches a narrow-range input to use black and white", () => {
    const buf = strip(Array.from({ length: 81 }, (_, i) => 40 + i)); // 40..120
    posterizeGray(buf, 6);
    const out = distinct(buf);
    expect(out[0]).toBe(0);
    expect(out[out.length - 1]).toBe(255);
    expect(out).toHaveLength(6);
  });

  it("is monotonic — a lighter input never comes out darker", () => {
    const input = Array.from({ length: 256 }, (_, i) => i);
    const buf = strip(input);
    posterizeGray(buf, 5);
    const out = greys(buf);
    for (let i = 1; i < out.length; i++)
      expect(out[i]).toBeGreaterThanOrEqual(out[i - 1] as number);
  });

  it("survives the degenerate cases", () => {
    // levels = 1: everything one mid grey, no division by zero
    const one = strip([0, 100, 255]);
    posterizeGray(one, 1);
    expect(distinct(one)).toEqual([128]);

    // a flat image: span is 0, must not produce NaN
    const flat = strip([90, 90, 90, 90]);
    posterizeGray(flat, 4);
    expect(distinct(flat)).toHaveLength(1);
    expect(Number.isNaN(flat[0])).toBe(false);

    // empty buffer
    const empty = new Uint8ClampedArray(0);
    expect(() => posterizeGray(empty, 4)).not.toThrow();
  });

  it("is the identity at 256 levels on a full-range grey ramp", () => {
    const ramp = Array.from({ length: 256 }, (_, i) => i);
    const buf = strip(ramp);
    posterizeGray(buf, 256);
    expect(greys(buf)).toEqual(ramp);
  });
});
