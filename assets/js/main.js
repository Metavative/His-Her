/* ==========================================================================
   His & Her Med Spa + Academy — interactions
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Split headlines into masked lines ---------- */
  function buildMask(el) {
    if (el.dataset.masked) return;
    el.dataset.masked = '1';
    var html = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = html.map(function (line, i) {
      return '<span class="mask-line"><span style="--d:' + (i * 0.09) + 's">' + line.trim() + '</span></span>';
    }).join('');
    el.classList.add('mask');
  }
  $$('[data-mask]').forEach(buildMask);

  /* ---------- Reveal on scroll ---------- */
  var revealables = $$('[data-rv], .mask, .imgbox');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* Stagger children marked with data-stagger */
  $$('[data-stagger]').forEach(function (parent) {
    var step = parseFloat(parent.dataset.stagger) || 0.09;
    $$('[data-rv]', parent).forEach(function (child, i) {
      child.style.setProperty('--d', (i * step) + 's');
    });
  });

  /* ---------- Header behaviour ---------- */
  var hdr = $('.hdr');
  var lastY = window.scrollY;
  var progress = $('.progress');

  function onScroll() {
    var y = window.scrollY;
    if (hdr) {
      hdr.classList.toggle('is-stuck', y > 40);
      if (y > 460 && y > lastY && !document.body.classList.contains('is-locked')) {
        hdr.classList.add('is-hidden');
      } else {
        hdr.classList.remove('is-hidden');
      }
    }
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    }
    lastY = y;
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = $('.burger');
  var menu = $('.menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-locked');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) burger.click();
    });
  }

  /* ---------- Custom cursor ---------- */
  if (fine && !reduced) {
    var ring = document.createElement('div');
    ring.className = 'cursor';
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      ring.classList.add('is-on');
      dot.classList.add('is-on');
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    window.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget) { ring.classList.remove('is-on'); dot.classList.remove('is-on'); }
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();

    var hoverSel = 'a, button, .sitem, [data-cursor], input, select, textarea, summary';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverSel)) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverSel)) ring.classList.remove('is-hover');
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduced) {
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.22 + 'px,' + y * 0.3 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Service index hover preview ---------- */
  var peek = $('.sindex-peek');
  if (peek && fine && !reduced) {
    var imgs = $$('img', peek);
    var px = 0, py = 0, tx = 0, ty = 0, active = false;

    $$('.sitem[data-peek]').forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        active = true;
        peek.classList.add('is-on');
        imgs.forEach(function (im) {
          im.classList.toggle('is-on', im.dataset.key === item.dataset.peek);
        });
      });
      item.addEventListener('mouseleave', function () {
        active = false;
        peek.classList.remove('is-on');
      });
    });
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      px += (tx - px) * 0.11;
      py += (ty - py) * 0.11;
      if (active) {
        peek.style.left = px + 'px';
        peek.style.top = py + 'px';
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Parallax bands ---------- */
  var bands = $$('[data-parallax]');
  if (bands.length && !reduced) {
    var bTick = false;
    var runParallax = function () {
      bands.forEach(function (b) {
        var r = b.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        var img = $('img', b);
        if (!img) return;
        var prog = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        img.style.transform = 'translate3d(0,' + (prog * -70) + 'px,0)';
      });
    };
    window.addEventListener('scroll', function () {
      if (!bTick) {
        window.requestAnimationFrame(function () { runParallax(); bTick = false; });
        bTick = true;
      }
    }, { passive: true });
    runParallax();
  }

  /* ---------- Count-up stats ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        cio.unobserve(el);
        var target = parseFloat(el.dataset.count);
        var dec = (el.dataset.count.split('.')[1] || '').length;
        var suffix = el.dataset.suffix || '';
        if (reduced) { el.textContent = target.toFixed(dec) + suffix; return; }
        var start = null, dur = 1600;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Testimonial rotator ---------- */
  var quoteWrap = $('.quotes');
  if (quoteWrap) {
    var quotes = $$('.quote', quoteWrap);
    var dots = $$('.qdot');
    var qi = 0, timer;
    function show(i) {
      qi = (i + quotes.length) % quotes.length;
      quotes.forEach(function (q, n) { q.classList.toggle('is-on', n === qi); });
      dots.forEach(function (d, n) { d.classList.toggle('is-on', n === qi); });
    }
    function play() {
      clearInterval(timer);
      if (!reduced) timer = setInterval(function () { show(qi + 1); }, 6500);
    }
    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { show(n); play(); });
    });
    quoteWrap.addEventListener('mouseenter', function () { clearInterval(timer); });
    quoteWrap.addEventListener('mouseleave', play);
    show(0);
    play();
  }

  /* ---------- Accordion ---------- */
  $$('.acc').forEach(function (acc) {
    $$('.acc-q', acc).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc-item');
        var open = item.classList.contains('is-open');
        if (!acc.dataset.multi) {
          $$('.acc-item', acc).forEach(function (i) {
            i.classList.remove('is-open');
            $('.acc-q', i).setAttribute('aria-expanded', 'false');
          });
        }
        item.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', !open ? 'true' : 'false');
      });
    });
  });

  /* ---------- Service filters ---------- */
  var filterBar = $('[data-filters]');
  if (filterBar) {
    $$('.filter', filterBar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.cat;
        $$('.filter', filterBar).forEach(function (b) {
          b.classList.toggle('is-on', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        $$('[data-cat-item]').forEach(function (card) {
          var match = cat === 'all' || card.dataset.catItem === cat;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ---------- Prefill a select from the URL query (?service=Botox) ---------- */
  $$('[data-prefill]').forEach(function (sel) {
    var key = sel.dataset.prefill;
    var want = new URLSearchParams(window.location.search).get(key);
    if (!want) return;
    want = want.replace(/\+/g, ' ').trim().toLowerCase();
    var hit = $$('option', sel).filter(function (o) {
      return o.textContent.trim().toLowerCase() === want;
    })[0];
    if (hit) hit.selected = true;
  });

  /* ---------- Forms (no backend: mailto handoff) ---------- */
  $$('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (v, k) { if (String(v).trim()) lines.push(k + ': ' + v); });
      var subject = form.dataset.subject || 'Website enquiry';
      var href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var msg = $('.form-msg', form);
      if (msg) msg.classList.add('is-on');
      window.location.href = href;
    });
  });

  /* ---------- Page curtain transitions ---------- */
  var curtain = $('.curtain');
  if (curtain && !reduced) {
    // Reveal on load
    curtain.classList.add('is-in');
    requestAnimationFrame(function () {
      setTimeout(function () {
        curtain.classList.remove('is-in');
        curtain.classList.add('is-out');
      }, 60);
    });

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
      if (href.charAt(0) === '#' || /^(mailto|tel|https?):/.test(href)) {
        if (/^https?:/.test(href) && a.host !== window.location.host) return;
        if (href.charAt(0) === '#' || /^(mailto|tel):/.test(href)) return;
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      curtain.classList.remove('is-out');
      curtain.classList.add('is-in');
      setTimeout(function () { window.location.href = href; }, 560);
    });

    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) {
        curtain.classList.remove('is-in');
        curtain.classList.add('is-out');
      }
    });
  }

  /* ---------- Year stamp ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Maps load on click ----------
     The embed is only inserted once the visitor asks for it, so the page never
     contacts Google on first load. Focus moves into the map for keyboard users. */
  $$('.map-load').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.title = btn.getAttribute('data-map-title') || 'Map';
      frame.src = btn.getAttribute('data-map-src');
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.loading = 'eager';
      frame.setAttribute('tabindex', '0');
      btn.replaceWith(frame);
      frame.focus();
    });
  });

  /* ---------- Open-now indicator ---------- */
  $$('[data-open-now]').forEach(function (el) {
    var d = new Date();
    var day = d.getDay(); // 0 Sun … 6 Sat
    var mins = d.getHours() * 60 + d.getMinutes();
    var close = (day >= 1 && day <= 3) ? 18 * 60 : (day >= 4 && day <= 5) ? 20 * 60 : 16 * 60;
    var open = 11 * 60;
    var isOpen = mins >= open && mins < close;
    el.textContent = isOpen ? 'Open now' : 'Closed · opens 11 AM';
  });
})();
