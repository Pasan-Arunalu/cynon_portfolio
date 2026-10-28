import markdown from "./SITE_CONTENT.md?raw";

export interface IconContentItem {
  icon: string;
  title: string;
  desc: string;
}

export interface ContactMethodContent {
  icon: string;
  label: string;
  value: string;
  href: string;
}

export interface ContactFieldContent {
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  autocomplete?: string;
  required: boolean;
  maxLength: number;
  placeholder: string;
  rows?: number;
  width?: "half" | "full";
}

export interface SiteContent {
  brand: {
    name: string;
    homeLabel: string;
    email: string;
    phoneDisplay: string;
    phoneHref: string;
    emailHref: string;
  };
  about: {
    id: string;
    eyebrow: string;
    headingPrefix: string;
    bridgeComponent: string;
    headingMiddle: string;
    headlineLeft: string;
    headlineConnector: string;
    headlineRight: string;
    description: string;
    valuesHeading: string;
    valuesDescription: string;
    values: IconContentItem[];
  };
  services: {
    id: string;
    eyebrow: string;
    heading: string;
    description: string;
    items: IconContentItem[];
  };
  products: {
    id: string;
    eyebrow: string;
    sectionDescription: string;
    featured: {
      name: string;
      category: string;
      tagline: string;
      description: string;
      image: string;
      imageAlt: string;
      imageEyebrow: string;
      informationEyebrow: string;
      headlinePrimary: string;
      headlineSecondary: string;
      features: IconContentItem[];
      ctaLabel: string;
      ctaHref: string;
    };
  };
  contact: {
    id: string;
    eyebrow: string;
    headlinePrimary: string;
    headlineSecondary: string;
    description: string;
    methods: ContactMethodContent[];
    form: {
      formspreeEndpoint: string;
      heading: string;
      description: string;
      fields: ContactFieldContent[];
      submitLabel: string;
      sendingLabel: string;
      successMessage: string;
      errorMessagePrefix: string;
      spamFieldName: string;
      subjectTemplate: string;
    };
  };
  footer: {
    homeLabel: string;
    tagline: string;
    links: Array<{ label: string; href: string }>;
    contactCta: string;
    email: string;
    emailHref: string;
    copyrightTemplate: string;
  };
}

function readContentDocument(source: string): SiteContent {
  const match = source.match(/```json\s*([\s\S]*?)\s*```/i);

  if (!match) {
    throw new Error(
      "SITE_CONTENT.md must contain a fenced ```json ... ``` content block.",
    );
  }

  try {
    return JSON.parse(match[1]) as SiteContent;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(
      `Could not parse the JSON content in SITE_CONTENT.md: ${message}`,
      { cause: error },
    );
  }
}

export const siteContent = readContentDocument(markdown);
