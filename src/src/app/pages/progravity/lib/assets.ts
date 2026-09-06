// Asset host for the ProGravity build. Nothing is fetched from Angular's own
// public/ folder at runtime -- every path below is relative to the R2 bucket.
const R2_BASE = 'https://pub-36eefd528bbb4e28bdef0ce39a1018e0.r2.dev/Prompt/43-progravity/public';

export const asset = (path: string) => `${R2_BASE}${path}`;

// The "O" pill's inner-shadow mask (EFFECT-09). Must stay an embedded data: URI --
// Chrome silently drops a cross-origin SVG referenced via mask-image.
export const PILL_MASK =
  "data:image/svg+xml,%3Csvg preserveAspectRatio='none' overflow='visible' width='548.604' height='115.93' viewBox='0 0 548.604 115.93' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10.5' y='10.5' width='527.604' height='94.9297' rx='44.5' stroke='white' stroke-width='21'/%3E%3C/svg%3E";
