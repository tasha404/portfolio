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
  const [active, setActive] = useState(false);

  // 🔥 CLEAN CIRCLE LAYOUT
  const [positions] = useState(() => {
    const radius = 30;
    const centerX = 50;
    const centerY = 50;

    return techStack.map((_, i) => {
      const angle = (i / techStack.length) * 2 * Math.PI;

      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        delay: `${i * 0.05}s`,
        scale: 0.85 + Math.random() * 0.3,
      };
    });
  });

  // 👀 SCROLL ANIMATION
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
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
              "--scale": positions[index].scale,
            }}
          >
            {tech.icon}
          </div>
        ))}
      </div>
    </section>
  );
}