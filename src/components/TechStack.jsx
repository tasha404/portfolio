import { useEffect, useRef, useState } from "react";
import {
  SiReact,
  SiJavascript,
  SiCss,
  SiHtml5,
  SiFirebase,
  SiOpenai,
  SiPython,
  SiCplusplus,
  SiFlutter,
  SiKotlin,
  SiAndroidstudio,
  SiPhp,
  SiDart,
  SiFigma,
  SiNotion,
  SiGithub,
  SiNetlify,
  SiVercel,
  SiOpencv,
  SiArduino,
  SiRaspberrypi,
  SiMysql,
  SiSqlite,
} from "react-icons/si";
import { DiJava } from "react-icons/di";
import { BiLogoVisualStudio } from "react-icons/bi";


const techStack = [
  { icon: <SiReact /> },
  { icon: <SiJavascript /> },
  { icon: <SiHtml5 /> },
  { icon: <SiCss /> },
  { icon: <SiFirebase /> },
  { icon: <SiOpenai /> },
  { icon: <SiPython /> },
  { icon: <SiCplusplus /> },
  { icon: <SiFlutter /> },
  { icon: <SiKotlin /> },
  { icon: <SiAndroidstudio /> },
    { icon: <SiPhp /> },
    { icon: <DiJava /> },
    { icon: <SiDart /> },
    { icon: <SiFigma /> },
    { icon: <SiNotion /> },
    { icon: <SiGithub /> },
    { icon: <SiNetlify /> },
    { icon: <SiVercel /> },
    { icon: <SiOpencv /> },
    { icon: <BiLogoVisualStudio /> },
    { icon: <SiArduino /> },
    { icon: <SiRaspberrypi /> },
    { icon: <SiMysql /> },
    { icon: <SiSqlite /> },
];

export default function TechStack() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(() => {
  return localStorage.getItem("techAnimated") === "true";
});

  // ✅ Generate circle positions ONCE
  const [positions] = useState(() => {
  const minDistance = 8;
  let points = [];

  return techStack.map((_, i) => {
    let x, y;
    let valid = false;

    while (!valid) {
      x = 50 + (Math.random() - 0.5) * 30;
      y = 50 + (Math.random() - 0.5) * 30;

      valid = points.every((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) > minDistance;
      });
    }

    points.push({ x, y });

    return {
      x,
      y,
      delay: `${i * 0.05}s`,
    };
  });
});

  // ✅ Trigger ONCE when visible
  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);   // 🔥 animate in
      } else {
        setActive(false);  // 🔥 reset when leaving
      }
    },
    { threshold: 0.3 }
  );

  if (sectionRef.current) {
    observer.observe(sectionRef.current);
  }

  return () => observer.disconnect();
}, []);

  return (
    <section className="tech-circle" ref={sectionRef}>
      {/* CENTER TEXT */}
      <div className="center-text">TECH STACK</div>

      <div className={`circle-container ${active ? "active" : ""}`}>
        {techStack.map((tech, index) => (
          <div
            key={index}
            className="circle-icon"
            style={{
              "--x": positions[index].x + "%",
              "--y": positions[index].y + "%",
              "--delay": positions[index].delay,
            }}
          >
            {tech.icon}
          </div>
        ))}
      </div>
    </section>
  );
}