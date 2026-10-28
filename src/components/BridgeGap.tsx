import { useEffect, useRef, useState } from 'react';

function BridgeGap() {
  const ref = useRef<HTMLSpanElement>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDown(true);
          obs.disconnect(); // play once
        }
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`bridge ${down ? 'bridge--down' : ''} text-3xl md:text-8xl font-bold text-theme-text-primary mb-6`}
    >
      <span className="bridge__leaf bridge__leaf--left">the</span>{' '}
      <span className="bridge__leaf bridge__leaf--right">Gap</span>
    </span>
  );
}

export default BridgeGap