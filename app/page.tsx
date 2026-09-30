import { Navigation } from "@/components/layout/Navigation";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Expertise } from "@/components/expertise/Expertise";
import { SelectedWork } from "@/components/work/SelectedWork";
import { StoryPrototype } from "@/components/motion/StoryPrototype";

export default function Home() {
  return <><Navigation /><main id="main"><Hero /><About /><Expertise /><SelectedWork /><StoryPrototype /></main><footer><a className="wordmark" href="#top">kiara<span aria-hidden="true">✳</span></a><p>Marketing con sazón. Strategy with people at the center.</p><span>PORTFOLIO / IN PROGRESS</span></footer></>;
}
