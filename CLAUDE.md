# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Shayaan Ahmed's personal portfolio site ("**the portfolio**"), served by GitHub Pages at **shayaanahm.github.io** straight from `main` — every push to `main` deploys automatically (allow 1–2 minutes for the Pages rebuild). No build step, no framework, no dependencies: plain HTML + CSS + JS.

**`index.html` is a long scroll-driven narrative** — "how I'd automate a business" — built in the 2026-07-16 redesign, which folded `automation.html`, `projects.html`, `cv.html`, `hobbies.html` and `world.html` into it. `projects.html` and `hobbies.html` stayed folded in as sections; `cv.html` and `automation.html` were since re-split back out into real pages. Recover any original from git history or `old-site/`.

**Five pages**: `index.html`, `automation.html`, `cv.html`, `contact.html`, and `testimonial.html` — the last is `noindex`, absent from the nav and from `sitemap.xml`, and exists only to be linked directly to a client.

## Running locally

```bash
python3 -m http.server 8734 --bind 127.0.0.1 --directory .
# then open http://127.0.0.1:8734
```
(This workspace moved from Windows to Kubuntu on 2026-08-25; the PowerShell
invocations that used to be here are historical.)

## Publishing

```bash
git -C ~/ClaudeCode/shayaanahm.github.io add <files> && git -C ~/ClaudeCode/shayaanahm.github.io commit -m "..." && git -C ~/ClaudeCode/shayaanahm.github.io push
```
**This is a nested git repo inside `~/ClaudeCode`** — a bare `git` command from
the parent lands the commit in `shayaanahm/firewarden` instead. Always `git -C`.

Git identity is already configured globally (`Shayaan Ahmed <proshayaan@gmail.com>`).

## Structure & conventions

- **Pages**: `index.html`, `automation.html`, `cv.html`, `contact.html`, `testimonial.html`. All five share the same navbar/footer markup — **a nav change means editing all five**. (`testimonial.html` carries the nav but is not *in* it.)
- **The nav** is `Home · AI Automation · Work · Projects · About · CV · Contact` (7 items, order set by the owner 2026-07-17). `AI Automation` → `automation.html` and `Work` → `automation.html#work` **from every page including index** — Featured Work lives on the walkthrough page, not the homepage. `Projects`/`About` are in-page anchors on index and `index.html#...` elsewhere. `AI Automation` is also the hero's primary CTA ("See How I Work").
- **`Home` is `#top` on index and `index.html` everywhere else — that asymmetry is load-bearing.** Two different things light the nav: `script.js` matches the current *filename*, `scroll.js`'s scrollspy tracks in-page `#` anchors. Point Home at `index.html` on index itself and both fire, so Home stays lit while the spy also lights Projects/About — two active links at once. `#top` (on `<main id="top">`) keeps it purely spy-driven.
- **Section order in `index.html`**: hero → `#hook` → marquee → `#services` → `#workflows` → `#projects` → `#about` → `#beyond` → dark closing (marquee + `#contact` CTA). There is no `#process` and no `#automation` section, and **no `#work`** — the walkthrough and the work videos are both on `automation.html`.
- **Section order in `automation.html`**: `#automation` (dark **Alvo-branded** intro: lockup → constellation → the `.proc` process block) → `#work` → `#workflows` → light closing CTA.
- **`automation.html` carries the Alvo Productivity brand** (the owner's AI-automation agency; brand kit lives at `alvo/brand/` in the parent workspace — brand-board.html, logo SVGs, pitch deck). The header is the real lockup: the wordmark `alv` + the **target mark as the final letter** (rings r92/r58/r20 stroke 16, straight from `alvo/brand/logo/alvo-mark.svg`), the `PRODUCTIVITY` suffix, and the tagline *"AI, aimed right."* The intro copy is the brand board's own positioning line, not new copy.
  - **The brand is rendered in the portfolio's palette, never Alvo's own.** Alvo's primary is terracotta `#B5562C` (with sage/gold secondaries); the owner asked for the brand to stand out "without straying from the colour scheme", so the mark is drawn with `currentColor` and inherits `var(--accent)` → `--accent-bright` `#3f7d5c` on the dark panel. Type follows the same rule: the brand board specifies Georgia, this uses the site's Playfair Display. **Don't paste Alvo's hexes in.** If Alvo ever gets a page of its own, that's where its real palette belongs.
  - The mark sits at `0.86em`, optically centred — it *is* the letter "o", not an icon beside a word. Shrink it to x-height and the lockup stops reading as the logo. The accessible name comes from a `.sr-only` "Alvo Productivity" (new utility class in style.css), since the logo carries the name graphically.
- **`#workflows` is duplicated on both pages on purpose** (owner's call: videos move to the walkthrough page, workflows show in both places). Edit both copies or they drift. The work videos are **not** duplicated — they only exist on `automation.html`.
- `style.css` is the shared stylesheet for all five pages. Design tokens live in `:root` CSS variables (sage background `--bg` `#d5dec9`, near-black `--ink`, deep forest green `--accent`, dark-panel tokens `--panel`/`--panel-ink` (flip locally via the `.panel-dark` class in home.css — components restyle themselves)). Fonts: Playfair Display (headings, via Google Fonts `@import`) + Inter (body).
- **2026-07 "brand evolution" redesign** (editorial layout, same palette): pages open with a `.page-header` block (`.small-label` kicker with accent dash + `.page-title` with an italic `<em>` accent word + `.section-intro`, all left-aligned); section headings sit in a `.section-row` (heading left, `.section-sub` right; add class `tight` for the first one after a page header); the homepage "What I Do" uses `.index-list`/`.index-row` editorial rows instead of cards; `.cta-band` is a dark ink panel; the homepage hero is `.hero-grid` (copy in `.hero-copy` + `.hero-meta` side rail).
- `script.js` provides four behaviours: scroll-reveal (add class `reveal` to any element; it gets `.visible` when scrolled into view, with a 2.5s safety net so nothing stays hidden) and automatic `.active` highlighting of the current page's nav link, plus the spotlight pointer tracker and the shared lightbox/video overlay, plus the `.proc` sticky-process driver. It's a plain scroll handler by design — do **not** switch it to IntersectionObserver (that was tried and reverted). Each block early-returns when its markup is absent, so the pages that don't use a component pay nothing.
- Reusable patterns: `.card` (hover-lift panel with accent top-line sweep), `.media-card` (image/video card, media on top + `.media-body` text), `.grid-2` / `.cv-grid` / `.contact-grid` (2-col grids, `.wide-card` spans both), `.section-heading` with `data-label="..."` (renders a small accent kicker above the heading), `.cta-band`, `.tag`, `.button`, `.photo-frame`, `.tl` (vertical timeline with a reveal-driven dot fill — live on `cv.html`), `.spot` (spotlight hover glow; needs an `<i class="spot-glow">` first child).
- **`.photo-frame`** wraps the owner photos (`figure` + `img` + `figcaption`): the frame owns the border/shadow and clips, the image scales inside it on hover and lifts the caption in. Replaced the bare `<img class="about-photo">`/`.beyond-photo`, both classes now deleted — size the image via `.about-media .photo-frame img` / `.beyond-frame`. Hover is behind `@media (hover: hover)`; under `(hover: none)` the caption is pinned visible, since a touch user never gets the hover. **Captions may only restate what the `alt` already says** — they are not a place for new claims.
- **Ghost chapter numerals (`.sec-num`, giant outlined 01–05) and the `.wf-glyph` circle are gone** (owner, 2026-07-17: the numbering "looks terrible", the circle read as a stray mark next to the 03). Chapters are now marked by a hairline rule with a short accent lead-in, drawn as a `::before` on each section's `.container` — no numbers to renumber when sections move between pages. Don't reintroduce the numerals.
- Media assets (workflow screenshots `.png`, demo videos `.mp4`, `brawlbase-project.zip`, `brawlbase-nea.pdf`) are committed directly to the repo root and referenced with relative paths.

## The scroll engine — `scroll.js`, `home.css`, `script.js`

`index.html` loads `style.css` → `home.css`, then `scroll.js` → `script.js`. `automation.html` loads `style.css` → `home.css`, then `script.js` alone. `cv.html` / `contact.html` / `testimonial.html` load `style.css` → `script.js`. **Load order matters**: `home.css` overrides `style.css`, and `script.js` owns reveals everywhere. `scroll.js` loads on `index.html` and nowhere else — see the `.proc` note below for why that is not an accident.

- **`scroll.js`** is the engine. It provides three things and nothing else (it does **not** do reveals — `script.js` still owns `.reveal` → `.visible`):
  - **Pins**: a tall track `<div data-pin>` wrapping a `.pin-stage` (`position:sticky; top:0; height:100vh`). Each frame the engine computes the track's scroll progress `p` (0→1), writes it to the stage as the CSS var **`--p`**, and calls callbacks registered via **`window.registerPin(trackEl, fn)`**. Modules that load late should guard on the **`pins:ready`** event. `--p` is damped (frame-rate-independent), so a section can be driven in **pure CSS off `--p`** with no JS — that was how the old `#process` section highlighted its steps. Nothing currently registers a pin; the machinery is kept for the next pinned section.
  - **Parallax**: `data-parallax="0.12"` on any element translates it on Y. **Marquee**: `data-marquee="0.35"` translates it on X with scroll (the two band strips; negative factor = opposite direction). Both disabled under reduced motion.
    - **Marquees scrub around each band's own centre, never raw `scrollY`.** Driving them off absolute scroll (the original `-y * factor`) meant the offset grew with the band's distance down the page: the closing band sat at scroll ~8600, so it opened ~1810px to the right inside a 1265px strip — i.e. completely empty, which is what the owner reported 2026-07-17. The `-60vw`/`45vw` CSS lead-ins were an attempt to compensate and could never hold, because the right value changes every time the page's length changes. `measure()` now records each band's `centre` and an `amp` (the widest swing while it's on screen); the frame applies `-(y + vh/2 - centre) * factor - amp`, which keeps the direction of travel, keeps the track's left edge outside the band at every scroll position, and is immune to page length. **Don't reintroduce a lead-in offset in CSS** — `padding-right` on the track is the only pad, and it exists purely to guarantee right-edge coverage.
  - **Progress bar** (`#scroll-progress`) + **scrollspy** (lights the `.nav-links a.active` for the section you're in — the old filename-matching in `script.js` can't work on a one-page nav). Scrollspy only considers `.nav-links a[href^="#"]`, so the `automation.html`/`cv.html`/`contact.html` nav links are correctly ignored.
  - Metrics are measured on resize/load/fonts-ready only, **never per frame** — don't add layout reads to the rAF loop. Note `docTop()` walks the `offsetParent` chain deliberately: `offsetTop` alone is relative to a positioned ancestor and gives wrong pin positions.
- **`.proc` + `automation.html`** is the process — **its own page since 2026-07-17**, moved off the homepage at the owner's request (it lives beside `contact.html` rather than inside the index narrative). Structure: `<section id="automation">` holding a dark intro strip (`.automation-intro.panel-dark`) whose contents run page-header → Alvo lockup → `.beam-field` constellation → `.proc`. Four steps, Discovery → Design → Build → Handover, the last introducing the owner with CTAs to `index.html#about` and `contact.html`. Step copy is the real "How It Works" — don't invent claims.
  - **This page must NEVER load `scroll.js`.** Its nav carries a real `#work` anchor, so `scroll.js`'s scrollspy would light "Work" while `script.js`'s filename match lights "AI Automation" — two active nav links at once, the same failure mode documented above for `Home`/`#top` on index. That is why `.proc`'s behaviour is the **fifth IIFE in `script.js`**, not a `scroll.js` pin. It is the single non-obvious constraint on this page.
  - **The layout is CSS; the JS only sets state.** The four `<figure class="proc-shot">` are grid items that all claim the *same* grid area (column 2, rows `1 / -1`) and are each `position: sticky` inside it, so they stack and pin with no absolute positioning and no DOM moves. That is exactly what lets the same markup collapse to interleaved stacked cards under 900px with `display: block` and nothing else — the figures already sit in source order between the steps. `script.js` only toggles `.is-active` on one step + its figure and writes `--beam` (0–1) for the rail fill.
  - **The element types are structural.** The CSS assigns rows with `article:nth-of-type(n)` and stacks panes with `figure`. Swap an `<article>` for a `<div>`, or add a stray `<figure>`, and both the grid and the no-JS fallback come apart silently.
  - **`.proc-step` must not carry `.reveal`.** `style.css`'s `.reveal.visible { opacity: 1 }` is (0,2,0) and beats `.proc-step { opacity: .68 }` at (0,1,0), which kills the dim→active read. The dim→active transition *is* this section's entrance.
  - **`0.68` on inactive steps is a contrast floor, not taste.** `--ink-soft` at 0.68 over `--panel` composites to ~`#848f85` = 4.97:1; below ~0.6 it fails 4.5:1. For the same reason `.proc-label` is `--ink-muted` and never accent — accent green on the panel is only 3.4:1, fine for a graphic or a large heading, short for an 11px label.
  - **Pacing is `.proc-step { min-height: 60vh }`** — four steps ≈ 2.4 viewport-heights. That is the one knob; the old world summed to 6.7 and the owner reported it as taking too long.
  - The four `world/*.webp` stills (1600×900, 264 KB total) are the panes. They are all that survives of the walkthrough — see below.

### The walkthrough was replaced (2026-09-02)

**This reverses a decision recorded here twice.** A snap-to-room autoplay variant ("slideshow") was built and rejected 2026-07-17, and the scroll-scrubbed world was re-examined against 21st.dev on 2026-09-01 and explicitly kept, under a heading that read "The walkthrough stays". On 2026-09-02 the owner directed that it go anyway. Both of those rejections were real and the reasoning in them was sound at the time; what changed is the weighting, not the analysis:

- it ran **6.7 viewport-heights** of scrolling to deliver four sentences, and "takes too long to get through" was already on record from 2026-07-17;
- it cost **48 MB — half the working tree** — in `world-scrub.js` plus eight `.mp4` clips.

`world-scrub.js` and the clips are deleted. What replaced them is `.proc` above: a ported hybrid of 21st.dev's *Sticky Scroll Reveal* and its *Timeline* beam, same four steps, same copy verbatim, same four Higgsfield stills, at 2.4 viewport-heights and 264 KB.

**Do not rebuild the scrub engine.** If a future pass wants motion here, the honest options are tuning `.proc` or reaching for the unused `registerPin` machinery in `scroll.js` — on `index.html`, which is the only page that loads it.

The generation notes are kept because they are hard-won and would be needed to regenerate this kind of asset: clips were **cinematic photoreal** (clay-diorama rejected as childish), made with **Higgsfield** as one continuous forward take with each leg's `--start-image` set to the previous leg's actual extracted last frame; `seedance_2_0_mini` for leg 1 and `kling3_0` for legs 2–4 (Seedance's NSFW filter false-positives on interiors; rejected jobs aren't billed). Encoding for scrubbing was native 720p/24, **no motion interpolation** (interpolated in-betweens shimmer and read as "AI look"), and **`-g 2`** — keyframe interval, not resolution or fps, is the choppiness lever when seeking.

Two constraints from that era still apply to this page and are NOT historical:
  - **The CSS-layer trap.** `style.css`'s universal `* { padding: 0 }` reset is unlayered, and unlayered author styles beat ALL `@layer` rules — anything that injects or adds layered CSS silently loses every padding and margin. Nothing in the component layer uses `@layer`.
  - **The navbar background must stay fully opaque** — translucency lets the marquee ghost through.
  - **No page-level scroll-snap anywhere** — every snap experiment ("clicks to each section", rooms) was rejected as grabby/slideshow-like.
- Every scroll-driven section must degrade under `prefers-reduced-motion`: `home.css` collapses `[data-pin]` tracks and un-sticks `.pin-stage` globally, hides `#scroll-progress`, and drops `.proc` to the same stacked layout it uses under 900px (with `.proc-beam` hidden — a scroll-linked indicator follows the same precedent as the progress bar).

## The component layer — 21st.dev patterns, ported (2026-09-01)

**21st.dev ships React + Tailwind + shadcn/ui source; this site is static HTML/CSS/JS with no build step.** Nothing was installed. The components below are *ports* — the same component ideas rebuilt against this site's own tokens, which is 21st.dev's own documented primary workflow ("copy the prompt, the agent rebuilds the component in your codebase"). The owner chose this over migrating the site to React/Vite/Tailwind, which would have meant rewriting `scroll.js` as React effects and re-earning every fix recorded above.

The layer is split **by concern, not by page** (corrected 2026-09-02 — it was originally all in `home.css`, which meant `cv.html`, `contact.html` and `testimonial.html` shipped the browser's default blue focus ring and had no access to `.spot` or `.tl`):

- **End of `style.css`** — anything two or more pages use: the browser surfaces (`:focus-visible`, scrollbar, caret), `.spot` / `.spot-glow`, and the `.tl` vertical timeline. All five pages load `style.css`.
- **End of `home.css`** — page-specific components: `.bento`, `.vplay`, `.shot`/`.lightbox`, `.beam-field`, `.stack-strip`, `.panel-dark`, `.proc`.

**Don't "fix" a missing component on cv/contact/testimonial by adding `home.css` to them.** On a no-build site what you link is what you ship, permanently, and those pages will never contain a hero, a bento or the process block. Move the rule to `style.css` instead.

- **Nothing in that layer may use `@layer`.** Same trap as the walkthrough page: `style.css`'s unlayered `* { padding: 0 }` beats every `@layer` rule, so a layered component silently loses all its padding.
- **`.beam-field`** (automation hero) — ported from 21st.dev's *AnimatedBeam*. The React original measures two DOM nodes with refs and redraws on resize; this is **one authored SVG on a fixed `viewBox`**, so it scales as a unit with no JS, no refs, no ResizeObserver. Every beam travels **inward** to the hub, and the hub is the Alvo target mark — the motion states the tagline ("AI, aimed right") instead of decorating beside it. The six chip labels are the real tools named in the workflow copy further down the page; **don't add a tool that isn't in a shipped workflow**. Hidden below 760px, where the labels would scale under 5px.
- **`.stack-strip`** — the constellation's mobile counterpart, and **mobile-only by design**: on desktop it repeated tool names the constellation already showed. It is deliberately **not** `text-transform: uppercase`, because the site's label system rendered *n8n* as "N8N" — a brand name is a fact, not a style.
- **`.bento`** — ported from 21st.dev's *BentoGrid*; replaces the flat `.grid-2 .wf-grid` on **both** pages (`#workflows` is still duplicated — edit both or they drift). Six columns; the feature spans 4×2. The feature cell is the **Job Application** pipeline because it is the only workflow carrying a real number (100+ leads); don't promote a cell without a reason like that.
- **`.spot` / `.spot-glow`** — ported from 21st.dev's spotlight card. The glow is a **dedicated `<i class="spot-glow">` child, never a pseudo-element**: `.card::before` is already the pre-rendered hover-shadow layer and `.card::after` is already the accent top-line sweep, so a pseudo here would silently clobber an existing effect. `script.js` writes `--mx`/`--my` from **one delegated `pointermove` listener**, reading the rect inside the rAF (never on the event) and guarded on `(hover: hover)`.
- **`.vplay` + the overlay** — ported from 21st.dev's *HeroVideoDialog*. Featured Work previously shipped bare `<video controls preload="none">` with **no poster**, which paints a black rectangle wearing the browser's own control bar. **There are posters now**: `premier-properties-poster.webp` / `spark-pro-poster.webp`, real frames cropped with **`crop=1037:1080:95:0`** to remove the screen-recorder HUD burned into the left gutter and the scrollbar on the right. That HUD is the reason there was never a poster — **regenerate with the same crop** if the clips are re-recorded. `.vplay` keeps the retired `.work-media` wrapper's **16:9 box** so cards don't jump, and the cards carry `align-self: stretch` so the two-up pair doesn't end ragged.
- **`.shot` + `.lightbox`** — the n8n screenshots are ~1870px wide rendered into ~560px cards, so the node labels (the entire point of showing a workflow) were unreadable. Click or press Enter/Space to open full size. **One overlay implementation serves both `.shot` and `.vplay`** rather than two copies of the focus / Escape / scroll-lock logic; it tears the `<video>` down on close (a paused clip in a hidden overlay keeps its decoder alive) and returns focus to whatever opened it.
- **Browser surfaces are themed** (`:focus-visible`, scrollbar, caret). Before this the site shipped a **default blue focus ring on a forest-green page** and a stock scrollbar. Don't remove these; they are the cheapest signal the page was built rather than assembled.

### The walkthrough — superseded

This section used to read "The walkthrough stays" and recorded the 2026-09-01 decision to keep the scroll-scrubbed world after comparing it with 21st.dev's StickyScroll / container-scroll / parallax-timeline components. **That decision was reversed by the owner on 2026-09-02** and the world is gone. The full reasoning, and what replaced it, is under *The walkthrough was replaced* above — read that, not this heading.

### Verifying design changes here

Playwright MCP holds a single shared browser and errors with `Browser is already in use` when another session has it. **Drive headless Chrome directly instead**: `/opt/google/chrome/chrome --headless=new --disable-gpu --enable-unsafe-swiftshader --hide-scrollbars --virtual-time-budget=10000 --user-data-dir=<tmp> --window-size=W,H --screenshot=out.png <url>`. Two traps that cost time:

- **Headless intermittently fails to *paint* images that demonstrably loaded** (confirmed via `naturalWidth` while the capture showed a blank box). A **cold `--user-data-dir`** clears it. Don't chase it as a CSS bug.
- **Headless Chrome will not commit a programmatic scroll.** `window.scrollTo` / `scrollingElement.scrollTop` leave `pageYOffset` at 0 in `--headless=new` with `--dump-dom`, even with the document clearly taller than the viewport. This is not a site bug and no amount of `--virtual-time-budget` fixes it — so **anything scroll-driven (`.proc`, the reveals, the marquees) cannot be verified this way.** Playwright MCP holds one shared browser and will refuse, but the workspace already has a real Playwright install: drive it directly with `import { chromium } from '/home/shayaan/ClaudeCode/firewarden-social/node_modules/playwright/index.mjs'` and `chromium.launch({ channel: 'chrome' })`. That scrolls properly and takes a `reducedMotion: 'reduce'` context option, which is the only sane way to check the reduced-motion fallbacks.
- **`#fragment` scrolling is unreliable** — on `automation.html` it lands inside the sticky walkthrough track. To see one section, generate a throwaway bench page that pulls that section plus `style.css`/`home.css`, screenshot it, and **delete it** (`_bench.html` must never be committed). Add `?v=<ts>` to the stylesheet links to defeat caching, and prefer a DOM probe printing computed values over reading pixels off a screenshot.

## Known issue — the testimonial form requires a Google sign-in

`testimonial.html` embeds a Google Form that **a logged-out visitor cannot fill in.** In a real logged-out browser the iframe reads *"Sign in to your Google Account — You must sign in to access this content"*. Removing `?embedded=true` is **not** the fix: the form then renders but immediately covers itself with *"Sign in to continue — To fill out this form, you must be signed in."* Same wall.

The cause is a setting on the form, not on the site: email collection set to **Verified**, and/or **Limit to 1 response**. Fix it in Google Forms (Settings → Responses: collect email = "Responder input", limit to 1 response = off) — it cannot be fixed from this repo. Verified 2026-09-02.

Until it's changed, the "Form not loading? Open it directly / reply by email" fallback under the frame is the working path for most visitors, so don't treat that paragraph as decorative.

## Content rules

- **Don't invent facts.** CV content mirrors the owner's real CV document; automation page claims (e.g. "100+ job leads") were supplied by the owner. Ask before adding new claims, clients, or numbers. The EmberSuite Fire project card's copy is drawn from `EMBERSUITE.md` in the parent workspace (renamed from `FIREWARDEN.md`), and the Alvo header's copy from `alvo/brand/brand-board.html` — source new claims from those, don't write marketing.
- **Projects** (`#projects` on index) holds stacked `.proj-card`s: BrawlBase, then **EmberSuite Fire** (added 2026-07-17 as "Fire Warden"; **renamed on the portfolio 2026-09-01**) linking out to `https://embersuite.uk`, which **is** its marketing landing page — it renamed `landing.html` → `index.html` on 2026-07-12 specifically so `/` serves marketing and the app shell moved to `/app.html` (see its `_redirects`). Don't "fix" that link to a `/landing` path; it doesn't exist. Cards share one structure — `h3` → `p.proj-tech` (`Tech: … | Status: …`) → description → `.proj-actions` — and only `.proj-card:last-child` drops the 24px gap.
  - **The rename is umbrella-brand EmberSuite / product EmberSuite Fire, canonical domain `embersuite.uk`** (parent workspace `EMBERSUITE.md`, 2026-07-21). `getfirewarden.com` still 301s every path to it, so the old link was not broken — just stale. Don't reintroduce "Fire Warden" here; that name now belongs only to the *separate* products Fire Warden HQ and Fire Warden Social.
- The "Featured Work" section deliberately says *"Example automations built for businesses"* — these are demos, not paid client work; keep the wording discreet.
- Buttons are outlined only: `.button`, plus the `.button--accent` accent-outline variant reserved for the **single primary CTA of a page** (there is no solid variant).

## Backups

- Git tag `backup-before-polish` = the site before the 2026-07 redesign.
- Git tag `backup-before-proc-redesign` = the site immediately before the 2026-09-02 pass (world removal + `.proc` + the stylesheet split).
- There is **no** `backup-before-scrollworld-redesign` tag. This file claimed one until 2026-09-02; it never existed. `git tag` is the authority, not this list.
- The five folded pages (`automation.html`, `projects.html`, `cv.html`, `hobbies.html`, `world.html`) live in git history before the 2026-07-16 single-page commit, and in `old-site/`.
- The eight `world/*.mp4` clips were deleted 2026-09-02. They live on in git history, so they are recoverable — but note that `git rm` shrank the *checkout* (94 MB → 49 MB), not the ~238 MB history. Rewriting that on a published Pages repo is not worth it.
- A local pre-redesign copy used to sit at `E:\ClaudeCode\website-backup-original`. **That was a Windows path and this machine was wiped on 2026-08-25** — treat it as gone, not as a backup you can reach for.
