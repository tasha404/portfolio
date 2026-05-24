import { useEffect, useRef, useState, useCallback } from "react";

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a"
];

function LabsPage({ onClose }) {
  return (
    <div className="labs-overlay" role="dialog" aria-label="404 Labs secret page">
      <div className="labs-window">
        <button className="labs-close" onClick={onClose} aria-label="Close">×</button>
        <div className="labs-header">
          <div className="labs-badge">CLASSIFIED</div>
          <h1 className="labs-title">
            <span className="labs-title-num">404</span>
            <span className="labs-title-word">Labs</span>
          </h1>
          <p className="labs-subtitle">// you weren't supposed to find this</p>
        </div>
        <div className="labs-grid">
          <div className="labs-card">
            <span className="labs-card-icon">🖳</span>
            <h3>Hobby #001</h3>
            <p>I watch League of Legends. I like watching Canna, Gumayusi, Zeka and Kiin.</p>
            <span className="labs-card-status">I dont know how to play </span>
          </div>
          <div className="labs-card">
            <span className="labs-card-icon">݁ ˖Ი𐑼⋆</span>
            <h3>Hobby #002</h3>
            <p>I enjoy playing minecraft a bit too much at my big age</p>
            <span className="labs-card-status">Geek</span>
          </div>
          <div className="labs-card">
            <span className="labs-card-icon">(╥﹏╥)</span>
            <h3>Hobby #003</h3>
            <p>I enjoy the thought of learning about electronics. Do i understand it ? NO</p>
            <span className="labs-card-status">humiliating</span>
          </div>
          <div className="labs-card">
            <span className="labs-card-icon">ʕ•ﻌ•ʔ</span>
            <h3>Hobby #004</h3>
            <p>After my first job, i realized that i talk too much</p>
            <span className="labs-card-status">fake introvert</span>
          </div>
        </div>
        <div className="labs-footer">
          <span>// tasha404 lost &amp; found </span>
        </div>
      </div>
    </div>
  );
}

function KonamiToast({ onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="konami-toast" role="alert">
      <span className="konami-toast-icon">✦</span>
      <div>
        <div className="konami-toast-title">cheat code activated</div>
        <div className="konami-toast-sub">you've unlocked: the knowledge that tasha noticed</div>
      </div>
    </div>
  );
}

export default function EasterEggs() {
  const [showLabs, setShowLabs] = useState(false);
  const [showKonami, setShowKonami] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const konamiProgress = useRef([]);

  // declare triggerGlitch first with useCallback so effects can reference it
  const triggerGlitch = useCallback(() => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 600);
  }, []);

  useEffect(() => {
    function onKey(e) {
      konamiProgress.current = [...konamiProgress.current, e.key].slice(-10);
      if (JSON.stringify(konamiProgress.current) === JSON.stringify(KONAMI)) {
        konamiProgress.current = [];
        setShowKonami(true);
        triggerGlitch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggerGlitch]);

  useEffect(() => {
    function onClick(e) {
      const trigger = e.target.closest("[data-easter-egg]");
      if (!trigger) return;
      const egg = trigger.getAttribute("data-easter-egg");
      if (egg === "labs") setShowLabs(true);
      if (egg === "glitch") triggerGlitch();
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [triggerGlitch]);

  return (
    <>
      {glitch && <div className="glitch-overlay" aria-hidden="true" />}
      {showLabs && <LabsPage onClose={() => setShowLabs(false)} />}
      {showKonami && <KonamiToast onClose={() => setShowKonami(false)} />}
    </>
  );
}