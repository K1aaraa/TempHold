import type { CSSProperties, ReactNode } from "react";
import { projectThemes } from "@/data/themes";
import type { ProjectTheme as Theme } from "@/types/project";

export function ProjectTheme({ theme, children, className = "" }: { theme: Theme; children: ReactNode; className?: string }) {
  const palette = projectThemes[theme];
  const tokens = { "--project-background": palette.background, "--project-text": palette.text, "--project-accent": palette.accent } as CSSProperties;
  return <div className={`project-theme ${className}`} style={tokens}>{children}</div>;
}
