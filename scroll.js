/* ============================================================
   scroll.js — the single-page scroll engine.

   Provides three things to the page:
     1. pinned sections  — [data-pin] track + .pin-stage sticky child.
                           Progress 0-1 is written to the stage as --p and
                           handed to callbacks registered via registerPin().
     2. parallax         — [data-parallax="<factor>"] translates on Y.
     3. progress bar     — #scroll-progress scaleX over whole-page scroll.

   Reveals are NOT here — script.js owns .reveal -> .visible.

   Metrics are measured on resize only, never per frame: reading layout
   inside the rAF loop is what makes scroll engines jank.
   ============================================================ */
(function () {
    'use strict';

    var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    var reduced = reduceMQ.matches;

    var pins = [];
    var parallax = [];
    var spy = [];
    var spyActive = null;
    var bar = null;
    var vh = window.innerHeight;
    var docScroll = 1;
    var raf = 0;
    var lastT = 0;

    /* ---------- public API ---------- */

    // registerPin(trackEl, fn) — fn(p) runs each frame with p in [0,1].
    // Safe to call before or after the engine boots; sections that load late
    // wait on the 'pins:ready' event.
    window.registerPin = function (track, fn) {
        if (!track || typeof fn !== 'function') return;
        var rec = find(track);
        if (rec) {
            rec.cbs.push(fn);
        } else {
            rec = makeRec(track);
            if (!rec) return;
            rec.cbs.push(fn);
            pins.push(rec);
            measure();
        }
    };

    function find(track) {
        for (var i = 0; i < pins.length; i++) if (pins[i].track === track) return pins[i];
        return null;
    }

    function makeRec(track) {
        var stage = track.querySelector('.pin-stage');
        if (!stage) return null;
        return { track: track, stage: stage, cbs: [], top: 0, len: 1, p: 0, target: 0, primed: false };
    }

    /* ---------- measurement (resize only) ---------- */

    function docTop(el) {
        var y = 0;
        while (el) { y += el.offsetTop; el = el.offsetParent; }
        return y;
    }

    function measure() {
        vh = window.innerHeight;
        var doc = document.documentElement;
        docScroll = Math.max(1, doc.scrollHeight - vh);

        for (var i = 0; i < pins.length; i++) {
            var r = pins[i];
            r.top = docTop(r.track);
            // The pin is "live" for the part of the track that exceeds one
            // viewport — that's exactly how long the sticky stage stays put.
            r.len = Math.max(1, r.track.offsetHeight - vh);
        }
        for (var j = 0; j < parallax.length; j++) {
            var q = parallax[j];
            q.centre = docTop(q.el) + q.el.offsetHeight / 2;
        }
        for (var k = 0; k < spy.length; k++) {
            spy[k].top = docTop(spy[k].section);
        }
        // Sort here, not at collect time: offsets are only known post-measure,
        // and updateSpy() walks the list assuming document order.
        spy.sort(function (a, b) { return a.top - b.top; });
    }

    /* ---------- scrollspy ----------
       The one-page nav replaced per-page links, so script.js's filename
       match can no longer light anything up. Mark the section the reader
       is actually in instead. */
    function updateSpy(y) {
        var cur = null;
        for (var i = 0; i < spy.length; i++) {
            if (y >= spy[i].top - vh * 0.4) cur = spy[i];
        }
        if (cur === spyActive) return;
        if (spyActive) spyActive.link.classList.remove('active');
        if (cur) cur.link.classList.add('active');
        spyActive = cur;
    }

    /* ---------- frame loop ---------- */

    function frame(t) {
        var dt = lastT ? Math.min(0.1, (t - lastT) / 1000) : 0.016;
        lastT = t;

        var y = window.pageYOffset || document.documentElement.scrollTop;

        if (bar) bar.style.transform = 'scaleX(' + clamp(y / docScroll) + ')';

        updateSpy(y);

        for (var i = 0; i < pins.length; i++) {
            var r = pins[i];
            r.target = clamp((y - r.top) / r.len);

            // Frame-rate-independent damping: converge on target at a rate
            // that doesn't depend on fps.
            if (!r.primed) { r.p = r.target; r.primed = true; }
            else if (reduced) { r.p = r.target; }
            else { r.p += (r.target - r.p) * (1 - Math.pow(0.0015, dt)); }

            var p = Math.abs(r.target - r.p) < 0.0005 ? (r.p = r.target) : r.p;

            r.stage.style.setProperty('--p', p.toFixed(4));
            for (var c = 0; c < r.cbs.length; c++) {
                try { r.cbs[c](p); } catch (e) { /* one bad section must not kill the loop */ }
            }
        }

        if (!reduced) {
            for (var j = 0; j < parallax.length; j++) {
                var q = parallax[j];
                var off = (y + vh / 2 - q.centre) * q.factor;
                q.el.style.transform = 'translate3d(0,' + off.toFixed(2) + 'px,0)';
            }
        }

        raf = requestAnimationFrame(frame);
    }

    function clamp(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }

    /* ---------- boot ---------- */

    function collect() {
        // Pins declared in markup. Sections may also self-register later.
        var tracks = document.querySelectorAll('[data-pin]');
        for (var i = 0; i < tracks.length; i++) {
            if (find(tracks[i])) continue;
            var rec = makeRec(tracks[i]);
            if (rec) pins.push(rec);
        }

        spy.length = 0;
        var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        for (var s = 0; s < navLinks.length; s++) {
            var sec = document.querySelector(navLinks[s].getAttribute('href'));
            if (sec) spy.push({ link: navLinks[s], section: sec, top: 0 });
        }

        parallax.length = 0;
        if (!reduced) {
            var pxs = document.querySelectorAll('[data-parallax]');
            for (var j = 0; j < pxs.length; j++) {
                var f = parseFloat(pxs[j].getAttribute('data-parallax'));
                if (!isNaN(f) && f !== 0) parallax.push({ el: pxs[j], factor: f, centre: 0 });
            }
        }
    }

    function start() {
        bar = document.getElementById('scroll-progress');
        collect();
        measure();
        if (!raf) raf = requestAnimationFrame(frame);

        // Tell late-loading modules (the 3D section) the API is live.
        window.dispatchEvent(new Event('pins:ready'));
    }

    // Re-measure after async things settle: fonts and media change layout,
    // and a stale offsetTop means a pin fires at the wrong scroll position.
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('orientationchange', measure, { passive: true });
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    if (reduceMQ.addEventListener) {
        reduceMQ.addEventListener('change', function (e) {
            reduced = e.matches;
            collect();
            measure();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
