/* Prime Deals — home works carousel. Native scroll-snap; JS only adds arrows, dots and autoplay. */
(function () {
  'use strict';
  var root = document.querySelector('.carousel');
  if (!root) return;
  var track = root.querySelector('.car-track');
  var slides = Array.prototype.slice.call(track.children);
  var dots = Array.prototype.slice.call(root.querySelectorAll('.car-dot'));
  var prev = root.querySelector('.car-prev'), next = root.querySelector('.car-next');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;

  function index() {
    var x = track.scrollLeft, best = 0, d = Infinity;
    slides.forEach(function (s, i) { var k = Math.abs(s.offsetLeft - track.offsetLeft - x); if (k < d) { d = k; best = i; } });
    return best;
  }
  function go(i) {
    i = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  }
  function sync() {
    var i = index();
    dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  }
  prev.addEventListener('click', function () { go(index() - 1); });
  next.addEventListener('click', function () { go(index() + 1); });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
  track.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });

  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() { if (reduce || timer) return; timer = setInterval(function () { go(index() + 1); }, 5000); }
  ['mouseenter', 'focusin', 'touchstart', 'pointerdown'].forEach(function (e) { root.addEventListener(e, stop, { passive: true }); });
  ['mouseleave'].forEach(function (e) { root.addEventListener(e, start); });
  root.classList.add('is-ready');
  sync();
  start();
})();
