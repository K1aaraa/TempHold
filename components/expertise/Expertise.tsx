import { expertise } from "@/data/expertise";

export function Expertise() {
  return (
    <section id="expertise" className="expertise" aria-labelledby="expertise-title">
      <div className="editorial-heading"><p className="eyebrow">STRATEGY, WITH PEOPLE AT THE CENTER</p><h2 id="expertise-title" lang="es">Lo que hago.</h2><p>Different ways in.<br />One thread: connection.</p></div>
      <div className="expertise-list">{expertise.map(item => <article className="expertise-item" key={item.number}>
        <span className="expertise-number" aria-hidden="true">{item.number}</span>
        <div><h3>{item.title}</h3><p className="expertise-question">{item.question}</p></div>
        <div><p className="expertise-description">{item.description}</p><ul className="capabilities" aria-label={`${item.title} capabilities`}>{item.capabilities.map(capability => <li key={capability}>{capability}</li>)}</ul></div>
      </article>)}</div>
    </section>
  );
}
