# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Shayaan Ahmed's personal portfolio site ("**the portfolio**"), served by GitHub Pages at **shayaanahm.github.io** straight from `main` — every push to `main` deploys automatically (allow 1–2 minutes for the Pages rebuild). No build step, no framework, no dependencies: plain HTML + CSS + JS.

**It is a single-page site** (since the 2026-07-16 redesign): `index.html` is one long scroll-driven narrative — "how I'd automate a business" — and `contact.html` is the **only** other page. `automation.html`, `projects.html`, `cv.html`, `hobbies.html` and `world.html` were folded into `index.html` and deleted; their content lives on as sections. Recover the originals from git history, the `backup-before-scrollworld-redesign` tag, or `old-site/`.

## Running locally

```powershell
python -m http.server 8734 --directory .
# then open http://localhost:8734
```

## Publishing

```powershell
git add <files> && git commit -m "..." && git push
```

Git identity is already configured globally (`Shayaan Ahmed <proshayaan@gmail.com>`).

## Structure & conventions

- **Pages**: `index.html` (the whole site) and `contact.html`. Both share the same navbar/footer markup — a nav change means editing **both**.
- **The nav is in-page anchors** (`#work`, `#process`, `#projects`, `#about`) plus a real link to `contact.html`. contact.html's nav/footer point back at `index.html#...`.
- **Section order in `index.html`**: hero → `#hook` → marquee → `#automation` (the "AI Automation" walkthrough; contains `#world` where the engine mounts — there is NO separate #process section) → `#services` → `#work` → `#workflows` → `#projects` → `#about` → `#beyond` → dark closing (marquee + `#contact` CTA).
- `style.css` is the shared stylesheet for both pages. Design tokens live in `:root` CSS variables (ivory background `--bg`, near-black `--ink`, deep forest green `--accent`, dark-panel tokens `--panel`/`--panel-ink` (flip locally via the `.panel-dark` class in home.css — components restyle themselves)). Fonts: Playfair Display (headings, via Google Fonts `@import`) + Inter (body).
- **2026-07 "brand evolution" redesign** (editorial layout, same palette): pages open with a `.page-header` block (`.small-label` kicker with accent dash + `.page-title` with an italic `<em>` accent word + `.section-intro`, all left-aligned); section headings sit in a `.section-row` (heading left, `.section-sub` right; add class `tight` for the first one after a page header); the homepage "What I Do" uses `.index-list`/`.index-row` editorial rows instead of cards; `.cta-band` is a dark ink panel; the homepage hero is `.hero-grid` (copy in `.hero-copy` + `.hero-meta` side rail).
- `script.js` provides two behaviours: scroll-reveal (add class `reveal` to any element; it gets `.visible` when scrolled into view, with a 2.5s safety net so nothing stays hidden) and automatic `.active` highlighting of the current page's nav link. It's a plain scroll handler by design — do **not** switch it to IntersectionObserver (that was tried and reverted).
- Reusable patterns: `.card` (hover-lift panel with accent top-line sweep), `.media-card` (image/video card, media on top + `.media-body` text), `.grid-2` / `.cv-grid` / `.contact-grid` (2-col grids, `.wide-card` spans both), `.section-heading` with `data-label="..."` (renders a small accent kicker above the heading), `.cta-band`, `.tag`, `.button`.
- Media assets (workflow screenshots `.png`, demo videos `.mp4`, `brawlbase-project.zip`, `brawlbase-nea.pdf`) are committed directly to the repo root and referenced with relative paths.

## The scroll engine — `scroll.js`, `home.css`, `world-scrub.js`

`index.html` loads `style.css` → `home.css`, then `scroll.js` → `script.js` → `world-scrub.js` + the inline `mountScrollWorld` config. **Load order matters**: `home.css` overrides `style.css`, and `script.js` still owns reveals.

- **`scroll.js`** is the engine. It provides three things and nothing else (it does **not** do reveals — `script.js` still owns `.reveal` → `.visible`):
  - **Pins**: a tall track `<div data-pin>` wrapping a `.pin-stage` (`position:sticky; top:0; height:100vh`). Each frame the engine computes the track's scroll progress `p` (0→1), writes it to the stage as the CSS var **`--p`**, and calls callbacks registered via **`window.registerPin(trackEl, fn)`**. Modules that load late should guard on the **`pins:ready`** event. `--p` is damped (frame-rate-independent), so a section can be driven in **pure CSS off `--p`** with no JS — that's how `#process` highlights its steps.
  - **Parallax**: `data-parallax="0.12"` on any element translates it on Y. **Marquee**: `data-marquee="0.35"` translates it on X with scroll (the two band strips; negative factor = opposite direction). Both disabled under reduced motion.
  - **Progress bar** (`#scroll-progress`) + **scrollspy** (lights the `.nav-links a.active` for the section you're in — the old filename-matching in `script.js` can't work on a one-page nav).
  - Metrics are measured on resize/load/fonts-ready only, **never per frame** — don't add layout reads to the rAF loop. Note `docTop()` walks the `offsetParent` chain deliberately: `offsetTop` alone is relative to a positioned ancestor and gives wrong pin positions.
- **`world-scrub.js` + `#automation`** is the walkthrough: a dark intro strip (`.automation-intro`) then `<div id="world">` where the engine mounts a scroll-scrubbed continuous photoreal walk of the process (Discovery lounge → Design studio → Build lab → Handover study; the last stop introduces the owner, CTAs → `#about` / contact.html). Nav + hero CTA point at `#automation`. The engine is the scroll-world skill's reference scrub engine adapted to an embedded section (sticky `.sw-view` + tall `.sw-track`, scroll math offset by container top, dark forest `--sw-*` theme, first scene stays visible when approached from above). Config = the inline `mountScrollWorld(...)` at the end of index.html; step copy is the real "How It Works", don't invent claims. **History note:** a snap-to-room autoplay variant ("slideshow") was built and rejected by the owner 2026-07-17 — the owner wants the scrub walkthrough; keep it.
  - Clips are **cinematic photoreal** (clay-diorama rejected as childish), generated with **Higgsfield** as one continuous forward take: each leg's `--start-image` = the previous leg's ACTUAL extracted last frame; camera never reverses across a seam. `seedance_2_0_mini` leg 1; `kling3_0` legs 2-4 (Seedance's NSFW filter false-positives on interiors; rejected jobs aren't billed; Starter = 2 concurrent jobs, `seedance_2_0` is Pro-gated).
  - Encode for scrubbing: native 720p/24, **no motion interpolation** (interpolated in-betweens shimmer = "AI look"), **`-g 2`** (seek cost is THE choppiness lever; high fps/res made it worse), crf 20 desktop / 960px crf 23 `-m.mp4` mobile. Off-screen clips must not decode (the engine defers them). `world/*.webp` posters = the legs' first frames, the lazy/reduced-motion fallback.
  - **A CSS-layer trap lives in this page:** style.css's universal `* { padding: 0 }` reset is unlayered, and unlayered author styles beat ALL `@layer` rules — any component that injects layered CSS silently loses every padding/margin. Inject unlayered. Also: the navbar background must stay fully opaque — translucency lets the marquee ghost through.
  - **No page-level scroll-snap anywhere** — every snap experiment ("clicks to each section", rooms) was rejected as grabby/slideshow-like.
- Every pinned section must degrade under `prefers-reduced-motion`: `home.css` collapses tracks and un-sticks stages globally. `#process` also collapses below 760px (four steps can't fit 100vh on a phone).

## Content rules

- **Don't invent facts.** CV content mirrors the owner's real CV document; automation page claims (e.g. "100+ job leads") were supplied by the owner. Ask before adding new claims, clients, or numbers.
- The "Featured Work" section deliberately says *"Example automations built for businesses"* — these are demos, not paid client work; keep the wording discreet.
- Buttons are outlined only: `.button`, plus the `.button--accent` accent-outline variant reserved for the **single primary CTA of a page** (there is no solid variant).

## Backups

- Git tag `backup-before-polish` = the site before the 2026-07 redesign.
- Git tag `backup-before-scrollworld-redesign` = before the 2026-07 brand-evolution redesign + world.html.
- The five folded pages (`automation.html`, `projects.html`, `cv.html`, `hobbies.html`, `world.html`) live in git history before the 2026-07-16 single-page commit, and in `old-site/`.
- Local copy: `E:\ClaudeCode\website-backup-original`.
