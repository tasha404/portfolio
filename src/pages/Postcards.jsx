import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot,
  orderBy, query, serverTimestamp,
} from "firebase/firestore";

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
}

export default function Postcards() {
  const [notes, setNotes] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(collection(db, "postcards"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setNotes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setFetching(false);
    });
    return () => unsub();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) { setError("Please fill in both fields"); return; }
    setError("");
    setLoading(true);

    let polishedMessage = message.trim();
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: `You are a friendly helper for Natasha's portfolio guestbook.
Return ONLY a JSON object like: {"approved": true, "polished": "the message here"}
- Kind/friendly messages: approve and lightly fix spelling only. Keep their voice.
- Spam/harmful: return {"approved": false, "polished": ""}
ONLY return the JSON, nothing else.`,
          messages: [{ role: "user", content: `Name: ${name}\nMessage: ${message}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "";
      let parsed;
      try { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); }
      catch { parsed = { approved: true, polished: message }; }
      if (!parsed.approved) {
        setError("Hmm, that message didn't quite pass. Try something nicer!");
        setLoading(false);
        return;
      }
      polishedMessage = parsed.polished || message.trim();
    } catch { /* save as-is if AI fails */ }

    try {
      await addDoc(collection(db, "postcards"), {
        name: name.trim(),
        message: polishedMessage,
        createdAt: serverTimestamp(),
      });
      setName(""); setMessage("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Something went wrong. Try again :3");
    }
    setLoading(false);
  }

  return (
    <div className="postcards-page">
      <div className="postcards-header">
        <p className="section-label" style={{ justifyContent: "center" }}>Guestbook</p>
        <h1><em>Postcards</em></h1>
        <p>You stopped by — leave a little trace! Say hi, share a thought, drop some encouragement. Every note means a lot</p>
      </div>

      <div className="note-form-wrap">
        <h2>Leave a note</h2>
        <p>PLEASEEEE LEAVE SOMETHING I BEG</p>

        {success && (
          <div style={{ background: "rgba(110,48,42,0.07)", border: "1px solid var(--rose-lt)", borderRadius: 3, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "var(--rose-dk)", fontFamily: "var(--mono)", letterSpacing: "0.05em" }}>
            ✓ postcard delivered! thank you !
          </div>
        )}
        {error && (
          <div style={{ background: "rgba(44,66,96,0.06)", border: "1px solid var(--slate-lt)", borderRadius: 3, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "var(--slate-dk)", fontFamily: "var(--mono)", letterSpacing: "0.05em" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="note-field">
            <label>Your name</label>
            <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
          </div>
          <div className="note-field">
            <label>Your message</label>
            <textarea rows={4} placeholder="it's going to be shared publicly, no cussing :3" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={300} />
          </div>
          <button className="note-submit" type="submit" disabled={loading}>
            {loading ? "sending... " : "Send"}
          </button>
        </form>
      </div>

      <div className="notes-section">
        {!fetching && (
          <h2>{notes.length} postcard{notes.length !== 1 ? "s" : ""} received ✦</h2>
        )}
        {fetching ? (
          <div className="notes-empty" style={{ fontStyle: "normal", fontSize: 14 }}>loading...</div>
        ) : notes.length === 0 ? (
          <div className="notes-empty">be the first to leave a note !</div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div className="note-card" key={note.id}>
                <div className="note-card-name">{note.name}</div>
                <div className="note-card-msg">{note.message}</div>
                <div className="note-card-date">{formatDate(note.createdAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}