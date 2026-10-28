# CynonTech content-source integration

This patch kit connects the website's About, Services, Products, Contact, and Footer sections to `src/content/SITE_CONTENT.md`.

## How it works

- `SITE_CONTENT.md` is the single source for user-facing copy, arrays, links, contact details, product metadata, and contact-form labels/settings.
- `siteContent.ts` imports the Markdown file as raw text using Vite's `?raw` suffix, extracts its fenced JSON block, and parses it when the module loads.
- `icons.ts` maps icon-name strings in the Markdown data to Lucide React components.
- Section components use `siteContent` instead of locally duplicated content arrays and strings.
- Layout, theme classes, visual styling, responsive behavior, and form-submit logic remain in TSX files.

## Apply to the project

1. Copy this package's `src/content/` directory into the app's `src/content/` directory.
2. Copy the included `About.tsx`, `Services.tsx`, `Products.tsx`, `Contact.tsx`, and `Footer.tsx` into the directory where the corresponding components currently live. These examples use `../content/...` imports, so `src/components/` is the expected location. If your components live in another directory, adjust those relative imports.
3. Keep your existing `BridgeGap` component beside `About.tsx` (or update the `BridgeGap` import path).
4. Ensure the project uses Vite and includes `vite/client` types. `markdown.d.ts` supplies the `?raw` import declaration for TypeScript.
5. Add the following section to the repository root `README.md`.

```md
## Website Content Management

Website copy and repeatable content data live in [SITE_CONTENT.md](./src/content/SITE_CONTENT.md).

Edit that file to update the About, Services, Products, Contact, and Footer content. Keep the JSON block valid and use icon identifiers supported by `src/content/icons.ts`. Layout, styling, and behavior remain in the React components.
```

## Change content safely

- Only edit the JSON block in `SITE_CONTENT.md` for copy/data changes; retain the opening and closing `json` fences.
- Keep `id` values and section anchor links consistent (for example, `products.id` and CTA `#contact`).
- When adding an icon, use a valid Lucide React export and register it in `src/content/icons.ts`.
- Form `name` values are submitted to Formspree. Changing them may require changing the `firstName` and `lastName` handling used to create the email subject in `Contact.tsx`.
- `formspreeEndpoint` is client-side configuration and is visible in the browser bundle, as with the current implementation.
- Run the project's normal type-check/build after editing the data. Because the Markdown data is parsed at runtime, valid JSON is required.

## Files

- `src/content/SITE_CONTENT.md` — editable website content source.
- `src/content/siteContent.ts` — Markdown JSON parser and TypeScript content shape.
- `src/content/icons.ts` — supported Lucide icon-name mapping.
- `src/content/markdown.d.ts` — TypeScript declaration for Vite raw Markdown imports.
- `src/components/*.tsx` — example content-driven sections.
