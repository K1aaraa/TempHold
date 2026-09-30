# Preview and launch review

A milestone is not complete until the current commit has green CI and a reviewed Vercel preview. Do not copy a previous review onto a new commit. Record the reviewer, date, URL, device/browser versions, and evidence in the PR.

## Automated evidence

| Check | Evidence required |
| --- | --- |
| Install | Clean `npm ci` |
| Lint | `npm run lint`, zero warnings |
| Types | `npm run typecheck` |
| Unit/component tests | `npm run test`, zero console errors/warnings |
| Coverage | `npm run test:coverage`, thresholds met, report reviewed |
| Audit | `npm run audit`, no moderate/high/critical findings |
| Production | `npm run build`, never dev-only validation |
| Browser regression | Playwright report against production build and actual preview |
| Performance | Lighthouse HTML/JSON; four categories and CLS/LCP reviewed |

## Manual browser matrix

| Environment | Required review | Status |
| --- | --- | --- |
| Desktop Chrome | Full scenario list below | Pending |
| Desktop Firefox | Full scenario list below | Pending |
| Desktop Safari on macOS | Full scenario list below | Pending |
| iPhone Safari | Touch, portrait/landscape, reduced motion | Pending |
| Android Chrome | Touch, portrait/landscape, slow loading | Pending |
| Tablet Safari / Chrome | Orientation, navigation and layout changes | Pending |
| Laptop and large desktop | 1024, 1440 and 1920 px, keyboard-only | Pending |
| Narrow/mobile widths | 320, 390, 768, 844 and around 900 px breakpoint | Pending |

Playwright Chromium/Firefox/WebKit and device descriptors catch regressions. They do not certify real Chrome/Safari binaries or iOS/Android hardware.

## Scenarios for each applicable environment

1. Scroll rapidly down and up repeatedly, including entering/leaving the pinned section. Confirm that transitions stay readable, panels do not overlap, and scroll returns naturally.
2. Refresh halfway through the story. Resize across 900 px repeatedly; rotate phone/tablet. Confirm clean pin removal, stable content and no stale spacer.
3. Use keyboard only, including skip link, navigation, project links and CTAs. Confirm focus is visible and reading order makes sense.
4. Enable reduced motion before load and toggle it while viewing the story. All four statements and copy must remain available in normal scroll flow; no pinning or auto motion.
5. Open a real case study, go back/forward, follow next project, refresh a project URL, and request a missing slug. Check actual results and media captions.
6. Throttle connection and CPU, disable cache, delay images/fonts, then retry with JavaScript disabled. Content must remain useful. Check failed requests, image dimensions and loading shifts.
7. Watch the console throughout. No uncaught exceptions, hydration errors, missing media, GSAP warnings or stuck animations. A deliberately visited 404 is the only expected missing-page response.
8. Run Lighthouse mobile and desktop on the actual preview and final launch origin. Review Performance, Accessibility, Best Practices, SEO, LCP and CLS; inspect causes instead of only scores. Preview noindex is intentional; launch SEO must be checked after canonical/robots configuration.

## Milestone readiness

- [ ] All automatic checks passed for the exact current SHA.
- [ ] Preview URL and reviewer recorded.
- [ ] Manual matrix completed, or explicitly unresolved items kept open (milestone remains incomplete).
- [ ] Actual project content and imagery verified; synthetic unit fixtures never shipped as work.
- [ ] Lighthouse reports and performance risks reviewed.
- [ ] Main branch protection requires the merge gate and review.
- [ ] Vercel Git integration and production branch are verified.

No preview URL, absent hardware access, failing build, or unrun checks means pending—not approved.
