import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroLogoParticles } from './HeroLogoParticles';
import { useInView } from './useInView';

export default function HeroLogoCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} className="h-full w-full">
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        eventSource={document.documentElement}
        eventPrefix="client"
      >
        <HeroLogoParticles position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}