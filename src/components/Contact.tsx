import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { siteContent } from '../content/siteContent';
import { getIcon } from '../content/icons';

type Status = 'idle' | 'sending' | 'success' | 'error';

const getFormString = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

export const Contact = () => {
  const [status, setStatus] = useState<Status>('idle');
  const contact = siteContent.contact;
  const formContent = contact.form;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (status === 'sending') return;

    // Capture the form data before awaiting the network request.
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = `${getFormString(formData, 'firstName')} ${getFormString(
      formData,
      'lastName',
    )}`.trim();

    formData.set(
      '_subject',
      formContent.subjectTemplate.replace('{fullName}', fullName),
    );

    setStatus('sending');

    try {
      const response = await fetch(formContent.formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Formspree responded ${response.status}`);
      }

      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id={contact.id} className="py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Contact information */}
          <div className="px-2">
            <h2 className="mb-3 animate-bounce text-sm font-bold uppercase tracking-widest text-brand-light">
              {contact.eyebrow}
            </h2>

            <h3 className="mb-6 text-3xl font-bold text-theme-text-primary md:text-5xl">
              {contact.headlinePrimary}
              <span className="mt-2 block">{contact.headlineSecondary}</span>
            </h3>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-theme-text-secondary md:text-xl">
              {contact.description}
            </p>

            <div className="space-y-6">
              {contact.methods.map((item) => {
                const Icon = getIcon(item.icon);

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-theme-surface-hover text-brand-accent transition-colors group-hover:bg-theme-border-soft dark:text-brand-light">
                      <Icon size={22} aria-hidden="true" />
                    </div>

                    <div>
                      <p className="mb-1 text-sm text-theme-text-muted">
                        {item.label}
                      </p>
                      <p className="text-lg font-medium text-theme-text-primary transition-colors group-hover:text-brand-light">
                        {item.value}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="ml-auto text-theme-text-muted opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-theme-border-soft bg-silver-premium p-6 shadow-lg dark:bg-theme-surface sm:p-8 lg:p-10">
            <div className="mb-8">
              <h4 className="mb-2 text-2xl font-bold text-theme-text-primary">
                {formContent.heading}
              </h4>
              <p className="leading-relaxed text-theme-text-secondary">
                {formContent.description}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              onChange={() => {
                if (status === 'success' || status === 'error') {
                  setStatus('idle');
                }
              }}
              className="space-y-6"
            >
              <input
                type="text"
                name={formContent.spamFieldName}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {formContent.fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.width === 'full' ? 'sm:col-span-2' : ''}
                  >
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-medium text-theme-text-secondary"
                    >
                      {field.label}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows={field.rows ?? 5}
                        required={field.required}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        className="w-full resize-y rounded-lg border border-theme-border bg-theme-bg-primary px-4 py-3 text-theme-text-primary transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-light"
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        autoComplete={field.autocomplete}
                        required={field.required}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg border border-theme-border bg-theme-bg-primary px-4 py-3 text-theme-text-primary transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-light"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-theme-surface"
              >
                {status === 'sending'
                  ? formContent.sendingLabel
                  : formContent.submitLabel}
                <ArrowUpRight size={19} aria-hidden="true" />
              </button>

              <div aria-live="polite" className="min-h-[1.25rem] text-center text-sm">
                {status === 'success' && (
                  <p className="text-green-600 dark:text-green-400">
                    {formContent.successMessage}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 dark:text-red-400">
                    {formContent.errorMessagePrefix}{' '}
                    <a href={siteContent.brand.emailHref} className="underline">
                      {siteContent.brand.email}
                    </a>.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
