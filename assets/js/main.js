/* Istiak Ahmed, portfolio behaviour: header rule, mobile nav, video modal.
   No scroll reveals or counters (design plan: one load moment only). */
(function () {
  'use strict';

  /* ---- header gains a rule once the page scrolls ---- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('stuck', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- video modal: any element with data-video opens the demo ---- */
  var modal = document.getElementById('modal');
  var mount = document.getElementById('modalMount');
  var closeBtn = document.getElementById('modalClose');
  var lastTrigger = null;

  function openVideo(id) {
    mount.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Project demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    modal.hidden = false;
    document.body.classList.add('locked');
    closeBtn.focus();
  }

  function closeVideo() {
    modal.hidden = true;
    mount.innerHTML = '';
    document.body.classList.remove('locked');
    if (lastTrigger) { lastTrigger.focus(); }
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-video]');
    if (trigger) {
      e.preventDefault();
      lastTrigger = trigger;
      openVideo(trigger.getAttribute('data-video'));
    }
  });
  closeBtn.addEventListener('click', closeVideo);
  modal.addEventListener('click', function (e) { if (e.target === modal) { closeVideo(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) { closeVideo(); } });
})();
