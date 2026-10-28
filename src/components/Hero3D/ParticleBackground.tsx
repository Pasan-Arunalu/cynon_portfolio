import { memo, useEffect, useSyncExternalStore } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PointCloud } from './PointCloud';

const subscribe = (onChange: () => void) => {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => obs.disconnect();
};
const getSnapshot = () => document.documentElement.classList.contains('dark');
const getServerSnapshot = () => false;

// Drives rendering manually so the scene runs at a fixed, lower frame rate.
function FrameLimiter({ fps = 30 }: { fps?: number }) {
  const advance = useThree((s) => s.advance);
  const set = useThree((s) => s.set);

  useEffect(() => {
    set({ frameloop: 'never' });
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last >= 1000 / fps) {
        last = t;
        advance(t / 1000);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [advance, set, fps]);

  return null;
}

export const ParticleBackground = memo(() => {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none opacity-60 dark:opacity-25 transition-opacity duration-300"
    >
      <Canvas
        dpr={1}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <PointCloud isDark={isDark} />
      </Canvas>
    </div>
  );
});