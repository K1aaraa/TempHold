import assert from "node:assert/strict";
import { test } from "vitest";
import { publishedProjects, findPublishedProject } from "../lib/projects.ts";
import { projectTemplate } from "../content/project-template.ts";
import { projectThemes } from "../data/themes.ts";
import type { Project } from "../types/project.ts";

// Synthetic test data is never imported into portfolio content.
function fixture(overrides: Partial<Project> = {}): Project {
  return {
    ...projectTemplate,
    slug: "test-project",
    status: "published",
    title: "Test project",
    organization: "Test organization",
    year: "2026",
    role: "Test role",
    summary: "Test summary",
    audience: "Test audience",
    ...overrides,
  };
}

test("draft content cannot be listed or accessed by its slug", () => {
  assert.deepEqual(publishedProjects([projectTemplate]), []);
  assert.equal(findPublishedProject([projectTemplate], projectTemplate.slug), undefined);
});

test("unknown project slugs cannot resolve to another project", () => {
  assert.equal(findPublishedProject([fixture()], "unknown"), undefined);
});

test("a project can publish without invented metrics or imagery", () => {
  const project = fixture();
  assert.deepEqual(publishedProjects([project]), [project]);
  assert.equal(findPublishedProject([project], project.slug), project);
});

test("incomplete published copy, duplicate slugs, and unsafe slugs fail validation", () => {
  assert.throws(() => publishedProjects([fixture({ actions: [] })]), /complete factual copy/);
  assert.throws(() => publishedProjects([fixture(), fixture()]), /duplicate/);
  assert.throws(() => publishedProjects([fixture({ slug: "../draft" })]), /Invalid/);
});

test("metrics need context and media needs dimensions, alt text, and captions", () => {
  assert.throws(() => publishedProjects([fixture({ metrics: [{ value: "12", label: "Responses", context: "" }] })]), /context/);
  assert.throws(() => publishedProjects([fixture({ hero: { src: "/projects/test.webp", alt: "", width: 800, height: 600, caption: "Test caption", kind: "artifact" } })]), /local media/);
  assert.throws(() => publishedProjects([fixture({ hero: { src: "https://example.com/test.jpg", alt: "Test", width: 800, height: 600, caption: "Test caption", kind: "artifact" } })]), /local media/);
});

function luminance(hex: string): number {
  const channels = hex.slice(1).match(/.{2}/g)!.map(channel => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(first: string, second: string): number {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("project palettes preserve AA normal-text contrast for copy and links", () => {
  for (const [name, palette] of Object.entries(projectThemes)) {
    assert.ok(contrast(palette.background, palette.text) >= 4.5, `${name} body contrast`);
    assert.ok(contrast(palette.background, palette.accent) >= 4.5, `${name} link contrast`);
  }
});
