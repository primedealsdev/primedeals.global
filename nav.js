/* Prime Deals — closes the "Las prendas / Garments" menu on outside click or Escape.
   The menu is a native <details>, so it works without this script. */
(function () {
  'use strict';
  var groups = document.querySelectorAll('.nav-group');
  if (!groups.length) return;

  function closeAll(except) {
    groups.forEach(function (g) { if (g !== except) g.removeAttribute('open'); });
  }
  document.addEventListener('click', function (e) {
    closeAll(e.target.closest ? e.target.closest('.nav-group') : null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    groups.forEach(function (g) {
      if (g.open) { g.removeAttribute('open'); var s = g.querySelector('summary'); if (s) s.focus(); }
    });
  });
  groups.forEach(function (g) {
    g.addEventListener('focusout', function (e) {
      if (!g.contains(e.relatedTarget)) g.removeAttribute('open');
    });
  });
})();
