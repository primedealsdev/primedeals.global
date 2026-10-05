# Owner checklist

Only things the owner can do, in priority order. Tick them off as you go.

## 0. Review and merge the PR

- [ ] Open the PR `claude/growth-and-tech`, look at the screenshots listed in it, merge.
      GitHub Pages is live about a minute later. The `Site checks` workflow runs on every PR.

## 1. Search Console (do this the day it merges)

- [ ] Go to <https://search.google.com/search-console> → *Add property* → **Domain** →
      `primedeals.global`.
- [ ] Google shows a `TXT` record. In Namecheap: *Domain List* → *Manage* → *Advanced DNS* →
      *Add new record* → Type `TXT`, Host `@`, Value = the text Google gave. Save, wait a
      few minutes, click *Verify*.
- [ ] *Sitemaps* → enter `sitemap.xml` → *Submit*.
- [ ] *URL inspection* → paste each new URL below → *Request indexing* (about 10 a day is the cap):
      `/rashguards`, `/shorts`, `/preguntas-frecuentes`, `/cotizar`, then the
      `/en/` twins (`/en/rashguards`, `/en/shorts`, `/en/faq`, `/en/quote`).

## 2. Bing Webmaster Tools

- [ ] <https://www.bing.com/webmasters> → *Sign in with Google* → *Import from Google Search
      Console* → pick `primedeals.global`. The sitemap comes with it.

## 3. GA4

- [ ] Follow `docs/ANALYTICS.md`: mark `whatsapp_click`, `email_click`, `instagram_click` and
      `quote_submit` as Key events, register the custom dimensions, link Search Console,
      create the `Contacted us` audience.

## 4. Instagram bio link

- [ ] Instagram → *Edit profile* → *Links* → replace the link with
      `https://primedeals.global/?utm_source=instagram&utm_medium=bio&utm_campaign=profile`
      (English version and other links are in `docs/ANALYTICS.md`).

## 5. Real answers the site is waiting for

Each one is an HTML comment `TODO(owner)` in the file (search the repo for `TODO(owner)`).

FAQ (`preguntas-frecuentes.html` and `en/faq.html`). For each, replace the generic answer
with the real one, delete `data-todo="owner"` and the comment above it, and add the
question to the `FAQPage` JSON-LD in `<head>` (`node scripts/check-site.mjs` tells you if the
two disagree):

- [ ] Minimum order (per product)
- [ ] Lead time (production + delivery, per product)
- [ ] Samples: offered? cost? how long?
- [ ] Sizing: size range, kids' sizes, how a size chart is collected
- [ ] Shipping to the US: how, who pays, duties, typical time
- [ ] Payment: deposit, balance, accepted methods, currencies
- [ ] Which design file formats you accept (add to the "own design" answer)

Product pages (both languages), "Tela y confección" / "Cloth and construction":

- [ ] Rashguards (manga corta y larga): fabric composition, print method, size range, collar/patch options
- Kimonos: **parked, possible product next year.** Nothing to do now; the full list of what is
  missing and how to restore is in `docs/KIMONO.md`.
- [ ] Shorts (shorts, shorts de compresión, leggings): fabric and construction per garment, print method, sizes, kids?

## 6. Gallery: real photos and permissions

The gallery is live with the supplied images (a mix of real photos and design visualizations,
disclosed on the page). To improve it, see `docs/PHOTOS.md`:

- [ ] Tell us which images are real photos (then each gets its own label).
- [ ] Say which clients agree to appear (Favoreto, Almeida, Constrictor, others) so their
      garments can be added, including long sleeve and women's cuts.
- [ ] A real, unbranded fight-shorts photo, and a photo of a team wearing an order (get the
      coach's OK).

## 7. Google Business Profile

- [ ] <https://www.google.com/business> → *Add your business* → name `Prime Deals`.
- [ ] Google requires an address to verify. If you have no public premises, choose
      *service-area business* (Lima, and the US if you want) and keep the address hidden.
      Do not enter an address that is not yours.
- [ ] Category: pick the closest available in the dropdown (names vary): primary something like
      *Custom clothing* or *Sportswear*, secondary *Martial arts supply* if offered.
- [ ] Website `https://primedeals.global/?utm_source=google_business&utm_medium=profile&utm_campaign=gbp`;
      phone +51 940 934 722; link Instagram.
- [ ] Description (ES): *Indumentaria técnica personalizada para deportes de combate: rashguards
      shorts y leggings para academias y marcas. Un solo interlocutor, de la idea a la
      entrega. Hecho en el Perú.*
- [ ] Description (EN): *Custom technical apparel for combat sports: rashguards and fight
      shorts for academies and brands. One point of contact, from idea to delivery. Made in Peru.*

## 8. Reviews

- [ ] Once the profile is verified, ask the coaches who already gave testimonials (not anyone who
      has not agreed to be published) for a Google review. Message:
      *Hola [nombre], ¿me ayudas con una reseña en Google? Toma 1 minuto: [enlace de reseñas].
      Cuéntale a otros entrenadores cómo fue trabajar con Prime. ¡Gracias!*
      (Business Profile → *Get more reviews* → copy the link.)

## 9. Refresh the link previews

- [ ] <https://developers.facebook.com/tools/debug/> → paste each URL → *Scrape Again*:
      `/`, `/en/`, `/rashguards`, `/en/rashguards`, `/shorts`,
      `/en/shorts`, `/preguntas-frecuentes`, `/en/faq`, `/cotizar`, `/en/quote`,
      `/el-proceso`, `/en/the-process`, `/testimonios`, `/en/testimonials`
      (all prefixed with `https://primedeals.global`).

## 10. Five outreach ideas

1. **Ask existing clients to introduce one academy owner each.** The four published coaches
   already trust you; a two-line intro from them beats any ad.
2. **Sponsor one small tournament** in Lima or Miami with custom rashguards for the
   organizers or podium, in exchange for your logo and a link on the event page.
3. **Show a real order end to end on Instagram**: design, approval, delivery. Tag the academy
   and link the bio URL with UTMs so you can see what converts.
4. **Get listed on local BJJ directories and event pages** (federation or regional
   tournament sites, academy directories in Peru and the US), pointing to `/rashguards`.
5. **Offer visiting-seminar organizers** custom shirts for the guest coach and
   participants: a small order that puts your work in front of a full room.
