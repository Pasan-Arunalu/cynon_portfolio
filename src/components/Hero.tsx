import { lazy, Suspense } from 'react';
import { Link } from 'react-scroll';
import { ArrowRight } from 'lucide-react';

const ParticleBackground = lazy(() =>
  import('./Hero3D/ParticleBackground').then((m) => ({ default: m.ParticleBackground }))
);
const HeroLogoCanvas = lazy(() => import('./Hero3D/HeroLogoCanvas'));

export const Hero = () => {
  return (
    <section id="home" className="h-[calc(100vh-5rem)] mt-20 flex items-center justify-center relative overflow-hidden">
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      {/* Background decoration */}
      <div className="absolute align-center w-96 h-96 bg-brand-light/20 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center h-full justify-center w-full py-4">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-theme-text-primary mb-6 mt-10">
          Tech Solutions for <br /> <span className="text-brand-accent dark:text-brand-light"> Innovative Industries</span>
        </h1>

        <div className="flex-1 min-h-[200px] max-h-[400px] w-full max-w-4xl">
          <Suspense fallback={null}>
            <HeroLogoCanvas />
          </Suspense>
        </div>

        <p className="mt-4 text-2xl md:text-4xl text-theme-text-primary max-w-3xl mx-auto leading-relaxed">
          Design — Develop — Deploy
        </p>
        <p className="mt-4 text-2xl md:text-xl text-theme-text-primary mb-4 max-w-3xl mx-auto leading-relaxed">
          Upgrade Your Workflow
          <br />
          <span className='text-theme-text-secondary'>
            Solutions Tailored for you
          </span>
        </p>

        <div className="flex flex-col md:flex-col justify-center items-center mb-5">
          <Link
            to="services"
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            className="group cursor-pointer inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-brand-accent hover:bg-brand-hover transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Explore Services
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};
