import Link from "next/link";
import type { Project } from "@/types/project";
import { ProjectMedia } from "./ProjectMedia";
import { ProjectTheme } from "./ProjectTheme";

function Chapter({ number, title, paragraphs, children }: { number: string; title: string; paragraphs: string[]; children?: React.ReactNode }) {
  return <section className="case-chapter"><div className="chapter-heading"><span className="eyebrow">{number}</span><h2>{title}</h2></div><div className="chapter-body">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{children}</div></section>;
}

export function CaseStudy({ project, nextProject }: { project: Project; nextProject?: Project }) {
  return <ProjectTheme theme={project.theme} className="case-study"><main id="main">
    <header className="case-hero"><Link className="text-link" href="/#work">← Back to the work</Link><p className="eyebrow">{project.organization} / {project.year}</p><h1>{project.title}</h1><p className="case-summary">{project.summary}</p><dl className="case-facts"><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>The disciplines</dt><dd>{project.disciplines.join(" · ")}</dd></div><div><dt>The people</dt><dd>{project.audience}</dd></div></dl></header>
    {project.hero && <div className="case-hero-media"><ProjectMedia media={project.hero} hero /></div>}
    <div className="case-chapters">
      <Chapter number="01 / THE PROBLEM" title="Here was the problem." paragraphs={project.problem} />
      <Chapter number="02 / THE INSIGHT" title="Here’s what wasn’t clicking." paragraphs={project.insight} />
      <Chapter number="03 / THE DECISIONS" title="Here’s what I did." paragraphs={project.actions}>{project.artifacts.length > 0 && <div className="artifact-gallery">{project.artifacts.map(media => <ProjectMedia media={media} key={media.src} />)}</div>}</Chapter>
      <Chapter number="04 / THE OUTCOME" title="Here’s what changed." paragraphs={project.outcome}>{project.metrics.length > 0 && <dl className="project-metrics">{project.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}<small>{metric.context}</small></dd></div>)}</dl>}</Chapter>
      <Chapter number="05 / THE TAKEAWAY" title="Here’s what I learned." paragraphs={project.learning} />
    </div>
    <div className="case-next">{nextProject ? <><p className="eyebrow">ANOTHER WAY TO SEE THE THINKING</p><Link href={`/work/${nextProject.slug}`}>{nextProject.title} <span aria-hidden="true">→</span></Link></> : <Link className="text-link" href="/#work">Back to selected work →</Link>}</div>
  </main></ProjectTheme>;
}
