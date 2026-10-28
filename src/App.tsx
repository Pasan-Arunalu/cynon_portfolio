import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Products } from './components/Products';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

import { lazy, Suspense, useEffect, useState } from 'react';

const ParticleBackground = lazy(() =>
  import('./components/Hero3D/ParticleBackground').then((m) => ({ default: m.ParticleBackground }))
);

function useIdleMount() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    let cancel = () => {};

    const start = () => {
      if (w.requestIdleCallback) {
        const id = w.requestIdleCallback(() => setReady(true), { timeout: 1500 });
        cancel = () => w.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(() => setReady(true), 500);
        cancel = () => clearTimeout(id);
      }
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      window.removeEventListener('load', start);
      cancel();
    };
  }, []);

  return ready;
}

function App() {
  const showBg = useIdleMount();

  return (
    <div className="relative isolate bg-theme-bg-primary">
      {showBg && (
        <Suspense fallback={null}>
          <ParticleBackground />
        </Suspense>
      )}
      <div className="relative min-h-screen font-sans text-theme-text-primary transition-colors duration-300">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Products />
          <Contact />
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;
