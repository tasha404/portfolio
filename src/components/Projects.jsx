import { useEffect, useRef } from "react";
import {
  SiOpencv, SiJavascript, SiCss, SiReact, SiHtml5,
  SiFirebase, SiOpenai, SiCplusplus, SiRaspberrypi,
  SiFlutter, SiKotlin, SiAndroidstudio, SiPython,
} from "react-icons/si";

const projects = [
  {
    title: "BunnyDo !",
    description: "A cute and interactive to-do list web app making task management fun — clean UI, smooth interactions, user-friendly task organisation.",
    image: "/images/bunnydo.png",
    link: "https://bunnydo.vercel.app/",
    status: "COMPLETED",
    tech: [{ icon: <SiFirebase />, name: "Firebase" }, { icon: <SiReact />, name: "React" }, { icon: <SiJavascript />, name: "JavaScript" }, { icon: <SiCss />, name: "CSS" }, { icon: <SiHtml5 />, name: "HTML5" }],
  },
  {
    title: "Peachy Pixels",
    description: "A web-based image editing platform inspired by Photoshop, offering intuitive tools and a modern interface to enhance creativity.",
    image: "/images/peachypixels.png",
    link: "https://peachypixels.vercel.app/",
    status: "ONGOING",
    tech: [{ icon: <SiReact />, name: "React" }, { icon: <SiJavascript />, name: "JavaScript" }, { icon: <SiCss />, name: "CSS" }, { icon: <SiHtml5 />, name: "HTML5" }],
  },
  {
    title: "KiinAI",
    description: "AI-powered chatbot using the OpenAI API — built to assist with tasks, questions, and productivity in a clean interactive interface.",
    image: "/images/kiinai.png",
    link: "https://kiinai.vercel.app/",
    status: "ONGOING",
    tech: [{ icon: <SiOpenai />, name: "OpenAI" }, { icon: <SiFirebase />, name: "Firebase" }, { icon: <SiReact />, name: "React" }, { icon: <SiJavascript />, name: "JavaScript" }],
  },
  {
    title: "Path Raiders",
    description: "A pathfinding visualiser that brings algorithms to life through interactive, animated step-by-step demonstrations.",
    image: "/images/pathraiders.png",
    link: "https://path-raiders.vercel.app/",
    status: "COMPLETED",
    tech: [{ icon: <SiPython />, name: "Python" }, { icon: <SiCss />, name: "CSS" }, { icon: <SiHtml5 />, name: "HTML5" }],
  },
  {
    title: "CCTV Stranger Detector",
    description: "AI-powered surveillance system detecting unknown individuals in real-time using computer vision and face recognition.",
    image: null,
    link: "https://your-project-link.com",
    status: "COMPLETED",
    tech: [{ icon: <SiOpencv />, name: "OpenCV" }, { icon: <SiRaspberrypi />, name: "Raspberry Pi" }, { icon: <SiFlutter />, name: "Flutter" }, { icon: <SiCplusplus />, name: "C++" }, { icon: <SiFirebase />, name: "Firebase" }],
  },
  {
    title: "Jump Realm",
    description: "A fast-paced Android platformer where players navigate obstacles while hunted by a relentless boss — testing reflexes and survival.",
    image: null,
    link: "https://www.youtube.com/shorts/GBnp0Fy55JY",
    status: "COMPLETED",
    tech: [{ icon: <SiKotlin />, name: "Kotlin" }, { icon: <SiAndroidstudio />, name: "Android Studio" }],
  },
];

export default function Projects() {
  const ref = useRef(null);
  useEffect(() => {
    const cards = ref.current?.querySelectorAll(".project-card");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    cards?.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="projects" id="projects" ref={ref}>
      <div className="projects-header">
        <div>
          <p className="section-label">Selected work</p>
          <h2>My <em>Projects</em></h2>
        </div>
        <span className="projects-count">{projects.length} projects</span>
      </div>
      <div className="projects-grid">
        {projects.map((project, i) => (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-card fade-up" key={i}>
            <div className="card-image">
              {project.image
                ? <img src={project.image} alt={project.title} />
                : <div className="card-image-placeholder">{project.title}</div>}
              <div className="card-image-overlay" />
            </div>
            <div className="card-arrow">↗</div>
            <div className="card-content">
              <span className={`status ${project.status.toLowerCase() === "completed" ? "completed" : "ongoing"}`}>
                {project.status}
              </span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.tech && (
                <div className="tech-icons">
                  {project.tech.map((t, j) => (
                    <div className="tech-icon" title={t.name} key={j}>{t.icon}</div>
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}