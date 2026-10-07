/* Generates src/imageManifest.json from the files in /public.
 * For every PNG/JPG it records: width/height (to prevent layout shift) and which
 * modern variants exist. AVIF is only listed when it is meaningfully smaller than
 * the WebP (AVIF is not always the smaller file, e.g. the Explore images).
 * Runs automatically before `npm run dev` and `npm run build`. */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public');
const out = path.join(root, 'src', 'imageManifest.json');
const AVIF_MIN_SAVING = 0.9; // AVIF must be <= 90% of the WebP size to be offered

const size = (p) => (fs.existsSync(p) ? fs.statSync(p).size : null);
const manifest = {};

for (const file of fs.readdirSync(dir).sort()) {
  const m = file.match(/^(.*)\.(png|jpe?g)$/i);
  if (!m) continue;
  const [, base, ext] = m;
  const meta = await sharp(path.join(dir, file)).metadata();
  const webp = size(path.join(dir, `${base}.webp`));
  const avif = size(path.join(dir, `${base}.avif`));
  manifest[base] = {
    ext: ext.toLowerCase(),
    w: meta.width,
    h: meta.height,
    webp: webp !== null,
    avif: avif !== null && (webp === null || avif <= webp * AVIF_MIN_SAVING),
  };
}
fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`image manifest: ${Object.keys(manifest).length} images -> src/imageManifest.json`);
