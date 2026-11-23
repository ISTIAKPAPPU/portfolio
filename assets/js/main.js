/* Istiak Ahmed, portfolio v2 behaviour: theme toggle, header, mobile nav, video modal, hero particle network,
   counters, and GSAP motion (scroll progress, active section, hero intro, scroll entrances). */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---- theme toggle (light default, owner 2026-11-22; choice remembered; storage may be blocked) ---- */
  var themeBtn = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
    if (themeMeta) { themeMeta.setAttribute('content', t === 'light' ? '#F5F8FC' : '#070B14'); }
    document.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  }
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* not remembered: fine */ }
    });
  }

  /* ---- header gains a shadow once the page scrolls ---- */
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

  /* ---- hero particle network: linked particles, gentle push away from the pointer.
          Pauses when the hero is off-screen or the tab is hidden; colours follow the theme. ---- */
  var canvas = document.getElementById('heroCanvas');
  var hero = canvas && canvas.parentElement;
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var parts = [], W = 0, H = 0, dpr = 1, running = false, visible = true, raf = 0;
    var mouse = { x: null, y: null };
    var col1 = '34, 211, 238', col2 = '167, 139, 250';
    var LINK = 120;
    function readColours() {
      var cs = getComputedStyle(root);
      col1 = (cs.getPropertyValue('--p1') || col1).trim();
      col2 = (cs.getPropertyValue('--p2') || col2).trim();
    }
    function size() {
      var r = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(24, Math.min(70, Math.round((W * H) / 14000)));
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.45,
                     vy: (Math.random() - 0.5) * 0.45, r: Math.random() * 1.8 + 0.6, c: Math.random() > 0.5 ? 1 : 2,
                     a: Math.random() * 0.45 + 0.4 });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (mouse.x !== null) {
          var mx = mouse.x - p.x, my = mouse.y - p.y, md = Math.sqrt(mx * mx + my * my);
          if (md < 140) { var f = (140 - md) / 140; p.x -= mx * f * 0.03; p.y -= my * f * 0.03; }
        }
        if (p.x < 0 || p.x > W) { p.vx *= -1; p.x = Math.max(0, Math.min(W, p.x)); }
        if (p.y < 0 || p.y > H) { p.vy *= -1; p.y = Math.max(0, Math.min(H, p.y)); }
        ctx.fillStyle = 'rgba(' + (p.c === 1 ? col1 : col2) + ',' + p.a + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      ctx.lineWidth = 0.6;
      for (var a = 0; a < parts.length; a++) {
        for (var b = a + 1; b < parts.length; b++) {
          var dx = parts[a].x - parts[b].x, dy = parts[a].y - parts[b].y, d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            ctx.strokeStyle = 'rgba(' + col1 + ',' + (0.26 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(parts[a].x, parts[a].y); ctx.lineTo(parts[b].x, parts[b].y); ctx.stroke();
          }
        }
      }
      canvas.setAttribute('data-frames', String((+canvas.getAttribute('data-frames') || 0) + 1));
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; cancelAnimationFrame(raf); }
    readColours(); size(); start();
    var resizeT = 0;
    window.addEventListener('resize', function () { clearTimeout(resizeT); resizeT = setTimeout(size, 150); });
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', function () { mouse.x = null; mouse.y = null; });
    document.addEventListener('visibilitychange', function () { if (document.hidden) { stop(); } else { start(); } });
    document.addEventListener('themechange', readColours);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) { start(); } else { stop(); }
      }).observe(hero);
    }
  }

  /* ---- counters: count up once when they come into view (final text is in the HTML) ---- */
  var nums = [].slice.call(document.querySelectorAll('.stat-num[data-count]'));
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10), suffix = el.getAttribute('data-suffix') || '';
    var t0 = null, dur = 1300;
    function step(ts) {
      if (t0 === null) { t0 = ts; }
      var k = Math.min(1, (ts - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * eased) + (k === 1 ? suffix : '');
      if (k < 1) { requestAnimationFrame(step); }
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }
  if (nums.length && 'IntersectionObserver' in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); seen.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { seen.observe(el); });
  }

  /* ---- motion (GSAP). Runs for every visitor (owner's decision 2026-11-22). Without GSAP nothing stays hidden:
          the head script removes the "intro" class after 2.5 s. Transform/opacity only. ---- */
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('intro'); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* 1. hero intro: badge, name, role, text, stats, buttons and portrait arrive in sequence */
  var introItems = gsap.utils.toArray('.hero-intro > *, .hero-portrait');
  gsap.set(introItems, { autoAlpha: 0, y: 22 });
  root.classList.remove('intro');
  gsap.to(introItems, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.05 });

  /* 2. scroll progress line along the bottom of the top bar */
  gsap.to('.nav-progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
  });

  /* 3. current section: underline its link in the top bar */
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

  /* 4. hero background drifts as the page scrolls */
  gsap.to('.hero-canvas', {
    yPercent: 14, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  /* 5. entrances while scrolling. Only content still below the screen on a normal top-of-page load is animated,
        so visible content never flickers and anchor jumps stay clean. */
  if (location.hash || window.scrollY > 10) { return; }
  var screenBottom = window.innerHeight;
  function below(sel) {
    return gsap.utils.toArray(sel).filter(function (el) { return el.getBoundingClientRect().top > screenBottom; });
  }
  var titles = below('.section-title');
  var items = below('.about-lead, .prose p, .group-title, .work, .mini, .timeline > li, .skills > div, ' +
    '.award, .pubs li, .edu li, .contact-lead, .actions li');
  ScrollTrigger.batch(titles, {
    start: 'top 92%', once: true,
    onEnter: function (batch) { gsap.from(batch, { autoAlpha: 0, y: 26, scale: 0.97, duration: 0.8, ease: 'power3.out', overwrite: true }); }
  });
  ScrollTrigger.batch(items, {
    start: 'top 94%', once: true,
    onEnter: function (batch) {
      gsap.from(batch, { autoAlpha: 0, y: 30, duration: 0.75, ease: 'power3.out', stagger: 0.09, overwrite: true });
    }
  });
})();
