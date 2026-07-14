import { useEffect, useRef } from "react";
import ciscoBadge from "../images/cisco-badge.png";

const achievements = [
  { tag: "Dean's List", title: "Semester 2", detail: "GPA 3.55 / 4.00" },
  { tag: "Dean's List", title: "Semester 3", detail: "GPA 3.95 / 4.00" },
  { tag: "Dean's List", title: "Semester 5", detail: "GPA 3.75 / 4.00" },
  { tag: "Dean's List", title: "Semester 6", detail: "GPA 3.65 / 4.00" },
  { tag: "Dean's List", title: "Semester 8", detail: "GPA 3.89 / 4.00" },
  { tag: "Certification", title: "MUET", detail: "Band 4.0" },
];

export default function About() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.1 }
    );
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about-left">
        <h2 className="about-headline fade-up">Hello,<br />I'm <em>Natasha!</em></h2>
        <p className="about-body fade-up">
          I'm a Computer Science student driven to build intelligent, scalable,
          and user-centered digital solutions. With experience in{" "}
          <strong>AI systems, web and mobile development, and real-time technologies</strong>,
          I continuously strive to grow with every project I take on.
        </p>
        <a href="https://www.linkedin.com/in/ntashanadia" target="_blank" rel="noopener noreferrer" className="about-link fade-up">
          linkedin.com/in/ntashanadia
        </a>
        <div className="about-achievements">
          <h3>Achievements &amp; Certifications</h3>
          <div className="achievements-grid">
            {achievements.map((a, i) => (
              <div className="achievement-card fade-up" key={i}>
                <span className="achievement-tag">{a.tag}</span>
                <h4>{a.title}</h4>
                <p>{a.detail}</p>
              </div>
            ))}
          </div>

          <a
            href="https://www.credly.com/badges/b9f18032-1d94-427b-8044-07a955531b5f"
            target="_blank"
            rel="noopener noreferrer"
            className="credly-badge fade-up"
          >
            <img src={ciscoBadge} alt="Cisco Certified" />
            <div className="credly-badge-text">
              <span className="credly-badge-verify">CISCO</span>
              <span className="credly-badge-title">Introduction to IoT and Digital Transformation</span>
            </div>
          </a>
        </div>
      </div>
      <div className="about-right">
        <div className="about-card">
          <img src="/images/hero.png" alt="Natasha Nadia" />
          <div className="about-contact">
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
