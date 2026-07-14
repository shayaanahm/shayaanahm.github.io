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
