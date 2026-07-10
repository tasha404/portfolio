export default function Hero() {
  

  return (
    <section className="hero">
      <div className="hero-left">

        <p className="hero-eyebrow">Say it, i can build it.</p>
        <h1 className="hero-headline">
          A nerd<br />
          <em>looking for</em><br />
          a job.
        </h1>
        <p className="hero-sub">
          AI systems, web &amp; mobile development, real-time
          technologies — made with care, one project at a time.
        </p>
        <a href="#projects" className="hero-cta">
          See my work <span className="hero-cta-arrow">→</span>
        </a>
      </div>

      <div className="hero-right">
        <div className="hero-image-frame">
          <img src="/images/hero2.png" alt="Natasha Nadia" />
          <span className="hero-tag hero-tag-1">Web Developer</span>
          <span className="hero-tag hero-tag-2">AI &amp; VBA</span>
        </div>
      </div>
    </section>
  );
}