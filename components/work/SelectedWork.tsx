import { projects } from "@/data/projects";
import { publishedProjects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

export function SelectedWork() {
  const featured = publishedProjects(projects).filter(project => project.featured);
  return <section id="work" className="selected-work" aria-labelledby="work-title"><div className="editorial-heading"><p className="eyebrow">THE THINKING. THE DOING. THE DIFFERENCE.</p><h2 id="work-title" lang="es">La prueba está<br />en el trabajo.</h2><p>The problem, the decisions,<br />and what changed.</p></div>
    {featured.length > 0 ? <div className="project-list">{featured.map((project, index) => <ProjectCard key={project.slug} project={project} number={index + 1} />)}</div> : <p className="work-in-progress">The first story is taking shape. Actual work, in my own words.</p>}
  </section>;
}
