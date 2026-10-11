# Decisions

Choices made while building the growth and technical-SEO round (branch
`claude/growth-and-tech`, 2026-10-04) where the brief was ambiguous.

## Content and facts

1. **No invented facts.** Where a fact is unknown (fabric composition, minimum order, lead
   time, sample policy, size range, shipping terms, payment terms, gi/shorts specifics),
   the visible copy says only what the site already promised ("we confirm in writing before
   we start"). The gap is marked `TODO(owner)` in an HTML comment (never in visible text, never
   in JSON-LD) and listed in `docs/OWNER-TODO.md`. `scripts/check-site.mjs` fails if
   `TODO(owner)` ever shows up in visible text or structured data.
2. **FAQ: 12 questions, 6 confirmed.** Only the six answers backed by existing site content
   are in the `FAQPage` JSON-LD. The other six carry `data-todo="owner"` and stay out until
   confirmed; the checker enforces that the JSON-LD matches the confirmed set exactly.
3. **Facts taken from the testimonials page:** kids' rashguards exist, mesh side panels
   exist, work with academies in Lima and Miami. These are the only product details used.
4. **Keyword wording.** "Custom fight shorts manufacturer" is not used verbatim. Pages say
   "made in Lima" and "we oversee production", the wording already on the site, and make no
   claim about owning a facility.
5. **Home trust line** ("We already work with jiu jitsu academies in Lima and Miami") rests
   only on the four published testimonials.

## Structured data

6. **No `Review` / `AggregateRating`.** The testimonials carry no ratings, so an
   `AggregateRating` would be invented, and Google ignores self-published reviews of the
   business's own organization. Skipped; revisit when Google Business Profile reviews exist.
7. **`Service` instead of `Product`** on the product pages: they are custom-made-to-order
   offerings with no price or product photo, and a `Product` without offers or images is
   flagged by Google. No price anywhere.
8. Organization got an `@id` so the `WebSite` and `Service` blocks reference it.

## Pages

9. **Gallery** (superseded by 25): was built hidden with placeholders and a publish script.
10. **Nav is four items** (superseded the 7-item version): Inicio, Proceso, **Prendas**
    (Rashguards, Shorts, Galería) and Testimonios (English: Home, Process, Garments, Testimonials).
    One word per item, in both languages. The group is a native `<details>` dropdown
    (works without JS, keyboard friendly; `nav.js` only closes it on outside click or Esc).
    Cotizar and Preguntas frecuentes left the nav on purpose; they stay in the footer and in
    the page CTAs.
11. **Quote form:** works without a backend. On submit it validates, fires `quote_submit`,
    opens WhatsApp with the message, and shows the message with WhatsApp and email buttons
    (the fallback if the popup is blocked). Without JavaScript the form posts to `mailto:`.
12. **Home `h3` headings became `h2`** (pillars, process steps) to fix heading order, with no
    visual change. `--fg-faint` was lightened (4.0:1 to 4.9:1 contrast) to pass WCAG AA.

## Technical

13. **`og-image.jpg` is kept.** The README says it exists for links shared before 2026-09.
14. **Fonts:** latin-subset variable woff2 files from Google Fonts (SIL OFL), with Google's
    own `unicode-range`. Two files are preloaded (Cormorant Garamond, Geist).
15. **Consent Mode:** analytics granted by default, ad signals denied (no ads are used).
16. **`scroll_depth`** is a custom event; GA4's built-in `scroll` only fires at 90%.
17. **`_config.yml`** excludes `docs/`, `scripts/`, `.github/` and `README.md` from the
    published site (GitHub Pages runs Jekyll by default and would otherwise serve them).
    This adds no build step.
18. **`robots.txt`** still allows everything. Hidden pages rely on `noindex`, which crawlers
    can only see if they may fetch the page.
19. **Every `lastmod` is 2026-10-04**: every page changed (fonts, analytics, nav).
20. **Generator not committed.** The new pages were written with a throwaway script; the
    repo has no build step and the HTML files are the source of truth.
21. **Review follow-ups:** scroll depth waits for a real scroll; the quote form rejects past
    deadlines, quantities over 999999 and malformed phone numbers; FAQPage answers have no
    dangling link text; the publish script (since removed) only bumped `lastmod` on pages it changed.
    Left as is on purpose: `areaServed` includes the US (a Miami academy is a published
    client), and consent stays `granted` by default as the brief asks.
22. **Kimonos/gis parked (not offered for now).** The pages stay in the repo as `noindex`, out of
    the nav, the sitemap, the home page, the FAQ, the quote form and the gallery. The checker
    fails if any page links to a hidden page. To bring them back: `git revert` the
    "park kimonos" commit, or follow `docs/KIMONO.md` (restores nav, sitemap, home, FAQ and form), then re-confirm the gi
    facts in `docs/OWNER-TODO.md`.
23. **Product structure and names (tops / bottoms).** Tops: Rashguards, in short or long sleeve.
    Bottoms: shorts, compression shorts and leggings, on one page `/shorts`
    (`/en/shorts`), named just "Shorts" and at the same level as Rashguards (nav, home
    card, eyebrow, H1), with the three garments in the subtitle. The old "Pantalonetas" / "Fight shorts" pages were renamed before
    going live, so there is no redirect to keep. The garment taxonomy comes from the owner;
    the words come from the research in `docs/TERMINOLOGY.md`.
24. **Product images (2026-10-04).** The supplied set is a mix of real photos and AI
    visualizations, so each page carries one honest line saying so. The Way-branded and
    unbranded garments are used as capability examples (owner's call); no page text or alt
    text names that brand. Client-branded images stay out of the public repo until each client
    agrees. Details and status: `docs/PHOTOS.md`.
25. **Images live in their own section (2026-10-04).** Product images above the text felt
    disruptive, so product pages and the home page are text-first and the images moved to the
    Gallery page (`/galeria`, `/en/gallery`), grouped by Rashguards and Shorts. Product pages
    link to it ("Ver ejemplos" / "See examples"). The gallery is published (indexable, in the
    nav and sitemap); the placeholder photos and `publish-gallery.mjs` were removed.
26. **Client images are in (2026-10-04).** The owner confirmed that Favoreto, Almeida,
    Constrictor, Sniper and Sacred Valley agreed to appear, so each has a named section at the
    top of the Gallery. BÔA was not confirmed and stays out. The Way-branded work remains allowed
    as a capability example, without naming that brand in text.
27. **Process is five steps (2026-10-04):** Definición, Diseño, Confección, **Calidad**,
    Entrega (EN: Scope, Design, Production, **Quality**, Delivery). The quality step is wording the
    owner shaped: "Verificamos que cada pieza sea fiel a lo que aprobaste. Si algo no está bien,
    se corrige antes de salir." Every "cuatro pasos" (FAQ, product pages, page title and
    description) became "cinco pasos". The claim must stay true in practice: if the real quality
    check differs, change the copy.
28. **Site restructure (2026-10-10).** Navigation is Inicio · Prendas · Testimonios plus a Cotizar
    button. `/prendas` (EN `/en/garments`) replaces the Gallery: one page, grouped by garment, with
    the fabric line written once per group (rashguards, compression shorts and leggings 85/15
    poliéster/elastano; shorts 95/5). The process is no longer a page: it is a five-step
    timeline on the home page (`#proceso`, EN `#process`) with every step's text in the HTML;
    `/el-proceso`, `/galeria` and their EN twins are noindex redirect stubs. `/rashguards` and
    `/shorts` stay as detail pages, linked from Prendas, out of the main nav. The home hero is a
    carousel of every rashguard. Public copy never says "Nova" or "antifluido".
