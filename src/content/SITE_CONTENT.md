# CynonTech Website Content

This file is the central content inventory for the CynonTech website. Keep user-facing copy, repeatable card data, links, and content-related settings here.

> **Source of truth:** The React components in this integration import this Markdown file as raw text and parse the fenced JSON block when the content module loads. Edit the JSON data below to update website copy and repeated content. Vite should hot-reload the app during development; production deployments still need a new build/deploy. Keep the JSON valid and retain the fenced `json` block.

## Content data

```json
{
  "brand": {
    "name": "CynonTech",
    "homeLabel": "CynonTech home",
    "email": "info@cynontech.com",
    "phoneDisplay": "+94 76 880 9340",
    "phoneHref": "tel:+94768809340",
    "emailHref": "mailto:info@cynontech.com"
  },
  "about": {
    "id": "about",
    "eyebrow": "About CynonTech",
    "headingPrefix": "Bridging",
    "bridgeComponent": "BridgeGap",
    "headingMiddle": "between",
    "headlineLeft": "Tech",
    "headlineConnector": "&",
    "headlineRight": "Business",
    "description": "We're a team of passionate engineers who bring technology and business thinking together to build digital solutions that blend functionality with creativity.",
    "valuesHeading": "What guides us",
    "valuesDescription": "The principles behind how we think, build, and work with others.",
    "values": [
      {
        "icon": "Target",
        "title": "Business-First Thinking",
        "desc": "We start with the problem, not the technology. Understanding business needs helps us build solutions that make a meaningful difference to how people work."
      },
      {
        "icon": "Layers3",
        "title": "Engineering with Purpose",
        "desc": "We value thoughtful architecture, practical design, and dependable software. Every solution should solve a real problem without adding unnecessary complexity."
      },
      {
        "icon": "RefreshCw",
        "title": "Always Improving",
        "desc": "We learn by building, testing, and refining. From our own product, Flow, to client projects, we believe better solutions come from continuous improvement."
      }
    ]
  },
  "services": {
    "id": "services",
    "eyebrow": "What We Do",
    "heading": "From complex ideas to working solutions.",
    "description": "We build digital products, streamline business operations, and turn data into actionable insights.",
    "items": [
      {
        "icon": "Code2",
        "title": "Product & Software Engineering",
        "desc": "We turn ideas and complex requirements into dependable software, from early-stage products and custom business applications to APIs, backend systems, and scalable software architecture."
      },
      {
        "icon": "Workflow",
        "title": "Workflow Optimization & Automation",
        "desc": "We simplify how businesses operate by improving existing processes, connecting tools, and automating repetitive tasks, giving teams more time to focus on meaningful work."
      },
      {
        "icon": "Database",
        "title": "Data Engineering & Analytics",
        "desc": "Build reliable data pipelines and well-structured datasets, then analyze them to uncover trends, answer business questions, and support better decisions."
      },
      {
        "icon": "BarChart3",
        "title": "Business Intelligence & Analysis",
        "desc": "Translate business goals into clear requirements, meaningful metrics, and decision-ready dashboards that help teams measure performance and identify opportunities."
      },
      {
        "icon": "PanelsTopLeft",
        "title": "Websites & Digital Experiences",
        "desc": "We create purposeful digital experiences that combine thoughtful design, intuitive navigation, and robust development to help businesses communicate, engage, and grow online."
      },
      {
        "icon": "Palette",
        "title": "Digital Design & Creative Assets",
        "desc": "We help ideas stand out through considered visual design and creative assets that bring a brand, product, or digital experience to life."
      }
    ]
  },
  "products": {
    "id": "products",
    "eyebrow": "Our Products",
    "sectionDescription": "A better way to manage freight operations and keep every shipment in the loop.",
    "featured": {
      "name": "Flow by Cynon",
      "category": "Freight Forwarding CRM & Workflow Platform",
      "tagline": "Shipments, teams, and customers - connected.",
      "description": "Flow brings shipment tracking, internal workflow management, and customer communication together for freight forwarders. With an employee dashboard, a customer self-service portal, and automatic shipment updates, it helps reduce routine status inquiries and keep shipment information easier to access.",
      "image": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200",
      "imageAlt": "Freight shipping and logistics",
      "imageEyebrow": "Introducing",
      "informationEyebrow": "Built for Freight Forwarders",
      "headlinePrimary": "Less manual coordination.",
      "headlineSecondary": "More connected operations.",
      "features": [
        {
          "icon": "PackageCheck",
          "title": "Shipment Tracking",
          "desc": "Make shipment progress easier for teams and customers to access."
        },
        {
          "icon": "LayoutDashboard",
          "title": "Team Dashboard",
          "desc": "Bring employee workflows and customer handling into one workspace."
        },
        {
          "icon": "Users",
          "title": "Customer Portal",
          "desc": "Let customers check their shipments without contacting an agent for every inquiry."
        },
        {
          "icon": "BellRing",
          "title": "Automatic Updates",
          "desc": "Keep customers informed through automatic shipment updates."
        }
      ],
      "ctaLabel": "Talk to us about Flow",
      "ctaHref": "#contact"
    }
  },
  "contact": {
    "id": "contact",
    "eyebrow": "Get in Touch",
    "headlinePrimary": "Have an idea?",
    "headlineSecondary": "Let's make it work.",
    "description": "Whether you're building a new product, improving a workflow, or making better use of your data, let's talk about what you have in mind.",
    "methods": [
      {
        "icon": "Mail",
        "label": "Email us",
        "value": "info@cynontech.com",
        "href": "mailto:info@cynontech.com"
      },
      {
        "icon": "Phone",
        "label": "Call us",
        "value": "+94 76 880 9340",
        "href": "tel:+94768809340"
      }
    ],
    "form": {
      "formspreeEndpoint": "https://formspree.io/f/xppprppz",
      "heading": "Tell us about your project",
      "description": "Share a few details and let's start a conversation.",
      "fields": [
        {
          "name": "firstName",
          "label": "First name",
          "type": "text",
          "autocomplete": "given-name",
          "required": true,
          "maxLength": 100,
          "placeholder": "Your first name",
          "width": "half"
        },
        {
          "name": "lastName",
          "label": "Last name",
          "type": "text",
          "autocomplete": "family-name",
          "required": true,
          "maxLength": 100,
          "placeholder": "Your last name",
          "width": "half"
        },
        {
          "name": "email",
          "label": "Email address",
          "type": "email",
          "autocomplete": "email",
          "required": true,
          "maxLength": 254,
          "placeholder": "you@company.com",
          "width": "full"
        },
        {
          "name": "message",
          "label": "What are you looking to build?",
          "type": "textarea",
          "rows": 5,
          "required": true,
          "maxLength": 5000,
          "placeholder": "Tell us about your idea, challenge, or project...",
          "width": "full"
        }
      ],
      "submitLabel": "Send message",
      "sendingLabel": "Sending…",
      "successMessage": "Thanks! Your message is on its way, and we'll get back to you soon.",
      "errorMessagePrefix": "Something went wrong. Please try again, or email us at",
      "spamFieldName": "_gotcha",
      "subjectTemplate": "Website inquiry from {fullName}"
    }
  },
  "footer": {
    "homeLabel": "CynonTech home",
    "tagline": "Thoughtful engineering. Practical solutions. Digital products built around real problems.",
    "links": [
      {
        "label": "Services",
        "href": "#services"
      },
      {
        "label": "Products",
        "href": "#products"
      },
      {
        "label": "Contact",
        "href": "#contact"
      }
    ],
    "contactCta": "Get in touch",
    "email": "info@cynontech.com",
    "emailHref": "mailto:info@cynontech.com",
    "copyrightTemplate": "© {year} {brand}. All rights reserved."
  }
}
```

## Editing guidance

- Update the copy or the corresponding entries in the JSON block above. The connected React sections read from this block, so content changes don't need to be repeated in component files. The connected React sections read from this block, so content changes don't need to be repeated in component files.
- Keep each `icon` value aligned with a valid Lucide icon name that the application maps to a component. Icon names are identifiers, not rendered React components.
- Keep section IDs and anchor links aligned (for example, `#services`, `#products`, and `#contact`).
- The `formspreeEndpoint` is the existing client-side form endpoint from the website source. Keep it in sync with the form configuration if it changes.
- The `BridgeGap` item is a React component rather than plain copy; its implementation and visual behavior remain in code.
- Styling, layout, responsive breakpoints, theme colors, animations, form submission behavior, and validation logic remain implementation concerns in the React components rather than content data.
