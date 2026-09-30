import Link from "next/link";
import type { Project } from "@/types/project";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectTheme } from "./ProjectTheme";

export function ProjectCard({ project, number }: { project: Project; number: number }) {
  return <ProjectTheme theme={project.theme} className="project-card"><article>
    <div className="project-card-meta"><span>{String(number).padStart(2, "0")} / {project.organization}</span><span>{project.year}</span></div>
    <h3><Link href={`/work/${project.slug}`}>{project.title}<span aria-hidden="true"> ↗</span></Link></h3>
    <p className="project-role">My role: {project.role}</p><p>{project.summary}</p>
    <ul className="capabilities">{project.disciplines.map(discipline => <li key={discipline}>{discipline}</li>)}</ul>
    {project.hero && <ProjectMedia media={project.hero} />}
    {project.metrics.length > 0 && <dl className="project-metrics">{project.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}<small>{metric.context}</small></dd></div>)}</dl>}
    <Link className="text-link" href={`/work/${project.slug}`}>Read the story <span aria-hidden="true">→</span></Link>
  </article></ProjectTheme>;
}
