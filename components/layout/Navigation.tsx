export function Navigation({ onHome = true }: { onHome?: boolean }) {
  const home = onHome ? "" : "/";
  return <header className="navigation"><a className="wordmark" href={`${home}#top`} aria-label="Kiara home">kiara<span aria-hidden="true">✳</span></a><nav aria-label="Main navigation"><a href={`${home}#work`}>Work</a><a href={`${home}#about`}>About</a><a href={`${home}#cultura`}>Cultura <span aria-hidden="true">↗</span></a></nav><span className="nav-note">Culture is context. Connection is the point.</span></header>;
}
