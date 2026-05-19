# README_FOR_CODEX

## Goal

Deploy the concept book **"언어 모델은 어떻게 로봇을 움직이게 되었나"** to Ingus Lab under:

```text
/concept/llm-vlm-vla-robotics/
```

This package was prepared on 2026-05-19. It is intended as a content-first draft created in ChatGPT Pro. Codex should mainly handle repository integration, formatting, routing, build, and deployment.

## Important instruction

Do **not** ask Codex to rewrite the whole book from scratch. The main content is already provided. Codex should adapt paths, frontmatter, components, and routing to match the existing Astro/Markdown/MDX site.

## Files

```text
book.json
book_ko.md
landing.md
chapters/
  ch00_intro.md
  ...
glossary.md
references/
  references.md
  references.bib
figures/
  figures.json
  figure_prompts.md
assets/figures/
  fig01_evolution_timeline.svg
  ...
```

## Recommended implementation steps

1. Read the repository's root `AGENTS.md`.
2. Inspect the existing `/concept/` route and content collection structure.
3. Decide whether the site uses Markdown, MDX, Astro pages, or content collections.
4. Add a concept book landing page at `/concept/llm-vlm-vla-robotics/`.
5. Add chapter pages using the files in `chapters/`.
6. Add glossary and references pages.
7. Place SVG figures in the existing public/static/content asset path.
8. Fix figure paths in chapter Markdown.
9. Add a book card on `/concept/`.
10. Run the existing build command.
11. Fix build errors only; do not change unrelated pages.
12. Summarize changed files.

## Do not

- Do not invent new citations.
- Do not scrape paper figures.
- Do not rewrite Korean explanations unless needed for formatting.
- Do not change unrelated routes.
- Do not convert SVGs into copied paper figures.
- Do not allow LLM/VLM/VLA output to appear as direct robot commands without validation in explanatory examples.

## Figure policy

All included SVG figures are author-created diagrams. They avoid copyright risk from copied paper figures. If future paper figures are used, create a `figures.json` entry with source URL, paper title, license basis, and caption.

## Completion criteria

- `/concept/` lists this book.
- `/concept/llm-vlm-vla-robotics/` renders the landing page.
- All chapter pages render.
- Figures load.
- References and glossary render.
- Production build passes.
