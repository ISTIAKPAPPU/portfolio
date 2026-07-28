/* Istiak Ahmed — portfolio behaviour: scroll reveal, mobile nav, video modal */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll reveal, staggered per group ---- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (entry, i) {
        entry.target.style.setProperty('--d', Math.min(i * 70, 350) + 'ms');
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    reveals.forEach(function (el) { io.observe(el); });

    /* section-label rules draw themselves in */
    var labelIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); labelIo.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    [].forEach.call(document.querySelectorAll('.sec-label'), function (el) { labelIo.observe(el); });
  }

  /* ---- stat numbers count up ---- */
  var stats = [].slice.call(document.querySelectorAll('.stat-n'));

  if (reduce || !('IntersectionObserver' in window)) {
    // leave the printed values alone
  } else {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        statIo.unobserve(el);

        var raw = el.textContent.trim();
        var target = parseInt(raw, 10);
        var suffix = raw.replace(/[0-9]/g, '');
        if (isNaN(target)) return;

        var start = null;
        var dur = 900;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        el.textContent = '0' + suffix;
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });

    stats.forEach(function (el) { statIo.observe(el); });
  }

  /* ---- nav gains a shadow once it leaves the hero ---- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('stuck', window.scrollY > 40);
    };
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

  /* ---- video modal ---- */
  var modal = document.getElementById('modal');
  var mount = document.getElementById('modalMount');
  var closeBtn = document.getElementById('modalClose');

  function openVideo(id) {
    mount.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Project demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    modal.hidden = false;
    document.body.classList.add('locked');
    closeBtn.focus();
  }

  function closeVideo() {
    modal.hidden = true;
    mount.innerHTML = '';
    document.body.classList.remove('locked');
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-video]');
    if (trigger) {
      e.preventDefault();
      openVideo(trigger.getAttribute('data-video'));
    }
  });

  closeBtn.addEventListener('click', closeVideo);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeVideo();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeVideo();
  });
})();
