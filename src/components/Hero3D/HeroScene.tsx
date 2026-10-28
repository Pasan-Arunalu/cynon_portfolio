import {PointCloud} from './PointCloud';

/**
 * HeroScene — canonical 3D entry point for the Hero section.
 * Render this inside a <Canvas> in Hero.tsx.
 *
 * Composition:
 *   PointCloud        — animated curl-noise particle background
 *   HeroLogoParticles — logo assembled from particles at the center
 */
export default function HeroScene() {
  return (
    <>
      <PointCloud isDark={false} />
    </>
  );
}
