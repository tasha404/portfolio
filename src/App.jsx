import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";       // ← enhanced version
import TechStack from "./components/TechStack";
import Terminal from "./components/Terminal";         // ← NEW
import EasterEggs from "./components/EasterEggs";    // ← NEW
import Postcards from "./pages/Postcards";
import Contact from "./pages/Contact";

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
      if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px"; }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (<><div className="cursor-dot" ref={dot} /><div className="cursor-ring" ref={ring} /></>);
}

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <Cursor />
      <EasterEggs />     
      <Navbar page={page} setPage={setPage} />

      {page === "home" && (
        <>
          <Hero />
          <About />
          <Projects />
          <TechStack />
          <footer>
            {/* "© 2026" is a hidden easter egg trigger */}
            <span className="footer-copy">
              © 2026 — All rights reserved
              {" · "}
              <span
                className="footer-secret"
                data-easter-egg="labs"
                title="👀"
              >
                404
              </span>
            </span>
          </footer>
        </>
      )}

      {page === "postcards" && <Postcards />}
      {page === "contact" && <Contact />}

      {/* Terminal floats on every page */}
      <Terminal />
    </>
  );
}