import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { beforeEach, afterEach, expect, vi } from "vitest";
import { createElement, type MouseEvent, type AnchorHTMLAttributes, type ImgHTMLAttributes } from "react";
import { installMatchMedia } from "./matchMedia";
vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    const imageProps = { ...props }; delete imageProps.priority;
    return createElement("img", imageProps);
  },
}));

// Unit tests check link labels/destinations; Playwright tests real Next navigation.
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => createElement("a", {
    ...props, href, onClick: (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); props.onClick?.(event); },
  }, children),
}));

beforeEach(() => {
  installMatchMedia({ reducedMotion: true });
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  cleanup(); expect(console.error).not.toHaveBeenCalled(); expect(console.warn).not.toHaveBeenCalled(); vi.unstubAllGlobals();
});
