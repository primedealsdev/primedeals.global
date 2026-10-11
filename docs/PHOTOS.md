# Product images

Source: `fotos_catalogos.zip` from the owner (2026-10-04): a **mix of real photos and AI
visualizations**. We do not know per image which is which, so the pages say so once:
*"Imágenes de prendas producidas y visualizaciones de diseño."* /
*"Images show produced garments and design visualizations."*

## What is on the site

The Gallery (`/galeria`, `/en/gallery`, in the nav) is the only place with product images. It
opens with one section per client, then generic examples.

| Section | Images | Folder |
|---|---|---|
| Favoreto Escola de Jiu Jitsu (Miami) | adult, kids, special project, black and white tees | `images/clients/favoreto/` |
| Almeida Jiu Jitsu Perú (Lima) | long sleeve, women's long and short sleeve | `images/clients/almeida/` |
| Constrictor Peru (Lima) | rashguard | `images/clients/constrictor/` |
| Sniper | octopus rashguard | `images/clients/sniper/` |
| Sacred Valley Grappling | tee | `images/clients/sacred-valley/` |
| More examples: Rashguards, Shorts | design and garment examples, shorts, compression shorts, spats | `images/products/` |

Product pages and the home page carry no images; the product pages link to the gallery.
Each image exists at 480 and 800 px wide (WebP, 4:5, flattened on a light neutral; landscape
sources are padded rather than cropped). The checker fails if any image under `images/`
(except testimonial photos) exceeds 150 KB or a `srcset` target is missing.

## Permission

Favoreto, Almeida, Constrictor, Sniper and Sacred Valley agreed to appear (owner, 2026-10-04).
BÔA was added on 2026-10-10 by the owner's instruction ("puedes incluir BOA también"), as one
rashguard in the home carousel and on the Prendas page. The image is a catalog render
(`primeos/pricing/catalogo/b2b/special_projects/rashguard_boa_front.png`), not a photo. Before it
ships, the owner should confirm BÔA agreed to appear. Do not add any other new client until the
owner says so.

The Way is a brand like the others and may be named in captions ("The Way Infantil",
"The Way Ranked - Black Belt"). The "Defeat your demons" render (bushido) was removed on request
and is to be replaced by a better photo.

## Rules applied

- Client sections are named after the client (they agreed); the generic examples never name a
  brand in alt text or captions. Sniper has no location line.
- Hoodies, crewnecks and the plain black long-sleeve top were left out (AI-generated).
- Hat left out (not a product line).
- The source files for the adult Favoreto pair were labeled front/back the wrong way round;
  they are swapped here. Check this for any new file.

## To do

- [ ] Say which images are real photos. Then the single line ("produced garments and design
      visualizations") can become per-image labels.
- [ ] A real, unbranded fight-shorts photo would be better than the branded one.
- [ ] Add the images to the `Service` JSON-LD and use one as the page's link preview once
      real/representative status is settled.
- [ ] To add an image: put 480 and 800 px WebP files (4:5, under 150 KB) in the right folder
      and add a `<li><figure>` to both gallery pages; `node scripts/check-site.mjs` validates it.
