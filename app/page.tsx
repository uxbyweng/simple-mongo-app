"use client";

import { useEffect, useState } from "react";

const CHALKS = [
    { label: "Chalk White", hex: "#f3f0e6" },
    { label: "Sunny Yellow", hex: "#f6e7a8" },
    { label: "Sky Blue", hex: "#bcd9e8" },
    { label: "Dusty Rose", hex: "#f2c9cf" },
    { label: "Meadow Green", hex: "#c9e3c1" },
];

const TILTS = [-0.9, 0.7, -0.4, 1.1, -1.2, 0.5, -0.7, 0.9];
const MAX_CHARS = 200;

const NOISE_URL =
    "data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27220%27%20height=%27220%27%3E%3Cfilter%20id=%27n%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%274%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27220%27%20height=%27220%27%20filter=%27url%28%23n%29%27/%3E%3C/svg%3E";

function tilt(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) | 0;
    }
    return TILTS[Math.abs(hash) % TILTS.length];
}

function fmt(ts: string): string {
    const date = new Date(ts);
    const mins = Math.round((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

type Entry = {
    _id: string;
    name: string;
    message: string;
    chalk: number;
    createdAt: string;
};

export default function Home() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [chalk, setChalk] = useState(0);
    const [erasing, setErasing] = useState<string[]>([]);
    const [confirmWipe, setConfirmWipe] = useState(false);

    async function loadEntries() {
        const res = await fetch("/api/entries");
        const data = await res.json();
        setEntries(data);
    }

    useEffect(() => {
        loadEntries();
    }, []);

    async function handleSubmit() {
        const n = name.trim();
        const t = text.trim();
        if (!n || !t) return;
        await fetch("/api/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: n, message: t, chalk }),
        });
        setName("");
        setText("");
        loadEntries();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
    }

    function erase(id: string) {
        setErasing((prev) => [...prev, id]);
        setTimeout(async () => {
            await fetch(`/api/entries/${id}`, { method: "DELETE" });
            setEntries((prev) => prev.filter((e) => e._id !== id));
            setErasing((prev) => prev.filter((x) => x !== id));
        }, 420);
    }

    async function wipeAll() {
        const ids = entries.map((e) => e._id);
        setErasing(ids);
        setConfirmWipe(false);
        setTimeout(async () => {
            await Promise.all(ids.map((id) => fetch(`/api/entries/${id}`, { method: "DELETE" })));
            setEntries([]);
            setErasing([]);
        }, 420);
    }

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "long",
    });
    const countLabel = entries.length === 1 ? "1 message" : `${entries.length} messages`;
    const active = CHALKS[chalk].hex;

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                background: "radial-gradient(120% 90% at 22% 12%,#3b4a43 0%,#2c3833 45%,#232d29 100%)",
                boxShadow: "inset 0 0 90px rgba(0,0,0,.65),inset 0 2px 0 rgba(255,255,255,.06)",
                padding: "44px 48px 40px",
                boxSizing: "border-box",
                fontFamily: "'Fuzzy Bubbles', cursive",
            }}>
            {/* Noise texture overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    pointerEvents: "none",
                    opacity: 0.16,
                    mixBlendMode: "soft-light",
                    backgroundImage: `url("${NOISE_URL}")`,
                }}
            />
            {/* Light spots overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    pointerEvents: "none",
                    opacity: 0.5,
                    background:
                        "radial-gradient(38% 26% at 78% 22%,rgba(255,255,255,.07),transparent 70%),radial-gradient(30% 22% at 12% 76%,rgba(255,255,255,.05),transparent 70%),radial-gradient(50% 30% at 50% 108%,rgba(255,255,255,.06),transparent 70%)",
                }}
            />

            {/* Header */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 18,
                }}>
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontFamily: "'Permanent Marker', cursive",
                            fontWeight: 400,
                            fontSize: 58,
                            lineHeight: 1,
                            color: "#f3f0e6",
                            textShadow: "0 0 14px rgba(243,240,230,.18),0 2px 0 rgba(0,0,0,.25)",
                            letterSpacing: ".5px",
                        }}>
                        Bulletin Board
                    </h1>
                    <svg width="330" height="14" viewBox="0 0 330 14" style={{ display: "block", marginTop: 6, opacity: 0.55 }}>
                        <path d="M2 7 C 70 2, 150 11, 240 5 S 310 9, 328 6" fill="none" stroke="#f3f0e6" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>
                <div
                    style={{
                        textAlign: "right",
                        fontFamily: "ui-monospace,Menlo,monospace",
                        fontSize: 12,
                        letterSpacing: "1.4px",
                        textTransform: "uppercase",
                        color: "rgba(243,240,230,.5)",
                        lineHeight: 1.9,
                    }}>
                    <div>{today}</div>
                    <div>{countLabel}</div>
                </div>
            </div>

            {/* Form: Anschreiben */}
            <div
                style={{
                    position: "relative",
                    margin: "34px 0 0",
                    padding: "26px 28px 22px",
                    border: "2px dashed rgba(243,240,230,.22)",
                    borderRadius: 14,
                }}>
                <div
                    style={{
                        position: "absolute",
                        top: -13,
                        left: 22,
                        padding: "0 10px",
                        background: "#2c3833",
                        fontFamily: "'Permanent Marker', cursive",
                        fontSize: 16,
                        letterSpacing: 1,
                        color: "rgba(243,240,230,.7)",
                    }}>
                    Post a note
                </div>
                <div
                    className="form-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0,1fr) 190px",
                        gap: 26,
                        alignItems: "start",
                    }}>
                    {/* Left: name + textarea + counter */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            maxLength={28}
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                background: "transparent",
                                border: "none",
                                borderBottom: "2px dotted rgba(243,240,230,.3)",
                                padding: "2px 2px 8px",
                                fontFamily: "'Permanent Marker', cursive",
                                fontSize: 24,
                                color: "#f3f0e6",
                                caretColor: "#f6e7a8",
                            }}
                        />
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                            onKeyDown={handleKeyDown}
                            placeholder="What's on your mind?"
                            rows={3}
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                resize: "vertical",
                                background: "transparent",
                                border: "none",
                                borderBottom: "2px dotted rgba(243,240,230,.3)",
                                padding: "2px 2px 10px",
                                fontFamily: "'Fuzzy Bubbles', cursive",
                                fontSize: 20,
                                lineHeight: 1.6,
                                color: "#f3f0e6",
                                caretColor: "#f6e7a8",
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                fontFamily: "ui-monospace,Menlo,monospace",
                                fontSize: 11,
                                letterSpacing: "1.2px",
                                color: "rgba(243,240,230,.42)",
                            }}>
                            <span>
                                {text.length} / {MAX_CHARS}
                            </span>
                            <span>⌘ + ⏎</span>
                        </div>
                    </div>

                    {/* Right: chalk picker + submit */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <div
                                style={{
                                    fontFamily: "ui-monospace,Menlo,monospace",
                                    fontSize: 10,
                                    letterSpacing: "1.6px",
                                    textTransform: "uppercase",
                                    color: "rgba(243,240,230,.42)",
                                    marginBottom: 10,
                                }}>
                                Chalk
                            </div>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {CHALKS.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setChalk(i)}
                                        title={c.label}
                                        style={{
                                            width: i === chalk ? 26 : 22,
                                            height: i === chalk ? 26 : 22,
                                            borderRadius: "999px",
                                            cursor: "pointer",
                                            background: c.hex,
                                            border: i === chalk ? "2px solid rgba(243,240,230,.9)" : "2px solid rgba(0,0,0,.2)",
                                            boxShadow: i === chalk ? `0 0 14px ${c.hex}80` : "none",
                                            padding: 0,
                                            transition: "all .18s ease",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            style={{
                                border: `2px solid ${active}8c`,
                                background: `${active}14`,
                                color: active,
                                fontFamily: "'Permanent Marker', cursive",
                                fontSize: 20,
                                letterSpacing: ".6px",
                                padding: "13px 16px",
                                borderRadius: 999,
                                cursor: "pointer",
                                textShadow: `0 0 12px ${active}40`,
                                transition: "background .2s ease, transform .15s ease",
                            }}>
                            Post it
                        </button>
                    </div>
                </div>
            </div>

            {/* Angeschrieben header + wipe controls */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 16,
                    margin: "38px 0 20px",
                }}>
                <h2
                    style={{
                        margin: 0,
                        fontFamily: "'Permanent Marker', cursive",
                        fontWeight: 400,
                        fontSize: 26,
                        color: "rgba(243,240,230,.82)",
                    }}>
                    On the board
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {confirmWipe && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                fontFamily: "ui-monospace,Menlo,monospace",
                                fontSize: 11,
                                letterSpacing: "1.2px",
                                color: "rgba(243,240,230,.55)",
                            }}>
                            <span>Erase everything?</span>
                            <button
                                onClick={wipeAll}
                                style={{
                                    background: "transparent",
                                    border: "1px solid rgba(246,231,168,.6)",
                                    color: "#f6e7a8",
                                    borderRadius: 999,
                                    padding: "5px 13px",
                                    fontFamily: "ui-monospace,Menlo,monospace",
                                    fontSize: 11,
                                    letterSpacing: "1.2px",
                                    cursor: "pointer",
                                }}>
                                Yes
                            </button>
                            <button
                                onClick={() => setConfirmWipe(false)}
                                style={{
                                    background: "transparent",
                                    border: "1px solid rgba(243,240,230,.25)",
                                    color: "rgba(243,240,230,.6)",
                                    borderRadius: 999,
                                    padding: "5px 13px",
                                    fontFamily: "ui-monospace,Menlo,monospace",
                                    fontSize: 11,
                                    letterSpacing: "1.2px",
                                    cursor: "pointer",
                                }}>
                                No
                            </button>
                        </div>
                    )}
                    {entries.length > 0 && !confirmWipe && (
                        <button
                            className="chalk-wipe"
                            onClick={() => setConfirmWipe(true)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "rgba(243,240,230,.4)",
                                fontFamily: "ui-monospace,Menlo,monospace",
                                fontSize: 11,
                                letterSpacing: "1.4px",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                padding: "5px 0",
                            }}>
                            Wipe board
                        </button>
                    )}
                </div>
            </div>

            {/* Empty state */}
            {entries.length === 0 && (
                <div
                    style={{
                        position: "relative",
                        padding: "52px 0 60px",
                        textAlign: "center",
                        fontFamily: "'Fuzzy Bubbles', cursive",
                        fontSize: 22,
                        color: "rgba(243,240,230,.35)",
                    }}>
                    The board is squeaky clean. Be the first to post a note.
                </div>
            )}

            {/* Entries grid */}
            <div
                style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(272px,1fr))",
                    gap: "30px 28px",
                    alignItems: "start",
                }}>
                {entries.map((entry) => {
                    const hex = CHALKS[entry.chalk ?? 0]?.hex ?? CHALKS[0].hex;
                    const gone = erasing.includes(entry._id);
                    return (
                        <div
                            key={entry._id}
                            style={{
                                color: hex,
                                transform: `rotate(${tilt(entry._id)}deg)`,
                                padding: "20px 22px 18px",
                                borderRadius: 12,
                                border: `1px solid ${hex}26`,
                                background: `linear-gradient(180deg,${hex}0b, transparent)`,
                                textShadow: `0 0 12px ${hex}3d, 0 1px 0 rgba(0,0,0,.28)`,
                                transition: "transform .25s ease, border-color .25s ease",
                                animation: gone ? "dustOut .4s ease forwards" : "chalkIn .5s ease both",
                                overflowWrap: "break-word",
                                minWidth: 0,
                            }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between",
                                    gap: 12,
                                }}>
                                <span
                                    style={{
                                        fontFamily: "'Permanent Marker', cursive",
                                        fontSize: 21,
                                        letterSpacing: ".4px",
                                    }}>
                                    {entry.name}
                                </span>
                                <button
                                    className="chalk-erase"
                                    onClick={() => erase(entry._id)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        padding: "2px 0",
                                        fontFamily: "ui-monospace,Menlo,monospace",
                                        fontSize: 10,
                                        letterSpacing: "1.3px",
                                        textTransform: "uppercase",
                                        color: "currentColor",
                                        opacity: 0.32,
                                        cursor: "pointer",
                                    }}>
                                    erase
                                </button>
                            </div>
                            <p
                                style={{
                                    margin: "12px 0 0",
                                    fontSize: 19,
                                    lineHeight: 1.58,
                                    opacity: 0.94,
                                }}>
                                {entry.message}
                            </p>
                            <div
                                style={{
                                    marginTop: 14,
                                    fontFamily: "ui-monospace,Menlo,monospace",
                                    fontSize: 10,
                                    letterSpacing: "1.3px",
                                    opacity: 0.42,
                                }}>
                                {fmt(entry.createdAt)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
