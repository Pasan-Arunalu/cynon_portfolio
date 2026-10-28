import BridgeGap from './BridgeGap';
import { siteContent } from '../content/siteContent';
import { getIcon } from '../content/icons';

export const About = () => {
  const about = siteContent.about;

  return (
    <section id={about.id} className="py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        {/* About heading */}
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <h2 className="mb-5 animate-bounce text-sm font-bold uppercase tracking-widest text-brand-light">
            {about.eyebrow}
          </h2>

          <h3 className="mb-6 text-xl font-bold text-theme-text-primary md:text-3xl">
            {about.headingPrefix} <BridgeGap /> {about.headingMiddle}
          </h3>

          <h3 className="mb-6 text-xl font-bold text-brand-light md:text-3xl">
            <span className="mb-6 text-3xl font-bold text-theme-text-primary md:text-8xl">
              {about.headlineLeft}
            </span>{' '}
            {about.headlineConnector}{' '}
            <span className="mb-6 text-3xl font-bold text-theme-text-primary md:text-8xl">
              {about.headlineRight}
            </span>
          </h3>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-theme-text-secondary md:text-xl">
            {about.description}
          </p>
        </div>

        {/* Company values */}
        <div className="mb-10 text-center">
          <h4 className="text-2xl font-bold text-theme-text-primary md:text-3xl">
            {about.valuesHeading}
          </h4>

          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-theme-text-secondary">
            {about.valuesDescription}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {about.values.map((value) => {
            const Icon = getIcon(value.icon);

            return (
              <article
                key={value.title}
                className="group rounded-2xl border border-theme-border bg-silver-premium p-8 transition-all duration-300 hover:border-brand-light/50 hover:shadow-xl dark:bg-theme-surface"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-theme-surface-hover transition-transform duration-300 group-hover:scale-110">
                  <Icon
                    size={30}
                    strokeWidth={1.8}
                    className="text-brand-light"
                    aria-hidden="true"
                  />
                </div>

                <h5 className="mb-3 text-xl font-bold text-theme-text-primary">
                  {value.title}
                </h5>

                <p className="text-justify leading-relaxed text-theme-text-secondary">
                  {value.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
