// Simplex noise implementation for GLSL (Ashima Arts)
export const simplexNoise3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = vec3(snoise(p - dx), snoise(p - dx + vec3(43.1, 12.3, 84.4)), snoise(p - dx + vec3(93.4, 34.2, 12.9)));
  vec3 p_x1 = vec3(snoise(p + dx), snoise(p + dx + vec3(43.1, 12.3, 84.4)), snoise(p + dx + vec3(93.4, 34.2, 12.9)));
  vec3 p_y0 = vec3(snoise(p - dy), snoise(p - dy + vec3(43.1, 12.3, 84.4)), snoise(p - dy + vec3(93.4, 34.2, 12.9)));
  vec3 p_y1 = vec3(snoise(p + dy), snoise(p + dy + vec3(43.1, 12.3, 84.4)), snoise(p + dy + vec3(93.4, 34.2, 12.9)));
  vec3 p_z0 = vec3(snoise(p - dz), snoise(p - dz + vec3(43.1, 12.3, 84.4)), snoise(p - dz + vec3(93.4, 34.2, 12.9)));
  vec3 p_z1 = vec3(snoise(p + dz), snoise(p + dz + vec3(43.1, 12.3, 84.4)), snoise(p + dz + vec3(93.4, 34.2, 12.9)));

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  return normalize(vec3(x, y, z) / (2.0 * e));
}
`;

export const vertexShader = /* glsl */ `
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

${simplexNoise3D}

void main() {
  vUv = uv;
  vec3 pos = position;

  float angle = uTime * 0.05;
  mat3 rotY = mat3(
    cos(angle), 0.0, sin(angle),
    0.0, 1.0, 0.0,
    -sin(angle), 0.0, cos(angle)
  );
  mat3 rotX = mat3(
    1.0, 0.0, 0.0,
    0.0, cos(angle * 0.3), -sin(angle * 0.3),
    0.0, sin(angle * 0.3), cos(angle * 0.3)
  );

  vec3 rotatedPos = rotY * rotX * pos;

  float noiseFreq = 0.8;
  float noiseAmp = 0.25;
  vec3 finalPos = rotatedPos + curlNoise(rotatedPos * noiseFreq + uTime * 0.1) * noiseAmp;
  vPosition = finalPos;

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_PointSize = (6.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uColor;

varying vec3 vPosition;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

  if (alpha < 0.05) discard;

  float depthFade = smoothstep(-2.0, 2.0, vPosition.z);
  float depthAlpha = mix(0.25, 1.0, depthFade);

  gl_FragColor = vec4(uColor, alpha * depthAlpha * 0.9);
}
`;
