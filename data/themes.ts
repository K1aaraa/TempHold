import type { ProjectTheme } from "@/types/project";

// Each project owns its palette; typography and reading structure stay consistent.
// Background/text and background/accent pairs meet WCAG AA for normal text.
export const projectThemes: Record<ProjectTheme, { background: string; text: string; accent: string }> = {
  paper: { background: "#f4f0e7", text: "#22221f", accent: "#a32d20" },
  ink: { background: "#22221f", text: "#f4f0e7", accent: "#f0c365" },
  plum: { background: "#eee5ec", text: "#372536", accent: "#734366" },
  moss: { background: "#e8ece2", text: "#24332a", accent: "#42623f" },
};
