export type ProjectMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  kind: "photography" | "artifact";
};

export type ProjectTheme = "paper" | "ink" | "plum" | "moss";

export type Project = {
  slug: string;
  status: "draft" | "published";
  featured: boolean;
  title: string;
  organization: string;
  year: string;
  role: string;
  disciplines: string[];
  summary: string;
  audience: string;
  problem: string[];
  insight: string[];
  actions: string[];
  outcome: string[];
  learning: string[];
  metrics: { value: string; label: string; context: string }[];
  hero?: ProjectMedia;
  artifacts: ProjectMedia[];
  theme: ProjectTheme;
};
