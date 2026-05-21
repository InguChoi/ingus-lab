# Ingus Lab

Ingus Lab is an Astro-powered research notebook for paper reviews, project notes, technology trend notes, and technical concept reviews.

## Sections

- `Home`: Intro and latest notes
- `Papers`: Paper and research reading notes
- `Project`: Experiments, implementations, and product ideas growing out of research notes
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

## Private Content

Private concept pages are protected at the Worker middleware layer. Configure one of these before deploying private pages:

- Cloudflare Access: set `PRIVATE_ALLOWED_EMAIL` to the allowed email address.
- Basic auth: set `PRIVATE_CONTENT_PASSWORD`, and optionally `PRIVATE_CONTENT_USERNAME` (defaults to `ingu`).

Do not commit the password to the repository. Use Wrangler secrets or the Cloudflare dashboard.

## Content

Posts live in `src/content/blog/`. Each post uses a `category` frontmatter value:

- `papers`
- `project`
- `trends`
- `concept`

The section pages at `/papers`, `/project`, `/trends`, and `/concept` filter the shared blog collection by that category.

## Writing Instructions

Shared writing guidance lives in `writing-instructions.yaml`.

When drafting or editing a post, use the `global` rules first, then apply the matching category block under `categories`:

- `papers`: paper and research review guidance
- `project`: experiment, implementation, and product idea guidance
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
