import { ArrowUpRight } from 'lucide-react';

import { siteContent } from '../content/siteContent';
import { getIcon } from '../content/icons';

export const Products = () => {
  const products = siteContent.products;
  const product = products.featured;
  const themeTransition = 'transition-colors duration-500 ease-in-out';

  return (
    <section id={products.id} className={`py-24 ${themeTransition}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-12 max-w-3xl px-4">
          <h2
            className={`mb-3 animate-bounce text-sm font-bold uppercase tracking-widest text-brand-light ${themeTransition}`}
          >
            {products.eyebrow}
          </h2>

          <h3
            className={`mb-6 text-3xl font-bold text-theme-text-primary md:text-5xl ${themeTransition}`}
          >
            {product.name}
          </h3>

          <p
            className={`text-lg leading-relaxed text-theme-text-secondary md:text-xl ${themeTransition}`}
          >
            {products.sectionDescription}
          </p>
        </div>

        {/* Featured product */}
        <article
          className={`overflow-hidden rounded-3xl border-0 bg-theme-surface ${themeTransition}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Product visual */}
            <div className="relative min-h-[300px] overflow-hidden lg:min-h-full">
              <img
                src={product.image}
                alt={product.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute left-6 top-6">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                  {product.category}
                </span>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/70">
                  {product.imageEyebrow}
                </p>

                <h4 className="mb-3 text-5xl font-bold text-white md:text-6xl">
                  {product.name}
                  <span className="text-brand-light">.</span>
                </h4>

                <p className="max-w-md text-lg text-white/90">
                  {product.tagline}
                </p>
              </div>
            </div>

            {/* Product information */}
            <div
              className={`flex flex-col bg-silver-premium p-8 md:p-10 lg:p-12 dark:bg-theme-surface ${themeTransition}`}
            >
              <p
                className={`mb-4 text-sm font-semibold uppercase tracking-wider text-brand-light ${themeTransition}`}
              >
                {product.informationEyebrow}
              </p>

              <h4
                className={`mb-5 text-3xl font-bold leading-tight text-theme-text-primary md:text-4xl ${themeTransition}`}
              >
                {product.headlinePrimary}
                <span
                  className={`mt-1 block text-theme-text-secondary ${themeTransition}`}
                >
                  {product.headlineSecondary}
                </span>
              </h4>

              <p
                className={`text-justify leading-relaxed text-theme-text-secondary ${themeTransition}`}
              >
                {product.description}
              </p>

              {/* Core capabilities */}
              <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
                {product.features.map((feature) => {
                  const Icon = getIcon(feature.icon);

                  return (
                    <div key={feature.title} className="flex items-start gap-3">
                      <div
                        className={`mt-1 shrink-0 text-brand-accent dark:text-brand-light ${themeTransition}`}
                      >
                        <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
                      </div>

                      <div>
                        <h5
                          className={`mb-2 text-lg font-semibold text-theme-text-primary ${themeTransition}`}
                        >
                          {feature.title}
                        </h5>

                        <p
                          className={`text-sm leading-relaxed text-theme-text-secondary ${themeTransition}`}
                        >
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Contact link */}
              <div
                className={`mt-10 border-t border-black/10 pt-6 dark:border-white/10 ${themeTransition}`}
              >
                <a
                  href={product.ctaHref}
                  className="inline-flex items-center gap-2 font-semibold text-theme-text-primary transition-colors duration-300 ease-in-out hover:text-brand-accent dark:hover:text-brand-light"
                >
                  {product.ctaLabel}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
