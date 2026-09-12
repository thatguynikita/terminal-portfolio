/**
 * The pixel pipeline behind the CV portrait.
 *
 * Any photo dropped into portraits/ should read as part of the terminal —
 * flat posterized greys in chunky blocks — without a fork having to
 * pre-process it. The blocks come for free from drawing the image small and
 * letting CSS scale it back up with `image-rendering: pixelated`; this
 * function does the rest on the small buffer.
 *
 * It takes a raw RGBA buffer rather than a canvas deliberately: happy-dom has
 * no 2D context, so this is the part that can be unit-tested, and the canvas
 * glue in cv.ts stays thin enough to verify by screenshot.
 */

/** Rec. 601 luma — the same weights `grayscale()` in CSS uses. */
function luma(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Luminance → stretched to the full 0–255 range → snapped to `levels`
 * evenly spaced greys, written back over R, G and B. Alpha is untouched.
 *
 * The stretch matters for arbitrary uploads: a soft studio headshot may
 * only use the middle of the range, and posterizing that without stretching
 * collapses the face into two tones.
 */
export function posterizeGray(rgba: Uint8ClampedArray, levels: number): void {
  const steps = Math.max(1, Math.floor(levels));
  const n = rgba.length / 4;
  if (n === 0) return;

  const grey = new Float32Array(n);
  let lo = 255;
  let hi = 0;
  for (let i = 0; i < n; i++) {
    const y = luma(rgba[i * 4] as number, rgba[i * 4 + 1] as number, rgba[i * 4 + 2] as number);
    grey[i] = y;
    if (y < lo) lo = y;
    if (y > hi) hi = y;
  }
  const span = hi - lo || 1;

  for (let i = 0; i < n; i++) {
    const stretched = ((grey[i] as number) - lo) / span; // 0..1
    // Quantise to `steps` bands, then place each band at an even grey.
    const band = Math.min(steps - 1, Math.floor(stretched * steps));
    const value = steps === 1 ? 128 : Math.round((band / (steps - 1)) * 255);
    rgba[i * 4] = value;
    rgba[i * 4 + 1] = value;
    rgba[i * 4 + 2] = value;
  }
}
