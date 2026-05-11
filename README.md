# Ingus Lab

Ingus Lab is an Astro-powered research notebook for paper reviews, technology trend notes, and technical concept reviews.

## Sections

- `Home`: Intro and latest notes
- `Papers`: Paper and research reading notes
- `Trends`: AI, product, and developer-tool trend observations
- `Technical Concepts`: Core technologies, concepts, and methods used across AI and robotics

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Build and preview through Wrangler |
| `npm run deploy` | Deploy to Cloudflare Workers |

## Content

Posts live in `src/content/blog/`. Each post uses a `category` frontmatter value:

- `papers`
- `trends`
- `concept`

The section pages at `/papers`, `/trends`, and `/concept` filter the shared blog collection by that category.

## Writing Instructions

Shared writing guidance lives in `writing-instructions.yaml`.

When drafting or editing a post, use the `global` rules first, then apply the matching category block under `categories`:

- `papers`: paper and research review guidance
- `trends`: technology and product trend guidance
- `concept`: technical concept review guidance

`AGENTS.md` tells Codex-style coding agents to read those instructions before working on posts.

Posts can provide separate Korean and English metadata with `titleKo`, `titleEn`, `descriptionKo`, and `descriptionEn`. Body content should be split into language blocks:

```html
<section data-lang="ko">
한국어 본문
</section>

<section data-lang="en">
English body
</section>
```

The header language switch stores the reader's choice and shows only the selected language.
