"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

const CONTACT_EMAIL = "hello@jokemasti.in";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("Please fill all fields");
      return;
    }
    const subject = encodeURIComponent(`JokeMasti Contact: ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    showToast("Opening your email app…");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          placeholder="Your name"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          placeholder="Aapka message likhiye..."
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        Send Message
      </button>
      <p className="text-xs text-foreground-muted">
        Submit karne par aapka email app khulega, {CONTACT_EMAIL} pe message bhejne ke liye.
      </p>
    </form>
  );
}
