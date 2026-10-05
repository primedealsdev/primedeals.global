#!/usr/bin/env node
// Site checks for primedeals.global. Node only, no dependencies.
// Run from anywhere:  node scripts/check-site.mjs
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://primedeals.global';
const GA_ID = 'G-66QY139D0X';
const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

// ── collect pages ───────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}
const files = walk(ROOT).map((p) => relative(ROOT, p).split(sep).join('/'));

// file -> public path, e.g. en/index.html -> /en/, el-proceso.html -> /el-proceso
const routeOf = (f) => (f === 'index.html' ? '/' : f.endsWith('/index.html') ? '/' + f.slice(0, -10) : '/' + f.slice(0, -5));

// public path -> file (or null)
function resolvePath(p) {
  if (p === '/' || p === '') return 'index.html';
  const clean = p.replace(/^\//, '');
  if (clean.endsWith('/')) return existsSync(join(ROOT, clean, 'index.html')) ? clean + 'index.html' : null;
  if (/\.[a-z0-9]+$/i.test(clean)) return existsSync(join(ROOT, clean)) ? clean : null;
  if (existsSync(join(ROOT, clean + '.html'))) return clean + '.html';
  if (existsSync(join(ROOT, clean, 'index.html'))) return clean + '/index.html';
  return null;
}
const fromUrl = (u) => (u.startsWith(SITE) ? u.slice(SITE.length) || '/' : null);

// ── parse helpers ───────────────────────────────────────────────────────────
const stripComments = (h) => h.replace(/<!--[\s\S]*?-->/g, '');
const meta = (h, attr, name) => {
  const m = h.match(new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`, 'i'));
  return m ? m[1] : null;
};
const attrOf = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
  return m ? m[1] : null;
};
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const pages = {};
for (const f of files) {
  const raw = readFileSync(join(ROOT, f), 'utf8');
  const h = stripComments(raw);
  const robots = meta(h, 'name', 'robots') || '';
  pages[f] = {
    f, raw, h, robots,
    stub: /http-equiv="refresh"/i.test(h),
    is404: f === '404.html',
    noindex: /noindex/i.test(robots),
    route: routeOf(f),
  };
}

// ── sitemap ─────────────────────────────────────────────────────────────────
const sitemapPath = join(ROOT, 'sitemap.xml');
const sitemap = new Map(); // loc -> {lastmod, alts:{lang:href}}
if (!existsSync(sitemapPath)) err('sitemap.xml', 'missing');
else {
  const xml = readFileSync(sitemapPath, 'utf8');
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1];
    const lastmod = (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1];
    const alts = {};
    for (const a of m[1].matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)) alts[a[1]] = a[2];
    if (!loc) { err('sitemap.xml', 'url without loc'); continue; }
    if (sitemap.has(loc)) err('sitemap.xml', `duplicate ${loc}`);
    sitemap.set(loc, { lastmod, alts });
  }
  for (const [loc, { lastmod, alts }] of sitemap) {
    const p = fromUrl(loc);
    if (p === null) { err('sitemap.xml', `${loc} is not on ${SITE}`); continue; }
    if (/\.html($|\?)/.test(loc)) err('sitemap.xml', `${loc} uses .html`);
    const file = resolvePath(p);
    if (!file || !pages[file]) err('sitemap.xml', `${loc} maps to no file`);
    else if (pages[file].noindex) err('sitemap.xml', `${loc} is noindex`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod || '')) err('sitemap.xml', `${loc} has bad lastmod`);
    for (const lang of ['es', 'en', 'x-default']) if (!alts[lang]) err('sitemap.xml', `${loc} lacks hreflang ${lang}`);
    for (const [lang, href] of Object.entries(alts)) {
      if (!sitemap.has(href)) err('sitemap.xml', `${loc}: hreflang ${lang} target ${href} is not in the sitemap`);
    }
  }
}

// ── per-page checks ─────────────────────────────────────────────────────────
const ids = {}; // file -> Set(ids)
for (const pg of Object.values(pages)) ids[pg.f] = new Set([...pg.h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

const pageJson = {};
for (const pg of Object.values(pages)) {
  const { f, h, raw } = pg;

  // links and resources (every page, including stubs and the 404)
  const refs = [];
  for (const m of h.matchAll(/<(a|link|script|img|source)\b[^>]*>/gi)) {
    const tag = m[0];
    const name = m[1].toLowerCase();
    const attr = name === 'a' || name === 'link' ? 'href' : 'src';
    const v = attrOf(tag, attr);
    if (v !== null) refs.push({ name, v: decode(v), tag });
  }
  for (const { name, v, tag } of refs) {
    if (/^(mailto:|tel:|javascript:|data:)/i.test(v)) continue;
    if (/^https?:\/\//i.test(v)) {
      const p = fromUrl(v);
      if (p === null) continue; // external
      if (name === 'a' || name === 'link') checkInternal(f, p, v);
      continue;
    }
    if (v.startsWith('//')) continue;
    if (v.startsWith('#')) {
      if (v.length > 1 && !ids[f].has(v.slice(1))) err(f, `anchor ${v} has no target`);
      continue;
    }
    if (!v.startsWith('/')) { err(f, `relative link "${v}" (use root-relative paths)`); continue; }
    checkInternal(f, v, v);
  }

  function checkInternal(from, p, shown) {
    const [pathPart, hash] = p.split('#');
    const noQuery = pathPart.split('?')[0];
    if (/\.html$/i.test(noQuery)) err(from, `internal link with .html: ${shown}`);
    const target = resolvePath(noQuery);
    if (!target) { err(from, `broken internal link: ${shown}`); return; }
    if (hash && pages[target] && !ids[target].has(hash)) err(from, `anchor #${hash} missing in ${target}`);
  }

  if (pg.stub) {
    if (!pg.noindex) err(f, 'redirect stub must be noindex');
    continue;
  }

  const lang = (h.match(/<html[^>]*\slang="([^"]+)"/i) || [])[1];
  const expected = f.startsWith('en/') ? 'en' : 'es';
  if (lang !== expected) err(f, `html lang is "${lang}", expected "${expected}"`);

  // fonts: self-hosted only
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(h)) err(f, 'still loads Google Fonts');

  if (pg.is404) {
    if (!pg.noindex) err(f, '404 must be noindex');
    continue;
  }

  // visible text must not carry TODO(owner); it belongs in comments only
  const visible = h.replace(/<script[\s\S]*?<\/script>/gi, '');
  if (/TODO\(owner\)/.test(visible)) err(f, 'TODO(owner) visible in the page text');

  const title = decode(((h.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '').trim());
  if (!title) err(f, 'missing <title>');
  else if (title.length > 70) err(f, `title is ${title.length} chars (max 70)`);

  const desc = meta(h, 'name', 'description');
  if (!desc) err(f, 'missing meta description');
  else if (desc.length < 50 || desc.length > 200) err(f, `meta description is ${desc.length} chars (50 to 200)`);

  const canonical = (h.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i) || [])[1];
  if (!canonical) err(f, 'missing canonical');
  else if (canonical !== SITE + pg.route) err(f, `canonical ${canonical} should be ${SITE + pg.route}`);

  // hreflang pair
  const hl = {};
  for (const m of h.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)) hl[m[1]] = m[2];
  for (const k of ['es', 'en', 'x-default']) if (!hl[k]) err(f, `missing hreflang ${k}`);
  if (hl[expected] && canonical && hl[expected] !== canonical) err(f, `hreflang ${expected} must equal the canonical`);
  for (const k of ['es', 'en']) {
    if (!hl[k]) continue;
    const t = resolvePath(fromUrl(hl[k]) || '');
    if (!t || !pages[t]) { err(f, `hreflang ${k} target ${hl[k]} does not exist`); continue; }
    const back = [...pages[t].h.matchAll(/<link\s+rel="alternate"\s+hreflang="(es|en)"\s+href="([^"]+)"/gi)]
      .filter((m) => m[1] === expected).map((m) => m[2]);
    if (!back.includes(SITE + pg.route)) err(f, `hreflang ${k} target ${t} does not point back here`);
  }

  // Open Graph / Twitter
  for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) if (!meta(h, 'property', p)) err(f, `missing ${p}`);
  if (meta(h, 'property', 'og:url') && meta(h, 'property', 'og:url') !== canonical) err(f, 'og:url differs from canonical');
  const ogImg = meta(h, 'property', 'og:image');
  if (ogImg) {
    const p = fromUrl(ogImg);
    if (p === null || !resolvePath(p)) err(f, `og:image does not resolve: ${ogImg}`);
  }
  if (!meta(h, 'name', 'twitter:card')) err(f, 'missing twitter:card');

  // robots
  if (pg.noindex) {
    if (sitemap.has(SITE + pg.route)) err(f, 'noindex page is in the sitemap');
  } else {
    if (!/max-image-preview:large/.test(pg.robots)) err(f, 'missing <meta name="robots" content="max-image-preview:large">');
    if (!sitemap.has(SITE + pg.route)) err(f, 'indexable page is missing from the sitemap');
  }

  // analytics
  if (!h.includes(`id=${GA_ID}`) || !h.includes(`gtag('config', '${GA_ID}')`)) err(f, 'GA4 base snippet missing');
  const ci = h.indexOf("gtag('consent', 'default'");
  if (ci < 0) err(f, 'consent mode default missing');
  else if (ci > h.indexOf("gtag('config'")) err(f, 'consent default must come before gtag config');
  if (!/<script\s+src="\/analytics\.js"\s+defer>/.test(h)) err(f, 'analytics.js not included (deferred)');

  // fonts preloads resolve
  if (!/rel="preload"[^>]*as="font"/.test(h)) err(f, 'no font preload');

  // JSON-LD
  const blocks = [...raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  // comments inside the raw head could hide a block; only count real ones
  const real = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length !== real.length) err(f, 'JSON-LD inside an HTML comment');
  if (!real.length) err(f, 'no JSON-LD block');
  const types = [];
  const parsed = [];
  real.forEach((b, i) => {
    try {
      const j = JSON.parse(b);
      parsed.push(j);
      const t = j['@type'];
      types.push(...(Array.isArray(t) ? t : [t]));
      if (/TODO\(owner\)/.test(b)) err(f, `JSON-LD block ${i + 1} contains TODO(owner)`);
    } catch (e) { err(f, `JSON-LD block ${i + 1} does not parse: ${e.message}`); }
  });
  pageJson[f] = parsed;
  if (pg.route === '/' || pg.route === '/en/') {
    for (const t of ['Organization', 'WebSite']) if (!types.includes(t)) err(f, `home needs ${t} JSON-LD`);
  } else if (!types.includes('BreadcrumbList')) err(f, 'inner page needs BreadcrumbList JSON-LD');
  for (const j of parsed.filter((x) => x['@type'] === 'BreadcrumbList')) {
    for (const it of j.itemListElement) {
      const p = fromUrl(it.item || '');
      if (p === null || !resolvePath(p)) err(f, `breadcrumb item ${it.item} does not resolve`);
    }
  }

  // FAQPage must contain exactly the confirmed answers
  if (/<details class="faq-item"/.test(h)) {
    const confirmed = [...h.matchAll(/<details class="faq-item"([^>]*)>\s*<summary>([\s\S]*?)<\/summary>/g)]
      .filter((m) => !/data-todo/.test(m[1])).map((m) => decode(m[2].trim()));
    const faq = parsed.find((x) => x['@type'] === 'FAQPage');
    if (!faq) err(f, 'FAQ page needs FAQPage JSON-LD');
    else {
      const names = faq.mainEntity.map((q) => q.name);
      for (const n of names) if (!confirmed.includes(n)) err(f, `FAQPage lists an unconfirmed question: ${n}`);
      for (const n of confirmed) if (!names.includes(n)) err(f, `confirmed question missing from FAQPage: ${n}`);
    }
  }

  // images: dimensions and alt
  for (const m of h.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    for (const part of (attrOf(tag, 'srcset') || '').split(',').map((x) => x.trim().split(/\s+/)[0]).filter(Boolean)) {
      if (!resolvePath(part.split('?')[0])) err(f, `<img srcset> target does not exist: ${part}`);
    }
    if (attrOf(tag, 'alt') === null) err(f, `<img> without alt: ${attrOf(tag, 'src')}`);
    if (!attrOf(tag, 'width') || !attrOf(tag, 'height')) err(f, `<img> without width/height: ${attrOf(tag, 'src')}`);
  }
  if (/class="t-photo"/.test(h)) {
    for (const m of h.matchAll(/<div class="t-photo"[^>]*>\s*<img\b[^>]*>/g)) {
      if (!(attrOf(m[0], 'alt') || '').trim()) err(f, 'testimonial photo needs real alt text');
    }
  }

  // no page may link to a hidden (noindex) content page, except itself and its own language twin
  for (const { name, v } of refs) {
    if (name !== 'a' || !v.startsWith('/')) continue;
    const t = resolvePath(v.split('#')[0].split('?')[0]);
    if (!t || t === f || !pages[t] || !pages[t].noindex || pages[t].stub || pages[t].is404) continue;
    const twin = [...h.matchAll(/<link\s+rel="alternate"\s+hreflang="(?:es|en)"\s+href="([^"]+)"/gi)].map((m) => resolvePath(fromUrl(m[1]) || ''));
    if (!twin.includes(t)) err(f, `links to hidden page ${v}`);
  }

  // nav must not link to a hidden (noindex) page
  const nav = (h.match(/<nav class="site-nav"[\s\S]*?<\/nav>/) || [''])[0];
  for (const m of nav.matchAll(/href="([^"]+)"/g)) {
    const t = resolvePath(m[1]);
    if (t && pages[t] && pages[t].noindex) err(f, `nav links to hidden page ${m[1]}`);
  }
}

// image weight budget: product photos must stay light
const MAX_KB = 150;
(function budget(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) budget(p);
    else if (/\.(webp|jpe?g|png)$/i.test(name) && statSync(p).size > MAX_KB * 1024 && !p.includes(`${sep}testimonials${sep}`)) {
      err(relative(ROOT, p).split(sep).join('/'), `image is ${Math.round(statSync(p).size / 1024)} KB (budget ${MAX_KB} KB)`);
    }
  }
})(join(ROOT, 'images'));

// robots.txt
const robots = existsSync(join(ROOT, 'robots.txt')) ? readFileSync(join(ROOT, 'robots.txt'), 'utf8') : '';
if (!new RegExp(`^Sitemap:\\s*${SITE}/sitemap\\.xml\\s*$`, 'm').test(robots)) err('robots.txt', 'Sitemap line missing');

// ── report ──────────────────────────────────────────────────────────────────
const count = Object.values(pages).length;
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) in ${count} pages:\n`);
  for (const e of [...new Set(errors)]) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ ${count} pages, ${sitemap.size} sitemap URLs: all checks passed`);
