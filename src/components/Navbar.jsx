import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Navbar({ page, setPage }) {
  return (
    <nav className="navbar">
      <div className="nav-name" style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
        Natasha <span>Nadia</span>
      </div>
      <div className="nav-right">
        <a
          className="nav-link"
          href="#about"
          onClick={(e) => { e.preventDefault(); setPage("home"); setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 100); }}
        >
          About
        </a>
        <a
          className="nav-link"
          href="#projects"
          onClick={(e) => { e.preventDefault(); setPage("home"); setTimeout(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }), 100); }}
        >
          Projects
        </a>
        <a
          className="nav-link"
          onClick={(e) => { e.preventDefault(); setPage("postcards"); window.scrollTo(0, 0); }}
          href="#postcards"
          style={{ color: page === "postcards" ? "var(--plum)" : undefined }}
        >
          ✉ Postcards
        </a>
        <div className="nav-icons">
          <a href="https://github.com/tasha404" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/ntashanadia" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://instagram.com/ntashandia" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>
    </nav>
  );
}