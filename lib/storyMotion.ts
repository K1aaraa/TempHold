const MIN_STORY_HEIGHT = 650;
const SCROLL_VIEWPORTS = 3;

// Native CSS sticky owns positioning. ScrollTrigger only scrubs text opacity,
// avoiding scroll-event positioning writes and Firefox APZ warnings.
export async function mountStoryMotion(element: HTMLElement, isCurrent: () => boolean = () => true): Promise<() => void> {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
  if (!isCurrent()) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {}, element);
  try {
    context.add(() => {
      const panels = element.querySelectorAll<HTMLElement>(".story-panel");
      element.classList.add("is-animated");
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: element.parentElement ?? element, start: "top top",
        end: () => `+=${Math.max(window.innerHeight, MIN_STORY_HEIGHT) * SCROLL_VIEWPORTS}`,
        scrub: 0.7, invalidateOnRefresh: true,
      } });
      panels.forEach((panel, index) => {
        if (index === 0) return;
        timeline.to(panels[index - 1], { autoAlpha: 0, duration: 0.35 }, index)
          .to(panel, { autoAlpha: 1, duration: 0.5 }, index + 0.15);
      });
      timeline.to({}, { duration: 0.6 });
    });
  } catch (error) {
    context.revert(); element.classList.remove("is-animated"); throw error;
  }
  return () => { context.revert(); element.classList.remove("is-animated"); };
}
