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
      <span className="achievement-tag">FYP</span>
      <h4>CCTV Stranger Detector</h4>
      <p>
        Final Year Project using AI & Computer Vision for real-time surveillance detection.
      </p>
    </div>

    <div className="achievement-card">
      <span className="achievement-tag">Certification</span>
      <h4>AI & Machine Learning</h4>
      <p>
        Completed certification covering machine learning fundamentals and AI applications.
      </p>
    </div>

    <div className="achievement-card">
      <span className="achievement-tag">Workshop</span>
      <h4>ICT Program Organizer</h4>
      <p>
        Organized and conducted ICT workshops for students aged 8–12.
      </p>
    </div>

    <div className="achievement-card">
      <span className="achievement-tag">Development</span>
      <h4>Full-Stack Projects</h4>
      <p>
        Built multiple applications including AI chatbot, image editor, and task manager.
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