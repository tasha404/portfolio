import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import Postcards from "./pages/Postcards";

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
      <Navbar page={page} setPage={setPage} />
      {page === "home" ? (
        <>
          <Hero />
          <About />
          <Projects />
          <TechStack />
          <footer>

            <span className="footer-copy">© 2026 — All rights reserved</span>
          </footer>
        </>
      ) : (
        <Postcards />
      )}
    </>
  );
}