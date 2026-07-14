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

- **Pages**: `index.html` (hero + "What I Do" overview), `automation.html` (AI automation freelance portfolio — the most important page), `cv.html`, `projects.html`, `hobbies.html` (currently a WIP placeholder), `contact.html`.
- **Every page duplicates** the same navbar and footer markup — when adding a nav link or footer change, update **all six pages**.
- `style.css` is the single stylesheet. Design tokens live in `:root` CSS variables (cream background `--bg`, near-black `--ink`, terracotta `--accent`). Fonts: Playfair Display (headings, via Google Fonts `@import`) + Inter (body).
- `script.js` provides two behaviours: scroll-reveal (add class `reveal` to any element; it gets `.visible` when scrolled into view, with a 2.5s safety net so nothing stays hidden) and automatic `.active` highlighting of the current page's nav link. It's a plain scroll handler by design — do **not** switch it to IntersectionObserver (that was tried and reverted).
- Reusable patterns: `.card` (hover-lift panel), `.media-card` (image/video card, media on top + `.media-body` text), `.grid-2` / `.cv-grid` / `.contact-grid` (2-col grids, `.wide-card` spans both), `.section-heading` with `data-label="..."` (renders a small terracotta kicker above the heading), `.cta-band`, `.tag`, `.button`.
- Media assets (workflow screenshots `.png`, demo videos `.mp4`, `brawlbase-project.zip`, `brawlbase-nea.pdf`) are committed directly to the repo root and referenced with relative paths.

## Content rules

- **Don't invent facts.** CV content mirrors the owner's real CV document; automation page claims (e.g. "100+ job leads") were supplied by the owner. Ask before adding new claims, clients, or numbers.
- The "Featured Work" section deliberately says *"Example automations built for businesses"* — these are demos, not paid client work; keep the wording discreet.
- Buttons use one consistent outlined style everywhere (`.button` only — the `button--solid` variant exists in CSS but is intentionally unused).

## Backups

- Git tag `backup-before-polish` = the site before the 2026-07 redesign.
- Local copy: `E:\ClaudeCode\website-backup-original`.
