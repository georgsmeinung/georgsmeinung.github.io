# Jorge Nicolau — Personal Website

Source for [jorgenicolau.ar](https://jorgenicolau.ar), the personal homepage and online resume of Jorge Nicolau (AI Solution & Enterprise Architect, Buenos Aires, Argentina).

The site is published with GitHub Pages and contains:

- A **homepage** with a short introduction and bio.
- A **resume** page covering professional experience, education, languages, and skills.
- In some styles, a **projects** page showcasing academic research, AI/data initiatives, and other work.

## One branch per style

Each branch of this repository is a different visual style of the same personal site. The content is the same throughout; only the design and implementation change. GitHub Pages serves whichever branch is set as the publishing source.

> **Active style: [`modern`](../../tree/modern).** It is the branch currently published at jorgenicolau.ar.

| Branch | Style | Based on |
|---|---|---|
| [`modern`](../../tree/modern) | **Current live site.** Sidebar layout, light/dark themes, timelines, projects page, and a Three.js background. Composed with generative AI. | Original (vanilla HTML/CSS/JS) |
| [`minimal`](../../tree/minimal) | Lightweight, handcrafted homepage and resume. | Original (vanilla HTML/CSS) |
| [`main`](../../tree/main) | Sidebar header with a parallax aerial background. | [Strata](https://html5up.net/strata) by HTML5 UP |
| [`strata`](../../tree/strata) | Working branch for the Strata style. | [Strata](https://html5up.net/strata) by HTML5 UP |
| [`zeon`](../../tree/zeon) | Bootstrap 5 layout with scroll animations (AOS) and Remix Icons. | Bootstrap 5 |
| [`story.design`](../../tree/story.design) | Modular one-page layout. | [Story](https://html5up.net/story) by HTML5 UP |
| [`helvetica`](../../tree/helvetica) | Earlier variant of the Story-based design. | [Story](https://html5up.net/story) by HTML5 UP |

To switch the live style, change the GitHub Pages source branch in the repository settings (**Settings → Pages**). Each branch that should be served at the custom domain needs a `CNAME` file containing `jorgenicolau.ar`.

## Credits for this branch (`main`)

This branch uses **Strata** by [HTML5 UP](https://html5up.net) (@ajlkn), free for personal and commercial use under the [CCA 3.0 license](https://html5up.net/license) (see `LICENSE.md`). It also includes:

- Icons: [Font Awesome](https://fontawesome.com)
- [jQuery](https://jquery.com) and [Responsive Tools](https://github.com/ajlkn/responsive-tools)
