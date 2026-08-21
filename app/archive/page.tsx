"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CHALKS = [{ hex: "#f3f0e6" }, { hex: "#f6e7a8" }, { hex: "#bcd9e8" }, { hex: "#f2c9cf" }, { hex: "#c9e3c1" }];

function fmt(ts: string): string {
    const date = new Date(ts);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

type Entry = {
    _id: string;
    name: string;
    message: string;
    chalk: number;
    createdAt: string;
    deletedAt: string | null;
};

const mono = "ui-monospace,Menlo,monospace";

export default function Archive() {
    const [entries, setEntries] = useState<Entry[]>([]);

    useEffect(() => {
        fetch("/api/archive")
            .then((r) => r.json())
            .then(setEntries);
    }, []);

    async function restore(id: string) {
        await fetch(`/api/entries/${id}`, { method: "PATCH" });
        setEntries((prev) => prev.map((e) => (e._id === id ? { ...e, deletedAt: null } : e)));
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "radial-gradient(120% 90% at 22% 12%,#3b4a43 0%,#2c3833 45%,#232d29 100%)",
                padding: "44px 48px 80px",
                boxSizing: "border-box",
                fontFamily: "'Fuzzy Bubbles', cursive",
            }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                    marginBottom: 40,
                }}>
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontFamily: "'Permanent Marker', cursive",
                            fontWeight: 400,
                            fontSize: 42,
                            color: "#f3f0e6",
                            textShadow: "0 0 14px rgba(243,240,230,.18),0 2px 0 rgba(0,0,0,.25)",
                        }}>
                        Archive
                    </h1>
                    <div
                        style={{
                            marginTop: 6,
                            fontFamily: mono,
                            fontSize: 11,
                            letterSpacing: "1.4px",
                            textTransform: "uppercase",
                            color: "rgba(243,240,230,.4)",
                        }}>
                        {entries.length} {entries.length === 1 ? "entry" : "entries"} total
                    </div>
                </div>
                <Link
                    href="/"
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "rgba(243,240,230,.4)",
                        fontFamily: mono,
                        fontSize: 11,
                        letterSpacing: "1.4px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        textDecoration: "none",
                    }}>
                    ← Back to board
                </Link>
            </div>

            {/* Entry list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {entries.map((entry) => {
                    const hex = CHALKS[entry.chalk ?? 0]?.hex ?? CHALKS[0].hex;
                    const erased = !!entry.deletedAt;
                    return (
                        <div
                            key={entry._id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "160px 1fr",
                                gap: "0 24px",
                                padding: "18px 0",
                                borderBottom: "1px solid rgba(243,240,230,.08)",
                                opacity: erased ? 0.45 : 1,
                            }}>
                            {/* Left: meta */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    paddingTop: 3,
                                }}>
                                <span
                                    style={{
                                        fontFamily: "'Permanent Marker', cursive",
                                        fontSize: 18,
                                        color: hex,
                                        textShadow: `0 0 10px ${hex}40`,
                                    }}>
                                    {entry.name}
                                </span>
                                <span
                                    style={{
                                        fontFamily: mono,
                                        fontSize: 14,
                                        letterSpacing: "1px",
                                        color: "rgba(243,240,230,.35)",
                                    }}>
                                    {fmt(entry.createdAt)}
                                </span>
                                {erased && (
                                    <span
                                        style={{
                                            fontFamily: mono,
                                            fontSize: 14,
                                            letterSpacing: "1.2px",
                                            textTransform: "uppercase",
                                            color: "rgba(243,240,230,.25)",
                                        }}>
                                        erased
                                    </span>
                                )}
                            </div>
                            {/* Right: message + optional restore */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                                <p
                                    style={{
                                        margin: 0,
                                        flex: 1,
                                        fontFamily: mono,
                                        fontSize: 18,
                                        lineHeight: 1.6,
                                        color: "rgba(243,240,230,.75)",
                                        overflowWrap: "break-word",
                                    }}>
                                    {entry.message}
                                </p>
                                {erased && (
                                    <button
                                        onClick={() => restore(entry._id)}
                                        style={{
                                            flexShrink: 0,
                                            background: "transparent",
                                            border: "none",
                                            color: "rgba(243, 240, 230, 0.439)",
                                            fontFamily: mono,
                                            fontSize: 14,
                                            letterSpacing: "1.2px",
                                            textTransform: "uppercase",
                                            cursor: "pointer",
                                            padding: "4px 0",
                                            marginTop: 3,
                                        }}
                                        className="chalk-erase">
                                        restore
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
