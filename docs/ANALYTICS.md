# Analytics (GA4 `G-66QY139D0X`)

`analytics.js` (deferred, on every real page) sends the events below through the inline
`gtag()` snippet in each page's `<head>`. Every event carries `page_path`, `language`
(`es` or `en`) and `transport_type: beacon` (so it survives a page navigation).

## Events

| Event | When | Extra parameters |
|---|---|---|
| `whatsapp_click` | click on any `a[href*="wa.me"]` | `link_location` |
| `email_click` | click on any `a[href^="mailto:"]` | `link_location` |
| `instagram_click` | click on any `a[href*="instagram.com"]` | `link_location` |
| `language_switch` | click on the ES/EN toggle | `from`, `to`, `link_location` |
| `cta_view` | the closing call-to-action is at least half visible (once per page) | `link_location` |
| `scroll_depth` | 50% and 90% of the page height has entered the viewport (once each; skipped on pages that fit one screen) | `percent` |
| `quote_submit` | the quote form validated and the message was built | `product`, `quantity`, `has_deadline`, `has_design_link` |

`link_location` is one of `header`, `footer`, `cta`, `testimonial`, `quote`, `body`.
Instagram links inside testimonials point to the *academies'* profiles, so they are tagged
`testimonial`: exclude them when you count clicks to our own profile.

`quote_submit` never includes the name, contact or design link; only the shape of the request.

`scroll_depth` is custom because GA4's built-in `scroll` event only fires at 90%.

## Consent mode

The base snippet declares Consent Mode v2 with `analytics_storage: granted` (Peru / US)
and ad storage / ad user data / personalization `denied` (no ads are used). To serve the
EU, change `analytics_storage` to `'denied'` in the snippet on every page and call
`gtag('consent','update',{analytics_storage:'granted'})` when the visitor accepts. The
snippet's comment says the same.

## Manual steps in GA4 (only you can do these)

1. **Check the events arrive.** Open the site, click a WhatsApp button, then go to
   Admin → *DebugView* (use the "Google Analytics Debugger" Chrome extension, or Tag Assistant).
   Normal reports take up to 24 h.
2. **Mark Key events.** Admin → *Data display* → *Events*. Find `whatsapp_click`,
   `email_click`, `instagram_click` and switch on *Mark as key event*. Also mark
   `quote_submit`: it is the strongest buying signal. An event only appears in the list once
   it has fired at least once; until then use Admin → *Key events* → *New key event* and type
   the exact name.
3. **Register the parameters you want to report on.** Admin → *Custom definitions* →
   *Create custom dimension*, scope *Event*: `link_location`, `language`, `product`.
   (Without this the parameters are collected but cannot be used in reports.)
4. **Link Search Console.** First verify the domain in Search Console (see
   `docs/OWNER-TODO.md`). Then Admin → *Product links* → *Search Console links* → *Link*,
   choose the `primedeals.global` property, pick the web data stream, submit.
5. **Create the audience.** Admin → *Audiences* → *New audience* → *Create a custom audience*.
   Name: `Contacted us`. Condition: include users when event `whatsapp_click` **or**
   `email_click` **or** `quote_submit`. Membership duration 30 days. Save.
6. **Ignore test traffic.** Local testing on 2026-10-04 may have sent a few page views whose
   hostname is `127.0.0.1`. In Explorations, filter *Hostname* = `primedeals.global`.

## UTM naming convention

Lowercase, no spaces, `_` between words. Never put UTMs on links *inside* the site.

| Parameter | Rule | Examples |
|---|---|---|
| `utm_source` | where the link lives | `instagram`, `whatsapp`, `email`, `google_business` |
| `utm_medium` | kind of placement | `bio`, `story`, `reel`, `status`, `signature`, `profile` |
| `utm_campaign` | why it exists | `profile`, `custom_rashguards`, `reorder`, `tournament_2026` |

### Ready to paste

Instagram bio (Spanish, default):

```
https://primedeals.global/?utm_source=instagram&utm_medium=bio&utm_campaign=profile
```

Instagram bio (English, for a US audience):

```
https://primedeals.global/en/?utm_source=instagram&utm_medium=bio&utm_campaign=profile_en
```

Others:

```
https://primedeals.global/rashguards?utm_source=instagram&utm_medium=story&utm_campaign=custom_rashguards
https://primedeals.global/cotizar?utm_source=whatsapp&utm_medium=status&utm_campaign=quote
https://primedeals.global/?utm_source=email&utm_medium=signature&utm_campaign=profile
https://primedeals.global/?utm_source=google_business&utm_medium=profile&utm_campaign=gbp
```
