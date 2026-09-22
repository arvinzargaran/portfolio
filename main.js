/* ==========================================================================
   Motion engine.

   One rAF loop, one lerped "shadow scroll" value. Everything that moves reads
   from that value, so scroll motion is continuous and reversible rather than
   a set of one-shot fades — but the loop only runs while there is something
   to settle, so an idle page costs nothing.

   Nothing here is load-bearing for content: if this file fails outright, the
   page still renders complete and readable (see the `js` / `observed` gating
   in styles.css).
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Theme toggle ---------------------------------------------- */
  var btn = document.getElementById('theme');
  function currentTheme() {
    return root.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      btn.setAttribute('aria-label', 'Switch to ' + (next === 'dark' ? 'light' : 'dark') + ' theme');
    });
  }

  if (!('IntersectionObserver' in window)) return;

  /* ---------- Chapter list -----------------------------------------------
     Chapters are resolved inside the scroll pass rather than by an observer:
     one source of truth for scroll-driven state, and no dependence on
     observer callbacks that a throttled tab may never deliver. */
  var chapters = [].slice.call(document.querySelectorAll('section[data-chapter]'));
  var bounds = [];
  var geo = { docH: 1, heroFade: 1, thesisTop: 0, thesisTravel: 0, vh: 0 };

  /* All layout reads happen HERE and nowhere else. Reading offsetTop or
     scrollHeight inside the scroll pass forces a synchronous reflow on every
     frame, which thrashes layout and janks the whole page. */
  function measure() {
    bounds = chapters.map(function (el) {
      return { name: el.getAttribute('data-chapter'), top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight };
    });
    var h = document.querySelector('.hero');
    var t = document.querySelector('.thesis');
    geo.vh = window.innerHeight;
    geo.docH = document.documentElement.scrollHeight - geo.vh;
    geo.heroFade = h ? h.offsetHeight * 0.9 : 1;
    geo.thesisTop = t ? t.offsetTop : 0;
    geo.thesisTravel = t ? Math.max(1, t.offsetHeight - geo.vh) : 1;
    // `meters` is declared further down; measure() also runs before that.
    if (meters) meters.forEach(function (m) {
      m.top = m.el.getBoundingClientRect().top + window.scrollY;
    });
    // Same for the reveals, so the scroll pass can decide visibility from
    // cached numbers instead of a per-frame getBoundingClientRect.
    if (reveals) reveals.forEach(function (r) {
      r.top = r.el.getBoundingClientRect().top + window.scrollY;
    });
  }
  measure();
  addEventListener('resize', measure, { passive: true });
  addEventListener('load', measure);

  function setChapter(pos) {
    var mid = pos + window.innerHeight / 2;
    for (var i = bounds.length - 1; i >= 0; i--) {
      if (mid >= bounds[i].top && mid < bounds[i].bottom) {
        if (root.getAttribute('data-chapter') !== bounds[i].name) {
          root.setAttribute('data-chapter', bounds[i].name);
        }
        return;
      }
    }
  }

  // Always on, including under reduced motion (the damped pass returns early there).
  addEventListener('scroll', function () { setChapter(window.scrollY); }, { passive: true });
  setChapter(window.scrollY);

  /* ---------- Scroll reveals ---------------------------------------------
     Applied before the damped loop so content is never gated on rAF. */
  var revealsPending = true;
  var reveals = [].slice.call(document.querySelectorAll('.rise')).map(function (el) {
    return { el: el, top: el.getBoundingClientRect().top + window.scrollY };
  });
  if (reveals.length && !reduced.matches) {
    root.classList.add('observed');
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px 240px 0px' });
    reveals.forEach(function (r) { revealIO.observe(r.el); });
    // Safety net: never leave anything hidden.
    setTimeout(function () { reveals.forEach(function (r) { r.el.classList.add('is-in'); }); }, 4000);
  }

  /* ---------- The Confidence Meter ---------------------------------------
     Driven by the same scroll pass as everything else rather than by a
     one-shot observer + setTimeout chain. v2's version could be sitting fully
     on screen still reading "0 / 6" with its claims dimmed, which looks like
     a broken panel rather than an instrument mid-fill. */
  var meters = [].slice.call(document.querySelectorAll('.instrument')).map(function (inst) {
    var segs = [].slice.call(inst.querySelectorAll('.meter i'));
    return {
      el: inst,
      segs: segs,
      sourced: segs.filter(function (s) { return !s.classList.contains('gap'); }),
      claims: [].slice.call(inst.querySelectorAll('.claims li:not(.unverified)')),
      read: inst.querySelector('[data-read]'),
      total: inst.querySelectorAll('.claims li').length,
      top: 0
    };
  });

  /* The hero index quotes each record's ratio. Derive it from the records
     themselves once on load so the two can't drift when a claim is added.
     Runs here, not in the scroll pass — no layout is read and nothing it
     touches can hide content. */
  (function syncIndex() {
    document.querySelectorAll('[data-index-read]').forEach(function (el) {
      var m = meters[parseInt(el.getAttribute('data-index-read'), 10)];
      if (!m) return;
      el.innerHTML = '<b>' + m.sourced.length + '</b> / ' + m.total;
    });
  })();

  function fillMeters(pos) {
    meters.forEach(function (m) {
      // 0 as the instrument's top reaches the lower third of the viewport,
      // 1 by the time it is a third of the way up.
      var p = clamp01((pos + geo.vh * 0.72 - m.top) / (geo.vh * 0.45));
      var n = m.sourced.length;
      var lit = 0;
      m.segs.forEach(function (seg) {
        if (seg.classList.contains('gap')) { seg.style.setProperty('--t', p.toFixed(3)); return; }
        var i = m.sourced.indexOf(seg);
        var each = 1 / n;
        var t = clamp01((p - i * each * 0.8) / (each * 1.6));
        seg.style.setProperty('--t', t.toFixed(3));
        if (t > 0.55) lit++;
      });
      m.claims.forEach(function (c, i) { c.classList.toggle('lit', i < lit); });
      if (m.read) {
        if (m.read.textContent !== lit + ' / ' + m.total) m.read.textContent = lit + ' / ' + m.total;
        /* Red once it has settled AND is actually short of the total — the
           instrument reporting its own shortfall. This used to read
           `lit >= n`, which is just "finished filling", so a record with
           nothing unproven still coloured its readout red. Every record had a
           gap until the UFC numbers landed, so the bug never showed. */
        m.read.classList.toggle('short', lit >= n && n < m.total);
      }
    });
  }

  measure();

  if (reduced.matches) {
    meters.forEach(function (m) {
      m.segs.forEach(function (s) { s.style.setProperty('--t', '1'); });
      m.claims.forEach(function (c) { c.classList.add('lit'); });
      if (m.read) {
        m.read.textContent = m.sourced.length + ' / ' + m.total;
        m.read.classList.toggle('short', m.sourced.length < m.total);
      }
    });
    return;
  }

  /* ---------- Damped scroll engine ---------------------------------------
     `target` is the real scroll position; `shadow` chases it with a lerp.
     Reading the lerped value is what makes bound motion feel weighted
     instead of glued to the wheel. We never move the scroll itself. */
  var hero = document.querySelector('.hero');
  var thesis = document.querySelector('.thesis');
  var lines = [].slice.call(document.querySelectorAll('.thesis-line .ln'));
  var legend = document.querySelector('.thesis-legend');
  var scorecard = document.querySelector('.scorecard');
  var ticks = [].slice.call(document.querySelectorAll('.ticks i'));
  var tallies = [].slice.call(document.querySelectorAll('.tally')).map(function (el) {
    return { el: el, to: parseInt(el.getAttribute('data-tally'), 10) || 0 };
  });

  var shadow = window.scrollY;
  var running = false;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function mapRange(v, a, b) { return clamp01((v - a) / (b - a)); }

  /* Two positions, deliberately.

     `truth` is the real scroll offset and drives everything that decides
     whether content is VISIBLE. `damped` is the lerped value and drives only
     decoration that cannot hide anything.

     v2 ran all of it off the damped value, so any interruption to the rAF
     loop — a background tab, a dropped frame budget — stranded the page at a
     stale position with the thesis clipped to nothing. Visibility must never
     depend on an animation loop keeping up. */
  function apply(truth, damped) {
    setChapter(truth);

    /* IntersectionObserver alone was leaving content hidden: measured with the
       4s net disabled, a full continuous scroll still left the work heading
       and the third record at opacity 0, and a jump straight to #work left six
       of eight hidden. Anyone clicking the nav saw an empty section until the
       net fired. So the same rule as everything else here — visibility is
       decided from `truth` against positions cached in measure(), never from
       an observer we cannot prove fired, and never from `damped`. */
    if (revealsPending && reveals) {
      revealsPending = false;
      for (var ri = 0; ri < reveals.length; ri++) {
        if (reveals[ri].el.classList.contains('is-in')) continue;
        if (reveals[ri].top < truth + geo.vh + 240) reveals[ri].el.classList.add('is-in');
        else revealsPending = true;
      }
    }

    root.style.setProperty('--scroll', geo.docH > 0 ? clamp01(truth / geo.docH).toFixed(4) : 0);

    // Decoration only: the hero has no opacity fade, so a stale value here is
    // invisible to the reader.
    if (hero) hero.style.setProperty('--hero-p', mapRange(damped, 0, geo.heroFade).toFixed(4));

    if (thesis && lines.length) {
      var p = mapRange(truth, geo.thesisTop, geo.thesisTop + geo.thesisTravel);

      // 0.00 → 0.22  the sentence wipes open fast, so the scene is never blank
      var slice = 0.16 / lines.length;
      lines.forEach(function (ln, i) {
        ln.style.setProperty('--l', mapRange(p, i * slice, i * slice + slice + 0.06).toFixed(4));
      });

      // 0.20 → 0.30  the legend teaches the two states
      if (legend) legend.style.setProperty('--legend', mapRange(p, 0.20, 0.30).toFixed(4));

      // 0.28 → 0.38  the scorecard arrives
      if (scorecard) scorecard.style.setProperty('--sc', mapRange(p, 0.28, 0.38).toFixed(4));

      // 0.35 → 0.80  the gauge fills column by column, then the scene holds
      if (ticks.length) {
        var each = 0.45 / ticks.length, start = 0.35;
        ticks.forEach(function (t, i) {
          t.style.setProperty('--t', mapRange(p, start + i * each, start + i * each + each * 2.4).toFixed(4));
        });
      }

      // The two live counts track the gauge; the total is a fixed fact and is
      // never animated, because every intermediate value would be a false claim.
      var drawn = clamp01((p - 0.35) / 0.45);
      tallies.forEach(function (t) {
        var v = Math.round(t.to * drawn);
        if (t.el.textContent !== String(v)) t.el.textContent = v;
      });
    }

    fillMeters(truth);

    if (!root.classList.contains('driven')) root.classList.add('driven');
  }

  function frame() {
    var target = window.scrollY;
    var gap = target - shadow;

    // A gap this large means we lost frames or the user jumped. Snap rather
    // than easing across a whole viewport of stale motion.
    if (Math.abs(gap) > geo.vh) shadow = target;
    else shadow += gap * 0.1;
    if (Math.abs(target - shadow) < 0.4) shadow = target;

    apply(target, shadow);

    if (shadow !== target) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function kick() {
    apply(window.scrollY, shadow);   // correct immediately, every time
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', function () { measure(); kick(); }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { shadow = window.scrollY; kick(); }
  });
  addEventListener('load', function () { measure(); shadow = window.scrollY; kick(); });
  kick();

  /* ---------- Sticky-nav hairline ---------------------------------------- */
  var bar = document.querySelector('.topbar');
  if (bar) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (e) {
      bar.classList.toggle('is-stuck', !e[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Magnetic buttons (desktop pointers only) -------------------
     ±8px pull, released on leave. Gated so touch devices never inherit a
     hover-only affordance. */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      // Rect is read once on enter, not on every move — a getBoundingClientRect
      // per pointermove is another forced reflow, on the hottest event there is.
      var r = null;
      el.addEventListener('pointerenter', function () { r = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', function (ev) {
        if (!r) r = el.getBoundingClientRect();
        var dx = (ev.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
        el.style.setProperty('--mx', (dx * 10).toFixed(2) + 'px');
        el.style.setProperty('--my', (dy * 8).toFixed(2) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        r = null;
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });
  }
})();
