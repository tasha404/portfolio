import { useState, useRef, useEffect } from "react";

/* ─── COMMAND REGISTRY ─────────────────────────────── */
const COMMANDS = {
  help: () => ({
    type: "list",
    lines: [
      { cmd: "about",    desc: "who is tasha?" },
      { cmd: "projects", desc: "things I've built" },
      { cmd: "skills",   desc: "tools & tech" },
      { cmd: "contact",  desc: "get in touch" },
      { cmd: "socials",  desc: "find me online" },
      { cmd: "clear",    desc: "clear terminal" },
      { cmd: "whoami",   desc: "hmm..." },
    ],
    footer: "// try something else — there might be secrets 👀",
  }),

  about: () => ({
    type: "text",
    lines: [
      "Natasha Nadia — CS student & developer",
      "based in Klang, Malaysia 🇲🇾",
      "",
      "I build AI systems, web & mobile apps,",
      "and real-time tech. One project at a time.",
      "",
      "GPA highlights: 3.95 peak (Dean's List × 5)",
    ],
  }),

  projects: () => ({
    type: "projects",
    items: [
      { name: "BunnyDo",          url: "https://bunnydo.vercel.app/",        tech: "React · Firebase" },
      { name: "Peachy Pixels",    url: "https://peachypixels.vercel.app/",   tech: "React · Canvas API" },
      { name: "KiinAI",           url: "https://kiinai.vercel.app/",         tech: "React · OpenAI · Firebase" },
      { name: "Path Raiders",     url: "https://path-raiders.vercel.app/",   tech: "Python · HTML · CSS" },
      { name: "CCTV Detector",    url: null,                                  tech: "OpenCV · Flutter · C++" },
      { name: "Jump Realm",       url: "https://www.youtube.com/shorts/GBnp0Fy55JY", tech: "Kotlin · Android Studio" },
    ],
  }),

  skills: () => ({
    type: "skills",
    groups: [
      { label: "frontend",   items: ["HTML5", "CSS3", "JavaScript", "React"] },
      { label: "backend",    items: ["Firebase", "PHP", "MySQL", "SQLite"] },
      { label: "ai/systems", items: ["OpenAI", "OpenCV", "Python", "C++"] },
      { label: "mobile",     items: ["Flutter", "Kotlin", "Android Studio"] },
      { label: "tooling",    items: ["Figma", "GitHub", "Vercel", "VS Code"] },
    ],
  }),

  contact: () => ({
    type: "text",
    lines: [
      "📧  natashanadiafsm@gmail.com",
      "📞  +60 14 336 1244",
      "📍  Klang, Malaysia",
      "",
      "or use the contact form → /contact",
    ],
  }),

  socials: () => ({
    type: "links",
    items: [
      { label: "GitHub",    url: "https://github.com/tasha404" },
      { label: "LinkedIn",  url: "https://www.linkedin.com/in/ntashanadia" },
      { label: "Instagram", url: "https://instagram.com/ntashandia" },
    ],
  }),

  whoami: () => ({
    type: "text",
    lines: ["tasha404", "// root access: denied", "// (nice try)"],
  }),

  // ── Easter eggs ──────────────────────────────────
  sudo: () => ({
    type: "text",
    lines: ["sudo: permission denied", "// you are not in the sudoers file", "// this incident will be reported."],
    style: "warn",
  }),

  "ls -la": () => ({
    type: "text",
    lines: [
      "drwxr-xr-x  tasha  tasha  ./",
      "drwxr-xr-x  tasha  tasha  ../",
      "-rw-r--r--  tasha  tasha  README.md",
      "-rw-------  tasha  tasha  secrets.txt",
      "-rwxr-xr-x  tasha  tasha  build_something_cool.sh",
    ],
  }),

  "cat secrets.txt": () => ({
    type: "text",
    lines: [
      "// ACCESS GRANTED ✦",
      "",
      "secret #1 — the bunny in BunnyDo is named Mochi",
      "secret #2 — tasha404 means lost-and-found",
      "secret #3 — there's a hidden page: /404-labs",
      "",
      "// you didn't see this",
    ],
    style: "secret",
  }),

  "npm run dev": () => ({
    type: "text",
    lines: [
      "> tasha404@1.0.0 dev",
      "> vite --host",
      "",
      "  VITE v5.4.0  ready in 312ms",
      "",
      "  ➜  Local:   http://localhost:5173/",
      "  ➜  Network: https://tasha404.vercel.app/",
    ],
  }),

  "git log": () => ({
    type: "text",
    lines: [
      "commit a1b2c3d (HEAD → main)",
      "Author: Natasha Nadia <natashanadiafsm@gmail.com>",
      "Date:   just now",
      "",
      "    feat: added easter eggs nobody will find",
      "",
      "commit d4e5f6a",
      "    fix: removed console.log('why is this broken')",
    ],
  }),

  "curl -I tasha404.vercel.app": () => ({
    type: "text",
    lines: [
      "HTTP/2 200",
      "content-type: text/html; charset=utf-8",
      "x-powered-by: coffee ☕ + late nights 🌙",
      "x-vibes: immaculate",
      "cache-control: no-cache (always fresh)",
    ],
  }),

  hire: () => ({
    type: "text",
    lines: [
      "// initiating hire sequence...",
      "",
      "✓ portfolio reviewed",
      "✓ skills confirmed",
      "✓ vibes: good",
      "",
      "→ next step: natashanadiafsm@gmail.com",
    ],
    style: "success",
  }),

  clear: () => ({ type: "clear" }),
};

/* ─── FUZZY SUGGESTIONS ────────────────────────────── */
const ALL_COMMANDS = Object.keys(COMMANDS);
function suggest(input) {
  const q = input.trim().toLowerCase();
  if (!q) return [];
  return ALL_COMMANDS.filter(c => c.startsWith(q) && c !== q).slice(0, 3);
}

/* ─── OUTPUT RENDERER ──────────────────────────────── */
function Output({ entry }) {
  const { cmd, result } = entry;

  if (!result) return (
    <div className="term-block">
      <div className="term-prompt-line"><span className="term-prompt-sym">❯</span><span className="term-cmd-echo">{cmd}</span></div>
      <div className="term-error">command not found: {cmd} — type <span className="term-accent">help</span> for commands</div>
    </div>
  );

  const styleClass = result.style ? ` term-${result.style}` : "";

  return (
    <div className={`term-block${styleClass}`}>
      <div className="term-prompt-line">
        <span className="term-prompt-sym">❯</span>
        <span className="term-cmd-echo">{cmd}</span>
      </div>

      {result.type === "text" && (
        <div className="term-output">
          {result.lines.map((l, i) => (
            <div key={i} className={l === "" ? "term-spacer" : "term-line"}>{l}</div>
          ))}
          {result.footer && <div className="term-footer">{result.footer}</div>}
        </div>
      )}

      {result.type === "list" && (
        <div className="term-output">
          <div className="term-line term-dim">available commands:</div>
          <div className="term-spacer" />
          {result.lines.map((l, i) => (
            <div key={i} className="term-cmd-row">
              <span className="term-cmd-name">{l.cmd}</span>
              <span className="term-cmd-desc">{l.desc}</span>
            </div>
          ))}
          {result.footer && <><div className="term-spacer" /><div className="term-footer">{result.footer}</div></>}
        </div>
      )}

      {result.type === "projects" && (
        <div className="term-output">
          {result.items.map((p, i) => (
            <div key={i} className="term-project-row">
              <span className="term-project-idx">[{String(i + 1).padStart(2, "0")}]</span>
              {p.url
                ? <a className="term-project-name link" href={p.url} target="_blank" rel="noopener noreferrer">{p.name} ↗</a>
                : <span className="term-project-name">{p.name}</span>}
              <span className="term-project-tech">{p.tech}</span>
            </div>
          ))}
        </div>
      )}

      {result.type === "skills" && (
        <div className="term-output">
          {result.groups.map((g, i) => (
            <div key={i} className="term-skill-row">
              <span className="term-skill-label">[{g.label}]</span>
              <span className="term-skill-items">{g.items.join("  ·  ")}</span>
            </div>
          ))}
        </div>
      )}

      {result.type === "links" && (
        <div className="term-output">
          {result.items.map((l, i) => (
            <div key={i} className="term-link-row">
              <span className="term-link-label">{l.label}</span>
              <a className="term-link-url link" href={l.url} target="_blank" rel="noopener noreferrer">{l.url} ↗</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── TERMINAL COMPONENT ───────────────────────────── */
export default function Terminal() {
  const BOOT = [{ id: "boot", cmd: null, result: { type: "boot" } }];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(BOOT);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  /* focus input when terminal opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  /* scroll to bottom */
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    setSuggestions([]);
    setCmdHistory(h => [cmd, ...h]);
    setHistIdx(-1);
    setInput("");

    const fn = COMMANDS[cmd.toLowerCase()];
    const result = fn ? fn() : null;

    if (result?.type === "clear") {
      setHistory(BOOT);
      return;
    }

    setHistory(h => [...h, { id: Date.now(), cmd, result }]);
  }

  function handleKey(e) {
    if (e.key === "Enter") { run(input); return; }
    if (e.key === "Tab") {
      e.preventDefault();
      const s = suggest(input);
      if (s.length === 1) { setInput(s[0]); setSuggestions([]); }
      else setSuggestions(s);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] || "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
      return;
    }
  }

  function handleChange(e) {
    setInput(e.target.value);
    setSuggestions(suggest(e.target.value));
  }

  return (
    <>
      {/* ── FAB trigger ── */}
      <button
        className={`term-fab${open ? " term-fab-open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle terminal"
        title="Open terminal"
      >
        <span className="term-fab-icon">{open ? "×" : ">_"}</span>
      </button>

      {/* ── Terminal window ── */}
      {open && (
        <div className="term-window" role="dialog" aria-label="Interactive terminal">
          {/* title bar */}
          <div className="term-titlebar" onClick={() => inputRef.current?.focus()}>
            <div className="term-dots">
              <span className="term-dot dot-red" onClick={() => setOpen(false)} title="close" />
              <span className="term-dot dot-yellow" onClick={() => setHistory([])} title="clear" />
              <span className="term-dot dot-green" />
            </div>
            <span className="term-title">tasha404 — bash</span>
            <span className="term-title-hint">type help</span>
          </div>

          {/* output area */}
          <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
            {/* boot message */}
            {history[0]?.id === "boot" && (
              <div className="term-boot">
                <div className="term-boot-logo">tasha404</div>
                <div className="term-boot-sub">// interactive terminal — v1.0.0</div>
                <div className="term-boot-sub">// type <span className="term-accent">help</span> for available commands</div>
                <div className="term-boot-sub">// psst — there are secrets here 👀</div>
                <div className="term-spacer" />
              </div>
            )}

            {history.filter(h => h.id !== "boot").map(entry => (
              <Output key={entry.id} entry={entry} />
            ))}
          </div>

          {/* input row */}
          <div className="term-input-row">
            <span className="term-prompt-sym term-prompt-active">❯</span>
            <div className="term-input-wrap">
              <input
                ref={inputRef}
                className="term-input"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKey}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                placeholder="type a command..."
                aria-label="Terminal input"
              />
              {suggestions.length > 0 && (
                <div className="term-suggestions">
                  {suggestions.map(s => (
                    <button key={s} className="term-suggestion" onClick={() => { setInput(s); setSuggestions([]); inputRef.current?.focus(); }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}