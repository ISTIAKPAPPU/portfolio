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

  /* ---- motion (GSAP, per the official gsap-* skills). Runs for every visitor, including reduced-motion
          settings (owner's decision 2026-11-22). Progressive enhancement: without GSAP nothing is hidden.
          Transform/opacity only. ---- */
  if (!window.gsap || !window.ScrollTrigger) { return; }
  gsap.registerPlugin(ScrollTrigger);

  /* 1. scroll progress line along the bottom of the top bar */
  gsap.to('.nav-progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
  });

  /* 2. current section: underline its link in the top bar */
  var navLinks = {};
  [].forEach.call(document.querySelectorAll('.nav-links a[href^="#"]'), function (a) { navLinks[a.getAttribute('href').slice(1)] = a; });
  [].forEach.call(document.querySelectorAll('main section[id], footer[id]'), function (sec) {
    var link = navLinks[sec.id === 'archive' ? 'work' : sec.id === 'about' ? '' : sec.id];
    if (!link) { return; }
    ScrollTrigger.create({
      trigger: sec, start: 'top 45%', end: 'bottom 45%',
      onToggle: function (self) {
        link.classList.toggle('is-active', self.isActive);
        if (self.isActive) { link.setAttribute('aria-current', 'true'); } else { link.removeAttribute('aria-current'); }
      }
    });
  });

  /* 3. live XR grid: drifts and fades with scroll (scrub) */
  gsap.to('.hero-grid', {
    yPercent: 16, autoAlpha: 0.25, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  /* 4. entrance while scrolling. Nothing is pre-hidden: each element animates FROM hidden at the moment it
        enters. Only on a normal top-of-page load and only for content still below the screen when GSAP
        arrives (it loads after first paint), so visible content never flickers and anchor jumps stay clean. */
  if (location.hash || window.scrollY > 10) { return; }
  var screenBottom = window.innerHeight;
  function below(sel) {
    return gsap.utils.toArray(sel).filter(function (el) { return el.getBoundingClientRect().top > screenBottom; });
  }
  var titles = below('.section-title');                                  // reads first ...
  var items = below('.about-lead, .prose p, .group-title, .work, .mini, .timeline > li, .skills > div, ' +
    '.award, .pubs li, .edu li, .contact-lead, .contact .hero-actions, .contact-links');
  ScrollTrigger.batch(titles, {                                           // ... then animations
    start: 'top 92%', once: true,
    onEnter: function (batch) { gsap.from(batch, { autoAlpha: 0, x: -20, duration: 0.7, ease: 'power3.out', overwrite: true }); }
  });
  ScrollTrigger.batch(items, {
    start: 'top 94%', once: true,
    onEnter: function (batch) {
      gsap.from(batch, { autoAlpha: 0, y: 24, duration: 0.7, ease: 'power3.out', stagger: 0.08, overwrite: true });
    }
  });
})();
