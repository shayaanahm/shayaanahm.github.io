# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Shayaan Ahmed's personal portfolio site ("**the portfolio**"), served by GitHub Pages at **shayaanahm.github.io** straight from `main` — every push to `main` deploys automatically (allow 1–2 minutes for the Pages rebuild). No build step, no framework, no dependencies: plain HTML + one shared `style.css` + one shared `script.js`.

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

- **Pages**: `index.html` (editorial hero + "What I Do" index rows), `automation.html` (AI automation freelance portfolio — the most important page), `cv.html`, `projects.html`, `hobbies.html` (currently a WIP placeholder), `contact.html`, and `world.html` (standalone 3D scroll experience — see below).
- **Every regular page duplicates** the same navbar and footer markup — when adding a nav link or footer change, update **all six regular pages** (`world.html` has its own minimal chrome instead).
- `style.css` is the single stylesheet for the six regular pages. Design tokens live in `:root` CSS variables (cream background `--bg`, near-black `--ink`, terracotta `--accent`). Fonts: Playfair Display (headings, via Google Fonts `@import`) + Inter (body).
- **2026-07 "brand evolution" redesign** (editorial layout, same palette): pages open with a `.page-header` block (`.small-label` kicker with terracotta dash + `.page-title` with an italic `<em>` accent word + `.section-intro`, all left-aligned); section headings sit in a `.section-row` (heading left, `.section-sub` right; add class `tight` for the first one after a page header); the homepage "What I Do" uses `.index-list`/`.index-row` editorial rows instead of cards; `.cta-band` is a dark ink panel; the homepage hero is `.hero-grid` (copy in `.hero-copy` + `.hero-meta` side rail).
- `script.js` provides two behaviours: scroll-reveal (add class `reveal` to any element; it gets `.visible` when scrolled into view, with a 2.5s safety net so nothing stays hidden) and automatic `.active` highlighting of the current page's nav link. It's a plain scroll handler by design — do **not** switch it to IntersectionObserver (that was tried and reverted).
- Reusable patterns: `.card` (hover-lift panel with terracotta top-line sweep), `.media-card` (image/video card, media on top + `.media-body` text), `.grid-2` / `.cv-grid` / `.contact-grid` (2-col grids, `.wide-card` spans both), `.section-heading` with `data-label="..."` (renders a small terracotta kicker above the heading), `.cta-band`, `.tag`, `.button`.
- Media assets (workflow screenshots `.png`, demo videos `.mp4`, `brawlbase-project.zip`, `brawlbase-nea.pdf`) are committed directly to the repo root and referenced with relative paths.

## world.html — the 3D scroll flythrough

- Standalone page: scroll scrubs a continuous Three.js camera flight through four low-poly "islands" (Automation desk → BrawlBase ring → CV book tower → Contact lighthouse), each with pinned copy linking to its real page. Technique adapted from the open-source **scroll-world** skill (github.com/oso95/scroll-world) but rendered live in code — **no Higgsfield/video assets, zero running cost**.
- Self-contained: its CSS/JS live inline in the page; Three.js is vendored at `vendor/three.module.min.js` (pinned r170 — don't swap to a CDN).
- Has a static fallback (`body.static` + `.fallback` list) for `prefers-reduced-motion` and failed WebGL — keep it working when editing.
- Copy bands are `data-band="start,end"` attributes (scroll progress 0–1); camera stops are the `lingerAt` array in the module script — keep them aligned if scenes change.

## Content rules

- **Don't invent facts.** CV content mirrors the owner's real CV document; automation page claims (e.g. "100+ job leads") were supplied by the owner. Ask before adding new claims, clients, or numbers.
- The "Featured Work" section deliberately says *"Example automations built for businesses"* — these are demos, not paid client work; keep the wording discreet.
- Buttons are outlined only: `.button`, plus the `.button--accent` terracotta-outline variant reserved for the **single primary CTA of a page** (there is no solid variant).

## Backups

- Git tag `backup-before-polish` = the site before the 2026-07 redesign.
- Git tag `backup-before-scrollworld-redesign` = before the 2026-07 brand-evolution redesign + world.html.
- Local copy: `E:\ClaudeCode\website-backup-original`.
