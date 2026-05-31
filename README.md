# primedeals.global — Despliegue del nuevo sitio

Paquete listo para reemplazar el sitio actual. Sube **los 3 archivos** a la
raíz del dominio (donde hoy vive el `index.html` viejo) y reemplaza el existente.

## Contenido

| Archivo        | Qué es                                              |
|----------------|-----------------------------------------------------|
| `index.html`   | La página completa (ES/EN, responsive). Es el sitio. |
| `og.png`       | Imagen de previsualización social (1200×630).        |
| `favicon.svg`  | Ícono de la pestaña del navegador.                   |

> Las tipografías (Cormorant Garamond, Geist, JetBrains Mono) se cargan desde
> Google Fonts vía CDN — no hay que subir nada más. El sitio necesita conexión
> a internet del visitante, como cualquier web normal.

## Pasos para publicar

1. **Sube los 3 archivos a la raíz del sitio** (la carpeta pública del hosting:
   `public_html/`, `www/`, `/`, o el origen de tu CDN/Netlify/Vercel).
   Deben quedar accesibles como:
   - `https://primedeals.global/`            → `index.html`
   - `https://primedeals.global/og.png`      → imagen social
   - `https://primedeals.global/favicon.svg` → ícono
2. **Reemplaza** el `index.html` antiguo por el nuevo.
3. Abre `https://primedeals.global` en el navegador y confirma que carga.

## Importante: refrescar la previsualización de WhatsApp / redes

WhatsApp, Facebook y LinkedIn **cachean** la tarjeta del enlace. Si ya
compartiste el link antes, seguirás viendo la versión vieja durante días.
Para forzar la actualización después de publicar:

1. Entra a **https://developers.facebook.com/tools/debug/**
2. Pega `https://primedeals.global`
3. Clic en **"Scrape Again"** (Volver a extraer).

Eso regenera la tarjeta con el nuevo título, descripción e imagen `og.png`.

## Datos de contacto ya configurados en el sitio

- **WhatsApp:** +51 940 934 722 → `https://wa.me/51940934722`
- **Correo:** info@primedeals.global

## Si el dominio NO es `primedeals.global`

Las meta tags y la URL canónica apuntan a `https://primedeals.global`.
Si publicas en otro dominio, abre `index.html` y reemplaza todas las
apariciones de `https://primedeals.global` por tu dominio real (están en las
etiquetas `og:url`, `og:image`, `twitter:image` y `canonical`, en el `<head>`).

---

¿Necesitas editar la imagen social? El archivo fuente es `og-card-source.html`
(en la carpeta superior del proyecto): ábrelo, edítalo y vuelve a exportar.
