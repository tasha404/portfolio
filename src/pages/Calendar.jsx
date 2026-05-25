import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, query, where,
} from "firebase/firestore";
import {
  getStorage, ref as storageRef,
  uploadBytesResumable, getDownloadURL, deleteObject,
} from "firebase/storage";

const ADMIN_PASSWORD = "tasha404"; 

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}
function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}
function today() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

function DayCell({ day, year, month, entry, isToday, isAdmin, onAdd, onView }) {
  const key = dateKey(year, month, day);
  const hasPhoto = !!entry?.url;

  return (
    <div
      className={`cal-day ${isToday ? "cal-day-today" : ""} ${hasPhoto ? "cal-day-has-photo" : ""}`}
      onClick={() => hasPhoto ? onView(entry) : isAdmin && onAdd(key)}
      title={hasPhoto ? entry.caption || "click to view" : isAdmin ? "click to add photo" : ""}
    >
      <span className="cal-day-num">{day}</span>
      {hasPhoto && (
        <div className="cal-day-thumb-wrap">
          <img src={entry.url} alt={entry.caption || key} className="cal-day-thumb" loading="lazy" />
          <div className="cal-day-thumb-overlay" />
        </div>
      )}
      {!hasPhoto && isAdmin && (
        <span className="cal-day-add">+</span>
      )}
    </div>
  );
}

function Lightbox({ entry, onClose, isAdmin, onDelete }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className="lb-window" onClick={e => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose}>×</button>
        <div className="lb-img-wrap">
          <img src={entry.url} alt={entry.caption || entry.date} className="lb-img" />
        </div>
        <div className="lb-meta">
          <span className="lb-date">{entry.date}</span>
          {entry.caption && <p className="lb-caption">{entry.caption}</p>}
          {isAdmin && (
            <button className="lb-delete" onClick={() => onDelete(entry)}>
              delete photo
            </button>
          )}
        </div>
        <div className="lb-tape lb-tape-tl" />
        <div className="lb-tape lb-tape-tr" />
      </div>
    </div>
  );
}

function UploadModal({ dateKey, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setError("Max file size is 10 MB"); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  }

  async function handleUpload() {
    if (!file) { setError("Pick a photo first!"); return; }
    setUploading(true);
    setError("");
    try {
      const storage = getStorage();
      const path = `calendar/${dateKey}_${Date.now()}`;
      const sRef = storageRef(storage, path);
      const task = uploadBytesResumable(sRef, file);

      await new Promise((resolve, reject) => {
        task.on("state_changed",
          snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          resolve
        );
      });

      const url = await getDownloadURL(sRef);
      await setDoc(doc(db, "calendar", dateKey), {
        date: dateKey,
        url,
        storagePath: path,
        caption: caption.trim(),
        updatedAt: new Date().toISOString(),
      });

      onClose();
    } catch (err) {
      setError("Upload failed — try again.");
      console.error(err);
    }
    setUploading(false);
  }

  return (
    <div className="upload-overlay" onClick={onClose}>
      <div className="upload-window" onClick={e => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose}>×</button>
        <h2 className="upload-title">
          add a photo <span className="upload-date-tag">{dateKey}</span>
        </h2>

        <div
          className={`upload-drop ${preview ? "upload-drop-has-preview" : ""}`}
          onClick={() => inputRef.current?.click()}
        >
          {preview
            ? <img src={preview} alt="preview" className="upload-preview" />
            : <>
                <span className="upload-drop-icon">✉︎</span>
                <span className="upload-drop-hint">click to pick a photo</span>
                <span className="upload-drop-sub">jpg, png, webp · max 10 MB</span>
              </>
          }
          <input ref={inputRef} type="file" accept="image/*" onChange={pickFile} style={{ display:"none" }} />
        </div>

        <div className="upload-caption-wrap">
          <label className="upload-caption-label">
            caption <span style={{ opacity: 0.4 }}>(optional)</span>
          </label>
          <input
            className="upload-caption-input"
            type="text"
            placeholder="what happened today?"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            maxLength={120}
          />
        </div>

        {uploading && (
          <div className="upload-progress-wrap">
            <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
            <span className="upload-progress-label">{progress}%</span>
          </div>
        )}

        {error && <div className="upload-error">{error}</div>}

        <div className="upload-actions">
          <button className="upload-cancel" onClick={onClose} disabled={uploading}>cancel</button>
          <button className="upload-submit" onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? "uploading..." : "save photo →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);

  function attempt() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("cal_admin", "1");
      onUnlock();
    } else {
      setShake(true);
      setPw("");
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="lb-overlay" onClick={() => {}}>
      <div className={`admin-gate ${shake ? "admin-gate-shake" : ""}`}>
        <span className="admin-gate-icon">🔒︎</span>
        <p className="admin-gate-label">only tasha can enter</p>
        <input
          className="admin-gate-input"
          type="password"
          placeholder="••••••••"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && attempt()}
          autoFocus
        />
        <button className="admin-gate-btn" onClick={attempt}>unlock →</button>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const now = today();
  const [year, setYear]     = useState(now.year);
  const [month, setMonth]   = useState(now.month);
  const [entries, setEntries] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const [uploadKey, setUploadKey] = useState(null);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("cal_admin") === "1");
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const prefix = `${year}-${String(month + 1).padStart(2,"0")}`;
    const q = query(
      collection(db, "calendar"),
      where("date", ">=", prefix + "-01"),
      where("date", "<=", prefix + "-31")
    );
    const unsub = onSnapshot(q, snap => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setEntries(map);
    });
    return () => unsub();
  }, [year, month]);

  async function handleDelete(entry) {
    if (!window.confirm("Delete this photo?")) return;
    try {
      const storage = getStorage();
      if (entry.storagePath) await deleteObject(storageRef(storage, entry.storagePath));
      await deleteDoc(doc(db, "calendar", entry.date));
      setLightbox(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDay(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  return (
    <div className="cal-page-wrapper">
      <div className="cal-page">

        {/* header */}
        <div className="cal-page-header">
          <div>
            <p className="section-label" style={{ justifyContent: "flex-start" }}>photo diary</p>
            <h1 className="cal-page-title">Daily <em>Snaps</em></h1>
            <p className="cal-page-sub">little moments, month by month ✦</p>
          </div>
          {!isAdmin
            ? <button className="cal-admin-btn" onClick={() => setShowGate(true)}>admin</button>
            : <button className="cal-admin-btn cal-admin-btn-active" onClick={() => {
                sessionStorage.removeItem("cal_admin");
                setIsAdmin(false);
              }}>✓ admin mode</button>
          }
        </div>

        {/* month nav */}
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>←</button>
          <div className="cal-nav-label">
            <span className="cal-nav-month">{MONTHS[month]}</span>
            <span className="cal-nav-year">{year}</span>
          </div>
          <button className="cal-nav-btn" onClick={nextMonth}>→</button>
        </div>

        {/* day headers */}
        <div className="cal-grid-header">
          {DAYS.map(d => <span key={d} className="cal-grid-day-label">{d}</span>)}
        </div>

        {/* grid */}
        <div className="cal-grid">
          {cells.map((day, i) =>
            day === null
              ? <div key={`empty-${i}`} className="cal-day cal-day-empty" />
              : <DayCell
                  key={day}
                  day={day}
                  year={year}
                  month={month}
                  entry={entries[dateKey(year, month, day)]}
                  isToday={year === now.year && month === now.month && day === now.day}
                  isAdmin={isAdmin}
                  onAdd={key => setUploadKey(key)}
                  onView={entry => setLightbox(entry)}
                />
          )}
        </div>

        {/* strip */}
        <div className="cal-strip">
          <span>{Object.keys(entries).length} photo{Object.keys(entries).length !== 1 ? "s" : ""} this month</span>
          {isAdmin && <span className="cal-strip-hint">click any day to add a photo</span>}
        </div>

      </div>

      {/* modals */}
      {showGate && !isAdmin && (
        <AdminGate onUnlock={() => { setIsAdmin(true); setShowGate(false); }} />
      )}
      {uploadKey && (
        <UploadModal dateKey={uploadKey} onClose={() => setUploadKey(null)} />
      )}
      {lightbox && (
        <Lightbox
          entry={lightbox}
          onClose={() => setLightbox(null)}
          isAdmin={isAdmin}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}