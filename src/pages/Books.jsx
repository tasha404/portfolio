import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, orderBy, query,
} from "firebase/firestore";

const ADMIN_PASSWORD = "canna"; // change this!

const STATUSES = ["read", "reading", "want to read"];
const STATUS_LABELS = { read: "Read", reading: "Currently Reading", "want to read": "Want to Read" };

/* ── Admin gate ─────────────────────────────────────── */
function AdminGate({ onUnlock, onClose }) {
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);

  function attempt() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("media_admin", "1");
      onUnlock();
    } else {
      setShake(true);
      setPw("");
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className={`admin-gate ${shake ? "admin-gate-shake" : ""}`} onClick={e => e.stopPropagation()}>
        <span className="admin-gate-icon">🔒</span>
        <p className="admin-gate-label">admin password</p>
        <input className="admin-gate-input" type="password" placeholder="••••••••"
          value={pw} onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && attempt()} autoFocus />
        <button className="admin-gate-btn" onClick={attempt}>unlock →</button>
      </div>
    </div>
  );
}

/* ── Add book modal ─────────────────────────────────── */
function AddBookModal({ onClose }) {
  const [form, setForm] = useState({ title: "", author: "", year: new Date().getFullYear().toString(), status: "read", cover: "", rating: "", review: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit() {
    if (!form.title.trim() || !form.author.trim()) { setError("Title and author are required."); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "books"), {
        ...form,
        year: parseInt(form.year) || new Date().getFullYear(),
        rating: form.rating ? parseFloat(form.rating) : null,
        createdAt: new Date().toISOString(),
      });
      onClose();
    } catch (err) {
      setError("Failed to save — try again.");
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className="media-modal" onClick={e => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose}>×</button>
        <h2 className="media-modal-title">add a book</h2>

        <div className="media-form-grid">
          <div className="media-form-field">
            <label>Title *</label>
            <input type="text" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Book title" />
          </div>
          <div className="media-form-field">
            <label>Author *</label>
            <input type="text" value={form.author} onChange={e => set("author", e.target.value)} placeholder="Author name" />
          </div>
          <div className="media-form-field">
            <label>Year read</label>
            <input type="number" value={form.year} onChange={e => set("year", e.target.value)} placeholder="2025" />
          </div>
          <div className="media-form-field">
            <label>Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div className="media-form-field">
            <label>Rating (0–5)</label>
            <input type="number" min="0" max="5" step="0.5" value={form.rating} onChange={e => set("rating", e.target.value)} placeholder="4.5" />
          </div>
          <div className="media-form-field media-form-full">
            <label>Cover image URL</label>
            <input type="url" value={form.cover} onChange={e => set("cover", e.target.value)} placeholder="https://covers.openlibrary.org/..." />
            <span className="media-form-hint">tip: use Open Library covers — search at openlibrary.org</span>
          </div>
          <div className="media-form-field media-form-full">
            <label>Short review / notes (optional)</label>
            <textarea rows={3} value={form.review} onChange={e => set("review", e.target.value)} placeholder="What did you think?" />
          </div>
        </div>

        {error && <div className="upload-error">{error}</div>}
        <div className="upload-actions">
          <button className="upload-cancel" onClick={onClose} disabled={loading}>cancel</button>
          <button className="upload-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "saving..." : "add book →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Star rating ────────────────────────────────────── */
function Stars({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="media-stars">
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

/* ── Book card ──────────────────────────────────────── */
function BookCard({ book, isAdmin, onDelete }) {
  return (
    <div className="book-card">
      <div className="book-cover">
        {book.cover
          ? <img src={book.cover} alt={book.title} loading="lazy" />
          : <div className="book-cover-placeholder"><span>{book.title[0]}</span></div>}
      </div>
      <div className="book-info">
        <span className={`book-status book-status-${book.status.replace(/\s+/g, "-")}`}>
          {STATUS_LABELS[book.status]}
        </span>
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        {book.rating && <Stars rating={book.rating} />}
        {book.review && <p className="book-review">{book.review}</p>}
        {isAdmin && (
          <button className="media-delete-btn" onClick={() => onDelete(book)}>delete</button>
        )}
      </div>
    </div>
  );
}

/* ── Main Books page ────────────────────────────────── */
export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("media_admin") === "1");
  const [showGate, setShowGate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function handleDelete(book) {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    await deleteDoc(doc(db, "books", book.id));
  }

  // Group by year for "read" books, separate "reading" and "want to read"
  const reading = books.filter(b => b.status === "reading");
  const wantToRead = books.filter(b => b.status === "want to read");
  const readBooks = books.filter(b => b.status === "read");

  const byYear = readBooks.reduce((acc, b) => {
    const y = b.year || "Unknown";
    if (!acc[y]) acc[y] = [];
    acc[y].push(b);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => b - a);

  return (
    <div className="media-page-wrapper">
      <div className="media-page">

        {/* header */}
        <div className="media-page-header">
          <div>
            <h1 className="media-page-title">My <em>Books</em></h1>
            <p className="media-page-sub">books I've read, grouped by year</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 8 }}>
            {isAdmin && (
              <button className="media-add-btn" onClick={() => setShowAdd(true)}>+ add book</button>
            )}
            {!isAdmin
              ? <button className="cal-admin-btn" onClick={() => setShowGate(true)}>tasha</button>
              : <button className="cal-admin-btn cal-admin-btn-active" onClick={() => { sessionStorage.removeItem("media_admin"); setIsAdmin(false); }}>tasha's here</button>
            }
          </div>
        </div>

        {/* filter tabs */}
        <div className="media-filter-tabs">
          {["all", "reading", "read", "want to read"].map(f => (
            <button key={f} className={`media-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : STATUS_LABELS[f] || f}
              <span className="media-tab-count">
                {f === "all" ? books.length : books.filter(b => b.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* currently reading */}
        {(filter === "all" || filter === "reading") && reading.length > 0 && (
          <div className="books-section">
            <h2 className="books-year-label">Currently Reading</h2>
            <div className="books-grid">
              {reading.map(b => <BookCard key={b.id} book={b} isAdmin={isAdmin} onDelete={handleDelete} />)}
            </div>
          </div>
        )}

        {/* want to read */}
        {(filter === "all" || filter === "want to read") && wantToRead.length > 0 && (
          <div className="books-section">
            <h2 className="books-year-label">Want to Read</h2>
            <div className="books-grid">
              {wantToRead.map(b => <BookCard key={b.id} book={b} isAdmin={isAdmin} onDelete={handleDelete} />)}
            </div>
          </div>
        )}

        {/* read — grouped by year */}
        {(filter === "all" || filter === "read") && years.map(year => (
          <div key={year} className="books-section">
            <h2 className="books-year-label">{year}</h2>
            <div className="books-grid">
              {byYear[year].map(b => <BookCard key={b.id} book={b} isAdmin={isAdmin} onDelete={handleDelete} />)}
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div className="media-empty">
            <span>📚</span>
            <p>no books yet{isAdmin ? " — add one!" : ""}</p>
          </div>
        )}

      </div>

      {showGate && !isAdmin && (
        <AdminGate onUnlock={() => { setIsAdmin(true); setShowGate(false); }} onClose={() => setShowGate(false)} />
      )}
      {showAdd && <AddBookModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}