import type { Project } from "@/types/project";

// Editing scaffold, not a claim about Kiara's work. Never publish these prompts.
export const projectTemplate: Project = {
  slug: "your-project-slug",
  status: "draft",
  featured: true,
  title: "A clear title about the change you helped make",
  organization: "Organization or client",
  year: "Year",
  role: "What you personally owned",
  disciplines: ["Choose the relevant disciplines"],
  summary: "In two sentences: the problem, your contribution, and what changed.",
  audience: "Who were you trying to reach? What mattered to them?",
  problem: ["What was happening? What needed to change? Give enough context to understand the stakes."],
  insight: ["What wasn't clicking? What did you notice about the audience, message, or experience?"],
  actions: ["What did you do, and why? Be specific about your decisions. Separate your contribution from the team's."],
  outcome: ["What changed? Use verified results. If there is no quantitative evidence, explain the observed outcome honestly."],
  learning: ["What did this teach you? What would you repeat or approach differently?"],
  metrics: [],
  artifacts: [],
  theme: "plum",
};
