# Ingus Lab

Ingus Lab is an Astro-powered research notebook for paper reviews, technology trend notes, and early concept sketches.

## Sections

- `Home`: Intro and latest notes
- `Papers`: Paper and research reading notes
- `Trends`: AI, product, and developer-tool trend observations
- `Concept`: Early product, interface, and learning ideas

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
