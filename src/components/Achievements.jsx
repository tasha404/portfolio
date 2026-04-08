const achievements = [
  {
    title: "Final Year Project",
    desc: "Developed CCTV Stranger Detector using AI & Computer Vision.",
  },
  {
    title: "AI & Web Developer",
    desc: "Built multiple full-stack apps including AI chatbot & image editor.",
  },
  {
    title: "Mobile App Development",
    desc: "Created Android apps using Kotlin & Flutter.",
  },
  {
    title: "ICT & Workshops",
    desc: "Organized ICT programs and tech workshops for students.",
  },
];

export default function Achievements() {
  return (
    <section className="achievements">
      <h2>Achievements</h2>

      <div className="achievements-grid">
        {achievements.map((item, index) => (
          <div key={index} className="achievement-card">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}