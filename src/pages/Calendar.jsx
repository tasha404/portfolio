import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, query, where, orderBy,
} from "firebase/firestore";
import {
  getStorage, ref as storageRef,
  uploadBytesResumable, getDownloadURL, deleteObject,
} from "firebase/storage";

const ADMIN_PASSWORD = "tasha404"; // change this!

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

/* ── Day cell ─────────────────────────────────────────── */
function DayCell({ day, photos, isToday, isAdmin, onOpen }) {
  const hasPhotos = photos.length > 0;
  const first = photos[0];

  return (
    <div
      className={`cal-day ${isToday ? "cal-day-today" : ""} ${hasPhotos ? "cal-day-has-photo" : ""}`}
      onClick={() => (hasPhotos || isAdmin) && onOpen()}
      title={hasPhotos ? `${photos.length} photo${photos.length > 1 ? "s" : ""}` : isAdmin ? "click to add photo" : ""}
    >
      <span className="cal-day-num">{day}</span>

      {hasPhotos && (
        <div className="cal-day-thumb-wrap">
          <img src={first.url} alt="" className="cal-day-thumb" loading="lazy" />
          <div className="cal-day-thumb-overlay" />
          {photos.length > 1 && (
            <span className="cal-day-count">+{photos.length}</span>
          )}
        </div>
      )}

      {!hasPhotos && isAdmin && (
        <span className="cal-day-add">+</span>
      )}
    </div>
  );
}

/* ── Gallery lightbox ─────────────────────────────────── */
function Gallery({ date, photos, isAdmin, onClose, onAdd, onDelete }) {
  const [idx, setIdx] = useState(0);
  // derive safe index without setState in effect
  const safeIdx = photos.length === 0 ? 0 : Math.min(idx, photos.length - 1);
  const current = photos[safeIdx];

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx(i => Math.min(i + 1, photos.length - 1));
      if (e.key === "ArrowLeft")  setIdx(i => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, photos.length]);

  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className="gallery-window" onClick={e => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose}>×</button>

        {/* date + add button */}
        <div className="gallery-header">
          <span className="lb-date">{date}</span>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span className="gallery-counter">
              {photos.length > 0 ? `${safeIdx + 1} / ${photos.length}` : "no photos"}
            </span>
            {isAdmin && (
              <button className="gallery-add-btn" onClick={onAdd}>+ add photo</button>
            )}
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="gallery-empty">
            <span>📷</span>
            <p>no photos yet — click "add photo" to upload one</p>
          </div>
        ) : (
          <>
            {/* main image */}
            <div className="gallery-img-wrap">
              {safeIdx > 0 && (
                <button className="gallery-arrow gallery-arrow-left" onClick={() => setIdx(i => i - 1)}>‹</button>
              )}
              <img src={current.url} alt={current.caption || date} className="gallery-img" />
              {safeIdx < photos.length - 1 && (
                <button className="gallery-arrow gallery-arrow-right" onClick={() => setIdx(i => i + 1)}>›</button>
              )}
            </div>

            {/* caption + delete */}
            <div className="gallery-meta">
              {current.caption && <p className="lb-caption">{current.caption}</p>}
              {isAdmin && (
                <button className="lb-delete" onClick={() => onDelete(current)}>
                  delete this photo
                </button>
              )}
            </div>

            {/* thumbnail strip */}
            {photos.length > 1 && (
              <div className="gallery-strip">
                {photos.map((p, i) => (
                  <div
                    key={p.id}
                    className={`gallery-strip-thumb ${i === safeIdx ? "active" : ""}`}
                    onClick={() => setIdx(i)}
                  >
                    <img src={p.url} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="lb-tape lb-tape-tl" />
        <div className="lb-tape lb-tape-tr" />
      </div>
    </div>
  );
}

/* ── Upload modal ─────────────────────────────────────── */
function UploadModal({ dateKey, onClose }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function pickFiles(e) {
    const picked = Array.from(e.target.files);
    if (!picked.length) return;
    const tooBig = picked.find(f => f.size > 10 * 1024 * 1024);
    if (tooBig) { setError("Each file must be under 10 MB"); return; }
    setFiles(picked);
    setPreviews(picked.map(f => URL.createObjectURL(f)));
    setError("");
  }

  async function handleUpload() {
    if (!files.length) { setError("Pick at least one photo!"); return; }
    setUploading(true);
    setError("");

    try {
      const storage = getStorage();
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const path = `calendar/${dateKey}_${Date.now()}_${i}`;
        const sRef = storageRef(storage, path);
        const task = uploadBytesResumable(sRef, f);

        await new Promise((resolve, reject) => {
          task.on("state_changed",
            snap => {
              const fileProgress = (snap.bytesTransferred / snap.totalBytes) * 100;
              setProgress(Math.round(((i) / files.length) * 100 + fileProgress / files.length));
            },
            reject, resolve
          );
        });

        const url = await getDownloadURL(sRef);
        await addDoc(collection(db, "calendarPhotos"), {
          date: dateKey,
          url,
          storagePath: path,
          caption: caption.trim(),
          createdAt: new Date().toISOString(),
        });
      }
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
          add photos <span className="upload-date-tag">{dateKey}</span>
        </h2>

        <div
          className={`upload-drop ${previews.length ? "upload-drop-has-preview" : ""}`}
          onClick={() => inputRef.current?.click()}
        >
          {previews.length > 0 ? (
            <div className="upload-preview-grid">
              {previews.map((p, i) => (
                <img key={i} src={p} alt="" className="upload-preview-thumb" />
              ))}
            </div>
          ) : (
            <>
              <span className="upload-drop-icon">📷</span>
              <span className="upload-drop-hint">click to pick photos</span>
              <span className="upload-drop-sub">select multiple · jpg, png, webp · max 10 MB each</span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={pickFiles}
            style={{ display:"none" }}
          />
        </div>

        {previews.length > 0 && (
          <p className="upload-file-count">{files.length} photo{files.length > 1 ? "s" : ""} selected</p>
        )}

        <div className="upload-caption-wrap">
          <label className="upload-caption-label">
            caption <span style={{ opacity:0.4 }}>(optional — applies to all)</span>
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
            <div className="upload-progress-bar" style={{ width:`${progress}%` }} />
            <span className="upload-progress-label">{progress}%</span>
          </div>
        )}

        {error && <div className="upload-error">{error}</div>}

        <div className="upload-actions">
          <button className="upload-cancel" onClick={onClose} disabled={uploading}>cancel</button>
          <button className="upload-submit" onClick={handleUpload} disabled={uploading || !files.length}>
            {uploading ? `uploading... ${progress}%` : `upload ${files.length > 1 ? files.length + " photos" : "photo"} →`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Admin gate ───────────────────────────────────────── */
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
    <div className="lb-overlay">
      <div className={`admin-gate ${shake ? "admin-gate-shake" : ""}`}>
        <span className="admin-gate-icon">🔒</span>
        <p className="admin-gate-label">admin password</p>
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

/* ── Main page ────────────────────────────────────────── */
export default function CalendarPage() {
  const now = today();
  const [year, setYear]   = useState(now.year);
  const [month, setMonth] = useState(now.month);
  // photos grouped by date key: { "2025-05-03": [{id, url, caption, ...}] }
  const [photoMap, setPhotoMap] = useState({});
  const [openDay, setOpenDay]   = useState(null); // dateKey string
  const [uploadDay, setUploadDay] = useState(null);
  const [isAdmin, setIsAdmin]   = useState(() => sessionStorage.getItem("cal_admin") === "1");
  const [showGate, setShowGate] = useState(false);

  /* listen to this month's photos */
  useEffect(() => {
    const prefix = `${year}-${String(month + 1).padStart(2,"0")}`;
    const q = query(
      collection(db, "calendarPhotos"),
      where("date", ">=", prefix + "-01"),
      where("date", "<=", prefix + "-31"),
      orderBy("date"),
      orderBy("createdAt"),
    );
    const unsub = onSnapshot(q, snap => {
      const map = {};
      snap.docs.forEach(d => {
        const data = { id: d.id, ...d.data() };
        if (!map[data.date]) map[data.date] = [];
        map[data.date].push(data);
      });
      setPhotoMap(map);
    });
    return () => unsub();
  }, [year, month]);

  async function handleDelete(photo) {
    if (!window.confirm("Delete this photo?")) return;
    try {
      const storage = getStorage();
      if (photo.storagePath) await deleteObject(storageRef(storage, photo.storagePath));
      await deleteDoc(doc(db, "calendarPhotos", photo.id));
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

  const totalPhotos = Object.values(photoMap).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="cal-page-wrapper">
      <div className="cal-page">

        {/* header */}
        <div className="cal-page-header">
          <div>
            <p className="section-label" style={{ justifyContent:"flex-start" }}>photo diary</p>
            <h1 className="cal-page-title">Daily <em>Snaps</em></h1>
            <p className="cal-page-sub">little moments, month by month ✦</p>
          </div>
          {!isAdmin
            ? <button className="cal-admin-btn" onClick={() => setShowGate(true)}>🔒 admin</button>
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
                  photos={photoMap[dateKey(year, month, day)] || []}
                  isToday={year === now.year && month === now.month && day === now.day}
                  isAdmin={isAdmin}
                  onOpen={() => setOpenDay(dateKey(year, month, day))}
                />
          )}
        </div>

        {/* strip */}
        <div className="cal-strip">
          <span>{totalPhotos} photo{totalPhotos !== 1 ? "s" : ""} this month</span>
          {isAdmin && <span className="cal-strip-hint">click any day to add photos</span>}
        </div>

      </div>

      {/* modals */}
      {showGate && !isAdmin && (
        <AdminGate onUnlock={() => { setIsAdmin(true); setShowGate(false); }} />
      )}

      {openDay && (
        <Gallery
          date={openDay}
          photos={photoMap[openDay] || []}
          isAdmin={isAdmin}
          onClose={() => setOpenDay(null)}
          onAdd={() => { setUploadDay(openDay); setOpenDay(null); }}
          onDelete={handleDelete}
        />
      )}

      {uploadDay && (
        <UploadModal
          dateKey={uploadDay}
          onClose={() => { setUploadDay(null); setOpenDay(uploadDay); }}
        />
      )}
    </div>
  );
}