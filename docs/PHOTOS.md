# Product images

Source: `fotos_catalogos.zip` from the owner (2026-10-04): a **mix of real photos and AI
visualizations**. We do not know per image which is which, so the pages say so once:
*"Imágenes de prendas producidas y visualizaciones de diseño."* /
*"Images show produced garments and design visualizations."*

## What is on the site

| Page | Images (front + back) | Folder |
|---|---|---|
| `/rashguards`, `/en/rashguards` | full-design sublimation, kids, colored raglan sleeves, black | `images/products/rashguards/` |
| `/shorts`, `/en/shorts` | fight shorts, compression shorts, spats (leggings) | `images/products/shorts/` |
| Home (`/`, `/en/`) | 3-image strip linking to the product pages | reuses the above |

Each image exists at 480 and 800 px wide (WebP, 4:5, flattened on a light neutral). The
checker fails if any image under `images/` (except testimonial photos) exceeds 150 KB or a
`srcset` target is missing.

## Rules applied

- Alt text and captions describe the garment; they never name a brand or a client.
- **Not in the repo (the repo is public):** client-branded images (Favoreto, Almeida,
  Constrictor, Sniper octopus, Sacred Valley, BÔA), until each client has agreed.
  They are processed and ready locally, not committed.
- Hoodies, crewnecks and the plain black long-sleeve top were left out (AI-generated).
- Hat left out (not a product line).

## To do

- [ ] Say which images are real photos. Then the note can be replaced by per-image labels
      (real: no label, visualization: "Visualización").
- [ ] Client permissions: which academies may appear (see above).
- [ ] A real fight-shorts photo that is not branded would be better than the one used.
- [ ] Add the product images to the `Service` JSON-LD and use one as the page's link preview
      once real/representative status is settled.
- [ ] If you want the gallery published with these: `docs/OWNER-TODO.md` section 6, then
      `node scripts/publish-gallery.mjs`.
