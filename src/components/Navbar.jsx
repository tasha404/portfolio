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

        {/* Desktop nav */}
        <div className="nav-right">
          <a className="nav-link" href="#about"
            onClick={(e) => { e.preventDefault(); goTo("home", "about"); }}>
            About
          </a>
          <a className="nav-link" href="#projects"
            onClick={(e) => { e.preventDefault(); goTo("home", "projects"); }}>
            Projects
          </a>
          <a className="nav-link" href="#postcards"
            onClick={(e) => { e.preventDefault(); goTo("postcards"); }}
            style={{ color: page === "postcards" ? "var(--plum)" : undefined }}>
            Postcards
          </a>
          <a className="nav-link" href="#contact"
            onClick={(e) => { e.preventDefault(); goTo("contact"); }}
            style={{ color: page === "contact" ? "var(--rose)" : undefined }}>
            Contact
          </a>
          <div className="nav-icons">
            <a href="https://github.com/tasha404" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="https://www.linkedin.com/in/ntashanadia" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://instagram.com/ntashandia" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>

        {/* Hamburger */}
        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer${menuOpen ? " open" : ""}`}>
        <div className="nav-drawer-links">
          <a className="nav-drawer-link" onClick={() => goTo("home", "about")} href="#about">About</a>
          <a className="nav-drawer-link" onClick={() => goTo("home", "projects")} href="#projects">Projects</a>
          <a className="nav-drawer-link"
            onClick={() => goTo("postcards")}
            href="#postcards"
            style={{ color: page === "postcards" ? "var(--rose)" : undefined }}>
            Postcards
          </a>
          <a className="nav-drawer-link"
            onClick={() => goTo("contact")}
            href="#contact"
            style={{ color: page === "contact" ? "var(--rose)" : undefined }}>
            Contact
          </a>
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