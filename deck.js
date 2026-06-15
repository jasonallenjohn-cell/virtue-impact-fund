/* ============================================================================
   Virtue Impact Fund — shared deck runtime
   A dependency-free reimplementation of the Claude Design "deck-stage":
     • scales the fixed 1920x1080 canvas to fit the viewport (letterboxed)
     • keyboard nav: ← → PgUp PgDn Space Home End, number keys, R to reset
     • click / tap nav: left third = prev, right two-thirds = next
       (clicks on links/buttons are left alone)
     • bottom-centre slide counter that fades out when idle
     • deep-links the current slide to the URL hash (#3) so a shared link can
       open on a specific slide
   ========================================================================== */
(function () {
  'use strict';

  var DESIGN_W = 1920;
  var DESIGN_H = 1080;
  var OVERLAY_IDLE_MS = 1800;

  var stage = document.getElementById('stage');
  var canvas = document.getElementById('canvas');
  var overlay = document.getElementById('deckOverlay');
  var home = document.querySelector('.deck-home');
  if (!stage || !canvas) return;

  var slides = Array.prototype.slice.call(canvas.querySelectorAll('.slide'));
  var total = slides.length;
  var index = 0;
  var hideTimer = null;

  /* ---- scale-to-fit, letterboxed ---- */
  function fit() {
    var s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
    canvas.style.transform = 'scale(' + s + ')';
  }

  /* ---- slide visibility ---- */
  function render() {
    for (var i = 0; i < total; i++) {
      slides[i].classList.toggle('active', i === index);
    }
    if (overlay) {
      overlay.innerHTML =
        '<span class="deck-count">' + (index + 1) + ' / ' + total + '</span>' +
        '<span class="deck-sep"></span>' +
        '<span class="deck-hint">← → navigate · ⌘P to PDF</span>';
    }
    flashOverlay();
    var hash = '#' + (index + 1);
    if (location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  }

  function go(n) {
    var next = Math.max(0, Math.min(total - 1, n));
    if (next === index) return;
    index = next;
    render();
  }
  function nextSlide() { go(index + 1); }
  function prevSlide() { go(index - 1); }

  /* ---- overlay idle behaviour ---- */
  function flashOverlay() {
    if (overlay) overlay.setAttribute('data-visible', '');
    if (home) home.setAttribute('data-visible', '');
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (overlay) overlay.removeAttribute('data-visible');
      if (home) home.removeAttribute('data-visible');
    }, OVERLAY_IDLE_MS);
  }

  /* ---- keyboard ---- */
  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return; // leave ⌘P etc. alone
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': case 'Spacebar':
        nextSlide(); e.preventDefault(); break;
      case 'ArrowLeft': case 'PageUp':
        prevSlide(); e.preventDefault(); break;
      case 'Home': go(0); e.preventDefault(); break;
      case 'End': go(total - 1); e.preventDefault(); break;
      case 'r': case 'R': go(0); e.preventDefault(); break;
      default:
        if (e.key >= '1' && e.key <= '9') { go(parseInt(e.key, 10) - 1); e.preventDefault(); }
    }
  }

  /* ---- click / tap nav (ignore interactive targets) ---- */
  var INTERACTIVE = 'a[href],button,input,select,textarea,summary,label,[role="button"],[onclick]';
  function onPointer(e) {
    if (e.target.closest && e.target.closest(INTERACTIVE)) return;
    if (e.target.closest && e.target.closest('.deck-home')) return;
    var x = e.clientX;
    if (x < window.innerWidth * 0.33) prevSlide();
    else nextSlide();
  }

  /* ---- wire up ---- */
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  document.addEventListener('keydown', onKey);
  stage.addEventListener('click', onPointer);
  window.addEventListener('mousemove', flashOverlay, { passive: true });

  // Open on the slide named in the URL hash (#3), if any.
  var fromHash = parseInt((location.hash || '').replace('#', ''), 10);
  if (fromHash >= 1 && fromHash <= total) index = fromHash - 1;

  fit();
  render();
})();
