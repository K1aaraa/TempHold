import { beforeEach, expect, test, vi } from "vitest";
import { mountStoryMotion } from "@/lib/storyMotion";
const mocks = vi.hoisted(() => {
  const to = vi.fn();
  const timeline = { to };
  to.mockReturnValue(timeline);
  return { to, timeline, registerPlugin: vi.fn(), set: vi.fn(), timelineFactory: vi.fn<(options: unknown) => typeof timeline>().mockReturnValue(timeline), revert: vi.fn() };
});
vi.mock("gsap", () => ({ gsap: {
  registerPlugin: mocks.registerPlugin, set: mocks.set, timeline: mocks.timelineFactory,
  context: () => ({ add: (callback: () => void) => callback(), revert: mocks.revert }),
} }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
beforeEach(() => {
  mocks.timelineFactory.mockReset().mockReturnValue(mocks.timeline);
  mocks.to.mockReset().mockReturnValue(mocks.timeline);
});
function section() {
  const element = document.createElement("section");
  element.innerHTML = "<div class='story-panel'></div>".repeat(4);
  return element;
}
test("desktop story scrubs opacity with native sticky positioning and scoped cleanup", async () => {
  const element = section(); const cleanup = await mountStoryMotion(element);
  expect(element).toHaveClass("is-animated");
  const options = mocks.timelineFactory.mock.calls[0]![0] as unknown as { scrollTrigger: { pin?: boolean; scrub: number; end: () => string } };
  expect(options.scrollTrigger.pin).toBeUndefined();
  expect(options.scrollTrigger.scrub).toBe(0.7);
  expect(options.scrollTrigger.end()).toBe(`+=${Math.max(window.innerHeight, 650) * 3}`);
  expect(mocks.to).toHaveBeenCalledTimes(7);
  cleanup(); expect(mocks.revert).toHaveBeenCalled(); expect(element).not.toHaveClass("is-animated");
});
test("failed timeline setup reverts inline animation state instead of hiding content", async () => {
  const element = section(); mocks.timelineFactory.mockImplementationOnce(() => { throw new Error("Test setup error"); });
  await expect(mountStoryMotion(element)).rejects.toThrow("Test setup error");
  expect(mocks.revert).toHaveBeenCalled(); expect(element).not.toHaveClass("is-animated");
});

test("an obsolete asynchronous load never starts a new pin or hides content", async () => {
  const element = section();
  const cleanup = await mountStoryMotion(element, () => false);
  expect(element).not.toHaveClass("is-animated");
  expect(mocks.timelineFactory).not.toHaveBeenCalled(); cleanup();
});
