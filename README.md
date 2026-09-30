# Kiara — Marketing con sazón

Personal portfolio for a first-gen Mexican-American multicultural marketing and community strategist. Editorial storytelling, clear strategic positioning, real project evidence, and restrained motion.

Source of truth: [K1aaraa/TempHold](https://github.com/K1aaraa/TempHold). The expertise and case-study foundation is implemented. A real case study and approved personal photography are still needed; no project metrics, testimonials or portraits are invented.

## Stack and development

Node.js **24.x**, Next.js App Router, React, TypeScript, CSS tokens, GSAP/ScrollTrigger, Vitest, React Testing Library, Playwright and Lighthouse.

```sh
npm ci
npm run dev
```

Local development: http://localhost:3000. `.env.example` documents the optional canonical-domain value; this prototype needs no secrets. Keep credentials out of Git.

## Validate before review

```sh
npm ci
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run audit
npm run build
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
npm run perf
```

`npm run validate` runs lint, types, coverage tests, audit and production build. `npm run test:watch` is the local test watch mode. `npm run test` exits once; it is not an indefinite watcher. Browser tests and Lighthouse require a successful production build and run `next start`, never `next dev`. They refuse to reuse an unrelated local server.

## CI and merge discipline

[OpenSourceLeg’s CI](https://github.com/opensourceleg/opensourceleg.github.io/blob/main/.github/workflows/ci.yml) informed the install → lint → types → coverage → audit → production build sequence. Deployment here uses Vercel rather than GitHub Pages.

`.github/workflows/ci.yml` runs on every pull request targeting `main`, every push to `main`, and manual dispatch. It uses a clean `npm ci`, warnings-as-errors ESLint, TypeScript, enforced Vitest coverage, a full dependency audit, and the production build. Passing builds are then tested in Chromium, Firefox, WebKit, iPhone/Android viewports and tablet emulation. Lighthouse runs against that same build. Coverage, browser traces/screenshots/videos and Lighthouse HTML/JSON are retained as GitHub Actions artifacts.

The stable **Merge gate** check fails if validation, any browser project, or Lighthouse fails, is canceled, or is skipped. PRs remain drafts while checks or review are outstanding. The PR template and [release review checklist](docs/release-review.md) require a preview URL, exact SHA, reviewer, test evidence and manual device review. Any failure blocks readiness; do not override a check merely to merge.

**Owner setup required:** In GitHub Settings → Rules → Rulesets (or branch protection), target `main`, require a PR and review, require branches up to date, and require the emitted `Merge gate` status check after its first run. Limit bypasses and apply protection to admins where appropriate. A workflow file alone cannot prevent the owner from merging; this integration cannot administer branch protection. Confirm the rule in GitHub before treating it as enforced.

## Test coverage and boundaries

Vitest + React Testing Library use jsdom and test semantics, real content rendering, link destinations/activation, key sections, optional media/metrics, project routes/metadata, publication rules, theme contrast, and motion lifecycle. Minimum coverage: **85% statements/lines/functions and 80% branches**, including components, project utilities, page modules and the motion loader—not just imported happy paths. HTML and LCOV reports are saved under `coverage/`. Tests fail if component code emits console errors or warnings.

Next Image and Next Link are mocked only for their unit-level DOM contracts; actual optimization/routing is exercised by Playwright. GSAP unit tests verify loading, cancellation, media preferences, scope/cleanup and timeline configuration using mocks; they do not judge animation quality. Synthetic fixtures stay under `tests/` and never enter portfolio data.

Playwright detects unexpected browser console warnings/errors, internal anchor regressions, overflow, reduced-motion/JS-free reading, fast scroll, reload, viewport/orientation sizes, slow resource loading, missing routes and browser history. Real case-study history tests become active when a published project exists. Until then, that scenario is explicitly skipped, not falsely passed. Browser emulation does not substitute for real Safari, iPhone or Android QA.

## Vercel and preview review

Connect/import **K1aaraa/TempHold** in Vercel using its GitHub integration. Choose Next.js, root `.`, Node 24.x, production branch `main`. `vercel.json` configures `npm ci` and `npm run vercel-build`; this command runs lint, types, coverage tests, audit and `npm run build` before Vercel can complete a build. Keep the configuration override consistent with the committed file.

Git pushes then create preview deployments and GitHub preview checks; merging to `main` creates the production deployment. Vercel’s Git integration ordinarily builds previews in parallel with GitHub CI. Treat previews as review environments and require green CI before merge. For a strict production hold until browser/Lighthouse CI succeeds, configure Vercel Deployment Checks to require the emitted `Merge gate` check where the account supports it. The inline Vercel build gate also prevents a lint/type/test/audit/build failure from being deployed.

After Vercel reports a successful preview, copy its actual URL into the PR and run:

```sh
PREVIEW_URL=https://your-actual-preview.vercel.app npm run test:e2e
PREVIEW_URL=https://your-actual-preview.vercel.app npm run perf
```

These commands test the deployed site instead of starting a local server. If deployment protection blocks automated access, use an approved protected-preview testing setup; do not disable protection or commit bypass tokens. Check the preview manually across the [required matrix](docs/release-review.md) before approval. No integration, URL or deployment is considered verified just because these instructions exist.

## Performance and assets

`next/font` downloads and self-hosts DM Sans/Playfair Display at build time, preloads critical subsets, uses swap and fallback metrics, and removes runtime Google Fonts CSS requests. Font fetch failures must be fixed in CI rather than hidden. CSS tokens live in `app/globals.css`.

GSAP/ScrollTrigger load only for desktop visitors who allow motion. The loader cancels obsolete requests, reverts scoped animation and pinning on preference/breakpoint changes/unmount, and leaves all content in normal flow if loading fails. No smooth-scroll library, custom cursor or 3D bundle is added. Screen readers receive a full static narrative.

Use `next/image` with accurate dimensions, `sizes`, alt text and context captions. Hero imagery is prioritized; artifacts are lazy-loaded. Compress approved photos to modern formats at useful resolutions, avoid upscaling/oversized originals, and inspect the resulting network payload. No videos exist yet; if added, use a poster, restrained resolution/bitrate, no unnecessary autoplay download, and lazy loading. Inspect production bundle/network reports for unused client code and large assets before launch.

Lighthouse reports all four categories and LCP/CLS on mobile by default. CI budgets: Performance ≥80, Accessibility ≥95, Best Practices ≥90, CLS ≤0.1; aim higher where practical. SEO is reported without a prototype threshold because noindex is intentional. At launch, set `LAUNCH_AUDIT=1` and `LIGHTHOUSE_PATHS=/,/work/real-project` to enforce SEO ≥95 on launch URLs after setting canonical/robots/metadata. Set `LIGHTHOUSE_DESKTOP=1` for a desktop run. Review a mobile LCP target ≤2.5s; instrument actual Core Web Vitals after analytics is selected. Lab scores cannot certify field INP or every device.

## Structure and content

- `app/`: homepage, root metadata/fonts, case-study route, 404 and explicit template preview.
- `components/`: reusable layout, hero, about, expertise, work and motion UI.
- `data/`: personal copy, expertise, site information, typed projects and project palettes.
- `lib/`: published-project validation and isolated GSAP loader.
- `content/`: editable project scaffold and first-project brief.
- `tests/`, `e2e/`: unit/component/route and production-browser tests.
- `scripts/`: Lighthouse runner.
- `.github/`: CI workflow and PR review template.

### Add a case study

1. Complete `content/first-case-study-brief.md` with actual role, audience, problem, insight, decisions, outcomes and learning.
2. Copy `content/project-template.ts` into `data/projects.ts`; replace all prompts. Keep `status: "draft"` until facts and media are reviewed. Drafts are neither listed nor served at `/work/[slug]`.
3. Choose a `theme` from `data/themes.ts` (paper, ink, plum, moss). Each card and case-study page scopes its palette while preserving readable typography. Add a theme to the typed union and palette table if needed; test text/link contrast.
4. Put approved media under `public/projects/<slug>/`. Provide `src`, actual dimensions, alt text and captions explaining context/your contribution. Metrics are optional; each needs baseline/timeframe/source context.
5. Complete the five conversational chapters; set `published` and `featured` only after review. Project metadata and next-project navigation are automatic. Incomplete published records fail validation, unknown slugs return 404. Validation verifies structure, not factual truth or image rights.
6. Add/update tests and review the new preview before merge.

Personal copy/optional portrait live in `data/about.ts`; expertise in `data/expertise.ts`; verified email/LinkedIn/resume values in `data/site.ts`. Do not turn empty contact values into broken links.

`/preview/case-study` contains prominently labeled writing prompts, not a real case study. It is publicly reachable and noindex, not an access-controlled draft system. Remove it before launch. Production sitemap, canonical URLs, social image, analytics and launch indexing remain later work; current prototype metadata deliberately stays noindex.
