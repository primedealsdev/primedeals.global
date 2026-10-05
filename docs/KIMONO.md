# Kimonos / gis: parked product

**Status: not offered right now. May return as a product, possibly next year.**
The pages are built and kept. They are hidden, not deleted. Do not delete them.

| | |
|---|---|
| Spanish page | `kimonos.html` → `/kimonos` |
| English page | `en/gis.html` → `/en/gis` |
| State | `noindex`, not in the nav, sitemap, home, FAQ, quote form or gallery (no gi images exist yet), and nothing links to them |
| Why it is safe | `scripts/check-site.mjs` fails if any page links to a hidden page or lists it in the sitemap |
| Parked on | 2026-10-04, commit "park kimonos" (`57739eb`, PR #5) |

## What the hidden pages say today

Only what the site already promised: custom kimono (gi) for academies and brands, one point
of contact, production overseen in Lima, the second order matches the first, price agreed in
writing before production. **There are no gi-specific facts** (no weight, weave, colors,
patches, sizes), because none were provided. The copy must not be published as the final
version of a real product page without the facts below.

## What is needed before relaunch (owner)

Nothing here can be invented; each is a `TODO(owner)` in the page source.

- [ ] Decision: are kimonos offered, from when, in which markets (Peru, US, both)?
- [ ] Fabric weight and weave, and what the tops and pants are made of
- [ ] Colors available, and whether any color is a made-to-order option
- [ ] Customization: patches, embroidery, printed details, labels, what is and is not possible
- [ ] Size range, and whether kids' gis are included
- [ ] Minimum order for gis, typical lead time, sample policy, price guidance (if public)
- [ ] 1 to 3 real photos of a finished gi (add them to the gallery, see `docs/PHOTOS.md`)
- [ ] A proof point: a client or coach willing to be quoted about a gi (the current
      testimonials are about rashguards)
- [ ] If kimonos change the shipping, payment or lead-time answers, update the FAQ

## How to bring it back

Do these in one PR, in this order:

1. Update the facts on both pages (`kimonos.html`, `en/gis.html`) and remove the
   `TODO(owner)` comments you have answered. Keep the es and en pages in step.
2. Try `git revert 57739eb`. It restores the nav, home section, FAQ answer, quote-form option,
   sitemap entries and `noindex` removal in one step. If later commits made it conflict, do the
   steps below by hand.
3. By hand, the places to restore:
   - `<meta name="robots">` on both pages: `max-image-preview:large` instead of `noindex`
   - nav item on every page: `Kimonos` (es) / `Gis` (en), between Rashguards and Shorts
   - home "What we make" card (`index.html`, `en/index.html`)
   - FAQ answer "¿Qué productos hacen?" / "What do you make?", visible text, links and `FAQPage` JSON-LD
   - quote form product option (`cotizar.html`, `en/quote.html`)
   - `sitemap.xml`: both URLs with the hreflang pair and today's `lastmod`
   - gallery: add a Kimonos group with the real gi photos
   - `docs/OWNER-TODO.md` (Search Console URLs, Facebook "Scrape Again" list, GBP description)
4. `node scripts/check-site.mjs` must pass.
5. After merge: request indexing for `/kimonos` and `/en/gis`, "Scrape Again" in the Facebook
   debugger, and mention gis in the Google Business Profile description.

## Why this is not a quick toggle

The kimono pages touch ten places and
depend on facts that do not exist yet. If the relaunch becomes likely, ask for a
`scripts/publish-kimono.mjs` that does the restore in one command.
