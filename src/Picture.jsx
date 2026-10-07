import { resolveImage, getSources } from "./imageUtils";

/** Plain <img> src used as the last-resort fallback (the original value is kept as-is). */
function fallbackSrc(src) {
    const info = resolveImage(src);
    if (info && !/\.[a-z0-9]+$/i.test(src)) return `/${info.base}.${info.ext}`;
    return src;
}

/**
 * Drop-in replacement for <img>: AVIF -> WebP -> original, chosen by the browser from a single
 * <picture>. `display: contents` keeps the DOM box model identical to a bare <img>, so existing
 * CSS (e.g. `.element img`) keeps working unchanged. `before` lets callers add extra <source>
 * elements (e.g. a media-query specific one) ahead of the automatic ones.
 */
export function Picture({ src, alt = "", before = null, style, ...imgProps }) {
    const info = resolveImage(src);
    const sources = getSources(src);
    const imgStyle = info ? { aspectRatio: `${info.w} / ${info.h}`, ...style } : style;
    return (
        <picture style={{ display: "contents" }}>
            {before}
            {sources.map((s) => (
                <source key={s.type} type={s.type} srcSet={s.srcSet} />
            ))}
            <img src={fallbackSrc(src)} alt={alt} style={imgStyle} {...imgProps} />
        </picture>
    );
}
