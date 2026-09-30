import Image from "next/image";
import { about } from "@/data/about";

export function About() {
  return (
    <section id="about" className="about personal-about" aria-labelledby="about-title">
      <p className="eyebrow">THE PERSON BEHIND THE PERSPECTIVE</p>
      <div>
        <h2 id="about-title" lang="es">{about.title}</h2>
        <p className="about-positioning">{about.identity[0]}<br />{about.identity[1]}<br /><em>{about.identity[2]}</em></p>
        <p className="about-connection">{about.connection}</p>
      </div>
      <div className="about-perspective">
        {about.portrait && <figure className="personal-photo"><Image src={about.portrait.src} alt={about.portrait.alt} width={about.portrait.width} height={about.portrait.height} sizes="(max-width: 899px) 90vw, 30vw" /><figcaption>{about.portrait.caption}</figcaption></figure>}
        <p className="about-copy">{about.viewpoint}</p>
      </div>
      <span className="about-note" lang="es">con intención ↗</span>
    </section>
  );
}
