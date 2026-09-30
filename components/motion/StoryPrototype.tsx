"use client";
import { useEffect, useRef } from "react";
import { story } from "@/data/site";
export function StoryPrototype() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const query = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    let loading = false;
    const initialize = () => {
    if (!query.matches || cleanup || loading) return;
    loading = true;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const element = root.current!;
        const panels = element.querySelectorAll<HTMLElement>(".story-panel");
        element.classList.add("is-animated");
        gsap.set(panels, { autoAlpha: 0, y: 36 });
        gsap.set(panels[0], { autoAlpha: 1, y: 0 });
        const timeline = gsap.timeline({ scrollTrigger: { trigger: element, start: "top top", end: "+=2100", pin: true, scrub: 0.7, invalidateOnRefresh: true } });
        panels.forEach((panel, index) => {
          if (index === 0) return;
          timeline.to(panels[index - 1], { autoAlpha: 0, y: -36, duration: 0.35 }, index)
            .to(panel, { autoAlpha: 1, y: 0, duration: 0.5 }, index + 0.15);
        });
        timeline.to({}, { duration: 0.6 });
        return () => element.classList.remove("is-animated");
      }, root);
      cleanup = () => media.revert();
    });
    };
    initialize();
    query.addEventListener("change", initialize);
    return () => { disposed = true; query.removeEventListener("change", initialize); cleanup?.(); };
  }, []);
  return <section id="cultura" ref={root} className="story" aria-labelledby="story-heading"><div className="section-meta"><span>THE THINKING BEHIND THE WORK</span><span>01 — 04</span></div><h2 id="story-heading" className="story-heading">Good marketing moves people.</h2><div className="sr-only">{story.map(item => <div key={item.word}><h3 lang={item.word === "CONEXIÓN" ? "es" : undefined}>{item.word}</h3><p>{item.label}. {item.copy}</p></div>)}</div><div className="story-stage" aria-hidden="true">{story.map(item => <article className="story-panel" key={item.word}><p className="story-label">{item.label}</p><h3 lang={item.word === "CONEXIÓN" ? "es" : undefined}>{item.word}</h3><p className="story-copy">{item.copy}</p></article>)}</div><p className="story-footnote">Different perspectives. Shared connection. <span aria-hidden="true">✳</span></p></section>;
}
