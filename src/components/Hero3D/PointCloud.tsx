// PointCloud.tsx
import * as THREE from 'three';
import { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import './PointCloudMaterial';

const PARTICLE_COUNT = 4000;

// Resolves a Tailwind text-color class to RGB, whatever format the token uses.
function readTokenColor(textClass: string, target: THREE.Color) {
  const probe = document.createElement('span');
  probe.className = textClass;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const css = getComputedStyle(probe).color;
  probe.remove();

  // A 1x1 canvas converts any CSS color syntax into plain sRGB bytes
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

  // The shader writes uColor straight to the screen, so store the raw sRGB
  // values. Color.set('#hex') would linearize them and make them look darker.
  target.setRGB(r / 255, g / 255, b / 255);
}

interface PointCloudProps {
  isDark: boolean;
}

export function PointCloud({ isDark }: PointCloudProps) {
  const materialRef = useRef<any>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useLayoutEffect(() => {
    const m = materialRef.current;
    if (!m) return;
    // Keep these class names as literal strings so Tailwind doesn't purge them
    readTokenColor(isDark ? 'text-brand-light' : 'text-brand-accent', m.uniforms.uColor.value);
    m.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    m.needsUpdate = true;
  }, [isDark]);

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointCloudMaterial ref={materialRef} transparent depthWrite={false} />
    </points>
  );
}