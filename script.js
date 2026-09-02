// Scroll-reveal animations
(function () {
    const els = Array.from(document.querySelectorAll('.reveal'));

    function check() {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        for (let i = els.length - 1; i >= 0; i--) {
            const rect = els[i].getBoundingClientRect();
            if (rect.top < vh - 40 || rect.bottom < vh) {
                els[i].classList.add('visible');
                els.splice(i, 1);
            }
        }
        if (!els.length) {
            window.removeEventListener('scroll', onScroll);
        }
    }

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                check();
                ticking = false;
            });
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    check();

    // Safety net: never leave content hidden
    setTimeout(() => {
        els.forEach((el) => el.classList.add('visible'));
        els.length = 0;
    }, 2500);
})();

// Highlight the current page in the nav
(function () {
    const here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
        if (link.getAttribute('href') === here) {
            link.classList.add('active');
        }
    });
})();

/* ============================================================
   Spotlight tracking — the JS half of .spot / .spot-glow
   ------------------------------------------------------------
   Ported from 21st.dev's spotlight card, which does this with React
   state on every mousemove. Here it's one delegated listener on the
   document instead of one per card, and it writes CSS custom
   properties rather than re-rendering — the paint is the browser's.

   Guarded on a hover-capable pointer: on touch there is no cursor to
   follow, the CSS already hides the glow under (hover: none), and the
   listener would fire on every scroll-drag for nothing.
   ============================================================ */
(function () {
    if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;

    let pending = null;
    let queued = false;

    document.addEventListener('pointermove', (e) => {
        const card = e.target.closest && e.target.closest('.spot');
        if (!card) return;
        // Overwrite rather than queue: only the latest position matters,
        // and `queued` has to live OUTSIDE this object or reassigning it
        // each move resets the flag and schedules a frame every time.
        pending = { card: card, x: e.clientX, y: e.clientY };
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            if (!pending) return;
            // Read the rect inside the frame, not on the event: a layout
            // read per pointermove is the classic scroll-jank source.
            const r = pending.card.getBoundingClientRect();
            pending.card.style.setProperty('--mx', (pending.x - r.left) + 'px');
            pending.card.style.setProperty('--my', (pending.y - r.top) + 'px');
            pending = null;
        });
    }, { passive: true });
})();

/* ============================================================
   Overlay — image lightbox AND video dialog, one implementation
   ------------------------------------------------------------
   Two 21st.dev patterns land on the same primitive, so they share it
   rather than shipping two copies of the focus/escape/scroll-lock
   logic:

   .shot  (workflow screenshots) — the n8n captures are ~1870px wide and
          were rendered into ~560px cards, so the node labels, the reason
          to show a workflow at all, were unreadable.
   .vplay (Featured Work videos) — ported from 21st.dev's
          HeroVideoDialog. Previously these were bare <video controls
          preload="none"> with no poster, which paints a black rectangle
          with browser chrome. Now a real poster opens the clip large.

   Built once, lazily, on first use. Restores focus to whatever opened it.
   ============================================================ */
(function () {
    const shots = document.querySelectorAll('.shot');
    const plays = document.querySelectorAll('.vplay');
    if (!shots.length && !plays.length) return;

    let box = null, stage = null, cap = null, opener = null;

    function build() {
        box = document.createElement('div');
        box.className = 'lightbox';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.innerHTML =
            '<button class="lightbox-close" type="button" aria-label="Close">&#215;</button>' +
            '<div class="lightbox-stage"></div>' +
            '<p class="lightbox-cap"></p>';
        stage = box.querySelector('.lightbox-stage');
        cap = box.querySelector('.lightbox-cap');
        box.addEventListener('click', (e) => {
            // The backdrop and the close button dismiss. Anything on the
            // stage does not, or the video's own controls would close it.
            if (stage.contains(e.target)) return;
            close();
        });
        document.body.appendChild(box);
    }

    function open(el, node, label) {
        if (!box) build();
        opener = el;
        stage.replaceChildren(node);
        cap.textContent = label || '';
        box.setAttribute('aria-label', label || 'Expanded view');
        box.classList.add('open');
        document.body.style.overflow = 'hidden';
        box.querySelector('.lightbox-close').focus();
    }

    function close() {
        if (!box || !box.classList.contains('open')) return;
        box.classList.remove('open');
        // Tear the video down rather than just pausing it: a paused clip
        // left in a hidden overlay keeps its decoder and buffer alive.
        const v = stage.querySelector('video');
        if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
        stage.replaceChildren();
        document.body.style.overflow = '';
        if (opener) { opener.focus(); opener = null; }
    }

    function activate(el, make, label) {
        el.addEventListener('click', () => open(el, make(), label));
        el.addEventListener('keydown', (e) => {
            // <img> and <div> carry no native button semantics, so Enter and
            // Space have to be wired by hand to match the role they claim.
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el, make(), label); }
        });
    }

    shots.forEach((el) => activate(el, () => {
        const img = document.createElement('img');
        img.src = el.currentSrc || el.src;
        img.alt = el.alt || '';
        return img;
    }, el.dataset.cap || el.alt || ''));

    plays.forEach((el) => activate(el, () => {
        const v = document.createElement('video');
        v.src = el.dataset.video;
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        return v;
    }, el.dataset.title || ''));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();

/* ============================================================
   Sticky process — the JS half of .proc (see home.css section 7)
   ------------------------------------------------------------
   Sets .is-active on one step and its figure, and writes --beam (0-1)
   for the rail fill. Everything else — the pin, the two-column layout,
   the mobile collapse — is CSS.

   This lives in script.js and NOT in scroll.js on purpose:
   automation.html must never load scroll.js, because its nav carries a
   real #work anchor and the scrollspy would light "Work" while the
   filename match above lights "AI Automation" — two active nav links.

   Layout is read on resize/orientationchange/load/fonts-ready only,
   never inside the rAF. A getBoundingClientRect per scroll event is the
   classic jank source; it's the same rule scroll.js is built around.

   No persistent rAF loop either, unlike scroll.js (which needs one to
   damp --p). This is event-driven and rAF-coalesced, so it costs nothing
   on the four pages with no .proc. The beam is rewritten every frame
   while scrolling, so it's already smooth without damping; the two
   genuinely discrete changes — the step dim and the pane crossfade — are
   CSS transitions instead.
   ============================================================ */
(function () {
    const root = document.querySelector('.proc');
    if (!root) return;

    const steps = Array.prototype.slice.call(root.querySelectorAll('.proc-step'));
    const shots = Array.prototype.slice.call(root.querySelectorAll('.proc-shot'));
    if (steps.length < 2 || steps.length !== shots.length) return;

    let vh = window.innerHeight;
    const dots = [];            // document-space centre of each numbered dot
    let railTop = 0, railLen = 1;
    let active = -1, lastBeam = -1, queued = false;

    // offsetParent walk, the same helper scroll.js uses: offsetTop alone is
    // relative to the nearest positioned ancestor, and .proc-step is
    // position:relative, so a bare offsetTop is wrong by the block's own top.
    function docTop(el) {
        let y = 0;
        while (el) { y += el.offsetTop; el = el.offsetParent; }
        return y;
    }

    function measure() {
        vh = window.innerHeight || document.documentElement.clientHeight;
        dots.length = 0;
        for (let i = 0; i < steps.length; i++) {
            const d = steps[i].querySelector('.proc-num') || steps[i];
            dots.push(docTop(d) + d.offsetHeight / 2);
        }
        railTop = dots[0];
        railLen = Math.max(1, dots[dots.length - 1] - railTop);
        root.style.setProperty('--rail-top', (railTop - docTop(root)) + 'px');
        root.style.setProperty('--rail-len', railLen + 'px');
        update();
    }

    function update() {
        const y = window.pageYOffset || document.documentElement.scrollTop;
        // The focus line is the sticky pane's own centre (top 18vh + height
        // 64vh), so the step that reads as current is the one level with the
        // picture. Retune both together or neither.
        const focus = y + vh * 0.5;

        let p = (focus - railTop) / railLen;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        if (p !== lastBeam) {
            root.style.setProperty('--beam', p.toFixed(4));
            lastBeam = p;
        }

        // Lead the reading position a little: the pane should already have
        // swapped by the time the eye arrives at the copy.
        let n = 0;
        for (let i = 0; i < dots.length; i++) {
            if (focus >= dots[i] - vh * 0.18) n = i;
        }
        if (n === active) return;
        if (active > -1) {
            steps[active].classList.remove('is-active');
            shots[active].classList.remove('is-active');
        }
        steps[n].classList.add('is-active');
        shots[n].classList.add('is-active');
        active = n;
    }

    function onScroll() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { queued = false; update(); });
    }

    root.classList.add('proc--live');
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('orientationchange', measure, { passive: true });
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
})();
