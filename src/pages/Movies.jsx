import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, orderBy, query,
} from "firebase/firestore";

const ADMIN_PASSWORD = "canna"; // change this!

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Animation", "Documentary", "Fantasy", "Other"];

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

/* ── Add movie modal ────────────────────────────────── */
function AddMovieModal({ onClose }) {
  const [form, setForm] = useState({ title: "", year: "", genre: "", rating: "", poster: "", review: "", watchedAt: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit() {
    if (!form.title.trim()) { setError("Title is required."); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "movies"), {
        ...form,
        year: form.year ? parseInt(form.year) : null,
        rating: form.rating ? parseFloat(form.rating) : null,
        createdAt: new Date().toISOString(),
        watchedAt: form.watchedAt || new Date().toISOString().split("T")[0],
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
        <h2 className="media-modal-title">add a movie</h2>

        <div className="media-form-grid">
          <div className="media-form-field">
            <label>Title *</label>
            <input type="text" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Movie title" />
          </div>
          <div className="media-form-field">
            <label>Year</label>
            <input type="number" value={form.year} onChange={e => set("year", e.target.value)} placeholder="2024" />
          </div>
          <div className="media-form-field">
            <label>Genre</label>
            <select value={form.genre} onChange={e => set("genre", e.target.value)}>
              <option value="">Select genre</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="media-form-field">
            <label>Rating (0–5)</label>
            <input type="number" min="0" max="5" step="0.5" value={form.rating} onChange={e => set("rating", e.target.value)} placeholder="4.5" />
          </div>
          <div className="media-form-field">
            <label>Date watched</label>
            <input type="date" value={form.watchedAt} onChange={e => set("watchedAt", e.target.value)} />
          </div>
          <div className="media-form-field media-form-full">
            <label>Poster image URL</label>
            <input type="url" value={form.poster} onChange={e => set("poster", e.target.value)} placeholder="https://image.tmdb.org/..." />
            <span className="media-form-hint">tip: find posters at themoviedb.org — right-click image → copy image address</span>
          </div>
          <div className="media-form-field media-form-full">
            <label>Short review (optional)</label>
            <textarea rows={3} value={form.review} onChange={e => set("review", e.target.value)} placeholder="What did you think?" />
          </div>
        </div>

        {error && <div className="upload-error">{error}</div>}
        <div className="upload-actions">
          <button className="upload-cancel" onClick={onClose} disabled={loading}>cancel</button>
          <button className="upload-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "saving..." : "add movie →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Movie detail overlay ───────────────────────────── */
function MovieDetail({ movie, isAdmin, onClose, onDelete }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function renderStars(rating) {
    if (!rating) return null;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return <span className="media-stars media-stars-lg">{"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(empty)} <span className="media-rating-num">{rating}/5</span></span>;
  }

  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className="movie-detail-window" onClick={e => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose}>×</button>
        <div className="movie-detail-inner">
          <div className="movie-detail-poster">
            {movie.poster
              ? <img src={movie.poster} alt={movie.title} />
              : <div className="movie-poster-placeholder"><span>🎬</span></div>}
          </div>
          <div className="movie-detail-info">
            <div className="movie-detail-meta">
              {movie.year && <span className="movie-year-badge">{movie.year}</span>}
              {movie.genre && <span className="movie-genre-badge">{movie.genre}</span>}
            </div>
            <h2 className="movie-detail-title">{movie.title}</h2>
            {movie.rating && renderStars(movie.rating)}
            {movie.watchedAt && <p className="movie-watched-date">watched {movie.watchedAt}</p>}
            {movie.review && <p className="movie-review">{movie.review}</p>}
            {isAdmin && (
              <button className="media-delete-btn" onClick={() => { onDelete(movie); onClose(); }}>
                delete
              </button>
            )}
          </div>
        </div>
        <div className="lb-tape lb-tape-tl" />
        <div className="lb-tape lb-tape-tr" />
      </div>
    </div>
  );
}

/* ── Movie card ─────────────────────────────────────── */
function MovieCard({ movie, onClick }) {
  function renderStars(rating) {
    if (!rating) return null;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return <span className="media-stars">{"★".repeat(full)}{half ? "½" : ""}</span>;
  }

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-poster">
        {movie.poster
          ? <img src={movie.poster} alt={movie.title} loading="lazy" />
          : <div className="movie-poster-placeholder"><span>🎬</span><p>{movie.title}</p></div>}
        <div className="movie-poster-overlay">
          <span className="movie-hover-label">view →</span>
        </div>
      </div>
      <div className="movie-card-info">
        <p className="movie-card-title">{movie.title}</p>
        <div className="movie-card-meta">
          {movie.year && <span className="movie-card-year">{movie.year}</span>}
          {movie.rating && renderStars(movie.rating)}
        </div>
      </div>
    </div>
  );
}

/* ── Main Movies page ───────────────────────────────── */
export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("media_admin") === "1");
  const [showGate, setShowGate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState("date-desc");
  const [genreFilter, setGenreFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "movies"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setMovies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function handleDelete(movie) {
    if (!window.confirm(`Delete "${movie.title}"?`)) return;
    await deleteDoc(doc(db, "movies", movie.id));
  }

  const genres = ["all", ...Array.from(new Set(movies.map(m => m.genre).filter(Boolean))).sort()];

  const filtered = movies
    .filter(m => genreFilter === "all" || m.genre === genreFilter)
    .sort((a, b) => {
      if (sort === "rating-desc") return (b.rating || 0) - (a.rating || 0);
      if (sort === "rating-asc") return (a.rating || 0) - (b.rating || 0);
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "year-desc") return (b.year || 0) - (a.year || 0);
      // date-desc default
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="media-page-wrapper">
      <div className="media-page">

        {/* header */}
        <div className="media-page-header">
          <div>
            <h1 className="media-page-title">My <em>Movies</em></h1>
            <p className="media-page-sub">{movies.length} film{movies.length !== 1 ? "s" : ""} watched </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 8 }}>
            {isAdmin && (
              <button className="media-add-btn" onClick={() => setShowAdd(true)}>+ add movie</button>
            )}
            {!isAdmin
              ? <button className="cal-admin-btn" onClick={() => setShowGate(true)}>tasha</button>
              : <button className="cal-admin-btn cal-admin-btn-active" onClick={() => { sessionStorage.removeItem("media_admin"); setIsAdmin(false); }}>tasha's here</button>
            }
          </div>
        </div>

        {/* controls */}
        <div className="media-controls">
          <div className="media-filter-tabs">
            {genres.map(g => (
              <button key={g} className={`media-tab ${genreFilter === g ? "active" : ""}`} onClick={() => setGenreFilter(g)}>
                {g === "all" ? "All" : g}
              </button>
            ))}
          </div>

          <div className="media-sort">
            <span className="media-sort-label">Sort:</span>
            <select className="media-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="date-desc">Date (newest)</option>
              <option value="rating-desc">Rating (high to low)</option>
              <option value="rating-asc">Rating (low to high)</option>
              <option value="title-asc">Title (A–Z)</option>
              <option value="year-desc">Year (newest)</option>
            </select>
          </div>
        </div>

        {/* grid */}
        {filtered.length > 0 ? (
          <div className="movies-grid">
            {filtered.map(m => (
              <MovieCard key={m.id} movie={m} onClick={() => setSelected(m)} />
            ))}
          </div>
        ) : (
          <div className="media-empty">
            <span>🎬</span>
            <p>no movies yet{isAdmin ? " — add one!" : ""}</p>
          </div>
        )}

      </div>

      {showGate && !isAdmin && (
        <AdminGate onUnlock={() => { setIsAdmin(true); setShowGate(false); }} onClose={() => setShowGate(false)} />
      )}
      {showAdd && <AddMovieModal onClose={() => setShowAdd(false)} />}
      {selected && (
        <MovieDetail movie={selected} isAdmin={isAdmin} onClose={() => setSelected(null)} onDelete={handleDelete} />
      )}
    </div>
  );
}