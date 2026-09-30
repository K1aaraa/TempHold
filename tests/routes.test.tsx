import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { projects } from "@/data/projects";
import WorkPage, { generateMetadata, generateStaticParams } from "@/app/work/[slug]/page";
import { projectFixture } from "./fixtures";
vi.mock("@/data/projects", () => ({ projects: [] }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_NOT_FOUND"); } }));
beforeEach(() => { projects.length = 0; });
test("published case-study route renders the matching content and metadata", async () => {
  projects.push(projectFixture());
  const params = Promise.resolve({ slug: "test-project" });
  render(await WorkPage({ params }));
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test project");
  expect(await generateMetadata({ params })).toMatchObject({ title: "Test project — Kiara", description: "A synthetic test summary." });
  expect(generateStaticParams()).toEqual([{ slug: "test-project" }]);
});
test("unknown and draft project routes return notFound, including metadata", async () => {
  projects.push(projectFixture({ status: "draft" }));
  expect(generateStaticParams()).toEqual([]);
  for (const slug of ["test-project", "missing"]) {
    const params = Promise.resolve({ slug });
    await expect(WorkPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(generateMetadata({ params })).rejects.toThrow("NEXT_NOT_FOUND");
  }
});
test("next-project navigation wraps through published projects only", async () => {
  projects.push(projectFixture(), projectFixture({ slug: "second", title: "Second test story" }), projectFixture({ slug: "draft", status: "draft" }));
  render(await WorkPage({ params: Promise.resolve({ slug: "second" }) }));
  expect(screen.getByRole("link", { name: "Test project" })).toHaveAttribute("href", "/work/test-project");
});
