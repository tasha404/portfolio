import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Navbar({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function goTo(targetPage, sectionId) {
    setMenuOpen(false);
    setPage(targetPage);
    if (sectionId) {
      setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      window.scrollTo(0, 0);
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-name" style={{ cursor: "pointer" }} onClick={() => goTo("home")}>
          Natasha <span>Nadia</span>
        </div>

        <div className="nav-right">
       
          <a className="nav-link" href="#postcards" onClick={(e) => { e.preventDefault(); goTo("postcards"); }} style={{ color: page === "postcards" ? "var(--hot)" : undefined }}>Postcards</a>
          <a className="nav-link" href="#diary" onClick={(e) => { e.preventDefault(); goTo("calendar"); }} style={{ color: page === "calendar" ? "var(--hot)" : undefined }}>Diary</a>
          <a className="nav-link" href="#books" onClick={(e) => { e.preventDefault(); goTo("books"); }} style={{ color: page === "books" ? "var(--hot)" : undefined }}>Books</a>
          <a className="nav-link" href="#movies" onClick={(e) => { e.preventDefault(); goTo("movies"); }} style={{ color: page === "movies" ? "var(--hot)" : undefined }}>Movies</a>
          <a className="nav-link" href="#contact" onClick={(e) => { e.preventDefault(); goTo("contact"); }} style={{ color: page === "contact" ? "var(--hot)" : undefined }}>Contact</a>
          <div className="nav-icons">
            <a href="https://github.com/tasha404" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="https://www.linkedin.com/in/ntashanadia" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://instagram.com/tasha404.exe" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>

        <button className={`nav-hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`nav-drawer${menuOpen ? " open" : ""}`}>
        <div className="nav-drawer-links">
         <a className="nav-drawer-link" onClick={() => goTo("home", "about")} href="#about">About</a>
          <a className="nav-drawer-link" onClick={() => goTo("home", "projects")} href="#projects">Projects</a>
          <a className="nav-drawer-link" onClick={() => goTo("postcards")} href="#postcards" style={{ color: page === "postcards" ? "var(--hot)" : undefined }}>Postcards</a>
          <a className="nav-drawer-link" onClick={() => goTo("calendar")} href="#diary" style={{ color: page === "calendar" ? "var(--hot)" : undefined }}>Diary</a>
          <a className="nav-drawer-link" onClick={() => goTo("books")} href="#books" style={{ color: page === "books" ? "var(--hot)" : undefined }}>Books</a>
          <a className="nav-drawer-link" onClick={() => goTo("movies")} href="#movies" style={{ color: page === "movies" ? "var(--hot)" : undefined }}>Movies</a>
          <a className="nav-drawer-link" onClick={() => goTo("contact")} href="#contact" style={{ color: page === "contact" ? "var(--hot)" : undefined }}>Contact</a>
        </div>
        <div className="nav-drawer-icons">
          <a href="https://github.com/tasha404" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/ntashanadia" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://instagram.com/ntashandia" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>

      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}