import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import Terminal from "./components/Terminal";
import EasterEggs from "./components/EasterEggs";
import Postcards from "./pages/Postcards";
import Contact from "./pages/Contact";
import CalendarPage from "./pages/Calendar";
import BooksPage from "./pages/Books";
import MoviesPage from "./pages/Movies";

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
        </>
      )}

      {page === "postcards" && <Postcards />}
      {page === "contact"   && <Contact />}
      {page === "calendar"  && <CalendarPage />}
      {page === "books"     && <BooksPage />}
      {page === "movies"    && <MoviesPage />}

      <footer>
        <span className="footer-copy">
          © 2026 — All rights reserved
          {" · "}
          <span className="footer-secret" data-easter-egg="labs" title="👀">404</span>
        </span>
      </footer>

      <Terminal />
    </>
  );
}