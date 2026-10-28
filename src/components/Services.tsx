import { siteContent } from '../content/siteContent';
import { getIcon } from '../content/icons';

export const Services = () => {
  const services = siteContent.services;

  return (
    <section id={services.id} className="py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-3 animate-bounce text-sm font-bold uppercase tracking-widest text-brand-light">
            {services.eyebrow}
          </h2>

          <h3 className="mb-6 text-3xl font-bold text-theme-text-primary md:text-5xl">
            {services.heading}
          </h3>

          <p className="mx-auto max-w-2xl text-xl text-theme-text-secondary">
            {services.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.items.map((service) => {
            const Icon = getIcon(service.icon);

            return (
              <article
                key={service.title}
                className="rounded-2xl border border-theme-border-soft bg-silver-premium p-8 transition-all duration-300 hover:border-brand-light/50 hover:shadow-xl dark:bg-theme-surface"
              >
                <div className="mb-6 text-brand-light">
                  <Icon size={40} strokeWidth={1.7} aria-hidden="true" />
                </div>

                <h4 className="mb-4 text-2xl font-bold text-theme-text-primary">
                  {service.title}
                </h4>

                <p className="text-justify leading-relaxed text-theme-text-secondary">
                  {service.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
