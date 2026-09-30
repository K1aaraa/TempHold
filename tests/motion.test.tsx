import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { StoryPrototype } from "@/components/motion/StoryPrototype";
import { mountStoryMotion } from "@/lib/storyMotion";
import { story } from "@/data/site";
import { installMatchMedia } from "./matchMedia";
vi.mock("@/lib/storyMotion", () => ({ mountStoryMotion: vi.fn() }));
const mount = vi.mocked(mountStoryMotion);
const revert = vi.fn();
beforeEach(() => {
  revert.mockReset();
  mount.mockReset().mockImplementation(async element => {
    element.classList.add("is-animated");
    return () => { revert(); element.classList.remove("is-animated"); };
  });
});
test("reduced motion preserves all accessible content without initializing GSAP", () => {
  installMatchMedia({ reducedMotion: true }); render(<StoryPrototype />);
  for (const item of story) {
    expect(screen.getByRole("heading", { name: item.word })).toBeInTheDocument();
    expect(screen.getByText(`${item.label}. ${item.copy}`)).toBeInTheDocument();
  }
  expect(mount).not.toHaveBeenCalled();
  expect(document.querySelector("#cultura")).not.toHaveClass("is-animated");
});
test("mobile keeps normal flow and enables motion only after desktop resize", async () => {
  const media = installMatchMedia({ width: 390 }); render(<StoryPrototype />);
  expect(mount).not.toHaveBeenCalled();
  act(() => media.change({ width: 1200 }));
  await waitFor(() => expect(document.querySelector("#cultura")).toHaveAttribute("data-motion-status", "ready"));
  act(() => media.change({ width: 390 }));
  expect(revert).toHaveBeenCalledTimes(1);
  expect(document.querySelector("#cultura")).not.toHaveClass("is-animated");
});
test("changing reduced motion cleans up pinning and can re-enable the story", async () => {
  const media = installMatchMedia(); const { unmount } = render(<StoryPrototype />);
  await waitFor(() => expect(document.querySelector("#cultura")).toHaveClass("is-animated"));
  act(() => media.change({ reducedMotion: true }));
  expect(revert).toHaveBeenCalledTimes(1);
  expect(document.querySelector("#cultura")).not.toHaveClass("is-animated");
  act(() => media.change({ reducedMotion: false }));
  await waitFor(() => expect(mount).toHaveBeenCalledTimes(2));
  unmount(); expect(revert).toHaveBeenCalledTimes(2);
  act(() => media.change({ reducedMotion: true })); expect(mount).toHaveBeenCalledTimes(2);
});
test("a delayed loader resolves safely after unmount", async () => {
  installMatchMedia(); let finish!: (value: () => void) => void;
  mount.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const { unmount } = render(<StoryPrototype />); unmount();
  await act(async () => finish(revert)); expect(revert).toHaveBeenCalledTimes(1);
});
test("failed animation loading preserves the full static narrative without an unhandled rejection", async () => {
  installMatchMedia(); mount.mockRejectedValueOnce(new Error("Test chunk unavailable"));
  render(<StoryPrototype />);
  await waitFor(() => expect(document.querySelector("#cultura")).toHaveAttribute("data-motion-status", "unavailable"));
  expect(screen.getByRole("heading", { name: "CONEXIÓN" })).toBeInTheDocument();
  expect(document.querySelector("#cultura")).not.toHaveClass("is-animated");
});
