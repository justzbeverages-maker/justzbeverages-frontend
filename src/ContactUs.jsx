import { useState } from "react";
import { Header } from "./Components/Header";
import { Footer } from "./Footer";
import axios from 'axios'
import "./ContactUs.css";

export function ContactUs({ openMenu }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sent

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to your own endpoint / email service.
    axios.post("https://justzbeverages.onrender.com/contact-us",form);
    console.log("JUSTZ enquiry submitted:", form);
    setStatus("sent");
  };

  return (
    <>
      <Header openMenu={openMenu} />

      <main className="contact-page">
        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p>Hide nothing, ask anything. We read every message.</p>
        </section>

        <section className="contact-body">
          <div className="contact-info">
            <h2>Reach us directly</h2>
            <p>
              Stockist request, bulk order, or just want to tell us your favourite blend &mdash;
              send it over and our team will get back to you within a day.
            </p>

            <ul className="info-list">
              <li>
                <span className="info-label">Email</span>
                <a href="mailto:hello@justz.com">hello@justz.com</a>
              </li>
              <li>
                <span className="info-label">Phone</span>
                <a href="tel:+10000000000">+1 (000) 000-0000</a>
              </li>
              <li>
                <span className="info-label">Address</span>
                <span>12 Orchard Lane, Sunset Grove</span>
              </li>
            </ul>
          </div>

          <div className="contact-form-wrap">
            {status === "sent" ? (
              <div className="contact-success" role="status">
                <h2>Message sent</h2>
                <p>Thanks for reaching out &mdash; we&rsquo;ll be in touch soon.</p>
                <button type="button" className="btn btn-ghost" onClick={() => setStatus("idle")}>
                  Send another
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <label>
                  <span>Full name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  <span>Phone (optional)</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Contact number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  <span>Your enquiry</span>
                  <textarea
                    name="message"
                    placeholder="Tell us what's on your mind..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </label>

                <button type="submit" className="btn">
                  Submit
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}