import manifest from "./imageManifest.json";

/**
 * Looks up an image reference (as hardcoded in a component OR as returned by the backend:
 * "/crisp_apple_front.png", "crisp_apple_front.png" or "crisp_apple_front") in the build-time
 * manifest of /public images (see scripts/build-image-manifest.js).
 * Returns null when it is not a local PNG/JPG with known variants (absolute URLs, SVGs,
 * already-modern formats, unknown files) - those are rendered untouched, exactly as before.
 */
export function resolveImage(src) {
    if (!src || typeof src !== "string") return null;
    if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) return null;
    const clean = src.split(/[?#]/)[0].replace(/^\//, "");
    if (!clean || clean.includes("/")) return null;
    const extMatch = clean.match(/\.([a-z0-9]+)$/i);
    if (extMatch && !/^(png|jpe?g)$/i.test(extMatch[1])) return null;
    const base = extMatch ? clean.slice(0, -extMatch[0].length) : clean;
    const entry = manifest[base];
    if (!entry) return null;
    return { base, ...entry };
}

/** <source> descriptors, best format first. The browser downloads only ONE of them. */
export function getSources(src, media) {
    const info = resolveImage(src);
    if (!info) return [];
    const list = [];
    if (info.avif) list.push({ type: "image/avif", srcSet: `/${info.base}.avif`, media });
    if (info.webp) list.push({ type: "image/webp", srcSet: `/${info.base}.webp`, media });
    return list;
}

