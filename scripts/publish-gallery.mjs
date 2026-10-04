#!/usr/bin/env node
// Publishes the hidden gallery pages: removes noindex, adds the nav link to
// every page, adds both URLs to sitemap.xml, bumps lastmod.
//   node scripts/publish-gallery.mjs          (refuses while placeholders remain)
//   node scripts/publish-gallery.mjs --force  (skip the placeholder check)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://primedeals.global';
const force = process.argv.includes('--force');

const galleryDir = join(ROOT, 'images', 'gallery');
const left = readdirSync(galleryDir).filter((n) => n.endsWith('.jpg') &&
  readFileSync(join(galleryDir, n)).includes('PD-PLACEHOLDER'));
if (left.length && !force) {
  console.error('Still placeholders (replace each with a real 1200x1500 photo, same file name):\n  ' + left.join('\n  '));
  process.exit(1);
}

const walk = (d, out = []) => {
  for (const n of readdirSync(d)) {
    if (n.startsWith('.') || n === 'node_modules') continue;
    const p = join(d, n);
    statSync(p).isDirectory() ? walk(p, out) : n.endsWith('.html') && out.push(p);
  }
  return out;
};

const NAV = {
  es: { after: /(<a href="\/testimonios"[^>]*>Testimonios<\/a>)/, link: '/galeria', label: 'Galería' },
  en: { after: /(<a href="\/en\/testimonials"[^>]*>Testimonials<\/a>)/, link: '/en/gallery', label: 'Gallery' },
};

for (const p of walk(ROOT)) {
  const rel = relative(ROOT, p).split(sep).join('/');
  let s = readFileSync(p, 'utf8');
  const before = s;
  const isGallery = rel === 'galeria.html' || rel === 'en/gallery.html';
  if (isGallery) {
    s = s.replace(/<!-- Hidden until real photos exist[^>]*-->\n/, '')
         .replace('<meta name="robots" content="noindex">', '<meta name="robots" content="max-image-preview:large">');
  }
  const lang = rel.startsWith('en/') ? 'en' : 'es';
  const n = NAV[lang];
  if (/<nav class="site-nav"/.test(s) && !s.includes(`href="${n.link}"`)) {
    const cur = isGallery ? ' class="current" aria-current="page"' : '';
    s = s.replace(n.after, `$1\n      <a href="${n.link}"${cur}>${n.label}</a>`);
  }
  if (s !== before) writeFileSync(p, s);
}

const today = new Date().toISOString().slice(0, 10);
const smPath = join(ROOT, 'sitemap.xml');
let sm = readFileSync(smPath, 'utf8');
if (!sm.includes(`${SITE}/galeria`)) {
  const entry = (loc) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE}/galeria"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/gallery"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/galeria"/>
  </url>\n`;
  sm = sm.replace('</urlset>', entry('/galeria') + entry('/en/gallery') + '</urlset>');
}
sm = sm.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
writeFileSync(smPath, sm);
console.log('Gallery published. Now run: node scripts/check-site.mjs');
