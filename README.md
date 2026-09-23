# primedeals.global

Static site for Prime Deals, served by GitHub Pages from `main` (custom domain in
`CNAME`, HTTPS enforced). A merge to `main` is live in about a minute. There is no
build step.

## Pages

| URL | Spanish file | English file |
|---|---|---|
| `/` | `index.html` | `en/index.html` (`/en/`) |
| `/el-proceso` | `el-proceso.html` | `en/the-process.html` (`/en/the-process`) |
| `/testimonios` | `testimonios.html` | `en/testimonials.html` (`/en/testimonials`) |
| any missing URL | `404.html` (bilingual, `noindex`) | |

Spanish URLs are in Spanish, English URLs in English. `the-process.html` and
`testimonials.html` at the root are only redirects to the Spanish pages (those
URLs were live briefly on 2026-09-23). GitHub Pages serves `el-proceso.html` at `/el-proceso`. **Always link without
`.html`**: nav links, `canonical`, `hreflang`, `og:url` and `sitemap.xml` all use
the extensionless form.

## Shared files

- `styles.css`: the whole design system (tokens at the top of `:root`)
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`: icons
- `og.png`: link preview image (1200×630) used by every page
- `og-image.jpg`: older preview image, kept so links shared before 2026-09 still get one
- `images/testimonials/`: testimonial photos (480×480)
- `robots.txt`, `sitemap.xml`

## Adding or changing a page

1. Change the Spanish page and its `/en/` twin together. They mirror each other.
2. Keep every SEO and preview tag in the static `<head>`. Crawlers and WhatsApp
   previews don't run JavaScript.
3. When a page is added, add it to `sitemap.xml` with its `hreflang` pair, and
   update `lastmod`.
4. After a copy change, refresh the WhatsApp/Facebook preview cache at
   <https://developers.facebook.com/tools/debug/> ("Scrape Again").

## Contact details used on the site

- WhatsApp: +51 940 934 722 (`https://wa.me/51940934722`)
- Email: info@primedeals.global
