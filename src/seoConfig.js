// Single source of truth for per-route SEO metadata.
// Used by <Seo> at runtime AND by scripts/postbuild-seo.js to bake the same tags into the static
// HTML of every route (crawlers such as Facebook/WhatsApp/LinkedIn do not execute JavaScript).
export const SITE_URL = "https://www.justz.store";
export const SITE_NAME = "JustZ";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = "JustZ premium sparkling beverages";

export const ROUTE_SEO = {
    "/": {
        title: "JustZ | Premium Synbiotic Sparkling Beverages",
        description: "JustZ crafts premium sparkling beverages with real fruit extracts, prebiotic fiber and natural stevia. Zero added sugar, nothing hidden.",
        sitemap: true,
    },
    "/contact-us": {
        title: "Contact Us | JustZ",
        description: "Get in touch with JustZ for stockist requests, bulk orders or questions about our sparkling beverages. We reply within a day.",
        sitemap: true,
    },
    "/privacy-policy": {
        title: "Privacy Policy | JustZ",
        description: "How JustZ collects, uses and protects your personal information, and the rights you have over your data.",
        sitemap: true,
    },
    "/termsandcondition": {
        title: "Terms and Conditions | JustZ",
        description: "The terms that apply when you browse or order from JustZ, including payment, shipping, returns and refunds.",
        sitemap: true,
    },
    "/legal": {
        title: "Legal & Compliance | JustZ",
        description: "JustZ legal information: FSSAI compliance statement, health claim disclaimer, sweetener disclosure and allergen statement.",
        sitemap: true,
    },
    "/admin": {
        title: "Admin | JustZ",
        description: "JustZ admin panel.",
        robots: "noindex, nofollow",
        sitemap: false,
    },
};

export const NOT_FOUND_SEO = {
    title: "Page not found | JustZ",
    description: "The page you are looking for does not exist.",
    robots: "noindex, nofollow",
};
