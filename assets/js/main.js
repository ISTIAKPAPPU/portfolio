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

  /* ---- motion (GSAP, per the official gsap-* skills). Progressive enhancement: without GSAP, or with
          prefers-reduced-motion, nothing is hidden and nothing moves. Transform/opacity only. ---- */
  if (!window.gsap) { return; }
  var plugins = [window.ScrollTrigger, window.DrawSVGPlugin].filter(Boolean);
  if (plugins.length) { gsap.registerPlugin.apply(gsap, plugins); }

  var mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    /* 1. reticle "calibrates": rings draw, cross-hair slides in, centre locks; then a slow pulse */
    var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    if (window.DrawSVGPlugin) { tl.from('.ret-ring', { drawSVG: '50% 50%', duration: 0.9 }, 0.15); }
    tl.from('.ret-line', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.45, stagger: 0.07 }, 0.35)
      .from('.ret-dot', { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(3)' }, 0.8);
    gsap.fromTo('.ret-pulse', { scale: 1, opacity: 0.55, transformOrigin: '50% 50%' },
      { scale: 1.7, opacity: 0, duration: 2.4, ease: 'sine.out', repeat: -1, repeatDelay: 1.8, delay: 1.5 });

    if (!window.ScrollTrigger) { return; }

    /* 3. live XR grid: drifts and fades with scroll (scrub) */
    gsap.to('.hero-grid', {
      yPercent: 16, autoAlpha: 0.25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    /* 2. section entrance: nothing is pre-hidden. Each element animates FROM hidden only at the moment it
          enters, so an anchor jump (e.g. #contact) or a failed trigger can never leave content invisible. */
    /* Only on a normal top-of-page load, and only for content still below the screen when GSAP arrives
       (it loads from the CDN after first paint): no flicker on visible content, no fades on anchor jumps. */
    if (location.hash || window.scrollY > 10) { return; }
    var screenBottom = window.innerHeight;
    var targets = gsap.utils.toArray('.section-title, .about-lead, .prose p, .group-title, .work, .mini, ' +
      '.timeline > li, .skills > div, .award, .pubs li, .edu li, .contact-lead')
      .filter(function (el) { return el.getBoundingClientRect().top > screenBottom; });
    ScrollTrigger.batch(targets, {
      start: 'top 94%', once: true,
      onEnter: function (batch) {
        gsap.from(batch, { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power2.out', stagger: 0.07, overwrite: true });
      }
    });
  });
})();
