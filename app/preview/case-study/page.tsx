import type { Metadata } from "next";
import { CaseStudy } from "@/components/work/CaseStudy";
import { Navigation } from "@/components/layout/Navigation";
import { projectTemplate } from "@/content/project-template";

export const metadata: Metadata = { title: "Case study template preview — Kiara", robots: { index: false, follow: false } };

export default function CaseStudyPreview() {
  return <><Navigation onHome={false} /><aside className="template-notice">Template preview — these are writing prompts, not a real project or claims about Kiara’s work.</aside><CaseStudy project={projectTemplate} /></>;
}
