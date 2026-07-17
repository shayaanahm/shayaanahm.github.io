/* ============================================================
   world.js — the process rooms.

   Replaces the scroll-scrub engine (world-scrub.js): scrubbing
   AI-generated video frame-by-frame exposed its morphing artifacts
   and stuttered on modest hardware no matter the encoding. Instead,
   each room is a full-viewport checkpoint (CSS scroll-snap does the
   "click") and its clip PLAYS at natural speed when the room enters
   the viewport — which is where these clips look like cinema.

   - Clips lazy-load as blobs on approach (works without byte-range
     support), play once per visit, and hold their final frame.
   - Mobile gets the -m encodes. Reduced motion never loads video;
     the poster stills stand alone.
   ============================================================ */
(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
        || window.matchMedia('(max-width: 860px)').matches;

    var rooms = Array.prototype.slice.call(document.querySelectorAll('.room'));
    if (!rooms.length || reduced) return;

    rooms.forEach(function (room) {
        room._loaded = false;
        room._video = null;
    });

    function loadVideo(room) {
        if (room._loaded) return;
        room._loaded = true;
        var src = isMobile && room.getAttribute('data-clip-m')
            ? room.getAttribute('data-clip-m')
            : room.getAttribute('data-clip');
        if (!src) return;
        fetch(src)
            .then(function (r) { return r.ok ? r.blob() : Promise.reject(new Error(String(r.status))); })
            .then(function (blob) {
                var v = document.createElement('video');
                v.className = 'room-video';
                v.muted = true;
                v.playsInline = true;
                v.preload = 'auto';
                v.setAttribute('muted', '');
                v.setAttribute('playsinline', '');
                v.src = URL.createObjectURL(blob);
                // Reveal only once a frame has painted, so the poster
                // never gives way to a black rectangle.
                v.addEventListener('playing', function () { room.classList.add('room--live'); }, { once: true });
                room.insertBefore(v, room.firstChild);
                room._video = v;
                if (room._wantPlay) tryPlay(room);
            })
            .catch(function () { room._loaded = false; });
    }

    function tryPlay(room) {
        var v = room._video;
        if (!v) return;
        // Replay from the top on each fresh visit; hold the last frame
        // when the clip finishes.
        if (v.ended || v.currentTime >= (v.duration || 1) - 0.05) v.currentTime = 0;
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* autoplay veto: poster stands */ });
    }

    // rAF-polled rect checks (matches the site's other scroll handling;
    // see CLAUDE.md on IntersectionObserver).
    var ticking = false;
    function check() {
        var vh = window.innerHeight;
        rooms.forEach(function (room) {
            var r = room.getBoundingClientRect();
            var near = r.top < vh * 1.5 && r.bottom > -vh * 0.5;
            var active = r.top < vh * 0.5 && r.bottom > vh * 0.5;
            if (near) loadVideo(room);
            if (active) {
                if (!room._playing) {
                    room._playing = true;
                    room._wantPlay = true;
                    tryPlay(room);
                }
            } else if (room._playing) {
                room._playing = false;
                room._wantPlay = false;
                if (room._video) { try { room._video.pause(); } catch (e) {} }
            }
        });
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(check);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    check();
})();
