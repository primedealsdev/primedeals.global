# primedeals.global

Static site for Prime Deals, served by GitHub Pages from `main` (custom domain in
`CNAME`, HTTPS enforced). A merge to `main` is live in about a minute. There is no
build step.

## Pages

| URL | Spanish file | English file |
|---|---|---|
| `/` | `index.html` | `en/index.html` (`/en/`) |
| `/rashguards` | `rashguards.html` | `en/rashguards.html` (`/en/rashguards`) |
| `/kimonos` | `kimonos.html` | `en/gis.html` (`/en/gis`) |
| `/pantalonetas` | `pantalonetas.html` | `en/fight-shorts.html` (`/en/fight-shorts`) |
| `/el-proceso` | `el-proceso.html` | `en/the-process.html` (`/en/the-process`) |
| `/testimonios` | `testimonios.html` | `en/testimonials.html` (`/en/testimonials`) |
| `/preguntas-frecuentes` | `preguntas-frecuentes.html` | `en/faq.html` (`/en/faq`) |
| `/cotizar` | `cotizar.html` | `en/quote.html` (`/en/quote`) |
| `/galeria` (hidden: `noindex`, no nav, not in sitemap) | `galeria.html` | `en/gallery.html` (`/en/gallery`) |
| any missing URL | `404.html` (bilingual, `noindex`) | |

Spanish URLs are in Spanish, English URLs in English. `the-process.html` and
`testimonials.html` at the root are only redirects to the Spanish pages (those
URLs were live briefly on 2026-09-23). GitHub Pages serves `el-proceso.html` at `/el-proceso`. **Always link without
`.html`**: nav links, `canonical`, `hreflang`, `og:url` and `sitemap.xml` all use
the extensionless form.

## Shared files

- `styles.css`: the whole design system (tokens at the top of `:root`; fonts are `@font-face` rules at the top)
- `fonts/`: self-hosted latin woff2 (Cormorant Garamond, Geist, JetBrains Mono)
- `analytics.js`: GA4 events (WhatsApp / email / Instagram clicks, language switch, CTA view,
  scroll depth). Included, deferred, on every real page. See `docs/ANALYTICS.md`
- `quote.js`: the quote form (`/cotizar`): builds a WhatsApp message and a `mailto:` fallback
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`: icons
- `og.png`: link preview image (1200×630) used by every page
- `og-image.jpg`: older preview image, kept so links shared before 2026-09 still get one
- `images/testimonials/`: testimonial photos (480×480)
- `images/gallery/`: gallery photos (1200×1500). Currently labelled placeholders
- `robots.txt`, `sitemap.xml`

## Adding or changing a page

1. Change the Spanish page and its `/en/` twin together. They mirror each other.
2. Keep every SEO and preview tag in the static `<head>`. Crawlers and WhatsApp
   previews don't run JavaScript.
3. When a page is added, add it to `sitemap.xml` with its `hreflang` pair, and
   update `lastmod`. Add it to the nav and footer of every page too.
4. Run `node scripts/check-site.mjs` (also runs on every PR). It checks internal links, no
   `.html` in links, title, description, canonical, hreflang pair, Open Graph, JSON-LD,
   sitemap, and that no `TODO(owner)` is visible.
5. After a copy change, refresh the WhatsApp/Facebook preview cache at
   <https://developers.facebook.com/tools/debug/> ("Scrape Again").

## Publishing the gallery

`/galeria` and `/en/gallery` stay hidden until `images/gallery/` holds real photos (the
required files are listed in `docs/OWNER-TODO.md`). Then:

```
node scripts/publish-gallery.mjs && node scripts/check-site.mjs
```

## Docs

- `docs/OWNER-TODO.md`: things only the owner can do
- `docs/ANALYTICS.md`: events, GA4 setup steps, UTM convention
- `docs/DECISIONS.md`: choices made where the brief was ambiguous

## Contact details used on the site

- WhatsApp: +51 940 934 722 (`https://wa.me/51940934722`)
- Email: info@primedeals.global
