/* Prime Deals — closes the Prendas / Garments menu on outside click or Escape.
   The menu is a native <details>, so it works without this script. */
(function () {
  'use strict';
  var groups = document.querySelectorAll('.nav-group');
  if (!groups.length) return;

  function closeAll(except) {
    groups.forEach(function (g) { if (g !== except) g.removeAttribute('open'); });
  }
  function onOutside(e) {
    closeAll(e.target.closest ? e.target.closest('.nav-group') : null);
  }
  // iOS sends no click for taps on non-interactive areas, so listen for pointerdown too.
  document.addEventListener('pointerdown', onOutside);
  document.addEventListener('click', onOutside);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    groups.forEach(function (g) {
      if (g.open) { g.removeAttribute('open'); var s = g.querySelector('summary'); if (s) s.focus(); }
    });
  });
  groups.forEach(function (g) {
    g.addEventListener('focusout', function (e) {
      // iOS (Safari and Chrome) doesn't focus links on tap, so relatedTarget is null
      // mid-tap; closing then hides the links before the click lands.
      if (e.relatedTarget && !g.contains(e.relatedTarget)) g.removeAttribute('open');
    });
  });
})();
