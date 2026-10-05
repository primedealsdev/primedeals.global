# Product images

Source: `fotos_catalogos.zip` from the owner (2026-10-04): a **mix of real photos and AI
visualizations**. We do not know per image which is which, so the pages say so once:
*"Imágenes de prendas producidas y visualizaciones de diseño."* /
*"Images show produced garments and design visualizations."*

## What is on the site

| Page | Images (front + back) | Folder |
|---|---|---|
| `/galeria`, `/en/gallery` (own section, in the nav) | **Rashguards:** full-design sublimation, kids, colored raglan sleeves, black. **Shorts:** fight shorts, compression shorts, spats (leggings) | `images/products/rashguards/`, `images/products/shorts/` |

Product pages and the home page carry no images; the product pages link to the gallery.

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
- [ ] To add an image: put 480 and 800 px WebP files (4:5, under 150 KB) in `images/products/<group>/`
      and add a `<li><figure>` to both gallery pages; `node scripts/check-site.mjs` validates it.
