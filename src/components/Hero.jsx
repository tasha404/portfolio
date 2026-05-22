export default function Hero() {
  const today = new Date().toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="hero-date">{today}</span>
        <p className="hero-eyebrow">CS Student &amp; Developer</p>
        <h1 className="hero-headline">
          Building<br />
          <em>intelligent</em><br />
          things.
        </h1>
        <p className="hero-sub">
          AI systems, web &amp; mobile development, real-time
          technologies — made with care, one project at a time.
        </p>
        <a href="#about" className="hero-cta">
          See my work <span className="hero-cta-arrow">→</span>
        </a>
        <div className="hero-scroll">
          <span className="scroll-line" />
          scroll to explore
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-image-frame">
          <img src="/images/hero.png" alt="Natasha Nadia" />
          <span className="hero-tag hero-tag-1">Web Developer</span>
          <span className="hero-tag hero-tag-2">AI &amp; CV</span>
        </div>
      </div>
    </section>
  );
}