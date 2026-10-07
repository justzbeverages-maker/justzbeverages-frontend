import { useEffect } from "react";
import {
    ROUTE_SEO,
    SITE_URL,
    SITE_NAME,
    OG_IMAGE,
    OG_IMAGE_WIDTH,
    OG_IMAGE_HEIGHT,
    OG_IMAGE_ALT,
} from "./seoConfig";

function upsertMeta(attr, key, content) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function upsertCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!href) {
        if (el) el.remove();
        return;
    }
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
}

/**
 * Per-route head metadata for the SPA. Renders nothing (zero visual impact).
 * Usage: <Seo title="..." description="..." path="/contact-us" />
 * Non-indexable routes: <Seo ... robots="noindex, nofollow" path={null} />  (path={null} = no canonical)
 */
export function Seo({
                        title,
                        description,
                        path = "/",
                        robots = "index, follow, max-image-preview:large",
                        image = OG_IMAGE,
                        imageAlt = OG_IMAGE_ALT,
                        type = "website",
                    }) {
    useEffect(() => {
        const url = path === null ? null : `${SITE_URL}${path}`;
        document.title = title;
        upsertMeta("name", "description", description);
        upsertMeta("name", "robots", robots);
        upsertCanonical(url);

        upsertMeta("property", "og:type", type);
        upsertMeta("property", "og:site_name", SITE_NAME);
        upsertMeta("property", "og:title", title);
        upsertMeta("property", "og:description", description);
        if (url) upsertMeta("property", "og:url", url);
        upsertMeta("property", "og:image", image);
        upsertMeta("property", "og:image:width", String(OG_IMAGE_WIDTH));
        upsertMeta("property", "og:image:height", String(OG_IMAGE_HEIGHT));
        upsertMeta("property", "og:image:alt", imageAlt);

        upsertMeta("name", "twitter:card", "summary_large_image");
        upsertMeta("name", "twitter:title", title);
        upsertMeta("name", "twitter:description", description);
        upsertMeta("name", "twitter:image", image);
        upsertMeta("name", "twitter:image:alt", imageAlt);
    }, [title, description, path, robots, image, imageAlt, type]);

    return null;
}

/** Convenience wrapper: metadata for a known route from seoConfig.js. */
export function RouteSeo({ path }) {
    const cfg = ROUTE_SEO[path];
    const noindex = cfg.robots && cfg.robots.includes("noindex");
    return <Seo title={cfg.title} description={cfg.description} robots={cfg.robots} path={noindex ? null : path} />;
}
