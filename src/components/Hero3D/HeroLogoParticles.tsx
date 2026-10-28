import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { buildLogoParticles } from './logoGeometry';
import { logoVertexShader, logoFragmentShader } from './logoParticleShader';

/* -------------------------------------------------------------------------- */
/*  Tunables                                                                    */
/* -------------------------------------------------------------------------- */

const PARTICLE_COUNT = 1200;
const ASSEMBLE_SECONDS = 2.6;
const MOUSE_RADIUS = 1.0;   // world-unit radius of hover influence
const MOUSE_STRENGTH = 0.45;  // push magnitude — softened
const PARALLAX = { y: 0.22, x: 0.12 };

// Logo bounding box in world space (must match LOGO_HEIGHT in logoGeometry.ts)
// Used to guard hover: only activate when cursor is actually over the logo.
const LOGO_HALF_W = 1.4;  // half-width  (X)
const LOGO_HALF_H = 1.4;  // half-height (Y)
// Hover only engages after this fraction of assembly is complete
const HOVER_GATE = 0.96;

/* -------------------------------------------------------------------------- */
/*  Theme colors                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Color strategy:
 *   Dark theme  → AdditiveBlending. Colors add on top of the dark background
 *                  so they need to be bright. Use brand-light / a boosted variant.
 *   Light theme → NormalBlending.   Particles render with full opacity over white
 *                  so we can use the deep brand-accent / brand-hover.
 */
const THEME = {
  dark: {
    colorA: new THREE.Color('#4A4EC4'),
    colorB: new THREE.Color('#7B7FE8'),
    blending: THREE.AdditiveBlending,
    dark: 1,
  },
  light: {
    colorA: new THREE.Color('#30338A'),
    colorB: new THREE.Color('#252769'),
    blending: THREE.NormalBlending,
    dark: 0,
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                       */
/* -------------------------------------------------------------------------- */

function usePointerState() {
  const active = useRef(false);
  useEffect(() => {
    const move = () => { active.current = true; };
    const leave = () => { active.current = false; };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);
  return active;
}

/**
 * Pointer position in NDC (-1..1) relative to the canvas element itself,
 * regardless of what the canvas's eventSource is or what sits on top of it.
 * Works even when the cursor is outside the canvas (values go beyond ±1).
 */
function useCanvasPointer() {
  const gl = useThree((s) => s.gl);
  const ndc = useRef(new THREE.Vector2(0, 0));
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      if (!r.width || !r.height) return;
      ndc.current.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      );
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [gl]);
  return ndc;
}

/**
 * Watches `<html class>` for the `.dark` class via MutationObserver.
 * Returns a stable ref (no re-renders) that is always up to date.
 */
function useDarkTheme() {
  const isDark = useRef(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => {
      isDark.current = document.documentElement.classList.contains('dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                   */
/* -------------------------------------------------------------------------- */

interface HeroLogoParticlesProps {
  position?: [number, number, number];
  count?: number;
}

export function HeroLogoParticles({
  position = [0, 0, 0],
  count = PARTICLE_COUNT,
}: HeroLogoParticlesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const ptsRef = useRef<THREE.Points>(null);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const isDark = useDarkTheme();
  const ndc = useCanvasPointer();

  const { targets, starts, seeds } = useMemo(() => buildLogoParticles(count), [count]);

  // Initial theme snapshot
  const initTheme = isDark.current ? THEME.dark : THEME.light;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uBurst: { value: 0 },
    uMouse: { value: new THREE.Vector3(999, 999, 0) },
    uMouseActive: { value: 0 },
    uRadius: { value: MOUSE_RADIUS },
    uStrength: { value: MOUSE_STRENGTH },
    uSize: { value: 11 },
    uPixelRatio: { value: 1 },
    uIdle: { value: 0 },
    uDark: { value: initTheme.dark },
    uColorA: { value: initTheme.colorA.clone() },
    uColorB: { value: initTheme.colorB.clone() },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const progress = useRef(reducedMotion ? 1 : 0);
  const mouseActive = useRef(0);
  const mouseLocal = useRef(new THREE.Vector3(999, 999, 0));
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), -position[2]),
    [position]
  );
  // Track last known theme so we only update blending when it actually changes
  const lastDark = useRef(isDark.current);

  const pointerActive = usePointerState();

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const mat = matRef.current;
    const grp = groupRef.current;
    const pts = ptsRef.current;
    if (!mat || !grp) return;

    // ── Assembly & idle
    progress.current = Math.min(1, progress.current + d / ASSEMBLE_SECONDS);
    mat.uniforms.uProgress.value = progress.current;

    const idleTarget = progress.current > 0.92 ? 1 : 0;
    mat.uniforms.uIdle.value = THREE.MathUtils.damp(
      mat.uniforms.uIdle.value, idleTarget, 1.8, d
    );

    // ── Time
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();

    // ── Theme switch (instantaneous on class change, smooth color lerp each frame)
    const dark = isDark.current;
    const theme = dark ? THEME.dark : THEME.light;

    mat.uniforms.uColorA.value.lerp(theme.colorA, 0.06);
    mat.uniforms.uColorB.value.lerp(theme.colorB, 0.06);
    mat.uniforms.uDark.value = dark ? 1 : 0;

    // Blending mode must be set on the material and requires needsUpdate
    if (pts && dark !== lastDark.current) {
      mat.blending = theme.blending;
      lastDark.current = dark;
    }

    // ── Mouse: only track & activate hover once assembly is nearly done
    //    AND the cursor is actually within the logo's bounding box in world space.
    //    Uses canvas-relative NDC so it works with any eventSource / overlays.
    state.raycaster.setFromCamera(ndc.current, state.camera);
    const assemblyReady = progress.current >= HOVER_GATE;

    if (assemblyReady && state.raycaster.ray.intersectPlane(plane, scratch)) {
      grp.worldToLocal(scratch);

      const overLogo =
        Math.abs(scratch.x) < LOGO_HALF_W &&
        Math.abs(scratch.y) < LOGO_HALF_H;

      if (overLogo) {
        mouseLocal.current.x = THREE.MathUtils.damp(mouseLocal.current.x, scratch.x, 8, d);
        mouseLocal.current.y = THREE.MathUtils.damp(mouseLocal.current.y, scratch.y, 8, d);
        mat.uniforms.uMouse.value.copy(mouseLocal.current);
      }

      const wantActive = pointerActive.current && overLogo;
      const dampSpeed = wantActive ? 3.0 : 4.0;
      mouseActive.current = THREE.MathUtils.damp(
        mouseActive.current, wantActive ? 1 : 0, dampSpeed, d
      );
    } else if (!assemblyReady) {
      // Hard-zero during assembly — no hover bleed whatsoever
      mouseActive.current = 0;
    } else {
      // Cursor left the logo area — fade out gently
      mouseActive.current = THREE.MathUtils.damp(mouseActive.current, 0, 4.0, d);
    }
    mat.uniforms.uMouseActive.value = mouseActive.current;

    // ── Parallax tilt (only after assembly so the logo isn't tilting mid-flight)
    //    Clamped so the tilt stays subtle when the cursor is far from the canvas.
    if (!reducedMotion && assemblyReady) {
      const px = THREE.MathUtils.clamp(ndc.current.x, -1, 1);
      const py = THREE.MathUtils.clamp(ndc.current.y, -1, 1);
      grp.rotation.y = THREE.MathUtils.damp(grp.rotation.y, px * PARALLAX.y, 3, d);
      grp.rotation.x = THREE.MathUtils.damp(grp.rotation.x, -py * PARALLAX.x, 3, d);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <points ref={ptsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[targets, 3]} />
          <bufferAttribute attach="attributes-aStart" args={[starts, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={logoVertexShader}
          fragmentShader={logoFragmentShader}
          transparent
          depthWrite={false}
          blending={initTheme.blending}
        />
      </points>
    </group>
  );
}

export default HeroLogoParticles;