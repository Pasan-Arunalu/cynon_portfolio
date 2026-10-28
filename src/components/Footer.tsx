import { ArrowUpRight } from 'lucide-react';

import { siteContent } from '../content/siteContent';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footer = siteContent.footer;
  const themeTransition = 'transition-colors duration-500 ease-in-out';
  const copyright = footer.copyrightTemplate
    .replace('{year}', String(currentYear))
    .replace('{brand}', siteContent.brand.name);

  return (
    <footer
      className={`border-t border-white/20 bg-brand-accent text-white dark:border-theme-border-soft dark:bg-theme-bg-secondary dark:text-theme-text-primary ${themeTransition}`}
    >
      <div className="mx-auto max-w-7xl px-8 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="flex flex-col items-center gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <a
              href="#home"
              className={`inline-block text-2xl font-bold tracking-tight text-white dark:text-theme-text-primary ${themeTransition}`}
              aria-label={footer.homeLabel}
            >
              {siteContent.brand.name}
              <span className="text-white/70 dark:text-brand-light">.</span>
            </a>

            <p className={`mt-2 max-w-sm text-sm leading-relaxed text-white/75 dark:text-theme-text-secondary ${themeTransition}`}>
              {footer.tagline}
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-7 gap-y-4"
          >
            {footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium text-white/80 transition-colors duration-300 hover:text-white dark:text-theme-text-secondary dark:hover:text-brand-light ${themeTransition}`}
              >
                {link.label}
              </a>
            ))}

            <a
              href={footer.emailHref}
              className={`inline-flex items-center gap-1 text-sm font-semibold text-white transition-colors duration-300 hover:text-white/75 dark:text-theme-text-primary dark:hover:text-brand-light ${themeTransition}`}
            >
              {footer.contactCta}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className={`flex flex-col items-center gap-3 border-t border-white/20 py-5 sm:flex-row dark:border-theme-border-soft ${themeTransition}`}>
          <p className={`text-sm text-white/65 dark:text-theme-text-muted ${themeTransition}`}>
            {copyright}
          </p>

          <a
            href={footer.emailHref}
            className={`text-sm text-white/65 transition-colors duration-300 hover:text-white dark:text-theme-text-muted dark:hover:text-theme-text-primary ${themeTransition}`}
          >
            {footer.email}
          </a>
        </div>
      </div>
    </footer>
  );
};
