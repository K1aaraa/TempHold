import { Navigation } from "@/components/layout/Navigation";
import { Hero } from "@/components/hero/Hero";
import { StoryPrototype } from "@/components/motion/StoryPrototype";

export default function Home() {
  return (
    <>
      <Navigation />

      <main id="main">
        <Hero />

        <section id="about" className="about">
          <p className="eyebrow">A LITTLE MORE ABOUT ME</p>

          <div>
            <h2 lang="es">Hola, soy Kiara.</h2>
            <p className="about-positioning">
              Multicultural marketer.
              <br />
              Community builder.
              <br />
              <em>People person, siempre.</em>
            </p>
          </div>

          <p className="about-copy">
            As a first-gen Mexican-American, storytelling has always been more
            than content — it’s connection. Whether I’m helping launch a product,
            shape a brand story, or build a community program, I care about making
            the work clear, useful, culturally aware, and genuinely human.
          </p>

          <span className="about-note" lang="es">
            con intención ↗
          </span>
        </section>

        <StoryPrototype />

        <section className="review">
          <p className="eyebrow">NEXT UP / THE RECEIPTS</p>
          <h2>
            The ideas matter.
            <br />
            <em>So does the proof.</em>
          </h2>
          <p>
            The next chapter is the work itself: launches, campaigns, community
            programs, the decisions behind them, and the outcomes I can stand behind.
          </p>
          <a href="#top">
            Back to the beginning <span aria-hidden="true">↑</span>
          </a>
        </section>
      </main>

      <footer>
        <a className="wordmark" href="#top">
          kiara<span aria-hidden="true">✳</span>
        </a>
        <p>Marketing con sazón. Strategy with people at the center.</p>
        <span>PORTFOLIO / IN PROGRESS</span>
      </footer>
    </>
  );
}
