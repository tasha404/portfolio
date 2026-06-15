import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const services = [
  "Web Development",
  "Mobile App",
  "UI / UX Design",
  "Something else",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

async function handleSubmit(e) {
  e.preventDefault();
  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    setError("Please fill in your name, email, and message.");
    return;
  }
  setError("");
  setLoading(true);

  try {
    await emailjs.send(
      "service_3ku67xb",   // ← your Service ID from Step 2
      "template_ec95b6t",  // ← your Template ID from Step 3
      {
        from_name: form.name,
        from_email: form.email,
        service: form.service || "Not specified",
        budget: form.budget || "Not specified",
        message: form.message,
      },
      "9zwFRJmxFDs3XINKK"  // ← your Public Key from Step 4
    );

    await addDoc(collection(db, "contacts"), {
      ...form,
      createdAt: serverTimestamp(),
    });

    setSuccess(true);
    setForm({ name: "", email: "", service: "", budget: "", message: "" });
  } catch {
    setError("Something went wrong — try again or email me directly!");
  }
  setLoading(false);
}

  return (
    <div className="contact-page">
      {/* left panel */}
      <div className="contact-left">

        <h1 className="contact-headline">
          Let's build<br />
          <em>something</em><br />
          together.
        </h1>
        <p className="contact-sub">
          Got a project in mind? Whether it's a website, mobile app, or
          something you haven't quite figured out yet — I'd love to hear
          about it.
        </p>

        <div className="contact-details">
          <div className="contact-detail-row">
            <span className="contact-detail-label">email</span>
            <a href="mailto:natashanadiafsm@gmail.com" className="contact-detail-val">
              natashanadiafsm@gmail.com
            </a>
          </div>
          <div className="contact-detail-row">
            <span className="contact-detail-label">phone</span>
            <a href="tel:+60143361244" className="contact-detail-val">
              +60 14 336 1244
            </a>
          </div>
          <div className="contact-detail-row">
            <span className="contact-detail-label">based in</span>
            <span className="contact-detail-val">Klang, Malaysia</span>
          </div>
        </div>

        

        {/* decorative lined paper rule */}
        <div className="contact-deco-lines" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="contact-deco-line" />
          ))}
        </div>
      </div>

      {/* right panel — form */}
      <div className="contact-right">
        {success ? (
          <div className="contact-success">
            <span className="contact-success-icon">✦</span>
            <h2>Message sent!</h2>
            <p>Thank you for reaching out. I'll get back to you as soon as I can — usually within a day or two.</p>
            <button className="contact-success-back" onClick={() => setSuccess(false)}>
              Send another →
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
           
            {/* Name + Email row */}
            <div className="cf-row">
              <div className="cf-field">
                <label className="cf-label" htmlFor="cf-name">Name <span className="cf-required">*</span></label>
                <input
                  id="cf-name"
                  className="cf-input"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  maxLength={60}
                  autoComplete="name"
                />
              </div>
              <div className="cf-field">
                <label className="cf-label" htmlFor="cf-email">Email <span className="cf-required">*</span></label>
                <input
                  id="cf-email"
                  className="cf-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  maxLength={100}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Service chips */}
            <div className="cf-field">
              <label className="cf-label">What do you need?</label>
              <div className="cf-chips">
                {services.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`cf-chip${form.service === s ? " active" : ""}`}
                    onClick={() => set("service", form.service === s ? "" : s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="cf-field">
              <label className="cf-label" htmlFor="cf-budget">Budget range <span className="cf-optional">(optional)</span></label>
              <select
                id="cf-budget"
                className="cf-input cf-select"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
              >
                <option value="">Not sure yet</option>
                <option value="under-500">Under RM 500</option>
                <option value="500-1500">RM 500 – 1,500</option>
                <option value="1500-3000">RM 1,500 – 3,000</option>
                <option value="3000+">RM 3,000+</option>
              </select>
            </div>

            {/* Message */}
            <div className="cf-field">
              <label className="cf-label" htmlFor="cf-msg">Tell me about your project <span className="cf-required">*</span></label>
              <textarea
                id="cf-msg"
                className="cf-input cf-textarea"
                rows={5}
                placeholder="What are you building? What do you need help with? The more you share, the better!"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                maxLength={1000}
              />
              <span className="cf-char-count">{form.message.length} / 1000</span>
            </div>

            {error && (
              <div className="cf-error">{error}</div>
            )}

            <button className="cf-submit" type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send inquiry →"}
            </button>

            <p className="cf-footnote">
              I typically reply within 1–2 days. For urgent matters, email me directly.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}