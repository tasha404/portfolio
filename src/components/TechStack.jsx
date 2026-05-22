import { useEffect, useRef } from "react";
import {
  SiReact, SiJavascript, SiCss, SiHtml5, SiFirebase,
  SiOpenai, SiPython, SiCplusplus, SiFlutter, SiKotlin,
  SiAndroidstudio, SiPhp, SiDart, SiFigma, SiNotion,
  SiGithub, SiNetlify, SiVercel, SiOpencv, SiArduino,
  SiRaspberrypi, SiMysql, SiSqlite,
} from "react-icons/si";
import { DiJava } from "react-icons/di";
import { BiLogoVisualStudio } from "react-icons/bi";

const categories = [
  { label: "Frontend", items: [{ icon: <SiHtml5 />, name: "HTML5" }, { icon: <SiCss />, name: "CSS3" }, { icon: <SiJavascript />, name: "JavaScript" }, { icon: <SiReact />, name: "React" }] },
  { label: "Backend & DB", items: [{ icon: <SiFirebase />, name: "Firebase" }, { icon: <SiPhp />, name: "PHP" }, { icon: <SiMysql />, name: "MySQL" }, { icon: <SiSqlite />, name: "SQLite" }] },
  { label: "AI & Systems", items: [{ icon: <SiOpenai />, name: "OpenAI" }, { icon: <SiOpencv />, name: "OpenCV" }, { icon: <SiPython />, name: "Python" }, { icon: <SiCplusplus />, name: "C++" }, { icon: <SiArduino />, name: "Arduino" }, { icon: <SiRaspberrypi />, name: "Raspberry Pi" }] },
  { label: "Mobile", items: [{ icon: <SiFlutter />, name: "Flutter" }, { icon: <SiKotlin />, name: "Kotlin" }, { icon: <SiDart />, name: "Dart" }, { icon: <DiJava />, name: "Java" }, { icon: <SiAndroidstudio />, name: "Android Studio" }] },
  { label: "Design & Tools", items: [{ icon: <SiFigma />, name: "Figma" }, { icon: <SiNotion />, name: "Notion" }, { icon: <BiLogoVisualStudio />, name: "VS Code" }, { icon: <SiGithub />, name: "GitHub" }] },
  { label: "Deploy", items: [{ icon: <SiVercel />, name: "Vercel" }, { icon: <SiNetlify />, name: "Netlify" }] },
];

export default function TechStack() {
  const ref = useRef(null);
  useEffect(() => {
    const cards = ref.current?.querySelectorAll(".tech-category");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    cards?.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="tech-section" ref={ref}>
      <div className="tech-blob tech-blob-1" />
      <div className="tech-blob tech-blob-2" />
      <div className="tech-header">
        <p className="section-label">Tools I use</p>
        <div className="tech-title">Tech <em>Stack</em></div>
      </div>
      <div className="tech-grid-wrap">
        <div className="tech-categories">
          {categories.map((cat, i) => (
            <div className="tech-category fade-up" key={i}>
              <p className="tech-category-label">{cat.label}</p>
              <div className="tech-icons-group">
                {cat.items.map((item, j) => (
                  <div className="tech-pill" key={j}>
                    <span style={{ fontSize: 13, display: "flex" }}>{item.icon}</span>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}