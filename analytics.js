/* Prime Deals — GA4 conversion events. Loaded deferred on every real page.
   Needs the inline gtag() snippet in <head>; does nothing if gtag is missing. */
(function () {
  'use strict';

  var lang = document.documentElement.lang === 'en' ? 'en' : 'es';

  function track(name, params) {
    if (typeof window.gtag !== 'function') return;
    var data = { page_path: location.pathname, language: lang, transport_type: 'beacon' };
    for (var key in params) data[key] = params[key];
    window.gtag('event', name, data);
  }
  window.pdTrack = track; // quote.js reuses this

  function where(el) {
    var tagged = el.closest('[data-loc]');
    if (tagged) return tagged.getAttribute('data-loc');
    if (el.closest('.testimonial')) return 'testimonial';
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.cta')) return 'cta';
    return 'body';
  }

  function onClick(e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var params = { link_location: where(a) };

    if (a.matches('.lang-toggle a')) {
      params.from = lang;
      params.to = a.getAttribute('hreflang') || (lang === 'es' ? 'en' : 'es');
      track('language_switch', params);
    } else if (a.matches('a[href*="wa.me"]')) {
      track('whatsapp_click', params);
    } else if (a.matches('a[href^="mailto:"]')) {
      track('email_click', params);
    } else if (a.matches('a[href*="instagram.com"]')) {
      track('instagram_click', params);
    }
  }
  document.addEventListener('click', onClick);
  document.addEventListener('auxclick', function (e) { if (e.button === 1) onClick(e); });

  if (!('IntersectionObserver' in window)) return;

  // cta_view: the closing call-to-action scrolled into view (once per page).
  var cta = document.querySelector('.cta');
  if (cta) {
    var ctaObserver = new IntersectionObserver(function (entries) {
      if (entries.some(function (en) { return en.isIntersecting; })) {
        ctaObserver.disconnect();
        track('cta_view', { link_location: 'cta' });
      }
    }, { threshold: 0.5 });
    ctaObserver.observe(cta);
  }

  // scroll_depth 50 / 90: invisible absolutely-positioned sentinels, so no layout shift.
  // Pages that fit on one screen are skipped (there is nothing to scroll).
  var root = document.documentElement;
  var sentinels = [];
  function place() {
    var h = Math.max(root.scrollHeight, document.body.scrollHeight);
    sentinels.forEach(function (s) { s.el.style.top = Math.round(h * s.pct / 100) + 'px'; });
  }
  [50, 90].forEach(function (pct) {
    var el = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:absolute;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden';
    root.appendChild(el);
    sentinels.push({ el: el, pct: pct });
  });
  place();
  window.addEventListener('load', place);
  if ('ResizeObserver' in window) new ResizeObserver(place).observe(document.body);

  var depthObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var s = sentinels.filter(function (x) { return x.el === en.target; })[0];
      if (!s || s.done) return;
      s.done = true;
      depthObserver.unobserve(s.el);
      track('scroll_depth', { percent: s.pct });
    });
  });
  // Start observing on the first real scroll, so short pages and pages that grow
  // after load never report depth for a visitor who did not scroll.
  window.addEventListener('scroll', function start() {
    window.removeEventListener('scroll', start);
    place();
    if (root.scrollHeight <= window.innerHeight + 50) return;
    sentinels.forEach(function (s) { depthObserver.observe(s.el); });
  }, { passive: true });
})();
