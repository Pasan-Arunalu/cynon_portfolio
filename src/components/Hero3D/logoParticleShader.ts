/**
 * GPU shaders for the logo particles.
 *
 * Uniforms
 *   uTime        — elapsed seconds
 *   uProgress    — 0 → 1 assemble animation
 *   uBurst       — unused now (click burst removed), kept at 0
 *   uMouse       — cursor in object-local space
 *   uMouseActive — 0 → 1 smoothed, fades when cursor leaves
 *   uRadius      — hover influence radius
 *   uStrength    — push magnitude
 *   uSize        — base point size
 *   uPixelRatio  — device pixel ratio
 *   uIdle        — 0 → 1 idle (driven after assembly)
 *   uColorA      — primary particle color (theme-aware)
 *   uColorB      — accent particle color  (theme-aware)
 *   uDark        — 1 = dark theme, 0 = light theme
 *
 * Attributes
 *   position — resting target on the logo
 *   aStart   — scattered origin for assemble
 *   aSeed    — x: assemble delay, y: color mix, z: size variation
 */

export const logoVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uBurst;
uniform vec3  uMouse;
uniform float uMouseActive;
uniform float uRadius;
uniform float uStrength;
uniform float uSize;
uniform float uPixelRatio;
uniform float uIdle;
uniform vec3  uColorA;
uniform vec3  uColorB;

attribute vec3 aStart;
attribute vec3 aSeed;

varying float vMix;
varying float vGlow;
varying float vSheen;
varying float vProgress;
varying float vDepth;

// ── easing ------------------------------------------------------------------

float easeOutCubic(float t) {
  float f = 1.0 - t;
  return 1.0 - f * f * f;
}

float easeOutBack(float t) {
  const float c1 = 1.70158;
  const float c3 = c1 + 1.0;
  float f = t - 1.0;
  return 1.0 + c3 * f * f * f + c1 * f * f;
}

// ── main --------------------------------------------------------------------

void main() {
  // ── 1. Assemble: particles fly from their random start positions to the logo.
  float delay = aSeed.x * 0.50;
  float t     = clamp((uProgress - delay) / (1.0 - 0.50), 0.0, 1.0);

  float tBack  = easeOutBack(clamp(t, 0.0, 1.0));
  float tCubic = easeOutCubic(t);

  vec3 pos = mix(aStart, position, tBack);

  // ── 2. Idle: a soft band of light sweeps diagonally across the logo.
  //      Nothing moves, so the shape stays crisp.
  float axis  = position.x * 0.8 + position.y * 0.6;
  float sweep = mix(-2.6, 2.6, fract(uTime / 6.0));
  float band  = (axis - sweep) / 0.32;
  float sheen = exp(-band * band) * uIdle;

  // ── 3. Click burst (inactive: uBurst stays 0, kept for uniform compatibility)
  pos += normalize(aStart - position + 1e-3) * uBurst * (0.8 + aSeed.z * 1.6);

  // ── 4. Mouse: soft magnetic repulsion, gentle swirl, subtle depth lift
  vec2  delta = pos.xy - uMouse.xy;
  float dist  = length(delta);

  float t_f   = clamp(1.0 - dist / uRadius, 0.0, 1.0);
  float f     = t_f * t_f * (3.0 - 2.0 * t_f) * uMouseActive;
  vec2  n     = delta / max(dist, 1e-4);

  float push  = pow(f, 1.5) * uStrength;
  pos.xy += n * push;
  pos.xy += vec2(-n.y, n.x) * f * 0.09;
  pos.z  += f * 0.18;

  // Depth of the resting point within the slab: 0 = back, 1 = front
  float depth = clamp(position.z / 0.3 + 0.5, 0.0, 1.0);

  vMix      = aSeed.y;
  vGlow     = f;
  vSheen    = sheen;
  vProgress = tCubic;
  vDepth    = depth;

  vec4  mv = modelViewMatrix * vec4(pos, 1.0);

  // Size: low variation for a clean look; front particles slightly larger
  float sizeBase  = uSize * uPixelRatio * (0.75 + 0.35 * aSeed.z);
  float sizeDepth = 0.85 + 0.30 * depth;
  float sizeWave  = 1.0 + sheen * 0.25;
  float sizeHover = 1.0 + f * 0.7;
  float sizeFade  = 0.25 + 0.75 * tCubic;
  gl_PointSize = sizeBase * sizeDepth * sizeWave * sizeHover * sizeFade / -mv.z;
  gl_Position  = projectionMatrix * mv;
}
`;

export const logoFragmentShader = /* glsl */ `
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform float uDark;

varying float vMix;
varying float vGlow;
varying float vSheen;
varying float vProgress;
varying float vDepth;

void main() {
  // Crisp circular sprite with a thin soft edge
  float d     = length(gl_PointCoord - 0.5);
  float alpha = 1.0 - smoothstep(0.30, 0.50, d);
  if (alpha < 0.04) discard;

  // Base color from per-particle seed mix
  vec3 col = mix(uColorA, uColorB, smoothstep(0.35, 0.75, vMix));

  // Hover: subtle brightening
  col = mix(col, uColorB * 1.35, vGlow * 0.55);
  col += uColorB * (vGlow * 0.18);

  // Idle sheen: shift toward a lighter tint as the band passes
  vec3 tint = mix(vec3(0.50, 0.53, 0.95), vec3(0.85, 0.87, 1.0), uDark);
  col = mix(col, tint, vSheen * 0.65);

  // Depth shading: back particles recede, front ones read fully
  alpha *= mix(0.55, 1.0, vDepth);

  // Assembly fade-in
  float fadeIn = smoothstep(0.0, 0.12, vProgress);
  alpha *= fadeIn;

  float alphaOut = alpha * mix(0.95, 0.90 + vGlow * 0.10, uDark);

  gl_FragColor = vec4(col, alphaOut);
}
`;