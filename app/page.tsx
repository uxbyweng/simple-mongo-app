"use client";

import { useEffect, useRef, useState } from "react";

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
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const FONTS = ["Fuzzy Bubbles", "Single Day", "Permanent Marker"];
    const styleMap = useRef<Map<string, { font: string; size: string }>>(new Map());

    function getEntryStyle(id: string) {
        if (!styleMap.current.has(id)) {
            const font = FONTS[Math.floor(Math.random() * FONTS.length)];
            const size = (0.875 + Math.random() * 0.625).toFixed(3) + "rem";
            styleMap.current.set(id, { font, size });
        }
        return styleMap.current.get(id)!;
    }

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

    async function handleDelete(id: string) {
        await fetch(`/api/entries/${id}`, { method: "DELETE" });
        setEntries((prev) => prev.filter((e) => e._id !== id));
    }

    return (
        <main style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
            <h1>Simple Mongo App</h1>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <textarea placeholder="Nachricht" value={message} onChange={(e) => setMessage(e.target.value)} required />
                <button type="submit" disabled={loading}>
                    {loading ? "Speichert..." : "Absenden"}
                </button>
            </form>

            <h2 style={{ marginTop: 32 }}>Einträge</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {entries.map((entry) => (
                    <li
                        key={entry._id}
                        onMouseEnter={() => setHoveredId(entry._id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                        <span style={{ fontFamily: getEntryStyle(entry._id).font, fontSize: getEntryStyle(entry._id).size }}>
                            {entry.message} <strong style={{ fontFamily: "Arial", color: "#999", fontWeight: "normal", fontSize: 18 }}>({entry.name})</strong>
                        </span>
                        <button
                            onClick={() => handleDelete(entry._id)}
                            title="Eintrag löschen"
                            style={{
                                visibility: hoveredId === entry._id ? "visible" : "hidden",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 18,
                                color: "#999",
                                lineHeight: 1,
                                padding: "0 4px",
                                flexShrink: 0,
                            }}>
                            ⊗
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    );
}
