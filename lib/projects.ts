import type { Project } from "../types/project";

export function publishedProjects(projects: readonly Project[]): Project[] {
  const published = projects.filter(project => project.status === "published");
  const slugs = new Set<string>();
  for (const project of published) {
    const fields = [project.title, project.organization, project.year, project.role, project.summary, project.audience];
    const sections = [project.problem, project.insight, project.actions, project.outcome, project.learning];
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) || slugs.has(project.slug)) {
      throw new Error(`Invalid or duplicate published project slug: ${project.slug}`);
    }
    if (fields.some(value => !value.trim()) || !project.disciplines.length || sections.some(section => !section.length || section.some(text => !text.trim()))) {
      throw new Error(`Published project ${project.slug} needs complete factual copy.`);
    }
    for (const media of [project.hero, ...project.artifacts].filter(item => item !== undefined)) {
      if (!media.src.startsWith("/projects/") || !media.alt.trim() || !media.caption.trim() || media.width <= 0 || media.height <= 0) {
        throw new Error(`Project ${project.slug} needs local media with dimensions, alt text, and a caption.`);
      }
    }
    if (project.metrics.some(metric => !metric.value.trim() || !metric.label.trim() || !metric.context.trim())) {
      throw new Error(`Project ${project.slug} needs context for each metric.`);
    }
    slugs.add(project.slug);
  }
  return published;
}

export function findPublishedProject(projects: readonly Project[], slug: string): Project | undefined {
  return publishedProjects(projects).find(project => project.slug === slug);
}
