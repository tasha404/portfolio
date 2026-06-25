import { useEffect, useRef, useCallback } from "react";
import {
  SiOpencv, SiJavascript, SiCss, SiReact, SiHtml5,
  SiFirebase, SiOpenai, SiCplusplus, SiRaspberrypi,
  SiFlutter, SiKotlin, SiAndroidstudio, SiPython,
} from "react-icons/si";

const projects = [
  {
    title: "BunnyDo !",
    description: "A cute interactive to-do list web app making task management fun — clean UI, smooth interactions, user-friendly task organisation.",
    image: "/images/bunnydo.png",
    link: "https://bunnydo.vercel.app/",
    status: "COMPLETED",
    accentColor: "#c87c78",
    thumbnail: { emoji: "🐰", bg: "linear-gradient(135deg, #ffe4e1 0%, #ffd6d4 60%, #ffbcb8 100%)", label: "task app" },
    tech: [
      { icon: <SiFirebase />, name: "Firebase" },
      { icon: <SiReact />, name: "React" },
      { icon: <SiJavascript />, name: "JS" },
      { icon: <SiCss />, name: "CSS" },
      { icon: <SiHtml5 />, name: "HTML5" },
    ],
  },
  {
    title: "Peachy Pixels",
    description: "A web-based image editing platform inspired by Photoshop, offering intuitive tools and a modern interface to enhance creativity.",
    image: "/images/peachypixels.png",
    link: "https://peachypixels.vercel.app/",
    status: "ONGOING",
    accentColor: "#d4956a",
    thumbnail: { emoji: "🍑", bg: "linear-gradient(135deg, #fde8d8 0%, #fad5b5 60%, #f5bc8c 100%)", label: "image editor" },
    tech: [
      { icon: <SiReact />, name: "React" },
      { icon: <SiJavascript />, name: "JS" },
      { icon: <SiCss />, name: "CSS" },
      { icon: <SiHtml5 />, name: "HTML5" },
    ],
  },
  {
    title: "KiinAI",
    description: "AI-powered chatbot using the OpenAI API — built to assist with tasks, questions, and productivity in a clean interactive interface.",
    image: "/images/kiinai.png",
    link: "https://kiinai.vercel.app/",
    status: "COMPLETED",
    accentColor: "#7a8fa6",
    thumbnail: { emoji: "🤖", bg: "linear-gradient(135deg, #dce8f0 0%, #c4d9e8 60%, #a8c4d8 100%)", label: "AI chatbot" },
    tech: [
      { icon: <SiOpenai />, name: "OpenAI" },
      { icon: <SiFirebase />, name: "Firebase" },
      { icon: <SiReact />, name: "React" },
      { icon: <SiJavascript />, name: "JS" },
    ],
  },
  {
    title: "Path Raiders",
    description: "A pathfinding visualiser bringing algorithms to life through interactive, animated step-by-step demonstrations.",
    image: "/images/pathraiders.png",
    link: "https://path-raiders.vercel.app/",
    status: "COMPLETED",
    accentColor: "#6e8c6a",
    thumbnail: { emoji: "🗺️", bg: "linear-gradient(135deg, #d8ecd6 0%, #bfd9bb 60%, #9fc49a 100%)", label: "visualiser" },
    tech: [
      { icon: <SiPython />, name: "Python" },
      { icon: <SiCss />, name: "CSS" },
      { icon: <SiHtml5 />, name: "HTML5" },
    ],
  },
  {
    title: "CCTV Stranger Detector",
    description: "AI-powered surveillance system detecting unknown individuals in real-time using computer vision and face recognition.",
    image: null,
    link: null,
    status: "COMPLETED",
    accentColor: "#8a6a9a",
    thumbnail: {  bg: "linear-gradient(135deg, #e8daf0 0%, #d4c0e4 60%, #bfa0d4 100%)", label: "CV · IoT" },
    tech: [
      { icon: <SiOpencv />, name: "OpenCV" },
      { icon: <SiRaspberrypi />, name: "Pi" },
      { icon: <SiFlutter />, name: "Flutter" },
      { icon: <SiCplusplus />, name: "C++" },
      { icon: <SiFirebase />, name: "Firebase" },
    ],
  },
  {
    title: "Jump Realm",
    description: "A fast-paced Android platformer where players navigate obstacles while hunted by a relentless boss — testing reflexes and survival.",
    image: null,
    link: "https://www.youtube.com/shorts/GBnp0Fy55JY",
    status: "COMPLETED",
    accentColor: "#b0804e",
    thumbnail: { bg: "linear-gradient(135deg, #f0e0c8 0%, #e4ccaa 60%, #d4b080 100%)", label: "android game" },
    tech: [
      { icon: <SiKotlin />, name: "Kotlin" },
      { icon: <SiAndroidstudio />, name: "Android" },
    ],
  },
];

/* ── 3-D tilt on mouse move ── */
function useTilt(ref) {
  const handleMove = useCallback((e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.03)`;
    card.style.setProperty("--glow-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--glow-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, [ref]);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, [ref]);

  return { handleMove, handleLeave };
}

/* ── Project thumbnail ── */
function Thumbnail({ project }) {
  // Prefer real screenshot if available
  if (project.image) {
    return (
      <div className="pcard-thumb">
        <img src={project.image} alt={project.title} className="pcard-img" loading="lazy" />
        <div className="pcard-img-overlay" style={{ "--accent": project.accentColor }} />
      </div>
    );
  }
  // Generated thumbnail for projects without screenshots
  return (
    <div className="pcard-thumb pcard-thumb-gen" style={{ background: project.thumbnail.bg }}>
      <span className="pcard-thumb-emoji">{project.thumbnail.emoji}</span>
      <span className="pcard-thumb-label">{project.thumbnail.label}</span>
      <div className="pcard-thumb-grid" />
    </div>
  );
}

/* ── Single card ── */
function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const { handleMove, handleLeave } = useTilt(cardRef);

  const Wrapper = project.link ? "a" : "div";
  const wrapperProps = project.link
    ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      ref={cardRef}
      className="pcard fade-up"
      style={{ "--accent": project.accentColor, animationDelay: `${index * 0.07}s` }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* glow layer */}
      <div className="pcard-glow" />

      <Thumbnail project={project} />

      <div className="pcard-body">
        <div className="pcard-meta">
          <span className={`pcard-status ${project.status.toLowerCase()}`}>{project.status}</span>
          {project.link && <span className="pcard-arrow">↗</span>}
        </div>
        <h3 className="pcard-title">{project.title}</h3>
        <p className="pcard-desc">{project.description}</p>

        {project.tech && (
          <div className="pcard-tech">
            {project.tech.map((t, j) => (
              <span className="pcard-tech-chip" key={j} title={t.name}>
                <span className="pcard-tech-icon">{t.icon}</span>
                <span className="pcard-tech-name">{t.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

/* ── Projects section ── */
export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.06 }
    );
    cards?.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="projects-header fade-up">
        <div>
          
          <h2>My <em>Projects</em></h2>
        </div>
        <span className="projects-count">{projects.length} projects</span>
      </div>

      <div className="pcard-grid">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}