import { FaJava } from "react-icons/fa";
import { SiOpencv, SiJavascript, SiCss, SiReact, SiHtml5, SiFirebase, SiOpenai, SiCplusplus , SiRaspberrypi, SiFlutter, SiKotlin, SiAndroidstudio, SiPython  } from "react-icons/si";

const projects = [
  {
    title: "BunnyDo !",
    description:  "A cute and interactive to-do list web application designed to make task management fun and engaging, featuring a clean UI, smooth interactions, and user-friendly organization of daily tasks.",
    image: "/images/bunnydo.png",
    link: "https://bunnydo.vercel.app/",
    status: "COMPLETED",
    tech: [
      { icon: <SiFirebase />, name: "Firebase" },
      { icon: <SiReact />, name: "React" },
      { icon: <SiJavascript />, name: "JavaScript" },
      { icon: <SiCss />, name: "CSS" },      
      { icon: <SiHtml5 />, name: "HTML5" },
    ],
  },
  {
    title: "Peachy Pixels",
    description:  "A web-based image editing platform inspired by Photoshop, offering intuitive tools and a modern interface built with React and CSS to enhance user creativity and accessibility.",
    image: "/images/peachypixels.png",
    link: "https://peachypixels.vercel.app/",
    status: "ONGOING",
    tech: [
      { icon: <SiReact />, name: "React" },
      { icon: <SiJavascript />, name: "JavaScript" },
      { icon: <SiCss />, name: "CSS" },
      { icon: <SiHtml5 />, name: "HTML5" },
    ],
  },
  {
  title: "KiinAI",
  description:
    "AI-powered chatbot application using OpenAI API, designed to assist users with tasks, questions, and productivity in a clean, interactive interface.",
  image: "/images/kiinai.png",
  link: "https://kiinai.vercel.app/",
  status: "ONGOING",
  tech: [
    { icon: <SiOpenai />, name: "OpenAI API" },
    { icon: <SiFirebase />, name: "Firebase" },
    { icon: <SiReact />, name: "React" },
    { icon: <SiJavascript />, name: "JavaScript" },
  ],
},
{
  title: "Path Raiders",
  description:
    "AI-powered chatbot application using OpenAI API, designed to assist users with tasks, questions, and productivity in a clean, interactive interface.",
  image: "/images/pathraiders.png",
  link: "https://path-raiders.vercel.app/",
  status: "COMPLETED",
  tech: [
    { icon: <SiPython />, name: "Python" },
    { icon: <SiCss />, name: "CSS" },
    { icon: <SiHtml5 />, name: "HTML5" },
  ],
},
{
  title: "CCTV Stranger Detector",
  description:
    "AI-powered surveillance system that detects and identifies unknown individuals in real-time using computer vision and face recognition.",
  link: "https://your-project-link.com", // youtube demo link
  status: "COMPLETED",
  tech: [
    { icon: <SiOpencv />, name: "OpenCV" },
    { icon: <SiRaspberrypi />, name: "Raspberry Pi" },
    { icon: <SiFlutter />, name: "Flutter" },    
    { icon: <SiCplusplus   />, name: "CPP" },
    { icon: <SiFirebase />, name: "Firebase" },
  ],
},
{
    
  title: "Jump Realm",
  description:
  "A fast-paced platformer inspired by classic arcade games, where players navigate obstacles while being chased by a relentless boss that attacks with arrows, testing reflexes, timing, and survival skills.",
  link: "https://www.youtube.com/shorts/GBnp0Fy55JY", // youtube demo link
  status: "COMPLETED",
  tech: [
    { icon: <SiKotlin  />, name: "Kotlin" },
    { icon: <SiAndroidstudio />, name: "Android Studio" },
  ],
}
];

export default function Projects() {
  return (
    <section className="projects">
      <h2>My Projects</h2>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card"
            key={index}
          >
            {/* IMAGE */}
            <div className="card-image">
              <img src={project.image} alt="" />
            </div>

            {/* CONTENT */}
            <div className="card-content">
              <span
  className={`status ${
    project.status.toLowerCase() === "completed"
      ? "completed"
      : "ongoing"
  }`}
>
  {project.status}
</span>

              <h3>{project.title}</h3>
              <p>{project.description}</p>

              {/* TECH ICONS */}
              {project.tech && (
                <div className="tech-icons">
                  {project.tech.map((t, i) => (
                    <div key={i} className="tech-icon">
                      {t.icon}
                    </div>
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