/* Prime Deals — process timeline. Without JS every step's text is already visible. */
(function () {
  'use strict';
  var root = document.querySelector('.timeline');
  if (!root) return;
  var nodes = Array.prototype.slice.call(root.querySelectorAll('.tl-node'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.tl-panel'));
  function show(i, focus) {
    nodes.forEach(function (n, k) {
      n.setAttribute('aria-selected', k === i ? 'true' : 'false');
      n.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (p, k) { p.hidden = k !== i; });
    if (focus) nodes[i].focus();
  }
  root.classList.add('is-ready');
  nodes.forEach(function (n, i) {
    n.addEventListener('click', function () { show(i); });
    n.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); show((i + d + nodes.length) % nodes.length, true); }
    });
  });
  show(0);
})();
