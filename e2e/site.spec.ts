import { test as base, expect } from "@playwright/test";
import { projects } from "../data/projects";
import { publishedProjects } from "../lib/projects";

const test = base.extend<{ consoleGuard: void }>({
  consoleGuard: [async ({ page }, use) => {
    const messages: string[] = [];
    page.on("pageerror", error => messages.push(error.message));
    page.on("console", message => {
      // The deliberately requested missing route has an expected HTTP 404.
      // Do not ignore 404s for assets or any other request.
      const expected404 = message.location().url.includes("/work/not-a-real-project") && message.text().includes("404");
      if (["error", "warning"].includes(message.type()) && !expected404) messages.push(message.text());
    });
    await use();
    expect(messages, "Uncaught errors or browser console warnings").toEqual([]);
  }, { auto: true }],
});

async function assertNoOverflow(page: import("@playwright/test").Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test("navigation, content, keyboard access and internal destinations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Marketing con sazón.");
  await page.keyboard.press("Tab"); await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  for (const section of ["about", "expertise", "work", "cultura"]) await expect(page.locator(`#${section}`)).toBeAttached();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await nav.getByRole("link", { name: "Work" }).click(); await expect(page).toHaveURL(/#work$/);
  await nav.getByRole("link", { name: "About" }).click(); await expect(page).toHaveURL(/#about$/);
  await page.getByRole("link", { name: "Kiara home" }).click(); await expect(page).toHaveURL(/#top$/);
  const anchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute("href")!.slice(1)));
  for (const id of anchors) await expect(page.locator(`[id="${id}"]`)).toBeAttached();
  await assertNoOverflow(page);
});

test("reduced motion and JavaScript-free reading preserve every story step", async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/");
  await expect(page.locator("#cultura")).not.toHaveClass(/is-animated/);
  await expect(page.locator(".story-panel")).toHaveCount(4);
  for (const panel of await page.locator(".story-panel").all()) await expect(panel).toBeVisible();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto(new URL("/", page.url()).href);
  await expect(staticPage.locator(".story-panel")).toHaveCount(4);
  await expect(staticPage.locator("#cultura")).not.toHaveClass(/is-animated/);
  await context.close();
});

test("quick scrolling, halfway refresh, resizing and motion preference changes", async ({ page, isMobile }) => {
  await page.goto("/");
  const section = page.locator("#cultura");
  if (!isMobile && (page.viewportSize()?.width ?? 0) >= 900) {
    await expect(section).toHaveAttribute("data-motion-status", "ready");
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => scrollBy(0, innerHeight));
    await page.reload(); await expect(section).toHaveAttribute("data-motion-status", "ready");
  }
  for (let index = 0; index < 6; index++) await page.evaluate(index => scrollTo(0, index % 2 ? 0 : document.body.scrollHeight), index);
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1024, height: 768 }, { width: 320, height: 740 }]) {
    await page.setViewportSize(viewport); await assertNoOverflow(page);
    if (viewport.width < 900) await expect(section).not.toHaveClass(/is-animated/);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section).not.toHaveClass(/is-animated/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("template route and unknown project return useful pages", async ({ page }) => {
  await page.goto("/preview/case-study");
  await expect(page.getByText(/Template preview — these are writing prompts/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(5);
  await page.getByRole("link", { name: "Back to the work" }).click(); await expect(page).toHaveURL(/\/#work$/);
  const response = await page.goto("/work/not-a-real-project");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: /Back to Kiara/ })).toBeVisible();
});

test("slow resources and delayed images do not hide the narrative", async ({ page }) => {
  await page.route(/\.(?:woff2?|webp|png|jpe?g)(?:\?|$)/, async route => {
    await new Promise(resolve => setTimeout(resolve, 400)); await route.continue();
  });
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".story-panel")).toHaveCount(4);
  await page.evaluate(() => document.fonts.ready);
  await assertNoOverflow(page);
  await expect.poll(() => page.locator("img").evaluateAll(images => images.filter(image => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0).length)).toBe(0);
});

const published = publishedProjects(projects);
test("published case studies support browser back and forward", async ({ page }) => {
  test.skip(published.length === 0, "No real published case study has been supplied yet.");
  await page.goto("/"); await page.goto(`/work/${published[0].slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(published[0].title);
  await page.goBack(); await expect(page.locator("#work")).toBeAttached();
  await page.goForward(); await expect(page.getByRole("heading", { level: 1 })).toHaveText(published[0].title);
});
