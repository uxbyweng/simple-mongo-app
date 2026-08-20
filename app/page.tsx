"use client";

import { useEffect, useState } from "react";

type Entry = {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
};

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadEntries() {
    const res = await fetch("/api/entries");
    const data = await res.json();
    setEntries(data);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });

    setName("");
    setMessage("");
    setLoading(false);
    loadEntries();
  }

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <h1>Simple Mongo App</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Nachricht"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Speichert..." : "Absenden"}
        </button>
      </form>

      <h2 style={{ marginTop: 32 }}>Einträge</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            <strong>{entry.name}:</strong> {entry.message}
          </li>
        ))}
      </ul>
    </main>
  );
}
