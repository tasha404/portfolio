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
          href="https://www.linkedin.com/in/natasha"
          target="_blank"
          className="about-btn"
        >
          linkedin.com/in/natasha
        </a>
      </div>

      {/* RIGHT SIDE */}
      <div className="about-right">

        {/* IMAGE CARD */}
        <div className="about-card">
          <img src="/images/hero.png" alt="profile" />

          {/* TAGS */}
          <div className="tag tag-date">2003</div>
          <div className="tag tag-role">Mobile Developer</div>

          {/* CONTACT BOX */}
          <div className="contact-box">
            <h3>Contact</h3>
            <p>Malaysia</p>
            <p>natashanadiafsm@gmail.com</p>
            <p>+60 14 336 1244</p>
            <p>GitHub: tasha404</p>
          </div>
        </div>

      </div>
    </section>
  );
}