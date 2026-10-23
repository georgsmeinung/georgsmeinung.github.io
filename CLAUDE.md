# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal site of Jorge Nicolau, served by GitHub Pages at the custom domain in `CNAME` (`jorgenicolau.ar`). It is a static site built on the **Strata** template by HTML5 UP (see `README.md` / `LICENSE.md`, CCA 3.0). There is no build step, package manager, linter, or test suite.

Each branch is a different visual style of the same site (see `README.md`). GitHub Pages currently publishes the `modern` branch, so pushing to `main` does not change the live site. To preview, open `index.html` in a browser or serve the folder with any static server (e.g. `python -m http.server`).

## Git workflow

Never run `git commit` or `git push` in this repository. Only the owner commits and pushes. Leave changes in the working tree for them to review.

## Structure

- `index.html` — landing page (intro section `#one`).
- `resume.html` — CV page with sections `#intro`, `#experience`, `#education`, `#Languages`, `#skills`. Experience entries follow a repeated pattern: `<span>` date range, `<h4>` with company link, `<p>` description. Keep new entries in that same shape, newest first.
- Both pages share the same `#header` (sidebar with avatar) and `#footer` markup, duplicated in each file — changes to header/footer must be made in both.
- `assets/js/main.js` — Strata behavior: header parallax (disabled on mobile/IE) and a Poptrox lightbox bound to `#two` (gallery section, currently unused).
- `images/` — `avatar.jpg`, header backgrounds (`bg*.jpg`), favicon, and template gallery folders (`fulls/`, `thumbs/`).

## Styling — important

- Pages load **`assets/css/main.css`** only. Site customizations (Hind font via Google Fonts, green accent colors like `#008B63`, header background image) were made **directly in the compiled CSS**.
- `assets/sass/` is the original, unmodified template source and is **out of sync** with `main.css`. Do not recompile Sass over `main.css` — that would wipe the customizations. Edit `main.css` directly.
- `assets/css/main-inter.css` is an alternate, unused variant of `main.css` using the Inter Tight font and grey colors.
