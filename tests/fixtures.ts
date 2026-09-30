import type { Project, ProjectMedia } from "@/types/project";
// Synthetic test data, never imported by the website content layer.
export const mediaFixture: ProjectMedia = { src: "/projects/test/artifact.webp", alt: "A test campaign messaging document", width: 1200, height: 800, caption: "Test artifact: audience-specific messaging decisions.", kind: "artifact" };
export function projectFixture(overrides: Partial<Project> = {}): Project {
  return { slug: "test-project", status: "published", featured: true, title: "Test project",
    organization: "Test organization", year: "2026", role: "Test role", disciplines: ["Product marketing", "Community"],
    summary: "A synthetic test summary.", audience: "Test audience", problem: ["The test audience needed clarity."],
    insight: ["The message was too complicated."], actions: ["I simplified the test message."],
    outcome: ["The test audience understood the message."], learning: ["Listen before choosing the words."],
    metrics: [], artifacts: [], theme: "plum", ...overrides };
}
