# Kiara — Marketing con sazón

Personal portfolio for a multicultural marketing and community strategist. **Milestone 2 foundation: expertise and content-driven case studies.** This intentionally does not contain fabricated projects, testimonials, metrics, portrait photography, or contact details.

## Stack and setup
Node.js 22.18+ (tested with 24; native TypeScript test runner), Next.js App Router, React, TypeScript, CSS design tokens, GSAP + ScrollTrigger, ESLint.

```sh
npm ci
npm run dev
```
Visit http://localhost:3000. Validate using `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`; production runs with `npm start`.

## Structure
- `app/`: server-rendered page, root metadata, global styles, 404.
- `components/layout/`: semantic navigation.
- `components/hero/`: editorial positioning.
- `components/motion/`: isolated client-side GSAP prototype.
- `data/site.ts`: site identity, contact fields, story sequence.

## Design and motion architecture
Colors, spacing, and fonts live in `app/globals.css` as reusable tokens. The prototype uses Playfair Display and DM Sans with resilient system fallbacks. Google Fonts is currently loaded through CSS; production should self-host licensed WOFF2 files and preload only critical font weights.

`StoryPrototype` dynamically imports GSAP only for desktop visitors who allow motion. GSAP matchMedia scopes animations and ScrollTriggers; cleanup reverts pinning and inline styles on unmount and preference/breakpoint changes. Native scrolling is preserved. The desktop story is pinned and scrubbed; mobile and reduced motion present all four panels sequentially. Server-rendered content remains readable if JavaScript fails. No smooth-scroll library or custom cursor is introduced.

## Content management
Structured personal copy lives in `data/about.ts`, capabilities in `data/expertise.ts`, project content in `data/projects.ts`, and palettes in `data/themes.ts`. Contact information remains in `data/site.ts`; links should be enabled only when verified values exist. See the case-study workflow below to add projects without rebuilding visual components.

Later work adds receipts, personality, verified contact, production sitemap/robots/canonical/Open Graph imagery, and an analytics adapter. Keep vendor-specific analytics outside visual components. The first real project and approved personal photography take priority over new motion effects.

## Environment
`.env.example` documents the optional `NEXT_PUBLIC_SITE_URL`, to be set once the canonical domain is known. This milestone needs no environment variables or secrets. Prototype metadata is deliberately noindex; remove that restriction only for the approved production release.

## GitHub and Vercel
Source of truth: https://github.com/K1aaraa/TempHold. Use feature branches, readable commits, draft PRs, review, then merge to main.

In Vercel, import **K1aaraa/TempHold**, select Next.js, root directory `.`, build `npm run build`, install `npm ci`, and production branch `main`. Vercel generates a preview for the feature branch/PR after the GitHub integration is connected. Review the preview before merging. No separate repository is needed. Deployment credentials are never committed.

## Milestone review and QA
Review positioning, typography, colors, desktop scroll pace, mobile layout and reduced-motion reading order before building the remaining portfolio. Validate desktop Chrome/Safari/Firefox, iOS Safari, Android Chrome, tablet, keyboard focus and skip link, preference changes, refresh at scroll positions, JavaScript disabled, slow network, font fallback, 404, and Lighthouse. Automated checks do not substitute for real-device motion review. Full production SEO, analytics and browser matrix remain later-milestone work.

## Milestone 2: content before effects
Expertise lives in `data/expertise.ts`; approved personal copy and optional portrait live in `data/about.ts`. The homepage adds a natural-scroll expertise index and selected work; no new animation dependencies. The existing scroll story has a complete screen-reader reading path separate from its visual transitions.

### Add the first real case study
1. Fill in `content/first-case-study-brief.md` with actual project details and shareable evidence.
2. Copy `content/project-template.ts` into `data/projects.ts` as a new `Project` entry. Replace every prompt with approved facts. Keep `status: "draft"` while editing.
3. Choose `paper`, `ink`, `plum`, or `moss` in `theme`. Palette tokens live in `data/themes.ts`, scoped to that project’s card and case study. Add new themes to the `ProjectTheme` union and theme table; test copy/link contrast before release.
4. Add approved photography and artifacts under `public/projects/<slug>/`. Give each asset a local `src`, accurate width/height, descriptive alt text, and a caption explaining the context or your contribution. Hero media is optional; do not add generic photos to impersonate a real project. Portrait media is independently configured in `data/about.ts`.
5. Complete problem, insight, actions, outcome and learning paragraphs. Metrics are optional; every metric needs timeframe/baseline/source context. Confirm the facts manually—validation checks completeness, not truth.
6. Set `status: "published"` and `featured: true` to include the project on the homepage and serve `/work/<slug>`. Published projects receive metadata and next-project navigation automatically. Draft/unknown slugs return 404 and cannot be reached through the project route. Invalid published records fail validation.

`/preview/case-study` is a noindex layout preview containing explicit writing prompts. It is publicly reachable, not access-controlled; never use it for confidential drafts. It is not linked from the portfolio or represented as real work. Review its five conversational chapters and plum palette before inserting factual content. Remove the preview route before production launch.

The first real case study and personal photography are pending supplied materials. Do not mark this milestone complete until those are integrated and the preview is reviewed.

### Content validation
`npm run test` covers draft exclusion, unknown slug resolution, incomplete and duplicate published records, required media/metric context, and WCAG AA copy/link contrast across project palettes. Tests use synthetic data never imported by the website.
