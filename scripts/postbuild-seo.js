/* Runs after `vite build`. For a client-rendered SPA, crawlers that do not execute JavaScript
 * (Facebook, WhatsApp, LinkedIn, X, many SEO tools) only ever see dist/index.html. This script:
 *   1. writes dist/<route>/index.html for every route, with that route's own title, description,
 *      canonical and Open Graph / Twitter tags (Vercel serves real files before applying the SPA rewrite);
 *   2. adds a high-priority preload for the desktop hero image to the homepage HTML only;
 *   3. generates dist/sitemap.xml from the same route list.
 * No dependencies; metadata comes from src/seoConfig.js (shared with the runtime <Seo> component). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE_URL, ROUTE_SEO } from '../src/seoConfig.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src', 'imageManifest.json'), 'utf8'));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function setTag(html, regex, replacement, label) {
  if (!regex.test(html)) throw new Error(`postbuild-seo: could not find ${label} in index.html`);
  return html.replace(regex, replacement);
}

function forRoute(route, cfg) {
  let html = template;
  const url = `${SITE_URL}${route === '/' ? '/' : route}`;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(cfg.title)}</title>`, '<title>');
  html = setTag(html, /(<meta name="description" content=")[^"]*(")/, `$1${esc(cfg.description)}$2`, 'description');
  html = setTag(html, /(<meta name="robots" content=")[^"]*(")/, `$1${cfg.robots || 'index, follow, max-image-preview:large'}$2`, 'robots');
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, 'canonical');
  html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${esc(cfg.title)}$2`, 'og:title');
  html = setTag(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${esc(cfg.description)}$2`, 'og:description');
  html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, 'og:url');
  html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(cfg.title)}$2`, 'twitter:title');
  html = setTag(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(cfg.description)}$2`, 'twitter:description');
  return html;
}

for (const [route, cfg] of Object.entries(ROUTE_SEO)) {
  let html = forRoute(route, cfg);
  if (route === '/') {
    // Desktop hero is a static file, so the browser can start fetching it before any JavaScript runs.
    const hero = manifest['example2'];
    const ext = hero.avif ? 'avif' : hero.webp ? 'webp' : hero.ext;
    const type = ext === 'avif' ? 'image/avif' : ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg';
    const preload = `<link rel="preload" as="image" href="/example2.${ext}" type="${type}" media="(min-width: 800px)" fetchpriority="high" />\n  `;
    html = html.replace('</head>', `  ${preload}</head>`);
    fs.writeFileSync(path.join(dist, 'index.html'), html);
  } else {
    // Sub-pages: replace the homepage <noscript> text with text about this page.
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/,
      `<noscript>\n  <h1>${esc(cfg.title)}</h1>\n  <p>${esc(cfg.description)}</p>\n  <p>Please enable JavaScript to view this page.</p>\n</noscript>`);
    const dir = path.join(dist, route.replace(/^\//, ''));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
  console.log(`seo: ${route}`);
}

const today = new Date().toISOString().slice(0, 10);
const urls = Object.entries(ROUTE_SEO).filter(([, c]) => c.sitemap)
  .map(([r]) => `  <url>\n    <loc>${SITE_URL}${r === '/' ? '/' : r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log('seo: sitemap.xml');
