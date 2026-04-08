export default function About() {
  return (
    <section className="about">

      {/* LEFT SIDE */}
      <div className="about-left">
        <h1>
          Hello,<br />
          I’m Natasha !
        </h1>

        <p>
          I am a Computer Science student specializing in AI systems,
          web applications, and real-time surveillance solutions.
        </p>

        <a
          href="https://www.linkedin.com/in/ntashanadia"
          target="_blank"
          className="about-btn"
        >
          linkedin.com/in/ntashanadia
        </a>

        {/* ✅ ACHIEVEMENTS */}
<div className="about-achievements">
  <h3>Achievements & Certifications</h3>

  <div className="achievements-grid">
    
    <div className="achievement-card">
      <span className="achievement-tag">DEAN'S LIST</span>
      <h4>Semester 2</h4>
      <p>
        GPA: 3.55 / 4.00
      </p>
    </div>

    <div className="achievement-card">
      <span className="achievement-tag">DEAN'S LIST</span>
      <h4>Semester 3</h4>
      <p>
        GPA: 3.95 / 4.00
      </p>
    </div>

    <div className="achievement-card">
      <span className="achievement-tag">DEAN'S LIST</span>
      <h4>Semester 5</h4>
      <p>
        GPA: 3.75 / 4.00
      </p>
    </div>

    <div className="achievement-card">
      <span className="achievement-tag">DEAN'S LIST</span>
      <h4>Semester 6</h4>
      <p>
        GPA: 3.65 / 4.00
      </p>
    </div>

    <div className="achievement-card">
      <span className="achievement-tag">DEAN'S LIST</span>
      <h4>Semester 8</h4>
      <p>
        GPA: 3.89 / 4.00
      </p>
    </div>

    <div className="achievement-card">
      <span className="achievement-tag">CERTIFICATION</span>
      <h4>MUET</h4>
      <p>
        Band : 4.0
      </p>
    </div>

  </div>
</div>
      </div>

      {/* RIGHT SIDE */}
      <div className="about-right">

        {/* IMAGE CARD */}
        <div className="about-card">
          <img src="/images/hero.png" alt="profile" />

          <div className="tag tag-date">Web Developer</div>
          <div className="tag tag-role">Mobile Developer</div>

          <div className="contact-box">
            <h3>Contact</h3>
            <p>Klang, Malaysia</p>
            <p>natashanadiafsm@gmail.com</p>
            <p>+60 14 336 1244</p>
          </div>
        </div>

      </div>
    </section>
  );
}