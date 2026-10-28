/**
 * Turns the logo into particle buffers.
 *
 * The logo is a single stroked polyline (a "<" chevron with a short tail).
 * Particles are laid out on an evenly spaced, staggered (hex) lattice clipped
 * to the stroke, so the density is uniform and the joins and caps are rounded.
 * Depth follows a rounded tube profile for a realistic sense of volume.
 *
 * `count` is a target: the real number of particles depends on the lattice,
 * so it lands within a few percent of it.
 *
 * To use a different logo: replace POLYLINE / STROKE (or add more polylines).
 */

export const LOGO_HEIGHT = 2.4;  // world units — tweak to resize the logo
export const LOGO_DEPTH = 0.3;   // total thickness at the stroke centerline

// Centerline points in artwork pixels (x right, y down)
const POLYLINE: ReadonlyArray<readonly [number, number]> = [
  [340, 430], // lower arm end
  [155, 250], // left vertex
  [340, 70],  // top vertex
  [395, 120], // short tail end
];
const STROKE = 28;   // stroke width in artwork pixels
const JITTER = 0.12; // lattice jitter as a fraction of spacing (0 = perfect grid)

export interface LogoParticleBuffers {
  targets: Float32Array; // where each particle rests (the logo shape)
  starts: Float32Array;  // scattered origin each particle assembles from
  seeds: Float32Array;   // per-particle randoms: x=delay, y=color mix, z=size
}

// Small seeded PRNG so the layout is identical on every render / reload
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildLogoParticles(count: number, seed = 11): LogoParticleBuffers {
  const rand = mulberry32(seed);

  // Centerline in world space (centered, scaled, y flipped)
  const xs = POLYLINE.map((p) => p[0]);
  const ys = POLYLINE.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const scale = LOGO_HEIGHT / (Math.max(...ys) - Math.min(...ys));
  const hs = (STROKE * scale) / 2; // half stroke width

  const pts = POLYLINE.map((p) => ({
    x: (p[0] - cx) * scale,
    y: -(p[1] - cy) * scale,
  }));

  // Distance from a point to the whole polyline
  const distToLine = (px: number, py: number) => {
    let best = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const abx = b.x - a.x;
      const aby = b.y - a.y;
      const t = Math.max(
        0,
        Math.min(1, ((px - a.x) * abx + (py - a.y) * aby) / (abx * abx + aby * aby))
      );
      best = Math.min(best, Math.hypot(px - (a.x + abx * t), py - (a.y + aby * t)));
    }
    return best;
  };

  // Approximate stroke area → lattice spacing that yields ~`count` points
  let length = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    length += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
  }
  const area = length * 2 * hs + Math.PI * hs * hs;
  const spacing = Math.sqrt(area / (count * (Math.sqrt(3) / 2)));
  const rowStep = spacing * (Math.sqrt(3) / 2);

  // Lattice over the padded bounding box, keeping points inside the stroke
  const minX = Math.min(...pts.map((p) => p.x)) - hs;
  const maxX = Math.max(...pts.map((p) => p.x)) + hs;
  const minY = Math.min(...pts.map((p) => p.y)) - hs;
  const maxY = Math.max(...pts.map((p) => p.y)) + hs;

  const kept: { x: number; y: number; z: number }[] = [];
  let row = 0;
  for (let y = minY; y <= maxY; y += rowStep, row++) {
    const xOffset = row % 2 ? spacing / 2 : 0;
    for (let x = minX + xOffset; x <= maxX; x += spacing) {
      const jx = x + (rand() * 2 - 1) * spacing * JITTER;
      const jy = y + (rand() * 2 - 1) * spacing * JITTER;
      const d = distToLine(jx, jy);
      if (d > hs) continue;

      // Rounded tube profile: thick at the centerline, tapering at the edges
      const profile = Math.sqrt(Math.max(0, 1 - (d / hs) * (d / hs)));
      const z = (rand() * 2 - 1) * (LOGO_DEPTH / 2) * profile;
      kept.push({ x: jx, y: jy, z });
    }
  }

  const n = kept.length;
  const targets = new Float32Array(n * 3);
  const starts = new Float32Array(n * 3);
  const seeds = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    targets[i * 3] = kept[i].x;
    targets[i * 3 + 1] = kept[i].y;
    targets[i * 3 + 2] = kept[i].z;

    // Scattered start: random positions across the viewport plane
    starts[i * 3]     = (rand() * 2 - 1) * 6.0;
    starts[i * 3 + 1] = (rand() * 2 - 1) * 4.5;
    starts[i * 3 + 2] = (rand() - 0.5) * 1.5;

    seeds[i * 3] = rand();
    seeds[i * 3 + 1] = rand();
    seeds[i * 3 + 2] = rand();
  }

  return { targets, starts, seeds };
}