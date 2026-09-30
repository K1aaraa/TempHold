import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { Navigation } from "@/components/layout/Navigation";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Expertise } from "@/components/expertise/Expertise";
import { ProjectCard } from "@/components/work/ProjectCard";
import { CaseStudy } from "@/components/work/CaseStudy";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import Home from "@/app/page";
import NotFound from "@/app/not-found";
import Preview from "@/app/preview/case-study/page";
import { projects } from "@/data/projects";
import { about } from "@/data/about";
import { projectFixture, mediaFixture } from "./fixtures";

vi.mock("@/data/projects", () => ({ projects: [] }));

describe("navigation and positioning", () => {
  test("links address real homepage sections and can be activated", async () => {
    render(<Home />);
    const navigation = screen.getByRole("navigation", { name: "Main navigation" });
    for (const link of within(navigation).getAllByRole("link")) {
      const id = link.getAttribute("href")!.slice(1);
      expect(document.getElementById(id)).toBeInTheDocument();
      await userEvent.click(link);
      expect(link).toHaveFocus();
    }
    expect(screen.getByRole("link", { name: "Kiara home" })).toHaveAttribute("href", "#top");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Marketing con sazón.");
    for (const id of ["top", "about", "expertise", "work", "cultura"]) expect(document.getElementById(id)).toBeInTheDocument();
  });
  test("case-study navigation returns to homepage anchors", () => {
    render(<Navigation onHome={false} />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/#work");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/#about");
    expect(screen.getByRole("link", { name: "Cultura" })).toHaveAttribute("href", "/#cultura");
  });
  test("hero has an accessible section name and scroll CTA", async () => {
    render(<Hero />);
    expect(screen.getByRole("region", { name: "Marketing con sazón." })).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /Scroll pa’ abajo/ });
    expect(cta).toHaveAttribute("href", "#about");
    await userEvent.tab();
    expect(cta).toHaveFocus();
  });
  test("expertise renders four strategic disciplines and capability lists", () => {
    render(<Expertise />);
    expect(screen.getByRole("region", { name: "Lo que hago." })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByText("What makes people belong?")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Multicultural Marketing capabilities" })).toHaveTextContent("Audience insights");
  });
  test("about remains useful without photography, and captions a supplied portrait", () => {
    const { rerender } = render(<About />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const previous = about.portrait;
    try {
      about.portrait = mediaFixture;
      rerender(<About />);
      expect(screen.getByRole("img", { name: mediaFixture.alt })).toHaveAttribute("width", "1200");
      expect(screen.getByText(mediaFixture.caption)).toBeInTheDocument();
    } finally { about.portrait = previous; }
  });
});

describe("project evidence and reading flow", () => {
  test("optional media and metrics can be absent without losing the story", () => {
    const project = projectFixture();
    render(<CaseStudy project={project} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(project.title);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(5);
    for (const text of [...project.problem, ...project.insight, ...project.actions, ...project.outcome, ...project.learning]) expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(project.role)).toBeInTheDocument();
    expect(screen.getByText(project.audience)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to selected work →" })).toHaveAttribute("href", "/#work");
  });
  test("evidence, metric context, and next-project links render from data", async () => {
    const project = projectFixture({ hero: mediaFixture, artifacts: [{ ...mediaFixture, src: "/projects/test/second.webp", alt: "Second test artifact" }], metrics: [{ value: "12", label: "Test responses", context: "Synthetic test context; not portfolio evidence." }] });
    const next = projectFixture({ slug: "next-test", title: "Next test story" });
    render(<CaseStudy project={project} nextProject={next} />);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByText("Synthetic test context; not portfolio evidence.")).toBeInTheDocument();
    const nextLink = screen.getByRole("link", { name: "Next test story" });
    expect(nextLink).toHaveAttribute("href", "/work/next-test");
    await userEvent.click(nextLink); expect(nextLink).toHaveFocus();
    expect(document.querySelector(".project-theme")).toHaveStyle({ "--project-background": "#eee5ec" });
  });
  test("project card links its title and CTA to the same case study", () => {
    render(<ProjectCard project={projectFixture({ hero: mediaFixture, metrics: [{ value: "12", label: "Test responses", context: "Test context" }] })} number={1} />);
    expect(screen.getByRole("link", { name: "Test project" })).toHaveAttribute("href", "/work/test-project");
    expect(screen.getByRole("link", { name: "Read the story" })).toHaveAttribute("href", "/work/test-project");
    expect(screen.getByText("Test context")).toBeInTheDocument();
  });
  test("photography preserves dimensions, alternative text and context", () => {
    render(<ProjectMedia media={{ ...mediaFixture, kind: "photography" }} hero />);
    expect(screen.getByRole("img", { name: mediaFixture.alt })).toHaveAttribute("height", "800");
    expect(screen.getByText(mediaFixture.caption)).toBeInTheDocument();
  });
  test("homepage includes published featured work and excludes drafts", () => {
    projects.push(projectFixture(), projectFixture({ slug: "hidden", title: "Hidden draft", status: "draft" }));
    try {
      render(<Home />);
      expect(screen.getByRole("link", { name: "Read the story" })).toHaveAttribute("href", "/work/test-project");
      expect(screen.queryByText("Hidden draft")).not.toBeInTheDocument();
    } finally { projects.length = 0; }
  });
  test("404 and template previews clearly identify their state", () => {
    const { unmount } = render(<NotFound />);
    expect(screen.getByRole("link", { name: /Back to Kiara/ })).toHaveAttribute("href", "/");
    unmount(); render(<Preview />);
    expect(screen.getByText(/Template preview — these are writing prompts/)).toBeInTheDocument();
  });
});
