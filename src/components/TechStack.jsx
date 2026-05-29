import { useEffect, useRef } from "react";

const categories = [
  {
    label: "Frontend",
    items: ["HTML5", "CSS3", "JavaScript", "React"],
    style: { left: "0%", top: "20px", width: "210px", transform: "rotate(-1.5deg)", zIndex: 6 },
    pin: "pin-left pin-rose",
    bg: "var(--paper)",
    accent: "tape",
  },
  {
    label: "Backend & DB",
    items: ["Firebase", "PHP", "MySQL", "SQLite"],
    style: { left: "32%", top: "0px", width: "200px", transform: "rotate(1.8deg)", zIndex: 5 },
    pin: null,
    bg: "#f7f1e8",
    accent: "tape",
  },
  {
    label: "AI & Systems",
    items: ["OpenAI", "OpenCV", "Python", "C++", "Arduino", "Raspberry Pi"],
    style: { right: "2%", top: "10px", width: "230px", transform: "rotate(-2.3deg)", zIndex: 7 },
    pin: "pin-right pin-slate",
    bg: "#f2ece2",
    accent: "pin",
  },
  {
    label: "Mobile",
    items: ["Flutter", "Kotlin", "Dart", "Java", "Android Studio"],
    style: { left: "4%", top: "240px", width: "220px", transform: "rotate(2.1deg)", zIndex: 6 },
    pin: null,
    bg: "#fbf6ef",
    accent: "tape",
  },
  {
    label: "Design & Tools",
    items: ["Figma", "Notion", "VS Code", "GitHub"],
    style: { left: "34%", top: "200px", width: "195px", transform: "rotate(-1deg)", zIndex: 5 },
    pin: "pin-center pin-cream",
    bg: "#f5efe6",
    accent: "pin",
  },
  {
    label: "Deploy",
    items: ["Vercel", "Netlify"],
    style: { right: "3%", top: "290px", width: "170px", transform: "rotate(1.5deg)", zIndex: 4 },
    pin: "pin-right pin-ink",
    bg: "#f0e9de",
    accent: "pin",
  },
];

export default function TechStack() {
  const ref = useRef(null);

  useEffect(() => {
    const cards = ref.current?.querySelectorAll(".sticky");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.08 }
    );
    cards?.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="tech-section" ref={ref}>
      <div className="tech-blob tech-blob-1" />
      <div className="tech-blob tech-blob-2" />

      <div className="tech-header">
      
        <div className="tech-title">
          Tech <em>Stack</em>
        </div>
      </div>

      <div className="collage-board">
        {/* faint background serif word */}
        <span className="collage-bg-text">tools</span>

        {/* decorative vertical rule */}
        <div className="collage-rule" />

        {/* handwritten annotation */}
        <div className="collage-note collage-note-top">
          the things that keep me sane ✦
        </div>

        {categories.map((cat, i) => (
          <div
            className="sticky fade-up"
            key={i}
            style={{ ...cat.style, background: cat.bg }}
          >
            {/* tape or pin attachment */}
            {cat.accent === "tape" && <div className="sticky-tape" />}
            {cat.pin && <div className={`sticky-pin ${cat.pin}`} />}

            <p className="sticky-label">{cat.label}</p>
            <div className="sticky-pills">
              {cat.items.map((item, j) => (
                <span className="sticky-pill" key={j}>
                  <span className="pill-dot" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* bottom annotation */}
        <div className="collage-note collage-note-bottom">
          always learning, always adding →
        </div>

        <span className="collage-byline">© Natasha Nadia</span>
      </div>
    </section>
  );
}