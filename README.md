# Kiara — Marketing con sazón

Personal portfolio for a multicultural marketing and community strategist. **Milestone 1: brand and motion prototype.** This intentionally does not contain fabricated projects, testimonials, metrics, portrait photography, or contact details.

## Stack and setup
Node.js 22+ (tested with 24), Next.js App Router, React, TypeScript, CSS design tokens, GSAP + ScrollTrigger, ESLint.

```sh
npm ci
npm run dev
```
Visit http://localhost:3000. Validate using `npm run lint`, `npm run typecheck`, and `npm run build`; production runs with `npm start`.

## Structure
- `app/`: server-rendered page, root metadata, global styles, 404.
- `components/layout/`: semantic navigation.
- `components/hero/`: editorial positioning.
- `components/motion/`: isolated client-side GSAP prototype.
- `data/site.ts`: site identity, contact fields, story sequence.

## Design and motion architecture
Colors, spacing, and fonts live in `app/globals.css` as reusable tokens. The prototype uses Playfair Display and DM Sans with resilient system fallbacks. Google Fonts is currently loaded through CSS; production should self-host licensed WOFF2 files and preload only critical font weights.

`StoryPrototype` dynamically imports GSAP only for desktop visitors who allow motion. GSAP matchMedia scopes animations and ScrollTriggers; cleanup reverts pinning and inline styles on unmount and preference/breakpoint changes. Native scrolling is preserved. The desktop story is pinned and scrubbed; mobile and reduced motion present all four panels sequentially. Server-rendered content remains readable if JavaScript fails. No smooth-scroll library or custom cursor is introduced.

## Content management and next milestones
Edit positioning and verified contact URLs in `data/site.ts`; edit hero presentation in `components/hero/Hero.tsx`. Contact links remain absent until verified values exist. A portrait must be supplied by Kiara, with descriptive alt text and approved usage.

Milestone 2 adds typed `data/projects.ts`, reusable project cards, `/work/[slug]` case studies, About and Expertise. Each project should provide slug, title, organization, year, role, categories, challenge, context, strategy, contribution, outcomes, verified metrics, reflection, and media. Generate per-project metadata and statically generate known slugs. Do not add invented outcomes. Use `next/image` with accurate sizes, explicit dimensions, and below-the-fold lazy loading when adding assets under `public/projects/`.

Milestone 3 adds receipts, personality, verified contact, SEO sitemap/robots/canonical/Open Graph imagery, analytics adapter and performance refinements. Analytics platform is undecided; keep events behind a typed adapter rather than coupling visual components to a vendor.

## Environment
`.env.example` documents the optional `NEXT_PUBLIC_SITE_URL`, to be set once the canonical domain is known. This milestone needs no environment variables or secrets. Prototype metadata is deliberately noindex; remove that restriction only for the approved production release.

## GitHub and Vercel
Source of truth: https://github.com/K1aaraa/TempHold. Use feature branches, readable commits, draft PRs, review, then merge to main.

In Vercel, import **K1aaraa/TempHold**, select Next.js, root directory `.`, build `npm run build`, install `npm ci`, and production branch `main`. Vercel generates a preview for the feature branch/PR after the GitHub integration is connected. Review the preview before merging. No separate repository is needed. Deployment credentials are never committed.

## Milestone review and QA
Review positioning, typography, colors, desktop scroll pace, mobile layout and reduced-motion reading order before building the remaining portfolio. Validate desktop Chrome/Safari/Firefox, iOS Safari, Android Chrome, tablet, keyboard focus and skip link, preference changes, refresh at scroll positions, JavaScript disabled, slow network, font fallback, 404, and Lighthouse. Automated checks do not substitute for real-device motion review. Full production SEO, analytics and browser matrix remain later-milestone work.
