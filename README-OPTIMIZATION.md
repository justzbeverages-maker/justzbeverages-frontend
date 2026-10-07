# JustZ – SEO & image optimization notes

## Before you push (important)
1. `git add -A` – the `.webp`/`.avif` files in `public/`, `optimize.js`, `scripts/`, `src/imageManifest.json`
   and `src/Seo.jsx` were **untracked in your git repo**. If they are not committed, Vercel will not have them
   and every image silently falls back to the big PNG.
2. `.env` is tracked by git. It only holds `VITE_API_URL` (public), but run `git rm --cached .env` once;
   `.gitignore` now ignores it. Set `VITE_API_URL` in Vercel → Settings → Environment Variables (it is used by the admin login).
3. `npm install && npm run build && npm run preview` to check locally.

## How the browser picks an image
`src/Picture.jsx` replaces `<img>` with `<picture>`: `AVIF → WebP → original PNG/JPG`. The browser downloads exactly ONE.
`scripts/build-image-manifest.js` (runs automatically before `dev`/`build`) scans `public/` and records, per image,
its size and which variants exist. AVIF is only offered when it is ≥10% smaller than the WebP
(for `testingapple/lime/grape`, `product0x`, `linkedin`, favicons WebP is smaller, so WebP is used).
The backend contract is unchanged: `front_image` / `nutrition` / `hero[].image` values such as
`/crisp_apple_front.png`, `crisp_apple_front.png` or `crisp_apple_front` are matched by file name;
absolute URLs, SVGs and unknown files are rendered exactly as before.
To add an image: put `name.png`, `name.webp`, `name.avif` in `public/` (run `node optimize.js` to generate the latter two).

## What changed
- Desktop hero (`example2`) now renders without waiting for the Render API, preloaded with `fetchpriority=high` (homepage HTML only). 58 KB AVIF instead of 1.5 MB PNG.
  Mobile still shows the loading screen until the API returns, because the mobile hero comes from the backend.
- Lazy loading: product front/back images, Explore images, footer icons, About video (`preload="none"`, poster, starts when near viewport).
- Per-route static HTML (`scripts/postbuild-seo.js`) with correct title/description/canonical/OG tags, `sitemap.xml`, `robots.txt`, 1200×630 `og-image.jpg`.
- Unknown URLs show a `noindex` 404 page; `/admin` is `noindex` (meta + header + robots.txt); Admin code is lazy-loaded.
- App: API fetch only on `/`, error handling, `hero[1]` crash guard, unused `SplitText`/`OrangeJuiceCan`/`Paddle` imports removed.
- `vercel.json`: long-lived immutable cache for `/assets/*`, 30-day cache for images/videos.
- Lint errors fixed (0 errors).

## Not changed on purpose – your decision
- **Google Fonts URL in `index.html`** has stray spaces (`DM+Ser if+Display`, `display=s wap`) so it fails to load. Fixing it changes your typography.
- **Explore copy**: "ORANGE JUICE" heading sits on the apple can; "CLASSIC ILON" text says "rich grap character"; Health Benefit repeats Description.
- **`nav-blur`** `ScrollTrigger` in `HomePage.jsx` targets `.Explore` before it exists, so it never fires (same as before). Left as is to avoid a visual change.
- `hero.png` (8.6 MB) and other unreferenced large files in `public/` are not loaded by the site; delete them if unused.
- Unknown 404s still return HTTP 200 (SPA rewrite) with `noindex`. A true 404 status needs removing the catch-all rewrite in `vercel.json` and listing routes explicitly.
- Full prerendering of API-driven product text is not included (would need a framework change).
