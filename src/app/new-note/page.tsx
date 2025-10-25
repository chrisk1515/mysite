"use client";
import { useState } from "react";

export default function NewNote() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function save() {
    const r = await fetch("/api/notes/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    alert(r.ok ? "Saved!" : "Failed");
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">New Note</h1>
      <input className="w-full border p-2 rounded" placeholder="Title"
             value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="w-full border p-2 rounded" rows={6} placeholder="Body"
                value={body} onChange={e=>setBody(e.target.value)} />
      <button onClick={save} className="px-4 py-2 rounded bg-black text-white">Save</button>
    </main>
  );
}
