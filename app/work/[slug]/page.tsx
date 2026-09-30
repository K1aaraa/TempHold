import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { publishedProjects, findPublishedProject } from "@/lib/projects";
import { CaseStudy } from "@/components/work/CaseStudy";
import { Navigation } from "@/components/layout/Navigation";

export function generateStaticParams() {
  return publishedProjects(projects).map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = findPublishedProject(projects, (await params).slug);
  if (!project) notFound();
  return { title: `${project.title} — Kiara`, description: project.summary, openGraph: { title: `${project.title} — Kiara`, description: project.summary, type: "article" } };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const published = publishedProjects(projects);
  const project = findPublishedProject(projects, (await params).slug);
  if (!project) notFound();
  const index = published.findIndex(item => item.slug === project.slug);
  const nextProject = published.length > 1 ? published[(index + 1) % published.length] : undefined;
  return <><Navigation onHome={false} /><CaseStudy project={project} nextProject={nextProject} /></>;
}
