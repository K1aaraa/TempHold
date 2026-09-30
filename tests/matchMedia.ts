import { vi } from "vitest";
export function installMatchMedia({ width = 1440, reducedMotion = false } = {}) {
  let currentWidth = width; let reduced = reducedMotion;
  const queries = new Map<string, { query: MediaQueryList; notify: () => void }>();
  const matches = (query: string) => (!query.includes("min-width: 900px") || currentWidth >= 900) && (!query.includes("prefers-reduced-motion: no-preference") || !reduced);
  vi.stubGlobal("matchMedia", vi.fn((media: string) => {
    if (!queries.has(media)) {
      const listeners = new Set<EventListenerOrEventListenerObject>();
      const query = { media, get matches() { return matches(media); }, onchange: null,
        addEventListener: (_: string, callback: EventListenerOrEventListenerObject) => listeners.add(callback),
        removeEventListener: (_: string, callback: EventListenerOrEventListenerObject) => listeners.delete(callback),
        addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
      } as MediaQueryList;
      queries.set(media, { query, notify: () => {
        const event = { matches: query.matches, media } as MediaQueryListEvent;
        listeners.forEach(listener => typeof listener === "function" ? listener(event) : listener.handleEvent(event));
      } });
    }
    return queries.get(media)!.query;
  }));
  return { change(next: { width?: number; reducedMotion?: boolean }) {
    const before = new Map([...queries].map(([media, value]) => [media, value.query.matches]));
    currentWidth = next.width ?? currentWidth; reduced = next.reducedMotion ?? reduced;
    queries.forEach((value, media) => { if (before.get(media) !== value.query.matches) value.notify(); });
  } };
}
