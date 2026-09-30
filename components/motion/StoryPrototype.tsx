"use client";
import { useEffect, useRef } from "react";
import { story } from "@/data/site";
import { mountStoryMotion } from "@/lib/storyMotion";
const MOTION_QUERY = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

export function StoryPrototype() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current!;
    const query = window.matchMedia(MOTION_QUERY);
    let disposed = false;
    let generation = 0;
    let cleanup: (() => void) | undefined;
    function synchronize() {
      const current = ++generation;
      cleanup?.(); cleanup = undefined;
      element.dataset.motionStatus = "static";
      if (!query.matches) return;
      void mountStoryMotion(element, () => !disposed && current === generation && query.matches).then(revert => {
        if (disposed || current !== generation || !query.matches) { revert(); return; }
        cleanup = revert; element.dataset.motionStatus = "ready";
      }).catch(() => {
        // Failed animation chunks leave the complete static narrative usable.
        if (!disposed && current === generation) element.dataset.motionStatus = "unavailable";
      });
    }
    synchronize(); query.addEventListener("change", synchronize);
    return () => { disposed = true; generation++; query.removeEventListener("change", synchronize); cleanup?.(); };
  }, []);
  return <div className="story-track"><section id="cultura" ref={root} className="story" aria-labelledby="story-heading">
    <div className="section-meta"><span>THE THINKING BEHIND THE WORK</span><span>01 — 04</span></div>
    <h2 id="story-heading" className="story-heading">Good marketing moves people.</h2>
    <div className="sr-only">{story.map(item => <div key={item.word}><h3 lang={item.word === "CONEXIÓN" ? "es" : undefined}>{item.word}</h3><p>{item.label}. {item.copy}</p></div>)}</div>
    <div className="story-stage" aria-hidden="true">{story.map(item => <article className="story-panel" key={item.word}><p className="story-label">{item.label}</p><h3 lang={item.word === "CONEXIÓN" ? "es" : undefined}>{item.word}</h3><p className="story-copy">{item.copy}</p></article>)}</div>
    <p className="story-footnote">Different perspectives. Shared connection. <span aria-hidden="true">✳</span></p>
  </section></div>;
}
